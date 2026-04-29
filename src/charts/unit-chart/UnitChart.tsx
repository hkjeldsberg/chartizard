"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Fatalities recorded in four U.S. National Parks during 2024 (National Park
// Service incident data, as aggregated by Outside Magazine's annual
// reporting). Each icon is one death; the visual mass of each group encodes
// the count directly without the viewer needing to read a scale.
type Row = { park: string; count: number };

const DATA: ReadonlyArray<Row> = [
  { park: "Grand Canyon", count: 17 },
  { park: "Yosemite", count: 11 },
  { park: "Zion", count: 9 },
  { park: "Denali", count: 6 },
];

interface Props {
  width: number;
  height: number;
}

// Small generic person silhouette drawn inside a 20×20 box. Single mark per
// unit — no scaling, no repetition for magnitude, one observation one icon.
function PersonIcon({
  x,
  y,
  size,
}: {
  x: number;
  y: number;
  size: number;
}) {
  const s = size / 20;
  const ink = "var(--color-ink)";
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {/* Head */}
      <circle cx={10} cy={3.5} r={2.3} fill={ink} />
      {/* Torso + arms as one rounded trapezoid */}
      <path
        d="M10 6 L6 9 L6 14 L8 14 L8 19 L12 19 L12 14 L14 14 L14 9 Z"
        fill={ink}
      />
    </g>
  );
}

