"use client";

import { useState } from "react";
import { ScreenShell } from "@/components/flow/ScreenShell";
import { RitualButton } from "@/components/ui/button-fx";
import { useFlow } from "@/lib/state/AnswersContext";
import { cn } from "@/lib/cn";

/** Tela 04 — o acordo (LGPD), tom GZero. Checkbox obrigatório. */
export function AgreementScreen() {
  const { next } = useFlow();
  const [agreed, setAgreed] = useState(false);

  return (
    <ScreenShell bg="preto" scroll>
      <div className="mx-auto flex w-full max-w-xl flex-col gap-8">
        <h1 className="font-display text-3xl leading-tight md:text-4xl">
          O combinado não sai caro.
        </h1>

        <p className="font-mono text-sm leading-relaxed text-claro/70">
          Suas respostas são suas. A gente usa pra montar a fotografia da sua
          organização e pra melhorar esse oráculo aqui. Não vende, não entrega
          pra ninguém, não usa teu nome pra propaganda nenhuma. Tudo guardado
          conforme a LGPD manda. Quer os detalhes jurídicos completos? Tá tudo
          aqui ó:{" "}
          <a
            href="#"
            className="text-rosa underline underline-offset-4 hover:text-amarelo"
          >
            política de privacidade
          </a>
          .
        </p>

        <button
          type="button"
          onClick={() => setAgreed((v) => !v)}
          aria-pressed={agreed}
          className="flex items-start gap-3 text-left"
        >
          <span
            className={cn(
              "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border-2 font-mono text-sm transition-colors",
              agreed
                ? "border-rosa bg-rosa text-preto"
                : "border-claro/40 text-transparent"
            )}
            aria-hidden
          >
            ✕
          </span>
          <span className="font-mono text-sm leading-relaxed text-claro">
            Topo. Pode usar minhas respostas como combinado.
          </span>
        </button>

        <div className="pt-2">
          <RitualButton
            label="Selar o acordo"
            fx="fill"
            accent="rosa"
            disabled={!agreed}
            onClick={next}
          />
        </div>
      </div>
    </ScreenShell>
  );
}
