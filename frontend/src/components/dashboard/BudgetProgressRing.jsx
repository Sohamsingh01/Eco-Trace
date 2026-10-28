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
  let ringGradientStart = "#059669"; // emerald-600
  let ringGradientEnd = "#10b981"; // emerald-500
  let glowColor = "rgba(16, 185, 129, 0.35)";
  let statusBadge = "On Track";
  let badgeClass = "bg-emerald-50 text-emerald-800 border-emerald-200";

  if (isExceeded) {
    ringGradientStart = "#f87171";
    ringGradientEnd = "#ef4444";
    glowColor = "rgba(239, 68, 68, 0.35)";
    statusBadge = "Budget Exceeded";
    badgeClass = "bg-rose-50 text-rose-800 border-rose-200";
  } else if (percent > 75) {
    ringGradientStart = "#fbbf24";
    ringGradientEnd = "#f59e0b";
    glowColor = "rgba(245, 158, 11, 0.35)";
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
      className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col items-center justify-between transition-all duration-300 hover:border-emerald-500/40"
    >
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Leaf className="w-4 h-4 text-emerald-600 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">
              Daily Carbon Budget
            </h3>
            <span className="text-[10px] text-slate-500">
              Personalized CEA Cap
            </span>
          </div>
        </div>

        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${badgeClass}`}
        >
          {statusBadge}
        </span>
      </div>

      {/* Circular Progress Gauge with 3D Depth */}
      <div className="relative my-2 flex items-center justify-center">
        {/* Subtle radial background glow */}
        <div
          className="absolute w-44 h-44 rounded-full blur-2xl opacity-40 pointer-events-none"
          style={{ backgroundColor: glowColor }}
        />

        <svg className="w-52 h-52 transform -rotate-90 filter drop-shadow-sm">
          <defs>
            {/* Linear gradient along ring stroke */}
            <linearGradient id="carbonRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={ringGradientStart} />
              <stop offset="100%" stopColor={ringGradientEnd} />
            </linearGradient>

            {/* Inset shadow track gradient for light theme */}
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
            stroke="#10b981"
            strokeWidth="1"
            strokeDasharray="3 4"
            fill="transparent"
            opacity="0.25"
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
              strokeWidth="3.5"
              style={{
                filter: "drop-shadow(0 0 4px rgba(0,0,0,0.2))",
                transition: "cx 0.8s ease, cy 0.8s ease",
              }}
            />
          )}
        </svg>

        {/* Center Display: Values and Percentage */}
        <div className="absolute flex flex-col items-center justify-center text-center select-none pointer-events-none">
          <span className="text-3xl font-black text-slate-900 tracking-tight">
            <AnimatedCounter value={currentKg} decimals={1} />
          </span>
          <span className="text-[11px] font-bold text-emerald-700 uppercase -mt-0.5">
            kg CO₂
          </span>
          <span className="text-[10px] text-slate-500 mt-1">
            of {targetKg} kg limit
          </span>
          <span className="text-[10px] font-extrabold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full mt-1">
            {percent.toFixed(0)}% Used
          </span>
        </div>
      </div>

      {/* Target & Remaining Footprint Summary Strip */}
      <div className="w-full grid grid-cols-2 gap-3 mt-2 text-center">
        <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">
            Remaining Budget
          </span>
          <span className={`text-xs font-black ${isExceeded ? "text-rose-600" : "text-emerald-700"}`}>
            {isExceeded ? `+${(currentKg - targetKg).toFixed(1)} kg over` : `${remaining.toFixed(1)} kg left`}
          </span>
        </div>

        <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">
            Status Award
          </span>
          <span className="text-xs font-black text-amber-700">
            {isExceeded ? "0 Credits" : "+25 Credits Pending"}
          </span>
        </div>
      </div>

      {/* Verification Action Button */}
      {onVerifyDay && (
        <button
          onClick={onVerifyDay}
          disabled={verifying}
          className="w-full mt-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-black shadow-md shadow-emerald-600/25 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>{verifying ? "Auditing Day..." : "Verify & Claim Day (+25 Credits)"}</span>
        </button>
      )}
    </CardTilt3D>
  );
}
