/**
 * Teste de regressão das 8 fixtures (§11). Roda offline, sem framework:
 *   npm run test:scoring
 * Cada fixture deve produzir o arquétipo esperado.
 */

import { scoreSession } from "./index";
import { humanwareView } from "./humanware";
import { FIXTURES, FIXTURE_SESSIONS } from "./fixtures";

let pass = 0;
let fail = 0;

for (const [key, session] of Object.entries(FIXTURE_SESSIONS)) {
  const expected = FIXTURES[key].expected;
  const d = scoreSession(session);
  const got = d.arquetipo.nome;
  const ok = got === expected;
  if (ok) pass++;
  else fail++;
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${key.padEnd(12)} expected=${expected.padEnd(
      12
    )} got=${got.padEnd(12)} qe=${d.qe.faixa.padEnd(8)} dp=${d.coerencia_discurso_pratica.faixa.padEnd(
      10
    )} comp=${d.regra_compensacao_ativa}`
  );
  if (!ok) {
    console.log("      dims:", JSON.stringify(d.dimensoes));
  }
}

console.log(`\n${pass}/${pass + fail} fixtures passed`);

// ── Visão Humanware (humanware.ts) ────────────────────────────────
const TRILHAS = ["Existencial", "Cultural", "Digital"];
const ROTAS = ["GZero", "GZero+Loomi", "GZero+acaso"];
let hpass = 0;
let hfail = 0;
console.log("\n--- humanware.ts ---");
for (const [key, session] of Object.entries(FIXTURE_SESSIONS)) {
  const d = scoreSession(session);
  const v = humanwareView(session, d);
  const okShape =
    v.tecnologias.length === 6 &&
    v.versao >= 1 &&
    v.versao <= 10 &&
    v.gravidade === 10 - v.versao &&
    TRILHAS.includes(v.prescricao.trilha) &&
    ROTAS.includes(v.prescricao.roteamento) &&
    !!v.prescricao.primeiro_salto;
  if (okShape) hpass++;
  else hfail++;
  console.log(
    `${okShape ? "PASS" : "FAIL"}  ${key.padEnd(12)} v${String(v.versao).padEnd(2)} grav=${v.gravidade} ${v.frequencia.padEnd(11)} → ${v.prescricao.intensidade} · ${v.prescricao.trilha} [${v.prescricao.roteamento}]${v.prescricao.trava ? " ⚠trava" : ""}`
  );
}
console.log(`\n${hpass}/${hpass + hfail} humanware checks passed`);

if (fail > 0 || hfail > 0) process.exit(1);
