"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion, MotionConfig } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Lock, LockOpen } from "lucide-react";

import { useFlow } from "@/lib/state/AnswersContext";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { scoreSession, diagnosticNarrative } from "@/lib/scoring";
import { humanwareView, type Vetor } from "@/lib/scoring/humanware";
import { FINAL_FALA } from "@/lib/content/jester";

import { TextScramble } from "@/components/ui/text-scramble";
import { FlashlightText } from "@/components/ui/flashlight-text";
import { Accordion } from "./Accordion";
import { Radar } from "./Radar";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const EASE = [0.32, 0.72, 0, 1] as const;

const TECH_SUB: Record<string, string> = {
  originalidade: "criar de dentro, não copiar de fora.",
  vinculo: "intimidade real e diferença que cabe.",
  cuidado: "afeto que opera, não só discurso.",
  dialogo: "a verdade que circula sem sobrar.",
  autogestao: "teu cargo é subset de quem tu é.",
  consciencia: "decidir pensando na rede toda.",
};
const TECH_LONG: Record<string, string> = {
  originalidade:
    "Mede o quanto a organização cria a partir do que é só dela — em vez de imitar fórmulas de fora. Vem das dimensões de autoria e experimentação.",
  vinculo:
    "Mede a intimidade real entre as pessoas e o espaço pra diferença existir sem ser podada. Vem da intimidade e da pluralidade.",
  cuidado:
    "Mede se o cuidado é estrutural (está no sistema) ou só afetivo de discurso. O cuidado que opera, não o que se fala.",
  dialogo:
    "Mede se a verdade circula — inclusive a incômoda — sem sobrar pra quem fala. Vem da honestidade e da dialogia.",
  autogestao:
    "Mede o quanto cada pessoa decide o como, o quando e o com quem do próprio trabalho. O compromisso é com a entrega.",
  consciencia:
    "Mede se as decisões consideram a rede toda afetada — impacto, tecnologia companheira e consciência sistêmica.",
};

const DIM_FRIENDLY: Record<string, string> = {
  D1: "a presença",
  D2: "a originalidade",
  D3: "a intimidade",
  D4: "a pluralidade",
  D5: "a honestidade",
  D6: "o cuidado",
  D7: "o diálogo",
  D8: "o impacto visível",
  D9: "a autogestão",
  D10: "a experimentação",
  D11: "a tecnologia companheira",
  D12: "a consciência sistêmica",
  D13: "a intenção",
  "D6-Estrutural": "o cuidado estrutural",
  "D6-Afetabilidade": "a afetabilidade",
};
const friendly = (k: string) => DIM_FRIENDLY[k] ?? k;

const ESTADO_BADGE: Record<Vetor["estado"], string> = {
  Forte: "border-rosa text-rosa",
  Frágil: "border-claro/40 text-claro/70",
  Engatilhado: "border-amarelo text-amarelo",
  Ausente: "border-claro/25 text-claro/40",
};

const HOUSES = [
  { id: "GZero", nome: "GZero", desc: "desenha o existencial e o cultural", href: "#" },
  { id: "Loomi", nome: "Loomi", desc: "constrói os sistemas e a IA", href: "https://loomi.digital" },
  { id: "acaso", nome: "acaso", desc: "agentes internos de apoio", href: "https://aca.so" },
];

const QE_DOT: Record<string, string> = {
  Verde: "bg-claro",
  Amarelo: "bg-amarelo",
  Vermelho: "bg-rosa",
};

