import React, { useState, useEffect, useCallback } from "react";
import LogActivityModal from "../components/activity/LogActivityModal";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import CardTilt3D from "../components/common/CardTilt3D";
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Zap,
  Flame,
  Clock,
  Calendar,
  Sparkles,
  Sliders,
  ChevronRight,
  PlusCircle,
} from "lucide-react";

export default function ActivityPage() {
  const { showToast } = useToast();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catalog, setCatalog] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [isCustomApplianceModalOpen, setIsCustomApplianceModalOpen] = useState(false);

  // Custom appliance form state
  const [customName, setCustomName] = useState("");
  const [customWatts, setCustomWatts] = useState(120);
  const [customCategory, setCustomCategory] = useState("Kitchen");
  const [customFuel, setCustomFuel] = useState("electric");
  const [creatingCustom, setCreatingCustom] = useState(false);

  const fetchActivities = useCallback(async () => {
    try {
      const data = await api.getActivities();
      setActivities(data.activities || []);
    } catch (err) {
      console.error("Failed to load activities:", err);
      showToast("Unable to load activity history.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const fetchCatalog = useCallback(async () => {
    try {
      const data = await api.getApplianceCatalog();
      const all = [...(data.presets || []), ...(data.custom || [])];
      setCatalog(all);
    } catch (err) {
      console.error("Failed to load appliances catalog:", err);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
    fetchCatalog();
  }, [fetchActivities, fetchCatalog]);

  const handleQuickAddClick = (app) => {
    setSelectedPreset(app);
    setIsLogModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this activity log?")) return;
    try {
      await api.deleteActivity(id);
      showToast("Activity log removed and daily totals updated.", "info");
      fetchActivities();
    } catch (err) {
      showToast(err.message || "Failed to delete log.", "error");
    }
  };

  const handleCreateCustomAppliance = async (e) => {
    e.preventDefault();
    if (!customName.trim()) return;

    try {
      setCreatingCustom(true);
      await api.addCustomAppliance({
        name: customName.trim(),
        category: customCategory,
        fuel_type: customFuel,
        default_power_watts: customFuel === "gas" ? 0 : parseFloat(customWatts),
      });

      showToast(`Custom appliance "${customName}" added to catalog!`, "success");
      setCustomName("");
      setIsCustomApplianceModalOpen(false);
      fetchCatalog();
    } catch (err) {
      showToast(err.message || "Failed to add custom appliance.", "error");
    } finally {
      setCreatingCustom(false);
    }
  };

  const categories = ["All", "Cooling", "Kitchen", "Heating", "Lighting", "Entertainment", "Laundry", "Electronics"];

  const filteredCatalog = catalog.filter((app) => {
    const matchesCat = activeCategory === "All" || app.category?.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = !searchQuery || app.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 relative z-10 text-charcoal-900">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm hover:border-emerald-500/40 transition-all">
        <div>
          <span className="text-xs font-extrabold uppercase text-emerald-700 tracking-wider">
            Household Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Appliance Activity Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Log appliance operation hours to monitor live emissions against your CEA daily baseline budget.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => {
              setSelectedPreset(null);
              setIsLogModalOpen(true);
            }}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-black shadow-md shadow-emerald-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log Activity</span>
          </button>

          <button
            onClick={() => setIsCustomApplianceModalOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition cursor-pointer"
          >
            + Custom Appliance
          </button>
        </div>
      </div>

      {/* Preset Appliances Catalog Quick-Select Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-black text-base text-slate-900">
              Quick Select from Appliance Catalog
            </h3>
            <p className="text-xs text-slate-500">
              Click any appliance below to open a pre-filled logging modal
            </p>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search appliances..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeCategory === cat
                  ? "bg-emerald-600 text-white font-black shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Appliance Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
          {filteredCatalog.map((app) => (
            <div
              key={app.id}
              onClick={() => handleQuickAddClick(app)}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500/50 hover:bg-emerald-50/50 cursor-pointer transition-all flex flex-col justify-between group shadow-xs hover:shadow-sm"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {app.category}
                </span>
                <h4 className="font-black text-xs text-slate-900 group-hover:text-emerald-700 transition leading-snug line-clamp-2">
                  {app.name}
                </h4>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold text-emerald-700">
                  {app.fuel_type === "gas" ? "LPG Fuel" : `${app.default_power_watts}W`}
                </span>
                <span className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs group-hover:bg-emerald-600 group-hover:text-white transition">
                  +
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Log History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-black text-base text-slate-900">Activity History Log</h3>
            <p className="text-xs text-slate-500">Full audit trail of recorded household power and gas draws</p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {activities.length} total entries
          </span>
        </div>

        {activities.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            No activity logs found. Use the buttons above to record your first appliance run!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="pb-3 pl-1">Date</th>
                  <th className="pb-3">Appliance</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Duration & Mode</th>
                  <th className="pb-3 text-right">Energy</th>
                  <th className="pb-3 text-right">Emissions</th>
                  <th className="pb-3 text-right pr-1">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activities.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 pl-1 text-slate-500 font-medium whitespace-nowrap">
                      {act.activity_date}
                    </td>
                    <td className="py-3 font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      {act.appliance_name}
                    </td>
                    <td className="py-3 text-slate-500 font-medium">
                      {act.category || "General"}
                    </td>
                    <td className="py-3 text-slate-600">
                      {act.duration_minutes} min ({act.usage_mode || "Normal"})
                    </td>
                    <td className="py-3 text-right font-medium text-slate-700">
                      {act.calculated_energy_kwh} kWh
                    </td>
                    <td className="py-3 text-right font-black text-emerald-700">
                      {act.calculated_co2_kg} kg
                    </td>
                    <td className="py-3 text-right pr-1">
                      <button
                        onClick={() => handleDelete(act.id)}
                        className="text-slate-400 hover:text-rose-600 transition p-1 rounded-lg hover:bg-rose-50 cursor-pointer"
                        title="Delete log"
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

      {/* Log Activity Modal */}
      <LogActivityModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        presetAppliance={selectedPreset}
        onActivityLogged={() => {
          fetchActivities();
        }}
      />

      {/* Custom Appliance Modal */}
      {isCustomApplianceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-900">
              Add Custom Appliance
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Define custom equipment with specific power ratings for tailored calculations.
            </p>

            <form onSubmit={handleCreateCustomAppliance} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Appliance Name
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Sump Pump / Dehumidifier"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    {categories.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fuel Type
                  </label>
                  <select
                    value={customFuel}
                    onChange={(e) => setCustomFuel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="electric">Electric (Watts)</option>
                    <option value="gas">LPG Gas</option>
                  </select>
                </div>
              </div>

              {customFuel === "electric" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Rated Power (Watts)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="15000"
                    required
                    value={customWatts}
                    onChange={(e) => setCustomWatts(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCustomApplianceModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingCustom}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-sm transition"
                >
                  {creatingCustom ? "Adding..." : "Add to Catalog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
