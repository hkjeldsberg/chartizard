import type { LiveChart } from "@/content/chart-schema";

export const scatterPlotMatrix: LiveChart = {
  id: "scatter-plot-matrix",
  name: "Scatter Plot Matrix (SPLOM)",
  family: "relationship",
  sectors: ["statistics"],
  dataShapes: ["continuous"],
  tileSize: "L",
  status: "live",
  synopsis:
    "A grid of scatter plots for every pairwise combination of features, with the feature's own distribution on the diagonal.",
  whenToUse:
    "Reach for a SPLOM when a correlation matrix gave you a shortlist of interesting pairs and you need to see the clouds. The coefficient compresses the relationship into one number; the SPLOM refuses to — you see the non-linearity, the outliers, the L-shape, the funnel. Use the two charts in sequence: the matrix is for reading, the SPLOM is for inspecting.",
  howToRead:
    "The grid is symmetric. Each off-diagonal panel is a mini-scatter with the column variable on x and the row variable on y, so the panel at (row=rooms, col=lstat) and the panel at (row=lstat, col=rooms) are the same relationship with axes swapped. The diagonal runs the feature against itself — meaningless as a scatter, so it's conventionally replaced with the feature's name and a 1-D distribution sketch. Each panel has its own axis scales.",
  example: {
    title: "Boston housing features — four-variable pre-regression scan",
    description:
      "A 4×4 SPLOM on rooms, lstat, crim, and age surfaces what the correlation matrix only hints at. The rooms × lstat panel is the obvious diagonal negative cloud (r ≈ −0.69), but the SPLOM also reveals the crim distribution's hard left wall at zero — most tracts have near-zero crime with a long right tail, which a Pearson r smears into a single number. This is the exact moment you decide whether to log-transform crim before fitting anything. The matrix says 'look here'; the SPLOM says 'here's what's actually going on'.",
  },
  elements: [
    {
      selector: "anchor-panel",
      label: "Anchor panel",
      explanation:
        "The ROOMS × LSTAT panel is the SPLOM's headline: a clear negative cloud that shows the same relationship the correlation matrix summarises as −0.69. Every coefficient in the matrix is backed by a cloud somewhere on this grid. Read the cloud's shape — tight line, funnel, or L — before trusting the number.",
    },
    {
      selector: "diagonal",
      label: "Diagonal panel",
      explanation:
        "A feature scattered against itself would just trace the identity line, so the diagonal shows the feature's name plus a tiny histogram or density sketch instead. This is where you spot distributional issues — skew, hard limits, bimodality — that a correlation coefficient hides.",
    },
    {
      selector: "mirror",
      label: "Mirror panel",
      explanation:
        "Every off-diagonal panel has a twin on the other side of the diagonal with the axes swapped. Some SPLOMs save ink by replacing one triangle with the numeric coefficients — the upper half becomes a correlation matrix and the lower half keeps the clouds. The convention costs you nothing: the relationship is identical.",
    },
    {
      selector: "row-labels",
      label: "Row labels",
      explanation:
        "Each row label names the feature plotted on the y-axis of every panel in that row. With four features the SPLOM has 16 panels, of which 6 are unique off-diagonal pairs; past about eight features the grid starts to overwhelm — switch to a correlation heatmap for triage, then SPLOM only the interesting subset.",
    },
    {
      selector: "column-labels",
      label: "Column labels",
      explanation:
        "Column labels run across the top and name the feature plotted on the x-axis of every panel in that column. Because the matrix is symmetric, the same feature appears once as a row label and once as a column label — the diagonal is where the two names meet.",
    },
  ],
};
