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
