import React, { useState } from "react";
import { Leaf, Eye, EyeOff, Lock, Mail, User, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
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
        particleCount: 60,
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
          Create Your Citizen Account
        </h2>
        <p className="mt-1 text-xs text-charcoal-500">
          Join your local community in reducing household carbon emissions
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-3xl border border-forest-100 shadow-eco">
          {/* Welcome Bonus Callout */}
          <div className="mb-6 p-3.5 rounded-2xl bg-forest-50 border border-forest-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-xs shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-forest-900 block">
                150 EcoCredits Welcome Bonus
              </span>
              <span className="text-charcoal-500 text-[11px]">
                Credited automatically upon registration for instant reward unlocks.
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sanya Roy"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Username
              </label>
              <div className="relative">
                <span className="text-charcoal-400 font-bold text-xs absolute left-3.5 top-3">
                  @
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="sanya_green"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

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
                  placeholder="sanya@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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
              className="w-full py-3 px-4 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold shadow-eco hover:shadow-eco-lg transition flex items-center justify-center gap-2 mt-2"
            >
              {loading ? "Creating Account..." : "Create Account & Start Onboarding"}
              <ArrowRight className="w-4 h-4 text-limeAccent" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-charcoal-500">
            Already have an account?{" "}
            <button
              onClick={onNavigateLogin}
              className="font-bold text-forest-800 hover:underline"
            >
              Sign in here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
