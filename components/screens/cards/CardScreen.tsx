"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ScreenShell } from "@/components/flow/ScreenShell";
import { RitualButton } from "@/components/ui/button-fx";
import { useFlow } from "@/lib/state/AnswersContext";
import { CARDS } from "@/lib/content/cards";
import { CARD4_INTRO } from "@/lib/content/jester";
import type { CardField } from "@/lib/flow/steps";
import { cn } from "@/lib/cn";

/** Carta qualitativa com flip 3D: vira a carta → revela a pergunta + campo. */
export function CardScreen({ field }: { field: CardField }) {
  const { respostas, setCard, next, voc } = useFlow();
  const def = CARDS[field];
  const [flipped, setFlipped] = useState(false);
  const intro = field === "nome_secreto" ? voc(CARD4_INTRO) : null;

  return (
    <ScreenShell bg="preto" scroll>
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-8">
        <div className="hw-flip-scene w-full">
          <div
            className={cn("hw-flip-inner relative w-full", flipped && "is-flipped")}
            style={{ minHeight: 360 }}
          >
            {/* frente: o verso da carta */}
            <button
              type="button"
              onClick={() => setFlipped(true)}
              className="hw-flip-face absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-6 border-2 border-rosa bg-preto p-8"
              aria-label="virar a carta"
            >
              <span className="text-6xl" aria-hidden>
                🃏
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.4em] text-rosa">
                virar a carta
              </span>
            </button>

            {/* verso: a pergunta + campo */}
            <div className="hw-flip-face hw-flip-back absolute inset-0 flex flex-col gap-5 border-2 border-amarelo bg-preto p-8">
              {intro && (
                <p className="font-mono text-xs leading-relaxed text-amarelo/80">
                  {intro}
                </p>
              )}
              <p className="font-display text-xl leading-snug text-claro md:text-2xl">
                {def.prompt}
              </p>
              {def.sub && (
                <p className="font-mono text-xs leading-relaxed text-claro/50">
                  {def.sub}
                </p>
              )}
              <textarea
                value={respostas.cards[field]}
                onChange={(e) => setCard(field, e.target.value)}
                rows={4}
                placeholder="escreve aqui…"
                className="mt-auto w-full resize-none border-b-2 border-claro/20 bg-transparent py-2 font-mono text-sm text-claro placeholder:text-claro/30 focus:border-rosa focus:outline-none"
              />
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
