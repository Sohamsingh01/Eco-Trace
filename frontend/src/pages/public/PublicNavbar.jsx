import React, { useState } from "react";
import { Leaf, ArrowRight, Sparkles, Menu, X } from "lucide-react";

export default function PublicNavbar({
  activeTab,
  onNavigate,
  onGetStarted,
  onLogin,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "why-us", label: "Why Us" },
    { id: "dashboard", label: "Dashboard" },
    { id: "simulator", label: "Live Simulator", isSpecial: true },
    { id: "features", label: "Features" },
    { id: "contact", label: "Contact" },
  ];

  const handleTabClick = (tabId) => {
    onNavigate(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200 text-charcoal-900 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => handleTabClick("home")}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-lime-400 flex items-center justify-center text-charcoal-950 shadow-md group-hover:scale-105 transition-transform">
            <Leaf className="w-6 h-6 fill-current" />
          </div>
          <div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900 flex items-center gap-1.5">
              EcoTrace
            </span>
            <span className="text-[10px] block font-bold text-emerald-700 tracking-wider uppercase -mt-1">
              Smart Carbon Tracker
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-full border border-slate-200 shadow-inner">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-black scale-102"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white"
                }`}
              >
                {item.isSpecial && (
                  <Sparkles
                    className={`w-3.5 h-3.5 ${
                      isActive ? "text-white" : "text-emerald-600 animate-pulse"
                    }`}
                  />
                )}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Buttons (Login & Get Started) */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onLogin}
            className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-xs hover:border-emerald-500/40 cursor-pointer"
          >
            Login
          </button>
          <button
            onClick={onGetStarted}
            className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-black shadow-md shadow-emerald-600/25 transition-all flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            Get Started
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200 shadow-xl">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold flex items-center justify-between transition ${
                  isActive
                    ? "bg-emerald-600 text-white font-black"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-2">
                  {item.isSpecial && <Sparkles className="w-4 h-4 text-emerald-600" />}
                  {item.label}
                </span>
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>
            );
          })}

          <div className="pt-4 flex flex-col gap-2.5 border-t border-slate-200">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogin();
              }}
              className="w-full py-3 rounded-2xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-center"
            >
              Sign In to Account
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onGetStarted();
              }}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black text-center shadow-md shadow-emerald-600/25"
            >
              Get Started Free →
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

