import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

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
      bg: "from-forest-50/50 to-white",
      iconBg: "bg-forest-100 text-forest-800",
      accent: "border-forest-100",
    },
    emerald: {
      bg: "from-emerald-50/50 to-white",
      iconBg: "bg-emerald-100 text-emerald-800",
      accent: "border-emerald-100",
    },
    amber: {
      bg: "from-amber-50/50 to-white",
      iconBg: "bg-amber-100 text-amber-800",
      accent: "border-amber-100",
    },
    blue: {
      bg: "from-sky-50/50 to-white",
      iconBg: "bg-sky-100 text-sky-800",
      accent: "border-sky-100",
    },
  };

  const scheme = colorMap[colorScheme] || colorMap.forest;

  return (
    <div
      className={`bg-gradient-to-b ${scheme.bg} p-5 rounded-2xl border ${scheme.accent} shadow-eco hover:shadow-eco-lg transition-all duration-300 flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-xl ${scheme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 my-1">
        <span className="text-3xl font-black text-charcoal-900 tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-semibold text-charcoal-500">
            {unit}
          </span>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100/80 flex items-center justify-between text-xs">
        {change !== undefined && (
          <div className="flex items-center gap-1 font-semibold">
            {isImprovement ? (
              <span className="flex items-center text-emerald-600 gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" />
                {change}
              </span>
            ) : (
              <span className="flex items-center text-amber-600 gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                {change}
              </span>
            )}
            <span className="text-charcoal-400 font-normal">
              {changeText || "vs yesterday"}
            </span>
          </div>
        )}
        {subtitle && (
          <span className="text-charcoal-500 font-medium">{subtitle}</span>
        )}
      </div>
    </div>
  );
}
