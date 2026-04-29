import type { ChartEntry } from "@/content/chart-schema";
import { PlaceholderTile } from "@/charts/_placeholder/PlaceholderTile";
// v1 thumbnails
import { LineThumbnail } from "@/charts/line/LineChart.thumbnail";
import { AreaThumbnail } from "@/charts/area/AreaChart.thumbnail";
import { StackedBarThumbnail } from "@/charts/stacked-bar/StackedBarChart.thumbnail";
import { PieThumbnail } from "@/charts/pie/PieChart.thumbnail";
import { HexbinThumbnail } from "@/charts/hexbin/HexbinChart.thumbnail";
// Batch 1 Wave A thumbnails
import { BarThumbnail } from "@/charts/bar/BarChart.thumbnail";
import { HorizontalBarThumbnail } from "@/charts/horizontal-bar/HorizontalBarChart.thumbnail";
import { HistogramThumbnail } from "@/charts/histogram/HistogramChart.thumbnail";
import { DonutThumbnail } from "@/charts/donut/DonutChart.thumbnail";
import { ScatterThumbnail } from "@/charts/scatter/ScatterChart.thumbnail";
import { BubbleThumbnail } from "@/charts/bubble/BubbleChart.thumbnail";
import { BoxPlotThumbnail } from "@/charts/box-plot/BoxPlotChart.thumbnail";
import { ViolinThumbnail } from "@/charts/violin/ViolinChart.thumbnail";
import { HeatmapThumbnail } from "@/charts/heatmap/HeatmapChart.thumbnail";
import { RadarThumbnail } from "@/charts/radar/RadarChart.thumbnail";
// Batch 1 Wave B thumbnails
import { SparklineThumbnail } from "@/charts/sparkline/SparklineChart.thumbnail";
import { KpiTileThumbnail } from "@/charts/kpi-tile/KpiTileChart.thumbnail";
import { DensityThumbnail } from "@/charts/density/DensityChart.thumbnail";
import { GaugeThumbnail } from "@/charts/gauge/GaugeChart.thumbnail";
import { CandlestickThumbnail } from "@/charts/candlestick/CandlestickChart.thumbnail";
import { GanttThumbnail } from "@/charts/gantt/GanttChart.thumbnail";
import { FunnelThumbnail } from "@/charts/funnel/FunnelChart.thumbnail";
import { TreemapThumbnail } from "@/charts/treemap/TreemapChart.thumbnail";
import { SunburstThumbnail } from "@/charts/sunburst/SunburstChart.thumbnail";
import { SankeyThumbnail } from "@/charts/sankey/SankeyChart.thumbnail";
// Batch 2 Wave A thumbnails
import { WaterfallThumbnail } from "@/charts/waterfall/WaterfallChart.thumbnail";
import { ParetoThumbnail } from "@/charts/pareto/ParetoChart.thumbnail";
import { ChoroplethThumbnail } from "@/charts/choropleth/ChoroplethChart.thumbnail";
import { CartogramThumbnail } from "@/charts/cartogram/CartogramChart.thumbnail";
import { WordCloudThumbnail } from "@/charts/word-cloud/WordCloudChart.thumbnail";
import { PopulationPyramidThumbnail } from "@/charts/population-pyramid/PopulationPyramidChart.thumbnail";
import { PyramidThumbnail } from "@/charts/pyramid/PyramidChart.thumbnail";
import { LollipopThumbnail } from "@/charts/lollipop/LollipopChart.thumbnail";
import { KaplanMeierThumbnail } from "@/charts/kaplan-meier/KaplanMeierChart.thumbnail";
import { ForestPlotThumbnail } from "@/charts/forest-plot/ForestPlotChart.thumbnail";
// Batch 2 Wave B thumbnails
import { TreeThumbnail } from "@/charts/tree/TreeChart.thumbnail";
import { DendrogramThumbnail } from "@/charts/dendrogram/DendrogramChart.thumbnail";
import { NetworkThumbnail } from "@/charts/network/NetworkChart.thumbnail";
import { ChordThumbnail } from "@/charts/chord/ChordChart.thumbnail";
import { FlowchartThumbnail } from "@/charts/flowchart/FlowchartChart.thumbnail";
import { ControlChartThumbnail } from "@/charts/control-chart/ControlChart.thumbnail";
import { VennDiagramThumbnail } from "@/charts/venn-diagram/VennDiagramChart.thumbnail";
import { ParallelCoordinatesPlotThumbnail } from "@/charts/parallel-coordinates-plot/ParallelCoordinatesPlotChart.thumbnail";
import { RidgelineThumbnail } from "@/charts/ridgeline/RidgelineChart.thumbnail";
import { MosaicThumbnail } from "@/charts/mosaic/MosaicChart.thumbnail";
// Batch 3 Wave A thumbnails
import { GroupedColumnThumbnail } from "@/charts/grouped-column/GroupedColumnChart.thumbnail";
import { DivergingBarThumbnail } from "@/charts/diverging-bar/DivergingBarChart.thumbnail";
import { WaffleThumbnail } from "@/charts/waffle/WaffleChart.thumbnail";
import { SlopeThumbnail } from "@/charts/slope/SlopeChart.thumbnail";
import { DumbbellThumbnail } from "@/charts/dumbbell/DumbbellChart.thumbnail";
import { BulletThumbnail } from "@/charts/bullet/BulletChart.thumbnail";
import { RocThumbnail } from "@/charts/roc/RocChart.thumbnail";
import { PrecisionRecallThumbnail } from "@/charts/precision-recall/PrecisionRecallChart.thumbnail";
import { QqThumbnail } from "@/charts/qq/QqChart.thumbnail";
import { NormalProbabilityThumbnail } from "@/charts/normal-probability/NormalProbabilityChart.thumbnail";
// Batch 3 Wave B thumbnails
import { FanChartThumbnail } from "@/charts/fan-chart/FanChart.thumbnail";
import { StreamgraphThumbnail } from "@/charts/streamgraph/StreamgraphChart.thumbnail";
import { PughThumbnail } from "@/charts/pugh/PughMatrix.thumbnail";
import { IshikawaThumbnail } from "@/charts/ishikawa/IshikawaDiagram.thumbnail";
import { CirclePackingThumbnail } from "@/charts/circle-packing/CirclePackingChart.thumbnail";
import { IcicleThumbnail } from "@/charts/icicle/IcicleChart.thumbnail";
import { AlluvialThumbnail } from "@/charts/alluvial/AlluvialDiagram.thumbnail";
import { NolanThumbnail } from "@/charts/nolan/NolanChart.thumbnail";
import { SwotAnalysisThumbnail } from "@/charts/swot/SwotAnalysis.thumbnail";
import { PourbaixDiagramThumbnail } from "@/charts/pourbaix/PourbaixDiagram.thumbnail";
// Batch 4 Wave A thumbnails
import { JitterThumbnail } from "@/charts/jitter/JitterChart.thumbnail";
import { StripThumbnail } from "@/charts/strip/StripChart.thumbnail";
import { BeeswarmThumbnail } from "@/charts/beeswarm/BeeswarmChart.thumbnail";
import { SinaThumbnail } from "@/charts/sina/SinaChart.thumbnail";
import { StemplotThumbnail } from "@/charts/stemplot/StemplotChart.thumbnail";
import { RadialHistogramThumbnail } from "@/charts/radial-histogram/RadialHistogramChart.thumbnail";
import { ErrorBarsThumbnail } from "@/charts/error-bars/ErrorBarsChart.thumbnail";
import { ConfusionMatrixThumbnail } from "@/charts/confusion-matrix/ConfusionMatrixChart.thumbnail";
import { FeatureImportanceThumbnail } from "@/charts/feature-importance/FeatureImportanceChart.thumbnail";
import { ScreeThumbnail } from "@/charts/scree/ScreeChart.thumbnail";
// Batch 4 Wave B thumbnails
import { SmallMultiplesThumbnail } from "@/charts/small-multiples/SmallMultiplesChart.thumbnail";
import { SpaghettiThumbnail } from "@/charts/spaghetti/SpaghettiChart.thumbnail";
import { HorizonThumbnail } from "@/charts/horizon/HorizonChart.thumbnail";
import { CalendarThumbnail } from "@/charts/calendar/CalendarChart.thumbnail";
import { CorrelationMatrixThumbnail } from "@/charts/correlation-matrix/CorrelationMatrixChart.thumbnail";
import { ScatterPlotMatrixThumbnail } from "@/charts/scatter-plot-matrix/ScatterPlotMatrixChart.thumbnail";
import { ContourThumbnail } from "@/charts/contour/ContourChart.thumbnail";
import { RoseDiagramThumbnail } from "@/charts/rose-diagram/RoseDiagramChart.thumbnail";
import { VolcanoThumbnail } from "@/charts/volcano/VolcanoChart.thumbnail";
import { RunChartThumbnail } from "@/charts/run-chart/RunChart.thumbnail";
// Batch 5 Wave A thumbnails
import { NightingaleThumbnail } from "@/charts/nightingale/NightingaleChart.thumbnail";
import { PolarAreaThumbnail } from "@/charts/polar-area/PolarAreaChart.thumbnail";
import { RadialBarThumbnail } from "@/charts/radial-bar/RadialBarChart.thumbnail";
import { StarPlotThumbnail } from "@/charts/star-plot/StarPlotChart.thumbnail";
import { MovingAverageThumbnail } from "@/charts/moving-average/MovingAverageChart.thumbnail";
import { BumpThumbnail } from "@/charts/bump-chart/BumpChart.thumbnail";
import { LorenzThumbnail } from "@/charts/lorenz/LorenzChart.thumbnail";
import { EulerDiagramThumbnail } from "@/charts/euler/EulerDiagramChart.thumbnail";
import { DotPlotThumbnail } from "@/charts/dot-plot/DotPlotChart.thumbnail";
import { RugPlotThumbnail } from "@/charts/rug/RugPlotChart.thumbnail";
// Batch 5 Wave B thumbnails
import { VoronoiThumbnail } from "@/charts/voronoi/VoronoiChart.thumbnail";
import { ArcDiagramThumbnail } from "@/charts/arc-diagram/ArcDiagramChart.thumbnail";
import { AdjacencyMatrixThumbnail } from "@/charts/adjacency-matrix/AdjacencyMatrixChart.thumbnail";
import { TaylorDiagramThumbnail } from "@/charts/taylor/TaylorDiagramChart.thumbnail";
import { OhlcThumbnail } from "@/charts/ohlc/OhlcChart.thumbnail";
import { CyclePlotThumbnail } from "@/charts/cycle-plot/CyclePlotChart.thumbnail";
import { DecisionTreeThumbnail } from "@/charts/decision-tree/DecisionTreeDiagram.thumbnail";
import { OrganizationalThumbnail } from "@/charts/org-chart/OrganizationalChart.thumbnail";
import { TimelineThumbnail } from "@/charts/timeline/TimelineChart.thumbnail";
import { TernaryThumbnail } from "@/charts/ternary/TernaryChart.thumbnail";
// Batch 6 Wave A thumbnails
import { BlandAltmanThumbnail } from "@/charts/bland-altman/BlandAltmanChart.thumbnail";
import { FunnelPlotMetaThumbnail } from "@/charts/funnel-plot-meta/FunnelPlotMetaChart.thumbnail";
import { QuadrantThumbnail } from "@/charts/quadrant/QuadrantChart.thumbnail";
import { StakeholderGridThumbnail } from "@/charts/stakeholder-grid/StakeholderGridChart.thumbnail";
import { DeviationThumbnail } from "@/charts/deviation/DeviationChart.thumbnail";
import { LikertThumbnail } from "@/charts/likert/LikertChart.thumbnail";
import { BurnDownThumbnail } from "@/charts/burn-down/BurnDownChart.thumbnail";
import { BurnUpThumbnail } from "@/charts/burn-up/BurnUpChart.thumbnail";
import { PictogramThumbnail } from "@/charts/pictogram/PictogramChart.thumbnail";
import { TallyThumbnail } from "@/charts/tally/TallyChart.thumbnail";
// Batch 6 Wave B thumbnails
import { TileMapThumbnail } from "@/charts/tile-map/TileMapChart.thumbnail";
import { HexbinMapThumbnail } from "@/charts/hexbin-map/HexbinMapChart.thumbnail";
import { FlowMapThumbnail } from "@/charts/flow-map/FlowMapChart.thumbnail";
import { BivariateChoroplethThumbnail } from "@/charts/bivariate-choropleth/BivariateChoroplethChart.thumbnail";
import { ParallelSetsThumbnail } from "@/charts/parallel-sets/ParallelSetsChart.thumbnail";
import { SwimlaneThumbnail } from "@/charts/swimlane/SwimlaneChart.thumbnail";
import { MindMapThumbnail } from "@/charts/mind-map/MindMapChart.thumbnail";
import { CumulativeFlowThumbnail } from "@/charts/cumulative-flow/CumulativeFlowChart.thumbnail";
import { PhaseDiagramThumbnail } from "@/charts/phase-diagram/PhaseDiagram.thumbnail";
import { SmithChartThumbnail } from "@/charts/smith-chart/SmithChart.thumbnail";
// Batch 7 Wave A thumbnails
import { GapThumbnail } from "@/charts/gap/GapChart.thumbnail";
import { ResidualThumbnail } from "@/charts/residual/ResidualPlot.thumbnail";
import { CdfThumbnail } from "@/charts/cdf/CdfPlot.thumbnail";
import { EcdfThumbnail } from "@/charts/ecdf/EcdfPlot.thumbnail";
import { LiftThumbnail } from "@/charts/lift/LiftChart.thumbnail";
import { CumulativeGainsThumbnail } from "@/charts/cumulative-gains/CumulativeGainsChart.thumbnail";
import { PunnettSquareThumbnail } from "@/charts/punnett/PunnettSquareChart.thumbnail";
import { JablonskiThumbnail } from "@/charts/jablonski/JablonskiDiagram.thumbnail";
import { NicholsPlotThumbnail } from "@/charts/nichols/NicholsPlot.thumbnail";
import { NyquistPlotThumbnail } from "@/charts/nyquist/NyquistPlot.thumbnail";
// Batch 7 Wave B thumbnails
import { UmlClassThumbnail } from "@/charts/uml-class/UmlClassDiagram.thumbnail";
import { EntityRelationshipThumbnail } from "@/charts/erd/EntityRelationshipDiagram.thumbnail";
import { UmlSequenceThumbnail } from "@/charts/uml-sequence/UmlSequenceDiagram.thumbnail";
import { FiniteStateMachineThumbnail } from "@/charts/fsm/FiniteStateMachine.thumbnail";
import { KanbanThumbnail } from "@/charts/kanban/KanbanBoard.thumbnail";
import { PertThumbnail } from "@/charts/pert/PertChart.thumbnail";
import { ClimateStripesThumbnail } from "@/charts/climate-stripes/ClimateStripes.thumbnail";
import { MagicQuadrantThumbnail } from "@/charts/magic-quadrant/MagicQuadrant.thumbnail";
import { ManhattanThumbnail } from "@/charts/manhattan/ManhattanPlot.thumbnail";
import { HertzsprungRussellThumbnail } from "@/charts/hr-diagram/HertzsprungRussellDiagram.thumbnail";
// Batch 8 Wave A thumbnails
import { BodeThumbnail } from "@/charts/bode-plot/BodePlot.thumbnail";
import { PoleZeroThumbnail } from "@/charts/pole-zero-plot/PoleZeroPlot.thumbnail";
import { AutocorrelationThumbnail } from "@/charts/autocorrelation-plot/AutocorrelationPlot.thumbnail";
import { PartialAutocorrelationThumbnail } from "@/charts/partial-autocorrelation-plot/PartialAutocorrelationPlot.thumbnail";
import { PartialDependencePlotThumbnail } from "@/charts/partial-dependence-plot/PartialDependencePlot.thumbnail";
import { ShapSummaryPlotThumbnail } from "@/charts/shap-summary-plot/ShapSummaryPlot.thumbnail";
import { CalibrationPlotThumbnail } from "@/charts/calibration-plot/CalibrationPlot.thumbnail";
import { PpPlotThumbnail } from "@/charts/pp-plot/PpPlot.thumbnail";
import { ArgandThumbnail } from "@/charts/argand-diagram/ArgandDiagram.thumbnail";
import { FeynmanThumbnail } from "@/charts/feynman-diagram/FeynmanDiagram.thumbnail";
// Batch 8 Wave B thumbnails
import { UmlActivityDiagramThumbnail } from "@/charts/uml-activity-diagram/UmlActivityDiagram.thumbnail";
import { UmlStateDiagramThumbnail } from "@/charts/uml-state-diagram/UmlStateDiagram.thumbnail";
import { DataFlowDiagramThumbnail } from "@/charts/data-flow-diagram/DataFlowDiagram.thumbnail";
import { ControlFlowGraphThumbnail } from "@/charts/control-flow-graph/ControlFlowGraph.thumbnail";
import { BpmnDiagramThumbnail } from "@/charts/bpmn-diagram/BpmnDiagram.thumbnail";
import { ValueStreamMapThumbnail } from "@/charts/value-stream-map/ValueStreamMap.thumbnail";
import { PhylogeneticTreeThumbnail } from "@/charts/phylogenetic-tree/PhylogeneticTree.thumbnail";
import { CladogramThumbnail } from "@/charts/cladogram/Cladogram.thumbnail";
import { RaciThumbnail } from "@/charts/raci-matrix/RaciMatrix.thumbnail";
import { SipocThumbnail } from "@/charts/sipoc-diagram/SipocDiagram.thumbnail";
// Batch 9 Wave A thumbnails
import { CooksDistanceThumbnail } from "@/charts/cooks-distance-plot/CooksDistancePlot.thumbnail";
import { LeverageThumbnail } from "@/charts/leverage-plot/LeveragePlot.thumbnail";
import { BagplotThumbnail } from "@/charts/bagplot/Bagplot.thumbnail";
import { BiplotThumbnail } from "@/charts/biplot/Biplot.thumbnail";
import { KagiThumbnail } from "@/charts/kagi-chart/KagiChart.thumbnail";
import { RenkoThumbnail } from "@/charts/renko-chart/RenkoChart.thumbnail";
import { PointAndFigureThumbnail } from "@/charts/point-and-figure-chart/PointAndFigureChart.thumbnail";
import { HeikinAshiThumbnail } from "@/charts/heikin-ashi-chart/HeikinAshiChart.thumbnail";
import { TitrationCurveThumbnail } from "@/charts/titration-curve/TitrationCurve.thumbnail";
import { ArrheniusPlotThumbnail } from "@/charts/arrhenius-plot/ArrheniusPlot.thumbnail";
// Batch 9 Wave B thumbnails
import { UmlUseCaseDiagramThumbnail } from "@/charts/uml-use-case-diagram/UmlUseCaseDiagram.thumbnail";
import { UmlComponentDiagramThumbnail } from "@/charts/uml-component-diagram/UmlComponentDiagram.thumbnail";
import { UmlDeploymentDiagramThumbnail } from "@/charts/uml-deployment-diagram/UmlDeploymentDiagram.thumbnail";
import { UmlObjectDiagramThumbnail } from "@/charts/uml-object-diagram/UmlObjectDiagram.thumbnail";
import { CircosPlotThumbnail } from "@/charts/circos-plot/CircosPlot.thumbnail";
import { TreeOfLifeRadialPhylogenyThumbnail } from "@/charts/tree-of-life-radial-phylogeny/TreeOfLifeRadialPhylogeny.thumbnail";
import { PedigreeThumbnail } from "@/charts/pedigree-chart/PedigreeChart.thumbnail";
import { KaryotypeThumbnail } from "@/charts/karyotype/Karyotype.thumbnail";
import { SequenceLogoThumbnail } from "@/charts/sequence-logo/SequenceLogo.thumbnail";
import { IdeogramThumbnail } from "@/charts/ideogram/Ideogram.thumbnail";
// Batch 10 Wave A thumbnails
import { IchimokuKinkoHyoThumbnail } from "@/charts/ichimoku-kinko-hyo/IchimokuKinkoHyo.thumbnail";
import { ThreeLineBreakThumbnail } from "@/charts/three-line-break-chart/ThreeLineBreakChart.thumbnail";
import { EyeDiagramThumbnail } from "@/charts/eye-diagram/EyeDiagram.thumbnail";
import { ConstellationDiagramThumbnail } from "@/charts/constellation-diagram/ConstellationDiagram.thumbnail";
import { LineweaverBurkThumbnail } from "@/charts/lineweaver-burk-plot/LineweaverBurkPlot.thumbnail";
import { LewisStructureThumbnail } from "@/charts/lewis-structure/LewisStructure.thumbnail";
import { PhasePortraitThumbnail } from "@/charts/phase-portrait/PhasePortrait.thumbnail";
import { PoincareMapThumbnail } from "@/charts/poincare-map/PoincareMap.thumbnail";
import { HubbleDiagramThumbnail } from "@/charts/hubble-diagram/HubbleDiagram.thumbnail";
import { DalitzPlotThumbnail } from "@/charts/dalitz-plot/DalitzPlot.thumbnail";
// Batch 10 Wave B thumbnails
import { ArchitectureDiagramThumbnail } from "@/charts/architecture-diagram/ArchitectureDiagram.thumbnail";
import { FlameGraphThumbnail } from "@/charts/flame-graph/FlameGraph.thumbnail";
import { CircuitDiagramThumbnail } from "@/charts/circuit-diagram/CircuitDiagram.thumbnail";
import { LadderDiagramThumbnail } from "@/charts/ladder-diagram/LadderDiagram.thumbnail";
import { SpectrogramThumbnail } from "@/charts/spectrogram/Spectrogram.thumbnail";
import { WaterfallPlotSignalThumbnail } from "@/charts/waterfall-plot-signal/WaterfallPlotSignal.thumbnail";
import { InfluenceDiagramThumbnail } from "@/charts/influence-diagram/InfluenceDiagram.thumbnail";
import { CausalLoopDiagramThumbnail } from "@/charts/causal-loop-diagram/CausalLoopDiagram.thumbnail";
import { GeographicalHeatmapThumbnail } from "@/charts/geographical-heatmap/GeographicalHeatmap.thumbnail";
import { TopographicMapThumbnail } from "@/charts/topographic-map/TopographicMap.thumbnail";
// Batch 11 Wave A thumbnails
import { BifurcationDiagramThumbnail } from "@/charts/bifurcation-diagram/BifurcationDiagram.thumbnail";
import { RecurrencePlotThumbnail } from "@/charts/recurrence-plot/RecurrencePlot.thumbnail";
import { PiperThumbnail } from "@/charts/piper-diagram/PiperDiagram.thumbnail";
import { StiffThumbnail } from "@/charts/stiff-diagram/StiffDiagram.thumbnail";
import { StereonetThumbnail } from "@/charts/stereonet/Stereonet.thumbnail";
import { GalbraithPlotThumbnail } from "@/charts/galbraith-plot/GalbraithPlot.thumbnail";
import { EquivolumeThumbnail } from "@/charts/equivolume-chart/EquivolumeChart.thumbnail";
import { MarketProfileThumbnail } from "@/charts/market-profile-chart/MarketProfileChart.thumbnail";
import { TernaryContourPlotThumbnail } from "@/charts/ternary-contour-plot/TernaryContourPlot.thumbnail";
import { PotentialEnergyDiagramThumbnail } from "@/charts/potential-energy-diagram/PotentialEnergyDiagram.thumbnail";
// Batch 11 Wave B thumbnails
import { VectorFieldThumbnail } from "@/charts/vector-field/VectorField.thumbnail";
import { StreamlineThumbnail } from "@/charts/streamline-plot/StreamlinePlot.thumbnail";
import { PipingInstrumentationDiagramThumbnail } from "@/charts/piping-instrumentation-diagram/PipingInstrumentationDiagram.thumbnail";
import { ExplodedViewDrawingThumbnail } from "@/charts/exploded-view-drawing/ExplodedViewDrawing.thumbnail";
import { StockAndFlowDiagramThumbnail } from "@/charts/stock-and-flow-diagram/StockAndFlowDiagram.thumbnail";
import { ConceptMapThumbnail } from "@/charts/concept-map/ConceptMap.thumbnail";
import { RadialTreeThumbnail } from "@/charts/radial-tree/RadialTree.thumbnail";
import { PackedCircleChartThumbnail } from "@/charts/packed-circle-chart/PackedCircleChart.thumbnail";
import { DotDensityMapThumbnail } from "@/charts/dot-density-map/DotDensityMap.thumbnail";
import { ProportionalSymbolMapThumbnail } from "@/charts/proportional-symbol-map/ProportionalSymbolMap.thumbnail";
// Batch 12 Wave A thumbnails
import { ChernoffFacesThumbnail } from "@/charts/chernoff-faces/ChernoffFaces.thumbnail";
import { AndrewsPlotThumbnail } from "@/charts/andrews-plot/AndrewsPlot.thumbnail";
import { StarGlyphPlotThumbnail } from "@/charts/star-glyph-plot/StarGlyphPlot.thumbnail";
import { HammockPlotThumbnail } from "@/charts/hammock-plot/HammockPlot.thumbnail";
import { DoubledeckerThumbnail } from "@/charts/doubledecker-plot/DoubledeckerPlot.thumbnail";
import { BarcodeThumbnail } from "@/charts/barcode-chart/BarcodeChart.thumbnail";
import { RootLocusThumbnail } from "@/charts/root-locus-plot/RootLocusPlot.thumbnail";
import { PeriodogramThumbnail } from "@/charts/periodogram/Periodogram.thumbnail";
import { TissotIndicatrixThumbnail } from "@/charts/tissot-indicatrix/TissotIndicatrix.thumbnail";
import { IsochroneMapThumbnail } from "@/charts/isochrone-map/IsochroneMap.thumbnail";
// Batch 12 Wave B thumbnails
import { ArgumentMapThumbnail } from "@/charts/argument-map/ArgumentMap.thumbnail";
import { RichPictureDiagramThumbnail } from "@/charts/rich-picture-diagram/RichPictureDiagram.thumbnail";
import { BubbleMapThumbnail } from "@/charts/bubble-map/BubbleMap.thumbnail";
import { DoubleBubbleMapThumbnail } from "@/charts/double-bubble-map/DoubleBubbleMap.thumbnail";
import { SurfacePlotThumbnail } from "@/charts/surface-plot/SurfacePlot.thumbnail";
import { LogarithmicPlotThumbnail } from "@/charts/logarithmic-plot/LogarithmicPlot.thumbnail";
import { PictorialPercentageThumbnail } from "@/charts/pictorial-percentage-chart/PictorialPercentageChart.thumbnail";
import { UnitThumbnail } from "@/charts/unit-chart/UnitChart.thumbnail";
import { GenogramThumbnail } from "@/charts/genogram/Genogram.thumbnail";
import { PhylogramThumbnail } from "@/charts/phylogram/Phylogram.thumbnail";
// Batch 13 Wave A thumbnails
import { SpiralPlotThumbnail } from "@/charts/spiral-plot/SpiralPlot.thumbnail";
import { CometPlotThumbnail } from "@/charts/comet-plot/CometPlot.thumbnail";
import { ShmooPlotThumbnail } from "@/charts/shmoo-plot/ShmooPlot.thumbnail";
import { CarpetPlotThumbnail } from "@/charts/carpet-plot/CarpetPlot.thumbnail";
import { StripChartThumbnail } from "@/charts/strip-chart/StripChart.thumbnail";
import { DrainPlotThumbnail } from "@/charts/drain-plot/DrainPlot.thumbnail";
import { IsarithmicMapThumbnail } from "@/charts/isarithmic-map/IsarithmicMap.thumbnail";
import { VerticalBarGraphThumbnail } from "@/charts/vertical-bar-graph/VerticalBarGraph.thumbnail";
import { PieOfPieThumbnail } from "@/charts/pie-of-pie-chart/PieOfPieChart.thumbnail";
import { DoughnutMultiLevelThumbnail } from "@/charts/doughnut-multi-level/DoughnutMultiLevel.thumbnail";
// Batch 13 Wave B thumbnails
import { OppositesDiagramThumbnail } from "@/charts/opposites-diagram/OppositesDiagram.thumbnail";
import { PournelleChartThumbnail } from "@/charts/pournelle-chart/PournelleChart.thumbnail";
import { ScorecardThumbnail } from "@/charts/scorecard/Scorecard.thumbnail";
import { BalancedScorecardThumbnail } from "@/charts/balanced-scorecard/BalancedScorecard.thumbnail";
import { ConvexTreemapThumbnail } from "@/charts/convex-treemap/ConvexTreemap.thumbnail";
import { PrismMapThumbnail } from "@/charts/prism-map/PrismMap.thumbnail";
import { HivePlotThumbnail } from "@/charts/hive-plot/HivePlot.thumbnail";
import { ArcMatrixThumbnail } from "@/charts/arc-matrix/ArcMatrix.thumbnail";
import { DependencyGraphThumbnail } from "@/charts/dependency-graph/DependencyGraph.thumbnail";
import { ElectionApportionmentDiagramThumbnail } from "@/charts/election-apportionment-diagram/ElectionApportionmentDiagram.thumbnail";
// Batch 14 Wave A thumbnails
import { TableThumbnail } from "@/charts/table-chart/TableChart.thumbnail";
import { VowelThumbnail } from "@/charts/vowel-chart/VowelChart.thumbnail";
import { DotMatrixThumbnail } from "@/charts/dot-matrix-chart/DotMatrixChart.thumbnail";
import { IsotypeThumbnail } from "@/charts/isotype-chart/IsotypeChart.thumbnail";
import { IconArrayThumbnail } from "@/charts/icon-array/IconArray.thumbnail";
import { AlleleChartThumbnail } from "@/charts/allele-chart/AlleleChart.thumbnail";
import { NomogramThumbnail } from "@/charts/nomogram/Nomogram.thumbnail";
import { QuaternaryPlotThumbnail } from "@/charts/quaternary-plot/QuaternaryPlot.thumbnail";
import { EllinghamDiagramThumbnail } from "@/charts/ellingham-diagram/EllinghamDiagram.thumbnail";
import { GreningerChartThumbnail } from "@/charts/greninger-chart/GreningerChart.thumbnail";
// Batch 14 Wave B thumbnails — catalog completion
import { LexisDiagramThumbnail } from "@/charts/lexis-diagram/LexisDiagram.thumbnail";
import { DotPlotBioinformaticsThumbnail } from "@/charts/dot-plot-bioinformatics/DotPlotBioinformatics.thumbnail";
import { AffinityDiagramThumbnail } from "@/charts/affinity-diagram/AffinityDiagram.thumbnail";
import { MatrixDiagramThumbnail } from "@/charts/matrix-diagram/MatrixDiagram.thumbnail";
import { PdpcThumbnail } from "@/charts/pdpc/Pdpc.thumbnail";
import { PhaseSpacePlotThumbnail } from "@/charts/phase-space-plot/PhaseSpacePlot.thumbnail";
import { SociogramThumbnail } from "@/charts/sociogram/Sociogram.thumbnail";
import { NatalChartThumbnail } from "@/charts/natal-chart/NatalChart.thumbnail";
import { StructureChartThumbnail } from "@/charts/structure-chart/StructureChart.thumbnail";
import { BlockDiagramThumbnail } from "@/charts/block-diagram/BlockDiagram.thumbnail";
import { IsosurfacePlotThumbnail } from "@/charts/isosurface-plot/IsosurfacePlot.thumbnail";

