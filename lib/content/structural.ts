export interface StructuralDef {
  id: string;
  dims: string[];
  title: string;
  sub: string;
}

export const STRUCTURAL_SCALE = [
  "Nada",
  "Pouco",
  "Em parte",
  "Bastante",
  "Total",
] as const;

export const STRUCTURAL: StructuralDef[] = [
  {
    id: "S1",
    dims: ["QE"],
    title: "A empresa é de quem faz ela",
    sub: "Pertence a quem trabalha — ou tem um dono lá longe, separado de quem bota a mão na massa?",
  },
  {
    id: "S2",
    dims: ["QE", "D6E"],
    title: "Pagamento digno",
    sub: "O que a organização fatura chega de forma justa em quem gera esse valor?",
  },
  {
    id: "S3",
    dims: ["D5", "QE"],
    title: "Sem segredo, sem BO",
    sub: "As contas, as decisões, os dados — tão abertos pra quem trabalha? E cada um pode levar o que é seu embora?",
  },
  {
    id: "S4",
    dims: ["D2", "QE"],
    title: "Teu trabalho tem assinatura",
    sub: 'Quem cria é reconhecido como autor — ou some no bolo do "resultado coletivo"?',
  },
  {
    id: "S5",
    dims: ["D9", "D7"],
    title: "Ninguém decide por você",
    sub: "As decisões que pegam todo mundo são tomadas com todo mundo?",
  },
  {
    id: "S6",
    dims: ["D11", "D5"],
    title: "Pode questionar o sistema",
    sub: "Quando uma regra ou sistema decide algo sobre você, dá pra entender o porquê e contestar?",
  },
  {
    id: "S7",
    dims: ["D11"],
    title: "Tá com você, não de olho em você",
    sub: "A tecnologia aqui acompanha o trabalho pra ajudar — ou pra vigiar?",
  },
  {
    id: "S8",
    dims: ["D6E"],
    title: "Pode desligar de boa",
    sub: "Dá pra desligar de verdade — ou todo mundo tá sempre de plantão?",
  },
  {
    id: "S9",
    dims: ["D9.4"],
    title: "Teu cargo é sub-set de quem tu é",
    sub: "O que você faz é definido por um cargo — ou por quem você é e pelo que o momento pede?",
  },
  {
    id: "S10",
    dims: ["D9.4"],
    title: "Vale mais o que entrega",
    sub: "A medida é bater ponto e cumprir horário — ou o compromisso com o que precisa ser feito?",
  },
  {
    id: "S11",
    dims: ["D9.4"],
    title: "Não-monogamia profissional",
    sub: "Rola tocar outros projetos ao mesmo tempo — ou se cobra exclusividade total?",
  },
];
