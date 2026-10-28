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
    <div className="bg-white rounded-3xl border border-forest-100 shadow-eco p-6 sm:p-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase text-emerald-700 tracking-wider">
              Educational Telemetry & Discovery
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <h3 className="font-black text-xl text-forest-950 mt-0.5">
            Explore Sustainable Living
          </h3>
          <p className="text-xs text-charcoal-400">
            Actionable environmental pathways to reduce your household's baseline carbon footprint
          </p>
        </div>

        <span className="text-xs font-bold text-forest-800 bg-forest-50 px-3.5 py-1.5 rounded-full border border-forest-100">
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
              className="relative rounded-3xl overflow-hidden min-h-[260px] flex flex-col justify-between p-5 border border-forest-100/60 shadow-eco group transition-all"
            >
              {/* Background Nature Image with Zoom Effect */}
              <img
                src={topic.image}
                alt={topic.alt}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 pointer-events-none"
              />

              {/* Gradient Scrim for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/95 via-forest-900/65 to-black/30 pointer-events-none" />

              {/* Top Tag & Icon */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-limeAccent bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-limeAccent/20">
                  {topic.category}
                </span>

                <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md text-white shadow-xs group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4 text-limeAccent" />
                </div>
              </div>

              {/* Content and Action Button */}
              <div className="relative z-10 mt-6">
                <h4 className="font-extrabold text-base text-white tracking-tight leading-snug">
                  {topic.title}
                </h4>
                <p className="text-xs text-forest-100 mt-1 leading-relaxed opacity-90 font-normal">
                  {topic.description}
                </p>

                <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between">
                  <span className="text-[11px] text-forest-300 font-medium">
                    Sustainable Action
                  </span>

                  <button
                    onClick={topic.action}
                    className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-forest-800 backdrop-blur-md active:scale-95 text-white text-xs font-bold transition flex items-center gap-1 border border-white/20 shadow-sm"
                  >
                    <span>{topic.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-limeAccent" />
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
