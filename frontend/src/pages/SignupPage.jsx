import React, { useState } from "react";
import { Leaf, Eye, EyeOff, Lock, Mail, User, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import CardTilt3D from "../components/common/CardTilt3D";
import confetti from "canvas-confetti";

export default function SignupPage({ onNavigateLogin, onSignupSuccess }) {
  const { register } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim() || !email.trim() || !password) {
      showToast("Please fill in all registration fields.", "error");
      return;
    }
    if (password.length < 6) {
      showToast("Password must be at least 6 characters long.", "error");
      return;
    }

    try {
      setLoading(true);
      const user = await register({
        full_name: fullName.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password,
      });

      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#22C55E", "#BEF264", "#166534"],
      });

      showToast("Account created! 150 EcoCredits welcome gift credited.", "award");
      if (onSignupSuccess) onSignupSuccess(user);
    } catch (err) {
      showToast(err.message || "Failed to create account.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06140B] text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-emerald-500 selection:text-black">
      {/* Ambient Glow Orbs */}
      <div className="absolute top-0 right-1/4 -translate-y-1/2 w-[650px] h-[650px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[550px] h-[550px] bg-lime-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Branding */}
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
          Create Your Citizen Account
        </h2>
        <p className="mt-2 text-xs text-emerald-100/70 max-w-sm mx-auto leading-relaxed">
          Join your local community in reducing household carbon emissions
        </p>
      </div>

      {/* Interactive 3D Card Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <CardTilt3D
          maxTilt={4}
          scale={1.01}
          className="bg-[#07180F]/90 backdrop-blur-2xl py-8 px-6 sm:px-8 rounded-3xl border border-emerald-500/25 shadow-2xl shadow-black/80 hover:border-emerald-400/50 transition-all"
        >
          {/* Welcome Bonus Callout */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-emerald-900/40 border border-emerald-500/30 flex items-center gap-3.5 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-amber-300 block">
                150 EcoCredits Welcome Bonus
              </span>
              <span className="text-emerald-100/70 text-[11px]">
                Credited automatically upon registration for instant reward unlocks.
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-emerald-200/90 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sanya Roy"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#040e07]/90 border border-emerald-500/30 text-xs font-medium text-white placeholder-emerald-100/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-200/90 mb-1.5">
                Username
              </label>
              <div className="relative">
                <span className="text-emerald-400/70 font-bold text-xs absolute left-3.5 top-2.5">
                  @
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="sanya_green"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[#040e07]/90 border border-emerald-500/30 text-xs font-medium text-white placeholder-emerald-100/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

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
                  placeholder="sanya@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#040e07]/90 border border-emerald-500/30 text-xs font-medium text-white placeholder-emerald-100/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-200/90 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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
              {loading ? "Creating Account..." : "Create Account & Start Onboarding"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-emerald-100/60">
            Already have an account?{" "}
            <button
              onClick={onNavigateLogin}
              className="font-extrabold text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
            >
              Sign in here
            </button>
          </div>
        </CardTilt3D>

        {/* Security & Baseline Badge */}
        <div className="mt-6 text-center flex items-center justify-center gap-2 text-[11px] text-emerald-200/60 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Encrypted Credentials • Zero Hardware Sensor Requirement</span>
        </div>
      </div>
    </div>
  );
}
