import type { LiveChart } from "@/content/chart-schema";

export const parallelSets: LiveChart = {
  id: "parallel-sets",
  name: "Parallel Sets",
  family: "flow",
  sectors: ["flow"],
  dataShapes: ["categorical"],
  tileSize: "W",
  status: "live",
  synopsis:
    "Stacks several categorical axes side by side and routes a ribbon between every pair of categories whose joint count is non-zero.",
  whenToUse:
    "Use parallel sets when the data is a fully-categorical cross-tabulation of three or more variables and the question is how the joint distribution flows from one axis to the next. It is the Sankey diagram's categorical sibling: each axis is a set of categories, each ribbon is a set-intersection, and ribbon width is the intersection's size.",
  howToRead:
    "Treat each vertical bar as one variable, with sub-category segments stacked in proportion to their counts. A ribbon between two segments is the joint count of the two categories meeting at that pair. Follow a ribbon through all axes to trace one cohort; compare ribbon widths at the same axis to read conditional proportions. Visible crossings reveal imbalance — when the dominant ribbon on one side is not the dominant ribbon on the next, the two variables are not independent.",
  example: {
    title: "Titanic survival by class and sex (Dawson, 1995)",
    description:
      "Robert Kosara introduced parallel sets in 2006 using this dataset, and it has stayed the default teaching illustration ever since. The chart makes the Titanic's central fact impossible to hide: the thin Female axis segment routes almost entirely into Survived=Yes, while the thick Male segment routes into Survived=No, regardless of class. Third-class passengers and crew form the bulk of the casualties — a Sankey of monetary flow could not carry this story because the data has no quantity, only counts of categorical combinations.",
  },
  elements: [
    {
      selector: "axis-bar",
      label: "Axis bar",
      explanation:
        "A single variable drawn as a vertical bar, segmented into its sub-categories with height proportional to count. Every axis sums to the same total — the population — which is why the three bars in this chart are the same height.",
    },
    {
      selector: "ribbon",
      label: "Ribbon",
      explanation:
        "A ribbon connects two category segments and carries the joint count of passengers who fall in both. Its width, measured at either end, is the count on that axis's scale. A ribbon is a set-intersection drawn as a shape.",
    },
    {
      selector: "ribbon-width",
      label: "Ribbon width",
      explanation:
        "Width is the only quantity encoding in the chart. A skinny ribbon — like Crew→Female at 23 passengers — should read as a sliver next to Crew→Male at 862. Never use parallel sets for data where the joint counts are on wildly different scales; the small ribbons vanish.",
    },
    {
      selector: "axis-label",
      label: "Axis label",
      explanation:
        "Names the variable that axis represents. Parallel sets without axis labels is just a pretty bundle of ribbons — you cannot read a conditional proportion without knowing which variable is which.",
    },
    {
      selector: "axis-ordering",
      label: "Axis ordering",
      explanation:
        "Within each axis the designer chooses the order of sub-categories. Count-ascending, count-descending, and semantic orderings all produce different crossing patterns. The ordering is an editorial choice — the same data can look tidy or tangled depending on it.",
    },
    {
      selector: "crossing",
      label: "Ribbon crossing",
      explanation:
        "Two ribbons crossing means the rank of categories differs between the two axes — exactly the signal of non-independence between the variables. Kosara's original paper argues crossings are a feature, not a bug: a crossing-free parallel set reveals that the two variables are almost independent, which is itself worth knowing.",
    },
    {
      selector: "survived-yes",
      label: "Survived = Yes",
      explanation:
        "The smaller of the two survival segments — 711 of 2201. Follow the ribbons into it and the survival bias by sex is immediate: the Female segment routes most of its volume in, the Male segment routes only a narrow band. No regression table summarises this faster.",
    },
  ],
};
