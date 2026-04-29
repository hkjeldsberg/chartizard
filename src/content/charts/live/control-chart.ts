import type { LiveChart } from "@/content/chart-schema";

export const controlChart: LiveChart = {
  id: "control-chart",
  name: "Control Chart",
  family: "change-over-time",
  sectors: ["quality"],
  dataShapes: ["temporal"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Tracks a process variable over time against a mean and ±3σ control limits — points outside the band are the chart's point.",
  whenToUse:
    "Reach for a control chart when you want to know whether a repeating process is stable, not just whether a single day was good or bad. It's the standard chart of statistical process control (SPC) because it distinguishes ordinary variation ('common cause') from out-of-bounds behaviour ('special cause') using a fixed statistical rule rather than an opinion.",
  howToRead:
    "Read the centre-line as the long-run process mean. The dashed upper and lower lines are mean ± 3σ — the band where a stable process is expected to live 99.7% of the time. A point outside that band is a signal, not a number: investigate the system, not the operator. Softer signals matter too — a run of seven points on the same side of the mean suggests the process has shifted, even if nothing has crossed a limit yet.",
  example: {
    title: "Emergency-room wait times, 60 days",
    description:
      "An ER charts daily median wait minutes against a 42-minute process mean with control limits at 18 and 66 (±3σ). Two days leave the band — one spike, one dip — and a 7-day run sits above the mean in the middle of the window, flagging a quiet shift before a limit is breached. The point is that the chart lets the ops lead triage which days were actually different, instead of reacting to every bad afternoon.",
  },
  elements: [
    {
      selector: "mean-line",
      label: "Process mean",
      explanation:
        "The solid centre line is the long-run average of the process. It is not a target; it is the value the process tends toward when nothing unusual is happening. Changing the mean changes the shape of every signal on the chart, so it's computed once from a stable baseline, not recomputed per window.",
    },
    {
      selector: "ucl-line",
      label: "Upper control limit (UCL)",
      explanation:
        "The dashed upper line sits at mean + 3σ. For a stable process roughly 99.7% of points fall below it; a point above is a statistical signal that something has changed. The UCL is not a spec limit or a tolerance — it is derived from the process's own variation.",
    },
    {
      selector: "lcl-line",
      label: "Lower control limit (LCL)",
      explanation:
        "The dashed lower line sits at mean − 3σ. A dip below it is as significant as a spike above — the chart is symmetric because statistical surprise is symmetric, even when only one direction is 'bad' for the business.",
    },
    {
      selector: "data-point",
      label: "Data point",
      explanation:
        "Each circle is one period's observation (here, one day's median wait). Points are connected with a thin line so runs and trends are legible; the line is a reading aid, not a model.",
    },
    {
      selector: "out-of-control-point",
      label: "Out-of-control point",
      explanation:
        "A hollow red circle marks a point that crossed a control limit. Walter Shewhart's rule, drilled into a generation of quality engineers: don't blame the operator — investigate the system. The point is asking 'what was different about that day?', not 'who is at fault?'.",
    },
    {
      selector: "y-axis",
      label: "Y-axis",
      explanation:
        "The measurement axis — the process variable in its own units (minutes, millimetres, defects per thousand). A control chart collapses without a unit: the limits are statistical, but they describe a physical quantity, and the reader has to see which.",
    },
  ],
};
