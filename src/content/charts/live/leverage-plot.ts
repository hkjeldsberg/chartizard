import type { LiveChart } from "@/content/chart-schema";

export const leveragePlot: LiveChart = {
  id: "leverage-plot",
  name: "Leverage Plot",
  family: "relationship",
  sectors: ["statistics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Plots each observation's hat-matrix diagonal h_ii against its fitted value, revealing which design points exert disproportionate influence over the regression surface.",
  whenToUse:
    "Use a leverage plot immediately after fitting an OLS or generalised linear model when you want to audit the design matrix for unusual X-configurations. High-leverage points can mask poor fit and inflate standard errors; spotting them before interpreting coefficients prevents overconfident conclusions. The leverage plot is a complement to — not a replacement for — the residual plot: leverage flags dangerous geometry, residuals flag poor fit.",
  howToRead:
    "Each point is one observation. The y-axis shows h_ii, the diagonal entry of the hat matrix H = X(XᵀX)⁻¹Xᵀ; it measures how far that observation sits from the centroid of the predictor space. The dashed threshold at 2(p+1)/n, where p is the number of predictors, is the conventional Welsch-Kuh cutoff. Points above the line have high leverage. A high-leverage point with a small residual is an influential but well-fitted anchor; high-leverage with a large residual is a problem.",
  example: {
    title: "Boston housing data, Harrison and Rubinfeld (1978)",
    description:
      "In the Harrison-Rubinfeld OLS model of median house values across 506 Boston census tracts (13 predictors), roughly 30 tracts showed h_ii above the 2(p+1)/n cutoff. Several riverside tracts near the Charles River — unusual in both NOX and distance predictors — had leverage values exceeding 0.25, explaining why the nitrogen-oxide coefficient was sensitive to their inclusion.",
  },
  elements: [
    {
      selector: "y-axis",
      label: "Leverage h_ii",
      explanation:
        "h_ii is the i-th diagonal of H = X(XᵀX)⁻¹Xᵀ, bounded between 1/n and 1. It is a function of the predictor values alone — independent of the response Y. Geometrically, h_ii = 1 would mean the entire regression surface passes through observation i; in practice, values above 0.5 are extreme.",
    },
    {
      selector: "x-axis",
      label: "Fitted value (ŷ)",
      explanation:
        "The fitted value ŷ_i = x_iᵀβ̂ is used as the horizontal axis rather than the observation index, placing the leverage point in the context of the model's predicted range. A high-leverage point at the extremes of ŷ is more interpretively meaningful than one at the centre.",
    },
    {
      selector: "threshold-line",
      label: "2(p+1)/n threshold",
      explanation:
        "The cutoff 2(p+1)/n, formalised by Welsch and Kuh (MIT Sloan, 1977), identifies observations whose leverage is more than twice the average 1/n adjusted for model complexity. It is a rule of thumb calibrated to flag roughly the top 5% of design points in well-behaved datasets, not a formal hypothesis test.",
    },
    {
      selector: "high-leverage-point",
      label: "High-leverage point",
      explanation:
        "An open circle above the threshold marks an observation with unusual predictor values. The residual-plot determines whether it is also poorly fitted. Cook's distance synthesises both: high leverage times large squared residual equals high Cook's distance and genuine danger to the fit.",
    },
    {
      selector: "low-leverage-cloud",
      label: "Low-leverage cloud",
      explanation:
        "The dense cluster of filled circles below the threshold is the well-behaved majority of the data. Each point sits near the centroid of predictor space, so removing any one of them would shift the fitted surface only marginally. A healthy regression rests on this cloud, not on a handful of anchors.",
    },
    {
      selector: "design-centre",
      label: "Centre of design space",
      explanation:
        "The point closest to the centroid of all predictor values has the minimum possible leverage, 1/n. In a balanced experimental design every observation would be near this value; in observational data the cloud is irregular and some points inevitably pull the fitted surface toward them.",
    },
  ],
};
