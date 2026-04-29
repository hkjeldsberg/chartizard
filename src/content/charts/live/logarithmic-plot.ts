import type { LiveChart } from "@/content/chart-schema";

export const logarithmicPlot: LiveChart = {
  id: "logarithmic-plot",
  name: "Logarithmic Plot",
  family: "relationship",
  sectors: ["mathematics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Maps one or both axes to log scale so equal screen distance equals equal multiplicative step — power laws and exponentials become straight lines.",
  whenToUse:
    "Use a log scale when the data spans several orders of magnitude, when a power law or exponential is suspected, or when proportional change matters more than absolute change. A log-log axis pair turns f ∝ xᵃ into a straight line of slope a; a semi-log axis pair does the same for exponential growth.",
  howToRead:
    "Treat tick spacing as multiplicative: each major gridline on a log axis is ten times the previous one. Minor gridlines between decades are the 2×, 3×, … 9× multiples, unevenly spaced. A straight line on log-log is a power law; a straight line on semi-log is exponential. A slope of −1 on log-log means y is proportional to 1/x.",
  example: {
    title: "Zipf's Law in the Google Books N-gram corpus",
    description:
      "The 100 most common English words, rank-ordered by frequency, form a near-straight line of slope −1 on log-log axes — the signature of a power law. Rank 1 (\"the\") clocks in around 60M instances; rank 100 sits near 200k. The same 1/rank relationship shows up in city populations (Zipf 1949), paper citations, and wealth distribution (Pareto). Clauset, Shalizi and Newman's 2009 paper Power-law Distributions in Empirical Data is the standard reference for fitting these rigorously — eyeballing the slope is a starting point, not a proof.",
  },
  elements: [
    {
      selector: "reference-line",
      label: "Reference line (slope −1)",
      explanation:
        "A dashed line of slope −1 on log-log axes represents the pure 1/rank law y = C/x. Scatter falling near this line is the visual test for Zipf — systematic deviation at the tail is where the interesting science lives.",
    },
    {
      selector: "data-points",
      label: "Data points",
      explanation:
        "Each circle is (rank, frequency) for one of the 25 plotted words. The points don't sit exactly on the reference line; they scatter because natural-language frequencies have multiplicative noise. On linear axes this scatter would be invisible — rank 1 would dwarf rank 100 to the point that the lower ranks crush against the x-axis.",
    },
    {
      selector: "top-word",
      label: "Rank 1: \"the\"",
      explanation:
        "The most common English word, at roughly 60M instances in the Google Books corpus. Its position in the upper-left corner anchors the power law — if the line passes through here and slope is −1, rank 100 must land near 600k, which is within 3× of the observed 200k.",
    },
    {
      selector: "x-axis",
      label: "X-axis (log rank)",
      explanation:
        "Rank runs 1 to 100 on a log scale — three decade marks (1, 10, 100) with eight minor ticks between each. Equal screen distance is equal multiplicative step: the gap from 1 to 10 is the same width as the gap from 10 to 100.",
    },
    {
      selector: "y-axis",
      label: "Y-axis (log frequency)",
      explanation:
        "Frequency runs 10⁵ to 10⁸ on a log scale — three decades. Using log here is not decoration; a linear y would compress the lower ranks into the x-axis and make everything below the top five invisible.",
    },
    {
      selector: "decade-grid",
      label: "Decade gridline",
      explanation:
        "The darker gridlines mark powers of ten — the step unit of a log axis. Reading distance between gridlines as additive (the way most charts work) is the most common mistake: on log axes the distance is multiplicative.",
    },
    {
      selector: "caption",
      label: "Slope caption",
      explanation:
        "Log axes were invented to make multiplicative structure additive on paper. Napier published the logarithms in 1614; log-log paper became standard by 1900, used by Fechner for psychophysics and later by Pareto, Zipf, Gutenberg-Richter (earthquake energy), and Kleiber (metabolic rate vs body mass). The straight line is the trick — it converts a multiplicative relationship into a linear one the eye can read.",
    },
  ],
};
