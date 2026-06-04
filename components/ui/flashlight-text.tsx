"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

interface FlashlightTextProps {
  text: string;
  className?: string;
  /** raio da luz em px */
  radius?: number;
}

/**
 * Lanterna (desktop): fundo preto, texto escondido (#000 sobre #000) e revelado
 * em #FF00AA só onde o cursor (luz #F2F2F2) passa. Volta a sumir ao sair.
 */
export function FlashlightText({
  text,
  className,
  radius = 150,
}: FlashlightTextProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.style.setProperty("--r", `${radius}px`);
    el.style.setProperty("--x", `-9999px`);
    el.style.setProperty("--y", `-9999px`);

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        el.style.setProperty("--x", `${x}px`);
        el.style.setProperty("--y", `${y}px`);
      });
    };
    const leave = () => {
      el.style.setProperty("--x", `-9999px`);
      el.style.setProperty("--y", `-9999px`);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf.current);
    };
  }, [radius]);

  const maskStyle: React.CSSProperties = {
    WebkitMaskImage:
      "radial-gradient(circle var(--r) at var(--x) var(--y), #000 55%, transparent 100%)",
    maskImage:
      "radial-gradient(circle var(--r) at var(--x) var(--y), #000 55%, transparent 100%)",
  };

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-preto px-8",
        className
      )}
      aria-label={text}
    >
      {/* feixe da lanterna (#F2F2F2) */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle var(--r) at var(--x) var(--y), rgba(242,242,242,0.18), transparent 70%)",
        }}
        aria-hidden
      />
      {/* texto: #FF00AA recortado pela luz; fora da luz some (= preto sobre preto) */}
      <p
        aria-hidden
        className="relative z-10 max-w-2xl text-center font-display text-2xl leading-relaxed text-rosa md:text-3xl"
        style={maskStyle}
      >
        {text}
      </p>
    </div>
  );
}
