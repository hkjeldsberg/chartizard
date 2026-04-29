import type { LiveChart } from "@/content/chart-schema";

export const hertzsprungRussellDiagram: LiveChart = {
  id: "hertzsprung-russell-diagram",
  name: "Hertzsprung-Russell Diagram",
  family: "relationship",
  sectors: ["physics"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",
  synopsis:
    "A scatter of stars by temperature and luminosity that turns out to be stellar evolution in a single frame — every feature on the chart is a life stage.",
  whenToUse:
    "Use an H-R diagram any time you need to place a stellar population against the backdrop of stellar physics: cataloguing a cluster, showing the evolutionary state of a single star, or comparing nearby stars with distant ones. Its entire purpose is to collapse thousands of stars into the handful of regions where nuclear burning is stable, unstable, or extinct.",
  howToRead:
    "The x-axis is surface temperature, plotted in reverse — hot O stars on the left, cool M dwarfs on the right — a fossil of the Harvard spectral-classification alphabet (O-B-A-F-G-K-M) that predated the temperature interpretation. The y-axis is luminosity in solar units, on a log scale spanning ten decades, brighter upward. The diagonal band from top-left to bottom-right is the main sequence, where hydrogen-burning stars live. The clump upper-right is the red-giant branch; the clump lower-left is the white-dwarf graveyard. The Sun sits near the middle of the main sequence.",
  example: {
    title: "Gaia DR3 — 1.5 billion stars with parallax-derived luminosities",
    description:
      "The European Space Agency's Gaia mission (2022 data release) plotted an H-R diagram of 1.5 billion stars with unprecedented precision. The main-sequence diagonal tightens to a crisp ridge, the red-giant branch splits visibly into sub-populations, and a thin horizontal branch appears between them — structure that was invisible when the chart had only a few hundred stars in 1913.",
  },
  elements: [
    {
      selector: "main-sequence",
      label: "Main sequence",
      explanation:
        "The diagonal band from hot-bright (upper-left) to cool-dim (lower-right) where stars spend ~90% of their lives fusing hydrogen into helium. A star's position along the band is set almost entirely by its mass — more massive stars are hotter, brighter, and shorter-lived.",
    },
    {
      selector: "red-giants",
      label: "Red giants",
      explanation:
        "The upper-right cluster is cool (3000–5000 K) but enormously luminous, which means huge radius — envelopes hundreds of solar radii across. Stars swell into this region after they exhaust core hydrogen and begin shell-burning. The Sun will pass through here in about five billion years.",
    },
    {
      selector: "white-dwarfs",
      label: "White dwarfs",
      explanation:
        "The lower-left cluster is hot (~10,000 K) yet dim — Earth-sized, Sun-massed cinders that have run out of fuel and are radiating away residual heat. A white dwarf is the end state for ~97% of all stars, including eventually the Sun.",
    },
    {
      selector: "sun-marker",
      label: "The Sun",
      explanation:
        "Plotted at 5778 K and L/L☉ = 1 by definition. The Sun is middle-aged, mid-mass, and unremarkable — most of what the diagram tells you about stellar evolution is true for the Sun, and most of what the Sun is doing is what the chart says a G2V main-sequence star should be doing.",
    },
    {
      selector: "x-axis",
      label: "Temperature axis (reversed)",
      explanation:
        "Surface temperature in kelvin, running hot on the left and cool on the right — the reverse of what you might expect. The convention is a fossil of Annie Jump Cannon's O-B-A-F-G-K-M spectral-classification alphabet at Harvard in the 1890s, which was defined before anyone knew those letters tracked temperature.",
    },
    {
      selector: "y-axis",
      label: "Luminosity axis (log)",
      explanation:
        "Luminosity in solar units, plotted logarithmically from 10⁻⁴ to 10⁶. The log scale is non-negotiable: stars span ten decades in brightness, and a linear axis would squash everything dimmer than a giant into the baseline.",
    },
  ],
};
