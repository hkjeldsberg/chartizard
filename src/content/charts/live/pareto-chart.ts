import type { LiveChart } from "@/content/chart-schema";

export const paretoChart: LiveChart = {
  id: "pareto-chart",
  name: "Pareto Chart",
  family: "comparison",
  sectors: ["quality"],
  dataShapes: ["categorical"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Ranked bars paired with a cumulative percentage line to surface the vital few causes driving most of the effect.",
  whenToUse:
    "Use a Pareto chart whenever you need to decide where to spend finite attention on a long list of causes. Quality teams reach for it when triaging defects, support teams when categorising tickets, and operations when ranking incidents. A plain ranked bar chart tells you which category is biggest; a Pareto adds the cumulative line that answers 'how many categories do I have to fix to cover 80% of the problem?'.",
  howToRead:
    "Bars are sorted descending by count and read against the left-hand value axis. The cumulative percentage line rises with each bar and is read against the right-hand percentage axis. The steep early climb is the chart's headline: where the line crosses 80% is your budget line. Everything to the left of that crossover is the vital few and deserves engineering effort; everything to the right is the long tail and usually isn't worth a targeted fix.",
  example: {
    title: "Customer-support ticket sources, 30-day window",
    description:
      "A SaaS support team tags 1,230 tickets across a month. Login issues (420) and payment failures (310) alone clear 59% of volume; adding feature confusion (180) pushes cumulative past 73%. The Pareto makes the triage obvious: two auth/billing fixes and one onboarding clarification will eat three-quarters of future ticket load. The remaining five categories combined still don't equal the top bar on their own.",
  },
  elements: [
    {
      selector: "bar",
      label: "Bar",
      explanation:
        "One bar per cause, sorted descending by count. The length encodes volume. Sorting is the chart's defining property — an unsorted ranked-bar-plus-line is not a Pareto, it is just a dual-axis chart.",
    },
    {
      selector: "cumulative-line",
      label: "Cumulative line",
      explanation:
        "A monotonically rising line whose points sit above each bar and trace the running percentage of the total. The curve is steep early and flattens toward 100%; the shape of that bend is the story. Use a smoothed curve between points to emphasise the running-total reading, not a jagged connect-the-dots.",
    },
    {
      selector: "eighty-percent-crossover",
      label: "80% crossover",
      explanation:
        "The point where the cumulative line crosses 80% on the right axis. This is the chart's editorial anchor: the Pareto principle says roughly 80% of effects trace to 20% of causes, and this crossover is where you draw the line between the vital few and the long tail. It is visually marked with a dashed 80% reference so the decision is unambiguous.",
    },
    {
      selector: "left-axis",
      label: "Left axis (count)",
      explanation:
        "Absolute counts of each cause, the domain the bars are drawn against. Always starts at zero so bar length reads as magnitude.",
    },
    {
      selector: "right-axis",
      label: "Right axis (% cumulative)",
      explanation:
        "The cumulative percentage scale, bound to [0, 100]. The cumulative line plots against this axis, not the left one. Two y-axes on one chart is usually a smell, but a Pareto is one of the few cases where it is the correct encoding: the bars and the line measure different quantities sharing the same x-domain.",
    },
    {
      selector: "gridline",
      label: "Gridline",
      explanation:
        "Light horizontal references on the count axis. Keep them subtle — the 80% reference line is the one the reader should follow, and it is deliberately rendered darker than the gridlines to stand out.",
    },
    {
      selector: "x-axis",
      label: "Category axis",
      explanation:
        "One tick per cause, in descending-count order. The leftmost bar is always the largest; the ordering is not editorial, it is mandatory for the chart to read correctly.",
    },
  ],
};
