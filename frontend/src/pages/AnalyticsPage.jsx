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

// Custom Glassmorphism Tooltip for Analytics
function AnalyticsChartTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-100 shadow-eco-lg text-xs z-50">
        <p className="font-extrabold text-charcoal-900 mb-1.5 border-b border-gray-100 pb-1">
          {label}
        </p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={`entry-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-charcoal-600 font-medium">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}:
              </span>
              <span className="font-black text-forest-900">{entry.value}</span>
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
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.blob())
        .then((blob) => {
          const downloadUrl = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = downloadUrl;
          a.download = `ecotrace_telemetry_${Date.now()}.csv`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          showToast("Activity history exported as CSV successfully!", "success");
        });
    } catch (err) {
      showToast("Failed to download CSV export.", "error");
    }
  };

  const {
    summary = {},
    daily_series = [],
    top_appliances = [],
    category_breakdown = [],
  } = analyticsData || {};

  return (
    <div className="space-y-6 pb-12 relative z-10">
      {/* Header & Controls */}
      <CardTilt3D
        maxTilt={3}
        scale={1.005}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-forest-100 shadow-eco"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase text-emerald-700 tracking-wider">
              Telemetry Intelligence
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900 tracking-tight">
            Carbon & Energy Analytics
          </h1>
          <p className="text-xs text-charcoal-500 mt-1 max-w-xl">
            Audit historical energy consumption, top consuming appliances, and budget compliance over time.
          </p>
        </div>

        {/* Date Filter & Export Button */}
        <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
          <div className="flex items-center p-1 rounded-2xl bg-forest-50 border border-forest-100/90 shadow-inner">
            {["today", "7d", "30d", "year"].map((r) => (
              <button
                key={r}
                onClick={() => setRangeType(r)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all capitalize ${
                  rangeType === r
                    ? "bg-forest-800 text-white shadow-eco scale-[1.02]"
                    : "text-charcoal-600 hover:text-forest-900 hover:bg-white/60"
                }`}
              >
                {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : r}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 active:scale-95 text-white text-xs font-bold shadow-eco hover:shadow-eco-lg transition"
            title="Download CSV export"
          >
            <Download className="w-4 h-4 text-limeAccent" />
            <span>Export CSV</span>
          </button>
        </div>
      </CardTilt3D>

      {/* Summary KPI Strip with 3D Tilt Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <CardTilt3D
          maxTilt={6}
          scale={1.02}
          className="bg-gradient-to-b from-forest-50/70 via-white to-forest-50/20 p-5 rounded-2xl border border-forest-100/90 shadow-eco flex flex-col justify-between"
        >
          <span className="text-[11px] font-bold uppercase text-charcoal-500 tracking-wider">
            Total Period CO₂
          </span>
          <div className="flex items-baseline gap-1 my-1.5">
            <span className="text-3xl font-black text-forest-900 tracking-tight">
              <AnimatedCounter value={summary.total_co2_kg ?? 0} decimals={1} />
            </span>
            <span className="text-sm font-semibold text-charcoal-500">kg</span>
          </div>
          <span className="text-[11px] text-charcoal-400 font-medium">
            Avg: {summary.avg_daily_co2_kg ?? 0} kg / day
          </span>
        </CardTilt3D>

        <CardTilt3D
          maxTilt={6}
          scale={1.02}
          className="bg-gradient-to-b from-emerald-50/70 via-white to-emerald-50/20 p-5 rounded-2xl border border-emerald-100/90 shadow-eco flex flex-col justify-between"
        >
          <span className="text-[11px] font-bold uppercase text-charcoal-500 tracking-wider">
            Total Electricity
          </span>
          <div className="flex items-baseline gap-1 my-1.5">
            <span className="text-3xl font-black text-emerald-600 tracking-tight">
              <AnimatedCounter value={summary.total_energy_kwh ?? 0} decimals={1} />
            </span>
            <span className="text-sm font-semibold text-charcoal-500">kWh</span>
          </div>
          <span className="text-[11px] text-charcoal-400 font-medium">
            Avg: {summary.avg_daily_kwh ?? 0} kWh / day
          </span>
        </CardTilt3D>

        <CardTilt3D
          maxTilt={6}
          scale={1.02}
          className="bg-gradient-to-b from-amber-50/70 via-white to-amber-50/20 p-5 rounded-2xl border border-amber-100/90 shadow-eco flex flex-col justify-between"
        >
          <span className="text-[11px] font-bold uppercase text-charcoal-500 tracking-wider">
            Budget Compliance
          </span>
          <div className="flex items-baseline gap-1 my-1.5">
            <span className="text-3xl font-black text-forest-900 tracking-tight">
              <AnimatedCounter value={summary.under_budget_days ?? 0} decimals={0} />
            </span>
            <span className="text-xs font-semibold text-charcoal-500">days under target</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-bold">
            Target: {summary.daily_target_kg} kg/day
          </span>
        </CardTilt3D>

        <CardTilt3D
          maxTilt={6}
          scale={1.02}
          className="bg-gradient-to-b from-sky-50/70 via-white to-sky-50/20 p-5 rounded-2xl border border-sky-100/90 shadow-eco flex flex-col justify-between"
        >
          <span className="text-[11px] font-bold uppercase text-charcoal-500 tracking-wider">
            Logged Telemetry
          </span>
          <div className="flex items-baseline gap-1 my-1.5">
            <span className="text-3xl font-black text-charcoal-900 tracking-tight">
              <AnimatedCounter value={summary.total_activities_logged ?? 0} decimals={0} />
            </span>
            <span className="text-xs font-semibold text-charcoal-500">activities</span>
          </div>
          <span className="text-[11px] text-charcoal-400 font-medium">
            In selected timeframe
          </span>
        </CardTilt3D>
      </div>

      {/* Main Charts: Daily Emission Trend Line & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Time-Series Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-forest-100 shadow-eco p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-base text-forest-950">
                Daily Carbon Emissions vs Budget Target
              </h3>
              <p className="text-xs text-charcoal-400">
                Trend analysis showing days within target limits
              </p>
            </div>
            <span className="text-xs font-bold text-forest-800 bg-forest-50 px-3 py-1 rounded-full border border-forest-100">
              {daily_series.length} Days Recorded
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={daily_series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <Tooltip content={<AnalyticsChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Line
                  type="monotone"
                  dataKey="co2_kg"
                  name="Emissions (kg CO₂)"
                  stroke="#166534"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#166534", stroke: "#ffffff", strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: "#22c55e", stroke: "#ffffff", strokeWidth: 2 }}
                  animationDuration={1200}
                />
                <Line
                  type="monotone"
                  dataKey="energy_kwh"
                  name="Energy (kWh)"
                  stroke="#22C55E"
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
        <div className="lg:col-span-1 bg-white rounded-3xl border border-forest-100 shadow-eco p-6 flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h3 className="font-extrabold text-base text-forest-950">Emissions by Category</h3>
              <p className="text-xs text-charcoal-400">Percentage contribution</p>
            </div>

            <div className="space-y-3">
              {category_breakdown.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-charcoal-800">{cat.category}</span>
                    <span className="text-forest-900">{cat.co2_kg} kg ({cat.percent}%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-forest-800 to-emerald-500 rounded-full transition-all duration-700"
                      style={{ width: `${cat.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-[11px] text-charcoal-500">
            <Sparkles className="w-3.5 h-3.5 text-limeAccent" />
            <span>Normalized against total energy consumed</span>
          </div>
        </div>
      </div>

      {/* Top Consuming Appliances Ranking Table */}
      <div className="bg-white rounded-3xl border border-forest-100 shadow-eco p-6">
        <div className="mb-4">
          <h3 className="font-extrabold text-base text-forest-950">
            Top Energy-Consuming Appliances
          </h3>
          <p className="text-xs text-charcoal-400">
            Ranked by aggregate carbon footprint in selected timeframe
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-charcoal-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 pl-2">Rank & Appliance</th>
                <th className="pb-3">Category</th>
                <th className="pb-3 text-right">Runtime (Hours)</th>
                <th className="pb-3 text-right">Total Energy</th>
                <th className="pb-3 text-right">Total CO₂</th>
                <th className="pb-3 text-right pr-2">Emission Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {top_appliances.map((app, idx) => (
                <tr key={app.name} className="hover:bg-forest-50/50 transition duration-150">
                  <td className="py-3 pl-2 font-bold text-charcoal-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    {app.name}
                  </td>
                  <td className="py-3 text-charcoal-600">
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium text-[10px]">
                      {app.category}
                    </span>
                  </td>
                  <td className="py-3 text-right font-medium text-charcoal-700">
                    {app.total_hours} hrs
                  </td>
                  <td className="py-3 text-right font-medium text-charcoal-700">
                    {app.energy_kwh} kWh
                  </td>
                  <td className="py-3 text-right font-black text-forest-900">
                    {app.co2_kg} kg
                  </td>
                  <td className="py-3 text-right pr-2 font-bold text-emerald-600">
                    {app.share_percent}%
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
