import React from "react";
import { Leaf, Coins, Flame, Trophy, LogOut, User, Menu, X, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import AnimatedCounter from "./AnimatedCounter";

export default function Navbar({ onToggleSidebar, isSidebarCollapsed }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-slate-200 text-charcoal-900 shadow-xs transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Hamburger & Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition lg:flex cursor-pointer"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <a href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-lime-400 flex items-center justify-center text-charcoal-950 shadow-md group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
              <Leaf className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-slate-900 flex items-center gap-1.5">
                EcoTrace
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </span>
            </div>
          </a>
        </div>

        {/* Center / Right Gamification Stats & Profile */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* EcoCredits Pill */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 shadow-xs hover:border-amber-300 hover:scale-[1.03] transition-all cursor-pointer group"
            title="Your EcoCredits balance. Redeem in Rewards Marketplace!"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-amber-950 flex items-center justify-center font-bold text-xs shadow-xs transition-transform group-hover:rotate-12">
              <Coins className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-amber-800 tracking-wider leading-none">
                Credits
              </span>
              <span className="text-xs font-black text-amber-950 leading-tight">
                <AnimatedCounter value={user?.eco_credits ?? 150} decimals={0} />
              </span>
            </div>
          </div>

          {/* Streak Pill */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-orange-50 border border-orange-200 shadow-xs hover:border-orange-300 hover:scale-[1.03] transition-all group"
            title="Consecutive tracking streak in days"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-110">
              <Flame className="w-3.5 h-3.5 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-orange-800 tracking-wider leading-none">
                Streak
              </span>
              <span className="text-xs font-black text-orange-950 leading-tight">
                <AnimatedCounter value={user?.current_streak ?? 1} decimals={0} suffix="d" />
              </span>
            </div>
          </div>

          {/* EcoScore Badge */}
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xs hover:border-emerald-300 hover:scale-[1.03] transition-all group"
            title="Household-Normalized EcoScore (0-100)"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-110">
              <Trophy className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-emerald-800 tracking-wider leading-none">
                EcoScore
              </span>
              <span className="text-xs font-black text-emerald-950 leading-tight">
                <AnimatedCounter value={user?.eco_score ?? 78.5} decimals={1} />
              </span>
            </div>
          </div>

          {/* User Avatar & Logout */}
          <div className="flex items-center gap-2 border-l border-slate-200 pl-3 sm:pl-4">
            <div className="flex items-center gap-2 group cursor-pointer">
              <img
                src={user?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username || 'eco'}`}
                alt={user?.full_name || "User"}
                className="w-8 h-8 rounded-full border-2 border-emerald-500 bg-slate-100 object-cover shadow-xs transition-transform group-hover:scale-105"
              />
              <span className="hidden md:inline-block text-xs font-bold text-slate-800">
                {user?.full_name?.split(" ")[0] || user?.username || "EcoUser"}
              </span>
            </div>

            <button
              onClick={logout}
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition active:scale-95 ml-1 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
