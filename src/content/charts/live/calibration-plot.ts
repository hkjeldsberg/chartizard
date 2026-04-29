import type { LiveChart } from "@/content/chart-schema";

export const calibrationPlot: LiveChart = {
  id: "calibration-plot",
  name: "Calibration Plot",
  family: "distribution",
  sectors: ["data-science"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",

  synopsis:
    "Plots predicted probability bins against observed positive rates to reveal whether a model's confidence is warranted.",

  whenToUse:
    "Use a calibration plot after training a classifier when you need to evaluate reliability, not just discrimination. A model with a high AUC can be systematically over- or under-confident; calibration plots expose this separately from rank-order accuracy. Calibration matters most when predicted probabilities feed downstream decisions — pricing, triage, or threshold-based alerts.",

  howToRead:
    "Predictions are sorted into ten equal-width bins; each bin's mean predicted probability becomes the x-coordinate and the fraction of actual positives in that bin becomes the y-coordinate. A dot sitting on the 45° diagonal means the model's stated confidence matched the observed rate. Dots falling below the diagonal indicate over-confidence: the model claimed, say, 85% but only 74% of those cases were positive. Murphy (1973, *A New Vector Partition of the Probability Score*, Journal of Applied Meteorology) showed that the Brier score decomposes into reliability, resolution, and uncertainty; this chart reads the reliability term geometrically.",

  example: {
    title: "Logistic regression on the UCI Adult Income dataset",
    description:
      "A logistic regression predicting high income shows near-perfect calibration in the 0–60% range but begins to sag below the diagonal above 70% predicted probability. Platt scaling (Platt 1999) or isotonic regression (Zadrozny & Elkan 2002) can correct this by fitting a monotone mapping from raw model scores to properly calibrated probabilities.",
  },

  elements: [
    {
      selector: "diagonal",
      label: "Perfect-calibration diagonal",
      explanation:
        "The 45° reference line marks perfect reliability: if the model were exactly calibrated, every bin's dot would sit on this line. Systematic deviation above or below it quantifies the calibration error for that probability range.",
    },
    {
      selector: "calibration-curve",
      label: "Calibration curve",
      explanation:
        "The line connecting the ten binned dots traces the model's actual reliability across its full probability range. A curve that hugs the diagonal throughout is well-calibrated; one that bows below it at high predicted values signals over-confidence.",
    },
    {
      selector: "binned-dot",
      label: "Binned dot",
      explanation:
        "Each dot represents one prediction bin. Its x-position is the mean predicted probability of all observations falling in that bin; its y-position is the fraction of those observations that were true positives. Hover to see the bin's count.",
    },
    {
      selector: "over-confidence",
      label: "Over-confidence gap",
      explanation:
        "The vertical distance between a dot and the diagonal is the bin's calibration error. When the dot lies below the diagonal, the model predicted higher confidence than the data warranted — a common artefact of models trained with cross-entropy loss on class-imbalanced datasets.",
    },
    {
      selector: "bin-count-rug",
      label: "Bin-count rug",
      explanation:
        "Small bars below the axis show how many observations fell in each bin. Bins with few observations (short bars) yield unreliable observed-rate estimates; treat their dots as noisy. Platt calibration is sensitive to bin density near the boundaries.",
    },
    {
      selector: "x-axis",
      label: "X-axis — predicted probability",
      explanation:
        "The horizontal axis runs from 0 to 1 and represents the model's raw predicted probability. It is divided into ten equal-width bins, so the tick at 0.5 is the centre of the [0.45, 0.55) bin.",
    },
    {
      selector: "y-axis",
      label: "Y-axis — observed frequency",
      explanation:
        "The vertical axis runs from 0 to 1 and shows the empirical positive rate within each prediction bin. When both axes share the same 0–1 scale, the diagonal reference immediately reads as perfect calibration.",
    },
  ],
};
