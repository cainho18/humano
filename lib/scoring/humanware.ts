/**
 * Visão do framework Humanware® sobre o Diagnostic (13 dims → anatomia):
 *  - Coração (Intenção/Presença) + 6 Tecnologias Nativas
 *  - Frequência → Versão → Gravidade
 *  - Vetores (nível + direção + força) por tecnologia
 *  - Leitura das Permissões (Ordem/Emergência)
 *  - Prescrição (trilha/intensidade/primeiro salto/upsell/roteamento)
 *
 * Determinístico, offline. Consome SessionData + Diagnostic; recomputa
 * prática/discurso por dimensão via computeDimensions (sem acoplar à UI).
 */

import type { SessionData } from "../types";
import { LIKERT5, type DimKey } from "./config";
import { computeDimensions, mean } from "./dimensions";
import type { Diagnostic } from "./index";

export type Trilha = "Existencial" | "Cultural" | "Digital";
export type Intensidade =
  | "Palestra"
  | "Workshop"
  | "Imersão"
  | "Consultoria"
  | "Co-empreender";
export type DirecaoVetor = "engatilhado" | "força oculta" | "estável";
export type EstadoVetor = "Forte" | "Frágil" | "Engatilhado" | "Ausente";

export interface Vetor {
  chave: string;
  nome: string;
  trilha: Trilha;
  nivel: number;
  direcao: DirecaoVetor;
  forca: number;
  estado: EstadoVetor;
}

export interface Coracao {
  intencao: number;
  presenca: number;
}

export interface Permissao {
  nome: string;
  categoria: string;
  tipo: "Ordem" | "Emergência";
  nivel: number;
  /** segura o campo (nível baixo = trava) */
  segura: boolean;
}

export interface Prescricao {
  trilha: Trilha;
  intensidade: Intensidade;
  primeiro_salto: string;
  por_que: string;
  alavanca: string;
  caminho_upsell: string[];
  roteamento: "GZero" | "GZero+Loomi" | "GZero+acaso";
  trava: string | null;
}

export interface HumanwareView {
  coracao: Coracao;
  tecnologias: Vetor[];
  alma: number;
  versao: number;
  gravidade: number;
  frequencia: Diagnostic["frequencia"];
  permissoes: Permissao[];
  prescricao: Prescricao;
}

const round = (n: number) => Math.round(n);

// ── 6 Tecnologias: composição em dims + trilha ────────────────────
const TECH: { chave: string; nome: string; dims: DimKey[]; trilha: Trilha }[] = [
  { chave: "originalidade", nome: "Originalidade", dims: ["D2", "D10"], trilha: "Existencial" },
  { chave: "vinculo", nome: "Vínculo", dims: ["D3", "D4"], trilha: "Cultural" },
  { chave: "cuidado", nome: "Cuidado", dims: ["D6"], trilha: "Cultural" },
  { chave: "dialogo", nome: "Diálogo", dims: ["D5", "D7"], trilha: "Cultural" },
  { chave: "autogestao", nome: "Autogestão", dims: ["D9"], trilha: "Digital" },
  {
    chave: "consciencia",
    nome: "Consciência Sistêmica",
    dims: ["D8", "D11", "D12"],
    trilha: "Digital",
  },
];

const GAP = 12; // limiar pra direção do vetor

function techScore(dims: Record<DimKey, number>, keys: DimKey[]): number {
  return round(mean(keys.map((k) => dims[k])));
}

/** prática/discurso agregados das dims de uma tecnologia. */
function pratDisc(
  base: ReturnType<typeof computeDimensions>,
  keys: DimKey[]
): { prat?: number; disc?: number } {
  const pr: number[] = [];
  const di: number[] = [];
  keys.forEach((k) => {
    pr.push(...base.practice[k]);
    di.push(...base.discourse[k]);
  });
  return {
    prat: pr.length ? mean(pr) : undefined,
    disc: di.length ? mean(di) : undefined,
  };
}

