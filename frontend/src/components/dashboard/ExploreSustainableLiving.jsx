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
      image: NATURE_IMAGES.renewableEnergy?.src || "/images/renewable_energy.jpg",
      alt: NATURE_IMAGES.renewableEnergy?.alt || "Renewable Energy",
      icon: Zap,
      actionText: "Track Appliances",
      action: () => onOpenLogModal && onOpenLogModal(),
    },
    {
      id: "transport",
      category: "Mobility",
      title: "Sustainable Transport",
      description: "Active cycling and electric commutes slash urban air particulate matter and fuel combustion.",
      image: NATURE_IMAGES.cyclingNature?.src || "/images/cycling_nature.jpg",
      alt: NATURE_IMAGES.cyclingNature?.alt || "Sustainable Mobility",
      icon: Bike,
      actionText: "Log Commute",
      action: () => onOpenLogModal && onOpenLogModal(),
    },
    {
      id: "city",
      category: "Architecture",
      title: "Greener Biophilic Homes",
      description: "Vertical garden towers and living roofs naturally insulate dwellings and reduce HVAC loads.",
      image: NATURE_IMAGES.ecoCity?.src || "/images/eco_city.jpg",
      alt: NATURE_IMAGES.ecoCity?.alt || "Biophilic City",
      icon: Home,
      actionText: "Household Profile",
      action: () => onNavigateTab && onNavigateTab("profile"),
    },
    {
      id: "forest",
      category: "Forestry",
      title: "Pristine Wilderness",
      description: "Old-growth broadleaf forests sequester gigatons of carbon while stabilizing regional microclimates.",
      image: NATURE_IMAGES.denseForest?.src || NATURE_IMAGES.forestHero?.src || "/images/forest_hero.jpg",
      alt: NATURE_IMAGES.denseForest?.alt || "Pristine Wilderness",
      icon: TreePine,
      actionText: "Check Specs",
      action: () => onNavigateTab && onNavigateTab("specs"),
    },
    {
      id: "agriculture",
      category: "Food Systems",
      title: "Organic Home Planting",
      description: "Growing native herbs and home composting captures soil carbon while eliminating food logistics.",
      image: NATURE_IMAGES.homeGardening?.src || "/images/home_gardening.jpg",
      alt: NATURE_IMAGES.homeGardening?.alt || "Home Gardening",
      icon: Apple,
      actionText: "Earn Credits",
      action: () => onNavigateTab && onNavigateTab("rewards"),
    },
    {
      id: "water",
      category: "Conservation",
      title: "Freshwater Watersheds",
      description: "Low-flow aerators and domestic hot water stewardship preserve both gas energy and pristine alpine lakes.",
      image: NATURE_IMAGES.alpineLake?.src || "/images/alpine_lake.jpg",
      alt: NATURE_IMAGES.alpineLake?.alt || "Freshwater Lakes",
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
          Curated Science Guides
        </span>
      </div>

      {/* Grid of 6 High-Res Photographic Discovery Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((item) => {
          const Icon = item.icon;
          return (
            <CardTilt3D
              key={item.id}
              maxTilt={4}
              scale={1.015}
              className="group relative rounded-3xl overflow-hidden min-h-[280px] flex flex-col justify-between p-6 shadow-sm border border-slate-200 hover:border-emerald-500/50 transition-all duration-300"
            >
              {/* High-Resolution Background Nature Photograph */}
              <img
                src={item.image}
                alt={item.alt}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110 pointer-events-none"
              />

              {/* Protective Dark Legibility Scrim to ensure crisp contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/70 to-slate-950/40 pointer-events-none" />

              {/* Top Tag & Category Badge */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[10px] font-extrabold uppercase tracking-widest text-emerald-300">
                  <Icon className="w-3.5 h-3.5" />
                  {item.category}
                </span>

                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-emerald-500 group-hover:border-emerald-400 group-hover:text-slate-900 transition-all duration-300 shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              {/* Bottom Content & Interactive CTA */}
              <div className="relative z-10 mt-12 space-y-2">
                <h4 className="text-xl font-black text-white tracking-tight leading-snug group-hover:text-emerald-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed font-normal">
                  {item.description}
                </p>

                <div className="pt-3 border-t border-white/15 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <span>Impact Insight</span>
                  </span>

                  <button
                    onClick={item.action}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-emerald-500 active:scale-95 text-white hover:text-slate-900 text-xs font-black backdrop-blur-md border border-white/25 transition-all shadow-sm cursor-pointer"
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
