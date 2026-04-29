import type { LiveChart } from "@/content/chart-schema";

export const natalChart: LiveChart = {
  id: "natal-chart",
  name: "Natal Chart",
  family: "specialty",
  sectors: ["astrology"],
  dataShapes: ["geospatial"],
  tileSize: "M",
  status: "live",
  synopsis:
    "A circular diagram of the sky at a moment of birth: twelve zodiac signs on the outer band, twelve houses counter-clockwise from the Ascendant, ten planets placed by ecliptic longitude, and aspect lines stitching the geometry together.",
  whenToUse:
    "A natal chart is the standard visualisation of Hellenistic and modern Western astrology; it belongs in anthropological, cultural-history, and popular-psychology contexts where the question is what the chart represents as a tradition, not whether it predicts anything. It is not a forecasting tool. Chartizard documents the visual grammar so a reader can recognise one when they meet it — on Co-Star, in a natal-chart column, in a museum vitrine of Ptolemy's Tetrabiblos.",
  howToRead:
    "Read the wheel from the outside in. The outer band is the zodiac: twelve 30° arcs fixed to the ecliptic, beginning at Aries. Inside that sits the twelve-house band, which rotates with each chart: by convention the first house begins at the Ascendant, drawn at the 9 o'clock position, and house numbers increase counter-clockwise. Planet glyphs are placed at their ecliptic longitudes at the moment of birth, with a small tick on the house ring marking each planet's exact degree. Lines across the inner disc connect pairs of planets at canonical separations — 0° conjunction, 60° sextile, 90° square, 120° trine, 180° opposition — within a few degrees of tolerance. The shape those lines form is what astrologers read; what a visualisation-literate viewer should take away is that the chart is a coordinate system, not a measurement.",
  example: {
    title: "Claude Monet, born 14 November 1840, Paris, 06:00 LMT",
    description:
      "Monet's chart is rendered here in equal-house division from an Ascendant near Scorpio: Sun and Mercury cluster in Scorpio in the first house, a Cancer Moon sits in the eighth, Mars in Leo opposes Saturn in Aquarius, and Jupiter and Neptune conjunct in Capricorn. Whether those placements say anything about Impression, Sunrise is a separate question; what the chart does, visually, is compress a birth moment into a fixed grammar that every astrological tradition from Hellenistic Alexandria to modern Goop still agrees on.",
  },
  elements: [
    {
      selector: "zodiac",
      label: "Zodiac band",
      explanation:
        "The outer ring. Twelve signs of thirty degrees each, fixed to the tropical ecliptic and beginning at the vernal equinox point (Aries 0°). The band is the chart's celestial reference frame and does not rotate from chart to chart — only the houses and the planets inside do.",
    },
    {
      selector: "house",
      label: "House",
      explanation:
        "A thirty-degree wedge of the inner ring. Houses number counter-clockwise from the Ascendant at the 9 o'clock position, which is always house I. Equal-house division (used here) gives every house exactly 30°; other systems — Placidus, Koch, Whole-Sign — produce unequal wedges, but the numbering convention is the same. Each house is traditionally associated with a domain of life; read that association as a cultural convention, not a physical claim.",
    },
    {
      selector: "ascendant",
      label: "Ascendant",
      explanation:
        "The degree of the ecliptic rising on the eastern horizon at the moment of birth. Drawn at the 9 o'clock position of the wheel by universal convention, it is the hinge that ties an otherwise fixed zodiac to a specific time and place. The opposite cusp — 3 o'clock — is the Descendant; the top of the wheel is the Midheaven (MC), the ecliptic point due south.",
    },
    {
      selector: "planet",
      label: "Planet",
      explanation:
        "A glyph marking one of the ten classical bodies — Sun, Moon, the five visible planets, plus Uranus, Neptune, and Pluto — at its ecliptic longitude at the birth moment. A short radial tick on the house ring marks the exact degree; the glyph itself is pushed inward so crowded pairs do not overlap. Ptolemy's original system used only the seven visible bodies; Uranus (1781), Neptune (1846), and Pluto (1930) were added as they were discovered.",
    },
    {
      selector: "aspect",
      label: "Aspect line",
      explanation:
        "A line across the inner disc connecting two planets whose angular separation matches a canonical aspect: 0° conjunction, 60° sextile, 90° square, 120° trine, 180° opposition, each within a small orb of tolerance. Hard aspects (conjunction, square, opposition) are drawn heavier; soft aspects (sextile, trine) are dashed. The geometric pattern — which planets connect, at which angles — is the part of the chart an astrologer interprets most.",
    },
    {
      selector: "chart-data",
      label: "Birth data",
      explanation:
        "Date, place, and local-mean time. A natal chart is uninterpretable without them: shift the birth time by two hours and the Ascendant jumps an entire sign, reshuffling every house placement. The caption is therefore part of the chart, not metadata.",
    },
  ],
};
