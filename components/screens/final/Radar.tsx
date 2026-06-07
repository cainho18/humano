"use client";

import type { Vetor } from "@/lib/scoring/humanware";

const CX = 170;
const CY = 165;
const R = 120;
const N = 6;

function pointAt(i: number, radius: number): [number, number] {
  const ang = (-90 + (360 / N) * i) * (Math.PI / 180);
  return [CX + radius * Math.cos(ang), CY + radius * Math.sin(ang)];
}

/**
 * Hexágono dos 6 vetores. Estado FINAL por padrão (reduced-motion mostra cheio);
 * o GSAP anima `.hw-radar-poly` (scale do centro) e `.hw-radar-axis` (draw).
 */
export function Radar({ techs }: { techs: Vetor[] }) {
  const grid = [0.25, 0.5, 0.75, 1].map((f) =>
    Array.from({ length: N }, (_, i) => pointAt(i, R * f).join(","))
      .join(" ")
  );

  const valuePts = techs
    .map((t, i) => pointAt(i, (R * Math.max(6, t.nivel)) / 100).join(","))
    .join(" ");

  return (
    <svg
      viewBox="0 0 340 360"
      className="h-full w-full"
      role="img"
      aria-label="Hexágono das seis tecnologias nativas"
    >
      {/* grades */}
      {grid.map((pts, i) => (
        <polygon
          key={i}
          points={pts}
          fill="none"
          stroke="#f2f2f2"
          strokeOpacity={0.12}
          strokeWidth={1}
        />
      ))}
      {/* eixos */}
      {techs.map((_, i) => {
        const [x, y] = pointAt(i, R);
        return (
          <line
            key={i}
            className="hw-radar-axis"
            x1={CX}
            y1={CY}
            x2={x}
            y2={y}
            stroke="#f2f2f2"
            strokeOpacity={0.18}
            strokeWidth={1}
          />
        );
      })}
      {/* polígono de valor */}
      <polygon
        className="hw-radar-poly"
        points={valuePts}
        fill="#ff00aa"
        fillOpacity={0.18}
        stroke="#ff00aa"
        strokeWidth={2}
        style={{ transformOrigin: `${CX}px ${CY}px` }}
      />
      {/* vértices + rótulos */}
      {techs.map((t, i) => {
        const [vx, vy] = pointAt(i, (R * Math.max(6, t.nivel)) / 100);
        const [lx, ly] = pointAt(i, R + 26);
        const anchor =
          Math.abs(lx - CX) < 10 ? "middle" : lx < CX ? "end" : "start";
        return (
          <g key={t.chave}>
            <circle
              className="hw-radar-dot"
              cx={vx}
              cy={vy}
              r={4}
              fill={t.estado === "Ausente" ? "#f2f2f2" : "#ffff00"}
            />
            <text
              x={lx}
              y={ly}
              textAnchor={anchor}
              dominantBaseline="middle"
              fill="#f2f2f2"
              fillOpacity={0.85}
              className="font-mono"
              fontSize={11}
            >
              {t.nome}
            </text>
            <text
              x={lx}
              y={ly + 13}
              textAnchor={anchor}
              dominantBaseline="middle"
              fill="#ff00aa"
              className="font-mono"
              fontSize={10}
            >
              {t.nivel}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
