import type { Answers, Profile } from "@/lib/types";
import { diagnosticNarrative, type Diagnostic } from "@/lib/scoring";
import type { HumanwareView } from "@/lib/scoring/humanware";
import { getSupabase } from "./client";

/** Versão da calibragem do motor (lib/scoring/config.ts) em vigor nesta build. */
export const SCORING_CONFIG_VERSION = "humanware-v2";
/** Versão da política/consentimento aceita no acordo (LGPD). */
export const CONSENT_POLICY_VERSION = "v1-2026-06";

type FlatResponse = { family: string; item_id: string; value: unknown };

/**
 * Achata o objeto `Answers` em linhas { family, item_id, value } para a tabela
 * `responses`. Preserva a semântica esparsa do app: item ausente = sem linha.
 */
export function flattenResponses(respostas: Answers): FlatResponse[] {
  const rows: FlatResponse[] = [];

  const pushRecord = (
    family: string,
    rec: Record<string | number, unknown>
  ) => {
    for (const [item_id, value] of Object.entries(rec)) {
      if (value === undefined || value === null || value === "") continue;
      rows.push({ family, item_id: String(item_id), value });
    }
  };

  pushRecord("scenarios", respostas.scenarios);
  pushRecord("scenariosOther", respostas.scenariosOther);
  pushRecord("sliders", respostas.sliders);
  pushRecord("priority", respostas.priority);
  pushRecord("behaviors", respostas.behaviors);
  pushRecord("thermometers", respostas.thermometers);
  pushRecord("words", respostas.words);
  pushRecord("structural", respostas.structural);

  // cards: objeto de chaves fixas; só persiste os preenchidos.
  for (const [item_id, value] of Object.entries(respostas.cards)) {
    if (typeof value === "string" && value.trim().length > 0) {
      rows.push({ family: "cards", item_id, value });
    }
  }

  return rows;
}

export interface SubmitArgs {
  perfil: Profile;
  respostas: Answers;
  diagnostic: Diagnostic;
  view: HumanwareView;
  consentAgreed: boolean;
  consentAt: string | null;
  /** true quando a sessão veio do atalho ?demo=final (dados-mock, não reais). */
  demo: boolean;
}

/**
 * Envia uma sessão concluída ao Supabase via RPC `submit_session` (validada e
 * atômica no servidor). Best-effort: erros são logados, nunca quebram a tela
 * final. Retorna o id da sessão criada, ou `null` se não enviou.
 */
export async function submitSession(args: SubmitArgs): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) {
    console.warn(
      "[HUMANWARE] Supabase não configurado (.env.local ausente) — sessão NÃO enviada."
    );
    return null;
  }

  const {
    perfil,
    respostas,
    diagnostic,
    view,
    consentAgreed,
    consentAt,
    demo,
  } = args;

  const payload = {
    session: {
      status: "completed",
      demo,
      user_agent:
        typeof navigator !== "undefined" ? navigator.userAgent : null,
      locale: typeof navigator !== "undefined" ? navigator.language : null,
      consent_agreed: consentAgreed,
      consent_at: consentAt,
      consent_policy_version: CONSENT_POLICY_VERSION,
      scoring_config_version: SCORING_CONFIG_VERSION,
      app_version: process.env.NEXT_PUBLIC_APP_VERSION ?? null,
    },
    profile: {
      nome: perfil.nome || null,
      cargo: perfil.cargo || null,
      pronome: perfil.pronome,
    },
    responses: flattenResponses(respostas),
    result: {
      archetype: diagnostic.arquetipo?.nome ?? null,
      archetype_label: diagnostic.arquetipo?.label_final ?? null,
      frequencia: diagnostic.frequencia ?? null,
      qe_faixa: diagnostic.qe?.faixa ?? null,
      dimensoes: { ...diagnostic.dimensoes, d6_detalhe: diagnostic.d6_detalhe },
      diagnostic,
      humanware_view: view,
      narrative: diagnosticNarrative(diagnostic),
      computed_by: "client",
    },
  };

  try {
    const { data, error } = await supabase.rpc("submit_session", { payload });
    if (error) {
      console.error("[HUMANWARE] falha ao enviar sessão:", error.message);
      return null;
    }
    console.log("[HUMANWARE] sessão salva no Supabase:", data);
    return (data as string) ?? null;
  } catch (e) {
    console.error("[HUMANWARE] erro inesperado ao enviar sessão:", e);
    return null;
  }
}
