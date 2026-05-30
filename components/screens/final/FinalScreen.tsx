"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ScreenShell } from "@/components/flow/ScreenShell";
import { useFlow } from "@/lib/state/AnswersContext";
import { FINAL_FALA } from "@/lib/content/jester";

/** Mock da fotografia final (§8). O cálculo real virá de lib/scoring depois. */
const MOCK = {
  arquetipo: "O Jardim Selvagem",
  legenda:
    "Uma organização que cultiva mais do que controla. Cresce em direções que ninguém previu — e essa é a graça.",
  dims: [
    { label: "Presença", value: 78 },
    { label: "Autoria", value: 64 },
    { label: "Cuidado", value: 71 },
    { label: "Abertura ao erro", value: 52 },
    { label: "Diversidade real", value: 60 },
    { label: "Sentido compartilhado", value: 83 },
  ],
};

export function FinalScreen() {
  const { voc, logSession } = useFlow();
  const [data] = useState(MOCK);

  useEffect(() => {
    logSession();
  }, [logSession]);

  return (
    <ScreenShell bg="preto" scroll>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-12 py-8">
        <div className="flex items-start gap-3">
          <span className="text-3xl" aria-hidden>
            🃏
          </span>
          <p className="font-display text-xl leading-relaxed text-claro md:text-2xl">
            {voc(FINAL_FALA)}
          </p>
        </div>

        <div className="border-2 border-rosa p-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-rosa">
            arquétipo
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
            {data.arquetipo}
          </h1>
          <p className="mt-4 font-mono text-sm leading-relaxed text-claro/70">
            {data.legenda}
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {data.dims.map((d, i) => (
            <div key={d.label} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between font-mono text-xs uppercase tracking-widest text-claro/60">
                <span>{d.label}</span>
                <span className="tabular-nums text-claro">{d.value}</span>
              </div>
              <div className="h-1.5 w-full bg-claro/15">
                <motion.div
                  className="h-full bg-rosa"
                  initial={{ width: 0 }}
                  animate={{ width: `${d.value}%` }}
                  transition={{ duration: 0.8, delay: 0.1 * i, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="font-mono text-[10px] uppercase tracking-widest text-amarelo/60">
          ⚠ fotografia mock — cálculo real entra via lib/scoring
        </p>
      </div>
    </ScreenShell>
  );
}
