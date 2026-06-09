"use client";

import { useCallback } from "react";
import { Download } from "lucide-react";
import { GZeroMark } from "@/components/ui/gzero-mark";

/**
 * Fechamento do relatório: botão que gera o PDF (via print → "Salvar como PDF",
 * com folha de estilo @media print que expande tudo e neutraliza o GSAP) +
 * assinatura GZero.
 */
export function Fechamento() {
  const handlePrint = useCallback(() => {
    if (typeof window === "undefined") return;
    // marca o documento por um instante pra a folha de print saber o título
    const prev = document.title;
    document.title = "Humanware — perfil organizacional";
    window.print();
    document.title = prev;
  }, []);

  return (
    <section
      id="fechamento"
      className="px-[var(--gutter)] py-24 text-center"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-9">
        <button
          type="button"
          onClick={handlePrint}
          className="hw-noprint group inline-flex items-center gap-3 rounded-full border-2 border-claro/25 bg-transparent px-6 py-3.5 text-base font-bold text-claro transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-claro active:scale-[0.98] fnt-body"
        >
          baixar o relatório em PDF
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-claro/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-[1px] group-hover:scale-105">
            <Download size={17} strokeWidth={2.5} />
          </span>
        </button>

        <div className="flex items-center gap-2 border-t border-claro/10 pt-7">
          <span className="fnt-mono text-[11px] uppercase tracking-[0.2em] text-claro/40">
            pesquisa humanware® · seu perfil organizacional
          </span>
          <span className="text-claro/20" aria-hidden>
            ·
          </span>
          <GZeroMark className="h-2.5 text-claro/55" />
        </div>
      </div>
    </section>
  );
}
