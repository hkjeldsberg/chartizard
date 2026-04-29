import type { LiveChart } from "@/content/chart-schema";

export const starGlyphPlot: LiveChart = {
  id: "star-glyph-plot",
  name: "Star / Glyph Plot",
  family: "specialty",
  sectors: ["statistics"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",
  synopsis:
    "A lattice of tiny star-shaped glyphs, one per observation, so many multivariate profiles can be scanned as shapes at once.",
  whenToUse:
    "Reach for a star-glyph lattice when you want a reader to compare dozens of multi-variable observations as shapes rather than rows in a table. The chart's job is silhouette-matching across a grid — pick out the cars that look alike, spot the outlier whose glyph has collapsed along one spoke. A single star plot shows one entity; a star-glyph lattice shows a cohort, and that is a different chart.",
  howToRead:
    "Each small glyph is one observation. The six spokes are the same six variables in the same order around every glyph, so the glyph's shape is its multivariate fingerprint. Distance along a spoke is the observation's value on that variable, normalised across the cohort so the rim is the cohort maximum and the centre is the minimum. Similar shapes mean similar observations; a spoke pulled almost to zero is an extreme low value; a spoke that reaches the rim is an extreme high. The axis order is an editorial choice and changes the silhouette, so it must be held constant across every glyph in the lattice.",
  example: {
    title: "Tukey's Exploratory Data Analysis (1977), multivariate small multiples",
    description:
      "John W. Tukey formalised the small-multiples-of-glyphs approach in Exploratory Data Analysis as a way to scan dozens of multivariate records at once. Here the cohort is sixteen car models across MPG, horsepower, weight, 0–60 time, cylinders, and price. The Porsche 911's glyph collapses along MPG and fuel economy while ballooning on price and horsepower; the Tesla Model 3 inverts the signature by collapsing cylinders to zero while spiking on MPG-equivalent. A scatter-plot matrix could show any two of these axes at a time; the glyph lattice lets the eye hold all six at once.",
  },
  elements: [
    {
      selector: "glyph",
      label: "Glyph",
      explanation:
        "A single multivariate observation drawn as a star. The six spokes carry the same variables in the same order across every glyph in the lattice, so the closed polygon is the observation's fingerprint. Readers match glyphs by shape, not by reading individual values.",
    },
    {
      selector: "axis",
      label: "Axis / spoke",
      explanation:
        "One radial spoke per variable, anchored at the glyph's centre. Distance along the spoke is the observation's value on that variable, rescaled to the cohort's min and max so every spoke fills the rim at its cohort maximum. The same spoke points in the same compass direction in every glyph — rotation would destroy comparability.",
    },
    {
      selector: "polygon",
      label: "Glyph polygon",
      explanation:
        "The closed line connecting the six vertices is the observation's signature shape. A balanced polygon means the observation is near-average on everything; a lopsided polygon names which variables dominate. Two glyphs whose polygons nest almost exactly are near-duplicates in the multivariate space, which is often a better duplicate-detector than an equality test across six columns.",
    },
    {
      selector: "lattice",
      label: "Lattice",
      explanation:
        "The grid of small multiples is the chart's structural argument: one observation per cell, same scale and axis order in every cell, so comparisons happen by shape at a glance. Without the lattice a star plot shows one entity; with the lattice it shows a cohort, and the central question shifts from what is this observation to which observations resemble each other.",
    },
    {
      selector: "caption",
      label: "Glyph caption",
      explanation:
        "A label below each glyph names the observation. A lattice of unlabelled glyphs is a mood board — the reader cannot act on a silhouette they cannot identify. Captions sit outside the glyph circle so they never compete with the polygon for space.",
    },
    {
      selector: "collapsed-axis",
      label: "Collapsed spoke",
      explanation:
        "When a vertex pulls all the way to the centre, that observation is at or near the cohort minimum on that variable. The Tesla Model 3's cylinder vertex is the clearest case — an electric car has zero cylinders, so the polygon has a visible notch where combustion cars carry a vertex near the rim. Collapsed spokes are where glyph plots beat tables at the eye-test level.",
    },
  ],
};
