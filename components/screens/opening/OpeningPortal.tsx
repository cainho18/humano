"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useFlow } from "@/lib/state/AnswersContext";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { RitualButton } from "@/components/ui/button-fx";
import { RevealImageOnHover } from "@/components/ui/reveal-images";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const W_MIN = 200; // peso base (longe do cursor)
const W_MAX = 800; // peso sob o cursor
const RADIUS = 260; // alcance da influência em px

// grade da transição pixelada
const COLS = 24;
const ROWS = 14;
const TILES = COLS * ROWS;

const WELCOME =
  "Isso aqui não é pesquisa de clima. Não tem nota, não tem ranking, não tem resposta certa pra te deixar bonito na foto. É um espelho. Você olha, e a gente devolve o que viu — sem passar a mão na cabeça, mas sem te julgar também. Só funciona se você vier inteiro. Se vier de máscara, o espelho reflete a máscara. Respira. Larga a pressa lá fora. Vamos?";
const WORDS = WELCOME.split(" ");

/**
 * Palavra com VARIABLE FONT WEIGHT HOVER: cada letra fica mais "gorda" conforme
 * o cursor chega perto.
 */
function VariableWord({
  text,
  className,
  reduced,
}: {
  text: string;
  className?: string;
  reduced: boolean;
}) {
  const chars = [...text];
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [weights, setWeights] = useState<number[]>(() =>
    chars.map(() => (reduced ? 500 : W_MIN))
  );
  const raf = useRef(0);

  const onMove = useCallback((clientX: number, clientY: number) => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const next = spanRefs.current.map((el) => {
        if (!el) return W_MIN;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dist = Math.hypot(clientX - cx, clientY - cy);
        if (dist >= RADIUS) return W_MIN;
        const t = 1 - dist / RADIUS;
        return Math.round(W_MIN + (W_MAX - W_MIN) * t * t);
      });
      setWeights(next);
    });
  }, []);

  useEffect(() => {
    if (reduced) return;
    const handle = (e: PointerEvent) => onMove(e.clientX, e.clientY);
    const reset = () => setWeights(chars.map(() => W_MIN));
    window.addEventListener("pointermove", handle, { passive: true });
    window.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", handle);
      window.removeEventListener("pointerleave", reset);
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, onMove]);

  return (
    <span className={cn("inline-flex", className)} aria-label={text}>
      {chars.map((c, i) => (
        <span
          key={i}
          ref={(el) => {
            spanRefs.current[i] = el;
          }}
          aria-hidden
          style={{
            fontVariationSettings: `"wght" ${weights[i] ?? W_MIN}`,
            transition: reduced
              ? undefined
              : "font-variation-settings 0.18s ease-out",
            display: "inline-block",
          }}
        >
          {c}
        </span>
      ))}
    </span>
  );
}

/**
 * Tela 01 — PORTAL. HUMANWARE gigante no rosa; rolar (mouse ou botão "descer")
 * dispara uma PIXELATED SCROLL TRANSITION (grade de blocos pretos que dissolve
 * o rosa) e revela o manifesto, que acende palavra a palavra. O espelho só
 * aparece quando o cursor passa sobre o botão.
 */
