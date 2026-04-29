"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

// A UML 2.0 deployment node. Each node is drawn as a front-facing rectangle
// plus a second rectangle offset up-and-right to hint at a three-dimensional
// box (the UML 1.x "node cube" lineage). `stereotype` prefixes the node's
// label as «device» / «executionEnvironment».
interface DeployNode {
  id: string;
  stereotype: "device" | "executionEnvironment";
  name: string;
  subtitle?: string;
  // Layout-space bounding rectangle in 0..100 × 0..100 coords.
  x: number;
  y: number;
  w: number;
  h: number;
  // Artifacts nested inside the node (rendered in a vertical stack).
  artifacts: ReadonlyArray<string>;
}

// Labelled communication path between two nodes. Solid line, no arrowhead —
// the path is symmetric (both ends talk to each other over the protocol).
interface CommPath {
  from: string;
  to: string;
  label: string;
  // Port number subtitle (rendered below the stereotype label).
  port?: string;
}

const NODES: ReadonlyArray<DeployNode> = [
  {
    id: "browser",
    stereotype: "device",
    name: "Client Browser",
    x: 4,
    y: 30,
    w: 26,
    h: 44,
    artifacts: ["index.html", "app.js"],
  },
  {
    id: "app",
    stereotype: "executionEnvironment",
    name: "Application Server",
    subtitle: "EC2 t3.large",
    x: 37,
    y: 26,
    w: 26,
    h: 52,
    artifacts: ["app.war", "auth.jar"],
  },
  {
    id: "db",
    stereotype: "executionEnvironment",
    name: "Database Server",
    subtitle: "RDS PostgreSQL",
    x: 70,
    y: 30,
    w: 26,
    h: 44,
    artifacts: ["schema.sql"],
  },
];

const PATHS: ReadonlyArray<CommPath> = [
  { from: "browser", to: "app", label: "«HTTPS»", port: "port 443" },
  { from: "app", to: "db", label: "«JDBC»", port: "port 5432" },
];

// Pixels of depth offset used to draw the back face of the 3D box.
const DEPTH = 6;

