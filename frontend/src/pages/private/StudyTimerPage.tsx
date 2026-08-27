import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Target, Clock3, Trophy } from 'lucide-react';
import { PageMenuIcon } from '@/data/menuIcons';
import ShareResultButton from '@/components/shared/ShareResultButton';
import { useAuth } from '@/context/AuthContext';
import { getAuthToken } from '@/context/AuthContext';
import { apiFetch } from '@/utils/apiClient';
import { getBackendUrl } from '@/utils/backendUrl';

const STORAGE_KEY = 'studyTimer:v1';
const BACKEND_URL = getBackendUrl();

type TimerState = {
  elapsedMs: number;
  isRunning: boolean;
  dailyGoalMin: number;
  sessionsToday: number;
  lastDayKey: string;
  streakDays: number;
  /** Day key (YYYY-MM-DD) της τελευταίας ημέρας που έφτασε τον ημερήσιο στόχο. */
  lastCompletedDate: string | null;
};

const getDayKey = () => new Date().toISOString().slice(0, 10);

/** Αριθμός ημερολογιακών ημερών μεταξύ δύο day keys (YYYY-MM-DD). */
const daysBetween = (fromDayKey: string, toDayKey: string) => {
  const from = new Date(`${fromDayKey}T00:00:00`);
  const to = new Date(`${toDayKey}T00:00:00`);
  return Math.round((to.getTime() - from.getTime()) / 86400000);
};

const createFreshTimerState = (): TimerState => ({
  elapsedMs: 0,
  isRunning: false,
  dailyGoalMin: 120,
  sessionsToday: 0,
  lastDayKey: getDayKey(),
  streakDays: 0,
  lastCompletedDate: null,
});

/** Εφαρμόζει το day-rollover (μηδενισμός ημέρας, σπάσιμο σερί αν χρειάζεται) σε οποιαδήποτε
 * αποθηκευμένη τιμή — τοπική ή από τον server — ώστε να συμπεριφέρονται πανομοιότυπα. */
const applyDayRollover = (parsedInput: Partial<TimerState>): TimerState => {
  const parsed = { ...createFreshTimerState(), ...parsedInput };
  const today = getDayKey();
  if (parsed.lastDayKey === today) return parsed;

  const gap = parsed.lastCompletedDate ? daysBetween(parsed.lastCompletedDate, today) : Infinity;
  return {
    ...parsed,
    elapsedMs: 0,
    sessionsToday: 0,
    isRunning: false,
    lastDayKey: today,
    streakDays: gap > 1 ? 0 : parsed.streakDays,
  };
};

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hh = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const mm = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const ss = String(totalSeconds % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
};

const StudyTimerPage: React.FC = () => {
  const { user } = useAuth();
  const hydratedForUserRef = useRef<number | null>(null);
  const skipNextPushRef = useRef(false);

  const [timer, setTimer] = useState<TimerState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return createFreshTimerState();
      return applyDayRollover(JSON.parse(raw) as Partial<TimerState>);
    } catch {
      return createFreshTimerState();
    }
  });

  const lastTickRef = useRef<number>(Date.now());

  // Στο login, φέρε το αντίγραφο του server μία φορά (περνώντας το από το ίδιο day-rollover
  // ώστε να συμπεριφέρεται όπως η τοπική τιμή) και συγχώνευσέ το.
  useEffect(() => {
    if (!user || hydratedForUserRef.current === user.id) return;
    hydratedForUserRef.current = user.id;

    const token = getAuthToken();
    if (!token) return;

    apiFetch<{ data: Partial<TimerState> | null }>(`${BACKEND_URL}/api/progress/${STORAGE_KEY}`, {
      headers: { Authorization: `Bearer ${token}` },
      retries: 0,
    })
      .then((res) => {
        if (res.data) {
          skipNextPushRef.current = true;
          setTimer(applyDayRollover(res.data));
        }
      })
      .catch(() => {
        // offline-first: αν αποτύχει, μένουμε στην τοπική τιμή.
      });
  }, [user]);

  // Πάντα τοπικά· αν είναι συνδεδεμένος, σπρώχνουμε (debounced) και στον server.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timer));

    if (skipNextPushRef.current) {
      skipNextPushRef.current = false;
      return;
    }
    if (!user) return;
    const token = getAuthToken();
    if (!token) return;

    const syncTimer = window.setTimeout(() => {
      void apiFetch(`${BACKEND_URL}/api/progress/${STORAGE_KEY}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ data: timer }),
        retries: 1,
      }).catch(() => {});
    }, 800);
    return () => window.clearTimeout(syncTimer);
  }, [timer, user]);

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

  // Ενημέρωση σερί όταν επιτευχθεί ο ημερήσιος στόχος (μία φορά ανά ημέρα).
  useEffect(() => {
    if (!goalReached) return;
    const today = getDayKey();
    setTimer((prev) => {
      if (prev.lastCompletedDate === today) return prev;
      const gap = prev.lastCompletedDate ? daysBetween(prev.lastCompletedDate, today) : Infinity;
      const nextStreak = gap <= 1 ? prev.streakDays + 1 : 1;
      return { ...prev, streakDays: nextStreak, lastCompletedDate: today };
    });
  }, [goalReached]);

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
    <div className="min-h-screen bg-gradient-to-br from-coral-wash via-white to-coral-wash dark:from-[#2d1c48] dark:via-[#2d1c48] dark:to-[#1a1028] p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 dark:bg-[#3a2658]/90 backdrop-blur-sm rounded-3xl border-2 border-coral-accent/25 dark:border-white/15 shadow-xl p-6 sm:p-8"
        >
          <div className="flex flex-col items-center mb-2">
            <PageMenuIcon
              icon="studyTimer"
              wrapperClassName="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#ff97b2]/15 dark:bg-white/10 mb-3"
              className="w-9 h-9"
            />
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-[#faf5ef] text-center tracking-tight">
              Study Timer
            </h1>
          </div>
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
              className="px-5 py-3 rounded-xl bg-white dark:bg-[#2d1c48] border-2 border-coral-accent/35 dark:border-white/15 text-coral-strong dark:text-coral-light font-bold flex items-center gap-2 hover:border-coral-accent transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Μηδενισμός
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-coral-wash dark:bg-[#2d1c48] border border-coral-accent/25 dark:border-white/15 rounded-xl p-4">
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Sessions σήμερα</div>
              <div className="text-2xl font-black text-coral-accent dark:text-coral-light">{timer.sessionsToday}</div>
            </div>
            <div className="bg-coral-wash dark:bg-[#2d1c48] border border-coral-accent/25 dark:border-white/15 rounded-xl p-4">
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Λεπτά μελέτης</div>
              <div className="text-2xl font-black text-coral-accent dark:text-coral-light">{studiedMin}</div>
            </div>
            <div className="bg-coral-wash dark:bg-[#2d1c48] border border-coral-accent/25 dark:border-white/15 rounded-xl p-4">
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
                  className="w-24 px-2 py-1 rounded border border-coral-accent/40 dark:border-white/15 text-coral-strong dark:text-coral-light font-bold bg-white dark:bg-[#3a2658]"
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
              className="mt-5 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-center"
            >
              <p className="text-green-700 dark:text-green-400 font-semibold flex items-center justify-center gap-2 mb-4">
                <Trophy className="w-5 h-5" />
                Μπράβο! Ο σημερινός στόχος μελέτης ολοκληρώθηκε.
              </p>
              <ShareResultButton
                data={{ kind: 'streak', days: Math.max(timer.streakDays, 1), minutesToday: studiedMin }}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StudyTimerPage;
