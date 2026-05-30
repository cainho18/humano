"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import TextCursorProximity from "@/components/ui/text-cursor-proximity";
import { TextScramble } from "@/components/ui/text-scramble";
import { useFlow } from "@/lib/state/AnswersContext";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** Tela 01 — o nome HUMANWARE aparece (scramble → reage ao cursor). */
export function OpeningPortal() {
  const { next } = useFlow();
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrambled, setScrambled] = useState(reduced);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="flex min-h-dvh w-full flex-col items-center justify-center bg-rosa px-6 text-claro"
    >
      <div
        ref={containerRef}
        className="relative flex items-center justify-center"
      >
        {scrambled && !reduced ? (
          <TextCursorProximity
            label="HUMANWARE"
            containerRef={containerRef}
            radius={120}
            falloff="gaussian"
            className="font-display text-5xl font-bold tracking-tight sm:text-7xl md:text-8xl"
            styles={{
              color: { from: "#f2f2f2", to: "#000000" },
              fontWeight: { from: 700, to: 900 },
            }}
          />
        ) : (
          <TextScramble
            as="h1"
            duration={1.4}
            speed={0.04}
            className="font-display text-5xl font-bold tracking-tight sm:text-7xl md:text-8xl"
            onScrambleComplete={() => setScrambled(true)}
          >
            HUMANWARE
          </TextScramble>
        )}
      </div>

      <motion.button
        onClick={next}
        className="mt-20 flex flex-col items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-claro/80 hover:text-preto"
        animate={reduced ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        descer
        <span aria-hidden className="text-lg">
          ↓
        </span>
      </motion.button>
    </motion.div>
  );
}
