/**
 * Conteúdo textual da TELA FINAL (resultado da pesquisa).
 * Fonte única de copy — transcrito de humanware-conteudo-pagina-final.md.
 * NÃO exibir cálculo interno (QE, modificadores, falam×movem, D[n], meta).
 */

export interface ItemTD {
  t: string;
  d: string;
}

export interface ArquetipoCopy {
  essencia: string;
  retrato: string[]; // 3 parágrafos
  fortes: ItemTD[]; // 4
  atencao: ItemTD[]; // 4
  exemplos: ItemTD[]; // 4
}

/** Keyed pelo nome exato do arquétipo (diag.arquetipo.nome). */
export const ARQUETIPOS: Record<string, ArquetipoCopy> = {
  Maquinário: {
    essencia: "a peça descartável",
    retrato: [
      "Aqui a coisa funciona como engrenagem bem azeitada, e é justamente esse o problema: a pessoa é uma peça. Entra, produz, sai — e se quebrar, troca-se. Não há discurso bonito pra disfarçar: a relação é uma troca seca de tempo por dinheiro, e todo mundo sabe disso.",
      "O que mais pesa não é a crueldade — é a frieza tranquila. Ninguém grita, ninguém humilha. Só que ninguém fica também. A organização enxerga gente como recurso e otimiza recurso. É eficiente, previsível, escalável. E é solitário até no meio da multidão.",
      "Não é que falte competência. Falta presença. A máquina roda — só que roda sem alma, e cada pessoa aprende rápido a deixar a sua na portaria.",
    ],
    fortes: [
      { t: "Previsibilidade e escala", d: "O que precisa sair, sai, no volume que precisar." },
      { t: "Clareza brutal", d: "Ninguém finge que é família; a regra do jogo é honesta no que tem de seco." },
      { t: "Eficiência operacional", d: "Pouca gordura, processo enxuto." },
      { t: "Regra igual pra todos", d: "A frieza também protege de favoritismo e politicagem." },
    ],
    atencao: [
      { t: "Desumanização", d: "A pessoa some atrás da função." },
      { t: "Zero vínculo, zero lealdade", d: "Ninguém defende o que não o defende." },
      { t: "Iniciativa morre", d: "Quem é peça não inventa; só executa." },
      { t: "Substituível por automação", d: "Quando a tarefa puder virar robô, ninguém vai sentir falta." },
    ],
    exemplos: [
      { t: "Uber · iFood · 99 · Rappi", d: "Trabalho fragmentado, sem vínculo, descartável por design." },
      { t: "Armazéns Amazon", d: "O cronômetro acima de tudo." },
      { t: "Fast fashion (Shein)", d: "Gente como linha de produção." },
      { t: "Call centers cronometrados", d: "Cada segundo medido, cada pessoa intercambiável." },
    ],
  },

  Ofício: {
    essencia: "a alma do lado de fora",
    retrato: [
      "Tudo aqui funciona — menos a alma, que fica do lado de fora. Vocês respeitam as pessoas como profissionais: pagam bem, dão clareza, cobram excelência e entregam excelência de volta. Só que é a versão produtiva da pessoa que entra; a dúvida, o luto, o dia ruim ficam na portaria.",
      "Não é a frieza do Maquinário — tem respeito de verdade. Mas é um respeito de superfície profissional: você é o que você entrega. Por isso é, ao mesmo tempo, um lugar excelente e estranhamente solitário.",
      "A vitalidade não morre de uma vez. Ela atrofia devagar, de tanto a pessoa só poder mostrar metade de si.",
    ],
    fortes: [
      { t: "Excelência e justiça", d: "Alto padrão, bem recompensado." },
      { t: "Clareza de expectativa", d: "Todo mundo sabe o que é esperado." },
      { t: "Meritocracia real", d: "Entrega conta mais que política." },
      { t: "Estabilidade", d: "É um lugar sólido, confiável, sério." },
    ],
    atencao: [
      { t: "A pessoa inteira não cabe", d: "Só a parte produtiva é bem-vinda." },
      { t: "Vínculo raso", d: "Entrega-se o combinado, raramente além." },
      { t: "Inovação que exige vulnerabilidade não acontece", d: "Ninguém arrisca o que pode expor." },
      { t: "Fuga de talento", d: "Quem encontra um lugar que o aceita inteiro, vai." },
    ],
    exemplos: [
      { t: "Toyota", d: "Excelência de processo levada à perfeição." },
      { t: "Netflix", d: "Alta performance, baixa intimidade (“time, não família”)." },
      { t: "Grandes bancos e big law", d: "Rigor, prestígio, distância." },
      { t: "Consultorias estratégicas", d: "Brilhantes e impessoais." },
    ],
  },

  Vitrine: {
    essencia: "o discurso e o avesso",
    retrato: [
      "De fora, vocês brilham: o discurso fala em autonomia, propósito, cuidado, gente em primeiro lugar. Por dentro, a prática contradiz quase tudo que a vitrine promete. Fala-se em autonomia e microgerencia-se; fala-se em cuidado e adoece-se; fala-se em horizontalidade e decide-se tudo em cima.",
      "O que define vocês não é uma cara — é uma distância. A distância entre o que se diz e o que se faz. E essa distância cobra caro: apodrece a confiança por dentro, porque todo mundo percebe o gap, mesmo sem poder nomear.",
      "Nem sempre é má-fé. Às vezes é transição — o discurso mudou antes da prática conseguir mudar. Mas enquanto a distância existir, o sistema vive uma dissociação.",
    ],
    fortes: [
      { t: "A aspiração já está nomeada", d: "Vocês já sabem que mundo querem ser." },
      { t: "Promessa virável", d: "Se a prática alcançar o discurso, vira de verdade." },
      { t: "Tem quem acredita", d: "Quase sempre há gente sincera tentando fechar o gap." },
      { t: "Consciência do destino", d: "O norte existe — falta o caminho até ele." },
    ],
    atencao: [
      { t: "Cinismo institucionalizado", d: "“Aqui se fala bonito e se faz feio.”" },
      { t: "A verdade não circula", d: "Dizer o óbvio é arriscado." },
      { t: "Desgaste de quem acredita", d: "Quem leva o discurso a sério bate na parede." },
      { t: "Risco quando vaza", d: "O gap exposto pra fora vira crise de reputação." },
    ],
    exemplos: [
      { t: "Vale (Brumadinho · Mariana)", d: "Discurso de segurança × prática que ruiu." },
      { t: "Samarco", d: "O avesso do que se anunciava." },
      { t: "Greenwashing e pinkwashing", d: "A embalagem descolada do conteúdo." },
      { t: "Cultura de fachada", d: "O mural de valores que ninguém vive." },
    ],
  },

  Chama: {
    essencia: "a paixão que queima",
    retrato: [
      "Aqui é vivo. Tem propósito de verdade, vínculo de verdade, gente que ama o que faz — e é exatamente isso que queima. O amor pela missão vira a desculpa perfeita pra não ter limite: “a gente é uma causa”, então madrugada, fim de semana e exaustão viram prova de amor.",
      "Não tem o cinismo da Vitrine — é sincero no calor. A ferida não vem da falta de fogo, vem do excesso. Costuma ser o lugar mais humano que alguém já viveu, e também o que mais o machucou.",
      "Sem aprender a se proteger do próprio fogo, a paixão azeda: vira culpa, vira cobrança e, no fim, vira ressentimento.",
    ],
    fortes: [
      { t: "Sentido e entrega genuínos", d: "As pessoas dão o sangue por algo em que acreditam." },
      { t: "Vínculo forte", d: "Laços reais, não corporativos." },
      { t: "Energia criativa alta", d: "Muita coisa nasce no calor." },
      { t: "Lealdade à causa", d: "Quando acreditam, vão fundo." },
    ],
    atencao: [
      { t: "Burnout coletivo", d: "A chama consome quem a alimenta." },
      { t: "Limites inexistentes", d: "O amor vira chantagem emocional, mesmo sem querer." },
      { t: "Vício em adrenalina", d: "Só funciona no modo “tudo agora”." },
      { t: "Traição percebida", d: "Quando alguém adoece ou sai, o grupo se sente abandonado." },
    ],
    exemplos: [
      { t: "Agências e estúdios criativos", d: "Temporada de prêmio, noite virada." },
      { t: "ONGs de missão", d: "Causa acima do corpo." },
      { t: "Startups early-stage", d: "“A gente é uma família” em jornada insana." },
      { t: "Zappos (pós-Holacracia)", d: "Propósito intenso, estrutura frágil." },
    ],
  },

  Família: {
    essencia: "o abraço que aperta",
    retrato: [
      "Vocês se conhecem pelo nome, lembram do aniversário, sabem quando alguém tá em apuro. O cuidado é genuíno e o vínculo é fundo — entrar aqui é ser acolhido de verdade. Só que o mesmo abraço que acolhe também aperta.",
      "Discordar parece traição. Propor o novo soa como desrespeito ao “nosso jeito”. E o “nosso jeito” é tão forte que gente muito diferente não cabe: ou se molda, ou não fica. A Família protege e prende no mesmo gesto.",
      "O risco é a estagnação. Sem sangue novo e sem conflito saudável, o cuidado vira controle afetivo — e a empresa para de crescer junto com as pessoas.",
    ],
    fortes: [
      { t: "Pertencimento profundo", d: "As pessoas se sentem em casa." },
      { t: "Lealdade", d: "Baixa rotatividade, gente que veste a camisa." },
      { t: "Resiliência afetiva", d: "Em crise, o grupo se fecha e segura." },
      { t: "Cuidado real", d: "Quando alguém cai, é amparado." },
    ],
    atencao: [
      { t: "Conflito abafado", d: "A verdade incômoda some pra não magoar." },
      { t: "Inovação travada", d: "O novo soa como ameaça ao jeito de casa." },
      { t: "Favoritismo e dependência do fundador", d: "Muito gira em torno de poucas figuras." },
      { t: "Difícil escalar", d: "Crescer sem perder o que faz ser Família é raro." },
    ],
    exemplos: [
      { t: "Empresas familiares pequenas", d: "O negócio e o sobrenome se confundem." },
      { t: "Negócios de bairro consolidados", d: "Clientela e equipe que envelhecem juntas." },
      { t: "A padaria, a ferragem, o escritório de 20 anos", d: "Calor e teto baixo no mesmo lugar." },
      { t: "Restaurantes de dono", d: "A casa é a extensão da pessoa." },
    ],
  },

  Vilarejo: {
    essencia: "a sabedoria lenta",
    retrato: [
      "Vocês são uma comunidade antes de serem uma empresa. As pessoas se conhecem pelo nome, percebem quando alguém está passando aperto, e tomam decisão importante em roda — conversando até a coisa amadurecer em consenso.",
      "Existe uma sabedoria no jeito de vocês fazerem as coisas que não está escrita em lugar nenhum, mas que todo mundo respeita e protege. Vocês crescem como árvore: devagar, por dentro, com raiz funda. Atravessam crises que quebram empresas mais rápidas, porque o vínculo de vocês é estrutura, não enfeite.",
      "Mas a mesma lentidão que protege também emperra. Discordar pode parecer traição; propor o novo pode soar como desrespeito ao “nosso jeito”. O consenso que cuida também cala. A força de vocês e o risco de vocês moram no mesmo lugar: o tempo.",
    ],
    fortes: [
      { t: "Pertencimento profundo", d: "As pessoas ficam, e ficam inteiras. Raiz, não amarra." },
      { t: "Sabedoria coletiva", d: "Decisões maduras; o grupo lembra e corrige." },
      { t: "Resiliência de comunidade", d: "Vínculo é infraestrutura; atravessam tempestade." },
      { t: "Cuidado real", d: "Ninguém é número; quando alguém cai, o vilarejo segura." },
    ],
    atencao: [
      { t: "Velocidade", d: "Consenso é lento; oportunidade de prazo curto escapa." },
      { t: "Conflito abafado", d: "Discordar parece traição; a verdade incômoda fica sob o tapete." },
      { t: "Inovação travada", d: "O diferente custa a entrar e mais ainda a ficar." },
      { t: "Dependência dos mais velhos", d: "Muito saber vive nas mesmas cabeças." },
    ],
    exemplos: [
      { t: "Mondragón", d: "Federação de cooperativas com ~70 mil pessoas: vínculo e decisão coletiva que escalam." },
      { t: "Cooperativas de crédito e agrícolas", d: "Solidez por consenso, não por comando." },
      { t: "Cooperativas de catadores", d: "Organização madura que sustenta quem o mercado descarta." },
      { t: "Mosteiros e comunidades", d: "Ritual, sabedoria lenta, séculos de continuidade." },
    ],
  },

  Constelação: {
    essencia: "o caos com alma",
    retrato: [
      "Vocês são pequenos em gente e enormes em potência. Aqui não tem cargo fixo, horário fixo, nem chefe no sentido clássico — cada um é uma estrela com luz própria, com autocompromisso radical. É mais caos que ordem, e profundamente humano.",
      "O que segura a constelação não é a estrutura — é o afeto e a confiança entre as pessoas. Funciona enquanto cada um é maduro o bastante pra carregar a própria parte. É liberdade real, originalidade real, entrega que vem de dentro.",
      "O risco mora aí: se o afeto cai, ou entra alguém que não dá conta da autonomia, a constelação vira Chama e queima — ou simplesmente se desfaz. Escalar sem perder a alma é quase impossível.",
    ],
    fortes: [
      { t: "Originalidade e liberdade radicais", d: "Pouca regra, muita autoria." },
      { t: "Potência por pessoa altíssima", d: "Gente pequena fazendo coisa grande." },
      { t: "Autocompromisso genuíno", d: "Ninguém precisa mandar." },
      { t: "Zero burocracia", d: "Velocidade de quem confia." },
    ],
    atencao: [
      { t: "Instabilidade", d: "Depende da maturidade de cada um." },
      { t: "Difícil escalar", d: "O modelo não copia fácil." },
      { t: "Sobrecarrega quem puxa mais", d: "Sem estrutura, o peso desequilibra." },
      { t: "O caos cansa", d: "Sem o mínimo de acordo, a liberdade vira desgaste." },
    ],
    exemplos: [
      { t: "Boutiques de inovação", d: "Poucas pessoas, muito impacto." },
      { t: "Estúdios criativos pequenos e potentes", d: "Assinatura forte, hierarquia mínima." },
      { t: "Coletivos artísticos profissionalizados", d: "Arte e autogestão juntas." },
      { t: "Squads autônomos de produto", d: "Decisão na ponta, dono de cada um." },
    ],
  },

  Organismo: {
    essencia: "o inteiro raro",
    retrato: [
      "Aqui performance e humanidade pararam de brigar — elas se alimentam. As tensões que nas outras organizações vivem negadas (cuidado × resultado, autonomia × coordenação, verdade × harmonia) aqui são maduras, ditas e digeridas. Não é um lugar sem conflito; é um lugar que sabe o que fazer com ele.",
      "É o horizonte do Humanware pleno: gente inteira produzindo coisas excelentes, sem deixar a alma na portaria nem usar o afeto como chantagem. E é raríssimo — porque exige cuidado intencional o tempo todo pra não regredir.",
      "Organismo não é “melhor” que Vilarejo ou Constelação — é mais equilibrado, e mais difícil de sustentar. A maturidade aqui é prática diária, não troféu conquistado.",
    ],
    fortes: [
      { t: "Performance E humanidade juntas", d: "Uma alimenta a outra." },
      { t: "Tensões maduras", d: "Nada varrido pra baixo do tapete." },
      { t: "Adaptabilidade", d: "Lê o campo e se reorganiza." },
      { t: "Gente inteira e produtiva", d: "Não precisa escolher entre ser e entregar." },
    ],
    atencao: [
      { t: "Difícil de durar", d: "Regride sem cuidado constante." },
      { t: "Exige liderança madura em quantidade", d: "Não se sustenta em uma pessoa só." },
      { t: "Pode relaxar", d: "“Estamos bem” vira armadilha." },
      { t: "A barra alta cansa", d: "Se não for sustentada coletivamente, vira peso." },
    ],
    exemplos: [
      { t: "Buurtzorg", d: "~14 mil enfermeiros em autogestão, cuidado e eficiência juntos." },
      { t: "Semco (Ricardo Semler)", d: "Autonomia radical com resultado." },
      { t: "Patagonia", d: "Propósito, performance e gente no mesmo eixo." },
      { t: "Cooperativas maduras de larga escala", d: "Governança coletiva que sustenta a barra alta." },
    ],
  },
};

