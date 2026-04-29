import type { LiveChart } from "@/content/chart-schema";

export const stripPlot: LiveChart = {
  id: "strip-plot",
  name: "Strip Plot",
  family: "distribution",
  sectors: ["statistics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Plots every observation on a one-dimensional line per category, letting marks collide and overdraw rather than separating them.",
  whenToUse:
    "Reach for a strip plot when the sample is small enough that overlap is rare, or when the overplot is itself the point you want to make. Against a jitter plot it trades readability of individual dots for an unambiguous category axis — a strip mark that lands on the line is about that category and nothing else. Choose the jitter plot when you need to resolve individuals; choose the strip plot when honesty about density beats resolution of single points.",
  howToRead:
    "Each short horizontal tick is one observation, drawn on the category's centre line. Vertical position encodes the value. Where ticks stack on top of each other, the ink compounds and the line thickens — that thickening is the only density cue the strip plot offers. A strip with a dark middle band and a few lone ticks above it is a tight distribution with scattered outliers; a strip that is uniformly grey top to bottom is high variance.",
  example: {
    title: "Pew Research online-panel response times, collapsed onto the category line",
    description:
      "Take the same response-time table a jitter plot would spread sideways — 30 respondents times four question types — and draw it as a strip plot. The multiple-choice column becomes a near-solid black bar between 6 and 15 seconds. That bar is the chart saying: there are more points here than you can see, and the appropriate answer is a density plot or a jitter, not more ink. The strip plot's job in the catalogue is to show readers why the jitter plot exists.",
  },
  elements: [
    {
      selector: "strip-mark",
      label: "Strip mark",
      explanation:
        "One short horizontal tick equals one observation, drawn on the category's 1-D centre line. Unlike a scatter plot dot, a strip mark's horizontal position carries no information — every tick for a category shares the same x.",
    },
    {
      selector: "overdraw",
      label: "Overdraw region",
      explanation:
        "Where multiple ticks land at the same y-value they stack on top of each other. With a semi-transparent stroke the compounded ink darkens and the line thickens, which is the chart's only density signal. Past a certain sample size the overdraw saturates and the strip plot can no longer distinguish 'many' from 'very many' — that is the moment to switch to a jitter plot, violin, or histogram.",
    },
    {
      selector: "tail",
      label: "Tail observation",
      explanation:
        "An isolated tick above or below the darkened band is a single respondent far from the rest of the group. Strip plots are good at calling these out because the mark sits alone on the line — there is no jittered cloud around it to hide in.",
    },
    {
      selector: "category-strip",
      label: "Category strip",
      explanation:
        "The invisible vertical line at the centre of each category band. All of that category's observations live on this line — the strip is what makes the plot one-dimensional per group. A strip plot with marks drifting sideways off the line is mis-drawn; if you want horizontal spread, switch chart types.",
    },
    {
      selector: "x-axis",
      label: "X-axis (category)",
      explanation:
        "One strip per category. Order the strips meaningfully — by median, by natural ordering, or by sample size — so the reader can trace a progression across the axis instead of scanning four independent columns.",
    },
    {
      selector: "y-axis",
      label: "Y-axis (value)",
      explanation:
        "The single continuous axis the observations sit on. Keep it shared across every strip so tick heights are directly comparable between categories.",
    },
  ],
};
