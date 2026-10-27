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
            app.name.includes("Fan") ||
            app.name.includes("LED") ||
            app.name.includes("Refrigerator") ||
            app.name.includes("Air Conditioner")
          ) {
            initialMap[app.id] = {
              appliance_id: app.id,
              name: app.name,
              category: app.category,
              power_watts: app.default_power_watts,
              fuel_type: app.fuel_type,
              quantity: app.name.includes("Fan") || app.name.includes("LED") ? 3 : 1,
            };
          }
        });
        setSelectedAppliances(initialMap);
      } catch (err) {
        console.error("Error loading appliances:", err);
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
          power_watts: app.default_power_watts,
          fuel_type: app.fuel_type,
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
    // Baseline model:
    // members * 2.2 + (areaSqft/1000)*2.5 + inventory_factor * occupancy
    let invCo2 = 0;
    list.forEach((item) => {
      if (item.fuel_type === "gas") {
        invCo2 += 0.8 * item.quantity;
      } else {
        invCo2 += (item.power_watts * item.quantity * 2.5 / 1000) * 0.82 * 0.4;
      }
    });

    const occFactor = 0.75 + 0.25 * (avgHours / 14);
    const recommended = Math.round(((members * 2.2) + ((areaSqft / 1000) * 2.5) + invCo2) * occFactor * 10) / 10;
    const clampedTarget = Math.min(Math.max(recommended, 4.0), 35.0);

    setBenchmarkResult({
      recommended_daily_target_kg: clampedTarget,
      per_capita: Math.round((clampedTarget / members) * 10) / 10,
      breakdown: {
        members_part: (members * 2.2).toFixed(1),
        area_part: ((areaSqft / 1000) * 2.5).toFixed(1),
        inventory_part: invCo2.toFixed(1),
      },
    });
    setUserTargetKg(clampedTarget);
    setStep(4);
  };

  const handleSubmitAll = async () => {
    try {
      setLoading(true);
      const payload = {
        full_name: fullName.trim(),
        username: username.trim(),
        household_members: parseInt(members) || 1,
        home_type: homeType,
        area_sqft: parseFloat(areaSqft) || 1000,
        city_state: cityState.trim(),
        avg_hours_at_home: parseFloat(avgHours) || 14,
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
    <div className="min-h-screen bg-softWhite py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      {/* Top Branding */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-forest-800 to-emerald-500 flex items-center justify-center text-white shadow-eco">
          <Leaf className="w-5 h-5 fill-white/20" />
        </div>
        <span className="font-black text-2xl text-forest-900 tracking-tight">EcoTrace</span>
      </div>

      <div className="max-w-2xl w-full bg-white rounded-3xl border border-forest-100 shadow-eco p-6 sm:p-8">
        {/* Progress Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2 text-xs font-bold uppercase tracking-wider text-charcoal-400">
            <span className={step >= 1 ? "text-forest-800" : ""}>1. Profile</span>
            <span className={step >= 2 ? "text-forest-800" : ""}>2. Home</span>
            <span className={step >= 3 ? "text-forest-800" : ""}>3. Appliances</span>
            <span className={step >= 4 ? "text-forest-800" : ""}>4. Carbon Target</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-forest-800 transition-all duration-300 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* STEP 1: USER DETAILS */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-forest-950">
                Welcome to EcoTrace! Let's get acquainted.
              </h2>
              <p className="text-xs text-charcoal-500 mt-1">
                Tell us a little about yourself and the people who share your home.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-charcoal-700">
                    Number of Household Members
                  </label>
                  <span className="text-xs font-bold text-forest-800">
                    {members} {members === 1 ? "Person" : "People"}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={members}
                  onChange={(e) => setMembers(Number(e.target.value))}
                  className="w-full accent-forest-800 cursor-pointer"
                />
                <span className="text-[11px] text-charcoal-400 block mt-1">
                  Used to fairly normalize your EcoScore and benchmark targets.
                </span>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold transition flex items-center gap-2 shadow-eco"
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
              <h2 className="text-xl font-bold text-forest-950">
                Household Architecture & Occupancy
              </h2>
              <p className="text-xs text-charcoal-500 mt-1">
                Your home size and location dictate realistic thermal and baseline power requirements.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-2">
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
                          ? "bg-forest-800 text-white border-forest-800 shadow-sm"
                          : "bg-white text-charcoal-700 border-gray-200 hover:bg-forest-50"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Approx. Floor Area (Sq. Ft.)
                  </label>
                  <input
                    type="number"
                    min="200"
                    max="10000"
                    step="50"
                    value={areaSqft}
                    onChange={(e) => setAreaSqft(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    City / State
                  </label>
                  <input
                    type="text"
                    value={cityState}
                    onChange={(e) => setCityState(e.target.value)}
                    placeholder="e.g. Bangalore, Karnataka"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-charcoal-700">
                    Average Daily Hours Spent at Home
                  </label>
                  <span className="text-xs font-bold text-forest-800">
                    {avgHours} Hours / Day
                  </span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="24"
                  value={avgHours}
                  onChange={(e) => setAvgHours(Number(e.target.value))}
                  className="w-full accent-forest-800 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-charcoal-600 hover:bg-gray-50 transition flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold transition flex items-center gap-2 shadow-eco"
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
              <h2 className="text-xl font-bold text-forest-950">
                Select Your Household Appliances
              </h2>
              <p className="text-xs text-charcoal-500 mt-1">
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
                        ? "bg-forest-50/70 border-emerald-300 shadow-sm"
                        : "bg-white border-gray-200 hover:border-gray-300"
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
                              ? "bg-forest-800 border-forest-800 text-white"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-charcoal-900 block">
                            {app.name}
                          </span>
                          <span className="text-[10px] text-charcoal-500">
                            {app.category} • {app.fuel_type === "gas" ? "LPG Fuel" : `${app.default_power_watts} Watts`}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-charcoal-500 font-semibold">Qty:</span>
                            <input
                              type="number"
                              min="1"
                              max="20"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(app.id, parseInt(e.target.value) || 1)}
                              className="w-12 px-2 py-1 rounded-lg border border-gray-200 text-xs text-center font-bold"
                            />
                          </div>

                          {item.fuel_type !== "gas" && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-charcoal-500 font-semibold">Watts:</span>
                              <input
                                type="number"
                                min="1"
                                max="10000"
                                value={item.power_watts}
                                onChange={(e) => updatePower(app.id, parseFloat(e.target.value) || 0)}
                                className="w-16 px-2 py-1 rounded-lg border border-gray-200 text-xs text-center font-bold"
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
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-charcoal-600 hover:bg-gray-50 transition flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={goToStep4}
                className="px-6 py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold transition flex items-center gap-2 shadow-eco"
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
              <h2 className="text-xl font-bold text-forest-950 mt-0.5">
                Your Personalized Carbon Target
              </h2>
              <p className="text-xs text-charcoal-500 mt-1">
                Estimated benchmark modeled from household size, inventory, and occupancy hours.
              </p>
            </div>

            {/* Benchmark Showcase Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-forest-50 to-emerald-50 border border-emerald-200 text-center">
              <span className="text-xs uppercase font-extrabold text-forest-800 tracking-wider">
                Recommended Daily Limit
              </span>
              <div className="my-2">
                <span className="text-5xl font-black text-forest-950 tracking-tight">
                  {userTargetKg}
                </span>
                <span className="text-sm font-bold text-charcoal-500 ml-1.5">
                  kg CO₂ / day
                </span>
              </div>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full inline-block">
                ≈ {(userTargetKg / members).toFixed(2)} kg CO₂ per person
              </span>

              {/* Slider for adjustment */}
              <div className="mt-6 pt-4 border-t border-emerald-200/80 text-left">
                <div className="flex items-center justify-between text-xs font-bold text-charcoal-700 mb-2">
                  <span>Adjust Your Daily Target</span>
                  <span className="text-forest-900">{userTargetKg} kg</span>
                </div>
                <input
                  type="range"
                  min="4.0"
                  max="30.0"
                  step="0.5"
                  value={userTargetKg}
                  onChange={(e) => setUserTargetKg(parseFloat(e.target.value))}
                  className="w-full accent-forest-800 cursor-pointer"
                />
                <p className="text-[11px] text-charcoal-500 mt-2 leading-relaxed">
                  *Disclaimer: This target is an estimated conservation benchmark, not an immutable scientific universal ceiling. Remaining below your budget awards +25 EcoCredits daily.
                </p>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-charcoal-600 hover:bg-gray-50 transition flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleSubmitAll}
                disabled={loading}
                className="px-6 py-3.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold transition flex items-center gap-2 shadow-eco-lg hover:shadow-glow"
              >
                <Sparkles className="w-4 h-4 text-limeAccent" />
                <span>{loading ? "Saving Profile..." : "Complete Setup (+50 Credits)"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
