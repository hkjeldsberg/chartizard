---
title: "feat: Upgrade remaining placeholder charts to live via parallel sub-agent batches"
type: feat
status: active
date: 2026-04-20
origin: docs/plans/2026-04-19-001-feat-chartizard-v1-plan.md
---

# feat: Upgrade remaining placeholder charts to live via parallel sub-agent batches

## Overview

The v1 plan shipped five fully-interactive charts and ~230 placeholder entries.
This plan turns the placeholders into live charts via a repeatable batch program:
(1) a written Chart Author Contract that every implementer (human or sub-agent)
follows, (2) a priority-ranked batch manifest, and (3) parallel sub-agent waves
that upgrade ~20 charts per batch. Batch 1 is concretely specified here; Batch
2+ reuses the same template with an updated manifest each round.

## Problem Frame

Implementing 230 interactive charts serially would take many sessions and
repeat the same boilerplate decisions each time. The charts are independent of
each other (no shared state, no shared data), each conforms to the same contract
already proven with the five v1 charts, and the codebase exposes exactly one
integration seam (`src/lib/chart-registry.tsx`) plus one data seam (move an
entry from `src/content/charts/placeholders.ts` into `src/content/charts/live/`).
That makes this an ideal parallel-dispatch target — provided we control the
registry/catalog-merge step to avoid write conflicts.

## Requirements Trace

- **R1.** Upgrade at least 20 placeholders per batch to fully-interactive live
  charts without regressing the five v1 charts.
- **R2.** Each upgraded chart must satisfy the Chart Author Contract
  (`docs/chart-author-contract.md`): responsive Visx SVG, 4-7 `ExplainAnchor`s,
  `whenToUse` / `howToRead` / `example` narrative, thumbnail component,
  registry entry.
- **R3.** Parallelize via sub-agents — user explicitly asked for sub-agent use.
  Sub-agents must be dispatchable in the same message so they execute
  concurrently.
- **R4.** Avoid file-write conflicts across parallel sub-agents.
- **R5.** Preserve the homepage bento + filter + Explain-mode UX unchanged; the
  only user-visible change is that more tiles carry the "live" affordance and
  more detail pages render a real chart instead of the Coming Soon placeholder.
- **R6.** Produce a reusable pattern so Batch 2, 3, … can be kicked off by
  pointing at an updated manifest — no re-planning required.

## Scope Boundaries

- **Non-goals in this plan:**
  - Implementing all 230 placeholder charts in one execution. Batch 1 = 20.
  - Changing the Chart Author Contract itself. If the contract needs to change,
    that's a separate refactor plan.
  - Any UX changes to the homepage, filter, Explain mode, or chart detail shell.
  - Any new facet categories in the filter taxonomy.
  - Data sourcing for charts beyond inline sample data per chart (same as v1).
  - Adding new sector surfaces or typography tokens.

### Deferred to Separate Tasks

- **Batch 2 (next ~20 charts):** Plan reused, manifest swapped for next 20
  entries. Same sub-agent template.
- **Batches 3..N:** Same pattern; eventually all remaining charts are live.
  Each batch is a separate execution of this plan with an updated manifest.
- **Deep content editorial pass:** Light prose-polish across all live charts
  once ~50 are live and the overall voice can be tuned holistically.
- **Shared-dataset library:** If data re-use across charts becomes common
  (e.g. same revenue dataset used by 4 finance charts), extract a
  `src/content/datasets/` module. Not needed until we see it.

## Context & Research

### Relevant Code and Patterns

- **Chart Author Contract implicit in v1** — formalize from:
  - `src/content/chart-schema.ts` — `LiveChart` / `PlannedChart` / `ChartEntry`
    types and `validateCatalog()`.
  - `src/content/charts/live/line-chart.ts` — canonical example of metadata,
    narrative, `elements[]` shape.
  - `src/charts/line/LineChart.tsx` — canonical Visx implementation with
    `ExplainAnchor` placement conventions.
  - `src/charts/line/LineChart.thumbnail.tsx` — canonical inline-SVG thumbnail.
  - `src/components/chart/ExplainAnchor.tsx` — anchor API: `selector`, `index`,
    `pin`, `rect`.
  - `src/components/bento/Tile.tsx` — tile size taxonomy (S/M/L/W/T) that each
    live chart declares in metadata.
