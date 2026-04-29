import type { LiveChart } from "@/content/chart-schema";

export const funnelPlotMeta: LiveChart = {
  id: "funnel-plot-meta",
  name: "Funnel Plot (Meta-Analysis)",
  family: "distribution",
  sectors: ["medicine"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Scatters every study in a meta-analysis against its precision so publication bias becomes visible as a hole on one side of the funnel.",
  whenToUse:
    "Use a funnel plot when you have pooled a meta-analysis and need to stress-test it for publication bias — the tendency for small, null-result studies never to reach print. It is a standard diagnostic in Cochrane reviews and a required check in PRISMA-compliant systematic reviews.",
  howToRead:
    "Each point is one study. Its x-coordinate is the study's effect size (here, log odds ratio). Its y-coordinate is precision — 1/SE or total sample size — with the axis inverted so large, precise trials sit at the top and small, noisy trials sit at the bottom. Under the null hypothesis of no bias, the points should form a symmetric triangle inside the dashed 95% funnel, centred on the pooled effect. A missing wedge on one side — usually the small-study side showing null or harmful results — is the visual signature of a file drawer.",
  example: {
    title: "Egger, Smith, Schneider & Minder, BMJ, 1997",
    description:
      "Egger and colleagues formalised the asymmetry test that the funnel plot visualises, applying it to published meta-analyses of magnesium for acute myocardial infarction. Early small trials showed a strong protective effect; the funnel plot leaned hard to the left; the large ISIS-4 trial eventually landed near the null and closed the gap. The lesson the funnel made visible — that a meta-analysis of eight positive small trials can be wrong — is now standard practice in evidence synthesis.",
  },
  elements: [
    {
      selector: "funnel-apex",
      label: "Funnel apex",
      explanation:
        "The apex sits at the pooled effect size at the highest precision on the chart — this is where a hypothetical infinite-sample-size trial would land. The whole funnel is drawn as the 95% expected dispersion around this value. The further a study is from the apex horizontally, the further its estimate is from the pooled result.",
    },
    {
      selector: "study-point",
      label: "Study",
      explanation:
        "Each point is one published trial. Large trials sit near the top, tight to the pooled effect; small trials sit near the bottom and are allowed to scatter more widely — their wider confidence interval is the whole reason the funnel opens downward. Look for small trials that fall outside the funnel or cluster on one side.",
    },
    {
      selector: "funnel-boundary",
      label: "95% funnel",
      explanation:
        "The dashed triangular boundary is the range inside which 95% of studies should fall if the only source of variation is sampling error. It is not drawn from the data — it is drawn from the pooled estimate and the statistical assumption of no bias. Points should fill this region symmetrically; a sparse wedge is the diagnostic.",
    },
    {
      selector: "asymmetric-gap",
      label: "File-drawer gap",
      explanation:
        "The empty region inside the funnel is where small null or adverse-effect studies would sit if they had ever been published. The asymmetry is the visual signal of publication bias. Egger's regression of standardised effect on precision is the numerical test built on top of this visual — a statistically significant intercept formalises what the eye already sees.",
    },
    {
      selector: "x-axis",
      label: "Effect-size axis",
      explanation:
        "Effect sizes for binary outcomes are plotted on a log scale (log odds ratio or log risk ratio) so that a halving and a doubling are equidistant from the null. The central vertical — the pooled effect — is where the funnel is centred. Compare each study's horizontal distance from this line, not from zero.",
    },
    {
      selector: "y-axis",
      label: "Precision axis (inverted)",
      explanation:
        "Precision, usually 1/SE or total sample size, is plotted with the axis inverted so high precision (large trials) sits at the top and low precision (small trials) at the bottom. The inversion is the reason the funnel opens downward — the chart was designed to mimic an actual funnel, with the definitive trial at the mouth and the noisy pilots at the tip.",
    },
  ],
};
