import type { LiveChart } from "@/content/chart-schema";

export const flowMap: LiveChart = {
  id: "flow-map",
  name: "Flow Map",
  family: "geospatial",
  sectors: ["cartography"],
  dataShapes: ["geospatial"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Curved arcs over a map encode origin-to-destination movement; stroke weight carries volume.",
  whenToUse:
    "Reach for a flow map when the story is direction and volume between places — air routes, migration flows, trade lanes, supply chains. The curves do two jobs at once: they lift the eye off the basemap so the geography stops competing with the data, and they let multiple flows share the same origin without stacking into a single straight line.",
  howToRead:
    "Start at the filled origin dot and follow each arc to its hollow destination. Thicker strokes carry more volume; the curvature has no geographic meaning on its own, it just separates routes that would otherwise overplot at the hub. Long-haul arcs are drawn with more bulge than short-hops so distance stays legible even at small map scales. The underlying continent silhouettes are intentionally faint — the flows are the subject.",
  example: {
    title: "Charles Minard, Napoleon's march on Moscow, 1869",
    description:
      "Minard's chart of the 1812 Russian campaign is the canonical flow map: a single band whose width encodes army size, collapsing from 422,000 men at the Niemen to 10,000 at the return. Harness (1837) and Ravenstein's migration charts (1885) experimented with the form earlier, but Minard's decision to make stroke width do the narrative work — and to overlay temperature along the retreat leg — is why it still gets cited in design schools 150 years later.",
  },
  elements: [
    {
      selector: "origin-hub",
      label: "Origin hub",
      explanation:
        "The filled dot where every arc begins. One origin, many destinations is the natural shape for flow maps; the hub marker is drawn larger so it survives the pile-up of overlapping arc ends.",
    },
    {
      selector: "flow-curve",
      label: "Flow curve",
      explanation:
        "Each destination gets a Bezier arc from the origin. The curve is an encoding choice, not a great-circle path — it exists to pull routes off the straight line so a dozen flows out of one hub remain distinguishable.",
    },
    {
      selector: "destination-marker",
      label: "Destination marker",
      explanation:
        "A hollow circle at each endpoint. Hollow-versus-filled is the cheapest way to tell a viewer that one end is the origin and the other is an arrival, without relying on arrowheads that would clutter the hub.",
    },
    {
      selector: "curvature-encoding",
      label: "Curvature",
      explanation:
        "Arc bulge scales with chord length: long-haul routes curve harder than short-hops. That prevents the longest flows from reading as straight lines over the pile-up and lets the eye separate near-parallel routes at the hub.",
    },
    {
      selector: "stroke-width-volume",
      label: "Stroke width",
      explanation:
        "The one quantitative channel on the chart. Wider strokes carry more passengers, shipments, or dollars. Keep the scale compressed — raw volume ratios of 10× or more need a square-root or log mapping, otherwise the thinnest arcs vanish.",
    },
    {
      selector: "continent-silhouette",
      label: "Continent silhouette",
      explanation:
        "A deliberately faint basemap. The arcs are the figure; the land is the ground. Flow maps fail when the cartography is rendered with the same visual weight as the data — viewers track coastlines instead of volume.",
    },
  ],
};
