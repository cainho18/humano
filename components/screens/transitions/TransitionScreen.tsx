"use client";

import { useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useFlow } from "@/lib/state/AnswersContext";
import { TRANSITIONS } from "@/lib/content/jester";
import type { TransitionEffect } from "@/lib/flow/steps";
import { RitualButton } from "@/components/ui/button-fx";
import { cn } from "@/lib/cn";

import { Perspective, Highlight } from "@/components/ui/perspective-highlight";
import { TremblingLines } from "@/components/ui/trembling-lines";
import { NokiaWebcam } from "@/components/ui/nokia-webcam";
import { GlitchText } from "@/components/ui/glitch";
import { GooeyDrag } from "@/components/ui/gooey-drag";
import { GlassCard } from "@/components/ui/glass-card";
import { FlashlightText } from "@/components/ui/flashlight-text";
import TextCursorProximity from "@/components/ui/text-cursor-proximity";

interface TransitionScreenProps {
  transitionId: string;
  effect: TransitionEffect;
}

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

export function TransitionScreen({
  transitionId,
  effect,
}: TransitionScreenProps) {
  const { voc, next } = useFlow();
  const containerRef = useRef<HTMLDivElement>(null);
  const def = TRANSITIONS[transitionId];
  const fala = voc(def.fala);

  const accent: "rosa" | "amarelo" =
    effect === "gooey" || effect === "trembling" || effect === "glitch"
      ? "amarelo"
      : "rosa";

  const advance = (
    <div className="relative z-30 mt-12 flex justify-center">
      <RitualButton
        label={def.button}
        fx={effect === "glitch" ? "glitch" : "scramble"}
        accent={accent}
        onClick={next}
      />
    </div>
  );

  const jester = (
    <span className="mb-6 block text-4xl" aria-hidden>
      🃏
    </span>
  );

  const pageBg = effect === "gooey" ? "bg-rosa" : "bg-preto";

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
          <TremblingLines color="#ff00aa" lines={12} />
          <div className="relative z-30 mx-auto max-w-2xl">
            <GlassCard className="text-center">
              {jester}
              <p className="font-display text-2xl leading-relaxed text-claro md:text-3xl">
                {fala}
              </p>
            </GlassCard>
            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-claro/50">
              passe o cursor nas cordas — cada uma tem um som
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
            <div className="mx-auto max-w-xl px-6">
              <GlassCard className="text-center">
                {jester}
                <p className="font-display text-xl leading-relaxed text-claro md:text-2xl">
                  {fala}
                </p>
                <div className="mt-8">{advance}</div>
              </GlassCard>
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
          <div className="absolute inset-0">
            <GooeyDrag color="#f2f2f2" />
          </div>
          <div className="pointer-events-none relative z-30 mx-auto max-w-lg">
            <GlassCard className="pointer-events-auto text-center">
              {jester}
              <p className="font-display text-2xl leading-relaxed text-claro md:text-3xl">
                {fala}
              </p>
              <div className="mt-8">{advance}</div>
            </GlassCard>
          </div>
        </>
      );
      break;

    case "proximity":
      // desktop = lanterna; mobile = texto reagindo ao toque (proximity)
      inner = (
        <div className="relative z-30 mx-auto w-full max-w-3xl">
          {/* desktop: lanterna */}
          <div className="hidden sm:block">
            <FlashlightText text={fala} />
            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-claro/40">
              use o cursor como lanterna pra revelar
            </p>
          </div>
          {/* mobile: proximidade ao toque */}
          <div ref={containerRef} className="text-center sm:hidden">
            {jester}
            <p className="font-display text-2xl leading-relaxed text-claro">
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
          </div>
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
      className={cn(
        "relative flex min-h-dvh w-full items-center justify-center overflow-hidden px-6 py-16",
        pageBg
      )}
    >
      {inner}
    </motion.div>
  );
}