export function UmlDeploymentDiagram({ width, height }: Props) {
  // Deployment diagrams are pure-diagram; no axes. Leave headroom for the
  // stereotype labels at the top of each node.
  const margin = { top: 18, right: 16, bottom: 16, left: 16 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const px = (lx: number) => (lx / 100) * iw;
  const py = (ly: number) => (ly / 100) * ih;

  const byId = new Map(NODES.map((n) => [n.id, n]));

  // Pixel-space bounding box (front face) for a node.
  function nodeBox(n: DeployNode) {
    return {
      x: px(n.x),
      y: py(n.y),
      w: px(n.w),
      h: py(n.h),
    };
  }

  // Return the front-face perimeter point closest to `towards`.
  function anchorOf(n: DeployNode, towards: { x: number; y: number }) {
    const b = nodeBox(n);
    const cx = b.x + b.w / 2;
    const cy = b.y + b.h / 2;
    const dx = towards.x - cx;
    const dy = towards.y - cy;
    if (Math.abs(dy) * b.w >= Math.abs(dx) * b.h) {
      const sign = dy >= 0 ? 1 : -1;
      return { x: cx, y: cy + (sign * b.h) / 2 };
    }
    const sign = dx >= 0 ? 1 : -1;
    return { x: cx + (sign * b.w) / 2, y: cy };
  }

  function renderNode(n: DeployNode) {
    const b = nodeBox(n);
    // Back face: offset up-and-right by DEPTH pixels.
    const backX = b.x + DEPTH;
    const backY = b.y - DEPTH;

    // Artifact box dimensions (fit inside the node's body).
    const bodyTop = b.y + 28;
    const artifactH = 14;
    const artifactW = b.w - 12;
    const artifactX = b.x + 6;

    return (
      <g key={n.id}>
        {/* Back face of the 3D box */}
        <rect
          x={backX}
          y={backY}
          width={b.w}
          height={b.h}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1}
          opacity={0.9}
        />
        {/* Three depth lines connecting front corners to back corners
            (top-left, top-right, bottom-right). Bottom-left is hidden
            behind the front face so we omit it. */}
        <line
          x1={b.x}
          y1={b.y}
          x2={backX}
          y2={backY}
          stroke="var(--color-ink)"
          strokeWidth={1}
        />
        <line
          x1={b.x + b.w}
          y1={b.y}
          x2={backX + b.w}
          y2={backY}
          stroke="var(--color-ink)"
          strokeWidth={1}
        />
        <line
          x1={b.x + b.w}
          y1={b.y + b.h}
          x2={backX + b.w}
          y2={backY + b.h}
          stroke="var(--color-ink)"
          strokeWidth={1}
        />
        {/* Front face */}
        <rect
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1.4}
        />
        {/* Stereotype label — guillemets, smaller muted type */}
        <text
          x={b.x + b.w / 2}
          y={b.y + 12}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={9}
          fill="var(--color-ink-mute)"
        >
          {`«${n.stereotype}»`}
        </text>
        {/* Node name */}
        <text
          x={b.x + b.w / 2}
          y={b.y + 22}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={10}
          fontWeight={600}
          fill="var(--color-ink)"
        >
          {n.name}
        </text>
        {/* Optional subtitle (instance type, DB engine) */}
        {n.subtitle && (
          <text
            x={b.x + b.w / 2}
            y={b.y + 32}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={8}
            fill="var(--color-ink-soft)"
          >
            {n.subtitle}
          </text>
        )}
        {/* Artifacts: folded-corner page icon + file name */}
        {n.artifacts.map((a, i) => {
          const ay = bodyTop + (n.subtitle ? 12 : 4) + i * (artifactH + 4);
          return renderArtifact(a, artifactX, ay, artifactW, artifactH, `${n.id}-a-${i}`);
        })}
      </g>
    );
  }

  // Artifact rectangle with a small folded-corner page icon on the left.
  function renderArtifact(
    name: string,
    ax: number,
    ay: number,
    aw: number,
    ah: number,
    key: string,
  ) {
    const iconX = ax + 4;
    const iconY = ay + 2;
    const iconW = 8;
    const iconH = ah - 4;
    const fold = 3;
    // Folded-corner page path.
    const pageD =
      `M ${iconX} ${iconY} ` +
      `L ${iconX + iconW - fold} ${iconY} ` +
      `L ${iconX + iconW} ${iconY + fold} ` +
      `L ${iconX + iconW} ${iconY + iconH} ` +
      `L ${iconX} ${iconY + iconH} Z`;
    const foldD = `M ${iconX + iconW - fold} ${iconY} L ${iconX + iconW - fold} ${iconY + fold} L ${iconX + iconW} ${iconY + fold}`;
    return (
      <g key={key}>
        <rect
          x={ax}
          y={ay}
          width={aw}
          height={ah}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1}
        />
        <path d={pageD} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />
        <path d={foldD} fill="none" stroke="var(--color-ink)" strokeWidth={1} />
        <text
          x={ax + iconW + 8}
          y={ay + ah / 2 + 3}
          fontFamily="var(--font-mono)"
          fontSize={9}
          fill="var(--color-ink-soft)"
        >
          {name}
        </text>
      </g>
    );
  }

  // Edge geometry for a communication path: anchor-to-anchor between two
  // front faces, with a midpoint for the «protocol» label.
  function pathGeom(p: CommPath) {
    const from = byId.get(p.from)!;
    const to = byId.get(p.to)!;
    const fromBox = nodeBox(from);
    const toBox = nodeBox(to);
    const fromC = { x: fromBox.x + fromBox.w / 2, y: fromBox.y + fromBox.h / 2 };
    const toC = { x: toBox.x + toBox.w / 2, y: toBox.y + toBox.h / 2 };
    const a = anchorOf(from, toC);
    const b = anchorOf(to, fromC);
    return {
      a,
      b,
      midX: (a.x + b.x) / 2,
      midY: (a.y + b.y) / 2,
    };
  }

  // Representative geometries for anchors.
  const browserNode = byId.get("browser")!;
  const appNode = byId.get("app")!;
  const dbNode = byId.get("db")!;
  const browserBox = nodeBox(browserNode);
  const appBox = nodeBox(appNode);
  const dbBox = nodeBox(dbNode);
  const commPath1 = pathGeom(PATHS[0]);
  const commPath2 = pathGeom(PATHS[1]);

  // An artifact rect used by the artifact anchor — first artifact in the
  // app server (app.war).
  const appArtifactY = appBox.y + 28 + (appNode.subtitle ? 12 : 4);
  const appArtifactRect = {
    x: appBox.x + 6,
    y: appArtifactY,
    w: appBox.w - 12,
    h: 14,
  };

  return (
    <svg width={width} height={height} role="img" aria-label="UML Deployment Diagram">
      <Group left={margin.left} top={margin.top}>
        {/* Communication paths — rendered behind nodes so the 3D boxes
            occlude the line ends cleanly. UML 2.0 draws links as solid
            straight segments with no arrowheads. */}
        <g data-data-layer="true">
          {PATHS.map((p, i) => {
            const g = pathGeom(p);
            return (
              <g key={`path-${i}`}>
                <line
                  x1={g.a.x}
                  y1={g.a.y}
                  x2={g.b.x}
                  y2={g.b.y}
                  stroke="var(--color-ink)"
                  strokeWidth={1.4}
                />
                {/* Protocol label + port, stacked on the midpoint */}
                <text
                  x={g.midX}
                  y={g.midY - 4}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink)"
                >
                  {p.label}
                </text>
                {p.port && (
                  <text
                    x={g.midX}
                    y={g.midY + 7}
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    fontSize={8}
                    fill="var(--color-ink-mute)"
                  >
                    {p.port}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* Nodes */}
        <g data-data-layer="true">
          {NODES.map((n) => renderNode(n))}
        </g>

        {/* ----- Anchors ----- */}

        {/* 1. 3D-box node — anchor on the browser client */}
        <ExplainAnchor
          selector="node-3d-box"
          index={1}
          pin={{ x: browserBox.x - 10, y: browserBox.y + 10 }}
          rect={{
            x: Math.max(0, browserBox.x),
            y: Math.max(0, browserBox.y - DEPTH),
            width: Math.min(iw, browserBox.w + DEPTH),
            height: Math.min(ih, browserBox.h + DEPTH),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Device vs executionEnvironment stereotype distinction — anchor
            on the app server's stereotype label, which contrasts with the
            browser's «device» above. */}
        <ExplainAnchor
          selector="stereotype"
          index={2}
          pin={{ x: appBox.x + appBox.w / 2, y: appBox.y - 10 }}
          rect={{
            x: Math.max(0, appBox.x),
            y: Math.max(0, appBox.y + 2),
            width: Math.min(iw, appBox.w),
            height: 18,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Artifact rectangle — first artifact inside the app server */}
        <ExplainAnchor
          selector="artifact"
          index={3}
          pin={{ x: appArtifactRect.x + appArtifactRect.w + 10, y: appArtifactRect.y + appArtifactRect.h / 2 }}
          rect={{
            x: Math.max(0, appArtifactRect.x),
            y: Math.max(0, appArtifactRect.y),
            width: Math.min(iw, appArtifactRect.w),
            height: Math.min(ih, appArtifactRect.h),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Node-containment relationship — covers the full body region of
            the app server where artifacts live. */}
        <ExplainAnchor
          selector="containment"
          index={4}
          pin={{ x: appBox.x + appBox.w / 2, y: appBox.y + appBox.h + 10 }}
          rect={{
            x: Math.max(0, appBox.x + 4),
            y: Math.max(0, appBox.y + 40),
            width: Math.min(iw, appBox.w - 8),
            height: Math.min(ih, appBox.h - 44),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Communication path — Browser ↔ App (HTTPS) */}
        <ExplainAnchor
          selector="communication-path"
          index={5}
          pin={{ x: commPath1.midX, y: commPath1.midY - 18 }}
          rect={{
            x: Math.max(0, Math.min(commPath1.a.x, commPath1.b.x) - 4),
            y: Math.max(0, Math.min(commPath1.a.y, commPath1.b.y) - 12),
            width: Math.max(12, Math.abs(commPath1.b.x - commPath1.a.x) + 8),
            height: Math.max(24, Math.abs(commPath1.b.y - commPath1.a.y) + 24),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Protocol label on the App ↔ DB path (JDBC / port 5432) */}
        <ExplainAnchor
          selector="protocol-label"
          index={6}
          pin={{ x: commPath2.midX, y: commPath2.midY + 22 }}
          rect={{
            x: Math.max(0, commPath2.midX - 36),
            y: Math.max(0, commPath2.midY - 10),
            width: 72,
            height: 22,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 7. Database node artifact (schema.sql) — anchors a second artifact
            to make clear that artifacts live in every node, not just the
            app server. */}
        <ExplainAnchor
          selector="artifact-name"
          index={7}
          pin={{ x: dbBox.x + dbBox.w + 10, y: dbBox.y + 46 }}
          rect={{
            x: Math.max(0, dbBox.x + 6),
            y: Math.max(0, dbBox.y + 28 + (dbNode.subtitle ? 12 : 4)),
            width: Math.min(iw, dbBox.w - 12),
            height: 14,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
