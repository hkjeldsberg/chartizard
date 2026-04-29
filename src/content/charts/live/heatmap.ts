import type { LiveChart } from "@/content/chart-schema";

export const heatmap: LiveChart = {
  id: "heatmap",
  name: "Heatmap",
  family: "relationship",
  sectors: ["statistics"],
  dataShapes: ["continuous"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Encodes a two-dimensional matrix as a grid of colour-scaled cells, so density patterns jump out at a glance.",
  whenToUse:
    "Reach for a heatmap when the story is the joint distribution of two categorical or ordinal variables and you have a single numeric value per cell. It is the right encoding when small-multiple line charts would produce a spaghetti tangle and a table would bury the pattern in numbers.",
  howToRead:
    "Pick a row to read one category across the other axis; pick a column to read one slice across all categories. Darker cells mean higher values on the legend's scale. The eye naturally finds the darkest block first — that is the headline. Compare rows against each other by scanning their overall tonal mass, not by reading individual cells.",
  example: {
    title: "NYC subway ridership by hour and day of week",
    description:
      "The MTA publishes entry-turnstile counts for every station in 15-minute slices. Aggregated into a 7-day × 24-hour heatmap, the commuter pattern is unmissable: Tuesday 8am is the single darkest cell in the grid, with a second dark band at 6pm Monday through Friday, while Saturday and Sunday show a shifted, flatter afternoon ridge. Seven overlapping line charts would hide exactly the structure this encoding reveals.",
  },
  elements: [
    {
      selector: "cell",
      label: "Cell",
      explanation:
        "One cell is one intersection of the two axes — here, one weekday at one hour. The fill opacity encodes the value. The darkest cell in this grid is Tuesday 8am; every other cell is read relative to it.",
    },
    {
      selector: "row",
      label: "Row",
      explanation:
        "A row holds one category across all values of the column axis. Scanning a single row answers a focused question: what does Tuesday ridership look like across the full 24 hours?",
    },
    {
      selector: "column",
      label: "Column",
      explanation:
        "A column holds one value of the column axis across all rows. Scanning 18:00 top-to-bottom compares the evening peak across every day of the week in one pass.",
    },
    {
      selector: "y-axis",
      label: "Y-axis",
      explanation:
        "The categorical row labels. Order matters — the weekday cluster is stacked contiguously so the commuter band reads as a single visual block, with the weekend rows separated below.",
    },
    {
      selector: "x-axis",
      label: "X-axis",
      explanation:
        "The categorical column labels. Hours are ordered left-to-right as the clock runs, so morning and evening peaks form vertical bands the eye can locate without reading a single number.",
    },
    {
      selector: "colour-scale",
      label: "Colour scale",
      explanation:
        "The legend that maps fill opacity to the underlying number. A heatmap without a legend is a mood board. The ramp here runs from zero at the bottom to the weekly maximum at the top, so the darkest cell in the grid corresponds to the top of the legend.",
    },
  ],
};
