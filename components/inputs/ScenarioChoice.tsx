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
      <legend className="font-display text-2xl leading-snug md:text-3xl">
        {scenario.prompt}
      </legend>
      <div className="flex flex-col gap-3">
        {options.map((opt) => {
          const active = value === opt.key;
          return (
            <motion.button
              key={opt.key}
              type="button"
              onClick={() => onChange(opt.key)}
              aria-pressed={active}
              whileTap={{ scale: 0.99 }}
              className={cn(
                "border-2 px-5 py-4 text-left font-mono text-sm leading-relaxed transition-colors cursor-pointer",
                active
                  ? "border-rosa bg-rosa text-preto"
                  : "border-claro/20 text-claro/80 hover:border-rosa hover:text-claro"
              )}
            >
              {opt.text}
            </motion.button>
          );
        })}
      </div>
    </fieldset>
  );
}
