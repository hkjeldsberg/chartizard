import type { LiveChart } from "@/content/chart-schema";

export const proportionalSymbolMap: LiveChart = {
  id: "proportional-symbol-map",
  name: "Proportional Symbol Map",
  family: "geospatial",
  sectors: ["cartography"],
  dataShapes: ["geospatial"],
  tileSize: "L",
  status: "live",

  synopsis:
    "Places circles at geographic point locations, with each circle's area scaled proportionally to a data value at that point.",

  whenToUse:
    "Use a proportional symbol map when you have point-located data — a city's population, a port's cargo throughput, an earthquake's magnitude — and need to show absolute magnitude at each location. The format separates location from quantity in a way that a choropleth cannot: the circle's area grows with the value regardless of the underlying geographic area. Henry Drury Harness's 1837 Irish railway-traffic atlas contains the earliest documented proportional symbols applied to geographic data.",

  howToRead:
    "Each circle is centred on a geographic point. Circle area — not radius — is proportional to the data value. This is the canonical encoding rule, established because area is what human vision perceives as magnitude; using radius instead causes readers to systematically overestimate the difference between large and small symbols. Circles are rendered largest-first so that small cities are not hidden beneath large neighbours. Where circles overlap, the smaller circle sits on top. The scale legend provides three reference sizes; compare an unknown circle against the nearest reference to estimate its value.",

  example: {
    title:
      "Major world metropolitan areas by population — Tokyo to London",
    description:
      "Henry Drury Harness's 1837 Irish atlas used circles scaled to traffic and population to annotate railway routes, the first known proportional-symbol map in cartographic literature. Cynthia Brewer and Mark Harrower, authors of ColorBrewer, formalised the rendering conventions in Brewer 2015 *Designing Better Maps* (ESRI Press): area-not-radius encoding, smallest-on-top draw order, and a three-value scale legend as anchors for visual estimation. Tokyo at 37 million produces a circle whose area is approximately 16× that of London at 9 million — the difference is legible even without reading labels.",
  },

  elements: [
    {
      selector: "large-symbol",
      label: "Large symbol (Tokyo)",
      explanation:
        "Tokyo's circle is the largest on the map, representing ~37 million people. Its radius is the square root of (pop / maxPop) × maxR, ensuring area — not radius — scales linearly with population. A circle with twice the area has a radius √2 times larger; this is harder to perceive than linear scaling, which is why a reference legend is essential.",
    },
    {
      selector: "small-symbol",
      label: "Small symbol (London)",
      explanation:
        "London's circle represents ~9 million people. Because it is drawn after (on top of) all larger circles, it remains visible even if a larger city sits nearby. This smallest-on-top rendering order, recommended by Brewer and Harrower in *Designing Better Maps*, is the standard defence against symbol occlusion.",
    },
    {
      selector: "area-encoding",
      label: "Area encoding",
      explanation:
        "Tokyo and Osaka lie close together on the map. Their overlap illustrates the core rendering challenge of proportional symbol maps: large circles cover smaller neighbours. Filling circles at partial opacity (here, ~28%) allows the underlying circle to remain visible through the overlay. This is the canonical transparency convention for overlapping symbols.",
    },
    {
      selector: "geographic-placement",
      label: "Geographic placement",
      explanation:
        "Each circle is centred on the city's latitude and longitude, projected into the map's coordinate system. Unlike a bubble chart, which plots data in statistical space, the proportional symbol map preserves real geographic distance: Buenos Aires sits in the southern hemisphere, Tokyo on the Pacific Rim. The spatial context — not just the magnitudes — is part of the message.",
    },
    {
      selector: "base-map",
      label: "Continental outlines",
      explanation:
        "The continental silhouettes are the reference frame that converts abstract symbol positions into geographic meaning. Without them, a circle labelled 'Tokyo' has no spatial context. The outlines carry no data; they are purely indexical — they let the viewer locate 'where' before reading 'how much'.",
    },
    {
      selector: "scale-legend",
      label: "Scale legend",
      explanation:
        "The three reference circles — 5M, 15M, and 35M — give readers the anchoring values needed to estimate any unlabelled circle by visual comparison. Brewer and Harrower recommend at least two and at most four reference sizes; too few leave values indeterminate, too many clutter the legend. Circle area in the legend obeys the same √(pop) rule as the map circles.",
    },
  ],
};
