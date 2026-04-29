import type { LiveChart } from "@/content/chart-schema";

export const kaplanMeierCurve: LiveChart = {
  id: "kaplan-meier-curve",
  name: "Kaplan-Meier Curve",
  family: "change-over-time",
  sectors: ["medicine"],
  dataShapes: ["temporal"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Estimates the probability that a patient survives past each follow-up time, drawn as a stepped curve that drops at every event.",
  whenToUse:
    "Use a Kaplan-Meier curve when your endpoint is time-to-event (death, progression, relapse) and some subjects have not yet reached the event. It is the standard tool for comparing survival between two arms of a clinical trial and is what almost every oncology paper means by 'survival curve'.",
  howToRead:
    "Start at 100% on the left. The curve holds flat until a patient dies, then drops one step; the height of the drop reflects the fraction of the remaining cohort that the event claimed. Short vertical ticks on the curve mark censored patients — people who were lost to follow-up or were still alive when the study ended, not deaths. The vertical gap between two arms at any time is the absolute survival difference; a log-rank test summarises the gap across the entire curve, not just at the end.",
  example: {
    title: "CheckMate 067, ten-year overall survival in advanced melanoma",
    description:
      "The New England Journal of Medicine 2022 follow-up of CheckMate 067 plotted three arms — nivolumab plus ipilimumab, nivolumab alone, and ipilimumab alone — on a single K-M panel. The combination curve plateaus near 43% at ten years while the ipilimumab curve slides to 19%; the persistent gap is what turned dual checkpoint blockade from experimental into standard of care.",
  },
  elements: [
    {
      selector: "step-drop",
      label: "Step drop",
      explanation:
        "A single vertical segment where the curve falls. Each drop is one event (usually a death) in the arm; its height is one divided by the number of patients still at risk, so later drops look taller even when a single patient dies.",
    },
    {
      selector: "horizontal-segment",
      label: "Horizontal segment",
      explanation:
        "The flat stretches between drops. Survival is holding — no events have been observed in this arm since the previous drop. Long flat runs late in follow-up are the visual signature of a durable treatment effect.",
    },
    {
      selector: "censor-tick",
      label: "Censor tick",
      explanation:
        "A short vertical tick crossing the curve at a time when a patient was censored: lost to follow-up, withdrew, or was still alive at analysis cut-off. Censoring is not a death — the curve does not drop. Dense ticks near the right edge mean most patients are still being tracked.",
    },
    {
      selector: "curve-gap",
      label: "Curve gap",
      explanation:
        "The vertical distance between two arms at a given time is the absolute survival benefit at that time point. A gap that widens and then stays open is the shape of a treatment that works; a gap that closes is a delayed-but-not-prevented outcome.",
    },
    {
      selector: "y-axis",
      label: "Survival probability",
      explanation:
        "The estimated probability of being event-free, expressed as a proportion from 1.0 down to 0. Start at 1.0 on the left — every patient is alive at randomisation by definition.",
    },
    {
      selector: "x-axis",
      label: "Follow-up time",
      explanation:
        "Time since randomisation, usually in months or years. Read the x-axis in combination with the at-risk numbers most papers print beneath it — the right tail of a K-M curve is unreliable once the at-risk count falls into single digits.",
    },
  ],
};
