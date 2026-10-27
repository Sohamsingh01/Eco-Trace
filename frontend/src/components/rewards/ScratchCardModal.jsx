import React, { useState } from "react";
import Modal from "../common/Modal";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { Sparkles, Copy, Check, Gift, Award, Coins } from "lucide-react";
import confetti from "canvas-confetti";

export default function ScratchCardModal({
  isOpen,
  onClose,
  redemption,
  onRevealed,
}) {
  const { showToast } = useToast();
  const { updateLocalUser } = useAuth();
  const [isScratching, setIsScratching] = useState(false);
  const [revealed, setRevealed] = useState(redemption?.is_revealed || false);
  const [voucherCode, setVoucherCode] = useState(redemption?.voucher_code || "");
  const [copied, setCopied] = useState(false);

  if (!redemption) return null;

  const handleReveal = async () => {
    if (revealed || isScratching) return;
    try {
      setIsScratching(true);
      const res = await api.revealScratchCard(redemption.id);
      
      // Fire celebration confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#22C55E", "#BEF264", "#F59E0B", "#166534"],
      });

      setRevealed(true);
      setVoucherCode(res.voucher_code);
      if (res.new_balance) {
        updateLocalUser({ eco_credits: res.new_balance });
      }
      showToast("Reward revealed successfully!", "award");
      if (onRevealed) onRevealed(res);
    } catch (err) {
      showToast(err.message || "Failed to reveal scratch card.", "error");
    } finally {
      setIsScratching(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(voucherCode);
    setCopied(true);
    showToast("Voucher code copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="EcoTrace Rewards — Scratch & Win">
      <div className="flex flex-col items-center text-center p-2">
        <span className="text-xs font-semibold text-charcoal-400 mb-3">
          Simulated Demonstration Voucher Reward
        </span>

        {/* Scratch Card Outer Envelope */}
        <div
          onClick={handleReveal}
          className={`w-72 h-80 rounded-3xl relative overflow-hidden shadow-2xl cursor-pointer transition-all duration-500 transform ${
            revealed ? "bg-gradient-to-br from-forest-900 via-forest-800 to-emerald-900 border-2 border-limeAccent" : "bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 hover:scale-105 active:scale-95 shadow-glow"
          }`}
        >
          {!revealed ? (
            /* Unscratched Cover (Google Pay Style Foil) */
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-amber-950">
              <div className="w-16 h-16 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center mb-4 shadow-sm animate-bounce">
                <Gift className="w-8 h-8 text-amber-900" />
              </div>
              <h4 className="font-black text-xl tracking-tight mb-1">
                TAP TO SCRATCH
              </h4>
              <p className="text-xs font-semibold opacity-90 max-w-[180px]">
                {redemption.reward_title || "Mystery Sustainability Bonus"}
              </p>
              <div className="mt-6 px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-sm text-xs font-bold text-amber-950 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                {isScratching ? "Scratching..." : "Click to Reveal"}
              </div>
            </div>
          ) : (
            /* Revealed Reward Card */
            <div className="absolute inset-0 flex flex-col items-center justify-between p-6 text-white animate-in zoom-in duration-300">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-2 border border-white/20">
                  <Award className="w-6 h-6 text-limeAccent" />
                </div>
                <span className="text-[11px] font-bold text-limeAccent uppercase tracking-widest">
                  {redemption.merchant || "Eco Partner"}
                </span>
                <h4 className="font-extrabold text-lg text-white mt-1 leading-tight">
                  {redemption.discount_text || redemption.reward_title}
                </h4>
              </div>

              {/* Code Voucher Box */}
              <div className="w-full bg-black/40 backdrop-blur-md rounded-2xl p-3 border border-white/15 my-2">
                <span className="text-[10px] uppercase font-bold text-gray-300 block mb-1">
                  Demo Promo Code
                </span>
                <div className="flex items-center justify-between px-2 py-1 bg-white/10 rounded-xl">
                  <span className="font-mono font-black text-sm tracking-widest text-limeAccent">
                    {voucherCode}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy();
                    }}
                    className="p-1 rounded-lg hover:bg-white/20 text-white transition"
                    title="Copy Code"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-200" />
                    )}
                  </button>
                </div>
              </div>

              <div className="text-[10px] text-forest-200/80 leading-snug">
                Demonstration coupon code for academic evaluation. Not redeemable at commercial retail POS.
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="mt-6 flex items-center gap-3">
          {revealed && (
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy Voucher Code"}
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-charcoal-600 hover:bg-gray-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
