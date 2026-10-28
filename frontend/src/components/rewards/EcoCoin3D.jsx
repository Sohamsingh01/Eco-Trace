import React, { useRef, useState, useEffect } from "react";
import { Leaf, Sparkles } from "lucide-react";

/**
 * EcoCoin3D
 * An interactive 3D metallic and enamel reward token featuring:
 * - Dimensional CSS 3D perspective with realistic bevel and rim highlights
 * - Embossed EcoTrace leaf symbol with emerald enamel inlay
 * - Hover/pointer reactive lighting sheen
 * - Gentle floating oscillation and spring tilt
 */
export default function EcoCoin3D({ size = 120, className = "" }) {
  const coinRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [sheenPos, setSheenPos] = useState({ x: 30, y: 30 });
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  const handleMouseMove = (e) => {
    if (reducedMotion || !coinRef.current) return;
    const rect = coinRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -18;
    const rotateY = ((x - centerX) / centerX) * 18;

    setTilt({ x: rotateX, y: rotateY });
    setSheenPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setSheenPos({ x: 30, y: 30 });
  };

  return (
    <div
      ref={coinRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex items-center justify-center cursor-pointer select-none ${className}`}
      style={{
        width: size,
        height: size,
        perspective: 800,
      }}
      aria-label="3D EcoCredits Token"
    >
      {/* 3D Coin Outer Body */}
      <div
        className={`w-full h-full rounded-full transition-transform duration-300 ease-out will-change-transform flex items-center justify-center ${
          !reducedMotion && !isHovered ? "animate-float-gentle" : ""
        }`}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.08 : 1})`,
          transformStyle: "preserve-3d",
          boxShadow: isHovered
            ? "0 20px 35px -8px rgba(22, 101, 52, 0.35), 0 0 25px rgba(190, 242, 100, 0.45)"
            : "0 12px 24px -6px rgba(22, 101, 52, 0.22), 0 0 15px rgba(34, 197, 94, 0.2)",
        }}
      >
        {/* Outer Gold/Emerald Metal Rim with Bevel */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 via-amber-300 to-yellow-100 p-1.5 shadow-inner">
          {/* Inner Enamel Face (Deep Forest Green) */}
          <div className="w-full h-full rounded-full bg-gradient-to-br from-forest-800 via-forest-900 to-emerald-950 flex flex-col items-center justify-center relative overflow-hidden border border-amber-300/40">
            {/* Concentric Decorative Groove */}
            <div className="absolute inset-1.5 rounded-full border border-dashed border-amber-300/30"></div>

            {/* Embossed Leaf Emblem with 3D Depth */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              <div className="p-2 rounded-full bg-gradient-to-tr from-emerald-500 to-limeAccent shadow-md text-forest-950 mb-0.5">
                <Leaf className="w-6 h-6 fill-forest-950/20" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-amber-300 drop-shadow-sm">
                ECO
              </span>
            </div>

            {/* Dynamic Sheen / Light Reflection Overlay */}
            <div
              className="pointer-events-none absolute inset-0 rounded-full transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at ${sheenPos.x}% ${sheenPos.y}%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 65%)`,
                opacity: isHovered ? 0.75 : 0.45,
              }}
            />
          </div>
        </div>

        {/* Small floating sparkles around the coin */}
        <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-limeAccent animate-pulse" />
      </div>
    </div>
  );
}
