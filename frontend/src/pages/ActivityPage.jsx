import React, { useState, useEffect, useCallback } from "react";
import LogActivityModal from "../components/activity/LogActivityModal";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
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
        default_power_watts: parseFloat(customWatts) || 100,
        fuel_type: customFuel,
      });

      showToast(`Custom appliance "${customName}" added to your catalog!`, "success");
      setIsCustomApplianceModalOpen(false);
      setCustomName("");
      fetchCatalog();
    } catch (err) {
      showToast(err.message || "Failed to create custom appliance.", "error");
    } finally {
      setCreatingCustom(false);
    }
  };

  // Filter catalog cards
  const filteredCatalog = catalog.filter((app) => {
    const matchesCategory = activeCategory === "All" || app.category === activeCategory;
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ["All", "Cooling", "Heating", "Kitchen", "Lighting", "Entertainment", "Laundry", "Electronics"];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-forest-100 shadow-eco">
        <div>
          <span className="text-xs font-extrabold uppercase text-emerald-700 tracking-wider">
            Telemetry Input
          </span>
          <h1 className="text-2xl font-black text-charcoal-900 tracking-tight mt-0.5">
            Household Activity Tracker
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Log appliance runtimes to calculate electricity kWh and verify against your daily carbon budget.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCustomApplianceModalOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-forest-200 text-forest-800 text-xs font-bold hover:bg-forest-50 transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Appliance</span>
          </button>

          <button
            onClick={() => {
              setSelectedPreset(null);
              setIsLogModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold shadow-eco hover:shadow-eco-lg transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-limeAccent" />
            <span>Log Activity</span>
          </button>
        </div>
      </div>

      {/* Appliance Quick-Add Showcase */}
      <div className="bg-white rounded-3xl border border-forest-100 shadow-eco p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="font-bold text-base text-forest-950">Appliance Catalog & Quick Add</h3>
            <p className="text-xs text-charcoal-400">Click any card to instantly open the runtime logger</p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search appliances..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                activeCategory === cat
                  ? "bg-forest-800 text-white shadow-sm font-bold"
                  : "bg-forest-50/60 text-charcoal-600 hover:bg-forest-100"
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
              className="p-4 rounded-2xl border border-gray-100 hover:border-emerald-300 hover:shadow-eco bg-forest-50/20 hover:bg-forest-50/60 transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-gray-100 text-charcoal-600">
                    {app.category}
                  </span>
                  {app.fuel_type === "gas" ? (
                    <span className="text-[10px] font-bold text-orange-600 flex items-center gap-0.5">
                      <Flame className="w-3 h-3 fill-current" /> LPG
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                      <Zap className="w-3 h-3 fill-current" /> {app.default_power_watts}W
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-xs text-charcoal-900 group-hover:text-forest-900 transition leading-snug">
                  {app.name}
                </h4>
              </div>

              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-forest-800 font-semibold">
                <span>Quick Log</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Activity Logs Table */}
      <div className="bg-white rounded-3xl border border-forest-100 shadow-eco p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-forest-950">Recorded Activity Logs</h3>
            <p className="text-xs text-charcoal-400">Chronological telemetry records</p>
          </div>
          <span className="text-xs font-semibold text-charcoal-500">
            {activities.length} Total Logs
          </span>
        </div>

        {activities.length === 0 ? (
          <div className="py-12 text-center text-xs text-charcoal-400">
            No activity logs found. Use the catalog above or click Log Activity to record your first operation!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-charcoal-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3 pl-2">Appliance</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Date & Time</th>
                  <th className="pb-3">Duration & Mode</th>
                  <th className="pb-3 text-right">Energy (kWh)</th>
                  <th className="pb-3 text-right">CO₂ (kg)</th>
                  <th className="pb-3 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {activities.map((item) => (
                  <tr key={item.id} className="hover:bg-forest-50/40 transition">
                    <td className="py-3.5 pl-2 font-bold text-charcoal-900">
                      {item.appliance_name}
                      {item.notes && (
                        <span className="text-[10px] text-charcoal-400 block font-normal">
                          "{item.notes}"
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-charcoal-600">
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium text-[10px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 text-charcoal-500">
                      <div className="flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        {item.activity_date}
                      </div>
                    </td>
                    <td className="py-3.5 text-charcoal-600">
                      <div className="flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3 text-gray-400" />
                        {item.duration_minutes}m ({item.usage_mode})
                      </div>
                    </td>
                    <td className="py-3.5 text-right font-semibold text-charcoal-700">
                      {item.energy_kwh}
                    </td>
                    <td className="py-3.5 text-right font-black text-forest-900">
                      {item.co2_kg}
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-forest-100 shadow-2xl">
            <h3 className="font-bold text-base text-forest-950 mb-1">
              Add Custom Household Appliance
            </h3>
            <p className="text-xs text-charcoal-500 mb-4">
              Add a specialized appliance not listed in our standard preset inventory.
            </p>

            <form onSubmit={handleCreateCustomAppliance} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Appliance Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Electric Espresso Machine, 3D Printer"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Category
                  </label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none"
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
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Fuel / Power
                  </label>
                  <select
                    value={customFuel}
                    onChange={(e) => setCustomFuel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none"
                  >
                    <option value="electric">Electric (Watts)</option>
                    <option value="gas">LPG Cooking Gas</option>
                  </select>
                </div>
              </div>

              {customFuel === "electric" && (
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Rated Power (Watts)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={customWatts}
                    onChange={(e) => setCustomWatts(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none"
                    required
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCustomApplianceModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-charcoal-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingCustom}
                  className="px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold transition shadow-sm"
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
