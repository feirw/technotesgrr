import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Target, Clock3, Trophy } from 'lucide-react';

const STORAGE_KEY = 'studyTimer:v1';

type TimerState = {
  elapsedMs: number;
  isRunning: boolean;
  dailyGoalMin: number;
  sessionsToday: number;
  lastDayKey: string;
};

const getDayKey = () => new Date().toISOString().slice(0, 10);

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hh = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const mm = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const ss = String(totalSeconds % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
};

const StudyTimerPage: React.FC = () => {
  const [timer, setTimer] = useState<TimerState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return {
          elapsedMs: 0,
          isRunning: false,
          dailyGoalMin: 120,
          sessionsToday: 0,
          lastDayKey: getDayKey(),
        };
      }
      const parsed = JSON.parse(raw) as TimerState;
      if (parsed.lastDayKey !== getDayKey()) {
        return {
          ...parsed,
          elapsedMs: 0,
          sessionsToday: 0,
          isRunning: false,
          lastDayKey: getDayKey(),
        };
      }
      return parsed;
    } catch {
      return {
        elapsedMs: 0,
        isRunning: false,
        dailyGoalMin: 120,
        sessionsToday: 0,
        lastDayKey: getDayKey(),
      };
    }
  });

  const lastTickRef = useRef<number>(Date.now());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timer));
  }, [timer]);

  useEffect(() => {
    if (!timer.isRunning) return;
    lastTickRef.current = Date.now();

    const id = window.setInterval(() => {
      const now = Date.now();
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;
      setTimer((prev) => ({ ...prev, elapsedMs: prev.elapsedMs + delta }));
    }, 250);

    return () => window.clearInterval(id);
  }, [timer.isRunning]);

  const studiedMin = useMemo(() => Math.floor(timer.elapsedMs / 60000), [timer.elapsedMs]);
  const progress = useMemo(
    () => Math.min(100, Math.round((studiedMin / Math.max(timer.dailyGoalMin, 1)) * 100)),
    [studiedMin, timer.dailyGoalMin]
  );
  const goalReached = progress >= 100;

  const onStartPause = () => {
    setTimer((prev) => {
      const nextRunning = !prev.isRunning;
      return {
        ...prev,
        isRunning: nextRunning,
        sessionsToday: !prev.isRunning ? prev.sessionsToday + 1 : prev.sessionsToday,
      };
    });
  };

  const onReset = () => {
    if (!window.confirm('Θέλεις να μηδενίσεις τον σημερινό χρόνο;')) return;
    setTimer((prev) => ({ ...prev, elapsedMs: 0, isRunning: false, sessionsToday: 0 }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-wash via-white to-coral-wash dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl border-2 border-coral-accent/25 dark:border-gray-700 shadow-xl p-6 sm:p-8"
        >
          <h1 className="text-3xl sm:text-4xl font-black text-coral-accent dark:text-coral-light text-center mb-2">
            Study Timer
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
            Βάλε χρόνο διαβάσματος και κάνε track την πρόοδό σου.
          </p>

          <div className="text-center mb-8 py-4 sm:py-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-coral-wash text-coral-strong dark:bg-coral-accent/15 dark:text-coral-light font-semibold mb-6 border border-coral-accent/20">
              <Clock3 className="w-5 h-5" />
              Σημερινός χρόνος
            </div>
            <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-coral-accent dark:text-coral-light tracking-wider tabular-nums leading-none">
              {formatTime(timer.elapsedMs)}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={onStartPause}
              className="px-5 py-3 rounded-xl bg-coral-accent hover:bg-coral-strong text-white font-bold shadow hover:opacity-95 flex items-center gap-2 transition-colors"
            >
              {timer.isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {timer.isRunning ? 'Παύση' : 'Έναρξη'}
            </button>
            <button
              onClick={onReset}
              className="px-5 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-coral-accent/35 dark:border-gray-700 text-coral-strong dark:text-coral-light font-bold flex items-center gap-2 hover:border-coral-accent transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Μηδενισμός
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-coral-wash dark:bg-gray-800 border border-coral-accent/25 dark:border-gray-700 rounded-xl p-4">
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Sessions σήμερα</div>
              <div className="text-2xl font-black text-coral-accent dark:text-coral-light">{timer.sessionsToday}</div>
            </div>
            <div className="bg-coral-wash dark:bg-gray-800 border border-coral-accent/25 dark:border-gray-700 rounded-xl p-4">
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Λεπτά μελέτης</div>
              <div className="text-2xl font-black text-coral-accent dark:text-coral-light">{studiedMin}</div>
            </div>
            <div className="bg-coral-wash dark:bg-gray-800 border border-coral-accent/25 dark:border-gray-700 rounded-xl p-4">
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Ημερήσιος στόχος</div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-coral-accent" />
                <input
                  type="number"
                  min={10}
                  step={5}
                  value={timer.dailyGoalMin}
                  onChange={(e) =>
                    setTimer((prev) => ({
                      ...prev,
                      dailyGoalMin: Math.max(10, Number(e.target.value) || 10),
                    }))
                  }
                  className="w-24 px-2 py-1 rounded border border-coral-accent/40 dark:border-gray-600 text-coral-strong dark:text-coral-light font-bold bg-white dark:bg-gray-900"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">λεπτά</span>
              </div>
            </div>
          </div>

          <div className="mb-3 flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-200">
            <span>Πρόοδος στόχου</span>
            <span>{progress}%</span>
          </div>
          <div className="h-3 bg-coral-accent/15 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-coral-accent to-coral-strong"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {goalReached && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 font-semibold flex items-center gap-2"
            >
              <Trophy className="w-5 h-5" />
              Μπράβο! Ο σημερινός στόχος μελέτης ολοκληρώθηκε.
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StudyTimerPage;
