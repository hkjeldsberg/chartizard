import type { LiveChart } from "@/content/chart-schema";

export const calendar: LiveChart = {
  id: "calendar",
  name: "Calendar",
  family: "change-over-time",
  sectors: ["time-series"],
  dataShapes: ["temporal"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Lays a year of daily values on a seven-row, fifty-three-column grid so weekly and seasonal rhythm surface immediately.",
  whenToUse:
    "Reach for a calendar heatmap when the story is periodicity at weekday and seasonal scales — exactly what a single line chart flattens. The grid geometry makes weekend troughs, vacation gaps, and launch-week spikes land as shapes you can see without reading a number. It is the right chart when the reader already knows what a Tuesday feels like and the question is which Tuesdays were louder than the rest.",
  howToRead:
    "Each cell is one day. Rows are days of the week, Monday at the top; columns are weeks, running January through December from left to right. Fill intensity encodes the value — here, commit counts. A horizontal read across a row compares the same weekday across the year. A vertical read down a column tells you what one specific week looked like. Empty vertical stripes are vacations; one bright column against a calmer year is a launch.",
  example: {
    title: "GitHub's contribution graph is the canonical modern use",
    description:
      "Every GitHub profile shows the past year as a 7×53 grid, one cell per day, shaded by commit count. The format's design job is to expose routines: a two-week vacation reads as a vertical white stripe; a launch sprint reads as a dark column; a developer who codes on Sunday afternoons shows a faint band along the bottom row. This chart reproduces the encoding for 2024 — note the blank mid-August week and the dark column in early November.",
  },
  elements: [
    {
      selector: "cell",
      label: "Cell",
      explanation:
        "One cell represents one calendar day. Fill intensity encodes the day's value — here, commits authored. The cell's position is its date: row is day of week, column is week of year. That two-dimensional address is what lets a calendar expose weekday and seasonal patterns in the same view.",
    },
    {
      selector: "weekend-rows",
      label: "Weekend rows",
      explanation:
        "Saturday and Sunday sit at the bottom of the grid. Their tonal mass versus the weekday rows above is the chart's weekday-rhythm signal. A profile with strong weekend activity pulls those rows up toward the weekday tone; a nine-to-five pattern leaves them pale.",
    },
    {
      selector: "vacation-gap",
      label: "Vacation gap",
      explanation:
        "A vertical stripe of empty cells — one full week, Monday through Sunday, with zero activity. On a line chart this is a single dip lost in noise; on the calendar it reads as an unmistakable blank column. Vacation weeks and on-call handoffs are exactly the kind of structural rhythm the calendar is designed to surface.",
    },
    {
      selector: "launch-week",
      label: "Launch-week spike",
      explanation:
        "A column of dark weekday cells — five consecutive days of unusually high commit counts. Where the vacation gap is an absence, the launch week is a presence: a concentrated mass that a yearly line chart would dissolve into the surrounding noise. The weekend cells in that same column stay pale, which is often the real story.",
    },
    {
      selector: "month-label",
      label: "Month label",
      explanation:
        "Month labels run across the top, each placed at the week in which that month's first day falls. They are the chart's coarse-grained x-axis. Without them the grid is 371 cells of opaque date arithmetic; with them the reader can jump directly to the quarter they care about.",
    },
    {
      selector: "colour-scale",
      label: "Colour scale",
      explanation:
        "The legend that maps fill intensity to the underlying count. Calendar heatmaps are meaningless without one — a dark cell could be five commits or five hundred. The ramp here runs from the year's lightest non-zero day at the bottom to its busiest day at the top, which lets the launch-week column read as genuinely extreme rather than merely dark.",
    },
  ],
};
