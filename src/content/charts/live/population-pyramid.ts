import type { LiveChart } from "@/content/chart-schema";

export const populationPyramid: LiveChart = {
  id: "population-pyramid",
  name: "Population Pyramid",
  family: "distribution",
  sectors: ["economics"],
  dataShapes: ["categorical"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Two back-to-back horizontal bar charts around a shared age axis, showing the male/female age distribution of a population.",
  whenToUse:
    "Reach for a population pyramid when the story is the shape of a population at a single point in time: dependency ratios, baby-boom bulges, gender asymmetries at the oldest ages. It is the canonical distribution chart of demography. Use a different chart when the story is about change over time (then a series of pyramids, or animated cohort lines, do the job better).",
  howToRead:
    "The central axis is age, running from youngest at the bottom to oldest at the top. Male counts extend left, female counts extend right. Both sides share the same value scale, so bar lengths are directly comparable across the axis. The overall silhouette is the headline: a wide base means a growing population; a narrow base with a heavy middle means an ageing one; a heavy top-right means the older cohort is disproportionately female.",
  example: {
    title: "Japan, 2024 — the pyramid that isn't one",
    description:
      "Japan's age-sex distribution is famously inverted. The widest brackets are 45–54 (the post-WWII baby-boom cohort now in late middle age), the 85+ row shows roughly twice as many women as men (female longevity), and the 0–4 base is narrower than every bracket above it — a straight-line forecast of future workforce contraction. A pyramid named for its shape that no longer has the shape.",
  },
  elements: [
    {
      selector: "male-bar",
      label: "Male bar",
      explanation:
        "A single age-sex cell — males in one 5-year bracket. Bar length encodes count; because both sides share one value scale, you can compare a male bar directly to its female counterpart or to any other bar on the chart.",
    },
    {
      selector: "female-bar",
      label: "Female bar",
      explanation:
        "The same row, opposite side. The colour change is redundant with the MALE/FEMALE headers above each half — colour here is a cue, not the primary encoding, which keeps the chart legible to colour-blind readers.",
    },
    {
      selector: "centre-axis",
      label: "Centre axis",
      explanation:
        "The vertical dividing line at zero for both halves. Unlike a diverging bar chart (where the centre is a meaningful midpoint), here the axis is a shared baseline — both sides grow away from it, never across it.",
    },
    {
      selector: "bulge",
      label: "Cohort bulge",
      explanation:
        "A wider-than-neighbours row marks a cohort bulge — a demographic spike that persists as the cohort ages. In Japan 2024 the 50–54 row is widest, tracing the post-war baby boom up the chart. Bulges are the chart's signature narrative device.",
    },
    {
      selector: "top-asymmetry",
      label: "Top asymmetry",
      explanation:
        "At the oldest age brackets, female bars typically extend further than male bars because women outlive men. In Japan 2024 the 85+ row shows roughly 3.0M women to 1.3M men — a 2.3× ratio that widens with every bracket above 65.",
    },
    {
      selector: "age-axis",
      label: "Age axis",
      explanation:
        "The categorical y-axis, usually in 5-year brackets running from 0–4 at the bottom to 85+ at the top. Uniform bracket height is what makes the chart's silhouette readable — unequal brackets would distort the shape you came here to see.",
    },
  ],
};
