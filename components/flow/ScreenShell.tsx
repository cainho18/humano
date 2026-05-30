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
}

const BG: Record<string, string> = {
  preto: "bg-preto text-claro",
  rosa: "bg-rosa text-claro",
  claro: "bg-claro text-preto",
  none: "",
};

/** Ritual wrapper: soft fade entrance, consistent layout, palette background. */
export function ScreenShell({
  children,
  className,
  bg = "preto",
  center = true,
  scroll = false,
}: ScreenShellProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className={cn(
        "min-h-dvh w-full",
        BG[bg],
        scroll ? "overflow-y-auto" : "overflow-hidden",
        center && "flex flex-col items-center justify-center",
        "px-6 py-16",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
