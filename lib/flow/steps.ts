/** Ordem canônica das telas (§2 do briefing). */

export type TransitionEffect =
  | "perspective"
  | "trembling"
  | "nokia"
  | "glitch"
  | "gooey"
  | "proximity";

export type BlockId =
  | "scenarios"
  | "sliders"
  | "priority"
  | "behaviors"
  | "thermometers"
  | "words"
  | "structural";

export type CardField = "comodo" | "fora_dentro" | "cena" | "nome_secreto";

export type Step =
  | { kind: "counter" }
  | { kind: "portal" }
  | { kind: "welcome" }
  | { kind: "profile" }
  | { kind: "agreement" }
  | { kind: "transition"; transitionId: string; effect: TransitionEffect }
  | { kind: "block"; block: BlockId }
  | { kind: "card"; field: CardField }
  | { kind: "final" };

export const STEPS: Step[] = [
  { kind: "counter" },
  { kind: "portal" },
  { kind: "welcome" },
  { kind: "profile" },
  { kind: "agreement" },

  { kind: "transition", transitionId: "T1", effect: "perspective" },
  { kind: "block", block: "scenarios" },
  { kind: "card", field: "comodo" },

  { kind: "transition", transitionId: "T2", effect: "trembling" },
  { kind: "block", block: "sliders" },

  { kind: "transition", transitionId: "T3", effect: "nokia" },
  { kind: "block", block: "priority" },

  { kind: "transition", transitionId: "T4", effect: "glitch" },
  { kind: "block", block: "behaviors" },

  { kind: "transition", transitionId: "T5", effect: "gooey" },
  { kind: "block", block: "thermometers" },
  { kind: "card", field: "fora_dentro" },

  { kind: "transition", transitionId: "T6", effect: "proximity" },
  { kind: "block", block: "words" },

  { kind: "transition", transitionId: "T7", effect: "perspective" },
  { kind: "block", block: "structural" },
  { kind: "card", field: "cena" },
  { kind: "card", field: "nome_secreto" },

  { kind: "final" },
];

/** Steps that count toward the (discreet) progress bar — question content. */
export const FIRST_PROGRESS_INDEX = STEPS.findIndex(
  (s) => s.kind === "transition"
);
export const LAST_PROGRESS_INDEX = STEPS.findIndex((s) => s.kind === "final");
