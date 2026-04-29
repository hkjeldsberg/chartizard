import type { LiveChart } from "@/content/chart-schema";

export const waterfallPlotSignal: LiveChart = {
  id: "waterfall-plot-signal",
  name: "Waterfall Plot (Signal)",
  family: "specialty",
  sectors: ["electrical"],
  dataShapes: ["temporal"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Stacks successive amplitude-vs-frequency spectra with a vertical time offset so the evolution of a signal's spectrum reads as a downward flow.",
  whenToUse:
    "Reach for a waterfall when the data is the same STFT that feeds a spectrogram but the audience needs to read individual spectral shapes, not colour intensity. RF operators, radio-telescope observers, and vibration-analysis engineers prefer it because every trace is a recognisable curve — they read peak shapes, side-lobe structure, and ringing that a heatmap collapses into a blob.",
  howToRead:
    "Each horizontal trace is one time slice's power spectrum — frequency on the x-axis, amplitude as the vertical excursion above its own baseline. Baselines are offset by a fixed increment so adjacent traces do not overlap where amplitude is small. Traces are drawn back-to-front with a background-coloured fill under each line; when a later trace's peak is tall enough to reach into an earlier trace's territory, the fill occludes what is behind — that is the hidden-surface-removal primitive that makes a 3D stack readable on a 2D page. Peaks migrating across traces are the primary signal; short-lived events appear as a lump confined to two or three adjacent traces.",
  example: {
    title: "Hewlett-Packard 3582A spectrum analyser, 1978",
    description:
      "Laboratory RF instruments from the 1960s and 1970s drew waterfalls on storage CRTs in real time — new sweeps pushed older ones downward, and the persistent phosphor gave the display its name. The HP 3582A was one of the first digital FFT analysers to ship a built-in waterfall mode; operators used it to watch a transmitter's sidebands evolve as they tuned a filter, reading the shape of each trace for side-lobe suppression in a way the later spectrogram heatmap cannot show. This chart is strictly distinct from the finance waterfall-chart (running-total accumulative bars) — the name is shared, the visualisation is not.",
  },
  elements: [
    {
      selector: "trace",
      label: "Trace",
      explanation:
        "One horizontal line is the power spectrum for a single time slice — amplitude as a function of frequency, the same quantity a spectrum analyser's screen shows for one sweep. Everything this chart does is a consequence of stacking these traces.",
    },
    {
      selector: "migrating-peak",
      label: "Migrating peak",
      explanation:
        "The dashed line tracks each trace's peak across time. A peak sliding to the right over successive traces is a rising-frequency chirp; a peak sliding left is a down-chirp. This migration is the headline pattern the layout is built to expose — the same feature the sibling spectrogram paints as a diagonal bright stripe.",
    },
    {
      selector: "vertical-offset",
      label: "Vertical offset",
      explanation:
        "Adjacent baselines are separated by a fixed increment. The offset is not a quantitative scale — it only has to be large enough that quiet frequency regions do not overlap. Too small and traces tangle; too large and the stack wastes vertical space.",
    },
    {
      selector: "hidden-surface",
      label: "Hidden-surface fill",
      explanation:
        "Every trace paints a background-coloured polygon down to its own baseline. When a front trace's amplitude reaches into a back trace's space, the fill hides the occluded line segment. This is the painter's-algorithm trick 3D plotting libraries (Matlab's mesh, gnuplot's hidden3d) have used since the 1980s to make a stack legible on a flat page.",
    },
    {
      selector: "burst",
      label: "Burst",
      explanation:
        "A short-lived narrowband event shows up as a lump confined to two or three adjacent traces near ~2.5 kHz — the same burst the sibling spectrogram displays as a compact bright blob. The chart's time resolution is the trace spacing; anything briefer than one hop blurs into a single trace.",
    },
    {
      selector: "x-axis",
      label: "X-axis (frequency)",
      explanation:
        "Shared across every trace — that is what makes cross-trace comparison possible. The axis is usually linear in Hz for RF work, log for audio, or cycles-per-sample for DSP notebooks.",
    },
    {
      selector: "y-axis",
      label: "Y-axis (time with offsets)",
      explanation:
        "The y-axis is not a single scale. It combines two things: the ordinal position of each trace (time slice) and that trace's amplitude excursion above its baseline. Earlier spectra sit toward the top, later spectra flow downward — the direction that gives the plot its name.",
    },
  ],
};