function vetor(
  t: (typeof TECH)[number],
  dims: Record<DimKey, number>,
  base: ReturnType<typeof computeDimensions>
): Vetor {
  const nivel = techScore(dims, t.dims);
  const { prat, disc } = pratDisc(base, t.dims);
  let direcao: DirecaoVetor = "estável";
  let forca = 0;
  if (prat != null && disc != null) {
    const gap = disc - prat;
    forca = round(Math.abs(gap));
    if (gap > GAP) direcao = "engatilhado";
    else if (gap < -GAP) direcao = "força oculta";
  }
  let estado: EstadoVetor;
  if (nivel < 30) estado = "Ausente";
  else if (direcao === "engatilhado") estado = "Engatilhado";
  else if (nivel >= 60) estado = "Forte";
  else estado = "Frágil";
  return {
    chave: t.chave,
    nome: t.nome,
    trilha: t.trilha,
    nivel,
    direcao,
    forca,
    estado,
  };
}

// ── Permissões (a Pele) a partir do bloco estrutural ──────────────
const PERM_MAP: {
  nome: string;
  categoria: string;
  tipo: Permissao["tipo"];
  itens: number[]; // índices S
}[] = [
  { nome: "Propriedade", categoria: "recurso", tipo: "Emergência", itens: [1, 2] },
  { nome: "Transparência", categoria: "informação", tipo: "Emergência", itens: [3] },
  { nome: "Decisão coletiva", categoria: "poder", tipo: "Emergência", itens: [5] },
  { nome: "Voz no sistema", categoria: "informação", tipo: "Emergência", itens: [6] },
  { nome: "Tempo de desligar", categoria: "tempo", tipo: "Emergência", itens: [8] },
  { nome: "Autogestão", categoria: "fronteira", tipo: "Emergência", itens: [9, 10, 11] },
  { nome: "Ferramenta a favor", categoria: "ferramenta", tipo: "Ordem", itens: [7] },
];

function lerPermissoes(session: SessionData): Permissao[] {
  const s = session.respostas.structural;
  const val = (n: number): number | undefined => {
    const i = s[`S${n}`];
    return i == null ? undefined : LIKERT5[i];
  };
  return PERM_MAP.map((p) => {
    const vals = p.itens
      .map(val)
      .filter((x): x is number => x != null);
    const nivel = vals.length ? round(mean(vals)) : 0;
    return {
      nome: p.nome,
      categoria: p.categoria,
      tipo: p.tipo,
      nivel,
      segura: nivel < 45,
    };
  });
}

// ── Prescrição ────────────────────────────────────────────────────
const MATRIZ: Record<Intensidade, Record<Trilha, string>> = {
  Palestra: {
    Existencial: "Liderança no caos · Future Leaders",
    Cultural: "Teses de cultura · o fim da era Sapiens",
    Digital: "Futuro, IA e tecnologia sapiente",
  },
  Workshop: {
    Existencial: "Autoconhecimento & originalidade",
    Cultural: "Ways of working & dialogia",
    Digital: "Literacia de IA & complex skills",
  },
  Imersão: {
    Existencial: "Disrupção pessoal & propósito",
    Cultural: "Vivência de cultura (tipo Vortex)",
    Digital: "Imersão de IA aplicada",
  },
  Consultoria: {
    Existencial: "Assessment de originalidade",
    Cultural: "Redesenho de campo & governança",
    Digital: "acaso — agentes internos de apoio",
  },
  "Co-empreender": {
    Existencial: "— (sustentado pela jornada)",
    Cultural: "Jornada longa “viver junto”",
    Digital: "Loomi — sistemas & IA sob medida",
  },
};

const INTENS_ORDER: Intensidade[] = [
  "Palestra",
  "Workshop",
  "Imersão",
  "Consultoria",
  "Co-empreender",
];
const TRILHA_ORDER: Trilha[] = ["Existencial", "Cultural", "Digital"];

function intensidadePorVersao(versao: number): Intensidade {
  if (versao <= 2) return "Palestra";
  if (versao <= 4) return "Workshop";
  if (versao <= 6) return "Imersão";
  if (versao <= 8) return "Consultoria";
  return "Co-empreender";
}

