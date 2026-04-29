import type { LiveChart } from "@/content/chart-schema";

export const cyclePlot: LiveChart = {
  id: "cycle-plot",
  name: "Cycle Plot",
  family: "change-over-time",
  sectors: ["time-series"],
  dataShapes: ["temporal"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Pivots a seasonal time series into one panel per seasonal unit so the non-seasonal trend is visible in each panel's slope.",
  whenToUse:
    "Reach for a cycle plot when a plain line chart looks like jagged teeth — the seasonal swing is bigger than the trend you actually want to see. The classic symptom is a retail sales line where every December peak towers over the rest of the year and you cannot tell whether non-holiday months are growing. Pivoting into per-month panels separates the two questions: the cross-panel pattern shows the seasonal profile, each panel's slope shows the year-over-year trend inside that season.",
  howToRead:
    "Each panel is one seasonal unit — usually one month — with a short line showing that month's value across successive years, plus a dashed horizontal mean. Read across panels to see the seasonal shape (Dec towers, Jul dips). Read inside a panel to see whether that particular month is growing, flat, or declining — the panel's slope is the detrended per-season trend. Panels share a y-scale so heights are directly comparable; they do not share an x-scale because within-panel x is just year index.",
  example: {
    title: "US retail sales, monthly, 5 years",
    description:
      "William Cleveland introduced the cycle plot in 1983 (Cleveland, Dunn, Terpenning — 'The SABL Seasonal and Calendar Adjustment Procedures') to solve exactly this problem for seasonally-dominated economic series. On retail sales, a line chart answers 'is December bigger than July' — which nobody was asking. The cycle plot answers 'is November growing faster than February', which is the question a merchandiser actually needs.",
  },
  elements: [
    {
      selector: "panel",
      label: "Month panel",
      explanation:
        "One panel per seasonal unit. The chart here uses calendar months, so December — the retail holiday peak — sits as the tallest panel on the right. Inside that panel, the five points are the five Decembers in the dataset.",
    },
    {
      selector: "mean-line",
      label: "Cross-panel mean",
      explanation:
        "The dashed horizontal line inside each panel is that month's five-year mean. It is the cycle plot's primary encoding: the step from one panel's mean to the next traces the seasonal profile, while the gap between the mean and the line shows each year's departure from typical.",
    },
    {
      selector: "positive-slope",
      label: "Growing month",
      explanation:
        "A panel whose line climbs left-to-right is a month that has grown year over year — the detrended seasonal trend for that unit. Flagging the few panels with the steepest positive slope is usually the merchandising insight.",
    },
    {
      selector: "flat-slope",
      label: "Flat or declining month",
      explanation:
        "A panel whose line is flat or tilts down is a month whose trend is not following the overall series. This is the comparison that a plain line chart cannot make — the seasonal peaks drown out the per-month direction.",
    },
    {
      selector: "month-labels",
      label: "Panel labels",
      explanation:
        "The J F M A M J J A S O N D strip under the panels names the seasonal unit for each panel. Always label — without the strip the chart is a hatched silhouette with no frame of reference.",
    },
    {
      selector: "shared-y-scale",
      label: "Shared y-scale",
      explanation:
        "All panels share one y-scale so heights are directly comparable across months. If the scale were per-panel, the chart would still show each month's slope but would silently erase the seasonal profile — the whole reason to use a cycle plot over a set of separate line charts.",
    },
  ],
};
