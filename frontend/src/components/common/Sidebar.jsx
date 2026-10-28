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
  Home,
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
      className={`bg-[#07180F]/95 backdrop-blur-xl border-r border-emerald-500/20 flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0 z-20 ${
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
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl font-medium text-sm transition-all duration-200 group active:scale-[0.98] ${
                isActive
                  ? "bg-gradient-to-r from-emerald-500/25 to-emerald-500/10 text-emerald-300 border border-emerald-500/35 shadow-lg shadow-emerald-950/60 font-black"
                  : "text-emerald-100/70 hover:text-white hover:bg-emerald-950/40"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <div
                className={`p-1.5 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-emerald-500/20 text-lime-300 shadow-sm"
                    : "text-emerald-400/70 group-hover:text-emerald-300 group-hover:bg-emerald-900/30"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                    isActive ? "text-lime-300" : ""
                  }`}
                />
              </div>

              {!isCollapsed && (
                <div className="flex items-center justify-between flex-1 overflow-hidden">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider transition-transform group-hover:scale-105 ${
                        isActive
                          ? "bg-lime-400 text-charcoal-950 shadow-sm font-black"
                          : "bg-emerald-950 border border-emerald-500/30 text-emerald-300"
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
      <div className="p-4 border-t border-emerald-900/40 space-y-3">
        {!isCollapsed && (
          <div className="p-4 rounded-3xl bg-[#040e07] border border-emerald-500/30 text-white relative overflow-hidden shadow-lg transition-all duration-300 hover:border-emerald-400/60">
            <div className="flex items-center gap-2 mb-1.5 text-lime-300 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              Daily Eco Tip
            </div>
            <p className="text-xs text-emerald-100/80 leading-relaxed font-normal">
              Running ceiling fans counter-clockwise creates a cooling downdraft, letting you raise your AC dial by 2°C with zero loss in comfort!
            </p>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-emerald-300/80 hover:text-white hover:bg-emerald-950/40 text-xs font-semibold transition"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
