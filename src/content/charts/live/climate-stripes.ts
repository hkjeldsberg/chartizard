import type { LiveChart } from "@/content/chart-schema";

export const climateStripes: LiveChart = {
  id: "climate-stripes",
  name: "Climate Stripes",
  family: "change-over-time",
  sectors: ["earth-sciences"],
  dataShapes: ["temporal"],
  tileSize: "W",
  status: "live",
  synopsis:
    "One vertical stripe per year, coloured by temperature anomaly. Axes stripped out so the chart lands as an image.",
  whenToUse:
    "Reach for warming stripes when the point is persuasion rather than measurement. The format collapses a long time series into a single visual gradient the eye can't un-see, which is why it migrated from a climate-research poster to banners, magazine covers, and football jerseys within two years of Ed Hawkins publishing it.",
  howToRead:
    "Each stripe is one year, ordered left to right. Colour encodes the annual global mean surface temperature anomaly relative to the 1971-2000 reference: deep blue is roughly half a degree below, near-white is the reference, deep red is above +1.2°C. The pre-1970 stripes read as mottled pale; post-2000 is a uniform wall of red. Hawkins' original carries no axes at all — the only concession here is the year range printed below, because the Explain panel needs a handle.",
  example: {
    title: "#ShowYourStripes (Hawkins, Univ. of Reading, 2018)",
    description:
      "Ed Hawkins' warming-stripes graphic went viral within weeks of release: it fronted the 2019 UN Climate Action Summit, ran as a Wikipedia banner, appeared on Reading FC's home shirt in 2022, and was printed on t-shirts handed out at COP26. The design decision carrying all that weight is the one that feels most like a refusal: Hawkins removed the axes.",
  },
  elements: [
    {
      selector: "stripe",
      label: "Stripe",
      explanation:
        "One vertical band is one year. Colour, not height, encodes the value — every stripe fills the full plot. That's the format's trick: it converts a time series into a texture, and textures are easier to remember than lines.",
    },
    {
      selector: "early-period",
      label: "Early period (1850-1910)",
      explanation:
        "Mottled pale blues and near-whites. Anomalies here sit between roughly -0.3 and 0.0°C versus the 1971-2000 reference. Nothing in this block is alarming on its own — which is the point the rest of the chart makes by contrast.",
    },
    {
      selector: "recent-period",
      label: "Recent period (post-2000)",
      explanation:
        "A near-uniform band of red. Every year since 2015 has been warmer than any year before 1940. The visual message lands before the viewer has done any arithmetic.",
    },
    {
      selector: "palette",
      label: "Diverging palette",
      explanation:
        "Nine-stop ColorBrewer RdBu_r, keyed so zero anomaly falls on near-white, -0.5°C on deep blue, +1.2°C on deep red. The white midpoint is load-bearing — a sequential ramp would obscure the zero-crossing that defines the reference period.",
    },
    {
      selector: "year-range",
      label: "Year range",
      explanation:
        "The only textual label Hawkins allows, and only grudgingly. Without it the chart is a gradient; with it, the gradient becomes evidence. We print 1850 on the left and 2024 on the right and let the stripes between them do the argument.",
    },
  ],
};
