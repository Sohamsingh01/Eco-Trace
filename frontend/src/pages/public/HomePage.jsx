import React, { useState } from "react";
import {
  Leaf,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  CheckCircle2,
  Sparkles,
  Play,
  Globe,
  Coins,
  TreePine,
  Check,
  Activity,
  Compass,
} from "lucide-react";
import CardTilt3D from "../../components/common/CardTilt3D";
import EcoGlobe3D from "../../components/dashboard/EcoGlobe3D";
import { NATURE_IMAGES } from "../../assets/natureImages";

export default function HomePage({ onNavigate, onGetStarted, onLogin }) {
  const [heroViewMode, setHeroViewMode] = useState("render");

  return (
    <div className="space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative pt-8 lg:pt-14 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headlines & Action CTAs */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Eyebrow */}
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 tracking-wider uppercase">
                <span>Track</span>
                <span className="text-emerald-600">•</span>
                <span>Measure</span>
                <span className="text-emerald-600">•</span>
                <span>Make an Impact</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Your Carbon Journey,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-lime-300 drop-shadow-[0_0_35px_rgba(52,211,153,0.4)]">
                  Our Shared Planet
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-gray-300 font-normal leading-relaxed max-w-xl">
                EcoTrace helps you monitor, manage and reduce household emissions
                — turning daily sustainability efforts into real environmental
                impact and redeemable rewards.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onGetStarted}
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-lime-400 hover:from-emerald-400 hover:to-lime-300 text-charcoal-950 font-black text-sm shadow-[0_0_30px_rgba(16,185,129,0.45)] hover:shadow-[0_0_45px_rgba(16,185,129,0.7)] transition-all flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  Start Tracking
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <button
                  onClick={() => onNavigate("simulator")}
                  className="px-6 py-3.5 rounded-full bg-[#0E2619]/90 hover:bg-[#133322] border border-emerald-500/30 text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2.5 backdrop-blur-md group hover:border-emerald-400/60 cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </div>
                  <span>Try Simulator</span>
                </button>
              </div>

              {/* Quick Feature Pills (Clicking leads to that page!) */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-emerald-900/40 max-w-md">
                <div
                  onClick={() => onNavigate("why-us")}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 transition cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 group-hover:bg-emerald-500/20">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-white block leading-tight">
                      Track
                    </span>
                    <span className="text-[10px] text-gray-400 block">
                      Emissions →
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => onNavigate("simulator")}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 transition cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 group-hover:bg-emerald-500/20">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-white block leading-tight">
                      Calculate
                    </span>
                    <span className="text-[10px] text-gray-400 block">
                      Credits →
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => onNavigate("dashboard")}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 transition cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 group-hover:bg-emerald-500/20">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-white block leading-tight">
                      Visualize
                    </span>
                    <span className="text-[10px] text-gray-400 block">
                      Impact →
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Earth Podium Centerpiece with Floating Glassmorphic Stat Cards */}
            <div className="lg:col-span-6 relative">
              <CardTilt3D
                maxTilt={4}
                scale={1.01}
                className="relative rounded-3xl p-4 sm:p-6 flex items-center justify-center min-h-[480px] sm:min-h-[520px]"
              >
                {/* Glowing Circular Holographic Podium Rim */}
                <div className="absolute inset-x-8 bottom-6 h-32 rounded-full bg-gradient-to-t from-emerald-500/25 via-emerald-400/10 to-transparent blur-2xl pointer-events-none" />

                {/* Centerpiece Visual: 3D Earth on Podium */}
                {heroViewMode === "render" ? (
                  <div className="relative w-full max-w-[460px] aspect-square rounded-3xl overflow-hidden flex items-center justify-center">
                    <img
                      src={NATURE_IMAGES.heroEarthPodium.src}
                      alt={NATURE_IMAGES.heroEarthPodium.alt}
                      className="w-full h-full object-cover rounded-3xl shadow-[0_0_60px_rgba(16,185,129,0.3)] filter contrast-[1.05]"
                    />
                    <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#06140B]/70 pointer-events-none" />
                  </div>
                ) : (
                  <div className="relative w-full max-w-[460px] aspect-square rounded-3xl bg-[#092215]/80 border border-emerald-500/30 overflow-hidden flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.3)]">
                    <EcoGlobe3D className="w-full h-full" />
                  </div>
                )}

                {/* Mode Switcher Pill */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-[#091F13]/90 backdrop-blur-md p-1 rounded-full border border-emerald-500/30 text-[10px] font-bold text-gray-300">
                  <button
                    onClick={() => setHeroViewMode("render")}
                    className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                      heroViewMode === "render"
                        ? "bg-emerald-500 text-charcoal-950 font-black shadow-sm"
                        : "hover:text-white"
                    }`}
                  >
                    3D Render
                  </button>
                  <button
                    onClick={() => setHeroViewMode("threejs")}
                    className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                      heroViewMode === "threejs"
                        ? "bg-emerald-500 text-charcoal-950 font-black shadow-sm"
                        : "hover:text-white"
                    }`}
                  >
                    Interactive Canvas
                  </button>
                </div>

                {/* Floating Glassmorphic Stat Card 1: Top-Left (CO2 Reduced) */}
                <div className="absolute top-8 -left-2 sm:left-2 z-20 bg-[#0B2417]/85 backdrop-blur-xl border border-emerald-400/30 rounded-2xl p-3 sm:p-4 shadow-[0_15px_35px_rgba(0,0,0,0.6)] flex items-center gap-3 animate-float-gentle">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-charcoal-950 shadow-md shrink-0">
                    <Leaf className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-300 block tracking-wider">
                      CO₂ Reduced
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-base sm:text-lg font-black text-white tracking-tight">
                        1,248 t
                      </span>
                      <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                        ↑ 12%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Glassmorphic Stat Card 2: Top-Right (Carbon Credits) */}
                <div
                  className="absolute top-16 -right-2 sm:right-2 z-20 bg-[#0B2417]/85 backdrop-blur-xl border border-emerald-400/30 rounded-2xl p-3 sm:p-4 shadow-[0_15px_35px_rgba(0,0,0,0.6)] flex items-center gap-3 animate-float-gentle"
                  style={{ animationDelay: "1.2s" }}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-lime-500 to-emerald-400 flex items-center justify-center text-charcoal-950 shadow-md shrink-0">
                    <Coins className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-300 block tracking-wider">
                      Carbon Credits
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-base sm:text-lg font-black text-white tracking-tight">
                        624
                      </span>
                      <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                        ↑ 18%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Glassmorphic Stat Card 3: Bottom-Right (Trees Equivalent) */}
                <div
                  className="absolute bottom-10 -right-2 sm:right-4 z-20 bg-[#0B2417]/85 backdrop-blur-xl border border-emerald-400/30 rounded-2xl p-3 sm:p-4 shadow-[0_15px_35px_rgba(0,0,0,0.6)] flex items-center gap-3 animate-float-gentle"
                  style={{ animationDelay: "2.4s" }}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-charcoal-950 shadow-md shrink-0">
                    <TreePine className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-300 block tracking-wider">
                      Trees Equivalent
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-base sm:text-lg font-black text-white tracking-tight">
                        5,720
                      </span>
                      <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                        ↑ 20%
                      </span>
                    </div>
                  </div>
                </div>
              </CardTilt3D>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US PREVIEW SECTION */}
      <section className="py-20 bg-[#07190F]/90 border-t border-b border-emerald-900/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div className="max-w-2xl text-left">
              <span className="text-xs font-black uppercase text-emerald-400 tracking-widest block mb-1">
                Engineered for Integrity
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Why Choose Us?
              </h2>
              <p className="text-sm text-gray-300 mt-2 font-normal leading-relaxed">
                A smarter, simpler, and scientifically verifiable way to track your household
                carbon footprint and earn carbon credits.
              </p>
            </div>

            <button
              onClick={() => onNavigate("why-us")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0E2A1A] hover:bg-emerald-600 text-emerald-300 hover:text-charcoal-950 font-bold text-xs border border-emerald-500/30 transition-all cursor-pointer self-start md:self-auto"
            >
              <span>Read Full Scientific Methodology</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3 group p-4 rounded-2xl hover:bg-white/5 transition">
              <div className="w-14 h-14 rounded-full border border-emerald-400/40 bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:border-emerald-300 group-hover:bg-emerald-500/20 transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                <Leaf className="w-7 h-7" />
              </div>
              <h3 className="text-base font-extrabold text-white pt-1">
                Real-Time Tracking
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                Monitor your household electricity, appliances, and offsets in real-time with instant telemetry.
              </p>
            </div>

            <div className="space-y-3 group p-4 rounded-2xl hover:bg-white/5 transition">
              <div className="w-14 h-14 rounded-full border border-emerald-400/40 bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:border-emerald-300 group-hover:bg-emerald-500/20 transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-base font-extrabold text-white pt-1">
                Secure & Transparent
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                Built on official CEA India (0.82 kg/kWh) and IPCC stoichiometric gas models for scientific accountability.
              </p>
            </div>

            <div className="space-y-3 group p-4 rounded-2xl hover:bg-white/5 transition">
              <div className="w-14 h-14 rounded-full border border-emerald-400/40 bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:border-emerald-300 group-hover:bg-emerald-500/20 transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-extrabold text-white pt-1">
                Easy to Use
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                Intuitive glassmorphism dashboards, dynamic daily carbon budget rings, and clear visual breakdown charts.
              </p>
            </div>

            <div className="space-y-3 group p-4 rounded-2xl hover:bg-white/5 transition">
              <div className="w-14 h-14 rounded-full border border-emerald-400/40 bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:border-emerald-300 group-hover:bg-emerald-500/20 transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-base font-extrabold text-white pt-1">
                Support Sustainability
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                Contribute to a cleaner future, climb fair community leaderboards, and redeem partner coupons.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW SPOTLIGHT */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: 3D Angled Dashboard Tablet Screen Mockup */}
            <div className="lg:col-span-7 relative">
              <CardTilt3D
                maxTilt={4}
                scale={1.02}
                className="relative rounded-3xl overflow-hidden p-2 bg-gradient-to-tr from-emerald-950 via-[#0C2417] to-emerald-950/60 border border-emerald-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.7)] group"
              >
                <img
                  src={NATURE_IMAGES.dashboardMockup3d.src}
                  alt={NATURE_IMAGES.dashboardMockup3d.alt}
                  className="w-full h-auto object-cover rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.25)] transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                <div className="absolute -top-3 -left-3 w-12 h-12 rounded-2xl bg-[#0F2F1E] border border-emerald-400/50 flex items-center justify-center text-emerald-400 shadow-lg animate-float-gentle">
                  <Leaf className="w-6 h-6" />
                </div>
                <div
                  className="absolute -bottom-3 -right-3 w-12 h-12 rounded-2xl bg-[#0F2F1E] border border-emerald-400/50 flex items-center justify-center text-emerald-400 shadow-lg animate-float-gentle"
                  style={{ animationDelay: "1.5s" }}
                >
                  <BarChart3 className="w-6 h-6" />
                </div>
              </CardTilt3D>
            </div>

            {/* Right Column: Narrative & Checklist */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <span className="text-xs font-black uppercase text-emerald-400 tracking-widest block">
                Real Insights. Lasting Impact.
              </span>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Track. Calculate.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-lime-300">
                  Create Change.
                </span>
              </h2>

              <p className="text-sm text-gray-300 font-normal leading-relaxed">
                Get detailed insights into your carbon footprint, calculate your credits,
                and be part of a global movement towards a sustainable future.
              </p>

              {/* Checklist */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm text-gray-200 font-medium">
                    Carbon credit calculation with CEA & IPCC formulas
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm text-gray-200 font-medium">
                    Daily budget tracking with live progress rings
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm text-gray-200 font-medium">
                    Detailed reports, appliance share & analytics
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate("dashboard")}
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-lime-400 hover:from-emerald-400 hover:to-lime-300 text-charcoal-950 font-black text-sm shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] transition-all flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  Explore Interactive Tour
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <div className="font-serif italic text-emerald-400/80 text-sm flex items-center gap-1.5 select-none">
                  <span>Small steps, Big impact</span>
                  <Leaf className="w-4 h-4 text-emerald-400 inline" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK LAUNCH BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-[#0A2617] to-emerald-950 border border-emerald-500/30 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-black uppercase text-emerald-400 tracking-widest block">
              Start Making a Measurable Difference
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Ready to Track Your Household Footprint?
            </h2>
            <p className="text-sm text-gray-300 font-normal">
              Join thousands of households taking active steps to lower electricity bills,
              stay within science-backed carbon budgets, and earn real-world rewards.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <button
                onClick={onGetStarted}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 text-charcoal-950 font-black text-sm shadow-lg hover:shadow-[0_0_35px_rgba(16,185,129,0.6)] transition cursor-pointer"
              >
                Create Free Account
              </button>
              <button
                onClick={onLogin}
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition cursor-pointer"
              >
                Try Demo Account
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

