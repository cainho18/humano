import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase do navegador (singleton).
 *
 * Usa a chave *publishable* (pública por design). Nenhuma escrita direta em
 * tabela acontece pelo cliente: toda gravação passa pela RPC `submit_session`,
 * que valida o consentimento e escreve as 4 tabelas numa única transação no
 * servidor. Sem auth/persistência de sessão — a pesquisa é anônima.
 *
 * Retorna `null` quando as variáveis de ambiente não estão configuradas, para
 * que o app continue funcionando (sem persistir) em ambientes sem `.env.local`.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!url || !publishableKey) return null;
  if (!client) {
    client = createClient(url, publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

export const isSupabaseConfigured = Boolean(url && publishableKey);