export function OpeningPortal() {
  const { next } = useFlow();
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);

  const tiles = useMemo(() => Array.from({ length: TILES }), []);

  const descer = useCallback(() => {
    manifestoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useGSAP(
    () => {
      if (reduced) return;

      // PIXELATED SCROLL TRANSITION: o herói fica fixo e os blocos pretos
      // acendem em ordem aleatória, dissolvendo o rosa em preto.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".hw-hero",
          start: "top top",
          end: "+=115%",
          pin: true,
          scrub: 0.4,
        },
      });
      tl.to(".hw-hero-content", { opacity: 0, scale: 0.94, ease: "none" }, 0);
      tl.to(
        ".hw-pixel-tile",
        {
          opacity: 1,
          ease: "none",
          duration: 0.6,
          stagger: { each: 0.0016, from: "random" },
        },
        0
      );

      // manifesto acende palavra a palavra
      gsap.fromTo(
        ".hw-word",
        { opacity: 0.12, filter: "blur(5px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.4,
          ease: "none",
          scrollTrigger: {
            trigger: ".hw-manifesto",
            start: "top 80%",
            end: "bottom 65%",
            scrub: 0.5,
          },
        }
      );

      ScrollTrigger.refresh();
      const id = window.setTimeout(() => ScrollTrigger.refresh(), 450);
      return () => window.clearTimeout(id);
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <div ref={root} className="relative w-full bg-preto text-claro">
      {/* ───────── HERÓI: HUMANWARE ───────── */}
      <section className="hw-hero relative flex h-[100dvh] w-full flex-col overflow-hidden bg-rosa">
        <div className="hw-hero-content flex flex-1 flex-col">
          <div className="flex items-center justify-center gap-3 pt-8">
            <span className="h-px w-8 bg-claro/40" aria-hidden />
            <span className="hw-kicker text-claro/75">atravesse o portal</span>
            <span className="h-px w-8 bg-claro/40" aria-hidden />
          </div>

          <div className="flex flex-1 items-center justify-center overflow-hidden px-2">
            {/* Desktop: horizontal, ocupando a largura */}
            <VariableWord
              text="HUMANWARE"
              reduced={reduced}
              className="hidden font-display leading-none tracking-tighter sm:inline-flex sm:text-[17.5vw]"
            />

            {/* Mobile: HUMAN em cima, WARE embaixo alinhado à esquerda */}
            <div className="flex w-full flex-col items-start leading-[0.86] sm:hidden">
              <VariableWord
                text="HUMAN"
                reduced={reduced}
                className="font-display tracking-tighter text-[27vw]"
              />
              <VariableWord
                text="WARE"
                reduced={reduced}
                className="font-display tracking-tighter text-[27vw]"
              />
            </div>
          </div>

          <div className="mb-12 flex justify-center">
            <RevealImageOnHover
              src="/espelho_01.png"
              alt="o espelho"
              size={240}
            >
              <motion.button
                onClick={descer}
                className="flex flex-col items-center gap-2 text-claro/85 transition-colors hover:text-preto"
                animate={reduced ? undefined : { y: [0, 8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="hw-kicker">descer</span>
                <span aria-hidden className="text-lg leading-none">
                  ↓
                </span>
              </motion.button>
            </RevealImageOnHover>
          </div>
        </div>

        {/* grade da transição pixelada (cobre o rosa de preto ao rolar) */}
        {!reduced && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 grid"
            style={{
              gridTemplateColumns: `repeat(${COLS}, 1fr)`,
              gridTemplateRows: `repeat(${ROWS}, 1fr)`,
            }}
          >
            {tiles.map((_, i) => (
              <span key={i} className="hw-pixel-tile bg-preto opacity-0" />
            ))}
          </div>
        )}
      </section>

      {/* ───────── MANIFESTO ───────── */}
      <section
        ref={manifestoRef}
        className="hw-manifesto relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-[var(--gutter)] py-[16vh]"
      >
        <div
          aria-hidden
          className="hw-breathe pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(46% 40% at 50% 46%, rgba(255,0,170,0.12), transparent 72%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl">
          <span className="hw-kicker mb-8 block text-rosa">o manifesto</span>
          <p className="hw-title text-balance text-[clamp(1.6rem,1rem+2.4vw,2.9rem)] leading-[1.32]">
            {reduced
              ? WELCOME
              : WORDS.map((w, i) => (
                  <span
                    key={i}
                    className="hw-word inline-block opacity-15"
                    style={{ filter: "blur(4px)" }}
                  >
                    {w}
                    {i < WORDS.length - 1 ? " " : ""}
                  </span>
                ))}
          </p>
          <div className="mt-12">
            <RitualButton
              label="Atravessar"
              fx="fill"
              accent="rosa"
              onClick={next}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
