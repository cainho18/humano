/**
 * Normalização (§1) e agregação por dimensão (§2), incluindo D6 duplo eixo e
 * D9 sub-9.4. Fontes ausentes são puladas (média só com presentes).
 */

import type { Answers } from "../types";
import { DimKey, LIKERT5, SCENARIO_WEIGHTS, WEIGHT } from "./config";

// ── acessores normalizados (0–100, "humanidade" no item) ─────────────
const num = (v: number | undefined): number | undefined =>
  v == null || Number.isNaN(v) ? undefined : v;

function scen(a: Answers, id: string): number | undefined {
  const k = a.scenarios[id];
  return k ? SCENARIO_WEIGHTS[k] : undefined;
}
/** slider bruto 0=humano..100=máquina → humanidade = 100 - valor. */
function sliderHum(a: Answers, id: number): number | undefined {
  const v = a.sliders[id];
  return v == null ? undefined : 100 - v;
}
function prio(a: Answers, cat: string): number | undefined {
  return num(a.priority[cat]);
}
function beh(a: Answers, id: string, inverted = false): number | undefined {
  const i = a.behaviors[id];
  if (i == null) return undefined;
  const v = LIKERT5[i];
  return inverted ? 100 - v : v;
}
function struct(a: Answers, n: number): number | undefined {
  const i = a.structural[`S${n}`];
  return i == null ? undefined : LIKERT5[i];
}
/** termômetro: esquerda = humano/sensível → humanidade = 100 - valor. */
function thermHum(a: Answers, id: number): number | undefined {
  const v = a.thermometers[id];
  return v == null ? undefined : 100 - v;
}
function thermRaw(a: Answers, id: number): number | undefined {
  return num(a.thermometers[id]);
}
/** palavra humana: "move"→100, "não tem vez"→0, "fala"→pula (vira gap). */
function wordPractice(a: Answers, id: string): number | undefined {
  const slot = a.words[id];
  if (slot === "move") return 100;
  if (slot === "nao") return 0;
  return undefined;
}

const defined = (xs: (number | undefined)[]): number[] =>
  xs.filter((x): x is number => x != null);

const mean = (xs: number[]): number =>
  xs.length === 0 ? 0 : xs.reduce((s, x) => s + x, 0) / xs.length;

/** média ponderada prática(1.0) × discurso(0.6), só com fontes presentes. */
function weighted(practice: number[], discourse: number[]): number {
  const num =
    practice.reduce((s, x) => s + x * WEIGHT.practice, 0) +
    discourse.reduce((s, x) => s + x * WEIGHT.discourse, 0);
  const den =
    practice.length * WEIGHT.practice + discourse.length * WEIGHT.discourse;
  return den === 0 ? 0 : num / den;
}

export interface DimensionResult {
  dims: Record<DimKey, number>;
  /** fontes por dimensão (para coerência interna e D-P) */
  practice: Record<DimKey, number[]>;
  discourse: Record<DimKey, number[]>;
  d6: { estrutural: number; afetabilidade: number };
  sub94: number;
  qeScore: number;
  propriedade: number; // Bloco5#1 (S1)
}

