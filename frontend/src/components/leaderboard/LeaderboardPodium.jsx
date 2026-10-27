import React from "react";
import { Trophy, Crown, Flame, ShieldCheck } from "lucide-react";

export default function LeaderboardPodium({ topThree = [] }) {
  if (topThree.length === 0) return null;

  const first = topThree[0];
  const second = topThree[1];
  const third = topThree[2];

  return (
    <div className="bg-gradient-to-b from-forest-900 to-forest-800 rounded-3xl p-6 text-white shadow-eco-lg relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div className="text-center mb-8 relative z-10">
        <span className="text-xs font-extrabold uppercase tracking-widest text-limeAccent">
          EcoTrace Hall of Fame
        </span>
        <h2 className="text-2xl font-black tracking-tight text-white mt-1">
          Household Sustainability Champions
        </h2>
        <p className="text-xs text-forest-200 mt-1 max-w-md mx-auto">
          Ranked dynamically using fair per-capita normalized EcoScore (Carbon Target Adherence + Logging Consistency).
        </p>
      </div>

      {/* Podium Grid: 2nd (Left), 1st (Center, Highest), 3rd (Right) */}
      <div className="flex items-end justify-center gap-3 sm:gap-6 max-w-2xl mx-auto pt-6 relative z-10">
        {/* 2nd Place (Silver) */}
        {second && (
          <div className="flex flex-col items-center flex-1 max-w-[170px]">
            <div className="relative mb-2">
              <img
                src={second.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${second.username}`}
                alt={second.full_name}
                className="w-16 h-16 rounded-full border-4 border-slate-300 bg-white object-cover shadow-lg"
              />
              <span className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-extrabold text-xs flex items-center justify-center border-2 border-white shadow">
                2
              </span>
            </div>
            <span className="font-bold text-xs text-white truncate max-w-[120px] text-center">
              {second.full_name}
            </span>
            <span className="text-[10px] text-forest-200">{second.home_type}</span>

            {/* Podium Pillar */}
            <div className="w-full h-32 mt-3 rounded-t-2xl bg-slate-200/20 backdrop-blur-md border-t-2 border-slate-300 flex flex-col items-center justify-center p-2 text-center">
              <span className="text-xl font-black text-white">{second.eco_score}</span>
              <span className="text-[10px] text-slate-300 uppercase font-semibold">EcoScore</span>
              <div className="mt-1 flex items-center gap-1 text-[10px] text-orange-400 font-bold">
                <Flame className="w-3 h-3 fill-current" />
                {second.current_streak}d
              </div>
            </div>
          </div>
        )}

        {/* 1st Place (Gold) - Elevated */}
        {first && (
          <div className="flex flex-col items-center flex-1 max-w-[200px] -mt-6">
            <div className="relative mb-2">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-amber-300 animate-bounce">
                <Crown className="w-7 h-7 fill-amber-300" />
              </div>
              <img
                src={first.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${first.username}`}
                alt={first.full_name}
                className="w-20 h-20 rounded-full border-4 border-amber-400 bg-white object-cover shadow-glow"
              />
              <span className="absolute -bottom-2.5 -right-1.5 w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center border-2 border-white shadow">
                1
              </span>
            </div>
            <span className="font-extrabold text-sm text-limeAccent truncate max-w-[140px] text-center">
              {first.full_name}
            </span>
            <span className="text-[11px] text-forest-200">{first.home_type} • {first.household_members} members</span>

            {/* Podium Pillar */}
            <div className="w-full h-44 mt-3 rounded-t-2xl bg-amber-400/25 backdrop-blur-md border-t-4 border-amber-400 flex flex-col items-center justify-center p-3 text-center shadow-lg">
              <span className="text-3xl font-black text-amber-300">{first.eco_score}</span>
              <span className="text-[10px] text-amber-200 uppercase font-bold tracking-wider">Top EcoScore</span>
              <div className="mt-2 flex items-center gap-1 text-xs text-orange-400 font-black bg-black/30 px-2 py-0.5 rounded-full">
                <Flame className="w-3.5 h-3.5 fill-current" />
                {first.current_streak} Day Streak
              </div>
            </div>
          </div>
        )}

        {/* 3rd Place (Bronze) */}
        {third && (
          <div className="flex flex-col items-center flex-1 max-w-[170px]">
            <div className="relative mb-2">
              <img
                src={third.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${third.username}`}
                alt={third.full_name}
                className="w-16 h-16 rounded-full border-4 border-amber-700 bg-white object-cover shadow-lg"
              />
              <span className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-amber-700 text-amber-100 font-extrabold text-xs flex items-center justify-center border-2 border-white shadow">
                3
              </span>
            </div>
            <span className="font-bold text-xs text-white truncate max-w-[120px] text-center">
              {third.full_name}
            </span>
            <span className="text-[10px] text-forest-200">{third.home_type}</span>

            {/* Podium Pillar */}
            <div className="w-full h-24 mt-3 rounded-t-2xl bg-amber-800/20 backdrop-blur-md border-t-2 border-amber-700 flex flex-col items-center justify-center p-2 text-center">
              <span className="text-xl font-black text-white">{third.eco_score}</span>
              <span className="text-[10px] text-amber-300 uppercase font-semibold">EcoScore</span>
              <div className="mt-1 flex items-center gap-1 text-[10px] text-orange-400 font-bold">
                <Flame className="w-3 h-3 fill-current" />
                {third.current_streak}d
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
