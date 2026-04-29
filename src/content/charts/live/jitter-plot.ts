import type { LiveChart } from "@/content/chart-schema";

export const jitterPlot: LiveChart = {
  id: "jitter-plot",
  name: "Jitter Plot",
  family: "distribution",
  sectors: ["statistics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Spreads each observation sideways within its category so that overlapping points become individually visible.",
  whenToUse:
    "Reach for a jitter plot when the sample is small-to-medium and you want the reader to see every observation, not a summary of them. It beats a box plot when the shape matters, and beats a strip plot when the category has enough overlap that dots would pile on top of each other and lie about density.",
  howToRead:
    "Each dot is one observation. The horizontal offset inside a category carries no meaning — it exists only to keep identical y-values from colliding. Read vertical position for value, and read dot crowd as an honest proxy for frequency: a dense cloud is many observations near that value, a lonely dot is a single respondent. Compare categories by eye: wider clouds are more variable, higher clouds are larger values, long tails of single dots are outliers worth naming.",
  example: {
    title: "Pew Research online-panel response times by question type",
    description:
      "Pew Research's audits of their American Trends Panel record how long respondents spend on each question. Plotted as four jittered columns — multiple choice, Likert, ranking, free text — the data shows that multiple-choice times cluster tightly in the 6–15 second band while free-text responses smear from 30 seconds to nearly two minutes with a long upper tail. The chart's job is to refuse to hide the overlap: at 30 respondents per group, honest dots beat any bar the mean could draw.",
  },
  elements: [
    {
      selector: "jitter",
      label: "Horizontal jitter",
      explanation:
        "The sideways offset inside each category is pseudo-random and deterministic. It encodes nothing about the observation itself — its only job is to separate points that would otherwise overplot and lie about how many observations sit at a given value. Different seeds produce different pictures of the same data; pick one and keep it.",
    },
    {
      selector: "data-point",
      label: "Data point",
      explanation:
        "Each circle is one observation. In this chart that means one respondent's time on one question type. Keep the radius small and the fill semi-transparent — when clouds overlap, the compounded ink darkens to reveal density.",
    },
    {
      selector: "density-cluster",
      label: "Density cluster",
      explanation:
        "Where many jittered dots crowd together, frequency becomes legible as visual darkness. A wide, dark cluster is a common range; a tall, sparse column is high variance with no clear mode. This is the jitter plot's whole argument over a strip plot — the spread is wide enough to read density without drawing a KDE.",
    },
    {
      selector: "category-band",
      label: "Category band",
      explanation:
        "Every point for a category must stay within its column — jitter is bounded by the band width, never allowed to spill into the neighbour. This is the rule that makes the x-axis still categorical: a stray point in the wrong column would be a read error.",
    },
    {
      selector: "x-axis",
      label: "X-axis (category)",
      explanation:
        "One band per category. Order the categories meaningfully — by median, by natural ordering (Likert → ranking → free text), or by sample size — so the eye can trace a progression across the axis instead of treating the groups as interchangeable.",
    },
    {
      selector: "y-axis",
      label: "Y-axis (value)",
      explanation:
        "The continuous axis the observations sit on. Keep it shared across every category so dot heights are directly comparable. A per-category rescaling turns the chart into four unrelated pictures.",
    },
  ],
};
