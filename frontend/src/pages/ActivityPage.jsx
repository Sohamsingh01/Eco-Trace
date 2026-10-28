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
    <div className="space-y-6 pb-12 relative z-10 text-white">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#07180F]/90 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-emerald-500/25 shadow-xl shadow-black/50 hover:border-emerald-400/50 transition-all">
        <div>
          <span className="text-xs font-extrabold uppercase text-emerald-400 tracking-wider">
            Telemetry Input
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
            Household Activity Tracker
          </h1>
          <p className="text-xs text-emerald-200/60 mt-1 max-w-xl">
            Log appliance runtimes to calculate electricity kWh and verify against your daily carbon budget.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsCustomApplianceModalOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-emerald-500/30 text-emerald-300 hover:text-white text-xs font-bold hover:bg-emerald-950/40 transition flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Appliance</span>
          </button>

          <button
            onClick={() => {
              setSelectedPreset(null);
              setIsLogModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-lime-400 active:scale-95 text-charcoal-950 text-xs font-black shadow-lg shadow-emerald-500/25 transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-charcoal-950" />
            <span>Log Activity</span>
          </button>
        </div>
      </div>

      {/* Appliance Quick-Add Showcase */}
      <div className="bg-[#07180F]/90 backdrop-blur-xl rounded-3xl border border-emerald-500/25 shadow-xl shadow-black/50 p-6 hover:border-emerald-400/50 transition-all">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="font-black text-lg text-white">Appliance Catalog & Quick Add</h3>
            <p className="text-xs text-emerald-200/60">Click any card to instantly open the runtime logger</p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-emerald-400/70 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search appliances..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#040e07] border border-emerald-500/30 text-xs text-white placeholder-emerald-100/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                activeCategory === cat
                  ? "bg-emerald-500 text-charcoal-950 font-black shadow-md scale-[1.02]"
                  : "bg-[#040e07] border border-emerald-500/20 text-emerald-200/80 hover:text-white hover:border-emerald-400/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Appliance Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {filteredCatalog.map((app) => (
            <div
              key={app.id}
              onClick={() => handleQuickAddClick(app)}
              className="p-4 rounded-2xl border border-emerald-500/20 hover:border-emerald-400/60 hover:shadow-lg bg-[#040e07] hover:bg-emerald-950/40 transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-950/70 border border-emerald-500/30 text-emerald-300">
                    {app.category}
                  </span>
                  {app.fuel_type === "gas" ? (
                    <span className="text-[10px] font-bold text-orange-400 flex items-center gap-0.5">
                      <Flame className="w-3 h-3 fill-current" /> LPG
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-300 flex items-center gap-0.5">
                      <Zap className="w-3 h-3 fill-current" /> {app.default_power_watts}W
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-xs text-white group-hover:text-emerald-300 transition leading-snug">
                  {app.name}
                </h4>
              </div>

              <div className="mt-3 pt-2.5 border-t border-emerald-900/40 flex items-center justify-between text-[11px] text-emerald-400 font-bold">
                <span>Quick Log</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Activity Logs Table */}
      <div className="bg-[#07180F]/90 backdrop-blur-xl rounded-3xl border border-emerald-500/25 shadow-xl shadow-black/50 p-6 hover:border-emerald-400/50 transition-all">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-black text-lg text-white">Recorded Activity Logs</h3>
            <p className="text-xs text-emerald-200/60">Chronological telemetry records</p>
          </div>
          <span className="text-xs font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 px-3 py-1 rounded-full">
            {activities.length} Total Logs
          </span>
        </div>

        {activities.length === 0 ? (
          <div className="py-12 text-center text-xs text-emerald-200/60 bg-[#040e07]/60 rounded-2xl border border-dashed border-emerald-500/25 p-6">
            No activity logs found. Use the catalog above or click Log Activity to record your first operation!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-emerald-900/60 text-emerald-300/70 font-bold uppercase tracking-wider">
                  <th className="pb-3 pl-2">Appliance</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Date & Time</th>
                  <th className="pb-3">Duration & Mode</th>
                  <th className="pb-3 text-right">Energy (kWh)</th>
                  <th className="pb-3 text-right">CO₂ (kg)</th>
                  <th className="pb-3 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950/40">
                {activities.map((item) => (
                  <tr key={item.id} className="hover:bg-emerald-950/30 transition">
                    <td className="py-3.5 pl-2 font-bold text-white">
                      {item.appliance_name}
                      {item.notes && (
                        <span className="text-[10px] text-emerald-200/60 block font-normal">
                          "{item.notes}"
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-emerald-200/80">
                      <span className="px-2 py-0.5 rounded-md bg-[#040e07] border border-emerald-500/20 text-emerald-300 font-medium text-[10px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 text-emerald-100/70">
                      <div className="flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3 h-3 text-emerald-400" />
                        {item.activity_date}
                      </div>
                    </td>
                    <td className="py-3.5 text-emerald-100/70">
                      <div className="flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        {item.duration_minutes}m ({item.usage_mode})
                      </div>
                    </td>
                    <td className="py-3.5 text-right font-medium text-emerald-300">
                      {item.energy_kwh}
                    </td>
                    <td className="py-3.5 text-right font-black text-lime-300">
                      {item.co2_kg}
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition"
                        title="Delete Log"
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

      {/* Log Activity Modal */}
      <LogActivityModal
        isOpen={isLogModalOpen}
        onClose={() => {
          setIsLogModalOpen(false);
          setSelectedPreset(null);
        }}
        presetAppliance={selectedPreset}
        onActivityLogged={() => {
          fetchActivities();
        }}
      />

      {/* Custom Appliance Creator Modal */}
      {isCustomApplianceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#07180F] rounded-3xl p-6 sm:p-7 max-w-md w-full border border-emerald-500/30 shadow-2xl text-white">
            <h3 className="font-black text-lg text-white mb-1">
              Add Custom Household Appliance
            </h3>
            <p className="text-xs text-emerald-100/70 mb-4">
              Add a specialized appliance not listed in our standard preset inventory.
            </p>

            <form onSubmit={handleCreateCustomAppliance} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-emerald-200/90 mb-1">
                  Appliance Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Electric Espresso Machine, 3D Printer"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040e07] border border-emerald-500/30 text-xs text-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-emerald-200/90 mb-1">
                    Category
                  </label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#040e07] border border-emerald-500/30 text-xs text-white focus:border-emerald-400 focus:outline-none"
                  >
                    <option value="Cooling">Cooling</option>
                    <option value="Heating">Heating</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Laundry">Laundry</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-200/90 mb-1">
                    Fuel / Power
                  </label>
                  <select
                    value={customFuel}
                    onChange={(e) => setCustomFuel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#040e07] border border-emerald-500/30 text-xs text-white focus:border-emerald-400 focus:outline-none"
                  >
                    <option value="electric">Electric (Watts)</option>
                    <option value="gas">LPG Cooking Gas</option>
                  </select>
                </div>
              </div>

              {customFuel === "electric" && (
                <div>
                  <label className="block text-xs font-bold text-emerald-200/90 mb-1">
                    Rated Power (Watts)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={customWatts}
                    onChange={(e) => setCustomWatts(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#040e07] border border-emerald-500/30 text-xs text-white focus:border-emerald-400 focus:outline-none"
                    required
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCustomApplianceModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingCustom}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-charcoal-950 text-xs font-black shadow-md hover:brightness-110 transition"
                >
                  {creatingCustom ? "Creating..." : "Save Appliance"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
