import type { LiveChart } from "@/content/chart-schema";

export const bubbleChart: LiveChart = {
  id: "bubble-chart",
  name: "Bubble Chart",
  family: "relationship",
  sectors: ["general", "statistics"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",
  synopsis:
    "A scatter plot with a third variable encoded in the area of each mark — use it when two dimensions are not enough and a third must share the same canvas.",
  whenToUse:
    "Use a bubble chart when a scatter plot tells half the story and the missing half is weight. Adding bubble size lets you see, at a glance, which observations carry how much of the thing being measured — population, revenue, trade volume, portfolio value. Skip it if the third variable is categorical; use colour or faceting instead.",
  howToRead:
    "Read the x and y coordinates the way you would any scatter. Then read bubble area, not bubble radius — a bubble twice as wide covers four times the area and represents four times the value. The legend fixes the scale. The most common mistake with bubble charts is the viewer comparing diameters, so the chart's job is to make area the obvious visual metric.",
  example: {
    title: "GDP per capita, life expectancy, and population (2024)",
    description:
      "Same axes as the Preston-curve scatter, but each country is sized by population. The visual centre of gravity shifts: China and India, compressed into the low-middle income band, dominate the canvas and outweigh all of high-income Europe combined. Nigeria and Indonesia emerge as heavyweights that the unweighted scatter buries. The trade-off is legibility — bubbles this large occlude each other, and the chart trades precision at a point for a truer sense of human scale.",
  },
  elements: [
    {
      selector: "bubble",
      label: "Bubble",
      explanation:
        "Each bubble is one country positioned by GDP per capita and life expectancy, with area proportional to population. A bubble is a data point that carries weight — the chart insists you cannot read a country's position without reading its mass.",
    },
    {
      selector: "bubble-size",
      label: "Size encoding",
      explanation:
        "Area, not radius, encodes population. A country with four times the population draws a bubble twice as wide — the sqrt scale makes the human eye's impression of size roughly proportional to the underlying value. Using a linear scale on radius would make China look sixteen times larger than it is.",
    },
    {
      selector: "outlier-bubble",
      label: "Outlier",
      explanation:
        "Nigeria is an outlier in two dimensions at once: a life expectancy near 53 years despite a population north of 220 million. A regular scatter would tuck Nigeria into the crowd of low-income dots; at full population weight it becomes impossible to ignore.",
    },
    {
      selector: "legend",
      label: "Size legend",
      explanation:
        "The legend shows small, medium, and large reference bubbles with their population values. Without it, bubble area is an ordinal cue — 'bigger than' — but not a measurable one. With it, the reader can estimate any country's population to within a factor of two.",
    },
    {
      selector: "x-axis",
      label: "X-axis (GDP per capita)",
      explanation:
        "GDP per capita in current USD. Identical to the scatter plot that sits alongside — holding the axes fixed between the two charts is the point. It lets the reader see which change is caused by adding size, not by a different frame.",
    },
    {
      selector: "y-axis",
      label: "Y-axis (life expectancy)",
      explanation:
        "Life expectancy at birth, in years, on the same 50–86 domain as the scatter. When bubble area shifts the visual centre of the chart toward China and India, it is the weighting that is doing the work, not a rescaled axis.",
    },
  ],
};
