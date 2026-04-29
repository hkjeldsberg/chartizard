import type { LiveChart } from "@/content/chart-schema";

export const dotDensityMap: LiveChart = {
  id: "dot-density-map",
  name: "Dot Density Map",
  family: "geospatial",
  sectors: ["cartography"],
  dataShapes: ["geospatial"],
  tileSize: "L",
  status: "live",

  synopsis:
    "Distributes discrete dots across a geographic base at a density proportional to count data, where each dot represents a fixed quantity.",

  whenToUse:
    "Use a dot density map when you need to show the absolute spatial distribution of a count variable — population, crime incidents, disease cases — without collapsing it into per-area rates. The format is the classical answer to the question: how do you show absolute counts on a map without distorting area? It fails when the underlying geography is too coarse to place dots meaningfully, or when count values are near zero in large regions (blank space misleads as absence of data rather than low density).",

  howToRead:
    "Each dot represents a fixed quantity — here, 100,000 people. Clusters of dots indicate high concentration; sparse areas indicate low counts. The eye integrates dot density across a region to estimate magnitude; it does not read individual points. A critical communication hazard: readers often misinterpret each dot as a single event or person. The legend value ('1 dot = X') must be prominently displayed. Waldo Tobler's 1971 study of the proportional-value rule formalised the conditions under which dot placements remain statistically reliable.",

  example: {
    title: "US population distribution, 2020 Census — 330 million people",
    description:
      "Louis-Léger Vauthier's 1874 map of Paris population density by arrondissement was among the earliest formal uses of the dot technique. In the US census context, the 2020 dot-density map at one dot per 100,000 people makes the coastal and Great Lakes concentration immediately visible against the sparse Mountain West interior — a pattern that choropleth encoding of the same data suppresses because Wyoming and Montana each occupy a large cell but hold small populations.",
  },

  elements: [
    {
      selector: "region-polygon",
      label: "Region polygon",
      explanation:
        "Each shaded polygon outlines a geographic region. The boundary is an administrative construct, not a data boundary — dots are placed inside the polygon by rejection sampling, so no dot represents data exactly at the boundary. The West Coast polygon here encompasses California, Oregon, and Washington, which together hold ~51 million people.",
    },
    {
      selector: "dense-cluster",
      label: "Dense cluster",
      explanation:
        "Where dots crowd together, the underlying count is high. The Great Lakes and Northeast corridor produces the chart's densest visible cluster — a pattern consistent with the historical industrial concentration along the Erie Canal corridor. Dense clusters are the chart's primary visual signal.",
    },
    {
      selector: "sparse-region",
      label: "Sparse region",
      explanation:
        "The Mountain West (Idaho, Montana, Wyoming, Colorado, Nevada, Utah, Arizona, New Mexico) holds roughly 25 million people across the largest land area of any region. The resulting visual emptiness is the honest encoding: absolute count is low, even though choropleth maps of the same region appear expansive.",
    },
    {
      selector: "individual-dot",
      label: "Individual dot",
      explanation:
        "Each dot represents 100,000 people — not one person. This is the chart's most persistent misreading risk. Vauthier and subsequent cartographers placed dots randomly within administrative boundaries, not at the actual addresses of residents. Placement is probabilistic; the dot's position carries no spatial meaning beyond 'somewhere in this region'.",
    },
    {
      selector: "boundary-outlines",
      label: "Boundary outlines",
      explanation:
        "Administrative boundary lines separate regions and give the viewer spatial anchoring. Without them, dots placed near a boundary are unattributable. The outlines also make the equal-area property legible: large empty regions are genuinely sparse, not unsampled.",
    },
    {
      selector: "legend",
      label: "Dot value legend",
      explanation:
        "The legend states the dot-to-population ratio and the total approximate count encoded. Both values are essential: the ratio tells readers how to read individual densities; the total tells them whether the chart is showing all counts or a sample. Omitting the ratio is the single most common error in dot-density maps.",
    },
  ],
};