// ── 6 tecnologias: o que é + dimensões (nomes) + posição no corpo ──
export interface TechInfo {
  oque: string;
  dims: string[];
  /** campo: subjetivo (trazem o mundo pra dentro) ou objetivo (devolvem) */
  campo: "sub" | "obj";
  chakra: { regiao: string; x: number; y: number };
}

export const TECH_INFO: Record<string, TechInfo> = {
  consciencia: {
    oque: "Enxergar o efeito na rede toda, inclusive em quem não está na mesa.",
    dims: ["Impacto visível", "Tecnologia companheira", "Consciência da rede"],
    campo: "obj",
    chakra: { regiao: "cabeça · o todo", x: 47, y: 9 },
  },
  dialogo: {
    oque: "A verdade que circula — inclusive pra cima — sem sobrar mágoa.",
    dims: ["Honestidade", "Dialogia"],
    campo: "obj",
    chakra: { regiao: "garganta · a voz", x: 48, y: 18 },
  },
  vinculo: {
    oque: "A intimidade real entre as pessoas e o espaço pra diferença existir sem ser podada.",
    dims: ["Intimidade", "Pluralidade que cabe"],
    campo: "sub",
    chakra: { regiao: "peito · o laço", x: 48, y: 26 },
  },
  cuidado: {
    oque: "O cuidado que opera de fato — na estrutura e no afeto —, não o que só se fala.",
    dims: ["Cuidado estrutural", "Afetabilidade"],
    campo: "sub",
    chakra: { regiao: "ventre · o sustento", x: 48, y: 37 },
  },
  originalidade: {
    oque: "Criar a partir do que é só de vocês, em vez de copiar fórmula de fora.",
    dims: ["Autoria própria", "Coragem de experimentar"],
    campo: "sub",
    chakra: { regiao: "mãos · criar", x: 33, y: 55 },
  },
  autogestao: {
    oque: "A entrega que nasce de acordo entre as pessoas, não de comando de cima.",
    dims: ["Autocompromisso"],
    campo: "obj",
    chakra: { regiao: "pernas · a base", x: 52, y: 64 },
  },
};

