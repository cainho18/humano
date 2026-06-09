"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";
import type { TechVM } from "../adapter";

// proporção exata da figura (corpo.webp) — garante que os chakras (camadas
// por cima) caiam exatamente sobre as partes do corpo.
const IMG_W = 433;
const IMG_H = 1316;

function coreColor(sc: number): string {
  return sc >= 65
    ? "rgba(255,255,0,0.95)"
    : sc >= 50
      ? "rgba(255,90,200,0.9)"
      : "rgba(255,0,170,0.8)";
}
const baseOpacity = (sc: number) => 0.22 + (sc / 100) * 0.62;

interface BodyHeatmapProps {
  techs: TechVM[];
  /** chaves já reveladas (acendem) — cresce no scroll "carne por carne" */
  lit: Set<string>;
  /** chave em foco (clique num card) */
  focused: string | null;
  mode: "panorama" | "reativo";
  onFocus: (chave: string | null) => void;
}

/** Figura (camada de baixo) + 6 zonas-chakra (camadas por cima, blend screen). */
export function BodyHeatmap({
  techs,
  lit,
  focused,
  mode,
  onFocus,
}: BodyHeatmapProps) {
  const anyFocus = focused != null;

  function zoneOpacity(t: TechVM): number {
    if (!lit.has(t.chave)) return 0;
    const base = baseOpacity(t.nivel);
    if (focused === t.chave) return Math.min(1, base + 0.3);
    if (mode === "reativo") return anyFocus ? 0.05 : 0.06;
    return anyFocus ? base * 0.4 : base;
  }

  return (
    <div className="relative mx-auto w-full max-w-[330px]">
      {/* camada-imagem: container com a proporção exata da figura */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: `${IMG_W} / ${IMG_H}` }}
      >
        <Image
          src="/corpo.webp"
          alt="Figura simbólica do corpo da organização, com zonas que acendem conforme cada tecnologia humana"
          fill
          sizes="330px"
          className="z-0 object-contain"
          priority={false}
        />

        {/* camadas-chakra por cima da imagem */}
        {techs.map((t) => {
          const size = 80 + t.nivel * 1.7;
          return (
            <div
              key={t.chave}
              className={cn("fnl-zone z-10", focused === t.chave && "flare")}
              style={{
                left: `${t.chakra.x}%`,
                top: `${t.chakra.y}%`,
                width: size,
                height: size,
                opacity: zoneOpacity(t),
                background: `radial-gradient(circle, ${coreColor(
                  t.nivel
                )} 0%, rgba(255,0,170,0.55) 35%, transparent 70%)`,
              }}
              aria-hidden
            />
          );
        })}

        {/* pins (alvos discretos sobre a figura) */}
        {techs.map((t) => (
          <button
            key={t.chave}
            type="button"
            aria-label={`destacar ${t.nome}`}
            onClick={() => onFocus(focused === t.chave ? null : t.chave)}
            className={cn(
              "absolute z-20 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors",
              focused === t.chave
                ? "border-amarelo bg-amarelo"
                : "border-claro/55 bg-preto/30 hover:border-amarelo"
            )}
            style={{ left: `${t.chakra.x}%`, top: `${t.chakra.y}%` }}
          />
        ))}
      </div>

      <p className="fnt-mono mt-3 text-center text-[11px] uppercase tracking-[0.1em] text-claro/45">
        <span className="text-rosa">◖ dentro · subjetivo</span>
        {"  ·  "}
        <span className="text-claro">objetivo · fora ◗</span>
      </p>
    </div>
  );
}
