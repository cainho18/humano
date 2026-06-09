"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";
import type { TechVM } from "../adapter";

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
  /** chave em foco (hover/tap num card) */
  focused: string | null;
  mode: "panorama" | "reativo";
  onFocus: (chave: string | null) => void;
}

/** Figura + 6 zonas-chakra (brilho radial, blend screen). */
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
    <div className="relative mx-auto w-full max-w-[340px]">
      <div
        className="relative w-full"
        style={{ filter: "drop-shadow(0 0 44px rgba(255,0,170,0.22))" }}
      >
        <Image
          src="/corpo.webp"
          alt="Figura simbólica do corpo da organização, com zonas que acendem conforme cada tecnologia humana"
          width={433}
          height={1316}
          className="h-auto w-full select-none opacity-90"
          priority={false}
        />

        {techs.map((t) => {
          const size = 80 + t.nivel * 1.7;
          return (
            <div
              key={t.chave}
              className={cn(
                "fnl-zone",
                focused === t.chave && "flare"
              )}
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

        {/* pins (alvos de foco discretos) */}
        {techs.map((t) => (
          <button
            key={t.chave}
            type="button"
            aria-label={`destacar ${t.nome}`}
            onMouseEnter={() => onFocus(t.chave)}
            onMouseLeave={() => onFocus(null)}
            onFocus={() => onFocus(t.chave)}
            onBlur={() => onFocus(null)}
            className={cn(
              "absolute z-10 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors",
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
