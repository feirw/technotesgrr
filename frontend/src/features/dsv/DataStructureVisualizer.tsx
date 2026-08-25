import React, { useRef } from 'react';
import { useDsvStore } from './store/dsvStore';
import { BuildPanel } from './components/BuildPanel';
import { VisualizerStage } from './components/VisualizerStage';
import { STRUCTURE_KINDS, STRUCTURE_LABELS } from './types';
import type { StructureKind } from './types';
import { cn } from '@/lib/utils';

const STRUCTURE_HINTS: Partial<Record<StructureKind, string>> = {
  'binary-tree':
    'Πάτα πάνω στον κόμβο που θέλεις να συνδέσεις και μετά «Αριστερά» ή «Δεξιά».',
  'general-tree': 'Πάτα πάνω στον κόμβο-γονέα για να τον επιλέξεις και μετά πρόσθεσε παιδί.',
  'linked-list': 'Πάτα πάνω στον κόμβο για να προσθέσεις μετά από αυτόν.',
  'directed-graph':
    'Πάτα πάνω στην κορυφή για να την επιλέξεις. Για ακμή: Από, Προς και + Ακμή στην ίδια γραμμή.',
  'undirected-graph':
    'Πάτα πάνω στην κορυφή για να την επιλέξεις. Για ακμή: Από, Προς και + Ακμή στην ίδια γραμμή.',
};

export const DataStructureVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const kind = useDsvStore((s) => s.structure.kind);
  const setKind = useDsvStore((s) => s.setKind);
  const message = useDsvStore((s) => s.message);
  const messageType = useDsvStore((s) => s.messageType);

  return (
    <div className="min-h-[100dvh] bg-[#fff5f8] px-3 py-4 text-slate-900 dark:bg-[#2d1c48] dark:text-[#faf5ef] sm:px-6 sm:py-6">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start">
          <select
            className="h-10 min-w-[220px] shrink-0 rounded-xl border border-[#ff97b2]/30 bg-white px-3 text-sm font-semibold dark:border-white/15 dark:bg-[#1a1028]"
            value={kind}
            onChange={(e) => setKind(e.target.value as StructureKind)}
          >
            {STRUCTURE_KINDS.map((k) => (
              <option key={k} value={k}>
                {STRUCTURE_LABELS[k]}
              </option>
            ))}
          </select>
          <div className="min-w-0 flex-1">
            <BuildPanel />
          </div>
        </div>

        {STRUCTURE_HINTS[kind] ? (
          <p className="rounded-xl border border-[#ff97b2]/20 bg-white/70 px-4 py-2 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            {STRUCTURE_HINTS[kind]}
          </p>
        ) : null}

        <div
          role="status"
          className={cn(
            'rounded-xl px-4 py-2.5 text-sm font-medium',
            messageType === 'error' &&
              'border border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-200',
            messageType === 'ok' &&
              'border border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-200',
            messageType === 'info' &&
              'border border-[#ff97b2]/30 bg-[#fff5f8] text-[#f07f97] dark:border-white/10 dark:bg-white/5 dark:text-[#ffc4d6]'
          )}
        >
          {message}
        </div>

        <VisualizerStage canvasRef={canvasRef} />
      </div>
    </div>
  );
};

export default DataStructureVisualizer;
