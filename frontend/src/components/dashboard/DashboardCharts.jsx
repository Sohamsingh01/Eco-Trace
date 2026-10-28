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
  "#059669", // emerald-600
  "#10B981", // emerald-500
  "#34D399", // light emerald
  "#14B8A6", // teal-500
  "#06B6D4", // cyan-500
  "#F59E0B", // amber-500
  "#8B5CF6", // purple-500
  "#EC4899", // pink-500
];

// Custom Glassmorphism 3D Tooltip for Light Theme
function CustomChartTooltip({ active, payload, label, unit = "kg CO₂" }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-xl p-3.5 rounded-2xl border border-slate-200 shadow-xl text-xs z-50 text-slate-900">
        <p className="font-black text-slate-900 mb-1.5 border-b border-slate-100 pb-1">
          {label}
        </p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: entry.color || entry.fill }}
                />
                {entry.name}:
              </span>
              <span className="font-black text-emerald-700">
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
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 transition-all duration-300 text-slate-900 hover:border-emerald-500/40">
      {/* Chart Navigation Tabs with Animated Pill */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase text-emerald-700 tracking-wider">
              Telemetry Analytics
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <h3 className="font-black text-xl text-slate-900 mt-0.5">
            Environmental Telemetry
          </h3>
          <p className="text-xs text-slate-500">
            Real-time calculations based on CEA India Baseline factors
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200 shadow-inner">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === "overview"
                ? "bg-emerald-600 text-white font-black shadow-xs scale-[1.02]"
                : "text-slate-600 hover:text-slate-900 hover:bg-white"
            }`}
          >
            <LineIcon className="w-3.5 h-3.5" />
            <span>Emission Trends</span>
          </button>

          <button
            onClick={() => setActiveTab("appliances")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === "appliances"
                ? "bg-emerald-600 text-white font-black shadow-xs scale-[1.02]"
                : "text-slate-600 hover:text-slate-900 hover:bg-white"
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Appliance Share</span>
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === "categories"
                ? "bg-emerald-600 text-white font-black shadow-xs scale-[1.02]"
                : "text-slate-600 hover:text-slate-900 hover:bg-white"
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
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Carbon Emissions Trend (kg CO₂)</span>
                  <span className="text-[10px] text-emerald-700 font-semibold">
                    Target vs Actual
                  </span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis
                        dataKey="date"
                        stroke="#94a3b8"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip content={<CustomChartTooltip unit="kg CO₂" />} />
                      <Legend
                        verticalAlign="top"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{ fontSize: 11, paddingBottom: 10 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="actual_co2"
                        name="Actual Output"
                        stroke="#059669"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#059669", strokeWidth: 1.5, stroke: "#ffffff" }}
                        activeDot={{ r: 6, fill: "#10b981" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="target_co2"
                        name="Budget Target"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Area Chart: Energy Consumption (kWh) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Electricity Consumption History (kWh)</span>
                  <span className="text-[10px] text-teal-700 font-semibold">
                    0.82 kg/kWh Baseline
                  </span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={areaData.length > 0 ? areaData : lineData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="energyFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis
                        dataKey="date"
                        stroke="#94a3b8"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip content={<CustomChartTooltip unit="kWh" />} />
                      <Area
                        type="monotone"
                        dataKey="total_energy"
                        name="Energy Usage"
                        stroke="#0d9488"
                        strokeWidth={2.5}
                        fill="url(#energyFill)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* 2. APPLIANCE SHARE (Donut Chart with 3D Depth) */}
      {activeTab === "appliances" && (
        <>
          {!hasPieData ? (
            <EmptyChartState
              title="No appliance activity recorded for breakdown"
              onAction={onOpenLogModal}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={3}
                      stroke="#ffffff"
                      strokeWidth={2}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomChartTooltip unit="kg CO₂" />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend Summary List */}
              <div className="md:col-span-5 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Top Emission Contributors
                </span>
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {pieData.map((entry, idx) => (
                    <div
                      key={entry.name}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                        />
                        <span className="font-semibold text-slate-800 truncate max-w-[140px]">
                          {entry.name}
                        </span>
                      </div>
                      <span className="font-black text-slate-900">
                        {entry.value} kg
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* 3. CATEGORIES BAR CHART */}
      {activeTab === "categories" && (
        <>
          {!hasBarData ? (
            <EmptyChartState
              title="No category breakdown available yet"
              onAction={onOpenLogModal}
            />
          ) : (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                Emissions Breakdown by Room / Usage Category
              </span>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomChartTooltip unit="kg CO₂" />} />
                    <Bar
                      dataKey="value"
                      name="Emissions (kg CO₂)"
                      fill="#059669"
                      radius={[8, 8, 0, 0]}
                    >
                      {barData.map((entry, index) => (
                        <Cell
                          key={`bar-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
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

function EmptyChartState({ title, onAction }) {
  return (
    <div className="py-12 flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 border border-emerald-200 shadow-xs">
        <Activity className="w-6 h-6" />
      </div>
      <h4 className="font-bold text-sm text-slate-900 mb-1">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mb-4">
        Log an appliance activity to visualize emission curves and dynamic breakdown graphs.
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Appliance Activity</span>
        </button>
      )}
    </div>
  );
}
