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
    setSelectedApplianceId(app.id || "");
    setApplianceName(app.name);
    setCategory(app.category);
    setFuelType(app.fuel_type || "electric");
    setPowerWatts(app.default_power_watts ?? app.power_watts ?? 100);
  };

  // Trigger live calculation preview whenever inputs change
  useEffect(() => {
    let active = true;
    async function updatePreview() {
      try {
        const res = await api.estimateEmissions({
          fuel_type: fuelType,
          power_watts: parseFloat(powerWatts) || 0,
          quantity: parseInt(quantity) || 1,
          duration_minutes: parseFloat(durationMinutes) || 0,
          usage_mode: usageMode,
        });
        if (active) {
          setPreview(res);
        }
      } catch (err) {
        console.error("Estimate error:", err);
      }
    }
    updatePreview();
    return () => {
      active = false;
    };
  }, [fuelType, powerWatts, quantity, durationMinutes, usageMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!applianceName.trim()) {
      showToast("Appliance name is required.", "error");
      return;
    }

    try {
      setLoading(true);
      const res = await api.logActivity({
        appliance_id: selectedApplianceId || null,
        appliance_name: applianceName,
        category,
        fuel_type: fuelType,
        quantity: parseInt(quantity) || 1,
        power_watts: parseFloat(powerWatts) || 0,
        duration_minutes: parseFloat(durationMinutes) || 1,
        usage_mode: usageMode,
        notes: notes.trim() || null,
      });

      // Confetti celebratory burst for earning EcoCredits!
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#22C55E", "#166534", "#BEF264"],
      });

      showToast(`+10 EcoCredits earned! Logged ${applianceName}.`, "award");

      if (res.new_balance) {
        updateLocalUser({ eco_credits: res.new_balance });
      }

      if (onActivityLogged) {
        onActivityLogged(res);
      }
      onClose();
    } catch (err) {
      showToast(err.message || "Failed to log activity.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Household Activity">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Preset appliance picker */}
        <div>
          <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
            Select Preset or Enter Appliance
          </label>
          <select
            value={selectedApplianceId}
            onChange={(e) => {
              const found = appliancesCatalog.find((a) => a.id === e.target.value);
              if (found) handleSelectAppliance(found);
            }}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
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
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Appliance Name
            </label>
            <input
              type="text"
              value={applianceName}
              onChange={(e) => setApplianceName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
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
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Energy Source
            </label>
            <div className="flex rounded-xl p-1 bg-gray-100 border border-gray-200">
              <button
                type="button"
                onClick={() => setFuelType("electric")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
                  fuelType === "electric"
                    ? "bg-white text-forest-900 shadow-sm"
                    : "text-charcoal-500"
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Electric
              </button>
              <button
                type="button"
                onClick={() => setFuelType("gas")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
                  fuelType === "gas"
                    ? "bg-white text-forest-900 shadow-sm"
                    : "text-charcoal-500"
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                LPG Gas
              </button>
            </div>
          </div>

          {fuelType === "electric" ? (
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Power Rating (Watts)
              </label>
              <input
                type="number"
                min="1"
                max="10000"
                value={powerWatts}
                onChange={(e) => setPowerWatts(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Burners Used
              </label>
              <input
                type="number"
                min="1"
                max="6"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Duration and Usage Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-charcoal-700">
                Duration (Minutes)
              </label>
              <span className="text-[11px] font-bold text-forest-800">
                {(durationMinutes / 60).toFixed(1)} hrs
              </span>
            </div>
            <input
              type="number"
              min="1"
              max="1440"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
            {/* Quick minute buttons */}
            <div className="flex gap-1.5 mt-1.5">
              {[15, 30, 60, 120, 240].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDurationMinutes(mins)}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition ${
                    durationMinutes === mins
                      ? "bg-forest-800 text-white"
                      : "bg-gray-100 text-charcoal-600 hover:bg-gray-200"
                  }`}
                >
                  {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Operating Mode
            </label>
            <select
              value={usageMode}
              onChange={(e) => setUsageMode(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
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
          <label className="block text-xs font-semibold text-charcoal-700 mb-1">
            Optional Notes
          </label>
          <input
            type="text"
            placeholder="e.g. Master bedroom AC at 24°C"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* INSTANT LIVE CALCULATION PREVIEW BOX */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-forest-50 via-emerald-50/70 to-forest-50 border border-emerald-200 shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold uppercase text-forest-900 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              Live Carbon & Energy Preview
            </span>
            <span className="text-[10px] text-forest-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {preview.calculation_method}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 rounded-xl bg-white/90 backdrop-blur-xs border border-emerald-100 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-charcoal-400 block">
                Estimated Energy
              </span>
              <span className="text-2xl font-black text-forest-900">
                {preview.energy_kwh}
              </span>
              <span className="text-xs font-semibold text-charcoal-500 ml-1">kWh</span>
            </div>

            <div className="p-3 rounded-xl bg-white/90 backdrop-blur-xs border border-emerald-100 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-charcoal-400 block">
                Estimated Emissions
              </span>
              <span className="text-2xl font-black text-emerald-600">
                {preview.co2_kg}
              </span>
              <span className="text-xs font-semibold text-charcoal-500 ml-1">kg CO₂</span>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-charcoal-600 hover:bg-gray-100 active:scale-95 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 active:scale-95 text-white text-xs font-bold shadow-eco hover:shadow-eco-lg transition flex items-center gap-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Recording Activity...
              </span>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-limeAccent" />
                <span>Save Activity (+10 Credits)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
