import type { LiveChart } from "@/content/chart-schema";

export const waterfallChart: LiveChart = {
  id: "waterfall-chart",
  name: "Waterfall Chart",
  family: "composition",
  sectors: ["finance", "business"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Bridges a starting value to an ending value by stacking signed contributions as floating bars.",
  whenToUse:
    "Reach for a waterfall when the audience needs to see how a single number moved from A to B and which components drove the change. It is the right chart for operating-income bridges, P&L walks, cash-flow reconciliations, and any narrative that answers 'how did we get from 12 to 13.5?'. A stacked bar shows composition at one moment; a waterfall shows composition as a sequence of moves.",
  howToRead:
    "Read left to right. The first pillar anchors the starting total on the zero baseline. Each middle bar floats at the running total and changes it by its signed delta: bars that rise above their base add, bars that fall below subtract. Colour reinforces direction — positive and negative contributions should be instantly distinguishable. The final pillar drops back to the zero baseline to show the ending total, so the visual arc from first pillar to last mirrors the numeric arc from start to end.",
  example: {
    title: "Operating income bridge, Q3 to Q4 2024",
    description:
      "A mid-cap industrial reports quarterly operating income of $12.0M moving to $13.5M. A waterfall walks the CFO's audience through it: +$3.2M from revenue growth, −$1.1M from rising COGS, −$0.8M in OpEx, +$0.5M from a one-time legal settlement, −$0.3M of FX headwind. Without the bridge, a $1.5M net improvement reads as a single positive number; with the bridge, the board sees that operating strength actually delivered +$3.2M and most of it was eaten by costs.",
  },
  elements: [
    {
      selector: "start-pillar",
      label: "Start pillar",
      explanation:
        "The opening total, anchored on the zero baseline so the reader knows exactly where the story begins. Both the first and last pillars sit on zero; every bar in between floats between them.",
    },
    {
      selector: "floating-bar",
      label: "Positive contribution",
      explanation:
        "A bar that lifts the running total. It floats at the prior total, rises by its delta, and hands the new total to the next bar. Colour it consistently with every other additive bar so the direction is legible at a glance.",
    },
    {
      selector: "negative-bar",
      label: "Negative contribution",
      explanation:
        "A bar that drops the running total. It floats at the prior total and descends by its delta. Use a distinctly different colour from additions — the direction of change is the point of the chart, so do not rely on the position alone to carry it.",
    },
    {
      selector: "running-total",
      label: "Running total connector",
      explanation:
        "A dashed line from the top of one bar to the top of the next. It makes the bridge explicit: each bar inherits its baseline from the bar before it. Without connectors the eye has to reconstruct the sequence; with them, the bridge reads as a single continuous walk.",
    },
    {
      selector: "end-pillar",
      label: "End pillar",
      explanation:
        "The closing total, dropped back to the zero baseline so it can be compared directly to the starting pillar. If the end pillar floated instead, the chart would answer the wrong question — 'what was the last delta' rather than 'where did we land'.",
    },
    {
      selector: "colour-encoding",
      label: "Colour encoding",
      explanation:
        "Three roles, three colours: additions, subtractions, and totals. Colour here is not decoration — it is the direction-of-change signal. Keep the palette unambiguous and always label the legend so the chart is still readable in greyscale.",
    },
    {
      selector: "x-axis",
      label: "Step axis",
      explanation:
        "The sequence of contributions from start to end. Order carries the narrative: group related drivers (all operating contributions together, all non-operating together) so the story of the bridge reads cleanly.",
    },
  ],
};
