import React, { useEffect, useMemo } from 'react';
import {
  BaseEdge,
  Controls,
  Handle,
  Position,
  ReactFlow,
  ReactFlowProvider,
  getStraightPath,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Edge,
  type EdgeProps,
  type Node,
  type NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { GraphState, NodeHighlight } from '../../types';
import { edgeStroke, nodeFill } from '../../utils/highlightColor';

interface Props {
  graph: GraphState;
  directed: boolean;
  highlights: Record<string, NodeHighlight | string>;
  edgeHighlights: Record<string, string>;
  selectedId: string | null;
  selectedEdgeId: string | null;
  onSelectNode: (id: string) => void;
  onSelectEdge: (id: string) => void;
  onMoveNode: (id: string, x: number, y: number) => void;
}

type CircleData = {
  label: string;
  fill: string;
  selected: boolean;
  dimmed: boolean;
};

type GraphEdgeData = {
  directed: boolean;
};

/** Ακτίνα κύκλου + περίγραμμα, ώστε η γραμμή/βέλος να σταματά στην περιφέρεια. */
const NODE_RADIUS = 28;
const ARROW_LENGTH = 14;
const ARROW_WIDTH = 7;

const centerHandleStyle: React.CSSProperties = {
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1,
  height: 1,
  opacity: 0,
  border: 'none',
  background: 'transparent',
  pointerEvents: 'none',
};

const CircleNode: React.FC<NodeProps<Node<CircleData>>> = ({ data }) => (
  <div
    className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full text-sm font-bold text-white shadow-md"
    style={{
      background: data.fill,
      border: data.selected ? '3px solid #0f172a' : '2px solid #fff',
      opacity: data.dimmed ? 0.35 : 1,
    }}
  >
    <Handle id="c-t" type="target" position={Position.Top} style={centerHandleStyle} />
    <Handle id="c-s" type="source" position={Position.Bottom} style={centerHandleStyle} />
    {data.label}
  </div>
);

const GraphEdge: React.FC<EdgeProps<Edge<GraphEdgeData>>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style,
  data,
  selected,
}) => {
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const directed = Boolean(data?.directed);
  const tipPad = NODE_RADIUS + 3;
  const x1 = sourceX + ux * NODE_RADIUS;
  const y1 = sourceY + uy * NODE_RADIUS;
  const tipX = targetX - ux * tipPad;
  const tipY = targetY - uy * tipPad;
  const lineEndX = directed ? tipX - ux * ARROW_LENGTH : tipX;
  const lineEndY = directed ? tipY - uy * ARROW_LENGTH : tipY;
  const [path] = getStraightPath({
    sourceX: x1,
    sourceY: y1,
    targetX: lineEndX,
    targetY: lineEndY,
  });
  const color = (style?.stroke as string | undefined) ?? '#f0b4c4';
  const px = -uy * ARROW_WIDTH;
  const py = ux * ARROW_WIDTH;

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        style={{ ...style, stroke: color }}
        interactionWidth={24}
      />
      {directed && len > NODE_RADIUS * 2 ? (
        <polygon
          points={`${tipX},${tipY} ${tipX - ux * ARROW_LENGTH + px},${tipY - uy * ARROW_LENGTH + py} ${tipX - ux * ARROW_LENGTH - px},${tipY - uy * ARROW_LENGTH - py}`}
          fill={color}
          stroke={color}
          strokeLinejoin="round"
          className={selected ? 'opacity-100' : undefined}
        />
      ) : null}
    </>
  );
};

const nodeTypes = { circle: CircleNode };
const edgeTypes = { graph: GraphEdge };

const GraphCanvas: React.FC<Props> = ({
  graph,
  directed,
  highlights,
  edgeHighlights,
  selectedId,
  selectedEdgeId,
  onSelectNode,
  onSelectEdge,
  onMoveNode,
}) => {
  const { fitView } = useReactFlow();

  const builtNodes: Node<CircleData>[] = useMemo(
    () =>
      Object.values(graph.vertices).map((v) => {
        const hl = highlights[v.id] as NodeHighlight | undefined;
        return {
          id: v.id,
          type: 'circle',
          position: { x: v.x, y: v.y },
          data: {
            label: v.label,
            fill: nodeFill(hl),
            selected: selectedId === v.id,
            dimmed: hl === 'deleting',
          },
          // Χωρίς default top/bottom handles από το style του node
          style: { width: 52, height: 52, padding: 0, border: 'none', background: 'transparent' },
        };
      }),
    [graph.vertices, highlights, selectedId]
  );

  const builtEdges: Edge<GraphEdgeData>[] = useMemo(
    () =>
      graph.edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: 'c-s',
        targetHandle: 'c-t',
        type: 'graph',
        data: { directed },
        animated: edgeHighlights[e.id] === 'active',
        style: {
          stroke: edgeStroke(edgeHighlights[e.id] as 'active' | 'visited' | 'default'),
          strokeWidth:
            selectedEdgeId === e.id || edgeHighlights[e.id] === 'active' ? 3.5 : 2,
        },
      })),
    [graph.edges, edgeHighlights, directed, selectedEdgeId]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(builtNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(builtEdges);

  useEffect(() => {
    setNodes(builtNodes);
    setEdges(builtEdges);
    const t = window.setTimeout(() => {
      void fitView({ padding: 0.25, duration: 200 });
    }, 50);
    return () => window.clearTimeout(t);
  }, [builtNodes, builtEdges, setNodes, setEdges, fitView]);

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{ type: 'graph' }}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, n) => onSelectNode(n.id)}
        onEdgeClick={(_, e) => onSelectEdge(e.id)}
        onNodeDragStop={(_, n) => onMoveNode(n.id, n.position.x, n.position.y)}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.3}
        maxZoom={1.8}
        proOptions={{ hideAttribution: true }}
        className="bg-transparent"
      >
        <Controls showInteractive={false} />
      </ReactFlow>
    </>
  );
};

export const GraphVisualizer: React.FC<Props> = React.memo((props) => (
  <div className="absolute inset-0 h-full w-full">
    <ReactFlowProvider>
      <GraphCanvas {...props} />
    </ReactFlowProvider>
  </div>
));

GraphVisualizer.displayName = 'GraphVisualizer';
