/**
 * Pipeline de cálculo Humanware V2 (§0–§9). 100% determinístico, offline.
 * Ponto de entrada: scoreSession(session) → Diagnostic.
 *
 * Módulo ISOLADO: não importa nada do app além de lib/types. A UI consome o
 * resultado, mas o cálculo não depende da UI.
 */

import type { Answers, SessionData } from "../types";
import {
  COMPENSATION,
  DIM_ORDER,
  DimKey,
  DISFARCADO_DIM_MEAN,
  DP_BANDS,
  PROTOTYPES,
  QE_BANDS,
  TRIGGERS,
  VECTOR_FAMILY,
} from "./config";
import { computeDimensions, mean, wordGap } from "./dimensions";
import { buildNarrative } from "./narrative";

export type QeFaixa = "Verde" | "Amarelo" | "Vermelho";
export type DpFaixa = "Coerente" | "Em tensão" | "Vitrine";
export type Frequencia = "Humana" | "Máquina" | "em travessia";

export interface Diagnostic {
  arquetipo: {
    nome: string;
    modificador_qe: string;
    modo_d13: string;
    label_final: string;
  };
  vitrine: { ativo: boolean; mascara: string | null; operacao: string | null };
  frequencia: Frequencia;
  dimensoes: Record<DimKey, number>;
  d6_detalhe: { estrutural: number; afetabilidade: number };
  qe: { score: number; faixa: QeFaixa; disfarcado: boolean };
  coerencia_discurso_pratica: { score: number; faixa: DpFaixa };
  coerencia_interna: number;
  regra_compensacao_ativa: boolean;
  cordas_tensas: string[];
  cordas_afinadas: string[];
  cartas: Answers["cards"];
  alertas: string[];
}

const round = (n: number) => Math.round(n);
const dist = (a: number[], b: number[]) =>
  Math.sqrt(a.reduce((s, x, i) => s + (x - b[i]) ** 2, 0));
const stddev = (xs: number[]) => {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  return Math.sqrt(mean(xs.map((x) => (x - m) ** 2)));
};

function qeFaixa(score: number): QeFaixa {
  if (score >= QE_BANDS.green) return "Verde";
  if (score >= QE_BANDS.yellow) return "Amarelo";
  return "Vermelho";
}
function dpFaixa(score: number): DpFaixa {
  if (score >= DP_BANDS.coherent) return "Coerente";
  if (score >= DP_BANDS.tension) return "Em tensão";
  return "Vitrine";
}

const PRETTY: Record<string, string> = {
  D1: "as técnicas nativas humanas",
  D2: "a originalidade",
  D3: "a intimidade",
  D4: "a pluriversalidade",
  D5: "a honestidade",
  D6: "o cuidado",
  D7: "a dialogia",
  D8: "o impacto visível",
  D9: "o autocompromisso",
  D10: "a experimentação",
  D11: "a tecnologia companheira",
  D12: "a consciência sistêmica",
  D13: "o intencionamento",
  "D6-Estrutural": "o cuidado estrutural",
  "D6-Afetabilidade": "a afetabilidade",
};

