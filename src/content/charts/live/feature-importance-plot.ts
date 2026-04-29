import type { LiveChart } from "@/content/chart-schema";

export const featureImportancePlot: LiveChart = {
  id: "feature-importance-plot",
  name: "Feature Importance Plot",
  family: "comparison",
  sectors: ["data-science"],
  dataShapes: ["categorical"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Ranks model inputs by how much each one moved the prediction, sorted descending.",
  whenToUse:
    "Use it to answer one narrow question: which features did this model lean on? It's the right tool only if you trust the importance definition — permutation, SHAP, and gain/split can reorder the same ranking. Don't use it to reason about causation; a feature can top the list because it leaks the label.",
  howToRead:
    "Read top-to-bottom: the longest bar is the feature the model weighted most. The gap between bar 1 and bar 2 matters more than the absolute numbers — a near-tie means the ranking is unstable across bootstraps. Treat the tail as noise unless you see a sharp cliff.",
  example: {
    title: "Credit-default XGBoost model, 10 engineered features",
    description:
      "A lender training a default-prediction model plots permutation importance and finds credit-score and utilization carrying most of the signal. The same model's built-in XGBoost feature_importance_ — which defaults to 'weight' (split count), not 'gain' — reorders the middle of the list and demotes utilization. The chart hides that choice; the caption has to name it.",
  },
  elements: [
    {
      selector: "top-bar",
      label: "Leading feature",
      explanation:
        "The longest bar is the feature the model leaned on hardest. Compare its length to the second bar: a wide gap means the model has a clear favourite, a narrow gap means the ranking would flip under resampling.",
    },
    {
      selector: "baseline",
      label: "Baseline",
      explanation:
        "The left edge is zero importance. Because bars grow rightward from a common start, the eye compares lengths directly — this is why a zero baseline is non-negotiable for bar charts.",
    },
    {
      selector: "ranking",
      label: "Ranking order",
      explanation:
        "Features are sorted by importance descending. The ordering itself is the story, not the individual magnitudes — and it depends on which importance definition you picked. Permutation importance, SHAP mean-absolute, and XGBoost's gain-vs-weight-vs-cover can produce three different top-5s for the same model.",
    },
    {
      selector: "feature-axis",
      label: "Feature axis",
      explanation:
        "One row per input feature. Keep the labels short and the list bounded — above ~15 features the tail becomes decorative and the chart stops being scannable.",
    },
    {
      selector: "importance-axis",
      label: "Importance axis",
      explanation:
        "Scale depends on the method. Permutation importance reports the drop in model performance when the feature is shuffled; SHAP reports mean absolute contribution per prediction; tree-based 'gain' reports average loss reduction per split. Label the unit so the reader knows which one they're looking at.",
    },
  ],
};
