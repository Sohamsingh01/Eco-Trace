import React from "react";
import { Trash2, Plus, Zap, Flame, Clock } from "lucide-react";

export default function RecentActivityTable({
  activities = [],
  onDeleteActivity,
  onOpenLogModal,
}) {
  return (
    <div className="bg-[#07180F]/90 backdrop-blur-xl rounded-3xl border border-emerald-500/25 shadow-xl shadow-black/50 p-6 text-white hover:border-emerald-400/50 transition-all">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-black text-base text-white">Recent Activities</h3>
          <p className="text-xs text-emerald-200/60">Recently logged appliance operations</p>
        </div>
        <button
          onClick={onOpenLogModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Quick Log</span>
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="py-10 text-center flex flex-col items-center bg-[#040e07]/60 rounded-2xl border border-dashed border-emerald-500/25 p-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center mb-3 border border-emerald-500/30">
            <Zap className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-white">No activities recorded today yet</p>
          <p className="text-xs text-emerald-100/60 max-w-xs mt-1">
            Log your fans, AC, refrigerator, or stove to see instant carbon calculations and earn EcoCredits.
          </p>
          <button
            onClick={onOpenLogModal}
            className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-charcoal-950 text-xs font-black shadow-md hover:brightness-110 transition"
          >
            Log First Activity
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-emerald-900/60 text-emerald-300/70 font-bold uppercase tracking-wider">
                <th className="pb-3 pl-1">Appliance</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Duration / Mode</th>
                <th className="pb-3 text-right">Energy</th>
                <th className="pb-3 text-right">CO₂ Emissions</th>
                <th className="pb-3 text-right pr-1">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/40">
              {activities.map((item) => (
                <tr key={item.id} className="hover:bg-emerald-950/30 transition">
                  <td className="py-3 pl-1 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
                    {item.appliance_name}
                  </td>
                  <td className="py-3 text-emerald-200/80">
                    <span className="px-2 py-0.5 rounded-md bg-[#040e07] text-emerald-300 border border-emerald-500/20 font-medium text-[11px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 text-emerald-100/70">
                    <div className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      {item.duration_minutes} mins
                      {item.usage_mode && (
                        <span className="text-emerald-300/60">({item.usage_mode})</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 text-right font-medium text-emerald-300">
                    {item.calculated_energy_kwh} kWh
                  </td>
                  <td className="py-3 text-right font-black text-lime-300">
                    {item.calculated_co2_kg} kg
                  </td>
                  <td className="py-3 text-right pr-1">
                    <button
                      onClick={() => onDeleteActivity && onDeleteActivity(item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition"
                      title="Delete activity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
