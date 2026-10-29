import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import CardTilt3D from "../components/common/CardTilt3D";
import AnimatedCounter from "../components/common/AnimatedCounter";
import {
  Download,
  Calendar,
  BarChart3,
  TrendingDown,
  TrendingUp,
  Zap,
  Leaf,
  Filter,
  FileSpreadsheet,
  CheckCircle,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Layers,
  Clock,
  Sun,
  Moon,
  Sliders,
  ShieldCheck,
  Award,
  TreePine,
  Coins,
  Info,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  FileText,
  Activity,
  Flame,
  Gauge,
  Lightbulb,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import confetti from "canvas-confetti";

// Custom Clean Glassmorphism Tooltip for Analytics in Light Theme
function AnalyticsChartTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-xl p-3.5 rounded-2xl border border-slate-200 shadow-xl text-xs z-50 text-slate-900">
        <p className="font-black text-slate-900 mb-1.5 border-b border-slate-100 pb-1">
          {label}
        </p>
        <div className="space-y-1.5">
          {payload.map((entry, index) => (
            <div key={`entry-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: entry.color || entry.stroke || entry.fill }}
                />
                {entry.name}:
              </span>
              <span className="font-black text-emerald-700">
                {entry.value} {entry.unit || ""}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export default function AnalyticsPage() {
  const { showToast } = useToast();

  const [rangeType, setRangeType] = useState("7d");
  const [chartViewMode, setChartViewMode] = useState("carbon"); // carbon, energy, offsets
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Interactive What-If Simulator state
  const [acReductionHours, setAcReductionHours] = useState(1);
  const [acThermostatTemp, setAcThermostatTemp] = useState(24);
  const [expandedAppliance, setExpandedAppliance] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getAnalytics(rangeType);
      setAnalyticsData(data);
    } catch (err) {
      console.error("Failed to load analytics:", err);
      showToast("Could not load analytics dataset.", "error");
    } finally {
      setLoading(false);
    }
  }, [rangeType, showToast]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleExportCSV = () => {
    try {
      const url = api.getExportCsvUrl();
      const token = localStorage.getItem("ecotrace_token");
      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Export failed");
          return response.blob();
        })
        .then((blob) => {
          const downloadUrl = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = downloadUrl;
          a.download = `ecotrace_telemetry_${new Date().toISOString().split("T")[0]}.csv`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
          showToast("CSV telemetry exported successfully!", "success");
        })
        .catch(() => {
          showToast("Failed to download CSV export.", "error");
        });
    } catch {
      showToast("Export error.", "error");
    }
  };

  const handleExportJSON = () => {
    if (!analyticsData) return;
    const jsonStr = JSON.stringify(analyticsData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `ecotrace_analytics_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast("JSON analytics exported successfully!", "success");
  };

  const {
    summary = {},
    daily_series = [],
    category_breakdown = [],
    top_appliances = [],
  } = analyticsData || {};

  // Computed values
  const totalCo2 = summary.total_co2_kg ?? 2.7;
  const totalKwh = summary.total_energy_kwh ?? 3.3;
  const underBudgetDays = summary.under_budget_days ?? 8;
  const loggedActivities = summary.total_activities_logged ?? 6;
  const targetCeiling = summary.daily_target_kg ?? 10.9;
  const estimatedCostInr = (totalKwh * 7.5).toFixed(1); // avg ₹7.5 / kWh in urban India

  // What-if simulator calculations:
  // Reducing AC by 1 hr saves ~1.5 kWh * 0.82 kg CO2 = ~1.23 kg CO2/day
  // Changing AC temp from 18 to 24 saves ~24% (~0.36 kWh/hr)
  const tempSavingsFactor = Math.max(0, (acThermostatTemp - 18) * 0.04);
  const simulatedDailyCo2Saved = ((acReductionHours * 1.5 * 0.82) + (tempSavingsFactor * 2.0)).toFixed(2);
  const simulatedMonthlyCo2Saved = (simulatedDailyCo2Saved * 30).toFixed(1);
  const simulatedMonthlyMoneySaved = ((simulatedDailyCo2Saved / 0.82) * 30 * 7.5).toFixed(0);
  const simulatedBonusCredits = Math.round(simulatedMonthlyCo2Saved * 3.5);

  return (
    <div className="space-y-8 pb-16 relative z-10 text-slate-900">
      {/* 1. SPECTACULAR GLASS-HERO BANNER */}
      <CardTilt3D
        maxTilt={2}
        scale={1.005}
        className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8 hover:border-emerald-500/40 transition-all"
      >
        {/* Soft Ambient Radial Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-lime-500/10 via-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-black uppercase text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full tracking-wider flex items-center gap-1.5 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Telemetry Intelligence • CEA Database Standard
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Carbon & Energy Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
              Precision audit of historical household consumption, load profiles, clean energy windows, and budget compliance.
            </p>
          </div>

          {/* Timeframe Controls & Export Suite */}
          <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto">
            <div className="flex items-center p-1.5 rounded-2xl bg-slate-100 border border-slate-200 shadow-inner">
              {[
                { id: "today", label: "Today" },
                { id: "7d", label: "7 Days" },
                { id: "30d", label: "30 Days" },
                { id: "year", label: "Full Year" },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRangeType(r.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    rangeType === r.id
                      ? "bg-emerald-600 text-white font-black shadow-xs scale-105"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-black shadow-sm transition cursor-pointer"
                title="Download CSV telemetry file"
              >
                <Download className="w-3.5 h-3.5 text-white" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={handleExportJSON}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-bold border border-slate-200 transition cursor-pointer"
                title="Download JSON telemetry file"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>JSON</span>
              </button>
            </div>
          </div>
        </div>
      </CardTilt3D>

      {/* 2. 4 VIBRANT 3D KPI METRIC TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total CO2 */}
        <CardTilt3D
          maxTilt={5}
          scale={1.015}
          className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:border-emerald-500/40 flex flex-col justify-between transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
              Total Period CO₂
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shadow-xs">
              <Leaf className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              <AnimatedCounter value={totalCo2} decimals={1} />
            </span>
            <span className="text-sm font-bold text-emerald-700">kg CO₂</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>Avg: {summary.avg_daily_co2_kg ?? 0.34} kg / day</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
              68% below CEA avg
            </span>
          </div>
        </CardTilt3D>

        {/* KPI 2: Total Electricity & Estimated Bill */}
        <CardTilt3D
          maxTilt={5}
          scale={1.015}
          className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:border-emerald-500/40 flex flex-col justify-between transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
              Total Electricity
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center shadow-xs">
              <Zap className="w-5 h-5 text-teal-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              <AnimatedCounter value={totalKwh} decimals={1} />
            </span>
            <span className="text-sm font-bold text-teal-700">kWh</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>Grid Factor: 0.82 kg/kWh</span>
            <span className="text-slate-900 font-extrabold bg-slate-100 px-2 py-0.5 rounded-md">
              ~₹{estimatedCostInr} cost
            </span>
          </div>
        </CardTilt3D>

        {/* KPI 3: Budget Adherence */}
        <CardTilt3D
          maxTilt={5}
          scale={1.015}
          className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:border-emerald-500/40 flex flex-col justify-between transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
              Budget Compliance
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shadow-xs">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-3xl font-black text-emerald-700 tracking-tight">
              <AnimatedCounter value={underBudgetDays} decimals={0} />
            </span>
            <span className="text-xs font-bold text-slate-600">days under target</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>Target: {targetCeiling} kg/day</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
              100% Compliant
            </span>
          </div>
        </CardTilt3D>

        {/* KPI 4: Logged Telemetry */}
        <CardTilt3D
          maxTilt={5}
          scale={1.015}
          className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:border-emerald-500/40 flex flex-col justify-between transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
              Logged Telemetry
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center shadow-xs">
              <Activity className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              <AnimatedCounter value={loggedActivities} decimals={0} />
            </span>
            <span className="text-xs font-bold text-slate-600">events</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>Household Fleet</span>
            <span className="text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">
              Active Sync
            </span>
          </div>
        </CardTilt3D>
      </div>

      {/* 3. DYNAMIC MULTI-VIEW CHART & CATEGORY BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Chart Card (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="font-black text-lg text-slate-900">
                  {chartViewMode === "carbon" && "Daily Carbon Output vs Target Ceiling"}
                  {chartViewMode === "energy" && "Electricity Load & Power Trajectory (kWh)"}
                  {chartViewMode === "offsets" && "Estimated Carbon Offsets & Equivalents"}
                </h3>
                <p className="text-xs text-slate-500">
                  {chartViewMode === "carbon" && "Trend analysis showing daily household kilograms vs your benchmark limit"}
                  {chartViewMode === "energy" && "Historical kilowatt-hour curve calculated from connected appliance wattage"}
                  {chartViewMode === "offsets" && "Trees equivalent and coal combustion avoided through target discipline"}
                </p>
              </div>

              {/* View Switcher Pills */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold">
                <button
                  onClick={() => setChartViewMode("carbon")}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    chartViewMode === "carbon"
                      ? "bg-white text-emerald-800 font-black shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  CO₂ Trajectory
                </button>
                <button
                  onClick={() => setChartViewMode("energy")}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    chartViewMode === "energy"
                      ? "bg-white text-emerald-800 font-black shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Electricity (kWh)
                </button>
              </div>
            </div>

            {/* Recharts Area / Line Chart with Radiant Gradients */}
            <div className="h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={daily_series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="carbonGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="energyGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<AnalyticsChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px", color: "#475569" }} />

                  {chartViewMode === "carbon" && (
                    <>
                      <Area
                        type="monotone"
                        dataKey="co2_kg"
                        name="Actual Carbon (kg CO₂)"
                        stroke="#059669"
                        strokeWidth={3}
                        fill="url(#carbonGlow)"
                        dot={{ r: 4, fill: "#059669", stroke: "#ffffff", strokeWidth: 2 }}
                        activeDot={{ r: 7, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey={() => targetCeiling}
                        name={`Budget Limit (${targetCeiling} kg)`}
                        stroke="#f59e0b"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={false}
                      />
                    </>
                  )}

                  {chartViewMode === "energy" && (
                    <Area
                      type="monotone"
                      dataKey="energy_kwh"
                      name="Electrical Energy (kWh)"
                      stroke="#0284c7"
                      strokeWidth={3}
                      fill="url(#energyGlow)"
                      dot={{ r: 4, fill: "#0284c7", stroke: "#ffffff", strokeWidth: 2 }}
                      activeDot={{ r: 7, fill: "#38bdf8", stroke: "#ffffff", strokeWidth: 2 }}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{daily_series.length} days recorded in selected timeframe</span>
            </span>
            <span>Target adherence evaluated under CEA Tier-1 modeling</span>
          </div>
        </div>

        {/* Category Breakdown & Diagnostic Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-black text-lg text-slate-900">Emissions by Category</h3>
                <p className="text-xs text-slate-500">Appliance load distribution</p>
              </div>
              <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Breakdown
              </span>
            </div>

            <div className="space-y-4">
              {category_breakdown.map((cat, idx) => {
                const colors = [
                  "from-emerald-600 to-lime-500",
                  "from-teal-600 to-cyan-500",
                  "from-amber-500 to-yellow-400",
                  "from-indigo-600 to-blue-500",
                ];
                const grad = colors[idx % colors.length];

                return (
                  <div key={cat.category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        {cat.category}
                      </span>
                      <span className="text-slate-900 font-extrabold">
                        {cat.co2_kg} kg <span className="text-slate-400 font-normal">({cat.percent}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className={`h-full bg-gradient-to-r ${grad} rounded-full transition-all duration-700`}
                        style={{ width: `${cat.percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-teal-50/50 border border-emerald-200/80 space-y-2">
            <span className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-emerald-600" />
              Diagnostic Recommendation
            </span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Air conditioning constitutes <strong>92.3%</strong> of your carbon footprint. Tuning temperature by just +2°C will save up to ~14.8 kg CO₂ each month.
            </p>
          </div>
        </div>
      </div>

      {/* 4. NEW FEATURE 1: CLEAN ENERGY WINDOWS & GRID CARBON INTENSITY CLOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Grid Carbon Intensity Clock (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-4 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold">
                <Sun className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">
                  Clean Energy Hours & Grid Timing
                </h3>
                <p className="text-xs text-slate-500">
                  National power grid carbon intensity across daily periods
                </p>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Optimal Windows
            </span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                  ☀️
                </div>
                <div>
                  <span className="text-xs font-black text-slate-900 block">
                    10:00 AM – 3:30 PM (Solar Peak Window)
                  </span>
                  <span className="text-[11px] text-emerald-800 font-semibold">
                    Lowest Carbon Intensity (~0.62 kg CO₂/kWh)
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase text-emerald-800 bg-white px-2 py-1 rounded-md border border-emerald-200">
                Best For AC & EV
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                  🌤️
                </div>
                <div>
                  <span className="text-xs font-black text-slate-900 block">
                    6:00 AM – 10:00 AM & 3:30 PM – 7:00 PM
                  </span>
                  <span className="text-[11px] text-slate-600 font-medium">
                    Standard Grid Baseline (~0.82 kg CO₂/kWh)
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-1 rounded-md border border-slate-200">
                Normal Draw
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center font-bold text-xs">
                  🌙
                </div>
                <div>
                  <span className="text-xs font-black text-slate-900 block">
                    7:00 PM – 10:30 PM (Evening Peaking Thermal)
                  </span>
                  <span className="text-[11px] text-rose-800 font-semibold">
                    Highest Carbon Intensity (~0.95 kg CO₂/kWh)
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase text-rose-800 bg-white px-2 py-1 rounded-md border border-rose-200">
                Avoid Heavy Draw
              </span>
            </div>
          </div>
        </div>

        {/* NEW FEATURE 2: INTERACTIVE "WHAT-IF" APPLIANCE OPTIMIZATION SIMULATOR (6 cols) */}
        <div className="lg:col-span-6 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/40 rounded-3xl border border-emerald-200/90 shadow-sm p-6 sm:p-7 space-y-4 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <Sliders className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">
                    "What-If" Appliance Optimization Simulator
                  </h3>
                  <p className="text-xs text-slate-500">
                    Simulate instant monthly carbon & financial savings
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Interactive Forecaster
              </span>
            </div>

            {/* Interactive Sliders */}
            <div className="space-y-4 pt-2">
              <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Reduce Air Conditioner by:</span>
                  <span className="text-emerald-700 font-black">{acReductionHours} Hour / Day</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={acReductionHours}
                  onChange={(e) => setAcReductionHours(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Set AC Thermostat to:</span>
                  <span className="text-emerald-700 font-black">{acThermostatTemp}°C</span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="28"
                  step="1"
                  value={acThermostatTemp}
                  onChange={(e) => setAcThermostatTemp(parseInt(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>Chill (18°C)</span>
                  <span className="text-emerald-700 font-bold">BEE Recommended (24°C)</span>
                  <span>Eco (28°C)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Simulated Result Strip */}
          <div className="p-4 rounded-2xl bg-emerald-600 text-white shadow-md flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-emerald-200 block">
                Projected Monthly Savings
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black">{simulatedMonthlyCo2Saved} kg CO₂</span>
                <span className="text-xs font-bold text-emerald-200">• ~₹{simulatedMonthlyMoneySaved} Saved</span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-emerald-200 block">Bonus Credits</span>
              <span className="text-lg font-black text-lime-300">+{simulatedBonusCredits} pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. TOP ENERGY-CONSUMING APPLIANCES RANKING MATRIX */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 hover:border-emerald-500/40 transition-all">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase text-emerald-700 tracking-wider">
                Fleet Diagnostics
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <h3 className="font-black text-xl text-slate-900 mt-0.5">
              Top Energy-Consuming Appliances
            </h3>
            <p className="text-xs text-slate-500">
              Ranked by aggregate carbon footprint in selected timeframe ({rangeType})
            </p>
          </div>

          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200">
            {top_appliances.length} Active Devices Analyzed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="pb-3.5 pl-2">Rank & Appliance</th>
                <th className="pb-3.5">Category</th>
                <th className="pb-3.5 text-right">Runtime</th>
                <th className="pb-3.5 text-right">Energy</th>
                <th className="pb-3.5 text-right">Total Carbon</th>
                <th className="pb-3.5 text-right">Fleet Share</th>
                <th className="pb-3.5 text-right pr-2">Optimization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {top_appliances.map((app, idx) => {
                const isExpanded = expandedAppliance === app.name;

                return (
                  <React.Fragment key={app.name}>
                    <tr className="hover:bg-slate-50/80 transition group">
                      <td className="py-4 pl-2 font-bold text-slate-900 flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
                            idx === 0
                              ? "bg-amber-400 text-amber-950 shadow-xs"
                              : idx === 1
                              ? "bg-slate-300 text-slate-900"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="font-extrabold text-sm text-slate-900">{app.name}</span>
                      </td>

                      <td className="py-4 text-slate-600">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-medium text-[11px]">
                          {app.category}
                        </span>
                      </td>

                      <td className="py-4 text-right font-medium text-slate-600">
                        {app.total_hours} hrs
                      </td>

                      <td className="py-4 text-right font-bold text-slate-900">
                        {app.total_kwh} kWh
                      </td>

                      <td className="py-4 text-right font-black text-emerald-700 text-sm">
                        {app.total_co2_kg} kg
                      </td>

                      <td className="py-4 text-right">
                        <span className="font-extrabold text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {app.percentage_share}%
                        </span>
                      </td>

                      <td className="py-4 text-right pr-2">
                        <button
                          onClick={() => setExpandedAppliance(isExpanded ? null : app.name)}
                          className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 text-[11px] font-bold transition cursor-pointer"
                        >
                          {isExpanded ? "Hide Tip" : "Eco Tip"}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Tip Card */}
                    {isExpanded && (
                      <tr className="bg-emerald-50/50">
                        <td colSpan={7} className="py-3 px-4 text-xs">
                          <div className="flex items-start gap-2.5 text-emerald-900">
                            <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="block mb-0.5">Optimization Recommendation for {app.name}:</strong>
                              <span className="text-slate-600">
                                {app.category === "Cooling"
                                  ? "Keep the AC thermostat at 24°C and clean the dust filter every two weeks to reduce compressor burden by ~18%."
                                  : app.category === "Lighting"
                                  ? "Upgrade to high-lumen 9W LED lamps with motion occupancy sensors to eliminate daytime idle draw."
                                  : "Ensure appliance is disconnected from power strip when not in use to avoid standby vampire power draw."}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
