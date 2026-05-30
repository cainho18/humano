"use client";

import { motion } from "framer-motion";
import { TextRevealByWord } from "@/components/ui/text-reveal";
import { RevealImageOnHover } from "@/components/ui/reveal-images";
import { RitualButton } from "@/components/ui/button-fx";
import { useFlow } from "@/lib/state/AnswersContext";
import { useReducedMotion } from "@/lib/useReducedMotion";

const WELCOME =
  "Isso aqui não é pesquisa de clima. Não tem nota, não tem ranking, não tem resposta certa pra te deixar bonito na foto. É um espelho. Você olha, e a gente devolve o que viu — sem passar a mão na cabeça, mas sem te julgar também. Só funciona se você vier inteiro. Se vier de máscara, o espelho reflete a máscara. Respira. Larga a pressa lá fora. Vamos?";

/** Tela 02 — manifesto que se revela ao rolar, e o convite a atravessar. */
export function OpeningWelcome() {
  const { next } = useFlow();
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-dvh w-full overflow-y-auto bg-preto text-claro"
    >
      {reduced ? (
        <div className="mx-auto flex min-h-dvh max-w-3xl items-center px-6 py-20">
          <p className="text-2xl leading-relaxed md:text-3xl">{WELCOME}</p>
        </div>
      ) : (
        <TextRevealByWord text={WELCOME} className="text-claro" />
      )}

      <div className="flex flex-col items-center gap-6 px-6 pb-32 pt-8">
        <RevealImageOnHover
          src="/espelho_01.png"
          alt="o espelho"
          size={220}
        >
          <RitualButton
            label="Atravessar"
            fx="fill"
            accent="rosa"
            onClick={next}
          />
        </RevealImageOnHover>
      </div>
    </motion.div>
  );
}
