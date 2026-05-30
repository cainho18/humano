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
      <div className="flex items-baseline justify-between border-b-2 border-claro/20 pb-3">
        <span className="font-mono text-xs uppercase tracking-widest text-claro/60">
          pontos restantes
        </span>
        <span
          className={cn(
            "font-mono text-3xl font-bold tabular-nums",
            remaining === 0 ? "text-rosa" : "text-amarelo"
          )}
        >
          {remaining}
        </span>
      </div>

      <div className="flex flex-col gap-5">
        {PRIORITY_CATEGORIES.map((c) => {
          const val = values[c.id] ?? 0;
          const max = val + remaining;
          return (
            <div key={c.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-sm leading-snug text-claro/85">
                  {c.label}
                </span>
                <span className="w-10 shrink-0 text-right font-mono text-lg font-bold tabular-nums text-claro">
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
