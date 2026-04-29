import type { LiveChart } from "@/content/chart-schema";

export const phasePortrait: LiveChart = {
  id: "phase-portrait",
  name: "Phase Portrait",
  family: "specialty",
  sectors: ["physics"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",

  synopsis:
    "Plots the state of a dynamical system as a curve in state space, revealing the geometry of long-run behaviour without solving the equations explicitly.",

  whenToUse:
    "Use a phase portrait when the question is qualitative: does the system settle, oscillate, or diverge? It is the native language of second-order ODEs — mechanical oscillators, predator-prey models, nonlinear circuits, and neural firing models all live here. If you need to read off energy, amplitude, or period from a trajectory's shape rather than from a time series, the phase portrait is the right frame.",

  howToRead:
    "Each curve is one trajectory: a single solution to the ODE starting from a given initial condition. Arrows on the vector field show the instantaneous velocity of the state at every point. A trajectory that spirals inward is losing energy; one that closes on itself is a periodic orbit. Read the fixed points first — they organise everything else. The Jacobian at each fixed point determines its type: a negative-real-part eigenvalue pair is a stable spiral (trajectories wind in); a positive-real-part pair is an unstable spiral (trajectories wind out); purely imaginary eigenvalues give a centre; one positive, one negative real eigenvalue gives a saddle.",

  example: {
    title: "Damped harmonic oscillator, ζ = 0.1, ω₀ = 1 rad/s",
    description:
      "The underdamped oscillator (ζ = 0.1) has eigenvalues −0.1 ± 0.995i. Every trajectory spirals into the origin regardless of starting position, confirming global asymptotic stability. Poincaré introduced this geometric picture in the 1880s to study planetary stability — the same portrait that today classifies firing patterns in the Hodgkin-Huxley neuron model.",
  },

  elements: [
    {
      selector: "vector-field",
      label: "Vector field (quiver)",
      explanation:
        "Each arrow points in the direction (ẋ, ẍ) = (v, −2ζω₀v − ω₀²x) at that grid point. Arrow lengths are normalised to a fixed visual size so the direction field remains legible at all amplitudes. The arrows are the derivative; the trajectories are its integral curves.",
    },
    {
      selector: "trajectory",
      label: "Trajectory",
      explanation:
        "A trajectory is one solution of the ODE, integrated here by the Runge-Kutta-4 method (dt = 0.05, 420 steps). The curve does not cross itself in 2D state space — that would violate uniqueness of solutions. Six initial conditions are shown; all converge to the same attractor.",
    },
    {
      selector: "initial-condition",
      label: "Initial condition",
      explanation:
        "The open circle marks the state at t = 0. Choosing different initial conditions samples the phase portrait; whether trajectories starting from far away still converge tells you whether the attractor is global or only local.",
    },
    {
      selector: "fixed-point",
      label: "Stable spiral fixed point",
      explanation:
        "At the origin, ẋ = 0 and v̇ = 0 simultaneously — the system is at rest. The Jacobian eigenvalues are −ζω₀ ± iω₀√(1 − ζ²), which have negative real parts, so this is a stable spiral: all nearby trajectories rotate and decay toward it. In the 2D taxonomy (Strogatz §5.2), stable spirals, unstable spirals, centres, stable nodes, unstable nodes, and saddles exhaust the generic fixed-point types.",
    },
    {
      selector: "x-axis",
      label: "Position axis (x)",
      explanation:
        "The horizontal axis is the first state variable — displacement from equilibrium for a mechanical oscillator, membrane voltage for a neuron. Reading the x-axis extent tells you the maximum amplitude reached by each trajectory.",
    },
    {
      selector: "y-axis",
      label: "Velocity axis (v = ẋ)",
      explanation:
        "The vertical axis is the second state variable — velocity or rate of change. Together, x and v form the minimal state: knowing both uniquely determines all future behaviour. A point on the v-axis (x = 0) is the moment of maximum speed; a point on the x-axis (v = 0) is the moment of maximum displacement.",
    },
    {
      selector: "spiral-pattern",
      label: "Spiralling-in pattern",
      explanation:
        "The inward spiral is the signature of an underdamped stable system: the state oscillates with a shrinking amplitude. Increase ζ past 1 and the spiral straightens into a node (no oscillation, exponential decay). Set ζ = 0 and the spiral opens into a closed ellipse — a centre, neutrally stable, the portrait of a frictionless pendulum near equilibrium.",
    },
  ],
};
