import React, { useState } from "react";
import {
  Layers,
  Zap,
  Target,
  Gift,
  Trophy,
  BarChart3,
  Globe,
  ShieldCheck,
  Check,
  ChevronDown,
  ArrowRight,
  Database,
  Cpu,
  Code2,
  Sparkles,
} from "lucide-react";
import CardTilt3D from "../../components/common/CardTilt3D";

export default function FeaturesPage({ onGetStarted, onLogin }) {
  const [activeFaq, setActiveFaq] = useState(0);

  const featuresList = [
    {
      id: "appliance-telemetry",
      icon: Zap,
      badge: "Module 01",
      title: "Smart Appliance Telemetry",
      description:
        "Log usage across 15+ household appliances in seconds. Features dual-mode fuel calculation: electricity draws calculate via CEA 0.82 kg/kWh, while gas stoves compute stoichiometric fuel mass (2.983 kg/kg).",
      highlights: [
        "Instant pre-save emission estimate",
        "Separate LPG gas fuel mass physics",
        "Pre-configured appliance wattages and power factors",
      ],
    },
    {
      id: "carbon-budgets",
      icon: Target,
      badge: "Module 02",
      title: "Dynamic Carbon Budgets",
      description:
        "Every household receives a personalized daily carbon budget based on dwelling size and member count. A circular 3D progress ring monitors consumption with real-time threshold state shifts.",
      highlights: [
        "Personalized targets (typically 6.0–20.0 kg CO₂/day)",
        "Glow warning at 85% budget consumption",
        "Midnight automated budget reset and audit verification",
      ],
    },
    {
      id: "rewards-marketplace",
      icon: Gift,
      badge: "Module 03",
      title: "EcoCredits & Scratch Cards",
      description:
        "Staying under budget rewards users with +25 EcoCredits daily. Redeem earned credits in the marketplace for Google Pay style foil scratch cards unlocking partner discounts and swag.",
      highlights: [
        "Partner brand vouchers (Nykaa, McDonald's, Amazon, KFC, Starbucks, Zara, PVR, etc.)",
        "Interactive foil scratch card modal with confetti celebration",
        "Encrypted voucher codes with copy-to-clipboard functionality",
      ],
    },
    {
      id: "gamification-leaderboard",
      icon: Trophy,
      badge: "Module 04",
      title: "Fair Normalized Leaderboards",
      description:
        "Compete on community leaderboards with EcoScores normalized for dwelling square footage and family size. Larger households are evaluated fairly on efficiency rather than penalizing total volume.",
      highlights: [
        "Gold, Silver, Bronze 3D podium badges",
        "Weekly, monthly, and global competitive leagues",
        "Interactive 3D island ecosystem evolving with score",
      ],
    },
    {
      id: "historical-analytics",
      icon: BarChart3,
      badge: "Module 05",
      title: "Historical Carbon Analytics",
      description:
        "Audit trends with dual-axis telemetry graphs, appliance consumption shares, and CSV exports for home audits or university project evaluation.",
      highlights: [
        "Filter by 7 days, 30 days, or full year",
        "Category breakdown donut charts",
        "One-click CSV telemetry export with timestamp verification",
      ],
    },
    {
      id: "biophilic-3d-world",
      icon: Globe,
      badge: "Module 06",
      title: "Interactive 3D Nature Visualizations",
      description:
        "Interactive Three.js and WebGL components illustrate environmental progress: spinning Earth podiums, evolving low-poly islands, and tactile 3D card tilt micro-interactions.",
      highlights: [
        "Three.js canvas with procedural tree distribution",
        "Interactive 3D tilt perspective responding to cursor",
        "Zero-lag lightweight procedural rendering",
      ],
    },
  ];

  const faqs = [
    {
      question: "How does EcoTrace obtain its emission factors?",
      answer:
        "EcoTrace implements the official Central Electricity Authority (CEA) Version 19.0 national grid emission baseline of 0.82 kg CO₂/kWh for electrical draws. Cooking fuel calculations follow the IPCC 2006 guidelines for domestic LPG combustion stoichiometry (2.983 kg CO₂ per kg of fuel).",
    },
    {
      question: "Is any external hardware or smart plug required?",
      answer:
        "No external hardware is needed. EcoTrace provides a pre-configured catalog of standard Indian household appliances (ACs, BLDC fans, geysers, microwaves, televisions) with calibrated wattage ratings. Users can also define custom appliances with their own specific wattage ratings.",
    },
    {
      question: "How does the fairness algorithm prevent penalizing larger families?",
      answer:
        "Standard carbon trackers show raw totals, meaning a 4-person family always appears 'worse' than a single resident. EcoTrace applies per-capita normalization and square-footage scaling to calculate a normalized EcoScore (0-100), ensuring fair competition based on conservation habits.",
    },
    {
      question: "Can I export data for engineering reports or college evaluation?",
      answer:
        "Yes! The Analytics tab includes a one-click CSV export engine that packages timestamped activity logs, wattage values, fuel types, calculated energy (kWh), and resulting emissions into standard spreadsheet format.",
    },
  ];

  return (
    <div className="space-y-24 pb-24 text-charcoal-900">
      {/* 1. HERO HEADER */}
      <section className="pt-8 lg:pt-14 text-center max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-4">
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>Complete Technical Capabilities</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Everything You Need to Turn Carbon Into{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">
            A Daily Habit
          </span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
          From verified scientific emission equations to Google Pay style scratch cards and 3D biophilic
          islands, explore the six core pillars powering the EcoTrace architecture.
        </p>
      </section>

      {/* 2. THE SIX CORE FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((feature) => {
            const Icon = feature.icon;
            return (
              <CardTilt3D
                key={feature.id}
                maxTilt={4}
                className="rounded-3xl bg-white border border-slate-200/90 p-8 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-emerald-500/40 transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-black shadow-xs group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] uppercase font-black tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 pt-1">
                    {feature.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {feature.description}
                  </p>

                  <div className="pt-2 space-y-2 border-t border-slate-100">
                    {feature.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0 stroke-[3]" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-emerald-700 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer">
                  <span>Explore module specs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </CardTilt3D>
            );
          })}
        </div>
      </section>

      {/* 3. SCIENTIFIC FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase text-emerald-700 tracking-widest block mb-1">
            Frequently Answered Questions
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Scientific & Technical Inquiries
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? -1 : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-emerald-700 transition"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-emerald-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed font-normal border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-50 border border-slate-200 p-8 sm:p-12 text-center shadow-sm">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            Build Better Habits With Precision Telemetry
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mb-6">
            Get started in 60 seconds with our one-click demo account or create a customized household profile.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="px-7 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/25 transition cursor-pointer"
            >
              Sign Up Free
            </button>
            <button
              onClick={onLogin}
              className="px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition cursor-pointer"
            >
              Log In to Demo Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
