"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import { cn } from "@/lib/cn";

interface Blob {
  size: number;
  x: string;
  y: string;
}

interface GooeyDragProps {
  className?: string;
  /** cor das bolas (paleta) */
  color?: string;
  blobs?: Blob[];
}

/** Bolas dispostas ao redor das bordas (deixam o centro livre pro texto). */
const DEFAULT_BLOBS: Blob[] = [
  { size: 96, x: "7%", y: "14%" },
  { size: 70, x: "82%", y: "10%" },
  { size: 60, x: "46%", y: "5%" },
  { size: 84, x: "5%", y: "66%" },
  { size: 76, x: "85%", y: "68%" },
  { size: 58, x: "44%", y: "85%" },
];

type ShapeKind = "square" | "triangle" | "ring";
interface Shape {
  kind: ShapeKind;
  size: number;
  x: string;
  y: string;
  color: string;
  rotate: number;
  dur: number;
}

/** Elementos geométricos decorativos no fundo (quadrados, triângulos, anéis). */
const SHAPES: Shape[] = [
  { kind: "square", size: 46, x: "16%", y: "30%", color: "#ffff00", rotate: 12, dur: 9 },
  { kind: "triangle", size: 52, x: "72%", y: "28%", color: "#ff00aa", rotate: -8, dur: 11 },
  { kind: "ring", size: 40, x: "26%", y: "78%", color: "#f2f2f2", rotate: 0, dur: 8 },
  { kind: "square", size: 34, x: "88%", y: "82%", color: "#f2f2f2", rotate: 24, dur: 12 },
  { kind: "triangle", size: 38, x: "10%", y: "52%", color: "#ffff00", rotate: 16, dur: 10 },
  { kind: "ring", size: 56, x: "66%", y: "86%", color: "#ff00aa", rotate: 0, dur: 13 },
  { kind: "square", size: 26, x: "56%", y: "18%", color: "#ff00aa", rotate: -18, dur: 9.5 },
  { kind: "triangle", size: 30, x: "92%", y: "46%", color: "#f2f2f2", rotate: 6, dur: 10.5 },
];

/**
 * Bolas arrastáveis que se fundem (metaball via filtro SVG). Todas draggable;
 * ficam ao redor do conteúdo central.
 */
export function GooeyDrag({
  className,
  color = "#f2f2f2",
  blobs = DEFAULT_BLOBS,
}: GooeyDragProps) {
  const id = useId().replace(/:/g, "");
  const filterId = `goo-${id}`;

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      {/* elementos geométricos decorativos (quadrados, triângulos, anéis) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {SHAPES.map((s, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: s.x, top: s.y, width: s.size, height: s.size }}
            initial={{ rotate: s.rotate }}
            animate={{ y: [0, -14, 0], rotate: [s.rotate, s.rotate + 8, s.rotate] }}
            transition={{ duration: s.dur, repeat: Infinity, ease: "easeInOut" }}
          >
            {s.kind === "square" && (
              <div
                className="h-full w-full"
                style={{ border: `2px solid ${s.color}`, opacity: 0.28 }}
              />
            )}
            {s.kind === "ring" && (
              <div
                className="h-full w-full rounded-full"
                style={{ border: `2px solid ${s.color}`, opacity: 0.28 }}
              />
            )}
            {s.kind === "triangle" && (
              <div
                className="h-full w-full"
                style={{
                  background: s.color,
                  opacity: 0.22,
                  clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
                }}
              />
            )}
          </motion.div>
        ))}
      </div>

      <svg
        className="absolute h-0 w-0"
        aria-hidden
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div className="absolute inset-0" style={{ filter: `url(#${filterId})` }}>
        {blobs.map((b, i) => (
          <motion.div
            key={i}
            drag
            dragMomentum={false}
            whileDrag={{ scale: 1.15 }}
            whileHover={{ scale: 1.06 }}
            className="absolute cursor-grab touch-none rounded-full active:cursor-grabbing"
            style={{
              left: b.x,
              top: b.y,
              width: b.size,
              height: b.size,
              background: color,
            }}
          />
        ))}
      </div>
    </div>
  );
}
