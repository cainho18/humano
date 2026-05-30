"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { TextScramble } from "@/components/ui/text-scramble";
import { GlitchText } from "@/components/ui/glitch";

type Fx = "scramble" | "glitch" | "fill" | "plain";

interface RitualButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  fx?: Fx;
  /** accent used by the fill effect */
  accent?: "rosa" | "amarelo";
}

/**
 * Button that varies its hover treatment across the flow (scramble / glitch /
 * cursor-fill / plain). Keyboard accessible, generous hit area, focus ring from
 * globals.
 */
export function RitualButton({
  label,
  fx = "plain",
  accent = "rosa",
  className,
  disabled,
  onMouseEnter,
  onMouseLeave,
  ...props
}: RitualButtonProps) {
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const ref = useRef<HTMLButtonElement>(null);

  const fillsOnHover = fx === "fill";
  const base = cn(
    "relative inline-flex items-center justify-center overflow-hidden",
    "px-8 py-4 min-h-12 font-mono uppercase tracking-widest text-sm",
    "border-2 transition-colors duration-300 cursor-pointer",
    "disabled:opacity-40 disabled:cursor-not-allowed",
    accent === "rosa" ? "border-rosa text-rosa" : "border-amarelo text-amarelo",
    fillsOnHover
      ? "hover:text-preto"
      : accent === "rosa"
        ? "hover:bg-rosa hover:text-preto"
        : "hover:bg-amarelo hover:text-preto",
    className
  );

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (fx !== "fill") return;
    const r = e.currentTarget.getBoundingClientRect();
    setPos({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  return (
    <button
      ref={ref}
      className={base}
      disabled={disabled}
      onMouseEnter={(e) => {
        setHover(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHover(false);
        onMouseLeave?.(e);
      }}
      onMouseMove={onMove}
      {...props}
    >
      {fx === "fill" && (
        <span
          aria-hidden
          className="absolute inset-0 -z-0 transition-transform duration-300"
          style={{
            background: accent === "rosa" ? "#ff00aa" : "#ffff00",
            clipPath: hover
              ? `circle(150% at ${pos.x}% ${pos.y}%)`
              : `circle(0% at ${pos.x}% ${pos.y}%)`,
          }}
        />
      )}
      <span className="relative z-10">
        {fx === "scramble" ? (
          <TextScramble as="span" trigger={hover} speed={0.02} duration={0.5}>
            {label}
          </TextScramble>
        ) : fx === "glitch" && hover ? (
          <GlitchText>{label}</GlitchText>
        ) : (
          label
        )}
      </span>
    </button>
  );
}
