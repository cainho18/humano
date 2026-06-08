import type { Answers, LikertIndex, Profile, ScenarioKey } from "@/lib/types";
import { SCENARIOS } from "@/lib/content/scenarios";
import { SLIDERS } from "@/lib/content/sliders";
import { BEHAVIORS } from "@/lib/content/behaviors";
import { THERMOMETERS } from "@/lib/content/thermometers";
import { WORDS } from "@/lib/content/words";
import { STRUCTURAL } from "@/lib/content/structural";
import { PRIORITY_CATEGORIES } from "@/lib/content/priority";

/**
 * Sessão de exemplo (organização "humanizada") pra revisar a tela final sem
 * responder o fluxo todo. Acionada por ?demo=final na URL.
 */
export const DEMO_PROFILE: Profile = {
  nome: "Equipe demo",
  cargo: "revisão",
  pronome: "ela",
};

export function demoAnswers(): Answers {
  const scenarios: Record<string, ScenarioKey> = {};
  SCENARIOS.forEach((s) => {
    scenarios[s.id] = s.id === "C15" ? "d" : "c";
  });

  const sliders: Record<number, number> = {};
  SLIDERS.forEach((s) => (sliders[s.id] = 28)); // pende pro lado humano

  const priority: Record<string, number> = {};
  const split = [25, 25, 30, 20];
  PRIORITY_CATEGORIES.forEach((c, i) => (priority[c.id] = split[i] ?? 0));

  const behaviors: Record<string, LikertIndex> = {};
  BEHAVIORS.forEach((b) => (behaviors[b.id] = 3));

  const thermometers: Record<number, number> = {};
  THERMOMETERS.forEach((t) => (thermometers[t.id] = 30));

  const words: Answers["words"] = {};
  WORDS.forEach((w) => {
    words[w.id] =
      w.type === "humana" ? "move" : w.type === "maquina" ? "fala" : "nao";
  });

  const structural: Record<string, LikertIndex> = {};
  STRUCTURAL.forEach((s) => (structural[s.id] = 3));

  return {
    scenarios,
    scenariosOther: {},
    sliders,
    priority,
    behaviors,
    thermometers,
    words,
    structural,
    cards: {
      comodo: "A cozinha — quente, bagunçada, todo mundo passa por ela.",
      fora_dentro: "Uma pergunta que nasceu de dentro e foi crescendo.",
      cena: "Numa crise, em vez de cortar gente, a liderança sentou com o time e construiu a saída junto.",
      nome_secreto: "O Formigueiro Feliz.",
    },
  };
}
