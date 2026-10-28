import React from "react";
import { Leaf } from "lucide-react";

export default function PublicFooter({ onNavigate, onGetStarted, onLogin }) {
  return (
    <footer className="mt-auto bg-slate-50 text-slate-800 py-16 border-t border-slate-200 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200">
          {/* Brand Info (col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-lime-400 flex items-center justify-center text-charcoal-950 shadow-md">
                <Leaf className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="font-extrabold text-xl text-slate-900 block leading-tight">
                  EcoTrace
                </span>
                <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">
                  Smart Carbon Tracker
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              EcoTrace provides precision household carbon accounting and electricity telemetry,
              incentivizing daily conservation habits through real-world rewards and fair per-capita
              community rankings.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2 text-slate-500">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-200/60 hover:bg-slate-200 hover:text-emerald-700 flex items-center justify-center transition"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2m1.4 9.74v-8.37H5.06v8.37z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-200/60 hover:bg-slate-200 hover:text-emerald-700 flex items-center justify-center transition"
                aria-label="X / Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-200/60 hover:bg-slate-200 hover:text-emerald-700 flex items-center justify-center transition"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://github.com/Sohamsingh01/Eco-Trace.git"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-200/60 hover:bg-slate-200 hover:text-emerald-700 flex items-center justify-center transition"
                aria-label="GitHub Repository"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Column 1: Platform */}
          <div>
            <h4 className="text-xs font-black uppercase text-emerald-800 tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => onNavigate("home")}
                  className="hover:text-emerald-700 transition cursor-pointer"
                >
                  Overview & 3D Hero
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("why-us")}
                  className="hover:text-emerald-700 transition cursor-pointer"
                >
                  Why Us & Science
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("dashboard")}
                  className="hover:text-emerald-700 transition cursor-pointer"
                >
                  Dashboard Preview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("simulator")}
                  className="hover:text-emerald-700 transition cursor-pointer"
                >
                  Live Household Simulator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("features")}
                  className="hover:text-emerald-700 transition cursor-pointer"
                >
                  Platform Modules
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation Column 2: Science & Standards */}
          <div>
            <h4 className="text-xs font-black uppercase text-emerald-800 tracking-wider mb-4">
              Science & Standards
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <span className="text-slate-700 font-semibold block">CEA Baseline 0.82 kg/kWh</span>
                <span className="text-[10px] text-slate-400">Official Indian grid factor</span>
              </li>
              <li>
                <span className="text-slate-700 font-semibold block">IPCC Gas Stoichiometry</span>
                <span className="text-[10px] text-slate-400">2.983 kg CO₂ per kg LPG</span>
              </li>
              <li>
                <span className="text-slate-700 font-semibold block">Per-Capita Normalization</span>
                <span className="text-[10px] text-slate-400">Square footage & member weights</span>
              </li>
              <li>
                <span className="text-slate-700 font-semibold block">Audit Verification Engine</span>
                <span className="text-[10px] text-slate-400">Cryptographic receipt hashes</span>
              </li>
            </ul>
          </div>

          {/* Navigation Column 3: Get Started */}
          <div>
            <h4 className="text-xs font-black uppercase text-emerald-800 tracking-wider mb-4">
              Get Started
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <button
                  onClick={onLogin}
                  className="hover:text-emerald-700 transition cursor-pointer text-left"
                >
                  Try Demo Account
                </button>
              </li>
              <li>
                <button
                  onClick={onGetStarted}
                  className="hover:text-emerald-700 transition cursor-pointer text-left"
                >
                  Create Free Account
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("contact")}
                  className="hover:text-emerald-700 transition cursor-pointer text-left"
                >
                  Request Society Pilot
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Academic Verification */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 EcoTrace. Engineering Capstone Project. Open Source under MIT License.
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span>Validated Against CEA India Baseline Emission Database</span>
            <span>•</span>
            <span>IPCC GHG Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
