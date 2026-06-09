"use client";

import { useEffect, useMemo, useRef } from "react";
import { MotionConfig } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useFlow } from "@/lib/state/AnswersContext";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { scoreSession } from "@/lib/scoring";
import { humanwareView } from "@/lib/scoring/humanware";

import { buildFinalView } from "./adapter";
import { Retrato } from "./sections/Retrato";
import { Frequencia } from "./sections/Frequencia";
import { Corpo } from "./sections/Corpo";
import { Bugs } from "./sections/Bugs";
import { Salto } from "./sections/Salto";
import { Conteudos } from "./sections/Conteudos";
import { Fechamento } from "./sections/Fechamento";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Tela final — perfil organizacional + caminhos até a Gravidade Zero.
 * Scroll-driven (GSAP). Consome o motor (scoreSession + humanwareView) via
 * adaptador; nunca recalcula o score. Mundo visual próprio (classe `.fnl`).
 */
export function FinalScreen() {
  const { perfil, respostas, logSession } = useFlow();
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);

  const vm = useMemo(() => {
    const session = { perfil, respostas };
    const diag = scoreSession(session);
    const view = humanwareView(session, diag);
    return buildFinalView(diag, view);
  }, [perfil, respostas]);

  useEffect(() => {
    logSession();
  }, [logSession]);

  // barra de progresso de scroll (rosa, topo) — preenche conforme desce
  useGSAP(
    () => {
      if (reduced) return;
      gsap.to(".fnl-progress", {
        scaleX: 1,
        ease: "none",
        transformOrigin: "left",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
      ScrollTrigger.refresh();
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <MotionConfig reducedMotion="user">
      <div ref={root} className="fnl relative w-full bg-preto text-claro">
        {/* progresso de scroll */}
        <div className="hw-noprint pointer-events-none fixed inset-x-0 top-0 z-40 h-px bg-claro/10">
          <div
            className="fnl-progress h-full w-full origin-left bg-rosa"
            style={{ transform: reduced ? "scaleX(1)" : "scaleX(0)" }}
          />
        </div>

        <Retrato vm={vm} />
        <Frequencia vm={vm} />
        <Corpo vm={vm} />
        <Bugs vm={vm} />
        <Salto vm={vm} />
        <Conteudos vm={vm} />
        <Fechamento />
      </div>
    </MotionConfig>
  );
}
