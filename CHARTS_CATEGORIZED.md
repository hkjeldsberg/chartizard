# Charts Categorized by Sector / Field

Every chart, diagram, and plot from `CHARTS.md` (v0 + v1) assigned to its primary
sector or field of use. Many charts are cross-domain; secondary uses are listed in
parentheses so the app can surface them under multiple filters when appropriate.
Duplicates from `CHARTS.md` (e.g. Sparkline, Control Chart, Treemap) are merged here.

---

## General Purpose
Universal chart types used across virtually every field.

- Bar Chart — discrete categories as vertical or horizontal bars.
- Horizontal Bar Graph — bar chart flipped for long category labels.
- Vertical Bar Graph (Column Chart) — standard time-series or category comparison.
- Grouped column chart — bars grouped side-by-side by sub-category.
- Stacked Bar Chart — sub-group contributions summed into a total bar.
- Diverging bar chart — bars extend from a central baseline in two directions.
- Deviation chart — differences from a reference line emphasized above / below.
- Pie Chart — proportions of a whole as slices.
- Donut / Doughnut chart — pie chart with a hollow centre.
- Pie-of-pie / Bar-of-pie chart — secondary breakdown of one pie slice.
- Doughnut multi-level (sunburst variant) — concentric rings per hierarchy level.
- Line Chart — connected data points for trends over intervals.
- Area Chart — line chart with filled area to emphasize volume.
- Stacked area chart — area chart showing parts-to-whole over time.
- Slope chart — two-point comparison emphasizing change between them.
- Dumbbell chart — paired points connected by a line for before/after comparison.
- Lollipop plot — bar chart with a dot on top of a thin stick.
- Table chart — data laid out in rows and columns.
- Radar Chart (Spider Chart) — multivariate data on axes from a central point.
- Star plot / Kiviat diagram — radar-style glyph per observation.
- Radial bar chart — bars drawn along a circle.
- Polar area diagram — sector areas sized by value on a polar axis.
- Nightingale chart — polar-area diagram popularized by Florence Nightingale (Also: Medicine).
- Bubble Chart — scatter plot with size encoding a third dimension.
- Scatter Plot — two-variable Cartesian points (Also: Statistics).
- Waffle chart — grid of squares showing parts of a whole (Also: Infographics).
- GapChart — highlights gaps between pairs of values.
- Sparkline — tiny inline time-series glyph.
- Small multiples / Trellis chart / Lattice plot — grid of same-type charts partitioned by a variable.

---

## Statistics
Classical statistical distributions, diagnostics, and multivariate displays.

- Histogram — distribution of continuous numerical data.
- Density plot — smoothed kernel estimate of a distribution.
- Jitter plot — scatter-like display with small random offsets for overlap.
- Strip plot — one-dimensional scatter of points along an axis.
- Beeswarm chart — non-overlapping point layout to show distribution shape.
- Box plot — median, quartiles, and outliers of a distribution.
- Bagplot — two-dimensional generalization of the boxplot.
- Violin plot — mirrored density plot showing distribution shape.
- Sina plot — hybrid of violin and jitter plots.
- Dot plot (statistics) — one dot per observation arranged along an axis.
- Rug plot — tick marks along an axis showing raw data positions.
- Stemplot (stem-and-leaf plot) — sorted-digit distribution display.
- Barcode chart — distribution as tightly stacked vertical lines.
- Radial histogram — histogram wrapped around a circle.
- Error bars — uncertainty intervals on data points.
- Heatmap — values encoded by colour across a grid.
- Hexagonal binning chart — 2D density binned into hexagons (Also: Cartography).
- Q-Q plot — quantiles of two distributions plotted against each other.
- P-P plot — cumulative probabilities of two distributions against each other.
- Normal probability plot — data quantiles vs a normal distribution.
- CDF plot — cumulative distribution function of a variable.
- ECDF plot — empirical CDF from observed data.
- Ridgeline plot / Joyplot — stacked density plots across a categorical axis.
- Spaghetti plot — overlaid line trajectories for many subjects (Also: Time Series).
- Chernoff Faces — multivariate data encoded into facial features.
- Andrews plot (Andrews curves) — Fourier-style curves for multivariate data.
- Hammock plot — parallel-coordinates-like display for categorical data.
- Parallel coordinates plot — each observation as a polyline across parallel axes.
- Scatter plot matrix (SPLOM) — grid of pairwise scatter plots.
- Correlation matrix / Correlogram — pairwise correlations as a coloured grid.
- Mosaic plot (Mekko / Marimekko) — nested rectangles for categorical proportions.
- Doubledecker plot — mosaic variant for conditional proportions.
- Residual plot — regression residuals vs fitted values.
- Leverage plot (influence plot) — leverage vs standardized residuals.
- Cook's distance plot — per-observation influence on a regression.
- Bi plot — scores and loadings overlaid in a PCA-style projection.
- Tally chart — counts recorded as stroke groups.
- Likert scale chart / diverging stacked bar — centred bars for agree/disagree scales.
- Glyph plots (star / profile glyphs) — multivariate observation shown as a small shape.

