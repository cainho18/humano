"use client";

import type { TechVM } from "../adapter";

const SHORT: Record<string, string> = {
  consciencia: "Consciência",
  dialogo: "Diálogo",
  vinculo: "Vínculo",
  cuidado: "Cuidado",
  originalidade: "Originalidade",
  autogestao: "Autogestão",
};

/** Radar hexagonal das 6 tecnologias. "O CAMPO" no centro. */
export function RadarHex({ techs }: { techs: TechVM[] }) {
  const cx = 230;
  const cy = 232;
  const R = 148;
  const n = 6;
  const ang = (i: number) => ((-90 + i * 60) * Math.PI) / 180;
  const pt = (i: number, r: number): [number, number] => [
    cx + r * Math.cos(ang(i)),
    cy + r * Math.sin(ang(i)),
  ];

  const rings = [0.25, 0.5, 0.75, 1].map((f) =>
    [...Array(n)]
      .map((_, i) => pt(i, R * f).map((v) => v.toFixed(1)).join(","))
      .join(" ")
  );
  const spokes = [...Array(n)].map((_, i) => pt(i, R));
  const dataPts = techs
    .map((t, i) => pt(i, (R * t.nivel) / 100).map((v) => v.toFixed(1)).join(","))
    .join(" ");

  return (
    <svg
      viewBox="0 0 460 460"
      className="h-auto w-full max-w-[440px]"
      role="img"
      aria-label="Radar das seis tecnologias da organização"
    >
      {rings.map((p, i) => (
        <polygon
          key={i}
          points={p}
          fill="none"
          stroke="rgba(242,242,242,0.10)"
          strokeWidth={1}
        />
      ))}
      {spokes.map(([x, y], i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={x.toFixed(1)}
          y2={y.toFixed(1)}
          stroke="rgba(242,242,242,0.10)"
          strokeWidth={1}
        />
      ))}

      <polygon
        className="fnl-radar-poly"
        points={dataPts}
        fill="rgba(255,0,170,0.22)"
        stroke="#FF00AA"
        strokeWidth={2.5}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {techs.map((t, i) => {
        const [vx, vy] = pt(i, (R * t.nivel) / 100);
        const [lx, ly] = pt(i, R + 30);
        const anchor = i === 0 || i === 3 ? "middle" : lx > cx ? "start" : "end";
        return (
          <g key={t.chave}>
            <circle
              className="fnl-radar-dot"
              cx={vx.toFixed(1)}
              cy={vy.toFixed(1)}
              r={5}
              fill="#FFFF00"
            />
            <text
              x={lx.toFixed(1)}
              y={(ly - 1).toFixed(1)}
              textAnchor={anchor}
              fontFamily="var(--font-mono)"
              fontSize={11.5}
              fill="#F2F2F2"
            >
              {SHORT[t.chave] ?? t.nome}
            </text>
            <text
              x={lx.toFixed(1)}
              y={(ly + 13).toFixed(1)}
              textAnchor={anchor}
              fontFamily="var(--font-mono)"
              fontSize={11.5}
              fill="#FF00AA"
              fontWeight={700}
            >
              {t.nivel}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
