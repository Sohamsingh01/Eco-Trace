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
      id: "forest",
      category: "Forestry",
      title: "Pristine Wilderness",
      description: "Old-growth broadleaf forests sequester gigatons of carbon while stabilizing regional microclimates.",
      image: NATURE_IMAGES.denseForest.src,
      alt: NATURE_IMAGES.denseForest.alt,
      icon: TreePine,
      actionText: "Check Specs",
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
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 text-slate-900 hover:border-emerald-500/40 transition-all">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase text-emerald-700 tracking-wider">
              Educational Telemetry & Discovery
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <h3 className="font-black text-2xl text-slate-900 mt-0.5">
            Explore Sustainable Living
          </h3>
          <p className="text-xs text-slate-500">
            Actionable environmental pathways to reduce your household's baseline carbon footprint
          </p>
        </div>

        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
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
              className="relative rounded-3xl overflow-hidden min-h-[260px] flex flex-col justify-between p-5 border border-slate-200 shadow-sm group transition-all"
            >
              {/* Full Background Nature Photograph */}
              <img
                src={topic.image}
                alt={topic.alt}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 pointer-events-none"
              />

              {/* Gradient Overlay for Typography Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 pointer-events-none transition-opacity duration-300 group-hover:opacity-95" />

              {/* Top Tag & 3D Dimensional Category Emblem */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  {topic.category}
                </span>

                <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-md transform transition-transform group-hover:scale-110">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {/* Bottom Information & Action Button */}
              <div className="relative z-10 text-white space-y-2 mt-auto pt-8">
                <div>
                  <h4 className="font-black text-lg text-white leading-snug drop-shadow-sm">
                    {topic.title}
                  </h4>
                  <p className="text-xs text-white/80 mt-1 leading-relaxed font-normal line-clamp-2">
                    {topic.description}
                  </p>
                </div>

                <button
                  onClick={topic.action}
                  className="w-full mt-2 py-2 px-3.5 rounded-xl bg-white/20 hover:bg-emerald-600 hover:border-emerald-500 backdrop-blur-md border border-white/30 text-xs font-bold text-white transition-all flex items-center justify-between group/btn cursor-pointer"
                >
                  <span>{topic.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </CardTilt3D>
          );
        })}
      </div>
    </div>
  );
}