- **Registry seam** — `src/lib/chart-registry.tsx`. One `dynamic(() => import())`
  entry per live chart. This is the serialization point where parallel work
  converges.
- **Catalog seam** — `src/content/charts/placeholders.ts` and
  `src/content/charts/live/index.ts`. Each upgrade removes one entry from the
  former and appends to the latter.
- **Homepage thumbnail dispatch** — `src/components/bento/Thumbnail.tsx` maps
  id → thumbnail component. Extended per batch.

### Institutional Learnings (from v1 execution)

- **Plan deviations that stuck and should not revert:**
  - Pure TypeScript chart modules instead of MDX + Content Collections (keeps
    the build trivial; easier for sub-agents to produce deterministic output).
  - `d3-hexbin` directly instead of `@visx/hexbin` (version-stable API).
  - Next 15.5 + React 18.3.1 (Visx 3.x peer compat).
- **ExplainAnchor placement is the most error-prone step.** Pin + rect
  coordinates must match rendered geometry. Sub-agents tend to drift if the
  chart inner-dimension calculation isn't copied from a reference chart.
- **Thumbnails are easier than charts.** Sub-agents should write the live
  chart first, then a trimmed thumbnail second. Do not attempt to share code
  between them — the thumbnail is a hand-drawn SVG at 120×80, not a scaled
  chart.

### External References

None new — all references carried over from the v1 plan.

## Key Technical Decisions

- **Batch size 20, two waves of 10.** Small enough that the main agent can
  integrate outputs without losing track; large enough to amortize the setup
  cost of dispatching sub-agents. Two waves keep parallelism bounded (5 agents
  concurrent max) which avoids overwhelming the tooling context.
- **Each sub-agent implements exactly 2 charts.** One is too little (setup
  overhead dominates); more than 3 starts producing sloppy work on later
  charts. 2 is the sweet spot.
- **Parallel sub-agents do NOT touch shared files.** They write ONLY to their
  own `src/charts/<slug>/` directories and their own `src/content/charts/live/<slug>.ts`
  entries. The main agent does the catalog + registry merge after all
  sub-agents return.
- **Chart Author Contract is a single markdown file sub-agents are required
  to read first** (`docs/chart-author-contract.md`). No inlining the contract
  into every prompt — too expensive and drifts from the canonical doc over time.
- **Priority ranking by real-world utility, not by implementation difficulty.**
  First 20 charts are the ones a user is most likely to search for (histogram,
  scatter, box plot, heatmap, bar, donut, radar…). Not the easiest; the most
  valuable.
- **Data per chart is inline in the chart file.** No shared-dataset module in
  v1. Each chart bundles its sample data and real-world example. Revisit if we
  see cross-chart duplication in Batch 4+.
- **Sub-agent model choice: Sonnet or Opus per agent's brief.** Most chart
  implementations are pattern-heavy and work well with `general-purpose`
  Sonnet-class sub-agents. Complex layout charts (sankey, treemap, sunburst)
  benefit from Opus. Route explicitly at dispatch time.

## Open Questions

### Resolved During Planning

- **How to avoid registry merge conflicts?** Sub-agents do NOT edit
  `chart-registry.tsx`, `placeholders.ts`, `live/index.ts`, or `Thumbnail.tsx`.
  Main agent does all four in a single integration unit after parallel work
  completes.
- **How many charts per sub-agent?** 2. Calibrated from v1 where hand-
  implementing 5 charts made clear that the per-chart cost is high enough that
  batches of >3 degrade.
- **Is Content Collections migration needed before scaling?** No. The TS-module
  pattern from v1 scales fine to 200+ charts. Migration is a separate refactor
  if ever needed.
- **What's Batch 1's target set?** See the Batch 1 Manifest below — 20 charts
  chosen for high search-utility × implementable-with-current-stack.

### Deferred to Implementation

- **Exact `elements[]` composition per chart.** Each sub-agent chooses 4-7
  anchors per chart based on what the chart actually renders; main agent spot-
  checks for "did you anchor all the meaningful elements, not just axes?".
