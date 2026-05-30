"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Counter } from "@/components/ui/animated-counter";
import { useFlow } from "@/lib/state/AnswersContext";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** Tela 00 — contagem 0→100 no preto, depois atravessa sozinha. */
export function OpeningCounter() {
  const { next } = useFlow();
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);

  const finish = () => {
    if (done) return;
    setDone(true);
    setTimeout(next, 900);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="flex min-h-dvh w-full flex-col items-center justify-center bg-preto px-6"
    >
      {reduced ? (
        <button
          onClick={next}
          className="font-mono text-7xl font-bold tabular-nums text-claro hover:text-rosa"
          aria-label="entrar"
        >
          100
        </button>
      ) : (
        <Counter
          start={0}
          end={100}
          duration={10}
          fontSize={140}
          className="text-claro"
          onComplete={finish}
        />
      )}
    </motion.div>
  );
}
