"use client";

import { cloneElement, useEffect, type ReactElement } from "react";
import { AnimatePresence } from "framer-motion";
import { useFlow } from "@/lib/state/AnswersContext";
import { ProgressBar } from "@/components/flow/ProgressBar";
import { JesterOverlay } from "@/components/flow/JesterOverlay";
import { RetroMap } from "@/components/flow/RetroMap";

import { OpeningCounter } from "@/components/screens/opening/OpeningCounter";
import { OpeningPortal } from "@/components/screens/opening/OpeningPortal";
import { OpeningWelcome } from "@/components/screens/opening/OpeningWelcome";
import { ProfileScreen } from "@/components/screens/entry/ProfileScreen";
import { AgreementScreen } from "@/components/screens/entry/AgreementScreen";
import { TransitionScreen } from "@/components/screens/transitions/TransitionScreen";
import { BlockScreen } from "@/components/screens/blocks/BlockScreen";
import { CardScreen } from "@/components/screens/cards/CardScreen";
import { FinalScreen } from "@/components/screens/final/FinalScreen";

const IDLE_MS = 40000;

export function FlowController() {
  const { step, stepIndex, fireIdle } = useFlow();

  // inactivity → Bobo pop-up (only on content screens)
  useEffect(() => {
    if (step.kind === "counter" || step.kind === "final") return;
    const id = setTimeout(fireIdle, IDLE_MS);
    return () => clearTimeout(id);
  }, [stepIndex, step.kind, fireIdle]);

  let screen: ReactElement = <OpeningCounter />;
  switch (step.kind) {
    case "counter":
      screen = <OpeningCounter />;
      break;
    case "portal":
      screen = <OpeningPortal />;
      break;
    case "welcome":
      screen = <OpeningWelcome />;
      break;
    case "profile":
      screen = <ProfileScreen />;
      break;
    case "agreement":
      screen = <AgreementScreen />;
      break;
    case "transition":
      screen = (
        <TransitionScreen
          transitionId={step.transitionId}
          effect={step.effect}
        />
      );
      break;
    case "block":
      screen = <BlockScreen block={step.block} />;
      break;
    case "card":
      screen = <CardScreen field={step.field} />;
      break;
    case "final":
      screen = <FinalScreen />;
      break;
  }

  return (
    <div className="relative min-h-dvh w-full">
      <ProgressBar />
      <AnimatePresence mode="wait">
        {cloneElement(screen, { key: stepIndex })}
      </AnimatePresence>
      <RetroMap />
      <JesterOverlay />
    </div>
  );
}
