"use client";

import { motion } from "framer-motion";
import { ScreenShell } from "@/components/flow/ScreenShell";
import { ScreenHeader } from "@/components/ui/screen-header";
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

const FIELD =
  "w-full border-b border-claro/20 bg-transparent pb-3 font-display text-2xl text-claro placeholder:text-claro/25 transition-colors focus:border-rosa focus:outline-none md:text-3xl";

const LABEL = "hw-kicker text-claro/45";

const ease = [0.22, 1, 0.36, 1] as const;

/** Tela 03 — quem é você (nome, cargo, pronome → vocativo do Bobo). */
export function ProfileScreen() {
  const { perfil, setPerfil, next } = useFlow();
  const ready = perfil.nome.trim().length > 0 && perfil.pronome != null;

  return (
    <ScreenShell bg="preto" scroll glow="rosa">
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        className="mx-auto flex w-full max-w-2xl flex-col gap-12"
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
          }}
        >
          <ScreenHeader
            index="02"
            kicker="quem entra"
            title="Antes de entrar, deixa eu saber com quem tô falando."
            subtitle="Nada de muito formal. Só pra eu não te tratar como número — que é justamente o que a gente tá aqui pra combater."
          />
        </motion.div>

        <motion.label
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
          }}
          className="flex flex-col gap-4"
        >
          <span className={LABEL}>como te chamam?</span>
          <input
            type="text"
            value={perfil.nome}
            onChange={(e) => setPerfil({ nome: e.target.value })}
            placeholder="seu nome"
            className={FIELD}
            autoFocus
          />
        </motion.label>

        <motion.label
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
          }}
          className="flex flex-col gap-4"
        >
          <span className={LABEL}>o que você faz nesse rolê?</span>
          <input
            type="text"
            value={perfil.cargo}
            onChange={(e) => setPerfil({ cargo: e.target.value })}
            placeholder="cargo / função"
            className={FIELD}
          />
        </motion.label>

        <motion.fieldset
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
          }}
          className="flex flex-col gap-5"
        >
          <legend className={LABEL}>como você quer ser tratado aqui dentro?</legend>
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
                    "cursor-pointer px-5 py-2.5 font-mono text-sm lowercase transition-all duration-200 active:scale-[0.97]",
                    active
                      ? "bg-rosa text-preto shadow-[0_12px_30px_-14px_rgba(255,0,170,0.7)]"
                      : "border border-claro/25 text-claro/65 hover:border-claro/60 hover:text-claro"
                  )}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </motion.fieldset>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
          }}
          className="flex items-center gap-5 pt-2"
        >
          <RitualButton
            label="Seguir"
            fx="scramble"
            accent="rosa"
            disabled={!ready}
            onClick={next}
          />
          {!ready && (
            <span className="hw-kicker text-claro/30">nome + pronome</span>
          )}
        </motion.div>
      </motion.div>
    </ScreenShell>
  );
}
