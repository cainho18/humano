"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface Blob {
  color: string;
  size: string;
  x: string;
  y: string;
  dur: number;
}

const BLOBS: Blob[] = [
  { color: "#ff00aa", size: "70%", x: "10%", y: "12%", dur: 9 },
  { color: "#ffff00", size: "55%", x: "62%", y: "20%", dur: 11 },
  { color: "#ff00aa", size: "60%", x: "48%", y: "62%", dur: 10 },
  { color: "#ffff00", size: "45%", x: "18%", y: "70%", dur: 13 },
];

/**
 * Superfície "heatmap": manchas térmicas (rosa/amarelo) fluindo sobre preto,
 * borradas. Mantém a paleta estrita. Use atrás de um painel legível.
 */
export function HeatmapSurface({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-preto", className)}>
      <div className="absolute inset-0" style={{ filter: "blur(28px)" }}>
        {BLOBS.map((b, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: b.size,
              height: b.size,
              left: b.x,
              top: b.y,
              background: b.color,
              opacity: 0.55,
            }}
            animate={
              reduced
                ? undefined
                : {
                    x: ["0%", "18%", "-12%", "0%"],
                    y: ["0%", "-14%", "10%", "0%"],
                    scale: [1, 1.18, 0.9, 1],
                  }
            }
            transition={{
              duration: b.dur,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      {/* leve vinheta pra dar contraste ao painel */}
      <div className="absolute inset-0 bg-gradient-to-b from-preto/30 via-transparent to-preto/40" />
    </div>
  );
}