---

## Data Science & Machine Learning
Model evaluation, explainability, and features specific to predictive modelling.

- ROC curve — true-positive vs false-positive rate for a classifier.
- Precision-Recall curve — classifier performance for imbalanced data.
- Lift chart — model improvement over random targeting.
- Cumulative gains chart — cumulative response captured vs population targeted.
- Confusion matrix heatmap — classification counts as a coloured grid.
- Calibration plot (reliability diagram) — predicted probability vs observed frequency.
- Partial dependence plot (PDP) — marginal effect of a feature on predictions.
- SHAP summary plot — per-feature Shapley value distribution.
- Feature importance plot — ranked bar chart of feature contributions.
- Scree plot — eigenvalues vs component index for PCA / factor analysis.

---

## Time Series & Temporal
Charts where time is the dominant axis or focus.

- Timeline chart — events plotted along a time axis.
- Calendar — heatmap / grid organised by calendar structure.
- Spiral plot — time series wrapped around a spiral.
- Streamgraph — stacked area chart flowing around a central baseline.
- Bump chart — ranked positions over time.
- Horizon chart / horizon graph — compact layered colour-banded time series.
- Cycle plot — seasonal subseries plotted together with trend lines.
- Comet plot — motion trails for points moving over time.
- Moving average (rolling average) — smoothed time series.
- Autocorrelation plot (ACF / correlogram) — correlation of a series with its lags.
- Partial autocorrelation plot (PACF) — lag correlation after removing intermediate lags.

---

## Hierarchical & Tree Visualization
Generic viz patterns for hierarchy / containment.

- Tree chart — generic node-link tree layout.
- Radical Tree (Radial tree) — tree laid out radially from a root.
- Tree map / Treemap — nested rectangles sized by value.
- Convex treemap — treemap using non-rectangular convex shapes.
- Sunburst chart — radial hierarchy of concentric ring segments.
- Dendrogram — tree produced by hierarchical clustering (Also: Biology, Statistics).
- Packed circle chart — circles packed within a bounding shape.
- Bubble pack / Circle packing — nested / grouped circles sized by value.
- Icicle chart — hierarchical rectangles laid out top-down.

---

## Networks & Graphs
Nodes and edges, link diagrams, matrix-of-graph displays.

- Network diagram — general node-link graph layout.
- Arc diagram — nodes on a line with edges as arcs above / below.
- Chord diagram — ribbons between segments of a circle representing flows.
- Hive plot — nodes placed on radial axes with links between them.
- Adjacency matrix plot — network as a coloured NxN matrix.
- Arc matrix / reorderable matrix — matrix visualization with orderable rows / columns.
- Voronoi diagram — plane partitioned by nearest-site regions (Also: Mathematics, Cartography).
- Dependency graph / Dependency wheel — module / package dependencies (Also: Software).

---

## Flow & Process Visualization
Diagrams that emphasise movement, routing, or categorical flow.

- Flowchart — process, system, or algorithm steps with decision branches.
- Sankey diagram — weighted flows whose widths show magnitude.
- Alluvial diagram — categorical flow across dimensions / time steps.
- Parallel sets — Sankey-like layout for categorical data.

---

## Finance & Trading
Price, volume, and forecast charts specific to financial markets.

- Waterfall chart — running total built from positive / negative contributions.
- Open-High-Low-Close (OHLC) chart — daily price range as a bar.
- Candlestick chart — OHLC bar with coloured body for open vs close.
- Kagi chart — price-only chart with line thickness changing on reversals.
- Renko chart — price movement as fixed-size bricks ignoring time.
- Point-and-figure chart — price moves as stacks of Xs and Os, ignoring time.
- Heikin-Ashi chart — smoothed candlesticks using averaged OHLC.
- Ichimoku Kinko Hyo (Kumo cloud) — multi-line momentum / support-resistance overlay.
- Three-line break chart — reversal chart based on breaking the last N lines.
- Equivolume chart — price boxes scaled by trading volume.
- Market profile chart — price distribution over a session as a letter histogram.
- Fan chart (forecast) — probabilistic forecast shown as widening bands.

