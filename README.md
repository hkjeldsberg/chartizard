# Chartizard

An interactive atlas of every chart, diagram, and plot type known — filterable
by sector/field, each one explained element-by-element with real-world examples.

## Stack

- Next.js 16 (App Router) + React 18.3
- Visx 3.12 (charts) — *added in Unit 7*
- Tailwind CSS v4 (CSS-first `@theme`)
- shadcn/ui (Radix primitives)
- Content Collections + MDX + Zod — *added in Unit 3*
- Vitest + Playwright

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

## Scripts

| command             | what it does                          |
|---------------------|---------------------------------------|
| `npm run dev`       | Next.js dev server with HMR           |
| `npm run build`     | Production build                      |
| `npm run start`     | Serve the production build            |
| `npm run lint`      | ESLint (next/core-web-vitals preset)  |
| `npm run typecheck` | TypeScript-only check                 |
| `npm run test`      | Vitest unit tests                     |
| `npm run test:e2e`  | Playwright e2e tests (Unit 4+)        |
| `npm run format`    | Prettier (+ tailwindcss plugin)       |

## Project structure (target shape after v1)

See `docs/plans/2026-04-19-001-feat-chartizard-v1-plan.md` for the full layout
and the seven implementation units.

## Adding a new chart

*Full contract lands in Unit 6.* Short version: create `content/charts/<slug>.mdx`
with the Zod-validated frontmatter, drop a `src/charts/<slug>/<Name>Chart.tsx`
component that composes `<ExplainAnchor>` wrappers around each meaningful SVG
element, and register it in `src/lib/chart-registry.ts`.

## Project rules

- No git commands are issued by agents in this repo.
- Per-subtask token usage is logged in `TOKENS.md`.
- Work items live in `TODO.md` and get checked off as they land.
