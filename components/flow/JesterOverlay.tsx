"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
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
          <div className="flex max-w-xl items-start gap-4 border border-amarelo/70 bg-preto/95 px-5 py-4 shadow-[0_18px_50px_-18px_rgba(255,255,0,0.4)] backdrop-blur-sm">
            <span className="text-2xl leading-none" aria-hidden>
              🃏
            </span>
            <div className="flex flex-col gap-1.5">
              <span className="hw-kicker text-amarelo/85">o bobo</span>
              <p className="font-mono text-sm leading-relaxed text-claro">
                {voc(jesterPopup)}
              </p>
            </div>
            <button
              onClick={dismissJester}
              aria-label="fechar"
              className="-mr-1 ml-2 shrink-0 cursor-pointer self-start text-amarelo/80 transition-colors hover:text-rosa"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
