import type { LiveChart } from "@/content/chart-schema";

export const taylorDiagram: LiveChart = {
  id: "taylor-diagram",
  name: "Taylor Diagram",
  family: "relationship",
  sectors: ["earth-sciences"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",
  synopsis:
    "A polar plot that compresses correlation, standard deviation, and centred RMS error into a single distance-from-reference.",
  whenToUse:
    "Reach for a Taylor diagram when many simulations need to be ranked against one observational reference on more than one statistic at once. It is the standard comparison device for climate-model intercomparisons because three error metrics collapse onto a single chart without loss.",
  howToRead:
    "The reference — the observations — is pinned on the x-axis at normalised standard deviation 1. Each simulation is a single dot. Its angle from the x-axis encodes correlation with the reference (0° is perfect; 90° is uncorrelated), its distance from the origin encodes its own normalised standard deviation, and the concentric arcs centred on the reference read off centred RMS error. The closer a dot sits to the reference, the better the simulation matches on all three statistics simultaneously.",
  example: {
    title: "Karl Taylor's diagram, JGR 2001",
    description:
      "Taylor introduced the plot in the Journal of Geophysical Research in 2001 and it became the default figure for CMIP (the Coupled Model Intercomparison Project). A dozen GCMs can be ranked on a single panel: the tight cluster near the reference point are the models that got mean state, variability, and pattern right, and the outliers are the ones that didn't — a single glance replaces a table of three columns.",
  },
  elements: [
    {
      selector: "reference-point",
      label: "Reference point",
      explanation:
        "The observations, fixed on the x-axis at correlation = 1 and normalised standard deviation = 1. Every model's quality is measured as its distance from this single point. The construction forces the chart's geometry: once the reference is placed, the three statistics determine a unique position for every simulation.",
    },
    {
      selector: "correlation-axis",
      label: "Correlation axis",
      explanation:
        "The angular axis, with labelled rays at 0.5, 0.9, 0.95, and 0.99 sweeping from the x-axis (correlation = 1) to the y-axis (correlation = 0). Small angular offsets at the high-correlation end of the axis carry more weight than they look — 0.95 and 0.99 are visually close but represent very different pattern agreement.",
    },
    {
      selector: "stddev-arcs",
      label: "Standard-deviation arcs",
      explanation:
        "Quarter-circles centred at the origin. A model sitting exactly on the 1.0 arc has the same variability as the observations; inside the arc it is under-dispersed, outside it is over-dispersed. Standard deviation is the magnitude story; correlation is the pattern story; the diagram lets you read them independently along the two axes.",
    },
    {
      selector: "rms-arcs",
      label: "RMS error arcs",
      explanation:
        "Concentric arcs radiating out from the reference point. They measure centred RMS error — the root-mean-square difference once the means have been removed. Because the three statistics are linked by the law of cosines, the arcs emerge from the geometry automatically; you do not have to compute RMS error separately.",
    },
    {
      selector: "best-model",
      label: "Best-performing model",
      explanation:
        "The dot sitting nearest the reference point on every arc at once. High correlation, standard deviation close to 1, low RMS error — all three signals pointing the same way. This is the single inference a Taylor diagram is optimised for.",
    },
    {
      selector: "outlier-model",
      label: "Poor-performing model",
      explanation:
        "A dot that is simultaneously far from the x-axis (weak correlation) and off the 1.0 arc (wrong variability). The product is a large RMS error arc — visible as the distance from the reference. Outliers stand out because all three errors compound rather than cancel.",
    },
    {
      selector: "origin",
      label: "Origin",
      explanation:
        "The bottom-left corner, where standard deviation is zero. A model landing here would predict a flat field — no variability at all. The origin is rarely populated in practice; it is the geometric root of the two radial axes and the anchor for the standard-deviation arcs.",
    },
  ],
};
