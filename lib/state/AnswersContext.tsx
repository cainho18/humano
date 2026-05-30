"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Answers,
  emptyAnswers,
  LikertIndex,
  Profile,
  ScenarioKey,
  SessionData,
  WordSlot,
} from "@/lib/types";
import { STEPS, Step } from "@/lib/flow/steps";
import { applyVocative } from "@/lib/vocative";
import { JESTER_POPUPS, JesterPopup } from "@/lib/content/jester";

interface AnswersCtx {
  perfil: Profile;
  respostas: Answers;
  setPerfil: (p: Partial<Profile>) => void;
  setScenario: (id: string, key: ScenarioKey) => void;
  setSlider: (id: number, value: number) => void;
  setPriority: (id: string, value: number) => void;
  setBehavior: (id: string, value: LikertIndex) => void;
  setThermometer: (id: number, value: number) => void;
  setWord: (id: string, slot: WordSlot | null) => void;
  setStructural: (id: string, value: LikertIndex) => void;
  setCard: (field: keyof Answers["cards"], value: string) => void;

  // flow
  stepIndex: number;
  step: Step;
  next: () => void;
  back: () => void;
  canBack: boolean;
  totalSteps: number;

  // bobo
  voc: (text: string) => string;
  jesterPopup: string | null;
  noteAnswer: (position?: string) => void;
  fireIdle: () => void;
  dismissJester: () => void;

  logSession: () => SessionData;
}

const Ctx = createContext<AnswersCtx | null>(null);

const MAX_POPUPS = 2;

export function AnswersProvider({ children }: { children: React.ReactNode }) {
  const [perfil, setPerfilState] = useState<Profile>({
    nome: "",
    cargo: "",
    pronome: null,
  });
  const [respostas, setRespostas] = useState<Answers>(emptyAnswers);
  const [stepIndex, setStepIndex] = useState(0);
  const [jesterPopup, setJesterPopup] = useState<string | null>(null);

  // bobo telemetry
  const lastAnswerAt = useRef<number>(0);
  const fastStreak = useRef(0);
  const lastPosition = useRef<string | null>(null);
  const samePositionStreak = useRef(0);
  const popupsShown = useRef(0);

  const setPerfil = useCallback((p: Partial<Profile>) => {
    setPerfilState((prev) => ({ ...prev, ...p }));
  }, []);

  const setScenario = useCallback((id: string, key: ScenarioKey) => {
    setRespostas((r) => ({ ...r, scenarios: { ...r.scenarios, [id]: key } }));
  }, []);
  const setSlider = useCallback((id: number, value: number) => {
    setRespostas((r) => ({ ...r, sliders: { ...r.sliders, [id]: value } }));
  }, []);
  const setPriority = useCallback((id: string, value: number) => {
    setRespostas((r) => ({ ...r, priority: { ...r.priority, [id]: value } }));
  }, []);
  const setBehavior = useCallback((id: string, value: LikertIndex) => {
    setRespostas((r) => ({ ...r, behaviors: { ...r.behaviors, [id]: value } }));
  }, []);
  const setThermometer = useCallback((id: number, value: number) => {
    setRespostas((r) => ({
      ...r,
      thermometers: { ...r.thermometers, [id]: value },
    }));
  }, []);
  const setWord = useCallback((id: string, slot: WordSlot | null) => {
    setRespostas((r) => {
      const words = { ...r.words };
      if (slot === null) delete words[id];
      else words[id] = slot;
      return { ...r, words };
    });
  }, []);
  const setStructural = useCallback((id: string, value: LikertIndex) => {
    setRespostas((r) => ({
      ...r,
      structural: { ...r.structural, [id]: value },
    }));
  }, []);
  const setCard = useCallback(
    (field: keyof Answers["cards"], value: string) => {
      setRespostas((r) => ({ ...r, cards: { ...r.cards, [field]: value } }));
    },
    []
  );

  const showPopup = useCallback((id: JesterPopup["id"]) => {
    if (popupsShown.current >= MAX_POPUPS) return;
    popupsShown.current += 1;
    setJesterPopup(JESTER_POPUPS[id]);
  }, []);

  const noteAnswer = useCallback(
    (position?: string) => {
      const now = Date.now();
      const gap = now - lastAnswerAt.current;
      lastAnswerAt.current = now;

      // fast streak (<2s between consecutive items)
      if (gap < 2000 && gap > 0) fastStreak.current += 1;
      else fastStreak.current = 0;

      // same-option streak
      if (position != null) {
        if (position === lastPosition.current) samePositionStreak.current += 1;
        else samePositionStreak.current = 1;
        lastPosition.current = position;
      }

      if (fastStreak.current >= 3) {
        fastStreak.current = 0;
        showPopup("fast");
      } else if (samePositionStreak.current >= 4) {
        samePositionStreak.current = 0;
        showPopup("same");
      }
    },
    [showPopup]
  );

  const fireIdle = useCallback(() => showPopup("idle"), [showPopup]);
  const dismissJester = useCallback(() => setJesterPopup(null), []);

  const next = useCallback(() => {
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    setJesterPopup(null);
  }, []);
  const back = useCallback(() => {
    setStepIndex((i) => Math.max(i - 1, 0));
    setJesterPopup(null);
  }, []);

  const voc = useCallback(
    (text: string) => applyVocative(text, perfil.pronome),
    [perfil.pronome]
  );

  const logSession = useCallback((): SessionData => {
    const data: SessionData = { perfil, respostas };
    console.log("[HUMANWARE] sessão concluída:", data);
    return data;
  }, [perfil, respostas]);

  const value = useMemo<AnswersCtx>(
    () => ({
      perfil,
      respostas,
      setPerfil,
      setScenario,
      setSlider,
      setPriority,
      setBehavior,
      setThermometer,
      setWord,
      setStructural,
      setCard,
      stepIndex,
      step: STEPS[stepIndex],
      next,
      back,
      canBack: stepIndex > 0,
      totalSteps: STEPS.length,
      voc,
      jesterPopup,
      noteAnswer,
      fireIdle,
      dismissJester,
      logSession,
    }),
    [
      perfil,
      respostas,
      setPerfil,
      setScenario,
      setSlider,
      setPriority,
      setBehavior,
      setThermometer,
      setWord,
      setStructural,
      setCard,
      stepIndex,
      next,
      back,
      voc,
      jesterPopup,
      noteAnswer,
      fireIdle,
      dismissJester,
      logSession,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFlow() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFlow must be used within AnswersProvider");
  return ctx;
}
