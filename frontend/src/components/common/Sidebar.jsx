import React from "react";
import {
  LayoutDashboard,
  PlusCircle,
  BarChart3,
  Gift,
  Trophy,
  UserCheck,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Home
} from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "tracker", label: "Activity Tracker", icon: PlusCircle, badge: "Log" },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "rewards", label: "Rewards", icon: Gift, badge: "Earn" },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "profile", label: "Household Profile", icon: Home },
    { id: "specs", label: "Calculation Specs", icon: BookOpen },
  ];

  return (
    <aside
      className={`bg-white border-r border-forest-100 flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0 z-20 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Menu Links */}
      <div className="p-4 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all group ${
                isActive
                  ? "bg-forest-800 text-white shadow-eco font-semibold"
                  : "text-charcoal-600 hover:text-forest-900 hover:bg-forest-50"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? "text-limeAccent" : "text-charcoal-400 group-hover:text-forest-700"
                }`}
              />

              {!isCollapsed && (
                <div className="flex items-center justify-between flex-1 overflow-hidden">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        isActive
                          ? "bg-limeAccent text-forest-950"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Promo & Collapse Toggle */}
      <div className="p-4 border-t border-forest-50 space-y-3">
        {!isCollapsed && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-forest-900 to-forest-800 text-white relative overflow-hidden shadow-eco">
            <div className="flex items-center gap-2 mb-1.5 text-limeAccent font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Daily Sustainability Tip
            </div>
            <p className="text-xs text-forest-100 leading-relaxed font-normal">
              Running ceiling fans counter-clockwise creates a cooling downdraft, letting you raise your AC dial by 2°C with zero loss in comfort!
            </p>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-xl text-charcoal-400 hover:text-forest-800 hover:bg-forest-50 transition"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-500">
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
