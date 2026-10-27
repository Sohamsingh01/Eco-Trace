import React, { useState, useEffect, useCallback } from "react";
import ScratchCardModal from "../components/rewards/ScratchCardModal";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  Coins,
  Gift,
  Sparkles,
  ShoppingBag,
  Utensils,
  Award,
  ShieldCheck,
  HelpCircle,
  Clock,
  CheckCircle2,
  Lock,
  ArrowRight,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function RewardsPage() {
  const { user, updateLocalUser } = useAuth();
  const { showToast } = useToast();

  const [rewards, setRewards] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [balance, setBalance] = useState(user?.eco_credits || 150);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("catalog"); // catalog or my_rewards
  
  // Scratch card modal state
  const [activeRedemption, setActiveRedemption] = useState(null);
  const [isScratchModalOpen, setIsScratchModalOpen] = useState(false);
  const [redeemingId, setRedeemingId] = useState(null);

  const fetchRewards = useCallback(async () => {
    try {
      const data = await api.getRewards();
      setRewards(data.rewards || []);
      setRedemptions(data.redemptions || []);
      setBalance(data.user_balance ?? 150);
      updateLocalUser({ eco_credits: data.user_balance });
    } catch (err) {
      console.error("Failed to load rewards:", err);
      showToast("Could not load rewards marketplace.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast, updateLocalUser]);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  const handleRedeem = async (reward) => {
    if (balance < reward.required_credits) {
      showToast(`You need ${reward.required_credits} EcoCredits to unlock this reward.`, "error");
      return;
    }

    try {
      setRedeemingId(reward.id);
      const res = await api.redeemReward(reward.id);

      // Create local redemption object to pass to ScratchCardModal
      const newRedemption = {
        id: res.redemption_id,
        reward_id: reward.id,
        reward_title: reward.title,
        merchant: reward.merchant,
        discount_text: reward.discount_text,
        voucher_code: res.voucher_code,
        credits_spent: reward.required_credits,
        is_revealed: false,
      };

      setBalance(res.new_balance);
      updateLocalUser({ eco_credits: res.new_balance });
      setActiveRedemption(newRedemption);
      setIsScratchModalOpen(true);
      fetchRewards();
    } catch (err) {
      showToast(err.message || "Failed to redeem reward.", "error");
    } finally {
      setRedeemingId(null);
    }
  };

  const handleOpenScratchCard = (redemption) => {
    setActiveRedemption(redemption);
    setIsScratchModalOpen(true);
  };

  const getRewardIcon = (category) => {
    switch (category) {
      case "Shopping":
        return <ShoppingBag className="w-5 h-5 text-emerald-600" />;
      case "Food":
        return <Utensils className="w-5 h-5 text-orange-600" />;
      case "Eco Swag":
        return <ShieldCheck className="w-5 h-5 text-lime-600" />;
      case "Bonus":
        return <HelpCircle className="w-5 h-5 text-amber-500" />;
      default:
        return <Gift className="w-5 h-5 text-forest-800" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: GPay Style EcoCredits Header */}
      <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-eco-lg relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="relative z-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-limeAccent">
            Google Pay Inspired Gamification
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
            Rewards Marketplace & Scratch Cards
          </h1>
          <p className="text-xs text-forest-200 mt-1 max-w-md">
            Earn credits for logging activities and remaining below your daily carbon budget. Redeem below for simulated vouchers and certificates!
          </p>
        </div>

        {/* Balance Card */}
        <div className="relative z-10 flex items-center gap-3.5 bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/15 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-black shadow-sm">
            <Coins className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-forest-200 tracking-wider block">
              Available EcoCredits
            </span>
            <span className="text-3xl font-black text-white leading-tight">
              {balance}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs: Marketplace Catalog vs My Redemptions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-white border border-forest-100 shadow-sm">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "catalog"
                ? "bg-forest-800 text-white shadow-sm"
                : "text-charcoal-600 hover:text-forest-900"
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Marketplace Catalog ({rewards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("my_rewards")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "my_rewards"
                ? "bg-forest-800 text-white shadow-sm"
                : "text-charcoal-600 hover:text-forest-900"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>My Unlocked Rewards ({redemptions.length})</span>
          </button>
        </div>

        <span className="text-xs text-charcoal-400 hidden sm:inline font-medium">
          *Demonstration codes provided for academic evaluation
        </span>
      </div>

      {/* 1. CATALOG GRID */}
      {activeTab === "catalog" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rewards.map((reward) => {
            const canAfford = balance >= reward.required_credits;

            return (
              <div
                key={reward.id}
                className="bg-white rounded-3xl border border-forest-100 shadow-eco hover:shadow-eco-lg transition-all p-6 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center">
                      {getRewardIcon(reward.category)}
                    </div>
                    <span className="text-xs font-extrabold text-forest-900 bg-forest-50 px-3 py-1 rounded-full border border-forest-100 flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-amber-500" />
                      {reward.required_credits} Credits
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                    {reward.merchant}
                  </span>
                  <h3 className="font-extrabold text-base text-charcoal-900 mt-0.5 leading-snug">
                    {reward.discount_text}
                  </h3>
                  <p className="text-xs text-charcoal-500 mt-2 leading-relaxed">
                    {reward.terms}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-charcoal-400">
                    {canAfford ? "Ready to redeem" : `Need ${reward.required_credits - balance} more`}
                  </span>

                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford || redeemingId === reward.id}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      canAfford
                        ? "bg-forest-800 hover:bg-forest-900 text-white shadow-eco group-hover:shadow-glow"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {redeemingId === reward.id ? (
                      <span className="animate-pulse">Claiming...</span>
                    ) : canAfford ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-limeAccent" />
                        <span>Redeem</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Locked</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. MY UNLOCKED REWARDS / SCRATCH CARDS */}
      {activeTab === "my_rewards" && (
        <div>
          {redemptions.length === 0 ? (
            <div className="bg-white rounded-3xl border border-forest-100 shadow-eco p-12 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-forest-50 text-forest-700 flex items-center justify-center mb-3">
                <Gift className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-charcoal-800">
                No rewards redeemed yet
              </h4>
              <p className="text-xs text-charcoal-400 max-w-sm mt-1">
                You have {balance} EcoCredits available. Switch back to the Marketplace Catalog to redeem coupons!
              </p>
              <button
                onClick={() => setActiveTab("catalog")}
                className="mt-4 px-5 py-2.5 rounded-xl bg-forest-800 text-white text-xs font-bold shadow-sm"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {redemptions.map((red) => (
                <div
                  key={red.id}
                  onClick={() => handleOpenScratchCard(red)}
                  className={`p-6 rounded-3xl border shadow-eco cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between ${
                    red.is_revealed
                      ? "bg-white border-forest-100"
                      : "bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 text-amber-950 border-amber-300 shadow-glow"
                  }`}
                >
                  {!red.is_revealed ? (
                    <div className="text-center py-4">
                      <div className="w-12 h-12 rounded-full bg-white/40 mx-auto flex items-center justify-center mb-3">
                        <Sparkles className="w-6 h-6 text-amber-900 animate-spin" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider block">
                        Scratch Card Waiting
                      </span>
                      <h4 className="font-black text-lg text-amber-950 mt-1">
                        {red.reward_title}
                      </h4>
                      <p className="text-xs font-semibold opacity-80 mt-1">
                        Tap to reveal coupon
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                          {red.merchant}
                        </span>
                        <span className="text-[10px] text-charcoal-400">
                          Revealed
                        </span>
                      </div>
                      <h4 className="font-black text-base text-charcoal-900 mt-1">
                        {red.discount_text}
                      </h4>
                      <div className="mt-4 p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-forest-900 tracking-wider">
                          {red.voucher_code}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-semibold">
                          View Code
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between text-[11px] opacity-80 font-medium">
                    <span>{new Date(red.redeemed_at).toLocaleDateString()}</span>
                    <span>{red.credits_spent} Credits</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Interactive Scratch Card Modal */}
      <ScratchCardModal
        isOpen={isScratchModalOpen}
        onClose={() => setIsScratchModalOpen(false)}
        redemption={activeRedemption}
        onRevealed={() => {
          fetchRewards();
        }}
      />
    </div>
  );
}
