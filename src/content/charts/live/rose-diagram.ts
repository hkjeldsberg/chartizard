import type { LiveChart } from "@/content/chart-schema";

export const roseDiagram: LiveChart = {
  id: "rose-diagram",
  name: "Rose Diagram (Wind Rose)",
  family: "distribution",
  sectors: ["earth-sciences"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "A histogram where the axis is direction — petals grow outward from a true-north centre, stacked by a second variable like wind speed.",
  whenToUse:
    "Reach for a wind rose when the variable you care about is a bearing — wind, wave, fault, or paleocurrent direction. The polar layout preserves the geometry of the phenomenon so viewers can read prevailing direction the same way they'd orient a map.",
  howToRead:
    "Each petal points in the compass direction it describes; petal length is the fraction of hours the wind blew from that direction. Stack segments within a petal show the distribution of speeds: calm winds sit at the hub, strong winds ring the rim. The longest petal is the prevailing direction; a balanced rose with many short petals means the site sees wind from everywhere.",
  example: {
    title: "Oslo-Gardermoen airport, 12-month aggregate",
    description:
      "Airport meteorologists use wind roses to justify runway alignment — Gardermoen's runways run 01/19 (roughly N–S) because the historical rose shows a dominant S–SSW flow with a secondary N component. Wind-farm developers use the same chart to rank candidate sites: a site with a long, narrow petal in one direction delivers steadier power than one with a fat, round rose of equal total wind.",
  },
  elements: [
    {
      selector: "petal",
      label: "Petal",
      explanation:
        "One compass sector's stacked histogram. The petal's length is the total fraction of hours the wind blew from that bearing; the stacked segments split that fraction across speed bands. A petal that's all dark at the rim is a direction with rare but strong winds.",
    },
    {
      selector: "north-axis",
      label: "North axis",
      explanation:
        "The chart is oriented to true north, with the 12-o'clock spoke pointing up. Every other compass direction is read clockwise from N — a wind from the south grows a petal pointing down, not up.",
    },
    {
      selector: "radial-scale",
      label: "Radial scale",
      explanation:
        "Concentric rings mark frequency in percent of hours. The outermost ring is the ceiling of the whole chart, not a single petal's maximum — petals are drawn to the same scale so direction-to-direction comparisons are fair.",
    },
    {
      selector: "prevailing",
      label: "Prevailing direction",
      explanation:
        "The longest petal names the direction the wind most often comes from. At Gardermoen this is S–SSW, a consequence of the Skagerrak-to-Oslofjord pressure gradient and the valley's N–S alignment.",
    },
    {
      selector: "legend",
      label: "Speed-band legend",
      explanation:
        "Darker segments encode stronger winds (m/s). The ramp is monotone on purpose — rose diagrams live in monochrome field reports, and a colour-only encoding would collapse the moment the chart is printed.",
    },
  ],
};
