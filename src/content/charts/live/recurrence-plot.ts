import type { LiveChart } from "@/content/chart-schema";

export const recurrencePlot: LiveChart = {
  id: "recurrence-plot",
  name: "Recurrence Plot",
  family: "specialty",
  sectors: ["physics"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",

  synopsis:
    "Encodes the similarity structure of a time series as a binary square matrix, making dynamical texture — periodicity, laminar phases, chaos — directly visible to the eye.",

  whenToUse:
    "Use a recurrence plot when you need to diagnose qualitative regime changes in a single time series that are invisible to Fourier or autocorrelation methods. Eckmann, Kamphorst, and Ruelle introduced the technique in a 1987 Europhysics Letters paper to visualise the geometry of strange attractors without embedding-dimension assumptions. Standard applications include heart-rate variability (detecting atrial fibrillation), seismic tremor analysis, and regime detection in macroeconomic time series. Marwan et al.'s 2007 Physics Reports survey (458 pages) remains the definitive reference.",

  howToRead:
    "The matrix cell at row i, column j is black when the time-series value at step i is within threshold ε of the value at step j. Because the relation is symmetric (|x_i − x_j| = |x_j − x_i|), the matrix is symmetric about the main diagonal. The main diagonal (i = j) is always fully black. Parallel off-diagonal lines indicate periodicity: the system visits the same values at regular intervals. Scattered isolated dots indicate stochastic or chaotic behaviour. Rectangular blocks of black indicate laminar phases where the system stays near one value. Off-diagonal emptiness between two halves signals a regime change.",

  example: {
    title: "Heart-rate variability in sinus rhythm vs. atrial fibrillation, PhysioNet database",
    description:
      "Zbilut and Webber (1992) applied recurrence quantification analysis to RR-interval time series from ECG recordings. Sinus rhythm produces a recurrence plot with clear diagonal line structures (periodic beating); atrial fibrillation produces a sparse scattered plot with no diagonal organisation. The transition from one texture to the other is detectable earlier than threshold-crossing methods would flag it — the key clinical advantage of the form.",
  },

  elements: [
    {
      selector: "recurrent-cell",
      label: "Recurrent cell",
      explanation:
        "A filled cell at (i, j) means the time-series values at steps i and j are within threshold ε of each other: |x_i − x_j| < ε. The cell colour is binary — black (recurrent) or empty (non-recurrent). There is no gradient encoding; only the presence or absence of recurrence matters. The fraction of filled cells is the recurrence rate, here targeted at 10–15%.",
    },
    {
      selector: "main-diagonal",
      label: "Main diagonal (i = j)",
      explanation:
        "The main diagonal is always fully black because every point is identical to itself: |x_i − x_i| = 0 < ε for any positive ε. It is the trivial line of self-recurrence. The interesting structure is entirely in the off-diagonal pattern. A thickened diagonal (diagonal lines of length > 1) indicates the system lingers near a value for multiple consecutive steps.",
    },
    {
      selector: "periodic-texture",
      label: "Periodic texture",
      explanation:
        "The upper-left quadrant encodes the sinusoidal first half of the series. Regular parallel sub-diagonal lines appear because a periodic signal revisits the same values at every integer multiple of its period. The spacing between the parallel lines equals the period of the signal. This is the visual signature Eckmann et al. (1987) used to distinguish periodic attractors from chaotic ones.",
    },
    {
      selector: "chaotic-texture",
      label: "Chaotic texture",
      explanation:
        "The lower-right quadrant encodes the chaotic second half of the series. The recurrence pattern breaks into isolated dots and short fragments — the trajectory does not revisit the same neighbourhood at predictable intervals. In a genuinely chaotic signal, the density of isolated points is high and long diagonal lines are absent, reflecting positive Lyapunov exponents and exponential divergence of nearby trajectories.",
    },
    {
      selector: "regime-change",
      label: "Regime boundary",
      explanation:
        "The dashed lines at the midpoint divide the matrix into four quadrants. The upper-left and lower-right quadrants show within-regime recurrence (periodic–periodic and chaotic–chaotic). The upper-right and lower-left off-diagonal quadrants encode cross-regime recurrence: they are sparse because the periodic and chaotic halves visit entirely different regions of state space. This emptiness is the visual signature of a regime change.",
    },
    {
      selector: "epsilon",
      label: "Threshold ε",
      explanation:
        "The threshold ε is the neighbourhood radius that determines whether two states count as recurrent. Too small an ε yields a nearly empty matrix; too large yields an all-black matrix. The standard heuristic (Zbilut & Webber, 1992; Marwan 2007) is to choose ε so that the recurrence rate falls between 5% and 15%. Here ε is estimated from the 12th percentile of sampled pairwise distances.",
    },
    {
      selector: "x-axis",
      label: "Time index j",
      explanation:
        "The horizontal axis is the column time index j, ranging from 0 to N−1. Reading across a single row i shows which time steps j share the same neighbourhood as step i. The first 75 columns correspond to the periodic regime; the next 75 to the chaotic regime.",
    },
  ],
};
