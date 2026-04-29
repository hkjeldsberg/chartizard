import type { LiveChart } from "@/content/chart-schema";

export const alluvialDiagram: LiveChart = {
  id: "alluvial-diagram",
  name: "Alluvial Diagram",
  family: "flow",
  sectors: ["flow"],
  dataShapes: ["categorical"],
  tileSize: "W",
  status: "live",
  synopsis:
    "Stacked categorical columns joined by ribbons whose widths encode how a cohort redistributes across successive classifications.",
  whenToUse:
    "Reach for an alluvial diagram when a single cohort passes through two or more categorical stages and you want to show how membership shuffles at each step. It is the categorical-data sibling of a Sankey: same ribbon grammar, but the axis is classification rather than source and sink. A pair of grouped bars cannot show this because it loses the pairing between stages.",
  howToRead:
    "Read each column as a stack of rectangles whose heights sum to the cohort total. Pick one rectangle — say, the tallest source in the first stage — and follow its ribbons rightward. A ribbon's width is the count of people who moved from that source to that target, so a thin strand peeling off a fat block is a small minority flow. Conservation is built in: a column's total height is the cohort, and what enters a node must leave it.",
  example: {
    title: "A cohort of 1000 students, high school to career",
    description:
      "The diagram tracks a synthetic 2015 cohort through three classifications — high-school track, tertiary path, and eventual career field. The dominant ribbon is Academic → University → Tech / Healthcare, but the teaching moment is the second-biggest strand: Vocational → Trade school → Trades, which a left-to-right bar chart would hide because it breaks the pairing between stages. Only an alluvial layout lets you see both paths co-exist without collapsing the reclassification.",
  },
  elements: [
    {
      selector: "stage",
      label: "Stage column",
      explanation:
        "Each column is one classification of the whole cohort. Every column's rectangles sum to the same total — 1000 students here — because the diagram reclassifies rather than filters. A column is a moment in the cohort's life; the space between columns is the reshuffling that happens between two such moments.",
    },
    {
      selector: "node",
      label: "Category node",
      explanation:
        "A rectangle inside a column is one category. Its height is the number of people in that category at that stage. 'University' is the tallest node in the middle column because 550 of the 1000 students routed into a four-year programme, regardless of which high-school track they came from.",
    },
    {
      selector: "ribbon",
      label: "Flow ribbon",
      explanation:
        "A ribbon is one source-category to target-category pairing. Its width is the count of people that took that exact transition. The Academic-to-University ribbon is the thickest on the canvas — 420 of the 500 academic-track students went to university — which reads as the default pathway this cohort inherits.",
    },
    {
      selector: "ribbon-width",
      label: "Ribbon width",
      explanation:
        "Width is the only data channel. Two ribbons the same thickness represent the same count, no matter their colour or which way they curve. If ribbon widths are not comparable across the diagram, an alluvial layout is the wrong encoding and a pair of stacked bars would be more honest.",
    },
    {
      selector: "cohort-tracking",
      label: "Cohort tracking",
      explanation:
        "Follow a single ribbon with your eye and you are following one subset of the cohort through every reclassification. This is the chart's point: bars can tell you the totals in each stage, but only an alluvial diagram can tell you which vocational students ended up in the trades versus which retrained into tech.",
    },
    {
      selector: "column-order",
      label: "Column order",
      explanation:
        "The columns are ordered left to right as a sequence — high school, then tertiary, then career. Swap two columns and the diagram is still mathematically valid but conceptually meaningless, because the ribbons now encode a comparison nobody asked for. Time, or process, must run in one direction.",
    },
  ],
};
