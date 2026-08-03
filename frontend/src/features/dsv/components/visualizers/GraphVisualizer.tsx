import React, { useEffect, useMemo } from 'react';
import {
  Background,
  Controls,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Edge,
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

/** Κρυφό handle στο κέντρο — οι ακμές ξεκινούν/καταλήγουν στη μέση του κύκλου. */
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

const nodeTypes = { circle: CircleNode };

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

  const builtEdges: Edge[] = useMemo(
    () =>
      graph.edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: 'c-s',
        targetHandle: 'c-t',
        type: 'straight',
        animated: edgeHighlights[e.id] === 'active',
        style: {
          stroke: edgeStroke(edgeHighlights[e.id] as 'active' | 'visited' | 'default'),
          strokeWidth:
            selectedEdgeId === e.id || edgeHighlights[e.id] === 'active' ? 3.5 : 2,
        },
        markerEnd: directed
          ? {
              type: MarkerType.ArrowClosed,
              color: edgeStroke(edgeHighlights[e.id] as 'active' | 'visited' | 'default'),
            }
          : undefined,
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
        defaultEdgeOptions={{ type: 'straight' }}
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
        <Background gap={18} size={1} color="#cbd5e1" />
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
