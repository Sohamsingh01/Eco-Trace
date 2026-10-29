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
  Zap,
  Leaf,
  Wind,
  Utensils,
  Lightbulb,
  Flame,
  Tv,
  HelpCircle,
  TrendingDown,
  Info,
} from "lucide-react";

const COLORS = [
  "#059669", // emerald-600
  "#0ea5e9", // sky-500
  "#f59e0b", // amber-500
  "#14b8a6", // teal-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#6366f1", // indigo-500
  "#84cc16", // lime-500
];

// Helper to get category icon
function getCategoryIcon(cat = "") {
  const c = cat.toLowerCase();
  if (c.includes("cool") || c.includes("ac")) return <Wind className="w-3.5 h-3.5 text-cyan-600" />;
  if (c.includes("kitch") || c.includes("cook")) return <Utensils className="w-3.5 h-3.5 text-amber-600" />;
  if (c.includes("light")) return <Lightbulb className="w-3.5 h-3.5 text-yellow-600" />;
  if (c.includes("heat") || c.includes("water") || c.includes("geyser")) return <Flame className="w-3.5 h-3.5 text-rose-600" />;
  if (c.includes("elec") || c.includes("tv") || c.includes("ent")) return <Tv className="w-3.5 h-3.5 text-indigo-600" />;
  return <Zap className="w-3.5 h-3.5 text-emerald-600" />;
}

