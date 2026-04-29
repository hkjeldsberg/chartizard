import type { LiveChart } from "@/content/chart-schema";

export const hexagonalBinningChart: LiveChart = {
  id: "hexagonal-binning-chart",
  name: "Hexagonal Binning Chart",
  family: "distribution",
  sectors: ["statistics", "data-science", "cartography", "earth-sciences"],
  dataShapes: ["continuous", "geospatial"],
  tileSize: "L",
  status: "live",
  synopsis:
    "A 2D histogram using hexagons — each hex is coloured by how many points fall inside it, revealing density where a scatterplot would just smear.",
  whenToUse:
    "When a scatterplot of 10,000+ points turns into a single ink blob and you can't tell the rare patterns from the common ones, switch to hexbin. It trades individual points for a reliable density surface.",
  howToRead:
    "Colour is the whole story: darker hexes contain more points. Look for the 'ridge' of high density, the holes inside it, and the outlier hexes that sit alone. Read the legend scale carefully — whether the scale is linear or log changes which patterns you see. Hexagons are used instead of squares because a hex grid has lower edge distortion: a point near the edge of a hex is as close to the centre as a point near the edge of any neighbour.",
  example: {
    title: "NYC taxi pickups by latitude and longitude",
    description:
      "The NYC Taxi dataset has ~170M rides. Plotting raw lat/lon as a scatterplot produces a rectangle of solid black. A hexbin at the same scale shows the manifest: a dense hotspot in Midtown, secondary ridges along the avenues, and a clear hole where Central Park blocks pickups. The chart is reading geography without needing a map underneath.",
  },
  elements: [
    {
      selector: "hex",
      label: "Hexagon bin",
      explanation:
        "Each hexagon aggregates all data points that fell within its boundaries. Colour encodes the count. Hexagons tile the plane without gaps or overlaps and have lower perceptual distortion than square bins, especially near the edges of high-density regions.",
    },
    {
      selector: "colour-scale",
      label: "Colour scale",
      explanation:
        "The legend that connects colour to count (or density). A linear scale flattens rare high-density hotspots; a log or quantile scale reveals them. Always label the scale with its mapping — 'counts' vs 'counts (log)' — or readers will misjudge magnitudes.",
    },
    {
      selector: "bin-radius",
      label: "Bin radius",
      explanation:
        "The size of each hexagon. Smaller hexes = more resolution but noisier; larger hexes = smoother but may hide structure. Swapping radius is like changing the kernel bandwidth of a density estimate and should be treated with the same care.",
    },
    {
      selector: "x-axis",
      label: "X-axis",
      explanation:
        "The first of the two continuous variables being binned. Must be numeric; hexbins with log axes work but require binning in the transformed space.",
    },
    {
      selector: "y-axis",
      label: "Y-axis",
      explanation:
        "The second continuous variable. Together with x, these two axes define the 2D space the hexagons partition.",
    },
  ],
};
