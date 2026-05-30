export interface ThermometerDef {
  id: number;
  dims: string[];
  question: string;
  /** polo esquerdo */
  left: string;
  /** polo direito */
  right: string;
}

export const THERMOMETERS: ThermometerDef[] = [
  {
    id: 1,
    dims: ["D13.2"],
    question: "Como vocês chegam nas decisões que importam?",
    left: "Sentindo uma direção",
    right: "Projetando os dados",
  },
  {
    id: 2,
    dims: ["D9", "D10"],
    question: "Como o trabalho se organiza, no fundo?",
    left: "No caos potente",
    right: "Na ordem clara",
  },
  {
    id: 3,
    dims: ["D13.1"],
    question: "Quando é hora de agir, o que move primeiro?",
    left: "A intuição do grupo",
    right: "O processo combinado",
  },
  {
    id: 4,
    dims: ["D10.3"],
    question: "Diante do incerto, vocês tendem a...",
    left: "Fluir com o que vem",
    right: "Planejar antes de pisar",
  },
  {
    id: 5,
    dims: ["D2", "D8"],
    question: "O que segura mesmo o trabalho de pé?",
    left: "O sentido que se compartilha",
    right: "A estrutura que se combina",
  },
];
