import React, { useState, useEffect, useCallback } from "react";
import ScratchCardModal from "../components/rewards/ScratchCardModal";
import EcoCoin3D from "../components/rewards/EcoCoin3D";
import CardTilt3D from "../components/common/CardTilt3D";
import AnimatedCounter from "../components/common/AnimatedCounter";
import { NATURE_IMAGES } from "../assets/natureImages";
import { getRewardVisual } from "../assets/rewardImages";
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
  TrendingUp,
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

      // Celebrate with confetti
      confetti({
        particleCount: 85,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#BEF264", "#22C55E", "#F59E0B", "#166534"],
      });

      // Create local redemption object to pass to ScratchCardModal
      const newRedemption = {
        id: res.redemption_id,
        reward_id: reward.id,
        reward_title: reward.title,
        merchant: reward.merchant,
        discount_text: reward.discount_text,
        voucher_code: res.voucher_code,
        is_revealed: false,
        credits_spent: reward.required_credits,
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

  const getRewardPhoto = (reward) => {
    return getRewardVisual(reward).src;
  };

  // Find next reward target progress
  const nextTarget = rewards
    .filter((r) => r.required_credits > balance)
    .sort((a, b) => a.required_credits - b.required_credits)[0];
  const nextTargetProgress = nextTarget
    ? Math.min(Math.round((balance / nextTarget.required_credits) * 100), 100)
    : 100;

  return (
    <div className="space-y-6 pb-12 relative z-10 text-white">
      {/* Top Banner: GPay Style EcoCredits Header with Nature Photography & Interactive 3D Coin */}
      <CardTilt3D
        maxTilt={2.5}
        scale={1.005}
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-black/50 border border-emerald-500/25 flex flex-col sm:flex-row items-center justify-between gap-6 group hover:border-emerald-400/50 transition-all"
      >
        {/* Photographic Background */}
        <img
          src={NATURE_IMAGES.ecoCity.src}
          alt={NATURE_IMAGES.ecoCity.alt}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-104 pointer-events-none opacity-40"
        />

        {/* Deep Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-[#07180F]/85 to-black/75 pointer-events-none" />

        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-lime-300 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-lime-400/30">
              Rewards Marketplace
            </span>
            <span className="inline-block w-2 h-2 rounded-full bg-lime-400 animate-pulse"></span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mt-1 text-white">
            EcoCredits & Scratch Cards
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-1.5 max-w-lg leading-relaxed">
            Every day your household remains under the carbon budget, you earn EcoCredits. Redeem them below for verified sustainable brand vouchers, plant hampers, and instant scratch cards!
          </p>

          {/* Next Goal Progress Meter */}
          {nextTarget && (
            <div className="mt-4 pt-3.5 border-t border-white/15 max-w-md">
              <div className="flex items-center justify-between text-[11px] text-emerald-200 mb-1.5">
                <span className="font-semibold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-lime-400" />
                  Next Target: {nextTarget.merchant} ({nextTarget.discount_text})
                </span>
                <span className="font-extrabold text-lime-300">
                  {balance} / {nextTarget.required_credits} ({nextTargetProgress}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/50 border border-emerald-500/20 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 rounded-full transition-all duration-700 ease-out shadow-xs"
                  style={{ width: `${nextTargetProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Interactive 3D Coin & Live Balance Card */}
        <div className="relative z-10 flex items-center gap-5 bg-[#040e07]/80 backdrop-blur-xl px-6 py-5 rounded-3xl border border-emerald-500/30 shadow-xl">
          <EcoCoin3D size={88} />

          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider block">
              Available Balance
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-4xl font-black text-white tracking-tight leading-none">
                <AnimatedCounter value={balance} decimals={0} />
              </span>
              <span className="text-xs font-bold text-amber-300 uppercase">
                Credits
              </span>
            </div>
            <span className="text-[10px] text-emerald-100/60 block mt-1">
              Earn +25 Credits for every day under budget
            </span>
          </div>
        </div>
      </CardTilt3D>

      {/* Navigation Tabs between Catalog and User's Redemptions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-[#040e07] border border-emerald-500/25 shadow-inner">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "catalog"
                ? "bg-emerald-500 text-charcoal-950 font-black shadow-md scale-[1.02]"
                : "text-emerald-200/70 hover:text-white hover:bg-emerald-950/40"
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Marketplace Catalog ({rewards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("my_rewards")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "my_rewards"
                ? "bg-emerald-500 text-charcoal-950 font-black shadow-md scale-[1.02]"
                : "text-emerald-200/70 hover:text-white hover:bg-emerald-950/40"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>My Unlocked Rewards ({redemptions.length})</span>
          </button>
        </div>

        <span className="text-[11px] text-emerald-200/60 font-medium">
          *Demonstration codes provided for academic evaluation
        </span>
      </div>

      {/* 1. CATALOG GRID WITH PHOTOGRAPHIC REWARD CARDS & 3D TILT */}
      {activeTab === "catalog" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => {
            const canAfford = balance >= reward.required_credits;
            const visual = getRewardVisual(reward);

            return (
              <CardTilt3D
                key={reward.id}
                maxTilt={6}
                scale={1.02}
                className={`bg-[#07180F]/90 backdrop-blur-xl rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-300 group shadow-xl shadow-black/50 ${
                  canAfford
                    ? "border-emerald-500/30 hover:border-emerald-400/60 hover:shadow-2xl hover:shadow-emerald-950/50"
                    : "border-emerald-950/60 opacity-75"
                }`}
              >
                <div>
                  {/* Photographic Header with Hover Zoom & Authentic Brand Emblems */}
                  <div className="relative h-44 w-full overflow-hidden bg-black">
                    <img
                      src={visual.src}
                      alt={visual.alt}
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                    
                    {/* Atmospheric & Contrast Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07180F] via-black/35 to-black/45 pointer-events-none" />

                    {/* Top Bar: Brand Logo Pill & Category Badge */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      {/* Stylized Brand Emblem */}
                      <div className={`px-2.5 py-1 rounded-xl text-xs font-black shadow-md border flex items-center gap-1.5 backdrop-blur-xs ${visual.badgeBg} ${visual.badgeText} ${visual.borderGlow}`}>
                        <span className="tracking-tight uppercase">{visual.logoBadge}</span>
                      </div>

                      {/* Category Chip */}
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                        {reward.category}
                      </span>
                    </div>

                    {/* Bottom Bar: Merchant Verified Name & Credits */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
                      <span className="text-xs font-black text-white bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        {reward.merchant}
                      </span>

                      <span
                        className={`text-xs font-black px-3 py-1 rounded-full border shadow-sm flex items-center gap-1.5 ${
                          canAfford
                            ? "bg-amber-400 text-amber-950 border-amber-300 font-black"
                            : "bg-black/80 text-gray-300 border-white/20"
                        }`}
                      >
                        <Coins className="w-3.5 h-3.5 text-amber-600" />
                        {reward.required_credits} Credits
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-500/30 uppercase tracking-wider">
                        {visual.tagline}
                      </span>
                    </div>
                    <h3 className="font-black text-base text-white leading-snug">
                      {reward.discount_text}
                    </h3>
                    <p className="text-xs text-emerald-100/70 mt-1.5 leading-relaxed font-normal">
                      {reward.terms}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-emerald-900/40 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-200/60 font-medium">
                    {canAfford
                      ? "Ready to unlock!"
                      : `Need ${reward.required_credits - balance} more credits`}
                  </span>

                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford || redeemingId === reward.id}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                      canAfford
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-lime-400 active:scale-95 text-charcoal-950 shadow-lg shadow-emerald-500/25 cursor-pointer"
                        : "bg-[#040e07] text-gray-500 border border-emerald-950/60 cursor-not-allowed"
                    }`}
                  >
                    {redeemingId === reward.id ? (
                      <span className="animate-pulse">Claiming...</span>
                    ) : canAfford ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-charcoal-950" />
                        <span>Redeem Voucher</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Locked</span>
                      </>
                    )}
                  </button>
                </div>
              </CardTilt3D>
            );
          })}
        </div>
      )}

      {/* 2. MY UNLOCKED REWARDS / SCRATCH CARDS */}
      {activeTab === "my_rewards" && (
        <div>
          {redemptions.length === 0 ? (
            <div className="bg-[#07180F]/90 backdrop-blur-xl rounded-3xl border border-emerald-500/25 shadow-xl p-12 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center mb-3 border border-emerald-500/30 shadow-sm">
                <Gift className="w-7 h-7" />
              </div>
              <h4 className="font-black text-lg text-white">
                No rewards redeemed yet
              </h4>
              <p className="text-xs text-emerald-100/70 max-w-sm mt-1">
                You have {balance} EcoCredits available. Switch back to the Marketplace Catalog to redeem coupons!
              </p>
              <button
                onClick={() => setActiveTab("catalog")}
                className="mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-charcoal-950 text-xs font-black shadow-md hover:brightness-110 transition"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {redemptions.map((red) => {
                const redVisual = getRewardVisual(red);
                return (
                  <CardTilt3D
                    key={red.id}
                    maxTilt={6}
                    scale={1.02}
                    onClick={() => handleOpenScratchCard(red)}
                    className={`rounded-3xl border shadow-xl cursor-pointer transition-all overflow-hidden flex flex-col justify-between ${
                      red.is_revealed
                        ? "bg-[#07180F]/90 border-emerald-500/30 hover:border-emerald-400/60 text-white"
                        : "p-6 bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 text-amber-950 border-amber-300 shadow-glow"
                    }`}
                  >
                    {!red.is_revealed ? (
                      <div className="text-center py-4">
                        <div className="w-12 h-12 rounded-full bg-white/40 mx-auto flex items-center justify-center mb-3 shadow-inner">
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
                        {/* Photographic Header Thumbnail for Unlocked Reward */}
                        <div className="relative h-28 w-full overflow-hidden bg-black">
                          <img
                            src={redVisual.src}
                            alt={redVisual.alt}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#07180F] via-transparent to-black/40" />
                          <div className="absolute top-2.5 left-2.5">
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black border ${redVisual.badgeBg} ${redVisual.badgeText} ${redVisual.borderGlow}`}>
                              {redVisual.logoBadge}
                            </span>
                          </div>
                          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white">
                            <span className="text-[11px] font-black bg-black/60 px-2 py-0.5 rounded-lg backdrop-blur-xs">
                              {red.merchant}
                            </span>
                            <span className="text-[10px] text-lime-300 font-extrabold bg-black/60 px-2 py-0.5 rounded-full">
                              Unlocked
                            </span>
                          </div>
                        </div>

                        <div className="p-4">
                          <h4 className="font-black text-sm text-white mt-1">
                            {red.discount_text}
                          </h4>
                          <div className="mt-3 p-2.5 rounded-xl bg-[#040e07] border border-emerald-500/30 flex items-center justify-between">
                            <span className="font-mono font-bold text-xs text-lime-300 tracking-wider">
                              {red.voucher_code}
                            </span>
                            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              View Code
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="px-4 pb-4 pt-2 border-t border-emerald-900/40 flex items-center justify-between text-[11px] text-emerald-200/60 font-medium">
                      <span>{new Date(red.redeemed_at).toLocaleDateString()}</span>
                      <span>{red.credits_spent} Credits</span>
                    </div>
                  </CardTilt3D>
                );
              })}
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
