import type { LiveChart } from "@/content/chart-schema";

export const pictorialPercentageChart: LiveChart = {
  id: "pictorial-percentage-chart",
  name: "Pictorial Percentage Chart",
  family: "composition",
  sectors: ["infographics"],
  dataShapes: ["categorical"],
  tileSize: "S",
  status: "live",
  synopsis:
    "A 10x10 grid of subject-bearing icons where the shaded subset reads as a percentage — one icon per point.",
  whenToUse:
    "Reach for a pictorial percentage chart when a single proportion must carry moral or statistical weight — a risk, a minority share, a survival rate. The icon itself encodes who the number is about, which a waffle chart's abstract squares deliberately do not.",
  howToRead:
    "Count in units of ten: each column is 10%, each row is 10%, each icon is 1 out of 100. The shaded cluster is the share the chart is about; the unshaded remainder is the rest of the denominator, drawn as the same figure so the viewer cannot forget they are also people. Read the caption — without a legend pairing the shaded state with meaning, the figures are only ornament.",
  example: {
    title: "Lifetime breast cancer risk (U.S. women)",
    description:
      "The American Cancer Society and the National Cancer Institute SEER program publish a lifetime risk of about 1 in 8 — 12 to 13 percent. Health-communication researchers, following Gigerenzer's 2002 Reckoning with Risk, render this as 100 female figures with 13 shaded; patients reliably interpret the 100-figure display more accurately than the bare percentage. The figure silhouette keeps the number from floating free of its subject.",
  },
  elements: [
    {
      selector: "shaded-figure",
      label: "Shaded figure",
      explanation:
        "One of the 13 icons drawn with a filled head and full-weight strokes. Each shaded figure is a single percentage point belonging to the highlighted share. Keep the fill solid so individual figures read as countable units rather than a continuous mass.",
    },
    {
      selector: "unshaded-figure",
      label: "Unshaded figure",
      explanation:
        "One of the 87 icons drawn in hairline strokes with an empty head outline. The remainder is not blank space — it is still people, rendered in the same silhouette, which is how the chart keeps the denominator human rather than implicit.",
    },
    {
      selector: "icon-subject",
      label: "Icon subject",
      explanation:
        "The pictogram's shape carries the chart's domain. A female stick-figure with a triangular skirt declares the subject in a way a square cannot. This is the hinge distinguishing pictorial percentage from waffle chart: the icon is argumentative, not neutral.",
    },
    {
      selector: "grid-of-100",
      label: "Grid of 100",
      explanation:
        "Ten columns by ten rows fix the denominator at a hundred so viewers can read the share without doing mental division. Health-literacy studies since Gigerenzer's work show this format outperforms the bare percentage on comprehension tests, especially among lower-numeracy readers.",
    },
    {
      selector: "shaded-cluster",
      label: "Shaded cluster",
      explanation:
        "The shaded figures fill from the bottom up so the group reads as a single mass rather than a scatter of highlights. The clustered silhouette is what the eye remembers; a salt-and-pepper distribution of the same count would read as noise, not a share.",
    },
    {
      selector: "legend-caption",
      label: "Legend caption",
      explanation:
        "The caption pairs the shaded state with its referent — lifetime diagnosis here. Without it, the figures are only decoration. The rule from W.E.B. Du Bois's 1900 data portraits holds: the icon persuades, the legend anchors what it persuades of.",
    },
  ],
};
