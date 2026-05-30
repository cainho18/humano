"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WORDS, WORD_SLOTS } from "@/lib/content/words";
import type { WordSlot } from "@/lib/types";
import { cn } from "@/lib/cn";

interface WordDragFieldProps {
  values: Record<string, WordSlot>;
  onAssign: (id: string, slot: WordSlot | null) => void;
}

/**
 * Espalha as palavras pelos 3 quadrantes. Toca a palavra → ela vai pro slot
 * selecionado; toca de novo dentro do slot → volta pro monte. Tap-based pra
 * funcionar no touch.
 */
export function WordDragField({ values, onAssign }: WordDragFieldProps) {
  const [picked, setPicked] = useState<string | null>(null);
  const pool = WORDS.filter((w) => !values[w.id]);

  const place = (slot: WordSlot) => {
    if (!picked) return;
    onAssign(picked, slot);
    setPicked(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* monte de palavras ainda sem lugar */}
      <div className="flex min-h-16 flex-wrap items-start gap-2 border-2 border-dashed border-claro/20 p-3">
        <AnimatePresence mode="popLayout">
          {pool.length === 0 ? (
            <span className="font-mono text-xs text-claro/40">
              todas espalhadas ✓
            </span>
          ) : (
            pool.map((w) => (
              <motion.button
                key={w.id}
                layout
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setPicked(picked === w.id ? null : w.id)}
                className={cn(
                  "border-2 px-3 py-1.5 font-mono text-sm transition-colors cursor-pointer",
                  picked === w.id
                    ? "border-amarelo bg-amarelo text-preto"
                    : "border-rosa text-rosa hover:bg-rosa hover:text-preto"
                )}
              >
                {w.label}
              </motion.button>
            ))
          )}
        </AnimatePresence>
      </div>

      {picked && (
        <p className="font-mono text-[10px] uppercase tracking-widest text-amarelo">
          agora escolhe onde &ldquo;{WORDS.find((w) => w.id === picked)?.label}
          &rdquo; vive
        </p>
      )}

      {/* os 3 quadrantes */}
      <div className="grid gap-4 md:grid-cols-3">
        {WORD_SLOTS.map((slot) => {
          const here = WORDS.filter((w) => values[w.id] === slot.id);
          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => place(slot.id)}
              className={cn(
                "flex min-h-32 flex-col gap-3 border-2 p-3 text-left transition-colors",
                picked
                  ? "border-amarelo cursor-pointer"
                  : "border-claro/20 cursor-default"
              )}
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-claro/50">
                {slot.label}
              </span>
              <div className="flex flex-wrap gap-2">
                <AnimatePresence mode="popLayout">
                  {here.map((w) => (
                    <motion.span
                      key={w.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAssign(w.id, null);
                      }}
                      className="cursor-pointer border-2 border-claro/40 px-2.5 py-1 font-mono text-xs text-claro hover:border-rosa hover:text-rosa"
                    >
                      {w.label}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
