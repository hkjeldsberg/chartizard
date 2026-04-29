import dynamic from "next/dynamic";
import type { ComponentType } from "react";

export interface LiveChartProps {
  width: number;
  height: number;
}

// Live chart client components are loaded dynamically so the homepage RSC
// bundle stays lean — only the chart needed for a given /charts/[id] page ships
// to the browser.
const REGISTRY: Record<string, ComponentType<LiveChartProps>> = {
  // v1
  "line-chart": dynamic(() => import("@/charts/line/LineChart").then((m) => m.LineChart)),
  "area-chart": dynamic(() => import("@/charts/area/AreaChart").then((m) => m.AreaChart)),
  "stacked-bar-chart": dynamic(() =>
    import("@/charts/stacked-bar/StackedBarChart").then((m) => m.StackedBarChart),
  ),
  "pie-chart": dynamic(() => import("@/charts/pie/PieChart").then((m) => m.PieChart)),
  "hexagonal-binning-chart": dynamic(() =>
    import("@/charts/hexbin/HexbinChart").then((m) => m.HexbinChart),
  ),
  // Batch 1 Wave A
  "bar-chart": dynamic(() => import("@/charts/bar/BarChart").then((m) => m.BarChart)),
  "horizontal-bar-graph": dynamic(() =>
    import("@/charts/horizontal-bar/HorizontalBarChart").then((m) => m.HorizontalBarChart),
  ),
  "histogram": dynamic(() =>
    import("@/charts/histogram/HistogramChart").then((m) => m.HistogramChart),
  ),
  "donut-chart": dynamic(() => import("@/charts/donut/DonutChart").then((m) => m.DonutChart)),
  "scatter-plot": dynamic(() =>
    import("@/charts/scatter/ScatterChart").then((m) => m.ScatterChart),
  ),
  "bubble-chart": dynamic(() =>
    import("@/charts/bubble/BubbleChart").then((m) => m.BubbleChart),
  ),
  "box-plot": dynamic(() =>
    import("@/charts/box-plot/BoxPlotChart").then((m) => m.BoxPlotChart),
  ),
  "violin-plot": dynamic(() =>
    import("@/charts/violin/ViolinChart").then((m) => m.ViolinChart),
  ),
  "heatmap": dynamic(() =>
    import("@/charts/heatmap/HeatmapChart").then((m) => m.HeatmapChart),
  ),
  "radar-chart": dynamic(() =>
    import("@/charts/radar/RadarChart").then((m) => m.RadarChart),
  ),
  // Batch 1 Wave B
  "sparkline": dynamic(() =>
    import("@/charts/sparkline/SparklineChart").then((m) => m.SparklineChart),
  ),
  "kpi-tile": dynamic(() =>
    import("@/charts/kpi-tile/KpiTileChart").then((m) => m.KpiTileChart),
  ),
  "density-plot": dynamic(() =>
    import("@/charts/density/DensityChart").then((m) => m.DensityChart),
  ),
  "gauge-chart": dynamic(() =>
    import("@/charts/gauge/GaugeChart").then((m) => m.GaugeChart),
  ),
  "candlestick-chart": dynamic(() =>
    import("@/charts/candlestick/CandlestickChart").then((m) => m.CandlestickChart),
  ),
  "gantt-chart": dynamic(() =>
    import("@/charts/gantt/GanttChart").then((m) => m.GanttChart),
  ),
  "funnel-chart": dynamic(() =>
    import("@/charts/funnel/FunnelChart").then((m) => m.FunnelChart),
  ),
  "treemap": dynamic(() =>
    import("@/charts/treemap/TreemapChart").then((m) => m.TreemapChart),
  ),
  "sunburst-chart": dynamic(() =>
    import("@/charts/sunburst/SunburstChart").then((m) => m.SunburstChart),
  ),
  "sankey-diagram": dynamic(() =>
    import("@/charts/sankey/SankeyChart").then((m) => m.SankeyChart),
  ),
  // Batch 2 Wave A
  "waterfall-chart": dynamic(() =>
    import("@/charts/waterfall/WaterfallChart").then((m) => m.WaterfallChart),
  ),
  "pareto-chart": dynamic(() =>
    import("@/charts/pareto/ParetoChart").then((m) => m.ParetoChart),
  ),
  "choropleth": dynamic(() =>
    import("@/charts/choropleth/ChoroplethChart").then((m) => m.ChoroplethChart),
  ),
  "cartogram": dynamic(() =>
    import("@/charts/cartogram/CartogramChart").then((m) => m.CartogramChart),
  ),
  "word-cloud": dynamic(() =>
    import("@/charts/word-cloud/WordCloudChart").then((m) => m.WordCloudChart),
  ),
  "population-pyramid": dynamic(() =>
    import("@/charts/population-pyramid/PopulationPyramidChart").then(
      (m) => m.PopulationPyramidChart,
    ),
  ),
  "pyramid-chart": dynamic(() =>
    import("@/charts/pyramid/PyramidChart").then((m) => m.PyramidChart),
  ),
  "lollipop-plot": dynamic(() =>
    import("@/charts/lollipop/LollipopChart").then((m) => m.LollipopChart),
  ),
  "kaplan-meier-curve": dynamic(() =>
    import("@/charts/kaplan-meier/KaplanMeierChart").then((m) => m.KaplanMeierChart),
  ),
  "forest-plot": dynamic(() =>
    import("@/charts/forest-plot/ForestPlotChart").then((m) => m.ForestPlotChart),
  ),
  // Batch 2 Wave B
  "tree-chart": dynamic(() =>
    import("@/charts/tree/TreeChart").then((m) => m.TreeChart),
  ),
  "dendrogram": dynamic(() =>
    import("@/charts/dendrogram/DendrogramChart").then((m) => m.DendrogramChart),
  ),
  "network-diagram": dynamic(() =>
    import("@/charts/network/NetworkChart").then((m) => m.NetworkChart),
  ),
  "chord-diagram": dynamic(() =>
    import("@/charts/chord/ChordChart").then((m) => m.ChordChart),
  ),
  "flowchart": dynamic(() =>
    import("@/charts/flowchart/FlowchartChart").then((m) => m.FlowchartChart),
  ),
  "control-chart": dynamic(() =>
    import("@/charts/control-chart/ControlChart").then((m) => m.ControlChart),
  ),
  "venn-diagram": dynamic(() =>
    import("@/charts/venn-diagram/VennDiagramChart").then((m) => m.VennDiagramChart),
  ),
  "parallel-coordinates-plot": dynamic(() =>
    import("@/charts/parallel-coordinates-plot/ParallelCoordinatesPlotChart").then(
      (m) => m.ParallelCoordinatesPlotChart,
    ),
  ),
  "ridgeline-plot": dynamic(() =>
    import("@/charts/ridgeline/RidgelineChart").then((m) => m.RidgelineChart),
  ),
  "mosaic-plot": dynamic(() =>
    import("@/charts/mosaic/MosaicChart").then((m) => m.MosaicChart),
  ),
  // Batch 3 Wave A
  "grouped-column-chart": dynamic(() =>
    import("@/charts/grouped-column/GroupedColumnChart").then(
      (m) => m.GroupedColumnChart,
    ),
  ),
  "diverging-bar-chart": dynamic(() =>
    import("@/charts/diverging-bar/DivergingBarChart").then((m) => m.DivergingBarChart),
  ),
  "waffle-chart": dynamic(() =>
    import("@/charts/waffle/WaffleChart").then((m) => m.WaffleChart),
  ),
  "slope-chart": dynamic(() =>
    import("@/charts/slope/SlopeChart").then((m) => m.SlopeChart),
  ),
  "dumbbell-chart": dynamic(() =>
    import("@/charts/dumbbell/DumbbellChart").then((m) => m.DumbbellChart),
  ),
  "bullet-chart": dynamic(() =>
    import("@/charts/bullet/BulletChart").then((m) => m.BulletChart),
  ),
  "roc-curve": dynamic(() =>
    import("@/charts/roc/RocChart").then((m) => m.RocChart),
  ),
  "precision-recall-curve": dynamic(() =>
    import("@/charts/precision-recall/PrecisionRecallChart").then(
      (m) => m.PrecisionRecallChart,
    ),
  ),
  "qq-plot": dynamic(() =>
    import("@/charts/qq/QqChart").then((m) => m.QqChart),
  ),
  "normal-probability-plot": dynamic(() =>
    import("@/charts/normal-probability/NormalProbabilityChart").then(
      (m) => m.NormalProbabilityChart,
    ),
  ),
  // Batch 3 Wave B
  "fan-chart-forecast": dynamic(() =>
    import("@/charts/fan-chart/FanChart").then((m) => m.FanChart),
  ),
  "streamgraph": dynamic(() =>
    import("@/charts/streamgraph/StreamgraphChart").then((m) => m.StreamgraphChart),
  ),
  "pugh-matrix": dynamic(() =>
    import("@/charts/pugh/PughMatrix").then((m) => m.PughMatrix),
  ),
  "ishikawa-diagram": dynamic(() =>
    import("@/charts/ishikawa/IshikawaDiagram").then((m) => m.IshikawaDiagram),
  ),
  "circle-packing": dynamic(() =>
    import("@/charts/circle-packing/CirclePackingChart").then(
      (m) => m.CirclePackingChart,
    ),
  ),
  "icicle-chart": dynamic(() =>
    import("@/charts/icicle/IcicleChart").then((m) => m.IcicleChart),
  ),
  "alluvial-diagram": dynamic(() =>
    import("@/charts/alluvial/AlluvialDiagram").then((m) => m.AlluvialDiagram),
  ),
  "nolan-chart": dynamic(() =>
    import("@/charts/nolan/NolanChart").then((m) => m.NolanChart),
  ),
  "swot-analysis": dynamic(() =>
    import("@/charts/swot/SwotAnalysis").then((m) => m.SwotAnalysis),
  ),
  "pourbaix-diagram": dynamic(() =>
    import("@/charts/pourbaix/PourbaixDiagram").then((m) => m.PourbaixDiagram),
  ),
  // Batch 4 Wave A
  "jitter-plot": dynamic(() =>
    import("@/charts/jitter/JitterChart").then((m) => m.JitterChart),
  ),
  "strip-plot": dynamic(() =>
    import("@/charts/strip/StripChart").then((m) => m.StripChart),
  ),
  "beeswarm-chart": dynamic(() =>
    import("@/charts/beeswarm/BeeswarmChart").then((m) => m.BeeswarmChart),
  ),
  "sina-plot": dynamic(() =>
    import("@/charts/sina/SinaChart").then((m) => m.SinaChart),
  ),
  "stemplot": dynamic(() =>
    import("@/charts/stemplot/StemplotChart").then((m) => m.StemplotChart),
  ),
  "radial-histogram": dynamic(() =>
    import("@/charts/radial-histogram/RadialHistogramChart").then(
      (m) => m.RadialHistogramChart,
    ),
  ),
  "error-bars": dynamic(() =>
    import("@/charts/error-bars/ErrorBarsChart").then((m) => m.ErrorBarsChart),
  ),
  "confusion-matrix": dynamic(() =>
    import("@/charts/confusion-matrix/ConfusionMatrixChart").then(
      (m) => m.ConfusionMatrixChart,
    ),
  ),
  "feature-importance-plot": dynamic(() =>
    import("@/charts/feature-importance/FeatureImportanceChart").then(
      (m) => m.FeatureImportanceChart,
    ),
  ),
  "scree-plot": dynamic(() =>
    import("@/charts/scree/ScreeChart").then((m) => m.ScreeChart),
  ),
  // Batch 4 Wave B
  "small-multiples": dynamic(() =>
    import("@/charts/small-multiples/SmallMultiplesChart").then(
      (m) => m.SmallMultiplesChart,
    ),
  ),
  "spaghetti-plot": dynamic(() =>
    import("@/charts/spaghetti/SpaghettiChart").then((m) => m.SpaghettiChart),
  ),
  "horizon-chart": dynamic(() =>
    import("@/charts/horizon/HorizonChart").then((m) => m.HorizonChart),
  ),
  "calendar": dynamic(() =>
    import("@/charts/calendar/CalendarChart").then((m) => m.CalendarChart),
  ),
  "correlation-matrix": dynamic(() =>
    import("@/charts/correlation-matrix/CorrelationMatrixChart").then(
      (m) => m.CorrelationMatrixChart,
    ),
  ),
  "scatter-plot-matrix": dynamic(() =>
    import("@/charts/scatter-plot-matrix/ScatterPlotMatrixChart").then(
      (m) => m.ScatterPlotMatrixChart,
    ),
  ),
  "contour-plot": dynamic(() =>
    import("@/charts/contour/ContourChart").then((m) => m.ContourChart),
  ),
  "rose-diagram": dynamic(() =>
    import("@/charts/rose-diagram/RoseDiagramChart").then(
      (m) => m.RoseDiagramChart,
    ),
  ),
  "volcano-plot": dynamic(() =>
    import("@/charts/volcano/VolcanoChart").then((m) => m.VolcanoChart),
  ),
  "run-chart": dynamic(() =>
    import("@/charts/run-chart/RunChart").then((m) => m.RunChart),
  ),
  // Batch 5 Wave A
  "nightingale-chart": dynamic(() =>
    import("@/charts/nightingale/NightingaleChart").then((m) => m.NightingaleChart),
  ),
  "polar-area-diagram": dynamic(() =>
    import("@/charts/polar-area/PolarAreaChart").then((m) => m.PolarAreaChart),
  ),
  "radial-bar-chart": dynamic(() =>
    import("@/charts/radial-bar/RadialBarChart").then((m) => m.RadialBarChart),
  ),
  "star-plot": dynamic(() =>
    import("@/charts/star-plot/StarPlotChart").then((m) => m.StarPlotChart),
  ),
  "moving-average": dynamic(() =>
    import("@/charts/moving-average/MovingAverageChart").then(
      (m) => m.MovingAverageChart,
    ),
  ),
  "bump-chart": dynamic(() =>
    import("@/charts/bump-chart/BumpChart").then((m) => m.BumpChart),
  ),
  "lorenz-curve": dynamic(() =>
    import("@/charts/lorenz/LorenzChart").then((m) => m.LorenzChart),
  ),
  "euler-diagram": dynamic(() =>
    import("@/charts/euler/EulerDiagramChart").then((m) => m.EulerDiagramChart),
  ),
  "dot-plot-statistics": dynamic(() =>
    import("@/charts/dot-plot/DotPlotChart").then((m) => m.DotPlotChart),
  ),
  "rug-plot": dynamic(() =>
    import("@/charts/rug/RugPlotChart").then((m) => m.RugPlotChart),
  ),
  // Batch 5 Wave B
  "voronoi-diagram": dynamic(() =>
    import("@/charts/voronoi/VoronoiChart").then((m) => m.VoronoiChart),
  ),
  "arc-diagram": dynamic(() =>
    import("@/charts/arc-diagram/ArcDiagramChart").then((m) => m.ArcDiagramChart),
  ),
  "adjacency-matrix-plot": dynamic(() =>
    import("@/charts/adjacency-matrix/AdjacencyMatrixChart").then(
      (m) => m.AdjacencyMatrixChart,
    ),
  ),
  "taylor-diagram": dynamic(() =>
    import("@/charts/taylor/TaylorDiagramChart").then((m) => m.TaylorDiagramChart),
  ),
  "ohlc-chart": dynamic(() =>
    import("@/charts/ohlc/OhlcChart").then((m) => m.OhlcChart),
  ),
  "cycle-plot": dynamic(() =>
    import("@/charts/cycle-plot/CyclePlotChart").then((m) => m.CyclePlotChart),
  ),
  "decision-tree-diagram": dynamic(() =>
    import("@/charts/decision-tree/DecisionTreeDiagram").then(
      (m) => m.DecisionTreeDiagram,
    ),
  ),
  "organizational-chart": dynamic(() =>
    import("@/charts/org-chart/OrganizationalChart").then(
      (m) => m.OrganizationalChart,
    ),
  ),
  "timeline-chart": dynamic(() =>
    import("@/charts/timeline/TimelineChart").then((m) => m.TimelineChart),
  ),
  "ternary-plot": dynamic(() =>
    import("@/charts/ternary/TernaryChart").then((m) => m.TernaryChart),
  ),
  // Batch 6 Wave A
  "bland-altman-plot": dynamic(() =>
    import("@/charts/bland-altman/BlandAltmanChart").then((m) => m.BlandAltmanChart),
  ),
  "funnel-plot-meta": dynamic(() =>
    import("@/charts/funnel-plot-meta/FunnelPlotMetaChart").then(
      (m) => m.FunnelPlotMetaChart,
    ),
  ),
  "quadrant-chart": dynamic(() =>
    import("@/charts/quadrant/QuadrantChart").then((m) => m.QuadrantChart),
  ),
  "stakeholder-power-interest-grid": dynamic(() =>
    import("@/charts/stakeholder-grid/StakeholderGridChart").then(
      (m) => m.StakeholderGridChart,
    ),
  ),
  "deviation-chart": dynamic(() =>
    import("@/charts/deviation/DeviationChart").then((m) => m.DeviationChart),
  ),
  "likert-scale-chart": dynamic(() =>
    import("@/charts/likert/LikertChart").then((m) => m.LikertChart),
  ),
  "burn-down-chart": dynamic(() =>
    import("@/charts/burn-down/BurnDownChart").then((m) => m.BurnDownChart),
  ),
  "burn-up-chart": dynamic(() =>
    import("@/charts/burn-up/BurnUpChart").then((m) => m.BurnUpChart),
  ),
  "pictogram": dynamic(() =>
    import("@/charts/pictogram/PictogramChart").then((m) => m.PictogramChart),
  ),
  "tally-chart": dynamic(() =>
    import("@/charts/tally/TallyChart").then((m) => m.TallyChart),
  ),
  // Batch 6 Wave B
  "tile-map": dynamic(() =>
    import("@/charts/tile-map/TileMapChart").then((m) => m.TileMapChart),
  ),
  "hexbin-map": dynamic(() =>
    import("@/charts/hexbin-map/HexbinMapChart").then((m) => m.HexbinMapChart),
  ),
  "flow-map": dynamic(() =>
    import("@/charts/flow-map/FlowMapChart").then((m) => m.FlowMapChart),
  ),
  "bivariate-choropleth": dynamic(() =>
    import("@/charts/bivariate-choropleth/BivariateChoroplethChart").then(
      (m) => m.BivariateChoroplethChart,
    ),
  ),
  "parallel-sets": dynamic(() =>
    import("@/charts/parallel-sets/ParallelSetsChart").then(
      (m) => m.ParallelSetsChart,
    ),
  ),
  "swimlane-diagram": dynamic(() =>
    import("@/charts/swimlane/SwimlaneChart").then((m) => m.SwimlaneChart),
  ),
  "mind-map": dynamic(() =>
    import("@/charts/mind-map/MindMapChart").then((m) => m.MindMapChart),
  ),
  "cumulative-flow-diagram": dynamic(() =>
    import("@/charts/cumulative-flow/CumulativeFlowChart").then(
      (m) => m.CumulativeFlowChart,
    ),
  ),
  "phase-diagram": dynamic(() =>
    import("@/charts/phase-diagram/PhaseDiagram").then((m) => m.PhaseDiagram),
  ),
  "smith-chart": dynamic(() =>
    import("@/charts/smith-chart/SmithChart").then((m) => m.SmithChart),
  ),
  // Batch 7 Wave A
  "gap-chart": dynamic(() =>
    import("@/charts/gap/GapChart").then((m) => m.GapChart),
  ),
  "residual-plot": dynamic(() =>
    import("@/charts/residual/ResidualPlot").then((m) => m.ResidualPlot),
  ),
  "cdf-plot": dynamic(() =>
    import("@/charts/cdf/CdfPlot").then((m) => m.CdfPlot),
  ),
  "ecdf-plot": dynamic(() =>
    import("@/charts/ecdf/EcdfPlot").then((m) => m.EcdfPlot),
  ),
  "lift-chart": dynamic(() =>
    import("@/charts/lift/LiftChart").then((m) => m.LiftChart),
  ),
  "cumulative-gains-chart": dynamic(() =>
    import("@/charts/cumulative-gains/CumulativeGainsChart").then(
      (m) => m.CumulativeGainsChart,
    ),
  ),
  "punnett-square": dynamic(() =>
    import("@/charts/punnett/PunnettSquareChart").then(
      (m) => m.PunnettSquareChart,
    ),
  ),
  "jablonski-diagram": dynamic(() =>
    import("@/charts/jablonski/JablonskiDiagram").then(
      (m) => m.JablonskiDiagram,
    ),
  ),
  "nichols-plot": dynamic(() =>
    import("@/charts/nichols/NicholsPlot").then((m) => m.NicholsPlot),
  ),
  "nyquist-plot": dynamic(() =>
    import("@/charts/nyquist/NyquistPlot").then((m) => m.NyquistPlot),
  ),
  // Batch 7 Wave B
  "uml-class-diagram": dynamic(() =>
    import("@/charts/uml-class/UmlClassDiagram").then((m) => m.UmlClassDiagram),
  ),
  "entity-relationship-diagram": dynamic(() =>
    import("@/charts/erd/EntityRelationshipDiagram").then(
      (m) => m.EntityRelationshipDiagram,
    ),
  ),
  "uml-sequence-diagram": dynamic(() =>
    import("@/charts/uml-sequence/UmlSequenceDiagram").then(
      (m) => m.UmlSequenceDiagram,
    ),
  ),
  "finite-state-machine": dynamic(() =>
    import("@/charts/fsm/FiniteStateMachine").then((m) => m.FiniteStateMachine),
  ),
  "kanban-board": dynamic(() =>
    import("@/charts/kanban/KanbanBoard").then((m) => m.KanbanBoard),
  ),
  "pert-chart": dynamic(() =>
    import("@/charts/pert/PertChart").then((m) => m.PertChart),
  ),
  "climate-stripes": dynamic(() =>
    import("@/charts/climate-stripes/ClimateStripes").then(
      (m) => m.ClimateStripes,
    ),
  ),
  "magic-quadrant": dynamic(() =>
    import("@/charts/magic-quadrant/MagicQuadrant").then((m) => m.MagicQuadrant),
  ),
  "manhattan-plot": dynamic(() =>
    import("@/charts/manhattan/ManhattanPlot").then((m) => m.ManhattanPlot),
  ),
  "hertzsprung-russell-diagram": dynamic(() =>
    import("@/charts/hr-diagram/HertzsprungRussellDiagram").then(
      (m) => m.HertzsprungRussellDiagram,
    ),
  ),
  // Batch 8 Wave A
  "bode-plot": dynamic(() =>
    import("@/charts/bode-plot/BodePlot").then((m) => m.BodePlot),
  ),
  "pole-zero-plot": dynamic(() =>
    import("@/charts/pole-zero-plot/PoleZeroPlot").then((m) => m.PoleZeroPlot),
  ),
  "autocorrelation-plot": dynamic(() =>
    import("@/charts/autocorrelation-plot/AutocorrelationPlot").then(
      (m) => m.AutocorrelationPlot,
    ),
  ),
  "partial-autocorrelation-plot": dynamic(() =>
    import("@/charts/partial-autocorrelation-plot/PartialAutocorrelationPlot").then(
      (m) => m.PartialAutocorrelationPlot,
    ),
  ),
  "partial-dependence-plot": dynamic(() =>
    import("@/charts/partial-dependence-plot/PartialDependencePlot").then(
      (m) => m.PartialDependencePlot,
    ),
  ),
  "shap-summary-plot": dynamic(() =>
    import("@/charts/shap-summary-plot/ShapSummaryPlot").then(
      (m) => m.ShapSummaryPlot,
    ),
  ),
  "calibration-plot": dynamic(() =>
    import("@/charts/calibration-plot/CalibrationPlot").then(
      (m) => m.CalibrationPlot,
    ),
  ),
  "pp-plot": dynamic(() =>
    import("@/charts/pp-plot/PpPlot").then((m) => m.PpPlot),
  ),
  "argand-diagram": dynamic(() =>
    import("@/charts/argand-diagram/ArgandDiagram").then((m) => m.ArgandDiagram),
  ),
  "feynman-diagram": dynamic(() =>
    import("@/charts/feynman-diagram/FeynmanDiagram").then(
      (m) => m.FeynmanDiagram,
    ),
  ),
  // Batch 8 Wave B
  "uml-activity-diagram": dynamic(() =>
    import("@/charts/uml-activity-diagram/UmlActivityDiagram").then(
      (m) => m.UmlActivityDiagram,
    ),
  ),
  "uml-state-diagram": dynamic(() =>
    import("@/charts/uml-state-diagram/UmlStateDiagram").then(
      (m) => m.UmlStateDiagram,
    ),
  ),
  "data-flow-diagram": dynamic(() =>
    import("@/charts/data-flow-diagram/DataFlowDiagram").then(
      (m) => m.DataFlowDiagram,
    ),
  ),
  "control-flow-graph": dynamic(() =>
    import("@/charts/control-flow-graph/ControlFlowGraph").then(
      (m) => m.ControlFlowGraph,
    ),
  ),
  "bpmn-diagram": dynamic(() =>
    import("@/charts/bpmn-diagram/BpmnDiagram").then((m) => m.BpmnDiagram),
  ),
  "value-stream-map": dynamic(() =>
    import("@/charts/value-stream-map/ValueStreamMap").then(
      (m) => m.ValueStreamMap,
    ),
  ),
  "phylogenetic-tree": dynamic(() =>
    import("@/charts/phylogenetic-tree/PhylogeneticTree").then(
      (m) => m.PhylogeneticTree,
    ),
  ),
  "cladogram": dynamic(() =>
    import("@/charts/cladogram/Cladogram").then((m) => m.Cladogram),
  ),
  "raci-matrix": dynamic(() =>
    import("@/charts/raci-matrix/RaciMatrix").then((m) => m.RaciMatrix),
  ),
  "sipoc-diagram": dynamic(() =>
    import("@/charts/sipoc-diagram/SipocDiagram").then((m) => m.SipocDiagram),
  ),
  // Batch 9 Wave A
  "cooks-distance-plot": dynamic(() =>
    import("@/charts/cooks-distance-plot/CooksDistancePlot").then(
      (m) => m.CooksDistancePlot,
    ),
  ),
  "leverage-plot": dynamic(() =>
    import("@/charts/leverage-plot/LeveragePlot").then((m) => m.LeveragePlot),
  ),
  "bagplot": dynamic(() =>
    import("@/charts/bagplot/Bagplot").then((m) => m.Bagplot),
  ),
  "biplot": dynamic(() =>
    import("@/charts/biplot/Biplot").then((m) => m.Biplot),
  ),
  "kagi-chart": dynamic(() =>
    import("@/charts/kagi-chart/KagiChart").then((m) => m.KagiChart),
  ),
  "renko-chart": dynamic(() =>
    import("@/charts/renko-chart/RenkoChart").then((m) => m.RenkoChart),
  ),
  "point-and-figure-chart": dynamic(() =>
    import("@/charts/point-and-figure-chart/PointAndFigureChart").then(
      (m) => m.PointAndFigureChart,
    ),
  ),
  "heikin-ashi-chart": dynamic(() =>
    import("@/charts/heikin-ashi-chart/HeikinAshiChart").then(
      (m) => m.HeikinAshiChart,
    ),
  ),
  "titration-curve": dynamic(() =>
    import("@/charts/titration-curve/TitrationCurve").then(
      (m) => m.TitrationCurve,
    ),
  ),
  "arrhenius-plot": dynamic(() =>
    import("@/charts/arrhenius-plot/ArrheniusPlot").then(
      (m) => m.ArrheniusPlot,
    ),
  ),
  // Batch 9 Wave B
  "uml-use-case-diagram": dynamic(() =>
    import("@/charts/uml-use-case-diagram/UmlUseCaseDiagram").then(
      (m) => m.UmlUseCaseDiagram,
    ),
  ),
  "uml-component-diagram": dynamic(() =>
    import("@/charts/uml-component-diagram/UmlComponentDiagram").then(
      (m) => m.UmlComponentDiagram,
    ),
  ),
  "uml-deployment-diagram": dynamic(() =>
    import("@/charts/uml-deployment-diagram/UmlDeploymentDiagram").then(
      (m) => m.UmlDeploymentDiagram,
    ),
  ),
  "uml-object-diagram": dynamic(() =>
    import("@/charts/uml-object-diagram/UmlObjectDiagram").then(
      (m) => m.UmlObjectDiagram,
    ),
  ),
  "circos-plot": dynamic(() =>
    import("@/charts/circos-plot/CircosPlot").then((m) => m.CircosPlot),
  ),
  "tree-of-life-radial-phylogeny": dynamic(() =>
    import(
      "@/charts/tree-of-life-radial-phylogeny/TreeOfLifeRadialPhylogeny"
    ).then((m) => m.TreeOfLifeRadialPhylogeny),
  ),
  "pedigree-chart": dynamic(() =>
    import("@/charts/pedigree-chart/PedigreeChart").then((m) => m.PedigreeChart),
  ),
  "karyotype": dynamic(() =>
    import("@/charts/karyotype/Karyotype").then((m) => m.Karyotype),
  ),
  "sequence-logo": dynamic(() =>
    import("@/charts/sequence-logo/SequenceLogo").then((m) => m.SequenceLogo),
  ),
  "ideogram": dynamic(() =>
    import("@/charts/ideogram/Ideogram").then((m) => m.Ideogram),
  ),
  // Batch 10 Wave A
  "ichimoku-kinko-hyo": dynamic(() =>
    import("@/charts/ichimoku-kinko-hyo/IchimokuKinkoHyo").then(
      (m) => m.IchimokuKinkoHyo,
    ),
  ),
  "three-line-break-chart": dynamic(() =>
    import("@/charts/three-line-break-chart/ThreeLineBreakChart").then(
      (m) => m.ThreeLineBreakChart,
    ),
  ),
  "eye-diagram": dynamic(() =>
    import("@/charts/eye-diagram/EyeDiagram").then((m) => m.EyeDiagram),
  ),
  "constellation-diagram": dynamic(() =>
    import("@/charts/constellation-diagram/ConstellationDiagram").then(
      (m) => m.ConstellationDiagram,
    ),
  ),
  "lineweaver-burk-plot": dynamic(() =>
    import("@/charts/lineweaver-burk-plot/LineweaverBurkPlot").then(
      (m) => m.LineweaverBurkPlot,
    ),
  ),
  "lewis-structure": dynamic(() =>
    import("@/charts/lewis-structure/LewisStructure").then(
      (m) => m.LewisStructure,
    ),
  ),
  "phase-portrait": dynamic(() =>
    import("@/charts/phase-portrait/PhasePortrait").then((m) => m.PhasePortrait),
  ),
  "poincare-map": dynamic(() =>
    import("@/charts/poincare-map/PoincareMap").then((m) => m.PoincareMap),
  ),
  "hubble-diagram": dynamic(() =>
    import("@/charts/hubble-diagram/HubbleDiagram").then((m) => m.HubbleDiagram),
  ),
  "dalitz-plot": dynamic(() =>
    import("@/charts/dalitz-plot/DalitzPlot").then((m) => m.DalitzPlot),
  ),
  // Batch 10 Wave B
  "architecture-diagram": dynamic(() =>
    import("@/charts/architecture-diagram/ArchitectureDiagram").then(
      (m) => m.ArchitectureDiagram,
    ),
  ),
  "flame-graph": dynamic(() =>
    import("@/charts/flame-graph/FlameGraph").then((m) => m.FlameGraph),
  ),
  "circuit-diagram": dynamic(() =>
    import("@/charts/circuit-diagram/CircuitDiagram").then(
      (m) => m.CircuitDiagram,
    ),
  ),
  "ladder-diagram": dynamic(() =>
    import("@/charts/ladder-diagram/LadderDiagram").then((m) => m.LadderDiagram),
  ),
  "spectrogram": dynamic(() =>
    import("@/charts/spectrogram/Spectrogram").then((m) => m.Spectrogram),
  ),
  "waterfall-plot-signal": dynamic(() =>
    import("@/charts/waterfall-plot-signal/WaterfallPlotSignal").then(
      (m) => m.WaterfallPlotSignal,
    ),
  ),
  "influence-diagram": dynamic(() =>
    import("@/charts/influence-diagram/InfluenceDiagram").then(
      (m) => m.InfluenceDiagram,
    ),
  ),
  "causal-loop-diagram": dynamic(() =>
    import("@/charts/causal-loop-diagram/CausalLoopDiagram").then(
      (m) => m.CausalLoopDiagram,
    ),
  ),
  "geographical-heatmap": dynamic(() =>
    import("@/charts/geographical-heatmap/GeographicalHeatmap").then(
      (m) => m.GeographicalHeatmap,
    ),
  ),
  "topographic-map": dynamic(() =>
    import("@/charts/topographic-map/TopographicMap").then(
      (m) => m.TopographicMap,
    ),
  ),
  // Batch 11 Wave A
  "bifurcation-diagram": dynamic(() =>
    import("@/charts/bifurcation-diagram/BifurcationDiagram").then(
      (m) => m.BifurcationDiagram,
    ),
  ),
  "recurrence-plot": dynamic(() =>
    import("@/charts/recurrence-plot/RecurrencePlot").then(
      (m) => m.RecurrencePlot,
    ),
  ),
  "piper-diagram": dynamic(() =>
    import("@/charts/piper-diagram/PiperDiagram").then((m) => m.PiperDiagram),
  ),
  "stiff-diagram": dynamic(() =>
    import("@/charts/stiff-diagram/StiffDiagram").then((m) => m.StiffDiagram),
  ),
  "stereonet": dynamic(() =>
    import("@/charts/stereonet/Stereonet").then((m) => m.Stereonet),
  ),
  "galbraith-plot": dynamic(() =>
    import("@/charts/galbraith-plot/GalbraithPlot").then((m) => m.GalbraithPlot),
  ),
  "equivolume-chart": dynamic(() =>
    import("@/charts/equivolume-chart/EquivolumeChart").then(
      (m) => m.EquivolumeChart,
    ),
  ),
  "market-profile-chart": dynamic(() =>
    import("@/charts/market-profile-chart/MarketProfileChart").then(
      (m) => m.MarketProfileChart,
    ),
  ),
  "ternary-contour-plot": dynamic(() =>
    import("@/charts/ternary-contour-plot/TernaryContourPlot").then(
      (m) => m.TernaryContourPlot,
    ),
  ),
  "potential-energy-diagram": dynamic(() =>
    import("@/charts/potential-energy-diagram/PotentialEnergyDiagram").then(
      (m) => m.PotentialEnergyDiagram,
    ),
  ),
  // Batch 11 Wave B
  "vector-field": dynamic(() =>
    import("@/charts/vector-field/VectorField").then((m) => m.VectorField),
  ),
  "streamline-plot": dynamic(() =>
    import("@/charts/streamline-plot/StreamlinePlot").then(
      (m) => m.StreamlinePlot,
    ),
  ),
  "piping-instrumentation-diagram": dynamic(() =>
    import(
      "@/charts/piping-instrumentation-diagram/PipingInstrumentationDiagram"
    ).then((m) => m.PipingInstrumentationDiagram),
  ),
  "exploded-view-drawing": dynamic(() =>
    import("@/charts/exploded-view-drawing/ExplodedViewDrawing").then(
      (m) => m.ExplodedViewDrawing,
    ),
  ),
  "stock-and-flow-diagram": dynamic(() =>
    import("@/charts/stock-and-flow-diagram/StockAndFlowDiagram").then(
      (m) => m.StockAndFlowDiagram,
    ),
  ),
  "concept-map": dynamic(() =>
    import("@/charts/concept-map/ConceptMap").then((m) => m.ConceptMap),
  ),
  "radial-tree": dynamic(() =>
    import("@/charts/radial-tree/RadialTree").then((m) => m.RadialTree),
  ),
  "packed-circle-chart": dynamic(() =>
    import("@/charts/packed-circle-chart/PackedCircleChart").then(
      (m) => m.PackedCircleChart,
    ),
  ),
  "dot-density-map": dynamic(() =>
    import("@/charts/dot-density-map/DotDensityMap").then(
      (m) => m.DotDensityMap,
    ),
  ),
  "proportional-symbol-map": dynamic(() =>
    import("@/charts/proportional-symbol-map/ProportionalSymbolMap").then(
      (m) => m.ProportionalSymbolMap,
    ),
  ),
  // Batch 12 Wave A
  "chernoff-faces": dynamic(() =>
    import("@/charts/chernoff-faces/ChernoffFaces").then((m) => m.ChernoffFaces),
  ),
  "andrews-plot": dynamic(() =>
    import("@/charts/andrews-plot/AndrewsPlot").then((m) => m.AndrewsPlot),
  ),
  "star-glyph-plot": dynamic(() =>
    import("@/charts/star-glyph-plot/StarGlyphPlot").then((m) => m.StarGlyphPlot),
  ),
  "hammock-plot": dynamic(() =>
    import("@/charts/hammock-plot/HammockPlot").then((m) => m.HammockPlot),
  ),
  "doubledecker-plot": dynamic(() =>
    import("@/charts/doubledecker-plot/DoubledeckerPlot").then(
      (m) => m.DoubledeckerPlot,
    ),
  ),
  "barcode-chart": dynamic(() =>
    import("@/charts/barcode-chart/BarcodeChart").then((m) => m.BarcodeChart),
  ),
  "root-locus-plot": dynamic(() =>
    import("@/charts/root-locus-plot/RootLocusPlot").then((m) => m.RootLocusPlot),
  ),
  "periodogram": dynamic(() =>
    import("@/charts/periodogram/Periodogram").then((m) => m.Periodogram),
  ),
  "tissot-indicatrix": dynamic(() =>
    import("@/charts/tissot-indicatrix/TissotIndicatrix").then(
      (m) => m.TissotIndicatrix,
    ),
  ),
  "isochrone-map": dynamic(() =>
    import("@/charts/isochrone-map/IsochroneMap").then((m) => m.IsochroneMap),
  ),
  // Batch 12 Wave B
  "argument-map": dynamic(() =>
    import("@/charts/argument-map/ArgumentMap").then((m) => m.ArgumentMap),
  ),
  "rich-picture-diagram": dynamic(() =>
    import("@/charts/rich-picture-diagram/RichPictureDiagram").then(
      (m) => m.RichPictureDiagram,
    ),
  ),
  "bubble-map": dynamic(() =>
    import("@/charts/bubble-map/BubbleMap").then((m) => m.BubbleMap),
  ),
  "double-bubble-map": dynamic(() =>
    import("@/charts/double-bubble-map/DoubleBubbleMap").then(
      (m) => m.DoubleBubbleMap,
    ),
  ),
  "surface-plot": dynamic(() =>
    import("@/charts/surface-plot/SurfacePlot").then((m) => m.SurfacePlot),
  ),
  "logarithmic-plot": dynamic(() =>
    import("@/charts/logarithmic-plot/LogarithmicPlot").then(
      (m) => m.LogarithmicPlot,
    ),
  ),
  "pictorial-percentage-chart": dynamic(() =>
    import(
      "@/charts/pictorial-percentage-chart/PictorialPercentageChart"
    ).then((m) => m.PictorialPercentageChart),
  ),
  "unit-chart": dynamic(() =>
    import("@/charts/unit-chart/UnitChart").then((m) => m.UnitChart),
  ),
  "genogram": dynamic(() =>
    import("@/charts/genogram/Genogram").then((m) => m.Genogram),
  ),
  "phylogram": dynamic(() =>
    import("@/charts/phylogram/Phylogram").then((m) => m.Phylogram),
  ),
  // Batch 13 Wave A
  "spiral-plot": dynamic(() =>
    import("@/charts/spiral-plot/SpiralPlot").then((m) => m.SpiralPlot),
  ),
  "comet-plot": dynamic(() =>
    import("@/charts/comet-plot/CometPlot").then((m) => m.CometPlot),
  ),
  "shmoo-plot": dynamic(() =>
    import("@/charts/shmoo-plot/ShmooPlot").then((m) => m.ShmooPlot),
  ),
  "carpet-plot": dynamic(() =>
    import("@/charts/carpet-plot/CarpetPlot").then((m) => m.CarpetPlot),
  ),
  "strip-chart": dynamic(() =>
    import("@/charts/strip-chart/StripChart").then((m) => m.StripChart),
  ),
  "drain-plot": dynamic(() =>
    import("@/charts/drain-plot/DrainPlot").then((m) => m.DrainPlot),
  ),
  "isarithmic-map": dynamic(() =>
    import("@/charts/isarithmic-map/IsarithmicMap").then((m) => m.IsarithmicMap),
  ),
  "vertical-bar-graph": dynamic(() =>
    import("@/charts/vertical-bar-graph/VerticalBarGraph").then(
      (m) => m.VerticalBarGraph,
    ),
  ),
  "pie-of-pie-chart": dynamic(() =>
    import("@/charts/pie-of-pie-chart/PieOfPieChart").then((m) => m.PieOfPieChart),
  ),
  "doughnut-multi-level": dynamic(() =>
    import("@/charts/doughnut-multi-level/DoughnutMultiLevel").then(
      (m) => m.DoughnutMultiLevel,
    ),
  ),
  // Batch 13 Wave B
  "opposites-diagram": dynamic(() =>
    import("@/charts/opposites-diagram/OppositesDiagram").then(
      (m) => m.OppositesDiagram,
    ),
  ),
  "pournelle-chart": dynamic(() =>
    import("@/charts/pournelle-chart/PournelleChart").then((m) => m.PournelleChart),
  ),
  "scorecard": dynamic(() =>
    import("@/charts/scorecard/Scorecard").then((m) => m.ScorecardChart),
  ),
  "balanced-scorecard": dynamic(() =>
    import("@/charts/balanced-scorecard/BalancedScorecard").then(
      (m) => m.BalancedScorecardChart,
    ),
  ),
  "convex-treemap": dynamic(() =>
    import("@/charts/convex-treemap/ConvexTreemap").then((m) => m.ConvexTreemap),
  ),
  "prism-map": dynamic(() =>
    import("@/charts/prism-map/PrismMap").then((m) => m.PrismMap),
  ),
  "hive-plot": dynamic(() =>
    import("@/charts/hive-plot/HivePlot").then((m) => m.HivePlot),
  ),
  "arc-matrix": dynamic(() =>
    import("@/charts/arc-matrix/ArcMatrix").then((m) => m.ArcMatrix),
  ),
  "dependency-graph": dynamic(() =>
    import("@/charts/dependency-graph/DependencyGraph").then(
      (m) => m.DependencyGraph,
    ),
  ),
  "election-apportionment-diagram": dynamic(() =>
    import(
      "@/charts/election-apportionment-diagram/ElectionApportionmentDiagram"
    ).then((m) => m.ElectionApportionmentDiagram),
  ),
  // Batch 14 Wave A
  "table-chart": dynamic(() =>
    import("@/charts/table-chart/TableChart").then((m) => m.TableChart),
  ),
  "vowel-chart": dynamic(() =>
    import("@/charts/vowel-chart/VowelChart").then((m) => m.VowelChart),
  ),
  "dot-matrix-chart": dynamic(() =>
    import("@/charts/dot-matrix-chart/DotMatrixChart").then(
      (m) => m.DotMatrixChart,
    ),
  ),
  "isotype-chart": dynamic(() =>
    import("@/charts/isotype-chart/IsotypeChart").then((m) => m.IsotypeChart),
  ),
  "icon-array": dynamic(() =>
    import("@/charts/icon-array/IconArray").then((m) => m.IconArrayChart),
  ),
  "allele-chart": dynamic(() =>
    import("@/charts/allele-chart/AlleleChart").then((m) => m.AlleleChart),
  ),
  "nomogram": dynamic(() =>
    import("@/charts/nomogram/Nomogram").then((m) => m.NomogramChart),
  ),
  "quaternary-plot": dynamic(() =>
    import("@/charts/quaternary-plot/QuaternaryPlot").then(
      (m) => m.QuaternaryPlotChart,
    ),
  ),
  "ellingham-diagram": dynamic(() =>
    import("@/charts/ellingham-diagram/EllinghamDiagram").then(
      (m) => m.EllinghamDiagram,
    ),
  ),
  "greninger-chart": dynamic(() =>
    import("@/charts/greninger-chart/GreningerChart").then(
      (m) => m.GreningerChart,
    ),
  ),
  // Batch 14 Wave B — catalog completion
  "lexis-diagram": dynamic(() =>
    import("@/charts/lexis-diagram/LexisDiagram").then((m) => m.LexisDiagram),
  ),
  "dot-plot-bioinformatics": dynamic(() =>
    import("@/charts/dot-plot-bioinformatics/DotPlotBioinformatics").then(
      (m) => m.DotPlotBioinformatics,
    ),
  ),
  "affinity-diagram": dynamic(() =>
    import("@/charts/affinity-diagram/AffinityDiagram").then(
      (m) => m.AffinityDiagram,
    ),
  ),
  "matrix-diagram": dynamic(() =>
    import("@/charts/matrix-diagram/MatrixDiagram").then((m) => m.MatrixDiagram),
  ),
  "pdpc": dynamic(() =>
    import("@/charts/pdpc/Pdpc").then((m) => m.PdpcChart),
  ),
  "phase-space-plot": dynamic(() =>
    import("@/charts/phase-space-plot/PhaseSpacePlot").then(
      (m) => m.PhaseSpacePlotChart,
    ),
  ),
  "sociogram": dynamic(() =>
    import("@/charts/sociogram/Sociogram").then((m) => m.Sociogram),
  ),
  "natal-chart": dynamic(() =>
    import("@/charts/natal-chart/NatalChart").then((m) => m.NatalChart),
  ),
  "structure-chart": dynamic(() =>
    import("@/charts/structure-chart/StructureChart").then(
      (m) => m.StructureChart,
    ),
  ),
  "block-diagram": dynamic(() =>
    import("@/charts/block-diagram/BlockDiagram").then((m) => m.BlockDiagram),
  ),
  "isosurface-plot": dynamic(() =>
    import("@/charts/isosurface-plot/IsosurfacePlot").then(
      (m) => m.IsosurfacePlot,
    ),
  ),
};

export function getLiveChartComponent(id: string): ComponentType<LiveChartProps> | null {
  return REGISTRY[id] ?? null;
}
