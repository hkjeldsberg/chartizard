# In progress / To be implemented

## Other
- The Bento components on the landing page have gaps between them. Adjust everything so there is no white space between chart thumbnails, and keep everything within a single "rectangle"

## Catalog status: COMPLETE (286 / 286 live)

Batch 14 shipped the final 21 placeholders on 2026-04-24. All sectors closed. No further chart batches planned.

## Post-catalog cleanup opportunities (no urgency; per-item backlog)

## Housekeeping / cleanup

- [ ] `src/content/datasets/` shared-data module — 8 batches deferred. Framework: refactor happens only on explicit user request or if a dataset bug surfaces.
- [ ] SHAP summary plot: `linearGradient id="shap-feat-grad"` is hardcoded (Batch 8). Scope with `useId` or per-instance suffix.
- [ ] TopographicMap (Batch 10 B5): dead `riverPath` / `trailPath` `useMemo` strings — remove in a `/simplify` pass.
- [ ] **Batch 11**: Extract `src/lib/d3-hierarchy-helpers.ts` with a `castToPoint(node)` helper to centralise the `HierarchyNode<T>` to `HierarchyNode<unknown>` variance cast pattern used in TreeOfLifeRadialPhylogeny, RadialTree, and now Phylogram (Batch 12). Still open.
- [ ] Open question: add `--color-critical` token (~red) for chart-specific emphasis, or accept per-chart specialty hexes (PERT, architecture, flame-graph, plus new warm palettes).
- [ ] **Batch 12**: tile-size ambiguity — star-glyph-plot bumped S→M (3rd such bump after Piper/Stiff in Batch 11). Consider tightening `tileSize` choices upstream in `placeholders.ts` so sub-agents don't need to make the call. *(Batch 13 had 0 tile bumps — may be self-resolving.)*
- [ ] **Batch 13**: `src/lib/d3-hierarchy-helpers.ts` extraction is now 4 charts deep (TreeOfLifeRadialPhylogeny, RadialTree, Phylogram, ConvexTreemap). DRY refactor has cleared its threshold. Schedule for post-Batch-14 maintenance pass.

# Completed

## Meta / planning
- CHARTS.md audit + CHARTS_CATEGORIZED.md sector mapping
- v1 technical plan, Batch-program plan, Chart Author Contract.

## v1 implementation — Units 1-7 — 5 live charts.

## Batch 1 (2026-04-20) — 20 charts — 25 total
## Batch 2 (2026-04-21) — 20 charts — 45 total (added d3-chord)
## Batch 3 (2026-04-21) — 20 charts — 65 total
## Batch 4 (2026-04-23) — 20 charts — 85 total
## Batch 5 (2026-04-24) — 20 charts — 105 total
## Batch 6 (2026-04-25) — 20 charts — 125 total (family-coverage ≥4 each)
## Batch 7 (2026-04-26) — 20 charts — 145 total (crossed 50%)
## Batch 8 (2026-04-27) — 20 charts — 165 total (UML wave #2, ML interpretability)
## Batch 9 (2026-04-28) — 20 charts — 185 total (UML family COMPLETE 8/8)
## Batch 10 (2026-04-29) — 20 charts — 205 total (Finance price-action COMPLETE)
## Batch 11 (2026-04-23) — 20 charts — 225 total (Finance family COMPLETE; earth sciences opened)

## Batch 14 (2026-04-24) — 21 charts — CATALOG COMPLETE
- Wave A: table-chart, vowel-chart, dot-matrix-chart, isotype-chart, icon-array, allele-chart, nomogram, quaternary-plot, ellingham-diagram, greninger-chart
- Wave B: lexis-diagram, dot-plot-bioinformatics, affinity-diagram, matrix-diagram, pdpc, phase-space-plot, sociogram, natal-chart, structure-chart, block-diagram, isosurface-plot
- 0 new deps. 0 tile-size bumps.
- **286 / 286 live charts (100%)** after Batch 14. **Catalog complete.**
- All remaining sectors closed: general, linguistics, infographics, genetics, medicine, chemistry, physics, quality, economics, astrology, social-sciences, software, electrical.
- Test `includes placeholders across every major sector` replaced with `PLACEHOLDER_CHARTS.length === 0` regression guard.

## Batch 13 (2026-04-24) — 20 charts
- Wave A: spiral-plot, comet-plot, shmoo-plot, carpet-plot, strip-chart, drain-plot, isarithmic-map, vertical-bar-graph, pie-of-pie-chart, doughnut-multi-level
- Wave B: opposites-diagram, pournelle-chart, scorecard, balanced-scorecard, convex-treemap, prism-map, hive-plot, arc-matrix, dependency-graph, election-apportionment-diagram
- 0 new deps. 0 tile-size bumps.
- **265 / 286 live charts (92.7%)** after Batch 13. 21 placeholders remaining.
- **Time-series COMPLETE** (spiral + comet were the last 2).
- **Cartography COMPLETE** (isarithmic + prism closed it; pruned from test sector list).
- **Business COMPLETE** (opposites + scorecard + balanced-scorecard).
- **Politics COMPLETE** (pournelle + election-apportionment).
- **Networks residual COMPLETE** (hive + arc-matrix + dependency-graph).
- Five sector closures in one batch — third consecutive batch with ≥5 closures.

## Batch 12 (2026-04-23) — 20 charts
- Wave A: chernoff-faces, andrews-plot, star-glyph-plot, hammock-plot, doubledecker-plot, barcode-chart, root-locus-plot, periodogram, tissot-indicatrix, isochrone-map
- Wave B: argument-map, rich-picture-diagram, bubble-map, double-bubble-map, surface-plot, logarithmic-plot, pictorial-percentage-chart, unit-chart, genogram, phylogram
- 0 new deps. 1 tile-size bump (star-glyph-plot: S→M).
- **245 / 286 live charts (85.7%)** after Batch 12. 41 placeholders remaining.
- **Statistics glyphs cluster COMPLETE** (6/6). Chernoff / Andrews / star-glyph / hammock / doubledecker / barcode.
- **Decision analysis residual COMPLETE** (argument-map + rich-picture + bubble + double-bubble). Cluster-wide: 0 placeholders remaining.
- **Mathematics COMPLETE** (surface-plot + logarithmic-plot; contour/venn/euler/ternary already live).
- **Biology COMPLETE** (phylogram was the last; tree-of-life-radial / phylogenetic-tree / cladogram already live).
- Test file pruned: `statistics` (after Wave A) + `biology` (after Wave B) removed from hardcoded sector-existence list.
- Batch 11 B1 "do-not-touch" drift closed — 10/10 sub-agents held the rule after explicit callout in every Wave B prompt.
