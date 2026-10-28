import React, { useState, useEffect, useCallback } from "react";
import StatCard from "../components/common/StatCard";
import BudgetProgressRing from "../components/dashboard/BudgetProgressRing";
import DashboardCharts from "../components/dashboard/DashboardCharts";
import RecentActivityTable from "../components/dashboard/RecentActivityTable";
import EnergySavingTips from "../components/dashboard/EnergySavingTips";
import LogActivityModal from "../components/activity/LogActivityModal";
import EcoGlobe3D from "../components/dashboard/EcoGlobe3D";
import MyEcoWorld3D from "../components/dashboard/MyEcoWorld3D";
import PhotographicFeatureCards from "../components/dashboard/PhotographicFeatureCards";
import ExploreSustainableLiving from "../components/dashboard/ExploreSustainableLiving";
import CardTilt3D from "../components/common/CardTilt3D";
import AnimatedCounter from "../components/common/AnimatedCounter";
import { NATURE_IMAGES } from "../assets/natureImages";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  Zap,
  Leaf,
  Coins,
  Flame,
  Trophy,
  Plus,
  RefreshCw,
  Sparkles,
  Calendar,
  ShieldCheck,
  TrendingUp,
  Globe2,
  TreePine,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function DashboardPage({ onNavigateTab }) {
  const { user, updateLocalUser } = useAuth();
  const { showToast } = useToast();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const fetchDashboard = useCallback(async () => {
    try {
      const data = await api.getDashboardSummary();
      setDashboardData(data);
      if (data.user_info) {
        updateLocalUser({
          eco_credits: data.user_info.eco_credits,
          eco_score: data.user_info.eco_score,
          current_streak: data.user_info.current_streak,
        });
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      showToast("Unable to load latest dashboard metrics.", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showToast, updateLocalUser]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  const handleActivityLogged = () => {
    fetchDashboard();
  };

  const handleDeleteActivity = async (id) => {
    try {
      await api.deleteActivity(id);
      showToast("Activity deleted and budget recalculated.", "info");
      fetchDashboard();
    } catch (err) {
      showToast(err.message || "Failed to delete activity.", "error");
    }
  };

  const handleVerifyDay = async () => {
    try {
      setVerifying(true);
      const res = await api.verifyDayTracking();
      if (res.bonus_credits_awarded > 0) {
        confetti({
          particleCount: 85,
          spread: 70,
          origin: { y: 0.7 },
          colors: ["#22C55E", "#BEF264", "#166534", "#4ADE80", "#F59E0B"],
        });
        showToast(`+${res.bonus_credits_awarded} EcoCredits awarded for staying under target!`, "award");
      } else {
        showToast(res.message, "success");
      }
      fetchDashboard();
    } catch (err) {
      showToast(err.message || "Failed to verify tracking.", "error");
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-forest-800 border-t-transparent rounded-full animate-spin"></div>
          <Leaf className="w-5 h-5 text-emerald-600 absolute inset-0 m-auto animate-pulse" />
        </div>
        <p className="text-xs font-bold text-forest-800 uppercase tracking-widest mt-4">
          Synchronizing Carbon Telemetry...
        </p>
      </div>
    );
  }

  const {
    today_stats = {},
    performance_vs_yesterday = {},
    charts = {},
    recent_activities = [],
    energy_saving_suggestions = [],
    user_info = {},
  } = dashboardData || {};

  return (
    <div className="space-y-8 pb-16 relative z-10">
      {/* 1. Spectacular 3D Hero Section with Nature Photography Layering */}
      <CardTilt3D
        maxTilt={2}
        scale={1.004}
        className="relative overflow-hidden rounded-3xl min-h-[320px] flex flex-col justify-between p-6 sm:p-8 shadow-eco-lg border border-forest-100 group"
      >
        {/* Background Nature Photo with Soft Atmospheric Scrim */}
        <img
          src={NATURE_IMAGES.forestHero.src}
          alt={NATURE_IMAGES.forestHero.alt}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-104 pointer-events-none opacity-45"
        />

        {/* Deep Gradient Overlay ensuring contrast and calm forest atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/95 via-forest-900/85 to-forest-950/70 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,197,94,0.18)_0%,transparent_65%)] pointer-events-none" />

        {/* Content Container */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          {/* Left Greeting & Metrics */}
          <div className="flex-1 space-y-3.5 text-white">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-limeAccent font-extrabold tracking-wide">
                <Calendar className="w-3.5 h-3.5" />
                {today_stats.date || "Today"}
              </span>
              <span className="text-white/40">•</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-black/30 backdrop-blur-md font-semibold text-forest-200 border border-white/10">
                {user_info.home_type || "2BHK"} ({user_info.household_members || 3} members)
              </span>
              <span className="text-white/40">•</span>
              <span className="text-limeAccent font-bold flex items-center gap-1 drop-shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" /> CEA Grid Baseline Active
              </span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-emerald-300 via-limeAccent to-teal-200 bg-clip-text text-transparent">
                  {user_info.full_name || user?.full_name || "Eco Citizen"}!
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-forest-100/90 mt-1.5 max-w-xl leading-relaxed">
                Your household carbon score is benchmarked against the CEA National Baseline. You're currently ranked{" "}
                <span className="font-extrabold text-limeAccent underline decoration-limeAccent decoration-2">
                  #{user_info.leaderboard_rank || 1}
                </span>{" "}
                in your community.
              </p>
            </div>

            {/* Quick Metrics Badges inside Hero */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
                <Trophy className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">
                  EcoScore:{" "}
                  <span className="text-limeAccent font-black">
                    <AnimatedCounter value={user_info.eco_score ?? 78.5} decimals={1} />
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
                <Flame className="w-4 h-4 text-orange-400 fill-current" />
                <span className="text-xs font-bold text-white">
                  Streak:{" "}
                  <span className="text-orange-300 font-black">
                    <AnimatedCounter value={user_info.current_streak ?? 1} decimals={0} suffix=" Days" />
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
                <Coins className="w-4 h-4 text-amber-300" />
                <span className="text-xs font-bold text-white">
                  EcoCredits:{" "}
                  <span className="text-amber-200 font-black">
                    <AnimatedCounter value={user_info.eco_credits ?? 150} decimals={0} />
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Center / Right: Interactive 3D Earth Globe Visual */}
          <div className="shrink-0 flex items-center justify-center w-56 h-56 sm:w-64 sm:h-64 relative">
            <EcoGlobe3D className="w-full h-full" />
            <div className="absolute -bottom-2 text-[10px] font-black text-emerald-800 bg-white/95 backdrop-blur-md border border-emerald-200 px-3.5 py-1 rounded-full shadow-sm tracking-wider uppercase">
              Live Planetary Footprint
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex lg:flex-col items-center justify-end gap-2.5 w-full lg:w-auto">
            <button
              onClick={() => setIsLogModalOpen(true)}
              className="group flex-1 lg:flex-none px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-black shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <div className="p-1 rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors">
                <Plus className="w-4 h-4 text-white group-hover:rotate-90 transition-transform duration-300" />
              </div>
              <span className="tracking-wide">Log Activity</span>
            </button>

            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="px-4 py-3 rounded-2xl border border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-md active:scale-[0.98] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 text-limeAccent ${refreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Sync Data</span>
            </button>
          </div>
        </div>
      </CardTilt3D>

      {/* 2. 4 Overview Stat Cards with 3D Dimensional Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's CO₂ Footprint"
          value={today_stats.today_co2_kg ?? "0.0"}
          unit="kg CO₂"
          icon={Leaf}
          change={
            performance_vs_yesterday.co2_diff_kg
              ? `${Math.abs(performance_vs_yesterday.co2_diff_kg)} kg`
              : "0.0 kg"
          }
          isImprovement={performance_vs_yesterday.is_lower_than_yesterday}
          colorScheme="forest"
          subtitle={`Limit: ${today_stats.daily_target_kg} kg`}
        />

        <StatCard
          title="Electricity Consumption"
          value={today_stats.today_kwh ?? "0.0"}
          unit="kWh"
          icon={Zap}
          colorScheme="emerald"
          subtitle="Grid CEA baseline"
        />

        <StatCard
          title="Remaining Budget"
          value={today_stats.remaining_budget_kg ?? "0.0"}
          unit="kg"
          icon={Flame}
          colorScheme="amber"
          subtitle={`${today_stats.budget_percent_consumed ?? 0}% consumed`}
        />

        <StatCard
          title="EcoCredits Earned"
          value={today_stats.today_credits_earned ?? 0}
          unit="Credits"
          icon={Coins}
          colorScheme="blue"
          subtitle="Redeem in marketplace"
        />
      </div>

      {/* 3. Main Analytics & Budget Gauge Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: 3D Budget Progress Ring */}
        <div className="lg:col-span-1">
          <BudgetProgressRing
            currentKg={today_stats.today_co2_kg || 0}
            targetKg={today_stats.daily_target_kg || 12.5}
            isVerified={today_stats.is_verified || false}
            onVerifyDay={handleVerifyDay}
            verifying={verifying}
          />
        </div>

        {/* Right Column: Recharts Interactive Analytics */}
        <div className="lg:col-span-2">
          <DashboardCharts
            pieData={charts.appliance_pie || []}
            barData={charts.category_bar || []}
            lineData={charts.daily_history_line || []}
            areaData={charts.energy_trend_area || []}
            onOpenLogModal={() => setIsLogModalOpen(true)}
          />
        </div>
      </div>

      {/* 4. "My Eco World" 3D Miniature Ecosystem + Large Photographic Feature Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* "My Eco World" 3D Miniature Island (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 flex flex-col justify-between text-slate-900 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
                <Globe2 className="w-4 h-4 text-emerald-600" />
              </span>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">My Eco World</h3>
                <p className="text-[11px] text-slate-500">Interactive 3D Miniature Habitat</p>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Living Habitat
            </span>
          </div>

          <MyEcoWorld3D
            ecoScore={user_info.eco_score ?? 78.5}
            streak={user_info.current_streak ?? 1}
          />
        </div>

        {/* Large Photographic Feature Cards (8 cols) */}
        <div className="lg:col-span-8">
          <PhotographicFeatureCards
            userInfo={user_info}
            todayStats={today_stats}
            onOpenLogModal={() => setIsLogModalOpen(true)}
            onNavigateTab={onNavigateTab}
          />
        </div>
      </div>

      {/* 5. Explore Sustainable Living Discovery Gallery */}
      <ExploreSustainableLiving
        onNavigateTab={onNavigateTab}
        onOpenLogModal={() => setIsLogModalOpen(true)}
      />

      {/* 6. Bottom Grid: Recent Activity Table & Energy Optimization Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <RecentActivityTable
          activities={recent_activities}
          onDeleteActivity={handleDeleteActivity}
          onOpenLogModal={() => setIsLogModalOpen(true)}
        />

        <EnergySavingTips suggestions={energy_saving_suggestions} />
      </div>

      {/* Log Activity Modal */}
      <LogActivityModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onActivityLogged={handleActivityLogged}
      />
    </div>
  );
}
