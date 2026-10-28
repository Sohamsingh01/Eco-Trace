import React, { useState } from "react";
import { Leaf, Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, ShieldCheck, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import CardTilt3D from "../components/common/CardTilt3D";
import api from "../services/api";

export default function LoginPage({ onNavigateSignup, onLoginSuccess }) {
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please fill in both email and password.", "error");
      return;
    }

    try {
      setLoading(true);
      const user = await login(email, password);
      showToast(`Welcome back, ${user.full_name || user.username}!`, "success");
      if (onLoginSuccess) onLoginSuccess(user);
    } catch (err) {
      showToast(err.message || "Invalid credentials. Please verify and try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      setLoading(true);
      const user = await login("priya@ecotrace.demo", "DemoPassword123!");
      showToast("Signed in as Demo User (Priya Sharma)!", "success");
      if (onLoginSuccess) onLoginSuccess(user);
    } catch (err) {
      showToast(err.message || "Failed to sign in demo account.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    try {
      setForgotLoading(true);
      const res = await api.forgotPassword(forgotEmail);
      showToast(res.message, "info");
      setShowForgotModal(false);
    } catch (err) {
      showToast(err.message || "Failed to process request.", "error");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06140B] text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-emerald-500 selection:text-black">
      {/* Ambient Lighting Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-lime-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Header / Brand */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <a href="/" className="inline-flex items-center gap-2.5 mb-5 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-lime-400 flex items-center justify-center text-charcoal-950 shadow-lg shadow-emerald-500/25 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <Leaf className="w-6 h-6 fill-charcoal-950/20" />
          </div>
          <div className="text-left">
            <span className="font-extrabold text-2xl tracking-tight text-white flex items-center gap-1.5">
              EcoTrace
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </span>
            <span className="text-[10px] tracking-wider uppercase text-emerald-400/80 font-bold block">
              Smart Carbon Tracker
            </span>
          </div>
        </a>

        <h2 className="text-3xl font-black text-white tracking-tight">
          Sign In to Your Dashboard
        </h2>
        <p className="mt-2 text-xs text-emerald-100/70 max-w-sm mx-auto leading-relaxed">
          Monitor your household carbon emissions & redeem verified EcoCredits
        </p>
      </div>

      {/* Main Interactive 3D Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <CardTilt3D
          maxTilt={4}
          scale={1.01}
          className="bg-[#07180F]/90 backdrop-blur-2xl py-8 px-6 sm:px-8 rounded-3xl border border-emerald-500/25 shadow-2xl shadow-black/80 hover:border-emerald-400/50 transition-all"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-emerald-200/90 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#040e07]/90 border border-emerald-500/30 text-xs font-medium text-white placeholder-emerald-100/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-emerald-200/90">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#040e07]/90 border border-emerald-500/30 text-xs font-medium text-white placeholder-emerald-100/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-emerald-400/70 hover:text-emerald-300 p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-lime-400 active:scale-[0.98] text-charcoal-950 text-xs font-black shadow-lg shadow-emerald-500/25 hover:shadow-emerald-400/40 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? "Signing in..." : "Sign In to EcoTrace"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-5 pt-5 border-t border-emerald-900/40">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 hover:text-white text-xs font-bold border border-emerald-500/30 hover:border-emerald-400 transition-all flex items-center justify-center gap-2 shadow-sm group active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-lime-400 group-hover:rotate-12 transition-transform" />
              <span>One-Click Demo Account Login (Priya Sharma)</span>
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-emerald-100/60">
            Don't have an account?{" "}
            <button
              onClick={onNavigateSignup}
              className="font-extrabold text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
            >
              Sign up free
            </button>
          </div>
        </CardTilt3D>

        {/* Security & Baseline Badge */}
        <div className="mt-6 text-center flex items-center justify-center gap-2 text-[11px] text-emerald-200/60 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Secured with CEA Baseline Carbon Auditing & JWT</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#07180F] rounded-3xl p-6 sm:p-7 max-w-sm w-full border border-emerald-500/30 shadow-2xl text-white">
            <h3 className="font-black text-lg text-white mb-1">
              Reset Your Password
            </h3>
            <p className="text-xs text-emerald-100/70 mb-4">
              Enter your account email to receive demo password reset instructions.
            </p>
            <form onSubmit={handleForgotSubmit} className="space-y-3.5">
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#040e07] border border-emerald-500/30 text-xs text-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none"
                required
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3.5 py-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-charcoal-950 text-xs font-black shadow-md hover:brightness-110 transition"
                >
                  {forgotLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
