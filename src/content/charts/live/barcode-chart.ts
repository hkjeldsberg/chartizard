import type { LiveChart } from "@/content/chart-schema";

export const barcodeChart: LiveChart = {
  id: "barcode-chart",
  name: "Barcode Chart",
  family: "distribution",
  sectors: ["statistics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "A 1D strip of vertical ticks on a baseline — one tick per observation, no binning, no smoothing.",
  whenToUse:
    "Reach for a barcode chart when every observation deserves to be plotted and the shape of clustering or silence across a single axis is the question. It is the simplest possible distribution display: no bins to choose, no kernel to tune. Distinct from a rug plot — a rug is a fringe of ticks along another chart's axis showing that chart's marginal distribution, while a barcode is the chart itself, with events centre-stage. It breaks down above roughly 200 events per visible inch, where ticks overlap into a solid block.",
  howToRead:
    "Read left-to-right along the baseline as the continuous axis — usually time. A dense run of ticks is a cluster (a swarm, a burst, a regime change); a stretch with few or no ticks is a quiet period. Tick length can be used to carry a secondary variable; shorter and longer ticks then encode bucketed magnitudes without introducing a second axis. Resist the urge to read any vertical position as meaningful — only position along the baseline and tick length carry data.",
  example: {
    title: "Earthquake catalogues and spike trains",
    description:
      "Seismologists display event catalogues from instruments like the USGS ANSS feed as barcodes to make aftershock sequences visually obvious — a two-week swarm reads as a dense bar of ink where a binned histogram would average it into a forgettable tall bar. Neuroscientists use the same form for spike trains from single neurons (Kandel's Principles of Neural Science uses them throughout), where a millisecond-scale burst is the unit of analysis and any binning would destroy the pattern being studied.",
  },
  elements: [
    {
      selector: "tick",
      label: "Tick",
      explanation:
        "Each vertical tick is one observation. Nothing is aggregated. Position along the baseline is when or where the event happened; there is no count axis because every event is already shown.",
    },
    {
      selector: "cluster",
      label: "Cluster",
      explanation:
        "A tight run of ticks where the gap between events collapses toward zero. In seismology this reads as an aftershock swarm; in spike-train recordings it reads as a burst. The cluster is the thing the chart exists to show without pre-committing to a bin width.",
    },
    {
      selector: "gap",
      label: "Gap",
      explanation:
        "An empty stretch along the baseline is a silence — no observations in that interval. A histogram would render a gap as a zero-height bar and bury it; the barcode shows silence as actual empty space, at its true duration.",
    },
    {
      selector: "tick-length",
      label: "Tick length",
      explanation:
        "Length encodes a secondary variable — often a bucketed magnitude. Short ticks read as small-magnitude events, long ticks as large. Use length sparingly: three buckets are legible, five start to blur, and any continuous encoding here is better served by a scatter.",
    },
    {
      selector: "x-axis",
      label: "X-axis",
      explanation:
        "The continuous axis every tick lives on — almost always time. The baseline itself carries no information; it is just a rule to hang ticks from so the eye has a horizon to read against.",
    },
  ],
};
