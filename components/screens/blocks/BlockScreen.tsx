"use client";

import { motion } from "framer-motion";
import { ScreenShell } from "@/components/flow/ScreenShell";
import { RitualButton } from "@/components/ui/button-fx";
import { useFlow } from "@/lib/state/AnswersContext";
import type { BlockId } from "@/lib/flow/steps";

import { ScenarioChoice } from "@/components/inputs/ScenarioChoice";
import { BipolarSlider } from "@/components/inputs/BipolarSlider";
import { LikertScale } from "@/components/inputs/LikertScale";
import { PointsAllocator } from "@/components/inputs/PointsAllocator";
import { WordDragField } from "@/components/inputs/WordDragField";

import { SCENARIOS } from "@/lib/content/scenarios";
import { SLIDERS } from "@/lib/content/sliders";
import { PRIORITY_CATEGORIES, PRIORITY_TOTAL } from "@/lib/content/priority";
import { BEHAVIORS, BEHAVIOR_SCALE } from "@/lib/content/behaviors";
import { THERMOMETERS } from "@/lib/content/thermometers";
import { WORDS } from "@/lib/content/words";
import { STRUCTURAL, STRUCTURAL_SCALE } from "@/lib/content/structural";

const HEADERS: Record<BlockId, string> = {
  scenarios: "Cenas do dia a dia",
  sliders: "O que puxa pra cada lado",
  priority: "Onde a grana, o tempo e a atenção vão",
  behaviors: "Os últimos 90 dias",
  thermometers: "Onde a sua organização vive",
  words: "O jogo das palavras",
  structural: "A engrenagem por baixo",
};

/** Número editorial de cada bloco (1–7), pra dar ritmo de capítulo. */
const BLOCK_NUM: Record<BlockId, string> = {
  scenarios: "01",
  sliders: "02",
  priority: "03",
  behaviors: "04",
  thermometers: "05",
  words: "06",
  structural: "07",
};

const KICKER: Record<BlockId, string> = {
  scenarios: "cena",
  sliders: "tensão",
  priority: "alocação",
  behaviors: "rastro",
  thermometers: "termômetro",
  words: "palavra",
  structural: "engrenagem",
};

/** Lembrete curto de como responder — fica visível durante o bloco. */
const SUBHEADS: Partial<Record<BlockId, string>> = {
  sliders:
    "Os dois lados importam — não tem certo nem errado. Arrasta a bolinha pro ponto que é a verdade da sua organização, não pro ponto bonito.",
  thermometers:
    "Não é sobre o ideal. É sobre onde a sua organização realmente vive, hoje, entre um polo e outro.",
};

