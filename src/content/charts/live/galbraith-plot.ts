import type { LiveChart } from "@/content/chart-schema";

export const galbraithPlot: LiveChart = {
  id: "galbraith-plot",
  name: "Galbraith Plot (Radial Plot)",
  family: "specialty",
  sectors: ["earth-sciences", "medicine"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",

  synopsis:
    "Displays heterogeneous-variance measurements as precision-weighted radial positions, making concordance and discordance visible at a glance.",

  whenToUse:
    "Use the Galbraith plot when the measurements share the same quantity but carry very different analytical uncertainties — fission-track single-grain ages, radiometric dates from grains with variable track counts, or effect sizes across studies with unequal sample sizes. The plot shows whether the scatter is consistent with the quoted uncertainties or whether real heterogeneity (multiple age populations, true effect-size differences) is present.",

  howToRead:
    "The horizontal axis is precision, 1/σᵢ: precise measurements plot to the right, imprecise ones to the left. The vertical axis is the standardised residual (θᵢ − θ̄)/σᵢ. A measurement plots as a point; the line from the origin to that point is a radial 'ray', and its slope encodes the raw θ value — read off the angular data-scale arc on the right edge. When all measurements sample the same true θ, the points fan out along the horizontal axis near y = 0. Dashed lines at y = ±2 mark the 95% concordance band; points outside are discordant at the 2σ level.",

  example: {
    title: "Hurford & Green fission-track interlaboratory comparison, 1982",
    description:
      "Galbraith developed the radial plot specifically to display fission-track ages measured on single zircon grains from the Fish Canyon Tuff, where individual grain ages ranged from 20 to 1000 tracks — a fifty-fold range in counting precision. On a conventional age histogram the imprecise grains smear the distribution and obscure the population structure; on the radial plot they simply plot near the left (low-precision) edge and contribute little visual weight, while the tight cluster of high-precision grains at the right edge drives the age estimate.",
  },

  elements: [
    {
      selector: "x-axis",
      label: "Precision axis (1/σᵢ)",
      explanation:
        "The horizontal axis plots analytical precision, not time or age. Precise measurements — grains with many fission tracks, studies with large samples — sit to the right. Imprecise measurements sit to the left. This axis is the key innovation of Galbraith's 1988 paper: by spreading measurements by precision rather than age, the plot decouples uncertainty from estimate.",
    },
    {
      selector: "sigma-lines",
      label: "±2σ concordance band",
      explanation:
        "Dashed horizontal lines at y = +2 and y = −2. A measurement falling between these lines is concordant with the weighted mean at the 95% level. Points outside the band are discordant — they deviate from the central estimate by more than two standard errors of their own quoted uncertainty. The width of the band is fixed at ±2 regardless of n; it is not a confidence interval on the mean.",
    },
    {
      selector: "data-scale-arc",
      label: "Data-scale arc",
      explanation:
        "The vertical tick line on the right edge is the angular data scale. Each tick corresponds to a θ value; the radial line from the origin through that tick gives the direction in which measurements of that age would plot. Reading it: extend a straight line from the origin (left-bottom corner, where x = 0 and y = θ̄) through any data point to the right edge — the tick it hits is the approximate raw age of that grain.",
    },
    {
      selector: "concordant-point",
      label: "Concordant point",
      explanation:
        "A high-precision grain (grain 5, ~188 Ma, σ = 12 Ma) plots near the right side of the x-axis and close to y = 0, confirming its estimate agrees with the weighted mean within its own uncertainty. The grains near 200 Ma form a tight cluster here, confirming a single Triassic–Jurassic reset age population.",
    },
    {
      selector: "common-age-line",
      label: "Common-age radial line",
      explanation:
        "The solid horizontal line at y = 0 is the 'common-age direction' — the radial whose slope encodes the weighted-mean age θ̄. If all grains shared the exact same true age, every point would lie precisely on this line regardless of precision. Departures from this line are the standardised residuals that form the plot's diagnostic signal.",
    },
    {
      selector: "outlier-point",
      label: "Outlier point",
      explanation:
        "Grain 12 (∼790 Ma, σ = 70 Ma) plots far above the concordance band at y ≫ 2. Its radial direction points toward 800 Ma on the data scale. Geologically, this is an inherited detrital zircon that survived partial annealing; its fission-track clock was not fully reset when the host sediment was buried. One such outlier is diagnostic — it rules out a simple single-population reset model.",
    },
  ],
};
