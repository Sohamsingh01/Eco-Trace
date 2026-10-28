import React from "react";
import CardTilt3D from "../common/CardTilt3D";
import { NATURE_IMAGES } from "../../assets/natureImages";
import {
  Zap,
  Bike,
  Home,
  Recycle,
  Apple,
  TreePine,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function ExploreSustainableLiving({ onNavigateTab, onOpenLogModal }) {
  const topics = [
    {
      id: "energy",
      category: "Clean Tech",
      title: "Renewable Energy",
      description: "Grid integration of wind and rooftop solar offsets 0.82 kg CO₂/kWh against fossil power.",
      image: NATURE_IMAGES.renewableEnergy.src,
      alt: NATURE_IMAGES.renewableEnergy.alt,
      icon: Zap,
      actionText: "Track Appliances",
      action: () => onOpenLogModal && onOpenLogModal(),
    },
    {
      id: "transport",
      category: "Mobility",
      title: "Sustainable Transport",
      description: "Active cycling and electric commutes slash urban air particulate matter and fuel combustion.",
      image: NATURE_IMAGES.cyclingNature.src,
      alt: NATURE_IMAGES.cyclingNature.alt,
      icon: Bike,
      actionText: "Log Commute",
      action: () => onOpenLogModal && onOpenLogModal(),
    },
    {
      id: "city",
      category: "Architecture",
      title: "Greener Biophilic Homes",
      description: "Vertical garden towers and living roofs naturally insulate dwellings and reduce HVAC loads.",
      image: NATURE_IMAGES.ecoCity.src,
      alt: NATURE_IMAGES.ecoCity.alt,
      icon: Home,
      actionText: "Household Profile",
      action: () => onNavigateTab && onNavigateTab("profile"),
    },
    {
      id: "nature",
      category: "Ecosystems",
      title: "Nature & Biodiversity",
      description: "Protected virgin rainforests act as natural carbon sinks, holding critical planetary balance.",
      image: NATURE_IMAGES.forestHero.src,
      alt: NATURE_IMAGES.forestHero.alt,
      icon: TreePine,
      actionText: "Carbon Specs",
      action: () => onNavigateTab && onNavigateTab("specs"),
    },
    {
      id: "agriculture",
      category: "Food Systems",
      title: "Organic Home Planting",
      description: "Growing native herbs and home composting captures soil carbon while eliminating food logistics.",
      image: NATURE_IMAGES.homeGardening.src,
      alt: NATURE_IMAGES.homeGardening.alt,
      icon: Apple,
      actionText: "Earn Credits",
      action: () => onNavigateTab && onNavigateTab("rewards"),
    },
    {
      id: "water",
      category: "Conservation",
      title: "Freshwater Watersheds",
      description: "Low-flow aerators and domestic hot water stewardship preserve both gas energy and pristine alpine lakes.",
      image: NATURE_IMAGES.alpineLake.src,
      alt: NATURE_IMAGES.alpineLake.alt,
      icon: Recycle,
      actionText: "Audit Analytics",
      action: () => onNavigateTab && onNavigateTab("analytics"),
    },
  ];

  return (
    <div className="bg-[#07180F]/90 backdrop-blur-xl rounded-3xl border border-emerald-500/25 shadow-xl shadow-black/50 p-6 sm:p-8 text-white hover:border-emerald-400/50 transition-all">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase text-emerald-400 tracking-wider">
              Educational Telemetry & Discovery
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <h3 className="font-black text-2xl text-white mt-0.5">
            Explore Sustainable Living
          </h3>
          <p className="text-xs text-emerald-200/60">
            Actionable environmental pathways to reduce your household's baseline carbon footprint
          </p>
        </div>

        <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-500/30">
          6 Living Dimensions
        </span>
      </div>

      {/* Discovery Cards Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {topics.map((topic) => {
          const Icon = topic.icon;

          return (
            <CardTilt3D
              key={topic.id}
              maxTilt={5}
              scale={1.015}
              className="relative rounded-3xl overflow-hidden min-h-[260px] flex flex-col justify-between p-5 border border-emerald-500/25 shadow-xl group transition-all"
            >
              {/* Background Nature Image with Zoom Effect */}
              <img
                src={topic.image}
                alt={topic.alt}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 pointer-events-none"
              />

              {/* Gradient Scrim for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-[#07180F]/70 to-black/30 pointer-events-none" />

              {/* Top Tag & Icon */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-lime-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-lime-400/30">
                  {topic.category}
                </span>

                <div className="p-2 rounded-xl bg-black/40 backdrop-blur-md text-white shadow-xs group-hover:scale-110 transition-transform border border-white/10">
                  <Icon className="w-4 h-4 text-emerald-400" />
                </div>
              </div>

              {/* Bottom Content & Interactive Action Link */}
              <div className="relative z-10">
                <h4 className="text-lg font-black text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                  {topic.title}
                </h4>
                <p className="text-xs text-emerald-100/75 mt-1 leading-relaxed">
                  {topic.description}
                </p>

                <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-300/80 font-medium">
                    Verified CEA Model
                  </span>
                  <button
                    onClick={topic.action}
                    className="flex items-center gap-1.5 text-xs font-bold text-lime-300 group-hover:text-white hover:underline transition-all"
                  >
                    <span>{topic.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </CardTilt3D>
          );
        })}
      </div>
    </div>
  );
}
