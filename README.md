# Humanware V2

Um portal interativo para o universo "gravidade zero" da GZero. Não é um
formulário corporativo: é um diagnóstico vivo, narrado pelo **Bobo da Corte**,
em linguagem GZero (informal-poética). A pessoa atravessa o espelho, responde a
cenas e perguntas, e recebe uma "fotografia" do arquétipo da sua organização.

## Repaginação visual (v2)

Revisão completa de UX/UI **mantendo a paleta de 4 cores**. O que mudou:

- **Sistema de design** em `app/globals.css`: escala tipográfica fluida
  (`clamp`), tokens de movimento (`--ease-ritual`), ritmo/espaço por `--gutter`,
  e um **grão** sutil global (`<Grain/>`) que tira a planura do preto puro.
- **Tipografia editorial**: cabeçalhos com kicker numerado + título display +
  acento serifado itálico para as linhas poéticas. Primitivas `.hw-kicker`,
  `.hw-title`, `.hw-lead`, `.hw-accent`, e o componente `<ScreenHeader/>`.
- **Marca gzero** (`<GZeroMark/>`): o SVG entra como máscara recolorível
  (`currentColor`), usada de forma mínima — assinatura fixa (`<Signature/>`),
  selo da abertura, e no retrato final (herói + cartão-lembrança).
- **Abertura repaginada**: a tela de carregamento é um **logo-reveal** da gzero
  (50%→0% de transparência, esquerda→direita; expande e some). O **portal**
  (`OpeningPortal`) funde HUMANWARE + manifesto numa só página: rolar (mouse ou
  o botão "descer") dispara uma **PIXELATED SCROLL TRANSITION** (grade de blocos
  que dissolve o rosa em preto, GSAP pin+scrub) e acende o manifesto palavra a
  palavra. O espelho só aparece no **hover do botão** (`RevealImageOnHover`).
- **Scroll-telling (GSAP ScrollTrigger)** também na tela final.
- Telas repaginadas: loader, portal, perfil, acordo, blocos (capítulos
  numerados 01–07), transições do Bobo, cartas e o retrato final.

> Atalho de QA (apenas dev): `/?step=N` monta direto na etapa N com respostas
> mock; `/?demo=final` abre o retrato. Em produção esses atalhos são inertes.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first, `@theme` em `app/globals.css`)
- Componentes estilo shadcn em `components/ui`
- **motion** / **framer-motion** para as animações e efeitos de transição

> ⚠️ Esta versão do Next.js tem breaking changes em relação ao seu conhecimento
> prévio. Antes de mexer no código, consulte os guias em
> `node_modules/next/dist/docs/`.

## Paleta (inegociável)

Apenas quatro cores, expostas como tokens no `@theme`:

| Token    | Hex       | Uso                          |
| -------- | --------- | ---------------------------- |
| `rosa`   | `#FF00AA` | Heartstorm / destaque, CTAs  |
| `amarelo`| `#FFFF00` | Bobo / foco, outline         |
| `claro`  | `#F2F2F2` | Texto/fundo claro            |
| `preto`  | `#000000` | Fundo escuro                 |

Nenhuma outra cor entra no projeto — cores de componentes de referência foram
substituídas por estas.

## Rodando

```bash
npm install
npm run dev      # http://localhost:3000
```

Outros scripts:

```bash
npm run build         # build de produção
npm run lint          # eslint
npm run test:scoring  # regressão das 8 fixtures do motor de scoring
```

## Fluxo

Tudo acontece em uma única rota (`/`) como máquina de estados client-side
(índice de passo em `lib/state/AnswersContext.tsx`; ordem canônica em
`lib/flow/steps.ts`):

1. **Abertura** — contador 0→100 → portal (HUMANWARE) → manifesto ("Atravessar")
2. **Entrada** — perfil (nome, cargo, pronome) → acordo (LGPD)
3. **Blocos de perguntas** intercalados com **7 transições do Bobo**, cada uma
   com um efeito visual diferente:
   - T1 Perspective · T2 trembling lines · T3 Nokia webcam · T4 Glitch ·
     T5 gooey Drag · T6 proximity · T7 Perspective
4. **4 cartas** (flip 3D): cômodo, fora/dentro, cena, nome secreto
5. **Final** — fotografia do arquétipo (mock por enquanto)

As respostas são coletadas em memória e, ao final, **`console.log`'adas** via
`logSession()` (procure por `[HUMANWARE] sessão concluída` no console).

### Vocativo dinâmico

O pronome escolhido na entrada define como o Bobo se dirige à pessoa
(`lib/vocative.ts`): `ele` → "Irmão", `ela` → "Amiga", `outro` /
`prefiro_nao_dizer` → neutro (sem vocativo de gênero).

## Acessibilidade & mobile

- Todos os efeitos respeitam `prefers-reduced-motion` (`lib/useReducedMotion.ts`,
  via `useSyncExternalStore`) com fallbacks estáticos.
- Inputs e transições funcionam em toque/mobile (a Nokia cam usa a câmera
  traseira no celular; drag e sliders são pointer-based).

## Motor de scoring (`lib/scoring`)

Módulo **isolado** que implementa o cálculo do briefing 2 (13 dimensões,
QE, coerência discurso×prática, regra de compensação, detecção de arquétipo por
proximidade a protótipos, modificadores, meta-indicadores e narrativa-template).

- **Não está acoplado à UI** — a tela final usa um mock. O motor existe pronto
  para ser plugado depois.
- Importa tipos por caminho relativo (`../types`), então é autossuficiente.
- Regressão: `npm run test:scoring` roda 8 fixtures offline (sem framework) e
  cada uma deve produzir o arquétipo esperado.

```
lib/scoring/
  config.ts       # pesos, bandas, protótipos
  dimensions.ts   # normalização + agregação das dimensões
  index.ts        # scoreSession() — pipeline completo
  narrative.ts    # textos de abertura/fechamento por arquétipo
  fixtures.ts     # 8 casos de teste
  verify.ts       # runner de regressão
```
