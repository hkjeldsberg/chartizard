import type { LiveChart } from "@/content/chart-schema";

export const phaseSpacePlot: LiveChart = {
  id: "phase-space-plot",
  name: "Phase-Space Plot",
  family: "specialty",
  sectors: ["physics"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",

  synopsis:
    "Plots a dynamical system's state variables against each other (position vs velocity, not position vs time) to reveal the full geometry of its long-run behaviour.",

  whenToUse:
    "Reach for a phase-space plot when you want to understand the qualitative behaviour of a dynamical system across all possible starting conditions — not just one trajectory over time. It is the natural tool for Hamiltonian mechanics, fluid stability analysis, neuronal dynamics, and nonlinear oscillators. A single phase-space plot replaces infinitely many time-series graphs.",

  howToRead:
    "Each curve is a trajectory: the system moves along it as time advances. Closed loops are periodic orbits. A small dot inside a loop is a stable equilibrium (centre). A ring is an unstable equilibrium (saddle), approached asymptotically but never reached. The dashed separatrix divides the plane into qualitatively different regions: inside it, trajectories loop (the pendulum oscillates); outside, they spiral off the edge (the pendulum rotates continuously). Trajectories never cross — that is the determinism principle of Hamiltonian mechanics.",

  example: {
    title: "Lotka-Volterra predator-prey system, Lynx and Hare data 1900-1920",
    description:
      "C. S. Elton's 1924 analysis of Hudson's Bay Company fur-trade records used a phase-space plot of lynx population (x-axis) versus hare population (y-axis) to show the closed loops that confirmed Lotka and Volterra's 1925-26 equations. The loops were not perfect ellipses — their drift toward a limit cycle indicated that the real ecosystem dissipated energy — a detail that a paired pair of time-series graphs had not revealed.",
  },

  elements: [
    {
      selector: "libration-orbits",
      label: "Libration orbits",
      explanation:
        "The closed elliptical curves near the centre represent oscillating solutions: a pendulum swinging back and forth without going over the top. Each curve corresponds to a fixed total energy. The innermost curve is the small-angle (nearly simple harmonic) regime; the outer curves bulge as the nonlinearity of the pendulum's restoring force (sin θ vs θ) becomes significant at larger amplitudes.",
    },
    {
      selector: "separatrix",
      label: "Separatrix",
      explanation:
        "The dashed figure-eight curve is the separatrix — the unique trajectory that asymptotically approaches the unstable equilibrium (pendulum balanced exactly vertical) at θ = ±π. It partitions the plane into libration (inside) and rotation (outside) regions. Systems starting exactly on the separatrix would take infinite time to reach the saddle. In practice, no physical system stays on it; the separatrix is a boundary of behaviour, not a trajectory ever followed.",
    },
    {
      selector: "rotational-orbits",
      label: "Rotational orbits",
      explanation:
        "Curves above and below the separatrix represent whirling solutions: the pendulum has enough energy to rotate continuously over the top. They extend across the full θ domain rather than closing. The faster (higher energy) orbits run flatter — the angular velocity varies less with angle because the extra kinetic energy damps the effect of gravity.",
    },
    {
      selector: "fixed-points",
      label: "Fixed points",
      explanation:
        "The filled circle at the origin (θ = 0, θ̇ = 0) is the stable equilibrium: the pendulum hanging straight down. All nearby trajectories orbit it. The open circles at θ = ±π are saddle points — the unstable equilibrium of the pendulum balanced upright. Small perturbations cause saddle trajectories to diverge, which is why the separatrix passing through them is not itself a closed curve.",
    },
    {
      selector: "x-axis",
      label: "θ-axis (angle)",
      explanation:
        "The horizontal axis encodes the pendulum's angular displacement θ, running from −π (pointing straight up, leftward) through 0 (hanging down) to +π (pointing straight up, rightward). Because ±π are physically the same position, the left and right edges of the plot connect — phase space wraps into a cylinder.",
    },
    {
      selector: "y-axis",
      label: "θ̇-axis (angular velocity)",
      explanation:
        "The vertical axis encodes the angular velocity θ̇. Positive values mean counter-clockwise rotation; negative means clockwise. At the separatrix crossing points (θ̇ = 0, θ = ±π) the pendulum momentarily stops — it is poised at the top. The y-axis range is determined by the maximum energy displayed: here, rotational orbits at roughly twice the separatrix energy set the bound.",
    },
  ],
};
