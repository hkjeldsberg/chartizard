import type { LiveChart } from "@/content/chart-schema";

export const spiralPlot: LiveChart = {
  id: "spiral-plot",
  name: "Spiral Plot",
  family: "change-over-time",
  sectors: ["time-series"],
  dataShapes: ["temporal"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Winds a long periodic time series around a disc so successive cycles sit as concentric rings and the same phase lines up across revolutions.",
  whenToUse:
    "Reach for a spiral plot when the series has a known period and you want to see whether the same phase behaves the same across many revolutions. A plain line chart shows 20 years of daily temperature as a jagged comb of hundreds of identical-looking waves; a spiral pins January-to-January over one full turn, so every January sits on the same ray and every July sits on the opposite ray. Periodicity becomes concentric, and anomalies break the ring.",
  howToRead:
    "Follow the line from the centre outward: the innermost arc is the earliest year, the outermost arc is the most recent. The angle around the disc is the within-period phase — in this reading twelve o'clock is January 1, three o'clock is April, six o'clock is July, nine o'clock is October. Ink opacity encodes the measured value: faint strokes are cool, opaque strokes are hot. A consistent warm sector across revolutions means summer lands in the same months every year; a warm sector that drifts or thickens toward the outer rings means the seasonal character itself is changing.",
  example: {
    title: "London daily high temperature, 2005–2024",
    description:
      "John Snow drew the first published spiral time series in 1855 for a London cholera outbreak; Weber, Alexa and Müller revived the form in 'Visualizing Time-Series on Spirals' (IEEE InfoVis 2001) as a periodicity-detection tool. On 20 years of London daily highs the warm band lands on the same southeast sector of every revolution — the period is annual, and the spiral makes that fact visible at a glance. The outer rings sit noticeably darker than the inner ones: two decades of slow warming, rendered as ink density rather than a slope.",
  },
  elements: [
    {
      selector: "spiral-path",
      label: "Spiral path",
      explanation:
        "The primary mark — one continuous Archimedean curve r = a + bθ, sampled daily for 20 years. Because radius grows linearly with time and angle cycles once per year, the curve sweeps outward through 20 full revolutions. Each segment's ink opacity encodes that day's temperature, so the line is both a geometry and a scalar field.",
    },
    {
      selector: "radial-time",
      label: "Radial time axis",
      explanation:
        "Radius encodes absolute time — the innermost part of the curve is 2005, the outermost is 2024. Two faint concentric gridlines mark the 25% and 75% fractions of the 20-year span. Use the radial axis to answer 'which decade' questions; use the angular axis to answer 'which season' questions.",
    },
    {
      selector: "phase-axis",
      label: "Angular phase axis",
      explanation:
        "The J F M A M J J A S O N D labels around the rim are the within-year phase, one twelfth of a turn each. Every point on the same ray — on any ring — is the same calendar day, twenty years apart. This alignment is the reason to use a spiral over a line chart: it makes 'same phase' a geometric invariant.",
    },
    {
      selector: "summer-band",
      label: "Warm-sector band",
      explanation:
        "The dark band along the southeast rays is the annual summer peak, repeated every revolution. Because the spiral is Archimedean and the period is exactly 365 days, summers stack radially rather than smearing angularly. A smearing band would reveal phase drift — an anomaly the chart is built to expose.",
    },
    {
      selector: "cool-faint",
      label: "Cool-sector faintness",
      explanation:
        "The opposite sector — late December through February — is deliberately faint. Low-value data are drawn with low ink density so the warm band has visual priority. This is an opinionated asymmetry: the chart would be technically correct with uniform opacity, but the seasonal story would disappear.",
    },
    {
      selector: "temp-legend",
      label: "Temperature legend",
      explanation:
        "The vertical ramp decodes ink opacity into degrees Celsius. Without it the spiral would be a pretty spiral; with it, each segment is a quantitative reading. Always include a legend when the encoding is non-positional — a spiral plot without a legend is exactly the kind of chart that Edward Tufte would call a shape, not data.",
    },
  ],
};
