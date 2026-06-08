"use client";

import type { LikertIndex } from "@/lib/types";
import { cn } from "@/lib/cn";

interface LikertScaleProps {
  scale: readonly string[];
  value: LikertIndex | undefined;
  onChange: (value: LikertIndex) => void;
}

/** Escala de 5 pontos (frequência / intensidade). */
export function LikertScale({ scale, value, onChange }: LikertScaleProps) {
  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${scale.length}, minmax(0, 1fr))` }}
    >
      {scale.map((label, i) => {
        const active = value === i;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i as LikertIndex)}
            aria-pressed={active}
            className={cn(
              "group flex cursor-pointer flex-col items-center gap-2.5 px-1 py-3.5 transition-all duration-200 active:scale-[0.97]",
              active
                ? "bg-rosa text-preto shadow-[0_14px_34px_-18px_rgba(255,0,170,0.85)]"
                : "border border-claro/15 text-claro/55 hover:border-claro/40 hover:text-claro"
            )}
          >
            <span
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-colors",
                active
                  ? "bg-preto"
                  : "bg-claro/30 group-hover:bg-claro/70"
              )}
              aria-hidden
            />
            <span className="hw-kicker text-center leading-tight" style={{ letterSpacing: "0.14em" }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
