import type { LiveChart } from "@/content/chart-schema";

export const tissotIndicatrix: LiveChart = {
  id: "tissot-indicatrix",
  name: "Tissot's Indicatrix",
  family: "specialty",
  sectors: ["cartography"],
  dataShapes: ["geospatial"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Small reference circles laid across a projected map, revealing exactly how that projection stretches, shears, or inflates local geometry.",
  whenToUse:
    "Reach for an indicatrix when you need to argue about a projection, not just draw one. Layered over Mercator, Robinson, or Mollweide, the indicatrix makes each projection's specific trade-off visible — equal-area projections keep circle area constant but shear the shapes, conformal projections keep circle shapes but blow up area. It is the cartographer's answer to the question 'why don't you just pick a better projection'.",
  howToRead:
    "Every circle on the sphere has the same angular radius. On the map, compare each ellipse to the equatorial reference circle: if it is larger, that region is inflated; if it is stretched, angles at that point are preserved but area is not; if it is tilted, the projection shears. On Mercator the circles stay round everywhere (the projection is conformal) but swell by a factor of sec(φ) as latitude rises — doubling at 60° and diverging toward infinity at the poles. This is why Greenland reads bigger than Africa even though Africa is roughly fourteen times its area.",
  example: {
    title: "Nicolas Auguste Tissot, 1859 — the USGS projection-selection catalogue",
    description:
      "Tissot introduced the indicatrix in his 1859 memoir to give cartographers a rigorous way to compare projections, formalising what Gauss's Theorema Egregium had already proved: no flat map can simultaneously preserve distance, angle, and area on a curved Earth. The USGS Projections Poster and every serious atlas since has used indicatrix plots to justify their projection choice — conformal Mercator for navigation, equal-area Mollweide for thematic global data, compromise Robinson for reference maps where neither distortion dominates.",
  },
  elements: [
    {
      selector: "equator-circle",
      label: "Equator circle",
      explanation:
        "At latitude zero Mercator is undistorted — the circle renders at its true angular size and remains round. This is the reference against which every other circle on the map is measured.",
    },
    {
      selector: "mid-latitude-circle",
      label: "Mid-latitude circle",
      explanation:
        "At 30° the sec(φ) inflation factor is already about 1.15 — noticeable if you measure, easy to miss by eye. Mercator's lie is gradual, which is part of why school-room wall maps go uncorrected for generations.",
    },
    {
      selector: "polar-circle",
      label: "High-latitude circle",
      explanation:
        "At 60° sec(φ) = 2, so the circle is twice the equatorial size in both axes — four times the area. By 75° the factor is roughly 3.86. Toward the poles the inflation runs to infinity, which is why Mercator is always clipped somewhere around ±80°.",
    },
    {
      selector: "graticule",
      label: "Graticule",
      explanation:
        "The grid of meridians and parallels that defines the projection. On Mercator, meridians stay vertical and evenly spaced while parallels pull apart toward the poles — that uneven spacing is precisely the sec(φ) stretch the indicatrix exposes.",
    },
    {
      selector: "continent-outline",
      label: "Continent outline",
      explanation:
        "Greenland at ~75°N is the stock example: on Mercator it renders larger than Africa despite being roughly one fourteenth Africa's area. The continents are drawn here only so the reader anchors the projection — the indicatrix is the actual instrument of measurement.",
    },
    {
      selector: "latitude-axis",
      label: "Latitude axis",
      explanation:
        "On Mercator, distortion depends only on latitude — every point at the same parallel is stretched by the same factor. Reading the circles from the equator upward is reading the sec(φ) curve, plotted as geometry rather than numbers.",
    },
  ],
};