export function UnitChart({ width, height }: Props) {
  const margin = { top: 28, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Split plot area into columns, one per group. Reserve 22px below each
  // column for the park label.
  const nGroups = DATA.length;
  const colGap = 16;
  const colW = nGroups > 0 ? (iw - colGap * (nGroups - 1)) / nGroups : 0;
  const labelStripH = 22;
  const gridH = Math.max(0, ih - labelStripH);

  // Pack each group into a small sub-grid. Use a fixed 4 columns per group
  // (max count is 17 → 5 rows). Icon size is bounded by both column width and
  // by available vertical room.
  const ICONS_PER_ROW = 4;
  const maxRows = Math.ceil(Math.max(...DATA.map((d) => d.count)) / ICONS_PER_ROW);
  const iconGap = 2;
  const iconSizeByW =
    (colW - iconGap * (ICONS_PER_ROW - 1)) / ICONS_PER_ROW;
  const iconSizeByH = (gridH - iconGap * (maxRows - 1)) / maxRows;
  const iconSize = Math.max(6, Math.min(iconSizeByW, iconSizeByH));

  function groupX(i: number) {
    return i * (colW + colGap);
  }

  // For each group we render icons bottom-up so the cluster "sits on the
  // label line" — visual mass compares cleanly across groups.
  function iconPosition(idxInGroup: number) {
    const row = Math.floor(idxInGroup / ICONS_PER_ROW);
    const col = idxInGroup % ICONS_PER_ROW;
    // Bottom-up fill: row 0 sits at the bottom of the grid area.
    const topRow = maxRows - 1 - row;
    const x = col * (iconSize + iconGap);
    const y = topRow * (iconSize + iconGap);
    return { x, y };
  }

  // Center each group's icon cluster horizontally within its column.
  function groupClusterLeft(count: number) {
    const usedCols = Math.min(ICONS_PER_ROW, count);
    const clusterW = usedCols * iconSize + (usedCols - 1) * iconGap;
    return (colW - clusterW) / 2;
  }

  // Anchor targets.
  const modalIdx = 0; // Grand Canyon — the largest cluster.
  const smallestIdx = DATA.length - 1; // Denali — the smallest cluster.
  const modal = DATA[modalIdx];
  const smallest = DATA[smallestIdx];

  // Pin on the first icon of the modal group.
  const modalFirstPos = iconPosition(0);
  const modalClusterLeft = groupClusterLeft(modal.count);

  // Pin on a representative icon in the smallest group.
  const smallestClusterLeft = groupClusterLeft(smallest.count);
  const smallestFirstPos = iconPosition(0);

  function clampRect(r: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    const right = Math.max(0, Math.min(iw, r.x + r.width));
    const bottom = Math.max(0, Math.min(ih, r.y + r.height));
    return { x, y, width: right - x, height: bottom - y };
  }

  return (
    <svg width={width} height={height} role="img" aria-label="Unit chart">
      <Group left={margin.left} top={margin.top}>
        {/* Y-axis annotation — the scale caption. */}
        <g data-data-layer="true">
          <text
            x={-margin.left + 4}
            y={-10}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            1 FIGURE = 1 FATALITY
          </text>
        </g>

        {/* Groups: icon clusters + labels + counts. */}
        <g data-data-layer="true">
          {DATA.map((d, i) => {
            const gx = groupX(i);
            const clusterLeft = groupClusterLeft(d.count);
            const icons = [];
            for (let j = 0; j < d.count; j++) {
              const p = iconPosition(j);
              icons.push(
                <PersonIcon
                  key={`g${i}-i${j}`}
                  x={gx + clusterLeft + p.x}
                  y={p.y}
                  size={iconSize}
                />,
              );
            }
            return (
              <g key={d.park}>
                {icons}
                {/* Park label under the cluster */}
                <text
                  x={gx + colW / 2}
                  y={gridH + 14}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fill="var(--color-ink-soft)"
                >
                  {d.park.toUpperCase()}
                </text>
                {/* Count under the label */}
                <text
                  x={gx + colW / 2}
                  y={gridH + 28}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fill="var(--color-ink-mute)"
                >
                  {d.count}
                </text>
              </g>
            );
          })}
        </g>

        {/* 1. Unit mark — one person icon stands for exactly one death. */}
        <ExplainAnchor
          selector="unit-mark"
          index={1}
          pin={{
            x: groupX(modalIdx) + modalClusterLeft + modalFirstPos.x + iconSize / 2,
            y: modalFirstPos.y - 12,
          }}
          rect={clampRect({
            x: groupX(modalIdx) + modalClusterLeft + modalFirstPos.x - 2,
            y: modalFirstPos.y - 2,
            width: iconSize + 4,
            height: iconSize + 4,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Largest group — the cluster whose mass is the chart's lead. */}
        <ExplainAnchor
          selector="largest-group"
          index={2}
          pin={{
            x: groupX(modalIdx) + colW / 2,
            y: -6,
          }}
          rect={clampRect({
            x: groupX(modalIdx),
            y: 0,
            width: colW,
            height: gridH,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Smallest group — the comparison that the unit count makes legible. */}
        <ExplainAnchor
          selector="smallest-group"
          index={3}
          pin={{
            x: groupX(smallestIdx) + colW / 2,
            y: -6,
          }}
          rect={clampRect({
            x: groupX(smallestIdx),
            y: 0,
            width: colW,
            height: gridH,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Category label — each cluster is anchored to its named group. */}
        <ExplainAnchor
          selector="category-label"
          index={4}
          pin={{
            x: groupX(modalIdx) + colW / 2,
            y: gridH + 14,
          }}
          rect={{
            x: groupX(modalIdx),
            y: gridH,
            width: colW,
            height: labelStripH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Unit scale — the "one mark = one unit" rule is the chart's contract. */}
        <ExplainAnchor
          selector="unit-scale"
          index={5}
          pin={{ x: -margin.left + 4, y: -14 }}
          rect={{
            x: -margin.left,
            y: -margin.top + 4,
            width: margin.left + iw,
            height: 22,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Cluster mass — why visual bulk beats a bar here. */}
        <ExplainAnchor
          selector="cluster-mass"
          index={6}
          pin={{
            x: groupX(smallestIdx) + colW / 2,
            y: gridH / 2,
          }}
          rect={clampRect({
            x: groupX(smallestIdx) + smallestClusterLeft - 2,
            y: smallestFirstPos.y - 2,
            width: Math.min(ICONS_PER_ROW, smallest.count) * (iconSize + iconGap),
            height: maxRows * (iconSize + iconGap),
          })}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
