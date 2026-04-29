import type { LiveChart } from "@/content/chart-schema";

export const poincareMap: LiveChart = {
  id: "poincare-map",
  name: "Poincaré Map",
  family: "specialty",
  sectors: ["physics"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",

  synopsis:
    "Reduces a continuous flow to a discrete map by recording where trajectories cross a reference hyperplane, making periodic and chaotic structure visible at a glance.",

  whenToUse:
    "Use a Poincaré map when you need to distinguish periodic, quasi-periodic, and chaotic behaviour in a dynamical system without integrating thousands of full orbits. The map compresses time: one plotted point per section-crossing rather than one per timestep. It is the standard diagnostic for kicked Hamiltonian systems (accelerator physics, plasma confinement, celestial mechanics) and for locating period-doubling cascades in dissipative systems.",

  howToRead:
    "Each colour-coded cloud of points is the orbit of one initial condition iterated under the map. A closed 1D curve means the orbit lies on an invariant torus (a KAM torus): motion is quasi-periodic and the trajectory never repeats exactly, but stays confined to a tube. A filled 2D region means the orbit is chaotic: it wanders ergodically through a connected chaotic zone. Isolated fixed points indicate periodic orbits of the original flow. The boundary between smooth curves and chaotic clouds is where KAM tori break under the Kolmogorov-Arnold-Moser theorem (Kolmogorov 1954, Arnold 1963, Moser 1962).",

  example: {
    title: "Chirikov standard map, K = 1.2 (transitional regime)",
    description:
      "Boris Chirikov's 1979 paper on the standard map showed that at K ≈ 0.972 the last KAM torus connecting the two halves of phase space breaks, switching the barrier from impermeable to permeable. At K = 1.2, shown here, remnant tori (Cantori) persist near rational frequency ratios while a connected chaotic sea fills the remaining area. The same map governs particle dynamics in the CERN proton synchrotron and the slow diffusion of asteroids in the Kirkwood gaps.",
  },

  elements: [
    {
      selector: "kam-torus",
      label: "KAM torus orbit",
      explanation:
        "When the perturbing parameter K is below the KAM threshold for a given frequency ratio, the orbit remains on an invariant 2-torus in 4D phase space. Its intersection with the Poincaré section appears as a smooth closed curve on the torus cross-section. The KAM theorem (Kolmogorov 1954, Arnold 1963, Moser 1962) guarantees that tori with sufficiently irrational frequency ratios survive small perturbations.",
    },
    {
      selector: "chaotic-zone",
      label: "Chaotic zone",
      explanation:
        "When K exceeds the local KAM threshold, the invariant torus breaks into a Cantor set (Cantorus). The orbit diffuses through the gaps, filling a 2D region ergodically. Positive Lyapunov exponent is the analytic criterion; the filled scatter is its visual signature. Lorenz's butterfly fractal structure was first identified by examining Poincaré sections of the Lorenz attractor.",
    },
    {
      selector: "initial-condition",
      label: "Initial condition",
      explanation:
        "Each open circle marks the starting point (x₀, y₀) of one orbit. In an area-preserving map, the region enclosed by any closed invariant curve is conserved under iteration — a consequence of Liouville's theorem for Hamiltonian systems. Different initial conditions sample different dynamical regimes.",
    },
    {
      selector: "x-axis",
      label: "x (mod 1)",
      explanation:
        "Both coordinates are taken modulo 1, mapping the phase space to a flat torus [0,1]². Points that exit the right edge re-enter from the left; the geometry is periodic in both directions. This is the natural phase space for the angle variables of the kicked rotator that the standard map models.",
    },
    {
      selector: "y-axis",
      label: "y (mod 1)",
      explanation:
        "The vertical coordinate y is the conjugate momentum of the kicked rotator, also taken mod 1. At K = 0 (no kick), orbits are horizontal lines of constant y — pure rotation. Increasing K deforms and eventually destroys these lines, producing the mixed phase-space portrait shown.",
    },
  ],
};
