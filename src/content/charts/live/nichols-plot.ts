import type { LiveChart } from "@/content/chart-schema";

export const nicholsPlot: LiveChart = {
  id: "nichols-plot",
  name: "Nichols Plot",
  family: "specialty",
  sectors: ["electrical"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Open-loop frequency response plotted as phase on x against magnitude (dB) on y — stability margins read off the single curve as distances from one fixed point.",
  whenToUse:
    "Reach for a Nichols chart whenever a feedback control system needs its gain and phase margins inspected at a glance. Unlike a Nyquist plot — which is polar and forces you to read angles from the origin — Nichols flattens the same information onto cartesian axes, so you measure dB with a ruler and degrees with a protractor. It is the working chart of choice for classical loop-shaping in aerospace and process control, where designers deliberately drag the response curve away from the (−180°, 0 dB) point to guarantee robustness.",
  howToRead:
    "The horizontal axis is open-loop phase ∠G(jω), running from 0° on the right to −270° on the left. The vertical axis is open-loop magnitude |G(jω)| in decibels. A single curve, parameterised by frequency ω, sweeps from upper-right (low ω, phase near −90°, gain high) toward lower-left (high ω, phase lagging further, gain rolling off). The critical point sits at (−180°, 0 dB): the gain margin is the vertical gap between the curve and 0 dB at −180°; the phase margin is the horizontal gap between the curve and −180° at 0 dB. Faint background contours are M-circles — loci of constant closed-loop magnitude — which let you read the closed-loop peak without solving 1 + G = 0.",
  example: {
    title: "Nathaniel Nichols, MIT Radiation Lab, 1947",
    description:
      "Nathaniel B. Nichols developed the chart at the MIT Radiation Laboratory during the wartime gunfire-control programme, and published it in volume 25 of the Rad Lab series (Theory of Servomechanisms, James–Nichols–Phillips, 1947). It is the love-child of Nyquist's polar plot and Bode's split magnitude-and-phase diagrams: Nyquist shows stability but hides margin numbers behind complex-plane geometry, Bode hands you the margins on two separate charts, Nichols gives you both on one. Sixty years on it remains the standard tool when an aerospace control engineer wants to see, in one glance, how far a loop-shaping compensator has pushed a flight-control system away from instability.",
  },
  elements: [
    {
      selector: "open-loop-curve",
      label: "Open-loop curve G(jω)",
      explanation:
        "A single curve parameterised by frequency ω. Each point carries two coordinates: the open-loop phase (x) and open-loop magnitude in dB (y) at that ω. Low frequencies sit upper-right (high gain, small phase lag); high frequencies roll off into the lower-left. The shape of the curve — not any single point — is what tells you whether the closed loop will oscillate.",
    },
    {
      selector: "critical-point",
      label: "Critical point (−180°, 0 dB)",
      explanation:
        "The single fixed point that Nyquist's stability criterion cares about. In the open-loop (phase, dB) plane it is (−180°, 0 dB), i.e. |G| = 1 with a full phase inversion — exactly the condition 1 + G(jω) = 0 that makes the closed loop blow up. Every stability margin on this chart is a distance from this point.",
    },
    {
      selector: "gain-margin",
      label: "Gain margin",
      explanation:
        "Drop a vertical line from the critical point down (or up) to where the curve crosses the −180° phase line. The length of that segment in dB is the gain margin: how much extra loop gain the system can tolerate before it starts oscillating. A healthy controller typically keeps gain margin above 6 dB.",
    },
    {
      selector: "phase-margin",
      label: "Phase margin",
      explanation:
        "Walk horizontally from the critical point until you hit the curve at 0 dB. The angle you covered — measured from −180° — is the phase margin: the extra phase lag the loop can absorb (due to a delay, a sensor lag, a missed sample) before becoming unstable. 45° is comfortable; below 30° the closed-loop step response rings.",
    },
    {
      selector: "m-circles",
      label: "M-circles (closed-loop magnitude contours)",
      explanation:
        "Faint contours of constant |G/(1+G)| — the closed-loop magnitude. They map the transcendental feedback equation onto geometry: pass the open-loop curve near a +3 dB contour and the closed loop will peak at +3 dB, a classic sign of under-damping. The M-circles are what make Nichols a design tool, not just a stability checker.",
    },
    {
      selector: "x-axis",
      label: "Phase axis",
      explanation:
        "Open-loop phase in degrees, conventionally drawn from 0° at the right to −270° or −360° at the left. The axis is not periodic on this chart: a curve that wraps past −360° is redrawn as a second branch, not connected back to the first.",
    },
    {
      selector: "y-axis",
      label: "Magnitude axis (dB)",
      explanation:
        "Open-loop magnitude on a decibel scale: |G|dB = 20 log10 |G|. A decade of amplitude is 20 dB; 0 dB is unity gain. Decibels turn the multiplicative composition of transfer functions into addition, which is why every classical-control chart (Bode, Nichols) uses them.",
    },
  ],
};
