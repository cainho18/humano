"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface ScreenShellProps {
  children: React.ReactNode;
  className?: string;
  /** background variant */
  bg?: "preto" | "rosa" | "claro" | "none";
  /** vertically/horizontally centered content (default true) */
  center?: boolean;
  /** allow the screen to scroll (welcome, long blocks) */
  scroll?: boolean;
  /** ambient radial glow behind content (palette-safe) */
  glow?: "rosa" | "amarelo" | null;
}

const BG: Record<string, string> = {
  preto: "bg-preto text-claro",
  rosa: "bg-rosa text-claro",
  claro: "bg-claro text-preto",
  none: "",
};

const GLOW: Record<string, string> = {
  rosa: "rgba(255,0,170,0.16)",
  amarelo: "rgba(255,255,0,0.10)",
};

/** Ritual wrapper: soft fade entrance, consistent layout, palette background. */
export function ScreenShell({
  children,
  className,
  bg = "preto",
  center = true,
  scroll = false,
  glow = null,
}: ScreenShellProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        // flex-col + my-auto no conteúdo: centra quando cabe, rola natural
        // (scroll do documento) quando é alto — sem nested-scroll travado.
        "relative flex min-h-dvh w-full flex-col",
        BG[bg],
        !scroll && "overflow-hidden",
        "px-[var(--gutter)] py-24",
        className
      )}
    >
      {glow && (
        <div
          aria-hidden
          className="hw-breathe pointer-events-none absolute inset-0 -z-0"
          style={{
            background: `radial-gradient(50% 42% at 50% 38%, ${GLOW[glow]}, transparent 72%)`,
          }}
        />
      )}
      <div className={cn("relative z-10 w-full", center && "my-auto")}>
        {children}
      </div>
    </motion.div>
  );
}
