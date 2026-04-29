import type { LiveChart } from "@/content/chart-schema";

export const deviationChart: LiveChart = {
  id: "deviation-chart",
  name: "Deviation Chart",
  family: "comparison",
  sectors: ["general"],
  dataShapes: ["categorical"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Horizontal bars centred on zero to show signed distance from a baseline or target — the axis itself is the reference.",
  whenToUse:
    "Use a deviation chart when the variable you care about is the gap between actual and expected, not the absolute magnitude. Variance-to-forecast, actual-minus-target, year-over-year change, residuals from a model — any measurement where 'zero' means 'on plan' and the sign matters more than the number.",
  howToRead:
    "Start at the zero line in the middle of the plot — that is the baseline, the plan, the target. Bars to the right are positive deviations (exceeded plan); bars to the left are negative (fell short). Length encodes the size of the miss or beat. Sort rows by signed magnitude so the top of the chart is the biggest beat, the bottom is the biggest miss, and the row where colour flips is the break-even line.",
  example: {
    title: "Q1 retail sales: actual vs forecast by region",
    description:
      "A multinational retailer closes Q1 and plots actual minus forecast revenue for twelve regions. The South prints +$18M, Germany −$17M. A standard bar chart of actual revenue would rank the regions by raw size and bury the miss; centring on zero makes the question 'who beat plan, who missed' the first thing the eye reads. The chart's value is not the numbers — it is that forecast-variance has been promoted to the primary encoding.",
  },
  elements: [
    {
      selector: "positive-deviation",
      label: "Positive deviation",
      explanation:
        "A bar extending right from the zero axis — the region beat forecast. Length encodes the dollar size of the beat. Pair with the colour change so a short positive bar is never mistaken for a short negative one.",
    },
    {
      selector: "negative-deviation",
      label: "Negative deviation",
      explanation:
        "A bar extending left from the zero axis — the region missed forecast. The separate colour is deliberate redundancy: direction already encodes sign, but the warm tone makes the polarity survive even when the bar is short.",
    },
    {
      selector: "zero-reference",
      label: "Zero reference line",
      explanation:
        "The axis line at zero is the whole reason this chart exists. In a deviation chart the zero line is semantic — it stands for 'on plan', 'on target', 'matches the baseline'. That is the distinction from a diverging bar chart, whose centre is structural (the neutral category); here the centre carries real-world meaning.",
    },
    {
      selector: "category-axis",
      label: "Category axis",
      explanation:
        "The list of rows down the left side. Categories are discrete — regions, products, teams — and the axis does not order them arithmetically. Their vertical position is assigned by the row-ordering rule, not by the data values themselves.",
    },
    {
      selector: "value-axis",
      label: "Value axis",
      explanation:
        "The bottom axis carries the signed magnitude of deviation. Ticks show explicit plus and minus signs so the scale is readable without reference to colour. Label the axis with its unit and, when space allows, the formula (actual − forecast) so the sign convention is unambiguous.",
    },
    {
      selector: "row-ordering",
      label: "Row ordering",
      explanation:
        "Vertical order carries information when rows are sorted by signed deviation — top is the biggest beat, bottom the biggest miss, and the colour-flip row is the break-even line. Sorting alphabetically throws that second dimension away. Sort by region name only when the reader needs to look up a specific row and you are willing to sacrifice the ranking read.",
    },
  ],
};
