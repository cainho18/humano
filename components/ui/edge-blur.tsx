"use client";

/**
 * Edge blur (topo + base) — camadas empilhadas de backdrop-blur com máscara
 * em linear-gradient, criando um fade progressivo e suave nas bordas do
 * viewport. Puramente decorativo: fixo, pointer-events-none, oculto no print.
 *
 * Cada camada tem um blur maior e uma máscara mais curta → perto da borda
 * todas as camadas somam (blur forte); para dentro só as suaves permanecem.
 */
const LAYERS = [
  { blur: 0.5, reach: 100 },
  { blur: 1, reach: 74 },
  { blur: 2, reach: 50 },
  { blur: 4, reach: 28 },
];

function EdgeStack({ edge, height }: { edge: "top" | "bottom"; height: number }) {
  const dir = edge === "top" ? "to bottom" : "to top";
  return (
    <div
      className="pointer-events-none absolute inset-x-0"
      style={{ [edge]: 0, height } as React.CSSProperties}
      aria-hidden
    >
      {LAYERS.map((l, i) => {
        const mask = `linear-gradient(${dir}, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${
          l.reach * 0.45
        }%, rgba(0,0,0,0) ${l.reach}%)`;
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${l.blur}px)`,
              WebkitBackdropFilter: `blur(${l.blur}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}
    </div>
  );
}

export function EdgeBlur() {
  return (
    <div className="hw-edge-blur pointer-events-none fixed inset-0 z-30" aria-hidden>
      <EdgeStack edge="top" height={104} />
      <EdgeStack edge="bottom" height={128} />
    </div>
  );
}