- **Real-world example dataset per chart.** Each sub-agent proposes; the
  content review step (Unit 5) catches weak examples and swaps them.
- **Hand-picked tile sizes for upgraded charts.** Currently each placeholder
  has a tileSize. Sub-agents may bump it up (e.g. from S to M) if the live
  chart needs more room. Noted in the Contract as permitted.
- **Whether any chart in Batch 1 actually needs a new npm dep** (e.g.
  `d3-sankey` for sankey-diagram). Noted per chart in the manifest — sub-
  agents flag dep additions back to main agent rather than adding them
  unilaterally.

## Output Structure

Batch 1 will produce these additions (directories; each contains 2-3 files):

```
src/charts/
  bar/
    BarChart.tsx
    BarChart.thumbnail.tsx
  horizontal-bar/{…}
  histogram/{…}
  scatter/{…}
  box-plot/{…}
  heatmap/{…}
  donut/{…}
  radar/{…}
  sparkline/{…}
  kpi-tile/{…}
  bubble/{…}
  violin/{…}
  density/{…}
  treemap/{…}
  sunburst/{…}
  funnel/{…}
  gauge/{…}
  gantt/{…}
  candlestick/{…}
  sankey/{…}
src/content/charts/live/
  bar-chart.ts
  horizontal-bar-graph.ts
  histogram.ts
  scatter-plot.ts
  box-plot.ts
  heatmap.ts
  donut-chart.ts
  radar-chart.ts
  sparkline.ts
  kpi-tile.ts
  bubble-chart.ts
  violin-plot.ts
  density-plot.ts
  treemap.ts
  sunburst-chart.ts
  funnel-chart.ts
  gauge-chart.ts
  gantt-chart.ts
  candlestick-chart.ts
  sankey-diagram.ts
docs/
  chart-author-contract.md          # single source of truth for sub-agents
  batches/
    2026-04-20-batch-01.md          # batch 1 manifest + post-mortem
```

Modifications (main agent only — no parallel writes):

- `src/lib/chart-registry.tsx` — 20 new dynamic imports.
- `src/content/charts/live/index.ts` — 20 new exports added to `LIVE_CHARTS`.
- `src/content/charts/placeholders.ts` — 20 entries removed.
- `src/components/bento/Thumbnail.tsx` — 20 new entries in `LIVE_THUMBS`.

## High-Level Technical Design

> *This illustrates the intended approach and is directional guidance for
> review, not implementation specification.*

### Sub-agent dispatch pattern

```
                       ┌──────────────────────────────┐
                       │  Main agent — this session   │
                       │  Reads: contract + manifest  │
                       └──────────────┬───────────────┘
                                      │
                 ┌────────────────────┼────────────────────┐
                 │                    │                    │
                 ▼                    ▼                    ▼
          ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
Wave A:   │ sub-agent A1 │ ... │ sub-agent A5 │     │    (5 total) │
          │ charts 1, 2  │     │ charts 9, 10 │     │              │
          └──────┬───────┘     └──────┬───────┘     └──────────────┘
                 │                    │
                 ▼                    ▼
          writes src/charts/<slug>/* and src/content/charts/live/<slug>.ts ONLY
                 │                    │
                 └────────┬───────────┘
                          │
                          ▼
                  ┌──────────────────┐
                  │  Main agent      │
                  │  Integration:    │
                  │  registry +      │
                  │  catalog merges  │
                  └────────┬─────────┘
                           │
                           ▼
                  Wave B (5 more sub-agents, charts 11-20)
                           │
                           ▼
                  Integration again → verify → post-mortem
```

### Sub-agent prompt template (conceptual)

