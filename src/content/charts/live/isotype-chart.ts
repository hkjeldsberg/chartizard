import type { LiveChart } from "@/content/chart-schema";

export const isotypeChart: LiveChart = {
  id: "isotype-chart",
  name: "Isotype Chart",
  family: "comparison",
  sectors: ["infographics"],
  dataShapes: ["categorical"],
  tileSize: "M",
  status: "live",

  synopsis:
    "Repeated pictorial icons in rows where each icon represents a fixed quantity, letting the reader compare counts across categories by comparing row lengths.",

  whenToUse:
    "Use an Isotype chart when communicating statistical quantities to audiences with limited data literacy, or when the human-scale of the counted units matters to the argument. The format demands that counts be round multiples of the icon unit — fractional icons undermine the convention. It suits small category sets (3-8 rows) and counts between roughly 10 and 500 icon-widths.",

  howToRead:
    "Each row belongs to one category; each icon in that row represents a fixed quantity stated in the unit key. Count the icons in a row and multiply by the unit to get the total. Compare row lengths left-to-right: a row twice as long contains twice as many units. The icons are not decorative — their count is the data.",

  example: {
    title: "World population comparison, c. 1930 — Neurath-Arntz Isotype series",
    description:
      "Otto Neurath and Gerd Arntz produced a series of Isotype posters at the Social and Economic Museum of Vienna from 1925-1934, including a world-population comparison where rows of stick figures represented hundreds of millions of people. China and India rows stretched across nearly the full width of the poster; Japan's row contained a handful of figures. The format made the scale of Asian populations viscerally legible to Austrian factory workers — a bar chart would have encoded the same numbers, but the repeated human figures communicated that the bars were counting people.",
  },

  elements: [
    {
      selector: "icon",
      label: "Pictorial icon",
      explanation:
        "Each icon — here, a stick figure in the tradition of Gerd Arntz's Isotype pictograms — represents a fixed quantity stated in the unit key. The icon is identical and uniform throughout the chart: varying its size or shape would introduce a second, unintended visual encoding. Arntz designed over 4,000 standardised pictograms at the Isotype institute in the 1920s-30s specifically to be modular and countable.",
    },
    {
      selector: "icon-row",
      label: "Icon row",
      explanation:
        "A row is one category. Icons fill the row from left to right; the row's length encodes the total for that category. Reading the row left-to-right mirrors the act of counting — the reader's eye performs the accumulation. Neurath chose horizontal rows deliberately, because horizontal scanning is faster than vertical for most readers.",
    },
    {
      selector: "row-label",
      label: "Row label",
      explanation:
        "Each label names the category on the left. Labels sit in the margin so the icon rows start at a common left edge, making row-length comparisons accurate. The Isotype convention aligns all rows flush-left so the right-hand termination of each row is unambiguous — an offset start would corrupt the comparison.",
    },
    {
      selector: "unit-key",
      label: "Unit key",
      explanation:
        "The unit declaration — '1 icon = N units' — is the chart's denominator. Without it, row length is meaningless. Neurath placed the unit key prominently in every Isotype chart because the same icon count could represent vastly different totals depending on the unit chosen. The unit key is as load-bearing as the y-axis of a bar chart.",
    },
    {
      selector: "count-annotation",
      label: "Count annotation",
      explanation:
        "A numeric total at the end of each row recovers the precise figure that icon-counting approximates. Icons force rounding to multiples of the unit; the annotation restores exactness. Together, icons and annotation serve two cognitive modes: rapid magnitude comparison (icons) and precise recall (the number).",
    },
    {
      selector: "row-comparison",
      label: "Row comparison",
      explanation:
        "The core reading act in an Isotype chart is comparing two rows side-by-side. A row that is twice as long contains twice as many icons and therefore twice the quantity — the ratio is directly readable from the physical length. This property holds only when all rows share the same icon size and unit, and all rows start at the same horizontal origin.",
    },
  ],
};
