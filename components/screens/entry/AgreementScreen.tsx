"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { ScreenShell } from "@/components/flow/ScreenShell";
import { ScreenHeader } from "@/components/ui/screen-header";
import { RitualButton } from "@/components/ui/button-fx";
import { useFlow } from "@/lib/state/AnswersContext";
import { cn } from "@/lib/cn";

const ease = [0.22, 1, 0.36, 1] as const;

/** Tela 04 — o acordo (LGPD), tom GZero. Checkbox obrigatório. */
export function AgreementScreen() {
  const { next, setConsent } = useFlow();
  const [agreed, setAgreed] = useState(false);

  return (
    <ScreenShell bg="preto" scroll>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
        className="mx-auto flex w-full max-w-2xl flex-col gap-10"
      >
        <ScreenHeader
          index="03"
          kicker="o combinado"
          title="O combinado não sai caro."
        />

        <p
          className="max-w-[60ch] font-mono leading-relaxed text-claro/65"
          style={{ fontSize: "var(--text-meta)" }}
        >
          Suas respostas são suas. A gente usa pra montar a fotografia da sua
          organização e pra melhorar esse oráculo aqui. Não vende, não entrega
          pra ninguém, não usa teu nome pra propaganda nenhuma. Tudo guardado
          conforme a LGPD manda. Quer os detalhes jurídicos completos? Tá tudo
          aqui ó:{" "}
          <a
            href="#"
            className="text-rosa underline decoration-rosa/40 underline-offset-4 transition-colors hover:decoration-rosa"
          >
            política de privacidade
          </a>
          .
        </p>

        <div className="hw-rule" />

        <button
          type="button"
          onClick={() => setAgreed((v) => !v)}
          aria-pressed={agreed}
          className="group flex items-start gap-4 text-left"
        >
          <span
            className={cn(
              "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border transition-all duration-200",
              agreed
                ? "border-rosa bg-rosa text-preto"
                : "border-claro/35 text-transparent group-hover:border-claro/70"
            )}
            aria-hidden
          >
            <Check size={15} strokeWidth={3} />
          </span>
          <span className="font-mono text-sm leading-relaxed text-claro/90">
            Topo. Pode usar minhas respostas como combinado.
          </span>
        </button>

        <div className="pt-2">
          <RitualButton
            label="Selar o acordo"
            fx="fill"
            accent="rosa"
            disabled={!agreed}
            onClick={() => {
              setConsent(true);
              next();
            }}
          />
        </div>
      </motion.div>
    </ScreenShell>
  );
}
