import type { LiveChart } from "@/content/chart-schema";

export const topographicMap: LiveChart = {
  id: "topographic-map",
  name: "Topographic / Relief Map",
  family: "geospatial",
  sectors: ["cartography"],
  dataShapes: ["geospatial"],
  tileSize: "L",
  status: "live",

  synopsis:
    "Closed iso-elevation contour lines that encode three-dimensional terrain as a flat drawing, with hachure marks indicating the downslope side of each contour.",

  whenToUse:
    "Use a topographic map when the question is about terrain shape — watershed planning, route elevation profiles, slope-hazard analysis, or any domain where the sign and gradient of surface change must be read from a printed or screen representation. Unlike a prism map (which extrudes 2D polygons into 3D), a contour map encodes relief without departing from the plane, and unlike a shaded-relief rendering, it allows direct measurement: spacing between contours encodes gradient.",

  howToRead:
    "Each closed contour is one iso-elevation line. The contour interval — here 200 metres — is the fixed elevation difference between adjacent lines. Closely spaced contours indicate a steep slope; widely spaced contours indicate a gentle one. Hachure marks are short perpendicular ticks pointing toward lower elevation; they identify hills (peak enclosed inside the innermost ring) versus depressions (which also close but whose hachures point inward). Spot heights mark the computed or surveyed summit elevations.",

  example: {
    title: "USGS 7.5-minute quadrangle series, continuous since 1879",
    description:
      "The United States Geological Survey has published topographic quadrangles at 1:24,000 scale since 1879. Swiss cartographer Eduard Imhof's 1965 treatise Cartographic Relief Presentation codified the conventions — contour intervals, index contours, hachure rules, and hypsometric tinting — that every national mapping agency now follows. The design problem Imhof solved was making gradient unambiguous without the cost of shaded relief: a reader who knows the interval and spots the hachure direction can derive the full three-dimensional surface.",
  },

  elements: [
    {
      selector: "contour-line",
      label: "Contour line",
      explanation:
        "A single closed or edge-truncated curve of constant elevation. Every point on a 200-metre contour line lies at exactly 200 metres above the datum. Contours cannot cross — if they did, a single point would carry two elevations, which is impossible for a single-valued surface. This geometric property is what makes the map geometrically faithful to the terrain.",
    },
    {
      selector: "spot-height",
      label: "Spot height",
      explanation:
        "A surveyed or computed elevation label placed at a local maximum. USGS quadrangles distinguish bench marks (bronze disk, precise survey) from spot elevations (calculated or interpolated). Here the three Gaussian peaks carry labels at their analytic summits. The label places an absolute value on the innermost ring's enclosed peak — resolving the ambiguity that exists if only the contour interval is known.",
    },
    {
      selector: "hachure-marks",
      label: "Hachure marks",
      explanation:
        "Short perpendicular ticks on the downslope side of a contour line. Imhof described hachures as the contour's directional annotation: the ticks point toward lower elevation, disambiguating a closed hill contour (ticks point outward) from a closed depression contour (ticks point inward). On large-scale maps, hachure length is sometimes proportional to slope; here they are uniform in length and placed at regular spacing along the 400-metre and 800-metre contours.",
    },
    {
      selector: "closed-contour-peak",
      label: "Closed contour around peak",
      explanation:
        "The innermost rings (1000 m and 1200 m) are fully closed ovals — they enclose only the summit zone. As elevation decreases outward, each successive contour encloses a larger area. The rate at which the enclosed area grows per interval encodes the peak's shape: a cone grows linearly, a dome grows faster near the base. This nesting pattern is the contour map's fundamental vocabulary for peak morphology.",
    },
    {
      selector: "contour-interval",
      label: "Contour interval",
      explanation:
        "The fixed vertical separation between adjacent contour lines — 200 metres in this chart. The interval is a design parameter, not an intrinsic property of the terrain: a small interval (say 10 m) on a flat coastal plain produces many closely packed lines; a large interval (200 m) on an alpine range produces sparse, legible lines. Imhof recommended varying the interval between the index contours (every fifth line, drawn heavier) to let readers count quickly: five thin lines plus one thick line = 1000 metres of relief.",
    },
    {
      selector: "river-line",
      label: "River / stream line",
      explanation:
        "Rivers and streams follow the local topographic minimum — the valley between peaks. They are conventionally drawn in blue as a dashed or solid line, depending on whether the water body is perennial. Hydrologically, a stream must cross every contour line at a right angle (Imhof's orthogonality rule), forming a V-shape pointing upstream. The dashed stream here runs from the lower flank of the main peak toward the map edge, consistent with the valley implied by the contour spacing.",
    },
    {
      selector: "3d-surface-concept",
      label: "3-D surface from 2-D iso-values",
      explanation:
        "The contour map encodes a three-dimensional function z(x, y) as a set of level curves in the plane — a mathematical representation called an isarithmic map when applied to non-elevation data. The reader's eye reconstructs the surface by reading slope from contour density. This is the same operation a geologist performs when reading subsurface structure from seismic section lines, or a meteorologist when interpreting pressure isobars: iso-value lines in two dimensions imply a gradient field in three.",
    },
  ],
};
