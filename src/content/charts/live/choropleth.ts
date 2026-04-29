import type { LiveChart } from "@/content/chart-schema";

export const choropleth: LiveChart = {
  id: "choropleth",
  name: "Choropleth",
  family: "geospatial",
  sectors: ["cartography"],
  dataShapes: ["geospatial"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Shades geographic regions by a data value, turning a map into a thematic surface.",
  whenToUse:
    "Use a choropleth when a value is defined per administrative region and the regions themselves are the units of analysis. It is the default map for rates, ratios, and intensities — unemployment by county, turnout by constituency, incidence per 100k by state. Do not use it for raw counts across unequal-area regions; the eye reads area as weight and will mislead.",
  howToRead:
    "Dark regions carry high values, light regions low ones; read the legend first so you know what the gradient encodes. Because the human visual system confuses area with quantity, compare regions of similar size before making sweeping claims. Two regions that look equally dark but cover wildly different areas are not the same magnitude of story — check the underlying number, not the ink.",
  example: {
    title: "US population by state, 2024 — the area-distortion problem",
    description:
      "Render each state shaded by raw population and Wyoming (584k people, 98k sq mi) takes up far more ink than New Jersey (9.3M people, 7.4k sq mi). The chart tells you New Jersey is less important than Wyoming, which is false. Cartographers responded with two fixes: switch to density (people per square mile) so the encoding is scale-invariant, or abandon geographic accuracy entirely and use a cartogram.",
  },
  elements: [
    {
      selector: "cell",
      label: "Region",
      explanation:
        "One geographic unit — here a grid cell standing in for a US state. Its fill opacity encodes the value. In a real choropleth these are polygon boundaries from a shapefile, but the encoding rule is the same.",
    },
    {
      selector: "high-density-region",
      label: "High-density cluster",
      explanation:
        "The northeast corridor — NY, NJ, MA — reads dark because populations are large. On a real-area choropleth these tiny states are easy to miss visually; they get outshouted by low-density giants in the west. This is the choropleth's fundamental failure mode.",
    },
    {
      selector: "area-distortion",
      label: "Area distortion",
      explanation:
        "A low-population cell in a geographically large slot. Raw-count choropleths give it the same visual weight as a densely-packed small state with 10x the population. The fix is to switch the encoding to a density or a rate, not to redraw the map.",
    },
    {
      selector: "low-density-region",
      label: "Low-density region",
      explanation:
        "A small, low-population region. On a real map of the US, Vermont and Delaware are almost invisible — tiny polygons that can carry important values but never dominate the canvas. A cartogram inverts this bias.",
    },
    {
      selector: "colour-scale",
      label: "Colour scale",
      explanation:
        "The legend maps ink opacity to the underlying value. Always label the extremes and the unit — an unlabeled gradient reduces the map to decoration. Sequential ramps (light→dark) suit unipolar data like counts; diverging ramps (red→white→blue) suit bipolar data like margins.",
    },
  ],
};
