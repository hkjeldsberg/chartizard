import type { LiveChart } from "@/content/chart-schema";

export const chernoffFaces: LiveChart = {
  id: "chernoff-faces",
  name: "Chernoff Faces",
  family: "specialty",
  sectors: ["statistics"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",
  synopsis:
    "A cartoon face per observation, with each facial feature encoding one of six variables.",
  whenToUse:
    "Use Chernoff faces for small multivariate datasets — roughly 10 to 30 observations with 4 to 8 variables — when the goal is to let the human face-perception system do the comparison work. Unsuitable for large n or for precise numerical read-off. A parallel-coordinates plot is more honest when you need to compare values axis-by-axis.",
  howToRead:
    "Each face is one row of data. Face width, eye size, eye separation, nose length, mouth curvature, and mouth width each encode a different variable, normalised to a bounded range so faces stay legible. Similar data should produce similar faces; outliers jump out as the face that feels wrong. The encoding is ordinal, not quantitative — a slightly bigger eye means more of that variable, but not how much more.",
  example: {
    title: "Twelve US states, six health indicators",
    description:
      "Each face glyphs one state's life expectancy, obesity rate, smoking rate, uninsured rate, heart-disease mortality, and diabetes prevalence. Ohio and Michigan read as visibly heavier-set and more downturned than California and New Jersey — a first-pass anomaly filter before you pull the numbers. Herman Chernoff introduced the technique in 1973 (J. Amer. Stat. Assoc. 68(342)) on the premise that humans are pre-tuned to read faces and will spot multivariate outliers without a scale to compare against.",
  },
  elements: [
    {
      selector: "face",
      label: "Face glyph",
      explanation:
        "One cartoon face per observation. The face is the unit of comparison — you judge two observations by judging whether their faces feel the same, not by reading off axis values. Legible only up to roughly six to eight features before the eye gives up.",
    },
    {
      selector: "feature-mapping",
      label: "Feature-to-variable mapping",
      explanation:
        "Each of the six facial features encodes one variable: face width, eye size, eye separation, nose length, mouth curvature, and mouth width. The assignment is arbitrary and it matters — humans weight eye size and mouth shape more heavily than nose length, so whichever variable you give the eyes will visually dominate the display.",
    },
    {
      selector: "anomaly",
      label: "Anomaly face",
      explanation:
        "The face that doesn't belong. Chernoff's claim in 1973 was that outliers in six-dimensional data can be spotted pre-attentively on a face where they would require a sorted table or a parallel-coordinates plot to find numerically. This is the technique's single operational use.",
    },
    {
      selector: "label",
      label: "Identifier label",
      explanation:
        "The observation's name printed below the face. Without a label a Chernoff-face array is untraceable — you can see which face is the outlier but not which row of the data it corresponds to.",
    },
    {
      selector: "lattice",
      label: "Face lattice",
      explanation:
        "The grid of faces is small-multiples laid out with no axes. Reading order is conventional top-left to bottom-right; sorting the lattice by one variable can make a gradient of that feature visible across rows and is often worth doing.",
    },
  ],
};
