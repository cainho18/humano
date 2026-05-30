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
    <div className="grid grid-cols-5 gap-2">
      {scale.map((label, i) => {
        const active = value === i;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i as LikertIndex)}
            aria-pressed={active}
            className={cn(
              "flex flex-col items-center gap-2 border-2 px-1 py-3 transition-colors cursor-pointer",
              active
                ? "border-rosa bg-rosa text-preto"
                : "border-claro/20 text-claro/60 hover:border-rosa hover:text-claro"
            )}
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                active ? "bg-preto" : "bg-claro/40"
              )}
              aria-hidden
            />
            <span className="text-center font-mono text-[10px] uppercase leading-tight tracking-wide">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
