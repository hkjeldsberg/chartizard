import type { LiveChart } from "@/content/chart-schema";

export const radialHistogram: LiveChart = {
  id: "radial-histogram",
  name: "Radial Histogram",
  family: "distribution",
  sectors: ["statistics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Bends the x-axis of a histogram into a circle so cyclical variables — hour-of-day, day-of-year, compass bearing — read without an arbitrary seam.",
  whenToUse:
    "Reach for a radial histogram when the binning variable is genuinely cyclical and the reader will want to compare across the wrap-around. A plain bar chart of hour-of-day forces a cut at midnight; the evening of one day and the small hours of the next get slammed to opposite ends of the canvas. A circle keeps them neighbours, where they belong.",
  howToRead:
    "Each wedge is one bin. The angle around the centre encodes the cyclical variable; the radius encodes the count. Read the ring like a clock face — longer wedges are heavier bins. Two peaks on opposite sides are a bimodal distribution; a single fat sector is a concentrated one. The faint concentric rings let you estimate counts without a Cartesian y-axis.",
  example: {
    title: "Capital Bikeshare trip starts by hour of day, Washington DC",
    description:
      "DC's open-data bikeshare feed produces the textbook commuter signature: a short 8am spike, a midday shoulder as people run errands, a taller 5pm peak on the way home, and a 2-4am trough. Drawn as a bar chart the pattern reads fine, but the midnight cut arbitrarily separates the late-night tail from its natural neighbour — the pre-dawn lull — and the reader has to mentally stitch the axis back together. Coil the axis into a circle and the day closes on itself; the rhythm of the city is the shape of the chart.",
  },
  elements: [
    {
      selector: "angular-axis",
      label: "Angular axis",
      explanation:
        "The hour dial. Angle around the centre replaces the x-axis of a bar chart, with 24 equal slices for the hours of the day. The key property: 23:59 and 00:00 are adjacent, not at opposite ends of the canvas.",
    },
    {
      selector: "wedge",
      label: "Wedge",
      explanation:
        "One bin. The wedge's outer radius is proportional to the count; the arc length at that radius is how the eye reads the magnitude. Wider wedges would encode a second variable, but a standard radial histogram uses a fixed arc width.",
    },
    {
      selector: "radial-scale",
      label: "Radial scale",
      explanation:
        "Distance from the centre encodes frequency. Faint concentric rings mark reference levels — typically 25, 50, 75, and 100 percent of the tallest bin. Areas near the centre exaggerate small differences, which is why the inner disc is left blank.",
    },
    {
      selector: "trough",
      label: "Trough",
      explanation:
        "The shortest wedges. Reading a radial histogram is as much about the quiet arcs as the loud ones — pre-dawn here, off-peak direction on a wind rose, the false-spring weeks on a day-of-year chart. They locate the dead time in the cycle.",
    },
    {
      selector: "midnight-wrap",
      label: "Wrap-around",
      explanation:
        "The seam a bar chart would put between hour 23 and hour 00 is simply not here. That is the whole argument for the chart: cyclical axes should not have a 0-to-24 cut imposed on them, because viewers inevitably read the edges as boundaries of the data.",
    },
    {
      selector: "centre",
      label: "Centre hole",
      explanation:
        "The inner disc is intentionally blank. Wedges all taper to a point at the true centre, and leaving the middle empty keeps the smallest bins from vanishing and keeps the arc-length encoding honest away from the singularity.",
    },
  ],
};