const LIVE_THUMBS: Record<string, () => React.ReactElement> = {
  // v1
  "line-chart": LineThumbnail,
  "area-chart": AreaThumbnail,
  "stacked-bar-chart": StackedBarThumbnail,
  "pie-chart": PieThumbnail,
  "hexagonal-binning-chart": HexbinThumbnail,
  // Batch 1 Wave A
  "bar-chart": BarThumbnail,
  "horizontal-bar-graph": HorizontalBarThumbnail,
  "histogram": HistogramThumbnail,
  "donut-chart": DonutThumbnail,
  "scatter-plot": ScatterThumbnail,
  "bubble-chart": BubbleThumbnail,
  "box-plot": BoxPlotThumbnail,
  "violin-plot": ViolinThumbnail,
  "heatmap": HeatmapThumbnail,
  "radar-chart": RadarThumbnail,
  // Batch 1 Wave B
  "sparkline": SparklineThumbnail,
  "kpi-tile": KpiTileThumbnail,
  "density-plot": DensityThumbnail,
  "gauge-chart": GaugeThumbnail,
  "candlestick-chart": CandlestickThumbnail,
  "gantt-chart": GanttThumbnail,
  "funnel-chart": FunnelThumbnail,
  "treemap": TreemapThumbnail,
  "sunburst-chart": SunburstThumbnail,
  "sankey-diagram": SankeyThumbnail,
  // Batch 2 Wave A
  "waterfall-chart": WaterfallThumbnail,
  "pareto-chart": ParetoThumbnail,
  "choropleth": ChoroplethThumbnail,
  "cartogram": CartogramThumbnail,
  "word-cloud": WordCloudThumbnail,
  "population-pyramid": PopulationPyramidThumbnail,
  "pyramid-chart": PyramidThumbnail,
  "lollipop-plot": LollipopThumbnail,
  "kaplan-meier-curve": KaplanMeierThumbnail,
  "forest-plot": ForestPlotThumbnail,
  // Batch 2 Wave B
  "tree-chart": TreeThumbnail,
  "dendrogram": DendrogramThumbnail,
  "network-diagram": NetworkThumbnail,
  "chord-diagram": ChordThumbnail,
  "flowchart": FlowchartThumbnail,
  "control-chart": ControlChartThumbnail,
  "venn-diagram": VennDiagramThumbnail,
  "parallel-coordinates-plot": ParallelCoordinatesPlotThumbnail,
  "ridgeline-plot": RidgelineThumbnail,
  "mosaic-plot": MosaicThumbnail,
  // Batch 3 Wave A
  "grouped-column-chart": GroupedColumnThumbnail,
  "diverging-bar-chart": DivergingBarThumbnail,
  "waffle-chart": WaffleThumbnail,
  "slope-chart": SlopeThumbnail,
  "dumbbell-chart": DumbbellThumbnail,
  "bullet-chart": BulletThumbnail,
  "roc-curve": RocThumbnail,
  "precision-recall-curve": PrecisionRecallThumbnail,
  "qq-plot": QqThumbnail,
  "normal-probability-plot": NormalProbabilityThumbnail,
  // Batch 3 Wave B
  "fan-chart-forecast": FanChartThumbnail,
  "streamgraph": StreamgraphThumbnail,
  "pugh-matrix": PughThumbnail,
  "ishikawa-diagram": IshikawaThumbnail,
  "circle-packing": CirclePackingThumbnail,
  "icicle-chart": IcicleThumbnail,
  "alluvial-diagram": AlluvialThumbnail,
  "nolan-chart": NolanThumbnail,
  "swot-analysis": SwotAnalysisThumbnail,
  "pourbaix-diagram": PourbaixDiagramThumbnail,
  // Batch 4 Wave A
  "jitter-plot": JitterThumbnail,
  "strip-plot": StripThumbnail,
  "beeswarm-chart": BeeswarmThumbnail,
  "sina-plot": SinaThumbnail,
  "stemplot": StemplotThumbnail,
  "radial-histogram": RadialHistogramThumbnail,
  "error-bars": ErrorBarsThumbnail,
  "confusion-matrix": ConfusionMatrixThumbnail,
  "feature-importance-plot": FeatureImportanceThumbnail,
  "scree-plot": ScreeThumbnail,
  // Batch 4 Wave B
  "small-multiples": SmallMultiplesThumbnail,
  "spaghetti-plot": SpaghettiThumbnail,
  "horizon-chart": HorizonThumbnail,
  "calendar": CalendarThumbnail,
  "correlation-matrix": CorrelationMatrixThumbnail,
  "scatter-plot-matrix": ScatterPlotMatrixThumbnail,
  "contour-plot": ContourThumbnail,
  "rose-diagram": RoseDiagramThumbnail,
  "volcano-plot": VolcanoThumbnail,
  "run-chart": RunChartThumbnail,
  // Batch 5 Wave A
  "nightingale-chart": NightingaleThumbnail,
  "polar-area-diagram": PolarAreaThumbnail,
  "radial-bar-chart": RadialBarThumbnail,
  "star-plot": StarPlotThumbnail,
  "moving-average": MovingAverageThumbnail,
  "bump-chart": BumpThumbnail,
  "lorenz-curve": LorenzThumbnail,
  "euler-diagram": EulerDiagramThumbnail,
  "dot-plot-statistics": DotPlotThumbnail,
  "rug-plot": RugPlotThumbnail,
  // Batch 5 Wave B
  "voronoi-diagram": VoronoiThumbnail,
  "arc-diagram": ArcDiagramThumbnail,
  "adjacency-matrix-plot": AdjacencyMatrixThumbnail,
  "taylor-diagram": TaylorDiagramThumbnail,
  "ohlc-chart": OhlcThumbnail,
  "cycle-plot": CyclePlotThumbnail,
  "decision-tree-diagram": DecisionTreeThumbnail,
  "organizational-chart": OrganizationalThumbnail,
  "timeline-chart": TimelineThumbnail,
  "ternary-plot": TernaryThumbnail,
  // Batch 6 Wave A
  "bland-altman-plot": BlandAltmanThumbnail,
  "funnel-plot-meta": FunnelPlotMetaThumbnail,
  "quadrant-chart": QuadrantThumbnail,
  "stakeholder-power-interest-grid": StakeholderGridThumbnail,
  "deviation-chart": DeviationThumbnail,
  "likert-scale-chart": LikertThumbnail,
  "burn-down-chart": BurnDownThumbnail,
  "burn-up-chart": BurnUpThumbnail,
  "pictogram": PictogramThumbnail,
  "tally-chart": TallyThumbnail,
  // Batch 6 Wave B
  "tile-map": TileMapThumbnail,
  "hexbin-map": HexbinMapThumbnail,
  "flow-map": FlowMapThumbnail,
  "bivariate-choropleth": BivariateChoroplethThumbnail,
  "parallel-sets": ParallelSetsThumbnail,
  "swimlane-diagram": SwimlaneThumbnail,
  "mind-map": MindMapThumbnail,
  "cumulative-flow-diagram": CumulativeFlowThumbnail,
  "phase-diagram": PhaseDiagramThumbnail,
  "smith-chart": SmithChartThumbnail,
  // Batch 7 Wave A
  "gap-chart": GapThumbnail,
  "residual-plot": ResidualThumbnail,
  "cdf-plot": CdfThumbnail,
  "ecdf-plot": EcdfThumbnail,
  "lift-chart": LiftThumbnail,
  "cumulative-gains-chart": CumulativeGainsThumbnail,
  "punnett-square": PunnettSquareThumbnail,
  "jablonski-diagram": JablonskiThumbnail,
  "nichols-plot": NicholsPlotThumbnail,
  "nyquist-plot": NyquistPlotThumbnail,
  // Batch 7 Wave B
  "uml-class-diagram": UmlClassThumbnail,
  "entity-relationship-diagram": EntityRelationshipThumbnail,
  "uml-sequence-diagram": UmlSequenceThumbnail,
  "finite-state-machine": FiniteStateMachineThumbnail,
  "kanban-board": KanbanThumbnail,
  "pert-chart": PertThumbnail,
  "climate-stripes": ClimateStripesThumbnail,
  "magic-quadrant": MagicQuadrantThumbnail,
  "manhattan-plot": ManhattanThumbnail,
  "hertzsprung-russell-diagram": HertzsprungRussellThumbnail,
  // Batch 8 Wave A
  "bode-plot": BodeThumbnail,
  "pole-zero-plot": PoleZeroThumbnail,
  "autocorrelation-plot": AutocorrelationThumbnail,
  "partial-autocorrelation-plot": PartialAutocorrelationThumbnail,
  "partial-dependence-plot": PartialDependencePlotThumbnail,
  "shap-summary-plot": ShapSummaryPlotThumbnail,
  "calibration-plot": CalibrationPlotThumbnail,
  "pp-plot": PpPlotThumbnail,
  "argand-diagram": ArgandThumbnail,
  "feynman-diagram": FeynmanThumbnail,
  // Batch 8 Wave B
  "uml-activity-diagram": UmlActivityDiagramThumbnail,
  "uml-state-diagram": UmlStateDiagramThumbnail,
  "data-flow-diagram": DataFlowDiagramThumbnail,
  "control-flow-graph": ControlFlowGraphThumbnail,
  "bpmn-diagram": BpmnDiagramThumbnail,
  "value-stream-map": ValueStreamMapThumbnail,
  "phylogenetic-tree": PhylogeneticTreeThumbnail,
  "cladogram": CladogramThumbnail,
  "raci-matrix": RaciThumbnail,
  "sipoc-diagram": SipocThumbnail,
  // Batch 9 Wave A
  "cooks-distance-plot": CooksDistanceThumbnail,
  "leverage-plot": LeverageThumbnail,
  "bagplot": BagplotThumbnail,
  "biplot": BiplotThumbnail,
  "kagi-chart": KagiThumbnail,
  "renko-chart": RenkoThumbnail,
  "point-and-figure-chart": PointAndFigureThumbnail,
  "heikin-ashi-chart": HeikinAshiThumbnail,
  "titration-curve": TitrationCurveThumbnail,
  "arrhenius-plot": ArrheniusPlotThumbnail,
  // Batch 9 Wave B
  "uml-use-case-diagram": UmlUseCaseDiagramThumbnail,
  "uml-component-diagram": UmlComponentDiagramThumbnail,
  "uml-deployment-diagram": UmlDeploymentDiagramThumbnail,
  "uml-object-diagram": UmlObjectDiagramThumbnail,
  "circos-plot": CircosPlotThumbnail,
  "tree-of-life-radial-phylogeny": TreeOfLifeRadialPhylogenyThumbnail,
  "pedigree-chart": PedigreeThumbnail,
  "karyotype": KaryotypeThumbnail,
  "sequence-logo": SequenceLogoThumbnail,
  "ideogram": IdeogramThumbnail,
  // Batch 10 Wave A
  "ichimoku-kinko-hyo": IchimokuKinkoHyoThumbnail,
  "three-line-break-chart": ThreeLineBreakThumbnail,
  "eye-diagram": EyeDiagramThumbnail,
  "constellation-diagram": ConstellationDiagramThumbnail,
  "lineweaver-burk-plot": LineweaverBurkThumbnail,
  "lewis-structure": LewisStructureThumbnail,
  "phase-portrait": PhasePortraitThumbnail,
  "poincare-map": PoincareMapThumbnail,
  "hubble-diagram": HubbleDiagramThumbnail,
  "dalitz-plot": DalitzPlotThumbnail,
  // Batch 10 Wave B
  "architecture-diagram": ArchitectureDiagramThumbnail,
  "flame-graph": FlameGraphThumbnail,
  "circuit-diagram": CircuitDiagramThumbnail,
  "ladder-diagram": LadderDiagramThumbnail,
  "spectrogram": SpectrogramThumbnail,
  "waterfall-plot-signal": WaterfallPlotSignalThumbnail,
  "influence-diagram": InfluenceDiagramThumbnail,
  "causal-loop-diagram": CausalLoopDiagramThumbnail,
  "geographical-heatmap": GeographicalHeatmapThumbnail,
  "topographic-map": TopographicMapThumbnail,
  // Batch 11 Wave A
  "bifurcation-diagram": BifurcationDiagramThumbnail,
  "recurrence-plot": RecurrencePlotThumbnail,
  "piper-diagram": PiperThumbnail,
  "stiff-diagram": StiffThumbnail,
  "stereonet": StereonetThumbnail,
  "galbraith-plot": GalbraithPlotThumbnail,
  "equivolume-chart": EquivolumeThumbnail,
  "market-profile-chart": MarketProfileThumbnail,
  "ternary-contour-plot": TernaryContourPlotThumbnail,
  "potential-energy-diagram": PotentialEnergyDiagramThumbnail,
  // Batch 11 Wave B
  "vector-field": VectorFieldThumbnail,
  "streamline-plot": StreamlineThumbnail,
  "piping-instrumentation-diagram": PipingInstrumentationDiagramThumbnail,
  "exploded-view-drawing": ExplodedViewDrawingThumbnail,
  "stock-and-flow-diagram": StockAndFlowDiagramThumbnail,
  "concept-map": ConceptMapThumbnail,
  "radial-tree": RadialTreeThumbnail,
  "packed-circle-chart": PackedCircleChartThumbnail,
  "dot-density-map": DotDensityMapThumbnail,
  "proportional-symbol-map": ProportionalSymbolMapThumbnail,
  // Batch 12 Wave A
  "chernoff-faces": ChernoffFacesThumbnail,
  "andrews-plot": AndrewsPlotThumbnail,
  "star-glyph-plot": StarGlyphPlotThumbnail,
  "hammock-plot": HammockPlotThumbnail,
  "doubledecker-plot": DoubledeckerThumbnail,
  "barcode-chart": BarcodeThumbnail,
  "root-locus-plot": RootLocusThumbnail,
  "periodogram": PeriodogramThumbnail,
  "tissot-indicatrix": TissotIndicatrixThumbnail,
  "isochrone-map": IsochroneMapThumbnail,
  // Batch 12 Wave B
  "argument-map": ArgumentMapThumbnail,
  "rich-picture-diagram": RichPictureDiagramThumbnail,
  "bubble-map": BubbleMapThumbnail,
  "double-bubble-map": DoubleBubbleMapThumbnail,
  "surface-plot": SurfacePlotThumbnail,
  "logarithmic-plot": LogarithmicPlotThumbnail,
  "pictorial-percentage-chart": PictorialPercentageThumbnail,
  "unit-chart": UnitThumbnail,
  "genogram": GenogramThumbnail,
  "phylogram": PhylogramThumbnail,
  // Batch 13 Wave A
  "spiral-plot": SpiralPlotThumbnail,
  "comet-plot": CometPlotThumbnail,
  "shmoo-plot": ShmooPlotThumbnail,
  "carpet-plot": CarpetPlotThumbnail,
  "strip-chart": StripChartThumbnail,
  "drain-plot": DrainPlotThumbnail,
  "isarithmic-map": IsarithmicMapThumbnail,
  "vertical-bar-graph": VerticalBarGraphThumbnail,
  "pie-of-pie-chart": PieOfPieThumbnail,
  "doughnut-multi-level": DoughnutMultiLevelThumbnail,
  // Batch 13 Wave B
  "opposites-diagram": OppositesDiagramThumbnail,
  "pournelle-chart": PournelleChartThumbnail,
  "scorecard": ScorecardThumbnail,
  "balanced-scorecard": BalancedScorecardThumbnail,
  "convex-treemap": ConvexTreemapThumbnail,
  "prism-map": PrismMapThumbnail,
  "hive-plot": HivePlotThumbnail,
  "arc-matrix": ArcMatrixThumbnail,
  "dependency-graph": DependencyGraphThumbnail,
  "election-apportionment-diagram": ElectionApportionmentDiagramThumbnail,
  // Batch 14 Wave A
  "table-chart": TableThumbnail,
  "vowel-chart": VowelThumbnail,
  "dot-matrix-chart": DotMatrixThumbnail,
  "isotype-chart": IsotypeThumbnail,
  "icon-array": IconArrayThumbnail,
  "allele-chart": AlleleChartThumbnail,
  "nomogram": NomogramThumbnail,
  "quaternary-plot": QuaternaryPlotThumbnail,
  "ellingham-diagram": EllinghamDiagramThumbnail,
  "greninger-chart": GreningerChartThumbnail,
  // Batch 14 Wave B — catalog completion
  "lexis-diagram": LexisDiagramThumbnail,
  "dot-plot-bioinformatics": DotPlotBioinformaticsThumbnail,
  "affinity-diagram": AffinityDiagramThumbnail,
  "matrix-diagram": MatrixDiagramThumbnail,
  "pdpc": PdpcThumbnail,
  "phase-space-plot": PhaseSpacePlotThumbnail,
  "sociogram": SociogramThumbnail,
  "natal-chart": NatalChartThumbnail,
  "structure-chart": StructureChartThumbnail,
  "block-diagram": BlockDiagramThumbnail,
  "isosurface-plot": IsosurfacePlotThumbnail,
};

export function Thumbnail({ chart }: { chart: ChartEntry }) {
  if (chart.status === "live") {
    const C = LIVE_THUMBS[chart.id];
    if (!C) {
      // Safety net — should never happen once live charts register.
      return <PlaceholderTile family={chart.family} />;
    }
    return <C />;
  }
  return <PlaceholderTile family={chart.family} />;
}
