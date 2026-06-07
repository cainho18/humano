"use client";

import { cn } from "@/lib/cn";

interface BipolarSliderProps {
  left: string;
  right: string;
  question?: string;
  value: number | undefined;
  onChange: (value: number) => void;
  onCommit?: () => void;
}

/** Eixo bipolar 0..100. Sem valor padrão visível até tocar (touched). */
export function BipolarSlider({
  left,
  right,
  question,
  value,
  onChange,
  onCommit,
}: BipolarSliderProps) {
  const touched = value != null;
  const v = touched ? value : 50;

  return (
    <div className="flex flex-col gap-4">
      {question && (
        <p
          className="hw-title text-claro"
          style={{ fontSize: "var(--text-h3)" }}
        >
          {question}
        </p>
      )}
      <div className="flex items-center justify-between gap-4">
        <span className="hw-kicker max-w-[42%] text-claro/65">{left}</span>
        <span className="hw-kicker max-w-[42%] text-right text-claro/65">
          {right}
        </span>
      </div>
      <div className="relative py-1.5">
        {/* tique central de referência */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-1.5 w-px -translate-x-1/2 bg-claro/25"
        />
        <input
          type="range"
          min={0}
          max={100}
          value={v}
          onChange={(e) => onChange(Number(e.target.value))}
          onPointerUp={onCommit}
          onKeyUp={onCommit}
          className={cn(
            "hw-range h-1 w-full cursor-pointer appearance-none rounded-none bg-claro/20",
            !touched && "opacity-70"
          )}
          style={{
            background: `linear-gradient(to right, #ff00aa 0%, #ff00aa ${v}%, rgba(242,242,242,0.2) ${v}%, rgba(242,242,242,0.2) 100%)`,
          }}
        />
      </div>
      {!touched && (
        <p className="hw-kicker text-amarelo/75">arrasta pra responder</p>
      )}
    </div>
  );
}
