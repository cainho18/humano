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
 * Lanterna: fundo preto; um disco de luz CLARO (#F2F2F2) segue o cursor e
 * revela o texto em #FF00AA só dentro dele. Borda do disco bem suave (sem
 * "quina" retangular) — a luz e o texto usam o MESMO gradiente radial.
 */
export function FlashlightText({
  text,
  className,
  radius = 190,
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

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative flex min-h-[64vh] w-full items-center justify-center overflow-hidden bg-preto",
        className
      )}
      aria-label={text}
    >
      {/* disco de luz claro — borda bem suave, sem quina */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle var(--r) at var(--x) var(--y), #f2f2f2 0%, #f2f2f2 55%, rgba(242,242,242,0.55) 70%, transparent 82%)",
        }}
        aria-hidden
      />
      {/* texto rosa, recortado pelo mesmo disco (some fora da luz) */}
      <p
        aria-hidden
        className="relative z-10 max-w-2xl px-8 text-center font-display text-2xl leading-relaxed text-rosa md:text-3xl"
        style={{
          WebkitMaskImage:
            "radial-gradient(circle var(--r) at var(--x) var(--y), #000 55%, rgba(0,0,0,0.5) 70%, transparent 82%)",
          maskImage:
            "radial-gradient(circle var(--r) at var(--x) var(--y), #000 55%, rgba(0,0,0,0.5) 70%, transparent 82%)",
        }}
      >
        {text}
      </p>
    </div>
  );
}
