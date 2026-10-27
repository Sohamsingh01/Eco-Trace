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
    <div className="space-y-6 pb-12">
      {/* Header and Timeframe Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-forest-100 shadow-eco">
        <div>
          <span className="text-xs font-extrabold uppercase text-emerald-700 tracking-wider">
            Competitive League
          </span>
          <h1 className="text-2xl font-black text-charcoal-900 tracking-tight mt-0.5">
            Sustainability Leaderboard
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Household-normalized EcoScores rewarding budget discipline and continuous daily tracking.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 rounded-2xl bg-forest-50 border border-forest-100">
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
                  ? "bg-forest-800 text-white shadow-sm"
                  : "text-charcoal-600 hover:text-forest-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fairness Explanation Alert */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
        <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-900 leading-relaxed">
          <span className="font-bold block mb-0.5">
            How EcoScore is fairly normalized:
          </span>
          Rather than measuring absolute raw emissions (which inherently penalizes multi-generational families or larger homes), our formula evaluates:{" "}
          <strong>45% Carbon Budget Adherence</strong> (staying below your personalized benchmark),{" "}
          <strong>30% Tracking Streak Consistency</strong>, and <strong>25% Log Completeness</strong>.
        </div>
      </div>

      {/* Top 3 Podium Showcase */}
      <LeaderboardPodium topThree={podium} />

      {/* Full Rankings Table */}
      <LeaderboardTable rankings={rankings} currentUserId={user?.id} />
    </div>
  );
}
