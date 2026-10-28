import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { Zap, Flame, Clock, Sparkles, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";

export default function LogActivityModal({
  isOpen,
  onClose,
  onActivityLogged,
  presetAppliance = null,
}) {
  const { showToast } = useToast();
  const { updateLocalUser } = useAuth();

  const [appliancesCatalog, setAppliancesCatalog] = useState([]);
  const [selectedApplianceId, setSelectedApplianceId] = useState("");
  const [applianceName, setApplianceName] = useState("");
  const [category, setCategory] = useState("Cooling");
  const [fuelType, setFuelType] = useState("electric");
  const [powerWatts, setPowerWatts] = useState(100);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [quantity, setQuantity] = useState(1);
  const [usageMode, setUsageMode] = useState("Medium");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // Live calculation preview
  const [preview, setPreview] = useState({
    energy_kwh: 0.06,
    co2_kg: 0.049,
    calculation_method: "Grid Electricity CEA Factor",
  });

  // Load catalog
  useEffect(() => {
    async function loadCatalog() {
      try {
        const data = await api.getApplianceCatalog();
        const all = [...(data.presets || []), ...(data.custom || [])];
        setAppliancesCatalog(all);

        if (all.length > 0 && !presetAppliance) {
          handleSelectAppliance(all[0]);
        }
      } catch (err) {
        console.error("Failed to load catalog:", err);
      }
    }
    if (isOpen) {
      loadCatalog();
    }
  }, [isOpen]);

  // Set preset if passed
  useEffect(() => {
    if (presetAppliance) {
      handleSelectAppliance(presetAppliance);
    }
  }, [presetAppliance]);

  const handleSelectAppliance = (app) => {
    setSelectedApplianceId(app.id);
    setApplianceName(app.name);
    setCategory(app.category);
    setFuelType(app.fuel_type);
    setPowerWatts(app.default_power_watts || 100);
  };

  // Instant calculation preview computation on every input modification
  useEffect(() => {
    const hours = (parseFloat(durationMinutes) || 0) / 60;
    const qty = parseInt(quantity) || 1;
    let modeMult = 1.0;
    if (usageMode === "Eco") modeMult = 0.75;
    if (usageMode === "Low") modeMult = 0.70;
    if (usageMode === "High") modeMult = 1.30;

    let kwh = 0;
    let co2 = 0;
    let method = "Grid Electricity (CEA 0.82 kg/kWh)";

    if (fuelType === "gas") {
      const lpgKg = qty * hours * 0.15 * modeMult;
      co2 = lpgKg * 2.983;
      kwh = lpgKg * 13.8;
      method = "LPG Stoichiometry (2.983 kg CO₂/kg)";
    } else {
      const watts = parseFloat(powerWatts) || 0;
      kwh = (watts * hours * qty * modeMult) / 1000;
      co2 = kwh * 0.82;
      method = "Grid Electricity (CEA 0.82 kg/kWh)";
    }

    setPreview({
      energy_kwh: Number(kwh.toFixed(3)),
      co2_kg: Number(co2.toFixed(3)),
      calculation_method: method,
    });
  }, [powerWatts, durationMinutes, quantity, usageMode, fuelType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!applianceName.trim() || durationMinutes <= 0) {
      showToast("Please enter a valid appliance name and duration.", "error");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        appliance_name: applianceName.trim(),
        category,
        fuel_type: fuelType,
        power_watts: fuelType === "gas" ? 0 : parseFloat(powerWatts),
        duration_minutes: parseInt(durationMinutes),
        quantity: parseInt(quantity) || 1,
        usage_mode: usageMode,
        notes: notes.trim() || null,
        activity_date: new Date().toISOString().split("T")[0],
      };

      const result = await api.logActivity(payload);

      // Micro celebration
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 },
        colors: ["#16a34a", "#84cc16", "#059669"],
      });

      showToast(
        `Activity logged! +10 EcoCredits earned. Calculated ${result.calculated_co2_kg} kg CO₂.`,
        "success"
      );

      if (result.user_eco_credits) {
        updateLocalUser({ eco_credits: result.user_eco_credits });
      }

      if (onActivityLogged) onActivityLogged(result);
      onClose();
    } catch (err) {
      showToast(err.message || "Failed to log activity.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Household Activity">
      <form onSubmit={handleSubmit} className="space-y-4 text-slate-900">
        {/* Preset Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Choose from Appliance Catalog Preset
          </label>
          <select
            value={selectedApplianceId}
            onChange={(e) => {
              const found = appliancesCatalog.find((a) => a.id === e.target.value);
              if (found) handleSelectAppliance(found);
            }}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none bg-slate-50 text-slate-900"
          >
            {appliancesCatalog.map((app) => (
              <option key={app.id} value={app.id}>
                {app.name} ({app.category}) — {app.fuel_type === "gas" ? "LPG Gas" : `${app.default_power_watts}W`}
              </option>
            ))}
          </select>
        </div>

        {/* Appliance Name and Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Appliance Name
            </label>
            <input
              type="text"
              value={applianceName}
              onChange={(e) => setApplianceName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none bg-slate-50 text-slate-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none bg-slate-50 text-slate-900"
            >
              <option value="Cooling">Cooling</option>
              <option value="Heating">Heating</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Lighting">Lighting</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Laundry">Laundry</option>
              <option value="Electronics">Electronics</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Fuel Type & Power */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Energy Source
            </label>
            <div className="flex rounded-xl p-1 bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => setFuelType("electric")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
                  fuelType === "electric"
                    ? "bg-emerald-600 text-white font-black shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-yellow-300" />
                Electric
              </button>
              <button
                type="button"
                onClick={() => setFuelType("gas")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
                  fuelType === "gas"
                    ? "bg-orange-600 text-white font-black shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-orange-200" />
                LPG Gas
              </button>
            </div>
          </div>

          {fuelType === "electric" ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Power Rating (Watts)
              </label>
              <input
                type="number"
                min="1"
                max="10000"
                value={powerWatts}
                onChange={(e) => setPowerWatts(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none bg-slate-50 text-slate-900"
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Burners Used
              </label>
              <input
                type="number"
                min="1"
                max="6"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none bg-slate-50 text-slate-900"
              />
            </div>
          )}
        </div>

        {/* Duration and Usage Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                Duration (Minutes)
              </label>
              <span className="text-[11px] font-black text-emerald-700">
                {(durationMinutes / 60).toFixed(1)} hrs
              </span>
            </div>
            <input
              type="number"
              min="1"
              max="1440"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none bg-slate-50 text-slate-900"
              required
            />
            {/* Quick minute buttons */}
            <div className="flex gap-1.5 mt-1.5">
              {[15, 30, 60, 120, 240].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDurationMinutes(mins)}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition ${
                    durationMinutes === mins
                      ? "bg-emerald-600 text-white font-black"
                      : "bg-slate-100 border border-slate-200 text-slate-700 hover:border-emerald-400"
                  }`}
                >
                  {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Operating Mode
            </label>
            <select
              value={usageMode}
              onChange={(e) => setUsageMode(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none bg-slate-50 text-slate-900"
            >
              <option value="Eco">Eco / Low Power (0.75x)</option>
              <option value="Low">Low (0.70x)</option>
              <option value="Medium">Medium (1.00x - Standard)</option>
              <option value="High">High / Turbo (1.30x)</option>
            </select>
          </div>
        </div>

        {/* Optional Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Optional Notes
          </label>
          <input
            type="text"
            placeholder="e.g. Master bedroom AC at 24°C"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none bg-slate-50 text-slate-900 placeholder-slate-400"
          />
        </div>

        {/* INSTANT LIVE CALCULATION PREVIEW BOX */}
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold uppercase text-emerald-800 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              Live Carbon & Energy Preview
            </span>
            <span className="text-[10px] text-emerald-800 font-bold bg-white px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-xs">
              {preview.calculation_method}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 rounded-xl bg-white border border-emerald-100 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Estimated Energy
              </span>
              <span className="text-2xl font-black text-slate-900">
                {preview.energy_kwh}
              </span>
              <span className="text-xs font-bold text-emerald-700 ml-1">kWh</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-emerald-100 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Estimated Emissions
              </span>
              <span className="text-2xl font-black text-emerald-700">
                {preview.co2_kg}
              </span>
              <span className="text-xs font-bold text-emerald-800 ml-1">kg CO₂</span>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 active:scale-95 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-black shadow-sm transition flex items-center gap-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Recording Activity...
              </span>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>Save Activity (+10 Credits)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
