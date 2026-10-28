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
  "#166534", // forest-800
  "#22C55E", // emerald-500
  "#10B981", // teal/emerald
  "#84CC16", // lime-500
  "#06B6D4", // cyan
  "#F59E0B", // amber
  "#8B5CF6", // purple
  "#EC4899", // pink
];

// Custom Glassmorphism 3D Tooltip
function CustomChartTooltip({ active, payload, label, unit = "kg CO₂" }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-emerald-100 shadow-eco-lg text-xs z-50">
        <p className="font-extrabold text-charcoal-900 mb-1.5 border-b border-gray-100 pb-1">
          {label}
        </p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-charcoal-600 font-medium">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: entry.color || entry.fill }}
                />
                {entry.name}:
              </span>
              <span className="font-black text-forest-900">
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
    <div className="bg-white rounded-3xl border border-forest-100 shadow-eco p-6 transition-all duration-300">
      {/* Chart Navigation Tabs with Animated Pill */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase text-emerald-700 tracking-wider">
              Telemetry Analytics
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <h3 className="font-black text-lg text-forest-950 mt-0.5">
            Environmental Telemetry
          </h3>
          <p className="text-xs text-charcoal-400">
            Real-time calculations based on CEA India Baseline factors
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-forest-50/80 border border-forest-100/80 shadow-inner">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
              activeTab === "overview"
                ? "bg-forest-800 text-white shadow-eco scale-[1.02]"
                : "text-charcoal-600 hover:text-forest-900 hover:bg-white/60"
            }`}
          >
            <LineIcon className="w-3.5 h-3.5" />
            <span>Emission Trends</span>
          </button>

          <button
            onClick={() => setActiveTab("appliances")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
              activeTab === "appliances"
                ? "bg-forest-800 text-white shadow-eco scale-[1.02]"
                : "text-charcoal-600 hover:text-forest-900 hover:bg-white/60"
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Appliance Share</span>
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
              activeTab === "categories"
                ? "bg-forest-800 text-white shadow-eco scale-[1.02]"
                : "text-charcoal-600 hover:text-forest-900 hover:bg-white/60"
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
              <div className="p-4 rounded-2xl bg-gradient-to-b from-gray-50/70 to-white border border-gray-100 shadow-sm hover:shadow transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-forest-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-forest-800"></span>
                    Daily CO₂ Footprint vs Benchmark (kg)
                  </span>
                  <span className="text-[10px] font-semibold text-charcoal-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    Past 7 Days
                  </span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomChartTooltip unit="kg CO₂" />} />
                      <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                      <Line
                        type="monotone"
                        dataKey="actual_co2"
                        name="Logged CO₂"
                        stroke="#166534"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#166534", stroke: "#ffffff", strokeWidth: 2 }}
                        activeDot={{ r: 7, fill: "#22c55e", stroke: "#ffffff", strokeWidth: 2 }}
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
              <div className="p-4 rounded-2xl bg-gradient-to-b from-gray-50/70 to-white border border-gray-100 shadow-sm hover:shadow transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-forest-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Electricity Usage Trends (kWh)
                  </span>
                  <span className="text-[10px] font-semibold text-charcoal-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    Volume
                  </span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="energyGrad3D" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22C55E" stopOpacity={0.45} />
                          <stop offset="95%" stopColor="#22C55E" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomChartTooltip unit="kWh" />} />
                      <Area
                        type="monotone"
                        dataKey="energy_kwh"
                        name="Electricity Usage"
                        stroke="#22C55E"
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
                          stroke="#ffffff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val, name) => [`${val} kg CO₂`, name]}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(10px)",
                        borderRadius: "14px",
                        border: "1px solid #DCFCE7",
                        boxShadow: "0 10px 25px -5px rgba(22, 101, 52, 0.15)",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 m-auto w-24 h-24 rounded-full flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest">
                    Total
                  </span>
                  <span className="text-base font-black text-forest-900">
                    {pieData.reduce((acc, curr) => acc + (parseFloat(curr.value) || 0), 0).toFixed(1)}
                  </span>
                  <span className="text-[9px] text-charcoal-400">kg CO₂</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-charcoal-400 tracking-wider mb-3">
                  Top Contributing Appliances (30-Day Total)
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {pieData.map((item, idx) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-forest-50/50 hover:bg-forest-50 transition border border-forest-100/40 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                        ></span>
                        <span className="font-semibold text-charcoal-800">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-forest-900">{item.value} kg</span>
                        <span className="text-[10px] text-charcoal-400 ml-1.5">
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
            <div className="p-4 rounded-2xl bg-gradient-to-b from-gray-50/70 to-white border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-forest-900">
                  CO₂ Emissions by Household Activity Category (kg)
                </span>
                <span className="text-[10px] font-semibold text-charcoal-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  Cumulative
                </span>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="barGrad3D" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22C55E" />
                        <stop offset="100%" stopColor="#166534" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
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
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[260px] bg-forest-50/30 rounded-2xl border border-dashed border-forest-200">
      <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-700 flex items-center justify-center mb-3 shadow-sm">
        <Activity className="w-6 h-6 animate-pulse" />
      </div>
      <h4 className="text-sm font-bold text-charcoal-800 mb-1">{title}</h4>
      <p className="text-xs text-charcoal-500 max-w-sm mb-4">
        Log your daily household appliance usage to generate live interactive emission analytics.
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 active:scale-95 text-white text-xs font-bold shadow-eco transition flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5 text-limeAccent" />
          <span>Log First Activity</span>
        </button>
      )}
    </div>
  );
}
