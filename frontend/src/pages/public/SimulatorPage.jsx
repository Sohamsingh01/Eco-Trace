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

  // Monthly & Yearly projections
  const monthlyCo2 = totalDailyCo2 * 30;
  const annualCo2Tons = (totalDailyCo2 * 365) / 1000;

  // Estimated Monthly Electricity Bill (avg ₹7.50 / kWh slab)
  const monthlyKwh = totalDailyKwh * 30;
  const monthlyBillRupees = Math.round(monthlyKwh * 7.5);

  // Trees needed to offset annually (1 mature tree absorbs ~22 kg CO2 / year)
  const treesNeeded = Math.ceil((totalDailyCo2 * 365) / 22);

  // Potential EcoCredits (if under 12.5 kg target: 25 credits/day + 10 logging)
  const potentialCreditsPerMonth = totalDailyCo2 <= 12.5 ? 30 * 35 : 30 * 10;

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
    <div className="space-y-16 pb-24 text-white">
      {/* 1. HERO HEADER */}
      <section className="pt-8 lg:pt-14 text-center max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-4">
          <Sparkles className="w-4 h-4 text-limeAccent" />
          <span>Interactive Appliance Telemetry</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          Simulate Your Appliances.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300">
            Cut Your Carbon & Electric Bill.
          </span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-gray-300 font-normal leading-relaxed">
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
            <div className="rounded-3xl bg-[#092215]/85 border border-emerald-500/30 p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-emerald-900/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-white">Living Room Appliances</h3>
                    <span className="text-xs text-gray-400">Cooling, ventilation, and entertainment</span>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs text-gray-400 hover:text-emerald-300 flex items-center gap-1.5 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>
              </div>

              {/* Air Conditioner */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold text-gray-200">
                    Air Conditioner Model & Star Rating:
                  </span>
                  <div className="flex items-center gap-1.5 bg-[#06170E] p-1 rounded-xl border border-emerald-500/20 text-xs">
                    <button
                      onClick={() => setAcType("5star")}
                      className={`px-2.5 py-1 rounded-lg transition ${
                        acType === "5star"
                          ? "bg-emerald-500 text-charcoal-950 font-black"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      5-Star Inverter (1100W)
                    </button>
                    <button
                      onClick={() => setAcType("3star")}
                      className={`px-2.5 py-1 rounded-lg transition ${
                        acType === "3star"
                          ? "bg-emerald-500 text-charcoal-950 font-black"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      3-Star (1500W)
                    </button>
                    <button
                      onClick={() => setAcType("1star")}
                      className={`px-2.5 py-1 rounded-lg transition ${
                        acType === "1star"
                          ? "bg-emerald-500 text-charcoal-950 font-black"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      1-Star / Window (2000W)
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#06170E]/80 border border-emerald-500/20">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-200 mb-2">
                    <span>AC Runtime:</span>
                    <span className="text-emerald-400 font-extrabold">{acHours} Hours/Day</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="14"
                    value={acHours}
                    onChange={(e) => setAcHours(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>Off (0h)</span>
                    <span>Sub-total: {acKwh.toFixed(1)} kWh/day ({(acKwh * 0.82).toFixed(2)} kg CO₂)</span>
                    <span>14h</span>
                  </div>
                </div>
              </div>

              {/* Ceiling Fans & TV Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#06170E]/80 border border-emerald-500/20">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-200 mb-2">
                    <span className="flex items-center gap-1.5">
                      <Fan className="w-3.5 h-3.5 text-emerald-400" />
                      Ceiling Fans ({fanCount} Fans)
                    </span>
                    <span className="text-emerald-400 font-extrabold">{fanHours} hrs/day</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={fanCount}
                    onChange={(e) => setFanCount(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <span className="text-[10px] text-gray-400 block mt-1">
                    {fanCount}x fans @ 75W = {fanKwh.toFixed(1)} kWh/day
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#06170E]/80 border border-emerald-500/20">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-200 mb-2">
                    <span className="flex items-center gap-1.5">
                      <Tv className="w-3.5 h-3.5 text-emerald-400" />
                      Smart Television (55-inch 4K)
                    </span>
                    <span className="text-emerald-400 font-extrabold">{tvHours} hrs/day</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={tvHours}
                    onChange={(e) => setTvHours(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <span className="text-[10px] text-gray-400 block mt-1">
                    120W power draw = {tvKwh.toFixed(1)} kWh/day
                  </span>
                </div>
              </div>
            </div>

            {/* Kitchen & Cooking Card */}
            <div className="rounded-3xl bg-[#092215]/85 border border-emerald-500/30 p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-emerald-900/40">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">Kitchen & Cooking Fuel</h3>
                  <span className="text-xs text-gray-400">Gas stove, induction cooktop, and refrigeration</span>
                </div>
              </div>

              {/* LPG Gas Stove */}
              <div className="p-4 rounded-2xl bg-[#06170E]/80 border border-emerald-500/20">
                <div className="flex items-center justify-between text-xs font-bold text-gray-200 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    LPG Gas Burner Active Time:
                  </span>
                  <span className="text-orange-400 font-extrabold">{gasMinutes} Mins/Day</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="120"
                  step="10"
                  value={gasMinutes}
                  onChange={(e) => setGasMinutes(Number(e.target.value))}
                  className="w-full accent-orange-400 cursor-pointer"
                />
                <span className="text-[10px] text-gray-400 block mt-1">
                  Burner flow: 0.15 kg/hr • Stoichiometric emissions: {gasCo2.toFixed(2)} kg CO₂
                </span>
              </div>

              {/* Refrigerator & Induction */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#06170E]/80 border border-emerald-500/20">
                  <span className="text-xs font-bold text-gray-200 block mb-2">
                    Refrigerator Type:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFridgeType("inverter")}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition ${
                        fridgeType === "inverter"
                          ? "bg-emerald-500 text-charcoal-950 font-black"
                          : "bg-white/5 text-gray-400"
                      }`}
                    >
                      Inverter 5-Star (0.9 kWh)
                    </button>
                    <button
                      onClick={() => setFridgeType("standard")}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition ${
                        fridgeType === "standard"
                          ? "bg-emerald-500 text-charcoal-950 font-black"
                          : "bg-white/5 text-gray-400"
                      }`}
                    >
                      Standard (1.8 kWh)
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#06170E]/80 border border-emerald-500/20">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-200 mb-2">
                    <span>Induction Cooktop (1800W):</span>
                    <span className="text-emerald-400 font-extrabold">{inductionHours} hrs</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="0.5"
                    value={inductionHours}
                    onChange={(e) => setInductionHours(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <span className="text-[10px] text-gray-400 block mt-1">
                    84% thermal transfer efficiency
                  </span>
                </div>
              </div>
            </div>

            {/* Bathroom & Utility Card */}
            <div className="rounded-3xl bg-[#092215]/85 border border-emerald-500/30 p-6 sm:p-8 shadow-xl space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-emerald-900/40">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">Bathroom & Utility</h3>
                  <span className="text-xs text-gray-400">Water heating and domestic lighting</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#06170E]/80 border border-emerald-500/20">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-200 mb-2">
                    <span>Electric Geyser (2000W):</span>
                    <span className="text-teal-400 font-extrabold">{geyserMinutes} mins</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    step="15"
                    value={geyserMinutes}
                    onChange={(e) => setGeyserMinutes(Number(e.target.value))}
                    className="w-full accent-teal-400 cursor-pointer"
                  />
                  <span className="text-[10px] text-gray-400 block mt-1">
                    {geyserKwh.toFixed(1)} kWh/day = {(geyserKwh * 0.82).toFixed(2)} kg CO₂
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#06170E]/80 border border-emerald-500/20">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-200 mb-2">
                    <span>LED Lights Active (9W):</span>
                    <span className="text-teal-400 font-extrabold">{ledBulbs} bulbs</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="16"
                    value={ledBulbs}
                    onChange={(e) => setLedBulbs(Number(e.target.value))}
                    className="w-full accent-teal-400 cursor-pointer"
                  />
                  <span className="text-[10px] text-gray-400 block mt-1">
                    LED lighting saves ~85% energy vs incandescent
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Real-Time Analytics & Bill Projections (4 Cols Sticky) */}
          <div className="lg:col-span-4 space-y-6 sticky top-28">
            <CardTilt3D
              maxTilt={4}
              className="rounded-3xl bg-gradient-to-b from-[#0C291B] to-[#07180F] border border-emerald-500/40 p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-6"
            >
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 block">
                  Simulated Output
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">
                  Your Household Telemetry
                </h3>
              </div>

              {/* Main Metric: Daily Footprint */}
              <div className="p-5 rounded-2xl bg-[#06140B] border border-emerald-500/30">
                <span className="text-xs text-gray-400 font-semibold block">
                  Simulated Daily Footprint
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-black text-white">
                    <AnimatedCounter value={totalDailyCo2} decimals={2} />
                  </span>
                  <span className="text-sm font-bold text-emerald-400">kg CO₂/day</span>
                </div>
                <div className="mt-2 text-xs text-gray-300 flex items-center justify-between border-t border-emerald-950 pt-2">
                  <span>Target Budget: 12.5 kg</span>
                  <span
                    className={`font-extrabold ${
                      totalDailyCo2 <= 12.5 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {totalDailyCo2 <= 12.5 ? "✓ Clean (Within Target)" : "⚠ Exceeds Target"}
                  </span>
                </div>
              </div>

              {/* Key Projections Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    Daily Electricity
                  </span>
                  <span className="text-lg font-black text-white mt-0.5 block">
                    {totalDailyKwh.toFixed(1)} kWh
                  </span>
                  <span className="text-[10px] text-gray-400">@ 0.82 kg/kWh</span>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    Est. Monthly Bill
                  </span>
                  <span className="text-lg font-black text-lime-300 mt-0.5 block">
                    ₹{monthlyBillRupees.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-400">~₹7.50/unit</span>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    Annual Carbon Load
                  </span>
                  <span className="text-lg font-black text-emerald-400 mt-0.5 block">
                    {annualCo2Tons.toFixed(2)} t
                  </span>
                  <span className="text-[10px] text-gray-400">Tons CO₂/year</span>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    Trees to Offset
                  </span>
                  <span className="text-lg font-black text-teal-300 mt-0.5 block">
                    🌳 {treesNeeded}
                  </span>
                  <span className="text-[10px] text-gray-400">Mature trees/yr</span>
                </div>
              </div>

              {/* Targeted Recommendation Box */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-400/30 text-xs text-gray-200 space-y-1.5">
                <span className="font-extrabold text-emerald-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Targeted Efficiency Insight:
                </span>
                <p className="text-[11px] text-gray-300 leading-relaxed font-normal">
                  {acHours > 5
                    ? "Setting your AC thermostat to 24°C rather than 20°C reduces cooling load by up to 24%, saving ~₹550 on your monthly bill."
                    : geyserMinutes > 45
                    ? "Installing an aerated low-flow showerhead reduces water heating electricity consumption by 30%."
                    : "Maintaining this consumption profile earns you approximately " + potentialCreditsPerMonth + " EcoCredits every month!"}
                </p>
              </div>

              {/* Call to Action Button */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={onGetStarted}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-400 text-charcoal-950 font-black text-xs shadow-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  Save Profile to Free Account
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
                <button
                  onClick={onLogin}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/15 transition cursor-pointer text-center"
                >
                  Log into Demo Account
                </button>
              </div>
            </CardTilt3D>
          </div>
        </div>
      </section>
    </div>
  );
}

