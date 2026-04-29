import type { LiveChart } from "@/content/chart-schema";

export const cometPlot: LiveChart = {
  id: "comet-plot",
  name: "Comet Plot",
  family: "change-over-time",
  sectors: ["time-series"],
  dataShapes: ["temporal"],
  tileSize: "M",
  status: "live",
  synopsis:
    "A 2D state trajectory drawn with a tapering tail — the opaque head is the current observation, the fading tail is where the system came from.",
  whenToUse:
    "Reach for a comet plot when the viewer needs to see where a two-variable system is headed, not just where it has been. A plain trajectory line gives every point equal visual weight; the comet reserves the eye's attention for the most recent observation and fades the past. Use it when recency matters — macroeconomic state-spaces, orbital elements, a patient's blood-chemistry trajectory, a control-loop's drift.",
  howToRead:
    "Start at the bright head — that is today, and the ring around it marks it as special. Follow the line backward: the thicker and darker a segment, the more recent it is. The tail's direction at the head is where the system has just come from, and by extension where its momentum is carrying it. Elbows in the tail are turning points; a tight clustering of tail segments is a period of equilibrium, a long thin stretch is a period of rapid travel. The axes are the state variables themselves — the comet lives in state space, not in time.",
  example: {
    title: "US Phillips-curve state, 30 months to Oct-2024",
    description:
      "MATLAB's comet() function (The MathWorks, 1988) animated this form for teaching dynamical systems; Cleveland and McGill discuss the static version in 'The Elements of Graphing Data' (1985). Plotting monthly US unemployment versus CPI year-over-year inflation as a comet, the tail climbs to the mid-2022 inflation peak near 9%, then unwinds leftward-and-down through 2023 as inflation descended faster than unemployment rose. The head in late 2024 sits close to 4% / 2.5%: the direction of motion, read off the newest tail segment, is clearly toward higher unemployment at roughly stable inflation — the chart says the soft landing is still narrow.",
  },
  elements: [
    {
      selector: "head",
      label: "Comet head",
      explanation:
        "The solid filled circle with a ring around it is the newest observation — the current state. It is drawn at full size and full opacity so the eye lands there first. Everything else on the chart is context for this one point; a comet plot is fundamentally about where the system is now.",
    },
    {
      selector: "tail",
      label: "Tapering tail",
      explanation:
        "The line connecting the recent history to the head, drawn with linearly decreasing stroke-width and opacity as age increases. This taper is the chart's signature encoding: it collapses the 'recency' dimension into visual weight so a static image can convey direction of motion, without animation and without a colour scale.",
    },
    {
      selector: "tail-origin",
      label: "Tail origin",
      explanation:
        "The faintest end of the tail is the oldest observation in the window — here the observation 30 months ago. It is drawn deliberately light so it does not compete with the head; labelling it with its timestamp is the only concession to history. Dropping observations beyond the window is intentional — a comet plot is a sliding-window view, not an archive.",
    },
    {
      selector: "x-axis",
      label: "X-axis state variable",
      explanation:
        "The horizontal state variable — here the unemployment rate. A comet plot is a projection of a higher-dimensional trajectory onto two state variables, so the choice of axes is an editorial decision. Pick axes that are jointly informative: unemployment and inflation are the Phillips-curve axes for a reason.",
    },
    {
      selector: "y-axis",
      label: "Y-axis state variable",
      explanation:
        "The vertical state variable — here CPI year-over-year inflation. The comet reads as a trajectory in this plane; slope of the tail near the head is the instantaneous derivative dy/dx, and a near-vertical newest segment means the y variable is changing while the x variable is not.",
    },
    {
      selector: "pivot",
      label: "Trajectory pivot",
      explanation:
        "A bend in the tail marks a regime change — the moment the system turned around on one of the state variables. Here the late-2022 pivot is the inflation peak: the tail stops climbing and starts descending, and the segment angle changes sharply. Pivots are the comet plot's equivalent of line-chart inflection points, but visible in both dimensions at once.",
    },
  ],
};
