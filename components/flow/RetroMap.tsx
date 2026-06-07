"use client";

import { useState } from "react";
import { Map as MapIcon, X } from "lucide-react";
import { useFlow } from "@/lib/state/AnswersContext";
import { STEPS, type Step } from "@/lib/flow/steps";
import { cn } from "@/lib/cn";

const BLOCK_LABEL: Record<string, string> = {
  scenarios: "Cenas",
  sliders: "Tensões",
  priority: "Grana",
  behaviors: "90 dias",
  thermometers: "Polos",
  words: "Palavras",
  structural: "Engrenagem",
};
const CARD_LABEL: Record<string, string> = {
  comodo: "Cômodo",
  fora_dentro: "Fora/Dentro",
  cena: "Cena",
  nome_secreto: "Nome",
};

function labelFor(step: Step): string | null {
  if (step.kind === "block") return BLOCK_LABEL[step.block] ?? null;
  if (step.kind === "card") return CARD_LABEL[step.field] ?? null;
  return null;
}

interface Station {
  index: number;
  label: string;
}

const STATIONS: Station[] = STEPS.flatMap((s, index) => {
  const label = labelFor(s);
  return label ? [{ index, label }] : [];
});

function Track({ onJump }: { onJump?: () => void }) {
  const { stepIndex, maxReached, goTo } = useFlow();

  // estação "atual" = última cujo index <= stepIndex
  let current = -1;
  for (const st of STATIONS) if (st.index <= stepIndex) current = st.index;

  return (
    <ol className="flex flex-wrap items-stretch gap-x-2 gap-y-3 font-mono">
      {STATIONS.map((st, i) => {
        const visited = st.index <= maxReached;
        const isCurrent = st.index === current;
        const num = i + 1;
        return (
          <li key={st.index} className="flex items-center gap-2">
            <button
              type="button"
              disabled={!visited}
              onClick={() => {
                goTo(st.index);
                onJump?.();
              }}
              aria-current={isCurrent}
              className={cn(
                "relative flex flex-col items-center gap-1",
                visited ? "cursor-pointer" : "cursor-not-allowed"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center border-2 text-xs font-bold tabular-nums [image-rendering:pixelated]",
                  isCurrent
                    ? "border-amarelo bg-amarelo text-preto shadow-[3px_3px_0_0_#ff00aa]"
                    : visited
                      ? "border-rosa bg-rosa text-preto shadow-[3px_3px_0_0_#000]"
                      : "border-claro/25 text-claro/30"
                )}
              >
                {num}
              </span>
              <span
                className={cn(
                  "text-[8px] uppercase tracking-wider",
                  isCurrent
                    ? "text-amarelo"
                    : visited
                      ? "text-claro/80"
                      : "text-claro/25"
                )}
              >
                {st.label}
              </span>
              {isCurrent && (
                <span
                  aria-hidden
                  className="absolute -top-2 left-1/2 h-2 w-2 -translate-x-1/2 animate-bounce bg-amarelo"
                />
              )}
            </button>
            {i < STATIONS.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "mb-4 h-0.5 w-2",
                  st.index < maxReached ? "bg-rosa" : "bg-claro/20"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** Mini-mapa retrô (level-select). Desktop: fixo no canto. Mobile: botão→overlay. */
export function RetroMap() {
  const { stepIndex } = useFlow();
  const [open, setOpen] = useState(false);

  // só durante a pesquisa (depois que existe alguma estação alcançável)
  const firstStation = STATIONS[0]?.index ?? Infinity;
  if (stepIndex < firstStation) return null;

  return (
    <>
      {/* DESKTOP: painel fixo no canto inferior direito */}
      <div className="pointer-events-auto fixed bottom-4 right-4 z-40 hidden max-w-[320px] border border-claro/25 bg-preto/90 p-4 shadow-[0_20px_50px_-22px_rgba(255,0,170,0.5)] backdrop-blur-sm md:block">
        <div className="mb-3 flex items-center gap-2 text-amarelo">
          <MapIcon size={12} />
          <span className="hw-kicker">mapa · volte pra mudar</span>
        </div>
        <Track />
      </div>

      {/* MOBILE: botão pixelado que abre overlay */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="abrir mapa"
        className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center border-2 border-amarelo bg-preto text-amarelo shadow-[3px_3px_0_0_#ff00aa] md:hidden"
      >
        <MapIcon size={20} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end bg-preto/70 backdrop-blur-sm md:hidden">
          <div className="w-full border-t border-amarelo/70 bg-preto p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="hw-kicker text-amarelo">
                mapa · toque pra voltar
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="fechar mapa"
                className="flex h-8 w-8 items-center justify-center border border-claro/30 text-claro"
              >
                <X size={16} />
              </button>
            </div>
            <Track onJump={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
