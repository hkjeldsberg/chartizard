# Chart Author Contract

**This document is the single source of truth for implementing a live chart in
Chartizard.** If any detail here conflicts with an existing chart, the contract
wins — file a follow-up to bring the older chart back in line.

Every implementer (human or sub-agent) should read this doc plus **one**
canonical example (`src/charts/line/LineChart.tsx` +
`src/content/charts/live/line-chart.ts` + `src/charts/line/LineChart.thumbnail.tsx`)
before writing anything.

---

## 1. What you build per chart

For each chart you implement, create exactly three files:

```
src/charts/<slug>/<Name>Chart.tsx                 # live interactive chart
src/charts/<slug>/<Name>Chart.thumbnail.tsx       # 120×80 inline SVG thumbnail
src/content/charts/live/<slug>.ts                 # metadata + narrative + elements[]
```

Where `<slug>` is the chart's kebab-case id (matches the existing entry in
`src/content/charts/placeholders.ts`) and `<Name>Chart` is the PascalCase
component name. **Do not double-suffix** — if the slug already ends in
`-chart` / `-plot` / `-diagram` / `-graph`, the component name still ends in
`Chart`/`Plot`/`Diagram`/`Graph` exactly once.

Examples:
- `bar-chart` → `src/charts/bar/BarChart.tsx`
- `horizontal-bar-graph` → `src/charts/horizontal-bar/HorizontalBarChart.tsx`
- `box-plot` → `src/charts/box-plot/BoxPlotChart.tsx`
- `control-chart` → `src/charts/control-chart/ControlChart.tsx` *(not `ControlChartChart`)*
- `ridgeline-plot` → `src/charts/ridgeline/RidgelineChart.tsx` *(use `Chart` suffix even though slug ends in `-plot`, for registry/import consistency)*
- `sankey-diagram` → `src/charts/sankey/SankeyChart.tsx`

The **metadata file** name always matches the slug exactly:
`src/content/charts/live/<slug>.ts`.

## 2. What you DO NOT touch

These files converge work from multiple authors. The main integrator edits
them after all parallel work lands. Do **not** edit them in your own output:

- `src/lib/chart-registry.tsx`
- `src/content/charts/live/index.ts`
- `src/content/charts/placeholders.ts`
- `src/components/bento/Thumbnail.tsx`
- `package.json`, `tsconfig.json`, any config file

If you think you need a new npm dependency (e.g. `d3-sankey`), **do not add it**.
Report it in your response and the integrator will decide.

## 3. The live-chart component

### Contract

```tsx
"use client";

export function <Name>Chart({ width, height }: { width: number; height: number }) {
  // ...
}
```

Every live chart:

- **Is a client component** — first line of the file is `"use client";`.
- **Accepts `{ width, height }` and nothing else.** The parent mounts you
  inside `<ParentSize>`, so you get pixel dimensions and must render to fit.
- **Returns an `<svg>` element** of the full `{width, height}` with
  `role="img"` and a descriptive `aria-label`.
- **Never renders raster images, iframes, or HTML inside the chart.** SVG
  only. (Tiles on the homepage use your thumbnail component instead.)
- **Never calls `Math.random()` at render time.** If you need pseudo-random
  data, use a seeded LCG inside `useMemo` so renders are deterministic. See
  `src/charts/hexbin/HexbinChart.tsx` for the reference pattern.

### Layout & margins

Use the standard margin recipe from every v1 chart:

```tsx
const margin = { top: 20, right: 20, bottom: 44, left: 56 };
const iw = Math.max(0, width - margin.left - margin.right);
const ih = Math.max(0, height - margin.top - margin.bottom);
```

Tweak the specific margins per chart as needed (pie charts don't need left
margin; hexbin needs a right margin for the legend; etc.). The `Math.max(0, ...)`
guard is important — `<ParentSize>` can briefly return 0-width during mount
and negative scale ranges will throw.

Wrap the chart body in `<Group left={margin.left} top={margin.top}>`.

### The `data-data-layer="true"` convention

**Every `<g>` that contains data-bearing marks must carry
`data-data-layer="true"`.** The `ChartCanvas` wrapper uses a CSS selector to
dim these groups to 40% opacity when Explain mode is active. Without it your
chart will not dim and the numbered pins will compete with the data for
attention.

Example:

```tsx
<Group left={margin.left} top={margin.top}>
  <g data-data-layer="true">
    {/* gridlines, scales, bars, lines, slices — the chart itself */}
  </g>
  {/* Anchors + axis labels can live outside the data-data-layer if you want
      them to stay fully opaque in Explain mode */}
</Group>
```

Axes authored via `<AxisLeft>` / `<AxisBottom>` can be wrapped by an anchor
instead (they're part of the chart but they're also anchors). Legend `<g>`s
should be marked data-layer so they dim.

### Visx imports you may use

