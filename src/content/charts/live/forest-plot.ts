import type { LiveChart } from "@/content/chart-schema";

export const forestPlot: LiveChart = {
  id: "forest-plot",
  name: "Forest Plot",
  family: "comparison",
  sectors: ["medicine"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Stacks point estimates and confidence intervals from every study in a meta-analysis so the reader can weigh the evidence at a glance.",
  whenToUse:
    "Use a forest plot when you need to communicate the result of a systematic review or a pre-specified subgroup analysis: multiple independent estimates of the same effect, each with its own uncertainty, collapsing into a single pooled number. It is the standard summary visual in Cochrane reviews and regulatory submissions.",
  howToRead:
    "Each row is one study. The square is the point estimate — its size is proportional to how much the study contributes to the pooled result, so large squares deserve more attention than small ones. The horizontal line is the 95% confidence interval; a line that crosses the dashed vertical at 1.0 means that study, on its own, could not rule out no effect. The diamond at the bottom is the pooled estimate: its width is the pooled CI. When the diamond sits entirely to the left of the null line, the meta-analysis has found a signal.",
  example: {
    title: "Cochrane review of aspirin for primary prevention of vascular events",
    description:
      "The 2009 Antithrombotic Trialists' Collaboration pooled six primary-prevention trials on a single forest plot. Several individual CI lines crossed 1.0 and looked inconclusive in isolation, but the pooled diamond landed at HR 0.88 (0.82–0.94) — the visual that convinced guideline committees to recommend low-dose aspirin for patients above a risk threshold, later walked back as bleeding data accumulated.",
  },
  elements: [
    {
      selector: "point-estimate",
      label: "Point estimate",
      explanation:
        "The filled square marks the study's best single estimate of the hazard ratio. It sits at the centre of the confidence interval, not necessarily at its midpoint in linear space — on a log axis the square is offset toward the smaller end of the interval.",
    },
    {
      selector: "confidence-interval",
      label: "95% confidence interval",
      explanation:
        "The horizontal whisker spans the range of hazard ratios compatible with the study's data at the 95% level. A short line means a precise estimate; a long line means the study was small or the event was rare. If the line crosses the null, that single study cannot rule out no effect.",
    },
    {
      selector: "study-weight",
      label: "Study weight",
      explanation:
        "Each square is scaled to the study's weight in the pooled analysis — usually inverse-variance, roughly 'how much did this study's sample size and event count contribute'. Reading forest plots by square size rather than row order is how experienced reviewers quickly see which trial is driving the summary.",
    },
    {
      selector: "null-line",
      label: "Null reference line",
      explanation:
        "The dashed vertical at HR = 1 marks 'no effect' — treatment and control do equally well. A study whose CI crosses this line is statistically inconclusive on its own; a pooled estimate whose diamond sits fully to one side is the definition of a positive meta-analysis.",
    },
    {
      selector: "pooled-diamond",
      label: "Pooled diamond",
      explanation:
        "The diamond at the bottom row is the random-effects summary of all studies above. Its horizontal extent is the pooled 95% CI and its centre is the pooled point estimate. The diamond is drawn separately from the squares because it is a different kind of quantity — an estimate of estimates.",
    },
    {
      selector: "log-x-axis",
      label: "Log hazard ratio axis",
      explanation:
        "Ratios are plotted on a log scale so that a hazard ratio of 0.5 (halving) and 2.0 (doubling) are equidistant from 1.0. Forest plots with a linear HR axis silently exaggerate harms and understate benefits — always check the axis before comparing studies.",
    },
  ],
};
