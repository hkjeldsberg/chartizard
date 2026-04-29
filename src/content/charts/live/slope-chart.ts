import type { LiveChart } from "@/content/chart-schema";

export const slopeChart: LiveChart = {
  id: "slope-chart",
  name: "Slope Chart",
  family: "comparison",
  sectors: ["general"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Two columns, two values per category, one line between them — the rate and direction of change for each series at a glance.",
  whenToUse:
    "Reach for a slope chart when the story is how a set of categories moved between two moments, and especially when the ranking changes. Two time points keep the chart legible; a full line chart with ten series at ten time steps becomes spaghetti. Colour the slopes by direction when you want the rising and falling stories to separate themselves at first sight.",
  howToRead:
    "Each line connects a category's starting value to its ending value. Steepness is the rate of change, and because every line shares the same two x-positions, slopes can be compared against each other directly. When two lines cross, the ranking flipped between the two moments — that crossing is usually the point of the chart.",
  example: {
    title: "Public education spend per capita, 2014 → 2024",
    description:
      "Ten OECD-style economies plotted against a shared USD axis: Estonia rises from 800 to 1,400 and crosses the UK line, which drifts the other way from 1,400 to 1,200 — a rank-change the two end-point values alone would never surface. South Korea and Poland climb steeply, Greece falls, and Finland, France, and Japan hold roughly flat. The chart's job is the crossings: who overtook whom between these two points in time.",
  },
  elements: [
    {
      selector: "line",
      label: "Slope line",
      explanation:
        "One line per category, connecting its 2014 value on the left to its 2024 value on the right. The line is the chart's primary mark — slope is rate of change, and because every line shares the same two x-positions, they can be compared directly without a reference grid.",
    },
    {
      selector: "rising-line",
      label: "Rising slope",
      explanation:
        "Lines that trend upward across the two columns are coloured teal. Direction-by-colour is an accessibility move: the slope already encodes the sign, but a second redundant channel lets readers group the rise stories in a single glance before inspecting individual values.",
    },
    {
      selector: "falling-line",
      label: "Falling slope",
      explanation:
        "Lines that trend downward are coloured warm red. Pairing the direction with a warm/cool split makes crossings legible — where a teal line meets a red line, the ranking flipped between the two moments and the eye is already primed to notice.",
    },
    {
      selector: "start-point",
      label: "2014 column",
      explanation:
        "The left-hand column holds every series' opening value on a shared vertical scale. Because all lines depart from this single x-position, the column doubles as a ranking snapshot: read top-to-bottom to see who led at the start.",
    },
    {
      selector: "end-point",
      label: "2024 column",
      explanation:
        "The right-hand column holds the closing values, on the same scale as the left. The two columns are intentionally ordinary vertical axes — no time steps in between — because the chart's job is to compare endpoints, not to trace a trajectory.",
    },
    {
      selector: "country-label",
      label: "Country label",
      explanation:
        "Labels sit at the right-hand endpoints so the eye can follow each line to its name without crossing the chart. Label only the right side when space is tight; collisions at near-identical end values are nudged apart rather than stacked so every series is individually addressable.",
    },
    {
      selector: "flat-line",
      label: "Flat slope",
      explanation:
        "Near-horizontal lines are drawn thinner and in a muted grey. The chart's visual hierarchy should push the movers forward and the stayers back — a country that barely changed is useful context, not the headline.",
    },
  ],
};
