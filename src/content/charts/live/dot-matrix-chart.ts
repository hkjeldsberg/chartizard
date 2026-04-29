import type { LiveChart } from "@/content/chart-schema";

export const dotMatrixChart: LiveChart = {
  id: "dot-matrix-chart",
  name: "Dot Matrix Chart",
  family: "comparison",
  sectors: ["infographics"],
  dataShapes: ["categorical"],
  tileSize: "M",
  status: "live",

  synopsis:
    "A grid of uniform dots where each dot represents one unit; rows separate categories so the reader counts filled dots to compare totals.",

  whenToUse:
    "Use a dot matrix when the absolute count — not a proportion — is the story, and when that count needs to be compared across a small number of categories. The format works best when each unit is human-scale: deaths, patients, incidents. Avoid it when counts exceed ~300 per row; at that density the grid becomes illegible.",

  howToRead:
    "Each row belongs to one category. Scan across a row and count filled dots to read the total for that category. Empty dots in the row fill out the grid to a common width, making the unfilled space itself informative — a long tail of empty dots signals a small count against a larger scale. Compare rows top-to-bottom to rank categories.",

  example: {
    title: "2023 US military deaths by branch — Department of Defense casualty report",
    description:
      "Five rows, one per branch, each dot representing one death: Army leads at 116 filled dots across eight rows; the Coast Guard row contains a single filled dot and fourteen empty ones. The empty space in each row is as legible as the count itself — the eye reads magnitude and sparsity simultaneously, something a bar chart hides inside a single rectangle.",
  },

  elements: [
    {
      selector: "filled-dot",
      label: "Filled dot",
      explanation:
        "Each filled dot represents exactly one unit — in this chart, one death. The reader counts filled dots to recover the raw total for a category. Otto Neurath's Isotype institute codified this 'one mark = one unit' convention in the 1920s; the Pudding and the New York Times Upshot still use it for fatality reporting because it preserves the discreteness of each counted event.",
    },
    {
      selector: "empty-dot",
      label: "Empty dot",
      explanation:
        "Empty dots complete the grid to a shared column width. Their presence makes the unfilled remainder visible, so the viewer registers both the absolute count and the magnitude of the shortfall in a single glance. Without the empty dots, a row of 18 and a row of 116 share no common scale, and comparison collapses.",
    },
    {
      selector: "row-label",
      label: "Row label",
      explanation:
        "Each row label names the category on the left. Labels are left-aligned in the margin to keep the dot grid right-justified and scannable. Reading order is top-to-bottom, so rank the categories by descending count unless another order (alphabetical, hierarchical) carries its own meaning.",
    },
    {
      selector: "dot-row",
      label: "Dot row",
      explanation:
        "When a category's count exceeds the grid width, its dots wrap into additional rows below the label. Wrapping rows are a direct consequence of the grid's fixed column count — a design choice that sets the visual scale for the whole chart. The column count should be chosen so the largest category wraps no more than five or six times, or readability degrades.",
    },
    {
      selector: "count-label",
      label: "Count label",
      explanation:
        "A numeric annotation at the right end of each row restates the exact total. The dots give magnitude intuitively; the count label gives precision. Together they let the chart serve both rapid scanning and precise reading — the two tasks a reader usually brings to comparative count data.",
    },
    {
      selector: "x-axis",
      label: "Unit caption",
      explanation:
        "The caption below the grid states the unit conversion: '1 dot = 1 death'. Without it, the viewer must infer the scale, which introduces doubt. Neurath's original Isotype charts placed the unit key prominently for exactly this reason — the icon is meaningless without a declared denominator.",
    },
  ],
};
