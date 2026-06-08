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
      "Quando a sua organização cria algo novo, de onde costuma vir o empurrão: de uma demanda de FORA (o mercado pediu, o cliente cobrou, o concorrente lançou) ou de uma vontade de DENTRO (uma ideia, uma inquietação, um jeito próprio de ver o mundo)?",
    sub: "Não tem certo nem errado — a maioria vive um pouco dos dois. Conta qual lado puxa mais, com um exemplo se vier.",
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
