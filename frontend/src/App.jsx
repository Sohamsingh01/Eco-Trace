import React, { useState } from "react";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import AmbientBackground from "./components/common/AmbientBackground";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import ActivityPage from "./pages/ActivityPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import RewardsPage from "./pages/RewardsPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProfilePage from "./pages/ProfilePage";
import SpecsPage from "./pages/SpecsPage";

export default function App() {
  const { user, loading, isAuthenticated } = useAuth();
  
  // Public navigation: 'landing', 'login', 'signup'
  const [publicView, setPublicView] = useState("landing");
  // Authenticated active tab: 'dashboard', 'tracker', 'analytics', 'rewards', 'leaderboard', 'profile', 'specs'
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFCF9] text-charcoal-900 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none"></div>
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4 shadow-lg shadow-emerald-500/20"></div>
        <span className="text-xs font-black text-emerald-700 tracking-widest uppercase">
          Initializing EcoTrace Telemetry...
        </span>
      </div>
    );
  }

  // 1. Unauthenticated Flow
  if (!isAuthenticated) {
    if (publicView === "login") {
      return (
        <LoginPage
          onNavigateSignup={() => setPublicView("signup")}
          onLoginSuccess={() => setPublicView("landing")}
        />
      );
    }
    if (publicView === "signup") {
      return (
        <SignupPage
          onNavigateLogin={() => setPublicView("login")}
          onSignupSuccess={() => setPublicView("landing")}
        />
      );
    }
    return (
      <LandingPage
        onGetStarted={() => setPublicView("signup")}
        onLogin={() => setPublicView("login")}
      />
    );
  }

  // 2. First-Time User Onboarding Flow
  if (!user?.onboarding_completed) {
    return (
      <OnboardingPage
        onComplete={() => {
          setActiveTab("dashboard");
        }}
      />
    );
  }

  // 3. Authenticated App Layout (Dashboard, Tracker, Analytics, Rewards, Leaderboard, Profile, Specs)
  return (
    <div className="min-h-screen bg-[#FAFCF9] text-charcoal-900 flex flex-col font-sans relative selection:bg-emerald-500 selection:text-white">
      <AmbientBackground />
      <Navbar
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      <div className="flex-1 flex overflow-hidden relative z-10">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === "dashboard" && (
            <DashboardPage onNavigateTab={(tab) => setActiveTab(tab)} />
          )}
          {activeTab === "tracker" && <ActivityPage />}
          {activeTab === "analytics" && <AnalyticsPage />}
          {activeTab === "rewards" && <RewardsPage />}
          {activeTab === "leaderboard" && <LeaderboardPage />}
          {activeTab === "profile" && <ProfilePage />}
          {activeTab === "specs" && <SpecsPage />}
        </main>
      </div>
    </div>
  );
}
