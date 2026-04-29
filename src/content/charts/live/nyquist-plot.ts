import type { LiveChart } from "@/content/chart-schema";

export const nyquistPlot: LiveChart = {
  id: "nyquist-plot",
  name: "Nyquist Plot",
  family: "specialty",
  sectors: ["electrical"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Open-loop transfer function traced as a closed contour in the complex plane — the chart where feedback stability becomes a question of counting encirclements of a single point.",
  whenToUse:
    "Reach for a Nyquist plot when you need to prove — not estimate — the stability of a feedback loop, especially one with open-loop poles on the imaginary axis or in the right-half plane where Bode-style margin reasoning fails. The plot is the stability theorem: rather than solve for closed-loop roots, you trace G(jω) around the whole imaginary axis and count how many times the contour winds around (−1, 0). It is the reference chart for delay-laden systems, non-minimum-phase plants, and any loop where the frequency response encircles unity gain more than once.",
  howToRead:
    "The horizontal axis is Re G(jω); the vertical axis is Im G(jω). The solid curve traces ω from 0⁺ up to +∞ (usually sweeping the lower half-plane first for lag-dominant systems, then closing back); the dashed curve is its conjugate mirror for ω from 0⁻ down to −∞. Together they form one closed contour in the complex plane. Mark the point (−1, 0) — the Nyquist critical point — and count encirclements: by the Nyquist stability criterion, the number of closed-loop poles in the right-half plane is Z = P − N, where P is the number of open-loop poles in the right-half plane and N is the number of counter-clockwise encirclements of (−1, 0). A stable loop needs Z = 0.",
  example: {
    title: "Harry Nyquist, Bell Telephone Laboratories, 1932",
    description:
      "Harry Nyquist published the stability criterion in 'Regeneration Theory' (Bell System Technical Journal, January 1932) to explain why certain telephone-repeater amplifiers oscillated while others — with the same gain budget — did not. His answer was geometric: the open-loop response, traced as a closed contour in the complex plane, either encircled the point (−1, 0) or it did not, and that single topological fact decided stability. Do not confuse this chart with the famous Nyquist sampling theorem — that is a different result by the same engineer (1928, 'Certain Topics in Telegraph Transmission Theory') about reconstructing a signal from samples. The Nyquist plot, this chart, is about feedback stability. Same person, different paper, same instinct for turning an analytical question into a picture.",
  },
  elements: [
    {
      selector: "positive-branch",
      label: "Positive-frequency branch (ω > 0)",
      explanation:
        "The solid curve traces G(jω) as ω sweeps from 0⁺ up to +∞. The arrow shows the direction of increasing ω. For a minimum-phase plant this branch starts at the low-frequency asymptote, spirals through the complex plane as each pole adds phase lag, and terminates at the origin because the transfer function rolls off to zero at infinity.",
    },
    {
      selector: "mirror-branch",
      label: "Negative-frequency mirror (ω < 0)",
      explanation:
        "Drawn dashed to distinguish it from the principal branch. Because G has real coefficients, G(−jω) = conj(G(jω)): every point on the positive branch has a mirror image across the real axis. Together the two branches form the closed contour that encirclement-counting requires.",
    },
    {
      selector: "critical-point",
      label: "Critical point (−1, 0)",
      explanation:
        "The single point the entire stability criterion watches. The number of counter-clockwise encirclements N of (−1, 0), subtracted from the number of open-loop right-half-plane poles P, gives the number of closed-loop right-half-plane poles: Z = P − N. For a stable loop you need Z = 0 — if the open loop has no RHP poles, that means no encirclements at all.",
    },
    {
      selector: "unit-circle",
      label: "Unit circle |G| = 1",
      explanation:
        "A dashed guide marking where |G(jω)| equals one. The angle from the negative real axis to the point where the curve crosses this circle is the phase margin — the same quantity the Nichols chart reads horizontally. Drawing the unit circle gives you the phase-margin number without a second chart.",
    },
    {
      selector: "origin",
      label: "Origin (ω → ±∞)",
      explanation:
        "For every strictly proper transfer function — more poles than zeros — G(jω) tends to zero as |ω| → ∞, so both branches spiral into the origin. The angle of approach encodes the excess pole order: for a three-pole system, the spiral enters at −270° from the positive real axis.",
    },
    {
      selector: "x-axis",
      label: "Real axis",
      explanation:
        "Re G(jω). Points where the curve crosses this axis are the frequencies at which the open-loop response is real — either a pure positive real number (0° phase) or a pure negative real number (−180° phase). The latter are the gain-margin crossover points; the distance from the crossing to (−1, 0) is the gain margin on this chart.",
    },
    {
      selector: "y-axis",
      label: "Imaginary axis",
      explanation:
        "Im G(jω). Points where the curve crosses this axis are the frequencies at which the open-loop response is purely imaginary — 90° of phase lead (upper half) or 90° of phase lag (lower half). For most practical plants the crossings sit in the lower half, because each pole adds 90° of phase lag before the response rolls off.",
    },
  ],
};
