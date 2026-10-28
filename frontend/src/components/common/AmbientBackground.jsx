import React, { useEffect, useState, useRef } from "react";

/**
 * AmbientBackground
 * Renders a subtle, high-performance eco-inspired ambient environment:
 * - Soft sage/emerald radial lighting gradients
 * - Subtle drifting translucent leaf motes
 * - Gentle mouse parallax
 * - Fully non-blocking, pointer-events-none, respects reduced-motion
 */
export default function AmbientBackground() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const targetOffset = useRef({ x: 0, y: 0 });
  const animFrame = useRef(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);
    const updateMotion = (e) => setReducedMotion(e.matches);
    media.addEventListener("change", updateMotion);
    return () => media.removeEventListener("change", updateMotion);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const handleMouseMove = (e) => {
      // Subtle parallax range: -15px to +15px
      const xNorm = (e.clientX / window.innerWidth - 0.5) * 20;
      const yNorm = (e.clientY / window.innerHeight - 0.5) * 20;
      targetOffset.current = { x: xNorm, y: yNorm };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const loop = () => {
      setOffset((prev) => ({
        x: prev.x + (targetOffset.current.x - prev.x) * 0.05,
        y: prev.y + (targetOffset.current.y - prev.y) * 0.05,
      }));
      animFrame.current = requestAnimationFrame(loop);
    };

    animFrame.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, [reducedMotion]);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* 1. Top-Right Soft Emerald Ambient Orb */}
      <div
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full blur-[140px] opacity-40 transition-transform duration-700 ease-out"
        style={{
          background: "radial-gradient(circle, rgba(74, 222, 128, 0.28) 0%, rgba(22, 101, 52, 0.08) 50%, transparent 70%)",
          transform: `translate3d(${offset.x * 0.8}px, ${offset.y * 0.8}px, 0)`,
        }}
      />

      {/* 2. Bottom-Left Soft Sage/Mint Ambient Orb */}
      <div
        className="absolute -bottom-36 -left-36 w-[650px] h-[650px] rounded-full blur-[160px] opacity-35 transition-transform duration-700 ease-out"
        style={{
          background: "radial-gradient(circle, rgba(167, 243, 208, 0.35) 0%, rgba(5, 150, 105, 0.08) 55%, transparent 75%)",
          transform: `translate3d(${-offset.x * 0.6}px, ${-offset.y * 0.6}px, 0)`,
        }}
      />

      {/* 3. Center Subtle Warm Gold/Lime Glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full blur-[150px] opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(190, 242, 100, 0.22) 0%, transparent 70%)",
        }}
      />

      {/* 4. Subtle Drifting Organic Leaf Motes (Keyframed in CSS) */}
      {!reducedMotion && (
        <div className="absolute inset-0">
          {[
            { id: 1, left: "12%", top: "18%", size: 18, delay: "0s", duration: "18s" },
            { id: 2, left: "84%", top: "25%", size: 22, delay: "4s", duration: "22s" },
            { id: 3, left: "30%", top: "72%", size: 16, delay: "7s", duration: "20s" },
            { id: 4, left: "75%", top: "78%", size: 20, delay: "2s", duration: "24s" },
            { id: 5, left: "50%", top: "12%", size: 14, delay: "9s", duration: "26s" },
          ].map((mote) => (
            <div
              key={mote.id}
              className="absolute text-emerald-600/15 animate-float-gentle will-change-transform"
              style={{
                left: mote.left,
                top: mote.top,
                animationDelay: mote.delay,
                animationDuration: mote.duration,
                transform: `translate3d(${offset.x * 0.3}px, ${offset.y * 0.3}px, 0)`,
              }}
            >
              <svg
                width={mote.size}
                height={mote.size}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
              </svg>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
