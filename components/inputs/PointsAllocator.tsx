"use client";

import { PRIORITY_CATEGORIES, PRIORITY_TOTAL } from "@/lib/content/priority";
import { cn } from "@/lib/cn";

interface PointsAllocatorProps {
  values: Record<string, number>;
  onChange: (id: string, value: number) => void;
}

/** Distribui 100 pontos entre as 6 categorias. O cobertor é curto (§T3). */
export function PointsAllocator({ values, onChange }: PointsAllocatorProps) {
  const used = PRIORITY_CATEGORIES.reduce(
    (sum, c) => sum + (values[c.id] ?? 0),
    0
  );
  const remaining = PRIORITY_TOTAL - used;

  return (
    <div className="flex flex-col gap-6">
      <div className="sticky top-16 z-10 -mx-2 flex items-baseline justify-between bg-preto/85 px-2 pb-3 pt-1 backdrop-blur-sm">
        <span className="hw-kicker text-claro/55">pontos restantes</span>
        <span className="flex items-baseline gap-2">
          <span
            className={cn(
              "hw-title font-bold tabular-nums transition-colors",
              remaining === 0 ? "text-rosa" : "text-amarelo"
            )}
            style={{ fontSize: "var(--text-h2)" }}
          >
            {remaining}
          </span>
          <span className="hw-kicker text-claro/30">/ {PRIORITY_TOTAL}</span>
        </span>
      </div>
      <div className="hw-rule -mt-2" />

      <div className="flex flex-col gap-6">
        {PRIORITY_CATEGORIES.map((c) => {
          const val = values[c.id] ?? 0;
          const max = val + remaining;
          return (
            <div key={c.id} className="flex flex-col gap-2.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-sm leading-snug text-claro/85">
                  {c.label}
                </span>
                <span
                  className={cn(
                    "w-12 shrink-0 text-right font-display text-2xl font-bold tabular-nums transition-colors",
                    val > 0 ? "text-claro" : "text-claro/25"
                  )}
                >
                  {val}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={val}
                onChange={(e) =>
                  onChange(c.id, Math.min(Number(e.target.value), max))
                }
                className="hw-range h-1 w-full cursor-pointer appearance-none bg-claro/20"
                style={{
                  background: `linear-gradient(to right, #ff00aa 0%, #ff00aa ${val}%, rgba(242,242,242,0.2) ${val}%, rgba(242,242,242,0.2) 100%)`,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
