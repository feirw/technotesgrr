import React from 'react';
import { motion } from 'framer-motion';
import type { ArrayView, CellRole, Pointers } from '../types';
import { CELL_FILL } from '../types';

const POINTER_LABEL: Record<keyof Pointers, string> = {
  i: 'i',
  j: 'j',
  min: 'ελάχ',
  max: 'μέγ',
  low: 'αρχή',
  high: 'τέλος',
  mid: 'μέση',
};

function pointerTags(pointers: Pointers | undefined, index: number): string[] {
  if (!pointers) return [];
  return (Object.keys(POINTER_LABEL) as (keyof Pointers)[])
    .filter((k) => pointers[k] === index)
    .map((k) => POINTER_LABEL[k]);
}

const ArrayCell: React.FC<{
  value: number | null;
  role: CellRole;
  index: number;
  tags: string[];
  onClick?: () => void;
  dimmed?: boolean;
}> = ({ value, role, index, tags, onClick, dimmed }) => {
  return (
    <motion.div layout className="flex w-12 shrink-0 flex-col items-center gap-1 sm:w-14">
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          className="flex h-12 w-12 items-center justify-center rounded-xl text-base font-black text-white shadow-md sm:h-14 sm:w-14 sm:text-lg"
          style={{
            background: CELL_FILL[role],
            opacity: dimmed || role === 'discard' ? 0.45 : 1,
            outline: tags.length ? '2px solid #0f172a' : undefined,
            outlineOffset: 2,
          }}
        >
          {value ?? '·'}
        </button>
      ) : (
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl text-base font-black text-white shadow-md sm:h-14 sm:w-14 sm:text-lg"
          style={{
            background: CELL_FILL[role],
            opacity: dimmed || role === 'discard' ? 0.45 : 1,
            outline: tags.length ? '2px solid #0f172a' : undefined,
            outlineOffset: 2,
          }}
        >
          {value ?? '·'}
        </div>
      )}
      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">{index + 1}</span>
      <div className="flex min-h-[14px] flex-wrap justify-center gap-0.5">
        {tags.map((t) => (
          <span
            key={t}
            className="rounded bg-[#f07f97]/15 px-1 text-[9px] font-black uppercase tracking-wide text-[#c2185b] dark:text-[#ffc4d6]"
          >
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export const ArrayStrip: React.FC<{
  view: ArrayView;
  onCellClick?: (index: number) => void;
}> = ({ view, onCellClick }) => (
  <div className="w-full">
    {view.label ? (
      <p className="mb-2 text-xs font-black uppercase tracking-wide text-[#f07f97] dark:text-[#ffc4d6]">
        {view.label}
      </p>
    ) : null}
    <div className="flex items-start justify-center gap-1 overflow-x-auto pb-2 sm:gap-2">
      {view.values.map((value, index) => (
        <ArrayCell
          key={`${view.label ?? 'a'}-${index}`}
          value={value}
          role={view.roles[index] ?? 'default'}
          index={index}
          tags={pointerTags(view.pointers, index)}
          onClick={onCellClick ? () => onCellClick(index) : undefined}
        />
      ))}
    </div>
  </div>
);
