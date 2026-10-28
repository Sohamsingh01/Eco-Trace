import React, { useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import {
  PieChart as PieIcon,
  LineChart as LineIcon,
  BarChart2,
  Activity,
  Plus,
} from "lucide-react";

const COLORS = [
  "#10B981", // emerald
  "#34D399", // light emerald
  "#A7F3D0", // mint
  "#BEF264", // lime
  "#06B6D4", // cyan
  "#F59E0B", // amber
  "#8B5CF6", // purple
  "#EC4899", // pink
];

// Custom Glassmorphism 3D Tooltip for Dark Theme
function CustomChartTooltip({ active, payload, label, unit = "kg CO₂" }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#040e07]/95 backdrop-blur-xl p-3.5 rounded-2xl border border-emerald-500/40 shadow-2xl text-xs z-50 text-white">
        <p className="font-black text-white mb-1.5 border-b border-emerald-900/60 pb-1">
          {label}
        </p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-emerald-200/80 font-medium">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: entry.color || entry.fill }}
                />
                {entry.name}:
              </span>
              <span className="font-black text-lime-300">
                {entry.value} {unit}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export default function DashboardCharts({
  pieData = [],
  barData = [],
  lineData = [],
  areaData = [],
  onOpenLogModal,
}) {
  const [activeTab, setActiveTab] = useState("overview"); // overview, appliances, categories

  const hasLineData = lineData && lineData.length > 0;
  const hasPieData = pieData && pieData.length > 0;
  const hasBarData = barData && barData.length > 0;

  return (
    <div className="bg-[#07180F]/90 backdrop-blur-xl rounded-3xl border border-emerald-500/25 shadow-xl shadow-black/50 p-6 transition-all duration-300 text-white hover:border-emerald-400/50">
      {/* Chart Navigation Tabs with Animated Pill */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase text-emerald-400 tracking-wider">
              Telemetry Analytics
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <h3 className="font-black text-xl text-white mt-0.5">
            Environmental Telemetry
          </h3>
          <p className="text-xs text-emerald-200/60">
            Real-time calculations based on CEA India Baseline factors
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#040e07] border border-emerald-500/20 shadow-inner">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
              activeTab === "overview"
                ? "bg-emerald-500 text-charcoal-950 font-black shadow-md scale-[1.02]"
                : "text-emerald-200/70 hover:text-white hover:bg-emerald-950/40"
            }`}
          >
            <LineIcon className="w-3.5 h-3.5" />
            <span>Emission Trends</span>
          </button>

          <button
            onClick={() => setActiveTab("appliances")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
              activeTab === "appliances"
                ? "bg-emerald-500 text-charcoal-950 font-black shadow-md scale-[1.02]"
                : "text-emerald-200/70 hover:text-white hover:bg-emerald-950/40"
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Appliance Share</span>
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
              activeTab === "categories"
                ? "bg-emerald-500 text-charcoal-950 font-black shadow-md scale-[1.02]"
                : "text-emerald-200/70 hover:text-white hover:bg-emerald-950/40"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Categories</span>
          </button>
        </div>
      </div>

      {/* 1. EMISSION TRENDS: Dual Charts (Line CO2 History & Area Electricity Consumption) */}
      {activeTab === "overview" && (
        <>
          {!hasLineData ? (
            <EmptyChartState
              title="No historical trend data recorded yet"
              onAction={onOpenLogModal}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Line Chart: Actual CO2 vs Target Benchmark */}
              <div className="p-4 rounded-2xl bg-[#040e07]/90 border border-emerald-500/20 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Daily CO₂ Footprint vs Benchmark (kg)
                  </span>
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Past 7 Days
                  </span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#0c351f" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6ee7b7" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#6ee7b7" }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomChartTooltip unit="kg CO₂" />} />
                      <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px", color: "#a7f3d0" }} />
                      <Line
                        type="monotone"
                        dataKey="actual_co2"
                        name="Logged CO₂"
                        stroke="#10B981"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#10B981", stroke: "#040e07", strokeWidth: 2 }}
                        activeDot={{ r: 7, fill: "#34D399", stroke: "#ffffff", strokeWidth: 2 }}
                        animationDuration={1200}
                        animationEasing="ease-out"
                      />
                      <Line
                        type="monotone"
                        dataKey="target_co2"
                        name="Daily Target"
                        stroke="#EF4444"
                        strokeDasharray="4 4"
                        strokeWidth={2}
                        dot={false}
                        animationDuration={1200}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Area Chart: Electricity Consumption Trends (kWh) */}
              <div className="p-4 rounded-2xl bg-[#040e07]/90 border border-emerald-500/20 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-lime-400"></span>
                    Electricity Usage Trends (kWh)
                  </span>
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Volume
                  </span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="energyGrad3D" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.55} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#0c351f" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6ee7b7" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#6ee7b7" }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomChartTooltip unit="kWh" />} />
                      <Area
                        type="monotone"
                        dataKey="energy_kwh"
                        name="Electricity Usage"
                        stroke="#10B981"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#energyGrad3D)"
                        animationDuration={1200}
                        animationEasing="ease-out"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* 2. APPLIANCE-WISE PIE CHART */}
      {activeTab === "appliances" && (
        <>
          {!hasPieData ? (
            <EmptyChartState
              title="No appliance emissions logged yet"
              onAction={onOpenLogModal}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <div className="h-72 w-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={68}
                      outerRadius={108}
                      paddingAngle={4}
                      dataKey="value"
                      animationDuration={1000}
                      animationEasing="ease-out"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="#040e07"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomChartTooltip unit="kg CO₂" />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 m-auto w-24 h-24 rounded-full flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">
                    Total
                  </span>
                  <span className="text-base font-black text-white">
                    {pieData.reduce((acc, curr) => acc + (parseFloat(curr.value) || 0), 0).toFixed(1)}
                  </span>
                  <span className="text-[9px] text-emerald-200/60">kg CO₂</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-emerald-300 tracking-wider mb-3">
                  Top Contributing Appliances (30-Day Total)
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {pieData.map((item, idx) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#040e07] hover:bg-emerald-950/40 transition border border-emerald-500/20 text-xs text-white"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                        ></span>
                        <span className="font-semibold text-white">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-lime-300">{item.value} kg</span>
                        <span className="text-[10px] text-emerald-200/60 ml-1.5">
                          ({item.kwh || 0} kWh)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* 3. CATEGORY-WISE BAR CHART */}
      {activeTab === "categories" && (
        <>
          {!hasBarData ? (
            <EmptyChartState
              title="No category breakdown recorded yet"
              onAction={onOpenLogModal}
            />
          ) : (
            <div className="p-4 rounded-2xl bg-[#040e07]/90 border border-emerald-500/20 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white">
                  CO₂ Emissions by Household Activity Category (kg)
                </span>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Cumulative
                </span>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="barGrad3D" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34D399" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#0c351f" />
                    <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#6ee7b7" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#6ee7b7" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomChartTooltip unit="kg CO₂" />} />
                    <Bar
                      dataKey="co2"
                      name="CO₂ Emissions"
                      fill="url(#barGrad3D)"
                      radius={[8, 8, 0, 0]}
                      animationDuration={1100}
                      animationEasing="ease-out"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Polished Empty State for Charts
function EmptyChartState({ title, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[260px] bg-[#040e07]/60 rounded-2xl border border-dashed border-emerald-500/30 text-white">
      <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center mb-3 shadow-sm border border-emerald-500/20">
        <Activity className="w-6 h-6 animate-pulse" />
      </div>
      <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
      <p className="text-xs text-emerald-100/60 max-w-sm mb-4">
        Log your daily household appliance usage to generate live interactive emission analytics.
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-charcoal-950 active:scale-95 text-xs font-black shadow-md transition flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5 text-charcoal-950" />
          <span>Log First Activity</span>
        </button>
      )}
    </div>
  );
}
