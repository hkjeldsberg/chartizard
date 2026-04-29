---
title: "feat: Chartizard v1 — homepage + 5 live charts + placeholders"
type: feat
status: active
date: 2026-04-19
origin: PRD.md
---

# feat: Chartizard v1 — homepage + 5 live charts + placeholders

## Overview

Build the first shippable version of **Chartizard** — a web app that catalogs "every chart type known to mankind" (~280 entries) in an interactive Bento gallery, filterable by sector/field. v1 delivers the scaffolding (framework, design system, content model, homepage bento, filter, chart detail shell, "Explain mode") and five fully-interactive chart pages: **Line, Area, Stacked Bar, Pie, and Hexagonal Binning**. The remaining ~275 charts ship as metadata-only placeholders with thumbnails and a "Coming soon" detail state.

Every live chart exposes hover explanations on each chart element (axes, ticks, legend, slices, bars, hexes), a "how to read it" narrative, and a real-world example.

## Problem Frame

Chart galleries today either (a) show charts without teaching users how to read them (e.g. D3 Graph Gallery), or (b) teach chart selection without showing the inventory at scale (e.g. Data-to-Viz). Chartizard's wedge is *both*: a visually-rich, filterable atlas of chart types where each one is a small interactive lesson. v1 proves the pattern end-to-end with 5 charts so v2+ can pour in the remaining 275.

## Requirements Trace

- **R1.** Display thumbnails of all ~280 chart types on the homepage in a bento-grid layout (`see origin: PRD.md`).
- **R2.** Filter the homepage by sector/field/category (finance, biology, statistics, general, …) (`see origin: PRD.md`, `CHARTS_CATEGORIZED.md`).
- **R3.** Implement 5 fully-interactive charts: Line, Area, Stacked Bar, Pie, Hexagonal Binning.
- **R4.** Each interactive chart has hover-over explanations of individual chart elements (not just value tooltips — axes, ticks, legend items, slices, bars).
- **R5.** Each live chart page includes a "how to interpret" narrative and a real-world example.
- **R6.** Remaining charts render as placeholder tiles on the homepage (thumbnail + name + sector tag) and a "Coming soon" detail page.
- **R7.** Design is **Interactive Bento**, fast, functional, responsive on mobile.
- **R8.** Avoid generic-AI aesthetic (dark-mode-first, glassmorphism, uniform cards, stock-photo hero) unless explicitly specified by the user.

## Scope Boundaries

- **Non-goals in v1:**
  - Implementing more than the 5 specified charts.
  - Authentication, user accounts, favourites, or personalization.
  - A contact form, testimonials, pricing, or a typical marketing-site structure.
  - Dark mode (explicitly not-specified by the user — avoid).
  - Server-side analytics, AB testing, or telemetry beyond basic web vitals.
  - Embedding, sharing URLs with custom data, or "bring your own data" features.
  - Search across chart prose — filter is the v1 discovery surface.
  - CI/CD, deployment infrastructure, or domain setup (can be layered on top of the v1 build).

### Deferred to Separate Tasks

- **Remaining 275 chart implementations:** Will be implemented in subsequent batches (grouped by family) in follow-up PRs. The v1 data model and detail-page shell are designed to accept them without rework.
- **Search-as-you-type across chart names + tags:** Planned for v2 once the filter sidebar is validated with real usage.
- **Dark mode:** Tokens are structured to support it, but the v1 theme is light-only.

## Context & Research

### Relevant Local Inputs

- `PRD.md` — product vision (5 lines).
- `CHARTS.md` — canonical list of chart types (v0 + v1 sections).
- `CHARTS_CATEGORIZED.md` — ~280 charts mapped to 25 sector/field categories; this drives the filter taxonomy and each chart's `sectors[]` metadata.
- `CLAUDE.md` — project rules: no git commands, log tokens in `TOKENS.md`, track tasks in `TODO.md`.

### Institutional Learnings

None yet — greenfield project, empty `docs/solutions/`.

### External References

