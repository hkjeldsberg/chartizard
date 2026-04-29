import type { LiveChart } from "@/content/chart-schema";

export const divergingBarChart: LiveChart = {
  id: "diverging-bar-chart",
  name: "Diverging Bar Chart",
  family: "comparison",
  sectors: ["general"],
  dataShapes: ["categorical"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Anchors a shared zero line in the middle of the plot so bars grow left for negative and right for positive — polarity is the primary encoding, magnitude the secondary.",
  whenToUse:
    "Use a diverging bar chart when the sign of a value matters as much as its size: approvals versus disapprovals, promoters versus detractors, profit versus loss, year-over-year gains versus losses. A standard bar chart places every bar on one side of a left-hand baseline, so the sign only shows up in a minus symbol; centring the zero axis lets direction register as shape, before the number is even read.",
  howToRead:
    "Find the centre line first — that's zero. Bars extending right are positive, bars extending left are negative; bar length encodes the absolute size of the deviation. Sort rows from most positive at the top to most negative at the bottom so vertical position doubles as a signed ranking: the top of the chart is where the signal is best, the bottom is where it's worst, and the visual crossover from one colour to the other marks the break-even row.",
  example: {
    title: "Net Promoter breakdown across seven survey questions",
    description:
      "A product team runs a customer survey and computes promoters minus detractors for each question. Quality of support lands at +42, product reliability at +28, pricing value at −12, integrations at −38. Plotted as a standard bar chart, the negative scores would render as downward or backward ticks that the eye has to decode; as a diverging bar chart, the centre line becomes the horizon — questions above the waterline are doing the work, questions below it are where customers want changes.",
  },
  elements: [
    {
      selector: "positive-bar",
      label: "Positive bar",
      explanation:
        "A bar extending right from the zero axis. Length encodes how strongly positive the score is; the shared centre means the top positive bar can be compared to the longest negative bar directly as a 'how lopsided is this' read, which a one-sided bar chart cannot offer.",
    },
    {
      selector: "negative-bar",
      label: "Negative bar",
      explanation:
        "A bar extending left from the zero axis. The separate colour is deliberate redundancy: length already encodes magnitude and direction encodes sign, but the colour shift keeps the polarity legible even when a bar is short enough that its side of zero is ambiguous.",
    },
    {
      selector: "zero-axis",
      label: "Zero axis",
      explanation:
        "The centre line that every bar grows from. It is the chart's anchor — always drawn, always solid, always on top of the gridlines. Remove it and a diverging bar chart collapses into two unrelated one-sided charts pushed together.",
    },
    {
      selector: "ranking",
      label: "Signed ranking",
      explanation:
        "Vertical order carries meaning when rows are sorted by signed magnitude. The top of the chart is the strongest positive, the bottom is the strongest negative, and the exact row where colour flips is the break-even line. That second-dimension ranking is free once the data is sorted — do not sort alphabetically and waste it.",
    },
    {
      selector: "category-label",
      label: "Category label",
      explanation:
        "The row label to the left of each bar. In a diverging bar chart the labels sit outside the plot area rather than on an axis, so the zero line can occupy the centre unobstructed. Labels should be left-aligned against the plot edge so the eye reaches them before scanning across to the bar.",
    },
    {
      selector: "axis-tick",
      label: "Axis tick",
      explanation:
        "A signed tick on the value axis. Ticks are drawn with explicit plus and minus signs so that the axis carries the sign-convention independently of the bars — a viewer can read the scale without having to infer polarity from colour.",
    },
  ],
};
