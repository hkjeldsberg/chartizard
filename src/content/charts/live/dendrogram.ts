import type { LiveChart } from "@/content/chart-schema";

export const dendrogram: LiveChart = {
  id: "dendrogram",
  name: "Dendrogram",
  family: "hierarchy",
  sectors: ["hierarchical", "biology"],
  dataShapes: ["hierarchical"],
  tileSize: "L",
  status: "live",
  synopsis:
    "A tree whose vertical axis carries data — the height at which two branches merge equals how different the merged clusters are.",
  whenToUse:
    "Reach for a dendrogram when you need to show the output of hierarchical clustering: which items group together, at what level of (dis)similarity, and which grouping a chosen cut-off would produce. A plain tree chart can't answer those questions because its y-axis is purely ordinal.",
  howToRead:
    "Leaves sit along the bottom, one per item. Trace each item up until it meets a sibling at a horizontal bar — that bar's y-coordinate is the dissimilarity at which the two clusters merged. A short bar means near-identical neighbours; a tall bar means forcing distant clades together. Draw a horizontal line at any height to read off the clusters you would keep if you stopped agglomerating there.",
  example: {
    title: "Clustering 12 mammals by trait similarity",
    description:
      "Given trait vectors for Wolf, Dog, Coyote, Fox, Cat, Lion, Tiger, Bear, Panda, Horse, Zebra, and Donkey, agglomerative clustering merges Wolf+Dog first (h≈0.1) and fuses canids with felids at h≈1.5 to recover Carnivora. Cutting at h=1.5 separates Carnivora from ungulates+ursids — the classic family-level read. The same algorithm on gene-expression data underlies most heatmaps in molecular biology journals.",
  },
  elements: [
    {
      selector: "leaf",
      label: "Leaf",
      explanation:
        "One original item (here, one species). Leaves sit at height 0 along the bottom. Their horizontal order is chosen to minimise crossings and carries no ranking — swapping two leaves under the same parent preserves the clustering.",
    },
    {
      selector: "merge-point",
      label: "Merge point",
      explanation:
        "Where two sub-clusters fuse into one. The horizontal bar connects the two children; its y-coordinate records the dissimilarity at which the merge happened. Everything below the bar is a single cluster for every cut above it.",
    },
    {
      selector: "branch-height",
      label: "Branch height",
      explanation:
        "The vertical distance from a merge-point down to its children encodes how different the two sub-clusters are. Long branches = forced marriages; short branches = near-identical neighbours. This is the one axis on a dendrogram that's actually data.",
    },
    {
      selector: "cut-line",
      label: "Cut line",
      explanation:
        "A dashed horizontal reference at a chosen dissimilarity. Every vertical line it crosses becomes one cluster. Here the cut at h=1.5 separates Carnivora from the ursids+equids cluster, recovering mammalian families.",
    },
    {
      selector: "y-axis",
      label: "Y-axis (dissimilarity)",
      explanation:
        "The axis carries a real metric — Euclidean distance, 1-correlation, Ward's criterion, whatever the clustering used. Never omit the y-axis on a dendrogram; without it the chart collapses to a plain tree and loses its reason to exist.",
    },
    {
      selector: "root",
      label: "Root",
      explanation:
        "The final merge at the top — all items eventually join one cluster. Its height is the largest dissimilarity observed and caps the y-axis domain. A very tall root relative to the rest of the tree signals at least one distant outlier group.",
    },
  ],
};
