# Chartizard — Session Handoff

> Read this first after `/clear`. Everything below is enough to continue work without re-reading every doc.
> On disk date: 2026-04-23 (Batch 12 completion). Previous Claude Code resume ids (informational only):
> Batch 3: `claude --resume 93807286-50ac-4c23-b59f-f06b0764e018`

---

## 1. Project in one paragraph

**Chartizard** is an interactive atlas of (eventually) every chart/diagram/plot
known — ~286 catalog entries. The homepage is an editorial Bento grid of all
entries, filterable by sector / family / data-shape / live-only. Clicking a
tile opens `/charts/[id]` with a live interactive Visx chart, a museum-label
narrative (`whenToUse`, `howToRead`, `example`), and an **Explain mode** that
dims the data layer and surfaces 4–7 numbered `ExplainAnchor` pins per chart
with per-element explanations. Charts not yet implemented render as a
"Coming Soon" placeholder inside the same frame. Voice everywhere is
"museum label, not SaaS landing page".

Origin brief: `PRD.md`. Full v1 plan: `docs/plans/2026-04-19-001-feat-chartizard-v1-plan.md`.

---

## 2. Stack

- **Next.js 15.5 (App Router) + React 18.3.1** (pinned — Visx 3.x peer compat).
- **Visx 3.12** for charts. Use **d3-hexbin / d3-sankey / d3-chord / d3-hierarchy / d3-shape** directly when a `@visx/*` wrapper is flaky; we deliberately do NOT import `@visx/hexbin` or `@visx/sankey`.
- **Tailwind CSS v4** (CSS-first `@theme` in `src/app/globals.css`). shadcn/ui primitives.
- **Content Collections + MDX + Zod** were planned but replaced during v1 with **pure TypeScript chart modules** (`src/content/charts/live/<slug>.ts`). Do not migrate back.
- **Vitest** (unit) + **Playwright** (e2e). Smoke + bento + content tests exist.

Scripts: `npm run dev | build | lint | typecheck | test | test:e2e | format`.

---

## 3. Repo map (just the load-bearing parts)

```
chartizard/
  CLAUDE.md                        # project rules (read every session)
  PRD.md                           # 5-line origin brief
  README.md                        # short stack + dev docs
  CHARTS.md                        # canonical list of ~286 chart types
  CHARTS_CATEGORIZED.md            # same list mapped to 29 sectors
  TODO.md                          # work log (single source of in-flight tasks)
  TOKENS.md                        # token usage per subtask (CLAUDE.md rule)
  SESSION.md                       # this file

  docs/
    chart-author-contract.md       # THE spec every chart implementer follows
    plans/
      2026-04-19-001-feat-chartizard-v1-plan.md              # v1 blueprint (7 units)
      2026-04-20-001-feat-remaining-charts-via-subagents-plan.md  # batch program
    batches/
      2026-04-20-batch-01.md       # Batch 1 manifest + post-mortem (20 charts)
      2026-04-21-batch-02.md       # Batch 2 manifest + post-mortem (20 charts)
      2026-04-22-batch-03.md       # Batch 3 manifest + post-mortem (20 charts)
      2026-04-23-batch-04.md       # Batch 4 manifest + post-mortem (20 charts)
      2026-04-24-batch-05.md       # Batch 5 manifest + post-mortem (20 charts)
      2026-04-25-batch-06.md       # Batch 6 manifest + post-mortem (20 charts)
      2026-04-26-batch-07.md       # Batch 7 manifest + post-mortem (20 charts)
      2026-04-27-batch-08.md       # Batch 8 manifest + post-mortem (20 charts)
      2026-04-28-batch-09.md       # Batch 9 manifest + post-mortem (20 charts)
      2026-04-29-batch-10.md       # Batch 10 manifest + post-mortem (20 charts)
      2026-04-23-batch-11.md       # Batch 11 manifest + post-mortem (20 charts)
      2026-04-23-batch-12.md       # Batch 12 manifest + post-mortem (20 charts)

  src/
    app/
      layout.tsx
      page.tsx                     # homepage: Hero + filter + bento
      charts/[id]/page.tsx         # dynamic chart detail route (generateStaticParams)
      globals.css                  # @theme tokens, sector surfaces, bento classes
    components/
      Hero.tsx
      bento/ Grid, Tile, Thumbnail
      chart/ ChartFrame, ChartCanvas, LiveChartView, ExplainToggle, ExplainAnchor, ExplainContext, ExplainPanel
      filter/ FilterSidebar, FilterChips, MobileFilterToggle, filter-state.ts
    charts/
      <slug>/                      # one dir per chart: <Name>Chart.tsx + <Name>Chart.thumbnail.tsx
      _placeholder/                # "Coming Soon" artwork per family silhouette
    content/
      chart-schema.ts              # ChartEntry | LiveChart | PlannedChart + validateCatalog()
      charts/
        index.ts                   # merges LIVE_CHARTS + PLACEHOLDER_CHARTS, validates, exposes getChartById()
        live/<slug>.ts             # 65 live chart metadata modules
        live/index.ts              # exports LIVE_CHARTS array (edited by main agent only)
        placeholders.ts            # remaining ~221 planned chart stubs (edited by main agent only)
    lib/
      chart-registry.tsx           # id -> dynamic() live component map (edited by main agent only)
      families.ts                  # 9 chart families
      sectors.ts                   # 29 sectors + surface token mapping
      data-shapes.ts               # 6 data shapes
      utils.ts
  tests/unit/ smoke, bento, content
```

