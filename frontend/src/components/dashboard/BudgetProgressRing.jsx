import React from "react";
import { AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";

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
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedPercent / 100) * circumference;

  let ringColor = "#22C55E"; // emerald
  let statusBadge = "On Track";
  let badgeClass = "bg-emerald-100 text-emerald-800 border-emerald-200";

  if (isExceeded) {
    ringColor = "#EF4444"; // red
    statusBadge = "Budget Exceeded";
    badgeClass = "bg-red-100 text-red-800 border-red-200";
  } else if (percent > 75) {
    ringColor = "#F59E0B"; // amber
    statusBadge = "Approaching Limit";
    badgeClass = "bg-amber-100 text-amber-800 border-amber-200";
  }

  return (
    <div className="bg-white p-6 rounded-3xl border border-forest-100 shadow-eco flex flex-col items-center justify-between">
      <div className="w-full flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-base text-forest-950">Daily Carbon Budget</h3>
          <p className="text-xs text-charcoal-400">Personalized household target</p>
        </div>
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${badgeClass}`}>
          {statusBadge}
        </span>
      </div>

      {/* Circular Ring Gauge */}
      <div className="relative flex items-center justify-center my-2">
        <svg className="w-48 h-48 transform -rotate-90">
          {/* Background Track */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="#F1F5F9"
            strokeWidth="14"
            fill="transparent"
          />
          {/* Active Progress */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke={ringColor}
            strokeWidth="14"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute flex flex-col items-center text-center">
          <span className="text-3xl font-black text-charcoal-900 tracking-tight">
            {currentKg.toFixed(1)}
          </span>
          <span className="text-xs font-semibold text-charcoal-400 -mt-1">
            of {targetKg.toFixed(1)} kg CO₂
          </span>
          <span
            className="text-xs font-bold mt-1 px-2 py-0.5 rounded-full"
            style={{ color: ringColor, backgroundColor: `${ringColor}15` }}
          >
            {percent.toFixed(0)}% Consumed
          </span>
        </div>
      </div>

      {/* Budget Breakdown & Verification Action */}
      <div className="w-full mt-4 pt-4 border-t border-gray-100 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-charcoal-500 font-medium">Remaining Today:</span>
          <span className="font-bold text-forest-900">
            {isExceeded ? `+${(currentKg - targetKg).toFixed(2)} kg over` : `${remaining.toFixed(2)} kg`}
          </span>
        </div>

        {/* Day Verification Button */}
        {isVerified ? (
          <div className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Tracking Verified (+25 EcoCredits Awarded)</span>
          </div>
        ) : (
          <button
            onClick={onVerifyDay}
            disabled={verifying}
            className="w-full py-2.5 px-4 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-semibold text-xs transition shadow-sm hover:shadow flex items-center justify-center gap-2"
            title="Log at least 2 activities to verify and claim under-budget credits"
          >
            {verifying ? (
              <span className="animate-pulse">Verifying...</span>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 text-limeAccent" />
                <span>Verify & Complete Day Tracking</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
