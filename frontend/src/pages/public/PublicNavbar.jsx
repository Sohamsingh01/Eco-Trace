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
    <nav className="sticky top-0 z-50 bg-[#07180F]/90 backdrop-blur-xl border-b border-emerald-900/40 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => handleTabClick("home")}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-lime-400 flex items-center justify-center text-charcoal-950 shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform">
            <Leaf className="w-6 h-6 fill-current" />
          </div>
          <div>
            <span className="font-extrabold text-2xl tracking-tight text-white flex items-center gap-1.5">
              EcoTrace
            </span>
            <span className="text-[10px] block font-bold text-emerald-400 tracking-wider uppercase -mt-1">
              Smart Carbon Tracker
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1 bg-[#092215]/80 p-1.5 rounded-full border border-emerald-500/20 shadow-inner">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-400 text-charcoal-950 shadow-[0_0_15px_rgba(16,185,129,0.4)] font-black scale-102"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.isSpecial && (
                  <Sparkles
                    className={`w-3.5 h-3.5 ${
                      isActive ? "text-charcoal-950" : "text-lime-300 animate-pulse"
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
            className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-all shadow-sm hover:border-emerald-500/40 cursor-pointer"
          >
            Login
          </button>
          <button
            onClick={onGetStarted}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-lime-400 hover:from-emerald-400 hover:to-lime-300 text-charcoal-950 text-xs font-black shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.6)] transition-all flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            Get Started
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#07180F] border-b border-emerald-900/60 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold flex items-center justify-between transition ${
                  isActive
                    ? "bg-emerald-500 text-charcoal-950 font-black"
                    : "text-gray-200 hover:bg-white/5"
                }`}
              >
                <span className="flex items-center gap-2">
                  {item.isSpecial && <Sparkles className="w-4 h-4 text-lime-400" />}
                  {item.label}
                </span>
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>
            );
          })}

          <div className="pt-4 flex flex-col gap-2.5 border-t border-emerald-900/40">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogin();
              }}
              className="w-full py-3 rounded-2xl text-xs font-bold text-white bg-white/5 border border-white/15 text-center"
            >
              Sign In to Account
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onGetStarted();
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-400 text-charcoal-950 text-xs font-black text-center shadow-lg"
            >
              Get Started Free →
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
