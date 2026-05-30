/**
 * Falas do Bobo. {voc} = slot de vocativo (Irmão/Amiga/neutro) resolvido por
 * applyVocative(). Conteúdo em linguagem GZero — não reescrever pra formal.
 */

export interface TransitionDef {
  id: string;
  fala: string;
  button: string;
  /** palavras a destacar (efeito Highlight em T1) */
  highlights?: string[];
}

export const TRANSITIONS: Record<string, TransitionDef> = {
  T1: {
    id: "T1",
    fala: "Primeira parada: umas cenas do dia a dia. Não me responde como DEVERIA ser. Me responde como É — naqueles dias em que ninguém tá olhando e a máscara cai. Bora. São rapidinhas.",
    button: "Manda a primeira",
    highlights: ["como É", "máscara cai"],
  },
  T2: {
    id: "T2",
    fala: "Agora um respiro diferente. Vou te dar uns pares de coisas que puxam pra lados opostos. Os dois importam — não tem mocinho e vilão aqui. Quando aperta e não dá pra ter os dois, pra que lado a sua organização pende? Arrasta a bolinha pro ponto que é a verdade. Não pro ponto bonito.",
    button: "Bora calibrar",
  },
  T3: {
    id: "T3",
    fala: "Essa parte é cruel — do jeito bom. Todo mundo diz que tudo importa igual. Mentira. Quando o cobertor é curto, alguma coisa fica de fora. Então não me diz o que importa. Me mostra onde o dinheiro, o tempo e a atenção REALMENTE vão.",
    button: "Encarar",
  },
  T4: {
    id: "T4",
    fala: "Mudei o jogo. Agora não quero o que você acha — quero o que aconteceu. Pensa nos últimos 90 dias. Coisa concreta, que dá pra lembrar. Memória não mente tão fácil quanto opinião. Não precisa cravar número exato. Chuta com honestidade.",
    button: "Puxar da memória",
  },
  T5: {
    id: "T5",
    fala: "Agora a parte que eu mais curto. Esquece certo e errado. Vou te mostrar dois jeitos de ser, dois polos — e os dois são humanos, os dois têm beleza. Me diz só onde a sua organização vive, de verdade, entre um e outro. É rapidinho. Sente antes de responder.",
    button: "Sentir",
  },
  T6: {
    id: "T6",
    fala: "Joguinho de palavras agora. Mais sério do que parece. Vou te dar um monte de palavra. Você joga cada uma no lugar onde ela vive de verdade aí dentro. Repara bem: tem diferença entre o que MOVE a parada e o que a gente só FALA que move. É aí que mora o babado.",
    button: "Espalhar as palavras",
  },
  T7: {
    id: "T7",
    fala: "Chega de poesia por um instante. Agora é osso. Cultura bonita todo mundo tem no site. Eu quero saber da engrenagem por baixo: quem é dono, quem decide, quem leva a grana. Porque é aí — e não no manifesto — que se vê quem a organização realmente é.",
    button: "Ver por baixo",
  },
};

export const CARD4_INTRO =
  "Última. Essa é entre a gente, {voc}. Toda organização tem um nome público — o do CNPJ, o da fachada. Mas e se ela tivesse um nome secreto? Daqueles que ninguém pronuncia em reunião, mas que todo mundo lá dentro sabe que é o nome verdadeiro? Qual seria?";

export const FINAL_FALA =
  "Acabou. Respira, {voc}. Você olhou no espelho sem desviar — isso já é mais do que muita gente aguenta. Olha o que eu vi:";

export interface JesterPopup {
  id: "fast" | "same" | "idle";
  fala: string;
}

export const JESTER_POPUPS: Record<JesterPopup["id"], string> = {
  fast: "Calma aí, {voc}. Tá respondendo na velocidade da luz. Isso aqui não é prova de vestibular. Respira. Sente a pergunta antes de cravar.",
  same: "Ó... reparei que tá tudo na mesma letrinha. Pode ser a verdade mesmo — ou pode ser piloto automático. Dá uma olhada de novo, sem pressa.",
  idle: "Tá aí ainda, {voc}? Sem pressa nenhuma. Quando quiser, a gente continua. O espelho espera.",
};
