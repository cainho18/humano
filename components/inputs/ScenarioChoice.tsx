"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Scenario, ScenarioOption } from "@/lib/content/scenarios";
import type { ScenarioKey } from "@/lib/types";
import { cn } from "@/lib/cn";

interface ScenarioChoiceProps {
  scenario: Scenario;
  value?: ScenarioKey;
  onChange: (key: ScenarioKey) => void;
}

/** Embaralha estável (Fisher-Yates). Roda uma vez por montagem (client-side). */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Uma cena → 4 alternativas em ordem aleatória (a key original guia o cálculo). */
export function ScenarioChoice({
  scenario,
  value,
  onChange,
}: ScenarioChoiceProps) {
  // ordem aleatória fixada por sessão — não re-embaralha a cada render
  const [options] = useState<ScenarioOption[]>(() => shuffle(scenario.options));

  return (
    <fieldset className="flex flex-col gap-6">
      <legend
        className="hw-title text-claro"
        style={{ fontSize: "var(--text-h3)" }}
      >
        {scenario.prompt}
      </legend>
      <div className="flex flex-col gap-2.5">
        {options.map((opt, i) => {
          const active = value === opt.key;
          return (
            <motion.button
              key={opt.key}
              type="button"
              onClick={() => onChange(opt.key)}
              aria-pressed={active}
              whileTap={{ scale: 0.99 }}
              className={cn(
                "group flex cursor-pointer items-start gap-4 px-5 py-4 text-left font-mono text-sm leading-relaxed transition-all duration-200",
                active
                  ? "bg-rosa text-preto shadow-[0_16px_40px_-20px_rgba(255,0,170,0.8)]"
                  : "border border-claro/15 text-claro/75 hover:border-claro/40 hover:bg-claro/[0.03] hover:text-claro"
              )}
            >
              <span
                className={cn(
                  "mt-px flex h-5 w-5 shrink-0 items-center justify-center text-[10px] font-bold tabular-nums transition-colors",
                  active
                    ? "bg-preto/15 text-preto"
                    : "border border-claro/25 text-claro/45 group-hover:border-claro/50 group-hover:text-claro/80"
                )}
                aria-hidden
              >
                {["A", "B", "C", "D", "E", "F"][i]}
              </span>
              <span className="pt-px">{opt.text}</span>
            </motion.button>
          );
        })}
      </div>
    </fieldset>
  );
}
