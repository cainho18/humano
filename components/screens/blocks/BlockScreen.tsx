"use client";

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
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-12 py-8">
        <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-rosa">
          {HEADERS[block]}
        </h2>
        {body}
        <div className="sticky bottom-6 flex justify-end pt-4">
          <RitualButton
            label={complete ? "Seguir" : "Responde tudo pra seguir"}
            fx={complete ? "fill" : "plain"}
            accent="rosa"
            disabled={!complete}
            onClick={next}
          />
        </div>
      </div>
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