```ts
// Scales
import { scaleBand, scaleLinear, scaleOrdinal, scaleTime } from "@visx/scale";

// Shapes
import {
  AreaClosed,
  BarGroup,
  BarStack,
  Bar,
  Circle,
  Line,
  LinePath,
  Pie,
} from "@visx/shape";

// Layout helpers
import { Group } from "@visx/group";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ParentSize } from "@visx/responsive";  // ParentSize is applied by LiveChartView, not you

// Curves / shapes from d3
import { curveMonotoneX, curveBasis, line, area } from "d3-shape";

// Binning / layout (if needed — use directly, not via @visx wrappers)
import { hexbin as d3Hexbin } from "d3-hexbin";
import { stack as d3Stack, max, min, extent } from "d3-array";
```

**Do not import from `@visx/hexbin`, `@visx/sankey`, or any `@visx/*` package
not listed above.** Use the underlying d3 primitive directly — the visx
wrappers have less stable APIs across versions.

## 4. ExplainAnchor — the element-level explanation API

Every live chart has 4-7 numbered pins, one per meaningful chart element.

```tsx
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

<ExplainAnchor
  selector="y-axis"                     // must match an entry in your elements[]
  index={4}                             // 1..N, one per anchor in display order
  pin={{ x: -32, y: ih / 2 }}           // SVG coords (inside the Group transform)
  rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
>
  {/* optional children — wrap the anchored mark(s) here */}
  <AxisLeft scale={yScale} ... />
</ExplainAnchor>
```

- **`selector`** must exactly match a `selector` field in the chart's
  `elements[]` metadata. This is how the Explain panel looks up the
  explanation text.
- **`index`** is the number displayed on the pin (1..N). Number anchors in
  reading order — usually left-to-right, top-to-bottom.
- **`pin`** is where the numbered circle is drawn. Pick a spot that's
  *adjacent* to the element, not on top of it.
- **`rect`** defines the invisible hit region. It should fully cover the
  element(s) being explained. Hovering the rect triggers the explanation.

### Minimum / maximum anchor count

- **Minimum 4 anchors.** The schema validator enforces this.
- **Maximum 7 anchors.** More than that overwhelms the Explain panel.
- Aim for 5-6 anchors per chart.

### What deserves an anchor

**Anchor:** the y-axis, the x-axis, the primary encoded mark (bars, line,
slices, hexes), the legend (if present), a representative data point or a
summary feature (e.g. "the peak" on an area chart), any non-obvious chart
mechanic (e.g. bin radius on a hexbin, baseline on an area chart).

**Do not anchor:** individual data points (anchor one representative instead),
tick marks (anchor the axis instead), gridlines unless they carry specific
meaning, titles.

### Anchors must render unconditionally

