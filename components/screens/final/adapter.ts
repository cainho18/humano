/**
 * Adaptador: saída do motor (Diagnostic + HumanwareView) → view model da
 * tela final. NÃO recalcula score; só mapeia + casa com o conteúdo textual.
 * Esconde tudo que é cálculo interno (QE, modificadores, falam×movem, D[n]).
 */

import type { Diagnostic } from "@/lib/scoring";
import type { HumanwareView, Vetor } from "@/lib/scoring/humanware";
import {
  ARQUETIPOS,
  ARQ_CONTEUDO,
  CONTEUDOS,
  ESTADO_NOTA,
  GRAVIDADE_ESTADO,
  PERM_INFO,
  TECH_INFO,
  TEC_CONTEUDO,
  type ArquetipoCopy,
  type Conteudo,
} from "@/lib/content/final";

/** nível abaixo disto = bug (brecha); igual/acima = firewall (proteção). */
const BUG_THRESHOLD = 55;

export interface TechVM {
  chave: string;
  nome: string;
  nivel: number;
  estado: Vetor["estado"];
  campo: "sub" | "obj";
  oque: string;
  porque: string;
  dims: string[];
  chakra: { regiao: string; x: number; y: number };
}

export interface BFVM {
  nome: string;
  nivel: number;
  oque: string;
  body: string;
  tipo: "bug" | "fire";
  crit: boolean; // bug prioridade (menor nível)
  strong: boolean; // firewall mais forte (maior nível)
}

export interface SaltoVM {
  intensidade: string;
  trilha: string;
  oferta: string;
  porque: string;
  bugPrioridade: string;
  trava: string | null;
  caminho: string[];
}

/** pílula de conteúdo + por que ela foi indicada a este perfil */
export interface PillVM extends Conteudo {
  motivo: string;
}

export interface FinalViewModel {
  arquetipo: { nome: string; essencia: string; copy: ArquetipoCopy };
  gravidade: { g: number; estado: string; descricao: string; fillPct: number };
  tecnologias: TechVM[];
  bugs: BFVM[];
  salto: SaltoVM;
  conteudos: PillVM[];
}

const FALLBACK: ArquetipoCopy = {
  essencia: "",
  retrato: [],
  fortes: [],
  atencao: [],
  exemplos: [],
};

export function buildFinalView(
  diag: Diagnostic,
  view: HumanwareView
): FinalViewModel {
  const nome = diag.arquetipo.nome;
  const copy = ARQUETIPOS[nome] ?? FALLBACK;

  // ── gravidade ──
  const g = view.gravidade;
  const estado = view.frequencia; // "Humana" | "Máquina" | "em travessia"
  const gravidade = {
    g,
    estado,
    descricao: GRAVIDADE_ESTADO[estado] ?? "",
    fillPct: Math.max(0, Math.min(100, ((10 - g) / 10) * 100)),
  };

  // ── tecnologias (corpo + radar + cards) ──
  const tecnologias: TechVM[] = view.tecnologias.map((t) => {
    const info = TECH_INFO[t.chave];
    return {
      chave: t.chave,
      nome: t.nome,
      nivel: t.nivel,
      estado: t.estado,
      campo: info?.campo ?? "sub",
      oque: info?.oque ?? "",
      porque: ESTADO_NOTA[t.estado] ?? "",
      dims: info?.dims ?? [],
      chakra: info?.chakra ?? { regiao: "", x: 50, y: 50 },
    };
  });

  // ── bugs & firewalls ──
  const perms = view.permissoes.map((p) => ({
    nome: p.nome,
    nivel: p.nivel,
    oque: PERM_INFO[p.nome] ?? "",
    tipo: (p.nivel < BUG_THRESHOLD ? "bug" : "fire") as "bug" | "fire",
  }));

  // prioridade = bug de menor nível; firewall forte = maior nível
  let critNome: string | null = null;
  let critNivel = Infinity;
  let strongNome: string | null = null;
  let strongNivel = -Infinity;
  for (const p of perms) {
    if (p.tipo === "bug" && p.nivel < critNivel) {
      critNivel = p.nivel;
      critNome = p.nome;
    }
    if (p.tipo === "fire" && p.nivel > strongNivel) {
      strongNivel = p.nivel;
      strongNome = p.nome;
    }
  }

  const bugs: BFVM[] = perms.map((p) => {
    const crit = p.nome === critNome;
    const verdict =
      p.tipo === "bug"
        ? " Está furado — é uma brecha que deixa a frequência-máquina entrar."
        : " Protegido — segura a frequência humana do campo.";
    const tail = crit ? " Comece por aqui." : "";
    return {
      nome: p.nome,
      nivel: p.nivel,
      oque: p.oque,
      body: p.oque + verdict + tail,
      tipo: p.tipo,
      crit,
      strong: p.nome === strongNome,
    };
  });

  // ── salto ──
  const rx = view.prescricao;
  const oferta = rx.primeiro_salto.split("—").slice(1).join("—").trim() || rx.primeiro_salto;
  const salto: SaltoVM = {
    intensidade: rx.intensidade,
    trilha: `Trilha ${rx.trilha}`,
    oferta,
    porque: rx.por_que,
    bugPrioridade: critNome ?? rx.alavanca,
    trava: rx.trava,
    caminho: rx.caminho_upsell,
  };

  // ── conteúdos (4 pílulas conforme o perfil) ──
  // 1 da identidade do arquétipo + 3 das tecnologias mais frágeis (deduplicado).
  const fracas = [...tecnologias]
    .sort((a, b) => a.nivel - b.nivel)
    .map((t) => t.chave);

  const picks: PillVM[] = [];
  const usados = new Set<string>();
  const add = (id: string | undefined, motivo: string) => {
    if (!id || usados.has(id)) return;
    const c = CONTEUDOS[id];
    if (!c) return;
    usados.add(id);
    picks.push({ ...c, motivo });
  };

  add(ARQ_CONTEUDO[nome], `pra quem é ${nome}`);
  for (const chave of fracas) {
    if (picks.length >= 4) break;
    const tec = tecnologias.find((t) => t.chave === chave);
    add(
      TEC_CONTEUDO[chave],
      tec ? `pra fortalecer ${tec.nome.toLowerCase()}` : "pra crescer"
    );
  }
  // garante 4 cards mesmo se houver colisões
  if (picks.length < 4) {
    for (const id of Object.keys(CONTEUDOS)) {
      if (picks.length >= 4) break;
      add(id, "leitura pro próximo salto");
    }
  }
  const conteudos = picks.slice(0, 4);

  return {
    arquetipo: { nome, essencia: copy.essencia, copy },
    gravidade,
    tecnologias,
    bugs,
    salto,
    conteudos,
  };
}
