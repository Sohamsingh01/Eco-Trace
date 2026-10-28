import React from "react";
import { Flame, Award, ShieldCheck, ChevronUp, ChevronDown } from "lucide-react";

export default function LeaderboardTable({ rankings = [], currentUserId }) {
  return (
    <div className="bg-[#07180F]/90 backdrop-blur-xl rounded-3xl border border-emerald-500/25 shadow-xl shadow-black/50 overflow-hidden text-white hover:border-emerald-400/50 transition-all">
      <div className="p-6 border-b border-emerald-900/50 flex items-center justify-between">
        <div>
          <h3 className="font-black text-lg text-white">Community Rankings</h3>
          <p className="text-xs text-emerald-200/60">
            Household-normalized benchmark efficiency & streaks
          </p>
        </div>
        <span className="text-xs font-bold text-emerald-300 bg-emerald-950/70 px-3.5 py-1 rounded-full border border-emerald-500/30">
          Fair Per-Capita Model
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#040e07] border-b border-emerald-900/60 text-emerald-300/70 font-bold uppercase tracking-wider">
              <th className="py-3.5 pl-6">Rank</th>
              <th className="py-3.5">Citizen & Household</th>
              <th className="py-3.5">Today vs Target</th>
              <th className="py-3.5 text-center">Streak</th>
              <th className="py-3.5 text-center">Badges</th>
              <th className="py-3.5 text-right pr-6">EcoScore</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-950/40">
            {rankings.map((user) => {
              const isMe = user.is_current_user || user.user_id === currentUserId;

              return (
                <tr
                  key={user.user_id}
                  className={`transition ${
                    isMe
                      ? "bg-emerald-950/60 font-semibold border-l-4 border-l-emerald-400"
                      : "hover:bg-emerald-950/30"
                  }`}
                >
                  {/* Rank */}
                  <td className="py-4 pl-6">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                          user.rank === 1
                            ? "bg-amber-400 text-amber-950 shadow-sm"
                            : user.rank === 2
                            ? "bg-slate-300 text-slate-900 shadow-sm"
                            : user.rank === 3
                            ? "bg-amber-700 text-white shadow-sm"
                            : "bg-[#040e07] text-emerald-300 border border-emerald-500/20"
                        }`}
                      >
                        {user.rank}
                      </span>
                    </div>
                  </td>

                  {/* Citizen Info */}
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}
                        alt={user.full_name}
                        className="w-9 h-9 rounded-full border-2 border-emerald-400/80 bg-black/40 object-cover shadow-sm"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-sm">
                            {user.full_name}
                          </span>
                          {isMe && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-charcoal-950 font-black">
                              YOU
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-emerald-200/60 font-normal">
                          @{user.username} • {user.home_type} ({user.household_members} members)
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Today vs Target */}
                  <td className="py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-emerald-100">
                        {user.daily_co2_actual_kg} / {user.daily_co2_target_kg} kg
                      </span>
                      <div className="w-24 h-1.5 bg-[#040e07] rounded-full mt-1.5 overflow-hidden border border-emerald-500/20">
                        <div
                          className={`h-full rounded-full ${
                            user.budget_adherence_percent <= 100
                              ? "bg-gradient-to-r from-emerald-500 to-lime-400"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: `${Math.min(user.budget_adherence_percent, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>

                  {/* Streak */}
                  <td className="py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-950/70 text-orange-300 font-bold text-xs border border-orange-500/30">
                      <Flame className="w-3.5 h-3.5 fill-current text-orange-400" />
                      {user.current_streak}d
                    </span>
                  </td>

                  {/* Badges */}
                  <td className="py-4 text-center">
                    <div className="flex items-center justify-center gap-1 flex-wrap max-w-xs mx-auto">
                      {user.badges && user.badges.length > 0 ? (
                        user.badges.slice(0, 2).map((b, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 font-semibold border border-emerald-500/30"
                          >
                            {b}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-gray-500">—</span>
                      )}
                    </div>
                  </td>

                  {/* EcoScore */}
                  <td className="py-4 text-right pr-6">
                    <span className="text-base font-black text-lime-300">
                      {user.eco_score}
                    </span>
                    <span className="text-[10px] text-emerald-200/60 block font-normal">
                      pts
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