- [FT Visual Vocabulary](https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary) — canonical chart-purpose taxonomy. Inform the `family` facet (comparison / distribution / composition / relationship / flow / change-over-time).
- [Data Visualisation Catalogue](https://datavizcatalogue.com) — direct prior-art for filter-by-function; we want better bento + richer per-chart teaching.
- [D3 Graph Gallery](https://d3-graph-gallery.com/all.html) — cautionary example of tile-density problem to improve on (all same size, no curation).
- [Next.js 16 release notes](https://nextjs.org/blog/next-16-1) — App Router, Partial Prerendering, async route params.
- [Visx docs](https://airbnb.io/visx/) — chosen chart primitives.
- [@visx/hexbin](https://airbnb.io/visx/docs/hexbin) — hexagonal binning support.
- [Tailwind CSS v4](https://tailwindcss.com) — CSS-first theme, container queries, `@starting-style`.
- [shadcn/ui](https://ui.shadcn.com) — Drawer, Tooltip, DropdownMenu, ToggleGroup primitives.
- [Content Collections — Next.js quickstart](https://www.content-collections.dev/docs/quickstart/next) — MDX + Zod content pipeline.
- [Bento Grid Design 2026](https://senorit.de/en/blog/bento-grid-design-trend-2025) — `grid-auto-flow: dense` patterns.
- [The Linear Look](https://frontend.horse/articles/the-linear-look/) — restrained distinctiveness reference.

## Key Technical Decisions

- **Framework: Next.js 16.2 (App Router) + React 18.3.** Justification: ~280 SEO-friendly chart pages demand SSG, but the charts themselves are client-interactive — App Router's RSC + client-island model is the exact fit. React pinned to 18.3 (not 19) because Visx 3.12 peer-deps flag React 19 with type warnings; revisit when Visx 4 ships stable.
- **Charts: single library — Visx 3.12 for all five.** Justification: hexagonal binning is the dealbreaker (Recharts, Nivo, Chart.js have no hexbin; ECharts/Plotly are monolithic and lock the tooltip model). Visx lets us attach custom hover handlers per SVG element — required by R4 — and keeps API consistency as we add 275 more charts. Tree-shaken per-chart bundle ~15–50 KB.
- **Styling: Tailwind CSS v4.1 with CSS-first `@theme` tokens.** Justification: native container queries make bento tiles reflow without JS; `@theme` makes sector-tinted surfaces trivial; shadcn/ui assumes Tailwind.
- **Primitives: shadcn/ui (Tailwind v4-native).** Justification: we need Drawer (chart detail can also open as side-panel on large screens), Tooltip (Explain-mode coach-marks), DropdownMenu (sector filter on mobile), ToggleGroup (Explain on/off). Copying code lets us own theming.
- **Content model: Content Collections + MDX + Zod.** Justification: Contentlayer is abandoned; Content Collections is the Zod-native successor with first-class Next App Router support. One MDX file per chart — frontmatter = metadata, body = the "how to read it" + real-world example prose, the live component is imported by id. Placeholder charts use `status: "planned"` with only frontmatter; live charts use `status: "live"` and an `elements[]` array driving Explain-mode anchors.
- **Filter state: URL-synced with `nuqs`.** Justification: users can deep-link into "finance + composition" views; refreshes preserve state; Next.js RSC-friendly.
- **Thumbnails: pre-rendered static SVG at build time for live charts; CSS/icon placeholder for planned charts.** Justification: mounting ~280 live React charts on the homepage will stutter on mid-range hardware. SVGs render server-side via `renderToStaticMarkup` inside a build script, get cached in Content Collections output, and theme via CSS custom properties.
- **Bento layout: CSS Grid with `grid-auto-flow: dense`, a 12-col base, and ~5 editorial tile sizes (S/M/L/W/T).** Justification: distinctiveness comes from intentional asymmetry — "equal-size cards in a 3x3" is the AI-slop tell. Each chart carries its preferred tile size as metadata.
- **Typography: Fraunces (display) + IBM Plex Sans (body) + IBM Plex Mono (axis labels, metadata).** Justification: serif display gives editorial "museum label" voice the brief calls for; avoids the Inter-everywhere default.
- **Sector-tinted tile surfaces (light theme only for v1).** Justification: distinguishes sectors visually without icon chrome, lets the chart itself be the ornament. ~10 tonal surfaces, one per dominant sector group.

## Open Questions

### Resolved During Planning

- **Which chart library?** → Visx 3.12 (only option covering hexbin + per-element hover across one consistent API).
- **Framework?** → Next.js 16.2 App Router.
- **How to render 280 thumbnails performantly?** → Pre-rendered SVG at build time for live charts; placeholder component for planned charts.
- **How to structure the 280-chart dataset?** → One MDX file per chart under `content/charts/`, with a Zod schema distinguishing `status: "live" | "planned"`.
- **How to avoid collision between Visx's native tooltip and our explanation tooltips?** → Disable Visx's native tooltip in Explain mode; re-enable in default mode. Two modes, never both tooltips simultaneously.
- **How is "Explain mode" triggered?** → ToggleGroup button on the chart detail page + keyboard shortcut (`?`).

### Deferred to Implementation

- **Exact list of sector surface colours and their contrast ratios.** Resolve during Unit 2 with the `frontend-design` skill; 25 categories from `CHARTS_CATEGORIZED.md` likely collapse to ~8-10 tonal surfaces.
- **Per-chart tile size assignments for the bento layout.** Resolve while populating chart metadata (Unit 3) — "hero" tiles (L/W) go to charts that render well large (Sankey, Treemap, Network, Hexbin); small tiles (S) go to charts that read fine at thumbnail scale (Pie, Donut, Sparkline).
- **Exact Explain-mode coach-mark count + copy per chart.** Resolve during Unit 7 — each live chart will have ~4-8 anchored explanations.
- **Whether the chart detail view opens as a route (`/charts/[id]`) or as a Drawer overlay on the homepage.** Default to routed detail page for shareable URLs + SEO; revisit if homepage exploration feels broken. Not a blocking decision.
- **Nuqs adapter version compatibility with Next 16.2.** Verify during Unit 5; fallback is reading `searchParams` directly in the RSC layout + a small client hook.

## Output Structure

Greenfield project. Expected repo shape after v1 (the implementer may adjust if a better layout emerges):

```
chartizard/
  package.json
  tsconfig.json
  next.config.ts
  postcss.config.mjs
  tailwind.config.ts                    # minimal, mostly empty — v4 theme lives in CSS
  content-collections.ts                # Zod schemas for chart MDX
  src/
    app/
      layout.tsx                        # root layout, fonts, global theme
      page.tsx                          # homepage: bento gallery + filter
      charts/
        [id]/
          page.tsx                      # chart detail route
          not-found.tsx
      globals.css                       # @theme tokens, sector surfaces, bento classes
    components/
      bento/
        Grid.tsx                        # CSS-grid bento container
        Tile.tsx                        # tile wrapper, size variants
        Thumbnail.tsx                   # renders static SVG thumbnail or placeholder
      filter/
        FilterSidebar.tsx
        FilterChips.tsx
        FilterState.tsx                 # nuqs-backed hook
      chart/
        ChartFrame.tsx                  # detail-page chrome (title, sectors, narrative)
        ExplainToggle.tsx
        ExplainOverlay.tsx              # coach-marks + dimming
        ExplainAnchor.tsx               # invisible SVG rect wrapper
      ui/                               # shadcn components (drawer, tooltip, dropdown, toggle, badge, dialog)
    charts/
      line/
        LineChart.tsx                   # live interactive chart
        LineChart.thumbnail.tsx         # static SVG thumbnail
        data.ts                         # sample data
      area/{…}
      stacked-bar/{…}
      pie/{…}
      hexbin/{…}
      _placeholder/
        PlaceholderTile.tsx             # rendered for status: "planned" charts
    lib/
      sectors.ts                        # sector → surface-token mapping
      chart-registry.ts                 # id → live component resolver
      thumbnail-render.ts               # build-time SSR of thumbnail SVG
    content/
      charts/                           # 280 MDX files
        line-chart.mdx                  # status: live
        area-chart.mdx                  # status: live
        stacked-bar-chart.mdx           # status: live
        pie-chart.mdx                   # status: live
        hexagonal-binning-chart.mdx     # status: live
        _planned/                       # 275 stubs, status: "planned"
  tests/
    e2e/                                # Playwright specs
    unit/                               # Vitest specs
```

## High-Level Technical Design

> *This illustrates the intended approach and is directional guidance for review, not implementation specification. The implementing agent should treat it as context, not code to reproduce.*

### Content model (Zod schema sketch)

```
ChartMeta {
  id:        kebab-case slug, unique          // "stacked-bar-chart"
  name:      display name                     // "Stacked Bar Chart"
  family:    "comparison" | "composition" | "distribution"
             | "relationship" | "flow" | "change-over-time"
             | "hierarchy" | "geospatial" | "specialty"
  sectors:   Array<SectorId>                  // ["general", "business"]
  dataShape: Array<"categorical" | "continuous" | "temporal"
             | "geospatial" | "hierarchical" | "network">
  tileSize:  "S" | "M" | "L" | "W" | "T"
  status:    "live" | "planned"
  // live only:
  elements?: Array<{ selector: string, label: string, explanation: string }>
  example?:  { title: string, description: string, data: unknown }
  // body of MDX holds "How to read it" + longer real-world example prose
}
```

### Explain-mode state flow (narrative)

```
[ Chart idle ]
   | user clicks "Explain"  (or presses "?")
   v
[ Explain mode ON ]
   • Visx native tooltip disabled
   • SVG root class: .explain-active
   • CSS dims data-bearing layers to ~40% opacity
   • Invisible <rect data-explain="y-axis-tick"> overlays become pointer targets
   • Numbered coach-marks (1, 2, 3 …) render at anchor positions
   • Hover/focus a coach-mark or anchor → side panel shows label + explanation
   | user clicks "Explain" again  (or presses "?" / Esc)
   v
[ Chart idle ]
```

### Data flow for homepage render

```
content/charts/*.mdx
   | (build) Content Collections + Zod validation
   v
allCharts: ChartMeta[]  ── RSC fetches
   |                         |
   v                         v
 FilterState (nuqs)     BentoGrid (RSC)
   |                         |
   v                         v
applied filters        renders Tile per chart
   |                         |
   v                         v
filtered ids set       Thumbnail (status=live → <img src=/thumbs/{id}.svg>,
                                 status=planned → <PlaceholderTile/>)
```

## Implementation Units

- [ ] **Unit 1: Project scaffold + toolchain**

**Goal:** Stand up an empty but shippable Next.js 16 + Tailwind v4 + TypeScript project with shadcn/ui initialized, lint/format wired, and a green "hello world" build.

**Requirements:** R7 (responsive / fast baseline).

**Dependencies:** None.

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `tailwind.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx` (stub), `src/app/globals.css` (Tailwind + font imports).
- Create: `.eslintrc.json`, `.prettierrc`, `.gitignore`, `README.md` (short).
- Create: `components.json` (shadcn config).
- Test: `tests/unit/smoke.test.ts` — renders root layout.

**Approach:**
- `npx create-next-app@latest chartizard --typescript --tailwind --app --src-dir` as starting baseline, then upgrade to Tailwind v4 per Next 16 integration guide.
- Initialize shadcn/ui: `npx shadcn@latest init`.
- Pin `react@18.3` to sidestep Visx/React 19 peer warnings until Visx 4 is stable.
- Wire Vitest + Testing Library for unit tests; Playwright for e2e. Minimal config; real tests land in later units.
- Load fonts via `next/font` (Fraunces, IBM Plex Sans, IBM Plex Mono) in `layout.tsx`.

**Patterns to follow:**
- Next.js App Router conventions (server components by default; `"use client"` only where needed).

**Test scenarios:**
- *Happy path:* `next build` completes without errors; root `/` renders a placeholder heading.
- *Happy path:* `vitest` passes a single smoke test that mounts `<Layout>`.

**Verification:**
- `pnpm build` (or `npm`) completes cleanly.
- Lighthouse on `localhost:3000` shows Performance ≥ 95 on the empty page.
- No React 19 peer-dep warnings in install logs.

---

- [ ] **Unit 2: Design system foundation (bento tokens, sector surfaces, typography)**

**Goal:** Establish the Tailwind v4 `@theme` tokens, sector-tinted surface palette, type scale with Fraunces + IBM Plex, bento tile size classes, and reusable `Grid`/`Tile` primitives — the design spine every later unit builds on.

**Requirements:** R7, R8.

**Dependencies:** Unit 1.

**Files:**
- Modify: `src/app/globals.css` — add `@theme` block with sector surface tokens, type scale, tile size custom properties.
- Create: `src/components/bento/Grid.tsx`, `src/components/bento/Tile.tsx`.
- Create: `src/lib/sectors.ts` — maps category slugs from `CHARTS_CATEGORIZED.md` into ~8-10 surface tokens (e.g. `finance → --surface-amber`).
- Test: `tests/unit/bento.test.tsx` — tile size variants render with expected CSS custom properties; `Grid` composes with `grid-auto-flow: dense`.

**Approach:**
- **Invoke the `frontend-design` skill** at the start of this unit. Pass the constraints: Interactive Bento; avoid minimalism + dark-mode + glassmorphism; serif-display editorial voice; sector-tinted surfaces; mobile-first.
- Define tile sizes as CSS variables (`--tile-span-col`, `--tile-span-row`) that `Tile` consumes; size prop (`S|M|L|W|T`) just sets a modifier class.
- Sector surfaces are light tonal backgrounds (not saturated colours) with matching accent tokens for titles + tags.
- Container-query rules on `Tile` so thumbnails self-resize rather than relying on the grid.
- `Grid` responsive behaviour: 12-col → 6-col (tablet, `@container` ≤ 900px) → 2-col (mobile, `@container` ≤ 520px). Never 1-col.

**Execution note:** Build this with the `frontend-design` skill in an interactive loop — iterate on a mock homepage with 12-15 coloured bento tiles before wiring real data, so typography + spacing + surface ratios are locked before real charts arrive.

**Patterns to follow:**
- Tailwind v4 CSS-first `@theme`, `@layer`, `@starting-style` for tile mount animation.
- shadcn's token strategy for fg/bg/muted variants per surface.

**Test scenarios:**
- *Happy path:* `<Grid>` children with varying `size` props produce the expected column spans at each breakpoint.
- *Happy path:* `<Tile size="L" sector="finance">` resolves to the correct surface token.
- *Edge case:* Unknown sector falls back to the neutral `--surface-slate` token without throwing.
- *Edge case:* `<Grid>` with a single `size="W"` child and eight `size="S"` siblings triggers `grid-auto-flow: dense` packing (verify via snapshot).

**Verification:**
- Visual review: a mock 15-tile grid looks editorial (varied sizes, sector colours distinguishable) and passes WCAG AA contrast.
- `pnpm test` passes the bento unit suite.
- Mobile viewport (375px) never collapses to a single column.

---

- [ ] **Unit 3: Chart data model (Content Collections + 280 MDX entries)**

**Goal:** Define the Zod-validated MDX schema for chart metadata, configure Content Collections, and seed the `content/charts/` directory with 5 live entries + 275 planned stubs generated from `CHARTS_CATEGORIZED.md`.

**Requirements:** R1, R2, R3, R6.

**Dependencies:** Unit 1.

**Files:**
- Create: `content-collections.ts` — Zod schema (see High-Level Technical Design sketch).
- Create: `content/charts/line-chart.mdx`, `area-chart.mdx`, `stacked-bar-chart.mdx`, `pie-chart.mdx`, `hexagonal-binning-chart.mdx` — full metadata + body.
- Create: `content/charts/_planned/*.mdx` — 275 stub files (frontmatter only, `status: "planned"`).
- Create: `scripts/seed-placeholder-charts.ts` — reads `CHARTS_CATEGORIZED.md`, emits one MDX stub per chart that is not in the v1 live set. Idempotent.
- Modify: `package.json` — add Content Collections deps + `prebuild` script that runs the seeder only when `_planned/` is empty.
- Test: `tests/unit/content.test.ts` — Zod schema rejects invalid frontmatter; all seeded stubs validate; live charts have required `elements[]` and `example`.

**Approach:**
- Frontmatter fields per schema sketch above.
- `sectors[]` values map 1:1 to the category ids used in `src/lib/sectors.ts`.
- `elements[]` format: `{ selector: "y-axis-tick", label: "Y-Axis Ticks", explanation: "…" }`. The `selector` matches a `data-explain` attribute Unit 7 will wire up on each chart's SVG.
- The seeder parses `CHARTS_CATEGORIZED.md`, extracts each chart name + category, and writes a stub MDX with `status: "planned"`, default `tileSize: "S"`, and `family` guessed from the category (override manually for obvious mismatches).
- Each live chart's MDX body uses MDX components for the `HowToRead`, `RealWorldExample`, and `ChartEmbed` blocks — content-first so editing copy doesn't require touching code.

**Patterns to follow:**
- Content Collections' Next.js quickstart for schema + build integration.
- Zod `.refine()` for cross-field invariants (`status: "live"` requires `elements` and `example`).

**Test scenarios:**
- *Happy path:* All 280 MDX files pass schema validation.
- *Happy path:* Querying `allCharts.filter(c => c.status === "live")` returns exactly 5 entries.
- *Edge case:* Frontmatter with an unknown `family` value is rejected with a clear error pointing at the file.
- *Edge case:* A live chart missing `elements` fails schema validation at build time.
- *Error path:* Duplicate `id` values are caught by a build-time refinement before content emits.

**Verification:**
- `pnpm build` succeeds; generated `.content-collections/` typings expose `allCharts`.
- Re-running the seeder on a populated `_planned/` directory is a no-op (no diffs).
- Running the test suite against a hand-broken fixture frontmatter produces the expected error location.

---

- [ ] **Unit 4: Homepage bento + thumbnail pipeline**

**Goal:** Render the full homepage: hero band + filterable bento grid of all ~280 charts. Thumbnails are pre-rendered static SVGs for live charts and styled `<PlaceholderTile>` components for planned charts.

**Requirements:** R1, R6, R7, R8.

**Dependencies:** Units 2, 3.

**Files:**
- Modify: `src/app/page.tsx` — RSC that imports `allCharts`, renders `<Hero>` + `<FilterSidebar>` + `<BentoGrid>`.
- Create: `src/components/bento/Thumbnail.tsx` — chooses SVG asset vs placeholder based on `status`.
- Create: `src/charts/_placeholder/PlaceholderTile.tsx` — stylised "coming soon" artwork that still visually reads as the chart family (e.g. faint bars for bar family, faint arcs for pie family).
- Create: `src/lib/thumbnail-render.ts` — build-time script using `renderToStaticMarkup` that takes each live chart's `*.thumbnail.tsx`, renders it at 320×240, writes to `public/thumbs/{id}.svg`.
- Modify: `next.config.ts` — hook the thumbnail script into `prebuild`.
- Create: `src/components/Hero.tsx` — editorial hero: H1 + short description + live count of live/planned charts; no CTA button stack, no stock art.
- Test: `tests/unit/thumbnail.test.tsx`, `tests/e2e/homepage.spec.ts` — e2e asserts 280 tiles visible, Lighthouse perf budget holds.

**Approach:**
- `<Hero>` is type-led — Fraunces display for the headline, short subhead in Plex Sans, a line of metadata ("280 charts • 25 fields • 5 live"). No button, no image.
- `<BentoGrid>` receives filtered chart list from a server component (filter state computed in RSC using `searchParams`) and renders one `<Tile>` per chart.
- Thumbnail strategy:
  - Live: `<img src={/thumbs/${id}.svg} />` (pre-rendered at build, ~2–8 KB each).
  - Planned: `<PlaceholderTile family={...} />` — CSS/SVG drawn faint silhouette that hints at the chart family; no generic "lock" icon, no stock art.
- Each tile links to `/charts/{id}`.
- Animation: `@starting-style` + `view-transition-name` on tiles so filter changes animate tiles into/out of the grid without JS.

**Execution note:** Invoke `frontend-design` at the start of this unit. The Hero band and tile density are the make-or-break visual moments — iterate on them before moving on.

**Patterns to follow:**
- Next.js RSC data-fetching for `allCharts`.
- Tailwind v4 container queries on `<Tile>` (from Unit 2).

**Test scenarios:**
- *Happy path:* Homepage renders exactly `allCharts.length` tiles.
- *Happy path:* Each tile's link resolves to `/charts/{id}`.
- *Edge case:* A chart with `tileSize: "W"` spans 3 columns on desktop; collapses to 2 on tablet; full-width on mobile.
- *Edge case:* A chart with `status: "planned"` does not attempt to load a `.svg` that doesn't exist.
- *Error path:* Missing thumbnail SVG for a live chart surfaces a build error (not a broken image at runtime).
- *Integration:* Filter query in URL (`?sector=finance`) narrows the rendered tile set in RSC before hydration.
- *Integration:* View-transition animation between two filter states does not cause layout shift on mobile.

**Verification:**
- All 280 tiles visible on `/`.
- Lighthouse Performance ≥ 90 on mobile, LCP < 2s on desktop.
- No CLS when toggling filters.
- Visual review: homepage does not read as "generic bento SaaS landing" — Hero + tile surfaces + typography carry identity.

---

- [ ] **Unit 5: Filter system (sidebar + chips + URL sync)**

**Goal:** Faceted filter UI: persistent left sidebar of sector/family/dataShape facets with counts; active-filter chip row above the bento; URL-synced state via `nuqs`; fully keyboard-accessible; collapses to a bottom sheet on mobile.

**Requirements:** R2, R7.

**Dependencies:** Units 3, 4.

**Files:**
- Create: `src/components/filter/FilterSidebar.tsx`, `FilterChips.tsx`, `FilterState.tsx`.
- Create: `src/components/ui/drawer.tsx` (shadcn add) — for mobile filter sheet.
- Create: `src/components/ui/badge.tsx`, `toggle-group.tsx`, `dropdown-menu.tsx` (shadcn add).
- Modify: `src/app/page.tsx` — inject filter components and pass computed filter state into `<BentoGrid>`.
- Test: `tests/unit/filter.test.tsx`, `tests/e2e/filter.spec.ts`.

**Approach:**
- Facets in v1:
  - **Sector** (multi-select): finance, biology, statistics, general, … (from `CHARTS_CATEGORIZED.md`, ~10-12 grouped buckets).
  - **Family** (multi-select): comparison, composition, distribution, relationship, flow, change-over-time, hierarchy, geospatial, specialty.
  - **Data shape** (multi-select): categorical, continuous, temporal, geospatial, hierarchical, network.
  - **Availability** (toggle): "Live only" vs "Show all".
- Each facet value shows its count within the current filter set (e.g. `Finance (47)`); greyed-out when zero.
- URL schema: `?sector=finance,medicine&family=comparison&live=1`.
- Chip row above the bento shows each active filter with an `x` to remove; "Clear all" button on the right.
- On mobile, the sidebar collapses into a shadcn `Drawer` triggered by a sticky "Filter (3)" button with the active-count.

**Patterns to follow:**
- `nuqs` parsers for comma-list params.
- Next.js App Router `searchParams` in RSC to pre-filter on the server for zero-JS filtering.

**Test scenarios:**
- *Happy path:* Selecting `sector=finance` reduces tile count to the finance subset.
- *Happy path:* Chips reflect the active filters; removing a chip updates the URL and the grid.
- *Edge case:* Selecting a sector + family that have zero intersection shows a friendly empty state with "Clear filters" action.
- *Edge case:* Facet counts update as other filters change (finance + "live only" shows lower counts than finance alone).
- *Edge case:* Refreshing the page with `?sector=finance,medicine` preserves both selections.
- *Edge case:* Keyboard-only navigation through all facets works (focus ring visible, `space`/`enter` toggles).
- *Integration:* Filter state is applied in RSC before first paint — no flash of unfiltered content on reload with params.
- *Integration:* Mobile Drawer close restores focus to the trigger button.

**Verification:**
- `pnpm test` + `pnpm test:e2e` pass.
- Lighthouse Accessibility ≥ 95 on `/` with filters active.
- URL is deep-linkable (copy-paste into a new browser reproduces the exact state).

---

- [ ] **Unit 6: Chart detail shell + Explain-mode framework**

**Goal:** Build the `/charts/[id]` route: a reusable `<ChartFrame>` with title, sectors, "How to read it" narrative, real-world example, and the Explain-mode toggle + overlay. Live charts plug into the frame; placeholders render a "Coming soon" state inside the same frame for visual continuity.

**Requirements:** R4, R5, R6, R7.

**Dependencies:** Units 2, 3.

**Files:**
- Create: `src/app/charts/[id]/page.tsx` — dynamic route; `generateStaticParams` returns all chart ids.
- Create: `src/app/charts/[id]/not-found.tsx`.
- Create: `src/components/chart/ChartFrame.tsx` — layout shell.
- Create: `src/components/chart/ExplainToggle.tsx`, `ExplainOverlay.tsx`, `ExplainAnchor.tsx`.
- Create: `src/lib/chart-registry.ts` — maps `id → dynamic() live component`, falls back to a "planned" component.
- Test: `tests/unit/explain-mode.test.tsx`, `tests/e2e/chart-detail.spec.ts`.

**Approach:**
- `ChartFrame` layout (desktop): two columns — chart occupies 60%, "How to read" + real-world example stacked in 40% rail. On mobile, stacks vertically with chart first.
- `ExplainToggle` is a `ToggleGroup` ("View" / "Explain") with a `?` keyboard shortcut mirror.
- `ExplainOverlay` wraps the chart's SVG; when active it sets `data-explain-active="true"` on the root, which CSS uses to dim layers and render numbered pins at `data-explain` anchor positions.
- `ExplainAnchor` is a thin wrapper over an invisible SVG `<rect>` that live charts compose into their SVG output to mark anchor zones (bar, tick, legend cell, slice, hex).
- Each numbered pin renders a shadcn `<Tooltip>` with the element's `label` + `explanation` from the chart's `elements[]` frontmatter.
- For `status: "planned"` charts, the registry returns a `<ComingSoonChart>` component that fills the chart area with the same `<PlaceholderTile>` artwork (scaled up) and hides the ExplainToggle.
- Route-level metadata (`generateMetadata`) pulls the chart name + narrative opening for OG tags — drives SEO per chart.

**Execution note:** Build `ChartFrame` + Explain mode against the Line Chart first (Unit 7a), then generalise. Resist making it fully abstract before it has one real client.

**Patterns to follow:**
- shadcn `Tooltip` controlled via `open` prop.
- Next App Router dynamic routes with `generateStaticParams`.

**Test scenarios:**
- *Happy path:* `/charts/line-chart` renders title, narrative, example, and chart area.
- *Happy path:* Clicking "Explain" dims the chart data, numbered pins appear, hovering a pin shows the tooltip.
- *Happy path:* Pressing `?` toggles Explain mode; pressing `Esc` exits.
- *Edge case:* `/charts/bar-chart-of-pie` (planned) renders `ChartFrame` with the Coming Soon state; ExplainToggle is hidden; narrative + example fields are empty placeholders.
- *Edge case:* `/charts/does-not-exist` returns the `not-found` route.
- *Edge case:* Explain-mode tooltip does not overlap the filter sidebar or get clipped on small screens.
- *Integration:* Toggling Explain mode while hovering over the native Visx tooltip does not produce two simultaneous tooltips.
- *Integration:* Keyboard-only users can tab to each coach-mark and read its explanation with a screen reader (via `aria-describedby`).

**Verification:**
- `pnpm test:e2e` green for the chart-detail spec.
- Axe-core accessibility run reports no critical/serious issues on any live chart page.
- SEO: page source for `/charts/line-chart` contains title, description, and opening narrative before hydration.

---

- [ ] **Unit 7: Five live chart implementations**

**Goal:** Implement Line, Area, Stacked Bar, Pie, and Hexagonal Binning as Visx-based React components with full Explain-mode coverage. Each chart ships a live component, a thumbnail component, sample data, and MDX narrative + real-world example (authored in Unit 3; wired in here).

**Requirements:** R3, R4, R5.

**Dependencies:** Units 3, 6.

**Files (per chart):**
- Create: `src/charts/<slug>/<Name>Chart.tsx`, `<Name>Chart.thumbnail.tsx`, `data.ts`.
- Modify: `src/lib/chart-registry.ts` — register each id.
- Test: `tests/unit/charts/<slug>.test.tsx`, `tests/e2e/chart/<slug>.spec.ts`.

**Approach:**
- Each live chart component exposes the same shape: `<Chart data={…} width={…} height={…} explain={boolean}/>`. When `explain` is true, the native Visx tooltip is disabled and `<ExplainAnchor>` wrappers expose hit targets per element.
- Minimum anchors per chart:
  - **Line** (`charts/line/LineChart.tsx`): y-axis label, y-axis tick, x-axis label, line path, data point, legend item, gridline. 7 anchors.
  - **Area** (`charts/area/AreaChart.tsx`): area fill, upper line, y-axis, x-axis, baseline. 5 anchors.
  - **Stacked Bar** (`charts/stacked-bar/StackedBarChart.tsx`): one bar stack, one segment, legend-category item, y-axis, x-axis, total hover. 6 anchors.
  - **Pie** (`charts/pie/PieChart.tsx`): one slice, legend item, percentage label, centre label. 4 anchors.
  - **Hexbin** (`charts/hexbin/HexbinChart.tsx`): one hex, colour legend scale, density meaning, axis, binning-radius note. 5 anchors.
- Sample data per chart is realistic and aligns with the MDX real-world example (e.g. Stacked Bar uses monthly revenue by product category; Hexbin uses NYC taxi pickup density).
- Thumbnail component is a trimmed-down rendering of the chart with fewer data points, no axes labels, no legend — optimised for SVG output at 320×240.

**Execution note:** These five units can execute in parallel by sub-agents once Unit 6 is merged (the interface contract is stable). Recommend: one sub-agent per chart, all branching from the same `Unit 6 complete` state.

**Patterns to follow:**
- Visx chart examples from `airbnb.io/visx/` — especially the `ParentSize` responsive wrapper.
- `@visx/hexbin` example for the hexbin implementation.
- Established `ExplainAnchor` API from Unit 6.

**Test scenarios (per chart):**
- *Happy path:* Chart renders with sample data at multiple viewport sizes (mobile, tablet, desktop) without layout shift.
- *Happy path:* Default mode shows Visx native value tooltip on hover.
- *Happy path:* Explain mode swaps in anchored element explanations; all anchors listed in the chart's `elements[]` frontmatter have matching `<ExplainAnchor selector="…">` in the SVG output.
- *Edge case:* Empty or single-point dataset renders a graceful empty state (not a broken chart).
- *Edge case:* Window resize re-fits the chart via `<ParentSize>` without loss of aspect ratio.
- *Edge case:* Hexbin with a very sparse dataset still shows legend labels correctly.
- *Error path:* Data with `NaN` values is filtered out with a console warning — chart still renders.
- *Integration:* Clicking a Visx element in default mode and an Explain anchor on the same element in Explain mode both point at the same DOM coordinate, proving the anchor `data-explain` selectors match real rendered geometry.
- *Integration:* Screen-reader users can read each anchor's label + explanation via `aria-describedby`.

**Verification:**
- All 5 detail pages render without console errors.
- Axe-core a11y run passes on each page.
- Visual review: each chart feels distinct, the real-world example is compelling, and Explain mode makes the chart noticeably easier to read for a newcomer.
- Bundle size: JS per chart page ≤ 80 KB gzipped (Visx tree-shaking works).

---

## System-Wide Impact

- **Interaction graph:** Explain mode is the only cross-component interaction in v1. It's local to each chart detail page and does not leak into the homepage. Filter state is URL-synced and handled at route level; no global store.
- **Error propagation:** Build-time Zod validation for all chart frontmatter is the primary guardrail. Runtime errors on chart render are caught by a per-chart error boundary (added in Unit 6) that falls back to the Coming-Soon state + a tagged analytics event (when analytics arrive).
- **State lifecycle risks:** None in v1 — no persistence, no auth, no writes. Filter state is URL-owned and stateless.
- **API surface parity:** The `Chart` component contract (`data`, `width`, `height`, `explain`) is the implicit public API. All future 275 charts must conform. Enforced by TypeScript on the `chart-registry.ts` module type.
- **Integration coverage:** Unit 6's Explain-mode e2e + Unit 7's "anchor selectors match rendered geometry" test together prove the SVG/MDX-metadata integration. Filter → BentoGrid URL round-trip (Unit 5 e2e) proves the RSC-side filter integration.
- **Unchanged invariants:** None yet (greenfield). The PRD + existing MD files (`CHARTS.md`, `CHARTS_CATEGORIZED.md`, `TODO.md`, `TOKENS.md`, `CLAUDE.md`) remain source-of-truth; this plan consumes them but does not modify them except through additive updates to TODO.md / TOKENS.md per project rules.

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Visx 3.12 peer-deps are React 18; React 19 causes type warnings. | Pin `react@18.3` in Unit 1; revisit when Visx 4 ships stable. Noted as a Key Technical Decision. |
| Pre-rendered SVG thumbnails grow the repo (280 × ~5 KB ≈ 1.4 MB). | Acceptable at 280 (only 5 actually generate in v1; the other 275 are placeholders). Revisit with a CDN strategy when more than ~100 live charts ship. |
| Bento grid's sector-tinted surfaces risk looking chaotic with ~10 colours on-screen. | Unit 2 iterates with `frontend-design` on a 15-tile mock before real data; cap palette to ~8 tonal surfaces with controlled saturation. |
| Content Collections build integration is still young (Next 16 compatibility verified in research but is evolving). | Fallback: manual `.mdx` loader via `next-mdx-remote` + hand-written Zod validation step. Swap is a 1-unit change if needed. |
| Explain-mode coach-marks collide with the sidebar or filter chips on small viewports. | Unit 6 test scenarios explicitly cover this; ExplainOverlay is portaled to the chart container, not the document root. |
| 275 placeholder MDX stubs make `content/charts/` noisy in the editor. | Scope them under `content/charts/_planned/`; seeder is idempotent; editors can ignore via a workspace setting. |
| The user's avoid-list includes "bento grids" as a generic pattern but also explicitly requests "Interactive Bento Design" — tension resolved in favour of the explicit request. | Unit 2 + Unit 4 use `frontend-design` to steer away from the *generic* bento signature (equal cards, glassmorphism) while delivering a distinctive bento. |

## Documentation / Operational Notes

- Update `TODO.md` to add the v1 build as an in-progress item and check it off as each implementation unit lands.
- Log token usage per unit in `TOKENS.md` per `CLAUDE.md` rules.
- `README.md` (created in Unit 1) should document: stack, dev commands, how to add a new chart (create MDX + component + register in `chart-registry.ts`), and the Explain-mode anchor contract.
- Deployment is explicitly out of scope for v1 but the choice of Next.js + static content pipeline keeps Vercel / Netlify / Cloudflare Pages all viable.

## Execution Guidance for Sub-Agent Parallelization

The user specifically requested sub-agent use for parallelization. Suggested wave structure:

- **Wave 1 (sequential):** Unit 1 → Unit 2 → Unit 3. These are the foundation; each depends on the last.
- **Wave 2 (parallel):** Units 4, 5, 6 can run in parallel after Unit 3 lands, with a merge/integration step once all three are green.
- **Wave 3 (parallel):** The 5 charts in Unit 7 can run in parallel sub-agents once Unit 6's `ExplainAnchor` contract is stable. One sub-agent per chart.

## Sources & References

- **Origin document:** [PRD.md](../../PRD.md)
- **Canonical chart list:** [CHARTS.md](../../CHARTS.md)
- **Categorization map:** [CHARTS_CATEGORIZED.md](../../CHARTS_CATEGORIZED.md)
- **Project rules:** [CLAUDE.md](../../CLAUDE.md)
- External docs: see "External References" above.
