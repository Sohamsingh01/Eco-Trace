import React, { useState, useEffect } from "react";
import {
  Leaf,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Home,
  Users,
  Zap,
  Flame,
  Award,
  Sparkles,
  Info,
  Sliders,
  Check
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import CardTilt3D from "../components/common/CardTilt3D";
import confetti from "canvas-confetti";

export default function OnboardingPage({ onComplete }) {
  const { user, refreshUser, updateLocalUser } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: User & Household Members
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [members, setMembers] = useState(3);

  // Step 2: Household Parameters
  const [homeType, setHomeType] = useState("2BHK");
  const [areaSqft, setAreaSqft] = useState(1050);
  const [cityState, setCityState] = useState("Bangalore, Karnataka");
  const [avgHours, setAvgHours] = useState(14);

  // Step 3: Appliance Inventory Catalog
  const [catalog, setCatalog] = useState([]);
  const [selectedAppliances, setSelectedAppliances] = useState({});

  // Step 4: Budget Estimation
  const [benchmarkResult, setBenchmarkResult] = useState(null);
  const [userTargetKg, setUserTargetKg] = useState(12.5);

  // Fetch preset catalog
  useEffect(() => {
    async function loadCatalog() {
      try {
        const data = await api.getApplianceCatalog();
        const all = data.presets || [];
        setCatalog(all);

        // Pre-select typical essentials (Fans, LED, Refrigerator, AC)
        const initialMap = {};
        all.forEach((app) => {
          if (
            app.name.includes("Ceiling Fan") ||
            app.name.includes("LED") ||
            app.name.includes("Refrigerator") ||
            app.name.includes("Air Conditioner")
          ) {
            initialMap[app.id] = {
              appliance_id: app.id,
              name: app.name,
              category: app.category,
              fuel_type: app.fuel_type,
              power_watts: app.default_power_watts,
              quantity: app.name.includes("Ceiling Fan") ? 3 : app.name.includes("LED") ? 6 : 1,
            };
          }
        });
        setSelectedAppliances(initialMap);
      } catch (err) {
        console.error("Failed to load catalog:", err);
      }
    }
    loadCatalog();
  }, []);

  const toggleAppliance = (app) => {
    setSelectedAppliances((prev) => {
      const copy = { ...prev };
      if (copy[app.id]) {
        delete copy[app.id];
      } else {
        copy[app.id] = {
          appliance_id: app.id,
          name: app.name,
          category: app.category,
          fuel_type: app.fuel_type,
          power_watts: app.default_power_watts,
          quantity: 1,
        };
      }
      return copy;
    });
  };

  const updateQuantity = (appId, qty) => {
    setSelectedAppliances((prev) => {
      if (!prev[appId]) return prev;
      return {
        ...prev,
        [appId]: {
          ...prev[appId],
          quantity: Math.max(1, qty),
        },
      };
    });
  };

  const updatePower = (appId, watts) => {
    setSelectedAppliances((prev) => {
      if (!prev[appId]) return prev;
      return {
        ...prev,
        [appId]: {
          ...prev[appId],
          power_watts: Math.max(0, watts),
        },
      };
    });
  };

  // Move to step 4 triggers recommendation computation
  const goToStep4 = () => {
    const list = Object.values(selectedAppliances);
    let invCo2 = 0;
    list.forEach((item) => {
      if (item.fuel_type === "gas") {
        invCo2 += 0.8 * item.quantity;
      } else {
        invCo2 += (item.power_watts * item.quantity * 2.5 / 1000) * 0.82 * 0.4;
      }
    });

    const modeled = Number((members * 2.2 + (areaSqft / 1000) * 2.0 + invCo2 * 0.5).toFixed(1));
    const target = Math.max(5.0, Math.min(30.0, modeled));
    setUserTargetKg(target);
    setStep(4);
  };

  const handleSubmitAll = async () => {
    try {
      setLoading(true);
      const payload = {
        full_name: fullName.trim() || user?.full_name,
        username: username.trim().toLowerCase() || user?.username,
        household_members: parseInt(members),
        home_type: homeType,
        area_sqft: parseFloat(areaSqft),
        city_state: cityState,
        avg_daily_hours_at_home: parseFloat(avgHours),
        selected_appliances: Object.values(selectedAppliances),
        custom_daily_co2_target_kg: parseFloat(userTargetKg),
      };

      const res = await api.completeOnboarding(payload);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#22C55E", "#166534", "#BEF264", "#F59E0B"],
      });

      showToast("+50 EcoCredits awarded for completing household profile!", "award");
      await refreshUser();
      if (onComplete) onComplete(res);
    } catch (err) {
      showToast(err.message || "Failed to complete onboarding.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFCF9] text-charcoal-900 py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center relative overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-lime-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Branding */}
      <div className="flex items-center gap-2.5 mb-6 relative z-10 group">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-lime-400 flex items-center justify-center text-charcoal-950 shadow-md group-hover:scale-105 transition-all">
          <Leaf className="w-5 h-5 fill-current" />
        </div>
        <span className="font-black text-2xl text-slate-900 tracking-tight flex items-center gap-1.5">
          EcoTrace
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </span>
      </div>

      <div className="max-w-2xl w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-8 relative z-10 text-slate-900">
        {/* Progress Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className={step >= 1 ? "text-emerald-700 font-black" : ""}>1. Profile</span>
            <span className={step >= 2 ? "text-emerald-700 font-black" : ""}>2. Home</span>
            <span className={step >= 3 ? "text-emerald-700 font-black" : ""}>3. Appliances</span>
            <span className={step >= 4 ? "text-emerald-700 font-black" : ""}>4. Carbon Target</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-300 rounded-full shadow-xs"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* STEP 1: USER DETAILS */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Welcome to EcoTrace! Let's get acquainted.
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Tell us a little about yourself and the people who share your home.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Number of Household Members
                  </label>
                  <span className="text-xs font-black text-emerald-700">
                    {members} {members === 1 ? "Person" : "People"}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={members}
                  onChange={(e) => setMembers(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 block mt-1">
                  Used to fairly normalize your EcoScore and benchmark targets.
                </span>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-black transition flex items-center gap-2 shadow-md shadow-emerald-600/25"
              >
                <span>Continue to Home Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: HOUSEHOLD DETAILS */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Household Architecture & Occupancy
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Your home size and location dictate realistic thermal and baseline power requirements.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Dwelling Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {["1BHK", "2BHK", "3BHK", "4BHK", "Villa", "Studio"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setHomeType(type)}
                      className={`p-3 rounded-xl text-xs font-bold border transition text-center ${
                        homeType === type
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-md font-black"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-500/50 hover:bg-white"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Approx. Floor Area (Sq. Ft.)
                  </label>
                  <input
                    type="number"
                    min="200"
                    max="10000"
                    step="50"
                    value={areaSqft}
                    onChange={(e) => setAreaSqft(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    City / State
                  </label>
                  <input
                    type="text"
                    value={cityState}
                    onChange={(e) => setCityState(e.target.value)}
                    placeholder="e.g. Bangalore, Karnataka"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Average Daily Hours Spent at Home
                  </label>
                  <span className="text-xs font-black text-emerald-700">
                    {avgHours} Hours / Day
                  </span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="24"
                  value={avgHours}
                  onChange={(e) => setAvgHours(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-black transition flex items-center gap-2 shadow-md shadow-emerald-600/25"
              >
                <span>Select Appliances</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: APPLIANCE SELECTION */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Select Your Household Appliances
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Choose the appliances currently operating in your household inventory.
              </p>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2.5 pr-2">
              {catalog.map((app) => {
                const isSelected = !!selectedAppliances[app.id];
                const item = selectedAppliances[app.id];

                return (
                  <div
                    key={app.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isSelected
                        ? "bg-emerald-50 border-emerald-400 shadow-xs"
                        : "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        onClick={() => toggleAppliance(app)}
                        className="flex items-center gap-3 cursor-pointer flex-1"
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                            isSelected
                              ? "bg-emerald-600 border-emerald-600 text-white font-bold"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">
                            {app.name}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {app.category} • {app.fuel_type === "gas" ? "LPG Fuel" : `${app.default_power_watts} Watts`}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-600 font-semibold">Qty:</span>
                            <input
                              type="number"
                              min="1"
                              max="20"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(app.id, parseInt(e.target.value) || 1)}
                              className="w-12 px-2 py-1 rounded-lg bg-white border border-slate-300 text-xs text-center font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                            />
                          </div>

                          {item.fuel_type !== "gas" && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-slate-600 font-semibold">Watts:</span>
                              <input
                                type="number"
                                min="1"
                                max="10000"
                                value={item.power_watts}
                                onChange={(e) => updatePower(app.id, parseFloat(e.target.value) || 0)}
                                className="w-16 px-2 py-1 rounded-lg bg-white border border-slate-300 text-xs text-center font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={goToStep4}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-black transition flex items-center gap-2 shadow-md shadow-emerald-600/25"
              >
                <span>Calculate Target Budget</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PERSONALIZED CARBON BUDGET */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-extrabold uppercase text-emerald-700 tracking-wider">
                Step 4 of 4
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Your Personalized Carbon Target
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Estimated benchmark modeled from household size, inventory, and occupancy hours.
              </p>
            </div>

            {/* Benchmark Showcase Card */}
            <div className="p-6 rounded-3xl bg-emerald-50/70 border border-emerald-200 text-center shadow-xs">
              <span className="text-xs uppercase font-extrabold text-emerald-800 tracking-wider">
                Recommended Daily Limit
              </span>
              <div className="my-2">
                <span className="text-5xl font-black text-slate-900 tracking-tight">
                  {userTargetKg}
                </span>
                <span className="text-sm font-bold text-emerald-700 ml-1.5">
                  kg CO₂ / day
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-white border border-emerald-200 px-3.5 py-1 rounded-full inline-block shadow-xs">
                ≈ {(userTargetKg / members).toFixed(2)} kg CO₂ per person
              </span>

              {/* Slider for adjustment */}
              <div className="mt-6 pt-4 border-t border-emerald-200 text-left">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                  <span>Adjust Your Daily Target</span>
                  <span className="text-emerald-700 font-black">{userTargetKg} kg</span>
                </div>
                <input
                  type="range"
                  min="4.0"
                  max="30.0"
                  step="0.5"
                  value={userTargetKg}
                  onChange={(e) => setUserTargetKg(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                  *Disclaimer: This target is an estimated conservation benchmark, not an immutable scientific universal ceiling. Remaining below your budget awards +25 EcoCredits daily.
                </p>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleSubmitAll}
                disabled={loading}
                className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-black transition flex items-center gap-2 shadow-md shadow-emerald-600/25"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>{loading ? "Saving Profile..." : "Complete Setup (+50 Credits)"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
