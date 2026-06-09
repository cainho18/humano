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

gsap.registerPlugin(ScrollTrigger, useGSAP);

const DOT: Record<TechVM["estado"], string> = {
  Forte: "bg-claro",
  Frágil: "bg-claro/45",
  Engatilhado: "bg-amarelo",
  Ausente: "bg-claro/25",
};

function TechCard({
  t,
  focused,
  onFocus,
}: {
  t: TechVM;
  focused: string | null;
  onFocus: (c: string | null) => void;
}) {
  const isFocus = focused === t.chave;
  const dimmed = focused != null && !isFocus;
  const accent = t.nivel >= 65 ? "#FFFF00" : "#FF00AA";

  const toggle = () => onFocus(isFocus ? null : t.chave);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isFocus}
      aria-label={`${t.nome}, nota ${t.nivel}, ${t.estado} — destacar`}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
      data-chave={t.chave}
      data-side={t.campo}
      className={cn(
        "fnl-tcard block w-full cursor-pointer rounded-[0.85rem] border bg-[#0d0d0d] p-4 text-left transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amarelo",
        t.campo === "sub" ? "border-l-[3px] border-l-rosa" : "border-l-[3px] border-l-claro",
        isFocus ? "border-rosa" : "border-claro/12",
        dimmed && "opacity-40 blur-[1.5px]"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="fnt-cond text-[19px] text-claro">{t.nome}</span>
        <span className="flex items-center gap-2.5">
          <span className={cn("h-2.5 w-2.5 rounded-full", DOT[t.estado])} aria-hidden />
          <span className="fnt-mono text-[15px] font-bold" style={{ color: accent }}>
            {t.nivel}
          </span>
        </span>
      </div>

      <p className="fnt-mono mt-3 text-[10px] uppercase tracking-[0.08em] text-claro/45">
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
      <div className="mt-3.5 flex flex-col gap-2.5">
        {t.dims.map((d) => (
          <div key={d}>
            <div className="flex items-baseline justify-between gap-2">
              <span className="fnt-mono text-[11px] text-claro/75">{d}</span>
              <span className="fnt-mono text-[11px] font-bold tabular-nums" style={{ color: accent }}>
                {t.nivel}
              </span>
            </div>
            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-claro/12">
              <div className="h-full rounded-full" style={{ width: `${t.nivel}%`, background: accent }} />
            </div>
          </div>
        ))}
      </div>
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
        const dir = el.dataset.side === "obj" ? 1 : -1;
        const chave = el.dataset.chave!;
        // anima só x (vem de fora da tela). Sem opacity: o dim por clique é
        // controlado por classe (opacity/blur) e não pode ser sobrescrito.
        gsap.from(el, {
          x: () => dir * (window.innerWidth * 0.62),
          duration: 0.85,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: el,
            start: "top 84%",
            invalidateOnRefresh: true,
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
          <b className="text-amarelo">clique</b> numa tecnologia pra destacá-la — as outras desfocam.
        </p>

        <div className="mt-9 grid items-start gap-7 md:grid-cols-[1fr_330px_1fr]">
          <div className="order-2 flex flex-col gap-4 md:order-1">
            {subCol.map((t) => (
              <TechCard key={t.chave} t={t} focused={focused} onFocus={setFocused} />
            ))}
          </div>
          <div className="order-1 md:order-2 md:sticky md:top-24 md:self-start">
            <BodyHeatmap
              techs={techs}
              lit={lit}
              focused={focused}
              onFocus={setFocused}
            />
          </div>
          <div className="order-3 flex flex-col gap-4">
            {objCol.map((t) => (
              <TechCard key={t.chave} t={t} focused={focused} onFocus={setFocused} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
