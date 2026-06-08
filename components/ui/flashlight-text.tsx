"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

interface FlashlightTextProps {
  text: string;
  className?: string;
  /** raio do furo em px */
  radius?: number;
}

/**
 * Lanterna (modelo "Excluir"): três camadas empilhadas —
 *   1) fundo CLARO (#F2F2F2)
 *   2) o texto em ROSA (#FF00AA) sobre o claro
 *   3) uma camada PRETA (#000) por cima cobrindo tudo
 * O cursor "exclui" um círculo da camada preta (máscara com furo), revelando
 * o que está embaixo. Borda do furo bem suave. Fora do cursor: tudo preto.
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

  // máscara da camada preta: furo (transparente) no cursor, opaca em volta
  const holeMask =
    "radial-gradient(circle var(--r) at var(--x) var(--y), transparent 0%, transparent 56%, #000 80%)";

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative flex min-h-[64vh] w-full items-center justify-center overflow-hidden bg-preto",
        className
      )}
      aria-label={text}
    >
      {/* 1) fundo claro */}
      <div className="pointer-events-none absolute inset-0 bg-claro" aria-hidden />

      {/* 2) texto rosa sobre o claro */}
      <p
        aria-hidden
        className="pointer-events-none relative z-10 max-w-2xl px-8 text-center font-display text-2xl leading-relaxed text-rosa md:text-3xl"
      >
        {text}
      </p>

      {/* 3) camada preta por cima, com furo no cursor (exclude) */}
      <div
        className="pointer-events-none absolute inset-0 z-20 bg-preto"
        style={{ WebkitMaskImage: holeMask, maskImage: holeMask }}
        aria-hidden
      />
    </div>
  );
}
