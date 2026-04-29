import type { LiveChart } from "@/content/chart-schema";

export const radialBarChart: LiveChart = {
  id: "radial-bar-chart",
  name: "Radial Bar Chart",
  family: "comparison",
  sectors: ["general"],
  dataShapes: ["categorical"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Categorical bars bent into concentric arcs — decorative silhouette, diminished accuracy.",
  whenToUse:
    "Reach for a radial bar chart when the brief is driven by aesthetics: dashboards that need a round focal point, year-in-review graphics, award annuals. Do not reach for one when the reader needs to rank categories precisely — the human eye compares straight lengths well and arc lengths poorly. A plain horizontal bar chart will beat this for analysis every time.",
  howToRead:
    "Each concentric band is one category. All arcs share the same angular origin (12 o'clock) and the same maximum sweep (the 100% reference ring). Read the length each arc travels around the circle as the value — longer sweep means larger quantity. Because arcs at larger radii are physically longer than arcs at smaller radii for the same value, rank by sweep angle, not by visible ink. The concentric layout compresses as the radius shrinks, which is why the innermost ring is always the hardest bar to read.",
  example: {
    title: "Chrome usage share across ten markets",
    description:
      "A marketing team profiling browser share in its top ten regions chose this layout for a campaign hero image, not a board deck. Reading rank order from the printed poster took longer than it would have from a bar chart, and two mid-rank regions were routinely swapped by readers. The silhouette did its job; the analysis did not.",
  },
  elements: [
    {
      selector: "longest-arc",
      label: "Longest arc",
      explanation:
        "The top-ranked category sweeps the furthest around the dial. On this layout, it sits on the outermost ring by convention — giving rank and visual prominence to the same arc, which is what makes the chart legible at all.",
    },
    {
      selector: "shortest-arc",
      label: "Shortest arc",
      explanation:
        "The bottom-ranked category. Placed on the innermost ring, its sweep is short and its radius is small, which makes small values disappear visually. A bar chart would show the same gap with far more honesty.",
    },
    {
      selector: "angular-origin",
      label: "Angular origin",
      explanation:
        "Every arc starts at 12 o'clock and grows clockwise. Anchoring all bars to the same origin is what makes length comparison possible at all — shift the origin per category and the chart becomes decorative noise.",
    },
    {
      selector: "category-label",
      label: "Category label",
      explanation:
        "Each ring needs a legible label because the reader cannot infer identity from position alone. Labels sit inside the open quadrant so they do not collide with the bars; a legend placed far from the arcs breaks the link between name and mark.",
    },
    {
      selector: "arc-length",
      label: "Arc-length encoding",
      explanation:
        "Sweep angle — not physical ink length or ring radius — is the value. This is the chart's central trade: the eye wants to compare ink, but the rule says compare angle. When the two disagree, the rule wins.",
    },
    {
      selector: "reference-ring",
      label: "100% reference ring",
      explanation:
        "A faint outer dashed ring marks the full 270° sweep. Without it the reader has no idea what a full bar looks like, and every arc becomes an undefined fraction of nothing.",
    },
  ],
};
