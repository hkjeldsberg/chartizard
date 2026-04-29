import type { LiveChart } from "@/content/chart-schema";

export const unitChart: LiveChart = {
  id: "unit-chart",
  name: "Unit Chart",
  family: "comparison",
  sectors: ["infographics"],
  dataShapes: ["categorical"],
  tileSize: "S",
  status: "live",
  synopsis:
    "One icon, one observation — clusters of marks whose visual mass is the count, with no scaled bars between the viewer and the data.",
  whenToUse:
    "Reach for a unit chart when each observation is a person, an event, or a discrete incident and the comparison across groups hinges on actual count rather than a proportion. The chart keeps deaths, arrests, injuries, or refugees from dissolving into a rounded bar height. Avoid above about 200 marks per group — individual readability collapses.",
  howToRead:
    "Compare the bulk of each cluster. Because every icon is the same size and every group is drawn on the same baseline, the visual mass is the count with no arithmetic required. Read the label strip below each cluster to attach each mass to its group, and confirm the scale caption — a unit chart without its one-mark-equals-one-unit contract is just dots.",
  example: {
    title: "2024 fatalities in four U.S. National Parks",
    description:
      "The National Park Service logs every in-park fatality; aggregated for 2024 they run roughly 17 at Grand Canyon, 11 at Yosemite, 9 at Zion, 6 at Denali. Rendered as four clusters of person-icons the totals are legible as individual losses rather than a smoothed bar — the rhetorical choice The New York Times used for its 2012 front-page gun-deaths visualization and The Pudding has returned to repeatedly for mortality work.",
  },
  elements: [
    {
      selector: "unit-mark",
      label: "Unit mark",
      explanation:
        "A single person-icon representing exactly one observation. Unit charts do not scale the mark for magnitude — that is a pictogram's job — and do not pack a fixed 100 — that is pictorial percentage. One icon, one unit, always.",
    },
    {
      selector: "largest-group",
      label: "Largest group",
      explanation:
        "The modal cluster — here Grand Canyon's 17 icons — sets the ceiling the viewer's eye settles on first. Because the icons are fixed size, the cluster's bulk is the count; there is no bar end-point to read against an axis.",
    },
    {
      selector: "smallest-group",
      label: "Smallest group",
      explanation:
        "The smallest cluster anchors the low end of the comparison. In a bar chart Denali's 6 would be a stub of ink; as six separate icons it remains six distinct losses, which is the rhetorical point of this chart over a bar.",
    },
    {
      selector: "category-label",
      label: "Category label",
      explanation:
        "Each cluster is labelled below the icons with its group name and count. The count is printed alongside the pictorial display because even a careful reader can miscount a packed cluster; the number is the honest backstop.",
    },
    {
      selector: "unit-scale",
      label: "Unit scale",
      explanation:
        "The legend states the unit rule — one figure equals one fatality. Every pictorial chart needs this caption; without it the figures are decorative. The convention inherits from Otto Neurath's Isotype system and from W.E.B. Du Bois's 1900 Paris Exposition data portraits, which pioneered one-dot-per-person layouts as moral argument.",
    },
    {
      selector: "cluster-mass",
      label: "Cluster mass",
      explanation:
        "The shape of each cluster, not its height, is the encoding. Packing into a short grid gives the eye a two-dimensional silhouette to compare; a vertical stripe would reduce the same data back to a bar. The packing is the chart's reason to exist.",
    },
  ],
};
