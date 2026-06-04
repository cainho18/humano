"use client";

import { motion } from "framer-motion";
import { TextRevealByWord } from "@/components/ui/text-reveal";
import { PixelImage } from "@/components/ui/pixel-image";
import { RitualButton } from "@/components/ui/button-fx";
import { useFlow } from "@/lib/state/AnswersContext";
import { useReducedMotion } from "@/lib/useReducedMotion";

const WELCOME =
  "Isso aqui não é pesquisa de clima. Não tem nota, não tem ranking, não tem resposta certa pra te deixar bonito na foto. É um espelho. Você olha, e a gente devolve o que viu — sem passar a mão na cabeça, mas sem te julgar também. Só funciona se você vier inteiro. Se vier de máscara, o espelho reflete a máscara. Respira. Larga a pressa lá fora. Vamos?";

/**
 * Tela 02 — manifesto que se revela ao rolar (a JANELA rola, por isso o
 * useScroll funciona) e o espelho que vai ganhando nitidez (pixelated scroll).
 */
export function OpeningWelcome() {
  const { next } = useFlow();
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex min-h-dvh w-full flex-col items-center justify-center gap-12 bg-preto px-6 py-20 text-claro"
      >
        <p className="max-w-3xl text-2xl leading-relaxed md:text-3xl">{WELCOME}</p>
        <RitualButton label="Atravessar" fx="fill" accent="rosa" onClick={next} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full bg-preto text-claro"
    >
      <TextRevealByWord text={WELCOME} />

      <section className="flex min-h-dvh flex-col items-center justify-center gap-12 px-6 pb-32 pt-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-claro/40">
          o espelho
        </p>
        <PixelImage
          src="/espelho_01.png"
          alt="o espelho"
          className="max-w-sm"
        />
        <RitualButton label="Atravessar" fx="fill" accent="rosa" onClick={next} />
      </section>
    </motion.div>
  );
}
