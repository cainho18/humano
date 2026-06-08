"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, Square } from "lucide-react";
import type { Scenario, ScenarioOption } from "@/lib/content/scenarios";
import type { ScenarioKey } from "@/lib/types";
import { useSpeechToText } from "@/lib/useSpeechToText";
import { cn } from "@/lib/cn";

interface ScenarioChoiceProps {
  scenario: Scenario;
  value?: ScenarioKey;
  onChange: (key: ScenarioKey) => void;
  otherText: string;
  onOtherChange: (text: string) => void;
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

const LETTERS = ["A", "B", "C", "D", "E", "F"];

/** Uma cena → 4 alternativas (ordem aleatória) + a opção E (outro cenário). */
export function ScenarioChoice({
  scenario,
  value,
  onChange,
  otherText,
  onOtherChange,
}: ScenarioChoiceProps) {
  const [options] = useState<ScenarioOption[]>(() => shuffle(scenario.options));
  const isOther = value === "e";

  const { supported, listening, interim, toggle } = useSpeechToText((t) =>
    onOtherChange((otherText + " " + t).trim())
  );

  return (
    <fieldset className="flex flex-col gap-7">
      <legend
        className="hw-title text-claro"
        style={{ fontSize: "var(--text-h3)" }}
      >
        {scenario.prompt}
      </legend>
      <div className="flex flex-col gap-4">
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
                {LETTERS[i]}
              </span>
              <span className="pt-px">{opt.text}</span>
            </motion.button>
          );
        })}

        {/* Opção E — outro cenário (texto/voz) */}
        <motion.button
          type="button"
          onClick={() => onChange("e")}
          aria-pressed={isOther}
          whileTap={{ scale: 0.99 }}
          className={cn(
            "group flex cursor-pointer items-start gap-4 px-5 py-4 text-left font-mono text-sm leading-relaxed transition-all duration-200",
            isOther
              ? "border border-amarelo/60 bg-amarelo/[0.06] text-claro"
              : "border border-dashed border-claro/20 text-claro/60 hover:border-claro/45 hover:text-claro"
          )}
        >
          <span
            className={cn(
              "mt-px flex h-5 w-5 shrink-0 items-center justify-center text-[10px] font-bold transition-colors",
              isOther
                ? "border border-amarelo/70 text-amarelo"
                : "border border-claro/25 text-claro/45 group-hover:border-claro/50"
            )}
            aria-hidden
          >
            E
          </span>
          <span className="pt-px">
            Outro cenário — conta com suas palavras (escreve ou fala).
          </span>
        </motion.button>

        {/* campo livre quando E está selecionado */}
        {isOther && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex flex-col gap-3 overflow-hidden pl-9"
          >
            <textarea
              value={otherText}
              onChange={(e) => onOtherChange(e.target.value)}
              rows={3}
              autoFocus
              placeholder={listening ? "ouvindo… pode falar" : "escreve ou fala como é de verdade aí…"}
              className="w-full resize-none rounded-md border border-claro/20 bg-claro/[0.03] p-3 font-mono text-sm text-claro placeholder:text-claro/30 focus:border-amarelo focus:outline-none"
            />
            {interim && (
              <p className="font-mono text-xs italic text-claro/45">{interim}</p>
            )}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggle}
                disabled={!supported}
                aria-pressed={listening}
                aria-label={listening ? "parar gravação" : "falar"}
                className={cn(
                  "relative flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors",
                  !supported && "cursor-not-allowed opacity-40",
                  listening
                    ? "border-rosa bg-rosa text-preto"
                    : "border-claro/40 text-claro hover:border-amarelo hover:text-amarelo"
                )}
              >
                {listening ? (
                  <>
                    <Square size={13} strokeWidth={3} /> parar
                    <span className="absolute -right-1 -top-1 flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rosa opacity-75" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-rosa" />
                    </span>
                  </>
                ) : (
                  <>
                    <Mic size={13} strokeWidth={2.5} /> falar
                  </>
                )}
              </button>
              {!supported && (
                <span className="font-mono text-[10px] leading-tight text-claro/40">
                  voz indisponível neste navegador — escreve aí
                </span>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </fieldset>
  );
}
