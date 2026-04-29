import type { LiveChart } from "@/content/chart-schema";

export const spectrogram: LiveChart = {
  id: "spectrogram",
  name: "Spectrogram",
  family: "distribution",
  sectors: ["electrical"],
  dataShapes: ["temporal"],
  tileSize: "W",
  status: "live",
  synopsis:
    "A 2D heatmap of time versus frequency, with colour encoding power spectral density at each (t, f) cell.",
  whenToUse:
    "Use a spectrogram when a signal's frequency content changes over time and a single average spectrum would hide the story. It is the standard display for speech, bird-song, sonar, radar waterfalls, seismic events, and gravitational-wave candidate searches.",
  howToRead:
    "Read the x-axis as time and the y-axis as frequency. Colour at each cell is the power in that frequency bin during that time slice, on a log scale. Bright horizontal stripes are sustained tones; bright diagonals are frequency sweeps (a rising diagonal is a chirp); compact bright blobs are short-lived transients. Dark regions are quiet. Narrow vertical bands mean broadband energy at a single instant; narrow horizontal bands mean a steady pure tone.",
  example: {
    title: "LIGO GW150914 — the first detected gravitational-wave event",
    description:
      "On 14 September 2015 the two LIGO detectors recorded a chirp lasting ~200 ms that rose from roughly 35 Hz to 250 Hz. LIGO's public announcement paper (Abbott et al., PRL 116, 061102, 2016) led with spectrograms of the H1 and L1 strain channels — the rising diagonal in the time-frequency plane is the visual signature of two black holes spiralling in and merging. The waveform plot by itself is ambiguous noise; the spectrogram is what turned it into a detection.",
  },
  elements: [
    {
      selector: "signal-peak",
      label: "Signal peak cell",
      explanation:
        "One high-power cell on the chirp ridge. Each cell is one column of the Short-Time Fourier Transform (STFT) — a windowed FFT taken over a slice of the signal, squared to give |X(t, f)|². Colour is mapped log-scale because audio and radio power routinely span 60 dB.",
    },
    {
      selector: "chirp",
      label: "Chirp (linearly-rising signal)",
      explanation:
        "Power concentrated along f(t) = 200 + 1800·t — a linear frequency sweep from 200 Hz up to 3.8 kHz over two seconds. Bird-song syllables, radar LFM pulses, whale calls, and inspiralling compact binaries all render as diagonal ridges in a spectrogram. The slope of the ridge is the sweep rate in Hz per second.",
    },
    {
      selector: "burst",
      label: "Narrowband burst",
      explanation:
        "A short, localised blob at ~1.0 s, ~2.5 kHz — roughly 200 ms wide in time and 200 Hz wide in frequency. The Heisenberg–Gabor uncertainty Δt·Δf ≥ 1/4π is directly readable here: a narrower STFT window buys you tighter time resolution at the cost of smearing the blob out in frequency, and vice versa. You cannot localise a signal arbitrarily well in both axes.",
    },
    {
      selector: "background",
      label: "Background (low power)",
      explanation:
        "Cells near the bottom of the colour ramp are the noise floor — the signal's ambient level in bins where nothing interesting is happening. Anything brighter than this floor is either real signal or a processing artefact (window side-lobes, spectral leakage).",
    },
    {
      selector: "x-axis",
      label: "X-axis (time)",
      explanation:
        "Time increases left to right, one tick per STFT window hop. Window length controls time resolution: shorter windows give sharper time localisation but coarser frequency bins. The number of time bins is the signal length divided by the hop size.",
    },
    {
      selector: "y-axis",
      label: "Y-axis (frequency)",
      explanation:
        "Frequency increases upward, from 0 Hz (DC) up to Nyquist (here 4 kHz). Bin count equals half the FFT length; bin width is the sample rate divided by FFT length. Audio spectrograms often use a log frequency axis to match human hearing; this one uses linear Hz.",
    },
    {
      selector: "colour-scale",
      label: "Colour scale",
      explanation:
        "Colour encodes log-power, viridis ramp from dark purple (quiet) to yellow (loud). Viridis is perceptually uniform and colour-blind safe — introduced in matplotlib 1.5 (2015) as the replacement for the older jet colormap, which exaggerates mid-range contrast and flattens extremes. A spectrogram is read by the colour, so the choice of ramp is not cosmetic.",
    },
  ],
};
