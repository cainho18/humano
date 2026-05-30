/**
 * Teste de regressão das 8 fixtures (§11). Roda offline, sem framework:
 *   npm run test:scoring
 * Cada fixture deve produzir o arquétipo esperado.
 */

import { scoreSession } from "./index";
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
if (fail > 0) process.exit(1);
