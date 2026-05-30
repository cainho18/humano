/**
 * 8 respostas-fixture (uma por arquétipo) — teste de regressão (§11).
 * Cada uma DEVE produzir o arquétipo esperado. Servem pra recalibrar
 * vetores/thresholds quando chegarem dados reais.
 */

import type { Answers, LikertIndex, ScenarioKey } from "../types";
import { emptyAnswers } from "../types";
import { SCENARIO_WEIGHTS } from "./config";

const SCEN_IDS = [
  "C1", "C2", "C3", "C4", "C5", "C7", "C8", "C9", "C10", "C11", "C13", "C14", "C15",
];
const BEH_IDS = ["B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11"];
const INV_BEH = new Set(["B6", "B7", "B10"]);
const STRUCT_N = [1,2,3,4,5,6,7,8,9,10,11];
const HUMAN_WORDS = ["cuidado","presenca","brincadeira","intuicao","autoria","vinculo"];
const MACHINE_WORDS = ["eficiencia","escala","controle","performance"];
const SHADOW_WORDS = ["competicao","medo"];

/** nível de humanidade 0–100 → alternativa de cenário mais próxima. */
function levelToScenario(level: number): ScenarioKey {
  let best: ScenarioKey = "a";
  let bestD = Infinity;
  (Object.keys(SCENARIO_WEIGHTS) as ScenarioKey[]).forEach((k) => {
    const d = Math.abs(SCENARIO_WEIGHTS[k] - level);
    if (d < bestD) {
      bestD = d;
      best = k;
    }
  });
  return best;
}
const levelToLikert = (level: number): LikertIndex =>
  Math.max(0, Math.min(4, Math.round(level / 25))) as LikertIndex;

interface BuildOpts {
  practice?: number;
  discourse?: number;
  /** distribuição de prioridade (soma 100) */
  priority?: Record<string, number>;
  /** palavras humanas vão pra "move" (default) ou "fala" (sinal de vitrine) */
  humanWordSlot?: "move" | "fala" | "nao";
  overrides?: (a: Answers) => void;
}

function build({
  practice = 50,
  discourse = practice,
  priority,
  humanWordSlot = "move",
  overrides,
}: BuildOpts): Answers {
  const a = emptyAnswers();

  SCEN_IDS.forEach((id) => (a.scenarios[id] = levelToScenario(practice)));
  for (let i = 1; i <= 8; i++) a.sliders[i] = 100 - discourse; // humanidade = discourse
  BEH_IDS.forEach((id) => {
    const target = INV_BEH.has(id) ? 100 - practice : practice;
    a.behaviors[id] = levelToLikert(target);
  });
  STRUCT_N.forEach((n) => (a.structural[`S${n}`] = levelToLikert(practice)));
  // termômetros: 1,3,5 humano à esquerda (discurso/sentir); 2,4 textura (prática)
  a.thermometers[1] = 100 - discourse;
  a.thermometers[3] = 100 - discourse;
  a.thermometers[5] = 100 - discourse;
  a.thermometers[2] = practice;
  a.thermometers[4] = practice;

  HUMAN_WORDS.forEach((w) => (a.words[w] = humanWordSlot));
  MACHINE_WORDS.forEach((w) => (a.words[w] = practice >= 50 ? "nao" : "move"));
  SHADOW_WORDS.forEach((w) => (a.words[w] = practice >= 50 ? "nao" : "move"));

  a.priority = priority ?? {
    eficiencia: 17,
    resultado: 17,
    cuidado: 17,
    autoria: 17,
    diversidade: 16,
    impacto: 16,
  };

  overrides?.(a);
  return a;
}

const profile = (nome: string) => ({
  nome,
  cargo: "fixture",
  pronome: null,
});

export interface Fixture {
  expected: string;
  answers: Answers;
}

