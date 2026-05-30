/**
 * Parâmetros ajustáveis do cálculo (§10). Mexer aqui recalibra o diagnóstico
 * sem tocar na lógica. Tudo determinístico, JS/TS puro, roda offline.
 */

export type DimKey =
  | "D1"
  | "D2"
  | "D3"
  | "D4"
  | "D5"
  | "D6"
  | "D7"
  | "D8"
  | "D9"
  | "D10"
  | "D11"
  | "D12"
  | "D13";

export const DIM_ORDER: DimKey[] = [
  "D1",
  "D2",
  "D3",
  "D4",
  "D5",
  "D6",
  "D7",
  "D8",
  "D9",
  "D10",
  "D11",
  "D12",
  "D13",
];

/** peso das fontes na agregação por dimensão (§2). */
export const WEIGHT = { practice: 1.0, discourse: 0.6 } as const;

/** mapa default das alternativas de cenário → humanidade 0–100 (§1.1). */
export const SCENARIO_WEIGHTS: Record<"a" | "b" | "c" | "d", number> = {
  a: 10,
  b: 40,
  c: 75,
  d: 95,
};

/** likert 5 pontos → 0..100 (§1.4 e §1.7). */
export const LIKERT5 = [0, 25, 50, 75, 100] as const;

/** faixas do Qualificador Estrutural (§3). */
export const QE_BANDS = { green: 67, yellow: 34 } as const;

/** faixas de Coerência Discurso-Prática (§4). */
export const DP_BANDS = { coherent: 67, tension: 45 } as const;

/** gatilho da Regra de Compensação (§5). */
export const COMPENSATION = { d9: 70, sub94: 70, weightDelta: 0.25 } as const;

/** thresholds de gatilho de arquétipo (§6). */
export const TRIGGERS = {
  chama: { d2: 65, d13: 65, d10: 65, d6estMax: 45, d9: 60 },
  constelacao: { d2: 75, d10: 75, propriedadeMin: 50 },
} as const;

/** "Vermelho disfarçado": cultura aparente boa sobre estrutura extrativa (§3). */
export const DISFARCADO_DIM_MEAN = 55;

/** vetores-protótipo de 13 coordenadas, ordem DIM_ORDER (§6). */
export const PROTOTYPES: Record<string, number[]> = {
  Maquinário: [12, 10, 15, 12, 25, 12, 15, 40, 10, 15, 35, 15, 10],
  Ofício: [35, 45, 35, 40, 75, 50, 55, 65, 35, 45, 55, 55, 30],
  Família: [70, 45, 80, 35, 40, 70, 55, 45, 35, 40, 40, 50, 55],
  Vilarejo: [80, 60, 75, 65, 70, 78, 70, 65, 55, 55, 50, 75, 72],
  Constelação: [80, 90, 70, 70, 65, 68, 75, 70, 92, 90, 78, 75, 85],
  Organismo: [88, 85, 85, 80, 85, 88, 85, 82, 80, 82, 80, 85, 88],
};

/** os 6 protótipos usados na proximidade vetorial da Família 1 (§6, Família 1). */
export const VECTOR_FAMILY = [
  "Maquinário",
  "Ofício",
  "Família",
  "Vilarejo",
  "Constelação",
  "Organismo",
] as const;