/** Tela final — experiência scroll-driven com o diagnóstico Humanware® real. */
export function FinalScreen() {
  const { perfil, respostas, voc, logSession } = useFlow();
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);

  const { diag, view, narrativa } = useMemo(() => {
    const session = { perfil, respostas };
    const d = scoreSession(session);
    return {
      diag: d,
      view: humanwareView(session, d),
      narrativa: diagnosticNarrative(d),
    };
  }, [perfil, respostas]);

  useEffect(() => {
    logSession();
  }, [logSession]);

  useGSAP(
    () => {
      if (reduced) return;

      // linha de versão (preenche conforme desce)
      gsap.fromTo(
        ".hw-version-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        }
      );

      // hero: espelho embaçado resolve em nitidez (pin + scrub)
      const hero = gsap.timeline({
        scrollTrigger: {
          trigger: ".hw-hero",
          start: "top top",
          end: "+=110%",
          pin: true,
          scrub: true,
        },
      });
      hero.fromTo(
        ".hw-hero-mirror",
        { filter: "blur(28px)", opacity: 0.35, scale: 1.12 },
        { filter: "blur(0px)", opacity: 1, scale: 1, ease: "none" }
      );

      // radar: polígono cresce do centro + vértices em stagger
      const radar = gsap.timeline({
        scrollTrigger: {
          trigger: ".hw-radar-wrap",
          start: "top 75%",
          end: "top 25%",
          scrub: true,
        },
      });
      radar
        .from(".hw-radar-poly", { scale: 0, opacity: 0, ease: "none" })
        .from(
          ".hw-radar-dot",
          { scale: 0, transformOrigin: "center", stagger: 0.04, ease: "none" },
          "<"
        );

      // frequência: marcador viaja de máquina → posição real (pin + scrub)
      gsap.fromTo(
        ".hw-freq-marker",
        { left: "0%" },
        {
          left: `${view.alma}%`,
          ease: "none",
          scrollTrigger: {
            trigger: ".hw-freq",
            start: "top top",
            end: "+=90%",
            pin: true,
            scrub: true,
          },
        }
      );

      // caminho do primeiro salto desenha
      gsap.from(".hw-path-fill", {
        scaleX: 0,
        transformOrigin: "left",
        ease: "none",
        scrollTrigger: {
          trigger: ".hw-path",
          start: "top 80%",
          end: "top 40%",
          scrub: true,
        },
      });

      // entradas em stagger por seção
      gsap.utils.toArray<HTMLElement>(".hw-rise").forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          filter: "blur(6px)",
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });

      ScrollTrigger.refresh();
    },
    { scope: root, dependencies: [reduced, view.alma] }
  );

  const cordaTensa = friendly(diag.cordas_tensas[0] ?? "D1");
  const cordaAfinada = friendly(diag.cordas_afinadas[0] ?? "D1");

  return (
    <MotionConfig reducedMotion="user">
      <div ref={root} className="relative w-full bg-preto text-claro">
        {/* linha de versão global */}
        <div className="pointer-events-none fixed left-3 top-0 z-40 h-dvh w-px bg-claro/15">
          <div className="hw-version-fill h-full w-full origin-top bg-rosa" />
        </div>

        {/* ───────── 0 · Respira (o espelho) ───────── */}
        <section className="hw-hero relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-6">
          <div
            className="hw-hero-mirror pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              background:
                "radial-gradient(60% 50% at 50% 45%, rgba(255,0,170,0.22), transparent 70%)",
            }}
          />
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <span className="mb-6 inline-block rounded-full border border-claro/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-claro/60">
              o espelho
            </span>
            <p className="font-display text-2xl leading-relaxed md:text-4xl">
              {voc(FINAL_FALA)}
            </p>
            <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.3em] text-claro/40">
              role pra ver ↓
            </p>
          </div>
        </section>

        {/* ───────── 1 · O retrato (arquétipo) ───────── */}
        <section className="mx-auto flex min-h-[100dvh] max-w-3xl flex-col justify-center px-6 py-24">
          <span className="hw-rise mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-rosa">
            o retrato
          </span>
          <h1 className="hw-rise font-display text-4xl leading-[1.05] md:text-6xl">
            <TextScramble as="span" duration={1} speed={0.03}>
              {diag.arquetipo.nome}
            </TextScramble>
          </h1>
          <p className="hw-rise mt-3 font-mono text-sm uppercase tracking-[0.2em] text-claro/55">
            {diag.arquetipo.label_final}
          </p>
          <p className="hw-rise mt-8 max-w-xl font-display text-xl leading-relaxed text-claro/85 md:text-2xl">
            {narrativa}
          </p>
        </section>

        {/* carta: nome secreto (respiro) */}
        {diag.cartas.nome_secreto && (
          <CartaRespiro
            kicker="o nome secreto que vocês se deram"
            texto={diag.cartas.nome_secreto}
          />
        )}

        {/* ───────── 2 · A que frequência vibram ───────── */}
        <section className="hw-freq relative flex min-h-[100dvh] flex-col items-center justify-center px-6">
          <div className="mx-auto w-full max-w-2xl text-center">
            <span className="mb-4 inline-block font-mono text-[10px] uppercase tracking-[0.3em] text-rosa">
              a frequência
            </span>
            <p className="font-display text-2xl leading-snug md:text-3xl">
              {voc(
                "Toda organização vibra entre duas frequências, {voc}: a da máquina (ordem, repetição) e a humana (presença, sentido). Olha onde a sua vibra:"
              )}
            </p>
            <div className="mt-14">
              <div className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-widest text-claro/50">
                <span>máquina</span>
                <span>humana</span>
              </div>
              <div className="hw-freq-track relative h-1 w-full bg-claro/15">
                <div
                  className="absolute left-0 top-0 h-full bg-rosa"
                  style={{ width: reduced ? `${view.alma}%` : undefined }}
                />
                <div
                  className="hw-freq-marker absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-rosa bg-claro"
                  style={{ left: reduced ? `${view.alma}%` : "0%" }}
                />
              </div>
              <div className="mt-10 flex items-end justify-center gap-8">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-claro/50">
                    versão
                  </p>
                  <p className="font-display text-5xl font-bold text-rosa md:text-6xl">
                    v{view.versao}
                  </p>
                </div>
                <div className="pb-2 text-left font-mono text-xs leading-relaxed text-claro/60">
                  gravidade {view.gravidade}
                  <br />
                  frequência {diag.frequencia.toLowerCase()}
                </div>
              </div>
              <p className="mx-auto mt-6 max-w-md font-mono text-xs leading-relaxed text-claro/50">
                {voc(
                  "Quanto mais leve a mochila, mais alta a versão. Gravidade Zero (v10) é o Humanware no máximo."
                )}
              </p>
            </div>
          </div>
        </section>

        {/* ───────── 3 · O corpo (vetores) ───────── */}
        <section className="mx-auto max-w-3xl px-6 py-24">
          <span className="hw-rise mb-4 inline-block font-mono text-[10px] uppercase tracking-[0.3em] text-rosa">
            o corpo · 6 tecnologias nativas
          </span>
          <p className="hw-rise max-w-xl font-display text-xl leading-snug md:text-2xl">
            {voc(
              "O corpo da organização roda em seis tecnologias. Cada ponta do hexágono é uma — quanto mais longe do centro, mais instalada."
            )}
          </p>

          <div className="hw-radar-wrap mx-auto my-12 aspect-square w-full max-w-md">
            <Radar techs={view.tecnologias} />
          </div>

          <div className="hw-rise">
            {view.tecnologias.map((t) => (
              <Accordion
                key={t.chave}
                title={t.nome}
                subtitle={TECH_SUB[t.chave]}
                badge={`${t.estado} · ${t.nivel}`}
                badgeClass={ESTADO_BADGE[t.estado]}
              >
                <p>{TECH_LONG[t.chave]}</p>
                <p className="mt-3 text-claro/90">
                  Aqui na sua: <b>{t.nivel}/100</b>, vetor{" "}
                  <b>{t.estado.toLowerCase()}</b>
                  {t.direcao === "engatilhado" &&
                    " — tem vontade represada, é ganho rápido"}
                  {t.direcao === "força oculta" &&
                    " — vocês fazem mais do que falam"}
                  .
                </p>
              </Accordion>
            ))}
          </div>
        </section>

        {/* ───────── 4 · Falam × movem (a vitrine) ───────── */}
        <section className="mx-auto max-w-3xl px-6 py-24">
          <span className="hw-rise mb-4 inline-block font-mono text-[10px] uppercase tracking-[0.3em] text-rosa">
            falam × movem
          </span>
          {diag.vitrine.ativo ? (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="hw-rise rounded-2xl border border-claro/15 bg-claro/5 p-6">
                <p className="font-mono text-[10px] uppercase tracking-widest text-claro/50">
                  o que vocês falam que são
                </p>
                <p className="mt-2 font-display text-2xl text-claro">
                  {diag.vitrine.mascara}
                </p>
              </div>
              <div className="hw-rise rounded-2xl border border-rosa/40 bg-rosa/10 p-6">
                <p className="font-mono text-[10px] uppercase tracking-widest text-rosa">
                  o que vocês operam
                </p>
                <p className="mt-2 font-display text-2xl text-claro">
                  {diag.vitrine.operacao}
                </p>
              </div>
            </div>
          ) : (
            <p className="hw-rise max-w-xl font-display text-xl leading-snug md:text-2xl">
              {diag.coerencia_discurso_pratica.faixa === "Coerente"
                ? voc(
                    "Boa notícia: o que vocês falam e o que vocês fazem andam juntos. Coerência discurso-prática alta — raro, e bonito."
                  )
                : voc(
                    "Tem um vão entre o discurso e a prática aí. Não é vitrine ainda, mas é uma tensão pra olhar com carinho."
                  )}
            </p>
          )}
        </section>

        {/* ───────── 5 · A dor da alma ───────── */}
        <section className="relative py-24">
          <div className="hidden sm:block">
            <FlashlightText
              text={voc(
                `A corda mais tensa aí é ${cordaTensa}. É nela que mora a dor — e o primeiro trabalho.`
              )}
            />
          </div>
          <div className="px-6 text-center sm:hidden">
            <p className="font-display text-2xl leading-relaxed text-rosa">
              {voc(
                `A corda mais tensa aí é ${cordaTensa}. É nela que mora a dor — e o primeiro trabalho.`
              )}
            </p>
          </div>
        </section>

        {/* carta: a cena (respiro perto da dor) */}
        {diag.cartas.cena && (
          <CartaRespiro
            kicker="a cena que vocês me contaram"
            texto={diag.cartas.cena}
          />
        )}

        {/* ───────── 6 · O que segura (Permissões) ───────── */}
        <section className="mx-auto max-w-3xl px-6 py-24">
          <div className="hw-rise mb-8 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-rosa">
              a pele · permissões
            </span>
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-claro/60">
              <span className={`h-3 w-3 rounded-full ${QE_DOT[diag.qe.faixa]}`} />
              QE {diag.qe.faixa.toLowerCase()}
              {diag.qe.disfarcado && " (disfarçado)"}
            </span>
          </div>
          <p className="hw-rise mb-8 max-w-xl font-display text-xl leading-snug md:text-2xl">
            {voc(
              "As permissões são a pele: o que o sistema deixa (ou não deixa) acontecer. Umas dão ordem, outras abrem espaço pro novo."
            )}
          </p>
          <ul className="hw-rise flex flex-col gap-px overflow-hidden rounded-2xl border border-claro/15">
            {view.permissoes.map((p) => (
              <li
                key={p.nome}
                className="flex items-center gap-4 bg-claro/5 px-5 py-4"
              >
                {p.segura ? (
                  <Lock size={16} className="shrink-0 text-rosa" />
                ) : (
                  <LockOpen size={16} className="shrink-0 text-amarelo" />
                )}
                <span className="flex-1">
                  <span className="font-display text-base text-claro">
                    {p.nome}
                  </span>
                  <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-claro/45">
                    {p.categoria} · {p.tipo}
                  </span>
                </span>
                <span className="h-1 w-24 overflow-hidden rounded-full bg-claro/15">
                  <span
                    className="block h-full bg-rosa"
                    style={{ width: `${p.nivel}%` }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ───────── 7 · O primeiro salto ───────── */}
        <section className="hw-path mx-auto max-w-3xl px-6 py-24">
          <span className="hw-rise mb-4 inline-block font-mono text-[10px] uppercase tracking-[0.3em] text-rosa">
            o primeiro salto
          </span>
          <p className="hw-rise font-display text-2xl leading-snug md:text-3xl">
            {voc("Pelo que eu vi, seu primeiro salto é por aqui:")}
          </p>

          <div className="hw-rise mt-8 rounded-[2rem] border border-rosa/40 bg-rosa/10 p-1.5">
            <div className="rounded-[calc(2rem-0.375rem)] bg-preto/40 p-7 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-rosa px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-rosa">
                  {view.prescricao.intensidade}
                </span>
                <span className="rounded-full border border-claro/30 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-claro/70">
                  trilha {view.prescricao.trilha}
                </span>
              </div>
              <p className="mt-4 font-display text-2xl text-claro md:text-3xl">
                {view.prescricao.primeiro_salto.split("—")[1]?.trim() ??
                  view.prescricao.primeiro_salto}
              </p>
              <p className="mt-3 font-mono text-sm leading-relaxed text-claro/70">
                {view.prescricao.por_que}
              </p>
              <p className="mt-3 font-mono text-xs leading-relaxed text-claro/50">
                alavanca a destravar: <b className="text-claro/80">{view.prescricao.alavanca}</b>
              </p>
              {view.prescricao.trava && (
                <p className="mt-3 font-mono text-xs leading-relaxed text-amarelo/80">
                  ⚠ {view.prescricao.trava}
                </p>
              )}
            </div>
          </div>

          {/* caminho de upsell */}
          <div className="hw-rise mt-10">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-claro/50">
              o caminho pra subir de versão
            </p>
            <div className="relative h-px w-full bg-claro/15">
              <div className="hw-path-fill absolute left-0 top-0 h-px w-full origin-left bg-rosa" />
            </div>
            <ol className="mt-4 flex flex-col gap-2">
              {view.prescricao.caminho_upsell.map((c, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 font-mono text-sm text-claro/70"
                >
                  <span className="text-rosa">→</span> {c}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ───────── 8 · O convite (CTA) ───────── */}
        <section className="mx-auto max-w-3xl px-6 py-32 text-center">
          <p className="hw-rise font-display text-3xl leading-tight md:text-5xl">
            {voc("Quer dar esse primeiro salto com a gente?")}
          </p>
          <div className="hw-rise mt-10 flex justify-center">
            <a
              href={
                HOUSES.find((h) =>
                  view.prescricao.roteamento.includes(h.id)
                )?.href ?? "#"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-full border-2 border-rosa bg-rosa px-7 py-4 font-display text-lg font-bold text-preto transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
            >
              começar a conversa
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-preto/15 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                <ArrowUpRight size={18} strokeWidth={2.5} />
              </span>
            </a>
          </div>

          <div className="hw-rise mt-14 grid gap-4 sm:grid-cols-3">
            {HOUSES.map((h) => {
              const on = view.prescricao.roteamento.includes(h.id);
              return (
                <a
                  key={h.id}
                  href={h.href}
                  target={h.href === "#" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className={`rounded-2xl border p-5 text-left transition-colors ${
                    on
                      ? "border-rosa bg-rosa/10"
                      : "border-claro/15 bg-claro/5 opacity-60"
                  }`}
                >
                  <p className="font-display text-xl text-claro">{h.nome}</p>
                  <p className="mt-1 font-mono text-xs leading-relaxed text-claro/55">
                    {h.desc}
                  </p>
                  {on && (
                    <p className="mt-2 font-mono text-[9px] uppercase tracking-widest text-rosa">
                      ↳ seu roteamento
                    </p>
                  )}
                </a>
              );
            })}
          </div>
          <p className="hw-rise mt-8 font-mono text-xs leading-relaxed text-claro/40">
            {voc(
              "O retrato é presente. O convite é porta — sem segunda intenção. A ordem é a tese: existencial → cultural → digital."
            )}
          </p>
        </section>

        {/* ───────── 9 · Pra quem quiser ir fundo ───────── */}
        <section className="mx-auto max-w-3xl px-6 py-24">
          <span className="hw-rise mb-6 inline-block font-mono text-[10px] uppercase tracking-[0.3em] text-claro/50">
            pra quem quiser ir fundo
          </span>
          <Accordion title="O que é Humanware®?">
            <p>
              Um sistema operacional pro domínio complexo — onde causa e efeito só
              se entendem depois. A frequência-máquina serve onde o mundo é
              ordenado; a humana é obrigatória onde ele é complexo. Humanware não
              é pregação: é design fit-for-context.
            </p>
          </Accordion>
          <Accordion title="O coração: intenção & presença">
            <p>
              Intenção (o que pulsa) está em <b>{view.coracao.intencao}/100</b>;
              presença (estar inteiro no que se faz) em{" "}
              <b>{view.coracao.presenca}/100</b>. É o centro de onde tudo irradia.
            </p>
          </Accordion>
          <Accordion title="As cordas afinadas e tensas">
            <p>
              O que mais sustenta vocês: <b>{cordaAfinada}</b>. Onde mais aperta:{" "}
              <b>{cordaTensa}</b>.
            </p>
          </Accordion>
          <Accordion title="Nota de método">
            <p>
              O cálculo pesa prática acima de discurso e lê disposição (vetor),
              não nota. {diag.alertas.length > 0 ? diag.alertas.join("; ") + "." : "Leitura consistente."}
            </p>
          </Accordion>
        </section>

        {/* ───────── 10 · Guardar o retrato ───────── */}
        <section className="mx-auto max-w-3xl px-6 pb-32 pt-12 text-center">
          <div className="hw-rise mx-auto max-w-md rounded-[2rem] border border-claro/15 bg-claro/5 p-1.5">
            <div className="rounded-[calc(2rem-0.375rem)] bg-preto/40 p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-rosa">
                {diag.frequencia.toLowerCase()} · v{view.versao}
              </p>
              <p className="mt-3 font-display text-3xl text-claro">
                {diag.arquetipo.nome}
              </p>
              <p className="mt-2 font-mono text-xs text-claro/55">
                {perfil.nome ? `${perfil.nome} · ` : ""}o retrato do seu Campo
              </p>
              <button
                type="button"
                onClick={() => window.print()}
                className="mt-6 rounded-full border-2 border-claro/40 px-5 py-2 font-mono text-xs uppercase tracking-widest text-claro transition-colors hover:border-rosa hover:text-rosa"
              >
                guardar o retrato
              </button>
            </div>
          </div>
        </section>
      </div>
    </MotionConfig>
  );
}

/** Carta aberta da própria pessoa — respiro entre blocos densos. */
function CartaRespiro({ kicker, texto }: { kicker: string; texto: string }) {
  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="rounded-[2rem] border border-claro/15 bg-claro/5 p-1.5"
      >
        <div className="rounded-[calc(2rem-0.375rem)] bg-preto/40 p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-claro/45">
            {kicker}
          </p>
          <p className="mt-4 font-serif text-2xl italic leading-relaxed text-claro md:text-3xl">
            &ldquo;{texto}&rdquo;
          </p>
        </div>
      </motion.div>
    </section>
  );
}