**Every anchor in your `elements[]` array must render for any valid dataset.**
Do not gate an anchor on a runtime condition (e.g. "show the `outlier` pin
only when a 1.5×IQR outlier actually exists"). If the condition doesn't fire,
you'll have an entry in the Explain panel with no corresponding pin on the
chart — broken UX.

If you want to call out a conditional concept, anchor the *rule or the zone*,
not the ephemeral mark:

- ❌ `selector: "outlier"` pinned to a specific circle — only exists if the
  rule fires.
- ✅ `selector: "outlier-rule"` pinned to the whisker end — explains how
  outliers *would* render, always visible.

This was the #1 drift mode in Batch 1. Don't repeat it.

## 5. Metadata file — `src/content/charts/live/<slug>.ts`

### Shape

```ts
import type { LiveChart } from "@/content/chart-schema";

export const <camelName>: LiveChart = {
  // Catalog identity — copy these from the existing placeholders.ts entry
  id: "bar-chart",
  name: "Bar Chart",
  family: "comparison",
  sectors: ["general"],
  dataShapes: ["categorical"],
  tileSize: "S",                   // may bump UP if the chart needs more room
  status: "live",

  // Short one-liner — shown in the chart detail header under the title
  synopsis: "…",

  // Body — these three narrative blocks + elements[] are what the Explain
  // panel and the chart-detail rail render.
  whenToUse: "…",
  howToRead: "…",
  example: {
    title: "…",
    description: "…",
  },
  elements: [
    {
      selector: "bar",             // must match ExplainAnchor selector exactly
      label: "Bar",                // shown in the Explain panel title
      explanation: "…",            // 2-5 sentences, reads like a museum label
    },
    // … 3 to 6 more anchors
  ],
};
```

### How to pick values

- **`id`** — must exactly match the row you're upgrading in
  `src/content/charts/placeholders.ts`. Do not invent a new id.
- **`family`**, **`sectors`**, **`dataShapes`** — keep from the placeholder
  entry. These are editorial decisions made in the source-of-truth categorization.
- **`tileSize`** — usually keep the placeholder's choice. It's okay to bump
  UP (S→M, M→L) if the live chart visibly needs more room at thumbnail scale.
  Do not go smaller.

### Voice

Every narrative block should read like a **museum label**, not marketing copy.

- **Length:** 2-4 sentences per block. Tight. Confident.
- **Diction:** analytical, specific, opinionated. No em-dashes used as pauses.
- **Anti-patterns (do not produce these):**
  - "A powerful way to visualize…"
  - "Perfect for showing…"
  - "This chart is used across industries to…"
  - "Modern", "Seamless", "Intuitive"
  - Generic examples like "a company", "a business", "sales data".
- **Real-world example:** must name a specific organisation, dataset, or
  scenario + the specific insight that encoding produced. Good: "NYC taxi
  pickups from 2015 — 170M rides, rendered as a hexbin to reveal the Central
  Park hole that a scatterplot would hide." Bad: "Used by companies to
  visualize location data."

Generic examples are the most-common drift mode from sub-agent output.
Reject them in your own review before returning.

### Voice exemplars from earlier batches

When in doubt, re-read these narratives — they are the bar:

- **Waterfall:** "bars float at the running total's level — a stacked bar can't do this because it loses direction." *Opinionated, specific, compares against an alternative.*
- **Kaplan-Meier:** "censoring tick marks are the chart's under-sung feature — they show viewers when data-loss is NOT death." *Names a small, correct detail most explanations skip.*
- **Venn diagram:** "an unlabelled Venn is just a logo." *One sentence, memorable, technically correct.*
- **Ridgeline:** "named after Joy Division's Unknown Pleasures album cover (1979)." *Specific provenance anchors the chart in cultural memory.*
- **Mosaic:** "width encodes marginal, height encodes conditional." *The chart's rule in 6 words.*
- **Hexbin:** "NYC taxi pickups at this scale produce a solid black rectangle; a hexbin reveals Central Park's silent hole." *Before/after of the chart's job.*

## 6. Thumbnail — `src/charts/<slug>/<Name>Chart.thumbnail.tsx`

```tsx
export function <Name>Thumbnail() {
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* … */}
    </svg>
  );
}
```

- **Fixed viewBox of 120×80.** The Tile component scales it to fill.
- **No Visx.** Hand-drawn SVG paths, rects, circles, and text. You're drawing
  a tiny icon of the chart, not rendering the chart itself.
- **No data.** The thumbnail is a silhouette of the chart family at a glance.
  It should be instantly recognisable, not precise.
- **Stick to the ink palette:** `var(--color-ink)` + opacity, or
  `var(--color-hairline)` for subtle marks. Do not introduce new colours.
- **`aria-hidden="true"`** — the chart title adjacent to the tile carries
  the accessible name.

Look at `src/charts/line/LineChart.thumbnail.tsx` or
`src/charts/stacked-bar/StackedBarChart.thumbnail.tsx` for the shape.

## 7. Accessibility requirements

- `<svg role="img" aria-label="<Chart name>">` on the main chart SVG.
- `aria-hidden="true"` on the thumbnail SVG.
- No colour-only encoding. If the chart uses colour to distinguish series,
  always also label them (legend text, direct annotation).
- ExplainAnchor rects already carry `role="button"` and `aria-describedby` —
  you do not need to add anything further.

## 8. Common pitfalls

- **Using `@visx/hexbin`** → use `d3-hexbin` directly (see `HexbinChart.tsx`).
- **Using `@visx/sankey`** → use `d3-sankey` directly; flag the dep add.
- **Anchor rect that extends past the plot bounds** → Explain pins render
  off-canvas and hit-testing misses. **Clamp every `rect` to the plot area
  `{ x: 0, y: 0, width: iw, height: ih }`.** The only exception is anchors
  that *are* intentionally in the margin (a y-axis label left of the plot,
  an x-axis caption below it). For those, use margin-space coordinates; for
  anything inside the plot, clamp.
- **Anchor rect that doesn't cover the actual mark** → hover never triggers
  the explanation. Spot-check by mentally drawing the rect.
- **Conditional anchors** → see §4 "Anchors must render unconditionally".
  Never gate an anchor on a runtime check.
- **Forgetting `data-data-layer="true"`** → data doesn't dim in Explain mode.
  Compare to an existing chart.
- **`Math.random()` at render** → hydration mismatch between server and client.
  Seed your LCG.
- **Tile size mismatch** → your live chart needs 400px but `tileSize: "S"`
  gives it 120px. Bump the tile size in metadata.
- **Generic narrative** → reads like SaaS copy. Review against §5's anti-
  patterns before returning.

## 9. Reporting back

When you finish, report:

1. **Files created** (list of paths).
2. **Dep flags** — any npm package you would have added if allowed.
3. **Deviations** — any place you could not follow the contract and why.
4. **Tile-size bumps** — if you bumped a chart's `tileSize` up, name the
   chart and the reason.
5. **Unknowns** — anything the integrator should verify before merging.
6. **Concurrent-slot observations** — you are running in parallel with other
   sub-agents. If you notice TypeScript errors or half-written files in
   directories you did NOT touch (e.g. another slot's chart), note them
   briefly as "in-flight from another slot" — do NOT try to fix them. The
   integrator merges everyone's output sequentially and will catch any real
   issues in the final verification pass.
7. **Self-typecheck** — run `npx tsc --noEmit` scoped to the files you
   touched (or at minimum `npx tsc --noEmit` and grep the output for your
   paths) before returning. Report any errors you caused. Known pre-existing
   errors in files you did NOT touch are fine to ignore — note them as
   in-flight from another slot.

Keep the report tight — the integrator reads 5-10 of these per batch.
