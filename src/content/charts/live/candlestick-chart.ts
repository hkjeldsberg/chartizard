import type { LiveChart } from "@/content/chart-schema";

export const candlestickChart: LiveChart = {
  id: "candlestick-chart",
  name: "Candlestick Chart",
  family: "change-over-time",
  sectors: ["finance"],
  dataShapes: ["temporal"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Encodes four prices per trading day — open, high, low, close — into a single body-and-wick mark per bar.",
  whenToUse:
    "Use a candlestick when the spread inside a period matters as much as the close. A closing-price line chart compresses every day into one number and throws away the intraday range; candlesticks keep the wick-to-body ratio visible, which is where volatility signals live. Reach for them when you are reading price action, not just the trend.",
  howToRead:
    "Each candle is one day. The filled rectangle is the body — its top and bottom are the open and the close, and its colour tells you which came first: teal means the close finished above the open (bullish), ink means the close landed below the open (bearish). The thin line through the body is the wick — it stretches from the day's low to the day's high. A short body with long wicks is a day of large swings that resolved near where it started, which a line chart would render as a nearly flat point.",
  example: {
    title: "AAPL, 30 trading days drifting $170 to ~$195",
    description:
      "A synthetic AAPL-style series shows a bull-biased month with a mid-run volatility day: the body is almost flat but the wick spans several dollars either side of it. That single candle is the reason this chart exists. The line-chart version of the same month would be a smooth uptrend; the candlestick version tells you the market paid for that trend with a day of indecision.",
  },
  elements: [
    {
      selector: "body",
      label: "Body",
      explanation:
        "The filled rectangle between the day's open and close. Body length encodes the magnitude of the day's net move; body direction (up or down) is the sign of that move.",
    },
    {
      selector: "wick",
      label: "Wick",
      explanation:
        "The thin vertical line above and below the body. The top of the wick is the session high, the bottom is the session low. Long wicks on a short body mean the price travelled far and came back — a signal a close-only line chart loses entirely.",
    },
    {
      selector: "colour",
      label: "Colour (bull vs bear)",
      explanation:
        "Teal-filled candles closed above their open (bullish); ink-filled candles closed below (bearish). Colour is the fastest read of the day's direction, which is why traders scan a candlestick chart in colour-first order.",
    },
    {
      selector: "volatility-signal",
      label: "Volatility signal",
      explanation:
        "A candle with a tall wick and a tiny body is the classic indecision print: the day moved sharply and retraced almost all of it before close. Circled here to show the shape you are trained to spot in a candlestick chart and blind to in a line chart.",
    },
    {
      selector: "x-axis",
      label: "X-axis",
      explanation:
        "Trading days, ordered left to right. Weekends and market holidays are collapsed out — the axis is trading days, not calendar days, which is why candlestick charts use a band scale rather than a time scale.",
    },
    {
      selector: "y-axis",
      label: "Y-axis",
      explanation:
        "Share price in dollars. Candlestick y-axes do not need to start at zero: the reader is looking at within-range movement, and a zero-anchored axis would compress the wicks into unreadable slivers.",
    },
  ],
};
