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
    <div className="space-y-20 pb-24 text-charcoal-900">
      {/* 1. HERO HEADER */}
      <section className="pt-8 lg:pt-14 text-center max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-4">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Scientific Rigor & Mathematical Transparency</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Why Household Carbon Tracking Demands{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">
            True Engineering Precision
          </span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
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
            className="rounded-3xl bg-white border border-slate-200/90 p-8 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-emerald-500/40 transition-all"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white font-black shadow-md">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <span className="text-[10px] uppercase font-black tracking-widest text-emerald-700 block">
                Regional Factor: 0.82 kg/kWh
              </span>
              <h3 className="text-xl font-black text-slate-900">
                CEA National Grid Baseline
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                India's electricity grid is heavily driven by thermal generation. Using Western
                factors (0.35–0.42 kg/kWh) grossly understates emissions. EcoTrace adheres to the
                official <strong>Central Electricity Authority (CEA) Version 19.0</strong> baseline
                of <strong>0.82 kg CO₂/kWh</strong>.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5">
              <span>Source: Ministry of Power, Govt. of India</span>
            </div>
          </CardTilt3D>

          {/* Pillar 2 */}
          <CardTilt3D
            maxTilt={4}
            className="rounded-3xl bg-white border border-slate-200/90 p-8 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-emerald-500/40 transition-all"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white font-black shadow-md">
                <Flame className="w-6 h-6 fill-current" />
              </div>
              <span className="text-[10px] uppercase font-black tracking-widest text-amber-700 block">
                Stoichiometry: 2.983 kg CO₂/kg
              </span>
              <h3 className="text-xl font-black text-slate-900">
                LPG Combustion Physics
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Liquefied Petroleum Gas (LPG) consists of propane (C₃H₈) and butane (C₄H₁₀).
                Rather than treating cooking gas as arbitrary hours, EcoTrace calculates exact mass
                consumption (0.15 kg/hr per burner) and applies the stoichiometric constant
                of <strong>2.983 kg CO₂ per kg of fuel burned</strong>.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-amber-800 font-semibold flex items-center gap-1.5">
              <span>Source: IPCC 2006 Guidelines for National GHG Inventories</span>
            </div>
          </CardTilt3D>

          {/* Pillar 3 */}
          <CardTilt3D
            maxTilt={4}
            className="rounded-3xl bg-white border border-slate-200/90 p-8 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-emerald-500/40 transition-all"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-lime-500 to-emerald-500 flex items-center justify-center text-white font-black shadow-md">
                <Scale className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase font-black tracking-widest text-emerald-700 block">
                Fairness Normalization Engine
              </span>
              <h3 className="text-xl font-black text-slate-900">
                Fair Per-Capita Rankings
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                A family of 5 living in a 3-BHK naturally consumes more power than a bachelor
                in a studio. EcoTrace normalizes carbon budgets by dwelling area (sq ft) and household
                occupancy so community leaderboards compare <em>conservation efficiency</em> fairly.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5">
              <span>Fairness algorithm prevents family penalization</span>
            </div>
          </CardTilt3D>
        </div>
      </section>

      {/* 3. INTERACTIVE HOUSEHOLD BENCHMARK EXPLORER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-50/80 border border-slate-200 p-8 sm:p-12 shadow-sm">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-black uppercase text-emerald-800 tracking-widest block mb-1">
              Interactive Standard Profiles
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Compare Typical Urban Dwelling Baselines
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-normal">
              Click through different home configurations below to inspect their expected electrical draw,
              daily carbon output, and recommended EcoTrace target budget.
            </p>
          </div>

          {/* Home Type Switcher Tabs */}
          <div className="flex flex-wrap gap-2.5 mb-8">
            {[
              { id: "1bhk", label: "1-BHK Studio", icon: Home },
              { id: "2bhk", label: "2-BHK Urban Flat", icon: Building2 },
              { id: "3bhk", label: "3-BHK Residence", icon: Building2 },
              { id: "villa", label: "Villa / Duplex", icon: Home },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSel = selectedHomeType === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedHomeType(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isSel
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-black scale-102"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Benchmark Card Presentation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                Selected Dwelling Architecture
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                {currentBenchmark.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Typical appliance suite: {currentBenchmark.applianceProfile}.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Occupancy
                  </span>
                  <span className="text-sm font-black text-slate-900 mt-0.5 block">
                    {currentBenchmark.occupants}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Daily Electricity
                  </span>
                  <span className="text-sm font-black text-emerald-700 mt-0.5 block">
                    {currentBenchmark.dailyKwh}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Monthly Footprint
                  </span>
                  <span className="text-sm font-black text-amber-700 mt-0.5 block">
                    {currentBenchmark.monthlyCo2}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-center items-center p-6 rounded-3xl bg-emerald-50/60 border border-emerald-200 text-center">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-1">
                EcoTrace Target
              </span>
              <span className="text-4xl font-black text-emerald-900 tracking-tight my-1">
                {currentBenchmark.suggestedTarget}
              </span>
              <span className="text-[11px] text-emerald-700/80 max-w-[220px]">
                Recommended threshold to unlock daily bonus EcoCredits and climb community leaderboards.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE ECOTRACE DIFFERENCE TABLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-black uppercase text-emerald-700 tracking-widest block mb-1">
            Feature Comparison
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            How EcoTrace Compares to Conventional Carbon Trackers
          </h2>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-sm bg-white">
          <table className="w-full text-left text-xs text-slate-700">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700 font-extrabold uppercase tracking-wider">
                <th className="py-4 px-6">Methodological Capability</th>
                <th className="py-4 px-6 text-emerald-800 font-black">EcoTrace Engine</th>
                <th className="py-4 px-6 text-slate-400">Generic Online Calculators</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition">
                <td className="py-4 px-6 font-bold text-slate-900">
                  Regional Grid Factor
                </td>
                <td className="py-4 px-6 text-emerald-700 font-extrabold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Official CEA India (0.82 kg/kWh)
                </td>
                <td className="py-4 px-6 text-slate-400 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-500" />
                  Arbitrary global US/EU average (0.38 kg/kWh)
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition">
                <td className="py-4 px-6 font-bold text-slate-900">
                  Cooking Fuel Physics
                </td>
                <td className="py-4 px-6 text-emerald-700 font-extrabold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  IPCC stoichiometric butane/propane mass chemistry
                </td>
                <td className="py-4 px-6 text-slate-400 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-500" />
                  Ignored or combined into generic electricity
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition">
                <td className="py-4 px-6 font-bold text-slate-900">
                  Fairness Normalization
                </td>
                <td className="py-4 px-6 text-emerald-700 font-extrabold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Dwelling sq ft & household member count scaling
                </td>
                <td className="py-4 px-6 text-slate-400 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-500" />
                  Raw unnormalized totals (punishes larger families)
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition">
                <td className="py-4 px-6 font-bold text-slate-900">
                  Incentives & Gamification
                </td>
                <td className="py-4 px-6 text-emerald-700 font-extrabold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Redeemable brand vouchers + 3D foil scratch cards
                </td>
                <td className="py-4 px-6 text-slate-400 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-500" />
                  Passive static charts with zero tangible rewards
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-forest-800 to-emerald-900 p-8 sm:p-12 text-center text-white shadow-xl">
          <h2 className="text-3xl font-black tracking-tight mb-2">
            Experience Transparent Environmental Tracking
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-lg mx-auto mb-6">
            Log in to test our live demo account or create your free household profile in under 60 seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="px-7 py-3 rounded-full bg-white text-emerald-900 hover:bg-slate-50 font-black text-xs shadow-md transition cursor-pointer"
            >
              Get Started Free
            </button>
            <button
              onClick={onLogin}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition cursor-pointer"
            >
              Sign In to Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
