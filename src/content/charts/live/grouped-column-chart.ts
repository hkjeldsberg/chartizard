import type { LiveChart } from "@/content/chart-schema";

export const groupedColumnChart: LiveChart = {
  id: "grouped-column-chart",
  name: "Grouped Column Chart",
  family: "comparison",
  sectors: ["general"],
  dataShapes: ["categorical"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Places categories side-by-side inside each time bucket so cross-series comparison at a single moment is the primary read.",
  whenToUse:
    "Use a grouped column chart when the question is 'how do these series compare inside each period', not 'what's the total'. Stacked bars answer the total question and hide the cross-series rank; grouped columns invert that tradeoff — each series gets its own baseline inside every group, so a user can read which series leads in January and whether that order changes by April.",
  howToRead:
    "Each cluster is one time period; each coloured column inside a cluster is one series. Compare heights within a cluster to rank series at that moment, then scan the same-colour columns across clusters to see each series's trend. The cost is the total: with the series split apart, you can no longer read the month's sum off the page — if you need totals, stack instead.",
  example: {
    title: "Monthly revenue by product line, Jan to Apr",
    description:
      "A SaaS business has three product lines: Core, Cloud, and Services. In January Core leads Cloud by almost 3 points of revenue; by April Cloud has overtaken Core. A stacked column would show revenue growing month over month but would bury the crossover — the grouped layout puts Core and Cloud on adjacent baselines, so the moment Cloud's bar first clears Core's is visible at a glance.",
  },
  elements: [
    {
      selector: "group",
      label: "Cluster",
      explanation:
        "One cluster per time period. The cluster is the grouping unit — its internal order (core, cloud, services) is fixed across clusters so the eye can track each series by position as well as by colour.",
    },
    {
      selector: "column",
      label: "Column",
      explanation:
        "One column per series within a cluster. Height encodes the value for that series in that period. Because every column shares the cluster's baseline, heights are directly comparable inside the cluster — the encoding the chart exists to optimise.",
    },
    {
      selector: "category-axis",
      label: "Category axis",
      explanation:
        "The periods along the bottom. Order is chronological here, but any categorical ordering works — the key is that clusters are discrete and non-overlapping, otherwise the sub-columns start to read as a single mixed group.",
    },
    {
      selector: "value-axis",
      label: "Value axis",
      explanation:
        "Revenue in millions. The axis must start at zero for the same reason a bar chart does: column heights are read as ratios, and truncating the axis distorts the comparison inside every cluster.",
    },
    {
      selector: "series-legend",
      label: "Series legend",
      explanation:
        "The key that binds each colour to a product line. Without the legend a grouped column chart is three-coloured stripes; with it, the viewer can name the line that crossed over in April.",
    },
    {
      selector: "gridline",
      label: "Gridline",
      explanation:
        "A light horizontal reference at regular value intervals. Gridlines let the eye project a column top across the full chart width — useful here because grouped columns live in separate clusters and can't be visually aligned against one another without help.",
    },
  ],
};