/** Dispatcher dos 7 blocos macro. Botão de avanço só libera quando completo. */
export function BlockScreen({ block }: { block: BlockId }) {
  const flow = useFlow();
  const { respostas, next, noteAnswer } = flow;

  let body: React.ReactNode = null;
  let complete = false;

  switch (block) {
    case "scenarios": {
      complete = SCENARIOS.every((s) => respostas.scenarios[s.id]);
      body = (
        <div className="flex flex-col gap-16">
          {SCENARIOS.map((s) => (
            <ScenarioChoice
              key={s.id}
              scenario={s}
              value={respostas.scenarios[s.id]}
              onChange={(key) => {
                flow.setScenario(s.id, key);
                noteAnswer(key);
              }}
            />
          ))}
        </div>
      );
      break;
    }

    case "sliders": {
      complete = SLIDERS.every((s) => respostas.sliders[s.id] != null);
      body = (
        <div className="flex flex-col gap-12">
          {SLIDERS.map((s) => (
            <BipolarSlider
              key={s.id}
              left={s.left}
              right={s.right}
              value={respostas.sliders[s.id]}
              onChange={(v) => flow.setSlider(s.id, v)}
              onCommit={() =>
                noteAnswer(bucket(respostas.sliders[s.id] ?? 50))
              }
            />
          ))}
        </div>
      );
      break;
    }

    case "priority": {
      const used = PRIORITY_CATEGORIES.reduce(
        (sum, c) => sum + (respostas.priority[c.id] ?? 0),
        0
      );
      complete = used === PRIORITY_TOTAL;
      body = (
        <PointsAllocator
          values={respostas.priority}
          onChange={(id, v) => flow.setPriority(id, v)}
        />
      );
      break;
    }

    case "behaviors": {
      complete = BEHAVIORS.every((b) => respostas.behaviors[b.id] != null);
      body = (
        <div className="flex flex-col gap-12">
          {BEHAVIORS.map((b) => (
            <div key={b.id} className="flex flex-col gap-4">
              <p className="font-display text-lg leading-snug md:text-xl">
                {b.text}
              </p>
              <LikertScale
                scale={BEHAVIOR_SCALE}
                value={respostas.behaviors[b.id]}
                onChange={(v) => {
                  flow.setBehavior(b.id, v);
                  noteAnswer(String(v));
                }}
              />
            </div>
          ))}
        </div>
      );
      break;
    }

    case "thermometers": {
      complete = THERMOMETERS.every((t) => respostas.thermometers[t.id] != null);
      body = (
        <div className="flex flex-col gap-12">
          {THERMOMETERS.map((t) => (
            <BipolarSlider
              key={t.id}
              question={t.question}
              left={t.left}
              right={t.right}
              value={respostas.thermometers[t.id]}
              onChange={(v) => flow.setThermometer(t.id, v)}
              onCommit={() =>
                noteAnswer(bucket(respostas.thermometers[t.id] ?? 50))
              }
            />
          ))}
        </div>
      );
      break;
    }

    case "words": {
      complete = WORDS.every((w) => respostas.words[w.id]);
      body = (
        <WordDragField
          values={respostas.words}
          onAssign={(id, slot) => {
            flow.setWord(id, slot);
            if (slot) noteAnswer(slot);
          }}
        />
      );
      break;
    }

    case "structural": {
      complete = STRUCTURAL.every((s) => respostas.structural[s.id] != null);
      body = (
        <div className="flex flex-col gap-12">
          {STRUCTURAL.map((s) => (
            <div key={s.id} className="flex flex-col gap-3">
              <p className="font-display text-lg leading-snug md:text-xl">
                {s.title}
              </p>
              <p className="font-mono text-xs leading-relaxed text-claro/55">
                {s.sub}
              </p>
              <LikertScale
                scale={STRUCTURAL_SCALE}
                value={respostas.structural[s.id]}
                onChange={(v) => {
                  flow.setStructural(s.id, v);
                  noteAnswer(String(v));
                }}
              />
            </div>
          ))}
        </div>
      );
      break;
    }
  }

  return (
    <ScreenShell bg="preto" scroll center={false}>
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex w-full max-w-2xl flex-col gap-14 py-6"
      >
        <header className="flex flex-col gap-5">
          <div className="flex items-baseline gap-4">
            <span
              className="hw-title tabular leading-none text-rosa/90"
              style={{ fontSize: "var(--text-h1)" }}
            >
              {BLOCK_NUM[block]}
            </span>
            <div className="flex flex-1 flex-col gap-2 pb-1">
              <span className="hw-kicker text-claro/40">
                {KICKER[block]} · {BLOCK_NUM[block]}/07
              </span>
              <h2
                className="hw-title text-claro"
                style={{ fontSize: "var(--text-h3)" }}
              >
                {HEADERS[block]}
              </h2>
            </div>
          </div>
          {SUBHEADS[block] && (
            <p className="max-w-[58ch] border-l border-rosa/40 pl-4 font-mono text-xs leading-relaxed text-claro/60">
              {SUBHEADS[block]}
            </p>
          )}
          <div className="hw-rule" />
        </header>
        {body}
        <div className="sticky bottom-6 z-20 flex items-center justify-between gap-4 pt-4">
          <span className="hw-kicker text-claro/30">
            {complete ? "completo" : "responde tudo pra seguir"}
          </span>
          <RitualButton
            label={complete ? "Seguir" : "Falta responder"}
            fx={complete ? "fill" : "plain"}
            accent="rosa"
            disabled={!complete}
            onClick={next}
          />
        </div>
      </motion.div>
    </ScreenShell>
  );
}

/** quantiza um valor 0..100 em rótulo de posição (telemetria do Bobo). */
function bucket(v: number): string {
  if (v < 20) return "e0";
  if (v < 40) return "e1";
  if (v < 60) return "m";
  if (v < 80) return "d1";
  return "d0";
}
