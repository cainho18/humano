"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface GlitchTextProps {
  children: string;
  className?: string;
  /** 0–100, default 40 */
  intensity?: number;
  /** 0–100, default 35 */
  frequency?: number;
  /** 0–100, default 30 — RGB(rosa/amarelo) split in px */
  rgbShift?: number;
  as?: React.ElementType;
}

/**
 * Glitch text in the restricted palette: instead of R/B channel split we shift
 * a rosa "hot" copy and an amarelo "cold" copy. Slices regenerate on an
 * interval driven by `frequency`; horizontal jitter scales with `intensity`.
 */
export function GlitchText({
  children,
  className,
  intensity = 40,
  frequency = 35,
  rgbShift = 30,
  as: Tag = "span",
}: GlitchTextProps) {
  const reduced = useReducedMotion();
  const [clipHot, setClipHot] = useState("inset(0 0 0 0)");
  const [clipCold, setClipCold] = useState("inset(0 0 0 0)");
  const [jitter, setJitter] = useState(0);
  const raf = useRef<number>(0);

  const shiftPx = Math.floor((rgbShift / 100) * 28);

  useEffect(() => {
    if (reduced) return;
    let alive = true;
    const tick = () => {
      if (!alive) return;
      const band = () => {
        const top = Math.floor(Math.random() * 100);
        const h = Math.floor(Math.random() * 18);
        return `inset(${top}% 0 ${Math.max(0, 100 - top - h)}% 0)`;
      };
      setClipHot(band());
      setClipCold(band());
      setJitter((Math.random() - 0.5) * (intensity / 100) * 12);
      const delay = Math.max(30, 300 - frequency * 2.5);
      raf.current = window.setTimeout(tick, delay);
    };
    tick();
    return () => {
      alive = false;
      clearTimeout(raf.current);
    };
  }, [reduced, intensity, frequency]);

  if (reduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  const layer = "absolute inset-0 select-none";
  return (
    <Tag className={cn("relative inline-block", className)}>
      <span className="invisible">{children}</span>
      <span className={cn(layer, "text-claro")} aria-hidden>
        {children}
      </span>
      <span
        className={cn(layer, "text-rosa mix-blend-screen")}
        aria-hidden
        style={{
          transform: `translateX(${shiftPx + jitter}px)`,
          clipPath: clipHot,
        }}
      >
        {children}
      </span>
      <span
        className={cn(layer, "text-amarelo mix-blend-screen")}
        aria-hidden
        style={{
          transform: `translateX(${-shiftPx + jitter}px)`,
          clipPath: clipCold,
        }}
      >
        {children}
      </span>
    </Tag>
  );
}
