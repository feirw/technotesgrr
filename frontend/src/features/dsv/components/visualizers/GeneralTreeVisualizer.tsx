import React, { useEffect, useMemo } from 'react';
import {
  Controls,
  Handle,
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
import type { GeneralTreeState, NodeHighlight } from '../../types';
import { layoutGeneralTree } from '../../utils/treeLayout';
import { edgeStroke, nodeFill } from '../../utils/highlightColor';
import { formatNodeLabel } from '../../utils/formatLabel';

interface Props {
  tree: GeneralTreeState;
  highlights: Record<string, NodeHighlight | string>;
  edgeHighlights: Record<string, string>;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

type CircleData = {
  label: string;
  fill: string;
  selected: boolean;
  dimmed: boolean;
};

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
    className="relative flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-full text-sm font-bold text-white shadow-md"
    title={data.label}
    style={{
      background: data.fill,
      border: data.selected ? '3px solid #0f172a' : '2px solid #fff',
      opacity: data.dimmed ? 0.35 : 1,
    }}
  >
    <Handle id="c-t" type="target" position={Position.Top} style={centerHandleStyle} />
    <Handle id="c-s" type="source" position={Position.Bottom} style={centerHandleStyle} />
    <span className="max-w-[44px] truncate px-0.5 text-center text-xs leading-tight">
      {formatNodeLabel(data.label, 6)}
    </span>
  </div>
);

const nodeTypes = { circle: CircleNode };

const TreeCanvas: React.FC<Props> = ({
  tree,
  highlights,
  edgeHighlights,
  selectedId,
  onSelect,
}) => {
  const { fitView } = useReactFlow();
  const layout = useMemo(() => layoutGeneralTree(tree), [tree]);
  const byId = useMemo(() => Object.fromEntries(layout.map((p) => [p.id, p])), [layout]);

  const builtNodes: Node<CircleData>[] = useMemo(
    () =>
      layout.map((p) => {
        const n = tree.nodes[p.id];
        const hl = highlights[p.id] as NodeHighlight | undefined;
        return {
          id: p.id,
          type: 'circle',
          position: { x: p.x, y: p.y },
          data: {
            label: `${n.label}${n.collapsed ? '+' : ''}`,
            fill: nodeFill(hl),
            selected: selectedId === p.id,
            dimmed: hl === 'deleting',
          },
          style: { width: 52, height: 52, padding: 0, border: 'none', background: 'transparent' },
        };
      }),
    [layout, tree.nodes, highlights, selectedId]
  );

  const builtEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    for (const n of Object.values(tree.nodes)) {
      if (n.collapsed) continue;
      for (const c of n.children) {
        if (!byId[c]) continue;
        const key = `${n.id}->${c}`;
        edges.push({
          id: key,
          source: n.id,
          target: c,
          sourceHandle: 'c-s',
          targetHandle: 'c-t',
          type: 'straight',
          animated: edgeHighlights[key] === 'active',
          style: {
            stroke: edgeStroke(edgeHighlights[key] as 'active' | 'visited' | 'default'),
            strokeWidth: edgeHighlights[key] === 'active' ? 3 : 2,
          },
        });
      }
    }
    return edges;
  }, [tree.nodes, byId, edgeHighlights]);

  const [nodes, setNodes, onNodesChange] = useNodesState(builtNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(builtEdges);
  const nodeCount = layout.length;

  useEffect(() => {
    setNodes(builtNodes);
    setEdges(builtEdges);
  }, [builtNodes, builtEdges, setNodes, setEdges]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      void fitView({ padding: 0.2, duration: 220, minZoom: 0.08, maxZoom: 1.6 });
    }, 50);
    return () => window.clearTimeout(t);
  }, [nodeCount, fitView]);

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{ type: 'straight' }}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, n) => onSelect(n.id)}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.08}
        maxZoom={2}
        panOnScroll
        zoomOnPinch
        panOnDrag
        proOptions={{ hideAttribution: true }}
        className="bg-transparent dsv-flow"
      >
        <Controls showInteractive={false} />
      </ReactFlow>
    </>
  );
};

export const GeneralTreeVisualizer: React.FC<Props> = React.memo((props) => (
  <div className="absolute inset-0 h-full w-full">
    <ReactFlowProvider>
      <TreeCanvas {...props} />
    </ReactFlowProvider>
  </div>
));

GeneralTreeVisualizer.displayName = 'GeneralTreeVisualizer';
