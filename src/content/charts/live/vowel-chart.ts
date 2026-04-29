import type { LiveChart } from "@/content/chart-schema";

export const vowelChart: LiveChart = {
  id: "vowel-chart",
  name: "Vowel Chart (IPA)",
  family: "specialty",
  sectors: ["linguistics"],
  dataShapes: ["geospatial"],
  tileSize: "S",
  status: "live",

  synopsis:
    "Plots spoken vowels in a 2D space defined by tongue position — front-to-back on the x-axis, close-to-open on the y-axis — using acoustic formant frequencies as coordinates.",

  whenToUse:
    "Use a vowel chart when comparing how a language (or a learner, or a dialect) organises its vowel inventory relative to the IPA's cardinal reference points. It is the standard diagnostic in phonetics, speech-language pathology, and second-language acquisition research. The chart answers the question of where a vowel sits in articulatory space, not how often it occurs or how it changes over time.",

  howToRead:
    "Both axes are reversed relative to convention. The x-axis shows F2 frequency — the second formant tracks tongue backness, with higher values meaning fronter vowels, so front is left. The y-axis shows F1 — the first formant tracks tongue height inversely, with higher F1 meaning lower tongue (more open vowel), so close is top. The IPA trapezoid outlines the corners of the vowel space. Filled dots are rounded vowels; open dots are unrounded. Dashed lines connect rounded/unrounded pairs at the same height and backness.",

  example: {
    title: "Daniel Jones's cardinal vowels, 1917 — the reference system",
    description:
      "Jones defined eight primary cardinal vowels (CV1–CV8) as anchor points spaced evenly around the periphery of the articulatory space. Every phonetics textbook plots a language's vowels against these cardinals to show compression, merger, or expansion of the inventory. English RP has roughly 12 distinct vowel phonemes; Hawaiian has five; some languages in the Pacific Northwest have three.",
  },

  elements: [
    {
      selector: "quadrilateral",
      label: "Vowel quadrilateral",
      explanation:
        "The dashed trapezoid outlines the anatomical limits of vowel articulation: the top-left corner is the closest front position (/i/), the bottom-left is the most open front (/a/), the bottom-right is the most open back (/ɑ/), and the top-right is the closest back (/ɯ/). The shape is a quadrilateral rather than a rectangle because the back vowels are anatomically constrained to a narrower range than the front.",
    },
    {
      selector: "rounded-pairs",
      label: "Rounded/unrounded pairs",
      explanation:
        "Each dashed line connects a rounded and an unrounded vowel at the same height and backness. The IPA groups these as minimal pairs differing only in lip rounding — /i/ (spread) and /y/ (rounded); /u/ (rounded) and /ɯ/ (unspread). French, German, and Mandarin use front-rounded vowels (/y/, /ø/, /œ/) that English lacks entirely.",
    },
    {
      selector: "vowel-glyphs",
      label: "Vowel symbols",
      explanation:
        "Each symbol is the IPA character for that vowel, placed at its canonical formant coordinates. Rounded vowels (filled dots) sit slightly inward from their unrounded partners because lip rounding lowers F2 by lengthening the front cavity. The schwa /ə/ sits at the centre, the default position of the tongue at rest.",
    },
    {
      selector: "x-axis",
      label: "F2 axis (backness)",
      explanation:
        "F2 frequency — the second formant — encodes tongue backness. High F2 (left side of the chart) means the tongue is bunched forward; low F2 (right) means the tongue is retracted toward the velum. The axis is reversed so front vowels appear on the left, matching the phonetic convention of every IPA chart since 1949.",
    },
    {
      selector: "y-axis",
      label: "F1 axis (height)",
      explanation:
        "F1 frequency — the first formant — encodes vowel height inversely: a high tongue constricts the oral cavity and lowers F1. The axis is reversed so close (high-tongue) vowels appear at the top, again matching the IPA convention. The reversal of both axes is the chart's most common source of confusion for newcomers.",
    },
    {
      selector: "legend",
      label: "Rounding legend",
      explanation:
        "Lip rounding is a binary articulatory feature that cannot be inferred from F1/F2 position alone — a filled dot encodes it as a secondary dimension. Without this convention, /u/ and /ɯ/ would be indistinguishable on the chart despite being distinct phonemes in Turkish and other languages.",
    },
  ],
};
