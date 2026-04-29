import type { LiveChart } from "@/content/chart-schema";

export const stemplot: LiveChart = {
  id: "stemplot",
  name: "Stem-and-Leaf Plot",
  family: "distribution",
  sectors: ["statistics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Splits each number into a stem and a leaf, then stacks the leaves as text — a histogram that preserves every original value.",
  whenToUse:
    "Reach for a stemplot on small samples, typically twenty to a hundred integers, when you want the shape of the distribution and the raw data in the same glance. Classroom scores, survey ages, batting averages — any case where the reader should be able to read a specific value back out of the chart.",
  howToRead:
    "The stem is the leading digits; each leaf is the next digit of one observation. A row's length is its bar height; a row's leaves, read left to right in sorted order, enumerate every value in that bin. The key at the bottom anchors the convention — 7 | 4 = 74, not 7.4 or 740.",
  example: {
    title: "Period-8 chemistry exam, 60 students (scores 50–99)",
    description:
      "John Tukey introduced the stem-and-leaf plot in Exploratory Data Analysis (1977) as a chart you can draw by hand while still doing arithmetic on it. A teacher looking at the 7-row — say 7 | 0 2 2 3 4 5 5 6 8 9 — sees the modal class is the 70s, finds the median without re-sorting, and can pick out every score that earned a C-plus. A histogram with the same bin width would show the shape but throw away the numbers.",
  },
  elements: [
    {
      selector: "stem-column",
      label: "Stem column",
      explanation:
        "The leading digits — here, the tens. The column of stems plays the role of the x-axis in a histogram, but read top to bottom instead of left to right. Each stem defines one bin of width ten.",
    },
    {
      selector: "divider",
      label: "Divider",
      explanation:
        "The vertical bar between stems and leaves. It's not decoration: it tells the reader where to split each observation. A misread divider turns 7 | 4 into 74 into 7.4 into disaster.",
    },
    {
      selector: "leaves-row",
      label: "Leaves row",
      explanation:
        "One row is one bin. The leaves are the trailing digits of every observation in that bin, written as characters in a monospace font so character count equals bar length. Count the leaves and you have the frequency.",
    },
    {
      selector: "modal-class",
      label: "Modal class",
      explanation:
        "The row with the most leaves — the tallest bar. In a stemplot the mode is literal: it's the longest line of text on the page. Mean and median are still a short arithmetic away, since no information has been discarded.",
    },
    {
      selector: "sorted-leaves",
      label: "Sorted leaves",
      explanation:
        "Within each row, leaves are written in ascending order. That convention turns the stemplot into a sorted list you can read the quartiles out of directly — the thirtieth and forty-fifth leaves of sixty, counted across rows, are the median neighbours.",
    },
    {
      selector: "key",
      label: "Key",
      explanation:
        "A one-line legend of the form stem | leaf = value. Without it the chart is ambiguous — 7 | 4 could mean 74, 7.4, or 740 depending on the units. Tukey insisted on this footer, and so should you.",
    },
  ],
};
