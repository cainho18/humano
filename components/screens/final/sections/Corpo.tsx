"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { FINAL_COPY } from "@/lib/content/final";
import type { FinalViewModel, TechVM } from "../adapter";
import { BodyHeatmap } from "../parts/BodyHeatmap";
import { ExpandCard } from "../parts/ExpandCard";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const DOT: Record<TechVM["estado"], string> = {
  Forte: "bg-claro",
  Frágil: "bg-claro/45",
  Engatilhado: "bg-amarelo",
  Ausente: "bg-claro/25",
};

function TechCard({
  t,
  onFocus,
  focused,
}: {
  t: TechVM;
  onFocus: (c: string | null) => void;
  focused: string | null;
}) {
  const isFocus = focused === t.chave;
  return (
    <div
      className={cn(
        "fnl-tcard rounded-[0.85rem] border bg-[#0d0d0d] px-4 py-3.5 transition-colors",
        t.campo === "sub" ? "border-l-[3px] border-l-rosa" : "border-l-[3px] border-l-claro",
        isFocus ? "border-rosa" : "border-claro/12 hover:border-rosa/60"
      )}
      data-chave={t.chave}
      data-side={t.campo}
      onMouseEnter={() => onFocus(t.chave)}
      onMouseLeave={() => onFocus(null)}
    >
      <ExpandCard
        label={`${t.nome}, nota ${t.nivel}, ${t.estado} — abrir`}
        header={(open) => (
          <div className="flex items-center justify-between gap-2">
            <span className="fnt-cond text-[19px] text-claro">{t.nome}</span>
            <span className="flex items-center gap-2.5">
              <span className={cn("h-2.5 w-2.5 rounded-full", DOT[t.estado])} aria-hidden />
              <span
                className="fnt-mono text-[15px] font-bold"
                style={{ color: t.nivel >= 65 ? "#FFFF00" : "#FF00AA" }}
              >
                {t.nivel}
              </span>
              <span
                className="fnt-mono text-[13px] text-claro/45 transition-transform duration-300"
                style={{ transform: open ? "rotate(45deg)" : "none" }}
                aria-hidden
              >
                +
              </span>
            </span>
          </div>
        )}
      >
        <div className="pt-3">
          <p className="fnt-mono text-[10px] uppercase tracking-[0.08em] text-claro/45">
            o que é
          </p>
          <p className="fnt-body mt-1 text-[13px] leading-relaxed text-claro/80">
            {t.oque}
          </p>
          <p className="fnt-mono mt-3 text-[10px] uppercase tracking-[0.08em] text-claro/45">
            por que essa nota · {t.estado.toLowerCase()}
          </p>
          <p className="fnt-body mt-1 text-[13px] leading-relaxed text-claro/80">
            {t.porque}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {t.dims.map((d) => (
              <span
                key={d}
                className="fnt-mono rounded-md border border-claro/15 px-2 py-1 text-[11px] text-claro/75"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </ExpandCard>
    </div>
  );
}

export function Corpo({ vm }: { vm: FinalViewModel }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const techs = vm.tecnologias;

  const allChaves = techs.map((t) => t.chave);
  const [lit, setLit] = useState<Set<string>>(
    () => new Set(reduced ? allChaves : [])
  );
  const [focused, setFocused] = useState<string | null>(null);
  const [mode, setMode] = useState<"panorama" | "reativo">("panorama");

  // colunas em ordem cabeça→pés
  const subCol = ["vinculo", "cuidado", "originalidade"]
    .map((c) => techs.find((t) => t.chave === c))
    .filter((t): t is TechVM => !!t);
  const objCol = ["consciencia", "dialogo", "autogestao"]
    .map((c) => techs.find((t) => t.chave === c))
    .filter((t): t is TechVM => !!t);

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(".fnl-cp-up", {
        y: 32,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 74%" },
      });

      gsap.utils.toArray<HTMLElement>(".fnl-tcard").forEach((el) => {
        const side = el.dataset.side === "obj" ? 70 : -70;
        const chave = el.dataset.chave!;
        gsap.from(el, {
          x: side,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            onEnter: () => setLit((prev) => new Set(prev).add(chave)),
          },
        });
      });
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <section
      ref={root}
      id="corpo"
      className="border-b border-claro/10 px-[var(--gutter)] py-24"
    >
      <div className="mx-auto max-w-5xl">
        <span className="fnl-cp-up fnt-mono block text-xs uppercase tracking-[0.2em] text-rosa">
          {FINAL_COPY.corpo.eyebrow}
        </span>
        <p className="fnl-cp-up fnt-body mt-4 max-w-[34ch] text-[clamp(1.2rem,2.4vw,1.6rem)] font-medium leading-snug text-claro">
          {FINAL_COPY.corpo.narr}
        </p>
        <p className="fnl-cp-up fnt-mono mt-2 text-xs text-claro/55">
          <b className="text-amarelo">clique</b> em cada uma pra entender o que é e por que essa nota.
        </p>

        {/* toggle de modo */}
        <div className="fnl-cp-up mt-6 flex gap-2">
          {(["panorama", "reativo"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={cn(
                "fnt-mono cursor-pointer rounded-full border px-3.5 py-1.5 text-[11px] uppercase tracking-[0.06em] transition-colors",
                mode === m
                  ? "border-amarelo bg-amarelo text-preto"
                  : "border-claro/20 text-claro/55 hover:border-claro/45"
              )}
            >
              {m === "panorama" ? "panorama — todas" : "reativo — uma a uma"}
            </button>
          ))}
        </div>

        <div className="mt-9 grid items-center gap-7 md:grid-cols-[1fr_330px_1fr]">
          <div className="order-2 flex flex-col gap-3 md:order-1">
            {subCol.map((t) => (
              <TechCard key={t.chave} t={t} focused={focused} onFocus={setFocused} />
            ))}
          </div>
          <div className="order-1 md:order-2">
            <BodyHeatmap
              techs={techs}
              lit={lit}
              focused={focused}
              mode={mode}
              onFocus={setFocused}
            />
          </div>
          <div className="order-3 flex flex-col gap-3">
            {objCol.map((t) => (
              <TechCard key={t.chave} t={t} focused={focused} onFocus={setFocused} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
