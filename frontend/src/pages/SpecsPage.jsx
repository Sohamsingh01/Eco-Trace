import React, { useState, useEffect } from "react";
import api from "../services/api";
import { BookOpen, ShieldCheck, Zap, Flame, Award, CheckCircle2 } from "lucide-react";

export default function SpecsPage() {
  const [specs, setSpecs] = useState(null);

  useEffect(() => {
    async function loadSpecs() {
      try {
        const data = await api.getCalculationsInfo();
        setSpecs(data);
      } catch (err) {
        console.error("Failed to load calculation specs:", err);
      }
    }
    loadSpecs();
  }, []);

  return (
    <div className="space-y-6 pb-12 relative z-10 text-white">
      {/* Header */}
      <div className="bg-[#07180F]/90 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-emerald-500/25 shadow-xl shadow-black/50 hover:border-emerald-400/50 transition-all">
        <span className="text-xs font-extrabold uppercase text-emerald-400 tracking-wider">
          Scientific Transparency & Auditing
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
          Carbon Calculation Engine & Methodology
        </h1>
        <p className="text-xs text-emerald-200/60 mt-1 max-w-xl">
          Detailed disclosure of environmental baseline factors, stoichiometry, and fairness algorithms implemented in EcoTrace.
        </p>
      </div>

      {/* Grid Electricity vs LPG Stoichiometry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Electrical Grid */}
        <div className="bg-[#07180F]/90 backdrop-blur-xl rounded-3xl border border-emerald-500/25 shadow-xl shadow-black/50 p-6 space-y-3 hover:border-emerald-400/50 transition-all">
          <div className="flex items-center gap-2.5 text-emerald-400">
            <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="font-black text-lg text-white">
              1. Grid Electricity Model
            </h3>
          </div>

          <p className="text-xs text-emerald-100/70 leading-relaxed">
            Electrical consumption is calculated directly from rated power, active duration, and appliance quantity:
          </p>

          <div className="p-3.5 rounded-xl bg-[#040e07] border border-emerald-500/30 font-mono text-xs text-emerald-300 font-bold">
            kWh = (Power [Watts] × Duration [Hours] × Quantity × Mode) / 1000
          </div>

          <div className="p-3.5 rounded-xl bg-[#040e07] border border-emerald-500/30 font-mono text-xs text-lime-300 font-bold">
            CO₂ [kg] = Energy [kWh] × 0.82 kg CO₂/kWh
          </div>

          <div className="text-[11px] text-emerald-200/60 pt-2 border-t border-emerald-900/40">
            <strong className="text-white">Baseline Authority:</strong> Central Electricity Authority (CEA) of India CO₂ Baseline Database for the National Grid (~0.82 kg CO₂ per kWh delivered).
          </div>
        </div>

        {/* LPG Gas Stove */}
        <div className="bg-[#07180F]/90 backdrop-blur-xl rounded-3xl border border-emerald-500/25 shadow-xl shadow-black/50 p-6 space-y-3 hover:border-emerald-400/50 transition-all">
          <div className="flex items-center gap-2.5 text-orange-400">
            <div className="w-9 h-9 rounded-xl bg-orange-950/80 border border-orange-500/30 flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
            <h3 className="font-black text-lg text-white">
              2. Gas Cooking Fuel Stoichiometry
            </h3>
          </div>

          <p className="text-xs text-emerald-100/70 leading-relaxed">
            Gas stove emissions are calculated from fuel mass burned, strictly avoiding false electrical watt conversions:
          </p>

          <div className="p-3.5 rounded-xl bg-[#040e07] border border-orange-500/30 font-mono text-xs text-orange-300 font-bold">
            LPG [kg] = Burners × Duration [Hours] × 0.15 kg/hr × Mode
          </div>

          <div className="p-3.5 rounded-xl bg-[#040e07] border border-orange-500/30 font-mono text-xs text-orange-400 font-bold">
            CO₂ [kg] = LPG Consumed [kg] × 2.983 kg CO₂/kg LPG
          </div>

          <div className="text-[11px] text-emerald-200/60 pt-2 border-t border-emerald-900/40">
            <strong className="text-white">Standard:</strong> IPCC Guidelines for National Greenhouse Gas Inventories for Liquefied Petroleum Gas (LPG) stationary combustion.
          </div>
        </div>
      </div>

      {/* Gamification Rules & EcoScore Model */}
      <div className="bg-[#07180F]/90 backdrop-blur-xl rounded-3xl border border-emerald-500/25 shadow-xl shadow-black/50 p-6 space-y-4 hover:border-emerald-400/50 transition-all">
        <div className="flex items-center gap-2.5 text-emerald-400">
          <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center">
            <Award className="w-5 h-5 text-lime-300" />
          </div>
          <h3 className="font-black text-lg text-white">
            3. Fair EcoScore & Gamification Economics
          </h3>
        </div>

        <p className="text-xs text-emerald-100/70 leading-relaxed">
          To prevent penalizing larger families or rewarding users who simply do not log activities, EcoTrace employs a 3-pillar fairness score:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-[#040e07] border border-emerald-500/25">
            <span className="text-3xl font-black text-lime-300">45%</span>
            <span className="text-xs font-bold text-white block mt-1">Budget Adherence</span>
            <span className="text-[11px] text-emerald-200/60 mt-1 block">
              Remaining at or below personalized daily target
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#040e07] border border-emerald-500/25">
            <span className="text-3xl font-black text-orange-400">30%</span>
            <span className="text-xs font-bold text-white block mt-1">Streak Consistency</span>
            <span className="text-[11px] text-emerald-200/60 mt-1 block">
              Consecutive days of active household telemetry
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#040e07] border border-emerald-500/25">
            <span className="text-3xl font-black text-emerald-400">25%</span>
            <span className="text-xs font-bold text-white block mt-1">Logging Completeness</span>
            <span className="text-[11px] text-emerald-200/60 mt-1 block">
              Minimum 2 activities required to mark day verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