```
You are implementing N Chartizard live charts. Do not run shell commands.
Do not touch shared files (registry, placeholders.ts, live/index.ts, Thumbnail.tsx).

BEFORE ANYTHING ELSE, read:
  docs/chart-author-contract.md
  src/content/charts/live/line-chart.ts     (canonical metadata example)
  src/charts/line/LineChart.tsx             (canonical Visx + anchors example)
  src/charts/line/LineChart.thumbnail.tsx   (canonical thumbnail example)

Charts assigned to you:
  1. <slug> — <name> — family: <family> — sectors: [<sector>...]
     Tile size suggestion: <S|M|L|W|T>
     Data story hint: <one-line suggestion for the real-world example>
  2. <slug> — …

Deliverables per chart:
  - src/charts/<slug>/<Name>Chart.tsx        (full Visx live chart, 4-7 anchors, data-data-layer="true" on all data-bearing groups)
  - src/charts/<slug>/<Name>Chart.thumbnail.tsx  (hand-drawn inline SVG, 120×80 viewBox, no Visx)
  - src/content/charts/live/<slug>.ts        (LiveChart object — metadata + narrative + elements[])

Do NOT:
  - Add new npm dependencies (flag them in your reply instead)
  - Import from @visx/hexbin (use d3-hexbin directly if binning needed)
  - Remove entries from placeholders.ts (main agent handles that)
  - Register your chart in chart-registry.tsx (main agent handles that)

Report back:
  - File paths written
  - Any dep flags
  - Any deviations from the contract and why
```

### Integration merge shape (after each wave)

- Main agent reads each sub-agent's report.
- Runs the validation script mentally: schema compliance, anchor count in
  [4,8], narrative non-empty, thumbnail component exists.
- Appends 20 lines to `chart-registry.tsx`, 20 imports + array entries to
  `live/index.ts`, 20 entries to `Thumbnail.tsx`'s `LIVE_THUMBS`, removes 20
  rows from `placeholders.ts`.
- `validateCatalog()` runs at module load; any failure surfaces on next
  `npm run dev` / `npm run typecheck`.

## Implementation Units

- [ ] **Unit 1: Chart Author Contract document**

**Goal:** Codify the implicit v1 contract into a single sub-agent-readable
reference document that every future implementer uses as the primary spec.

**Requirements:** R2, R6.

**Dependencies:** None.

**Files:**
- Create: `docs/chart-author-contract.md`

**Approach:**
- Sections: (1) The chart's public API (`width`, `height` props + `use client`
  directive), (2) Required file layout per chart (component + thumbnail +
  content entry), (3) ExplainAnchor contract (selector naming, index numbering,
  pin/rect coordinate space, how to find anchor coordinates), (4) Metadata
  schema with a field-by-field example, (5) `data-data-layer="true"` contract
  (must be present on every data-bearing `<g>` so ChartCanvas can dim it),
  (6) Do-not-touch list (registry, placeholders, live/index, Thumbnail
  dispatcher), (7) Real-world example authoring guide (one paragraph,
  specific organisation + specific insight, not generic).
- Include three annotated examples pulled from v1: line (simplest), stacked
  bar (axes + stacking), pie (polar coord system). These are the sub-agent's
  reference implementations.

**Patterns to follow:** None — this is the new canonical doc.

**Test scenarios:**
- Test expectation: none — documentation artifact.

**Verification:**
- A sub-agent given only the contract + one v1 example file + a chart name
  could produce a schema-compliant live chart without any other context.

---

- [ ] **Unit 2: Batch 1 manifest + priority ranking**

**Goal:** Publish the prioritized list of the next 20 charts to upgrade,
assigned to 10 sub-agent slots (2 charts per slot), split into Wave A
(10 charts, 5 parallel slots) and Wave B (10 charts, 5 parallel slots).

**Requirements:** R1, R3, R6.

**Dependencies:** Unit 1.

**Files:**
- Create: `docs/batches/2026-04-20-batch-01.md`

**Approach:**
- The manifest assigns each chart: id, name, family, sectors, suggested tile
  size, a one-line data-story hint, and an assigned sub-agent slot.
- Ranking logic: high-utility (in top 30 of data-viz search queries), broad-
  applicability (belongs to General / Statistics / Business / Finance), stack-
  feasibility (implementable with existing @visx deps + d3-shape / d3-hexbin
  / d3-sankey at most one new dep).
