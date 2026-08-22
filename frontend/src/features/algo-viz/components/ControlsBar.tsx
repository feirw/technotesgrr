import React from 'react';
import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react';
import type { SortOrder } from '../types';
import { cn } from '@/lib/utils';

const btn =
  'inline-flex items-center gap-1.5 rounded-lg bg-[#ff97b2] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#ff80a3] disabled:opacity-40';
const btnGhost =
  'inline-flex items-center gap-1.5 rounded-lg border border-[#ff97b2]/40 px-3 py-1.5 text-xs font-semibold text-[#f07f97] hover:bg-[#ff97b2]/10 disabled:opacity-40 dark:border-white/20 dark:text-[#ffc4d6]';
const field =
  'h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm dark:border-white/15 dark:bg-[#1a1028] dark:text-white';

interface Props {
  playing: boolean;
  canStep: boolean;
  speed: number;
  arrayText: string;
  nText: string;
  keyText?: string;
  showKey?: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeed: (v: number) => void;
  onArrayText: (v: string) => void;
  onLoadArray: () => void;
  onNText: (v: string) => void;
  onRandom: () => void;
  onKeyText?: (v: string) => void;
  order?: SortOrder;
  showOrder?: boolean;
  onOrder?: (v: SortOrder) => void;
}

export const ControlsBar: React.FC<Props> = ({
  playing,
  canStep,
  speed,
  arrayText,
  nText,
  keyText,
  showKey,
  onPlay,
  onPause,
  onStep,
  onReset,
  onSpeed,
  onArrayText,
  onLoadArray,
  onNText,
  onRandom,
  onKeyText,
  order,
  showOrder,
  onOrder,
}) => (
  <div className="flex flex-col gap-3">
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" className={btn} onClick={playing ? onPause : onPlay} disabled={!canStep && !playing}>
        {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        {playing ? 'Παύση' : 'Εκτέλεση'}
      </button>
      <button type="button" className={btnGhost} onClick={onStep} disabled={playing || !canStep}>
        <SkipForward className="h-3.5 w-3.5" />
        Βήμα-Βήμα
      </button>
      <button type="button" className={btnGhost} onClick={onReset}>
        <RotateCcw className="h-3.5 w-3.5" />
        Τερματισμός
      </button>
      <label className="ml-auto flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
        Ταχύτητα
        <input
          type="range"
          min={0.35}
          max={2.8}
          step={0.05}
          value={speed}
          onChange={(e) => onSpeed(Number(e.target.value))}
          className="w-28 accent-[#ff97b2]"
        />
      </label>
    </div>

    <div className="flex flex-wrap items-end gap-2">
      <label className="flex min-w-[220px] flex-1 flex-col gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
        Προκαθορισμένος πίνακας (κενοί)
        <input className={field} value={arrayText} onChange={(e) => onArrayText(e.target.value)} placeholder="π.χ. 44 12 87 23 65" />
      </label>
      <button type="button" className={btn} onClick={onLoadArray}>
        Εισαγωγή
      </button>
      <label className="flex w-24 flex-col gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
        Πλήθος Ν
        <input className={field} value={nText} onChange={(e) => onNText(e.target.value)} inputMode="numeric" />
      </label>
      <button type="button" className={btnGhost} onClick={onRandom}>
        Παραγωγή
      </button>
      {showOrder ? (
        <div className="flex flex-col gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
          Σειρά
          <div className="flex h-9 overflow-hidden rounded-lg border border-[#ff97b2]/40">
            {(
              [
                ['asc', 'Αύξουσα'],
                ['desc', 'Φθίνουσα'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={cn(
                  'px-3 text-xs font-semibold transition',
                  order === value
                    ? 'bg-[#ff97b2] text-white'
                    : 'bg-white text-[#f07f97] hover:bg-[#ff97b2]/10 dark:bg-[#1a1028] dark:text-[#ffc4d6]'
                )}
                onClick={() => onOrder?.(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {showKey ? (
        <label className="flex w-28 flex-col gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
          Κλειδί
          <input className={field} value={keyText} onChange={(e) => onKeyText?.(e.target.value)} inputMode="numeric" />
        </label>
      ) : null}
    </div>
  </div>
);
