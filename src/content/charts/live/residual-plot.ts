import type { LiveChart } from "@/content/chart-schema";

export const residualPlot: LiveChart = {
  id: "residual-plot",
  name: "Residual Plot",
  family: "distribution",
  sectors: ["statistics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Fitted values on the x-axis, residuals on the y-axis — a diagnostic whose job is to be boring.",
  whenToUse:
    "A residual plot is the first thing you look at after fitting a linear model. It answers a narrow question: did the assumptions hold? Every deviation from a featureless cloud is evidence of a specific failure, which is why the chart is read negatively — you are looking for what is NOT there.",
  howToRead:
    "The chart is a success when it looks like random static. A curve means the linear model is missing a nonlinearity — a quadratic or a log transform is probably needed. A fan or funnel widening left-to-right means heteroscedasticity: the error variance depends on the fitted value, and standard errors are no longer trustworthy. A pattern along x suggests a predictor was left out of the model. A single far-out point is an influential observation — refit without it and see if the coefficients move.",
  example: {
    title: "Ordinary least squares on the Boston housing dataset",
    description:
      "Fit median house price on per-capita crime and a handful of tract covariates, then plot residuals against fitted values. The textbook result is a mild funnel: variance in the residuals grows with predicted price, which is why the field moved to log-transformed targets and robust standard errors for price regressions. The residual plot is how a statistician noticed the problem before anyone asked about the model's uncertainty.",
  },
  elements: [
    {
      selector: "zero-line",
      label: "Zero reference line",
      explanation:
        "The horizontal line at y = 0. Residuals sum to zero by construction of OLS, so a well-fit model's cloud is balanced above and below. Persistent sag or lift away from the line across a region of fitted values is the signal that the fit is locally biased.",
    },
    {
      selector: "residual-point",
      label: "Residual point",
      explanation:
        "One observation's residual — the raw distance from its actual y to the model's fitted ŷ. Positive means the model under-predicted, negative means it over-predicted. A single extreme point is not noise; it is a candidate influential observation worth refitting without.",
    },
    {
      selector: "cloud-shape",
      label: "Cloud shape",
      explanation:
        "What the chart is really testing. A featureless cloud means the linear form captured the systematic structure. A curve points to a missing nonlinearity. A drift in the mean along x points to a missing predictor. Read the chart by trying to name the shape — if nothing comes to mind, the model is doing its job.",
    },
    {
      selector: "vertical-spread",
      label: "Vertical spread",
      explanation:
        "The height of the cloud at a given fitted value. Constant spread across x is the homoscedasticity assumption; a funnel widening to the right is the classic heteroscedasticity pattern and invalidates the standard error formulas. It does not bias the coefficients — it breaks the inference.",
    },
    {
      selector: "x-axis",
      label: "X-axis (fitted values)",
      explanation:
        "The model's predictions ŷ, not the raw x-variables. Plotting against fitted values rather than a specific predictor pools all the model's information into one diagnostic view, at the cost of hiding which predictor is responsible for any pattern that appears.",
    },
    {
      selector: "y-axis",
      label: "Y-axis (residuals)",
      explanation:
        "The residual y − ŷ, centred on zero. Scale the axis symmetrically so positive and negative miss the same amount of visual weight; an asymmetric y-axis quietly hides whichever direction the fit is bent toward.",
    },
  ],
};
