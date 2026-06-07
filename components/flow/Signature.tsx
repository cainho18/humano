"use client";

import { useFlow } from "@/lib/state/AnswersContext";
import { GZeroMark } from "@/components/ui/gzero-mark";

/**
 * Assinatura persistente da casa: marca gzero discreta no canto inferior
 * esquerdo, presente em toda a jornada (menos na tela final, que tem rodapé
 * próprio). mix-blend-difference garante leitura sobre preto e sobre rosa.
 */
export function Signature() {
  const { step } = useFlow();
  if (step.kind === "final") return null;

  return (
    <div className="pointer-events-none fixed bottom-5 left-[var(--gutter)] z-50 flex items-center gap-2">
      <GZeroMark className="h-2.5 text-claro/70" />
      <span className="hw-kicker text-claro/40">humanware®</span>
    </div>
  );
}
