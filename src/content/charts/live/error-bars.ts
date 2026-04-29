import type { LiveChart } from "@/content/chart-schema";

export const errorBars: LiveChart = {
  id: "error-bars",
  name: "Error Bars",
  family: "distribution",
  sectors: ["statistics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Pairs a point estimate with a whisker — the chart admitting that a single number is never the whole truth.",
  whenToUse:
    "Reach for error bars whenever the comparison you're showing is estimated from a sample rather than observed in full. The moment you ask viewers to compare means, you owe them the uncertainty around those means — otherwise you're quietly claiming infinite precision. In A/B tests, clinical arms, and survey breakdowns, the whisker is what keeps the reader honest.",
  howToRead:
    "The bar or tick is the point estimate — the single best guess. The whisker is the confidence interval, typically 95%: the range of values consistent with the data. Read the caps as the upper and lower bound. Then compare bars: if two whiskers visibly overlap, the difference between those means might not be statistically significant, no matter how different the point estimates look. Non-overlapping CIs are suggestive, not conclusive — the full test lives in the p-value, but the chart gets you most of the way there by eye.",
  example: {
    title: "Five-variant landing-page A/B test — conversion rate with 95% CI",
    description:
      "A growth team runs five landing-page variants against the control and plots conversion rate with 95% confidence intervals. Variants C and D have nearly identical point estimates at 4.9% and 5.2%, but their CIs overlap heavily — declaring D the winner would be premature. The chart's job is to stop that premature declaration before it ships.",
  },
  elements: [
    {
      selector: "point-estimate",
      label: "Point estimate",
      explanation:
        "The bar height or centre tick is the sample mean — the single best guess from the data. It is never the whole story. Stripped of its whisker, it implies a precision the sample cannot deliver.",
    },
    {
      selector: "upper-bound",
      label: "Upper bound",
      explanation:
        "The top cap marks the upper end of the 95% confidence interval. Values above it are implausible given the sample, not impossible. The cap is there so the whisker's end is unambiguous — a line that just fades out loses its reading.",
    },
    {
      selector: "lower-bound",
      label: "Lower bound",
      explanation:
        "The bottom cap marks the lower end of the confidence interval. When a lower bound crosses a meaningful threshold — zero effect, a break-even rate, a safety floor — the chart is telling you the data cannot rule that threshold out.",
    },
    {
      selector: "whisker",
      label: "Whisker",
      explanation:
        "The vertical line between the caps is the confidence interval itself. Longer whiskers mean more uncertainty — usually from a smaller sample or noisier data. When two whiskers overlap, the difference between the two means might not be significant, which is often the most load-bearing observation on the chart.",
    },
    {
      selector: "x-axis",
      label: "X-axis",
      explanation:
        "The categorical axis names the groups being compared — variants, arms, segments. Order them deliberately: by effect size, by treatment intensity, or with the control pinned leftmost so the comparison anchor is always in the same place.",
    },
    {
      selector: "y-axis",
      label: "Y-axis",
      explanation:
        "The magnitude axis carries the estimated quantity and its unit. Start at zero when the ratio to zero is meaningful (conversion rates, proportions); start near the data when small differences in an absolute quantity carry the story. Always label the unit — a whisker in abstract numbers tells you nothing about whether the uncertainty is worth worrying about.",
    },
  ],
};
