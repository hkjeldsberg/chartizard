import type { LiveChart } from "@/content/chart-schema";

export const precisionRecallCurve: LiveChart = {
  id: "precision-recall-curve",
  name: "Precision-Recall Curve",
  family: "distribution",
  sectors: ["data-science"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Traces a classifier's precision against its recall across every threshold — the honest view when positives are rare.",
  whenToUse:
    "Reach for the precision-recall curve when the positive class is rare and the cost of a false alarm is high: fraud detection, rare-disease screening, click-through prediction, information retrieval. ROC flatters imbalanced models because the FPR denominator is huge; PR uses the positives twice — in both the numerator and denominator of both axes — so weakness in finding the minority class cannot hide.",
  howToRead:
    "Read left to right as recall climbs from 0 to 1. A useful classifier starts high on the precision axis and only gives up precision slowly as it reaches for more positives. The no-skill baseline sits at precision = prevalence — a random classifier predicts positive at the base rate and can do no better. Area under the PR curve (average precision) summarises performance; unlike AUC, it is sensitive to class balance.",
  example: {
    title: "Saito & Rehmsmeier (2015), PLOS ONE",
    description:
      "Their case study compared two cancer biomarker classifiers on a dataset with roughly 5% positives. ROC gave both a respectable AUC near 0.85 and looked nearly identical; the PR curves showed one model was operating close to the no-skill line and the other was not. Same scores, same thresholds — PR was the diagnostic that separated them.",
  },
  elements: [
    {
      selector: "curve",
      label: "Precision-recall curve",
      explanation:
        "Each point is one threshold. Moving right lowers the threshold — more items get called positive, recall rises, and precision almost always falls. A curve that stays high as it moves right is a classifier that can find more positives without letting many false alarms in.",
    },
    {
      selector: "no-skill-line",
      label: "No-skill baseline",
      explanation:
        "A horizontal line at precision = prevalence (here 0.30, because 30% of the data is positive). A classifier that guesses positive at random sits on this line at every recall. Unlike the ROC diagonal, this baseline moves with the class balance — it drops if positives get rarer.",
    },
    {
      selector: "imbalance-sensitivity",
      label: "Why PR differs from ROC",
      explanation:
        "ROC's false-positive rate divides by the negatives, so adding more negatives barely moves the curve. Precision divides by predicted positives — so when a rare class means most predicted positives are wrong, precision collapses and PR exposes it. For imbalanced problems, PR is the honest chart.",
    },
    {
      selector: "threshold-point",
      label: "Operating point",
      explanation:
        "One threshold picked out on the curve. Deployment needs a single point; the curve is the menu. Move left for a stricter threshold (fewer, more-accurate positives) or right for a looser one (more positives caught, more false alarms).",
    },
    {
      selector: "x-axis",
      label: "Recall",
      explanation:
        "Recall = TP / (TP + FN). The fraction of actual positives that the classifier caught. Identical to TPR on the ROC chart — the axes share this side.",
    },
    {
      selector: "y-axis",
      label: "Precision",
      explanation:
        "Precision = TP / (TP + FP). Of the items the classifier called positive, the fraction that actually were. This is the axis ROC does not have — and the reason PR behaves differently when classes are imbalanced.",
    },
  ],
};
