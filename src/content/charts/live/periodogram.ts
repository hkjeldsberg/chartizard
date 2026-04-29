import type { LiveChart } from "@/content/chart-schema";

export const periodogram: LiveChart = {
  id: "periodogram",
  name: "Periodogram",
  family: "distribution",
  sectors: ["electrical"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Squared magnitude of the discrete Fourier transform of a finite-length signal, plotted against frequency — the raw, unsmoothed estimate of the signal's power spectral density.",
  whenToUse:
    "Reach for a periodogram when you suspect a time series carries a hidden periodic component and you want to see at which frequency the energy actually concentrates. It is the starting point of every spectral analysis: tone detection, seasonal decomposition, diagnosis of aliasing, sanity-checking a sampling rate. Arthur Schuster coined the term in 1898 (On the investigation of hidden periodicities with application to a supposed 26-day period of meteorological phenomena, Terrestrial Magnetism 3(1)) while hunting for solar-activity cycles in magnetic-field records.",
  howToRead:
    "The x-axis is frequency, usually in cycles per sample interval and running from 0 to the Nyquist limit of 0.5. The y-axis is |X(f_k)|² — the squared magnitude of the DFT coefficient at the k-th frequency bin, optionally divided by N. A pure sinusoid in the input produces a tall, narrow spike at its frequency; broadband noise produces a flat, rattling carpet of low values (the noise floor). Two peaks at f and 2f indicate a fundamental plus a harmonic; a peak at 0 means the signal has a non-zero mean. The raw periodogram is noisy: its variance does not shrink as you add samples, which is why Welch (1967) averages overlapping windowed periodograms in practice. By the Wiener–Khinchin theorem the periodogram is the Fourier transform of the autocorrelation function — the same structure, one domain over.",
  example: {
    title: "Synthetic monthly series with a 12-month cycle plus a 6-month harmonic",
    description:
      "A 240-sample signal x(n) = 1.0·cos(2πn/12) + 0.5·cos(2πn/6 + 0.3) + N(0, 0.3) — 20 years of monthly observations carrying an annual cycle, a semi-annual harmonic, and mild Gaussian noise. The periodogram shows two clean spikes at f = 1/12 ≈ 0.083 and f = 1/6 ≈ 0.167 cycles/month, each rising well above a flat noise carpet. This is the structure Schuster was hunting in 1898: a peak that cannot be explained away as a random fluctuation of the noise floor is evidence of a real period.",
  },
  elements: [
    {
      selector: "fundamental-peak",
      label: "Fundamental peak",
      explanation:
        "The tallest spike sits at the signal's dominant frequency — here f = 1/12 cycles/month, the annual cycle. A pure sinusoid of amplitude A embedded in N samples contributes ≈ A²·N/4 to the periodogram bin nearest its frequency. Peak width is determined by the record length N, not by the signal.",
    },
    {
      selector: "harmonic-peak",
      label: "Harmonic peak",
      explanation:
        "A second spike at f = 1/6 — twice the fundamental frequency — is the second harmonic. Its height is proportional to its amplitude squared, so the 0.5-amplitude harmonic peak is roughly a quarter of the fundamental peak. Harmonic structure in the periodogram is how non-sinusoidal periodic signals (square waves, pulse trains) announce themselves.",
    },
    {
      selector: "noise-floor",
      label: "Noise floor",
      explanation:
        "The flat carpet of low-power bins is the contribution of the additive Gaussian noise term. Its expected level is σ² for unit-variance noise under the |X|²/N normalisation used here. Peaks must rise substantially above this floor to be counted as real; Schuster's 1898 paper is the origin of that significance test.",
    },
    {
      selector: "stem",
      label: "Spectral bin",
      explanation:
        "Each vertical stem with a bubble at the tip is one DFT coefficient, evaluated at f_k = k/N for k = 0, 1, …, N/2. The discrete stem layout — rather than a connected line — makes the grid of frequency bins explicit; the resolution between bins is Δf = 1/N and cannot be improved without taking a longer record.",
    },
    {
      selector: "x-axis",
      label: "Frequency axis",
      explanation:
        "Frequency runs from 0 (DC) to the Nyquist limit of 0.5 cycles per sample interval. A signal sampled monthly therefore resolves periods between 2 months (at Nyquist) and N months (at the lowest non-zero bin). Anything oscillating faster than Nyquist aliases back into the displayed band.",
    },
    {
      selector: "y-axis",
      label: "Power axis |X(f)|²",
      explanation:
        "The vertical axis is squared DFT magnitude — units of signal² per frequency bin. It is often drawn on a logarithmic (decibel) scale to make both the tall peaks and the shallow noise floor legible; the linear scale used here is faithful to Schuster's original form. The periodogram is an asymptotically unbiased but inconsistent estimator of the true power spectral density.",
    },
  ],
};