---

## 4. Content model — the key types

`src/content/chart-schema.ts`:

```ts
interface ChartMeta {
  id: string;                      // kebab-case, unique
  name: string;
  family: ChartFamily;             // see families.ts (9 options)
  sectors: ReadonlyArray<SectorId>;// see sectors.ts (29 options)
  dataShapes: ReadonlyArray<DataShape>;
  tileSize: "S" | "M" | "L" | "W" | "T";
  status: "live" | "planned";
  synopsis?: string;
}
interface LiveChart extends ChartMeta {
  status: "live";
  whenToUse: string;
  howToRead: string;
  example: { title: string; description: string };
  elements: ReadonlyArray<{ selector: string; label: string; explanation: string }>;
}
```

`validateCatalog()` runs at module load (from `src/content/charts/index.ts`). It enforces:
- unique ids across live + placeholders
- every live chart has ≥1 `elements[]` entry and a non-empty `example.title`

Filter taxonomy lives in `families.ts` (comparison / composition / distribution / relationship / flow / change-over-time / hierarchy / geospatial / specialty) and `sectors.ts` (29 sectors, ~10 surface tokens).

---

## 5. The Chart Author Contract (must follow)

Full spec in `docs/chart-author-contract.md`. Core rules:

1. **Three files per chart**:
   - `src/charts/<slug>/<Name>Chart.tsx` — live client component
   - `src/charts/<slug>/<Name>Chart.thumbnail.tsx` — 120×80 hand-drawn SVG
   - `src/content/charts/live/<slug>.ts` — metadata + narrative + `elements[]`
2. **File naming — no double suffix.** If the slug ends `-chart`/`-plot`/`-diagram`/`-graph`, strip it before appending `Chart`/`Plot`/`Diagram`/`Graph`. Example: `control-chart` → `ControlChart.tsx` (NOT `ControlChartChart`). `ridgeline-plot` → `RidgelineChart.tsx` (always `Chart` suffix for registry consistency).
3. **Live component contract**:
   - First line `"use client";`
   - Signature `({ width, height }: { width: number; height: number })`
   - Returns `<svg role="img" aria-label="…">` at full `{width,height}`
   - Margin recipe: `{ top: 20, right: 20, bottom: 44, left: 56 }` with `iw = Math.max(0, width - margin.left - margin.right)` guard
   - Wrap chart body in `<Group left={margin.left} top={margin.top}>`
   - Every data-bearing `<g>` gets `data-data-layer="true"` (ChartCanvas dims these in Explain mode)
   - No `Math.random()` at render — use a seeded LCG inside `useMemo`
