"use client";

import { ScreenShell } from "@/components/flow/ScreenShell";
import { RitualButton } from "@/components/ui/button-fx";
import { useFlow } from "@/lib/state/AnswersContext";
import { cn } from "@/lib/cn";
import type { Pronoun } from "@/lib/types";

const PRONOUNS: { value: Pronoun; label: string }[] = [
  { value: "ele", label: "ele/dele" },
  { value: "ela", label: "ela/dela" },
  { value: "outro", label: "outro" },
  { value: "prefiro_nao_dizer", label: "prefiro não dizer" },
];

/** Tela 03 — quem é você (nome, cargo, pronome → vocativo do Bobo). */
export function ProfileScreen() {
  const { perfil, setPerfil, next } = useFlow();
  const ready = perfil.nome.trim().length > 0 && perfil.pronome != null;

  const field =
    "w-full border-b-2 border-claro/20 bg-transparent pb-2 font-display text-2xl text-claro placeholder:text-claro/30 focus:border-rosa focus:outline-none";

  return (
    <ScreenShell bg="preto" scroll>
      <div className="mx-auto flex w-full max-w-xl flex-col gap-10">
        <header className="flex flex-col gap-3">
          <h1 className="font-display text-3xl leading-tight md:text-4xl">
            Antes de entrar, deixa eu saber com quem tô falando.
          </h1>
          <p className="font-mono text-sm leading-relaxed text-claro/60">
            Nada de muito formal. Só pra eu não te tratar como número — que é
            justamente o que a gente tá aqui pra combater.
          </p>
        </header>

        <label className="flex flex-col gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-claro/50">
            Como te chamam?
          </span>
          <input
            type="text"
            value={perfil.nome}
            onChange={(e) => setPerfil({ nome: e.target.value })}
            placeholder="seu nome"
            className={field}
            autoFocus
          />
        </label>

        <label className="flex flex-col gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-claro/50">
            O que você faz nesse rolê?
          </span>
          <input
            type="text"
            value={perfil.cargo}
            onChange={(e) => setPerfil({ cargo: e.target.value })}
            placeholder="cargo / função"
            className={field}
          />
        </label>

        <fieldset className="flex flex-col gap-3">
          <legend className="font-mono text-xs uppercase tracking-widest text-claro/50">
            Como você quer ser tratado aqui dentro?
          </legend>
          <div className="flex flex-wrap gap-3">
            {PRONOUNS.map((p) => {
              const active = perfil.pronome === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPerfil({ pronome: p.value })}
                  aria-pressed={active}
                  className={cn(
                    "border-2 px-4 py-2 font-mono text-sm lowercase transition-colors cursor-pointer",
                    active
                      ? "border-rosa bg-rosa text-preto"
                      : "border-claro/30 text-claro/70 hover:border-rosa hover:text-claro"
                  )}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="pt-2">
          <RitualButton
            label="Seguir"
            fx="scramble"
            accent="rosa"
            disabled={!ready}
            onClick={next}
          />
        </div>
      </div>
    </ScreenShell>
  );
}
