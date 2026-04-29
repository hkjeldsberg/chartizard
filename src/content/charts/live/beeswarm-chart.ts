import type { LiveChart } from "@/content/chart-schema";

export const beeswarmChart: LiveChart = {
  id: "beeswarm-chart",
  name: "Beeswarm Chart",
  family: "distribution",
  sectors: ["statistics"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",
  synopsis:
    "A one-dimensional histogram that keeps every observation as its own mark — no binning, no overlap.",
  whenToUse:
    "Reach for a beeswarm when the distribution matters and the individual observations matter too. It is the right answer whenever a strip plot would overlap into a black bar and a histogram would collapse the very records you came to show. Medical statisticians use it for drug-trial outcomes and DALY rates; it keeps every patient or country visible while still revealing the shape of the sample.",
  howToRead:
    "Each category has a centre line; each observation is one dot placed at its exact value along the vertical axis. The horizontal offset carries no meaning of its own — it exists only because the packer had to move the dot out of a neighbour's way. Dense regions balloon outward, sparse regions collapse back to the spine. Read width as local density and each dot as one record.",
  example: {
    title: "Swarmplot in medical research — drug-trial outcomes per cohort",
    description:
      "Trial biostatisticians prefer beeswarm over boxplot when n per arm is small (20-60). F1000Research and NEJM now routinely print swarmplots of individual patient response alongside the median bar, because the box alone lets a reader miss that the 'improved' cohort was two responders pulling a cluster of non-responders. The swarm shows both the bulk of the cohort and the two outliers doing the work — the median can't.",
  },
  elements: [
    {
      selector: "point",
      label: "Point",
      explanation:
        "One observation, one dot. Unlike a histogram the mark is not an aggregate — hover any dot and it corresponds to a single record in the data. This is the beeswarm's claim on the chart world: it shows the shape of a distribution without ever binning it.",
    },
    {
      selector: "swarm-packing",
      label: "Swarm packing",
      explanation:
        "Points with near-equal values can't sit on top of each other, so the packer walks each one outward from the centre line to the nearest non-colliding offset. The width of the swarm at any height is therefore proportional to how many observations fall at that value — the same information a violin's outline encodes, but built from the actual points.",
    },
    {
      selector: "category-axis",
      label: "Category spine",
      explanation:
        "The vertical centre line of each group. It has no value of its own — it is just the axis the packer pushes observations away from. Without the spine the horizontal offset reads like data; with it the reader sees the offsets for what they are, a layout artefact.",
    },
    {
      selector: "x-axis",
      label: "X-axis (category)",
      explanation:
        "One swarm per category. Order categories meaningfully — by time, sample size, or median — so shifts in the swarm shape across the axis are themselves readable as a trend.",
    },
    {
      selector: "y-axis",
      label: "Y-axis (value)",
      explanation:
        "The continuous axis the observations live on. The y-coordinate of every dot is its true value; the x-coordinate is not. Label the unit, keep the scale shared across swarms, and the reader can compare both level and shape at a glance.",
    },
  ],
};
