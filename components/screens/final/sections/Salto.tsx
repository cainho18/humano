"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

import { useReducedMotion } from "@/lib/useReducedMotion";
import { FINAL_COPY } from "@/lib/content/final";
import { GZeroMark } from "@/components/ui/gzero-mark";
import type { FinalViewModel } from "../adapter";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Salto({ vm }: { vm: FinalViewModel }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const s = vm.salto;

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(".fnl-sl-up", {
        y: 32,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 74%" },
      });
      gsap.from(".fnl-sl-card", {
        y: 50,
        scale: 0.96,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".fnl-sl-card", start: "top 84%" },
      });
      gsap.from(".fnl-sl-step", {
        x: -24,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".fnl-sl-path", start: "top 86%" },
      });
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <section
      ref={root}
      id="salto"
      className="relative overflow-hidden px-[var(--gutter)] py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-32 h-[460px] w-[460px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,0,170,0.12), transparent 65%)",
        }}
      />
      <div className="relative mx-auto max-w-5xl">
        <span className="fnl-sl-up fnt-mono block text-xs uppercase tracking-[0.2em] text-rosa">
          {FINAL_COPY.salto.eyebrow}
        </span>
        <p className="fnl-sl-up fnt-body mt-4 max-w-[30ch] text-[clamp(1.2rem,2.4vw,1.6rem)] font-medium leading-snug text-claro">
          {FINAL_COPY.salto.narr}
        </p>

        <div className="fnl-sl-card mt-8 max-w-[760px] rounded-[1.25rem] border-[1.5px] border-rosa bg-[linear-gradient(180deg,rgba(255,0,170,0.10),transparent)] p-8">
          <div className="flex flex-wrap gap-2.5">
            <span className="fnt-mono rounded-full border border-rosa px-3 py-1.5 text-[11px] uppercase tracking-[0.06em] text-rosa">
              {s.intensidade}
            </span>
            <span className="fnt-mono rounded-full border border-claro/25 px-3 py-1.5 text-[11px] uppercase tracking-[0.06em] text-claro/60">
              {s.trilha}
            </span>
          </div>
          <h3 className="fnt-disp mt-4 text-[clamp(1.75rem,4vw,2.6rem)] leading-[1.02] text-claro">
            {s.oferta}
          </h3>
          <p className="fnt-mono mt-4 max-w-[54ch] text-sm leading-relaxed text-claro/80">
            {s.porque}
          </p>
          <p className="fnt-mono mt-3 text-sm text-claro/60">
            primeiro bug a corrigir:{" "}
            <b className="text-rosa">{s.bugPrioridade}</b> — a brecha que mais deixa a máquina entrar.
          </p>
          {s.trava && (
            <p className="fnt-mono mt-3 text-xs leading-relaxed text-amarelo/85">
              ⚠ {s.trava}
            </p>
          )}
        </div>

        {s.caminho.length > 0 && (
          <div className="fnl-sl-path mt-12">
            <p className="fnl-sl-up fnt-mono border-t border-claro/12 pt-4 text-xs uppercase tracking-[0.14em] text-claro/55">
              o caminho até G0
            </p>
            {s.caminho.map((c, i) => (
              <div
                key={i}
                className="fnl-sl-step fnt-mono flex items-center gap-3.5 py-2.5 text-sm text-claro/80"
              >
                <span className="text-rosa">→</span> {c}
              </div>
            ))}
          </div>
        )}

        {/* CTA + fechamento */}
        <div className="fnl-sl-up mt-14 flex flex-col items-center gap-8 text-center">
          <a
            href="#"
            className="group inline-flex items-center gap-3 rounded-full border-2 border-rosa bg-rosa px-7 py-4 text-lg font-bold text-preto transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] fnt-body"
          >
            começar a conversa
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-preto/15 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-[1px] group-hover:translate-x-1 group-hover:scale-105">
              <ArrowUpRight size={18} strokeWidth={2.5} />
            </span>
          </a>
          <div className="flex items-center gap-2 border-t border-claro/10 pt-7">
            <span className="fnt-mono text-[11px] uppercase tracking-[0.2em] text-claro/40">
              pesquisa humanware® · seu perfil organizacional
            </span>
            <span className="text-claro/20" aria-hidden>
              ·
            </span>
            <GZeroMark className="h-2.5 text-claro/55" />
          </div>
        </div>
      </div>
    </section>
  );
}