---

## Business & Management
Strategy, positioning, KPIs, and organisational displays.

- Quadrant chart — 2x2 positioning on two dimensions.
- Magic Quadrant (Gartner-style) — 2x2 vendor / product positioning.
- SWOT analysis — Strengths / Weaknesses / Opportunities / Threats 2x2.
- Opposites diagram — contrasting concepts across a shared axis.
- Organizational Chart — reporting / hierarchy within an organisation.
- Bullet chart — single measure with target and qualitative bands.
- Gauge chart / Speedometer chart — single KPI against a range dial.
- KPI tile / Big number chart — single large value with optional trend.
- Scorecard — tabular set of KPIs with targets and status.
- Balanced scorecard — strategy map across financial, customer, internal, learning perspectives.
- Stakeholder power-interest grid — 2x2 of influence vs interest.
- RACI matrix — Responsible / Accountable / Consulted / Informed per task.
- SIPOC diagram — Suppliers, Inputs, Process, Outputs, Customers overview.
- BPMN diagram — Business Process Model and Notation workflow.
- Swimlane diagram / Cross-functional flowchart — flowchart split by actor lanes.

---

## Project Management
Planning, scheduling, and agile progress tracking.

- Gantt Chart — task bars positioned on a time axis.
- PERT chart — network of tasks with dependencies and critical path.
- Kanban board — work items flowing through status columns.
- Burn-down chart — remaining work vs time across a sprint / project.
- Burn-up chart — completed work and total scope over time.
- Cumulative flow diagram (CFD) — stacked area of work-in-each-state over time.

---

## Quality & Process Improvement
Six Sigma, SPC, Lean, and problem-structuring tools.

- Control Chart — process metric over time with control limits.
- Run chart — time-ordered values for process monitoring.
- Pareto chart — bar chart ordered by frequency with cumulative line.
- Ishikawa / Fishbone diagram — cause-and-effect categorization of a problem.
- Affinity diagram — grouping of ideas by natural relationships.
- Matrix diagram — relationships between two or more sets of items.
- PDPC (Process Decision Program Chart) — plan plus countermeasures for failure modes.
- Value stream map — end-to-end process map with lead / cycle times.

---

## Marketing & Sales
Conversion, funnels, and audience structure.

- Funnel chart — sequential stages with drop-off at each step.
- Pyramid chart — layered triangle for hierarchy or maturity levels.

---

## Economics & Demographics
Inequality, population structure, and demographic time grids.

- Lorenz curve — income / wealth inequality against the line of equality.
- Population pyramid plot — age/sex distribution of a population.
- Lexis diagram — cohort / age / period grid for demography and epidemiology.

---

## Political Science & Elections
Ideology mapping and electoral allocation displays.

- Nolan chart — political ideology on two axes (economic vs personal freedom).
- Pournelle chart — political ideology on liberty vs state-rationalism axes.
- Election apportionment diagram — allocation of seats across parties or regions.

---

## Medicine & Healthcare
Clinical, epidemiological, and evidence-synthesis charts.

- Nomogram — graphical calculator / clinical prediction tool.
- Bland-Altman plot — agreement between two measurement methods.
- Funnel plot — small-study effects in meta-analysis.
- Forest plot (blobbogram) — effect sizes across studies in meta-analysis.
- Kaplan-Meier curve — fraction of subjects surviving over time.
- Genogram — family tree with relational and medical annotations.

---

## Biology & Life Sciences
Evolution, classification, and organismal charts.

- Phylogenetic tree — evolutionary relationships among taxa.
- Cladogram — branching diagram based on shared derived traits.
- Phylogram — phylogenetic tree with branch lengths proportional to change.
- Tree of life style radial phylogeny — radial phylogenetic tree layout.

---

## Genetics & Bioinformatics
Heredity, genomic features, and molecular data displays.

