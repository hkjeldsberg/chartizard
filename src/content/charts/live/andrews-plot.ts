import type { LiveChart } from "@/content/chart-schema";

export const andrewsPlot: LiveChart = {
  id: "andrews-plot",
  name: "Andrews Plot",
  family: "specialty",
  sectors: ["statistics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Turns each multivariate observation into a 1D Fourier curve; similar rows draw similar curves.",
  whenToUse:
    "Reach for an Andrews plot when you want to see whether multivariate observations cluster, and the number of observations is small enough that individual curves stay readable (up to a few dozen). It is a visual substitute for distance calculation: the chart preserves L² distance between observations, so rows that are close in p-dimensional space draw close in f(t).",
  howToRead:
    "Each row of the data is one curve over t ∈ [−π, π], constructed as f(t) = x₁/√2 + x₂ sin(t) + x₃ cos(t) + x₄ sin(2t) + … Similar observations produce similar curves; clusters show up as curve-bundles. Read bundle separation, not individual curve values — the y-axis is a Fourier sum, not a variable. The assignment of variables to terms matters: x₁ dominates the constant level and x₂ controls the amplitude of the slowest wiggle, so order your variables by importance.",
  example: {
    title: "Fisher's Iris dataset, 24 flowers",
    description:
      "Eight specimens each of I. setosa, I. versicolor, and I. virginica, with their four measurements (sepal length, sepal width, petal length, petal width) mapped to the first four Fourier terms. Setosa curves sit as a tight low-amplitude bundle at the bottom; virginica rides highest because its sepal length dominates the x₁ constant. David F. Andrews published the method in Biometrics 28(1) in 1972 for exactly this kind of eyeball-the-cluster task on small biological datasets.",
  },
  elements: [
    {
      selector: "curve",
      label: "Single curve",
      explanation:
        "One observation, encoded as the function f(t) = x₁/√2 + x₂ sin(t) + x₃ cos(t) + x₄ sin(2t). Each row of the data becomes one line; the y-axis of the line is the Fourier sum, not any one variable.",
    },
    {
      selector: "bundle",
      label: "Curve bundle",
      explanation:
        "A group of curves that track each other across t. Bundles are how clusters render in Andrews space — when several observations share similar values across all variables, their curves braid together. Read bundle separation rather than any one curve's position.",
    },
    {
      selector: "variable-order",
      label: "Variable order",
      explanation:
        "The assignment of variables to Fourier terms is not neutral. x₁ sets the constant level of the curve; x₂ controls the lowest-frequency sine; higher-indexed variables wiggle faster and visually fade. Put the variables you care about at the start.",
    },
    {
      selector: "t-axis",
      label: "t-axis",
      explanation:
        "The parameter t runs over [−π, π]. It is not time and has no unit — it is the argument of the Fourier basis. Ticks at ±π/2 and 0 are useful reference points because every curve passes through f(0) = x₁/√2 + x₃.",
    },
    {
      selector: "y-axis",
      label: "f(t) axis",
      explanation:
        "The value of the Fourier sum at each t. Magnitude has no direct interpretation in the original variables — what matters is where curves sit relative to each other and whether bundles overlap or separate.",
    },
    {
      selector: "legend",
      label: "Legend",
      explanation:
        "Species are distinguished by stroke style (solid, dashed, dotted), not colour alone — curves overlap densely and colour-only encoding fails both in print and for colour-vision-deficient readers.",
    },
  ],
};
