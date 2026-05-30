import type { Answers } from "@/lib/types";

export interface CardDef {
  /** chave dentro de answers.cards */
  field: keyof Answers["cards"];
  prompt: string;
  sub?: string;
}

export const CARDS: Record<"comodo" | "fora_dentro" | "cena" | "nome_secreto", CardDef> = {
  comodo: {
    field: "comodo",
    prompt:
      "Se sua organização fosse um cômodo de uma casa — qual seria? E por quê?",
    sub: "Pode ser a cozinha quente, o porão esquecido, a sala de visita que ninguém vive... o que vier.",
  },
  fora_dentro: {
    field: "fora_dentro",
    prompt:
      "O que a sua organização cria — responde a uma pergunta que veio de fora, ou a uma pergunta que nasceu de dentro?",
  },
  cena: {
    field: "cena",
    prompt:
      "Conta uma cena recente — uma coisa que ACONTECEU — que descreve a sua organização melhor do que qualquer manifesto bonito.",
    sub: "Não precisa ser bonita. Precisa ser verdadeira.",
  },
  nome_secreto: {
    field: "nome_secreto",
    prompt:
      "Se sua organização tivesse um nome secreto — aquele que ninguém fala em voz alta mas todo mundo sabe — qual seria?",
  },
};
