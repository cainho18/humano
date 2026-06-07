"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useFlow } from "@/lib/state/AnswersContext";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** Máscara do SVG gzero — preenche a forma com a cor do elemento (bg-*). */
const MASK = {
  WebkitMaskImage: "url(/gzero.svg)",
  maskImage: "url(/gzero.svg)",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
  WebkitMaskSize: "contain",
  maskSize: "contain",
  aspectRatio: "778 / 378",
  height: "auto",
} as const;

/**
 * Tela 00 — LOGO REVEAL LOADER.
 * A marca gzero, centralizada, começa a 50% de opacidade e vai perdendo a
 * transparência da esquerda pra direita até 0% (logo cheia). Ao concluir,
 * expande levemente e some num fade out, revelando a tela do HUMANWARE.
 */
export function LogoLoader() {
  const { next } = useFlow();
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"reveal" | "out">("reveal");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-preto"
    >
      {/* respiro radial */}
      <div
        aria-hidden
        className="hw-breathe pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(38% 32% at 50% 50%, rgba(255,0,170,0.16), transparent 70%)",
        }}
      />

      <motion.div
        className="relative"
        style={{ width: "min(34vw, 150px)" }}
        animate={phase === "out" ? { scale: 1.08, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={
          phase === "out"
            ? { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
            : { duration: 0.3 }
        }
        onAnimationComplete={() => {
          if (phase === "out") next();
        }}
      >
        {/* base — logo a 50% */}
        <span
          role="img"
          aria-label="gzero"
          className="block w-full bg-claro/50"
          style={MASK}
        />
        {/* revelação — logo a 100%, descobre da esquerda pra direita */}
        <motion.span
          aria-hidden
          className="absolute inset-0 block w-full bg-claro"
          style={MASK}
          initial={{ clipPath: reduced ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 8, ease: [0.45, 0, 0.2, 1], delay: 0.2 }
          }
          onAnimationComplete={() => setPhase("out")}
        />
      </motion.div>

      <span className="sr-only">carregando</span>
    </motion.div>
  );
}
