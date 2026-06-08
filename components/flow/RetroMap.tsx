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

/**
 * Mini-mapa (level-select) no canto inferior ESQUERDO, acima da assinatura
 * gzero. Recolhido = pílula; expandido = painel que abre pra cima. Funciona
 * igual em desktop e mobile (expandir/recolher).
 */
export function RetroMap() {
  const { stepIndex } = useFlow();
  const [open, setOpen] = useState(false);

  // só durante a pesquisa (depois que existe alguma estação alcançável)
  const firstStation = STATIONS[0]?.index ?? Infinity;
  if (stepIndex < firstStation) return null;

  // estação atual (ordinal 1-based)
  let ordinal = 1;
  STATIONS.forEach((st, i) => {
    if (st.index <= stepIndex) ordinal = i + 1;
  });

  return (
    <div className="fixed bottom-14 left-[var(--gutter)] z-40">
      <div className="relative">
        {open && (
          <div className="absolute bottom-full left-0 mb-3 w-[min(86vw,360px)] border border-claro/25 bg-preto/95 p-4 shadow-[0_22px_55px_-22px_rgba(255,0,170,0.55)] backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="hw-kicker flex items-center gap-2 text-amarelo">
                <MapIcon size={12} /> mapa · volte pra mudar
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="recolher mapa"
                className="text-claro/60 transition-colors hover:text-rosa"
              >
                <X size={15} />
              </button>
            </div>
            <Track onJump={() => setOpen(false)} />
          </div>
        )}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "recolher mapa" : "expandir mapa"}
          className="flex items-center gap-2 border border-claro/25 bg-preto/85 px-3 py-2 text-amarelo backdrop-blur-sm transition-colors hover:border-amarelo/60"
        >
          <MapIcon size={13} />
          <span className="hw-kicker tabular">
            mapa · {ordinal}/{STATIONS.length}
          </span>
        </button>
      </div>
    </div>
  );
}
