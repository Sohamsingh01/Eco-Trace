import React, { useState, useEffect } from "react";
import PublicNavbar from "./public/PublicNavbar";
import PublicFooter from "./public/PublicFooter";
import HomePage from "./public/HomePage";
import WhyUsPage from "./public/WhyUsPage";
import DashboardPreviewPage from "./public/DashboardPreviewPage";
import SimulatorPage from "./public/SimulatorPage";
import FeaturesPage from "./public/FeaturesPage";
import ContactPage from "./public/ContactPage";

export default function LandingPage({ onGetStarted, onLogin }) {
  // Read initial tab from URL hash if available (e.g. #/why-us, #/simulator)
  const getInitialTab = () => {
    const hash = window.location.hash.replace("#/", "").replace("#", "");
    const validTabs = ["home", "why-us", "dashboard", "simulator", "features", "contact"];
    return validTabs.includes(hash) ? hash : "home";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  // Sync tab with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#/", "").replace("#", "");
      const validTabs = ["home", "why-us", "dashboard", "simulator", "features", "contact"];
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleNavigate = (tabId) => {
    setActiveTab(tabId);
    window.location.hash = tabId === "home" ? "" : `#/${tabId}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#06140B] text-white flex flex-col font-sans selection:bg-emerald-500 selection:text-black overflow-x-hidden relative">
      {/* Ambient Radial Lighting Orbs */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-950/20 rounded-full blur-[180px] pointer-events-none -z-10" />

      {/* Global Public Navbar with Active Pill Highlighting */}
      <PublicNavbar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onGetStarted={onGetStarted}
        onLogin={onLogin}
      />

      {/* Dedicated Page View Content */}
      <main className="flex-1">
        {activeTab === "home" && (
          <HomePage
            onNavigate={handleNavigate}
            onGetStarted={onGetStarted}
            onLogin={onLogin}
          />
        )}

        {activeTab === "why-us" && (
          <WhyUsPage
            onGetStarted={onGetStarted}
            onLogin={onLogin}
          />
        )}

        {activeTab === "dashboard" && (
          <DashboardPreviewPage
            onGetStarted={onGetStarted}
            onLogin={onLogin}
          />
        )}

        {activeTab === "simulator" && (
          <SimulatorPage
            onGetStarted={onGetStarted}
            onLogin={onLogin}
          />
        )}

        {activeTab === "features" && (
          <FeaturesPage
            onGetStarted={onGetStarted}
            onLogin={onLogin}
          />
        )}

        {activeTab === "contact" && (
          <ContactPage
            onGetStarted={onGetStarted}
            onLogin={onLogin}
          />
        )}
      </main>

      {/* Global Public Footer with Navigation Anchors & Citations */}
      <PublicFooter
        onNavigate={handleNavigate}
        onGetStarted={onGetStarted}
        onLogin={onLogin}
      />
    </div>
  );
}