- **Batch 1 list (20 charts, ranked):**
  - **Wave A (simpler, 5 slots × 2 charts):**
    - Slot A1: `bar-chart`, `horizontal-bar-graph`
    - Slot A2: `histogram`, `donut-chart`
    - Slot A3: `scatter-plot`, `bubble-chart`
    - Slot A4: `box-plot`, `violin-plot`
    - Slot A5: `heatmap`, `radar-chart`
  - **Wave B (harder, 5 slots × 2 charts):**
    - Slot B1: `sparkline`, `kpi-tile`
    - Slot B2: `density-plot`, `gauge-chart`
    - Slot B3: `candlestick-chart`, `gantt-chart`
    - Slot B4: `funnel-chart`, `treemap`
    - Slot B5: `sunburst-chart`, `sankey-diagram` *(flag: sankey may need
      `d3-sankey` dep — sub-agent reports, main agent decides)*
- For each chart, include a two-sentence data-story hint so sub-agents don't
  waste cycles inventing generic examples. E.g. for `candlestick-chart`:
  "Daily price of a single equity (AAPL sample), 20 trading days. Story: the
  interplay of wick vs body width is a volatility signal professional traders
  read before they read the close."

**Patterns to follow:** None.

**Test scenarios:**
- Test expectation: none — planning artifact.

**Verification:**
- Each of the 20 chart ids exists in `src/content/charts/placeholders.ts` (no
  typos).
- Ranking and slot assignment are explicit.
- Each chart has a data-story hint.

---

- [ ] **Unit 3: Dispatch Wave A (10 charts, 5 parallel sub-agents)**

**Goal:** Run the Wave A sub-agent wave, integrate their outputs, and land 10
new live charts.

**Requirements:** R1, R3, R4.

**Dependencies:** Units 1, 2.

**Files (main-agent-only writes after wave returns):**
- Modify: `src/lib/chart-registry.tsx` — add 10 dynamic() entries.
- Modify: `src/content/charts/live/index.ts` — add 10 imports + array entries.
- Modify: `src/content/charts/placeholders.ts` — remove 10 rows.
- Modify: `src/components/bento/Thumbnail.tsx` — add 10 entries in `LIVE_THUMBS`.

**Files (sub-agents create — no parallel conflicts):**
- Create per chart (×10):
  - `src/charts/<slug>/<Name>Chart.tsx`
  - `src/charts/<slug>/<Name>Chart.thumbnail.tsx`
  - `src/content/charts/live/<slug>.ts`

**Approach:**
- Main agent launches 5 sub-agents in one Agent-tool block so they run
  concurrently. Each sub-agent receives its 2-chart slot, the sub-agent
  prompt template, and paths to the contract + v1 reference files.
- Expected sub-agent output: deliverable file paths + dep flags + any
  deviations.
- Main agent gathers outputs, verifies the 30 expected files exist, does the
  four merges in shared files, and re-runs the catalog validation mentally
  (schema check, anchor count, narrative presence).
- If any sub-agent flagged a new dep (e.g. `d3-sankey`), main agent decides
  whether to accept it; sankey is scheduled for Wave B not Wave A anyway, so
  no dep churn expected here.

**Execution note:** Sub-agent parallelism is the key lever for R3. Dispatch
via the Agent tool with multiple content blocks in one message — sequential
dispatch would lose the parallelization win.

**Patterns to follow:**
- `src/charts/line/LineChart.tsx` — Visx + anchors reference.
- `src/content/charts/live/line-chart.ts` — metadata reference.

**Test scenarios:**
- *Happy path:* Each of the 10 new chart detail routes `/charts/<slug>` renders
  a Visx chart without runtime errors in dev.
- *Happy path:* Each chart's thumbnail appears on the homepage bento in place
  of the placeholder silhouette.
- *Happy path:* `ALL_CHARTS` contains 15 live entries after Wave A (5 from v1
  + 10 from this wave); `validateCatalog` passes.
- *Edge case:* Placeholder row for any upgraded id is gone from
  `placeholders.ts` — not duplicated into both places.
- *Edge case:* Filter "Live only" now shows 15 charts, not 5.
- *Error path:* Any chart with fewer than 4 anchors or without `example` is
  caught by `validateCatalog` at startup and blocks the dev server.
- *Integration:* Toggling Explain mode on each new chart reveals numbered
  pins at the anchor positions (no anchors rendering off-canvas).
- *Integration:* Homepage `/?live=1` URL deep-links into "live only" view and
  shows all 15 live charts.

