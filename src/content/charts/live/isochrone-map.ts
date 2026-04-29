import type { LiveChart } from "@/content/chart-schema";

export const isochroneMap: LiveChart = {
  id: "isochrone-map",
  name: "Isochrone Map",
  family: "geospatial",
  sectors: ["cartography"],
  dataShapes: ["geospatial"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Nested contours of equal travel time from a point — not distance — exposing how road networks, barriers, and congestion warp accessibility.",
  whenToUse:
    "Use an isochrone when the question is 'how far can I get in N minutes' rather than 'how far is X from Y'. Transit planners use it to find 15-minute-city gaps; real-estate listings overlay 30-minute commute contours; emergency services use it to site ambulance stations so every address falls inside an 8-minute ring. Keep it distinct from an isarithmic or contour map, which draws equal-VALUE lines (elevation, rainfall); an isochrone draws equal-TIME lines and its shape is determined by the network, not the terrain.",
  howToRead:
    "Each closed ring encloses every point reachable within that many minutes of the origin marked at the centre. Read the rings as a topography of effort: tight spacing means accessibility drops sharply (a pinch at a river crossing or a railhead); wide spacing means fast network coverage (a motorway corridor); fingers reaching outward mark radial routes that beat the local street grid. Where two neighbouring rings sit far apart, time moves fast; where they compress, a barrier is slowing travel for everyone downstream of it.",
  example: {
    title: "Francis Galton, 1881 — 'On the Construction of Isochronic Passage-Charts'",
    description:
      "Galton's paper to the Royal Geographical Society mapped global steamship travel times from London in days — New York eight days, Cape Town twenty, Sydney fifty — by drawing closed contours on a world map. The modern reincarnation is the Google Maps Distance Matrix API, the HERE Isoline API, and the Mapbox Isochrone API; each takes a point and a time budget and returns a polygon. Urban planners layered these polygons over census blocks to quantify the '15-minute-city' shortfall in the 2020 Paris and 2022 Melbourne plans.",
  },
  elements: [
    {
      selector: "origin",
      label: "Origin",
      explanation:
        "The point from which all travel times are measured. Every contour is a function of this point — move the origin a kilometre and the entire isochrone redraws. A star or dot marks it to keep it visually distinct from the data layer.",
    },
    {
      selector: "inner-contour",
      label: "Innermost contour",
      explanation:
        "The tightest ring — here ten minutes — hugs the origin and is close to circular because over short trips the network looks roughly isotropic. As time budgets grow, the network's asymmetries take over and the rings stop being round.",
    },
    {
      selector: "mid-contour",
      label: "Intermediate contour",
      explanation:
        "A thirty-minute ring starts to show the network's grain: slight lobes along primary roads, slight indents where a highway entry or a river crossing forces a detour. This is where the map stops being a distance plot and starts being a routing plot.",
    },
    {
      selector: "highway-corridor",
      label: "Highway corridor",
      explanation:
        "A long, narrow finger in the outer contour marks a radial motorway or rail axis — places reachable fast only because one high-speed corridor runs through them. Real estate along these corridors trades at a premium exactly because the isochrone bulges outward there.",
    },
    {
      selector: "barrier-pinch",
      label: "Barrier pinch",
      explanation:
        "A sudden indent in the contour marks a river, mountain range, or missing bridge that forces travellers onto a detour. Two neighbouring rings pressed close together signal that a large geographic area is paying an accessibility penalty for one constrained crossing.",
    },
    {
      selector: "outer-contour",
      label: "Outermost contour",
      explanation:
        "The sixty-minute ring is where the chart's asymmetries are loudest — fingers reach far on the network-rich side, barriers clip progress on the other. The difference between this ring's widest and narrowest radius is a single-number summary of how uneven the region's transport geography is.",
    },
    {
      selector: "city-frame",
      label: "City context",
      explanation:
        "A light frame sketches the metropolitan area so the reader anchors scale — without it the rings are abstract ovals. A serious isochrone should sit over base-map streets and administrative boundaries; this chart reduces that layer to a hairline so the time-contours dominate.",
    },
  ],
};
