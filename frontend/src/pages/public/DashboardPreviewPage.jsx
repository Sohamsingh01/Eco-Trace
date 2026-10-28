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
    <div className="space-y-20 pb-24 text-white">
      {/* 1. HERO HEADER */}
      <section className="pt-8 lg:pt-14 text-center max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-4">
          <Sparkles className="w-4 h-4 text-limeAccent" />
          <span>Interactive Telemetry Preview</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          A Dashboard Built for Action,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300">
            Not Just Observation
          </span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-gray-300 font-normal leading-relaxed">
          Test-drive the actual interactive widgets below. Adjust the sliders to see how
          the circular carbon budget ring shifts threshold colors and how the 3D miniature
          island ecosystem evolves with your EcoScore.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <button
            onClick={onLogin}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 text-charcoal-950 font-black text-xs shadow-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Full Live Demo Account</span>
          </button>
          <button
            onClick={onGetStarted}
            className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition cursor-pointer"
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
              className="rounded-3xl bg-[#092215]/90 border border-emerald-500/30 p-8 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-emerald-900/40">
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider block">
                    Interactive Widget Demo 1
                  </span>
                  <h3 className="text-lg font-black text-white mt-0.5">
                    Daily Carbon Budget Ring
                  </h3>
                </div>
                <button
                  onClick={() => setConsumedCo2(7.2)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition"
                  title="Reset to 7.2 kg"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* The Live Budget Progress Ring Component */}
              <div className="py-6 flex justify-center">
                <BudgetProgressRing
                  consumed={consumedCo2}
                  target={targetBudget}
                  size={240}
                  strokeWidth={20}
                />
              </div>

              {/* Dynamic Interactive Slider */}
              <div className="p-4 rounded-2xl bg-[#06170E] border border-emerald-500/20 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-300">Simulate Today's Consumed Carbon:</span>
                  <span className="text-emerald-400 font-extrabold text-sm">
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
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                  <span>1.0 kg (Ultra Clean)</span>
                  <span className="text-emerald-300 font-bold">12.5 kg (Budget Limit)</span>
                  <span className="text-red-400">16.0 kg (Exceeded)</span>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 mt-4 leading-relaxed">
                Notice how the circular ring dynamically transitions from <strong>Emerald Glow</strong> (below 85%),
                to <strong>Amber Warning</strong> (above 85%), and <strong>Coral Alert</strong> when exceeding daily budget limits.
              </p>
            </CardTilt3D>
          </div>

          {/* Right Column: Evolving 3D Miniature Island ("My Eco World") */}
          <div className="lg:col-span-6 space-y-6">
            <CardTilt3D
              maxTilt={4}
              className="rounded-3xl bg-[#092215]/90 border border-emerald-500/30 p-8 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-emerald-900/40">
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider block">
                    Interactive Widget Demo 2
                  </span>
                  <h3 className="text-lg font-black text-white mt-0.5">
                    "My Eco World" 3D Island
                  </h3>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-extrabold text-emerald-300">
                  {demoEcoScore < 400
                    ? "Stage 1: Seedling Sanctuary"
                    : demoEcoScore <= 700
                    ? "Stage 2: Growing Oasis"
                    : "Stage 3: Flourishing Bio-Haven"}
                </div>
              </div>

              {/* The Live 3D Island Component */}
              <div className="py-2">
                <MyEcoWorld3D
                  ecoScore={demoEcoScore}
                  streak={demoStreak}
                  size="compact"
                />
              </div>

              {/* Controls to Test Evolution Stages */}
              <div className="p-4 rounded-2xl bg-[#06170E] border border-emerald-500/20 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-300">Test EcoScore Evolution:</span>
                  <span className="text-emerald-400 font-extrabold text-sm">
                    {demoEcoScore} / 1000
                  </span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="950"
                  step="25"
                  value={demoEcoScore}
                  onChange={(e) => setDemoEcoScore(parseInt(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />

                <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-emerald-900/30">
                  <span className="text-gray-300">Tracking Streak:</span>
                  <span className="text-lime-300 font-extrabold">
                    🔥 {demoStreak} Days Active
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="14"
                  value={demoStreak}
                  onChange={(e) => setDemoStreak(parseInt(e.target.value))}
                  className="w-full accent-lime-400 cursor-pointer"
                />
              </div>

              <p className="text-[11px] text-gray-400 mt-4 leading-relaxed">
                As your household remains within emission limits, the 3D miniature ecosystem grows:
                sprouting oak trees, animated wind turbines, solar panels, and water streams!
              </p>
            </CardTilt3D>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE 3D METRIC CARDS ROW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-6">
          <span className="text-xs font-black uppercase text-emerald-400 tracking-widest block">
            Core Metric Telemetry
          </span>
          <h3 className="text-2xl font-black text-white mt-1">
            Real-Time Stat Cards with 3D Tilt & Specular Sheen
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Today's CO₂ Footprint"
            value="3.91"
            unit="kg CO₂"
            iconName="Leaf"
            trend="-14%"
            trendDirection="down"
            subtitle="7.59 kg below daily budget"
            highlight={true}
          />

          <StatCard
            title="Electricity Consumption"
            value="4.77"
            unit="kWh"
            iconName="Zap"
            trend="-8%"
            trendDirection="down"
            subtitle="₹35.78 estimated energy cost"
          />

          <StatCard
            title="Remaining Budget"
            value="8.59"
            unit="kg CO₂"
            iconName="Target"
            trend="68%"
            trendDirection="up"
            subtitle="Budget resets at midnight"
          />

          <StatCard
            title="EcoCredits Balance"
            value="295"
            unit="Credits"
            iconName="Coins"
            trend="+25"
            trendDirection="up"
            subtitle="Ready to redeem coupons"
          />
        </div>
      </section>

      {/* 4. LAUNCH DEMO CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-emerald-950 via-[#0B2517] to-emerald-950 border border-emerald-500/40">
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Ready to explore your personal household telemetry?
          </h3>
          <p className="text-xs text-gray-300 mt-2 max-w-xl mx-auto">
            Log in to the pre-loaded demonstration account or create your personalized
            household profile in less than two minutes.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button
              onClick={onLogin}
              className="px-7 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 text-charcoal-950 font-black text-xs shadow-lg hover:shadow-glow transition cursor-pointer"
            >
              Open Full Demo Dashboard
            </button>
            <button
              onClick={onGetStarted}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition cursor-pointer"
            >
              Sign Up Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

