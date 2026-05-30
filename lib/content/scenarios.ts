import type { ScenarioKey } from "@/lib/types";

export interface ScenarioOption {
  key: ScenarioKey;
  text: string;
}

export interface Scenario {
  id: string;
  /** internal dimension tags — não exibir */
  dims: string[];
  prompt: string;
  options: ScenarioOption[];
  /** marcado como cortável se precisar enxugar (§6) */
  cuttable?: boolean;
}

export const SCENARIOS: Scenario[] = [
  {
    id: "C1",
    dims: ["D9", "D2"],
    cuttable: true,
    prompt:
      "Aparece alguém com uma ideia fora da caixa, fora do quadrado dela. O que rola, de verdade?",
    options: [
      { key: "a", text: 'Vira ideia pra "depois" — ninguém recusa, mas também não vai.' },
      { key: "b", text: "Passa por reunião de validação até virar (ou não virar) projeto." },
      { key: "c", text: "A pessoa é incentivada a tocar, com tempo protegido pra isso." },
      { key: "d", text: "Depende de quem é a pessoa e do humor da semana." },
    ],
  },
  {
    id: "C2",
    dims: ["D7", "D5"],
    prompt:
      "Um chefe crava uma decisão que meio mundo ali acha furada. Como é que essa história termina?",
    options: [
      { key: "a", text: "A decisão segue; as pessoas se ajustam ou saem." },
      { key: "b", text: "Quem discorda processa nos corredores, em conversa paralela." },
      { key: "c", text: "Tem uma conversa de verdade onde a decisão pode ser revista — e às vezes é." },
      { key: "d", text: "O time já se acostumou a não levantar a mão — não compensa." },
    ],
  },
  {
    id: "C3",
    dims: ["D1", "D6"],
    prompt:
      "Tem uma pessoa que entrega muito — e tá visivelmente no osso, esgotada. O sistema faz o quê?",
    options: [
      { key: "a", text: "Pressiona pra continuar — ela é peça importante demais pra parar agora." },
      { key: "b", text: "Manda descansar, tira férias — mas a carga e o jeito do trabalho seguem iguais." },
      { key: "c", text: "Redistribui o trampo e revê o ritmo do time, não só o dela." },
      { key: "d", text: "Cada gestor age do seu jeito — não tem resposta da organização." },
    ],
  },
  {
    id: "C4",
    dims: ["D4"],
    prompt:
      "Entrou alguém com um jeito de ser bem diferente do que predomina aí (outra origem, outra geração, outro ritmo, outro jeito de existir). Seis meses depois — qual é a real?",
    options: [
      { key: "a", text: "Já saiu — não engatou." },
      { key: "b", text: "Ficou, mas se moldou pra caber no grupo." },
      { key: "c", text: "Ficou, e o grupo mudou um pouco por causa dela." },
      { key: "d", text: "Ficou, e teve espaço pra ser ela mesma sem caber em molde nenhum." },
    ],
  },
  {
    id: "C5",
    dims: ["D6", "QE"],
    prompt:
      "Aperta o caixa, precisa cortar custo. Qual é a primeira coisa que vem na cabeça de cortar?",
    options: [
      { key: "a", text: "Gente — é o que alivia mais rápido." },
      { key: "b", text: "Mexer nos benefícios e regalias antes de mexer em gente." },
      { key: "c", text: "Olhar onde o ganho é menor que o desgaste humano que custa." },
      { key: "d", text: "Sentar com o time e construir a saída junto antes de cortar nada." },
    ],
  },
  {
    id: "C7",
    dims: ["D5", "D9"],
    prompt:
      "Quem entra, quem sai, quem ganha mais — como essas paradas são decididas aí dentro?",
    options: [
      { key: "a", text: "Decisão centralizada — quem manda decide e comunica." },
      { key: "b", text: "Os líderes diretos decidem, com critério formal por trás." },
      { key: "c", text: "Quem propõe leva pra roda, debate, e fecha com critério claro." },
      { key: "d", text: "Proposta aberta — qualquer um pode opinar antes de bater o martelo." },
    ],
  },
  {
    id: "C8",
    dims: ["D10"],
    prompt:
      "Quando vão lançar algo novo — produto, política, mudança — como testam antes de soltar pro mundo?",
    options: [
      { key: "a", text: "Não testa — quando lança, é pra valer." },
      { key: "b", text: "Testa internamente, com a chefia, antes de virar oficial." },
      { key: "c", text: "Faz um piloto pequeno, ajusta, depois escala." },
      { key: "d", text: "Solta em ciclos curtos, com direção clara mas sem mapa fechado — o plano vai aprendendo no caminho." },
    ],
  },
  {
    id: "C9",
    dims: ["D11"],
    prompt:
      "A IA assumiu uma tarefa que comia horas de alguém toda semana. Esse tempo que sobrou virou o quê?",
    options: [
      { key: "a", text: "Mais entrega — a pessoa dá conta de mais volume agora." },
      { key: "b", text: "Trabalho que antes não cabia — coisa mais complexa, que tava parada." },
      { key: "c", text: "Não sobrou tempo visível — o ritmo absorveu e seguiu." },
      { key: "d", text: "Sincero? A gente não acompanhou pra onde foi esse tempo." },
    ],
  },
  {
    id: "C10",
    dims: ["D12"],
    cuttable: true,
    prompt:
      "Na hora de uma decisão grande, de virar o jogo — o que pesa na balança?",
    options: [
      { key: "a", text: "O retorno financeiro e a viabilidade — o resto vem depois." },
      { key: "b", text: "O efeito sobre clientes diretos e equipe interna." },
      { key: "c", text: "O efeito sobre toda a rede afetada — inclusive quem não tá na mesa." },
      { key: "d", text: "Depende de quem tá liderando aquela decisão." },
    ],
  },
  {
    id: "C11",
    dims: ["D1.4"],
    prompt:
      "Rolou um desentendimento feio entre duas pessoas do time. Como isso costuma se resolver — ou não se resolver?",
    options: [
      { key: "a", text: "Não resolve — vira distância silenciosa, cada um pro seu canto." },
      { key: "b", text: "Algum gestor entra no meio, escuta os dois, e a coisa segue." },
      { key: "c", text: "As duas conversam — às vezes com ajuda — e o que ficou mal é dito em voz alta." },
      { key: "d", text: "Vira fofoca de corredor que dura meses." },
    ],
  },
  {
    id: "C13",
    dims: ["D4.2"],
    prompt:
      "As pessoas que mais brilham aí dentro — elas tendem a ser de que jeito?",
    options: [
      { key: "a", text: "Bem parecidas entre si — tem um perfil que dá certo aqui." },
      { key: "b", text: "Fortes na técnica, cada uma na sua especialidade." },
      { key: "c", text: "Variadas na formação, mas parecidas no jeito de operar." },
      { key: "d", text: "Muito diferentes entre si — cada uma brilha por um motivo próprio." },
    ],
  },
  {
    id: "C14",
    dims: ["D5.3"],
    prompt:
      "Quando uma verdade incômoda precisa chegar em quem manda — por qual caminho ela chega?",
    options: [
      { key: "a", text: "Em conversa formal, com pauta marcada e contexto explicado." },
      { key: "b", text: "Em pesquisa anônima — assim ninguém se queima." },
      { key: "c", text: "Em conversa de corredor, fora do espaço oficial." },
      { key: "d", text: "De um jeito lateral — humor, ironia, deboche — que abre o que o formal não abre." },
    ],
  },
  {
    id: "C15",
    dims: ["D9.3"],
    prompt: "No dia a dia, quem decide como e quando o trabalho é feito?",
    options: [
      { key: "a", text: "A chefia — método, prazo e ritmo vêm de cima." },
      { key: "b", text: "A chefia combina o quê; o como fica com a pessoa." },
      { key: "c", text: "A pessoa decide como, quando e com quem; a entrega é acordada." },
      { key: "d", text: "A pessoa decide tudo — método, ritmo, horário, parceria. O compromisso é com a entrega." },
    ],
  },
];
