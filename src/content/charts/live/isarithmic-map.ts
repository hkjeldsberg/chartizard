import type { LiveChart } from "@/content/chart-schema";

export const isarithmicMap: LiveChart = {
  id: "isarithmic-map",
  name: "Isarithmic / Contour Map",
  family: "geospatial",
  sectors: ["cartography"],
  dataShapes: ["geospatial"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Draws iso-value lines across a geographic surface so the eye reads a continuous field — rainfall, pressure, temperature — as a single layered landscape.",
  whenToUse:
    "Use an isarithmic map whenever the variable is a continuously varying field over space — rainfall, air pressure, temperature, salinity, magnetic declination. Pick it over a choropleth when administrative boundaries would chop a smooth signal into arbitrary polygons, and pick it over a raster heatmap when the viewer needs to read exact thresholds off labeled lines.",
  howToRead:
    "Every closed curve is an isarithm: every point on the line shares the same value. Nested loops mark a local extremum. Tightly-packed contours mean a steep gradient; widely-spaced contours mean the field is nearly flat. The station dots are the interpolation skeleton — contours between them are drawn by fitting a surface to the point cloud, not by measuring every intermediate location.",
  example: {
    title: "US annual rainfall, simplified isohyet map",
    description:
      "Climatologists draw isohyet contours at 10, 20, 30, 40, and 60 inches per year to show the continental gradient: the Pacific Northwest is wrapped in tight 60-inch rings, the Great Plains runs through the 20-inch transition zone west of the 100th meridian, and the Desert Southwest sits outside the 10-inch contour entirely. The chart's direct ancestor is Alexander von Humboldt's 1817 isotherm map — the first time a continuous atmospheric variable had ever been drawn as lines rather than numbers.",
  },
  elements: [
    {
      selector: "contour-line",
      label: "Isarithm",
      explanation:
        "A closed or continuous curve connecting points of equal value of the mapped variable. Every isarithm is labelled with its level (10, 20, 30 inches). The line itself has no width — only its position carries information.",
    },
    {
      selector: "contour-spacing",
      label: "Contour spacing",
      explanation:
        "The distance between adjacent isarithms is the visual reading of the gradient. Packed lines mean the variable changes fast across short distance (mountain rain shadows, frontal boundaries); wide spacing means the field is nearly flat.",
    },
    {
      selector: "local-maximum",
      label: "Local maximum",
      explanation:
        "A region enclosed by the highest-value contour — the wet core of the Pacific Northwest on a rainfall map, the centre of a high-pressure cell on a weather map. Nested contours tighten around it; the extremum itself is inferred, not drawn.",
    },
    {
      selector: "station-point",
      label: "Station point",
      explanation:
        "The dots are the raw measurement locations. Contours between stations are interpolated — the map's continuity is a fit, not a fact. Where stations are sparse, trust the contours less.",
    },
    {
      selector: "basemap",
      label: "Basemap",
      explanation:
        "The geographic outline (coastline, state borders) provides the spatial frame but carries no data. It should be drawn lightly so the isarithms remain the visual subject — not the other way around.",
    },
    {
      selector: "contour-label",
      label: "Contour label",
      explanation:
        "The numeric value each isarithm represents. Without labels the map is just a tangle of curves. Place labels along the line so the reader's eye can follow a single level across the map without losing it.",
    },
  ],
};
