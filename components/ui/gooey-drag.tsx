"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import { cn } from "@/lib/cn";

interface GooeyDragProps {
  className?: string;
  /** colors for the metaballs (palette only) */
  blobs?: { color: string; size: number; x: string; y: string }[];
}

const DEFAULT_BLOBS = [
  { color: "#ff00aa", size: 90, x: "20%", y: "30%" },
  { color: "#ffff00", size: 70, x: "55%", y: "55%" },
  { color: "#ff00aa", size: 60, x: "70%", y: "25%" },
  { color: "#ffff00", size: 50, x: "38%", y: "65%" },
];

/**
 * Draggable gooey blobs (metaball merge via SVG filter). Palette only.
 */
export function GooeyDrag({ className, blobs = DEFAULT_BLOBS }: GooeyDragProps) {
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

      <div
        className="absolute inset-0"
        style={{ filter: `url(#${filterId})` }}
      >
        {blobs.map((b, i) => (
          <motion.div
            key={i}
            drag
            dragMomentum={false}
            whileDrag={{ scale: 1.15 }}
            className="absolute cursor-grab rounded-full active:cursor-grabbing"
            style={{
              left: b.x,
              top: b.y,
              width: b.size,
              height: b.size,
              background: b.color,
            }}
          />
        ))}
      </div>
    </div>
  );
}
