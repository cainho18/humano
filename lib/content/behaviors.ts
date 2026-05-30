export interface BehaviorDef {
  id: string;
  dims: string[];
  text: string;
  /** itens invertidos (⟲): frequência alta = baixa humanidade */
  inverted?: boolean;
}

export const BEHAVIOR_SCALE = [
  "Nunca",
  "1 vez",
  "Algumas",
  "Muitas",
  "É comum",
] as const;

export const BEHAVIORS: BehaviorDef[] = [
  {
    id: "B1",
    dims: ["D7"],
    text: "Alguém discordou de uma decisão da chefia, na frente de todo mundo — e foi escutado, sem sobrar pra ele depois.",
  },
  {
    id: "B2",
    dims: ["D5", "D7"],
    text: "Uma decisão sobre gente (contratar, mandar embora, dar aumento) passou por conversa coletiva antes de bater o martelo.",
  },
  {
    id: "B3",
    dims: ["D1", "D3"],
    text: 'Você ou alguém da chefia admitiu, na frente dos outros: "errei" ou "tô em dúvida".',
  },
  {
    id: "B4",
    dims: ["D6A"],
    text: "Alguém sentiu uma treta no ar — daquelas que ainda não viraram problema — e botou na mesa antes de explodir.",
  },
  {
    id: "B5",
    dims: ["D2", "D9"],
    text: "Uma ideia que veio de baixo, de alguém fora da chefia, virou coisa real, aconteceu.",
  },
  {
    id: "B6",
    dims: ["D1", "D7"],
    inverted: true,
    text: "Alguém engoliu uma questão importante — não falou porque sentiu que não valia o risco.",
  },
  {
    id: "B7",
    dims: ["D6"],
    inverted: true,
    text: "Teve gente claramente no limite, esgotada — e nada no trabalho mudou por causa disso.",
  },
  {
    id: "B8",
    dims: ["D12", "D8"],
    text: "Alguém trouxe uma ideia sobre o efeito da organização no mundo lá fora — e isso mudou uma decisão de verdade.",
  },
  {
    id: "B9",
    dims: ["D10", "D5"],
    text: "Rolou um experimento, um teste — e o resultado foi dividido com todo mundo, inclusive a parte que deu errado.",
  },
  {
    id: "B10",
    dims: ["D11", "D9"],
    inverted: true,
    text: "Chegou uma ferramenta nova (sistema, tecnologia, IA) sem ninguém perguntar pra quem ia usar todo dia.",
  },
  {
    id: "B11",
    dims: ["D1.3"],
    text: "Teve um momento de ritual coletivo — celebração, despedida, abrir ou fechar de ciclo — que não era reunião de status nem festa de fim de ano por obrigação.",
  },
];
