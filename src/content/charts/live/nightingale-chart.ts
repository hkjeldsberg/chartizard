import type { LiveChart } from "@/content/chart-schema";

export const nightingaleChart: LiveChart = {
  id: "nightingale-chart",
  name: "Nightingale Chart",
  family: "composition",
  sectors: ["general", "medicine"],
  dataShapes: ["categorical"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Twelve equal-angle wedges around a hub, each stacking a category breakdown and growing outward with its total — the polar form Florence Nightingale invented to argue for sanitary reform.",
  whenToUse:
    "Reach for a Nightingale chart when the data is a monthly or seasonal cycle AND the headline story is what's inside each period, not the headline total. The polar layout closes the year on itself, so a reader sees the cycle as a single shape rather than a timeline with two ends.",
  howToRead:
    "Walk clockwise from the top: every wedge is one month, every wedge occupies the same 30° of arc. Radius is total deaths for that month; inside each wedge, concentric bands split the total across causes, with preventable disease at the hub. The eye compares the hub-band's reach across months — that comparison is the chart's argument, not the outer silhouette.",
  example: {
    title: "British Army mortality in the East, April 1855 – March 1856",
    description:
      "Florence Nightingale published this diagram in 1858 to convince Parliament and the War Office that British soldiers in the Crimea were dying of preventable disease, not of wounds. A stacked bar chart would have given the same numbers; the rose gave the argument a silhouette. The Royal Commission it helped convene drove the Army Sanitary Commission's reforms — latrines, ventilation, clean water — and the in-theatre death rate fell by roughly an order of magnitude.",
  },
  elements: [
    {
      selector: "peak-wedge",
      label: "January peak",
      explanation:
        "One month's wedge — every wedge spans the same 30° of arc, so only radius varies. January 1856 is the cycle's visual peak because the winter hospital wards were freezing, crowded, and unventilated; the scale of the wedge is a scale of failure, not of combat.",
    },
    {
      selector: "disease-band",
      label: "Preventable-disease band",
      explanation:
        "The innermost band, drawn at the hub of every wedge. Its reach across the year is the chart's whole point: cholera, typhus, and dysentery — not bullets — were killing the army. Nightingale chose the ordering deliberately so this band would dominate the eye.",
    },
    {
      selector: "wounds-band",
      label: "Wounds band",
      explanation:
        "The thin middle ring — deaths from wounds received in battle. Kept visible but narrow by design: a bar chart would have hidden the ratio, and a doughnut of annual totals would have averaged it away. Holding this band against the disease band month by month is what makes the argument unavoidable.",
    },
    {
      selector: "month-labels",
      label: "Month labels",
      explanation:
        "The angular axis runs April at 12 o'clock through March, completing the cycle. A Nightingale chart is a time series that closes on itself — the choice of which month sits at the top is a rhetorical one, here aligned to the British Army's campaign year.",
    },
    {
      selector: "radius-scale",
      label: "Radius scale",
      explanation:
        "Concentric rings mark deaths per month. Radius (not area) scales with the total — the same convention Nightingale used, which exaggerates large wedges and was part of the diagram's persuasive force. Labels sit on the horizontal spoke so the rings read as a ruler.",
    },
    {
      selector: "legend",
      label: "Cause legend",
      explanation:
        "Three bands, innermost to outermost: preventable disease, wounds, other. The opacity ramp is monotone so the chart survives the 19th-century reproduction technology it was designed for — colour-only encoding would have collapsed the argument on the second printing.",
    },
  ],
};