- Allele chart — visualization of allele frequencies or inheritance.
- Pedigree chart — family tree with affected-status symbols.
- Punnett square — grid of genetic cross outcomes.
- Karyotype — ordered display of an organism's chromosomes.
- Ideogram — schematic chromosome map with banding and loci.
- Circos plot — circular layout of genomic features with links between regions.
- Sequence logo — position-wise nucleotide / amino acid frequency display.
- Dot plot (bioinformatics) — sequence-vs-sequence similarity matrix.
- Manhattan plot — genome-wide p-values by chromosome position.
- Volcano plot — significance vs fold change for differential expression.

---

## Chemistry & Biochemistry
Reactions, kinetics, compositions, and thermodynamic diagrams.

- Arrhenius plot — reaction rate vs inverse temperature (kinetics).
- Lineweaver-Burk plot — enzyme kinetics double-reciprocal plot.
- Lewis structure — valence electrons and bonds in a molecule.
- Titration curve — pH (or other property) vs volume of titrant added.
- Ternary plot — composition of a three-component mixture.
- Ternary contour plot — contours drawn inside a ternary plot.
- Quaternary (tetrahedral) plot — four-component composition diagram.
- Phase diagram — thermodynamic state regions vs T / P / composition.
- Pourbaix diagram — stable chemical species vs pH and potential.
- Ellingham diagram — Gibbs free energy of oxide formation vs temperature.
- Jablonski diagram — electronic states and transitions in photophysics.
- Potential energy / reaction coordinate diagram — energy along a reaction pathway.

---

## Physics & Astronomy
Dynamical systems, particle physics, and astrophysical relations.

- Hertzsprung-Russell diagram — stellar luminosity vs spectral class / temperature.
- Hubble diagram — redshift vs distance for astronomical objects.
- Feynman diagram — pictorial representation of particle interactions.
- Dalitz plot — three-body decay kinematic distribution in particle physics.
- Greninger chart — X-ray crystallography orientation chart.
- Recurrence plot — times at which a dynamical system revisits a state.
- Phase portrait — trajectories of a dynamical system in state space.
- Phase-space plot — generalized state-variable trajectory plot.
- Poincaré map — discrete-time cross-section of a continuous dynamical system.
- Bifurcation diagram — system steady states vs a control parameter.
- Vector field / Quiver plot — arrows showing magnitude and direction on a grid.
- Streamline plot — curves tangent to a vector field.
- Isosurface plot — 3D surface of constant value in a scalar volume.

---

## Earth Sciences & Meteorology
Geology, hydrology, climate, and orientation data.

- Taylor diagram — concise comparison of models vs observations (climate).
- Piper diagram — water chemistry plotted on two ternaries and a diamond.
- Stiff diagram — polygon of major ion concentrations in water.
- Stereonet / Wulff net / Schmidt net — equal-angle / equal-area orientation projection.
- Rose diagram (wind rose) — circular histogram of directional data.
- Galbraith plot — radial plot used in radiometric dating (Also: Medicine meta-analysis).
- Climate stripes / warming stripes — bands of colour per year showing temperature trend.

---

## Electrical / Signal Processing / Control Engineering
Transfer functions, frequency response, modulation, and signal quality.

- Smith chart — RF impedance / reflection coefficient on a circular grid.
- Bode plot — magnitude and phase vs frequency for a system.
- Nichols plot — open-loop gain vs phase for control systems.
- Nyquist plot — open-loop transfer function in the complex plane.
- Root locus plot — closed-loop poles as a gain parameter varies.
- Pole-zero plot — poles and zeros of a transfer function in the complex plane.
- Argand diagram — points in the complex plane (real vs imaginary).
- Eye diagram — overlaid signal traces to assess digital transmission quality.
- Constellation diagram — I/Q symbol positions for a digital modulation scheme.
- Spectrogram — time-frequency heatmap of a signal's spectral content.
- Periodogram — estimated spectral density of a signal.
- Waterfall plot (signal) — 3D stack of spectra over time.
- Carpet plot — multi-parameter engineering chart of nested curves.
- Drain plot — semiconductor device I-V characteristic plot.
- Shmoo plot — pass/fail regions of an integrated circuit over two parameters.
- Strip chart — continuous recording of a signal on moving paper / display.
- Block diagram — high-level functional blocks and connections.
- Circuit / schematic diagram — electrical components and their wiring.
- Ladder diagram — PLC logic in a ladder-rail layout.

---

## Mechanical & Process Engineering
Physical assemblies and process plant documentation.

- Exploded view drawing chart — assembly shown with parts separated along axes.
- Piping and Instrumentation Diagram (P&ID) — process equipment, piping, and instrumentation.

---

## Software & Systems Engineering
Code structure, behaviour, deployment, and performance views.

