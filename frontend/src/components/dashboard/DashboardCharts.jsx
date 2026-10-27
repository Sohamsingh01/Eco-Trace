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
import { PieChart as PieIcon, LineChart as LineIcon, BarChart2, Activity } from "lucide-react";

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

export default function DashboardCharts({
  pieData = [],
  barData = [],
  lineData = [],
  areaData = [],
}) {
  const [activeTab, setActiveTab] = useState("overview"); // overview, appliances, trends

  return (
    <div className="bg-white rounded-3xl border border-forest-100 shadow-eco p-6">
      {/* Chart Navigation Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="font-bold text-base text-forest-950">Environmental Analytics</h3>
          <p className="text-xs text-charcoal-400">
            Real-time visualizations from your recorded activity data
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-forest-50/70 border border-forest-100">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === "overview"
                ? "bg-forest-800 text-white shadow-sm"
                : "text-charcoal-600 hover:text-forest-900"
            }`}
          >
            <LineIcon className="w-3.5 h-3.5" />
            <span>Emission Trends</span>
          </button>

          <button
            onClick={() => setActiveTab("appliances")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === "appliances"
                ? "bg-forest-800 text-white shadow-sm"
                : "text-charcoal-600 hover:text-forest-900"
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Appliance Share</span>
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === "categories"
                ? "bg-forest-800 text-white shadow-sm"
                : "text-charcoal-600 hover:text-forest-900"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Categories</span>
          </button>
        </div>
      </div>

      {/* 1. EMISSION TRENDS: Dual Charts (Line CO2 History & Area Electricity Consumption) */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart: Actual CO2 vs Target Benchmark */}
          <div className="p-4 rounded-2xl bg-gray-50/60 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-forest-900">
                Daily CO₂ Footprint vs Benchmark (kg)
              </span>
              <span className="text-[10px] text-charcoal-400">Past 7 Days</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "12px",
                      border: "1px solid #DCFCE7",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  <Line
                    type="monotone"
                    dataKey="actual_co2"
                    name="Logged CO₂ (kg)"
                    stroke="#166534"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#166534" }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="target_co2"
                    name="Target Benchmark (kg)"
                    stroke="#EF4444"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Area Chart: Electricity Consumption Trends (kWh) */}
          <div className="p-4 rounded-2xl bg-gray-50/60 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-forest-900">
                Electricity Usage Trends (kWh)
              </span>
              <span className="text-[10px] text-charcoal-400">7-Day Volume</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "12px",
                      border: "1px solid #DCFCE7",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="energy_kwh"
                    name="Energy (kWh)"
                    stroke="#22C55E"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#energyGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 2. APPLIANCE-WISE PIE CHART */}
      {activeTab === "appliances" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="h-72 w-full flex items-center justify-center">
            {pieData.length === 0 ? (
              <div className="text-center text-xs text-charcoal-400">
                No appliance activity logged yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val, name) => [`${val} kg CO₂`, name]}
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "12px",
                      border: "1px solid #DCFCE7",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase text-charcoal-400 tracking-wider mb-3">
              Top Contributing Appliances (30-Day Total)
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {pieData.map((item, idx) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-forest-50/50 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    ></span>
                    <span className="font-semibold text-charcoal-800">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-forest-900">{item.value} kg</span>
                    <span className="text-[10px] text-charcoal-400 ml-1.5">({item.kwh} kWh)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. CATEGORY-WISE BAR CHART */}
      {activeTab === "categories" && (
        <div className="p-4 rounded-2xl bg-gray-50/60 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-forest-900">
              CO₂ Emissions by Household Activity Category (kg)
            </span>
            <span className="text-[10px] text-charcoal-400">Cumulative Breakdown</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #DCFCE7",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="co2" name="CO₂ Emissions (kg)" fill="#166534" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
