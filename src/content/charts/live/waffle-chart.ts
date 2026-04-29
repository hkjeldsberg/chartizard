import type { LiveChart } from "@/content/chart-schema";

export const waffleChart: LiveChart = {
  id: "waffle-chart",
  name: "Waffle Chart",
  family: "composition",
  sectors: ["general", "infographics"],
  dataShapes: ["categorical"],
  tileSize: "S",
  status: "live",
  synopsis:
    "A 10×10 grid of 100 squares where each filled cell equals one percent — a pie chart that cannot round its own numbers.",
  whenToUse:
    "Use a waffle when a single proportion is the headline and the reader needs to trust the number, not just its shape. Two to four categories is the sweet spot; beyond that the grid becomes a jigsaw and a bar chart wins. Avoid waffles for precise continuous quantities — the unit is always a round one percent.",
  howToRead:
    "Count the filled squares. Each square is one percent of the whole, so the share reads off directly instead of being inferred from an angle or a bar length. The grid fills bottom-to-top and left-to-right so the remainder collects at the top-right, making the gap between the encoded value and 100 percent its own visual statement.",
  example: {
    title: "Global adult literacy rate, 2022",
    description:
      "UNESCO's 2022 estimate puts adult literacy at 87 percent — 87 squares filled, 13 outlined. The waffle makes the residual do work: the thirteen empty cells in the top-right corner stand for roughly 754 million adults who cannot read a short simple statement about their everyday life. The same figure rendered as a pie collapses into a single curve the reader has to size up; the grid refuses to round.",
  },
  elements: [
    {
      selector: "filled-cell",
      label: "Filled cell",
      explanation:
        "One inked square is one percent of the whole. Cells are the unit of encoding — the waffle's design decision is that the reader should be able to count, not estimate, if they want to check the headline number.",
    },
    {
      selector: "empty-cell",
      label: "Empty cell",
      explanation:
        "A hairline-outlined square represents the missing percent. Keeping empties visible turns the remainder into signal: thirteen outlined squares are a clearer picture of 'not yet' than a blank corner would be.",
    },
    {
      selector: "total-cells",
      label: "The 100-cell grid",
      explanation:
        "The full 10×10 frame is the denominator, drawn explicitly. A pie chart asks the reader to trust that the disc adds to 100 percent; the waffle lays all 100 cells down so the whole is visible, not inferred.",
    },
    {
      selector: "proportion",
      label: "Proportion",
      explanation:
        "The count of filled cells is the statistic. Because cells are uniform squares on a shared grid, the comparison is a length-on-length judgment — the encoding the eye reads most accurately, better than angles or areas.",
    },
    {
      selector: "grid-layout",
      label: "Grid layout",
      explanation:
        "Ten rows of ten columns is a deliberate constraint: a grid forces cells to be the same size and shape, removing the distortion a pie's angular wedges introduce. Orient the fill bottom-up so the value grows like a gauge and the residual collects where the eye ends up.",
    },
    {
      selector: "comparison-baseline",
      label: "One square equals one percent",
      explanation:
        "The legend cements the unit. Without it, readers can still see the shape but may not trust the arithmetic — spelling out the one-to-one cell-to-percent mapping turns the grid from a picture into a ledger.",
    },
  ],
};
