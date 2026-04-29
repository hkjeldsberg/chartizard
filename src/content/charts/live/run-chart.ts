import type { LiveChart } from "@/content/chart-schema";

export const runChart: LiveChart = {
  id: "run-chart",
  name: "Run Chart",
  family: "change-over-time",
  sectors: ["quality"],
  dataShapes: ["temporal"],
  tileSize: "M",
  status: "live",
  synopsis:
    "A line-and-median plot that asks one question: how many consecutive points lean the same way?",
  whenToUse:
    "Use a run chart when you need the cheapest possible signal that a process has shifted, and you do not yet have the 25+ subgrouped observations a Shewhart control chart wants. It is the workhorse of quality-improvement teams running before-and-after experiments — infection rates after a hand-hygiene rollout, defect counts after a line change, door-to-needle times after a new triage protocol.",
  howToRead:
    "Read the line the way you would any time series, then watch the points against the median. A single point above or below the median is noise. Six or more consecutive points on the same side — a 'run' — is the classical signal that the process has moved; that streak is what the band highlights here. A run chart says something looks off. A control chart tells you how far off.",
  example: {
    title: "Daily hospital-acquired infections over a 90-day improvement cycle",
    description:
      "The Institute for Healthcare Improvement's playbook puts a run chart at the centre of every quality project: post it on the ward wall, update it daily, and let the team see the streak form in real time. A run of 10+ below-median days after a hand-hygiene intervention is evidence the intervention worked, not a coincidence — the rules were formalised by Swed and Eisenhart in 1943.",
  },
  elements: [
    {
      selector: "median-line",
      label: "Median line",
      explanation:
        "The horizontal reference is the median of the series, not the mean. Median is used so a single extreme day cannot yank the reference around — it keeps the 'above/below' labelling stable over a noisy process.",
    },
    {
      selector: "run",
      label: "The run",
      explanation:
        "A shaded band marks six or more consecutive points on the same side of the median — the classical run-chart signal of a shift. The run length is the only arithmetic the chart does; everything else is the analyst's eye.",
    },
    {
      selector: "data-point",
      label: "Data point",
      explanation:
        "Each point is one observation in time-order. Unlike a control chart there are no control limits around the points: you are not asking 'is this point unusual' but 'does this sequence lean one way'.",
    },
    {
      selector: "starting-value",
      label: "Starting value",
      explanation:
        "The leftmost point anchors the series. Run charts are read left-to-right as an improvement story, so the first value is often the baseline the team is trying to beat.",
    },
    {
      selector: "x-axis",
      label: "X-axis",
      explanation:
        "Ordered time — usually days or shifts. The axis must be continuous and evenly spaced; missing days should be plotted as gaps, not skipped, or the run-length rule stops working.",
    },
    {
      selector: "y-axis",
      label: "Y-axis",
      explanation:
        "The count or rate being tracked. Starting at zero is almost always correct for a run chart: the improvement target is usually 'fewer', and zero is the floor that gives the trend its meaning.",
    },
  ],
};
