import React from "react";
import { Trophy, Crown, Flame, ShieldCheck, Sparkles, Award } from "lucide-react";
import CardTilt3D from "../common/CardTilt3D";
import AnimatedCounter from "../common/AnimatedCounter";

export default function LeaderboardPodium({ topThree = [] }) {
  if (topThree.length === 0) return null;

  const first = topThree[0];
  const second = topThree[1];
  const third = topThree[2];

  return (
    <CardTilt3D
      maxTilt={3}
      scale={1.005}
      className="bg-gradient-to-b from-white via-slate-50 to-emerald-50/30 rounded-3xl p-6 sm:p-8 text-slate-900 border border-slate-200/90 shadow-sm relative overflow-hidden"
    >
      {/* Background Decorative Rings & Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-lime-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold uppercase tracking-widest mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          EcoTrace Hall of Fame
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          Household Sustainability Champions
        </h2>
        <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto leading-relaxed">
          Ranked dynamically using fair per-capita normalized EcoScore (Carbon Target Adherence + Logging Consistency).
        </p>
      </div>

      {/* Podium Grid: 2nd (Left), 1st (Center, Highest), 3rd (Right) */}
      <div className="flex items-end justify-center gap-3 sm:gap-6 max-w-2xl mx-auto pt-6 relative z-10">
        {/* 2nd Place (Silver) */}
        {second && (
          <div className="flex flex-col items-center flex-1 max-w-[170px] group transition-transform hover:-translate-y-1 duration-300">
            <div className="relative mb-2">
              <img
                src={second.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${second.username}`}
                alt={second.full_name}
                className="w-16 h-16 rounded-full border-4 border-slate-300 bg-white object-cover shadow-md transition-transform group-hover:scale-105"
              />
              <span className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-gradient-to-tr from-slate-400 to-slate-200 text-slate-900 font-black text-xs flex items-center justify-center border-2 border-white shadow">
                2
              </span>
            </div>
            <span className="font-bold text-xs text-slate-900 truncate max-w-[120px] text-center">
              {second.full_name}
            </span>
            <span className="text-[10px] text-slate-500">{second.home_type}</span>

            {/* 3D Silver Podium Pillar */}
            <div className="w-full h-32 mt-3 rounded-t-2xl bg-gradient-to-b from-slate-100 to-slate-200/60 backdrop-blur-md border-t-2 border-slate-300 flex flex-col items-center justify-center p-2 text-center shadow-sm transition-colors group-hover:from-slate-200/80">
              <span className="text-xl font-black text-slate-900">
                <AnimatedCounter value={second.eco_score} decimals={1} />
              </span>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">EcoScore</span>
              <div className="mt-1 flex items-center gap-1 text-[10px] text-orange-700 font-bold bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                <Flame className="w-3 h-3 fill-current text-orange-500" />
                {second.current_streak}d
              </div>
            </div>
          </div>
        )}

        {/* 1st Place (Gold) - Elevated with Crown & Ambient Gold Glare */}
        {first && (
          <div className="flex flex-col items-center flex-1 max-w-[200px] -mt-6 group transition-transform hover:-translate-y-1.5 duration-300">
            <div className="relative mb-2">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-amber-500 animate-bounce">
                <Crown className="w-7 h-7 fill-amber-400 filter drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]" />
              </div>
              <img
                src={first.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${first.username}`}
                alt={first.full_name}
                className="w-20 h-20 rounded-full border-4 border-amber-400 bg-white object-cover shadow-lg transition-transform group-hover:scale-105"
              />
              <span className="absolute -bottom-2.5 -right-1.5 w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-amber-950 font-black text-xs flex items-center justify-center border-2 border-white shadow-md">
                1
              </span>
            </div>
            <span className="font-extrabold text-sm text-slate-900 truncate max-w-[140px] text-center">
              {first.full_name}
            </span>
            <span className="text-[11px] text-slate-500">
              {first.home_type} • {first.household_members} members
            </span>

            {/* 3D Gold Podium Pillar */}
            <div className="w-full h-44 mt-3 rounded-t-2xl bg-gradient-to-b from-amber-50 via-amber-100/50 to-amber-100/20 backdrop-blur-md border-t-4 border-amber-400 flex flex-col items-center justify-center p-3 text-center shadow-md transition-colors group-hover:from-amber-100/70">
              <span className="text-3xl font-black text-amber-800">
                <AnimatedCounter value={first.eco_score} decimals={1} />
              </span>
              <span className="text-[10px] text-amber-800 uppercase font-bold tracking-wider">
                Top EcoScore
              </span>
              <div className="mt-2 flex items-center gap-1 text-xs text-orange-700 font-black bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                <Flame className="w-3.5 h-3.5 fill-current text-orange-500" />
                {first.current_streak} Day Streak
              </div>
            </div>
          </div>
        )}

        {/* 3rd Place (Bronze) */}
        {third && (
          <div className="flex flex-col items-center flex-1 max-w-[170px] group transition-transform hover:-translate-y-1 duration-300">
            <div className="relative mb-2">
              <img
                src={third.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${third.username}`}
                alt={third.full_name}
                className="w-16 h-16 rounded-full border-4 border-amber-600 bg-white object-cover shadow-md transition-transform group-hover:scale-105"
              />
              <span className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-gradient-to-tr from-amber-800 to-amber-600 text-amber-100 font-extrabold text-xs flex items-center justify-center border-2 border-white shadow">
                3
              </span>
            </div>
            <span className="font-bold text-xs text-slate-900 truncate max-w-[120px] text-center">
              {third.full_name}
            </span>
            <span className="text-[10px] text-slate-500">{third.home_type}</span>

            {/* 3D Bronze Podium Pillar */}
            <div className="w-full h-24 mt-3 rounded-t-2xl bg-gradient-to-b from-amber-50/70 to-orange-100/40 backdrop-blur-md border-t-2 border-amber-600/70 flex flex-col items-center justify-center p-2 text-center shadow-sm transition-colors group-hover:from-amber-100/60">
              <span className="text-xl font-black text-slate-900">
                <AnimatedCounter value={third.eco_score} decimals={1} />
              </span>
              <span className="text-[10px] text-amber-800 uppercase font-semibold">EcoScore</span>
              <div className="mt-1 flex items-center gap-1 text-[10px] text-orange-700 font-bold bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                <Flame className="w-3 h-3 fill-current text-orange-500" />
                {third.current_streak}d
              </div>
            </div>
          </div>
        )}
      </div>
    </CardTilt3D>
  );
}
