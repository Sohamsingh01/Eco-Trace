import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Award,
  Zap,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Layers,
  Leaf,
  Coins,
} from "lucide-react";
import CardTilt3D from "../../components/common/CardTilt3D";
import BudgetProgressRing from "../../components/dashboard/BudgetProgressRing";
import MyEcoWorld3D from "../../components/dashboard/MyEcoWorld3D";
import StatCard from "../../components/common/StatCard";

export default function DashboardPreviewPage({ onGetStarted, onLogin }) {
  // Interactive simulator for the Carbon Budget Progress Ring
  const [consumedCo2, setConsumedCo2] = useState(7.2);
  const targetBudget = 12.5;

  // Interactive slider for EcoScore to demonstrate 3D Eco World evolution
  const [demoEcoScore, setDemoEcoScore] = useState(620);
  const [demoStreak, setDemoStreak] = useState(5);

  return (
    <div className="space-y-20 pb-24 text-charcoal-900">
      {/* 1. HERO HEADER */}
      <section className="pt-8 lg:pt-14 text-center max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-4">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Interactive Telemetry Preview</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          A Dashboard Built for Action,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">
            Not Just Observation
          </span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
          Test-drive the actual interactive widgets below. Adjust the sliders to see how
          the circular carbon budget ring shifts threshold colors and how the 3D miniature
          island ecosystem evolves with your EcoScore.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <button
            onClick={onLogin}
            className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-xs shadow-md shadow-emerald-600/25 transition flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Full Live Demo Account</span>
          </button>
          <button
            onClick={onGetStarted}
            className="px-6 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-300 transition cursor-pointer shadow-xs"
          >
            Create Your Household Account
          </button>
        </div>
      </section>

      {/* 2. LIVE INTERACTIVE WIDGET SANDBOX (TWO-COLUMN SHOWCASE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Carbon Budget Progress Ring */}
          <div className="lg:col-span-6 space-y-6">
            <CardTilt3D
              maxTilt={4}
              className="rounded-3xl bg-white border border-slate-200/90 p-8 shadow-sm backdrop-blur-xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider block">
                    Interactive Widget Demo 1
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-0.5">
                    Daily Carbon Budget Ring
                  </h3>
                </div>
                <button
                  onClick={() => setConsumedCo2(7.2)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                  title="Reset to 7.2 kg"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* The Live Budget Progress Ring Component */}
              <div className="py-6 flex justify-center">
                <BudgetProgressRing
                  currentKg={consumedCo2}
                  targetKg={targetBudget}
                  isVerified={false}
                />
              </div>

              {/* Dynamic Interactive Slider */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600">Simulate Today's Consumed Carbon:</span>
                  <span className="text-emerald-700 font-extrabold text-sm">
                    {consumedCo2.toFixed(1)} kg CO₂
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="16.0"
                  step="0.2"
                  value={consumedCo2}
                  onChange={(e) => setConsumedCo2(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span>1.0 kg (Ultra Low)</span>
                  <span className="text-emerald-700 font-bold">Target: {targetBudget} kg</span>
                  <span>16.0 kg (High Alert)</span>
                </div>
              </div>
            </CardTilt3D>
          </div>

          {/* Right Column: 3D MyEcoWorld Interactive Ecosystem Island */}
          <div className="lg:col-span-6 space-y-6">
            <CardTilt3D
              maxTilt={4}
              className="rounded-3xl bg-white border border-slate-200/90 p-8 shadow-sm backdrop-blur-xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider block">
                    Interactive Widget Demo 2
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-0.5">
                    3D Biophilic Island Evolution
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <Award className="w-3.5 h-3.5" />
                  <span>Interactive Three.js Canvas</span>
                </div>
              </div>

              {/* 3D MyEcoWorld Canvas */}
              <div className="my-4 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex justify-center items-center">
                <MyEcoWorld3D
                  ecoScore={demoEcoScore}
                  streakDays={demoStreak}
                  className="w-full h-64"
                />
              </div>

              {/* Interactive EcoScore Slider */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600">Simulate Cumulative EcoScore:</span>
                  <span className="text-emerald-700 font-extrabold text-sm">
                    {demoEcoScore} Points
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1200"
                  step="25"
                  value={demoEcoScore}
                  onChange={(e) => setDemoEcoScore(parseInt(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span>50 pts (Sparse Sprout)</span>
                  <span>600 pts (Flourishing Canopy)</span>
                  <span>1200+ pts (Full Ecosystem)</span>
                </div>
              </div>
            </CardTilt3D>
          </div>
        </div>
      </section>

      {/* 3. CALL TO ACTION STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-50 border border-slate-200 p-8 sm:p-12 text-center shadow-sm">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            Ready to Track Your Real Appliance Footprint?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mb-6">
            Get instant CEA emission calculations, track appliance power consumption, and redeem gift vouchers.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="px-7 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/25 transition cursor-pointer"
            >
              Sign Up Free
            </button>
            <button
              onClick={onLogin}
              className="px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition cursor-pointer"
            >
              Demo Sign In
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
