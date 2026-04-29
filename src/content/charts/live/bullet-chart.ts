import type { LiveChart } from "@/content/chart-schema";

export const bulletChart: LiveChart = {
  id: "bullet-chart",
  name: "Bullet Chart",
  family: "comparison",
  sectors: ["business"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Stephen Few's 2004 replacement for the dashboard gauge — measure, target, and qualitative range packed into a single horizontal strip.",
  whenToUse:
    "Reach for a bullet chart when a single KPI needs to be shown against a target and a shared yardstick. Ten KPIs drawn as ten bullets stack cleanly on a dashboard; ten gauges do not. If the qualitative context (poor / fair / good) is missing, a plain labelled bar with a target tick is enough.",
  howToRead:
    "The dark inner bar is the actual measure. The single vertical tick is the target — ask first whether the bar has crossed it. The graded background bands translate the bar's position into qualitative terms: poor at the low end, fair in the middle, good at the high end. One bullet answers three questions in one glance.",
  example: {
    title: "FY24 annual revenue KPI on an executive dashboard",
    description:
      "Actual revenue of $1.15M clears the $1.00M target and sits inside the 'good' band (which runs from $0.9M to $1.2M). Stephen Few designed the bullet chart in 2004 explicitly to replace dashboard gauges; one bullet encodes measure, target, and qualitative range in roughly five percent of the ink a gauge uses, so ten of them stack on one dashboard without crowding.",
  },
  elements: [
    {
      selector: "measure",
      label: "Measure",
      explanation:
        "The dark inner bar, shorter than the surrounding strip. Its length is the actual value being tracked — revenue, throughput, completion percent, whatever the KPI is.",
    },
    {
      selector: "target",
      label: "Target",
      explanation:
        "A single thick vertical tick at the goal value. The eye asks one question: has the measure bar crossed it? Keep this mark heavier than any gridline so the answer is unambiguous.",
    },
    {
      selector: "qualitative-band",
      label: "Qualitative band",
      explanation:
        "One of the graded background rectangles — poor, fair, or good — stepped in opacity so the darkest band marks the worst range. Bands let a single bullet communicate 'on track' or 'behind' without a second chart.",
    },
    {
      selector: "label",
      label: "Label",
      explanation:
        "The KPI name and units, sitting to the left of the strip. Bullet charts are designed to stack — a clear label is what lets a reader scan a column of them top-down.",
    },
    {
      selector: "comparison-lens",
      label: "Comparison lens",
      explanation:
        "The bullet chart's concept: measure versus target versus qualitative range, encoded in one horizontal strip. One bullet in a dashboard beats ten gauges because the strips align into a column the eye can scan.",
    },
    {
      selector: "value-axis",
      label: "Value axis",
      explanation:
        "The quantitative scale printed below the strip. Like every honest bar encoding, the axis must start at zero — a truncated scale would exaggerate how close the measure sits to the target.",
    },
  ],
};
