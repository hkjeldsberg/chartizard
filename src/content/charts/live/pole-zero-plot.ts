import type { LiveChart } from "@/content/chart-schema";

export const poleZeroPlot: LiveChart = {
  id: "pole-zero-plot",
  name: "Pole-Zero Plot",
  family: "specialty",
  sectors: ["electrical"],
  dataShapes: ["continuous"],
  tileSize: "S",
  status: "live",
  synopsis:
    "Scatter on the complex plane, marking the poles (×) and zeros (○) of a transfer function to reveal the structural stability and frequency-shaping behaviour of a linear system.",
  whenToUse:
    "Use a pole-zero plot when you want to read the *structure* of a transfer function rather than its frequency response. If every pole lies in the left half-plane (Re(s) < 0), the continuous-time system is stable; a single pole in the right half-plane is sufficient for instability. Circuit designers at Bell Laboratories mapped filter transfer functions on the complex plane from the 1930s onward to argue about filter stability without computing a full Bode or Nyquist plot.",
  howToRead:
    "The horizontal axis is the real part σ; the vertical axis is the imaginary part jω. The imaginary axis is the stability boundary for continuous-time systems. Poles (×) are the roots of the denominator polynomial — each left-half-plane pole is a decaying exponential mode; its distance from the origin gives its natural frequency. Zeros (○) are roots of the numerator polynomial — they shape the frequency response by cancelling or amplifying specific frequency components. Complex poles always appear as conjugate pairs (reflected across the real axis).",
  example: {
    title: "Transfer function H(s) = (s + 3) / (s² + 2s + 5) — a single-zero, two-pole system",
    description:
      "The conjugate pole pair at −1 ± 2j lies 2.24 units left of the jω axis, indicating a damped oscillatory mode with natural frequency ωn = √5 ≈ 2.24 rad/s and damping ratio ζ = 1/√5 ≈ 0.45. The zero at −3 shapes the high-frequency magnitude response. Franklin, Powell, and Emami-Naeini use exactly this class of diagram in 'Feedback Control of Dynamic Systems' (1986) to motivate root-locus analysis.",
  },
  elements: [
    {
      selector: "stability-boundary",
      label: "Stability boundary (jω axis)",
      explanation:
        "The imaginary axis is the boundary between stable and unstable modes in continuous-time. A pole exactly on it would produce a sustained oscillation; a pole to the right produces a growing exponential. The left half-plane is the stable zone for all poles.",
    },
    {
      selector: "real-axis",
      label: "Real axis (σ)",
      explanation:
        "The horizontal axis measures how quickly an exponential mode decays (negative σ) or grows (positive σ). A real pole at −a corresponds to a mode e^(−at) that decays with time constant 1/a seconds.",
    },
    {
      selector: "imaginary-axis",
      label: "Imaginary axis (Im)",
      explanation:
        "The vertical axis measures the oscillation frequency of a complex-pole mode. A conjugate pair at σ ± jω₀ produces a damped sinusoid at frequency ω₀ rad/s. The further from the real axis, the faster the oscillation.",
    },
    {
      selector: "conjugate-pair",
      label: "Conjugate pole pair",
      explanation:
        "Complex poles of a real-coefficient transfer function always appear as conjugate pairs reflected across the real axis. The upper and lower × markers here are a single second-order mode. Their distance from the origin is the undamped natural frequency ωn = √5; the angle from the negative real axis encodes damping ratio ζ.",
    },
    {
      selector: "zero-marker",
      label: "Zero",
      explanation:
        "An open circle (○) marks a zero — a root of the numerator polynomial. The system output is zero for an input sinusoid at the imaginary part of a zero on the jω axis. Zeros in the right half-plane (non-minimum-phase zeros) impose fundamental limits on closed-loop bandwidth.",
    },
    {
      selector: "legend",
      label: "Symbol legend",
      explanation:
        "The × glyph for poles and ○ for zeros is the universal convention in control-systems literature, adopted by H. W. Bode and standardised in Truxal's 'Automatic Feedback Control System Synthesis' (1955). Colour is never used to distinguish poles from zeros — shape is the encoding.",
    },
  ],
};
