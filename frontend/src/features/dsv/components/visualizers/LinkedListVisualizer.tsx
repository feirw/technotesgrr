import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { LinkedListState, NodeHighlight } from '../../types';
import { nodeFill } from '../../utils/highlightColor';
import { DSV_COLORS } from '../../types';

interface Props {
  list: LinkedListState;
  highlights: Record<string, NodeHighlight | string>;
  edgeHighlights: Record<string, string>;
  pointerHighlights?: Record<string, string | null>;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function PointerArrow({ active = false }: { active?: boolean }) {
  const color = active ? DSV_COLORS.activeEdge : DSV_COLORS.primary;
  return (
    <div className="flex w-10 shrink-0 items-center" aria-hidden>
      <div className="h-1 flex-1 rounded-full" style={{ background: color }} />
      <div
        className="h-0 w-0 border-y-[6px] border-y-transparent border-l-[10px]"
        style={{ borderLeftColor: color }}
      />
    </div>
  );
}

export const LinkedListVisualizer: React.FC<Props> = React.memo(
  ({ list, highlights, edgeHighlights, pointerHighlights, selectedId, onSelect }) => {
    const ids = useMemo(() => {
      const out: string[] = [];
      let cur = list.headId;
      while (cur) {
        out.push(cur);
        cur = list.nodes[cur]?.next ?? null;
      }
      return out;
    }, [list]);

    return (
      <div className="flex h-full min-h-[220px] items-center overflow-x-auto px-4 py-10">
        <div className="mx-auto flex items-center gap-1 sm:gap-2">
          <div className="mr-1 flex shrink-0 flex-col items-center gap-1">
            <span className="text-[10px] font-black uppercase tracking-wide text-[#f07f97] dark:text-[#ffc4d6]">
              Κεφαλή
            </span>
            <div
              className="flex h-10 items-center rounded-lg border-2 border-[#ff97b2]/50 bg-[#fff5f8] px-2 text-xs font-bold text-[#f07f97] dark:border-[#ffc4d6]/40 dark:bg-[#ff97b2]/10 dark:text-[#ffc4d6]"
              aria-label="Δείκτης κεφαλής"
            >
              head
            </div>
          </div>

          {ids.length > 0 ? (
            <PointerArrow />
          ) : (
            <div className="mx-2 flex items-center gap-1 text-xs font-semibold text-slate-400">
              <PointerArrow />
              <span>null</span>
            </div>
          )}

          {ids.length === 0 && (
            <span className="rounded-lg border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500 dark:border-white/20">
              Κενή λίστα
            </span>
          )}

          {ids.map((id, index) => {
            const node = list.nodes[id];
            const hl = highlights[id] as NodeHighlight | undefined;
            const edgeKey = node.next ? `${id}->${node.next}` : '';
            const active = Boolean(edgeKey && edgeHighlights[edgeKey] === 'active');
            const isCurr = pointerHighlights?.curr === id;
            const isHead = list.headId === id;

            return (
              <React.Fragment key={id}>
                <motion.button
                  type="button"
                  layout
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: hl === 'deleting' ? 0.7 : 1,
                    opacity: hl === 'deleting' ? 0.3 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                  onClick={() => onSelect(id)}
                  className="relative flex h-16 w-28 shrink-0 items-stretch overflow-visible rounded-xl border-2 text-white shadow-md"
                  style={{
                    background: nodeFill(hl),
                    borderColor: selectedId === id ? '#0f172a' : 'transparent',
                  }}
                >
                  <span className="flex flex-1 items-center justify-center text-lg font-bold">
                    {node.value}
                  </span>
                  <span className="flex w-10 items-center justify-center border-l border-white/30 text-xs">
                    {node.next ? '•' : '∅'}
                  </span>
                  {isHead && (
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-[#f07f97] dark:text-[#ffc4d6]">
                      ← κεφαλή
                    </span>
                  )}
                  {isCurr && !isHead && (
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500">
                      τρέχον
                    </span>
                  )}
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-400">
                    [{index}]
                  </span>
                </motion.button>
                {node.next && <PointerArrow active={active} />}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }
);

LinkedListVisualizer.displayName = 'LinkedListVisualizer';
