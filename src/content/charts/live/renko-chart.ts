import type { LiveChart } from "@/content/chart-schema";

export const renkoChart: LiveChart = {
  id: "renko-chart",
  name: "Renko Chart",
  family: "change-over-time",
  sectors: ["finance"],
  dataShapes: ["temporal"],
  tileSize: "S",
  status: "live",

  synopsis:
    "Fixed-size rectangles ('bricks') arranged diagonally, each representing a price move of exactly one brick size — time does not appear on the x-axis.",

  whenToUse:
    "Use a Renko chart when the objective is trend identification stripped of intraday noise. Because a new brick appears only after price moves by the full brick size, sideways consolidation produces no new marks and is therefore invisible. The chart works best for comparing trend strength across different instruments, since the brick size can be standardised as a percentage rather than a fixed dollar amount.",

  howToRead:
    "Each hollow rectangle indicates an up-brick: price advanced at least one full brick size from the previous close. Each filled rectangle indicates a down-brick. The reversal rule requires price to move two brick sizes in the opposite direction before a counter-trend brick is added, which suppresses small corrections. Read a diagonal staircase of consecutive hollow bricks as a confirmed uptrend; a diagonal staircase of filled bricks as a confirmed downtrend. The brick size annotation states the price filter in use.",

  example: {
    title: "Crude oil (WTI) weekly closes, 2020–2022",
    description:
      "Applied to WTI crude's collapse below $20 in April 2020 and subsequent recovery to $130 in March 2022, a $2 Renko chart produced roughly 60 up-bricks from the $20 floor with no down-bricks exceeding two bricks in sequence — a visual confirmation that the recovery was structurally one-directional in a way that candlestick charts, cluttered by weekly wicks, obscured.",
  },

  elements: [
    {
      selector: "up-brick",
      label: "Up brick (hollow)",
      explanation:
        "A hollow rectangle added when price advances at least one full brick size above the previous brick's close. 'Renga' means brick in Japanese, giving the chart its name. Up-bricks are distinguished from down-bricks by fill — hollow versus solid — so the encoding survives monochrome printing without colour as the sole differentiator.",
    },
    {
      selector: "down-brick",
      label: "Down brick (filled)",
      explanation:
        "A filled rectangle added when price falls at least two brick sizes below the current level — the standard 2× reversal rule. The asymmetric threshold means that a new down-brick requires twice the movement of a new up-brick continuing in trend, which biases the chart toward following existing trends rather than signalling premature reversals.",
    },
    {
      selector: "brick-size",
      label: "Brick size",
      explanation:
        "The fixed price increment that one brick represents, stated in the annotation. Brick size is the chart's sole noise filter: a $1 brick on a $100 stock filters moves smaller than 1%, whereas a $5 brick filters moves smaller than 5% and produces a coarser, slower-turning signal. Steven Nison introduced Renko to Western audiences in *Japanese Candlestick Charting Techniques* (1991, NY Institute of Finance).",
    },
    {
      selector: "trend-sequence",
      label: "Trend sequence",
      explanation:
        "Three or more consecutive bricks in the same direction confirm an established trend. The diagonal staircase pattern — each brick one price level above and one column to the right of its predecessor — is the visual signature of a Renko trend. A single counter-direction brick does not constitute a reversal; at least two are required by the standard construction rule.",
    },
    {
      selector: "event-axis",
      label: "Event axis (not time)",
      explanation:
        "The horizontal axis counts bricks, not calendar intervals. A slow market may add only two or three bricks in a month; a volatile market may add the same number in a single session. This design principle, shared with Kagi and Point-and-Figure charts, means that Renko compresses quiet periods and expands active ones — the opposite of time-indexed charts.",
    },
  ],
};
