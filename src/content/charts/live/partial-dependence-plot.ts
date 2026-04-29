import type { LiveChart } from "@/content/chart-schema";

export const partialDependencePlot: LiveChart = {
  id: "partial-dependence-plot",
  name: "Partial Dependence Plot",
  family: "relationship",
  sectors: ["data-science"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",

  synopsis:
    "Marginalises a trained model's output over the joint distribution of all other features to isolate the average effect of a single feature on the prediction.",

  whenToUse:
    "Use a PDP after training a non-linear model — gradient boosted trees, random forests, neural networks — when you want to answer 'what shape does the model believe this feature has?' The plot exposes whether a feature acts linearly, stepped, or with a threshold, in a way that inspecting coefficients never could. Pair it with ICE lines to check whether the average is hiding subgroup heterogeneity.",

  howToRead:
    "The x-axis runs across a feature's observed range; the y-axis shows the model's average predicted output at each value, with all other features held at their observed distributions. A steep region means the model is sensitive to that feature in that zone; a flat plateau means additional increases past that point stop moving the prediction. Thin ICE lines behind the PDP curve show individual-level trajectories: if they fan out widely, the average is masking meaningful subgroup differences.",

  example: {
    title: "Zillow housing-price gradient boosted model, square footage feature",
    description:
      "Jerome Friedman introduced PDPs in his 2001 Annals of Statistics paper on gradient boosting. Applied to a Zillow-style housing model, the PDP for square footage reveals a near-flat region below 1,200 sq ft, a sharp nonlinear climb between 1,500 and 3,000 sq ft, and a plateau above 3,500 — a pattern that a linear regression coefficient would flatten to a single slope, hiding the threshold behaviour that actually drives the model's predictions.",
  },

  elements: [
    {
      selector: "pdp-curve",
      label: "PDP average curve",
      explanation:
        "The bold line is the partial dependence curve, computed by averaging the model's prediction at each feature value across the full dataset. Its shape — flat, steep, curved, stepped — tells you how the model uses that feature. Friedman (2001) defined this as the expected value of the model output with all other features marginalised.",
    },
    {
      selector: "ice-lines",
      label: "ICE lines",
      explanation:
        "Individual Conditional Expectation lines (Goldstein et al., 2015) trace a single observation's predicted output as the feature value varies, keeping all other features fixed at that observation's actual values. Where ICE lines are parallel, the average PDP is a reliable summary; where they diverge or cross, the feature's effect varies across individuals and the average conceals important heterogeneity.",
    },
    {
      selector: "x-axis",
      label: "X-axis (feature value)",
      explanation:
        "The horizontal axis spans the observed range of the feature under examination. Values outside the training distribution are extrapolations: the model has never seen those combinations of inputs, so PDP values at the extremes may reflect the model's prior rather than a real relationship.",
    },
    {
      selector: "y-axis",
      label: "Y-axis (model prediction)",
      explanation:
        "The vertical axis is the model's output — a predicted price, probability, or score — averaged over the dataset at each feature value. The absolute level is less important than the shape: how much does the prediction rise or fall as the feature moves?",
    },
    {
      selector: "inflection-region",
      label: "Inflection region",
      explanation:
        "The shaded zone marks the feature range where the PDP curve bends most steeply, sometimes called the 'knee.' In a housing model, this is where additional square footage transitions from marginal to high value. Identifying the inflection is often the analyst's primary goal: it locates where the model places the threshold that separates low and high predictions.",
    },
  ],
};
