"use client";

import { useId, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/cn";

interface ExpandCardProps {
  /** conteúdo do cabeçalho (sempre visível) — recebe o estado aberto */
  header: (open: boolean) => React.ReactNode;
  /** conteúdo revelado */
  children: React.ReactNode;
  className?: string;
  /** rótulo acessível do botão */
  label: string;
  defaultOpen?: boolean;
}

/**
 * Card expansível acessível: o cabeçalho inteiro é um <button> com
 * aria-expanded; o corpo abre via grid-rows (sem CLS, GPU-safe). Teclado ok.
 */
export function ExpandCard({
  header,
  children,
  className,
  label,
  defaultOpen = false,
}: ExpandCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className={cn("group/exp", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={label}
        className="w-full cursor-pointer text-left"
      >
        {header(open)}
      </button>
      <div
        id={panelId}
        role="region"
        // ao terminar a expansão/colapso, recomputa os gatilhos de scroll
        // (evita que seções pinadas abaixo fiquem com posição stale → overlap)
        onTransitionEnd={() => ScrollTrigger.refresh()}
        className={cn(
          "grid transition-[grid-template-rows] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
