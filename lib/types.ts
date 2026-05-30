/** Shared answer model — consumed by the UI and by lib/scoring. */

export type Pronoun = "ele" | "ela" | "outro" | "prefiro_nao_dizer";

export interface Profile {
  nome: string;
  cargo: string;
  pronome: Pronoun | null;
}

export type ScenarioKey = "a" | "b" | "c" | "d";

/** Likert stored as raw index 0..4 (scoring maps to 0..100). */
export type LikertIndex = 0 | 1 | 2 | 3 | 4;

/** Word allocation quadrants. */
export type WordSlot = "move" | "fala" | "nao";

export interface Answers {
  /** C1..C15 → chosen alternative */
  scenarios: Record<string, ScenarioKey>;
  /** slider 1..8 → 0 (humano) .. 100 (máquina) */
  sliders: Record<number, number>;
  /** P-R2 categories → 0..100 points (sum 100) */
  priority: Record<string, number>;
  /** B1..B11 → likert index 0..4 */
  behaviors: Record<string, LikertIndex>;
  /** termômetro 1..5 → 0 (esquerda) .. 100 (direita) */
  thermometers: Record<number, number>;
  /** word id → quadrant (unassigned = absent) */
  words: Record<string, WordSlot>;
  /** S1..S11 → likert index 0..4 (Nada..Total) */
  structural: Record<string, LikertIndex>;
  /** free-text cards (qualitative, not scored) */
  cards: {
    comodo: string;
    fora_dentro: string;
    cena: string;
    nome_secreto: string;
  };
}

export interface SessionData {
  perfil: Profile;
  respostas: Answers;
}

export function emptyAnswers(): Answers {
  return {
    scenarios: {},
    sliders: {},
    priority: {},
    behaviors: {},
    thermometers: {},
    words: {},
    structural: {},
    cards: { comodo: "", fora_dentro: "", cena: "", nome_secreto: "" },
  };
}