4. **ExplainAnchor** (`selector`, `index`, `pin`, `rect`):
   - Min 4, max 7 anchors per chart; aim 5–6
   - `selector` must match a `selector` field in `elements[]` exactly
   - `rect` fully covers the element; clamp to plot area unless the anchor is intentionally in margin space
   - Every anchor must render unconditionally — no runtime-gated anchors
5. **Do NOT touch** (main agent only): `chart-registry.tsx`, `live/index.ts`, `placeholders.ts`, `bento/Thumbnail.tsx`, any config file. Flag dep additions, don't add them.
6. **Voice**: museum label, 2–4 sentences per block. Name real organisations / datasets / insights. Kill "powerful", "perfect for", "seamless", "modern", "intuitive", generic "a company"/"sales data" examples.

---

## 6. Integration seams — single-writer only

When a batch completes, the **main agent** (not sub-agents) edits exactly four files:

- `src/lib/chart-registry.tsx` — add a `dynamic(() => import(...))` entry per new live chart
- `src/content/charts/live/index.ts` — add the metadata import + push into `LIVE_CHARTS`
- `src/content/charts/placeholders.ts` — comment-out or delete the upgraded entry
- `src/components/bento/Thumbnail.tsx` — add the thumbnail to `LIVE_THUMBS`

Sub-agents never write these. That's the only rule preventing merge races.

---

## 7. Current catalog state (as of Batch 12 completion, 2026-04-23)

- **Live charts: 245 / 286 (85.7%)**
- Placeholders remaining: **41**
- Live chart files exist at `src/content/charts/live/*.ts` (245 files + `index.ts`).
- **Sectors COMPLETE (0 placeholders):** Finance (Batch 11), Statistics (Batch 12 A), Decision-Analysis (Batch 12 B), Mathematics (Batch 12 B), Biology (Batch 12 B). Plus Earth-Sciences was opened and fully covered in Batch 11.
- **Finance family COMPLETE** — 10 live charts (candlestick, OHLC, Kagi, Renko, P&F, Heikin-Ashi, Ichimoku, 3-Line Break, equivolume, market-profile).
- **UML family complete** (8/8). Software-modelling cluster: 15 live.
- **Statistics glyphs cluster COMPLETE** (6/6 — Chernoff, Andrews, star-glyph, hammock, doubledecker, barcode). Plus all earlier stats charts. Sector at 0 placeholders.
- **Decision analysis COMPLETE** — argument-map, rich-picture, bubble-map, double-bubble-map (Batch 12 B) closed the cluster; prior live: decision-tree, influence, causal-loop, stock-and-flow, concept-map, mind-map, pugh.
- **Mathematics COMPLETE** (Batch 12 B: surface-plot + logarithmic-plot; prior live: contour, venn, euler, ternary).
- **Biology COMPLETE** (Batch 12 B: phylogram; prior live: phylogenetic-tree, cladogram, tree-of-life-radial-phylogeny).
- **Physics dynamical-systems cluster**: 6 live (phase-portrait, Poincaré-map, bifurcation, recurrence, vector-field, streamline-plot). Physics exotic still has 3 (Greninger, phase-space, isosurface).
- **Cartography**: 9 live (Batch 12 adds Tissot-indicatrix + isochrone-map to prior tile-map / hexbin-map / flow-map / bivariate-choropleth / geographical-heatmap / topographic-map / dot-density / proportional-symbol). 2 placeholders remain: isarithmic + prism.
- **Signal-processing / control (electrical)**: Root-locus and periodogram added Batch 12 A. Prior live: Bode, Nyquist, Nichols, pole-zero, argand, spectrogram, eye-diagram, constellation, waterfall-plot-signal, circuit, ladder, Smith. 4 placeholders remain: drain, shmoo, carpet, strip-chart.
- **Medical/biology residual**: Genogram added Batch 12 B. 4 placeholders remain: nomogram, lexis, allele, dot-plot-bioinformatics.
- **Infographics**: pictorial-percentage + unit-chart added Batch 12 B. 4 placeholders remain: dot-matrix, isotype, icon-array, (+ vowel / natal / sociogram are separate sectors).
- Chemistry 12+ live (2 placeholders: quaternary, ellingham). Electrical ~17 live. Genetics 6 live.

