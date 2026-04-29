import type { LiveChart } from "@/content/chart-schema";

export const blandAltmanPlot: LiveChart = {
  id: "bland-altman-plot",
  name: "Bland-Altman Plot",
  family: "distribution",
  sectors: ["medicine", "statistics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Plots the disagreement between two measurement methods against their mean, with 95% limits of agreement drawn in.",
  whenToUse:
    "Reach for a Bland-Altman plot when you need to decide whether two instruments, assays, or raters can be used interchangeably. It is the method-comparison plot in clinical chemistry, radiology, and diagnostic device validation — and the answer to anyone who proposes using a correlation coefficient for the same question.",
  howToRead:
    "Each point is one subject measured twice, once by method A and once by method B. The x-axis is the mean of the two readings (your best guess at the truth); the y-axis is A minus B (the disagreement). The solid horizontal line is the bias — the systematic offset between the two methods. The two dashed lines are the 95% limits of agreement, drawn at bias ± 1.96 SD of the differences: roughly, the window inside which 95% of paired readings will disagree. Read the bias to decide if the methods agree on average, and read the width between the dashed lines to decide whether that agreement is clinically tolerable.",
  example: {
    title: "Bland & Altman, The Lancet, 1986",
    description:
      "Bland and Altman's original paper compared two peak expiratory flow meters against the Wright meter and destroyed the then-common practice of reporting a correlation coefficient for method comparison. Correlation measures whether two readings rise and fall together, not whether they agree — two instruments reading systematically 40 L/min apart will still correlate at r ≈ 0.99. The plot they proposed shows the disagreement directly and is now required by CLSI EP09 and most regulatory submissions for new diagnostic devices.",
  },
  elements: [
    {
      selector: "data-point",
      label: "Measurement pair",
      explanation:
        "Each dot is one subject measured by both methods. Its x-coordinate is the mean of the two readings — used as a proxy for the true value, since you do not actually know it. Its y-coordinate is the difference A − B. A point near the bias line is a typical disagreement; a point near the limits is an unusually large one.",
    },
    {
      selector: "bias-line",
      label: "Bias",
      explanation:
        "The solid horizontal line is the mean of all the differences — the systematic offset between the two methods. A bias of zero means the methods agree on average; a non-zero bias means one method reads high or low relative to the other. The bias alone does not tell you whether the methods are interchangeable — the spread around it does.",
    },
    {
      selector: "loa-line",
      label: "Limit of agreement",
      explanation:
        "The dashed line at bias plus 1.96 SD of the differences. Together with its mirror below the bias, it bounds the range inside which roughly 95% of paired differences are expected to fall. Compare this range against the clinically acceptable disagreement before you decide the methods can substitute — statistical limits are not the same as clinical limits.",
    },
    {
      selector: "zero-reference",
      label: "Zero reference",
      explanation:
        "The faint horizontal at y = 0 marks where perfect agreement would sit. The distance from this line to the bias line is the systematic error; the distance from zero to a single point is that subject's total disagreement. When the bias line sits on zero, the methods agree on average.",
    },
    {
      selector: "x-axis",
      label: "Mean of the two methods",
      explanation:
        "Plotting the mean — not one method's reading — on the x-axis avoids assuming that either method is the truth. If the difference grows or shrinks systematically with the mean (the cloud fans out or tilts), the two methods disagree more at some ranges than others and the single-number bias becomes misleading.",
    },
    {
      selector: "y-axis",
      label: "Difference (A − B)",
      explanation:
        "The difference axis is the whole point of the chart. Plotting A against B would let correlation hide bias; plotting A − B against the mean makes the disagreement itself the visual subject. Always state the direction — which method is A and which is B — so the sign of the bias is interpretable.",
    },
  ],
};
