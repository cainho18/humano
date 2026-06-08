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

type ShapeKind = "square" | "triangle";
interface Shape {
  kind: ShapeKind;
  size: number;
  x: string;
  y: string;
  rotate: number;
}

/** Quadrados e triângulos — MESMA natureza das bolas: arrastáveis, preenchidos
 *  na cor da paleta, espalhados ao redor (só não entram no metaball, pra
 *  manterem a forma). */
const DEFAULT_SHAPES: Shape[] = [
  { kind: "square", size: 64, x: "20%", y: "24%", rotate: 14 },
  { kind: "triangle", size: 76, x: "74%", y: "20%", rotate: -6 },
  { kind: "square", size: 50, x: "30%", y: "72%", rotate: -12 },
  { kind: "triangle", size: 60, x: "80%", y: "78%", rotate: 8 },
  { kind: "square", size: 40, x: "60%", y: "12%", rotate: 24 },
];

/**
 * Bolas arrastáveis que se fundem (metaball via filtro SVG) + quadrados e
 * triângulos arrastáveis (mesma cor/interação). Tudo ao redor do conteúdo.
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

      {/* círculos — metaball */}
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

      {/* quadrados e triângulos — arrastáveis, mesma cor (fora do metaball) */}
      <div className="absolute inset-0">
        {DEFAULT_SHAPES.map((s, i) => (
          <motion.div
            key={i}
            drag
            dragMomentum={false}
            whileDrag={{ scale: 1.15 }}
            whileHover={{ scale: 1.06 }}
            className="absolute cursor-grab touch-none active:cursor-grabbing"
            style={{
              left: s.x,
              top: s.y,
              width: s.size,
              height: s.size,
              rotate: s.rotate,
              background: color,
              clipPath:
                s.kind === "triangle"
                  ? "polygon(50% 0%, 100% 100%, 0% 100%)"
                  : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
}