**Verification:**
- `npm run typecheck` clean.
- `npm run test` — catalog tests pass; one-per-chart smoke test (auto-
  generated from id list) passes.
- `npm run dev` — visit 3 randomly sampled new chart pages; Explain mode
  works on each; thumbnails load without 404s.
- No files modified outside the enumerated paths (quick diff check).

---

- [ ] **Unit 4: Dispatch Wave B (10 charts, 5 parallel sub-agents)**

**Goal:** Run the Wave B sub-agent wave — harder charts — integrate their
outputs, and land 10 more live charts.

**Requirements:** R1, R3, R4.

**Dependencies:** Unit 3 (Wave A merged + green).

**Files:** Same shape as Unit 3 — 10 new chart dirs + the same four shared
files re-edited additively.

**Approach:**
- Same sub-agent dispatch mechanism as Unit 3, scoped to Wave B's 10 charts.
- Wave B charts are layout-heavier (sankey, treemap, sunburst, gantt, funnel,
  gauge). Dispatch those slots with the Opus-class sub-agent model; simpler
  slots (sparkline, kpi-tile, density, candlestick) can use Sonnet.
- Flag: `d3-sankey` is a new dep candidate for sankey-diagram. Sub-agent B5
  reports the flag; main agent adds it to `package.json` if accepted.
- Same integration + merge + validation cycle as Unit 3.

**Execution note:** Run Wave B strictly after Wave A is merged and green —
parallel A+B would race on the shared files.

**Patterns to follow:**
- `src/charts/stacked-bar/StackedBarChart.tsx` — example of a chart with
  bar stacking + legend + multi-axis layout (useful reference for gantt,
  candlestick, funnel).
- `src/charts/hexbin/HexbinChart.tsx` — example of a chart using a non-visx
  d3 primitive (`d3-hexbin`) directly — template for sankey using `d3-sankey`.

**Test scenarios:**
- *Happy path:* All 10 new chart detail routes render without runtime errors.
- *Happy path:* Sankey-specific: ribbons don't overlap nodes; node labels
  legible at all tile sizes.
- *Happy path:* Treemap + Sunburst render with ≥3 levels of nesting visible.
- *Edge case:* `ALL_CHARTS` now has 25 live entries; `validateCatalog`
  passes; no duplicate ids.
- *Edge case:* Gantt chart with zero-duration task renders without throwing.
- *Edge case:* Gauge chart at width < 200px doesn't overflow its tile.
- *Error path:* If `d3-sankey` was accepted, `npm install` succeeds and bundle
  size stays reasonable (< 300KB per chart page).
- *Integration:* Filter combinations still work (e.g. `family=hierarchy&
  live=1` returns treemap + sunburst).
- *Integration:* Placeholders page tests still pass (the 20 upgraded
  placeholders are gone; the remaining ~210 still render with correct family
  silhouettes).

**Verification:**
- `npm run typecheck`, `npm run test`, and manual spot-checks per chart as in
  Unit 3.
- Sankey + treemap + sunburst visual review: do they read as the museum-label
  editorial voice Chartizard goes for, or do they read as generic d3 examples?
  If the latter, iterate with `frontend-design` skill before declaring done.

---

- [ ] **Unit 5: Batch-1 verification + content review**

**Goal:** End-to-end verification that Batch 1 landed cleanly and an editorial
pass on the 20 new narratives.

**Requirements:** R1, R2, R5.

**Dependencies:** Units 3, 4.

**Files:**
- Modify: selected `src/content/charts/live/<slug>.ts` files if narrative
  polish is needed.
- Modify: `TODO.md`, `TOKENS.md` with batch-1 entries.

**Approach:**
- Auto-generated manifest check: list every chart id in `LIVE_CHARTS` and
  verify each has: a matching `chart-registry.tsx` entry, a matching
  `LIVE_THUMBS` entry, a chart component file, a thumbnail file, and is NOT
  present in `placeholders.ts`. This is a short script-or-mental check — the
  goal is to catch any drop between the four merge points.
- Editorial pass: read the 20 `whenToUse` / `howToRead` / `example` blocks in
  one sitting. Flag blocks that drift into generic marketing voice; fix in
  place. The editorial rule from the v1 plan holds: *museum label, not SaaS
  landing page*.
