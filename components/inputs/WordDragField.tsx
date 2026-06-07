"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { X } from "lucide-react";
import { WORDS, WORD_SLOTS } from "@/lib/content/words";
import type { WordSlot } from "@/lib/types";
import { cn } from "@/lib/cn";

interface WordDragFieldProps {
  values: Record<string, WordSlot>;
  onAssign: (id: string, slot: WordSlot | null) => void;
}

type Zone = WordSlot | "pool";

/**
 * Palavras nos 3 quadrantes. Funciona por DRAG (arrasta a palavra pro quadrante
 * ou de um quadrante pra outro) e por TAP (toca a palavra → toca o quadrante).
 * Tocar numa palavra já alocada só a SELECIONA; o ×  no canto devolve ao monte.
 */
export function WordDragField({ values, onAssign }: WordDragFieldProps) {
  const [picked, setPicked] = useState<string | null>(null);
  const poolRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const pool = WORDS.filter((w) => !values[w.id]);

  const within = (el: HTMLElement | null, x: number, y: number) => {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  };

  const hitZone = (x: number, y: number): Zone | null => {
    for (const s of WORD_SLOTS) {
      if (within(slotRefs.current[s.id], x, y)) return s.id;
    }
    if (within(poolRef.current, x, y)) return "pool";
    return null;
  };

  const handleDragEnd = (id: string) => (_: unknown, info: PanInfo) => {
    const z = hitZone(info.point.x, info.point.y);
    if (z === "pool") onAssign(id, null);
    else if (z) onAssign(id, z);
    setPicked(null);
  };

  // tap numa palavra: do monte → seleciona; já alocada → seleciona (não volta)
  const tapWord = (id: string) =>
    setPicked((p) => (p === id ? null : id));

  // tap num quadrante: se há palavra selecionada, move pra cá
  const tapSlot = (slot: WordSlot) => {
    if (picked) {
      onAssign(picked, slot);
      setPicked(null);
    }
  };

  const Chip = ({ id, label, placed }: { id: string; label: string; placed: boolean }) => (
    <motion.div
      layout
      drag
      dragSnapToOrigin
      dragElastic={0.15}
      whileDrag={{ scale: 1.12, zIndex: 50 }}
      onDragEnd={handleDragEnd(id)}
      onTap={() => tapWord(id)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={cn(
        "relative inline-flex cursor-grab touch-none select-none items-center border px-3.5 py-2 font-mono text-sm transition-colors active:cursor-grabbing",
        picked === id
          ? "border-amarelo bg-amarelo text-preto shadow-[0_10px_28px_-14px_rgba(255,255,0,0.8)]"
          : placed
            ? "border-claro/35 text-claro hover:border-claro/60"
            : "border-rosa/70 text-rosa hover:border-rosa hover:bg-rosa/5"
      )}
    >
      {label}
      {placed && (
        <button
          type="button"
          aria-label={`devolver ${label} ao monte`}
          onPointerDownCapture={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onAssign(id, null);
            if (picked === id) setPicked(null);
          }}
          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-claro/40 bg-preto text-claro hover:border-rosa hover:text-rosa"
        >
          <X size={11} strokeWidth={3} />
        </button>
      )}
    </motion.div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* monte de palavras ainda sem lugar */}
      <div
        ref={poolRef}
        className="flex min-h-16 flex-wrap items-start gap-3 border border-dashed border-claro/25 p-4"
      >
        <AnimatePresence mode="popLayout">
          {pool.length === 0 ? (
            <span className="hw-kicker text-claro/40">todas espalhadas ✓</span>
          ) : (
            pool.map((w) => (
              <Chip key={w.id} id={w.id} label={w.label} placed={false} />
            ))
          )}
        </AnimatePresence>
      </div>

      <p className="hw-kicker text-amarelo/75">
        arrasta a palavra pro lugar — ou toca nela e depois no quadrante
      </p>

      {/* os 3 quadrantes */}
      <div className="grid gap-4 md:grid-cols-3">
        {WORD_SLOTS.map((slot) => {
          const here = WORDS.filter((w) => values[w.id] === slot.id);
          return (
            <div
              key={slot.id}
              ref={(el) => {
                slotRefs.current[slot.id] = el;
              }}
              onClick={() => tapSlot(slot.id)}
              className={cn(
                "flex min-h-32 flex-col gap-3 border p-4 text-left transition-colors",
                picked
                  ? "border-amarelo bg-amarelo/[0.04]"
                  : "border-claro/15 hover:border-claro/30"
              )}
            >
              <span className="hw-kicker text-claro/45">{slot.label}</span>
              <div className="flex flex-wrap gap-3">
                <AnimatePresence mode="popLayout">
                  {here.map((w) => (
                    <Chip key={w.id} id={w.id} label={w.label} placed />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
