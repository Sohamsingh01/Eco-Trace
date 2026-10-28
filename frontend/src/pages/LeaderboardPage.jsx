import React, { useState, useEffect, useCallback } from "react";
import LeaderboardPodium from "../components/leaderboard/LeaderboardPodium";
import LeaderboardTable from "../components/leaderboard/LeaderboardTable";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Trophy, ShieldCheck, Flame, Users, Info } from "lucide-react";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [timeframe, setTimeframe] = useState("weekly");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getLeaderboard(timeframe);
      setData(res);
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
      showToast("Unable to load leaderboard data.", "error");
    } finally {
      setLoading(false);
    }
  }, [timeframe, showToast]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const { podium = [], rankings = [], current_user_rank = 1 } = data || {};

  return (
    <div className="space-y-6 pb-12 relative z-10 text-slate-900">
      {/* Header and Timeframe Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm hover:border-emerald-500/40 transition-all">
        <div>
          <span className="text-xs font-extrabold uppercase text-emerald-700 tracking-wider">
            Competitive League
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Sustainability Leaderboard
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-xl">
            Household-normalized EcoScores rewarding budget discipline and continuous daily tracking.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 border border-slate-200 shadow-inner">
          {[
            { id: "weekly", label: "This Week" },
            { id: "monthly", label: "This Month" },
            { id: "global", label: "All-Time" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTimeframe(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                timeframe === tab.id
                  ? "bg-emerald-600 text-white font-black shadow-sm scale-[1.02]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fairness Explanation Alert */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3 shadow-sm">
        <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <span className="font-black text-slate-900 block mb-0.5">
            How EcoScore is fairly normalized:
          </span>
          Rather than measuring absolute raw emissions (which inherently penalizes multi-generational families or larger homes), our formula evaluates:{" "}
          <strong className="text-emerald-800">45% Carbon Budget Adherence</strong> (staying below your personalized benchmark),{" "}
          <strong className="text-emerald-800">30% Tracking Streak Consistency</strong>, and <strong className="text-emerald-800">25% Log Completeness</strong>.
        </div>
      </div>

      {/* Top 3 Podium Showcase */}
      <LeaderboardPodium topThree={podium} />

      {/* Full Rankings Table */}
      <LeaderboardTable rankings={rankings} currentUserId={user?.id} />
    </div>
  );
}
