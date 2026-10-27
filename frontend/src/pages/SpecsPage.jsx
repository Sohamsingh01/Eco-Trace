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
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-forest-100 shadow-eco">
        <span className="text-xs font-extrabold uppercase text-emerald-700 tracking-wider">
          Scientific Transparency & Auditing
        </span>
        <h1 className="text-2xl font-black text-charcoal-900 tracking-tight mt-0.5">
          Carbon Calculation Engine & Methodology
        </h1>
        <p className="text-xs text-charcoal-500 mt-1">
          Detailed disclosure of environmental baseline factors, stoichiometry, and fairness algorithms implemented in EcoTrace.
        </p>
      </div>

      {/* Grid Electricity vs LPG Stoichiometry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Electrical Grid */}
        <div className="bg-white rounded-3xl border border-forest-100 shadow-eco p-6 space-y-3">
          <div className="flex items-center gap-2.5 text-forest-800">
            <div className="w-9 h-9 rounded-xl bg-forest-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-forest-800" />
            </div>
            <h3 className="font-extrabold text-base text-forest-950">
              1. Grid Electricity Model
            </h3>
          </div>

          <p className="text-xs text-charcoal-600 leading-relaxed">
            Electrical consumption is calculated directly from rated power, active duration, and appliance quantity:
          </p>

          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 font-mono text-xs text-forest-900 font-bold">
            kWh = (Power [Watts] × Duration [Hours] × Quantity × Mode) / 1000
          </div>

          <div className="p-3.5 rounded-xl bg-forest-50 border border-forest-100 font-mono text-xs text-emerald-900 font-bold">
            CO₂ [kg] = Energy [kWh] × 0.82 kg CO₂/kWh
          </div>

          <div className="text-[11px] text-charcoal-500 pt-2 border-t border-gray-100">
            <strong>Baseline Authority:</strong> Central Electricity Authority (CEA) of India CO₂ Baseline Database for the National Grid (~0.82 kg CO₂ per kWh delivered).
          </div>
        </div>

        {/* LPG Gas Stove */}
        <div className="bg-white rounded-3xl border border-forest-100 shadow-eco p-6 space-y-3">
          <div className="flex items-center gap-2.5 text-orange-600">
            <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-extrabold text-base text-forest-950">
              2. Gas Cooking Fuel Stoichiometry
            </h3>
          </div>

          <p className="text-xs text-charcoal-600 leading-relaxed">
            Gas stove emissions are calculated from fuel mass burned, strictly avoiding false electrical watt conversions:
          </p>

          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 font-mono text-xs text-orange-950 font-bold">
            LPG [kg] = Burners × Duration [Hours] × 0.15 kg/hr × Mode
          </div>

          <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-100 font-mono text-xs text-orange-900 font-bold">
            CO₂ [kg] = LPG Consumed [kg] × 2.983 kg CO₂/kg LPG
          </div>

          <div className="text-[11px] text-charcoal-500 pt-2 border-t border-gray-100">
            <strong>Standard:</strong> IPCC Guidelines for National Greenhouse Gas Inventories for Liquefied Petroleum Gas (LPG) stationary combustion.
          </div>
        </div>
      </div>

      {/* Gamification Rules & EcoScore Model */}
      <div className="bg-white rounded-3xl border border-forest-100 shadow-eco p-6 space-y-4">
        <div className="flex items-center gap-2.5 text-forest-800">
          <div className="w-9 h-9 rounded-xl bg-limeAccent/40 flex items-center justify-center">
            <Award className="w-5 h-5 text-forest-900" />
          </div>
          <h3 className="font-extrabold text-base text-forest-950">
            3. Fair EcoScore & Gamification Economics
          </h3>
        </div>

        <p className="text-xs text-charcoal-600 leading-relaxed">
          To prevent penalizing larger families or rewarding users who simply do not log activities, EcoTrace employs a 3-pillar fairness score:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-forest-50/50 border border-forest-100">
            <span className="text-2xl font-black text-forest-900">45%</span>
            <span className="text-xs font-bold text-forest-950 block mt-1">Budget Adherence</span>
            <span className="text-[11px] text-charcoal-500 mt-1 block">
              Remaining at or below personalized daily target
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-forest-50/50 border border-forest-100">
            <span className="text-2xl font-black text-orange-600">30%</span>
            <span className="text-xs font-bold text-forest-950 block mt-1">Streak Consistency</span>
            <span className="text-[11px] text-charcoal-500 mt-1 block">
              Consecutive days of active household telemetry
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-forest-50/50 border border-forest-100">
            <span className="text-2xl font-black text-emerald-700">25%</span>
            <span className="text-xs font-bold text-forest-950 block mt-1">Logging Completeness</span>
            <span className="text-[11px] text-charcoal-500 mt-1 block">
              Minimum 2 activities required to mark day verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
