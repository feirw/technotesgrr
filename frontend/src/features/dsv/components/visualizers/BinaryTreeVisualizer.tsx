import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { BinaryTreeState, NodeHighlight } from '../../types';
import { layoutBinaryTree } from '../../utils/treeLayout';
import { edgeStroke, nodeFill } from '../../utils/highlightColor';

interface Props {
  tree: BinaryTreeState;
  highlights: Record<string, NodeHighlight | string>;
  edgeHighlights: Record<string, string>;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export const BinaryTreeVisualizer: React.FC<Props> = React.memo(
  ({ tree, highlights, edgeHighlights, selectedId, onSelect }) => {
    const layout = useMemo(() => layoutBinaryTree(tree), [tree]);
    const byId = useMemo(() => Object.fromEntries(layout.map((p) => [p.id, p])), [layout]);

    const edges: { key: string; x1: number; y1: number; x2: number; y2: number }[] = [];
    for (const n of Object.values(tree.nodes)) {
      for (const child of [n.left, n.right]) {
        if (!child || !byId[n.id] || !byId[child]) continue;
        edges.push({
          key: `${n.id}->${child}`,
          x1: byId[n.id].x + 28,
          y1: byId[n.id].y + 28,
          x2: byId[child].x + 28,
          y2: byId[child].y + 28,
        });
      }
    }

    const TOP_PAD = 72;
    const width = Math.max(320, ...layout.map((p) => p.x + 80));
    const height = Math.max(280, ...layout.map((p) => p.y + TOP_PAD + 100));

    return (
      <div className="flex h-full w-full items-start justify-center overflow-auto pt-6 sm:pt-10">
        <svg width={width} height={height} className="mx-auto block">
          {edges.map((e) => (
            <motion.line
              key={e.key}
              x1={e.x1}
              y1={e.y1 + TOP_PAD}
              x2={e.x2}
              y2={e.y2 + TOP_PAD}
              stroke={edgeStroke(edgeHighlights[e.key] as 'active' | 'visited' | 'default')}
              strokeWidth={edgeHighlights[e.key] === 'active' ? 3.5 : 2}
              initial={false}
              animate={{ pathLength: 1 }}
            />
          ))}
          {layout.map((p) => {
            const node = tree.nodes[p.id];
            const hl = highlights[p.id] as NodeHighlight | undefined;
            const fill = nodeFill(hl);
            return (
              <motion.g
                key={p.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: hl === 'deleting' ? 0.6 : 1,
                  opacity: hl === 'deleting' ? 0.35 : 1,
                  x: p.x,
                  y: p.y + TOP_PAD,
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                style={{ cursor: 'pointer' }}
                onClick={() => onSelect(p.id)}
              >
                <circle
                  cx={28}
                  cy={28}
                  r={26}
                  fill={fill}
                  stroke={selectedId === p.id ? '#0f172a' : 'white'}
                  strokeWidth={selectedId === p.id ? 3 : 2}
                />
                <text
                  x={28}
                  y={33}
                  textAnchor="middle"
                  className="fill-white text-[13px] font-bold"
                  style={{ pointerEvents: 'none' }}
                >
                  {node.value}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>
    );
  }
);

BinaryTreeVisualizer.displayName = 'BinaryTreeVisualizer';