- Regression sweep: load `/` and confirm the bento still reads well with 15
  more live thumbnails — some tile-size assignments may need bumping if a
  live chart looks cramped at its current size. Small tile-size tweaks land
  in the `live/<slug>.ts` entry and only in this unit.
- Update root-level `TODO.md`: mark Batch 1 complete, queue Batch 2 manifest
  creation as the next action. Log tokens in `TOKENS.md` per project rules.

**Patterns to follow:**
- `CLAUDE.md` project rules: no git commands, log tokens per subtask, track
  work in `TODO.md`.

**Test scenarios:**
- *Happy path:* All 20 new live chart pages pass a visual/interaction spot
  check (chart renders, Explain mode works, narrative reads well).
- *Happy path:* Homepage with 25 live thumbnails is not visually busier than
  before (the editorial rhythm of the bento still holds).
- *Edge case:* Any chart whose tile-size bumped up (e.g. S → M) reflows the
  surrounding grid without leaving gaps.
- *Integration:* Counts in the Hero (`Live: 25`) update automatically from
  `LIVE_CHARTS.length`; no hardcoded numbers drift.

**Verification:**
- `npm run build` completes.
- Any remaining schema / anchor issues from Unit 3 / 4 are resolved.
- `Hero` component shows `Live: 25` (was 5 at v1 cut-over).
- `CHARTS.md` / `CHARTS_CATEGORIZED.md` are unchanged — these are the
  source-of-truth atlas files; Batch work happens in content/charts only.

---

- [ ] **Unit 6: Post-mortem + Batch 2 manifest**

**Goal:** Close out Batch 1 with a written post-mortem and stand up the next
batch's manifest so the program can continue without re-planning.

**Requirements:** R6.

**Dependencies:** Unit 5.

**Files:**
- Modify: `docs/batches/2026-04-20-batch-01.md` — add a "Post-mortem"
  section.
- Create: `docs/batches/<next-date>-batch-02.md` — manifest for the next
  20 charts following the exact same Unit 2 template.

**Approach:**
- Post-mortem records: sub-agent wall-clock time per slot, any dep flags
  surfaced, any anchor-coordinate drift caught in review, any narrative
  blocks that needed heavy editing. The purpose is to tune the sub-agent
  prompt template and the Chart Author Contract for Batch 2.
- Next-batch manifest: pick the next 20 highest-utility placeholders. Expected
  candidates for Batch 2: `waterfall-chart`, `choropleth`, `tree-chart`,
  `dendrogram`, `word-cloud`, `network-diagram`, `flowchart`, `pareto-chart`,
  `control-chart`, `pyramid-chart`, `lollipop-plot`, `stem-and-leaf`, `qq-plot`,
  `parallel-coordinates`, `chord-diagram`, `venn-diagram`, `ridgeline-plot`,
  `population-pyramid`, `kaplan-meier-curve`, `run-chart`. Final selection
  happens in Batch 2's Unit 2.
