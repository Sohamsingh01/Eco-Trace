import React, { useEffect, useState, useRef } from "react";

/**
 * AnimatedCounter
 * Fluidly animates numbers on change or initial mount using requestAnimationFrame
 * with easing curve and reduced-motion fallback.
 */
export default function AnimatedCounter({
  value,
  duration = 900,
  decimals = 1,
  prefix = "",
  suffix = "",
  className = "",
}) {
  const numericValue = typeof value === "number" ? value : parseFloat(value) || 0;
  const [displayValue, setDisplayValue] = useState(numericValue);
  const startValRef = useRef(numericValue);
  const animRef = useRef(null);

  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setDisplayValue(numericValue);
      startValRef.current = numericValue;
      return;
    }

    const startVal = startValRef.current;
    const endVal = numericValue;
    if (startVal === endVal) return;

    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth easeOutCubic curve: 1 - (1 - progress)^3
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (endVal - startVal) * ease;

      setDisplayValue(current);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        startValRef.current = endVal;
        setDisplayValue(endVal);
      }
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [numericValue, duration]);

  // Format with specified decimals
  const formatted =
    decimals === 0
      ? Math.round(displayValue).toLocaleString()
      : displayValue.toFixed(decimals);

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