Batches landed so far:

| Batch | Count | Completed | Notes |
|------:|------:|-----------|-------|
| v1    | 5     | 2026-04-19 | line, area, stacked-bar, pie, hexagonal-binning |
| 1     | 20    | 2026-04-20 | Wave A: bar, horizontal-bar, histogram, donut, scatter, bubble, box-plot, violin, heatmap, radar. Wave B: sparkline, kpi-tile, density, gauge, candlestick, gantt, funnel, treemap, sunburst, sankey |
| 2     | 20    | 2026-04-21 | Wave A: waterfall, pareto, choropleth, cartogram, word-cloud, population-pyramid, pyramid, lollipop, kaplan-meier, forest-plot. Wave B: tree, dendrogram, network, chord, flowchart, control-chart, venn, parallel-coordinates, ridgeline, mosaic. Added `d3-chord` + `@types/d3-chord` |
| 3     | 20    | 2026-04-21 (loop) | Wave A: grouped-column, diverging-bar, waffle, slope, dumbbell, bullet, roc, precision-recall, qq, normal-probability. Wave B: fan-chart, streamgraph, pugh, ishikawa, circle-packing, icicle, alluvial, nolan, swot, pourbaix. 0 new deps |
| 4     | 20    | 2026-04-23 | Wave A: jitter, strip, beeswarm, sina, stemplot, radial-histogram, error-bars, confusion-matrix, feature-importance, scree. Wave B: small-multiples, spaghetti, horizon, calendar, correlation-matrix, scatter-plot-matrix, contour, rose-diagram, volcano, run-chart. 0 new deps (B4 hand-rolled marching-squares). Pre-flight renamed `ControlChartChart` → `ControlChart` and added contract §9 step 7 (sub-agent self-typecheck) |
| 5     | 20    | 2026-04-24 | Wave A: nightingale, polar-area, radial-bar, star-plot, moving-average, bump, lorenz, euler, dot-plot, rug. Wave B: voronoi, arc, adjacency-matrix, taylor, ohlc, cycle, decision-tree, org-chart, timeline, ternary. 0 new deps (first batch to actually use pre-installed `d3-delaunay`). Polar/radial family now fully covered |
| 6     | 20    | 2026-04-25 | Wave A: bland-altman, funnel-plot-meta, quadrant, stakeholder-grid, deviation, likert, burn-down, burn-up, pictogram, tally. Wave B: tile-map, hexbin-map, flow-map, bivariate-choropleth, parallel-sets, swimlane, mind-map, cumulative-flow-diagram, phase-diagram, smith-chart. 0 new deps. Pre-flight: relaxed `tests/unit/content.test.ts` hardcoded id-list to a single `EXPECTED_LIVE_COUNT` constant. Every family now has ≥4 live entries |
| 7     | 20    | 2026-04-26 | Wave A: gap-chart, residual-plot, cdf-plot, ecdf-plot, lift-chart, cumulative-gains-chart, punnett-square, jablonski-diagram, nichols-plot, nyquist-plot. Wave B: uml-class-diagram, entity-relationship-diagram, uml-sequence-diagram, finite-state-machine, kanban-board, pert-chart, climate-stripes, magic-quadrant, manhattan-plot, hertzsprung-russell-diagram. 0 new deps. High-utility / commonly-searched push; crossed 50% live threshold |
| 8     | 20    | 2026-04-27 | Wave A: bode-plot, pole-zero-plot, autocorrelation-plot, partial-autocorrelation-plot, partial-dependence-plot, shap-summary-plot, calibration-plot, pp-plot, argand-diagram, feynman-diagram. Wave B: uml-activity-diagram, uml-state-diagram, data-flow-diagram, control-flow-graph, bpmn-diagram, value-stream-map, phylogenetic-tree, cladogram, raci-matrix, sipoc-diagram. 0 new deps. Software-modelling wave #2 + control-systems quartet closed + ML interpretability cluster (PDP/SHAP/calibration). First batch where no sub-agent edited TODO.md/TOKENS.md |
| 9     | 20    | 2026-04-28 | Wave A: cooks-distance-plot, leverage-plot, bagplot, biplot, kagi-chart, renko-chart, point-and-figure-chart, heikin-ashi-chart, titration-curve, arrhenius-plot. Wave B: uml-use-case-diagram, uml-component-diagram, uml-deployment-diagram, uml-object-diagram, circos-plot, tree-of-life-radial-phylogeny, pedigree-chart, karyotype, sequence-logo, ideogram. 0 new deps. **UML family complete (8/8)** + biology/genetics expansion + finance price-action cluster + regression-diagnostics triangle |
| 10    | 20    | 2026-04-29 | Wave A: ichimoku-kinko-hyo, three-line-break-chart, eye-diagram, constellation-diagram, lineweaver-burk-plot, lewis-structure, phase-portrait, poincare-map, hubble-diagram, dalitz-plot. Wave B: architecture-diagram, flame-graph, circuit-diagram, ladder-diagram, spectrogram, waterfall-plot-signal, influence-diagram, causal-loop-diagram, geographical-heatmap, topographic-map. 0 new deps. **Finance price-action family COMPLETE** + software structure/profile + electrical schematics + signal time-frequency + cartography |
| 11    | 20    | 2026-04-23 | Wave A: bifurcation-diagram, recurrence-plot, piper-diagram, stiff-diagram, stereonet, galbraith-plot, equivolume-chart, market-profile-chart, ternary-contour-plot, potential-energy-diagram. Wave B: vector-field, streamline-plot, piping-instrumentation-diagram, exploded-view-drawing, stock-and-flow-diagram, concept-map, radial-tree, packed-circle-chart, dot-density-map, proportional-symbol-map. 0 new deps. 2 tile-size bumps (piper, stiff: S→M). **Finance COMPLETE** (test pruned). Earth sciences opened. Physics dynamical-systems at 6 live |
| 12    | 20    | 2026-04-23 | Wave A: chernoff-faces, andrews-plot, star-glyph-plot, hammock-plot, doubledecker-plot, barcode-chart, root-locus-plot, periodogram, tissot-indicatrix, isochrone-map. Wave B: argument-map, rich-picture-diagram, bubble-map, double-bubble-map, surface-plot, logarithmic-plot, pictorial-percentage-chart, unit-chart, genogram, phylogram. 0 new deps. 1 tile-size bump (star-glyph: S→M). **4 sectors closed in one batch: statistics / decision-analysis / mathematics / biology** (plus test prunes for statistics + biology). Batch 11 B1 drift closed 10/10. Crossed 85% live |

