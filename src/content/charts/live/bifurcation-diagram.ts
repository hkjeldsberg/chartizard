import type { LiveChart } from "@/content/chart-schema";

export const bifurcationDiagram: LiveChart = {
  id: "bifurcation-diagram",
  name: "Bifurcation Diagram",
  family: "specialty",
  sectors: ["physics"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",

  synopsis:
    "Plots the long-term behaviour of a dynamical system against a control parameter, revealing period-doubling cascades and the sudden onset of chaos.",

  whenToUse:
    "Use a bifurcation diagram when you need to show how the qualitative character of a system changes as a single parameter varies. The canonical domain is nonlinear dynamics, but the form applies wherever a system transitions between stable states — population ecology, laser physics, cardiac electrophysiology. The logistic map is the standard pedagogical entry point because Robert May's 1976 Nature paper showed that a single-equation model of population growth could produce arbitrarily complicated dynamics.",

  howToRead:
    "The x-axis is the control parameter r; the y-axis is the set of x-values the system visits after transients die out. A narrow vertical cross-section at any r is the system's attractor at that parameter value. One dot means a fixed point; two dots mean a 2-cycle; a dense vertical band means chaos. The successive halvings of the periodic windows converge geometrically: the ratio of consecutive interval widths approaches δ ≈ 4.6692, the Feigenbaum constant, which Mitchell Feigenbaum derived in 1978 (Journal of Statistical Physics 19(1)) and proved is universal across all unimodal maps.",

  example: {
    title: "Logistic map x_{n+1} = r x_n (1 − x_n), r ∈ [2.4, 4.0]",
    description:
      "May's 1976 analysis showed that r = 4 produces fully chaotic dynamics from the deterministic rule x_{n+1} = r x_n (1 − x_n). The bifurcation diagram makes this visible: for r < 3 the system settles to a single fixed point; period-doubling cascades begin at r ≈ 3 and accelerate until the onset of chaos at r ≈ 3.5699. The narrow bright window near r ≈ 3.83 is the period-3 orbit, whose existence implies periods of all orders (Sharkovskii's theorem, 1964). Each cascade step is shorter by a factor of δ ≈ 4.6692.",
  },

  elements: [
    {
      selector: "scatter-cloud",
      label: "Attractor cloud",
      explanation:
        "Each vertical column of dots is the set of x-values the logistic map returns to after 500 warmup iterations at that r. At small r the column collapses to a single dot (fixed point); in the chaotic regime it fills a dense band. The 2-3% opacity of individual dots makes the density of visited states readable as a continuous gradient.",
    },
    {
      selector: "bifurcation-lines",
      label: "Bifurcation points",
      explanation:
        "The three dashed vertical lines mark the first three period-doubling bifurcations: r ≈ 3.000 (1→2 cycle), r ≈ 3.449 (2→4 cycle), r ≈ 3.544 (4→8 cycle). The gaps between consecutive bifurcations shrink by the Feigenbaum ratio δ ≈ 4.6692 at each step, a geometric convergence that Feigenbaum discovered numerically in 1975 using a pocket calculator.",
    },
    {
      selector: "period-1",
      label: "Period-1 region",
      explanation:
        "For r < 3, the logistic map has a single stable fixed point x* = 1 − 1/r. The attractor cloud collapses to a single horizontal line. This is the regime in which a population modelled by May's equation converges to a stable carrying capacity regardless of initial conditions.",
    },
    {
      selector: "chaos-onset",
      label: "Onset of chaos",
      explanation:
        "At r ≈ 3.5699 the period-doubling cascade accumulates to its limit point: infinitely many period doublings have occurred and the attractor becomes aperiodic. Beyond this value, Lyapunov exponents become positive and nearby trajectories diverge exponentially — the defining signature of deterministic chaos.",
    },
    {
      selector: "period-3-window",
      label: "Period-3 window",
      explanation:
        "A narrow band of order near r ≈ 3.83 where the system reverts to a stable 3-cycle. Sharkovskii's theorem (1964) establishes that period-3 implies the existence of orbits of every integer period. Li and Yorke's 1975 paper titled Period Three Implies Chaos introduced the English word 'chaos' into mathematics. Each periodic window contains its own sub-cascade of period doublings.",
    },
    {
      selector: "feigenbaum",
      label: "Feigenbaum constant δ",
      explanation:
        "The ratio of successive bifurcation interval widths converges to δ ≈ 4.6692016… Feigenbaum showed in 1978 that this constant is universal: any smooth unimodal map with a single quadratic maximum produces the same ratio. The universality was proved via renormalisation-group arguments, and δ has since been measured experimentally in convection experiments (Libchaber & Maurer, 1980) and electronic circuits.",
    },
    {
      selector: "x-axis",
      label: "Parameter axis (r)",
      explanation:
        "The horizontal axis sweeps the growth parameter r from 2.4 to 4.0. For the population-biology interpretation (May 1976), r is the net reproductive rate. For r < 1 the population goes extinct; for 1 < r < 3 it stabilises; beyond r = 3 it begins to oscillate.",
    },
  ],
};
