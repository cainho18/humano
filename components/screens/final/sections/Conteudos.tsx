"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

import { useReducedMotion } from "@/lib/useReducedMotion";
import { FINAL_COPY } from "@/lib/content/final";
import type { FinalViewModel, PillVM } from "../adapter";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function PillCard({ p, i }: { p: PillVM; i: number }) {
  // alterna o sotaque entre as 4 cartas, mantendo a paleta
  const accent = i % 2 === 0 ? "#FF00AA" : "#FFFF00";
  return (
    <article
      className="fnl-pill group/pill relative flex flex-col rounded-[1.25rem] border border-claro/12 bg-[#0d0d0d] p-1.5 transition-colors duration-500 hover:border-claro/25"
    >
      <div className="flex h-full flex-col rounded-[0.95rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.025),transparent)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="flex items-center justify-between gap-3">
          <span
            className="fnt-mono rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.14em]"
            style={{ color: accent, borderColor: `${accent}55` }}
          >
            {p.trilha}
          </span>
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full border border-claro/15 text-claro/40 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/pill:-translate-y-[1px] group-hover/pill:translate-x-[1px] group-hover/pill:border-claro/35 group-hover/pill:text-claro"
            aria-hidden
          >
            <ArrowUpRight size={14} strokeWidth={2} />
          </span>
        </div>

        <h3 className="fnt-cond mt-4 text-[clamp(1.3rem,2vw,1.6rem)] leading-[1.05] text-claro">
          {p.titulo}
        </h3>
        <p
          className="fnt-body mt-2 text-[13.5px] font-medium italic leading-snug"
          style={{ color: accent }}
        >
          {p.manchete}
        </p>
        <p className="fnt-body mt-3 text-[13.5px] leading-relaxed text-claro/75">
          {p.resumo}
        </p>

        <span className="fnt-mono mt-5 inline-flex w-max items-center gap-2 border-t border-claro/10 pt-4 text-[10px] uppercase tracking-[0.12em] text-claro/45">
          <span className="h-1 w-1 rounded-full" style={{ background: accent }} />
          {p.motivo}
        </span>
      </div>
    </article>
  );
}

export function Conteudos({ vm }: { vm: FinalViewModel }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(".fnl-ct-up", {
        y: 32,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 74%" },
      });
      gsap.utils.toArray<HTMLElement>(".fnl-pill").forEach((el, i) => {
        gsap.from(el, {
          y: 44,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          delay: i * 0.06,
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <section
      ref={root}
      id="conteudos"
      className="border-b border-claro/10 px-[var(--gutter)] py-24"
    >
      <div className="mx-auto max-w-5xl">
        <span className="fnl-ct-up fnt-mono block text-xs uppercase tracking-[0.2em] text-rosa">
          {FINAL_COPY.conteudos.eyebrow}
        </span>
        <p className="fnl-ct-up fnt-body mt-4 max-w-[34ch] text-[clamp(1.2rem,2.4vw,1.6rem)] font-medium leading-snug text-claro">
          {FINAL_COPY.conteudos.narr}
        </p>

        <div className="mt-9 grid gap-4 sm:grid-cols-2">
          {vm.conteudos.map((p, i) => (
            <PillCard key={p.id} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
