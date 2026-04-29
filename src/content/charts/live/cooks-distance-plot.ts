import type { LiveChart } from "@/content/chart-schema";

export const cooksDistancePlot: LiveChart = {
  id: "cooks-distance-plot",
  name: "Cook's Distance Plot",
  family: "distribution",
  sectors: ["statistics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Displays Cook's distance for each observation in an OLS regression, flagging which data points, if removed, would most change the fitted coefficients.",
  whenToUse:
    "Use a Cook's distance plot after fitting an ordinary least squares regression to screen for influential observations — those that, individually, shift the estimated coefficients substantially. It is most useful when n is small enough that a single observation can dominate the fit, or after spotting unusual residuals and wanting to quantify their leverage-weighted effect.",
  howToRead:
    "Each stem represents one observation. The stem height is Cook's distance D_i, which combines that observation's leverage (distance from the centre of X-space) and its squared residual into a single scalar. The horizontal dashed line marks the conventional cutoff 4/n; stems above it warrant inspection. A tall stem with a small residual means high leverage; a tall stem with a large residual means the observation is both unusual in X and poorly fitted.",
  example: {
    title: "Regression diagnostics for the Duncan occupational prestige data (Fox, 1991)",
    description:
      "In John Fox's analysis of Duncan's 1961 occupational prestige dataset (45 U.S. occupations), two observations — ministers and railroad conductors — showed Cook's distances well above 4/45, despite being near the regression line. Removing them shifted the income coefficient by roughly 0.1, illustrating that influential observations need not be poorly fitted.",
  },
  elements: [
    {
      selector: "y-axis",
      label: "Cook's distance (D_i)",
      explanation:
        "Cook's distance D_i = (1/p) * (ŷ − ŷ₍₋ᵢ₎)ᵀ(XᵀX)(ŷ − ŷ₍₋ᵢ₎) / s², where ŷ₍₋ᵢ₎ is the fitted vector after removing observation i. It measures how much all n fitted values shift when that observation is dropped. Larger values indicate stronger influence on the global fit.",
    },
    {
      selector: "x-axis",
      label: "Observation index",
      explanation:
        "The x-axis is a simple sequential index, not a meaningful continuous variable. Its purpose is to space the stems evenly so each observation occupies its own column. When the data are ordered by a covariate, patterns in stem height across the index may reveal structure.",
    },
    {
      selector: "threshold-line",
      label: "4/n threshold",
      explanation:
        "The dashed line at D = 4/n is the conventional heuristic introduced alongside Cook's original 1977 paper. Observations above it are flagged for inspection, not automatically removed. The cutoff is a rule of thumb, not a formal test — some authors prefer F-distribution quantiles instead.",
    },
    {
      selector: "influential-observation",
      label: "Influential observation (obs 17)",
      explanation:
        "This stem exceeds the 4/n threshold, identifying observation 17 as an influential point. High Cook's distance arises from the product of leverage and squared residual — the observation is either far from the centre of X-space, poorly fitted by the model, or both. Examine the raw data row and consider refitting with it held out.",
    },
    {
      selector: "short-stem",
      label: "Non-influential bulk",
      explanation:
        "The majority of stems sit well below the threshold. These observations each have a small effect on the fitted coefficients; removing any one of them would not meaningfully change the regression surface. Their collective pattern — roughly uniform height — is the expected baseline for a well-behaved dataset.",
    },
    {
      selector: "second-influential",
      label: "Second influential observation (obs 34)",
      explanation:
        "Observation 34 also clears the 4/n line, though at a lower Cook's distance than obs 17. When two or more observations are simultaneously influential, masking can occur: each may appear less extreme because the other anchors the fit. Joint deletion diagnostics extend Cook's idea to subsets.",
    },
  ],
};
