import type { LiveChart } from "@/content/chart-schema";

export const biplot: LiveChart = {
  id: "biplot",
  name: "Biplot",
  family: "relationship",
  sectors: ["statistics", "data-science"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",

  synopsis:
    "Simultaneously renders observations as points and variables as vectors in a shared principal-component space, exposing both the correlation structure among variables and the position of individual observations relative to that structure.",

  whenToUse:
    "Use a biplot when you have run a principal component analysis and want to read correlation structure, observation clusters, and variable importance from one frame rather than three. It is the standard diagnostic plot after PCA in ecology (species × site matrices), chemometrics, and exploratory social-science data analysis. Avoid it when the first two components explain less than ~50% of variance — the projected picture will mislead.",

  howToRead:
    "Observations appear as dots, scored on the first two principal components. Variables appear as arrows radiating from the origin, pointing in the direction of maximum increase for that variable. Arrow length encodes how well the variable is captured by the two plotted components — a short arrow means most of the variable's variance is in components 3 or beyond. The angle between two arrows encodes correlation: arrows that nearly coincide indicate positively correlated variables; arrows at 90° are uncorrelated; arrows pointing in opposite directions indicate negative correlation.",

  example: {
    title: "Fisher's Iris data (1936), 150 specimens × 4 morphological variables",
    description:
      "The canonical biplot of the Iris dataset shows sepal length, petal length, and petal width as long, nearly co-directional arrows, confirming their strong mutual correlation, while sepal width points in a nearly orthogonal direction. The three species separate visibly in the biplot plane: setosa clusters at the negative PC1 extreme, while versicolor and virginica separate along PC2. Anderson's original measurements become interpretable from one plot rather than six pairwise scatterplots.",
  },

  elements: [
    {
      selector: "pc1-axis",
      label: "PC1 axis",
      explanation:
        "The horizontal dashed line through the origin is the first principal component — the direction in the original 5-variable space that captures maximum variance. Observations displaced to the right score highly on PC1. In this physical-measurements dataset, PC1 is dominated by overall size: Length, Width, and Volume all load strongly onto it.",
    },
    {
      selector: "pc2-axis",
      label: "PC2 axis",
      explanation:
        "The vertical dashed line through the origin is the second principal component, orthogonal to PC1 by construction. It captures the next largest source of variance not already explained by PC1. Here, Weight loads heavily onto PC2, encoding a body-density dimension that is largely independent of linear dimensions.",
    },
    {
      selector: "observation-dot",
      label: "Observation",
      explanation:
        "Each dot is one measurement record, projected from 5-variable space onto the PC1-PC2 plane. Two observations near each other are similar across all five variables, not just in one at a time. Tight clusters indicate groups of similar objects; diffuse clouds indicate a continuum.",
    },
    {
      selector: "loading-arrow",
      label: "Variable loading arrow",
      explanation:
        "Each arrow is a variable vector. Its direction is the variable's loading on PC1 (horizontal component) and PC2 (vertical component). Volume's arrow is long and points far to the right because Volume explains a large share of the variance captured by PC1. An observation's projected value on any variable is proportional to its perpendicular projection onto that arrow.",
    },
    {
      selector: "arrow-angle",
      label: "Angle between arrows",
      explanation:
        "The angle between Length and Width arrows is small — they nearly coincide — because those variables are strongly positively correlated. Gabriel (1971) formalised this reading: the cosine of the angle between two unit-length arrows approximates the Pearson correlation between the corresponding variables, a direct consequence of the biplot's construction from the singular-value decomposition.",
    },
    {
      selector: "origin",
      label: "Origin",
      explanation:
        "The origin represents the grand mean of the dataset after mean-centring. All variable arrows start here. An observation exactly at the origin would be average on every principal component — it is unusual to see one there in practice. The origin is also the point of minimum leverage in regression terms.",
    },
  ],
};
