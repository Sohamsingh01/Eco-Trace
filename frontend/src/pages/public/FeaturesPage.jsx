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
        "Partner brand vouchers (Nykaa, McDonald's, Amazon)",
        "Interactive foil scratch card modal with confetti celebration",
        "1-click voucher promo code copying",
      ],
    },
    {
      id: "fair-leaderboards",
      icon: Trophy,
      badge: "Module 04",
      title: "Fair Per-Capita Leaderboards",
      description:
        "Our proprietary normalization algorithm divides household footprint by member count, allowing 5-person joint families to compete fairly against 1-person apartments.",
      highlights: [
        "Per-capita normalized EcoScore (0–1000 scale)",
        "Active streak multipliers (🔥 3-day, 7-day bonuses)",
        "Metallic gold, silver, and bronze podium finishes",
      ],
    },
    {
      id: "environmental-analytics",
      icon: BarChart3,
      badge: "Module 05",
      title: "Environmental Analytics",
      description:
        "Deep temporal insights with interactive Recharts diagrams. Track 7-day emissions, appliance distribution donuts, and fuel source breakdowns with custom 3D glassmorphic tooltips.",
      highlights: [
        "Appliance share donut and category bar graphs",
        "Daily vs moving average trend analysis",
        "Zero data fabrication — reflects actual logged telemetry",
      ],
    },
    {
      id: "3d-visuals",
      icon: Globe,
      badge: "Module 06",
      title: "Interactive 3D Visual Experience",
      description:
        "High-performance Three.js Earth with atmospheric Fresnel halo and floating leaves, alongside 'My Eco World' — an evolving 3D miniature island that flourishes with your EcoScore.",
      highlights: [
        "Three.js canvas with procedural terrain and leaf particles",
        "Evolving 3D miniature island across 3 progress stages",
        "Interactive cursor perspective tilt & specular glare (CardTilt3D)",
      ],
    },
  ];

  const faqs = [
    {
      q: "Do I need to install any physical smart meters or IoT hardware?",
      a: "No! EcoTrace is 100% free software telemetry. You do not need expensive hardware meters (which often cost ₹8,000+). Simply record appliance usage intervals or habits, and our engine calculates precision emissions using official grid standards.",
    },
    {
      q: "How accurate are the carbon emission calculations?",
      a: "EcoTrace uses the official Central Electricity Authority (CEA) of India Baseline Database (Version 19.0) emission factor of 0.82 kg CO₂/kWh for grid electricity, and IPCC stoichiometric combustion factors (2.983 kg CO₂/kg) for LPG gas cooking, making it significantly more accurate than generic online calculators.",
    },
    {
      q: "How does the Fair Per-Capita EcoScore work?",
      a: "Total household carbon is divided by the number of residents. This per-capita figure is benchmarked against regional targets to generate an EcoScore between 0 and 1000, ensuring multi-generational families compete fairly with single-occupant homes.",
    },
    {
      q: "What can I do with the EcoCredits I earn?",
      a: "When your household stays within budget, you earn +25 EcoCredits every day. These can be redeemed in the Rewards section for Google Pay style scratch cards that reveal partner brand vouchers (Nykaa, McDonald's, Amazon) and official Eco Warrior credentials.",
    },
    {
      q: "Can apartment complexes and housing societies use EcoTrace?",
      a: "Yes! EcoTrace supports community leaderboards where residents of an apartment complex or campus can track emissions collectively and compete in friendly green challenges.",
    },
    {
      q: "Is my household energy and appliance data private?",
      a: "Absolutely. All activity records are stored securely in local database tables and are never sold or monetized to advertisers.",
    },
  ];

  return (
    <div className="space-y-24 pb-24 text-white">
      {/* 1. HERO HEADER */}
      <section className="pt-8 lg:pt-14 text-center max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-4">
          <Layers className="w-4 h-4" />
          <span>Full Platform Capabilities & Architecture</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          The Complete Architecture for{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300">
            Household Decarbonization
          </span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-gray-300 font-normal leading-relaxed">
          From multi-source appliance telemetry to gamified reward redemption and per-capita
          community leaderboards, explore the six integrated modules powering EcoTrace.
        </p>
      </section>

      {/* 2. THE 6 CORE MODULES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((f) => {
            const Icon = f.icon;
            return (
              <CardTilt3D
                key={f.id}
                maxTilt={4}
                className="rounded-3xl bg-[#092215]/85 border border-emerald-500/30 p-8 shadow-xl flex flex-col justify-between group hover:border-emerald-400/60 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-charcoal-950 font-black shadow-md group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6 fill-current" />
                    </div>
                    <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                      {f.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white mt-1">{f.title}</h3>
                  <p className="text-xs text-gray-300 mt-2 leading-relaxed font-normal">
                    {f.description}
                  </p>

                  <div className="mt-5 space-y-2 pt-4 border-t border-emerald-900/40">
                    {f.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-200">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[3]" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardTilt3D>
            );
          })}
        </div>
      </section>

      {/* 3. TECHNOLOGY STACK & ARCHITECTURE SPECIFICATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#07190F] border border-emerald-500/30 p-8 sm:p-12 shadow-2xl space-y-8">
          <div className="max-w-2xl text-left">
            <span className="text-xs font-black uppercase text-emerald-400 tracking-widest block">
              Under The Hood
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Technology Stack & Implementation Specs
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-2 font-normal">
              Built using modern high-performance frameworks and reliable scientific APIs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#092215] border border-emerald-500/20 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <Code2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-extrabold text-white">Frontend Experience</h4>
              <ul className="text-xs text-gray-300 space-y-1.5 font-normal">
                <li>• React 19 + Vite v8</li>
                <li>• Three.js WebGL 3D Engine</li>
                <li>• Tailwind CSS + 3D Tilt Glare</li>
                <li>• Recharts Interactive SVG Charts</li>
                <li>• Canvas Confetti Celebrations</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-[#092215] border border-emerald-500/20 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-base font-extrabold text-white">Backend API Server</h4>
              <ul className="text-xs text-gray-300 space-y-1.5 font-normal">
                <li>• Python 3.14 + FastAPI</li>
                <li>• Pydantic v2 Schema Validation</li>
                <li>• SQLAlchemy ORM Core</li>
                <li>• JWT Auth & bcrypt Hashing</li>
                <li>• RESTful API with Swagger UI</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-[#092215] border border-emerald-500/20 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="text-base font-extrabold text-white">Data & Standards</h4>
              <ul className="text-xs text-gray-300 space-y-1.5 font-normal">
                <li>• SQLite & PostgreSQL Schema</li>
                <li>• CEA India CO₂ Grid Factor (0.82)</li>
                <li>• IPCC Stoichiometric LPG Model (2.983)</li>
                <li>• Normalized Per-Capita EcoScore</li>
                <li>• 100% Offline Capable Runtime</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-black uppercase text-emerald-400 tracking-widest block">
            Common Questions
          </span>
          <h2 className="text-3xl font-black text-white mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#092215]/90 border border-emerald-500/20 overflow-hidden transition"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-extrabold text-sm text-white hover:text-emerald-300 transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-emerald-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-gray-300 leading-relaxed font-normal border-t border-emerald-950">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. CALL TO ACTION FOOTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-emerald-950 via-[#0B2517] to-emerald-950 border border-emerald-500/40">
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Ready to track your household footprint?
          </h3>
          <p className="text-xs text-gray-300 mt-2 max-w-xl mx-auto">
            Experience all features with pre-populated demo data or create your free account today.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="px-7 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 text-charcoal-950 font-black text-xs shadow-lg hover:shadow-glow transition cursor-pointer"
            >
              Get Started Free
            </button>
            <button
              onClick={onLogin}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition cursor-pointer"
            >
              Try Demo Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
