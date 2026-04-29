import type { LiveChart } from "@/content/chart-schema";

export const spaghettiPlot: LiveChart = {
  id: "spaghetti-plot",
  name: "Spaghetti Plot",
  family: "change-over-time",
  sectors: ["statistics", "medicine"],
  dataShapes: ["temporal"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Every individual trajectory drawn on the same axes, with a median line overlaid for orientation.",
  whenToUse:
    "Reach for a spaghetti plot in longitudinal studies — repeated measurements on the same subjects across time — when the question is about within-subject variance and trajectory heterogeneity, not cohort means. A single averaged line hides that individuals rarely follow the average; a spaghetti plot shows exactly how much they don't.",
  howToRead:
    "Each thin line is one subject followed across visits. The tangle is the point: if the individual lines cross, scatter, or fan out, no single cohort trend will explain any one patient. Read the thick median line for the cohort-level story, and read the ribbon behind it as the middle-50% band. A line that leaves the ribbon and keeps climbing — or drops sharply — is a subject whose trajectory does not belong to the majority.",
  example: {
    title: "Systolic blood pressure across 24 monthly visits",
    description:
      "A hypertension trial tracks 30 patients on a new beta-blocker. The median drifts down slightly across two years. Most patients' trajectories jitter around that median inside the interquartile band. One patient climbs instead of falling — a non-responder whose trajectory would have disappeared into a mean-only plot. The chart is called spaghetti because it is meant to be ugly: the tangle is what honesty about individual variation looks like.",
  },
  elements: [
    {
      selector: "trajectory",
      label: "Individual trajectory",
      explanation:
        "One thin line per subject, drawn at low opacity so the overlap is legible. Do not try to identify a specific patient from the tangle — the individuals are rendered faint on purpose, so the overall shape of the bundle can be read.",
    },
    {
      selector: "median-line",
      label: "Median line",
      explanation:
        "The thicker overlaid line is the per-visit median across all subjects. It is not the trajectory of any specific patient — it is a cross-sectional summary redrawn at every visit. Use the median rather than the mean when the tangle includes outliers that would pull a mean sideways.",
    },
    {
      selector: "iqr-band",
      label: "IQR band",
      explanation:
        "The shaded ribbon spans the first to third quartile at each visit — half the cohort sits inside it. The band does not trace any individual subject; it is the envelope of the middle 50 percent. A narrowing band over time means the cohort converges; a widening one means subjects diverge.",
    },
    {
      selector: "baseline-dispersion",
      label: "Baseline dispersion",
      explanation:
        "The vertical spread at visit 1 is the between-subject variance before the intervention does anything. Trials report this separately because it sets the floor for how much between-subject noise the treatment effect must be bigger than to be credible.",
    },
    {
      selector: "endpoint-dispersion",
      label: "Endpoint dispersion",
      explanation:
        "The vertical spread at the final visit is the residual between-subject variance after treatment. A treatment that compresses this spread relative to baseline is homogenising outcomes; one that preserves it is shifting the centre without changing the shape.",
    },
    {
      selector: "outlier-patient",
      label: "Outlier patient",
      explanation:
        "A single trajectory drawn slightly darker, climbing where the cohort falls. The spaghetti plot makes non-responders visible where a mean-or-median-only chart would bury them. Identifying these subjects is usually the point of running the study.",
    },
    {
      selector: "y-axis",
      label: "Y-axis",
      explanation:
        "Systolic pressure in millimetres of mercury. A line chart with no y-axis label is just a shape; a clinical chart with no unit is worse — the reader has no way to tell if a 10-unit drop is a rounding error or a rescue.",
    },
  ],
};
