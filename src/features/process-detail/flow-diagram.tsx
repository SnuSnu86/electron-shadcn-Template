import type { DiagramNodeKind, FlowDiagram } from "@/shared/domain";

const NODE_WIDTH = 220;
const NODE_HEIGHT = 54;
const GAP = 40;
const PADDING = 16;

const KIND_STYLES: Record<
  DiagramNodeKind,
  { stroke: string; fill: string; text: string; label: string }
> = {
  start: {
    stroke: "var(--muted-foreground)",
    fill: "color-mix(in oklab, var(--muted-foreground) 10%, transparent)",
    text: "var(--foreground)",
    label: "START",
  },
  input: {
    stroke: "var(--info)",
    fill: "color-mix(in oklab, var(--info) 10%, transparent)",
    text: "var(--info)",
    label: "INPUT",
  },
  system: {
    stroke: "var(--primary)",
    fill: "color-mix(in oklab, var(--primary) 10%, transparent)",
    text: "var(--primary)",
    label: "SYSTEM",
  },
  decision: {
    stroke: "var(--warning)",
    fill: "color-mix(in oklab, var(--warning) 10%, transparent)",
    text: "var(--warning)",
    label: "ENTSCHEIDUNG",
  },
  output: {
    stroke: "var(--success)",
    fill: "color-mix(in oklab, var(--success) 10%, transparent)",
    text: "var(--success)",
    label: "OUTPUT",
  },
  end: {
    stroke: "var(--muted-foreground)",
    fill: "color-mix(in oklab, var(--muted-foreground) 10%, transparent)",
    text: "var(--foreground)",
    label: "ENDE",
  },
};

/**
 * Rendert das Prozessdiagramm als vertikalen SVG-Flow.
 * Die Knoten werden in Reihenfolge der nodes-Liste gestapelt;
 * Kanten zwischen aufeinanderfolgenden Knoten erhalten einen animierten Fluss.
 */
export function FlowDiagramView({ diagram }: { diagram: FlowDiagram }) {
  const nodes = diagram.nodes;
  if (nodes.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground text-sm">
        Kein Diagramm hinterlegt.
      </p>
    );
  }

  const height =
    nodes.length * NODE_HEIGHT + (nodes.length - 1) * GAP + PADDING * 2;
  const width = NODE_WIDTH + PADDING * 2 + 120;
  const centerX = width / 2;

  const nodeY = (index: number) => PADDING + index * (NODE_HEIGHT + GAP);
  const indexById = new Map(nodes.map((n, i) => [n.id, i]));

  return (
    <svg
      className="mx-auto block h-auto w-full max-w-md"
      role="img"
      viewBox={`0 0 ${width} ${height}`}
    >
      <title>Prozessdiagramm</title>
      <defs>
        <marker
          id="arrow"
          markerHeight="7"
          markerWidth="7"
          orient="auto-start-reverse"
          refX="6"
          refY="3.5"
        >
          <path d="M0,0 L7,3.5 L0,7 Z" fill="var(--muted-foreground)" />
        </marker>
      </defs>

      {diagram.edges.map((edge) => {
        const fromIdx = indexById.get(edge.from);
        const toIdx = indexById.get(edge.to);
        if (fromIdx === undefined || toIdx === undefined) {
          return null;
        }
        const y1 = nodeY(fromIdx) + NODE_HEIGHT;
        const y2 = nodeY(toIdx) - 5;
        return (
          <g key={`${edge.from}-${edge.to}`}>
            <line
              className="animate-dash-flow"
              markerEnd="url(#arrow)"
              stroke="var(--muted-foreground)"
              strokeOpacity="0.55"
              strokeWidth="1.5"
              x1={centerX}
              x2={centerX}
              y1={y1}
              y2={y2}
            />
            {edge.label && (
              <text
                fill="var(--muted-foreground)"
                fontSize="9"
                x={centerX + 10}
                y={(y1 + y2) / 2 + 3}
              >
                {edge.label}
              </text>
            )}
          </g>
        );
      })}

      {nodes.map((node, i) => {
        const y = nodeY(i);
        const style = KIND_STYLES[node.kind];
        const x = centerX - NODE_WIDTH / 2;
        const isPill = node.kind === "start" || node.kind === "end";
        const isDecision = node.kind === "decision";

        return (
          <g
            className="animate-scale-in"
            key={node.id}
            style={{
              animationDelay: `${i * 80}ms`,
              transformOrigin: `${centerX}px ${y + NODE_HEIGHT / 2}px`,
            }}
          >
            {isDecision ? (
              <polygon
                fill={style.fill}
                points={`${centerX},${y} ${x + NODE_WIDTH + 14},${y + NODE_HEIGHT / 2} ${centerX},${y + NODE_HEIGHT} ${x - 14},${y + NODE_HEIGHT / 2}`}
                stroke={style.stroke}
                strokeWidth="1.5"
              />
            ) : (
              <rect
                fill={style.fill}
                height={NODE_HEIGHT}
                rx={isPill ? NODE_HEIGHT / 2 : 8}
                stroke={style.stroke}
                strokeWidth="1.5"
                width={NODE_WIDTH}
                x={x}
                y={y}
              />
            )}
            <text
              fill={style.text}
              fontSize="7.5"
              fontWeight="600"
              letterSpacing="1.5"
              textAnchor="middle"
              x={centerX}
              y={y + 16}
            >
              {style.label}
            </text>
            <text
              fill="var(--foreground)"
              fontSize="11.5"
              fontWeight="600"
              textAnchor="middle"
              x={centerX}
              y={y + (node.sublabel ? 31 : 35)}
            >
              {node.label}
            </text>
            {node.sublabel && (
              <text
                fill="var(--muted-foreground)"
                fontSize="9"
                textAnchor="middle"
                x={centerX}
                y={y + 44}
              >
                {node.sublabel}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
