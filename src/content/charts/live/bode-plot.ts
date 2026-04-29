import type { LiveChart } from "@/content/chart-schema";

export const bodePlot: LiveChart = {
  id: "bode-plot",
  name: "Bode Plot",
  family: "specialty",
  sectors: ["electrical"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Two stacked log-frequency panels — magnitude in dB and phase in degrees — that together characterise the frequency response of an open-loop control system.",
  whenToUse:
    "Use a Bode plot when analysing or designing a linear time-invariant control system in the frequency domain. The two-panel format gives you gain margin and phase margin simultaneously, the two stability indicators every classical control designer reads before closing the loop. Bode's 1945 paper at Bell Laboratories introduced this form as the practitioner complement to Nyquist's polar diagram.",
  howToRead:
    "The top panel shows gain: a flat region is a passband, each pole drops the slope by −20 dB/decade, each zero raises it by +20 dB/decade. A second-order resonant pair produces a sharp peak near the natural frequency ωn. The bottom panel shows phase lag; −180° is the instability boundary. Gain margin is the dB distance from 0 dB at the phase-crossover frequency ω_pc; phase margin is the degree distance from −180° at the gain-crossover frequency ω_gc. Both must be positive for a stable closed loop.",
  example: {
    title: "Open-loop transfer function of an attitude-control thruster, ζ = 0.15, ωn = 10 rad/s",
    description:
      "A lightly-damped second-order plant (ζ = 0.15) produces an 18 dB resonant peak near 10 rad/s — visible in the top panel as a spike well above the 0 dB line. The phase reaches −180° at approximately 150 rad/s, giving a gain margin near 16 dB. Ogata's 'Modern Control Engineering' (1970) uses exactly this class of plant to show how adding derivative action shifts the gain crossover to a safer frequency.",
  },
  elements: [
    {
      selector: "magnitude-panel",
      label: "Magnitude panel",
      explanation:
        "The upper panel plots 20·log₁₀|G(jω)| against angular frequency on a logarithmic x-axis. Slope breaks of ±20 dB per decade mark every pole and zero of the transfer function. Above 0 dB the system amplifies; below it attenuates.",
    },
    {
      selector: "resonant-peak",
      label: "Resonant peak",
      explanation:
        "For a lightly-damped second-order system the magnitude peaks sharply near ω = ωn. Peak height grows as damping ratio ζ falls; at ζ = 0 it would be infinite. Hendrik Bode showed that this peak is the frequency-domain signature of a near-unstable mode.",
    },
    {
      selector: "gain-margin",
      label: "Gain margin",
      explanation:
        "Gain margin is measured in the top panel at the phase-crossover frequency ω_pc — the frequency where phase equals −180°. It is the additional open-loop gain (in dB) that would push the closed loop to instability. A positive gain margin means the system is stable.",
    },
    {
      selector: "asymptote",
      label: "High-frequency asymptote",
      explanation:
        "Above the natural frequency, a second-order system rolls off at −40 dB per decade. This straight-line asymptote is the 'Bode approximation': on log–log axes, transfer-function poles and zeros produce piecewise-linear magnitude plots, which Bode exploited to sketch frequency responses by hand.",
    },
    {
      selector: "phase-panel",
      label: "Phase panel",
      explanation:
        "The lower panel shows the phase angle of G(jω) in degrees. For a stable second-order system it falls from 0° at low frequencies toward −180° at high frequencies. The two panels share the same log-frequency x-axis, so gain and phase at any given ω align vertically.",
    },
    {
      selector: "phase-margin",
      label: "Phase margin",
      explanation:
        "Phase margin is measured in the bottom panel at the gain-crossover frequency ω_gc — the frequency where magnitude equals 0 dB. It is the additional phase lag that would place the phase at exactly −180°, driving the closed loop to marginal oscillation. Classical design targets 30°–60°.",
    },
  ],
};