- Structure chart — top-down decomposition of a program into modules.
- UML class diagram — classes, attributes, methods, relationships.
- UML sequence diagram — time-ordered object interactions.
- UML activity diagram — workflow / control flow of activities.
- UML state diagram (statechart) — states and transitions of an object.
- UML use case diagram — actors and system use cases.
- UML component diagram — software components and their interfaces.
- UML deployment diagram — runtime artifacts on nodes / hardware.
- UML object diagram — snapshot of object instances at a point in time.
- Entity-Relationship (ER) diagram — entities, attributes, relationships for data modelling.
- Data flow diagram (DFD) — data movement through processes and stores.
- Control flow graph (CFG) — program paths through basic blocks.
- Finite state machine diagram — states, events, and transitions.
- Architecture diagram — system components, services, and dependencies.
- Flame graph — stacked call-stack profile of CPU time.

---

## Cartography & GIS
Maps and spatial visualizations.

- Tile map — grid of tiles where each tile represents a region.
- Geographical heatmap — intensity heatmap overlaid on a map.
- Choropleth — regions shaded by an attribute value.
- Bivariate choropleth — two variables encoded with a joint colour scheme.
- Flow map — flows between origins and destinations on a map.
- Cartogram — regions resized by a quantity instead of area.
- Dot density map — one dot per N units of a variable across regions.
- Proportional symbol map — symbols sized by a quantity at each location.
- Isarithmic map / Isopleth map / Contour map — lines of equal value over a surface.
- Isochrone map — regions reachable within equal travel times.
- Prism map — choropleth extruded in 3D by a quantity.
- Topographic / relief map — terrain elevation with contours or shading.
- Hexbin map — hexagonal aggregation over a geographic area.
- Tissot's indicatrix — circles showing map projection distortion.

---

## Decision Analysis & Systems Thinking
Reasoning, causality, and knowledge structuring tools.

- Decision tree diagram — branching decisions with outcomes and probabilities.
- Influence diagram — decisions, uncertainties, and objectives with dependencies.
- Causal loop diagram — variables and feedback loops in a system.
- Stock-and-flow diagram — accumulations, flows, and system dynamics.
- Mind map — central topic with radiating branches of related ideas.
- Concept map — nodes of concepts linked by labelled relationships.
- Argument map — claims, reasons, and objections in an argument.
- Rich picture diagram — informal soft-systems sketch of a situation.
- Pugh matrix — concept scoring against weighted criteria.
- Bubble map — central bubble with related bubbles attached.
- Double bubble map — two central bubbles with shared and unique attributes.

---

## Mathematics & Logic
Sets, spaces, and abstract plots.

- Euler Diagram — overlapping regions for set relationships (strict subset of cases).
- Venn diagram — all possible logical relations between a small number of sets.
- Contour plot — lines of equal value for a scalar function of two variables.
- Logarithmic plot — axes on a logarithmic scale to reveal power-law structure.
- Surface plot (x, y, z) — 3D surface of z = f(x, y).

---

## Linguistics
Phonetic and language-structure displays.

- Vowel chart — vowels positioned by tongue height and backness (IPA).

---

## Astrology / Esoteric
Non-empirical charts included for domain completeness.

- Natal chart — positions of celestial bodies at a person's birth.

---

## Social Sciences
Interpersonal and societal relationship displays.

- Sociogram — social network of individuals and their ties.

---

## Infographics & Data Communication
Icon-based and pictorial displays optimized for lay audiences.

- Word cloud — words sized by frequency.
- Pictogram — icon-based representation of a category.
- Pictorial percentage chart — icon or shape filled to a percentage.
- Dot matrix chart — grid of dots where each dot represents a unit.
- Isotype chart — repeated icons where each icon represents a fixed count.
- Unit chart — one mark per observation (generalized isotype / dot matrix).
- Icon array — grid of icons used to communicate risk or proportion.

---

## Notes
- Duplicates collapsed: Sparkline (x2), Control Chart (x2), Treemap / Tree map, Strip chart / Strip plot.
- Cross-domain charts (e.g. Scatter Plot, Heatmap, Dendrogram, Voronoi) appear under their
  most common primary sector, with secondary sectors called out in parentheses so the app
  can surface them under multiple filters.
- "Companion" entries in `CHARTS.md` v1 (e.g. "Manhattan plot companion: Q-Q plot for GWAS")
  were folded into their parent entries rather than listed separately.
