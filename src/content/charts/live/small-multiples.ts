import type { LiveChart } from "@/content/chart-schema";

export const smallMultiples: LiveChart = {
  id: "small-multiples",
  name: "Small Multiples / Trellis",
  family: "comparison",
  sectors: ["general", "statistics"],
  dataShapes: ["continuous"],
  tileSize: "W",
  status: "live",
  synopsis:
    "A grid of miniature charts that share axes so differences between panels are the read, not the panels themselves.",
  whenToUse:
    "Reach for small multiples when one chart has too many series to separate cleanly, and when the comparison across series is the question. Shared axes do the work — the grid layout puts nine trajectories in front of the eye at once, and divergence from the common shape is what you see.",
  howToRead:
    "Scan the grid as one image. Every panel shares the same x and y scales, so a line sitting higher or spiking taller than its neighbours is genuinely higher or spikier — not an artefact of panel-specific scaling. Read the trellis convention on the outer edges: y-axis ticks appear only on the first column, x-axis ticks only on the bottom row. The point is to demote the axes so the shapes can be compared.",
  example: {
    title: "US state unemployment, 2008—2024",
    description:
      "Nine states, one monthly series each, aligned on a common scale from 2 percent to 18 percent. The 2008-09 recession shows up as a broad hump in every panel; the April-2020 COVID shock is a sharp spike. Michigan's recession hump and unemployment spikes dwarf Texas's in the same layout — that contrast is legible only because the y-axes agree. Tufte: small multiples are at once the most analytical and the most universal of design formats.",
  },
  elements: [
    {
      selector: "panel",
      label: "Panel",
      explanation:
        "One miniature chart in the grid. Each panel carries the full time series for a single state. Panels are small on purpose — detail is sacrificed to make the across-panel comparison easy.",
    },
    {
      selector: "panel-label",
      label: "Panel label",
      explanation:
        "The state code identifies the panel without consuming plot area. Short labels matter at this scale — a long title would crowd out the chart itself.",
    },
    {
      selector: "shared-scale",
      label: "Shared scale",
      explanation:
        "The y-axis ticks live only on the first column, and every panel inherits the same 0-to-18-percent domain. This is the rule that makes the trellis work — if each panel auto-scaled to its own data, a mild state and an extreme state would look identical.",
    },
    {
      selector: "covid-spike",
      label: "COVID spike (April 2020)",
      explanation:
        "A dashed vertical reference drops through every panel at April 2020. Because the x-axis is shared, the same feature lands at the same horizontal position in all nine panels — the eye can trace it across the grid without reorienting.",
    },
    {
      selector: "diverging-series",
      label: "Diverging series",
      explanation:
        "Michigan's recession and COVID peaks climb far above the grid average. The shared scale is what makes that divergence obvious — the panel's line visibly breaks the envelope that the other eight share.",
    },
    {
      selector: "grid",
      label: "Grid layout",
      explanation:
        "The 3×3 arrangement is a design choice, not a data choice. Rows and columns carry no meaning here; the grid exists to fit nine panels in a scanable image. Ordering panels by a variable (median rate, geography) would turn the grid into a second encoding.",
    },
  ],
};
