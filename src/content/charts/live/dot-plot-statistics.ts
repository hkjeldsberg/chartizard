import type { LiveChart } from "@/content/chart-schema";

export const dotPlotStatistics: LiveChart = {
  id: "dot-plot-statistics",
  name: "Dot Plot (Statistics)",
  family: "distribution",
  sectors: ["statistics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Stacks one dot per observation above its value on the axis — a bar chart where the reader can still count the individuals.",
  whenToUse:
    "Reach for a statistical dot plot when the sample is small enough that every observation deserves its own mark and the reader benefits from being able to count. It beats a histogram for classroom-sized datasets — the eye can add up 12 dots faster than it can decode a bar's length against gridlines.",
  howToRead:
    "Each dot is one observation; dots stack vertically above the value they share. Column height is count, so the x-axis of the tallest column is the mode. Read the profile of column heights as the distribution's shape — symmetric, skewed, bimodal — exactly as you would a histogram's, but without the binning choice to defend. Specific values stay legible because the x-axis is the raw scale, not a range.",
  example: {
    title: "Exam scores from a single class, n = 60",
    description:
      "William Cleveland proposed the statistical dot plot in 1985 as a cure for bar-chart opacity: for a class of sixty students, stacking one dot per student above their exam score produces a picture where the teacher can point at the modal column and say sixteen people scored a 76, then count the long left tail of four students below 60. A bar chart of the same data hides the individuals in the geometry of length — the dots refuse to.",
  },
  elements: [
    {
      selector: "dot",
      label: "Dot (one observation)",
      explanation:
        "Each dot is a single student's score. Keep the radius just small enough that a stack of ten still fits inside the plot — the whole argument for a dot plot is that individuals remain countable. Cleveland's original drawings used open circles; filled ink reads better on screen.",
    },
    {
      selector: "stack",
      label: "Stacked column (mode)",
      explanation:
        "The tallest column marks the modal value — the score shared by the most students. Count its dots and you have the mode's frequency without consulting a y-axis tick. The Wilkinson dot plot is a cousin that drops values onto a continuous axis and stacks them as they collide; this statistical variant assumes an already-discrete x-axis.",
    },
    {
      selector: "shape",
      label: "Distribution shape",
      explanation:
        "Read the envelope of column heights the same way you would a histogram's bars: a single peak with falloff on both sides is symmetric, a peak pushed against one side with a long opposite tail is skewed. The advantage here is that each unit of height is a person, not an opaque magnitude.",
    },
    {
      selector: "median",
      label: "Median column",
      explanation:
        "A worked-in landmark — the column containing the median score. On an exam distribution the median usually sits within a few points of the mode; if they separate noticeably, the class is asymmetric and the teacher should look at the tail before reporting a single summary statistic.",
    },
    {
      selector: "y-axis",
      label: "Y-axis (count)",
      explanation:
        "Counts rise from the baseline; one tick per dot-row keeps the axis honest. Some authors omit the y-axis entirely on a dot plot and let the readable dots do the counting — acceptable when stacks stay below ten. Past that, label it.",
    },
    {
      selector: "x-axis",
      label: "X-axis (score)",
      explanation:
        "The raw scale every observation sits on. Integer scores produce clean columns; continuous measurements force you into Wilkinson-style collision binning. Keep the ticks sparse so the dot columns dominate the ink.",
    },
  ],
};
