"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { FINAL_COPY } from "@/lib/content/final";
import type { BFVM, FinalViewModel } from "../adapter";
import { ExpandCard } from "../parts/ExpandCard";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function BFCard({ p }: { p: BFVM }) {
  const bug = p.tipo === "bug";
  // firewall = heartstorm (rosa) · bug = jester (amarelo)
  const c = bug ? "#FFFF00" : "#FF00AA";
  return (
    <div
      className={cn(
        "fnl-bf relative rounded-[1rem] border p-5",
        bug
          ? p.crit
            ? "border-amarelo bg-[rgba(255,255,0,0.07)] sm:col-span-2"
            : "border-amarelo/60"
          : p.strong
            ? "border-rosa bg-[rgba(255,0,170,0.08)] sm:row-span-2"
            : "border-rosa/55"
      )}
    >
      <ExpandCard
        label={`${p.nome} — ${bug ? "bug" : "firewall"}, nota ${p.nivel} — abrir`}
        header={(open) => (
          <div>
            <span
              className="fnt-mono inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.14em]"
              style={{ color: c }}
            >
              {bug ? "bug" : "firewall"}
              {p.crit && (
                <span className="fnt-mono rounded-[9px] bg-amarelo px-2 py-[2px] text-[10px] uppercase tracking-[0.05em] text-preto">
                  prioridade
                </span>
              )}
            </span>
            <div className="mt-2 flex items-start justify-between gap-2">
              <span
                className={cn(
                  "fnt-cond leading-tight text-claro",
                  p.crit ? "text-[clamp(1.6rem,3vw,1.9rem)]" : "text-[23px]"
                )}
              >
                {p.nome}
              </span>
              <span
                className="fnt-mono text-[13px] text-claro/45 transition-transform duration-300"
                style={{ transform: open ? "rotate(45deg)" : "none" }}
                aria-hidden
              >
                +
              </span>
            </div>

            {/* barra da nota */}
            <div className="mt-3 flex items-center gap-2.5">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-claro/12">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${p.nivel}%`, background: c }}
                />
              </div>
              <span
                className="fnt-mono text-[12px] font-bold tabular-nums"
                style={{ color: c }}
              >
                {p.nivel}
              </span>
            </div>
          </div>
        )}
      >
        <p className="fnt-body pt-3 text-[13.5px] leading-relaxed text-claro/80">
          {p.body}
        </p>
      </ExpandCard>
    </div>
  );
}

export function Bugs({ vm }: { vm: FinalViewModel }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // bugs primeiro (prioridade na frente), depois firewalls
  const ordered = [...vm.bugs].sort((a, b) => {
    if (a.crit !== b.crit) return a.crit ? -1 : 1;
    if (a.tipo !== b.tipo) return a.tipo === "bug" ? -1 : 1;
    return a.nivel - b.nivel;
  });

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(".fnl-bg-up", {
        y: 32,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 74%" },
      });
      gsap.utils.toArray<HTMLElement>(".fnl-bf").forEach((el, i) => {
        gsap.from(el, {
          y: 40,
          x: i % 2 === 0 ? -28 : 28,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <section
      ref={root}
      id="bugs"
      className="border-b border-claro/10 px-[var(--gutter)] py-24"
    >
      <div className="mx-auto max-w-5xl">
        <span className="fnl-bg-up fnt-mono block text-xs uppercase tracking-[0.2em] text-rosa">
          {FINAL_COPY.bugs.eyebrow}
        </span>
        <p className="fnl-bg-up fnt-body mt-4 max-w-[30ch] text-[clamp(1.2rem,2.4vw,1.6rem)] font-medium leading-snug text-claro">
          {FINAL_COPY.bugs.narr}
        </p>
        <p className="fnl-bg-up fnt-mono mt-2 text-xs text-claro/55">
          <b className="text-amarelo">firewalls</b> seguram o campo ·{" "}
          <b className="text-amarelo">bugs</b> são as brechas · clique pra abrir.
        </p>

        <div className="mt-8 grid auto-rows-min grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3 [grid-auto-flow:dense]">
          {ordered.map((p) => (
            <BFCard key={p.nome} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
