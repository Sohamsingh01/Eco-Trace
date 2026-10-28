import React from "react";
import { AlertTriangle, CheckCircle, ShieldAlert, Leaf, Flame } from "lucide-react";
import AnimatedCounter from "../common/AnimatedCounter";
import CardTilt3D from "../common/CardTilt3D";

export default function BudgetProgressRing({
  currentKg = 0,
  targetKg = 12.5,
  isVerified = false,
  onVerifyDay,
  verifying = false,
}) {
  const percent = targetKg > 0 ? (currentKg / targetKg) * 100 : 0;
  const clampedPercent = Math.min(Math.max(percent, 0), 100);
  const remaining = Math.max(0, targetKg - currentKg);
  const isExceeded = currentKg > targetKg;

  // SVG circular calculation
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedPercent / 100) * circumference;

  // Dynamic visual states
  let ringGradientStart = "#4ade80"; // mint
  let ringGradientEnd = "#16a34a"; // forest
  let glowColor = "rgba(34, 197, 94, 0.4)";
  let statusBadge = "On Track";
  let badgeClass = "bg-emerald-50 text-emerald-800 border-emerald-200";

  if (isExceeded) {
    ringGradientStart = "#f87171";
    ringGradientEnd = "#dc2626";
    glowColor = "rgba(239, 68, 68, 0.4)";
    statusBadge = "Budget Exceeded";
    badgeClass = "bg-red-50 text-red-800 border-red-200";
  } else if (percent > 75) {
    ringGradientStart = "#fbbf24";
    ringGradientEnd = "#d97706";
    glowColor = "rgba(245, 158, 11, 0.4)";
    statusBadge = "Approaching Limit";
    badgeClass = "bg-amber-50 text-amber-800 border-amber-200";
  }

  // Calculate position angle for leaf pointer on the ring circumference
  const angleDeg = (clampedPercent / 100) * 360 - 90;
  const angleRad = (angleDeg * Math.PI) / 180;
  const indicatorX = 96 + radius * Math.cos(angleRad);
  const indicatorY = 96 + radius * Math.sin(angleRad);

  return (
    <CardTilt3D
      maxTilt={5}
      scale={1.01}
      className="bg-white p-6 rounded-3xl border border-forest-100 shadow-eco flex flex-col items-center justify-between transition-all duration-300"
    >
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-forest-50 text-forest-800">
            <Leaf className="w-4 h-4 text-emerald-600 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-base text-forest-950">Daily Carbon Budget</h3>
            <p className="text-[11px] text-charcoal-400">Personalized household benchmark</p>
          </div>
        </div>
        <span
          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-sm transition-colors duration-300 ${badgeClass}`}
        >
          {statusBadge}
        </span>
      </div>

      {/* 3D Circular Ring Gauge with Multi-layered Depth */}
      <div className="relative flex items-center justify-center my-2 p-2">
        {/* Soft Background Radial Light under the Ring */}
        <div
          className="absolute inset-4 rounded-full blur-xl pointer-events-none transition-all duration-700"
          style={{ background: glowColor, opacity: 0.25 }}
        />

        <svg className="w-52 h-52 transform -rotate-90 filter drop-shadow-sm">
          <defs>
            {/* Linear gradient along ring stroke */}
            <linearGradient id="carbonRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={ringGradientStart} />
              <stop offset="100%" stopColor={ringGradientEnd} />
            </linearGradient>

            {/* Inset shadow track gradient */}
            <radialGradient id="ringTrackShade">
              <stop offset="70%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </radialGradient>
          </defs>

          {/* Background Outer Guide Track */}
          <circle
            cx="96"
            cy="96"
            r={radius + 8}
            stroke="#e2e8f0"
            strokeWidth="1"
            strokeDasharray="3 4"
            fill="transparent"
            opacity="0.6"
          />

          {/* Background Primary Track */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="url(#ringTrackShade)"
            strokeWidth="14"
            fill="transparent"
          />

          {/* Active Progress Arc with 3D Glowing Filter */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="url(#carbonRingGradient)"
            strokeWidth="14"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              filter: `drop-shadow(0 0 6px ${glowColor})`,
              transition: "stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.5s ease",
            }}
          />

          {/* Moving Indicator Dot / Leaf Anchor at Current Progress */}
          {clampedPercent > 2 && (
            <circle
              cx={indicatorX}
              cy={indicatorY}
              r="6.5"
              fill="#ffffff"
              stroke={ringGradientEnd}
              strokeWidth="3"
              style={{
                filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.25))`,
                transition: "cx 0.8s cubic-bezier(0.16, 1, 0.3, 1), cy 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          )}
        </svg>

        {/* Center Content Display with Animated Numbers */}
        <div className="absolute flex flex-col items-center text-center">
          <div className="flex items-baseline justify-center">
            <span className="text-3xl font-black text-charcoal-900 tracking-tight">
              <AnimatedCounter value={currentKg} decimals={1} />
            </span>
          </div>
          <span className="text-xs font-semibold text-charcoal-400 -mt-1">
            of {targetKg.toFixed(1)} kg CO₂
          </span>
          <span
            className="text-[11px] font-bold mt-1.5 px-2.5 py-0.5 rounded-full shadow-sm transition-all duration-300"
            style={{
              color: ringGradientEnd,
              backgroundColor: `${ringGradientStart}20`,
              border: `1px solid ${ringGradientStart}40`,
            }}
          >
            <AnimatedCounter value={percent} decimals={0} suffix="% Consumed" />
          </span>
        </div>
      </div>

      {/* Budget Breakdown & Verification Action */}
      <div className="w-full mt-3 pt-3 border-t border-gray-100 space-y-3">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="text-charcoal-500 font-medium">Remaining Today:</span>
          <span className={`font-bold ${isExceeded ? "text-red-600" : "text-forest-900"}`}>
            {isExceeded ? (
              `+${(currentKg - targetKg).toFixed(2)} kg over limit`
            ) : (
              <span>
                <AnimatedCounter value={remaining} decimals={2} suffix=" kg" />
              </span>
            )}
          </span>
        </div>

        {/* Day Verification Button */}
        {isVerified ? (
          <div className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-sm">
            <CheckCircle className="w-4 h-4 text-emerald-600 animate-bounce" />
            <span>Tracking Verified (+25 EcoCredits Awarded)</span>
          </div>
        ) : (
          <button
            onClick={onVerifyDay}
            disabled={verifying}
            className="group w-full py-2.5 px-4 rounded-xl bg-forest-800 hover:bg-forest-900 active:scale-[0.98] text-white font-bold text-xs transition-all shadow-eco hover:shadow-eco-lg flex items-center justify-center gap-2"
            title="Log activities to complete day tracking and claim bonus credits"
          >
            {verifying ? (
              <span className="animate-pulse flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Verifying Day Tracking...
              </span>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 text-limeAccent transition-transform group-hover:scale-110" />
                <span>Verify & Complete Day Tracking</span>
              </>
            )}
          </button>
        )}
      </div>
    </CardTilt3D>
  );
}
