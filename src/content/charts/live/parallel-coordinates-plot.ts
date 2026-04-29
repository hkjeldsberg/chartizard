import type { LiveChart } from "@/content/chart-schema";

export const parallelCoordinatesPlot: LiveChart = {
  id: "parallel-coordinates-plot",
  name: "Parallel Coordinates Plot",
  family: "relationship",
  sectors: ["statistics"],
  dataShapes: ["continuous"],
  tileSize: "W",
  status: "live",
  synopsis:
    "Lays out many variables as parallel vertical axes and draws each observation as a polyline crossing them all.",
  whenToUse:
    "Reach for parallel coordinates when every observation has many continuous attributes and you want to see the shape of the whole feature vector at once. It excels at spotting clusters, correlations, and outliers in under 30 rows and 4–8 dimensions — precisely the case where a scatter-plot matrix becomes too many small charts to scan.",
  howToRead:
    "Each vertical axis is one variable, scaled independently between its own min and max. Each polyline is one observation, its vertices fixed by that row's value on each axis. Parallel line segments between two axes mean the two variables are positively correlated across the rows you're reading; X-crossings mean they're inversely correlated. Coherent ribbons of lines are clusters.",
  example: {
    title: "The 1983 Detroit auto dataset, replayed across 50 years",
    description:
      "Plotting 30 cars across MPG, cylinders, displacement, horsepower, weight, and model year surfaces three clean ribbons: classic American V8s from 1970–75 sit at high displacement and low MPG, modern 4-cylinder commuters invert to low displacement and high MPG, and recent luxury-performance cars cross the two in the middle. The X-crossing between the MPG and cylinder axes is a textbook inverse-correlation signature.",
  },
  elements: [
    {
      selector: "axis",
      label: "Axis",
      explanation:
        "One of the parallel vertical axes. It represents a single variable — MPG, horsepower, model year — and every polyline touches it exactly once. Axis order is editorial: put variables you expect to correlate next to each other so correlation becomes readable.",
    },
    {
      selector: "axis-scale",
      label: "Axis scale",
      explanation:
        "Each axis has its own domain, independently normalised between that variable's minimum and maximum. An observation sitting at the top of one axis and the bottom of another is not contradiction — the axes are not on a common scale, and that's the whole point.",
    },
    {
      selector: "polyline",
      label: "Polyline",
      explanation:
        "One line is one observation — one car. Its vertices on each axis are its values on those variables. The line's shape is the observation's fingerprint across all six dimensions simultaneously.",
    },
    {
      selector: "crossings",
      label: "Crossings",
      explanation:
        "Between two axes, lines that stay parallel indicate a positive correlation across the rows; lines that cross indicate a negative correlation. Between MPG and cylinders every line crosses — thirsty cars have more cylinders, efficient ones fewer.",
    },
    {
      selector: "cluster",
      label: "Cluster",
      explanation:
        "When a subset of observations takes the same path across several axes, the polylines bundle into a visible ribbon. The classic-American ribbon hugs low MPG, 8 cylinders, and big displacement — a coherent band across three axes is a cluster you can trust.",
    },
    {
      selector: "line-density",
      label: "Line density",
      explanation:
        "The chart scales to roughly 30 observations before the lines pile into illegible hatch. Past that, use alpha blending, brushing, or small multiples — stacking a thousand polylines produces a grey smear, not a chart.",
    },
  ],
};
