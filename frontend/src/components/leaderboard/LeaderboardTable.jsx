import React from "react";
import { Flame, Award, ShieldCheck, ChevronUp, ChevronDown } from "lucide-react";

export default function LeaderboardTable({ rankings = [], currentUserId }) {
  return (
    <div className="bg-white rounded-3xl border border-forest-100 shadow-eco overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-forest-950">Community Rankings</h3>
          <p className="text-xs text-charcoal-400">
            Household-normalized benchmark efficiency & streaks
          </p>
        </div>
        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          Fair Per-Capita Model
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-forest-50/40 border-b border-gray-100 text-charcoal-500 font-semibold uppercase tracking-wider">
              <th className="py-3.5 pl-6">Rank</th>
              <th className="py-3.5">Citizen & Household</th>
              <th className="py-3.5">Today vs Target</th>
              <th className="py-3.5 text-center">Streak</th>
              <th className="py-3.5 text-center">Badges</th>
              <th className="py-3.5 text-right pr-6">EcoScore</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rankings.map((user) => {
              const isMe = user.is_current_user || user.user_id === currentUserId;

              return (
                <tr
                  key={user.user_id}
                  className={`transition ${
                    isMe
                      ? "bg-emerald-50/80 font-semibold border-l-4 border-l-emerald-600"
                      : "hover:bg-forest-50/30"
                  }`}
                >
                  {/* Rank */}
                  <td className="py-4 pl-6">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                          user.rank === 1
                            ? "bg-amber-400 text-amber-950"
                            : user.rank === 2
                            ? "bg-slate-300 text-slate-800"
                            : user.rank === 3
                            ? "bg-amber-700 text-white"
                            : "bg-gray-100 text-charcoal-700"
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
                        className="w-9 h-9 rounded-full border border-emerald-200 bg-white object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-charcoal-900 text-sm">
                            {user.full_name}
                          </span>
                          {isMe && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-forest-800 text-white font-bold">
                              YOU
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-charcoal-400 font-normal">
                          @{user.username} • {user.home_type} ({user.household_members} members)
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Today vs Target */}
                  <td className="py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-charcoal-800">
                        {user.daily_co2_actual_kg} / {user.daily_co2_target_kg} kg
                      </span>
                      <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            user.budget_adherence_percent <= 100
                              ? "bg-emerald-500"
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
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 font-bold text-xs border border-orange-100">
                      <Flame className="w-3.5 h-3.5 fill-current" />
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
                            className="text-[10px] px-2 py-0.5 rounded-md bg-forest-50 text-forest-800 font-semibold border border-forest-100"
                          >
                            {b}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-gray-400">—</span>
                      )}
                    </div>
                  </td>

                  {/* EcoScore */}
                  <td className="py-4 text-right pr-6">
                    <span className="text-base font-black text-forest-900">
                      {user.eco_score}
                    </span>
                    <span className="text-[10px] text-charcoal-400 block font-normal">
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
