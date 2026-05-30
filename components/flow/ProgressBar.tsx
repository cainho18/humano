"use client";

import { useEffect, useRef, useState } from "react";
import { useFlow } from "@/lib/state/AnswersContext";
import {
  FIRST_PROGRESS_INDEX,
  LAST_PROGRESS_INDEX,
} from "@/lib/flow/steps";

/** Discreet progress + elapsed timer in the corner. Starts at first block. */
export function ProgressBar() {
  const { stepIndex } = useFlow();
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef<number | null>(null);

  const active = stepIndex >= FIRST_PROGRESS_INDEX;

  useEffect(() => {
    if (!active) return;
    if (startedAt.current === null) startedAt.current = Date.now();
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - (startedAt.current ?? Date.now())) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [active]);

  if (!active) return null;

  const span = LAST_PROGRESS_INDEX - FIRST_PROGRESS_INDEX;
  const frac = Math.min(
    1,
    Math.max(0, (stepIndex - FIRST_PROGRESS_INDEX) / span)
  );
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center gap-3 px-4 py-2 mix-blend-difference">
      <div className="h-px flex-1 bg-claro/20">
        <div
          className="h-px bg-rosa transition-all duration-500"
          style={{ width: `${frac * 100}%` }}
        />
      </div>
      <span className="font-mono text-[10px] tracking-widest text-claro/60">
        {mm}:{ss}
      </span>
    </div>
  );
}
