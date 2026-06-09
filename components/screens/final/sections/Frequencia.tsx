"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useReducedMotion } from "@/lib/useReducedMotion";
import { FINAL_COPY } from "@/lib/content/final";
import type { FinalViewModel } from "../adapter";
import { RadarHex } from "../parts/RadarHex";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Frequencia({ vm }: { vm: FinalViewModel }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { g, estado, descricao, fillPct } = vm.gravidade;

  useGSAP(
    () => {
      const fill = root.current?.querySelector<HTMLElement>(".fnl-gfill");
      if (reduced) {
        if (fill) fill.style.transform = `scaleX(${fillPct / 100})`;
        return;
      }

      gsap.from(".fnl-fq-up", {
        y: 36,
        opacity: 0,
        filter: "blur(6px)",
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 72%" },
      });

      // barra G: preenche da ponta MÁQUINA até o G, conforme o scroll
      if (fill) {
        gsap.fromTo(
          fill,
          { scaleX: 0 },
          {
            scaleX: fillPct / 100,
            ease: "none",
            scrollTrigger: {
              trigger: ".fnl-gtrack",
              start: "top 85%",
              end: "top 38%",
              scrub: 0.6,
            },
          }
        );
      }

      // radar: cresce do centro + vértices em stagger
      gsap.from(".fnl-radar-poly", {
        scale: 0,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: { trigger: ".fnl-radar-wrap", start: "top 78%" },
      });
      gsap.from(".fnl-radar-dot", {
        scale: 0,
        transformOrigin: "center",
        stagger: 0.06,
        duration: 0.5,
        ease: "back.out(2)",
        scrollTrigger: { trigger: ".fnl-radar-wrap", start: "top 70%" },
      });
    },
    { scope: root, dependencies: [reduced, fillPct] }
  );

  return (
    <section
      ref={root}
      id="frequencia"
      className="border-b border-claro/10 px-[var(--gutter)] py-24"
    >
      <div className="mx-auto max-w-5xl">
        <span className="fnl-fq-up fnt-mono block text-xs uppercase tracking-[0.2em] text-rosa">
          {FINAL_COPY.frequencia.eyebrow}
        </span>
        <p className="fnl-fq-up fnt-body mt-4 max-w-[26ch] text-[clamp(1.2rem,2.4vw,1.6rem)] font-medium leading-snug text-claro">
          {FINAL_COPY.frequencia.narr}
        </p>

        <div className="mt-10 grid items-center gap-12 md:grid-cols-2">
          {/* readout de gravidade */}
          <div className="fnl-fq-up">
            <div className="fnt-disp text-[6rem] leading-[0.82] text-rosa">
              G{g}
            </div>
            <div className="fnt-cond mt-2 text-3xl text-claro">{estado}</div>
            <p className="fnt-body mt-3 max-w-[36ch] text-[15px] leading-relaxed text-claro/75">
              {descricao}
            </p>

            <div className="fnl-gtrack relative mt-7 h-[52px] overflow-hidden rounded-[26px] border border-claro/12 bg-[#161616]">
              <div
                className="fnl-gfill h-full w-full origin-left"
                style={{
                  transform: "scaleX(0)",
                  background:
                    "linear-gradient(90deg, rgba(255,0,170,0.45), #FF00AA)",
                }}
              />
            </div>
            <div className="fnt-mono mt-2.5 flex justify-between text-[12px]">
              <span className="text-claro/45">G10 · MÁQUINA</span>
              <span className="text-rosa">G0 · HUMANA</span>
            </div>
          </div>

          {/* radar */}
          <div className="fnl-fq-up fnl-radar-wrap flex justify-center">
            <RadarHex techs={vm.tecnologias} />
          </div>
        </div>
      </div>
    </section>
  );
}
