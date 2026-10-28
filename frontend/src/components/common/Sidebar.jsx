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
      className={`bg-white/95 backdrop-blur-xl border-r border-slate-200 flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0 z-20 ${
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
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl font-medium text-sm transition-all duration-200 group active:scale-[0.98] cursor-pointer ${
                isActive
                  ? "bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <div
                className={`p-1.5 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-emerald-100 text-emerald-700 shadow-xs"
                    : "text-slate-400 group-hover:text-emerald-700 group-hover:bg-emerald-50"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                    isActive ? "text-emerald-700" : ""
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
                          ? "bg-emerald-600 text-white shadow-xs font-black"
                          : "bg-slate-100 border border-slate-200 text-slate-600"
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

      {/* Bottom Collapse Toggle & System Status */}
      <div className="p-4 border-t border-slate-100">
        {!isCollapsed && (
          <div className="mb-3 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span className="font-semibold truncate">
              CEA 0.82 kg/kWh Modeling Active
            </span>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200 transition active:scale-95 cursor-pointer"
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
