import React from "react";
import { Trash2, Plus, Zap, Flame, Clock } from "lucide-react";

export default function RecentActivityTable({
  activities = [],
  onDeleteActivity,
  onOpenLogModal,
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 text-slate-900 hover:border-emerald-500/40 transition-all">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-black text-base text-slate-900">Recent Activities</h3>
          <p className="text-xs text-slate-500">Recently logged appliance operations</p>
        </div>
        <button
          onClick={onOpenLogModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition active:scale-95 cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Quick Log</span>
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="py-10 text-center flex flex-col items-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 border border-emerald-200 shadow-xs">
            <Zap className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-900">No activities recorded today yet</p>
          <p className="text-xs text-slate-500 max-w-xs mt-1">
            Log your fans, AC, refrigerator, or stove to see instant carbon calculations and earn EcoCredits.
          </p>
          <button
            onClick={onOpenLogModal}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-sm transition cursor-pointer"
          >
            Log First Activity
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="pb-3 pl-1">Appliance</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Duration / Mode</th>
                <th className="pb-3 text-right">Energy</th>
                <th className="pb-3 text-right">CO₂ Emissions</th>
                <th className="pb-3 text-right pr-1">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activities.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 pl-1 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {item.appliance_name}
                  </td>
                  <td className="py-3 text-slate-500 font-medium">
                    {item.category || "General"}
                  </td>
                  <td className="py-3 text-slate-600">
                    {item.duration_minutes} min ({item.usage_mode || "Medium"})
                  </td>
                  <td className="py-3 text-right font-medium text-slate-700">
                    {item.calculated_energy_kwh ?? item.energy_kwh ?? 0} kWh
                  </td>
                  <td className="py-3 text-right font-black text-emerald-700">
                    {item.calculated_co2_kg ?? item.co2_kg ?? 0} kg
                  </td>
                  <td className="py-3 text-right pr-1">
                    <button
                      onClick={() => onDeleteActivity && onDeleteActivity(item.id)}
                      className="text-slate-400 hover:text-rose-600 transition p-1 rounded-lg hover:bg-rose-50 cursor-pointer"
                      title="Delete activity log"
                    >
                      <Trash2 className="w-4 h-4" />
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
