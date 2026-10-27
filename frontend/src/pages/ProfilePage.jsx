import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
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
} from "lucide-react";

export default function ProfilePage() {
  const { user, refreshUser, updateLocalUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState("household"); // household, budget, achievements, security
  const [household, setHousehold] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Household editing state
  const [homeType, setHomeType] = useState("2BHK");
  const [members, setMembers] = useState(3);
  const [areaSqft, setAreaSqft] = useState(1000);
  const [cityState, setCityState] = useState("Bangalore, Karnataka");
  const [dailyTarget, setDailyTarget] = useState(12.5);
  const [savingHousehold, setSavingHousehold] = useState(false);

  // Password update state
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingSecurity, setSavingSecurity] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [hRes, aRes] = await Promise.all([
          api.getHousehold(),
          api.getUserAchievements(),
        ]);

        if (hRes.household) {
          setHousehold(hRes.household);
          setHomeType(hRes.household.home_type);
          setMembers(hRes.household.household_members);
          setAreaSqft(hRes.household.area_sqft);
          setCityState(hRes.household.city_state);
          setDailyTarget(hRes.household.daily_co2_target_kg);
        }
        setAchievements(aRes.achievements || []);
      } catch (err) {
        console.error("Failed to load profile data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSaveBudgetTarget = async () => {
    try {
      setSavingHousehold(true);
      await api.updateBudgetTarget(parseFloat(dailyTarget));
      showToast("Daily carbon target updated successfully!", "success");
      await refreshUser();
    } catch (err) {
      showToast(err.message || "Failed to update target.", "error");
    } finally {
      setSavingHousehold(false);
    }
  };

  const handleSaveSecurity = async (e) => {
    e.preventDefault();
    try {
      setSavingSecurity(true);
      const payload = {
        full_name: fullName.trim(),
      };
      if (newPassword) {
        payload.current_password = currentPassword;
        payload.new_password = newPassword;
      }
      const res = await api.updateSettings(payload);
      showToast("Profile settings saved successfully!", "success");
      setCurrentPassword("");
      setNewPassword("");
      await refreshUser();
    } catch (err) {
      showToast(err.message || "Failed to save settings.", "error");
    } finally {
      setSavingSecurity(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Profile Overview Banner */}
      <div className="bg-white rounded-3xl border border-forest-100 shadow-eco p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img
            src={user?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username}`}
            alt={user?.full_name}
            className="w-24 h-24 rounded-full border-4 border-emerald-100 bg-white object-cover shadow-eco"
          />
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-charcoal-900 tracking-tight">
                {user?.full_name}
              </h1>
              <span className="text-[11px] font-bold text-forest-800 bg-forest-50 border border-forest-100 px-2 py-0.5 rounded-full">
                @{user?.username}
              </span>
            </div>
            <p className="text-xs text-charcoal-500 mt-0.5">{user?.email}</p>
            <div className="mt-2.5 flex items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-charcoal-600">
              <span className="flex items-center gap-1 text-forest-800">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                {user?.eco_credits} Credits
              </span>
              <span className="flex items-center gap-1 text-orange-600">
                <Flame className="w-3.5 h-3.5 fill-current" />
                {user?.current_streak} Day Streak
              </span>
              <span className="flex items-center gap-1 text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                Score: {user?.eco_score}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-forest-50/70 p-4 rounded-2xl border border-forest-100 text-xs space-y-1.5 min-w-[200px]">
          <span className="font-bold text-forest-900 block mb-1">Household Specs</span>
          <div className="flex justify-between text-charcoal-600">
            <span>Dwelling:</span>
            <span className="font-semibold text-charcoal-900">{household?.home_type || "2BHK"}</span>
          </div>
          <div className="flex justify-between text-charcoal-600">
            <span>Occupants:</span>
            <span className="font-semibold text-charcoal-900">{household?.household_members || 3} members</span>
          </div>
          <div className="flex justify-between text-charcoal-600">
            <span>Area:</span>
            <span className="font-semibold text-charcoal-900">{household?.area_sqft || 1000} sq.ft</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-2xl bg-white border border-forest-100 shadow-sm max-w-fit">
        {[
          { id: "household", label: "Household & Target", icon: Home },
          { id: "achievements", label: "Achievements & Badges", icon: Award },
          { id: "security", label: "Profile & Password", icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-forest-800 text-white shadow-sm"
                  : "text-charcoal-600 hover:text-forest-900"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: HOUSEHOLD & DAILY TARGET */}
      {activeTab === "household" && (
        <div className="bg-white rounded-3xl border border-forest-100 shadow-eco p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="font-bold text-base text-forest-950">
              Daily Carbon Target & Benchmark Adjustment
            </h3>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Tune your daily CO₂ allowance. Remaining below this limit qualifies you for daily EcoCredits.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-forest-50/50 border border-forest-100 max-w-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-charcoal-700">Daily Target Ceiling</span>
              <span className="text-xl font-black text-forest-900">{dailyTarget} kg CO₂ / day</span>
            </div>
            <input
              type="range"
              min="4.0"
              max="35.0"
              step="0.5"
              value={dailyTarget}
              onChange={(e) => setDailyTarget(parseFloat(e.target.value))}
              className="w-full accent-forest-800 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-charcoal-400 mt-1 font-semibold">
              <span>Strict (4.0 kg)</span>
              <span>Moderate (12.5 kg)</span>
              <span>High (35.0 kg)</span>
            </div>

            <button
              onClick={handleSaveBudgetTarget}
              disabled={savingHousehold}
              className="mt-5 px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingHousehold ? "Saving..." : "Save Target"}</span>
            </button>
          </div>

          {/* Inventoried Appliances List */}
          <div className="pt-4 border-t border-gray-100">
            <h4 className="font-bold text-sm text-forest-950 mb-3">
              Inventoried Household Appliances ({household?.appliances?.length || 0})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {household?.appliances?.map((ha) => (
                <div
                  key={ha.id}
                  className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 flex flex-col justify-between"
                >
                  <span className="font-bold text-xs text-charcoal-900">{ha.name}</span>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-charcoal-500">
                    <span>Qty: {ha.quantity}</span>
                    <span>{ha.fuel_type === "gas" ? "LPG" : `${ha.power_watts}W`}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACHIEVEMENTS & BADGES */}
      {activeTab === "achievements" && (
        <div className="bg-white rounded-3xl border border-forest-100 shadow-eco p-6 sm:p-8">
          <div className="mb-6">
            <h3 className="font-bold text-base text-forest-950">Achievements & Badges</h3>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Unlock environmental milestones to earn bonus EcoCredits and showcase flair on the leaderboard.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-5 rounded-2xl border transition flex flex-col justify-between ${
                  ach.is_unlocked
                    ? "bg-gradient-to-br from-forest-50 to-emerald-50 border-emerald-200 shadow-sm"
                    : "bg-white border-gray-100 opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                        ach.is_unlocked
                          ? "bg-forest-800 text-limeAccent shadow-sm"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-gray-100 text-forest-800">
                      +{ach.credit_reward} Credits
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-charcoal-900">{ach.title}</h4>
                  <p className="text-xs text-charcoal-500 mt-1 leading-relaxed">
                    {ach.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-charcoal-600">
                    {ach.is_unlocked ? (
                      <span className="text-emerald-700 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                      </span>
                    ) : (
                      <span>In Progress ({ach.progress_percent}%)</span>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PROFILE & SECURITY */}
      {activeTab === "security" && (
        <div className="bg-white rounded-3xl border border-forest-100 shadow-eco p-6 sm:p-8 max-w-xl">
          <div className="mb-6">
            <h3 className="font-bold text-base text-forest-950">Profile Settings & Password</h3>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Update personal identity credentials
            </p>
          </div>

          <form onSubmit={handleSaveSecurity} className="space-y-4">
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

            <div className="pt-4 border-t border-gray-100">
              <span className="text-xs font-bold text-forest-900 block mb-3">
                Change Password (Optional)
              </span>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="Leave blank if not changing"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={savingSecurity}
                className="px-6 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingSecurity ? "Saving Changes..." : "Save Settings"}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
