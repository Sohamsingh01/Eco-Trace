import React, { useState } from "react";
import {
  Leaf,
  ArrowRight,
  ShieldCheck,
  Zap,
  Flame,
  Award,
  Gift,
  Trophy,
  BarChart3,
  CheckCircle2,
  Users,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import CardTilt3D from "../components/common/CardTilt3D";
import AnimatedCounter from "../components/common/AnimatedCounter";

export default function LandingPage({ onGetStarted, onLogin }) {
  // Interactive mini calculator on landing page
  const [acHours, setAcHours] = useState(4);
  const [fans, setFans] = useState(3);
  const [fuelMinutes, setFuelMinutes] = useState(45);

  // Quick live computation:
  // AC: 1500W * acHours / 1000 * 0.82
  // Fans: 75W * fans * 10 hrs / 1000 * 0.82
  // LPG: 45/60 hrs * 0.15 kg/hr * 2.983
  const calcAcCo2 = ((1500 * acHours) / 1000) * 0.82;
  const calcFanCo2 = ((75 * fans * 10) / 1000) * 0.82;
  const calcGasCo2 = (fuelMinutes / 60) * 0.15 * 2.983;
  const totalLandingCo2 = (calcAcCo2 + calcFanCo2 + calcGasCo2).toFixed(2);
  const totalLandingKwh = (((1500 * acHours + 75 * fans * 10) / 1000) + (fuelMinutes / 60 * 0.15 * 12.8)).toFixed(1);

  return (
    <div className="min-h-screen bg-softWhite flex flex-col font-sans">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-forest-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-forest-800 to-emerald-500 flex items-center justify-center text-white shadow-eco">
              <Leaf className="w-6 h-6 fill-white/20" />
            </div>
            <div>
              <span className="font-extrabold text-2xl tracking-tight text-forest-900">
                EcoTrace
              </span>
              <span className="text-[10px] block font-bold text-emerald-600 tracking-wider uppercase -mt-1">
                Smart Carbon Tracker
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogin}
              className="px-4 py-2 rounded-xl text-xs font-bold text-forest-800 hover:bg-forest-50 transition"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold shadow-eco hover:shadow-eco-lg transition flex items-center gap-1.5"
            >
              Get Started Free
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100/70 border border-forest-200 text-forest-800 text-xs font-bold mb-6 animate-pulse">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified CEA India & IPCC Carbon Emission Modeling
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-charcoal-900 tracking-tight leading-[1.1]">
              Track Your Carbon.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-800 via-emerald-600 to-lime-600">
                Transform Your Tomorrow.
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-charcoal-600 leading-relaxed font-normal">
              EcoTrace brings precision environmental analytics to everyday household living. Track appliance consumption, set personalized daily emission budgets, earn redeemable EcoCredits, and compete on community leaderboards.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-forest-800 hover:bg-forest-900 text-white text-sm font-extrabold shadow-eco-lg hover:shadow-glow transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
              >
                Start Tracking Today — It's Free
                <ArrowRight className="w-4 h-4 text-limeAccent" />
              </button>

              <button
                onClick={onLogin}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white border border-forest-200 text-forest-900 hover:bg-forest-50 text-sm font-bold shadow-sm transition"
              >
                Explore Demo Account
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-charcoal-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No Hardware Required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Instant Scientific Preview
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Google Pay Style Rewards
              </span>
            </div>
          </div>

          {/* Interactive Calculator Banner directly on Landing Page with 3D Tilt */}
          <CardTilt3D
            maxTilt={3}
            scale={1.005}
            className="mt-14 max-w-4xl mx-auto rounded-3xl bg-white border border-forest-100 shadow-2xl p-6 sm:p-8"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div>
                <span className="text-xs font-extrabold uppercase text-emerald-700 tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Interactive Live Simulator
                </span>
                <h3 className="text-xl font-black text-charcoal-900 mt-0.5">
                  Estimate Your Daily Household Emissions
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-charcoal-400 font-medium block">
                  Simulated Daily Footprint:
                </span>
                <span className="text-3xl font-black text-forest-900">
                  <AnimatedCounter value={parseFloat(totalLandingCo2)} decimals={2} />{" "}
                  <span className="text-sm font-semibold text-charcoal-500">kg CO₂</span>
                </span>
                <span className="text-xs text-emerald-700 font-bold block">
                  ≈ <AnimatedCounter value={parseFloat(totalLandingKwh)} decimals={1} /> kWh equivalent energy
                </span>
              </div>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="p-4 rounded-2xl bg-forest-50/50 border border-forest-100">
                <div className="flex items-center justify-between text-xs font-bold text-charcoal-700 mb-2">
                  <span>Air Conditioner</span>
                  <span className="text-forest-800">{acHours} Hours/Day</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  value={acHours}
                  onChange={(e) => setAcHours(Number(e.target.value))}
                  className="w-full accent-forest-800 cursor-pointer"
                />
                <span className="text-[11px] text-charcoal-500 mt-2 block">
                  1.5 Ton 3-Star AC (~1500W)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-forest-50/50 border border-forest-100">
                <div className="flex items-center justify-between text-xs font-bold text-charcoal-700 mb-2">
                  <span>Ceiling Fans Running</span>
                  <span className="text-forest-800">{fans} Fans</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="6"
                  value={fans}
                  onChange={(e) => setFans(Number(e.target.value))}
                  className="w-full accent-forest-800 cursor-pointer"
                />
                <span className="text-[11px] text-charcoal-500 mt-2 block">
                  Standard Induction Fan (~75W, 10h)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-forest-50/50 border border-forest-100">
                <div className="flex items-center justify-between text-xs font-bold text-charcoal-700 mb-2">
                  <span>Gas Cooking (LPG)</span>
                  <span className="text-forest-800">{fuelMinutes} Mins</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="120"
                  step="15"
                  value={fuelMinutes}
                  onChange={(e) => setFuelMinutes(Number(e.target.value))}
                  className="w-full accent-forest-800 cursor-pointer"
                />
                <span className="text-[11px] text-charcoal-500 mt-2 block">
                  Separate mass-based fuel formula
                </span>
              </div>
            </div>
          </CardTilt3D>
        </div>
      </section>

      {/* How EcoTrace Works (3-Step Flow) */}
      <section className="py-16 bg-white border-y border-forest-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase text-emerald-700 tracking-wider">
              Simple & Powerful
            </span>
            <h2 className="text-3xl font-black text-charcoal-900 mt-1">
              How EcoTrace Works
            </h2>
            <p className="text-xs text-charcoal-500 mt-2">
              Transforming everyday appliance habits into tangible rewards and measurable carbon reduction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-forest-50/40 border border-forest-100 relative">
              <div className="w-12 h-12 rounded-2xl bg-forest-800 text-white font-black text-lg flex items-center justify-center mb-4 shadow-eco">
                1
              </div>
              <h3 className="font-extrabold text-base text-forest-950 mb-2">
                Log Household Appliances
              </h3>
              <p className="text-xs text-charcoal-600 leading-relaxed font-normal">
                Easily record when you use your AC, geyser, refrigerator, washing machine, or gas stove with duration and operating modes.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-forest-50/40 border border-forest-100 relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-eco">
                2
              </div>
              <h3 className="font-extrabold text-base text-forest-950 mb-2">
                Calculate & Track Budget
              </h3>
              <p className="text-xs text-charcoal-600 leading-relaxed font-normal">
                Our engine instantly calculates electricity (kWh) and CO₂ emissions using regional grid factors and benchmarks against your daily target.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-forest-50/40 border border-forest-100 relative">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white font-black text-lg flex items-center justify-center mb-4 shadow-eco">
                3
              </div>
              <h3 className="font-extrabold text-base text-forest-950 mb-2">
                Earn EcoCredits & Rewards
              </h3>
              <p className="text-xs text-charcoal-600 leading-relaxed font-normal">
                Stay below your target, maintain tracking streaks, unlock Google Pay style scratch cards, and climb fair per-capita leaderboards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-softWhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase text-emerald-700 tracking-wider">
              Comprehensive Platform
            </span>
            <h2 className="text-3xl font-black text-charcoal-900 mt-1">
              Engineered for Real Impact
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-forest-100 shadow-eco flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center mb-4">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-forest-950 mb-1.5">
                  Interactive Visual Analytics
                </h4>
                <p className="text-xs text-charcoal-500 leading-relaxed font-normal">
                  Dynamic pie charts for appliance breakdowns, 7-day emission lines, category bars, and electricity trend area charts.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-forest-100 shadow-eco flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                  <Gift className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-forest-950 mb-1.5">
                  GPay Style Scratch Cards
                </h4>
                <p className="text-xs text-charcoal-500 leading-relaxed font-normal">
                  Redeem earned EcoCredits for interactive scratch cards with coupon codes (Nykaa, McDonald's, Amazon, Eco Badges).
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-forest-100 shadow-eco flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-limeAccent/40 text-forest-900 flex items-center justify-center mb-4">
                  <Trophy className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-forest-950 mb-1.5">
                  Fair Per-Capita Leaderboard
                </h4>
                <p className="text-xs text-charcoal-500 leading-relaxed font-normal">
                  Household-normalized EcoScore ensures a 4-person family isn't penalized compared to a single-person apartment.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-forest-100 shadow-eco flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-forest-950 mb-1.5">
                  Multi-Source Fuel Logic
                </h4>
                <p className="text-xs text-charcoal-500 leading-relaxed font-normal">
                  Gas stoves calculate stoichiometric fuel combustion (kg LPG), strictly separate from grid electricity watts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-charcoal-900 text-white py-12 border-t border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-white">EcoTrace</span>
              <p className="text-[11px] text-gray-400">
                Final Year Engineering Project — Smart Household Carbon Footprint Tracker
              </p>
            </div>
          </div>

          <div className="text-xs text-gray-400 text-center md:text-right">
            <span>Built with React + Vite + Tailwind CSS + Python FastAPI + PostgreSQL</span>
            <div className="mt-1 text-[10px] text-gray-500">
              CEA Baseline Emission Factor: 0.82 kg CO₂/kWh • IPCC LPG Factor: 2.983 kg CO₂/kg
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