- If the post-mortem surfaces a contract change (e.g. "sub-agents consistently
  mis-placed anchor rects"), update `docs/chart-author-contract.md` in the
  same unit — that's the whole point of the living contract.

**Patterns to follow:** The manifest template from Unit 2.

**Test scenarios:**
- Test expectation: none — planning + retrospective artifact.

**Verification:**
- Batch 2 manifest exists and lists 20 charts with all required fields (id,
  name, family, sectors, tile size, slot, data-story hint).
- Post-mortem flags zero unresolved issues from Batch 1 (resolved ones are
  fine — they're documented learning).
- If the contract was updated, every bullet updated has a link to the Batch 1
  finding that motivated it.

## System-Wide Impact

- **Interaction graph:** None new. Each live chart is self-contained behind
  the existing Chart Registry seam; the only cross-cutting touch is the four
  shared files the main agent edits. Homepage bento, filter, Explain mode,
  and chart detail shell are all untouched.
- **Error propagation:** `validateCatalog()` at module load remains the
  guardrail. A malformed Batch 1 chart surfaces as a build-time error, not a
  runtime broken tile.
- **State lifecycle risks:** None — content is still compile-time static.
- **API surface parity:** The Chart component contract (`width`, `height`,
  `use client`) is the implicit public API for this repo. Unit 1's contract
  doc promotes it to an explicit public API. All 20 Batch 1 charts must
  conform, and so must every future chart.
- **Integration coverage:** Catalog integrity (Unit 5) is the high-value
  integration check. Per-chart Explain-mode behaviour is unit-tested by each
  chart's own spot-check in Units 3/4.
- **Unchanged invariants:**
  - Homepage URL + filter semantics (`?sector=…`, `?family=…`, `?shape=…`,
    `?live=1`) — unchanged.
  - Tile size taxonomy (S/M/L/W/T) — unchanged. Batch 1 may bump individual
    charts between sizes; it does not introduce new sizes.
  - ExplainAnchor API (`selector`, `index`, `pin`, `rect`) — unchanged.
  - `ChartEntry` / `LiveChart` / `PlannedChart` schemas — unchanged.

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Sub-agent outputs drift from the v1 chart voice (too generic, too technical, too marketing-y). | Unit 5 editorial pass catches this. Contract doc sets the voice rules explicitly with counter-examples. |
| Two sub-agents in the same wave produce conflicting imports (e.g. both add `d3-sankey`). | Each sub-agent is instructed to FLAG deps, not add them. Main agent resolves dep additions in a single integration pass. |
| Anchor coordinates drift from rendered geometry (pins floating, rects not over the intended mark). | Contract doc shows the exact "how to compute pin from data-space coordinates" recipe; Unit 5 interactive spot-check per chart catches drift. |
| Treemap / Sunburst / Sankey layouts don't read as editorial — they read as generic d3 examples. | Route those slots to Opus-class sub-agents in Unit 4; Unit 5 iterates with `frontend-design` skill before declaring done. |
| Validation failures at build time block dev server for everyone. | Validation is catch-it-early, not catch-it-late. Contract specifies minimum invariants (≥4 anchors, non-empty `example`, narrative non-empty). Sub-agents conform before their output even lands. |
| Batch 1 succeeds but nobody picks up Batch 2 and the program stalls. | Unit 6 produces the Batch 2 manifest proactively so the next session starts from a populated batch file, not a blank page. |
| The post-mortem catches so many contract issues that re-work is needed across all 20 Batch 1 charts. | Unit 5 editorial pass is the first filter; contract updates in Unit 6 apply to Batch 2 onward, not retroactively. If retroactive fixes are large, raise a separate refactor plan. |

## Documentation / Operational Notes

- The Chart Author Contract (`docs/chart-author-contract.md`) is the single
  source of truth. When it drifts, every future chart drifts. Treat it with
  the same care as a public API spec.
- `docs/batches/` is the batch program's log. One file per batch; each file
  combines its manifest and its post-mortem. Do not delete old batch files —
  they're the record of how the program tuned over time.
- `TODO.md` and `TOKENS.md` get a per-batch entry at the start and end.

## Sub-Agent Execution Guidance

- **Parallelism bound:** 5 concurrent sub-agents per wave. Dispatch all five
  in a single tool-call message so they run truly concurrently.
- **Per-sub-agent brief length:** aim for ~600 words — enough to unambiguously
  assign 2 charts without re-specifying the contract (which is already in the
  contract doc the sub-agent reads).
- **Do not** have sub-agents update the homepage, filter, Explain mode, chart
  detail shell, registry, catalog, or placeholders files. These all converge
  in the main agent's integration unit.
- **Wave boundary is hard.** Do not start Wave B until Wave A is merged and
  green — they race on the same four shared files.

## Sources & References

- **Origin plan:** [docs/plans/2026-04-19-001-feat-chartizard-v1-plan.md](./2026-04-19-001-feat-chartizard-v1-plan.md)
- **Atlas source:** `CHARTS.md`, `CHARTS_CATEGORIZED.md`
- **Canonical chart example:** `src/charts/line/LineChart.tsx`
- **Canonical metadata example:** `src/content/charts/live/line-chart.ts`
- **ExplainAnchor API:** `src/components/chart/ExplainAnchor.tsx`
- **Registry seam:** `src/lib/chart-registry.tsx`
- **Project rules:** `CLAUDE.md`