---

## 8. Where to pick up — active work

From `TODO.md`:

**Immediate verification (after `/clear`):**
```
npm run typecheck && npm run test
```
Both clean as of Batch 12 completion (12 tests passing, `npx tsc --noEmit` exit 0, 245 live charts total).

**Known pre-existing TS errors:** none.

**Contract / infra observations from Batch 12 post-mortem:**
- **`src/content/datasets/` DRY refactor — 8 batches deferred.** Framework: this refactor happens only when the user explicitly asks for it or a dataset bug surfaces that it would have prevented.
- **SHAP `linearGradient` hardcoded id** + **TopographicMap dead useMemo** — still in TODO.
- **`src/lib/d3-hierarchy-helpers.ts` extraction** — now used by 3 charts (TreeOfLifeRadialPhylogeny, RadialTree, Phylogram). Still open.
- **Test-file sector-list pruning**: Statistics pruned after Batch 12 Wave A (glyph cluster complete); Biology pruned after Batch 12 Wave B (phylogram closed it). Same pattern as Batch 11's Finance prune. Continue pruning as sectors complete.
- **Batch 11 B1 drift closed**: explicit callout in Wave B prompts produced 0 drift across 10/10 slots this batch. Keep the callout in future batches.
- **Parallel-slot self-healing** worked for 5th consecutive batch (A2 self-fixed `HammockPlot` `TS2367` literal-comparison errors after A1/A5 flagged them).
- **Tile-size ambiguity**: star-glyph-plot S→M (3rd bump after Piper/Stiff). Consider tightening placeholder `tileSize` upstream.

