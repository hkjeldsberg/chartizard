import type { LiveChart } from "@/content/chart-schema";

export const hexbinMap: LiveChart = {
  id: "hexbin-map",
  name: "Hexbin Map",
  family: "geospatial",
  sectors: ["cartography"],
  dataShapes: ["geospatial"],
  tileSize: "L",
  status: "live",
  synopsis:
    "The tile map's tessellating cousin: 50 US states as hexagons, each the same size, laid out in a geography-approximating honeycomb.",
  whenToUse:
    "Choose a hexbin map over a square tile map when you want the visual language of a map — shared edges, a honeycomb that fills space — while still giving every state equal weight. The hexagon's six neighbours echo real adjacency better than a grid's four, and the tessellation reads as terrain rather than a spreadsheet.",
  howToRead:
    "Every hexagon is one state. Position approximates geography: Pacific states on the left, Atlantic on the right, Gulf Coast along the bottom. Colour encodes the variable (here, median household income). Because the hexes tessellate, clusters read as continuous bands rather than as separated cells — so the Northeast high-income corridor and the Deep South low-income band both emerge as shapes, not lists.",
  example: {
    title: "WSJ and Mike Bostock's state-hex template",
    description:
      "The Wall Street Journal's graphics desk adopted the hexbin state map for policy reporting in the mid-2010s, and Mike Bostock's public D3 template made the layout the default for anyone sketching a state-level story in a browser. The template's virtue is that it survives regional zooms: pluck out the Northeast hexes and they still tessellate cleanly, which a Mercator-projected choropleth can't do.",
  },
  elements: [
    {
      selector: "hexagon",
      label: "Hexagon",
      explanation:
        "One regular hexagon per state, point-top orientation, sized identically. Each hex carries its two-letter USPS code in monospace at centre. Because the six vertices are equidistant from the centre, the label always sits cleanly regardless of the state's real shape.",
    },
    {
      selector: "tessellation",
      label: "Tessellation",
      explanation:
        "Hexagons are one of only three regular polygons that tile the plane with no gaps, and they do so with six shared edges per cell instead of a grid's four. That extra edge gives the hexbin map its honeycomb feel: clusters of same-coloured states read as continuous bands because their hexes actually touch on six sides.",
    },
    {
      selector: "geographic-approximation",
      label: "Geographic approximation",
      explanation:
        "Alaska floats in the upper-left above Washington by convention — nowhere near its true position in the North Pacific. Hawaii sits below California, not 2,400 miles into the ocean. These deliberate displacements are the chart's honest admission: the layout suggests geography but doesn't faithfully measure it. If your story depends on actual coordinates, reach for a projected map instead.",
    },
    {
      selector: "high-income-cluster",
      label: "High-income cluster",
      explanation:
        "The Northeast corridor — Massachusetts, Connecticut, New Jersey, Maryland, DC, New Hampshire — prints as a tightly tessellated block of the darkest hexes. On a geographic choropleth these states are narrow slivers that underweight the region's economic concentration; the hexbin's equal-area encoding lets the pattern assert itself.",
    },
    {
      selector: "colour-ramp",
      label: "Colour ramp",
      explanation:
        "Sequential ink ramp from $50k (pale) to $100k (saturated), covering the 2023 range for US state median household income. Sequential is the right choice because income has no natural zero-point or mid-value; a diverging ramp would imply a reference income that doesn't exist in the data.",
    },
    {
      selector: "anchor-state",
      label: "Anchor state",
      explanation:
        "California sits on the left edge, establishing the map's compass: west on the left, east on the right. A hexbin map without a few mentally-anchored states (CA, TX, FL, NY) forces the reader to decode every cell from the abbreviation alone — use large, instantly-recognised states as visual pins for the rest.",
    },
  ],
};
