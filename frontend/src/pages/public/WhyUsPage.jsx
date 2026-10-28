import React, { useState } from "react";
import {
  ShieldCheck,
  Zap,
  Flame,
  Users,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  TrendingDown,
  Scale,
  Award,
  BookOpen,
  ChevronRight,
  Building2,
  Home,
} from "lucide-react";
import CardTilt3D from "../../components/common/CardTilt3D";

export default function WhyUsPage({ onGetStarted, onLogin }) {
  // Interactive Benchmark Toggle
  const [selectedHomeType, setSelectedHomeType] = useState("2bhk");

  const homeBenchmarks = {
    "1bhk": {
      title: "1-BHK Studio / Compact Apartment",
      occupants: "1 - 2 Residents",
      dailyKwh: "6.5 kWh",
      dailyCo2: "5.33 kg CO₂",
      monthlyCo2: "160 kg",
      suggestedTarget: "6.0 kg/day",
      applianceProfile: "1x 3-Star AC (3 hrs), 2x Ceiling Fans, Refrigerator, Induction",
    },
    "2bhk": {
      title: "2-BHK Urban Apartment",
      occupants: "3 - 4 Residents",
      dailyKwh: "12.8 kWh",
      dailyCo2: "10.50 kg CO₂",
      monthlyCo2: "315 kg",
      suggestedTarget: "11.5 kg/day",
      applianceProfile: "2x ACs (4 hrs), 4x Ceiling Fans, Refrigerator, Water Geyser, LPG stove",
    },
    "3bhk": {
      title: "3-BHK Family Residence",
      occupants: "4 - 5 Residents",
      dailyKwh: "19.5 kWh",
      dailyCo2: "15.99 kg CO₂",
      monthlyCo2: "480 kg",
      suggestedTarget: "16.0 kg/day",
      applianceProfile: "3x ACs, 5x Fans, 2x Geysers, Double-door Fridge, Washing Machine, LPG stove",
    },
    villa: {
      title: "Independent Duplex / Villa",
      occupants: "5+ Residents",
      dailyKwh: "28.0 kWh",
      dailyCo2: "22.96 kg CO₂",
      monthlyCo2: "689 kg",
      suggestedTarget: "23.0 kg/day",
      applianceProfile: "Multiple Inverter ACs, Heat Pump, Water Purifiers, Large Kitchen Suite",
    },
  };

  const currentBenchmark = homeBenchmarks[selectedHomeType];

  return (
    <div className="space-y-20 pb-24 text-white">
      {/* 1. HERO HEADER */}
      <section className="pt-8 lg:pt-14 text-center max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-4">
          <ShieldCheck className="w-4 h-4" />
          <span>Scientific Rigor & Mathematical Transparency</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          Why Household Carbon Tracking Demands{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300">
            True Engineering Precision
          </span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-gray-300 font-normal leading-relaxed">
          Most generic carbon calculators use arbitrary global averages that miscalculate
          household impact by up to 45%. EcoTrace is engineered on localized regional grid
          emission factors, stoichiometric fuel chemistry, and fair per-capita normalization.
        </p>
      </section>

      {/* 2. THE THREE SCIENTIFIC PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <CardTilt3D
            maxTilt={4}
            className="rounded-3xl bg-[#092215]/85 border border-emerald-500/30 p-8 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-charcoal-950 font-black shadow-md">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 block">
                Regional Factor: 0.82 kg/kWh
              </span>
              <h3 className="text-xl font-black text-white">
                CEA National Grid Baseline
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-normal">
                India's electricity grid is heavily driven by thermal generation. Using Western
                factors (0.35–0.42 kg/kWh) grossly understates emissions. EcoTrace adheres to the
                official <strong>Central Electricity Authority (CEA) Version 19.0</strong> baseline
                of <strong>0.82 kg CO₂/kWh</strong>.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-900/40 text-[11px] text-emerald-300 font-semibold flex items-center gap-1.5">
              <span>Source: Ministry of Power, Govt. of India</span>
            </div>
          </CardTilt3D>

          {/* Pillar 2 */}
          <CardTilt3D
            maxTilt={4}
            className="rounded-3xl bg-[#092215]/85 border border-emerald-500/30 p-8 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-charcoal-950 font-black shadow-md">
                <Flame className="w-6 h-6 fill-current" />
              </div>
              <span className="text-[10px] uppercase font-black tracking-widest text-orange-400 block">
                Fuel Factor: 2.983 kg CO₂/kg
              </span>
              <h3 className="text-xl font-black text-white">
                Stoichiometric LPG Gas Physics
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-normal">
                Cooking gas cannot be modeled with electric wattage. EcoTrace models domestic LPG
                burners at a calibrated consumption of <strong>0.15 kg LPG/hr</strong>, multiplying by
                the stoichiometric hydrocarbon combustion factor of <strong>2.983 kg CO₂ per kg</strong>.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-900/40 text-[11px] text-orange-300 font-semibold flex items-center gap-1.5">
              <span>Source: IPCC Greenhouse Gas Inventories</span>
            </div>
          </CardTilt3D>

          {/* Pillar 3 */}
          <CardTilt3D
            maxTilt={4}
            className="rounded-3xl bg-[#092215]/85 border border-emerald-500/30 p-8 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-lime-400 to-emerald-400 flex items-center justify-center text-charcoal-950 font-black shadow-md">
                <Scale className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase font-black tracking-widest text-lime-300 block">
                Normalization: Per Capita
              </span>
              <h3 className="text-xl font-black text-white">
                Fair Household Normalization
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-normal">
                A family of five naturally consumes more electricity than a single individual.
                EcoTrace normalizes daily carbon budgets per capita so large families are never
                penalized on leaderboard rankings.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-900/40 text-[11px] text-lime-300 font-semibold flex items-center gap-1.5">
              <span>Fair Gamified EcoScore System</span>
            </div>
          </CardTilt3D>
        </div>
      </section>

      {/* 3. INTERACTIVE HOUSEHOLD BENCHMARK COMPARATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#07190F] border border-emerald-500/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl text-left mb-8">
            <span className="text-xs font-black uppercase text-emerald-400 tracking-widest block">
              Interactive Benchmark Tool
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Where Does Your Household Stand?
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-2 font-normal">
              Select your dwelling type to view calibrated daily electricity and carbon baselines.
            </p>
          </div>

          {/* Home Type Selector Buttons */}
          <div className="flex flex-wrap gap-2.5 mb-8">
            {[
              { id: "1bhk", label: "1-BHK Studio", icon: Building2 },
              { id: "2bhk", label: "2-BHK Apartment", icon: Building2 },
              { id: "3bhk", label: "3-BHK Family Home", icon: Home },
              { id: "villa", label: "Duplex / Villa", icon: Home },
            ].map((t) => {
              const isSelected = selectedHomeType === t.id;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedHomeType(t.id)}
                  className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-emerald-500 to-lime-400 text-charcoal-950 font-black shadow-lg scale-102"
                      : "bg-[#0B2517] hover:bg-[#103320] text-gray-300 border border-emerald-500/20"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Benchmark Metrics Display */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-[#0B2517]/90 border border-emerald-500/30">
            <div>
              <span className="text-[11px] uppercase font-bold text-gray-400 block">
                Typical Occupancy
              </span>
              <span className="text-xl font-black text-white mt-1 block">
                {currentBenchmark.occupants}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
                Baseline standard
              </span>
            </div>

            <div>
              <span className="text-[11px] uppercase font-bold text-gray-400 block">
                Avg Daily Electricity
              </span>
              <span className="text-xl font-black text-white mt-1 block">
                {currentBenchmark.dailyKwh}
              </span>
              <span className="text-[10px] text-gray-300 font-medium block mt-1">
                ≈ {currentBenchmark.dailyCo2}
              </span>
            </div>

            <div>
              <span className="text-[11px] uppercase font-bold text-gray-400 block">
                Monthly Carbon Load
              </span>
              <span className="text-xl font-black text-emerald-400 mt-1 block">
                {currentBenchmark.monthlyCo2}
              </span>
              <span className="text-[10px] text-gray-300 font-medium block mt-1">
                CO₂ equivalent
              </span>
            </div>

            <div>
              <span className="text-[11px] uppercase font-bold text-gray-400 block">
                EcoTrace Target
              </span>
              <span className="text-xl font-black text-lime-300 mt-1 block">
                {currentBenchmark.suggestedTarget}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
                Earns max EcoCredits
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-black/30 border border-white/10 text-xs text-gray-300 flex items-center justify-between flex-wrap gap-2">
            <span>
              <strong>Sample Appliance Suite:</strong> {currentBenchmark.applianceProfile}
            </span>
            <button
              onClick={onGetStarted}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Personalize in Free Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. COMPARISON MATRIX TABLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-black uppercase text-emerald-400 tracking-widest block">
            Competitive Benchmarking
          </span>
          <h2 className="text-3xl font-black text-white mt-1">
            How EcoTrace Compares
          </h2>
          <p className="text-xs text-gray-300 mt-2 font-normal">
            Why software telemetry outperforms both basic questionnaires and expensive hardware meters.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-emerald-500/30 bg-[#092215]/80 shadow-2xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-emerald-900/60 bg-[#0A2617]">
                <th className="p-5 text-gray-300 font-bold">Key Capability</th>
                <th className="p-5 text-emerald-400 font-black text-sm bg-emerald-500/10 border-x border-emerald-500/30">
                  EcoTrace
                </th>
                <th className="p-5 text-gray-400 font-semibold">Generic Online Calculators</th>
                <th className="p-5 text-gray-400 font-semibold">Hardware Smart Meters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/60">
              <tr className="hover:bg-white/5 transition">
                <td className="p-5 font-bold text-white">
                  Localized CEA Grid Factor (0.82 kg/kWh)
                </td>
                <td className="p-5 bg-emerald-500/5 border-x border-emerald-500/20 font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Yes (Certified)</span>
                </td>
                <td className="p-5 text-gray-400 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span>No (Global Average)</span>
                </td>
                <td className="p-5 text-gray-400 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>Varies by manufacturer</span>
                </td>
              </tr>

              <tr className="hover:bg-white/5 transition">
                <td className="p-5 font-bold text-white">
                  Separate Stoichiometric LPG Gas Physics
                </td>
                <td className="p-5 bg-emerald-500/5 border-x border-emerald-500/20 font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Yes (2.983 kg/kg)</span>
                </td>
                <td className="p-5 text-gray-400 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span>Rarely included</span>
                </td>
                <td className="p-5 text-gray-400 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span>No (Electric only)</span>
                </td>
              </tr>

              <tr className="hover:bg-white/5 transition">
                <td className="p-5 font-bold text-white">
                  Hardware Sensor Cost
                </td>
                <td className="p-5 bg-emerald-500/5 border-x border-emerald-500/20 font-black text-lime-300">
                  ₹0 (100% Free Software)
                </td>
                <td className="p-5 text-gray-300">₹0 (Survey only)</td>
                <td className="p-5 text-red-400 font-semibold">₹6,000 – ₹15,000+ per home</td>
              </tr>

              <tr className="hover:bg-white/5 transition">
                <td className="p-5 font-bold text-white">
                  Per-Capita Household Normalization
                </td>
                <td className="p-5 bg-emerald-500/5 border-x border-emerald-500/20 font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Yes (Fair Leaderboard)</span>
                </td>
                <td className="p-5 text-gray-400 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span>Unadjusted gross</span>
                </td>
                <td className="p-5 text-gray-400 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span>Building total only</span>
                </td>
              </tr>

              <tr className="hover:bg-white/5 transition">
                <td className="p-5 font-bold text-white">
                  Gamified Rewards & Brand Vouchers
                </td>
                <td className="p-5 bg-emerald-500/5 border-x border-emerald-500/20 font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Yes (GPay Scratch Cards)</span>
                </td>
                <td className="p-5 text-gray-400 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span>None</span>
                </td>
                <td className="p-5 text-gray-400 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span>None</span>
                </td>
              </tr>

              <tr className="hover:bg-white/5 transition">
                <td className="p-5 font-bold text-white">
                  Data Privacy & Local Storage
                </td>
                <td className="p-5 bg-emerald-500/5 border-x border-emerald-500/20 font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Private / Never Sold</span>
                </td>
                <td className="p-5 text-gray-400 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>Data monetization common</span>
                </td>
                <td className="p-5 text-gray-400 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>Proprietary cloud locks</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. CALL TO ACTION FOOTER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-emerald-950 via-[#0B2517] to-emerald-950 border border-emerald-500/40">
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Experience the Scientific Difference
          </h3>
          <p className="text-xs text-gray-300 mt-2 max-w-xl mx-auto">
            Take two minutes to setup your household appliances and verify your actual
            daily carbon footprint against the CEA India benchmark.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="px-7 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 text-charcoal-950 font-black text-xs shadow-lg hover:shadow-glow transition cursor-pointer"
            >
              Start Free Tracking
            </button>
            <button
              onClick={onLogin}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition cursor-pointer"
            >
              Launch Demo Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

