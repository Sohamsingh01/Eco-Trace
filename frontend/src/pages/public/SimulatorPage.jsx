import React, { useState } from "react";
import {
  Sparkles,
  Zap,
  Flame,
  Tv,
  Fan,
  Droplets,
  WashingMachine,
  Lightbulb,
  ArrowRight,
  TrendingDown,
  DollarSign,
  TreePine,
  CheckCircle2,
  Info,
  RotateCcw,
} from "lucide-react";
import CardTilt3D from "../../components/common/CardTilt3D";
import AnimatedCounter from "../../components/common/AnimatedCounter";

export default function SimulatorPage({ onGetStarted, onLogin }) {
  // Appliance states
  const [acType, setAcType] = useState("3star"); // 5star (1100W), 3star (1500W), 1star (2000W)
  const [acHours, setAcHours] = useState(4);
  const [tvHours, setTvHours] = useState(3);
  const [fanCount, setFanCount] = useState(3);
  const [fanHours, setFanHours] = useState(10);
  const [gasMinutes, setGasMinutes] = useState(45);
  const [inductionHours, setInductionHours] = useState(0);
  const [geyserMinutes, setGeyserMinutes] = useState(30);
  const [fridgeType, setFridgeType] = useState("inverter"); // inverter (45W avg), standard (90W avg)
  const [ledBulbs, setLedBulbs] = useState(6);

  // Power constants (Watts)
  const acWatts = acType === "5star" ? 1100 : acType === "3star" ? 1500 : 2000;
  const tvWatts = 120;
  const fanWatts = 75;
  const inductionWatts = 1800;
  const geyserWatts = 2000;
  const fridgeDailyKwh = fridgeType === "inverter" ? 0.9 : 1.8;
  const bulbWatts = 9; // 9W LED

  // Calculations
  // Electricity kWh daily
  const acKwh = (acWatts * acHours) / 1000;
  const tvKwh = (tvWatts * tvHours) / 1000;
  const fanKwh = (fanWatts * fanCount * fanHours) / 1000;
  const inductionKwh = (inductionWatts * inductionHours) / 1000;
  const geyserKwh = (geyserWatts * (geyserMinutes / 60)) / 1000;
  const bulbKwh = (bulbWatts * ledBulbs * 6) / 1000;
  const totalDailyKwh = acKwh + tvKwh + fanKwh + inductionKwh + geyserKwh + fridgeDailyKwh + bulbKwh;

  // Emissions (kg CO2)
  // Electric: CEA 0.82 kg/kWh
  const electricCo2 = totalDailyKwh * 0.82;
  // Gas: 0.15 kg/hr * 2.983 kg CO2/kg
  const gasCo2 = (gasMinutes / 60) * 0.15 * 2.983;
  const totalDailyCo2 = electricCo2 + gasCo2;

  // Monthly projections
  const monthlyKwh = totalDailyKwh * 30;
  const monthlyCo2 = totalDailyCo2 * 30;
  // Avg urban domestic tariff: ~₹7.50 per kWh
  const estimatedMonthlyBillInr = Math.round(monthlyKwh * 7.5);

  // Trees needed to sequester monthly output (~21 kg CO2/year per mature tree => 1.75 kg/month)
  const treesNeededMonthly = Math.round(monthlyCo2 / 1.75);

  // Potential savings if AC reduced by 1 hour and geyser reduced by 10 mins
  const optimizedDailyKwh =
    totalDailyKwh - (acWatts * 1) / 1000 - (geyserWatts * (10 / 60)) / 1000;
  const potentialMonthlySavedInr = Math.round(
    (totalDailyKwh - Math.max(0, optimizedDailyKwh)) * 30 * 7.5
  );

  const handleReset = () => {
    setAcType("3star");
    setAcHours(4);
    setTvHours(3);
    setFanCount(3);
    setFanHours(10);
    setGasMinutes(45);
    setInductionHours(0);
    setGeyserMinutes(30);
    setFridgeType("inverter");
    setLedBulbs(6);
  };

  return (
    <div className="space-y-20 pb-24 text-charcoal-900">
      {/* 1. HERO HEADER */}
      <section className="pt-8 lg:pt-14 text-center max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-4">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Interactive CEA India & IPCC Carbon Emission Modeling</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Live Household Simulator:{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">
            Cut Your Carbon & Electric Bill.
          </span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
          Adjust your daily appliance usage by room below. Watch your emissions, kilowatt-hours,
          and estimated monthly electricity bill in ₹ update instantaneously.
        </p>
      </section>

      {/* 2. MAIN SIMULATOR INTERFACE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Appliance Controls by Room (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Living Room Card */}
            <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-slate-900">Living Room Appliances</h3>
                    <span className="text-xs text-slate-500">Cooling, ventilation, and entertainment</span>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs text-slate-500 hover:text-emerald-700 flex items-center gap-1.5 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>
              </div>

              {/* Air Conditioner */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-700">
                    Air Conditioner Model & Star Rating:
                  </span>
                  <div className="flex items-center gap-2">
                    {[
                      { id: "5star", label: "5-Star (1.1kW)" },
                      { id: "3star", label: "3-Star (1.5kW)" },
                      { id: "1star", label: "Non-Inverter (2.0kW)" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setAcType(m.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                          acType === m.id
                            ? "bg-emerald-600 text-white font-black"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>AC Daily Runtime:</span>
                    <span className="font-bold text-slate-900">{acHours} Hours / Day</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="14"
                    step="1"
                    value={acHours}
                    onChange={(e) => setAcHours(parseInt(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Ceiling Fans */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-bold text-slate-700">Number of Active Ceiling Fans:</span>
                  <span className="font-bold text-slate-900">{fanCount} Fans (75W each)</span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <button
                      key={n}
                      onClick={() => setFanCount(n)}
                      className={`w-9 h-9 rounded-xl font-bold text-xs transition ${
                        fanCount === n
                          ? "bg-emerald-600 text-white font-black"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Average Fan Runtime per day:</span>
                    <span className="font-bold text-slate-900">{fanHours} Hours / Day</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={fanHours}
                    onChange={(e) => setFanHours(parseInt(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Smart Television */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-bold text-slate-700">55" 4K Smart TV & Audio System:</span>
                  <span className="font-bold text-slate-900">{tvHours} Hours / Day (120W)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="1"
                  value={tvHours}
                  onChange={(e) => setTvHours(parseInt(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Kitchen & Heating Card */}
            <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">Kitchen & Water Heating</h3>
                  <span className="text-xs text-slate-500">LPG gas stove, electric geyser, refrigerator</span>
                </div>
              </div>

              {/* Gas Stove */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-bold text-slate-700">LPG Double-Burner Stove Usage:</span>
                  <span className="font-bold text-amber-700">{gasMinutes} Minutes / Day (IPCC Fuel Chemistry)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="120"
                  step="5"
                  value={gasMinutes}
                  onChange={(e) => setGasMinutes(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Water Geyser */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-bold text-slate-700">Electric Storage Geyser (2000W):</span>
                  <span className="font-bold text-slate-900">{geyserMinutes} Minutes / Day</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="5"
                  value={geyserMinutes}
                  onChange={(e) => setGeyserMinutes(parseInt(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Refrigerator */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">
                    Double Door Refrigerator:
                  </span>
                  <span className="text-[11px] text-slate-500">
                    24/7 continuous thermodynamic cycling
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFridgeType("inverter")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      fridgeType === "inverter"
                        ? "bg-emerald-600 text-white font-black"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Inverter (0.9 kWh/day)
                  </button>
                  <button
                    onClick={() => setFridgeType("standard")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      fridgeType === "standard"
                        ? "bg-emerald-600 text-white font-black"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Standard (1.8 kWh/day)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Instant Telemetry Output (4 Cols - Sticky) */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <CardTilt3D
              maxTilt={4}
              className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xl space-y-5"
            >
              <div className="pb-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider block">
                    Simulated Telemetry
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-0.5">
                    Projected Household Impact
                  </h3>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              </div>

              {/* Primary Daily Carbon Output */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                  Simulated Daily Emissions
                </span>
                <div className="text-4xl font-black text-slate-900 my-1">
                  <AnimatedCounter value={totalDailyCo2} decimals={2} />
                  <span className="text-base font-bold text-emerald-700 ml-1">kg CO₂</span>
                </div>
                <span className="text-[11px] text-slate-500">
                  ≈ {totalDailyKwh.toFixed(1)} kWh equivalent electrical draw
                </span>
              </div>

              {/* Monthly Cost & Tree Sequestration Metrics */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      ₹
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Estimated Power Bill
                      </span>
                      <span className="text-base font-black text-slate-900">
                        ₹{estimatedMonthlyBillInr.toLocaleString()} / mo
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">@ ₹7.50/unit</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <TreePine className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Trees Required to Offset
                      </span>
                      <span className="text-base font-black text-slate-900">
                        {treesNeededMonthly} Mature Trees
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">Annualized</span>
                </div>
              </div>

              {/* Optimization Tip Box */}
              <div className="p-4 rounded-2xl bg-limeAccent-light border border-lime-300 text-slate-900 text-xs space-y-1">
                <span className="font-extrabold flex items-center gap-1.5 text-emerald-900">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  Quick Savings Opportunity
                </span>
                <p className="text-[11px] text-slate-700 leading-relaxed font-normal">
                  Cutting 1 hour of AC and 10 minutes of Geyser saves ~₹{potentialMonthlySavedInr} on your monthly bill and cuts {(potentialMonthlySavedInr / 7.5 * 0.82).toFixed(1)} kg CO₂.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={onGetStarted}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/25 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Start Tracking Your Actual Appliances</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onLogin}
                  className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer text-center"
                >
                  Log In to Demo Account
                </button>
              </div>
            </CardTilt3D>
          </div>
        </div>
      </section>
    </div>
  );
}
