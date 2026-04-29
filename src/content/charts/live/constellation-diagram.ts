import type { LiveChart } from "@/content/chart-schema";

export const constellationDiagram: LiveChart = {
  id: "constellation-diagram",
  name: "Constellation Diagram",
  family: "specialty",
  sectors: ["electrical"],
  dataShapes: ["continuous"],
  tileSize: "M",
  status: "live",
  synopsis:
    "Plots received I-Q symbols on the complex plane to reveal noise margins, phase errors, and modulation quality in digital wireless and optical links.",
  whenToUse:
    "Use a constellation diagram when you need to diagnose the physical-layer quality of a digitally modulated radio, optical, or cable link. It is standard practice in 5G NR base-station alignment (3GPP TS 38.101), DVB-S2 satellite modem commissioning, and cable modem DOCSIS 3.1 certification. Any time you need to decompose a modulation-quality failure into its noise, phase, and quadrature-error components, a constellation is the right tool.",
  howToRead:
    "The horizontal axis is I (in-phase component) and the vertical axis is Q (quadrature component). Each plotted point is one received symbol. In 16-QAM the 16 ideal symbol positions form a 4×4 square grid; around each ideal point, received symbols scatter into a cloud whose radius reflects the channel noise power. The dashed lines are decision boundaries: a received symbol is decoded as whichever ideal point lies nearest, using minimum Euclidean distance. When clouds overlap a boundary, symbol errors occur. Dense constellations (64-QAM, 256-QAM) pack more bits per symbol but shrink the inter-point distance, requiring higher SNR to keep the clouds from crossing boundaries — the Shannon-Hartley theorem (1948) sets the absolute capacity ceiling.",
  example: {
    title: "5G NR mmWave 256-QAM gNB commissioning, 3GPP Rel-17",
    description:
      "At 28 GHz with 100 MHz channel bandwidth, a 256-QAM downlink requires an EVM (error vector magnitude) below 3.5% per 3GPP TS 38.104. Engineers plot the constellation after each power-amplifier linearisation step; a cloud that shrinks toward a tight diamond around each of the 256 ideal points confirms that the digital pre-distortion has converged and the transmitter meets the EVM mask.",
  },
  elements: [
    {
      selector: "i-axis",
      label: "I axis (in-phase)",
      explanation:
        "The horizontal axis carries the in-phase component of the baseband complex signal. In quadrature amplitude modulation, I and Q are modulated independently on two carrier phases 90° apart. The I-axis value is what the receiver recovers by multiplying the passband signal by cos(2πf₀t) and low-pass filtering.",
    },
    {
      selector: "q-axis",
      label: "Q axis (quadrature)",
      explanation:
        "The vertical axis carries the quadrature component, recovered by multiplication with sin(2πf₀t). Because sin and cos are orthogonal, I and Q carry independent information streams on the same carrier frequency, doubling spectral efficiency compared to a single-axis modulation such as OOK.",
    },
    {
      selector: "ideal-point",
      label: "Ideal constellation point",
      explanation:
        "Each cross marks one of the 16 ideal symbol positions in 16-QAM. Position encodes a 4-bit symbol (2 bits for I, 2 bits for Q); in Grey coding, adjacent points differ by exactly one bit so a nearest-neighbour decision error costs only one bit. The points form a square grid at normalised coordinates ±1, ±3.",
    },
    {
      selector: "received-cloud",
      label: "Received-sample cloud",
      explanation:
        "The scatter of dots around each ideal point represents received symbols corrupted by additive white Gaussian noise (AWGN) and other impairments. Cloud radius is proportional to noise power. EVM (error vector magnitude) — the RMS distance from received points to ideal points, expressed as a percentage of the average symbol power — is the headline metric extracted from this cloud.",
    },
    {
      selector: "decision-boundary",
      label: "Decision boundary",
      explanation:
        "The dashed lines bisect the distance between adjacent ideal points. The receiver assigns each received symbol to the nearest ideal point, implementing maximum-likelihood detection under AWGN. Symbol errors occur when a received point crosses a boundary into an adjacent decision region.",
    },
    {
      selector: "min-distance",
      label: "Minimum Euclidean distance (d_min)",
      explanation:
        "The bracket between adjacent ideal points marks d_min, the smallest distance between any two constellation points. All error-rate analysis in coded and uncoded QAM systems reduces to a function of d_min normalised by noise variance (Eb/N₀). Halving d_min by doubling constellation density costs approximately 6 dB in required SNR to maintain the same BER.",
    },
    {
      selector: "bits-per-symbol",
      label: "4 bits per symbol (spectral efficiency)",
      explanation:
        "16-QAM maps 4 bits per symbol: log₂(16) = 4. At a 100 Msymbols/s symbol rate, this gives a raw bit rate of 400 Mbit/s before coding overhead. The Shannon-Hartley theorem (1948, C = B·log₂(1 + S/N)) caps the maximum rate for a given bandwidth and SNR, and 16-QAM operates within a few dB of the Shannon limit at practical SNR values.",
    },
  ],
};
