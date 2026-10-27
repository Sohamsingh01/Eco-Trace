import React, { useState, useEffect, useCallback } from "react";
import StatCard from "../components/common/StatCard";
import BudgetProgressRing from "../components/dashboard/BudgetProgressRing";
import DashboardCharts from "../components/dashboard/DashboardCharts";
import RecentActivityTable from "../components/dashboard/RecentActivityTable";
import EnergySavingTips from "../components/dashboard/EnergySavingTips";
import LogActivityModal from "../components/activity/LogActivityModal";
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
  AlertCircle
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

  const handleActivityLogged = (newLogResponse) => {
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
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#22C55E", "#BEF264", "#166534"],
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
        <div className="w-10 h-10 border-4 border-forest-800 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-semibold text-charcoal-500">Loading your environmental telemetry...</p>
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
    <div className="space-y-6 pb-12">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-forest-100 shadow-eco">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-400">
            <Calendar className="w-3.5 h-3.5 text-forest-700" />
            <span>{today_stats.date || "Today"}</span>
            <span>•</span>
            <span>{user_info.home_type || "2BHK"} ({user_info.household_members || 3} members)</span>
          </div>
          <h1 className="text-2xl font-black text-charcoal-900 tracking-tight mt-1">
            Welcome back, {user_info.full_name || user?.full_name || "Eco Citizen"}!
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            You're currently ranked <span className="font-bold text-forest-800">#{user_info.leaderboard_rank || 1}</span> on the community leaderboard.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="p-2.5 rounded-xl border border-gray-200 text-charcoal-600 hover:text-forest-900 hover:bg-forest-50 transition"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-forest-800" : ""}`} />
          </button>

          <button
            onClick={() => setIsLogModalOpen(true)}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold shadow-eco hover:shadow-eco-lg transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 text-limeAccent" />
            <span>Log Activity</span>
          </button>
        </div>
      </div>

      {/* 4 Overview Stat Cards */}
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
          subtitle="Grid CEA calculated"
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
          subtitle="Redeemable in marketplace"
        />
      </div>

      {/* Main Grid: Budget Ring (Left) & Recharts Visualizations (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Progress Ring */}
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
          />
        </div>
      </div>

      {/* Bottom Grid: Recent Activity Table & Energy Optimization Recommendations */}
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
