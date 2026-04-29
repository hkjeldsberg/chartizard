import type { LiveChart } from "@/content/chart-schema";

export const eyeDiagram: LiveChart = {
  id: "eye-diagram",
  name: "Eye Diagram",
  family: "specialty",
  sectors: ["electrical"],
  dataShapes: ["temporal"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Superimposes hundreds of NRZ signal traces to reveal timing and amplitude margins as the characteristic open eye shape.",
  whenToUse:
    "Use an eye diagram when you need to characterise a digital serial link's physical-layer health. It is the canonical pass/fail test for IEEE 802.3 Ethernet optical interfaces and ITU-T G.957 SONET/SDH optical sections. Any bandwidth-limited channel — PCIe, USB, DDR memory, coaxial cable — whose intersymbol interference or jitter budget is in question calls for this chart.",
  howToRead:
    "The x-axis spans exactly two unit intervals (UI); one UI is one symbol period. The y-axis is normalised voltage, with +1 and -1 as the ideal rail levels. All traces are overlaid at low opacity: where they agree (the rails and the eye centre), the image is darkest; where they spread (the transition zone), it fades. The vertical opening at the centre — eye height — measures the noise margin. The horizontal opening at the decision threshold — eye width — measures the timing margin. The dashed rectangle is the compliance mask from ITU-T G.957 or IEEE 802.3: any trace entering the mask means the link fails the standard.",
  example: {
    title: "100GBASE-LR4 optical transceiver qualification, 2023",
    description:
      "At a 25 Gbaud NRZ lane rate, a 1-dB chromatic dispersion penalty at 1310 nm closes the eye by roughly 0.15 UI horizontally. Test engineers overlay 10,000 UI captures on a sampling oscilloscope to measure mask margin; a transceiver that passes the IEEE 802.3ba mask at 8 dB optical modulation amplitude is cleared for 10 km SMF spans.",
  },
  elements: [
    {
      selector: "eye-opening",
      label: "Eye opening",
      explanation:
        "The central clear region bounded by the envelope of all traces. A wide, tall opening means low intersymbol interference (ISI) and low noise — the receiver can sample the signal reliably. Eye closure is the primary symptom of a bandwidth-limited channel or a signal with excess jitter.",
    },
    {
      selector: "trace-overlay",
      label: "Overlaid trace",
      explanation:
        "Each semi-transparent polyline is one 2-UI capture of the NRZ PAM-2 waveform. The overlay of ~200 traces (stroke-opacity ≈ 0.12) forms the eye pattern by superposition: dark regions show where the signal spends most of its time; faint regions show rare or transient excursions. A raised-cosine pulse shape models the bandwidth-limited response of a typical optical front-end.",
    },
    {
      selector: "eye-mask",
      label: "Eye mask (compliance region)",
      explanation:
        "The dashed rectangle defines the forbidden zone per ITU-T G.957 (SONET/SDH optical sections) or IEEE 802.3 (Ethernet physical layers). If any trace enters the mask, the link fails the standard. Mask margin — the gap between the innermost trace and the mask boundary — is the headline compliance metric reported by oscilloscope software.",
    },
    {
      selector: "eye-height",
      label: "Eye height",
      explanation:
        "The vertical opening measured at the centre of the UI (t = 1). It represents the voltage margin available to the comparator before noise causes a bit error. In a Gaussian noise model, eye height divided by the RMS noise floor estimates the BER floor before forward-error correction.",
    },
    {
      selector: "eye-width",
      label: "Eye width",
      explanation:
        "The horizontal opening measured at the decision threshold (y = 0). It quantifies the timing margin: how far the sampling clock edge can drift from the centre of the eye before the sampled voltage becomes ambiguous. IEEE 802.3 specifies minimum eye width in UI as part of the transmitter eye mask.",
    },
    {
      selector: "decision-threshold",
      label: "Decision threshold",
      explanation:
        "The horizontal dashed line at y = 0 is the voltage at which the receiver comparator switches its output from 0 to 1. For ideal PAM-2 NRZ, this midpoint threshold minimises the bit-error rate (BER) when noise is symmetric. In practice, DC-offset, driver non-linearity, or optical modulation asymmetry shifts the optimal threshold.",
    },
    {
      selector: "x-axis",
      label: "X-axis (time in unit intervals)",
      explanation:
        "The x-axis spans two unit intervals. A unit interval equals one symbol period: at 10 Gbaud, 1 UI = 100 ps. Displaying exactly 2 UI shows one full transition — from bit N to bit N+1 — and the beginning of the next, which is enough to capture transition density and jitter characteristics.",
    },
  ],
};