export const FIXTURES: Record<string, Fixture> = {
  maquinario: {
    expected: "Maquinário",
    answers: build({
      practice: 12,
      discourse: 12,
      priority: {
        eficiencia: 45,
        resultado: 35,
        cuidado: 5,
        autoria: 5,
        diversidade: 5,
        impacto: 5,
      },
    }),
  },

  organismo: {
    expected: "Organismo",
    answers: build({
      practice: 90,
      discourse: 90,
      priority: {
        eficiencia: 10,
        resultado: 15,
        cuidado: 20,
        autoria: 20,
        diversidade: 20,
        impacto: 15,
      },
      overrides: (a) => {
        // integrado e equilibrado — NÃO é autogestão radical (compensação off)
        a.structural.S9 = 2;
        a.structural.S10 = 2;
        a.structural.S11 = 2;
        a.scenarios.C15 = "c";
        // termômetros sentir/intuição no polo humano (D13 alto, modo integrado)
        a.thermometers[1] = 15;
        a.thermometers[3] = 15;
      },
    }),
  },

  vilarejo: {
    expected: "Vilarejo",
    answers: build({
      practice: 70,
      discourse: 70,
      priority: {
        eficiencia: 15,
        resultado: 15,
        cuidado: 20,
        autoria: 15,
        diversidade: 15,
        impacto: 20,
      },
    }),
  },

  familia: {
    expected: "Família",
    answers: build({
      practice: 50,
      discourse: 55,
      priority: {
        eficiencia: 15,
        resultado: 15,
        cuidado: 35,
        autoria: 10,
        diversidade: 15,
        impacto: 10,
      },
      overrides: (a) => {
        // afeto/intimidade altos, autonomia baixa
        a.behaviors.B3 = 4;
        a.behaviors.B4 = 4;
        a.sliders[5] = 5; // Vínculo (humano)
        a.sliders[2] = 10; // Afeto (humano)
        a.scenarios.C3 = "d";
        a.words.cuidado = "move";
        a.words.vinculo = "move";
        // D9 baixo
        a.scenarios.C1 = "a";
        a.scenarios.C7 = "a";
        a.scenarios.C15 = "a";
        a.structural.S9 = 1;
        a.structural.S10 = 1;
        a.structural.S11 = 1;
      },
    }),
  },

  oficio: {
    expected: "Ofício",
    answers: build({
      practice: 50,
      discourse: 45,
      priority: {
        eficiencia: 25,
        resultado: 25,
        cuidado: 10,
        autoria: 15,
        diversidade: 10,
        impacto: 15,
      },
      overrides: (a) => {
        // honestidade/estrutura altas
        a.scenarios.C2 = "c";
        a.scenarios.C7 = "c";
        a.scenarios.C14 = "d";
        a.behaviors.B2 = 4;
        a.behaviors.B9 = 4;
        a.structural.S3 = 4;
        a.structural.S6 = 4;
        // D6 estrutural alto, afetabilidade baixa
        a.scenarios.C5 = "d";
        a.behaviors.B7 = 0; // inv → alto
        a.structural.S2 = 4;
        a.structural.S8 = 4;
        a.scenarios.C3 = "a";
        a.behaviors.B4 = 0;
        a.sliders[2] = 90; // Afeto baixo (máquina)
        a.words.cuidado = "nao";
      },
    }),
  },

  constelacao: {
    expected: "Constelação",
    answers: build({
      practice: 78,
      discourse: 78,
      priority: {
        eficiencia: 5,
        resultado: 10,
        cuidado: 15,
        autoria: 40,
        diversidade: 20,
        impacto: 10,
      },
      overrides: (a) => {
        // autogestão radical + autoria/experimentação altas + propriedade
        a.structural.S1 = 4; // propriedade coletiva
        a.structural.S9 = 4;
        a.structural.S10 = 4;
        a.structural.S11 = 4;
        a.scenarios.C15 = "d";
        a.scenarios.C1 = "c";
        a.scenarios.C7 = "c";
        a.scenarios.C8 = "d";
        a.behaviors.B5 = 4;
        a.behaviors.B9 = 4;
        a.behaviors.B10 = 0; // inv → alto
        a.sliders[6] = 5;
        a.sliders[7] = 5;
        a.thermometers[4] = 90; // experimentação
        a.thermometers[2] = 90;
      },
    }),
  },

  chama: {
    expected: "Chama",
    answers: build({
      practice: 60,
      discourse: 60,
      priority: {
        eficiencia: 5,
        resultado: 15,
        cuidado: 5,
        autoria: 40,
        diversidade: 15,
        impacto: 20,
      },
      overrides: (a) => {
        // D2, D10, D13 altos; D6-Estrutural baixo; D9≥60 mas sub-9.4 baixo
        a.scenarios.C1 = "d";
        a.behaviors.B5 = 4;
        a.sliders[6] = 5;
        a.sliders[7] = 5;
        a.scenarios.C8 = "d";
        a.behaviors.B9 = 4;
        a.thermometers[4] = 95;
        a.thermometers[1] = 5; // sentir (polo humano → D13 alto)
        a.thermometers[3] = 5;
        a.sliders[3] = 5; // intuição
        // D9 alto por iniciativa, sem propriedade nem autocompromisso estrutural
        a.scenarios.C7 = "d";
        a.scenarios.C15 = "c";
        a.behaviors.B10 = 0;
        a.structural.S5 = 4;
        a.thermometers[2] = 90;
        a.structural.S9 = 1;
        a.structural.S10 = 1;
        a.structural.S11 = 1;
        a.structural.S1 = 1; // sem propriedade coletiva
        // D6-Estrutural baixo (sem amortecedor)
        a.scenarios.C5 = "a";
        a.behaviors.B7 = 4; // inv → baixo
        a.structural.S2 = 1;
        a.structural.S8 = 1;
      },
    }),
  },

  vitrine: {
    expected: "Vitrine",
    answers: build({
      practice: 20,
      discourse: 90,
      humanWordSlot: "fala", // diz que move, mas não move
      priority: {
        eficiencia: 40,
        resultado: 35,
        cuidado: 8,
        autoria: 7,
        diversidade: 5,
        impacto: 5,
      },
    }),
  },
};

export const FIXTURE_SESSIONS = Object.fromEntries(
  Object.entries(FIXTURES).map(([k, f]) => [
    k,
    { perfil: profile(k), respostas: f.answers },
  ])
);
