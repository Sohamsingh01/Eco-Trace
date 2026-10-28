import React, { useState } from "react";
import CardTilt3D from "../common/CardTilt3D";
import AnimatedCounter from "../common/AnimatedCounter";
import { NATURE_IMAGES } from "../../assets/natureImages";
import {
  ArrowRight,
  Sparkles,
  Bike,
  CheckCircle2,
  TrendingDown,
  Compass,
  Lightbulb,
  Leaf,
  Calendar,
} from "lucide-react";

export default function PhotographicFeatureCards({
  userInfo = {},
  todayStats = {},
  onOpenLogModal,
  onNavigateTab,
}) {
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  const streakDays = userInfo.current_streak ?? 1;
  const ecoCredits = userInfo.eco_credits ?? 150;
  const todayCo2 = todayStats.today_co2_kg ?? 0;
  const dailyTarget = todayStats.daily_target_kg ?? 12.5;

  const handleCompleteChallenge = () => {
    setChallengeCompleted(true);
    if (onOpenLogModal) {
      onOpenLogModal();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Split: Card A (Your Green Journey) & Card B (Today's Eco Challenge) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Card A: Wide Photographic Banner - "Your Green Journey" (8 cols) */}
        <CardTilt3D
          maxTilt={2.5}
          scale={1.008}
          className="lg:col-span-7 relative rounded-3xl overflow-hidden min-h-[300px] flex flex-col justify-between p-6 sm:p-8 shadow-eco-lg group"
        >
          {/* Background High-Res Photograph with Zoom on Hover */}
          <img
            src={NATURE_IMAGES.forestHero.src}
            alt={NATURE_IMAGES.forestHero.alt}
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
          />

          {/* Deep Forest Gradient Overlays for Guaranteed Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-forest-950/95 via-forest-900/80 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-transparent to-black/20 pointer-events-none" />

          {/* Content */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-limeAccent text-[11px] font-extrabold uppercase tracking-widest mb-3">
              <Leaf className="w-3.5 h-3.5" />
              Your Green Journey
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              Every watt conserved heals living forest canopies.
            </h2>
            <p className="text-xs sm:text-sm text-forest-100 mt-2 max-w-md leading-relaxed font-normal">
              By maintaining your household under the {dailyTarget} kg target, you actively prevent coal-fired grid emissions based on CEA national benchmarks.
            </p>
          </div>

          <div className="relative z-10 mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-5">
              <div>
                <span className="text-[10px] uppercase font-bold text-forest-300 tracking-wider block">
                  Active Streak
                </span>
                <span className="text-xl font-black text-white">
                  <AnimatedCounter value={streakDays} decimals={0} suffix=" Days" />
                </span>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <span className="text-[10px] uppercase font-bold text-forest-300 tracking-wider block">
                  EcoCredits
                </span>
                <span className="text-xl font-black text-limeAccent">
                  <AnimatedCounter value={ecoCredits} decimals={0} />
                </span>
              </div>
            </div>

            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab("rewards")}
                className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md active:scale-95 text-white text-xs font-bold transition flex items-center gap-1.5 border border-white/25 shadow-sm"
              >
                <span>Redeem Credits</span>
                <ArrowRight className="w-3.5 h-3.5 text-limeAccent" />
              </button>
            )}
          </div>
        </CardTilt3D>

        {/* Card B: Photographic Challenge Card - "Today's Eco Challenge" (5 cols) */}
        <CardTilt3D
          maxTilt={3}
          scale={1.01}
          className="lg:col-span-5 relative rounded-3xl overflow-hidden min-h-[300px] flex flex-col justify-between p-6 sm:p-7 shadow-eco-lg group"
        >
          {/* Background Photo */}
          <img
            src={NATURE_IMAGES.cyclingNature.src}
            alt={NATURE_IMAGES.cyclingNature.alt}
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/95 via-forest-950/75 to-black/30 pointer-events-none" />

          {/* Header */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/25 backdrop-blur-md border border-emerald-400/30 text-limeAccent text-[11px] font-black uppercase tracking-wider">
                <Bike className="w-3.5 h-3.5" />
                Daily Eco Quest
              </span>
              <span className="text-[11px] font-bold text-amber-300 bg-black/40 px-2.5 py-0.5 rounded-full border border-amber-300/30">
                +15 Credits
              </span>
            </div>

            <h3 className="text-xl font-black text-white tracking-tight mt-1">
              Zero-Emission Short Errand
            </h3>
            <p className="text-xs text-forest-100 mt-1.5 leading-relaxed font-normal">
              Replace one vehicular trip under 3 km with walking or cycling today to save ~450g of fossil combustion.
            </p>
          </div>

          {/* Action Footer */}
          <div className="relative z-10 mt-6 pt-3 border-t border-white/15 flex items-center justify-between">
            <span className="text-xs text-forest-200 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-limeAccent" />
              {challengeCompleted ? "Challenge Logged!" : "1 Goal Remaining"}
            </span>

            <button
              onClick={handleCompleteChallenge}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-eco flex items-center gap-1.5 ${
                challengeCompleted
                  ? "bg-emerald-600 text-white cursor-default"
                  : "bg-forest-800 hover:bg-forest-900 active:scale-95 text-white border border-forest-600/40"
              }`}
            >
              {challengeCompleted ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-limeAccent" />
                  <span>Claimed</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-limeAccent" />
                  <span>Accept Quest</span>
                </>
              )}
            </button>
          </div>
        </CardTilt3D>
      </div>

      {/* Bottom Split: Card C (Discover Your Impact) & Card D (Sustainable Living Tip) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card C: Discover Your Impact */}
        <CardTilt3D
          maxTilt={3}
          scale={1.01}
          className="relative rounded-3xl overflow-hidden min-h-[220px] flex flex-col justify-between p-6 shadow-eco group"
        >
          <img
            src={NATURE_IMAGES.renewableEnergy.src}
            alt={NATURE_IMAGES.renewableEnergy.alt}
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-950/95 via-forest-900/85 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-limeAccent block mb-1">
              Environmental Auditing
            </span>
            <h3 className="text-xl font-black text-white tracking-tight">
              Discover Your Comprehensive Impact
            </h3>
            <p className="text-xs text-forest-200 mt-1 leading-relaxed">
              Analyze multi-week electricity trends, peak appliance loads, and download telemetry CSV reports.
            </p>
          </div>

          <div className="relative z-10 mt-4 flex items-center justify-between">
            <span className="text-xs text-forest-300 font-semibold">
              7-Day & 30-Day Aggregates
            </span>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab("analytics")}
                className="px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <span>View Analytics</span>
                <ArrowRight className="w-3.5 h-3.5 text-limeAccent" />
              </button>
            )}
          </div>
        </CardTilt3D>

        {/* Card D: Sustainable Living Tip */}
        <CardTilt3D
          maxTilt={3}
          scale={1.01}
          className="relative rounded-3xl overflow-hidden min-h-[220px] flex flex-col justify-between p-6 shadow-eco group"
        >
          <img
            src={NATURE_IMAGES.homeGardening.src}
            alt={NATURE_IMAGES.homeGardening.alt}
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-950/95 via-forest-900/85 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-limeAccent flex items-center gap-1 mb-1">
              <Lightbulb className="w-3 h-3 text-limeAccent" />
              Sustainable Living Tip
            </span>
            <h3 className="text-xl font-black text-white tracking-tight">
              Regenerative Soil & Indoor Flora
            </h3>
            <p className="text-xs text-forest-200 mt-1 leading-relaxed">
              Adding 3 indoor broadleaf plants naturally filters volatile organic compounds (VOCs) and improves home thermal humidity.
            </p>
          </div>

          <div className="relative z-10 mt-4 flex items-center justify-between">
            <span className="text-xs text-forest-300 font-semibold">
              Zero energy required
            </span>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab("specs")}
                className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95 border border-white/20"
              >
                <span>Read Eco Specs</span>
                <ArrowRight className="w-3.5 h-3.5 text-limeAccent" />
              </button>
            )}
          </div>
        </CardTilt3D>
      </div>
    </div>
  );
}
