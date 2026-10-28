import React from "react";
import { TrendingUp, TrendingDown, Leaf, Zap, Flame, Coins } from "lucide-react";
import CardTilt3D from "./CardTilt3D";
import AnimatedCounter from "./AnimatedCounter";

export default function StatCard({
  title,
  value,
  unit,
  icon: Icon,
  change,
  changeText,
  isImprovement, // true if lower emissions or higher credits
  colorScheme = "forest", // forest, emerald, amber, blue, purple
  subtitle,
}) {
  const colorMap = {
    forest: {
      bg: "from-forest-50/80 via-white to-forest-50/20",
      border: "border-forest-100/90",
      iconBg: "bg-gradient-to-tr from-forest-800 to-emerald-600 text-white shadow-md",
      glow: "hover:shadow-[0_12px_28px_-6px_rgba(22,101,52,0.22)]",
      accent: "text-forest-900",
    },
    emerald: {
      bg: "from-emerald-50/80 via-white to-emerald-50/20",
      border: "border-emerald-100/90",
      iconBg: "bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-md",
      glow: "hover:shadow-[0_12px_28px_-6px_rgba(5,150,105,0.22)]",
      accent: "text-emerald-700",
    },
    amber: {
      bg: "from-amber-50/80 via-white to-amber-50/20",
      border: "border-amber-100/90",
      iconBg: "bg-gradient-to-tr from-amber-500 to-yellow-400 text-amber-950 shadow-md",
      glow: "hover:shadow-[0_12px_28px_-6px_rgba(217,119,6,0.22)]",
      accent: "text-amber-800",
    },
    blue: {
      bg: "from-sky-50/80 via-white to-sky-50/20",
      border: "border-sky-100/90",
      iconBg: "bg-gradient-to-tr from-sky-600 to-cyan-400 text-white shadow-md",
      glow: "hover:shadow-[0_12px_28px_-6px_rgba(2,132,199,0.22)]",
      accent: "text-sky-800",
    },
  };

  const scheme = colorMap[colorScheme] || colorMap.forest;
  const isNumeric = typeof value === "number" || (!isNaN(parseFloat(value)) && isFinite(value));
  const numericVal = parseFloat(value) || 0;
  const decimals = Number.isInteger(numericVal) ? 0 : 1;

  // Render specific 3D dimensional badge
  const render3DIcon = () => {
    if (colorScheme === "forest") {
      // 3D Floating Green Leaf
      return (
        <div className="relative group-hover:scale-115 transition-transform duration-300">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-forest-800 via-forest-700 to-emerald-500 flex items-center justify-center text-white shadow-md border border-emerald-300/30">
            <Leaf className="w-5 h-5 fill-white/20 transform -rotate-12 group-hover:rotate-0 transition-transform duration-300" />
          </div>
          <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-limeAccent shadow-xs animate-ping"></span>
        </div>
      );
    }
    if (colorScheme === "emerald") {
      // 3D Dimensional Lightning Bolt
      return (
        <div className="relative group-hover:scale-115 transition-transform duration-300">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md border border-teal-200/40">
            <Zap className="w-5 h-5 fill-yellow-200/40 text-yellow-100 group-hover:rotate-6 transition-transform duration-300" />
          </div>
        </div>
      );
    }
    if (colorScheme === "amber") {
      // Glowing Circular Budget Gauge
      return (
        <div className="relative group-hover:scale-115 transition-transform duration-300">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 flex items-center justify-center text-amber-950 shadow-md border border-amber-200">
            <Flame className="w-5 h-5 fill-current group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
      );
    }
    // Rotating Eco Token / Coins
    return (
      <div className="relative group-hover:scale-115 transition-transform duration-300">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-md border border-sky-200/30">
          <Coins className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
        </div>
      </div>
    );
  };

  return (
    <CardTilt3D
      maxTilt={6}
      scale={1.02}
      className={`group bg-gradient-to-b ${scheme.bg} p-5 rounded-3xl border ${scheme.border} shadow-eco ${scheme.glow} transition-all duration-300 flex flex-col justify-between`}
      tabIndex={0}
      role="region"
      aria-label={`${title}: ${value} ${unit || ""}`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-charcoal-500">
            {title}
          </span>
          {render3DIcon()}
        </div>

        <div className="flex items-baseline gap-1.5 my-1.5">
          <span className="text-3xl font-black text-charcoal-900 tracking-tight">
            {isNumeric ? (
              <AnimatedCounter value={numericVal} decimals={decimals} />
            ) : (
              value
            )}
          </span>
          {unit && (
            <span className="text-sm font-bold text-charcoal-500">
              {unit}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100/90 flex items-center justify-between text-xs">
        {change !== undefined && (
          <div className="flex items-center gap-1 font-semibold">
            {isImprovement ? (
              <span className="flex items-center text-emerald-600 gap-0.5 font-bold">
                <TrendingDown className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
                {change}
              </span>
            ) : (
              <span className="flex items-center text-amber-600 gap-0.5 font-bold">
                <TrendingUp className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
                {change}
              </span>
            )}
            <span className="text-charcoal-400 font-normal text-[11px]">
              {changeText || "vs yesterday"}
            </span>
          </div>
        )}
        {subtitle && (
          <span className="text-charcoal-500 font-medium text-[11px]">
            {subtitle}
          </span>
        )}
      </div>
    </CardTilt3D>
  );
}
