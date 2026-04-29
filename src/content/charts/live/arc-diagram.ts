import type { LiveChart } from "@/content/chart-schema";

export const arcDiagram: LiveChart = {
  id: "arc-diagram",
  name: "Arc Diagram",
  family: "relationship",
  sectors: ["networks"],
  dataShapes: ["network"],
  tileSize: "W",
  status: "live",
  synopsis:
    "Lays a network along a single horizontal spine and draws each relationship as a semicircular arc above it, so connection patterns can be read like a strip of music.",
  whenToUse:
    "Reach for an arc diagram when a network has a natural or editorial ordering — characters in a novel, commits along a timeline, stations along a line — and you want the reader to see pair-wise relationships without the drift of a force-directed layout. The 1D spine makes arc density scannable and makes community structure visible as bundles of nearby arcs. Avoid it when the graph is so dense that arcs overlap into a blur, or when no ordering of nodes produces a legible pattern.",
  howToRead:
    "Start at the baseline: each dot is one node, read left to right. Every arc above the line joins two nodes into a single relationship, and the arc's width encodes how often that pair appears together. Short arcs are nearby ties; long arcs are cross-cutting ones that bridge distant parts of the sequence. A local thicket of many short arcs means the nodes in that stretch form a community. The node sequence is the entire editorial argument of the chart — reorder the nodes and the same edges tell a different story.",
  example: {
    title:
      "Les Misérables co-appearances (Knuth, 1993) — the canonical arc-diagram dataset",
    description:
      "Plotting Knuth's co-appearance counts for Hugo's Les Misérables as an arc diagram is the example that the d3 gallery made famous. Ordered by community — Digne prologue, Valjean's early arc, the Thénardier family, and the ABC barricade students — the chart shows Valjean's arcs fanning to every cluster while the students' arcs bundle locally, a structural reading of the novel no scatter of nodes could produce.",
  },
  elements: [
    {
      selector: "node",
      label: "Node",
      explanation:
        "One entity on the baseline — here, one character. Dot size encodes degree, the count of arcs touching this node, so the most connected characters draw the eye first. Valjean is the widest-radiating node: every community in the story bends an arc toward him.",
    },
    {
      selector: "arc",
      label: "Arc",
      explanation:
        "A semicircular line joining two nodes represents one pairwise relationship — here, how often that pair appears in the same chapter. The span of the arc equals the horizontal distance between the two nodes, so long arcs necessarily rise higher and shout louder visually than short ones.",
    },
    {
      selector: "baseline",
      label: "Baseline",
      explanation:
        "The horizontal spine that carries the node sequence. Unlike a force-directed layout, the baseline gives every render the same shape — no per-tick drift, no simulation noise. It also lets the reader look up any node by scanning left to right, the way they would read a list.",
    },
    {
      selector: "cluster",
      label: "Arc bundle",
      explanation:
        "A locally dense bundle of short arcs means the adjacent nodes share many ties with each other and relatively few with outsiders — a community. The Thénardier family cluster here is the clearest bundle in the chart: three characters tied to each other far more than to anyone else.",
    },
    {
      selector: "node-order",
      label: "Node ordering",
      explanation:
        "The chart's most important decision. Any permutation of the nodes produces a valid arc diagram but the readability varies wildly: order by community and clusters emerge as bundles; order alphabetically and you get a tangle. Authors usually sort by graph partition or by timeline so the pattern the reader sees is the pattern the author wants read.",
    },
    {
      selector: "arc-width",
      label: "Arc-width legend",
      explanation:
        "Stroke width encodes the weight of the relationship — co-appearance count here. Without the legend the chart is still readable as a connection pattern, but the viewer cannot distinguish a Valjean-Cosette arc (heavy, central) from an incidental brush-past. Always label the weight encoding.",
    },
  ],
};
