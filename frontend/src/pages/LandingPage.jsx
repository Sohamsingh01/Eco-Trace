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
  Sparkles,
  Play,
  Globe,
  TrendingUp,
  Coins,
  TreePine,
  Check,
  Layers,
  Activity,
  Compass,
} from "lucide-react";
import CardTilt3D from "../components/common/CardTilt3D";
import AnimatedCounter from "../components/common/AnimatedCounter";
import EcoGlobe3D from "../components/dashboard/EcoGlobe3D";
import { NATURE_IMAGES } from "../assets/natureImages";

export default function LandingPage({ onGetStarted, onLogin }) {
  // Toggle between 3D photorealistic render and real-time Three.js canvas in hero
  const [heroViewMode, setHeroViewMode] = useState("render"); // "render" or "threejs"

  // Interactive live calculator on landing page
  const [acHours, setAcHours] = useState(4);
  const [fans, setFans] = useState(3);
  const [fuelMinutes, setFuelMinutes] = useState(45);

  // Scientific calculation:
  // AC: 1500W * acHours / 1000 * 0.82 kg/kWh (CEA India)
  // Fans: 75W * fans * 10 hrs / 1000 * 0.82
  // LPG: fuelMinutes/60 * 0.15 kg/hr * 2.983 kg/kg (IPCC Stoichiometric)
  const calcAcCo2 = ((1500 * acHours) / 1000) * 0.82;
  const calcFanCo2 = ((75 * fans * 10) / 1000) * 0.82;
  const calcGasCo2 = (fuelMinutes / 60) * 0.15 * 2.983;
  const totalLandingCo2 = (calcAcCo2 + calcFanCo2 + calcGasCo2).toFixed(2);
  const totalLandingKwh = (
    (1500 * acHours + 75 * fans * 10) / 1000 +
    (fuelMinutes / 60) * 0.15 * 12.8
  ).toFixed(1);

  return (
    <div className="min-h-screen bg-[#06140B] text-white flex flex-col font-sans selection:bg-emerald-500 selection:text-black overflow-x-hidden relative">
      {/* Ambient Radial Glows */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-950/20 rounded-full blur-[180px] pointer-events-none -z-10" />

      {/* 1. TOP NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 bg-[#07180F]/85 backdrop-blur-xl border-b border-emerald-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-lime-400 flex items-center justify-center text-charcoal-950 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <Leaf className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className="font-extrabold text-2xl tracking-tight text-white flex items-center gap-1.5">
                EcoTrace
              </span>
              <span className="text-[10px] block font-bold text-emerald-400 tracking-wider uppercase -mt-1">
                Smart Carbon Tracker
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-300">
            <a
              href="#hero"
              className="text-emerald-400 font-bold border-b-2 border-emerald-400 pb-0.5"
            >
              Home
            </a>
            <a
              href="#why-us"
              className="hover:text-emerald-300 transition-colors"
            >
              Why Us
            </a>
            <a
              href="#dashboard-preview"
              className="hover:text-emerald-300 transition-colors"
            >
              Dashboard
            </a>
            <a
              href="#simulator"
              className="hover:text-emerald-300 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-limeAccent" />
              Live Simulator
            </a>
            <a
              href="#how-it-works"
              className="hover:text-emerald-300 transition-colors"
            >
              Features
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onLogin}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-all shadow-sm hover:border-emerald-500/40"
            >
              Login
            </button>
            <button
              onClick={onGetStarted}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-lime-400 hover:from-emerald-400 hover:to-lime-300 text-charcoal-950 text-xs font-black shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.6)] transition-all flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              Get Started
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section id="hero" className="relative pt-12 lg:pt-16 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headlines & CTA */}
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
                — turning your daily sustainability efforts into real environmental
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
                  onClick={onLogin}
                  className="px-6 py-3.5 rounded-full bg-[#0E2619]/90 hover:bg-[#133322] border border-emerald-500/30 text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2.5 backdrop-blur-md group hover:border-emerald-400/60"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </div>
                  <span>Learn More</span>
                </button>
              </div>

              {/* Quick Feature Pills */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-emerald-900/40 max-w-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-white block leading-tight">
                      Track
                    </span>
                    <span className="text-[10px] text-gray-400 block">
                      Emissions
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-white block leading-tight">
                      Calculate
                    </span>
                    <span className="text-[10px] text-gray-400 block">
                      Credits
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-white block leading-tight">
                      Visualize
                    </span>
                    <span className="text-[10px] text-gray-400 block">
                      Impact
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
                    {/* Atmospheric Overlay to seamlessly blend with page */}
                    <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#06140B]/70 pointer-events-none" />
                  </div>
                ) : (
                  <div className="relative w-full max-w-[460px] aspect-square rounded-3xl bg-[#092215]/80 border border-emerald-500/30 overflow-hidden flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.3)]">
                    <EcoGlobe3D className="w-full h-full" />
                  </div>
                )}

                {/* Mode Switcher Pill (Interactive touch) */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-[#091F13]/90 backdrop-blur-md p-1 rounded-full border border-emerald-500/30 text-[10px] font-bold text-gray-300">
                  <button
                    onClick={() => setHeroViewMode("render")}
                    className={`px-2.5 py-1 rounded-full transition-all ${
                      heroViewMode === "render"
                        ? "bg-emerald-500 text-charcoal-950 font-black shadow-sm"
                        : "hover:text-white"
                    }`}
                  >
                    3D Render
                  </button>
                  <button
                    onClick={() => setHeroViewMode("threejs")}
                    className={`px-2.5 py-1 rounded-full transition-all ${
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

      {/* 3. "WHY CHOOSE US?" SECTION */}
      <section id="why-us" className="py-20 bg-[#07190F]/90 border-t border-b border-emerald-900/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-14 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Why Choose Us?
            </h2>
            <p className="text-sm text-gray-300 mt-2 font-normal leading-relaxed">
              A smarter, simpler and more transparent way to track your carbon
              footprint and earn carbon credits.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="space-y-3 group">
              <div className="w-14 h-14 rounded-full border border-emerald-400/40 bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:border-emerald-300 group-hover:bg-emerald-500/20 transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                <Leaf className="w-7 h-7" />
              </div>
              <h3 className="text-base font-extrabold text-white pt-1">
                Real-Time Tracking
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                Monitor your household electricity, appliances, and offsets in
                real-time with live feedback.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="space-y-3 group">
              <div className="w-14 h-14 rounded-full border border-emerald-400/40 bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:border-emerald-300 group-hover:bg-emerald-500/20 transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-base font-extrabold text-white pt-1">
                Secure & Transparent
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                Built on official CEA India and IPCC emission modeling for trust
                and verifiable scientific accountability.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="space-y-3 group">
              <div className="w-14 h-14 rounded-full border border-emerald-400/40 bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:border-emerald-300 group-hover:bg-emerald-500/20 transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-extrabold text-white pt-1">
                Easy to Use
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                Intuitive glassmorphism dashboards, daily budget rings, and clear
                visual category breakdowns.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="space-y-3 group">
              <div className="w-14 h-14 rounded-full border border-emerald-400/40 bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:border-emerald-300 group-hover:bg-emerald-500/20 transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-base font-extrabold text-white pt-1">
                Support Sustainability
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                Contribute to a cleaner, greener future, climb community
                leaderboards, and redeem partner coupons.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. "TRACK. CALCULATE. CREATE CHANGE." + 3D ANGLED DASHBOARD MOCKUP */}
      <section id="dashboard-preview" className="py-24 relative overflow-hidden">
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

                {/* Glowing neon green ambient aura beneath tablet */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Floating Mini Icon Badges */}
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
                Get detailed insights into your carbon footprint, calculate your
                credits, and be part of a global movement towards a sustainable
                future.
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

              {/* Action Button & Whimsical Script */}
              <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <button
                  onClick={onGetStarted}
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-lime-400 hover:from-emerald-400 hover:to-lime-300 text-charcoal-950 font-black text-sm shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] transition-all flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  Get Started Now
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

      {/* 5. INTERACTIVE LIVE EMISSION SIMULATOR (DARK THEME) */}
      <section id="simulator" className="py-20 bg-[#07190F]/90 border-t border-emerald-900/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black uppercase text-emerald-400 tracking-widest flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-limeAccent" />
              Interactive Live Simulator
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">
              Estimate Your Daily Household Emissions
            </h2>
            <p className="text-xs text-gray-400 mt-2">
              Adjust the sliders below to see your estimated footprint update in real-time.
            </p>
          </div>

          <CardTilt3D
            maxTilt={3}
            scale={1.01}
            className="max-w-4xl mx-auto rounded-3xl bg-[#092215]/90 border border-emerald-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 sm:p-8 backdrop-blur-xl"
          >
            {/* Header / Metric Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-emerald-900/40">
              <div>
                <span className="text-xs font-extrabold uppercase text-emerald-400 tracking-wider">
                  Real-Time Emission Telemetry
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">
                  Household Energy Footprint
                </h3>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs text-gray-400 font-medium block">
                  Simulated Daily Footprint:
                </span>
                <span className="text-3xl font-black text-white">
                  <AnimatedCounter value={parseFloat(totalLandingCo2)} decimals={2} />{" "}
                  <span className="text-sm font-bold text-emerald-400">kg CO₂</span>
                </span>
                <span className="text-xs text-emerald-300 font-bold block mt-0.5">
                  ≈ <AnimatedCounter value={parseFloat(totalLandingKwh)} decimals={1} /> kWh equivalent energy
                </span>
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              {/* AC Slider */}
              <div className="p-4 rounded-2xl bg-[#06170E]/80 border border-emerald-500/20">
                <div className="flex items-center justify-between text-xs font-bold text-gray-200 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    Air Conditioner
                  </span>
                  <span className="text-emerald-400 font-extrabold">{acHours} Hours/Day</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  value={acHours}
                  onChange={(e) => setAcHours(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <span className="text-[11px] text-gray-400 mt-2 block">
                  1.5 Ton 3-Star AC (~1500W, 0.82 kg/kWh)
                </span>
              </div>

              {/* Ceiling Fan Slider */}
              <div className="p-4 rounded-2xl bg-[#06170E]/80 border border-emerald-500/20">
                <div className="flex items-center justify-between text-xs font-bold text-gray-200 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    Ceiling Fans Running
                  </span>
                  <span className="text-emerald-400 font-extrabold">{fans} Fans</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="6"
                  value={fans}
                  onChange={(e) => setFans(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <span className="text-[11px] text-gray-400 mt-2 block">
                  Induction Fan (~75W, 10h daily)
                </span>
              </div>

              {/* LPG Cooking Slider */}
              <div className="p-4 rounded-2xl bg-[#06170E]/80 border border-emerald-500/20">
                <div className="flex items-center justify-between text-xs font-bold text-gray-200 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    Gas Cooking (LPG)
                  </span>
                  <span className="text-emerald-400 font-extrabold">{fuelMinutes} Mins</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="120"
                  step="15"
                  value={fuelMinutes}
                  onChange={(e) => setFuelMinutes(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <span className="text-[11px] text-gray-400 mt-2 block">
                  Stoichiometric combustion (2.983 kg/kg)
                </span>
              </div>
            </div>

            {/* Bottom Call to Action inside Simulator */}
            <div className="mt-6 pt-5 border-t border-emerald-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-gray-400">
                Ready to track your actual household appliances and earn rewards?
              </span>
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-charcoal-950 font-black text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                Log This Footprint in Free Account
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </CardTilt3D>
        </div>
      </section>

      {/* 6. HOW ECOTRACE WORKS (3-STEP FLOW) */}
      <section id="how-it-works" className="py-20 bg-[#06140B] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-black uppercase text-emerald-400 tracking-widest">
              Simple & Powerful
            </span>
            <h2 className="text-3xl font-black text-white mt-1">
              How EcoTrace Works
            </h2>
            <p className="text-xs text-gray-400 mt-2">
              Transforming everyday appliance habits into tangible rewards and measurable carbon reduction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-[#092215]/80 border border-emerald-500/20 relative group hover:border-emerald-400/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-charcoal-950 font-black text-lg flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(16,185,129,0.35)]">
                1
              </div>
              <h3 className="font-extrabold text-base text-white mb-2">
                Log Household Appliances
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                Easily record when you use your AC, geyser, refrigerator, washing machine, or gas stove with duration and operating modes.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#092215]/80 border border-emerald-500/20 relative group hover:border-emerald-400/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-charcoal-950 font-black text-lg flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(16,185,129,0.35)]">
                2
              </div>
              <h3 className="font-extrabold text-base text-white mb-2">
                Calculate & Track Budget
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                Our engine instantly calculates electricity (kWh) and CO₂ emissions using regional grid factors and benchmarks against your daily target.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#092215]/80 border border-emerald-500/20 relative group hover:border-emerald-400/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-lime-400 text-charcoal-950 font-black text-lg flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(190,242,100,0.35)]">
                3
              </div>
              <h3 className="font-extrabold text-base text-white mb-2">
                Earn EcoCredits & Rewards
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                Stay below your target, maintain tracking streaks, unlock Google Pay style scratch cards, and climb fair per-capita leaderboards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="mt-auto bg-[#040C07] text-white py-12 border-t border-emerald-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-lime-400 flex items-center justify-center text-charcoal-950 shadow-md">
              <Leaf className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="font-bold text-lg text-white">EcoTrace</span>
              <p className="text-[11px] text-gray-400">
                Final Year Engineering Project — Smart Household Carbon Footprint Tracker
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 text-gray-400">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition" aria-label="LinkedIn">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2m1.4 9.74v-8.37H5.06v8.37z"/></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition" aria-label="X / Twitter">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition" aria-label="Instagram">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition" aria-label="YouTube">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>

          <div className="text-xs text-gray-400 text-center md:text-right">
            <span>Built with React + Three.js + Tailwind CSS + Python FastAPI + SQLite</span>
            <div className="mt-1 text-[10px] text-gray-500">
              CEA Baseline Emission Factor: 0.82 kg CO₂/kWh • IPCC LPG Factor: 2.983 kg CO₂/kg
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
