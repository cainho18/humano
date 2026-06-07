"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, Square } from "lucide-react";
import { ScreenShell } from "@/components/flow/ScreenShell";
import { RitualButton } from "@/components/ui/button-fx";
import { HeatmapSurface } from "@/components/ui/heatmap-surface";
import { useFlow } from "@/lib/state/AnswersContext";
import { useSpeechToText } from "@/lib/useSpeechToText";
import { CARDS } from "@/lib/content/cards";
import { CARD4_INTRO } from "@/lib/content/jester";
import type { CardField } from "@/lib/flow/steps";
import { cn } from "@/lib/cn";

const CARD_META: Record<CardField, { num: string; label: string }> = {
  comodo: { num: "i", label: "o cômodo" },
  fora_dentro: { num: "ii", label: "fora / dentro" },
  cena: { num: "iii", label: "a cena" },
  nome_secreto: { num: "iv", label: "o nome secreto" },
};

/** Carta qualitativa: vira a carta (vibe mágica, heatmap) → pergunta + campo. */
export function CardScreen({ field }: { field: CardField }) {
  const meta = CARD_META[field];
  const { respostas, setCard, next, voc } = useFlow();
  const def = CARDS[field];
  const [flipped, setFlipped] = useState(false);
  const intro = field === "nome_secreto" ? voc(CARD4_INTRO) : null;
  const value = respostas.cards[field];

  const { supported, listening, interim, toggle } = useSpeechToText((t) =>
    setCard(field, (respostas.cards[field] + t).trimStart())
  );

  return (
    <ScreenShell bg="preto" scroll>
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-8">
        <div className="flex items-center gap-3 self-start">
          <span className="hw-kicker tabular text-rosa">carta · {meta.num}</span>
          <span className="h-px w-8 bg-rosa/40" aria-hidden />
          <span className="hw-kicker text-claro/45">{meta.label}</span>
        </div>
        <div className="hw-flip-scene w-full">
          <div
            className={cn(
              "hw-flip-inner relative w-full",
              flipped && "is-flipped"
            )}
            style={{ minHeight: 440 }}
          >
            {/* FRENTE: o verso da carta (mágica) */}
            <button
              type="button"
              onClick={() => setFlipped(true)}
              className="hw-flip-face absolute inset-0 cursor-pointer overflow-hidden rounded-2xl border-2 border-rosa"
              aria-label="virar a carta"
            >
              <HeatmapSurface />
              {/* moldura interna + glifo mágico */}
              <span className="absolute inset-3 rounded-xl border border-amarelo/60" />
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                <span className="font-serif text-7xl text-claro drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
                  ✦
                </span>
                <span className="hw-kicker text-claro drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]" style={{ letterSpacing: "0.45em" }}>
                  vira a carta
                </span>
              </span>
            </button>

            {/* VERSO: heatmap + painel glass legível */}
            <div className="hw-flip-face hw-flip-back absolute inset-0 overflow-hidden rounded-2xl border-2 border-amarelo">
              <HeatmapSurface />
              <div className="absolute inset-0 flex flex-col gap-4 p-5">
                <div className="flex h-full flex-col gap-4 rounded-xl border border-claro/15 bg-black/55 p-5 backdrop-blur-md">
                  {intro && (
                    <p className="font-mono text-xs leading-relaxed text-amarelo/90">
                      {intro}
                    </p>
                  )}
                  <p
                    className="hw-title text-claro"
                    style={{ fontSize: "var(--text-h3)" }}
                  >
                    {def.prompt}
                  </p>
                  {def.sub && (
                    <p className="font-mono text-xs leading-relaxed text-claro/60">
                      {def.sub}
                    </p>
                  )}

                  <textarea
                    value={value}
                    onChange={(e) => setCard(field, e.target.value)}
                    rows={3}
                    placeholder={
                      listening ? "ouvindo… pode falar" : "escreve ou fala…"
                    }
                    className="mt-auto w-full resize-none rounded-md border border-claro/20 bg-black/40 p-3 font-mono text-sm text-claro placeholder:text-claro/30 focus:border-rosa focus:outline-none"
                  />

                  {interim && (
                    <p className="font-mono text-xs italic text-claro/45">
                      {interim}
                    </p>
                  )}

                  {/* botão de microfone (ícone shadcn/lucide, sem emoji) */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={toggle}
                      disabled={!supported}
                      aria-pressed={listening}
                      aria-label={listening ? "parar gravação" : "falar"}
                      className={cn(
                        "relative flex items-center gap-2 rounded-full border-2 px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors",
                        !supported && "cursor-not-allowed opacity-40",
                        listening
                          ? "border-rosa bg-rosa text-preto"
                          : "border-claro/40 text-claro hover:border-rosa hover:text-rosa"
                      )}
                    >
                      {listening ? (
                        <>
                          <Square size={14} strokeWidth={3} />
                          parar
                          <span className="absolute -right-1 -top-1 flex h-3 w-3">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rosa opacity-75" />
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-rosa" />
                          </span>
                        </>
                      ) : (
                        <>
                          <Mic size={14} strokeWidth={2.5} />
                          falar
                        </>
                      )}
                    </button>
                    {!supported && (
                      <span className="font-mono text-[10px] leading-tight text-claro/40">
                        voz indisponível neste navegador — escreve aí
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{ opacity: flipped ? 1 : 0.3 }}
          className="flex justify-end self-stretch"
        >
          <RitualButton
            label="Seguir"
            fx="fill"
            accent="rosa"
            disabled={!flipped}
            onClick={next}
          />
        </motion.div>
      </div>
    </ScreenShell>
  );
}
