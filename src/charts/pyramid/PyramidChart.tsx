"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

type Tier = {
  name: string;
  caption: string;
};

// Maslow's hierarchy of needs, bottom (widest, most foundational) to top.
const TIERS: ReadonlyArray<Tier> = [
  { name: "Physiological", caption: "food · water · sleep" },
  { name: "Safety", caption: "security · shelter · health" },
  { name: "Love / Belonging", caption: "relationships · family" },
  { name: "Esteem", caption: "status · recognition" },
  { name: "Self-actualization", caption: "creativity · meaning" },
];

interface Props {
  width: number;
  height: number;
}

export function PyramidChart({ width, height }: Props) {
  const margin = { top: 24, right: 140, bottom: 32, left: 24 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const n = TIERS.length;
  const tierH = n > 0 ? ih / n : 0;
  const cx = iw / 2;
  const maxWidth = iw;

  // Row j is displayed at y = j*tierH .. (j+1)*tierH. The apex (point of the
  // pyramid) is at y=0, the base at y=ih. Width tapers linearly from 0 at the
  // apex to `maxWidth` at the base.
  //
  // TIERS is stored bottom-up (index 0 = base = Physiological). To render
  // bottom-up data into a top-down SVG we invert the access: display row j
  // shows TIERS[n - 1 - j].
  const rows = Array.from({ length: n }, (_, j) => {
    const tier = TIERS[n - 1 - j];
    const bottomRank = n - 1 - j; // 0 = base, n-1 = peak
    const yTop = j * tierH;
    const yBot = (j + 1) * tierH;
    // Width tapers from apex (w=0 at y=0) to base (w=maxWidth at y=ih).
    const wTop = (maxWidth * j) / n;
    const wBot = (maxWidth * (j + 1)) / n;
    const xTopL = cx - wTop / 2;
    const xTopR = cx + wTop / 2;
    const xBotL = cx - wBot / 2;
    const xBotR = cx + wBot / 2;
    return {
      tier,
      bottomRank,
      yTop,
      yBot,
      yMid: yTop + tierH / 2,
      wTop,
      wBot,
      points: `${xTopL},${yTop} ${xTopR},${yTop} ${xBotR},${yBot} ${xBotL},${yBot}`,
    };
  });

  // Tint: warm ink at the base, fading toward the tip.
  // Base tier opacity ~0.92, peak tier opacity ~0.38.
  const tintFor = (bottomRank: number) => {
    const t = bottomRank / (n - 1); // 0 at base, 1 at peak
    return 0.92 - t * 0.54;
  };

  const baseRow = rows[rows.length - 1]; // array's last row = bottom of pyramid
  const peakRow = rows[0]; // array's first row = top of pyramid
  const widthEncodingRow = rows[2]; // middle trapezoid — illustrates the width taper
  const tierLabelRow = rows[1]; // "Esteem" row — second from top, clearly labelled

  return (
    <svg width={width} height={height} role="img" aria-label="Pyramid chart">
      <Group left={margin.left} top={margin.top}>
        {/* Trapezoids */}
        <g data-data-layer="true">
          {rows.map((r) => (
            <polygon
              key={r.tier.name}
              points={r.points}
              fill="var(--color-ink)"
              fillOpacity={tintFor(r.bottomRank)}
              stroke="var(--color-page)"
              strokeWidth={1}
            />
          ))}
        </g>

        {/* Tier labels to the right of each trapezoid */}
        <g data-data-layer="true">
          {rows.map((r) => (
            <g key={r.tier.name}>
              <text
                x={iw + 12}
                y={r.yMid - 4}
                textAnchor="start"
                fontFamily="var(--font-mono)"
                fontSize={10}
                fill="var(--color-ink)"
              >
                {r.tier.name.toUpperCase()}
              </text>
              <text
                x={iw + 12}
                y={r.yMid + 10}
                textAnchor="start"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink-soft)"
              >
                {r.tier.caption}
              </text>
            </g>
          ))}
        </g>

        {/* Vertical axis caption — the ordering axis */}
        <g data-data-layer="true">
          <line
            x1={-10}
            x2={-10}
            y1={0}
            y2={ih}
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
          />
          <polygon
            points={`${-14},${6} ${-6},${6} ${-10},${-2}`}
            fill="var(--color-ink-mute)"
          />
          <text
            x={-18}
            y={ih / 2}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
            transform={`rotate(-90, ${-18}, ${ih / 2})`}
          >
            PRIORITY (BOTTOM UP)
          </text>
        </g>

        {/* Anchor 1: peak-tier — the tip, aspirational self-actualization */}
        <ExplainAnchor
          selector="peak-tier"
          index={1}
          pin={{ x: cx, y: peakRow.yMid - 16 }}
          rect={{
            x: Math.max(0, cx - peakRow.wBot / 2),
            y: peakRow.yTop,
            width: Math.min(iw, peakRow.wBot),
            height: tierH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2: tier-label — "Esteem" row's name+caption pair. Rect sits
            in the right margin where the text labels actually render, so it
            doesn't compete with the trapezoid-row anchors. Margin-space per §8. */}
        <ExplainAnchor
          selector="tier-label"
          index={2}
          pin={{ x: iw + margin.right / 2, y: tierLabelRow.yMid }}
          rect={{
            x: iw + 4,
            y: tierLabelRow.yTop,
            width: margin.right - 8,
            height: tierH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3: width-encoding — middle trapezoid, shows the taper */}
        <ExplainAnchor
          selector="width-encoding"
          index={3}
          pin={{ x: cx, y: widthEncodingRow.yMid }}
          rect={{
            x: Math.max(0, cx - widthEncodingRow.wBot / 2),
            y: widthEncodingRow.yTop,
            width: Math.min(iw, widthEncodingRow.wBot),
            height: tierH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4: base-tier — the widest, foundational Physiological row */}
        <ExplainAnchor
          selector="base-tier"
          index={4}
          pin={{ x: cx, y: baseRow.yMid + 18 }}
          rect={{
            x: Math.max(0, cx - baseRow.wBot / 2),
            y: baseRow.yTop,
            width: Math.min(iw, baseRow.wBot),
            height: tierH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5: ordering-axis — vertical priority axis in the left
            margin. This anchor's rect lives in margin space (x < 0), per §8
            which allows margin-space rects for axis labels outside the plot. */}
        <ExplainAnchor
          selector="ordering-axis"
          index={5}
          pin={{ x: -24, y: ih / 2 }}
          rect={{ x: -margin.left + 4, y: 0, width: margin.left - 8, height: ih }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 6: shape — pinned at the base-right corner silhouette.
            Rect is a narrow strip along the right slanted edge so it doesn't
            swallow hits meant for the trapezoid-row anchors. Clamped inside
            the plot area per §8. */}
        <ExplainAnchor
          selector="shape"
          index={6}
          pin={{ x: Math.max(0, iw - 10), y: ih - tierH / 2 }}
          rect={{
            x: Math.max(0, iw - 10),
            y: Math.max(0, ih - tierH),
            width: 10,
            height: tierH,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
