"use client";

import { cloneElement, useEffect, type ReactElement } from "react";
import { AnimatePresence } from "framer-motion";
import { useFlow } from "@/lib/state/AnswersContext";
import { ProgressBar } from "@/components/flow/ProgressBar";
import { JesterOverlay } from "@/components/flow/JesterOverlay";
import { RetroMap } from "@/components/flow/RetroMap";
import { Signature } from "@/components/flow/Signature";
import { EdgeBlur } from "@/components/ui/edge-blur";

import { LogoLoader } from "@/components/screens/opening/LogoLoader";
import { OpeningPortal } from "@/components/screens/opening/OpeningPortal";
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

  let screen: ReactElement = <LogoLoader />;
  switch (step.kind) {
    case "counter":
      screen = <LogoLoader />;
      break;
    case "portal":
      screen = <OpeningPortal />;
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

  // a tela final é uma página própria, publicável — sem chrome da pesquisa
  const isFinal = step.kind === "final";
  // edge blur em toda a pesquisa, menos na página inicial (loader/portal)
  const showEdgeBlur = step.kind !== "counter" && step.kind !== "portal";

  return (
    <div className="relative min-h-dvh w-full">
      {!isFinal && <ProgressBar />}
      <AnimatePresence mode="wait">
        {cloneElement(screen, { key: stepIndex })}
      </AnimatePresence>
      {showEdgeBlur && <EdgeBlur />}
      {!isFinal && <RetroMap />}
      <JesterOverlay />
      <Signature />
    </div>
  );
}