**Batch 13 next steps (per TODO.md — not yet manifested):**
- [ ] Write Batch 13 manifest at `docs/batches/<date>-batch-13.md` (20 from the remaining 41).
- [ ] Dispatch Wave A (5 × 2 charts)
- [ ] Integrate Wave A merges
- [ ] Dispatch Wave B (5 × 2 charts)
- [ ] Integrate Wave B merges
- [ ] Verification + content review + post-mortem + Batch 14 manifest

**Runway:** 41 placeholders remaining. At 20/batch: Batch 13 lands at 265, Batch 14 wraps at 285 (or 286 if last placeholder attached). 2-3 more batches to catalog completion.

Remaining placeholder clusters (pick from these for Batch 13):
- **Signal processing (4)**: drain, shmoo, carpet, strip-chart
- **Cartography (2)**: isarithmic, prism
- **Math/infographics (5)**: vowel-chart (linguistics), natal-chart (astrology), sociogram (social-sciences/networks), dot-matrix, isotype, icon-array
- **Medical/biology residual (4)**: nomogram, lexis-diagram, allele-chart, dot-plot-bioinformatics
- **Engineering (2)**: structure-chart, block-diagram
- **Trees & networks residual (4)**: convex-treemap, hive-plot, arc-matrix, dependency-graph
- **Business/politics/general (10)**: opposites-diagram, scorecard, balanced-scorecard, pournelle-chart, election-apportionment-diagram, table-chart, vertical-bar-graph, pie-of-pie-chart, doughnut-multi-level
- **Time series (2)**: spiral-plot, comet-plot
- **Chemistry (2)**: quaternary-plot, ellingham-diagram
- **Physics exotic (3)**: greninger-chart, phase-space-plot, isosurface-plot
- **Quality (3)**: affinity-diagram, matrix-diagram, pdpc

---

## 9. Sub-agent dispatch pattern (for batches)

- Use the `general-purpose` Agent (Sonnet) for most chart slots; route layout-heavy slots (sankey, treemap, sunburst, alluvial, streamgraph) to Opus.
- **5 sub-agents per wave, 2 charts per agent**, dispatched in one tool-call block so they run concurrently.
- Each sub-agent gets: the Batch manifest row(s), paths to `docs/chart-author-contract.md` + `src/charts/line/LineChart.tsx` + `src/content/charts/live/line-chart.ts` + `src/charts/line/LineChart.thumbnail.tsx`, and the "do not touch" list.
- Wave boundary is **hard** — do not start Wave B until Wave A is integrated + green; they race on the four shared files.
- After each wave, main agent does: file-existence check (3 files × N charts) → registry merge → live/index merge → placeholders removal → Thumbnail merge → re-run `validateCatalog` mentally → note tokens in `TOKENS.md`.

Template lives in `docs/plans/2026-04-20-001-feat-remaining-charts-via-subagents-plan.md` §"Sub-agent prompt template".

---

## 10. Project rules (from `CLAUDE.md`)

- **No git commands.** Agents never commit/push/checkout in this repo.
- **Log tokens in `TOKENS.md`** per subtask.
- **All tasks live in `TODO.md`** and get checked off when they land.
- User email: `henrik.kjeldsberg@live.no`. Today: 2026-04-23.

Global instructions in `.claude\CLAUDE.md` add: plan mode by default, subagents for parallelism, `/simplify` before commits, target the `develop` branch, use worktrees for parallel work, no git config changes.

---

## 11. Resume checklist

When you come back after `/clear`:

1. Read this file (you're here).
2. Skim `TODO.md` for any checklist items that landed between sessions.
3. Skim the latest batch post-mortem (`docs/batches/2026-04-22-batch-03.md` → "What to tune for Batch 4").
4. If about to dispatch a batch: re-read `docs/chart-author-contract.md` for drift, apply pre-flight contract updates, then follow §9 above.
5. If about to implement a single chart by hand: read the contract + `src/charts/line/LineChart.tsx` + `src/content/charts/live/line-chart.ts` + `src/charts/line/LineChart.thumbnail.tsx`, then go.
6. Never edit registry / live-index / placeholders / Thumbnail from a sub-agent — those are main-agent-only.
