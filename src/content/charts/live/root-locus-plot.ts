import type { LiveChart } from "@/content/chart-schema";

export const rootLocusPlot: LiveChart = {
  id: "root-locus-plot",
  name: "Root Locus Plot",
  family: "specialty",
  sectors: ["electrical"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Complex-plane trace of where the closed-loop poles of a feedback system migrate as a scalar gain K is swept from 0 to infinity.",
  whenToUse:
    "Reach for a root locus when you are choosing a loop gain and need to see, at one glance, which values keep the closed-loop system stable and how damping varies with that gain. It is the design tool for single-parameter tuning of linear feedback — pick K where the dominant closed-loop poles sit in a desirable region of the s-plane, not where a Bode or Nyquist plot merely says \"stable\". Walter R. Evans introduced the construction in 1948 (Graphical Analysis of Control Systems, AIEE Transactions 67(II)); it remained the fastest hand method for sizing compensators until interactive computing caught up in the 1970s.",
  howToRead:
    "Every × is an open-loop pole (a starting point of a branch at K = 0); every ○ is an open-loop zero (a terminus as K → ∞). The curves are the paths traced by the closed-loop poles as K rises. Branches are mirror-symmetric across the real axis because the characteristic polynomial has real coefficients. Where a pair of branches leaves the real axis is the breakaway point; where a branch crosses the imaginary jω axis is the exact gain at which the closed loop goes unstable. The asymptotes for a surplus of n_p − n_z poles over zeros depart from the centroid σ_a = (Σ poles − Σ zeros)/(n_p − n_z) at angles (2k+1)·180°/(n_p − n_z).",
  example: {
    title: "Unity-feedback loop around G(s) = 1 / [(s+1)(s+2)(s+3)]",
    description:
      "Three open-loop poles on the negative real axis, no zeros. The poles at −1 and −2 slide together and break away at s ≈ −1.423 (K ≈ 0.385), then climb into the complex plane along ±60° asymptotes whose centroid sits at σ_a = −2. Routh-Hurwitz on s³ + 6s² + 11s + (6+K) gives instability at K_crit = 60, where the complex branch crosses the jω axis at ±j√11. Evans's 1948 rules let a control engineer read all of this — break-away location, asymptote angles, crossing gain — off the sketch in under a minute, without solving the cubic.",
  },
  elements: [
    {
      selector: "open-loop-poles",
      label: "Open-loop poles (×)",
      explanation:
        "Each × marks a root of the open-loop denominator — the starting point of a branch at K = 0. A root locus always has one branch per open-loop pole. For a real-coefficient plant, real poles sit on the real axis and complex poles arrive in conjugate pairs.",
    },
    {
      selector: "locus-branch",
      label: "Locus branch",
      explanation:
        "A branch is the trajectory of one closed-loop pole as the gain K is swept from 0 to ∞. It starts at an open-loop pole and either terminates at an open-loop zero or runs to infinity along an asymptote. The union of all branches is mirror-symmetric about the real axis.",
    },
    {
      selector: "breakaway",
      label: "Breakaway point",
      explanation:
        "Where two real branches collide and leave the real axis, becoming a complex conjugate pair. For this plant the breakaway sits at s ≈ −1.423, the solution of 3s² + 12s + 11 = 0 — Evans's rule 6: the breakaway is a double root of the characteristic equation, equivalently where dK/ds = 0.",
    },
    {
      selector: "asymptotes",
      label: "Asymptotes",
      explanation:
        "Branches that do not terminate at a finite zero escape to infinity along asymptotes. The asymptotes radiate from the centroid σ_a = (Σ poles − Σ zeros)/(n_p − n_z) at angles (2k+1)·180°/(n_p − n_z). Here n_p − n_z = 3, so σ_a = −2 and the angles are ±60° and 180°.",
    },
    {
      selector: "jw-crossing",
      label: "jω-axis crossing",
      explanation:
        "The gain at which a branch crosses the imaginary axis is the critical gain K_crit — the exact value that drives the closed loop to the edge of instability. Here K_crit = 60 with crossings at s = ±j√11. Beyond this gain at least one closed-loop pole sits in the right half-plane and the system oscillates with growing amplitude.",
    },
    {
      selector: "real-axis",
      label: "Real axis (σ)",
      explanation:
        "The horizontal axis is Re(s). Evans's rule 3: a point on the real axis belongs to the locus if and only if the total number of real open-loop poles and zeros to its right is odd. That rule alone explains which segments of the real axis carry branches and which do not.",
    },
    {
      selector: "imaginary-axis",
      label: "Imaginary axis (jω)",
      explanation:
        "The vertical axis is Im(s); in continuous time it is also the stability boundary. A branch to the left of it decays, a branch on it oscillates, a branch to the right grows without bound. Reading the gain at which a branch touches this line is the whole point of a root locus.",
    },
  ],
};
