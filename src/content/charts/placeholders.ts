import type { PlannedChart } from "@/content/chart-schema";
import type { ChartFamily } from "@/lib/families";
import type { SectorId } from "@/lib/sectors";
import type { DataShape } from "@/lib/data-shapes";
import type { TileSize } from "@/components/bento/Tile";

function p(
  id: string,
  name: string,
  family: ChartFamily,
  sectors: ReadonlyArray<SectorId>,
  dataShapes: ReadonlyArray<DataShape>,
  tileSize: TileSize,
  synopsis?: string,
): PlannedChart {
  return { id, name, family, sectors, dataShapes, tileSize, status: "planned", synopsis };
}

export const PLACEHOLDER_CHARTS: ReadonlyArray<PlannedChart> = [
  // General Purpose ---------------------------------------------------------
  // bar-chart — upgraded to live (Batch 1 Wave A)
  // horizontal-bar-graph — upgraded to live (Batch 1 Wave A)
  // vertical-bar-graph — upgraded to live (Batch 13 Wave A)
  // table-chart — upgraded to live (Batch 14 Wave A)
  // grouped-column-chart — upgraded to live (Batch 3 Wave A)
  // diverging-bar-chart — upgraded to live (Batch 3 Wave A)
  // deviation-chart — upgraded to live (Batch 6 Wave A)
  // donut-chart — upgraded to live (Batch 1 Wave A)
  // pie-of-pie-chart — upgraded to live (Batch 13 Wave A)
  // doughnut-multi-level — upgraded to live (Batch 13 Wave A)
  // slope-chart — upgraded to live (Batch 3 Wave A)
  // dumbbell-chart — upgraded to live (Batch 3 Wave A)
  // lollipop-plot — upgraded to live (Batch 2 Wave A)
  // radar-chart — upgraded to live (Batch 1 Wave A)
  // star-plot — upgraded to live (Batch 5 Wave A)
  // radial-bar-chart — upgraded to live (Batch 5 Wave A)
  // polar-area-diagram — upgraded to live (Batch 5 Wave A)
  // nightingale-chart — upgraded to live (Batch 5 Wave A)
  // bubble-chart — upgraded to live (Batch 1 Wave A)
  // scatter-plot — upgraded to live (Batch 1 Wave A)
  // waffle-chart — upgraded to live (Batch 3 Wave A)
  // gap-chart — upgraded to live (Batch 7 Wave A)
  // sparkline — upgraded to live (Batch 1 Wave B)
  // small-multiples — upgraded to live (Batch 4 Wave B)

  // Statistics --------------------------------------------------------------
  // histogram — upgraded to live (Batch 1 Wave A)
  // density-plot — upgraded to live (Batch 1 Wave B)
  // jitter-plot — upgraded to live (Batch 4 Wave A)
  // strip-plot — upgraded to live (Batch 4 Wave A)
  // beeswarm-chart — upgraded to live (Batch 4 Wave A)
  // box-plot — upgraded to live (Batch 1 Wave A)
  // bagplot — upgraded to live (Batch 9 Wave A)
  // violin-plot — upgraded to live (Batch 1 Wave A)
  // sina-plot — upgraded to live (Batch 4 Wave A)
  // dot-plot-statistics — upgraded to live (Batch 5 Wave A)
  // rug-plot — upgraded to live (Batch 5 Wave A)
  // stemplot — upgraded to live (Batch 4 Wave A)
  // barcode-chart — upgraded to live (Batch 12 Wave A)
  // radial-histogram — upgraded to live (Batch 4 Wave A)
  // error-bars — upgraded to live (Batch 4 Wave A)
  // heatmap — upgraded to live (Batch 1 Wave A)
  // qq-plot — upgraded to live (Batch 3 Wave A)
  // pp-plot — upgraded to live (Batch 8 Wave A)
  // normal-probability-plot — upgraded to live (Batch 3 Wave A)
  // cdf-plot — upgraded to live (Batch 7 Wave A)
  // ecdf-plot — upgraded to live (Batch 7 Wave A)
  // ridgeline-plot — upgraded to live (Batch 2 Wave B)
  // spaghetti-plot — upgraded to live (Batch 4 Wave B)
  // chernoff-faces — upgraded to live (Batch 12 Wave A)
  // andrews-plot — upgraded to live (Batch 12 Wave A)
  // star-glyph-plot — upgraded to live (Batch 12 Wave A, tileSize bumped S→M)
  // hammock-plot — upgraded to live (Batch 12 Wave A)
  // parallel-coordinates-plot — upgraded to live (Batch 2 Wave B)
  // scatter-plot-matrix — upgraded to live (Batch 4 Wave B)
  // correlation-matrix — upgraded to live (Batch 4 Wave B)
  // mosaic-plot — upgraded to live (Batch 2 Wave B)
  // doubledecker-plot — upgraded to live (Batch 12 Wave A)
  // residual-plot — upgraded to live (Batch 7 Wave A)
  // leverage-plot — upgraded to live (Batch 9 Wave A)
  // cooks-distance-plot — upgraded to live (Batch 9 Wave A)
  // biplot — upgraded to live (Batch 9 Wave A)
  // tally-chart — upgraded to live (Batch 6 Wave A)
  // likert-scale-chart — upgraded to live (Batch 6 Wave A)

  // Data Science & ML -------------------------------------------------------
  // roc-curve — upgraded to live (Batch 3 Wave A)
  // precision-recall-curve — upgraded to live (Batch 3 Wave A)
  // lift-chart — upgraded to live (Batch 7 Wave A)
  // cumulative-gains-chart — upgraded to live (Batch 7 Wave A)
  // confusion-matrix — upgraded to live (Batch 4 Wave A)
  // calibration-plot — upgraded to live (Batch 8 Wave A)
  // partial-dependence-plot — upgraded to live (Batch 8 Wave A)
  // shap-summary-plot — upgraded to live (Batch 8 Wave A)
  // feature-importance-plot — upgraded to live (Batch 4 Wave A)
  // scree-plot — upgraded to live (Batch 4 Wave A)

  // Time Series -------------------------------------------------------------
  // timeline-chart — upgraded to live (Batch 5 Wave B)
  // calendar — upgraded to live (Batch 4 Wave B)
  // spiral-plot — upgraded to live (Batch 13 Wave A)
  // streamgraph — upgraded to live (Batch 3 Wave B)
  // bump-chart — upgraded to live (Batch 5 Wave A)
  // horizon-chart — upgraded to live (Batch 4 Wave B)
  // cycle-plot — upgraded to live (Batch 5 Wave B)
  // comet-plot — upgraded to live (Batch 13 Wave A). Time-series sector complete.
  // moving-average — upgraded to live (Batch 5 Wave A)
  // autocorrelation-plot — upgraded to live (Batch 8 Wave A)
  // partial-autocorrelation-plot — upgraded to live (Batch 8 Wave A)

  // Hierarchical & Tree -----------------------------------------------------
  // tree-chart — upgraded to live (Batch 2 Wave B)
  // radial-tree — upgraded to live (Batch 11 Wave B)
  // treemap — upgraded to live (Batch 1 Wave B)
  // convex-treemap — upgraded to live (Batch 13 Wave B)
  // sunburst-chart — upgraded to live (Batch 1 Wave B)
  // dendrogram — upgraded to live (Batch 2 Wave B)
  // packed-circle-chart — upgraded to live (Batch 11 Wave B)
  // circle-packing — upgraded to live (Batch 3 Wave B)
  // icicle-chart — upgraded to live (Batch 3 Wave B)

  // Networks ----------------------------------------------------------------
  // network-diagram — upgraded to live (Batch 2 Wave B)
  // arc-diagram — upgraded to live (Batch 5 Wave B)
  // chord-diagram — upgraded to live (Batch 2 Wave B)
  // hive-plot — upgraded to live (Batch 13 Wave B)
  // adjacency-matrix-plot — upgraded to live (Batch 5 Wave B)
  // arc-matrix — upgraded to live (Batch 13 Wave B)
  // voronoi-diagram — upgraded to live (Batch 5 Wave B)
  // dependency-graph — upgraded to live (Batch 13 Wave B). Networks residual complete.

  // Flow --------------------------------------------------------------------
  // flowchart — upgraded to live (Batch 2 Wave B)
  // sankey-diagram — upgraded to live (Batch 1 Wave B)
  // alluvial-diagram — upgraded to live (Batch 3 Wave B)
  // parallel-sets — upgraded to live (Batch 6 Wave B)

  // Finance & Trading -------------------------------------------------------
  // waterfall-chart — upgraded to live (Batch 2 Wave A)
  // ohlc-chart — upgraded to live (Batch 5 Wave B)
  // candlestick-chart — upgraded to live (Batch 1 Wave B)
  // kagi-chart — upgraded to live (Batch 9 Wave A)
  // renko-chart — upgraded to live (Batch 9 Wave A)
  // point-and-figure-chart — upgraded to live (Batch 9 Wave A)
  // heikin-ashi-chart — upgraded to live (Batch 9 Wave A)
  // ichimoku-kinko-hyo — upgraded to live (Batch 10 Wave A)
  // three-line-break-chart — upgraded to live (Batch 10 Wave A)
  // equivolume-chart — upgraded to live (Batch 11 Wave A)
  // market-profile-chart — upgraded to live (Batch 11 Wave A)
  // fan-chart-forecast — upgraded to live (Batch 3 Wave B)

  // Business & Management ---------------------------------------------------
  // quadrant-chart — upgraded to live (Batch 6 Wave A)
  // magic-quadrant — upgraded to live (Batch 7 Wave B)
  // swot-analysis — upgraded to live (Batch 3 Wave B)
  // opposites-diagram — upgraded to live (Batch 13 Wave B)
  // organizational-chart — upgraded to live (Batch 5 Wave B)
  // bullet-chart — upgraded to live (Batch 3 Wave A)
  // gauge-chart — upgraded to live (Batch 1 Wave B)
  // kpi-tile — upgraded to live (Batch 1 Wave B)
  // scorecard — upgraded to live (Batch 13 Wave B)
  // balanced-scorecard — upgraded to live (Batch 13 Wave B). Business sector complete.
  // stakeholder-power-interest-grid — upgraded to live (Batch 6 Wave A)
  // raci-matrix — upgraded to live (Batch 8 Wave B)
  // sipoc-diagram — upgraded to live (Batch 8 Wave B)
  // bpmn-diagram — upgraded to live (Batch 8 Wave B)
  // swimlane-diagram — upgraded to live (Batch 6 Wave B)

  // Project Management ------------------------------------------------------
  // gantt-chart — upgraded to live (Batch 1 Wave B)
  // pert-chart — upgraded to live (Batch 7 Wave B)
  // kanban-board — upgraded to live (Batch 7 Wave B)
  // burn-down-chart — upgraded to live (Batch 6 Wave A)
  // burn-up-chart — upgraded to live (Batch 6 Wave A)
  // cumulative-flow-diagram — upgraded to live (Batch 6 Wave B)

  // Quality -----------------------------------------------------------------
  // control-chart — upgraded to live (Batch 2 Wave B)
  // run-chart — upgraded to live (Batch 4 Wave B)
  // pareto-chart — upgraded to live (Batch 2 Wave A)
  // ishikawa-diagram — upgraded to live (Batch 3 Wave B)
  // affinity-diagram — upgraded to live (Batch 14 Wave B)
  // matrix-diagram — upgraded to live (Batch 14 Wave B)
  // pdpc — upgraded to live (Batch 14 Wave B). Quality sector complete.
  // value-stream-map — upgraded to live (Batch 8 Wave B)

  // Marketing & Sales -------------------------------------------------------
  // funnel-chart — upgraded to live (Batch 1 Wave B)
  // pyramid-chart — upgraded to live (Batch 2 Wave A)

  // Economics & Demographics ------------------------------------------------
  // lorenz-curve — upgraded to live (Batch 5 Wave A)
  // population-pyramid — upgraded to live (Batch 2 Wave A)
  // lexis-diagram — upgraded to live (Batch 14 Wave B)

  // Politics & Elections ----------------------------------------------------
  // nolan-chart — upgraded to live (Batch 3 Wave B)
  // pournelle-chart — upgraded to live (Batch 13 Wave B)
  // election-apportionment-diagram — upgraded to live (Batch 13 Wave B). Politics sector complete.

  // Medicine ----------------------------------------------------------------
  // nomogram — upgraded to live (Batch 14 Wave A)
  // bland-altman-plot — upgraded to live (Batch 6 Wave A)
  // funnel-plot-meta — upgraded to live (Batch 6 Wave A)
  // forest-plot — upgraded to live (Batch 2 Wave A)
  // kaplan-meier-curve — upgraded to live (Batch 2 Wave A)
  // genogram — upgraded to live (Batch 12 Wave B)

  // Biology -----------------------------------------------------------------
  // phylogenetic-tree — upgraded to live (Batch 8 Wave B)
  // cladogram — upgraded to live (Batch 8 Wave B)
  // phylogram — upgraded to live (Batch 12 Wave B)
  // tree-of-life-radial-phylogeny — upgraded to live (Batch 9 Wave B)

  // Genetics & Bioinformatics -----------------------------------------------
  // allele-chart — upgraded to live (Batch 14 Wave A)
  // pedigree-chart — upgraded to live (Batch 9 Wave B)
  // punnett-square — upgraded to live (Batch 7 Wave A)
  // karyotype — upgraded to live (Batch 9 Wave B)
  // ideogram — upgraded to live (Batch 9 Wave B)
  // circos-plot — upgraded to live (Batch 9 Wave B)
  // sequence-logo — upgraded to live (Batch 9 Wave B)
  // dot-plot-bioinformatics — upgraded to live (Batch 14 Wave B). Genetics sector complete.
  // manhattan-plot — upgraded to live (Batch 7 Wave B)
  // volcano-plot — upgraded to live (Batch 4 Wave B)

  // Chemistry ---------------------------------------------------------------
  // arrhenius-plot — upgraded to live (Batch 9 Wave A)
  // lineweaver-burk-plot — upgraded to live (Batch 10 Wave A)
  // lewis-structure — upgraded to live (Batch 10 Wave A)
  // titration-curve — upgraded to live (Batch 9 Wave A)
  // ternary-plot — upgraded to live (Batch 5 Wave B)
  // ternary-contour-plot — upgraded to live (Batch 11 Wave A)
  // quaternary-plot — upgraded to live (Batch 14 Wave A)
  // phase-diagram — upgraded to live (Batch 6 Wave B)
  // pourbaix-diagram — upgraded to live (Batch 3 Wave B)
  // ellingham-diagram — upgraded to live (Batch 14 Wave A). Chemistry sector complete.
  // jablonski-diagram — upgraded to live (Batch 7 Wave A)
  // potential-energy-diagram — upgraded to live (Batch 11 Wave A)

  // Physics & Astronomy -----------------------------------------------------
  // hertzsprung-russell-diagram — upgraded to live (Batch 7 Wave B)
  // hubble-diagram — upgraded to live (Batch 10 Wave A)
  // feynman-diagram — upgraded to live (Batch 8 Wave A)
  // dalitz-plot — upgraded to live (Batch 10 Wave A)
  // greninger-chart — upgraded to live (Batch 14 Wave A)
  // recurrence-plot — upgraded to live (Batch 11 Wave A)
  // phase-portrait — upgraded to live (Batch 10 Wave A)
  // phase-space-plot — upgraded to live (Batch 14 Wave B)
  // poincare-map — upgraded to live (Batch 10 Wave A)
  // bifurcation-diagram — upgraded to live (Batch 11 Wave A)
  // vector-field — upgraded to live (Batch 11 Wave B)
  // streamline-plot — upgraded to live (Batch 11 Wave B)
  // isosurface-plot — upgraded to live (Batch 14 Wave B). Physics sector complete.

  // Earth Sciences & Meteorology --------------------------------------------
  // taylor-diagram — upgraded to live (Batch 5 Wave B)
  // piper-diagram — upgraded to live (Batch 11 Wave A, tileSize bumped S→M)
  // stiff-diagram — upgraded to live (Batch 11 Wave A, tileSize bumped S→M)
  // stereonet — upgraded to live (Batch 11 Wave A)
  // rose-diagram — upgraded to live (Batch 4 Wave B)
  // galbraith-plot — upgraded to live (Batch 11 Wave A)
  // climate-stripes — upgraded to live (Batch 7 Wave B)

  // Electrical / Signal / Control -------------------------------------------
  // smith-chart — upgraded to live (Batch 6 Wave B)
  // bode-plot — upgraded to live (Batch 8 Wave A)
  // nichols-plot — upgraded to live (Batch 7 Wave A)
  // nyquist-plot — upgraded to live (Batch 7 Wave A)
  // root-locus-plot — upgraded to live (Batch 12 Wave A)
  // pole-zero-plot — upgraded to live (Batch 8 Wave A)
  // argand-diagram — upgraded to live (Batch 8 Wave A)
  // eye-diagram — upgraded to live (Batch 10 Wave A)
  // constellation-diagram — upgraded to live (Batch 10 Wave A)
  // spectrogram — upgraded to live (Batch 10 Wave B)
  // periodogram — upgraded to live (Batch 12 Wave A)
  // waterfall-plot-signal — upgraded to live (Batch 10 Wave B)
  // carpet-plot — upgraded to live (Batch 13 Wave A) [family bumped specialty→relationship per manifest]
  // drain-plot — upgraded to live (Batch 13 Wave A)
  // shmoo-plot — upgraded to live (Batch 13 Wave A) [family bumped specialty→relationship per manifest]
  // strip-chart — upgraded to live (Batch 13 Wave A)
  // block-diagram — upgraded to live (Batch 14 Wave B). Electrical sector complete.
  // circuit-diagram — upgraded to live (Batch 10 Wave B)
  // ladder-diagram — upgraded to live (Batch 10 Wave B)

  // Mechanical & Process Eng. ----------------------------------------------
  // exploded-view-drawing — upgraded to live (Batch 11 Wave B)
  // piping-instrumentation-diagram — upgraded to live (Batch 11 Wave B)

  // Software & Systems ------------------------------------------------------
  // structure-chart — upgraded to live (Batch 14 Wave B). Software sector complete.
  // uml-class-diagram — upgraded to live (Batch 7 Wave B)
  // uml-sequence-diagram — upgraded to live (Batch 7 Wave B)
  // uml-activity-diagram — upgraded to live (Batch 8 Wave B)
  // uml-state-diagram — upgraded to live (Batch 8 Wave B)
  // uml-use-case-diagram — upgraded to live (Batch 9 Wave B)
  // uml-component-diagram — upgraded to live (Batch 9 Wave B)
  // uml-deployment-diagram — upgraded to live (Batch 9 Wave B)
  // uml-object-diagram — upgraded to live (Batch 9 Wave B)
  // entity-relationship-diagram — upgraded to live (Batch 7 Wave B)
  // data-flow-diagram — upgraded to live (Batch 8 Wave B)
  // control-flow-graph — upgraded to live (Batch 8 Wave B)
  // finite-state-machine — upgraded to live (Batch 7 Wave B)
  // architecture-diagram — upgraded to live (Batch 10 Wave B)
  // flame-graph — upgraded to live (Batch 10 Wave B)

  // Cartography & GIS -------------------------------------------------------
  // tile-map — upgraded to live (Batch 6 Wave B)
  // geographical-heatmap — upgraded to live (Batch 10 Wave B)
  // choropleth — upgraded to live (Batch 2 Wave A)
  // bivariate-choropleth — upgraded to live (Batch 6 Wave B)
  // flow-map — upgraded to live (Batch 6 Wave B)
  // cartogram — upgraded to live (Batch 2 Wave A)
  // dot-density-map — upgraded to live (Batch 11 Wave B)
  // proportional-symbol-map — upgraded to live (Batch 11 Wave B)
  // isarithmic-map — upgraded to live (Batch 13 Wave A)
  // isochrone-map — upgraded to live (Batch 12 Wave A)
  // prism-map — upgraded to live (Batch 13 Wave B). Cartography sector complete.
  // topographic-map — upgraded to live (Batch 10 Wave B)
  // hexbin-map — upgraded to live (Batch 6 Wave B)
  // tissot-indicatrix — upgraded to live (Batch 12 Wave A)

  // Decision Analysis & Systems ---------------------------------------------
  // decision-tree-diagram — upgraded to live (Batch 5 Wave B)
  // influence-diagram — upgraded to live (Batch 10 Wave B)
  // causal-loop-diagram — upgraded to live (Batch 10 Wave B)
  // stock-and-flow-diagram — upgraded to live (Batch 11 Wave B)
  // mind-map — upgraded to live (Batch 6 Wave B)
  // concept-map — upgraded to live (Batch 11 Wave B)
  // argument-map — upgraded to live (Batch 12 Wave B)
  // rich-picture-diagram — upgraded to live (Batch 12 Wave B)
  // pugh-matrix — upgraded to live (Batch 3 Wave B)
  // bubble-map — upgraded to live (Batch 12 Wave B)
  // double-bubble-map — upgraded to live (Batch 12 Wave B)

  // Mathematics & Logic -----------------------------------------------------
  // euler-diagram — upgraded to live (Batch 5 Wave A)
  // venn-diagram — upgraded to live (Batch 2 Wave B)
  // contour-plot — upgraded to live (Batch 4 Wave B)
  // logarithmic-plot — upgraded to live (Batch 12 Wave B)
  // surface-plot — upgraded to live (Batch 12 Wave B)

  // Linguistics -------------------------------------------------------------
  // vowel-chart — upgraded to live (Batch 14 Wave A). Linguistics sector complete.

  // Astrology / Esoteric ----------------------------------------------------
  // natal-chart — upgraded to live (Batch 14 Wave B). Astrology sector complete.

  // Social Sciences ---------------------------------------------------------
  // sociogram — upgraded to live (Batch 14 Wave B). Social-sciences sector complete. CATALOG COMPLETE: 286 / 286 live.

  // Infographics & Data Communication ---------------------------------------
  // word-cloud — upgraded to live (Batch 2 Wave A)
  // pictogram — upgraded to live (Batch 6 Wave A)
  // pictorial-percentage-chart — upgraded to live (Batch 12 Wave B)
  // dot-matrix-chart — upgraded to live (Batch 14 Wave A)
  // isotype-chart — upgraded to live (Batch 14 Wave A)
  // unit-chart — upgraded to live (Batch 12 Wave B)
  // icon-array — upgraded to live (Batch 14 Wave A). Infographics sector complete.
];
