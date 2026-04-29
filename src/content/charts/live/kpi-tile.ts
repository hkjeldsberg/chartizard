import type { LiveChart } from "@/content/chart-schema";

export const kpiTile: LiveChart = {
  id: "kpi-tile",
  name: "KPI / Big Number",
  family: "comparison",
  sectors: ["business"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "A single number sized to dominate the frame, with a percent-change badge and a small sparkline for context.",
  whenToUse:
    "Use a KPI tile when the single-value answer is the insight and the reader has already decided the metric matters. They are the junk food of data visualisation — every dashboard overuses them, most stack eight at a time, and most of those eight are decorative. Earn the tile: pick the one number a decision actually hinges on, and put it on the wall.",
  howToRead:
    "Read the big number first. Then read the delta badge: an up-arrow with a percent is this period's change against the comparison baseline in the sparkline inset (here, last month). The inset sparkline shows the run-up that produced the headline — its slope tells you whether the +12.3% is part of a trend or a single-period jump. The unit label under the number answers the question 'of what?'.",
  example: {
    title: "Monthly Active Users, end-of-month snapshot",
    description:
      "A product team's weekly review opens with a 2.4M MAU tile showing a +12.3% month-over-month lift and a 12-point sparkline climbing from ~1.6M. The tile earns its space because the growth trajectory is the meeting's agenda; stripping it to anything less than the number, the delta, and the curve would force the reader to ask for each piece in turn.",
  },
  elements: [
    {
      selector: "big-number",
      label: "Big number",
      explanation:
        "The headline metric, sized to be the first thing the eye lands on. Rounded to the precision the decision needs — 2.4M, not 2,418,731 — because false precision slows the read without adding value.",
    },
    {
      selector: "unit-label",
      label: "Unit label",
      explanation:
        "The small mono-cased caption under the number. It answers 'of what?' and must always be present — a KPI tile without a unit is a numeral, not a measurement.",
    },
    {
      selector: "delta",
      label: "Delta badge",
      explanation:
        "The percent-change pill with an up-arrow, comparing this period against the one before it. Colour and direction are redundant by design — the arrow carries the sign for readers who cannot rely on green-vs-red.",
    },
    {
      selector: "inset-sparkline",
      label: "Inset sparkline",
      explanation:
        "A 12-point trend glyph pinned to the bottom-right corner. It is context, not the subject — it exists so the reader can tell whether the headline delta is a continuing trend or a one-off spike, without committing to a full line chart.",
    },
    {
      selector: "comparison-baseline",
      label: "Comparison baseline",
      explanation:
        "A faint dashed line across the sparkline at the prior-period value. It is what the +12.3% is measured against, drawn in so the reader does not have to infer it from the curve's second-to-last point.",
    },
  ],
};
