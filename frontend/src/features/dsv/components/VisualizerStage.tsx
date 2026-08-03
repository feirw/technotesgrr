import React from 'react';
import { useDsvStore } from '../store/dsvStore';
import { BinaryTreeVisualizer } from './visualizers/BinaryTreeVisualizer';
import { GeneralTreeVisualizer } from './visualizers/GeneralTreeVisualizer';
import { LinkedListVisualizer } from './visualizers/LinkedListVisualizer';
import { GraphVisualizer } from './visualizers/GraphVisualizer';
import { deepClone } from '../utils/clone';

interface Props {
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

export const VisualizerStage: React.FC<Props> = ({ canvasRef }) => {
  const structure = useDsvStore((s) => s.structure);
  const selectedNodeId = useDsvStore((s) => s.selectedNodeId);
  const selectedEdgeId = useDsvStore((s) => s.selectedEdgeId);
  const selectNode = useDsvStore((s) => s.selectNode);
  const selectEdge = useDsvStore((s) => s.selectEdge);
  const setStructure = useDsvStore((s) => s.setStructure);

  const emptyHl = {};

  return (
    <div
      ref={canvasRef}
      className="relative h-[min(70vh,640px)] w-full overflow-hidden rounded-2xl border border-[#ff97b2]/25 bg-white shadow-sm dark:border-white/10 dark:bg-[#1a1028]"
    >
      {(structure.kind === 'binary-tree' || structure.kind === 'bst') && (
        <BinaryTreeVisualizer
          tree={structure.data}
          highlights={emptyHl}
          edgeHighlights={emptyHl}
          selectedId={selectedNodeId}
          onSelect={selectNode}
        />
      )}
      {structure.kind === 'general-tree' && (
        <GeneralTreeVisualizer
          tree={structure.data}
          highlights={emptyHl}
          edgeHighlights={emptyHl}
          selectedId={selectedNodeId}
          onSelect={selectNode}
        />
      )}
      {structure.kind === 'linked-list' && (
        <LinkedListVisualizer
          list={structure.data}
          highlights={emptyHl}
          edgeHighlights={emptyHl}
          selectedId={selectedNodeId}
          onSelect={selectNode}
        />
      )}
      {(structure.kind === 'directed-graph' || structure.kind === 'undirected-graph') && (
        <GraphVisualizer
          graph={structure.data}
          directed={structure.kind === 'directed-graph'}
          highlights={emptyHl}
          edgeHighlights={emptyHl}
          selectedId={selectedNodeId}
          selectedEdgeId={selectedEdgeId}
          onSelectNode={selectNode}
          onSelectEdge={selectEdge}
          onMoveNode={(id, x, y) => {
            const next = deepClone(structure);
            if (next.kind !== 'directed-graph' && next.kind !== 'undirected-graph') return;
            if (!next.data.vertices[id]) return;
            next.data.vertices[id].x = x;
            next.data.vertices[id].y = y;
            setStructure(next);
          }}
        />
      )}
    </div>
  );
};
