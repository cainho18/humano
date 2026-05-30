/** Banco de frases determinístico (§9.2). Fallback quando não há IA. */

const OPENINGS: Record<string, string> = {
  Maquinário: "Aqui a engrenagem gira — mas alguém paga o preço de ser peça.",
  Ofício: "Funciona como relógio. Só que relógio não tem alma — e às vezes falta.",
  Vitrine: "De fora, vocês brilham. De dentro, há uma conversa que ainda não aconteceu.",
  Chama: "Vocês ardem por dentro. A pergunta é por quanto tempo, antes de virar cinza.",
  Família: "Tem calor aqui — do tipo que abraça e às vezes aperta demais.",
  Vilarejo: "Vocês têm raiz. Crescem devagar, mas crescem firme.",
  Constelação: "Vocês são caos com alma. Cada um brilha, e de longe vira desenho.",
  Organismo: "Raro: aqui dá pra ser inteiro e funcionar ao mesmo tempo.",
};

const FREQ_CLOSE: Record<string, string> = {
  Humana: "No fundo, ainda pulsa gente aqui.",
  Máquina: "A alma anda escondida atrás do processo.",
  "em travessia": "Vocês estão no meio do rio — nem na margem velha, nem na nova.",
};

export function buildNarrative(
  arquetipo: string,
  frequencia: string,
  afinada: string,
  tensa: string
): string {
  const open = OPENINGS[arquetipo] ?? "";
  const close = FREQ_CLOSE[frequencia] ?? "";
  return `${open} O que mais sustenta vocês é ${afinada}. Onde mais aperta é ${tensa}. ${close}`.trim();
}
