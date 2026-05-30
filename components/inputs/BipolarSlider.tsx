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
        <p className="font-display text-xl leading-snug md:text-2xl">
          {question}
        </p>
      )}
      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-claro/60">
        <span>{left}</span>
        <span>{right}</span>
      </div>
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
          !touched && "opacity-60"
        )}
        style={{
          background: `linear-gradient(to right, #ff00aa 0%, #ff00aa ${v}%, rgba(242,242,242,0.2) ${v}%, rgba(242,242,242,0.2) 100%)`,
        }}
      />
      {!touched && (
        <p className="font-mono text-[10px] uppercase tracking-widest text-amarelo/70">
          arrasta pra responder
        </p>
      )}
    </div>
  );
}
