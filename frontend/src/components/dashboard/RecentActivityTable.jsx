import React from "react";
import { Trash2, Plus, Zap, Flame, Clock } from "lucide-react";

export default function RecentActivityTable({
  activities = [],
  onDeleteActivity,
  onOpenLogModal,
}) {
  return (
    <div className="bg-white rounded-3xl border border-forest-100 shadow-eco p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-base text-forest-950">Recent Activities</h3>
          <p className="text-xs text-charcoal-400">Recently logged appliance operations</p>
        </div>
        <button
          onClick={onOpenLogModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-800 text-xs font-bold transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Quick Log</span>
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="py-10 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-forest-50 text-forest-600 flex items-center justify-center mb-3">
            <Zap className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-charcoal-700">No activities recorded today yet</p>
          <p className="text-xs text-charcoal-400 max-w-xs mt-1">
            Log your fans, AC, refrigerator, or stove to see instant carbon calculations and earn EcoCredits.
          </p>
          <button
            onClick={onOpenLogModal}
            className="mt-4 px-4 py-2 rounded-xl bg-forest-800 text-white text-xs font-semibold hover:bg-forest-900 transition"
          >
            Log First Activity
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-charcoal-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 pl-1">Appliance</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Duration / Mode</th>
                <th className="pb-3 text-right">Energy</th>
                <th className="pb-3 text-right">CO₂ Emissions</th>
                <th className="pb-3 text-right pr-1">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {activities.map((item) => (
                <tr key={item.id} className="hover:bg-forest-50/50 transition">
                  <td className="py-3 pl-1 font-semibold text-charcoal-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {item.appliance_name}
                  </td>
                  <td className="py-3 text-charcoal-600">
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium text-[11px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 text-charcoal-600">
                    <div className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3 text-charcoal-400" />
                      {item.duration_minutes} mins
                      {item.usage_mode && (
                        <span className="text-charcoal-400 font-normal">
                          ({item.usage_mode})
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 text-right font-medium text-charcoal-700">
                    {item.energy_kwh} kWh
                  </td>
                  <td className="py-3 text-right font-bold text-forest-900">
                    {item.co2_kg} kg
                  </td>
                  <td className="py-3 text-right pr-1">
                    <button
                      onClick={() => onDeleteActivity(item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Delete Entry"
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
