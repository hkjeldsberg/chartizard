import type { LiveChart } from "@/content/chart-schema";

export const convexTreemap: LiveChart = {
  id: "convex-treemap",
  name: "Convex Treemap",
  family: "hierarchy",
  sectors: ["hierarchical"],
  dataShapes: ["hierarchical"],
  tileSize: "L",
  status: "live",
  synopsis:
    "A treemap that keeps the hierarchy's sizing rule but drops the grid — each cluster is wrapped in a convex hull with visible whitespace between neighbours.",
  whenToUse:
    "Reach for a convex treemap when you want a treemap's at-a-glance size comparison without the claim that clusters tile the plane. The rectangles of a squarified treemap imply adjacency is meaningful; the hulls of a convex treemap say the opposite. Use it when the groups come from an embedding or a clustering algorithm, where there is no 'correct' rectangular partition and the inter-cluster gap is part of the data.",
  howToRead:
    "Read each hull as a cluster and each circle inside it as a leaf whose area is proportional to its value. The hull is the cluster's silhouette, nothing more — neither its area nor its perimeter encodes anything. The whitespace between hulls is deliberate: it is the chart's rejection of the squarified treemap's space-filling contract, trading packing efficiency for a cleaner statement of group boundaries.",
  example: {
    title: "Bundle composition of a modern React monorepo",
    description:
      "Four clusters — React ecosystem, Testing, Build, Linting — each wrapped in a convex hull drawn around its packaged leaves. react-dom dominates its cluster as a large circle; typescript and jsdom are the heaviest leaves in their respective hulls. The chart makes two statements at once: that the React hull is the single largest region, and that the gaps between hulls are not wasted pixels but a claim about cluster identity. A squarified treemap would show the same ratios but force the four clusters into adjacent rectangles, implying a spatial relationship the data does not have.",
  },
  elements: [
    {
      selector: "hull",
      label: "Convex hull",
      explanation:
        "The polygon wrapping each cluster's leaves. It is computed by a Graham scan over the leaves' bounding-box corners and expanded slightly so no leaf circle clips the boundary. The hull is a grouping device — it marks which leaves belong together — not an encoding. Hull area does not represent cluster value; sum the leaves for that.",
    },
    {
      selector: "leaf",
      label: "Leaf",
      explanation:
        "One circle, one data point at the bottom of the hierarchy — here, one npm package. Circle area is proportional to its value (bundle-size in KB). Squarified treemaps use rectangles for the same job; circles read better inside a non-rectangular hull.",
    },
    {
      selector: "size",
      label: "Size encoding",
      explanation:
        "The radius of each leaf circle is scaled by the square root of its value so the area is linearly proportional. react-dom is 132 KB and roughly three times the area of a 42 KB package — the eye should register that ratio without reading any label. Radius-proportional-to-value would exaggerate large leaves and is the classic area-encoding mistake.",
    },
    {
      selector: "whitespace",
      label: "Inter-hull whitespace",
      explanation:
        "The gap between hulls is the chart's whole distinguishing feature. A squarified treemap has zero whitespace by construction; a convex treemap reserves it to say 'these clusters are separate, not adjacent'. Use it when the hierarchy comes from a clustering step where spatial proximity in the chart would be a lie.",
    },
    {
      selector: "cluster-label",
      label: "Cluster label",
      explanation:
        "Each cluster is named near its centroid. Labels sit outside the data layer so they stay at full opacity in Explain mode. The labels exist because the hulls alone do not carry enough identity — a blob of circles is not a category until you name it.",
    },
    {
      selector: "dominant-cluster",
      label: "Dominant cluster",
      explanation:
        "The React ecosystem hull is the largest of the four, driven by react-dom's 132 KB. A bar chart of cluster totals would show the same number; this chart adds the texture of why — one big leaf inside a ring of small ones, versus clusters whose weight comes from three or four mid-sized leaves. The hull's shape carries that sub-structure implicitly.",
    },
  ],
};
