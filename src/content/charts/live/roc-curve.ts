import type { LiveChart } from "@/content/chart-schema";

export const rocCurve: LiveChart = {
  id: "roc-curve",
  name: "ROC Curve",
  family: "distribution",
  sectors: ["data-science"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Traces a classifier's true-positive rate against its false-positive rate across every possible threshold.",
  whenToUse:
    "Reach for an ROC curve when you need to summarise a binary classifier's separation power without committing to a single decision threshold. It is the standard diagnostic for comparing models on roughly balanced classes. On heavily imbalanced classes, pair it with a precision-recall curve — ROC alone will flatter a model that is mostly exploiting the majority class.",
  howToRead:
    "Read each point on the curve as one threshold: sweep from the top-right (threshold 0, everything called positive) down to the bottom-left (threshold 1, nothing called positive). A curve that bows toward the top-left corner has found a threshold regime where it catches positives without paying much in false alarms. The diagonal is the no-skill line — a coin flip. The area under the curve (AUC) collapses the whole sweep to one number: the probability that a random positive scores higher than a random negative.",
  example: {
    title: "Fawcett (2006), \"An introduction to ROC analysis\"",
    description:
      "The curve was formalised for radar operators during WWII, then borrowed wholesale by medical testing and machine learning. Fawcett's 2006 paper is still the canonical reference — the observation that ROC is threshold-free is the point. Two models with the same accuracy at one cutoff can have very different AUCs, and the curve shows which one survives when the cutoff moves.",
  },
  elements: [
    {
      selector: "curve",
      label: "ROC curve",
      explanation:
        "Each point on the curve is one threshold applied to the classifier's scores. Moving along the curve is moving that threshold. A curve that hugs the top-left corner dominates — it finds thresholds that maximise recall while keeping false alarms low.",
    },
    {
      selector: "diagonal",
      label: "Random-classifier diagonal",
      explanation:
        "The y = x line is what a coin flip produces: every gain in true-positive rate costs an equal gain in false-positive rate. Any curve below this line is worse than random; flip its predictions and you are above it.",
    },
    {
      selector: "auc-area",
      label: "Area under the curve (AUC)",
      explanation:
        "The shaded region below the curve. Its area equals the probability that a random positive is ranked above a random negative. AUC = 1.0 is perfect; 0.5 is chance. It is threshold-free — you get one number for the whole model, not one per operating point.",
    },
    {
      selector: "threshold-point",
      label: "Operating point",
      explanation:
        "A single threshold picked out as a bead on the curve. In practice you deploy at one operating point — the curve is the menu, the bead is the choice. Move it left to reduce false alarms at the cost of recall; move it right to catch more positives at the cost of precision.",
    },
    {
      selector: "x-axis",
      label: "False-positive rate",
      explanation:
        "FPR = FP / (FP + TN). The fraction of actual negatives that were wrongly called positive. The denominator is the total number of negatives — which is exactly why ROC can look rosy on imbalanced data: a large negative pool dilutes a lot of false alarms.",
    },
    {
      selector: "y-axis",
      label: "True-positive rate",
      explanation:
        "TPR = TP / (TP + FN), also called recall or sensitivity. The fraction of actual positives the classifier caught. Read together with FPR: a model is good only when TPR climbs faster than FPR as the threshold drops.",
    },
  ],
};
