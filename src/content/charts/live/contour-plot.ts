import type { LiveChart } from "@/content/chart-schema";

export const contourPlot: LiveChart = {
  id: "contour-plot",
  name: "Contour Plot",
  family: "distribution",
  sectors: ["mathematics", "earth-sciences"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Projects a 3D surface onto the base plane by drawing iso-value lines — a topographic map for any f(x, y).",
  whenToUse:
    "Reach for a contour plot when a 3D surface plot would either not fit in the page or would hide detail behind its own geometry. Contours give you exact values along each line at the cost of perspective — useful whenever the quantity is a smooth function of two spatial or parametric inputs.",
  howToRead:
    "Each curve is an iso-value: every (x, y) on the line has the same height. Nested loops mark a peak or a trough — the innermost ring is the extremum. Contours packed close together mean a steep gradient; widely-spaced contours mean the surface is nearly flat. Saddles appear where contours of the same level cross or abut.",
  example: {
    title: "Weather charts, elevation maps, CFD simulations",
    description:
      "Meteorologists draw isobars on surface-pressure charts so pilots and forecasters can read wind strength off the spacing — tight lines mean a jet; widely spaced lines mean calm. The same technique, applied to elevation, is the topographic map used by every trail hiker since the 19th century, and applied to pressure or velocity fields in CFD simulations to show flow structure without occlusion.",
  },
  elements: [
    {
      selector: "outer-contour",
      label: "Outer contour",
      explanation:
        "The lowest-value iso-line — the silhouette of the distribution's support. Outside this ring the function is near zero. Useful as a boundary reference when reading the interior.",
    },
    {
      selector: "inner-ring",
      label: "Inner ring",
      explanation:
        "The innermost closed loop of the tallest peak. It encloses the highest-value region on the plot. Where multiple peaks exist, each has its own inner ring.",
    },
    {
      selector: "peak",
      label: "Peak",
      explanation:
        "The extremum of the surface. Mark it explicitly — the innermost contour approximates its location but never reaches it. With two peaks of unequal weight, the larger one dominates the inner rings.",
    },
    {
      selector: "saddle",
      label: "Saddle",
      explanation:
        "The corridor between two peaks where the surface dips. Contours here are widely spaced because the gradient is low. In topography this is the col between two summits; in pressure fields it marks the seam where air circulations meet.",
    },
    {
      selector: "x-axis",
      label: "X-axis",
      explanation:
        "The first input coordinate of f(x, y). In a weather map this is longitude; in a CFD simulation it is the streamwise direction. The contour positions are only meaningful relative to the axes.",
    },
    {
      selector: "y-axis",
      label: "Y-axis",
      explanation:
        "The second input coordinate. The contour plot collapses the three-dimensional surface onto this base plane — the encoded height shows up only through the lines, never through vertical position.",
    },
  ],
};