/** "por que essa nota" gerado pelo estado da tecnologia. */
export const ESTADO_NOTA: Record<string, string> = {
  Forte: "É uma força de vocês — está instalada e rodando no dia a dia.",
  Frágil:
    "Existe, mas depende mais das pessoas certas do que da estrutura — ainda não é garantida.",
  Engatilhado:
    "Tem vontade represada aqui — o desejo existe, a prática ainda não soltou. É ganho rápido.",
  Ausente: "Quase não aparece no dia a dia — é terreno a construir.",
};

// ── permissões (a pele) ──
export const PERM_INFO: Record<string, string> = {
  Propriedade:
    "Quem é dono do que se constrói — se o ganho fica com quem faz ou escorre pra fora.",
  Transparência: "O quanto as contas e as decisões são abertas.",
  "Decisão coletiva": "O quanto as decisões importantes passam de fato pela roda.",
  "Voz no sistema":
    "Se qualquer pessoa tem canal real pra falar e ser ouvida por quem decide.",
  "Tempo de desligar":
    "O direito de parar sem culpa — o trabalho não invade o descanso.",
  Autogestão:
    "O quanto cada um governa o próprio trabalho dentro de acordos claros.",
  "Ferramenta a favor":
    "Se a tecnologia acompanha e serve, ou vigia e atrapalha.",
};

