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
  Zap,
  Leaf,
  Filter,
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Layers,
  Clock,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

// Custom Glassmorphism Tooltip for Analytics in Dark Theme
function AnalyticsChartTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#040e07]/95 backdrop-blur-xl p-3.5 rounded-2xl border border-emerald-500/40 shadow-2xl text-xs z-50 text-white">
        <p className="font-black text-white mb-1.5 border-b border-emerald-900/60 pb-1">
          {label}
        </p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={`entry-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-emerald-200/80 font-medium">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}:
              </span>
              <span className="font-black text-lime-300">{entry.value}</span>
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
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

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
          showToast("CSV telemetry exported successfully!", "success");
        })
        .catch((err) => {
          showToast("Failed to download CSV export.", "error");
        });
    } catch (err) {
      showToast("Export error.", "error");
    }
  };

  const {
    summary = {},
    daily_series = [],
    category_breakdown = [],
    top_appliances = [],
  } = analyticsData || {};

  return (
    <div className="space-y-6 pb-12 relative z-10 text-white">
      {/* Page Title & Controls Strip */}
      <CardTilt3D
        maxTilt={3}
        scale={1.005}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#07180F]/90 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-emerald-500/25 shadow-xl shadow-black/50 hover:border-emerald-400/50 transition-all"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase text-emerald-400 tracking-wider">
              Telemetry Intelligence
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Carbon & Energy Analytics
          </h1>
          <p className="text-xs text-emerald-200/60 mt-1 max-w-xl">
            Audit historical energy consumption, top consuming appliances, and budget compliance over time.
          </p>
        </div>

        {/* Date Filter & Export Button */}
        <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
          <div className="flex items-center p-1 rounded-2xl bg-[#040e07] border border-emerald-500/20 shadow-inner">
            {["today", "7d", "30d", "year"].map((r) => (
              <button
                key={r}
                onClick={() => setRangeType(r)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all capitalize ${
                  rangeType === r
                    ? "bg-emerald-500 text-charcoal-950 font-black shadow-md scale-[1.02]"
                    : "text-emerald-200/70 hover:text-white hover:bg-emerald-950/40"
                }`}
              >
                {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : r}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-lime-400 active:scale-95 text-charcoal-950 text-xs font-black shadow-lg shadow-emerald-500/25 transition"
            title="Download CSV export"
          >
            <Download className="w-4 h-4 text-charcoal-950" />
            <span>Export CSV</span>
          </button>
        </div>
      </CardTilt3D>

      {/* Summary KPI Strip with 3D Tilt Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <CardTilt3D
          maxTilt={6}
          scale={1.02}
          className="bg-[#07180F]/90 backdrop-blur-xl p-5 rounded-3xl border border-emerald-500/25 shadow-xl shadow-black/50 hover:border-emerald-400/50 flex flex-col justify-between"
        >
          <span className="text-[11px] font-extrabold uppercase text-emerald-300/80 tracking-wider">
            Total Period CO₂
          </span>
          <div className="flex items-baseline gap-1 my-1.5">
            <span className="text-3xl font-black text-white tracking-tight">
              <AnimatedCounter value={summary.total_co2_kg ?? 0} decimals={1} />
            </span>
            <span className="text-sm font-bold text-emerald-400">kg</span>
          </div>
          <span className="text-[11px] text-emerald-200/60 font-medium">
            Avg: {summary.avg_daily_co2_kg ?? 0} kg / day
          </span>
        </CardTilt3D>

        <CardTilt3D
          maxTilt={6}
          scale={1.02}
          className="bg-[#07180F]/90 backdrop-blur-xl p-5 rounded-3xl border border-emerald-500/25 shadow-xl shadow-black/50 hover:border-emerald-400/50 flex flex-col justify-between"
        >
          <span className="text-[11px] font-extrabold uppercase text-emerald-300/80 tracking-wider">
            Total Electricity
          </span>
          <div className="flex items-baseline gap-1 my-1.5">
            <span className="text-3xl font-black text-white tracking-tight">
              <AnimatedCounter value={summary.total_energy_kwh ?? 0} decimals={1} />
            </span>
            <span className="text-sm font-bold text-emerald-400">kWh</span>
          </div>
          <span className="text-[11px] text-emerald-200/60 font-medium">
            Avg: {summary.avg_daily_kwh ?? 0} kWh / day
          </span>
        </CardTilt3D>

        <CardTilt3D
          maxTilt={6}
          scale={1.02}
          className="bg-[#07180F]/90 backdrop-blur-xl p-5 rounded-3xl border border-emerald-500/25 shadow-xl shadow-black/50 hover:border-emerald-400/50 flex flex-col justify-between"
        >
          <span className="text-[11px] font-extrabold uppercase text-emerald-300/80 tracking-wider">
            Budget Compliance
          </span>
          <div className="flex items-baseline gap-1 my-1.5">
            <span className="text-3xl font-black text-lime-300 tracking-tight">
              <AnimatedCounter value={summary.under_budget_days ?? 0} decimals={0} />
            </span>
            <span className="text-xs font-semibold text-emerald-200/70">days under target</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-bold">
            Target: {summary.daily_target_kg} kg/day
          </span>
        </CardTilt3D>

        <CardTilt3D
          maxTilt={6}
          scale={1.02}
          className="bg-[#07180F]/90 backdrop-blur-xl p-5 rounded-3xl border border-emerald-500/25 shadow-xl shadow-black/50 hover:border-emerald-400/50 flex flex-col justify-between"
        >
          <span className="text-[11px] font-extrabold uppercase text-emerald-300/80 tracking-wider">
            Logged Telemetry
          </span>
          <div className="flex items-baseline gap-1 my-1.5">
            <span className="text-3xl font-black text-white tracking-tight">
              <AnimatedCounter value={summary.total_activities_logged ?? 0} decimals={0} />
            </span>
            <span className="text-xs font-semibold text-emerald-200/70">activities</span>
          </div>
          <span className="text-[11px] text-emerald-200/60 font-medium">
            In selected timeframe
          </span>
        </CardTilt3D>
      </div>

      {/* Main Charts: Daily Emission Trend Line & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Time-Series Line Chart */}
        <div className="lg:col-span-2 bg-[#07180F]/90 backdrop-blur-xl rounded-3xl border border-emerald-500/25 shadow-xl shadow-black/50 p-6 hover:border-emerald-400/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-black text-lg text-white">
                Daily Carbon Emissions vs Budget Target
              </h3>
              <p className="text-xs text-emerald-200/60">
                Trend analysis showing days within target limits
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-300 bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-500/30">
              {daily_series.length} Days Recorded
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={daily_series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#0c351f" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6ee7b7" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6ee7b7" }} axisLine={false} tickLine={false} />
                <Tooltip content={<AnalyticsChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px", color: "#a7f3d0" }} />
                <Line
                  type="monotone"
                  dataKey="co2_kg"
                  name="Emissions (kg CO₂)"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#10B981", stroke: "#040e07", strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: "#34D399", stroke: "#ffffff", strokeWidth: 2 }}
                  animationDuration={1200}
                />
                <Line
                  type="monotone"
                  dataKey="energy_kwh"
                  name="Energy (kWh)"
                  stroke="#34D399"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={false}
                  animationDuration={1200}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Contribution Bar Chart */}
        <div className="lg:col-span-1 bg-[#07180F]/90 backdrop-blur-xl rounded-3xl border border-emerald-500/25 shadow-xl shadow-black/50 p-6 flex flex-col justify-between hover:border-emerald-400/50 transition-all">
          <div>
            <div className="mb-4">
              <h3 className="font-black text-lg text-white">Emissions by Category</h3>
              <p className="text-xs text-emerald-200/60">Percentage contribution</p>
            </div>

            <div className="space-y-3.5">
              {category_breakdown.map((cat) => (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-white">{cat.category}</span>
                    <span className="text-lime-300">{cat.co2_kg} kg ({cat.percent}%)</span>
                  </div>
                  <div className="w-full h-2 bg-[#040e07] rounded-full overflow-hidden border border-emerald-500/20">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 rounded-full transition-all duration-700"
                      style={{ width: `${cat.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-900/40 flex items-center gap-1.5 text-[11px] text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-lime-400" />
            <span>Normalized against total energy consumed</span>
          </div>
        </div>
      </div>

      {/* Top Consuming Appliances Ranking Table */}
      <div className="bg-[#07180F]/90 backdrop-blur-xl rounded-3xl border border-emerald-500/25 shadow-xl shadow-black/50 p-6 hover:border-emerald-400/50 transition-all">
        <div className="mb-4">
          <h3 className="font-black text-lg text-white">
            Top Energy-Consuming Appliances
          </h3>
          <p className="text-xs text-emerald-200/60">
            Ranked by aggregate carbon footprint in selected timeframe
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-emerald-900/60 text-emerald-300/70 font-bold uppercase tracking-wider">
                <th className="pb-3 pl-2">Rank & Appliance</th>
                <th className="pb-3">Category</th>
                <th className="pb-3 text-right">Runtime (Hours)</th>
                <th className="pb-3 text-right">Total Energy</th>
                <th className="pb-3 text-right">Total CO₂</th>
                <th className="pb-3 text-right pr-2">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/40">
              {top_appliances.map((app, idx) => (
                <tr key={app.name} className="hover:bg-emerald-950/30 transition">
                  <td className="py-3.5 pl-2 font-bold text-white flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-[10px]">
                      {idx + 1}
                    </span>
                    {app.name}
                  </td>
                  <td className="py-3.5 text-emerald-200/80">
                    <span className="px-2 py-0.5 rounded-md bg-[#040e07] border border-emerald-500/20 text-emerald-300 font-medium text-[10px]">
                      {app.category}
                    </span>
                  </td>
                  <td className="py-3.5 text-right font-medium text-emerald-100/70">
                    {app.total_hours} hrs
                  </td>
                  <td className="py-3.5 text-right font-medium text-emerald-300">
                    {app.total_kwh} kWh
                  </td>
                  <td className="py-3.5 text-right font-black text-lime-300">
                    {app.total_co2_kg} kg
                  </td>
                  <td className="py-3.5 text-right pr-2 font-bold text-emerald-400">
                    {app.percentage_share}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
