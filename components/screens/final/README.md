# Tela final — perfil organizacional

Página de resultado da pesquisa (`FinalScreen`). Scroll-driven (GSAP +
ScrollTrigger), mundo visual próprio (classe `.fnl` — Archivo Black / Anton /
Space Mono / Spline Sans), paleta estrita (rosa · amarelo · claro · preto).

## Fluxo de dados (sem recalcular score)

```
useFlow() → { perfil, respostas }
   └─ scoreSession(session) ............ Diagnostic
   └─ humanwareView(session, diag) ..... HumanwareView
        └─ buildFinalView(diag, view) .. FinalViewModel  (adapter.ts)
             └─ <Retrato/> <Frequencia/> <Corpo/> <Bugs/> <Salto/>
```

O motor (`lib/scoring`) **nunca** é recalculado aqui. O adaptador
(`adapter.ts`) só mapeia a saída → view model e casa com o conteúdo textual
(`lib/content/final.ts`).

## Como cada seção é alimentada

| Seção | Dados do motor | Conteúdo (final.ts) |
|---|---|---|
| **Retrato** | `diag.arquetipo.nome` (só o nome) | `ARQUETIPOS[nome]`: retrato (3§), fortes, atenção, exemplos |
| **Frequência** | `view.gravidade` → `G`, `view.frequencia` (estado) | `GRAVIDADE_ESTADO`; barra preenche até `(10−G)/10` |
| **Radar** | `view.tecnologias[].nivel` | — (hexágono das 6) |
| **Corpo** | `view.tecnologias` (nível + estado + chave) | `TECH_INFO` (o que é · dims · chakra x/y) + `ESTADO_NOTA` |
| **Bugs & Firewalls** | `view.permissoes` (nível) → bug `<55` / firewall `≥55`; prioridade = menor bug | `PERM_INFO` (o que é) |
| **Salto** | `view.prescricao` (intensidade · trilha · salto · porquê · upsell) | — |

## Conteúdo proibido na tela (cálculo interno)

Nunca exibidos: **QE**, **modificadores** do rótulo, seção **falam × movem**,
códigos **D[n]** (dimensão só por nome), e frases-meta. O adaptador já entrega
só o permitido.

## Interações de scroll (GSAP, por seção)

- **Retrato** — nome/intro fade-up; 3 cards entram das laterais (stagger).
- **Frequência** — barra G preenche no scroll (`scrub`, via `scaleX`); radar
  cresce do centro + vértices em stagger.
- **Corpo** — cards chegam um a um das suas laterais (subjetivo ↓ esquerda,
  objetivo ↓ direita); ao docar, a zona-chakra correspondente acende. Modos
  **panorama** (todas pela nota) e **reativo** (hover destaca uma). Zonas com
  `mix-blend: screen`, núcleo amarelo acima de ~65.
- **Bugs & Firewalls** — cards entram (lateral + fade-up, stagger) e pousam no
  **bento grid**; bug prioridade ocupa 2 colunas, firewall forte 2 linhas.
- **Salto** — card com fade-up + leve scale; passos do caminho em stagger.

Tudo anima só `transform`/`opacity`. `prefers-reduced-motion` mostra tudo
estático (cada seção checa `useReducedMotion`). Cards expansíveis são
`<button aria-expanded>` (teclado ok); bug/firewall usam **ícone + label**
(não dependem só de cor).

## Arquivos

```
final/
  FinalScreen.tsx        orquestrador (motor → adapter → seções)
  adapter.ts             Diagnostic + HumanwareView → FinalViewModel
  sections/              Retrato · Frequencia · Corpo · Bugs · Salto
  parts/                 ExpandCard · RadarHex · BodyHeatmap
lib/content/final.ts     copy (8 arquétipos, 6 tecnologias, permissões…)
public/corpo.webp        figura simbólica do corpo (heatmap base)
```
