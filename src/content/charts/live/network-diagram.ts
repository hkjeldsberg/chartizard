import type { LiveChart } from "@/content/chart-schema";

export const networkDiagram: LiveChart = {
  id: "network-diagram",
  name: "Network Diagram",
  family: "relationship",
  sectors: ["networks"],
  dataShapes: ["network"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Draws entities as nodes and relationships as edges so the topology of a system — hubs, clusters, bridges — becomes visible at a glance.",
  whenToUse:
    "Use a network diagram when the question is about structure: who connects to whom, which nodes are central, where the communities sit. It is the right tool when the relationships themselves are the data, not a byproduct of some other measurement. Avoid it when you only have a handful of ties — a table is clearer — or when the graph is so dense that every node connects to every other, which is better shown as a matrix.",
  howToRead:
    "Read a node's position relative to the others, not in absolute coordinates: the layout encodes neighbourhood, and distances between unconnected nodes are meaningless. Node size here encodes degree — the count of connections — so the biggest dot is the best-connected character. Edge thickness encodes co-appearance frequency, so thicker lines mean the pair shared more scenes. Look first for hubs (a small number of large nodes that bind the graph) and then for clusters (groups that share many internal edges and few outside).",
  example: {
    title: "Les Misérables co-appearance network (Knuth, 1993)",
    description:
      "Donald Knuth's Les Misérables dataset records which characters appear in the same chapter across Hugo's novel. The co-appearance graph reveals two things at once: Jean Valjean is the central hub that every subplot touches, and the Thénardier family forms its own tight triangle mostly disjoint from the revolutionary students. The structure carries the story the plot itself already hints at.",
  },
  elements: [
    {
      selector: "hub",
      label: "Hub node",
      explanation:
        "The most-connected node in the graph. In a scale-free network a handful of hubs carry a disproportionate share of the edges. Here, Valjean is the hub: every other character relates to him more often than to anyone else.",
    },
    {
      selector: "node",
      label: "Node",
      explanation:
        "One entity in the graph — here, one character. The area of the circle is proportional to the node's degree (its count of edges), so well-connected characters draw the eye first. Keep the radius encoding monotone with a single quantity; mixing encodings makes the chart unreadable.",
    },
    {
      selector: "edge",
      label: "Edge",
      explanation:
        "A line between two nodes indicating they share a relationship. Thickness encodes co-appearance count: a thick line between Valjean and Javert means they share many scenes, which tracks with Javert's pursuit across the novel.",
    },
    {
      selector: "community",
      label: "Community",
      explanation:
        "A subgroup of nodes more densely connected to each other than to the rest of the graph. The Thénardier cluster — Thénardier, his wife, and Éponine — shares internal ties that have little overlap with the student revolutionaries, so the eye separates them even without explicit grouping.",
    },
    {
      selector: "layout",
      label: "Layout",
      explanation:
        "Placement in a network diagram is itself an encoding. This chart uses a hand-laid radial layout: Valjean at the centre, primary ties on the inner ring, and outer-ring characters grouped near the neighbour they matter to most. A force-directed layout would produce something similar but drift slightly between renders, so we fix the positions.",
    },
  ],
};
