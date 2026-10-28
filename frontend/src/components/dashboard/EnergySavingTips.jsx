import React from "react";
import { Lightbulb, ArrowRight, ShieldCheck } from "lucide-react";

export default function EnergySavingTips({ suggestions = [] }) {
  return (
    <div className="bg-[#07180F]/90 backdrop-blur-xl rounded-3xl border border-emerald-500/25 shadow-xl shadow-black/50 p-6 text-white hover:border-emerald-400/50 transition-all">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-xl bg-lime-400/20 text-lime-300 border border-lime-400/30 flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-lime-300" />
        </div>
        <div>
          <h3 className="font-black text-base text-white">
            Personalized Energy Optimization
          </h3>
          <p className="text-xs text-emerald-200/60">
            High-impact recommendations derived from your appliance inventory
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {suggestions.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-[#040e07] border border-emerald-500/20 hover:border-emerald-400/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-white">
                  {item.title}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  {item.category}
                </span>
              </div>
              <p className="text-xs text-emerald-100/70 leading-relaxed font-normal">
                {item.tip}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-emerald-900/40 flex items-center justify-between">
              <span className="text-xs font-bold text-lime-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {item.impact}
              </span>
              <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-0.5 cursor-pointer hover:underline">
                Adopt <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
