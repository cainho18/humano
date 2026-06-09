"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useReducedMotion } from "@/lib/useReducedMotion";
import { FINAL_COPY, type ItemTD } from "@/lib/content/final";
import type { FinalViewModel } from "../adapter";
import { ExpandCard } from "../parts/ExpandCard";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const EASE = "power3.out";

function ItemList({ items }: { items: ItemTD[] }) {
  return (
    <div className="mt-3.5">
      {items.map((it, i) => (
        <div key={i} className="border-t border-claro/10 py-3">
          <p className="fnt-body text-[14.5px] font-semibold text-claro">
            {it.t}
          </p>
          <p className="fnt-body mt-0.5 text-[13.5px] leading-relaxed text-claro/70">
            {it.d}
          </p>
        </div>
      ))}
    </div>
  );
}

function CardHead({
  open,
  kicker,
  title,
  accent,
}: {
  open: boolean;
  kicker: string;
  title: string;
  accent: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span
          className="fnt-mono text-[11px] uppercase tracking-[0.12em]"
          style={{ color: accent }}
        >
          {kicker}
        </span>
        <span
          className="fnt-mono text-lg leading-none text-claro/50 transition-transform duration-300"
          style={{ transform: open ? "rotate(45deg)" : "none" }}
          aria-hidden
        >
          +
        </span>
      </div>
      <p className="fnt-cond mt-2 text-2xl text-claro">{title}</p>
    </div>
  );
}

export function Retrato({ vm }: { vm: FinalViewModel }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { copy, nome, essencia } = vm.arquetipo;

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(".fnl-rt-up", {
        y: 40,
        opacity: 0,
        filter: "blur(6px)",
        duration: 0.9,
        ease: EASE,
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: "top 72%" },
      });
      gsap.from(".fnl-rt-card", {
        x: 90,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: { trigger: ".fnl-rt-card", start: "top 84%" },
      });
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <section
      ref={root}
      id="retrato"
      className="border-b border-claro/10 px-[var(--gutter)] pb-24 pt-28"
    >
      <div className="mx-auto max-w-5xl">
        <span className="fnl-rt-up fnt-mono block text-xs uppercase tracking-[0.2em] text-rosa">
          {FINAL_COPY.retrato.eyebrow}
        </span>
        <h1 className="fnl-rt-up fnt-disp mt-4 text-[clamp(3.5rem,12vw,8.75rem)] leading-[0.84] tracking-[-0.02em] text-claro">
          {nome}
        </h1>
        {essencia && (
          <p className="fnl-rt-up fnt-mono mt-3 text-sm uppercase tracking-[0.18em] text-claro/55">
            {essencia}
          </p>
        )}

        {/* intro à esquerda · cards empilhados à direita */}
        <div className="mt-11 grid gap-x-12 gap-y-9 md:grid-cols-[1.1fr_0.9fr]">
          <div className="fnl-rt-up flex flex-col gap-4">
            {copy.retrato.map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "fnt-body text-[clamp(1.15rem,2vw,1.4rem)] font-medium leading-relaxed text-claro"
                    : "fnt-body text-[clamp(1.05rem,1.8vw,1.2rem)] leading-relaxed text-claro/85"
                }
              >
                {p}
              </p>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <div className="fnl-rt-card rounded-[1.4rem] border border-amarelo/40 bg-[linear-gradient(180deg,rgba(255,255,0,0.04),transparent)] p-5">
            <ExpandCard
              label="Pontos fortes — abrir"
              header={(open) => (
                <CardHead
                  open={open}
                  kicker="pontos fortes"
                  title="O que segura vocês"
                  accent="#FFFF00"
                />
              )}
            >
              <ItemList items={copy.fortes} />
            </ExpandCard>
          </div>
          <div className="fnl-rt-card rounded-[1.4rem] border border-rosa/50 bg-[linear-gradient(180deg,rgba(255,0,170,0.05),transparent)] p-5">
            <ExpandCard
              label="Pontos de atenção — abrir"
              header={(open) => (
                <CardHead
                  open={open}
                  kicker="pontos de atenção"
                  title="Onde vocês emperram"
                  accent="#FF00AA"
                />
              )}
            >
              <ItemList items={copy.atencao} />
            </ExpandCard>
          </div>
          <div className="fnl-rt-card rounded-[1.4rem] border border-claro/12 bg-[linear-gradient(180deg,rgba(242,242,242,0.02),transparent)] p-5">
            <ExpandCard
              label="Exemplos do mundo real — abrir"
              header={(open) => (
                <CardHead
                  open={open}
                  kicker="exemplos do mundo real"
                  title="Quem também é assim"
                  accent="#8a8a8a"
                />
              )}
            >
              <ItemList items={copy.exemplos} />
            </ExpandCard>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
