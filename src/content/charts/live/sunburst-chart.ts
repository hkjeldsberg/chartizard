import type { LiveChart } from "@/content/chart-schema";

export const sunburstChart: LiveChart = {
  id: "sunburst-chart",
  name: "Sunburst Chart",
  family: "hierarchy",
  sectors: ["hierarchical"],
  dataShapes: ["hierarchical"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Two or more concentric rings where each ring is a level of a hierarchy and slice width is a share of the parent.",
  whenToUse:
    "Reach for a sunburst when the data is a tree and you want to show both the whole and its parts at every level in one figure. It's most useful when the hierarchy is shallow (two or three levels) and the reader should see how any leaf contributes to the root.",
  howToRead:
    "The rings themselves are the data. The inner ring splits the total into top-level categories by angular sweep; the next ring out splits each of those categories into its children using the same sweep rule. Read radially to move down the hierarchy, and circularly to compare siblings. A wide outer slice inside a wide inner slice is the sunburst's headline — one leaf is carrying a large share of one branch, and that branch is carrying a large share of the whole.",
  example: {
    title: "Global CO₂ emissions by region and country, 2024",
    description:
      "The inner ring splits ~37,000 Mt of CO₂ into five regions; the outer ring splits each region into its countries. Asia-Pacific's inner arc fills more than half the circle, and inside it one outer slice — China at ~11,000 Mt — fills more than half of that. That stacked dominance (one country inside one region accounting for roughly a quarter of global emissions) is the shape a stacked bar would compress into a single tall column.",
  },
  elements: [
    {
      selector: "inner-ring",
      label: "Inner ring",
      explanation:
        "The first level of the hierarchy. Each arc is a region; its angular sweep is the region's share of the root total. The inner ring is where you read top-level composition — before any country detail arrives.",
    },
    {
      selector: "outer-ring",
      label: "Outer ring",
      explanation:
        "The second level of the hierarchy. Each arc is a country, drawn directly outside its parent region and inheriting that region's tint. The outer ring only splits angles the inner ring has already granted, so widths here are shares within the parent, not the root.",
    },
    {
      selector: "slice",
      label: "Slice (China)",
      explanation:
        "A single leaf arc. China's slice takes about 55% of the Asia-Pacific sweep and roughly 24% of the full circle — the chart's clearest case of one leaf dominating both its branch and the whole.",
    },
    {
      selector: "angle",
      label: "Angular sweep",
      explanation:
        "Sweep encodes value. A slice that covers twice the arc carries twice the weight. Radial distance from the centre carries no quantity on its own; it only tells you which level of the hierarchy you are reading.",
    },
    {
      selector: "centre",
      label: "Centre",
      explanation:
        "The root of the hierarchy. The whole ring sums to this number, so any slice's share of the full circle is its share of this total. We print the total here as a reminder that the outer arcs are fractions of one quantity, not independent counts.",
    },
    {
      selector: "radial-level",
      label: "Radial level",
      explanation:
        "Distance from the centre selects a level of the tree, not a magnitude. Moving outward is moving down the hierarchy. This is the convention that makes a sunburst different from a polar area chart, where radius itself is the quantity.",
    },
  ],
};
