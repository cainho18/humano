"use client";

import { useEffect, useRef, useState } from "react";
import { useFlow } from "@/lib/state/AnswersContext";
import {
  FIRST_PROGRESS_INDEX,
  LAST_PROGRESS_INDEX,
} from "@/lib/flow/steps";

/**
 * Indicador discreto de progresso + tempo, no topo. Começa no primeiro bloco.
 * mix-blend-difference: legível tanto no preto quanto no rosa.
 */
export function ProgressBar() {
  const { stepIndex } = useFlow();
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef<number | null>(null);

  const active = stepIndex >= FIRST_PROGRESS_INDEX;

  useEffect(() => {
    if (!active) return;
    if (startedAt.current === null) startedAt.current = Date.now();
    const id = setInterval(() => {
      setElapsed(
        Math.floor((Date.now() - (startedAt.current ?? Date.now())) / 1000)
      );
    }, 1000);
    return () => clearInterval(id);
  }, [active]);

  if (!active) return null;

  const span = LAST_PROGRESS_INDEX - FIRST_PROGRESS_INDEX;
  const done = Math.max(0, stepIndex - FIRST_PROGRESS_INDEX);
  const frac = Math.min(1, Math.max(0, done / span));
  const pct = Math.round(frac * 100);
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 mix-blend-difference">
      <div className="flex items-center gap-4 px-[var(--gutter)] pt-5">
        <span className="hw-kicker tabular text-claro/70">
          {String(pct).padStart(2, "0")}
          <span className="text-claro/35">%</span>
        </span>
        <div className="relative h-px flex-1 overflow-hidden bg-claro/15">
          <div
            className="absolute inset-y-0 left-0 bg-rosa transition-[width] duration-700 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="hw-kicker tabular text-claro/45">
          {mm}:{ss}
        </span>
      </div>
    </div>
  );
}
