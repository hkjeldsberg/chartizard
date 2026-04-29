import type { LiveChart } from "@/content/chart-schema";

export const chordDiagram: LiveChart = {
  id: "chord-diagram",
  name: "Chord Diagram",
  family: "relationship",
  sectors: ["networks"],
  dataShapes: ["network"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Arranges a set of entities around a circle and draws ribbons between them so every pairwise relationship, plus each entity's total, can be read at once.",
  whenToUse:
    "Reach for a chord diagram when you have bidirectional flows between a small set of entities — six to twelve is the sweet spot — and you want the reader to see both the individual pairs and each entity's total weight in the same glance. It outperforms an adjacency matrix when the matrix would be sparse and the eye needs to follow specific pairs. Avoid it when more than about fifteen entities are involved, or when flows are directed and asymmetric — a Sankey handles that better.",
  howToRead:
    "Start with an arc segment on the ring: its length is that country's total across all pairs, so the biggest arc is the biggest trader. Then follow a ribbon from one arc to another; its width at each end is the flow for that pair. Ribbons between two arcs are symmetric in this dataset — pair totals, not directed exports — so the two endpoints are the same width. Read the whole ring for dominance (one country may take more than a third of the circle), then drill into pairs to see which relationships carry that dominance.",
  example: {
    title: "Bilateral merchandise trade between six major economies, 2024",
    description:
      "Plotting 2024 pair-wise goods trade for USA, China, EU, Japan, Mexico, and Canada on a chord diagram shows what a table of fifteen numbers cannot: the USA's arc is by far the largest, and its two thickest ribbons run to the EU and to its North American neighbours — a visual argument that USA-Canada-Mexico remains a more integrated bloc than any single transpacific relationship.",
  },
  elements: [
    {
      selector: "arc-segment",
      label: "Arc segment",
      explanation:
        "Each entity gets one arc on the ring. Its arc length is proportional to that entity's total across all of its pairs. The biggest arc (USA here) is the most-connected participant by volume, which answers the headline comparative question before you read any ribbon.",
    },
    {
      selector: "ribbon",
      label: "Ribbon",
      explanation:
        "A ribbon connects two arcs and represents the flow between that pair of entities. Track it from one arc to the other to read one pairwise relationship at a time. The USA–China ribbon, for instance, is one specific pair — thick, but not the thickest.",
    },
    {
      selector: "ribbon-width",
      label: "Ribbon width",
      explanation:
        "The endpoint width of a ribbon encodes the magnitude of that pair's flow. A fat endpoint means the pair carries a lot of volume relative to other pairs. Widths are in the same units as the arc itself, so a ribbon occupying half an arc's length means that single pair accounts for half that entity's total.",
    },
    {
      selector: "symmetry",
      label: "Symmetry",
      explanation:
        "In a pair-total chord diagram the two ends of a ribbon are equal width: the USA–China ribbon is the same thickness on both the USA arc and the China arc. If you need to show directed asymmetry — exports vs. imports, for example — a Sankey or a directed chord variant is the right choice instead.",
    },
    {
      selector: "total-trade",
      label: "Ring total",
      explanation:
        "The sum of all arc lengths equals twice the total flow in the dataset, because every flow is counted at both of its endpoints. You can read the chart as a budget: each entity's arc is its share of the world the chart describes.",
    },
    {
      selector: "category-label",
      label: "Category label",
      explanation:
        "Labels sit outside the ring next to each arc, rotated so they read outward. A chord diagram's labels matter more than in a bar chart — there are no axes, so the only way to name the entity is at its arc.",
    },
  ],
};
