import React from "react";
import { Lightbulb, ArrowRight, ShieldCheck } from "lucide-react";

export default function EnergySavingTips({ suggestions = [] }) {
  return (
    <div className="bg-white rounded-3xl border border-forest-100 shadow-eco p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-limeAccent/30 text-forest-800 flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-forest-800" />
        </div>
        <div>
          <h3 className="font-bold text-base text-forest-950">
            Personalized Energy Optimization
          </h3>
          <p className="text-xs text-charcoal-400">
            High-impact recommendations derived from your appliance inventory
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {suggestions.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-forest-50/40 border border-forest-100/70 hover:border-emerald-200 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-forest-900">
                  {item.title}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {item.category}
                </span>
              </div>
              <p className="text-xs text-charcoal-600 leading-relaxed font-normal">
                {item.tip}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-forest-100/60 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {item.impact}
              </span>
              <span className="text-[11px] text-forest-800 font-semibold flex items-center gap-0.5 cursor-pointer hover:underline">
                Adopt <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
