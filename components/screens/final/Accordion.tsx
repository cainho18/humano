"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";

const EASE = [0.32, 0.72, 0, 1] as const;

interface AccordionProps {
  title: string;
  subtitle?: string;
  /** selo curto à direita (ex.: estado do vetor) */
  badge?: string;
  badgeClass?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

/** Gaveta acessível (button aria-expanded, height auto animado, foco visível). */
export function Accordion({
  title,
  subtitle,
  badge,
  badgeClass,
  children,
  defaultOpen = false,
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className="border-b border-claro/15">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="group flex w-full items-center gap-4 py-5 text-left"
      >
        <span className="flex-1">
          <span className="flex items-center gap-3">
            <span className="font-display text-lg text-claro md:text-xl">
              {title}
            </span>
            {badge && (
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em]",
                  badgeClass ?? "border-claro/30 text-claro/60"
                )}
              >
                {badge}
              </span>
            )}
          </span>
          {subtitle && (
            <span className="mt-1 block font-mono text-xs leading-relaxed text-claro/50">
              {subtitle}
            </span>
          )}
        </span>
        <Plus
          size={18}
          className={cn(
            "shrink-0 text-rosa transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
            open && "rotate-45"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-6 font-mono text-sm leading-relaxed text-claro/70">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
