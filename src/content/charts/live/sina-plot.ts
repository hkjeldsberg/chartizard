import type { LiveChart } from "@/content/chart-schema";

export const sinaPlot: LiveChart = {
  id: "sina-plot",
  name: "Sina Plot",
  family: "distribution",
  sectors: ["statistics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "A violin plot where the density controls the width of the jitter — the outline is gone but the ink is the data.",
  whenToUse:
    "Reach for a sina plot when you want the shape of a violin and the individual records of a beeswarm in the same frame. It is the right compromise when n per category is 20-200: large enough for density to mean something, small enough that every observation still deserves to be drawn.",
  howToRead:
    "Each category has a centre spine. Each observation is one dot placed at its true value on the y-axis; its horizontal offset is a uniform jitter scaled by the kernel-density estimate at that value. Where the distribution is dense the cloud bulges outward; where it is sparse the cloud pinches in toward the spine. The silhouette is the violin; the pixels are the data.",
  example: {
    title: "Sidiropoulos et al, F1000Research 2016 — SinaPlot",
    description:
      "Named after Sina Hadi Sohi, the chart was introduced by Sidiropoulos et al in 'SinaPlot: an enhanced chart for simple and truthful representation of single observations over multiple classes' (F1000Research, 2016). The motivating example in the paper is flow-cytometry marker expression per cell subtype — boxplots lost every cell, violins hid how few cells were in rare subtypes, and a jitter was an unreadable stripe. The sina kept every cell and made the density of each subtype's expression legible at a glance.",
  },
  elements: [
    {
      selector: "sina-point",
      label: "Sina point",
      explanation:
        "One observation, drawn at its true y-value. Unlike a violin the mark is a record, not a density sample; unlike a jitter plot its horizontal offset is not uniform — it is scaled so that each dot lands inside the density shape it belongs to.",
    },
    {
      selector: "density-jitter",
      label: "Density-scaled jitter",
      explanation:
        "The horizontal offset of each point is a uniform random draw on [-1, 1] multiplied by the kernel-density estimate at that point's y-value, normalised against the tallest density in the chart. The result: dense strata spread wide, sparse tails huddle the spine. The cloud's outline, if you traced it, is the violin — minus the stroke.",
    },
    {
      selector: "category-spine",
      label: "Category spine",
      explanation:
        "The centre line of each group. It is not data — it is the axis the jitter pivots around, and without it the viewer reads the horizontal spread as a second encoding. Keep it faint so the cloud dominates.",
    },
    {
      selector: "x-axis",
      label: "X-axis (category)",
      explanation:
        "One sina cloud per group. Order categories the same way you would for a violin or a beeswarm — by time, by sample size, or by median — so the cloud's shape and level across the axis becomes a second chart on top of the first.",
    },
    {
      selector: "y-axis",
      label: "Y-axis (value)",
      explanation:
        "The continuous axis the observations live on. Every dot's y-coordinate is its true value; its x-coordinate is not. Share the scale across clouds so the reader can compare both magnitude and shape in a single glance.",
    },
  ],
};
