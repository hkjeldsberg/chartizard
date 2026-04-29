import type { LiveChart } from "@/content/chart-schema";

export const ichimokuKinkoHyo: LiveChart = {
  id: "ichimoku-kinko-hyo",
  name: "Ichimoku Kinko Hyo",
  family: "change-over-time",
  sectors: ["finance"],
  dataShapes: ["temporal"],
  tileSize: "M",
  status: "live",

  synopsis:
    "Five indicator lines and a shaded cloud region render trend, momentum, and support/resistance on a single candlestick chart.",

  whenToUse:
    "Use Ichimoku when you need a complete regime picture without toggling between separate indicator panels. It answers three questions simultaneously: direction (price above or below the kumo), momentum (Tenkan-sen slope), and dynamic support/resistance (the cloud edges). The chart is dense; it is not the right choice for audiences unfamiliar with multi-line overlays.",

  howToRead:
    "The Tenkan-sen (fast blue line) is the 9-period midpoint; the Kijun-sen (slow red line) is the 26-period midpoint. A Tenkan crossing above the Kijun is a bullish signal, and vice versa. The kumo (cloud) is the region between Senkou Span A and Senkou Span B, both projected 26 periods into the future: green cloud means A > B (bullish equilibrium), red means A < B (bearish). Price above the cloud is bullish territory; price inside the cloud is ambiguous. The Chikou Span — the current close plotted 26 periods in the past — shows whether price is above or below its own historical level. Where it rides above past candlesticks, the trend is confirmed.",

  example: {
    title: "Nikkei 225, daily sessions, 2012–2013",
    description:
      "Japanese equity traders used Ichimoku to track the Abenomics rally. The cloud turned green in late 2012 as Senkou A crossed above Senkou B, the Nikkei broke above the kumo, and the Chikou Span cleared historical highs — three simultaneous confirmations visible on one frame. The chart's density, which would overwhelm a Western analyst, was precisely the point: Goichi Hosoda (pen name Ichimoku Sanjin) spent three decades refining it to collapse five separate signals into one gaze.",
  },

  elements: [
    {
      selector: "tenkan-sen",
      label: "Tenkan-sen",
      explanation:
        "The Tenkan-sen is the arithmetic midpoint of the 9-period high and low, not a moving average of closes. Because it uses the price range rather than a close series, it reacts quickly to volatility. Hosoda called it the 'turning line'; its slope and position relative to the Kijun are the chart's fastest momentum signal.",
    },
    {
      selector: "kijun-sen",
      label: "Kijun-sen",
      explanation:
        "The Kijun-sen applies the same midpoint formula over the prior 26 periods. Its relative flatness compared to the Tenkan reflects the market's base equilibrium over a longer horizon. A price crossing above the Kijun is a medium-strength bullish signal; a Tenkan–Kijun crossover is a stronger one.",
    },
    {
      selector: "kumo",
      label: "Kumo (cloud)",
      explanation:
        "The kumo is the filled region between Senkou Span A and Senkou Span B. Both spans are plotted 26 sessions forward, so the cloud is a projection: the market's expected support and resistance zone over the next month. A thick cloud means a strong barrier; a thin cloud means weak support. The colour encodes regime: green where Span A > Span B (bullish), red where A < B (bearish).",
    },
    {
      selector: "senkou-spans",
      label: "Senkou Span A / B boundary",
      explanation:
        "Senkou Span A is the average of the Tenkan and Kijun, displaced 26 periods forward. Senkou Span B is the 52-period midpoint displaced the same amount. Together they form the cloud's edges. When price is above both spans, the market is in unambiguous bullish territory. The span lines also function as dynamic support and resistance — a price approaching from above is testing the cloud floor.",
    },
    {
      selector: "chikou-span",
      label: "Chikou Span",
      explanation:
        "The Chikou Span is simply the current session's closing price plotted at the bar that occurred 26 periods ago. It is the chart's confirmation tool: when the Chikou rides above historical candlestick bodies, the trend is structurally intact. When it dips below past bars, the market is back inside territory it has already visited — a warning sign.",
    },
    {
      selector: "candlesticks",
      label: "Candlesticks",
      explanation:
        "The underlying OHLC candlestick series is the price substrate on which all five Ichimoku lines operate. A bullish day (close above open) is rendered hollow or light; a bearish day is filled. Chartizard renders them at reduced opacity so the indicator overlays remain legible.",
    },
    {
      selector: "regime-shift",
      label: "Regime shift",
      explanation:
        "The dashed vertical line marks the session at which the kumo changes colour — the point where Senkou Span A crosses below Span B, signalling a transition from bullish to bearish equilibrium. Ichimoku encodes this shift in the forward projection, so it appears before price itself confirms the change.",
    },
  ],
};
