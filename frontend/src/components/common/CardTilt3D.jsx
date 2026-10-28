import React, { useRef, useState, useCallback, useEffect } from "react";

/**
 * CardTilt3D
 * Reusable 3D tilt container with dynamic lighting glare, smooth spring-back,
 * accessible keyboard focus states, and reduced-motion detection.
 */
export default function CardTilt3D({
  children,
  className = "",
  maxTilt = 7, // Maximum tilt angle in degrees (subtle and refined)
  scale = 1.02, // Subtle scale lift on hover
  glare = true,
  disabled = false,
  onClick,
  role,
  tabIndex,
  onKeyDown,
  ...props
}) {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({
    transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
    transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease",
  });
  const [glareStyle, setGlareStyle] = useState({
    opacity: 0,
    background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.35) 0%, transparent 60%)",
  });
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (disabled || reducedMotion || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles normalized to -1 .. 1
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      // Glare position percentage
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      setStyle({
        transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px) scale(${scale})`,
        transition: "transform 0.08s ease-out, box-shadow 0.2s ease",
      });

      if (glare) {
        setGlareStyle({
          opacity: 0.22,
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.45) 0%, rgba(34,197,94,0.08) 35%, transparent 70%)`,
        });
      }
    },
    [disabled, reducedMotion, maxTilt, scale, glare]
  );

  const handleMouseEnter = () => {
    if (disabled || reducedMotion) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (disabled || reducedMotion) return;
    setIsHovered(false);
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)",
      transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease",
    });
    setGlareStyle((prev) => ({
      ...prev,
      opacity: 0,
      transition: "opacity 0.5s ease",
    }));
  };

  const handleFocus = () => {
    if (disabled || reducedMotion) return;
    setStyle({
      transform: `perspective(1000px) translateY(-3px) scale(${scale})`,
      transition: "transform 0.3s ease",
    });
  };

  const handleBlur = () => {
    if (disabled || reducedMotion) return;
    setStyle({
      transform: "perspective(1000px) translateY(0px) scale(1)",
      transition: "transform 0.3s ease",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role={role}
      tabIndex={tabIndex}
      style={style}
      className={`relative transform-gpu will-change-transform rounded-2xl select-none outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
        isHovered ? "shadow-eco-lg" : ""
      } ${className}`}
      {...props}
    >
      {children}

      {/* Dynamic 3D Glare Lighting Overlay */}
      {glare && !reducedMotion && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden transition-opacity duration-300 z-10"
          style={glareStyle}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
