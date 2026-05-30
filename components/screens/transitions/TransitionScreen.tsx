"use client";

import { useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useFlow } from "@/lib/state/AnswersContext";
import { TRANSITIONS } from "@/lib/content/jester";
import type { TransitionEffect } from "@/lib/flow/steps";
import { RitualButton } from "@/components/ui/button-fx";

import { Perspective, Highlight } from "@/components/ui/perspective-highlight";
import { TremblingLines } from "@/components/ui/trembling-lines";
import { NokiaWebcam } from "@/components/ui/nokia-webcam";
import { GlitchText } from "@/components/ui/glitch";
import { GooeyDrag } from "@/components/ui/gooey-drag";
import TextCursorProximity from "@/components/ui/text-cursor-proximity";

interface TransitionScreenProps {
  transitionId: string;
  effect: TransitionEffect;
}

/** Quebra a fala em pedaços, destacando os trechos pedidos no briefing. */
function withHighlights(fala: string, highlights: string[]): ReactNode {
  if (highlights.length === 0) return fala;
  const escaped = highlights.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "g");
  const parts = fala.split(re);
  return parts.map((part, i) =>
    highlights.includes(part) ? (
      <Highlight key={i} color={i % 4 === 1 ? "rosa" : "amarelo"}>
        {part}
      </Highlight>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/** Telas de transição do Bobo — uma fala, um efeito distinto, um botão. */
export function TransitionScreen({
  transitionId,
  effect,
}: TransitionScreenProps) {
  const { voc, next } = useFlow();
  const containerRef = useRef<HTMLDivElement>(null);
  const def = TRANSITIONS[transitionId];
  const fala = voc(def.fala);

  const advance = (
    <div className="relative z-30 mt-12 flex justify-center">
      <RitualButton
        label={def.button}
        fx={effect === "glitch" ? "glitch" : "scramble"}
        accent={effect === "trembling" || effect === "glitch" ? "amarelo" : "rosa"}
        onClick={next}
      />
    </div>
  );

  const jester = (
    <span className="mb-6 block text-4xl" aria-hidden>
      🃏
    </span>
  );

  let inner: ReactNode;

  switch (effect) {
    case "perspective":
      inner = (
        <div className="relative z-30 mx-auto max-w-2xl text-center">
          {jester}
          <Perspective className="font-display text-2xl leading-relaxed md:text-3xl">
            <p>{withHighlights(def.fala, def.highlights ?? [])}</p>
          </Perspective>
          {advance}
        </div>
      );
      break;

    case "trembling":
      inner = (
        <>
          <TremblingLines color="#ff00aa" lines={16} />
          <div className="relative z-30 mx-auto max-w-2xl text-center">
            {jester}
            <p className="font-display text-2xl leading-relaxed text-claro md:text-3xl">
              {fala}
            </p>
            {advance}
          </div>
        </>
      );
      break;

    case "nokia":
      inner = (
        <div className="absolute inset-0">
          <NokiaWebcam>
            <div className="mx-auto max-w-2xl px-6 text-center">
              {jester}
              <p className="font-display text-xl leading-relaxed text-claro drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] md:text-2xl">
                {fala}
              </p>
              {advance}
            </div>
          </NokiaWebcam>
        </div>
      );
      break;

    case "glitch":
      inner = (
        <div className="relative z-30 mx-auto max-w-2xl text-center">
          {jester}
          <GlitchText
            as="p"
            className="font-display text-2xl leading-relaxed md:text-3xl"
          >
            {fala}
          </GlitchText>
          {advance}
        </div>
      );
      break;

    case "gooey":
      inner = (
        <>
          <div className="absolute inset-0 opacity-70">
            <GooeyDrag />
          </div>
          <div className="relative z-30 mx-auto max-w-2xl text-center">
            {jester}
            <p className="font-display text-2xl leading-relaxed text-claro md:text-3xl">
              {fala}
            </p>
            {advance}
          </div>
        </>
      );
      break;

    case "proximity":
      inner = (
        <div
          ref={containerRef}
          className="relative z-30 mx-auto max-w-2xl text-center"
        >
          {jester}
          <p className="font-display text-2xl leading-relaxed text-claro md:text-3xl">
            <TextCursorProximity
              label={fala}
              containerRef={containerRef}
              radius={110}
              falloff="gaussian"
              styles={{
                color: { from: "#f2f2f2", to: "#ff00aa" },
                fontWeight: { from: 400, to: 800 },
              }}
            />
          </p>
          {advance}
        </div>
      );
      break;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-preto px-6 py-16"
    >
      {inner}
    </motion.div>
  );
}
