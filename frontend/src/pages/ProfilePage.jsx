import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import CardTilt3D from "../components/common/CardTilt3D";
import Modal from "../components/common/Modal";
import AnimatedCounter from "../components/common/AnimatedCounter";
import {
  User,
  Home,
  ShieldCheck,
  Flame,
  Award,
  Coins,
  Lock,
  Save,
  Sliders,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Trash2,
  Plus,
  Edit3,
  Zap,
  Maximize2,
  MapPin,
  Users,
  Download,
  Share2,
  Check,
  X,
  ChevronRight,
  Info,
  Leaf,
  ArrowRight,
  Clock,
  TreePine,
  TrendingDown,
  FileText,
  BadgeCheck,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function ProfilePage() {
  const { user, refreshUser, updateLocalUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState("household"); // household, appliances, achievements, passport, security
  const [household, setHousehold] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);

  // Household editing state
  const [homeType, setHomeType] = useState("2BHK");
  const [members, setMembers] = useState(3);
  const [areaSqft, setAreaSqft] = useState(1050);
  const [cityState, setCityState] = useState("Bangalore, Karnataka");
  const [dailyTarget, setDailyTarget] = useState(10.9);
  const [savingHousehold, setSavingHousehold] = useState(false);
  const [isEditDwellingModalOpen, setIsEditDwellingModalOpen] = useState(false);

  // Add Appliance state
  const [isAddApplianceModalOpen, setIsAddApplianceModalOpen] = useState(false);
  const [newAppName, setNewAppName] = useState("");
  const [newAppCategory, setNewAppCategory] = useState("Cooling");
  const [newAppWatts, setNewAppWatts] = useState(150);
  const [newAppQty, setNewAppQty] = useState(1);
  const [newAppFuel, setNewAppFuel] = useState("electric");
  const [selectedCatalogPresetId, setSelectedCatalogPresetId] = useState("");
  const [addingAppliance, setAddingAppliance] = useState(false);

  // Security update state
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingSecurity, setSavingSecurity] = useState(false);

  // Load initial data
  const loadData = async () => {
    try {
      const [hRes, aRes, catRes] = await Promise.all([
        api.getHousehold(),
        api.getUserAchievements(),
        api.getApplianceCatalog().catch(() => ({ presets: [], custom: [] })),
      ]);

      if (hRes.household) {
        setHousehold(hRes.household);
        setHomeType(hRes.household.home_type || "2BHK");
        setMembers(hRes.household.household_members || 3);
        setAreaSqft(hRes.household.area_sqft || 1050);
        setCityState(hRes.household.city_state || "Bangalore, Karnataka");
        setDailyTarget(hRes.household.daily_co2_target_kg || 10.9);
      }
      setAchievements(aRes.achievements || []);
      const allPresets = [...(catRes.presets || []), ...(catRes.custom || [])];
      setCatalog(allPresets);
      if (allPresets.length > 0) {
        setSelectedCatalogPresetId(allPresets[0].id);
        setNewAppName(allPresets[0].name);
        setNewAppCategory(allPresets[0].category);
        setNewAppWatts(allPresets[0].default_power_watts || 100);
        setNewAppFuel(allPresets[0].fuel_type || "electric");
      }
    } catch (err) {
      console.error("Failed to load profile data:", err);
      showToast("Unable to refresh profile telemetry.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync user changes
  useEffect(() => {
    if (user?.full_name) {
      setFullName(user.full_name);
    }
  }, [user]);

  // Handle Preset Selection in Add Appliance Modal
  const handleSelectPreset = (presetId) => {
    setSelectedCatalogPresetId(presetId);
    const item = catalog.find((c) => c.id === presetId);
    if (item) {
      setNewAppName(item.name);
      setNewAppCategory(item.category);
      setNewAppWatts(item.default_power_watts || 100);
      setNewAppFuel(item.fuel_type || "electric");
    }
  };

  // Save Carbon Budget Target
  const handleSaveBudgetTarget = async () => {
    try {
      setSavingHousehold(true);
      await api.updateBudgetTarget(parseFloat(dailyTarget));
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#10b981", "#34d399", "#a7f3d0"],
      });
      showToast(`Daily carbon target set to ${dailyTarget} kg CO₂ / day!`, "success");
      await refreshUser();
      loadData();
    } catch (err) {
      showToast(err.message || "Failed to update target.", "error");
    } finally {
      setSavingHousehold(false);
    }
  };

  // Save Household Dwelling Parameters
  const handleSaveDwelling = async (e) => {
    e.preventDefault();
    try {
      setSavingHousehold(true);
      await api.updateHousehold({
        home_type: homeType,
        household_members: parseInt(members),
        area_sqft: parseFloat(areaSqft),
        city_state: cityState,
        daily_co2_target_kg: parseFloat(dailyTarget),
      });
      showToast("Household specifications updated successfully!", "success");
      setIsEditDwellingModalOpen(false);
      await refreshUser();
      loadData();
    } catch (err) {
      showToast(err.message || "Failed to update dwelling.", "error");
    } finally {
      setSavingHousehold(false);
    }
  };

  // Add Appliance to Household Inventory
  const handleAddAppliance = async (e) => {
    e.preventDefault();
    if (!newAppName.trim()) {
      showToast("Please provide an appliance name.", "error");
      return;
    }
    try {
      setAddingAppliance(true);
      await api.addHouseholdAppliance({
        appliance_id: selectedCatalogPresetId || undefined,
        name: newAppName.trim(),
        category: newAppCategory,
        fuel_type: newAppFuel,
        power_watts: newAppFuel === "gas" ? 0 : parseFloat(newAppWatts),
        quantity: parseInt(newAppQty) || 1,
      });
      confetti({
        particleCount: 45,
        spread: 50,
        origin: { y: 0.65 },
        colors: ["#059669", "#10b981", "#6ee7b7"],
      });
      showToast(`${newAppName} added to your household inventory!`, "success");
      setIsAddApplianceModalOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message || "Failed to add appliance.", "error");
    } finally {
      setAddingAppliance(false);
    }
  };

  // Delete Appliance from Household Inventory
  const handleDeleteAppliance = async (haId, appName) => {
    try {
      await api.deleteHouseholdAppliance(haId);
      showToast(`${appName} removed from inventory.`, "info");
      loadData();
    } catch (err) {
      showToast(err.message || "Failed to remove appliance.", "error");
    }
  };

  // Save Security Settings
  const handleSaveSecurity = async (e) => {
    e.preventDefault();
    try {
      setSavingSecurity(true);
      await api.updateProfile({
        full_name: fullName,
        current_password: currentPassword || undefined,
        new_password: newPassword || undefined,
      });
      showToast("Security credentials updated successfully!", "success");
      setCurrentPassword("");
      setNewPassword("");
      await refreshUser();
    } catch (err) {
      showToast(err.message || "Failed to save settings.", "error");
    } finally {
      setSavingSecurity(false);
    }
  };

  // Preset Buttons for Target
  const setTargetPreset = (val) => {
    setDailyTarget(val);
  };

  // Computed Household Stats
  const appliancesList = household?.appliances || [];
  const totalConnectedWatts = appliancesList.reduce(
    (acc, a) => acc + (a.fuel_type === "electric" ? (a.power_watts || 0) * (a.quantity || 1) : 0),
    0
  );
  const totalGasBurners = appliancesList.reduce(
    (acc, a) => acc + (a.fuel_type === "gas" ? (a.quantity || 1) : 0),
    0
  );

  // Dynamic simulation projections based on current daily target
  const monthlyProjectionKg = (dailyTarget * 30).toFixed(0);
  const annualTreeEquivalents = Math.max(1, (dailyTarget * 365 / 22).toFixed(1));
  const dailyKwhEquiv = (dailyTarget / 0.82).toFixed(1);
  const isGreenerThanAverage = dailyTarget < 14.2;
  const pctGreener = Math.abs(Math.round(((14.2 - dailyTarget) / 14.2) * 100));

  return (
    <div className="space-y-8 pb-16 relative z-10 text-slate-900">
      {/* 1. SPECTACULAR GLASS-HERO PROFILE BANNER */}
      <CardTilt3D
        maxTilt={2}
        scale={1.005}
        className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8 hover:border-emerald-500/40 transition-all"
      >
        {/* Soft Ambient Radial Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/10 via-lime-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-teal-500/10 via-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
          {/* Left: User Identity Showcase */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="relative group">
              <img
                src={user?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username || 'Atharv'}`}
                alt={user?.full_name || "Citizen"}
                className="w-28 h-28 rounded-3xl border-4 border-white bg-gradient-to-tr from-emerald-100 to-teal-50 object-cover shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-md">
                <Check className="w-4 h-4 stroke-[3]" />
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {user?.full_name || "Atharv Iyengar"}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full shadow-xs">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                  @{user?.username || "atharviyengar"}
                </span>
                <span className="text-[10px] uppercase font-black tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                  Level 3 Eco-Pioneer
                </span>
              </div>

              <p className="text-xs text-slate-500 font-medium">
                {user?.email || "atharviyengar3@gmail.com"} • Household Account Owner
              </p>

              {/* Dynamic Badges Row */}
              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-semibold">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 shadow-xs">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span>
                    <strong className="font-black text-slate-900">{user?.eco_credits ?? 110}</strong> Credits
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-orange-50 border border-orange-200 text-orange-800 shadow-xs">
                  <Flame className="w-4 h-4 text-orange-500 fill-current" />
                  <span>
                    <strong className="font-black text-slate-900">{user?.current_streak ?? 2}</strong> Day Streak
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>
                    EcoScore: <strong className="font-black text-slate-900">{user?.eco_score ?? 56.2}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Household Specs Smart Hub */}
          <div className="w-full lg:w-auto min-w-[300px] bg-slate-50/90 rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-emerald-600" />
                Household Specifications
              </span>
              <button
                onClick={() => setIsEditDwellingModalOpen(true)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit Specs</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Home className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Dwelling</span>
                  <span className="font-black text-slate-900">{household?.home_type || homeType}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Occupants</span>
                  <span className="font-black text-slate-900">{household?.household_members || members} People</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Living Space</span>
                  <span className="font-black text-slate-900">{household?.area_sqft || areaSqft} sq.ft</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Power Grid</span>
                  <span className="font-black text-slate-900 truncate max-w-[90px] block">
                    {household?.city_state?.split(",")[0] || "Bangalore"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardTilt3D>

      {/* 2. MODERN SEGMENTED NAVIGATION BAR */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 shadow-inner flex-wrap">
        {[
          { id: "household", label: "Household & Carbon Engine", icon: Home },
          { id: "appliances", label: `Appliance Inventory (${appliancesList.length})`, icon: Zap },
          { id: "achievements", label: `Achievements & Medals (${achievements.filter(a => a.is_unlocked).length})`, icon: Award },
          { id: "passport", label: "Green Household Credential", icon: FileText },
          { id: "security", label: "Account & Security", icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-white font-black shadow-sm scale-[1.01]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. TAB 1: HOUSEHOLD & CARBON ENGINE */}
      {activeTab === "household" && (
        <div className="space-y-6">
          {/* Carbon Target Tuner & Real-Time Scientific Projection Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Tuner (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-5 hover:border-emerald-500/40 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold uppercase text-emerald-700 tracking-wider">
                      Target Tuning Engine
                    </span>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                  <h3 className="font-black text-xl text-slate-900 mt-0.5">
                    Daily Carbon Target Ceiling
                  </h3>
                  <p className="text-xs text-slate-500">
                    Remaining under this limit rewards your household with daily streak multipliers and EcoCredits.
                  </p>
                </div>
              </div>

              {/* Slider Card Container */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/30 border border-slate-200 space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wide text-slate-600">
                    Your Target Allowance:
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-emerald-700 tracking-tight">
                      {dailyTarget}
                    </span>
                    <span className="text-xs font-bold text-slate-500">kg CO₂ / day</span>
                  </div>
                </div>

                <div className="relative pt-1">
                  <input
                    type="range"
                    min="4.0"
                    max="35.0"
                    step="0.1"
                    value={dailyTarget}
                    onChange={(e) => setDailyTarget(parseFloat(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-semibold">
                    <span>Strict (4.0 kg)</span>
                    <span className="text-emerald-700 font-bold">Recommended (~10.9 kg)</span>
                    <span>High (35.0 kg)</span>
                  </div>
                </div>

                {/* Quick Target Presets */}
                <div className="pt-2 border-t border-slate-200/80">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-2">
                    One-Click Scientific Presets:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "Strict Eco (6.0 kg)", val: 6.0 },
                      { label: "CEA Benchmark (10.9 kg)", val: 10.9 },
                      { label: "Urban Balanced (14.2 kg)", val: 14.2 },
                      { label: "Extended Comfort (22.0 kg)", val: 22.0 },
                    ].map((preset) => (
                      <button
                        key={preset.val}
                        type="button"
                        onClick={() => setTargetPreset(preset.val)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          dailyTarget === preset.val
                            ? "bg-emerald-600 text-white font-black shadow-xs scale-105"
                            : "bg-white border border-slate-200 text-slate-700 hover:border-emerald-400"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-emerald-600" />
                  <span>Changes reflect immediately in today's budget progress ring.</span>
                </span>
                <button
                  onClick={handleSaveBudgetTarget}
                  disabled={savingHousehold}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingHousehold ? "Saving Target..." : "Save Target Ceiling"}</span>
                </button>
              </div>
            </div>

            {/* Right Scientific Impact Card (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 rounded-3xl border border-emerald-200/80 shadow-sm p-6 sm:p-7 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Target Impact Projection
                  </span>
                  <span className="text-[10px] font-black uppercase text-emerald-800 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200">
                    CEA Modeled
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Monthly Emissions Budget</span>
                      <span className="text-2xl font-black text-slate-900">{monthlyProjectionKg} kg</span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      ~30 Days
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Daily Electricity Equivalent</span>
                      <span className="text-2xl font-black text-slate-900">{dailyKwhEquiv} kWh</span>
                    </div>
                    <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
                      0.82 kg/kWh
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Annual Trees Required</span>
                      <span className="text-2xl font-black text-slate-900">{annualTreeEquivalents} Trees</span>
                    </div>
                    <TreePine className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>

                {isGreenerThanAverage && (
                  <div className="p-3 rounded-xl bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
                    <span>Your target is {pctGreener}% greener than the Indian CEA grid average (14.2 kg/day)!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: APPLIANCE INVENTORY STUDIO */}
      {activeTab === "appliances" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 hover:border-emerald-500/40 transition-all">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase text-emerald-700 tracking-wider">
                  Household Energy Fleet
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <h3 className="font-black text-xl text-slate-900 mt-0.5">
                Inventoried Appliances & Connected Load
              </h3>
              <p className="text-xs text-slate-500">
                EcoTrace tracks these devices to benchmark standby load and power distribution.
              </p>
            </div>

            <button
              onClick={() => setIsAddApplianceModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-sm transition flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Appliance to Home</span>
            </button>
          </div>

          {/* Quick Metrics of Fleet */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Devices</span>
              <span className="text-2xl font-black text-slate-900">{appliancesList.length}</span>
              <span className="text-[11px] text-slate-500 block">Active in household</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Connected Power</span>
              <span className="text-2xl font-black text-emerald-700">{totalConnectedWatts} W</span>
              <span className="text-[11px] text-slate-500 block">Electric rating</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Cooking Burners</span>
              <span className="text-2xl font-black text-orange-600">{totalGasBurners}</span>
              <span className="text-[11px] text-slate-500 block">LPG burners</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Estimated Base Load</span>
              <span className="text-2xl font-black text-slate-900">~{((totalConnectedWatts * 2.8) / 1000).toFixed(1)} kWh</span>
              <span className="text-[11px] text-slate-500 block">Daily typical</span>
            </div>
          </div>

          {/* Grid of Appliance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {appliancesList.map((app) => (
              <CardTilt3D
                key={app.id}
                maxTilt={4}
                scale={1.015}
                className="p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-emerald-500/50 shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
                        {app.fuel_type === "gas" ? (
                          <Flame className="w-5 h-5 text-orange-500" />
                        ) : (
                          <Zap className="w-5 h-5 text-emerald-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">{app.name}</h4>
                        <span className="text-[10px] text-slate-500 font-medium">
                          Category: {app.category}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteAppliance(app.id, app.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Remove from inventory"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    💡 {app.energy_saving_tip || "Keep maintained to ensure peak energy efficiency."}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-600">Quantity: <strong className="text-slate-900">{app.quantity}</strong></span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px]">
                    {app.fuel_type === "gas" ? "LPG Gas" : `${app.power_watts} Watts`}
                  </span>
                </div>
              </CardTilt3D>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB 3: ACHIEVEMENTS & 3D MEDALS */}
      {activeTab === "achievements" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 hover:border-emerald-500/40 transition-all">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase text-emerald-700 tracking-wider">
                  Environmental Honors
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <h3 className="font-black text-2xl text-slate-900 mt-0.5">Achievements & Medals</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Unlock milestones to earn bonus EcoCredits and showcase your sustainability flair.
              </p>
            </div>
            <span className="text-xs font-black px-4 py-2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs">
              {achievements.filter((a) => a.is_unlocked).length} of {achievements.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {achievements.map((ach) => (
              <CardTilt3D
                key={ach.id}
                maxTilt={5}
                scale={1.02}
                className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                  ach.is_unlocked
                    ? "bg-gradient-to-br from-white to-emerald-50/40 border-emerald-300 shadow-sm hover:border-emerald-500"
                    : "bg-slate-50 border-slate-200 opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center relative transition-transform duration-300 group-hover:scale-110 ${
                        ach.is_unlocked
                          ? "bg-gradient-to-tr from-emerald-600 to-lime-500 text-white shadow-md border-2 border-emerald-200"
                          : "bg-slate-200 text-slate-400 border border-slate-300"
                      }`}
                    >
                      <Award className="w-6 h-6" />
                      {ach.is_unlocked && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-lime-400 animate-ping"></span>
                      )}
                    </div>
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 shadow-xs flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-amber-500" />
                      +{ach.credit_reward} Credits
                    </span>
                  </div>

                  <h4 className="font-extrabold text-base text-slate-900">{ach.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {ach.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  {ach.is_unlocked ? (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-700 flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Milestone Achieved</span>
                      </span>
                      <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Badge Active
                      </span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                        <span>Progress</span>
                        <span>{ach.progress_percent}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden border border-slate-200">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-600 to-lime-500 rounded-full transition-all duration-500"
                          style={{ width: `${ach.progress_percent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardTilt3D>
            ))}
          </div>
        </div>
      )}

      {/* 6. TAB 4: GREEN HOUSEHOLD PASSPORT & CREDENTIAL */}
      {activeTab === "passport" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 hover:border-emerald-500/40 transition-all">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase text-emerald-700 tracking-wider">
                  Verified Sustainability Passport
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <h3 className="font-black text-2xl text-slate-900 mt-0.5">
                Household Environmental Credential
              </h3>
              <p className="text-xs text-slate-500">
                Official digital certificate verifying your daily adherence to the Central Electricity Authority (CEA) standard.
              </p>
            </div>

            <button
              onClick={() => {
                confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                showToast("Certificate generated! Ready for presentation.", "award");
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-sm transition flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Export Credential</span>
            </button>
          </div>

          {/* Certificate Visual Card */}
          <CardTilt3D
            maxTilt={2}
            scale={1.005}
            className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/40 border-2 border-emerald-300 shadow-lg text-center space-y-6 relative overflow-hidden"
          >
            {/* Watermark Seal */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
              <ShieldCheck className="w-96 h-96 text-emerald-900" />
            </div>

            <div className="relative z-10 space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-100/60 px-4 py-1.5 rounded-full border border-emerald-300">
                Official EcoTrace Carbon Credential
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight pt-2">
                Verified Sustainable Household
              </h2>
              <p className="text-xs text-slate-500 max-w-lg mx-auto">
                This certifies that the dwelling under registered citizen <strong>{user?.full_name || "Atharv Iyengar"}</strong> actively records and models consumption under the Central Electricity Authority of India Baseline Standard (0.82 kg CO₂/kWh).
              </p>
            </div>

            {/* Credential Data Points */}
            <div className="relative z-10 max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-b border-emerald-200/80 py-4 text-left">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Citizen ID</span>
                <span className="font-mono text-xs font-bold text-slate-900 truncate block">
                  {user?.id?.slice(0, 13) || "ECO-2026-ATH"}...
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">EcoScore</span>
                <span className="text-sm font-black text-emerald-700">
                  {user?.eco_score ?? 56.2} / 100
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Target Ceiling</span>
                <span className="text-sm font-black text-slate-900">
                  {dailyTarget} kg / day
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Status</span>
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md inline-block">
                  Verified Active
                </span>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between max-w-lg mx-auto text-left pt-2 text-xs text-slate-500">
              <div>
                <span className="block font-bold text-slate-900">National Grid Benchmark</span>
                <span>CEA India Version 19 Database</span>
              </div>
              <div className="text-right">
                <span className="block font-bold text-slate-900">IPCC Compliance</span>
                <span>Tier-1 Stationary Fuel Combustion</span>
              </div>
            </div>
          </CardTilt3D>
        </div>
      )}

      {/* 7. TAB 5: ACCOUNT & SECURITY */}
      {activeTab === "security" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 max-w-2xl hover:border-emerald-500/40 transition-all">
          <div className="mb-6">
            <h3 className="font-black text-xl text-slate-900">Account Credentials & Password</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage your personal identity credentials and password protection.
            </p>
          </div>

          <form onSubmit={handleSaveSecurity} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Legal / Citizen Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                required
              />
            </div>

            <div className="pt-4 border-t border-slate-100">
              <span className="text-xs font-extrabold text-slate-900 block mb-3">
                Change Account Password (Optional)
              </span>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter current password to verify"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    New Secure Password
                  </label>
                  <input
                    type="password"
                    placeholder="Min 6 characters with mixed characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={savingSecurity}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingSecurity ? "Saving Changes..." : "Save Credentials"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 1: EDIT DWELLING PARAMETERS */}
      <Modal
        isOpen={isEditDwellingModalOpen}
        onClose={() => setIsEditDwellingModalOpen(false)}
        title="Edit Household Dwelling Specifications"
      >
        <form onSubmit={handleSaveDwelling} className="space-y-4 text-slate-900">
          <p className="text-xs text-slate-500">
            Updating your dwelling parameters automatically tunes your per-capita normalization model.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dwelling Type
              </label>
              <select
                value={homeType}
                onChange={(e) => setHomeType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="1BHK">1BHK Apartment</option>
                <option value="2BHK">2BHK Apartment</option>
                <option value="3BHK">3BHK Apartment</option>
                <option value="4BHK">4BHK+ Apartment</option>
                <option value="Independent Villa">Independent House / Villa</option>
                <option value="Studio">Studio / Penthouse</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Household Members
              </label>
              <input
                type="number"
                min="1"
                max="15"
                value={members}
                onChange={(e) => setMembers(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Carpet Area (Square Feet)
              </label>
              <input
                type="number"
                min="200"
                max="10000"
                step="50"
                value={areaSqft}
                onChange={(e) => setAreaSqft(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                City & State (Grid Zone)
              </label>
              <input
                type="text"
                value={cityState}
                onChange={(e) => setCityState(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsEditDwellingModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingHousehold}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-sm"
            >
              {savingHousehold ? "Saving..." : "Save Dwelling"}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: ADD APPLIANCE TO INVENTORY */}
      <Modal
        isOpen={isAddApplianceModalOpen}
        onClose={() => setIsAddApplianceModalOpen(false)}
        title="Add Appliance to Household Inventory"
      >
        <form onSubmit={handleAddAppliance} className="space-y-4 text-slate-900">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Select from Presets Catalog
            </label>
            <select
              value={selectedCatalogPresetId}
              onChange={(e) => handleSelectPreset(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
            >
              {catalog.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.category}) — {cat.fuel_type === "gas" ? "LPG Gas" : `${cat.default_power_watts}W`}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Appliance Name
              </label>
              <input
                type="text"
                value={newAppName}
                onChange={(e) => setNewAppName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Usage Category
              </label>
              <select
                value={newAppCategory}
                onChange={(e) => setNewAppCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Fuel Source
              </label>
              <select
                value={newAppFuel}
                onChange={(e) => setNewAppFuel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-900"
              >
                <option value="electric">⚡ Electric</option>
                <option value="gas">🔥 LPG Gas</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Power (Watts)
              </label>
              <input
                type="number"
                disabled={newAppFuel === "gas"}
                value={newAppFuel === "gas" ? 0 : newAppWatts}
                onChange={(e) => setNewAppWatts(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-900 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Units Count
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={newAppQty}
                onChange={(e) => setNewAppQty(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsAddApplianceModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addingAppliance}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-sm"
            >
              {addingAppliance ? "Adding..." : "Add to Household"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
