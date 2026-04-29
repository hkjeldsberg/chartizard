import type { LiveChart } from "@/content/chart-schema";

export const ohlcChart: LiveChart = {
  id: "ohlc-chart",
  name: "OHLC Chart",
  family: "change-over-time",
  sectors: ["finance"],
  dataShapes: ["temporal"],
  tileSize: "M",
  status: "live",
  synopsis:
    "A vertical range bar with a left tick for the opening price and a right tick for the close — one glyph per trading session.",
  whenToUse:
    "Reach for OHLC bars when you want a trader's-eye daily summary without the filled body a candlestick draws. At small sizes — printed financial pages, Bloomberg columns, mobile watchlists — the three-line glyph reads faster than a candle because there is no fill to parse. Use it any time the open, high, low, and close are the four numbers that matter and you need dozens of sessions on one x-axis.",
  howToRead:
    "Each session is one vertical stick. The top and bottom of the stick are the session's high and low. The short tick on the left is the opening print; the short tick on the right is the closing print. If the right tick sits above the left the session closed up; if below, down. Scan across the series for the sequence of closes — that is the price line — and look at the vertical extents to read intraday range. A short stick with close above open is a calm up-day; a long stick with close below open is a hard reversal on heavy intraday range.",
  example: {
    title: "SPY daily bars, 60 sessions",
    description:
      "Bloomberg terminals and the back pages of the Financial Times still print OHLC bars for index futures and equities because the glyph survives compression to a single column inch. Western market charts standardised on OHLC through the 20th century; candlesticks, invented earlier in Japan by rice merchants such as Munehisa Homma in the 1700s, only reached Western desks after Steve Nison's 1991 book. OHLC is the Anglo-American tradition; candlesticks are the Japanese one.",
  },
  elements: [
    {
      selector: "high",
      label: "High",
      explanation:
        "The top of the vertical stick is the session's highest traded price. Together with the low it gives you intraday range — the stick's length is the day's volatility.",
    },
    {
      selector: "low",
      label: "Low",
      explanation:
        "The bottom of the vertical stick is the session's lowest traded price. A long stick whose body (tick-to-tick span) is short means heavy intraday swing with little net move.",
    },
    {
      selector: "open-tick",
      label: "Open tick",
      explanation:
        "The short horizontal tick on the left is the session's opening print. The convention is strict: left for open, right for close. The left-right asymmetry is what makes OHLC readable without colour.",
    },
    {
      selector: "close-tick",
      label: "Close tick",
      explanation:
        "The short horizontal tick on the right is the session's closing print. Scanning only the right ticks across the series gives you the close line — the number most traders quote as the day's price.",
    },
    {
      selector: "up-down-day",
      label: "Up vs down day",
      explanation:
        "If the right tick sits above the left tick the close beat the open — an up day, drawn in darker ink here. If the right tick sits below, the session closed below its open — a down day, drawn lighter. The tick positions carry the encoding by themselves; colour is a redundant cue.",
    },
    {
      selector: "date-axis",
      label: "Date axis",
      explanation:
        "One tick per trading session, chronological left-to-right. OHLC is an irregularly sampled time series — weekends and holidays collapse without a gap because the axis indexes sessions, not calendar days.",
    },
  ],
};
