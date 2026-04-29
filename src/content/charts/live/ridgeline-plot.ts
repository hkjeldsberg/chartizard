import type { LiveChart } from "@/content/chart-schema";

export const ridgelinePlot: LiveChart = {
  id: "ridgeline-plot",
  name: "Ridgeline Plot / Joyplot",
  family: "distribution",
  sectors: ["statistics"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Stacks density curves vertically so a family of distributions can be compared at a glance.",
  whenToUse:
    "Reach for a ridgeline when you need to compare many distributions on the same axis and small multiples would fragment the comparison. It privileges the overall pattern — how peaks drift, how spreads widen — over any single distribution's detail.",
  howToRead:
    "Each row is one group's density curve, all sharing the x-axis. Read peak location left-to-right to compare central tendency, peak height to compare concentration, and curve width to compare variability. The deliberate vertical overlap creates the joyplot signature: the stack reads as rhythm, and the eye tracks how peaks migrate across rows. Later rows are drawn on top of earlier rows, so occlusion is the price of the compactness.",
  example: {
    title: "Chicago daily temperatures by month",
    description:
      "Stack twelve monthly KDEs of daily high temperatures and the Chicago year emerges as a shape: peaks climb from the low 20s in January up to the high 70s in July, then slide back down through December, while winter curves visibly fatten with higher day-to-day variance than the tight summer ridges. The plot is named after the cover of Joy Division's Unknown Pleasures (1979), which rendered pulsar CP 1919 as a stack of signal traces.",
  },
  elements: [
    {
      selector: "ridge",
      label: "Ridge",
      explanation:
        "One group's density curve, drawn as a filled shape. Its baseline is the row's y-position; its height at any x is the relative density at that x-value. Read peak location for center, width for spread.",
    },
    {
      selector: "peak",
      label: "Peak",
      explanation:
        "The mode of a single ridge — the most common value for that group. July's peak near 76°F is tight and tall, indicating a narrow, stable distribution; January's is shorter and broader, indicating a wider day-to-day swing.",
    },
    {
      selector: "overlap",
      label: "Overlap",
      explanation:
        "Adjacent ridges deliberately overlap by ~40% of row height. This compresses vertical space and turns the stack into a visual rhythm, but it does mean later rows partially occlude earlier ones. Use ridgelines when the shape of the stack matters more than the precise value of any single row.",
    },
    {
      selector: "season-drift",
      label: "Season drift",
      explanation:
        "The path traced by peak locations across rows — the headline pattern a ridgeline is designed to expose. Chicago's drift runs from January's cold mode in the low 20s, rightward through summer, then leftward back to December.",
    },
    {
      selector: "x-axis",
      label: "X-axis",
      explanation:
        "Shared across every row — that's what makes comparison possible. Here it's temperature in °F. If each row had its own x-axis you'd be looking at small multiples instead.",
    },
    {
      selector: "y-axis",
      label: "Y-axis",
      explanation:
        "The y-axis is not a quantitative scale — it's a list of groups (here, twelve months). Order matters: months are in calendar order so the reader can follow time top-to-bottom, and the season drift becomes visible as a diagonal sweep.",
    },
  ],
};
