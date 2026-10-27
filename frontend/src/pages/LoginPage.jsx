import React, { useState } from "react";
import { Leaf, Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
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
    <div className="min-h-screen bg-softWhite flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <a href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-forest-800 to-emerald-500 flex items-center justify-center text-white shadow-eco">
            <Leaf className="w-6 h-6 fill-white/20" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-forest-900">
            EcoTrace
          </span>
        </a>
        <h2 className="text-2xl font-black text-charcoal-900 tracking-tight">
          Sign In to Your Dashboard
        </h2>
        <p className="mt-1 text-xs text-charcoal-500">
          Monitor your household carbon emissions & redeem EcoCredits
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-3xl border border-forest-100 shadow-eco">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-charcoal-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-semibold text-emerald-700 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-charcoal-400 hover:text-charcoal-600 p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold shadow-eco hover:shadow-eco-lg transition flex items-center justify-center gap-2"
            >
              {loading ? "Signing in..." : "Sign In to EcoTrace"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-5 pt-5 border-t border-gray-100">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200 transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>One-Click Demo Account Login (Priya Sharma)</span>
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-charcoal-500">
            Don't have an account?{" "}
            <button
              onClick={onNavigateSignup}
              className="font-bold text-forest-800 hover:underline"
            >
              Sign up free
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-forest-100 shadow-2xl">
            <h3 className="font-bold text-base text-forest-950 mb-1">
              Reset Your Password
            </h3>
            <p className="text-xs text-charcoal-500 mb-4">
              Enter your account email to receive demo password reset instructions.
            </p>
            <form onSubmit={handleForgotSubmit} className="space-y-3">
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3.5 py-2 rounded-xl text-xs text-charcoal-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="px-4 py-2 rounded-xl bg-forest-800 text-white text-xs font-bold shadow-sm"
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
