import type { LiveChart } from "@/content/chart-schema";

export const lorenzCurve: LiveChart = {
  id: "lorenz-curve",
  name: "Lorenz Curve",
  family: "distribution",
  sectors: ["economics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Plots the cumulative share of a resource against the cumulative share of the population to make inequality visible as a sag below the diagonal.",
  whenToUse:
    "Use a Lorenz curve whenever you need to compare how evenly a finite quantity — income, wealth, land, CPU time, test-score points — is distributed across a population. It answers one precise question: what fraction of the total does the bottom X% hold?",
  howToRead:
    "Sort the population from poorest to richest along the x-axis; plot the cumulative share of the resource each slice holds along the y-axis. A perfectly equal distribution traces the 45° diagonal from (0,0) to (1,1); any real distribution sags below it. The deeper the sag, the sharper the inequality. Twice the area between curve and diagonal is the Gini coefficient — the chart contains the statistic directly.",
  example: {
    title: "US household income, 2010s–2020s (Gini ≈ 0.41)",
    description:
      "The Census Bureau reports a Gini near 0.41 for US household income through the 2010s and into the 2020s. On a Lorenz curve that means the bottom half of earners capture roughly a fifth of total income while the top decile captures over a quarter. Max Lorenz introduced the construction in 1905 precisely so distributional claims could be argued from one picture instead of a table of quantiles.",
  },
  elements: [
    {
      selector: "gini-area",
      label: "Gini area",
      explanation:
        "The shaded region between the diagonal and the curve. Its area, doubled, equals the Gini coefficient — so the chart is not just an illustration of inequality, it is the statistic. An area of zero is perfect equality; an area approaching 1/2 is one person holding everything.",
    },
    {
      selector: "equality-line",
      label: "Equality line",
      explanation:
        "The 45° diagonal from (0,0) to (1,1). It represents the hypothetical world where the bottom X% of the population always holds exactly X% of the resource. Every Lorenz curve is read relative to this reference — without it, the curve is just a monotone shape.",
    },
    {
      selector: "lorenz-curve",
      label: "Lorenz curve",
      explanation:
        "The cumulative-share curve itself. It is monotonically increasing and convex: each additional person adds at least as much to the running total as the previous one, because the population is sorted poorest-first. A straighter curve means a flatter distribution; a curve that hugs the bottom-right corner means most of the resource sits with the last few percent of the population.",
    },
    {
      selector: "bottom-half-point",
      label: "Bottom-50% reading",
      explanation:
        "Any point on the curve answers one quantile question directly. Here, the bottom 50% of earners capture about 21% of total income — the y-value at x = 0.5. The same trick works for any x: the 99th-percentile reading, lifted from this chart, is how press coverage quantifies top-decile income share.",
    },
    {
      selector: "corner",
      label: "Closing corner (100%, 100%)",
      explanation:
        "Every Lorenz curve must start at (0, 0) and end at (1, 1) — by definition, 100% of the population holds 100% of the resource. A curve that fails to close at the corner is either mislabelled or not a Lorenz curve.",
    },
    {
      selector: "axes",
      label: "Axis labels",
      explanation:
        "Both axes run from 0 to 1 (or 0% to 100%) and carry the same semantics: cumulative share. The x-axis is the cumulative share of the population, ordered poorest to richest; the y-axis is the cumulative share of the resource those people hold. Swap either ordering and the chart breaks.",
    },
  ],
};
