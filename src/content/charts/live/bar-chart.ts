import type { LiveChart } from "@/content/chart-schema";

export const barChart: LiveChart = {
  id: "bar-chart",
  name: "Bar Chart",
  family: "comparison",
  sectors: ["general"],
  dataShapes: ["categorical"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Ranks categorical values against a shared zero baseline so the eye can compare magnitudes directly.",
  whenToUse:
    "Use a bar chart when you want to compare the magnitudes of a handful of discrete categories at a single moment. It is the right encoding whenever the question is 'which is bigger, and by how much'.",
  howToRead:
    "Each bar stands for one category. Bar height is the value; the shared zero baseline at the bottom lets you read ratios directly, so a bar twice as tall really does represent twice the value. Sort bars by value unless the category order itself carries meaning, and keep the y-axis anchored at zero — starting a bar chart mid-axis distorts the comparison the chart exists to make.",
  example: {
    title: "Median monthly rent across the ten largest US metros, 2024",
    description:
      "Zillow's 2024 rent index reads as a ranked bar chart: New York and San Francisco clear $3,000, while Atlanta and Chicago sit near $1,700. Because every bar shares the same zero baseline, a glance tells you New York rent is roughly double Atlanta's — a ratio a line chart of city-over-time trends would bury.",
  },
  elements: [
    {
      selector: "bar",
      label: "Bar",
      explanation:
        "One bar per category. The rectangle's height encodes the value; its width is arbitrary and should be equal across bars. Because bars sit on a common baseline, the eye reads them as lengths, which is the encoding we judge most accurately.",
    },
    {
      selector: "x-axis",
      label: "Category axis",
      explanation:
        "The categorical axis. Order carries meaning: sort by value when the comparison is the story, or by an inherent order (alphabetical, chronological, hierarchical) when the categories already have one.",
    },
    {
      selector: "y-axis",
      label: "Value axis",
      explanation:
        "The magnitude axis. It must start at zero — truncating the y-axis makes a 5% difference look like a 5x difference, which is the most common way bar charts are misused.",
    },
    {
      selector: "baseline",
      label: "Zero baseline",
      explanation:
        "The line every bar grows from. The shared baseline is what makes bar charts readable as proportions: a bar twice as tall means twice the value only because both bars start at zero.",
    },
    {
      selector: "gridline",
      label: "Gridline",
      explanation:
        "A light horizontal reference at regular intervals. Gridlines help the eye project a bar top to a value on the y-axis; keep them subtle so the bars stay the visual subject.",
    },
    {
      selector: "axis-label",
      label: "Axis label",
      explanation:
        "States the unit of the value axis. A bar chart with an unlabeled axis is a ranking without a scale — readers can order the bars but not judge whether the differences matter.",
    },
  ],
};
