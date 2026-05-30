"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useFlow } from "@/lib/state/AnswersContext";

/** Dynamic Bobo pop-up (fast answers / same option / inactivity). */
export function JesterOverlay() {
  const { jesterPopup, dismissJester, voc } = useFlow();

  return (
    <AnimatePresence>
      {jesterPopup && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-50 flex justify-center p-4"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
        >
          <div className="flex max-w-xl items-start gap-3 border-2 border-amarelo bg-preto/95 px-5 py-4 shadow-[0_0_30px_rgba(255,255,0,0.25)]">
            <span className="text-2xl leading-none" aria-hidden>
              🃏
            </span>
            <p className="font-mono text-sm leading-relaxed text-claro">
              {voc(jesterPopup)}
            </p>
            <button
              onClick={dismissJester}
              aria-label="fechar"
              className="ml-2 shrink-0 cursor-pointer self-start text-amarelo hover:text-rosa"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
