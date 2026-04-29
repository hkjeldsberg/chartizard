import type { LiveChart } from "@/content/chart-schema";

export const treemap: LiveChart = {
  id: "treemap",
  name: "Treemap",
  family: "hierarchy",
  sectors: ["hierarchical"],
  dataShapes: ["hierarchical"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Nested rectangles whose area encodes a quantity, letting one chart show both a hierarchy and the relative size of every leaf.",
  whenToUse:
    "Reach for a treemap when you have a strict parent-child hierarchy and a single additive numeric value at the leaves — budgets, market caps, disk usage, portfolio holdings. The treemap earns its keep when you need the viewer to see sector totals AND the individual leaves in the same glance; if you only need one level, a bar chart is honest and a treemap is a stunt.",
  howToRead:
    "Area is the encoding — a rectangle twice as large holds twice as much of whatever the chart is measuring. Parent groups share a colour band, so the eye can gather a sector together and compare it to another. The squarified layout places the largest leaf at the top-left of each group, so the visual hierarchy reads like a newspaper column. Ignore absolute positions and read the relative sizes.",
  example: {
    title: "S&P 500 by sector and company — market cap, 2024",
    description:
      "Eight sector blocks sized by total market cap, each subdivided into its largest constituents. Technology is not a little bigger than its neighbours; it is roughly half the entire chart, with Apple, Microsoft, and Nvidia each larger than whole sectors like Energy or Industrials. The treemap is the cleanest way to show that kind of lopsided dominance because the shape itself is the argument — any bar chart flattens the fact that a single leaf can dwarf a sector.",
  },
  elements: [
    {
      selector: "leaf",
      label: "Leaf",
      explanation:
        "One leaf rectangle, one data point at the bottom of the hierarchy. Here, one company. Its area is proportional to its market cap — the Apple tile is the largest single rectangle in the chart.",
    },
    {
      selector: "branch",
      label: "Branch",
      explanation:
        "A whole parent group, in this case one S&P sector. The branch's total area is the sum of its leaves, so 'how big is Technology?' is answered by its block size, not by counting the companies inside it.",
    },
    {
      selector: "colour",
      label: "Colour band",
      explanation:
        "Sectors share a tint so the eye can gather their companies into one visual group. Colour here is categorical and decorative — it is not encoding a second value, despite how much every dashboard treats it that way.",
    },
    {
      selector: "size",
      label: "Size",
      explanation:
        "Rectangle area encodes market cap. This is the only quantitative channel the chart uses; labels and colour exist only to make the hierarchy legible. Humans read area worse than length, so a treemap trades precision for the ability to show thousands of leaves in one view.",
    },
    {
      selector: "label",
      label: "Label",
      explanation:
        "Company names are drawn inside leaves large enough to hold them. Small leaves get no label — that is intentional. Labelling every rectangle turns the chart into a text grid and defeats the point of the encoding.",
    },
    {
      selector: "dominant-branch",
      label: "The Technology block",
      explanation:
        "The visual punchline of this specific treemap. Tech's share of the S&P 500 is large enough that any other chart type — stacked bar, pie, table — understates it. Here it takes up as much room as it deserves, and the viewer does not need a single number to see why.",
    },
  ],
};
