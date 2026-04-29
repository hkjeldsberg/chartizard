import type { LiveChart } from "@/content/chart-schema";

export const shapSummaryPlot: LiveChart = {
  id: "shap-summary-plot",
  name: "SHAP Summary Plot",
  family: "distribution",
  sectors: ["data-science"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",

  synopsis:
    "Displays the distribution of SHAP values for every feature in a model, sorted by global importance, with dot colour encoding the feature's raw value to reveal direction and heterogeneity simultaneously.",

  whenToUse:
    "Use a SHAP summary plot after fitting any black-box model — gradient boosted trees, neural networks, random forests — when you need to answer three questions at once: which features matter most globally, in which direction does each feature push predictions, and how consistent is that direction across observations? It superseded variable-importance bar charts because those charts only answer the first question.",

  howToRead:
    "Each horizontal row is one feature, ordered from most important (top) to least (bottom) by mean absolute SHAP value. Every dot is one observation: its horizontal position is the SHAP value for that observation, where positive means 'pushed the prediction higher' and negative means 'pushed it lower.' Dot colour encodes the raw feature value — blue for low, red for high. Reading colour against position at once reveals direction: red dots on the right for LoanAmount means high loan amounts consistently push default probability up.",

  example: {
    title: "Fannie Mae single-family loan performance model, default probability",
    description:
      "Lundberg and Lee introduced SHAP summary plots in their NeurIPS 2017 paper, building on Lloyd Shapley's 1953 cooperative-game theory. Applied to a Fannie Mae loan default model, the SHAP summary shows CreditScore with red dots (high score) clustering on the left — high scores strongly suppress default probability — while LoanAmount shows red dots on the right, meaning large loans consistently raise predicted risk. This pattern, invisible to a variable-importance bar chart, is visible at a glance in the SHAP summary.",
  },

  elements: [
    {
      selector: "feature-row",
      label: "Feature row (LoanAmount)",
      explanation:
        "Each horizontal row corresponds to one input feature. The topmost row is the most globally important feature, measured by the mean absolute SHAP value across all observations. Lundberg and Lee (2017) formalised this ranking using Shapley values from cooperative-game theory, ensuring that each feature's importance is a fair attribution of the model's total prediction variance.",
    },
    {
      selector: "zero-axis",
      label: "SHAP = 0 axis",
      explanation:
        "The vertical line at SHAP = 0 is the dividing boundary between features that push a specific prediction above the baseline and those that push it below. The baseline is typically the mean model output over the training set. Dots to the right of zero increase the prediction; dots to the left decrease it.",
    },
    {
      selector: "x-axis",
      label: "X-axis (SHAP value)",
      explanation:
        "The horizontal axis measures SHAP value in the model's output units — log-odds for classification, dollars for a price model. A SHAP value of +0.4 means that feature, at that observation's value, raised the predicted output by 0.4 units relative to the baseline, with all other features held fixed.",
    },
    {
      selector: "dot",
      label: "Dot (one observation)",
      explanation:
        "Each dot is one observation in the dataset. Its x-position is the SHAP value for that observation's feature value; dots are jittered vertically within the row to avoid overplotting and reveal the density of the distribution. A wide horizontal spread means the feature has highly variable impact; a tight cluster near zero means the feature rarely moves predictions.",
    },
    {
      selector: "sort-order",
      label: "Sort order (importance)",
      explanation:
        "Features are sorted top-to-bottom by mean absolute SHAP value, placing the most influential features at the top where the eye lands first. This ordering makes global feature importance a posture rather than a number — wide rows near the top, narrow rows near the bottom.",
    },
    {
      selector: "colour-legend",
      label: "Colour legend (feature value)",
      explanation:
        "Dot colour encodes the raw feature value on a diverging blue-to-red scale: blue represents low feature values and red represents high values. Reading colour against horizontal position simultaneously reveals whether high or low values of a feature drive predictions up or down, something a variable-importance bar chart cannot show.",
    },
  ],
};