// ── gravidade: descrição por estado ──
export const GRAVIDADE_ESTADO: Record<string, string> = {
  Máquina: "Campo pesado, frequência-máquina dominante.",
  "em travessia":
    "Tem vida humana rodando, mas ainda presa por constrangimentos antigos. No meio do rio — nem na margem velha, nem na nova.",
  Humana: "Frequência humana instalada; perto da Gravidade Zero.",
};

// ── copy fixa por seção (narrador) ──
export const FINAL_COPY = {
  retrato: { eyebrow: "o retrato" },
  frequencia: {
    eyebrow: "a frequência · gravidade",
    narr: "Onde a organização de vocês vibra entre a máquina e o humano.",
  },
  corpo: {
    eyebrow: "o corpo · 6 tecnologias humanas",
    narr: "O corpo da organização roda em seis tecnologias. Três que trazem o mundo pra dentro, três que devolvem pro mundo.",
    micro: "clique em cada uma pra entender o que é e por que essa nota.",
  },
  bugs: {
    eyebrow: "bugs & firewalls",
    narr: "A pele do sistema: o que protege a frequência humana — e o que deixa a máquina entrar.",
    micro: "firewalls seguram o campo · bugs são as brechas · clique pra abrir.",
  },
  salto: {
    eyebrow: "o primeiro salto",
    narr: "Pelo que vi, o caminho de vocês até a Gravidade Zero começa por aqui.",
  },
  conteudos: {
    eyebrow: "as quatro cartas",
    narr: "Uma tiragem do humanware pra organização de vocês — quatro cartas que o perfil puxou. Leia como um espelho do que pede atenção agora.",
  },
} as const;

