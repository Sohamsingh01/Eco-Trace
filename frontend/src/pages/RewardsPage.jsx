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
    <div className="space-y-6 pb-12 relative z-10">
      {/* Top Banner: GPay Style EcoCredits Header with Nature Photography & Interactive 3D Coin */}
      <CardTilt3D
        maxTilt={2.5}
        scale={1.005}
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-eco-lg flex flex-col sm:flex-row items-center justify-between gap-6 group"
      >
        {/* Photographic Background */}
        <img
          src={NATURE_IMAGES.ecoCity.src}
          alt={NATURE_IMAGES.ecoCity.alt}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-104 pointer-events-none opacity-40"
        />

        {/* Deep Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/95 via-forest-900/85 to-forest-950/75 pointer-events-none" />

        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-limeAccent bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              Rewards Marketplace
            </span>
            <span className="inline-block w-2 h-2 rounded-full bg-limeAccent animate-pulse"></span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mt-1">
            EcoCredits & Scratch Cards
          </h1>
          <p className="text-xs sm:text-sm text-forest-100/90 mt-1.5 max-w-lg leading-relaxed">
            Every day your household remains under the carbon budget, you earn EcoCredits. Redeem them below for verified sustainable brand vouchers, plant hampers, and instant scratch cards!
          </p>

          {/* Next Goal Progress Meter */}
          {nextTarget && (
            <div className="mt-4 pt-3.5 border-t border-white/15 max-w-md">
              <div className="flex items-center justify-between text-[11px] text-forest-200 mb-1.5">
                <span className="font-semibold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-limeAccent" />
                  Next Target: {nextTarget.merchant} ({nextTarget.discount_text})
                </span>
                <span className="font-extrabold text-limeAccent">
                  {balance} / {nextTarget.required_credits} ({nextTargetProgress}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/15 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-limeAccent rounded-full transition-all duration-700 ease-out shadow-xs"
                  style={{ width: `${nextTargetProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Interactive 3D Coin & Live Balance Card */}
        <div className="relative z-10 flex items-center gap-5 bg-white/15 backdrop-blur-md px-6 py-5 rounded-3xl border border-white/20 shadow-eco">
          <EcoCoin3D size={88} />

          <div>
            <span className="text-[10px] uppercase font-bold text-forest-200 tracking-wider block">
              Available Balance
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-4xl font-black text-white tracking-tight leading-none">
                <AnimatedCounter value={balance} decimals={0} />
              </span>
              <span className="text-xs font-bold text-limeAccent">Credits</span>
            </div>
            <span className="text-[10px] text-forest-200 mt-1 block">
              +25 per verified clean day
            </span>
          </div>
        </div>
      </CardTilt3D>

      {/* Tabs: Marketplace Catalog vs My Redemptions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-forest-100 shadow-sm">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "catalog"
                ? "bg-forest-800 text-white shadow-eco scale-[1.02]"
                : "text-charcoal-600 hover:text-forest-900 hover:bg-forest-50"
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Marketplace Catalog ({rewards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("my_rewards")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "my_rewards"
                ? "bg-forest-800 text-white shadow-eco scale-[1.02]"
                : "text-charcoal-600 hover:text-forest-900 hover:bg-forest-50"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>My Unlocked Rewards ({redemptions.length})</span>
          </button>
        </div>

        <span className="text-[11px] text-charcoal-400 font-medium">
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
                className={`bg-white rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-300 group ${
                  canAfford
                    ? "border-emerald-200/90 shadow-eco hover:shadow-eco-lg"
                    : "border-gray-200 opacity-80"
                }`}
              >
                <div>
                  {/* Photographic Header with Hover Zoom & Authentic Brand Emblems */}
                  <div className="relative h-44 w-full overflow-hidden bg-forest-950">
                    <img
                      src={visual.src}
                      alt={visual.alt}
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                    
                    {/* Atmospheric & Contrast Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35 pointer-events-none" />

                    {/* Top Bar: Brand Logo Pill & Category Badge */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      {/* Stylized Brand Emblem */}
                      <div className={`px-2.5 py-1 rounded-xl text-xs font-black shadow-md border flex items-center gap-1.5 backdrop-blur-xs ${visual.badgeBg} ${visual.badgeText} ${visual.borderGlow}`}>
                        <span className="tracking-tight uppercase">{visual.logoBadge}</span>
                      </div>

                      {/* Category Chip */}
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-white bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                        {reward.category}
                      </span>
                    </div>

                    {/* Bottom Bar: Merchant Verified Name & Credits */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
                      <span className="text-xs font-black text-white bg-black/70 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        {reward.merchant}
                      </span>

                      <span
                        className={`text-xs font-black px-3 py-1 rounded-full border shadow-sm flex items-center gap-1.5 ${
                          canAfford
                            ? "bg-amber-400 text-amber-950 border-amber-300"
                            : "bg-black/70 text-white border-white/20"
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
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100 uppercase tracking-wider">
                        {visual.tagline}
                      </span>
                    </div>
                    <h3 className="font-black text-base text-charcoal-900 leading-snug">
                      {reward.discount_text}
                    </h3>
                    <p className="text-xs text-charcoal-500 mt-1.5 leading-relaxed font-normal">
                      {reward.terms}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-charcoal-400 font-medium">
                    {canAfford
                      ? "Ready to unlock!"
                      : `Need ${reward.required_credits - balance} more credits`}
                  </span>

                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford || redeemingId === reward.id}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      canAfford
                        ? "bg-forest-800 hover:bg-forest-900 active:scale-95 text-white shadow-eco hover:shadow-glow cursor-pointer"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {redeemingId === reward.id ? (
                      <span className="animate-pulse">Claiming...</span>
                    ) : canAfford ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-limeAccent" />
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
            <div className="bg-white rounded-3xl border border-forest-100 shadow-eco p-12 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-forest-50 text-forest-700 flex items-center justify-center mb-3 shadow-sm">
                <Gift className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-base text-charcoal-800">
                No rewards redeemed yet
              </h4>
              <p className="text-xs text-charcoal-400 max-w-sm mt-1">
                You have {balance} EcoCredits available. Switch back to the Marketplace Catalog to redeem coupons!
              </p>
              <button
                onClick={() => setActiveTab("catalog")}
                className="mt-4 px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold shadow-eco transition"
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
                    className={`rounded-3xl border shadow-eco cursor-pointer transition-all overflow-hidden flex flex-col justify-between ${
                      red.is_revealed
                        ? "bg-white border-forest-100 hover:shadow-eco-lg"
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
                        <div className="relative h-28 w-full overflow-hidden bg-forest-950">
                          <img
                            src={redVisual.src}
                            alt={redVisual.alt}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />
                          <div className="absolute top-2.5 left-2.5">
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black border ${redVisual.badgeBg} ${redVisual.badgeText} ${redVisual.borderGlow}`}>
                              {redVisual.logoBadge}
                            </span>
                          </div>
                          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white">
                            <span className="text-[11px] font-black bg-black/60 px-2 py-0.5 rounded-lg backdrop-blur-xs">
                              {red.merchant}
                            </span>
                            <span className="text-[10px] text-limeAccent font-extrabold bg-black/60 px-2 py-0.5 rounded-full">
                              Unlocked
                            </span>
                          </div>
                        </div>

                        <div className="p-4">
                          <h4 className="font-black text-sm text-charcoal-900 mt-1">
                            {red.discount_text}
                          </h4>
                          <div className="mt-3 p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                            <span className="font-mono font-bold text-xs text-forest-900 tracking-wider">
                              {red.voucher_code}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              View Code
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="px-4 pb-4 pt-2 border-t border-black/10 flex items-center justify-between text-[11px] text-charcoal-500 font-medium">
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
