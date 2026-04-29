import type { LiveChart } from "@/content/chart-schema";

export const hammockPlot: LiveChart = {
  id: "hammock-plot",
  name: "Hammock Plot",
  family: "relationship",
  sectors: ["statistics"],
  dataShapes: ["categorical"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Categorical parallel coordinates with narrow-waisted bands, so every joint combination reads as a traceable strand.",
  whenToUse:
    "Use a hammock plot when the data is a multi-way categorical cross-tabulation and the question is how individual combinations traffic through the variables. It is the read-individual-paths sibling of parallel sets: where parallel sets lets bands touch at full width between axes, hammock narrows every band between axes so thick and thin combinations stay separable. Choose hammock when the smallest records still matter; choose parallel sets when aggregate block volumes are the story.",
  howToRead:
    "Each vertical post is a categorical variable, divided into segments whose height is the category's count. Between two adjacent posts, each trapezoidal band is one joint category pair: its width at each post is the count at that post, and it narrows toward the midpoint between them. That narrowing — the hammock sag — is the chart's engineered feature; it exposes the traffic inside a chain of categories that full-width bands would hide. Follow a band from post to post to trace one cohort; watch where narrow bands are forced to cross dominant ones to spot non-independence between variables.",
  example: {
    title: "Titanic survival (Dawson, 1995): Class → Sex → Age → Survived",
    description:
      "Matthias Schonlau introduced the hammock plot in Visualizing Categorical Data Arising in the Health Sciences Using Hammock Plots at the 2003 ASA Joint Statistical Meetings, motivated by trial data where many small subgroup cells had to stay readable alongside dominant ones. The Titanic cross-classification is the standard test-bed: the Crew/Male/Adult/Died chain carries the most visual weight, while the small-but-famous 1st/Female/Adult/Survived chain remains traceable as a single narrow strand because the waist-narrowing prevents it from dissolving into the surrounding ink. A mosaic plot would show the same counts as nested rectangles and lose the axis order; parallel sets would show full-width ribbons and let the narrow chain vanish inside them.",
  },
  elements: [
    {
      selector: "axis-post",
      label: "Axis post",
      explanation:
        "One variable drawn as a narrow vertical post, divided into segments proportional to each category's count. Every post sums to the same population total — it is the same cohort viewed through a different variable — so all four posts are the same height.",
    },
    {
      selector: "band",
      label: "Hammock band",
      explanation:
        "A band between two adjacent posts is one joint category pair. Its width at each post is the count at that post's segment; its width at the midpoint is a deliberately narrowed waist. Reading the width at either end gives the joint count; reading the band all the way across gives the pair's full contribution.",
    },
    {
      selector: "narrowing",
      label: "Narrowing waist",
      explanation:
        "The pinched midpoint is the feature that names the chart. Schonlau introduced it so that a small joint count, sitting beside a dominant one, does not get absorbed into a flat ribbon of ink between axes. Narrowing is not quantity encoding — quantity lives at the axis — it is a legibility trick that keeps individual combinations traceable.",
    },
    {
      selector: "axis-label",
      label: "Axis label",
      explanation:
        "Names the variable at each post. A hammock plot without axis labels is a decorative knot; the whole point of the layout is that the reader can say which variable narrows which other variable. Labels sit above each post and carry the category ordering implicitly through the segments below.",
    },
    {
      selector: "axis-ordering",
      label: "Axis ordering",
      explanation:
        "The order of axes is editorial and changes the chart's story. Here the order Class → Sex → Age → Survived puts demographic variables before the outcome, so the reader enters through social structure and exits through fate. Reversing the order is legal and sometimes reveals different crossings — but the same data with different axis order is almost always a different argument.",
    },
    {
      selector: "terminal",
      label: "Terminal segment",
      explanation:
        "The rightmost post carries the outcome category. Survived=Yes — 711 of 2201 — is the smaller segment, and the bands funnelling into it are the sum of the rescue pattern. Following the ink into this segment rather than the bigger No segment beside it is how a hammock plot teaches the chart's headline fact in a single glance.",
    },
  ],
};
