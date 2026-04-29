import type { LiveChart } from "@/content/chart-schema";

export const gaugeChart: LiveChart = {
  id: "gauge-chart",
  name: "Gauge / Speedometer Chart",
  family: "comparison",
  sectors: ["business"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Plots a single measured value against a banded arc so a viewer can read status — healthy, warning, critical — in one glance without decoding a number.",
  whenToUse:
    "Reach for a gauge when the question is qualitative and the audience is executive: is the server healthy, is the tank full, is the quota hit? Reach for almost anything else when the question is quantitative. A gauge is beloved by dashboards and mistrusted by analysts for the same reason — it trades precision for a shape that answers a yes/no question in under a second.",
  howToRead:
    "Read the arc as a number line bent into a semicircle. Coloured bands mark qualitative zones along that line, and the needle points at the current value. The big readout under the pivot is the actual number, kept because the bands alone never answer 'how much'. If your eye wants the number before it reads the colour, you chose the wrong chart — a bullet chart or a labelled KPI tile would have been denser and less decorative.",
  example: {
    title: "API response-time dashboard, 180ms against a 500ms SLA",
    description:
      "A site-reliability dashboard shows the P50 API response time as 180ms, needle well inside the green band, against a 500ms SLA. The gauge communicates 'we are healthy' in a glance to an executive skimming the status page; the numeric readout underneath lets an engineer on call confirm the exact value. The same data plotted as a bullet chart would take half the space and carry the same information, but the gauge survives in status dashboards precisely because non-technical viewers recognise the metaphor of a dial.",
  },
  elements: [
    {
      selector: "arc",
      label: "Arc",
      explanation:
        "The 180-degree semicircle is the full measurement range, bent from a line into a curve so the needle metaphor works. Only about half of the pixel area actually carries information, which is the cost of that metaphor.",
    },
    {
      selector: "band-green",
      label: "Healthy zone",
      explanation:
        "The acceptable range, defined by an SLA or target. Green here means 'no action required'; the width of the band encodes how generous the budget is, not how close to optimal you are.",
    },
    {
      selector: "band-amber",
      label: "Warning zone",
      explanation:
        "The range where performance is still within the hard limit but trending toward it. Amber is an invitation to investigate, not to page. Its boundary with green is the quiet editorial decision that drives most of the gauge's perceived accuracy.",
    },
    {
      selector: "band-red",
      label: "Critical zone",
      explanation:
        "The range where the hard threshold is about to be — or has been — breached. Reserve red for states that demand immediate action; diluting it across routine fluctuations trains the viewer to ignore it.",
    },
    {
      selector: "needle",
      label: "Needle",
      explanation:
        "The single mark that encodes the current value as an angle. Its pivot sits at the centre of the arc; the tip reads off the implicit scale. A needle is the worst way in the chart library to compare two values precisely, and the best way to say 'here, right now'.",
    },
    {
      selector: "value-readout",
      label: "Value readout",
      explanation:
        "The numeric backup the gauge quietly relies on. It exists because no viewer can reliably estimate a value from a needle angle to better than ~10 percent, so every serious gauge prints the number to rescue the bar it can't clear.",
    },
  ],
};
