import type { LiveChart } from "@/content/chart-schema";

export const scatterPlot: LiveChart = {
  id: "scatter-plot",
  name: "Scatter Plot",
  family: "relationship",
  sectors: ["general", "statistics"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Places each observation at its x,y coordinate so the eye can read the shape of a relationship between two variables.",
  whenToUse:
    "Reach for a scatter plot when you want to see whether two continuous variables move together, and how. A single correlation coefficient collapses the relationship into a number; the scatter keeps the curve, the scatter around it, and the outliers that a summary statistic would hide.",
  howToRead:
    "Read each dot as one unit of observation — a country, a person, a trial. Scan the cloud for its overall shape first: a diagonal band says positive association, a descending band negative, a curve says the relationship bends, a blob says nothing much. Then look for the points that refuse to join the cloud. Those outliers are usually where the interesting questions live.",
  example: {
    title: "GDP per capita vs. life expectancy, ~40 countries (2024)",
    description:
      "The Preston curve: life expectancy climbs sharply with income at the low end and then flattens. The United States and Norway sit on a nearly horizontal ceiling near 80 years; Ethiopia and DRC sit at the steep part of the climb. Equatorial Guinea is the outlier that matters — oil-rich enough to sit at middle-income GDP yet marooned at a life expectancy below Nigeria's. The dot out of place is the reason this chart earns its keep.",
  },
  elements: [
    {
      selector: "data-point",
      label: "Data point",
      explanation:
        "Each dot is one country. The x coordinate is GDP per capita, the y coordinate is life expectancy. Keep the dots small and uniform so the cloud as a whole is the subject, not any single point.",
    },
    {
      selector: "outlier-point",
      label: "Outlier",
      explanation:
        "Equatorial Guinea sits far below the curve its GDP would predict. Oil revenue lifts the per-capita average, but that income never reaches the health system. Outliers like this are the reason a scatter beats a correlation coefficient — a single r-value would swallow the story whole.",
    },
    {
      selector: "trend-impression",
      label: "Preston curve",
      explanation:
        "Life expectancy rises steeply with income at the low end, then flattens above roughly $30k. The eye fits the curve even without a drawn line; the famous 'Preston curve' is visible in almost every cross-country scatter of health against income since 1975.",
    },
    {
      selector: "x-axis",
      label: "X-axis (GDP per capita)",
      explanation:
        "GDP per capita in current USD. A linear axis exaggerates the rich countries and compresses everything below $10k into a narrow strip. A log axis would straighten the Preston curve, but the linear version is honest about how skewed country income actually is.",
    },
    {
      selector: "y-axis",
      label: "Y-axis (life expectancy)",
      explanation:
        "Life expectancy at birth, in years. The domain starts near 50 rather than 0 because the meaningful variation sits between 55 and 85. Starting at zero is honest for bar charts; for a scatter where every point lives in the same range, it buries the story.",
    },
    {
      selector: "point-label",
      label: "Country label",
      explanation:
        "A direct label replaces a legend for a named point. Use labels sparingly — one or two anchors plus a handful of outliers. Labelling every country turns the chart back into a table.",
    },
  ],
};