/* ───────────────────────────── conteúdos (pílulas) ─────────────────────────
 * Biblioteca de leituras do AWAKENING (GZero). Cada pílula nutre uma tecnologia
 * humana ou conversa com um arquétipo. A seleção dos 4 cards é feita no adapter
 * conforme o perfil (arquétipo + tecnologias mais frágeis). Textos destilados
 * do material original da GZero.
 * ------------------------------------------------------------------------- */

export interface Conteudo {
  id: string;
  titulo: string;
  /** submanchete — a "voz" da carta */
  manchete: string;
  /** resumo em 1–2 frases */
  resumo: string;
}

export const CONTEUDOS: Record<string, Conteudo> = {
  // — por tecnologia —
  knot: {
    id: "knot",
    titulo: "Knot: Emaranhado Coletivo",
    manchete: "A interdependência como principal atributo da revolução.",
    resumo:
      "Nenhuma ação vive só em si — tudo o que vocês decidem reverbera no emaranhado do todo. Despertar para a interdependência é o que transforma concorrência em parceria.",
  },
  multilogias: {
    id: "multilogias",
    titulo: "As multilogias",
    manchete: "Não existe a verdade. Existem as verdades.",
    resumo:
      "Cultura única nunca existiu — toda organização é feita de muitas verdades convivendo. O futuro pede espaço para a pluralidade, não muralhas ideológicas.",
  },
  autonomos: {
    id: "autonomos",
    titulo: "Seres humanos autônomos",
    manchete: "O valor da interdependência numa era de empresas sem pessoas.",
    resumo:
      "Autonomia não é fazer tudo sozinho — é ter consciência de que seu trabalho impacta e é impactado pelos outros. A autonomia real mora na interdependência.",
  },
  brilhar: {
    id: "brilhar",
    titulo: "Brilhar dentro para iluminar fora",
    manchete: "A evolução coletiva dentro de cada um de nós.",
    resumo:
      "A transformação do todo começa no nível individual: quem se cuida e se ilumina por dentro acaba iluminando quem está ao redor. Do “ver para crer” ao “crer para ver”.",
  },
  opensource: {
    id: "opensource",
    titulo: "Open source da vida real",
    manchete: "Programe o que quiser.",
    resumo:
      "O futuro aponta para o aberto e o descentralizado: qualquer pessoa poderá dar vida às próprias ideias sem depender de grandes estruturas. Transparência e autoria viram base da criação.",
  },
  liquido: {
    id: "liquido",
    titulo: "Liderar é um estado líquido",
    manchete: "A lógica das responsabilidades dinâmicas.",
    resumo:
      "Liderança deixa de ser cargo e vira estado: flui pela missão, pela paixão e pela capacidade de cada momento. Distribuir responsabilidade alivia o ponto único e move a organização como organismo vivo.",
  },

  // — por arquétipo —
  "maquina-lugar": {
    id: "maquina-lugar",
    titulo: "A máquina retomando seu lugar",
    manchete: "E o papel do ser humano.",
    resumo:
      "Eficiência é linguagem de máquina — esse é o espaço dela, não o de vocês. O papel humano é o do sentir, da intuição e do significado para além do processo.",
  },
  ancestral: {
    id: "ancestral",
    titulo: "O futuro é ancestral",
    manchete: "O retorno às origens nos leva ao encontro de quem somos.",
    resumo:
      "Tanta tecnologia nova também pode nos afastar de nós mesmos. A linha de chegada talvez não esteja à frente, mas atrás — nas tecnologias humanas e naturais que já nos formaram.",
  },
  curador: {
    id: "curador",
    titulo: "Curador da própria vida",
    manchete: "Coerência e impecabilidade.",
    resumo:
      "Numa era em que tudo vira input, curar as próprias escolhas vira ato de cuidado. Coerência com quem se é importa mais do que a vitrine que se mostra.",
  },
  filosofos: {
    id: "filosofos",
    titulo: "Filósofos agilistas",
    manchete: "Transformar filosofia em design para criar futuros significativos.",
    resumo:
      "Quando a IA entrega respostas binárias, é o humano filosófico que imprime sentido. Refletir com ética e, ao mesmo tempo, desenhar soluções práticas e ágeis.",
  },
  monocultura: {
    id: "monocultura",
    titulo: "O fim da monocultura organizacional",
    manchete: "A saúde depende da diversidade.",
    resumo:
      "Assim como a monocultura esgota o solo, a cultura única empobrece a organização. Microculturas que convivem deixam o todo mais fértil, flexível e vivo.",
  },
  decrescimento: {
    id: "decrescimento",
    titulo: "Decrescimento Exponencial",
    manchete: "Mais coerência, menos recursos.",
    resumo:
      "Crescer não é acumular recursos. Conforme a tecnologia avança, a tendência é fazer mais com menos — decrescer em alocação e crescer em exponencialidade e coerência.",
  },
  molegolar: {
    id: "molegolar",
    titulo: "Empresas moLEGOlares",
    manchete: "A desfragmentação das big companies.",
    resumo:
      "O grande monolítico dá lugar a estruturas leves e modulares, como uma colmeia de autônomos com propósito comum. Soltar os “saquinhos de areia” é o que devolve altitude.",
  },
  work: {
    id: "work",
    titulo: "Work isn’t working",
    manchete: "Repensar o futuro do trabalho — tecnologia, humanidade e saúde mental.",
    resumo:
      "Adoecimento e desinteresse mostram que o trabalho está em dessintonia com a humanidade. Reimaginar o trabalho é reconhecer a máquina e, ao mesmo tempo, valorizar a vocação humana.",
  },
} as const;

/** tecnologia humana (chave) → pílula que a nutre */
export const TEC_CONTEUDO: Record<string, string> = {
  consciencia: "knot",
  dialogo: "multilogias",
  vinculo: "autonomos",
  cuidado: "brilhar",
  originalidade: "opensource",
  autogestao: "liquido",
};

/** arquétipo → pílula de identidade */
export const ARQ_CONTEUDO: Record<string, string> = {
  "Maquinário": "maquina-lugar",
  "Ofício": "ancestral",
  "Vitrine": "curador",
  "Chama": "filosofos",
  "Família": "monocultura",
  "Vilarejo": "decrescimento",
  "Constelação": "molegolar",
  "Organismo": "work",
};
