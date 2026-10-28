import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import CardTilt3D from "../components/common/CardTilt3D";
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
} from "lucide-react";

export default function ProfilePage() {
  const { user, refreshUser, updateLocalUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState("household"); // household, achievements, security
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
      await api.updateProfile({
        full_name: fullName,
        current_password: currentPassword || undefined,
        new_password: newPassword || undefined,
      });
      showToast("Security profile updated successfully!", "success");
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
    <div className="space-y-6 pb-12 relative z-10 text-slate-900">
      {/* Profile Overview Banner */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 hover:border-emerald-500/40 transition-all">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img
            src={user?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username}`}
            alt={user?.full_name}
            className="w-24 h-24 rounded-full border-4 border-emerald-500/80 bg-slate-100 object-cover shadow-md"
          />
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {user?.full_name}
              </h1>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                @{user?.username}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            <div className="mt-2.5 flex items-center justify-center sm:justify-start gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1 text-amber-700">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                {user?.eco_credits} Credits
              </span>
              <span className="flex items-center gap-1 text-orange-700">
                <Flame className="w-3.5 h-3.5 fill-current text-orange-500" />
                {user?.current_streak} Day Streak
              </span>
              <span className="flex items-center gap-1 text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Score: {user?.eco_score}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1.5 min-w-[220px]">
          <span className="font-bold text-emerald-800 block mb-1">Household Specs</span>
          <div className="flex justify-between text-slate-600">
            <span>Dwelling:</span>
            <span className="font-semibold text-slate-900">{household?.home_type || "2BHK"}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Occupants:</span>
            <span className="font-semibold text-slate-900">{household?.household_members || 3} members</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Area:</span>
            <span className="font-semibold text-slate-900">{household?.area_sqft || 1000} sq.ft</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 border border-slate-200 shadow-inner max-w-fit">
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
                  ? "bg-emerald-600 text-white font-black shadow-sm scale-[1.02]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
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
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 hover:border-emerald-500/40 transition-all">
          <div>
            <h3 className="font-black text-lg text-slate-900">
              Daily Carbon Target & Benchmark Adjustment
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Tune your daily CO₂ allowance. Remaining below this limit qualifies you for daily EcoCredits.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 max-w-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">Daily Target Ceiling</span>
              <span className="text-xl font-black text-emerald-700">{dailyTarget} kg CO₂ / day</span>
            </div>
            <input
              type="range"
              min="4.0"
              max="35.0"
              step="0.5"
              value={dailyTarget}
              onChange={(e) => setDailyTarget(parseFloat(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-semibold">
              <span>Strict (4.0 kg)</span>
              <span>Moderate (12.5 kg)</span>
              <span>High (35.0 kg)</span>
            </div>

            <button
              onClick={handleSaveBudgetTarget}
              disabled={savingHousehold}
              className="mt-5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingHousehold ? "Saving..." : "Save Target"}</span>
            </button>
          </div>

          {/* Inventoried Appliances List */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="font-bold text-sm text-slate-900 mb-3">
              Inventoried Household Appliances ({household?.appliances?.length || 0})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {household?.appliances?.map((ha) => (
                <div
                  key={ha.id}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between"
                >
                  <span className="font-bold text-xs text-slate-900">{ha.name}</span>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
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
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 hover:border-emerald-500/40 transition-all">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase text-emerald-700 tracking-wider">
                  Environmental Honors
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <h3 className="font-black text-xl text-slate-900 mt-0.5">Achievements & 3D Badges</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Unlock milestones to earn bonus EcoCredits and showcase flair on the leaderboard.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              {achievements.filter((a) => a.is_unlocked).length} of {achievements.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {achievements.map((ach) => (
              <CardTilt3D
                key={ach.id}
                maxTilt={6}
                scale={1.02}
                className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                  ach.is_unlocked
                    ? "bg-white border-emerald-200 shadow-sm hover:border-emerald-500"
                    : "bg-slate-50 border-slate-200 opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    {/* 3D Enamel Badge Icon */}
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
                      <Coins className="w-3 h-3 text-amber-500" />
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

      {/* TAB 3: PROFILE & SECURITY */}
      {activeTab === "security" && (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 max-w-xl hover:border-emerald-500/40 transition-all">
          <div className="mb-6">
            <h3 className="font-black text-lg text-slate-900">Profile Settings & Password</h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Update personal identity credentials
            </p>
          </div>

          <form onSubmit={handleSaveSecurity} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                required
              />
            </div>

            <div className="pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-900 block mb-3">
                Change Password (Optional)
              </span>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="Leave blank if not changing"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={savingSecurity}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition flex items-center gap-1.5 shadow-sm active:scale-95"
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
