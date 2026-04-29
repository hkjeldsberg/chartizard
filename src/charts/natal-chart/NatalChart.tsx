"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Hellenistic-style natal wheel for Claude Monet (Paris, 1840-11-14, 06:00
// LMT). Chartizard documents the visualisation; it does not endorse the
// astrological claims. The geometry is what matters:
//
//   - Outer band: 12 zodiac signs, each 30° of ecliptic, fixed relative to
//     the stars (tropical zodiac starts at Aries = 0°).
//   - Middle band: 12 houses. By convention the first house begins at the
//     Ascendant, which is drawn at the 9 o'clock position of the wheel.
//     Houses number counter-clockwise. Here we use equal-house division
//     (30° per house) so house cusps line up with the 9 o'clock meridian.
//   - Inner disc: ten classical planets, placed at their ecliptic
//     longitudes. Glyphs are Unicode.
//   - Centre: aspect lines between pairs of planets whose separation falls
//     at one of the canonical angles (0°, 60°, 90°, 120°, 180°) within a
//     small orb.

type SignId =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces";

interface Sign {
  id: SignId;
  glyph: string;
  // Starting ecliptic longitude in degrees (0..360).
  start: number;
}

const SIGNS: ReadonlyArray<Sign> = [
  { id: "aries", glyph: "♈", start: 0 },
  { id: "taurus", glyph: "♉", start: 30 },
  { id: "gemini", glyph: "♊", start: 60 },
  { id: "cancer", glyph: "♋", start: 90 },
  { id: "leo", glyph: "♌", start: 120 },
  { id: "virgo", glyph: "♍", start: 150 },
  { id: "libra", glyph: "♎", start: 180 },
  { id: "scorpio", glyph: "♏", start: 210 },
  { id: "sagittarius", glyph: "♐", start: 240 },
  { id: "capricorn", glyph: "♑", start: 270 },
  { id: "aquarius", glyph: "♒", start: 300 },
  { id: "pisces", glyph: "♓", start: 330 },
];

type PlanetId =
  | "sun"
  | "moon"
  | "mercury"
  | "venus"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune"
  | "pluto";

interface Planet {
  id: PlanetId;
  glyph: string;
  // Ecliptic longitude in degrees (0..360). These are stylised positions
  // illustrative of Monet's chart (Paris 1840-11-14 06:00 LMT); they are
  // good enough for the visualisation but not of ephemeris quality.
  longitude: number;
}

const PLANETS: ReadonlyArray<Planet> = [
  { id: "sun", glyph: "☉", longitude: 218 }, // Scorpio 8°
  { id: "moon", glyph: "☽", longitude: 110 }, // Cancer 20°
  { id: "mercury", glyph: "☿", longitude: 232 }, // Scorpio 22°
  { id: "venus", glyph: "♀", longitude: 260 }, // Sagittarius 20°
  { id: "mars", glyph: "♂", longitude: 135 }, // Leo 15°
  { id: "jupiter", glyph: "♃", longitude: 282 }, // Capricorn 12°
  { id: "saturn", glyph: "♄", longitude: 315 }, // Aquarius 15°
  { id: "uranus", glyph: "♅", longitude: 11 }, // Aries 11°
  { id: "neptune", glyph: "♆", longitude: 292 }, // Capricorn 22°
  { id: "pluto", glyph: "♇", longitude: 20 }, // Aries 20°
];

// Ascendant — the sign rising on the eastern horizon at birth. Drawn at
// the 9 o'clock position of the wheel by convention.
const ASCENDANT_LONGITUDE = 218; // close to Sun for Monet's ~dawn birth.

// Canonical aspects with a small orb (tolerance in degrees).
const ASPECTS: ReadonlyArray<{ name: string; angle: number; orb: number }> = [
  { name: "conjunction", angle: 0, orb: 6 },
  { name: "sextile", angle: 60, orb: 4 },
  { name: "square", angle: 90, orb: 5 },
  { name: "trine", angle: 120, orb: 5 },
  { name: "opposition", angle: 180, orb: 6 },
];

