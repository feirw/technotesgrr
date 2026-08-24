import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ALGORITHMS, ALGO_SECTIONS, getAlgo } from './catalog';
import { buildSteps, parseArray, randomArray } from './engines';
import { ArrayStrip } from './components/ArrayViews';
import { CodePanel } from './components/CodePanel';
import { ControlsBar } from './components/ControlsBar';
import type { AlgoId, SortOrder } from './types';
import { CELL_FILL, CELL_LABEL } from './types';
import { Maximize2, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';

function speedToMs(speed: number): number {
  const clamped = Math.min(2.8, Math.max(0.35, speed));
  return Math.round(1100 / clamped);
}

export const AlgoVisualizer: React.FC = () => {
  const [algoId, setAlgoId] = useState<AlgoId>('bubble');
  const algo = getAlgo(algoId);

  const [array, setArray] = useState<number[]>(() => randomArray(12));
  const [arrayText, setArrayText] = useState('');
  const [nText, setNText] = useState('12');
  const [keyText, setKeyText] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [speed, setSpeed] = useState(1);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [message, setMessage] = useState('Διάλεξε αλγόριθμο και πάτα Εκτέλεση ή Βήμα-Βήμα.');
  const [messageType, setMessageType] = useState<'info' | 'ok' | 'error'>('info');
  const [fitAll, setFitAll] = useState(true);

  const timer = useRef<number | null>(null);
  const stepIndexRef = useRef(0);

  const keyValue = Number(keyText);
  const codeLines = useMemo(() => algo.code(order), [algo, order]);

  const steps = useMemo(() => {
    const k = keyText.trim() === '' || !Number.isFinite(keyValue) ? array[Math.floor(array.length / 2)] : keyValue;
    return buildSteps(algoId, array, { key: k, order });
  }, [algoId, array, keyValue, keyText, order]);

  const current = steps[Math.min(stepIndex, Math.max(0, steps.length - 1))];

  const stopTimer = () => {
    if (timer.current) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
  };

  const resetPlayback = useCallback(() => {
    stopTimer();
    setPlaying(false);
    setStepIndex(0);
    stepIndexRef.current = 0;
    setMessage('Έτοιμο. Πάτα Εκτέλεση ή Βήμα-Βήμα.');
    setMessageType('info');
  }, []);

  useEffect(() => {
    resetPlayback();
  }, [algoId, array, keyText, order, resetPlayback]);

  useEffect(() => {
    stepIndexRef.current = stepIndex;
  }, [stepIndex]);

  useEffect(() => {
    if (!playing) {
      stopTimer();
      return;
    }
    timer.current = window.setInterval(() => {
      const i = stepIndexRef.current;
      if (i >= steps.length - 1) {
        stopTimer();
        setPlaying(false);
        return;
      }
      setStepIndex(i + 1);
    }, speedToMs(speed));
    return stopTimer;
  }, [playing, speed, steps.length]);

  useEffect(() => {
    if (current?.message) {
      setMessage(current.message);
      setMessageType(current.done ? 'ok' : 'info');
    }
  }, [current]);

  const loadArray = () => {
    const parsed = parseArray(arrayText);
    if (!parsed) {
      setMessage('Γράψε τουλάχιστον 2 αριθμούς χωρισμένους με κενά.');
      setMessageType('error');
      return;
    }
    setArray(algoId === 'binary' ? [...parsed].sort((a, b) => a - b) : parsed);
    setMessage('Φορτώθηκε ο πίνακας.');
    setMessageType('ok');
  };

  const makeRandom = () => {
    const n = Math.max(2, Math.min(20, Number(nText) || 12));
    const next = randomArray(n);
    setArray(algoId === 'binary' ? next.sort((a, b) => a - b) : next);
    setMessage('Δημιουργήθηκε νέος τυχαίος πίνακας.');
    setMessageType('ok');
  };

  const canStep = stepIndex < steps.length - 1;

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start">
        <select
          className="h-10 min-w-[260px] shrink-0 rounded-xl border border-[#ff97b2]/30 bg-white px-3 text-sm font-semibold dark:border-white/15 dark:bg-[#1a1028]"
          value={algoId}
          onChange={(e) => setAlgoId(e.target.value as AlgoId)}
        >
          {ALGO_SECTIONS.map((section) => (
            <optgroup key={section.id} label={section.title}>
              {ALGORITHMS.filter((a) => a.section === section.id).map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <div className="min-w-0 flex-1">
          <ControlsBar
            playing={playing}
            canStep={canStep}
            speed={speed}
            arrayText={arrayText}
            nText={nText}
            keyText={keyText}
            showKey={algo.needsKey}
            order={order}
            showOrder={algo.needsOrder}
            onPlay={() => {
              if (stepIndex >= steps.length - 1) setStepIndex(0);
              setPlaying(true);
            }}
            onPause={() => setPlaying(false)}
            onStep={() => {
              if (canStep) setStepIndex((i) => i + 1);
            }}
            onReset={resetPlayback}
            onSpeed={setSpeed}
            onArrayText={setArrayText}
            onLoadArray={loadArray}
            onNText={setNText}
            onRandom={makeRandom}
            onKeyText={setKeyText}
            onOrder={setOrder}
          />
        </div>
      </div>

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

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(280px,38%)_1fr]">
        <CodePanel lines={codeLines} active={current?.line ?? 0} />
        <div className="flex min-h-[280px] min-w-0 flex-col rounded-2xl border border-[#ff97b2]/25 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#1a1028] sm:p-6">
          <div className="mb-3 flex justify-end">
            <button
              type="button"
              onClick={() => setFitAll((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#ff97b2]/40 px-2.5 py-1 text-[11px] font-semibold text-[#f07f97] hover:bg-[#ff97b2]/10 dark:border-white/20 dark:text-[#ffc4d6]"
            >
              {fitAll ? <ZoomIn className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              {fitAll ? 'Μεγέθυνση' : 'Όλος ο πίνακας'}
            </button>
          </div>
          <div className="flex min-h-0 flex-1 flex-col justify-center gap-6 overflow-x-hidden">
            {current?.arrays.map((view, idx) => (
              <ArrayStrip key={`${view.label ?? idx}`} view={view} fitAll={fitAll} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        {(Object.keys(CELL_FILL) as (keyof typeof CELL_FILL)[]).map((role) => (
          <span key={role} className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded" style={{ background: CELL_FILL[role] }} />
            {CELL_LABEL[role]}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AlgoVisualizer;