function prescrever(
  view: Omit<HumanwareView, "prescricao">,
  diag: Diagnostic
): Prescricao {
  const { versao, tecnologias, permissoes } = view;

  // LINHA: frequência define a intensidade de entrada
  const intensidade = intensidadePorVersao(versao);

  // COLUNA: a trilha mais fraca, sem pular a sequência Existencial→Cultural→Digital
  const trilhaScore = (t: Trilha) => {
    if (t === "Existencial")
      return mean([
        view.coracao.presenca,
        view.coracao.intencao,
        ...tecnologias.filter((v) => v.trilha === "Existencial").map((v) => v.nivel),
      ]);
    return mean(tecnologias.filter((v) => v.trilha === t).map((v) => v.nivel));
  };
  let trilha: Trilha =
    TRILHA_ORDER.find((t) => trilhaScore(t) < 55) ??
    TRILHA_ORDER.slice()
      .sort((a, b) => trilhaScore(a) - trilhaScore(b))[0];

  // TRAVAS: vitrine ou QE vermelho disfarçado bloqueiam Digital prematuro
  let trava: string | null = null;
  const bloqueiaDigital = diag.vitrine.ativo || diag.qe.disfarcado;
  if (trilha === "Digital" && bloqueiaDigital) {
    trava = diag.vitrine.ativo
      ? "vitrine ativa — Digital agora seria construir sobre um campo doente"
      : "QE vermelho disfarçado — primeiro a raiz, depois a tecnologia";
    trilha = trilhaScore("Existencial") <= trilhaScore("Cultural")
      ? "Existencial"
      : "Cultural";
  }

  // ALAVANCA: a permissão de emergência que mais segura o campo
  const alavancaPerm =
    permissoes
      .filter((p) => p.tipo === "Emergência")
      .sort((a, b) => a.nivel - b.nivel)[0] ?? permissoes[0];

  // PRIORIDADE: tecnologia engatilhada (ganho rápido) ou a mais ausente da trilha
  const naTrilha = tecnologias.filter((v) => v.trilha === trilha);
  const engatilhada = naTrilha
    .filter((v) => v.estado === "Engatilhado")
    .sort((a, b) => b.forca - a.forca)[0];
  const maisFraca = [...naTrilha].sort((a, b) => a.nivel - b.nivel)[0];
  const foco = engatilhada ?? maisFraca;

  const primeiro_salto = `${intensidade} · ${trilha} — ${MATRIZ[intensidade][trilha]}`;

  const por_que = foco
    ? engatilhada
      ? `${foco.nome} está engatilhada (vontade represada) — é o ganho mais rápido.`
      : `${foco.nome} é o que mais pede socorro nessa trilha agora.`
    : `A trilha ${trilha} é a base que sustenta o resto.`;

  // UPSELL: próximas células não consumidas (sobe intensidade, depois trilha)
  const caminho_upsell: string[] = [];
  const iIdx = INTENS_ORDER.indexOf(intensidade);
  for (let k = iIdx + 1; k < INTENS_ORDER.length && caminho_upsell.length < 2; k++) {
    caminho_upsell.push(`${INTENS_ORDER[k]} · ${trilha} — ${MATRIZ[INTENS_ORDER[k]][trilha]}`);
  }
  const tIdx = TRILHA_ORDER.indexOf(trilha);
  for (let k = tIdx + 1; k < TRILHA_ORDER.length && caminho_upsell.length < 3; k++) {
    caminho_upsell.push(
      `Consultoria · ${TRILHA_ORDER[k]} — ${MATRIZ["Consultoria"][TRILHA_ORDER[k]]}`
    );
  }

  // ROTEAMENTO
  let roteamento: Prescricao["roteamento"] = "GZero";
  if (trilha === "Digital" && !bloqueiaDigital) {
    if (intensidade === "Co-empreender") roteamento = "GZero+Loomi";
    else if (intensidade === "Consultoria") roteamento = "GZero+acaso";
  }

  return {
    trilha,
    intensidade,
    primeiro_salto,
    por_que,
    alavanca: alavancaPerm?.nome ?? "—",
    caminho_upsell,
    roteamento,
    trava,
  };
}

export function humanwareView(
  session: SessionData,
  diag: Diagnostic
): HumanwareView {
  const base = computeDimensions(session.respostas);
  const dims = diag.dimensoes;

  const coracao: Coracao = {
    intencao: dims.D13,
    presenca: dims.D1,
  };

  const tecnologias = TECH.map((t) => vetor(t, dims, base));

  const alma = round(
    mean([dims.D1, dims.D2, dims.D3, dims.D6, dims.D13])
  );
  const versao = Math.max(1, Math.min(10, 1 + round((alma / 100) * 9)));
  const gravidade = 10 - versao;

  const permissoes = lerPermissoes(session);

  const partial: Omit<HumanwareView, "prescricao"> = {
    coracao,
    tecnologias,
    alma,
    versao,
    gravidade,
    frequencia: diag.frequencia,
    permissoes,
  };

  return { ...partial, prescricao: prescrever(partial, diag) };
}