function angularSeparation(a: number, b: number): number {
  const d = Math.abs(((a - b) % 360) + 360) % 360;
  return d > 180 ? 360 - d : d;
}

function matchAspect(sep: number): { name: string; angle: number } | null {
  for (const a of ASPECTS) {
    if (Math.abs(sep - a.angle) <= a.orb) return { name: a.name, angle: a.angle };
  }
  return null;
}

interface Props {
  width: number;
  height: number;
}

export function NatalChart({ width, height }: Props) {
  const margin = { top: 18, right: 18, bottom: 28, left: 18 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Ecliptic-longitude → screen angle. The Ascendant (= start of house 1)
  // sits at the 9 o'clock position = 180° on the SVG polar axis (where 0°
  // is east). Longitude INCREASES counter-clockwise on the wheel, which in
  // screen space means angle DECREASES (because SVG y goes down). So:
  //
  //     screenAngle = 180° - (longitude - ascendant)
  //
  function toScreenAngleDeg(longitude: number): number {
    return 180 - (longitude - ASCENDANT_LONGITUDE);
  }

  function polar(cx: number, cy: number, r: number, angleDeg: number) {
    const a = (angleDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) };
  }

  // Arc path from angle1 to angle2 (degrees, CCW in math / CW on SVG).
  function arcPath(
    cx: number,
    cy: number,
    r: number,
    startAngleDeg: number,
    endAngleDeg: number,
  ): string {
    const p1 = polar(cx, cy, r, startAngleDeg);
    const p2 = polar(cx, cy, r, endAngleDeg);
    // Sweep direction: we go from startAngleDeg to endAngleDeg with
    // endAngleDeg < startAngleDeg (decreasing screen angle as longitude
    // increases). In SVG, sweep-flag=0 goes counter-clockwise (from the
    // viewer's perspective, which in our flipped-y frame means math-CCW).
    const delta = ((startAngleDeg - endAngleDeg) % 360 + 360) % 360;
    const largeArc = delta > 180 ? 1 : 0;
    return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${largeArc} 0 ${p2.x} ${p2.y}`;
  }

  const { cx, cy, rOuter, rSignInner, rHouseInner, rInner, placedPlanets, aspectLines } = useMemo(() => {
    const size = Math.min(iw, ih);
    const cx = iw / 2;
    const cy = ih / 2;
    const rOuter = size / 2 - 4;
    const rSignInner = rOuter * 0.86; // zodiac band thickness
    const rHouseInner = rOuter * 0.66; // house band extends inward from rSignInner
    const rInner = rOuter * 0.5; // aspect-line radius (inner disc edge)

    // Planet glyph placement radius (between house ring and aspect disc).
    const rPlanet = (rHouseInner + rInner) / 2;

    // Separate planet glyphs that crowd within 5° of each other so they
    // don't render on top of one another. We bump adjacent ones outward by
    // a small radial offset.
    const sorted = [...PLANETS].sort((a, b) => a.longitude - b.longitude);
    const offsets = new Map<PlanetId, number>();
    for (let i = 0; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      if (prev && angularSeparation(sorted[i].longitude, prev.longitude) < 6) {
        const prevOffset = offsets.get(prev.id) ?? 0;
        offsets.set(sorted[i].id, prevOffset === 0 ? 10 : 0);
      } else {
        offsets.set(sorted[i].id, 0);
      }
    }

    const placed = PLANETS.map((p) => {
      const screenAngle = toScreenAngleDeg(p.longitude);
      const offset = offsets.get(p.id) ?? 0;
      const pos = polar(cx, cy, rPlanet + offset, screenAngle);
      // Tick on the zodiac ring pointing at the planet longitude.
      const tickOuter = polar(cx, cy, rHouseInner, screenAngle);
      const tickInner = polar(cx, cy, rHouseInner - 6, screenAngle);
      return { ...p, x: pos.x, y: pos.y, tickOuter, tickInner };
    });

    // Aspect line list — one line per matched pair. Deterministic order.
    const lines: Array<{
      from: PlanetId;
      to: PlanetId;
      aspect: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    }> = [];
    const placedById = new Map(placed.map((p) => [p.id, p]));
    for (let i = 0; i < PLANETS.length; i++) {
      for (let j = i + 1; j < PLANETS.length; j++) {
        const pi = PLANETS[i];
        const pj = PLANETS[j];
        const sep = angularSeparation(pi.longitude, pj.longitude);
        const m = matchAspect(sep);
        if (!m) continue;
        // Endpoints sit on the inner-disc circumference so the lines form
        // a star pattern rather than running over the planet glyphs.
        const a1 = toScreenAngleDeg(pi.longitude);
        const a2 = toScreenAngleDeg(pj.longitude);
        const p1 = polar(cx, cy, rInner, a1);
        const p2 = polar(cx, cy, rInner, a2);
        lines.push({
          from: pi.id,
          to: pj.id,
          aspect: m.name,
          x1: p1.x,
          y1: p1.y,
          x2: p2.x,
          y2: p2.y,
        });
      }
    }
    // Keep the visuals readable — cap at 8 aspect lines by preferring the
    // higher-weight aspects (conjunctions + hard aspects first, then
    // soft aspects).
    const order: Record<string, number> = {
      opposition: 0,
      square: 1,
      trine: 2,
      conjunction: 3,
      sextile: 4,
    };
    const capped = lines
      .sort((a, b) => order[a.aspect] - order[b.aspect])
      .slice(0, 8);

    return {
      cx,
      cy,
      rOuter,
      rSignInner,
      rHouseInner,
      rInner,
      placedPlanets: placed,
      aspectLines: capped,
    };
  }, [iw, ih]);

  // Aspect line stroke style encodes the aspect family.
  function aspectStyle(name: string): {
    stroke: string;
    strokeOpacity: number;
    strokeWidth: number;
    dash?: string;
  } {
    switch (name) {
      case "conjunction":
        return { stroke: "var(--color-ink)", strokeOpacity: 0.6, strokeWidth: 1.3 };
      case "opposition":
        return { stroke: "var(--color-ink)", strokeOpacity: 0.65, strokeWidth: 1.3 };
      case "square":
        return { stroke: "var(--color-ink)", strokeOpacity: 0.55, strokeWidth: 1.1, dash: "4 2" };
      case "trine":
        return { stroke: "var(--color-ink)", strokeOpacity: 0.45, strokeWidth: 1.1, dash: "2 3" };
      case "sextile":
        return { stroke: "var(--color-ink)", strokeOpacity: 0.4, strokeWidth: 0.9, dash: "1 3" };
      default:
        return { stroke: "var(--color-ink)", strokeOpacity: 0.4, strokeWidth: 1 };
    }
  }

  // Sign labels — glyph sits at the mid-angle of each 30° arc.
  const signLabels = SIGNS.map((s) => {
    const mid = s.start + 15;
    const screenAngle = 180 - (mid - ASCENDANT_LONGITUDE);
    const r = (rOuter + rSignInner) / 2;
    const pos = (() => {
      const a = (screenAngle * Math.PI) / 180;
      return { x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) };
    })();
    return { ...s, ...pos };
  });

  // House cusp labels (Roman numerals centred in each house wedge).
  const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  const houseLabels = ROMAN.map((roman, i) => {
    // House i (1-indexed) starts at ascendant + (i-1)*30 and spans 30°.
    const houseStart = ASCENDANT_LONGITUDE + i * 30;
    const houseMid = houseStart + 15;
    const screenAngle = 180 - (houseMid - ASCENDANT_LONGITUDE);
    const r = (rSignInner + rHouseInner) / 2;
    const a = (screenAngle * Math.PI) / 180;
    return {
      roman,
      x: cx + r * Math.cos(a),
      y: cy - r * Math.sin(a),
    };
  });

  // House cusp lines (12 radial lines from centre to the zodiac ring).
  const houseCusps = Array.from({ length: 12 }, (_, i) => {
    const cusp = ASCENDANT_LONGITUDE + i * 30;
    const screenAngle = 180 - (cusp - ASCENDANT_LONGITUDE);
    const pOuter = (() => {
      const a = (screenAngle * Math.PI) / 180;
      return { x: cx + rSignInner * Math.cos(a), y: cy - rSignInner * Math.sin(a) };
    })();
    const pInner = (() => {
      const a = (screenAngle * Math.PI) / 180;
      return { x: cx + rHouseInner * Math.cos(a), y: cy - rHouseInner * Math.sin(a) };
    })();
    const isAscendant = i === 0;
    const isMC = i === 9; // Medium Coeli — 10th-house cusp
    return { pOuter, pInner, isAscendant, isMC };
  });

  // Sign-band dividers (same radial angles but between the two zodiac radii).
  const signDividers = SIGNS.map((s) => {
    const screenAngle = 180 - (s.start - ASCENDANT_LONGITUDE);
    const pOuter = (() => {
      const a = (screenAngle * Math.PI) / 180;
      return { x: cx + rOuter * Math.cos(a), y: cy - rOuter * Math.sin(a) };
    })();
    const pInner = (() => {
      const a = (screenAngle * Math.PI) / 180;
      return { x: cx + rSignInner * Math.cos(a), y: cy - rSignInner * Math.sin(a) };
    })();
    return { pOuter, pInner };
  });

  // Ascendant marker — a small "AC" label at 9 o'clock just outside the wheel.
  const ascPos = (() => {
    const a = (180 * Math.PI) / 180;
    return { x: cx + (rOuter + 12) * Math.cos(a), y: cy - (rOuter + 12) * Math.sin(a) };
  })();

  // Anchor hit-rects — computed as ring-bounding boxes clamped to plot area.
  function ringRect(rInnerEdge: number, rOuterEdge: number) {
    const x = Math.max(0, cx - rOuterEdge);
    const y = Math.max(0, cy - rOuterEdge);
    const w = Math.min(iw - x, rOuterEdge * 2);
    const h = Math.min(ih - y, rOuterEdge * 2);
    void rInnerEdge;
    return { x, y, width: w, height: h };
  }

  const zodiacBandRect = ringRect(rSignInner, rOuter);
  const houseBandRect = ringRect(rHouseInner, rSignInner);
  const aspectDiscRect = ringRect(0, rInner);

  // Planet anchor — park on the Sun glyph (brightest/closest conceptual star
  // of the chart). Small rect tight around its position.
  const sun = placedPlanets.find((p) => p.id === "sun")!;
  const planetRect = {
    x: Math.max(0, sun.x - 14),
    y: Math.max(0, sun.y - 14),
    width: Math.min(iw - Math.max(0, sun.x - 14), 28),
    height: Math.min(ih - Math.max(0, sun.y - 14), 28),
  };

  // Ascendant anchor rect — vertical band at 9 o'clock.
  const ascRectX = Math.max(0, cx - rOuter - 14);
  const ascRectY = Math.max(0, cy - 14);
  const ascRectW = Math.min(iw - ascRectX, 28);
  const ascRectH = Math.min(ih - ascRectY, 28);

  // Caption for the bottom (date / place, anthropological note).
  const captionH = 16;
  const captionY = Math.max(0, ih - captionH - 2);

  return (
    <svg width={width} height={height} role="img" aria-label="Natal chart">
      <Group left={margin.left} top={margin.top}>
        {/* --- Sign band (outer) --- */}
        <g data-data-layer="true">
          <circle
            cx={cx}
            cy={cy}
            r={rOuter}
            fill="none"
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
          />
          <circle
            cx={cx}
            cy={cy}
            r={rSignInner}
            fill="none"
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
          />
          {signDividers.map((d, i) => (
            <line
              key={`sdiv-${i}`}
              x1={d.pOuter.x}
              y1={d.pOuter.y}
              x2={d.pInner.x}
              y2={d.pInner.y}
              stroke="var(--color-hairline)"
            />
          ))}
          {signLabels.map((s) => (
            <text
              key={s.id}
              x={s.x}
              y={s.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={Math.max(10, Math.min(16, rOuter * 0.1))}
              fill="var(--color-ink)"
            >
              {s.glyph}
            </text>
          ))}
        </g>

        {/* --- House band (middle) --- */}
        <g data-data-layer="true">
          <circle
            cx={cx}
            cy={cy}
            r={rHouseInner}
            fill="none"
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
          />
          {houseCusps.map((c, i) => (
            <line
              key={`cusp-${i}`}
              x1={c.pOuter.x}
              y1={c.pOuter.y}
              x2={c.pInner.x}
              y2={c.pInner.y}
              stroke={
                c.isAscendant || c.isMC
                  ? "var(--color-ink)"
                  : "var(--color-hairline)"
              }
              strokeWidth={c.isAscendant || c.isMC ? 1.2 : 1}
            />
          ))}
          {houseLabels.map((h) => (
            <text
              key={`house-${h.roman}`}
              x={h.x}
              y={h.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-soft)"
            >
              {h.roman}
            </text>
          ))}
        </g>

        {/* --- Aspect lines (inner) --- */}
        <g data-data-layer="true">
          <circle
            cx={cx}
            cy={cy}
            r={rInner}
            fill="none"
            stroke="var(--color-hairline)"
            strokeDasharray="1 2"
          />
          {aspectLines.map((a, i) => {
            const s = aspectStyle(a.aspect);
            return (
              <line
                key={`asp-${i}`}
                x1={a.x1}
                y1={a.y1}
                x2={a.x2}
                y2={a.y2}
                stroke={s.stroke}
                strokeOpacity={s.strokeOpacity}
                strokeWidth={s.strokeWidth}
                strokeDasharray={s.dash}
              />
            );
          })}
        </g>

        {/* --- Planets --- */}
        <g data-data-layer="true">
          {placedPlanets.map((p) => (
            <g key={p.id}>
              <line
                x1={p.tickOuter.x}
                y1={p.tickOuter.y}
                x2={p.tickInner.x}
                y2={p.tickInner.y}
                stroke="var(--color-ink)"
                strokeWidth={0.8}
              />
              <text
                x={p.x}
                y={p.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={Math.max(11, Math.min(16, rOuter * 0.11))}
                fill="var(--color-ink)"
              >
                {p.glyph}
              </text>
            </g>
          ))}
        </g>

        {/* --- Ascendant marker (9 o'clock) --- */}
        <g data-data-layer="true">
          <text
            x={ascPos.x}
            y={ascPos.y}
            textAnchor="end"
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            AC
          </text>
        </g>

        {/* --- Caption --- */}
        <text
          x={0}
          y={ih - 4}
          fontFamily="var(--font-mono)"
          fontSize={10}
          fill="var(--color-ink-mute)"
        >
          CLAUDE MONET · PARIS · 1840-11-14 · 06:00 LMT
        </text>

        {/* ====== Anchors ====== */}

        {/* 1. Zodiac band */}
        <ExplainAnchor
          selector="zodiac"
          index={1}
          pin={{
            x: cx,
            y: Math.max(14, cy - rOuter + 10),
          }}
          rect={zodiacBandRect}
        >
          <g />
        </ExplainAnchor>

        {/* 2. House band */}
        <ExplainAnchor
          selector="house"
          index={2}
          pin={{
            x: Math.min(iw - 14, cx + rHouseInner + 8),
            y: cy,
          }}
          rect={houseBandRect}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Ascendant */}
        <ExplainAnchor
          selector="ascendant"
          index={3}
          pin={{
            x: Math.max(14, cx - rOuter - 4),
            y: Math.min(ih - 14, cy + 18),
          }}
          rect={{ x: ascRectX, y: ascRectY, width: ascRectW, height: ascRectH }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Planet */}
        <ExplainAnchor
          selector="planet"
          index={4}
          pin={{
            x: Math.min(iw - 14, sun.x + 18),
            y: Math.max(14, sun.y - 18),
          }}
          rect={planetRect}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Aspect lines */}
        <ExplainAnchor
          selector="aspect"
          index={5}
          pin={{ x: cx, y: cy }}
          rect={aspectDiscRect}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Chart-data caption — who, when, where */}
        <ExplainAnchor
          selector="chart-data"
          index={6}
          pin={{ x: Math.min(iw - 14, 140), y: Math.max(14, ih - 4) }}
          rect={{ x: 0, y: captionY, width: iw, height: captionH }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