export function computeDimensions(a: Answers): DimensionResult {
  // D6 duplo eixo (§2.1)
  const d6est = defined([
    scen(a, "C5"),
    beh(a, "B7", true),
    struct(a, 2),
    struct(a, 8),
    prio(a, "cuidado"),
  ]);
  const d6afet = defined([
    scen(a, "C3"),
    beh(a, "B4"),
    sliderHum(a, 2),
    wordPractice(a, "cuidado"),
  ]);
  const d6estScore = mean(d6est);
  const d6afetScore = mean(d6afet);

  // D9 sub-9.4 (§2.2)
  const sub94vals = defined([
    struct(a, 9),
    struct(a, 10),
    struct(a, 11),
    a.scenarios["C15"] === "d" ? 95 : undefined,
  ]);
  const sub94 = mean(sub94vals);

  const P: Record<DimKey, number[]> = {
    D1: defined([
      scen(a, "C3"),
      scen(a, "C11"),
      beh(a, "B3"),
      beh(a, "B6", true),
      beh(a, "B11"),
      wordPractice(a, "presenca"),
      wordPractice(a, "brincadeira"),
    ]),
    D2: defined([
      scen(a, "C1"),
      beh(a, "B5"),
      struct(a, 4),
      wordPractice(a, "autoria"),
      prio(a, "autoria"),
    ]),
    D3: defined([beh(a, "B3"), beh(a, "B4"), wordPractice(a, "vinculo")]),
    D4: defined([scen(a, "C4"), scen(a, "C13"), prio(a, "diversidade")]),
    D5: defined([
      scen(a, "C2"),
      scen(a, "C7"),
      scen(a, "C14"),
      beh(a, "B2"),
      beh(a, "B9"),
      struct(a, 3),
      struct(a, 6),
    ]),
    D6: [], // calculado à parte (média dos sub-eixos)
    D7: defined([
      scen(a, "C2"),
      beh(a, "B1"),
      beh(a, "B2"),
      beh(a, "B6", true),
      struct(a, 5),
    ]),
    D8: defined([
      scen(a, "C10"),
      beh(a, "B8"),
      prio(a, "resultado"),
      prio(a, "impacto"),
    ]),
    D9: defined([
      scen(a, "C1"),
      scen(a, "C7"),
      scen(a, "C15"),
      beh(a, "B5"),
      beh(a, "B10", true),
      struct(a, 5),
      struct(a, 9),
      struct(a, 10),
      struct(a, 11),
      thermRaw(a, 2),
    ]),
    D10: defined([
      scen(a, "C8"),
      beh(a, "B9"),
      prio(a, "autoria"),
      thermRaw(a, 4),
    ]),
    D11: defined([
      scen(a, "C9"),
      beh(a, "B10", true),
      struct(a, 6),
      struct(a, 7),
    ]),
    D12: defined([scen(a, "C10"), beh(a, "B8"), prio(a, "impacto")]),
    D13: defined([thermHum(a, 1), thermHum(a, 3)]),
  };

  const D: Record<DimKey, number[]> = {
    D1: defined([sliderHum(a, 1), sliderHum(a, 4)]),
    D2: defined([sliderHum(a, 6), sliderHum(a, 7), thermHum(a, 5)]),
    D3: defined([sliderHum(a, 5)]),
    D4: defined([sliderHum(a, 7)]),
    D5: [],
    D6: defined([sliderHum(a, 2), sliderHum(a, 5)]),
    D7: defined([sliderHum(a, 8)]),
    D8: defined([sliderHum(a, 6)]),
    D9: defined([sliderHum(a, 8)]),
    D10: [],
    D11: [],
    D12: [],
    D13: defined([sliderHum(a, 3)]),
  };

  const dims = {} as Record<DimKey, number>;
  (Object.keys(P) as DimKey[]).forEach((k) => {
    dims[k] = weighted(P[k], D[k]);
  });
  // D6 = média dos dois sub-eixos (§2.1)
  dims.D6 = (d6estScore + d6afetScore) / 2;

  // D9 gradação cumulativa (§2.2)
  const base913 = mean(
    defined([scen(a, "C1"), scen(a, "C7"), scen(a, "C15"), beh(a, "B5")])
  );
  if (sub94 > 70 && base913 < 50) {
    dims.D9 = base913 * 0.7 + sub94 * 0.3;
  }

  // QE_score (§3): propriedade, pagamento, autoria + sinal de C5
  const qeScore = mean(
    defined([struct(a, 1), struct(a, 2), struct(a, 4), scen(a, "C5")])
  );

  return {
    dims,
    practice: P,
    discourse: D,
    d6: { estrutural: d6estScore, afetabilidade: d6afetScore },
    sub94,
    qeScore,
    propriedade: struct(a, 1) ?? 0,
  };
}

export { mean };

/** sinais da alocação de palavras p/ a coerência discurso-prática (§4). */
const HUMAN_WORDS = [
  "cuidado",
  "presenca",
  "brincadeira",
  "intuicao",
  "autoria",
  "vinculo",
];

export function wordGap(a: Answers): number {
  const present = HUMAN_WORDS.filter((id) => a.words[id]);
  if (present.length === 0) return 0;
  const inFala = present.filter((id) => a.words[id] === "fala").length;
  return (inFala / present.length) * 100;
}
