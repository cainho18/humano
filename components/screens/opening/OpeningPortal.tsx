"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useFlow } from "@/lib/state/AnswersContext";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/cn";

const SYLLABLES = ["HU", "MAN", "WA", "RE"];

const W_MIN = 200; // peso base (longe do cursor)
const W_MAX = 800; // peso sob o cursor
const RADIUS = 260; // alcance da influência em px

/**
 * Palavra com VARIABLE FONT WEIGHT HOVER: cada letra fica mais "gorda" conforme
 * o cursor chega perto. Usa font-variation-settings + transição CSS (leve).
 */
function VariableWord({
  text,
  className,
  reduced,
}: {
  text: string;
  className?: string;
  reduced: boolean;
}) {
  const chars = [...text];
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [weights, setWeights] = useState<number[]>(() =>
    chars.map(() => (reduced ? 500 : W_MIN))
  );
  const raf = useRef(0);

  const onMove = useCallback(
    (clientX: number, clientY: number) => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        const next = spanRefs.current.map((el) => {
          if (!el) return W_MIN;
          const r = el.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dist = Math.hypot(clientX - cx, clientY - cy);
          if (dist >= RADIUS) return W_MIN;
          const t = 1 - dist / RADIUS; // 0..1
          return Math.round(W_MIN + (W_MAX - W_MIN) * t * t);
        });
        setWeights(next);
      });
    },
    []
  );

  useEffect(() => {
    if (reduced) return;
    const handle = (e: PointerEvent) => onMove(e.clientX, e.clientY);
    const reset = () => setWeights(chars.map(() => W_MIN));
    window.addEventListener("pointermove", handle, { passive: true });
    window.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", handle);
      window.removeEventListener("pointerleave", reset);
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, onMove]);

  return (
    <span className={cn("inline-flex", className)} aria-label={text}>
      {chars.map((c, i) => (
        <span
          key={i}
          ref={(el) => {
            spanRefs.current[i] = el;
          }}
          aria-hidden
          style={{
            fontVariationSettings: `"wght" ${weights[i] ?? W_MIN}`,
            transition: reduced ? undefined : "font-variation-settings 0.18s ease-out",
            display: "inline-block",
          }}
        >
          {c}
        </span>
      ))}
    </span>
  );
}

/** Tela 01 — HUMANWARE gigante, ocupando a tela. Hover = peso variável. */
export function OpeningPortal() {
  const { next } = useFlow();
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="flex min-h-dvh w-full flex-col overflow-hidden bg-rosa text-claro"
    >
      <div className="flex flex-1 items-center justify-center overflow-hidden px-2">
        {/* Desktop / wide: horizontal, ocupa a largura toda */}
        <VariableWord
          text="HUMANWARE"
          reduced={reduced}
          className="hidden font-display leading-none tracking-tighter sm:inline-flex sm:text-[15.5vw]"
        />

        {/* Mobile: dividido em sílabas, empilhado, gigante */}
        <div className="flex flex-col items-center leading-[0.92] sm:hidden">
          {SYLLABLES.map((syl) => (
            <VariableWord
              key={syl}
              text={syl}
              reduced={reduced}
              className="font-display tracking-tighter text-[26vw]"
            />
          ))}
        </div>
      </div>

      <motion.button
        onClick={next}
        className="mb-10 flex flex-col items-center gap-2 self-center font-mono text-xs uppercase tracking-[0.3em] text-claro/85 transition-colors hover:text-preto"
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