export function scoreSession(session: SessionData): Diagnostic {
  const a = session.respostas;
  const base = computeDimensions(a);
  const dims = { ...base.dims };

  // ── Regra de Compensação (§5) ──────────────────────────────────
  const algumAutogestao = [9, 10, 11].some((n) => {
    const i = a.structural[`S${n}`];
    return i != null && i >= 3; // "Bastante" ou "Total"
  });
  const compensacao =
    dims.D9 >= COMPENSATION.d9 &&
    base.sub94 >= COMPENSATION.sub94 &&
    algumAutogestao;

  let d6est = base.d6.estrutural;
  let d6afet = base.d6.afetabilidade;
  if (compensacao) {
    d6est = Math.min(100, d6est * (1 + COMPENSATION.weightDelta));
    d6afet = Math.min(100, d6afet * (1 + COMPENSATION.weightDelta));
    dims.D6 = (d6est + d6afet) / 2;
  }

  // ── Coerência Discurso-Prática (§4) ────────────────────────────
  const dimGaps: number[] = [];
  DIM_ORDER.forEach((k) => {
    const p = base.practice[k];
    const d = base.discourse[k];
    if (p.length > 0 && d.length > 0) {
      dimGaps.push(Math.abs(mean(d) - mean(p)));
    }
  });
  const gapPalavras = wordGap(a);
  const gapTotal = mean(dimGaps) * 0.6 + gapPalavras * 0.4;
  const dpScore = 100 - gapTotal;
  const dp = dpFaixa(dpScore);

  // ── QE (§3) + salvaguardas ─────────────────────────────────────
  const dimMean = mean(DIM_ORDER.map((k) => dims[k]));
  let qeBand = qeFaixa(base.qeScore);
  // §3.1 autonomia radical sem propriedade coletiva não vira Verde
  if (compensacao && base.propriedade < 50 && qeBand === "Verde") {
    qeBand = "Amarelo";
  }
  const disfarcado = qeBand === "Vermelho" && dimMean >= DISFARCADO_DIM_MEAN;

  // ── Modo D13 (§7.2) ────────────────────────────────────────────
  const t1 = a.thermometers[1];
  const t3 = a.thermometers[3];
  const s3 = a.sliders[3];
  const sensivelParts = [
    t1 != null ? 100 - t1 : undefined,
    t3 != null ? 100 - t3 : undefined,
    s3 != null ? 100 - s3 : undefined,
  ].filter((x): x is number => x != null);
  const sensivel = mean(sensivelParts);
  const racional = 100 - sensivel;
  let modoD13: string;
  if (Math.abs(sensivel - racional) < 20) modoD13 = "Integrado";
  else if (sensivel > racional) modoD13 = "Coração";
  else modoD13 = "Mente";

  // ── vetor da organização ───────────────────────────────────────
  const orgVec = DIM_ORDER.map((k) => dims[k]);
  const nearest = (protos: readonly string[]) =>
    protos
      .map((name) => ({ name, d: dist(orgVec, PROTOTYPES[name]) }))
      .sort((x, y) => x.d - y.d)[0];

  // ── Detecção de arquétipo (§6, em ordem) ───────────────────────
  let arquetipo: string;
  let vitrine: Diagnostic["vitrine"] = {
    ativo: false,
    mascara: null,
    operacao: null,
  };

  if (dp === "Vitrine") {
    // Família 2 — Vitrine prevalece
    const discourseVec = DIM_ORDER.map((k) =>
      base.discourse[k].length ? mean(base.discourse[k]) : dims[k]
    );
    const practiceVec = DIM_ORDER.map((k) =>
      base.practice[k].length ? mean(base.practice[k]) : dims[k]
    );
    const mascara = VECTOR_FAMILY.map((name) => ({
      name,
      d: dist(discourseVec, PROTOTYPES[name]),
    })).sort((x, y) => x.d - y.d)[0].name;
    const operacao = VECTOR_FAMILY.map((name) => ({
      name,
      d: dist(practiceVec, PROTOTYPES[name]),
    })).sort((x, y) => x.d - y.d)[0].name;
    arquetipo = "Vitrine";
    vitrine = { ativo: true, mascara, operacao };
  } else {
    // Família 3 — gatilhos (Chama / Constelação)
    const c = TRIGGERS.chama;
    const chamaT7 = dims.D9 >= c.d9 && d6est < c.d6estMax;
    const chamaTrigger =
      dims.D2 >= c.d2 &&
      dims.D13 >= c.d13 &&
      dims.D10 >= c.d10 &&
      d6est < c.d6estMax &&
      chamaT7;
    const k = TRIGGERS.constelacao;
    const constelacaoTrigger =
      compensacao && dims.D2 >= k.d2 && dims.D10 >= k.d10;

    if (chamaTrigger || constelacaoTrigger) {
      if (chamaTrigger && constelacaoTrigger) {
        arquetipo =
          base.propriedade >= k.propriedadeMin ? "Constelação" : "Chama";
      } else {
        arquetipo = constelacaoTrigger ? "Constelação" : "Chama";
      }
    } else {
      // Família 1 — proximidade vetorial
      const top = nearest(VECTOR_FAMILY);
      arquetipo = top.name;
      // §6.4 desempate Ofício vs Família
      const second = VECTOR_FAMILY.map((name) => ({
        name,
        d: dist(orgVec, PROTOTYPES[name]),
      }))
        .sort((x, y) => x.d - y.d)
        .slice(0, 2)
        .map((o) => o.name);
      if (second.includes("Ofício") && second.includes("Família")) {
        if (d6est > d6afet + 15) arquetipo = "Ofício";
        else if (d6afet > d6est + 15) arquetipo = "Família";
      }
    }
  }

  // ── Modificadores (§7.1) ───────────────────────────────────────
  let modificadorQe = "";
  if (qeBand === "Amarelo") modificadorQe = "em tensão";
  else if (qeBand === "Vermelho")
    modificadorQe = disfarcado ? "Disfarçado" : "em risco";

  const modoSuffix = modoD13 === "Integrado" ? "Integrada" : `de ${modoD13}`;
  const labelFinal = [arquetipo, modificadorQe, modoSuffix]
    .filter(Boolean)
    .join(", ");

  // ── Meta-indicadores (§8) ──────────────────────────────────────
  const internalDevs = DIM_ORDER.map((k) =>
    stddev([...base.practice[k], ...base.discourse[k]])
  ).filter((x) => x > 0);
  const coerenciaInterna = Math.max(0, 100 - mean(internalDevs));

  const freq = mean([dims.D1, dims.D2, dims.D3, dims.D6, dims.D13]);
  const frequencia: Frequencia =
    freq >= 65 ? "Humana" : freq < 40 ? "Máquina" : "em travessia";

  // ── Cordas tensas / afinadas (§9.1) ────────────────────────────
  const scored: { key: string; v: number }[] = DIM_ORDER.filter(
    (k) => k !== "D6"
  ).map((k) => ({ key: k, v: dims[k] }));
  // D6 entra pelos sub-eixos quando divergem muito
  if (Math.abs(d6est - d6afet) > 20) {
    scored.push({ key: "D6-Estrutural", v: d6est });
    scored.push({ key: "D6-Afetabilidade", v: d6afet });
  } else {
    scored.push({ key: "D6", v: dims.D6 });
  }
  const asc = [...scored].sort((x, y) => x.v - y.v);
  const cordasTensas = asc.slice(0, 3).map((s) => s.key);
  const cordasAfinadas = asc.slice(-3).reverse().map((s) => s.key);

  const alertas: string[] = [];
  if (coerenciaInterna < 40)
    alertas.push("leitura com cautela — respostas inconsistentes");

  const dimsRounded = {} as Record<DimKey, number>;
  DIM_ORDER.forEach((k) => (dimsRounded[k] = round(dims[k])));

  return {
    arquetipo: {
      nome: arquetipo,
      modificador_qe: modificadorQe,
      modo_d13: modoSuffix,
      label_final: labelFinal,
    },
    vitrine,
    frequencia,
    dimensoes: dimsRounded,
    d6_detalhe: { estrutural: round(d6est), afetabilidade: round(d6afet) },
    qe: { score: round(base.qeScore), faixa: qeBand, disfarcado },
    coerencia_discurso_pratica: { score: round(dpScore), faixa: dp },
    coerencia_interna: round(coerenciaInterna),
    regra_compensacao_ativa: compensacao,
    cordas_tensas: cordasTensas,
    cordas_afinadas: cordasAfinadas,
    cartas: a.cards,
    alertas,
  };
}

/** narrativa-âncora determinística (§9.2). */
export function diagnosticNarrative(d: Diagnostic): string {
  const afinada = PRETTY[d.cordas_afinadas[0]] ?? d.cordas_afinadas[0];
  const tensa = PRETTY[d.cordas_tensas[0]] ?? d.cordas_tensas[0];
  if (d.vitrine.ativo) {
    return `Vocês se imaginam ${d.vitrine.mascara}, mas operam ${d.vitrine.operacao}. O que mais sustenta vocês é ${afinada}. Onde mais aperta é ${tensa}.`;
  }
  return buildNarrative(d.arquetipo.nome, d.frequencia, afinada, tensa);
}

export type { DimKey } from "./config";
