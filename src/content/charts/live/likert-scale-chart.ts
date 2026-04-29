import type { LiveChart } from "@/content/chart-schema";

export const likertScaleChart: LiveChart = {
  id: "likert-scale-chart",
  name: "Likert / Diverging Stacked Bar",
  family: "comparison",
  sectors: ["statistics", "social-sciences"],
  dataShapes: ["categorical"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Five-level survey responses stacked per question and centred on the Neutral category so positive and negative tilt are visible before any number is read.",
  whenToUse:
    "Reach for this layout whenever you need to show many Likert-scale questions side by side and the reader's first question is 'which way does each item lean?'. A plain stacked bar with a shared left baseline forces the eye to do arithmetic to locate sentiment; centring on Neutral promotes tilt to the primary visual channel so an engagement survey's wins and losses are separable at a glance.",
  howToRead:
    "Every row is one question, with its Neutral segment straddling a shared centre axis. Segments to the left are Disagree and Strongly Disagree; segments to the right are Agree and Strongly Agree. Length encodes the share of each response — rows that reach further right lean positive, rows that reach further left lean negative. The first read is per-row sentiment (tilt); the second is cross-row ranking if the list is sorted by positive share.",
  example: {
    title: "Annual employee engagement survey, eight questions",
    description:
      "A 1,400-person company runs its annual engagement survey and tabulates the five response levels for each question. 'My team is productive' skews hard right: 82% agree or strongly agree. 'Pay is fair for my role' skews hard left: 62% disagree or strongly disagree. 'Tools I have work well' sits almost symmetric on the centre — a genuine mixed verdict. Plotted as eight one-sided stacked bars, the reader computes tilt by eye; centred on Neutral, tilt is the layout.",
  },
  elements: [
    {
      selector: "stacked-row",
      label: "Stacked row",
      explanation:
        "One row is one question. Its five coloured segments are the five response levels, and the row is horizontally shifted so that the midpoint of its Neutral segment sits on the shared centre. Total row width is always 100 percentage points, but because centring moves each row independently, the left and right ends do not line up between rows — that is the point.",
    },
    {
      selector: "strongly-agree",
      label: "Strongly Agree segment",
      explanation:
        "The rightmost segment on every row. Its width encodes the share of respondents who chose the strongest positive response. Darkening this segment (the ink end of the palette) mirrors the common convention that 'stronger' responses carry more visual weight than 'somewhat' ones.",
    },
    {
      selector: "strongly-disagree",
      label: "Strongly Disagree segment",
      explanation:
        "The leftmost segment on every row. Width encodes the share of strongly negative responses. Rendered in the warm accent so that polarity is distinguishable from greyscale intensity alone — without colour, the chart would rely entirely on position.",
    },
    {
      selector: "neutral-band",
      label: "Neutral band and axis",
      explanation:
        "The central axis runs through the midpoint of every Neutral segment. Splitting Neutral half-left and half-right is one resolution of a design controversy that has no settled answer — the alternative is to draw Neutral as its own column between the two halves. The split convention reads tilt more cleanly; the column convention keeps 'no opinion' visually separable. Pick one and be explicit.",
    },
    {
      selector: "positive-tilt",
      label: "Positively tilted row",
      explanation:
        "A row whose combined Agree + Strongly Agree mass extends far enough right that the row's visual centre of gravity sits right of the axis. These rows are where the organisation is winning. If the list is sorted by positive share descending, these cluster at the top.",
    },
    {
      selector: "negative-tilt",
      label: "Negatively tilted row",
      explanation:
        "A row whose Disagree + Strongly Disagree mass extends further left than the right side extends right. These are the items where the organisation is losing, and the layout makes 'losing' a shape, not a number. Sort order is optional, but putting negatively tilted rows at the bottom matches top-to-bottom reading.",
    },
    {
      selector: "legend",
      label: "Legend",
      explanation:
        "Colour mapping for the five levels. Order the legend left-to-right the same way the segments order within a row — strongly-disagree, disagree, neutral, agree, strongly-agree — so the legend itself is a miniature of the chart's layout. Rensis Likert's original 1932 paper proposed the five-point scale; the centred diverging layout came later and is not part of his definition.",
    },
  ],
};
