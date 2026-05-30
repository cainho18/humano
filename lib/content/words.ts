export type WordType = "humana" | "maquina" | "sombra";

export interface WordDef {
  id: string;
  label: string;
  type: WordType;
  /** dimensão associada (para cálculo) */
  dim?: string;
}

export const WORDS: WordDef[] = [
  { id: "cuidado", label: "Cuidado", type: "humana", dim: "D6" },
  { id: "presenca", label: "Presença", type: "humana", dim: "D1" },
  { id: "brincadeira", label: "Brincadeira", type: "humana", dim: "D1" },
  { id: "intuicao", label: "Intuição", type: "humana", dim: "D13" },
  { id: "autoria", label: "Autoria", type: "humana", dim: "D2" },
  { id: "vinculo", label: "Vínculo", type: "humana", dim: "D3" },
  { id: "eficiencia", label: "Eficiência", type: "maquina", dim: "D6" },
  { id: "escala", label: "Escala", type: "maquina", dim: "D6" },
  { id: "controle", label: "Controle", type: "maquina", dim: "D9" },
  { id: "performance", label: "Performance", type: "maquina", dim: "D8" },
  { id: "competicao", label: "Competição", type: "sombra", dim: "D3" },
  { id: "medo", label: "Medo", type: "sombra", dim: "D1" },
];

export const WORD_SLOTS = [
  { id: "move", label: "O que move de verdade" },
  { id: "fala", label: "O que a gente fala que move" },
  { id: "nao", label: "O que não tem vez aqui" },
] as const;
