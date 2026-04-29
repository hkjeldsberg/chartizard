import type { LiveChart } from "@/content/chart-schema";

export const screePlot: LiveChart = {
  id: "scree-plot",
  name: "Scree Plot",
  family: "distribution",
  sectors: ["data-science"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Eigenvalues of PCA components in rank order, used to pick how many dimensions to keep.",
  whenToUse:
    "Use a scree plot after running PCA (or any eigendecomposition) to decide where to truncate. The chart exists to make the elbow findable by eye — past the elbow each component explains so little variance that keeping it adds noise, not signal.",
  howToRead:
    "Read left-to-right: eigenvalues are sorted descending, so the line only ever falls. Find the elbow — the kink where a steep drop flattens into a long low tail. Keep components to the left of the elbow; discard the scree to the right. A second rule of thumb, Kaiser's, says keep any component with eigenvalue > 1; the two rules often disagree by one or two components.",
  example: {
    title: "PCA on 8×8 handwritten digits (64 pixels, sklearn 'digits')",
    description:
      "Standardising the 64 pixel features and running PCA produces a scree plot with PC1 and PC2 towering over the rest and a sharp elbow at PC3. Raymond Cattell (1966) named the chart after the loose rubble at the base of a mountain — the eigenvalues past the elbow are the scree, the geological debris below the cliff where the interesting structure ends.",
  },
  elements: [
    {
      selector: "scree-line",
      label: "Scree line",
      explanation:
        "The line connecting eigenvalues in rank order. It must be monotonically non-increasing — if it rises, the components aren't sorted. The shape of the line is the whole chart: a sharp kink says there's a clean cut-off; a gentle slope says the variance is smeared across many components and PCA may not be buying you much.",
    },
    {
      selector: "bar",
      label: "Component bar",
      explanation:
        "One bar per principal component, height proportional to its eigenvalue (variance explained). The bars and the line carry the same information twice — the bars make individual magnitudes easy to read, the line makes the elbow pop. Convention keeps both.",
    },
    {
      selector: "elbow",
      label: "Elbow",
      explanation:
        "The kink where a steep drop flattens. Cattell's rule: this is where the mountain ends and the scree begins. Everything past the elbow is noise you'd be over-fitting to if you kept it. The elbow is a judgement call — two analysts can disagree by one component.",
    },
    {
      selector: "kaiser-line",
      label: "Kaiser threshold",
      explanation:
        "The dashed horizontal at eigenvalue = 1. Kaiser's criterion: on standardised data (variance-1 features), keep any component that explains more variance than an average original feature. It disagrees with the elbow often enough that you should apply both rules and pick which one your downstream task cares about.",
    },
    {
      selector: "eigenvalue-axis",
      label: "Eigenvalue axis",
      explanation:
        "The y-axis is the variance each component captures. On standardised data the sum of eigenvalues equals the number of features, which is why the Kaiser cut-off at 1 is meaningful — a component below 1 is explaining less than one feature's worth of variance.",
    },
    {
      selector: "component-axis",
      label: "Component axis",
      explanation:
        "The x-axis is the rank of the component, not its identity. PC1 is by definition the direction of maximum variance; PC2 is orthogonal to PC1 and captures the most remaining variance; and so on. Truncation means keeping the first k of these.",
    },
  ],
};