// Glassmorphism 3D Tooltip for Charts
function CustomChartTooltip({ active, payload, label, unit = "kg CO₂" }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-xl p-3.5 rounded-2xl border border-slate-200 shadow-xl text-xs z-50 text-slate-900 min-w-[170px]">
        <p className="font-black text-slate-900 mb-1.5 border-b border-slate-100 pb-1">
          {label || payload[0]?.name}
        </p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: entry.color || entry.fill }}
                />
                {entry.name}:
              </span>
              <span className="font-black text-emerald-700">
                {entry.value} {entry.unit || unit}
              </span>
            </div>
          ))}
          {payload[0]?.payload?.kwh !== undefined && (
            <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-100 text-[11px] text-slate-500">
              <span>Energy Draw:</span>
              <span className="font-bold text-sky-700">
                {payload[0].payload.kwh} kWh
              </span>
            </div>
          )}
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
  const [categoryMetric, setCategoryMetric] = useState("co2"); // "co2" or "kwh"
  const [selectedApplianceIndex, setSelectedApplianceIndex] = useState(null);

  // Normalize Appliance Pie Data
  const normalizedPie = (pieData || []).map((item, idx) => ({
    name: item.name || item.appliance_name || `Appliance ${idx + 1}`,
    value: Number(item.value ?? item.co2 ?? 0),
    co2: Number(item.value ?? item.co2 ?? 0),
    kwh: Number(item.kwh ?? item.energy_kwh ?? 0),
  }));
  const totalPieCarbon = normalizedPie.reduce((acc, curr) => acc + curr.value, 0);

  // Normalize Category Bar Data
  const normalizedBar = (barData || []).map((item, idx) => {
    const name = item.category || item.name || `Category ${idx + 1}`;
    const co2 = Number(item.co2 ?? item.value ?? 0);
    const kwh = Number(item.kwh ?? item.energy_kwh ?? 0);
    return {
      name,
      category: name,
      co2,
      kwh,
      value: categoryMetric === "co2" ? co2 : kwh,
    };
  });
  const totalBarCarbon = normalizedBar.reduce((acc, curr) => acc + curr.co2, 0);
  const totalBarKwh = normalizedBar.reduce((acc, curr) => acc + curr.kwh, 0);

  const hasLineData = lineData && lineData.length > 0;
  const hasPieData = normalizedPie.length > 0 && totalPieCarbon > 0;
  const hasBarData = normalizedBar.length > 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 transition-all duration-300 text-slate-900 hover:border-emerald-500/40">
      {/* Top Header & Tab Navigation Controls */}
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

      {/* 1. EMISSION TRENDS: Dual Line/Area Charts */}
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
              <div className="space-y-2 min-w-0">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Carbon Emissions Trend (kg CO₂)</span>
                  <span className="text-[10px] text-emerald-700 font-semibold">
                    Target vs Actual
                  </span>
                </div>
                <div className="w-full min-w-0" style={{ height: "260px", minHeight: "260px" }}>
                  <ResponsiveContainer key="overview-line" width="100%" height={260} minWidth={0} minHeight={260}>
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
              <div className="space-y-2 min-w-0">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Electricity Consumption History (kWh)</span>
                  <span className="text-[10px] text-teal-700 font-semibold">
                    0.82 kg/kWh Baseline
                  </span>
                </div>
                <div className="w-full min-w-0" style={{ height: "260px", minHeight: "260px" }}>
                  <ResponsiveContainer key="overview-area" width="100%" height={260} minWidth={0} minHeight={260}>
                    <AreaChart
                      data={areaData && areaData.length > 0 ? areaData : lineData}
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
                        dataKey={areaData && areaData.length > 0 ? "energy_kwh" : "total_energy"}
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

      {/* 2. APPLIANCE SHARE: Donut Chart with Center Metric & Rich Contributors List */}
      {activeTab === "appliances" && (
        <>
          {!hasPieData ? (
            <EmptyChartState
              title="No appliance activity recorded for breakdown"
              onAction={onOpenLogModal}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Donut Chart Container with Center Metric Badge */}
              <div
                className="md:col-span-7 min-w-0 relative flex items-center justify-center"
                style={{ height: "290px", minHeight: "290px" }}
              >
                <ResponsiveContainer
                  key="appliances-donut"
                  width="100%"
                  height={290}
                  minWidth={0}
                  minHeight={290}
                >
                  <PieChart>
                    <Pie
                      data={normalizedPie}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={105}
                      paddingAngle={3}
                      stroke="#ffffff"
                      strokeWidth={2.5}
                      onMouseEnter={(_, index) => setSelectedApplianceIndex(index)}
                      onMouseLeave={() => setSelectedApplianceIndex(null)}
                    >
                      {normalizedPie.map((entry, index) => (
                        <Cell
                          key={`pie-cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          opacity={
                            selectedApplianceIndex === null || selectedApplianceIndex === index
                              ? 1
                              : 0.45
                          }
                          className="transition-all duration-200 cursor-pointer"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomChartTooltip unit="kg CO₂" />} />
                  </PieChart>
                </ResponsiveContainer>

                {/* Donut Hollow Center Badge */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    Total Carbon
                  </span>
                  <div className="flex items-baseline gap-0.5 mt-0.5">
                    <span className="text-2xl font-black text-slate-900 tracking-tight">
                      {totalPieCarbon.toFixed(1)}
                    </span>
                    <span className="text-xs font-black text-emerald-700">kg</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mt-1 shadow-xs">
                    {normalizedPie.length} Devices Active
                  </span>
                </div>
              </div>

              {/* Rich Contributors Legend List */}
              <div className="md:col-span-5 space-y-2.5 min-w-0">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Top Emission Contributors
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    Share (%)
                  </span>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {normalizedPie.map((entry, idx) => {
                    const pct = totalPieCarbon > 0
                      ? ((entry.value / totalPieCarbon) * 100).toFixed(1)
                      : "0.0";
                    const isHovered = selectedApplianceIndex === idx;

                    return (
                      <div
                        key={entry.name}
                        onMouseEnter={() => setSelectedApplianceIndex(idx)}
                        onMouseLeave={() => setSelectedApplianceIndex(null)}
                        className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all cursor-pointer ${
                          isHovered
                            ? "bg-emerald-50/70 border-emerald-300 shadow-sm scale-[1.01]"
                            : "bg-slate-50 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Rank Icon / Medal */}
                          <span
                            className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${
                              idx === 0
                                ? "bg-amber-100 text-amber-800 border border-amber-300"
                                : idx === 1
                                ? "bg-slate-200 text-slate-700 border border-slate-300"
                                : idx === 2
                                ? "bg-amber-50 text-amber-900 border border-amber-200"
                                : "bg-white text-slate-600 border border-slate-200"
                            }`}
                          >
                            {idx + 1}
                          </span>

                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                            style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                          />

                          <div className="min-w-0">
                            <span className="font-extrabold text-slate-900 truncate block text-xs">
                              {entry.name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                              {entry.kwh > 0 ? `${entry.kwh} kWh draw` : "Grid connected"}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0 pl-2">
                          <span className="font-black text-slate-900 block text-xs">
                            {entry.value} kg
                          </span>
                          <span className="text-[10px] font-extrabold text-emerald-700 bg-white px-1.5 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                            {pct}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* 3. CATEGORIES: Bar Chart with Metric Switcher & Visual Matrix */}
      {activeTab === "categories" && (
        <>
          {!hasBarData ? (
            <EmptyChartState
              title="No category breakdown available yet"
              onAction={onOpenLogModal}
            />
          ) : (
            <div className="space-y-5 min-w-0">
              {/* Category Controls Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                <div>
                  <span className="text-xs font-black text-slate-900 block">
                    Emissions Breakdown by Room / Usage Category
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Total load across household operational zones
                  </span>
                </div>

                {/* Metric Selector (CO2 vs kWh) */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold">
                  <button
                    onClick={() => setCategoryMetric("co2")}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      categoryMetric === "co2"
                        ? "bg-white text-emerald-800 font-black shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Carbon (kg CO₂)
                  </button>
                  <button
                    onClick={() => setCategoryMetric("kwh")}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      categoryMetric === "kwh"
                        ? "bg-white text-emerald-800 font-black shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Electricity (kWh)
                  </button>
                </div>
              </div>

              {/* Bar Chart Container */}
              <div className="w-full min-w-0" style={{ height: "260px", minHeight: "260px" }}>
                <ResponsiveContainer
                  key={`categories-bar-${categoryMetric}`}
                  width="100%"
                  height={260}
                  minWidth={0}
                  minHeight={260}
                >
                  <BarChart
                    data={normalizedBar}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  >
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
                    <Tooltip
                      content={
                        <CustomChartTooltip
                          unit={categoryMetric === "co2" ? "kg CO₂" : "kWh"}
                        />
                      }
                    />
                    <Bar
                      dataKey="value"
                      name={categoryMetric === "co2" ? "Emissions (kg CO₂)" : "Energy (kWh)"}
                      radius={[8, 8, 0, 0]}
                    >
                      {normalizedBar.map((entry, index) => (
                        <Cell
                          key={`cat-cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Category Breakdown Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {normalizedBar.map((cat, idx) => {
                  const sharePct = totalBarCarbon > 0
                    ? ((cat.co2 / totalBarCarbon) * 100).toFixed(1)
                    : "0.0";

                  return (
                    <div
                      key={cat.name}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                            {getCategoryIcon(cat.name)}
                          </span>
                          <span className="font-extrabold text-xs text-slate-900">
                            {cat.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {sharePct}%
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between text-xs pt-1">
                        <span className="text-slate-500 font-medium">Carbon:</span>
                        <span className="font-black text-slate-900">
                          {cat.co2} kg CO₂
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between text-xs">
                        <span className="text-slate-500 font-medium">Energy:</span>
                        <span className="font-bold text-sky-700">
                          {cat.kwh} kWh
                        </span>
                      </div>

                      {/* Mini Gradient Progress Bar */}
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, parseFloat(sharePct))}%`,
                            backgroundColor: COLORS[idx % COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
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
