import type { LiveChart } from "@/content/chart-schema";

export const correlationMatrix: LiveChart = {
  id: "correlation-matrix",
  name: "Correlation Matrix",
  family: "relationship",
  sectors: ["statistics"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",
  synopsis:
    "An n×n grid of pairwise Pearson correlations, colour-coded from blue (−1) through neutral to red (+1).",
  whenToUse:
    "Reach for a correlation matrix when you have a dozen or more continuous features and need a single glance at which pairs move together. It's the standard pre-modelling diagnostic before regression, PCA, or feature selection — the chart you stare at to find collinearity before it contaminates a model.",
  howToRead:
    "The diagonal is always 1 and carries no information — skip it. Work through the off-diagonal cells and read magnitude (how far from zero) before sign (red or blue). Upper and lower triangles encode the exact same pairs, so show one, not both — the redundant half is wasted ink. Colour is a coarse cue; the printed coefficient is the value you cite.",
  example: {
    title: "Boston housing features — classic regression dataset",
    description:
      "The textbook example: 8 neighbourhood features, 506 tracts. The matrix lights up three stories. ROOMS × LSTAT sits at −0.69 — larger homes, lower share of low-status residents — which is why LSTAT alone predicts median price almost as well as a multivariate model. NOX × AGE at 0.73 and NOX × DIS at −0.77 encode the same geography (older tracts cluster near industry and away from employment centres). The matrix is what tells you LSTAT and ROOMS carry nearly the same signal before you fit the regression.",
  },
  elements: [
    {
      selector: "diagonal",
      label: "Diagonal",
      explanation:
        "Every feature correlates perfectly with itself — the diagonal is always 1.00 and never tells you anything. Its only job is to orient you: the grid is symmetric about this line, so the upper and lower triangles are mirror images of each other.",
    },
    {
      selector: "strong-positive",
      label: "Strong positive correlation",
      explanation:
        "A coefficient near +1 (warm red) means the two features rise together. NOX × AGE at 0.73 is the typical pre-regression finding: older housing tracts are also the tracts closer to the nitrogen-oxide-producing industry. Two features this correlated are redundant inputs to a linear model — keep one.",
    },
    {
      selector: "strong-negative",
      label: "Strong negative correlation",
      explanation:
        "A coefficient near −1 (deep blue) means the two features move in opposite directions. ROOMS × LSTAT at −0.69 is the headline finding of the Boston-housing dataset: bigger homes sit in neighbourhoods with a lower share of low-status residents. This is the pair most worth plotting as an actual scatter.",
    },
    {
      selector: "row-labels",
      label: "Row labels",
      explanation:
        "Each row names one feature. With eight features the grid has 28 unique pairs (n·(n−1)/2); with twenty features it has 190. Past about fifteen, read the matrix in triage mode: scan for the handful of deep-red and deep-blue cells and ignore the noise.",
    },
    {
      selector: "column-labels",
      label: "Column labels",
      explanation:
        "Column labels repeat the same list of features rotated 90°. Because the matrix is symmetric, conventional practice is to draw only the lower triangle (or only the upper) plus the diagonal — the other half would just repeat every number.",
    },
    {
      selector: "colour-scale",
      label: "Diverging colour scale",
      explanation:
        "The ramp runs from blue at −1 through neutral at 0 to red at +1. Colour is used twice here: hue encodes sign, opacity encodes magnitude. The coefficient is printed inside every cell so the chart never depends on colour alone — readers with colour-vision differences get the number.",
    },
  ],
};
