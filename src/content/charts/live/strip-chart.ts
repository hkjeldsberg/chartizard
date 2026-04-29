import type { LiveChart } from "@/content/chart-schema";

export const stripChart: LiveChart = {
  id: "strip-chart",
  name: "Strip Chart (Recording)",
  family: "change-over-time",
  sectors: ["electrical"],
  dataShapes: ["temporal"],
  tileSize: "M",
  status: "live",
  synopsis:
    "A rolling-paper trace where new samples enter one edge and old ones slide off the other — the native display of the continuous-signal world.",
  whenToUse:
    "Reach for a strip chart when the signal is live and unbounded: ECG in an ICU, altitude in a cockpit, tank level on a DCS, keystrokes on a polygraph. The viewer's job is to watch, not to scrub; you want the most recent window at full width and older data gone. A line chart fits bounded intervals; a strip chart fits an unbroken stream.",
  howToRead:
    "Time is implicit — the paper speed (printed small, here 25 mm/s) is the only calibration. The right edge is 'now'; samples march leftward and drop off. The amplitude axis carries the units; the fine grid gives you a ruler for eyeballing intervals and deflections. On an ECG trace, the eye lands on the R-peak spikes and counts their spacing in grid squares, not seconds.",
  example: {
    title: "Lead-II ECG at 25 mm/s, 0.1 mV per small square",
    description:
      "Elisha Gray's 1888 telautograph established the paper-tape mechanism; Willem Einthoven's 1903 string galvanometer put the first cardiac waveform on one. The clinical grid (1 mm / 0.04 s / 0.1 mV) is unchanged since the 1940s — a bedside monitor in 2026 still reproduces it exactly so a cardiologist trained in 1975 can read it at a glance.",
  },
  elements: [
    {
      selector: "trace",
      label: "Trace",
      explanation:
        "The stylus line — the measured signal over the visible window. On a physical recorder this was ink on paper moving under a pen; on a digital monitor it is pixels rewriting a scrolling buffer. Either way, shape carries the diagnosis: a sharp spike is a QRS, a flat segment is an ST interval, a ripple is fibrillation.",
    },
    {
      selector: "baseline",
      label: "Isoelectric baseline",
      explanation:
        "The 0 mV reference the trace dances around. Drift above or below it is the first clue a lead has come loose or the patient has moved. A stable baseline is the unsung prerequisite for every measurement the chart appears to make.",
    },
    {
      selector: "qrs-complex",
      label: "QRS complex",
      explanation:
        "The tall R-peak flanked by smaller Q and S deflections — the ventricles depolarising. Its height, width, and spacing are read in grid squares: at 25 mm/s and 0.04 s per small square, five squares is 200 ms, and R-to-R spacing gives heart rate. The strip chart's small grid exists to make this counting trivial.",
    },
    {
      selector: "leading-edge",
      label: "Leading edge",
      explanation:
        "The right-hand boundary where new samples enter the window. A strip chart is an infinite-scroll display by construction: the edge does not move; the paper does. Contrast a line chart, where both endpoints are fixed and the viewer sees the whole dataset at once.",
    },
    {
      selector: "amplitude-axis",
      label: "Amplitude axis",
      explanation:
        "The only explicit axis — time is left unlabelled because the paper speed fixes the scale. Always state the unit (mV for ECG, pressure for seismograph, voltage for oscilloscope). An unlabelled y-axis on a strip chart is a tracing, not a measurement.",
    },
    {
      selector: "paper-speed",
      label: "Paper-speed caption",
      explanation:
        "The small 'mm/s' annotation is the chart's time calibration — the contract between the grid and the clock. 25 mm/s is the clinical ECG default; 50 mm/s doubles horizontal resolution for arrhythmia work. Without this caption the horizontal dimension has no meaning.",
    },
  ],
};
