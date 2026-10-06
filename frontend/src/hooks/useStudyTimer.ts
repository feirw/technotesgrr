import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAuthToken } from '@/utils/authToken';
import { apiFetch } from '@/utils/apiClient';
import { getBackendUrl } from '@/utils/backendUrl';
import {
  STUDY_TIMER_STORAGE_KEY,
  applyPreset,
  dailyGoalProgress,
  formatCountdown,
  formatElapsed,
  migrateTimerState,
  patchSettings,
  phaseLabel,
  remainingMs,
  resetDay,
  resetSession,
  sessionProgress,
  setDailyGoal,
  skip as skipPhase,
  tick,
  toggleRunning,
  updateCustomDurations,
  type Phase,
  type PomodoroPresetId,
  type PomodoroSettings,
  type StudyTimerState,
} from '@/utils/studyTimer';

const BACKEND_URL = getBackendUrl();
const TITLE_BASE = 'Χρονόμετρο Μελέτης | Technotes';

function readStored(): StudyTimerState {
  try {
    const raw = localStorage.getItem(STUDY_TIMER_STORAGE_KEY);
    if (!raw) return migrateTimerState(null);
    return migrateTimerState(JSON.parse(raw));
  } catch {
    return migrateTimerState(null);
  }
}

function playBeep(volume: number) {
  if (volume <= 0) return;
  const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 880;
  gain.gain.value = volume * 0.2;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.18);
  osc.onended = () => {
    void ctx.close();
  };
}

function notifyPhaseEnd(ended: Phase) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
  const title = ended === 'focus' ? 'Η εστίαση τελείωσε' : 'Το διάλειμμα τελείωσε';
  const body =
    ended === 'focus' ? 'Ώρα για διάλειμμα.' : 'Ώρα να συνεχίσεις την εστίαση.';
  try {
    new Notification(title, { body, silent: true });
  } catch {
    // unsupported in this context
  }
}

async function requestNotificationPermission() {
  if (typeof Notification === 'undefined') return;
  if (Notification.permission !== 'default') return;
  try {
    await Notification.requestPermission();
  } catch {
    // ignored
  }
}

export function useStudyTimer() {
  const { user } = useAuth();
  const [state, setState] = useState<StudyTimerState>(() => readStored());
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [liveMessage, setLiveMessage] = useState('');
  const hydratedForUserRef = useRef<string | number | null>(null);
  const skipNextPushRef = useRef(false);
  const originalTitleRef = useRef<string | null>(null);

  const announce = (message: string) => setLiveMessage(message);

  const applyTick = useCallback((updater: (prev: StudyTimerState) => ReturnType<typeof tick>) => {
    setState((prev) => {
      const { state: next, phaseJustEnded } = updater(prev);
      if (phaseJustEnded) {
        if (!next.settings.muted) playBeep(next.settings.volume);
        notifyPhaseEnd(phaseJustEnded);
        announce(
          phaseJustEnded === 'focus'
            ? `Η εστίαση τελείωσε. Ακολουθεί ${phaseLabel(next.phase)}.`
            : `Το διάλειμμα τελείωσε. Ακολουθεί ${phaseLabel(next.phase)}.`,
        );
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      const now = new Date();
      setNowMs(now.getTime());
      setState((prev) => {
        if (!prev.isRunning) return prev;
        const { state: next, phaseJustEnded } = tick(prev, now);
        if (phaseJustEnded) {
          if (!next.settings.muted) playBeep(next.settings.volume);
          notifyPhaseEnd(phaseJustEnded);
          announce(
            phaseJustEnded === 'focus'
              ? `Η εστίαση τελείωσε. Ακολουθεί ${phaseLabel(next.phase)}.`
              : `Το διάλειμμα τελείωσε. Ακολουθεί ${phaseLabel(next.phase)}.`,
          );
        }
        return next;
      });
    }, 250);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onVis = () => {
      const now = new Date();
      setNowMs(now.getTime());
      setState((prev) => tick(prev, now).state);
    };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('focus', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('focus', onVis);
    };
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STUDY_TIMER_STORAGE_KEY || !event.newValue) return;
      try {
        skipNextPushRef.current = true;
        setState(migrateTimerState(JSON.parse(event.newValue)));
      } catch {
        // ignore malformed
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (!user || hydratedForUserRef.current === user.id) return;
    hydratedForUserRef.current = user.id;
    const token = getAuthToken();
    if (!token) return;

    apiFetch<{ data: unknown }>(`${BACKEND_URL}/api/progress/${STUDY_TIMER_STORAGE_KEY}`, {
      headers: { Authorization: `Bearer ${token}` },
      retries: 0,
    })
      .then((res) => {
        if (res.data == null) return;
        setState((local) => {
          if (local.isRunning && local.endsAt && local.endsAt > Date.now()) return local;
          skipNextPushRef.current = true;
          return migrateTimerState(res.data);
        });
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(STUDY_TIMER_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota
    }

    if (skipNextPushRef.current) {
      skipNextPushRef.current = false;
      return;
    }
    if (!user) return;
    const token = getAuthToken();
    if (!token) return;

    const timer = window.setTimeout(() => {
      void apiFetch(`${BACKEND_URL}/api/progress/${STUDY_TIMER_STORAGE_KEY}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ data: state }),
        retries: 1,
      }).catch(() => {});
    }, 800);
    return () => window.clearTimeout(timer);
  }, [state, user]);

  useEffect(() => {
    if (originalTitleRef.current == null) originalTitleRef.current = document.title;
    const rem = remainingMs(state, nowMs);
    document.title = `${formatCountdown(rem)} · ${phaseLabel(state.phase)}`;
  }, [state, nowMs]);

  useEffect(() => {
    return () => {
      if (originalTitleRef.current) document.title = originalTitleRef.current;
      else document.title = TITLE_BASE;
    };
  }, []);

  const remaining = remainingMs(state, nowMs);
  const ringProgress = sessionProgress(state, nowMs);
  const goalProgress = dailyGoalProgress(state);
  const studiedMin = Math.floor(state.focusElapsedMs / 60_000);
  const goalReached = goalProgress >= 100;

  const onStartPause = useCallback(() => {
    void requestNotificationPermission();
    setState((prev) => {
      const next = toggleRunning(prev);
      announce(next.isRunning ? `Έναρξη: ${phaseLabel(next.phase)}` : 'Παύση');
      return next;
    });
  }, []);

  const onSkip = useCallback(() => {
    applyTick((prev) => skipPhase(prev));
  }, [applyTick]);

  const onResetSession = useCallback(() => {
    setState((prev) => {
      const next = resetSession(prev);
      announce(`Η συνεδρία μηδενίστηκε. ${phaseLabel(next.phase)}`);
      return next;
    });
  }, []);

  const onResetDay = useCallback(() => {
    if (!window.confirm('Θέλεις να μηδενίσεις τον σημερινό χρόνο μελέτης;')) return;
    setState((prev) => {
      const next = resetDay(prev);
      announce('Ο σημερινός χρόνος μηδενίστηκε.');
      return next;
    });
  }, []);

  const onPreset = useCallback((id: PomodoroPresetId) => {
    setState((prev) => applyPreset(prev, id));
  }, []);

  const onCustom = useCallback(
    (patch: Partial<Pick<PomodoroSettings, 'focusMin' | 'shortBreakMin' | 'longBreakMin' | 'longBreakEvery'>>) => {
      setState((prev) => updateCustomDurations(prev, patch));
    },
    [],
  );

  const onSettings = useCallback(
    (patch: Partial<Pick<PomodoroSettings, 'autoStart' | 'muted' | 'volume'>>) => {
      setState((prev) => patchSettings(prev, patch));
    },
    [],
  );

  const onGoal = useCallback((minutes: number) => {
    setState((prev) => setDailyGoal(prev, minutes));
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable) {
        return;
      }
      if (event.key === ' ' || event.code === 'Space') {
        event.preventDefault();
        onStartPause();
        return;
      }
      if (event.key === 'r' || event.key === 'R') {
        event.preventDefault();
        onResetSession();
        return;
      }
      if (event.key === 's' || event.key === 'S') {
        event.preventDefault();
        onSkip();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onStartPause, onResetSession, onSkip]);

  const derived = useMemo(
    () => ({
      remaining,
      countdown: formatCountdown(remaining),
      todayElapsed: formatElapsed(state.focusElapsedMs),
      ringProgress,
      goalProgress,
      studiedMin,
      goalReached,
      phaseName: phaseLabel(state.phase),
    }),
    [remaining, state.focusElapsedMs, ringProgress, goalProgress, studiedMin, goalReached, state.phase],
  );

  return {
    state,
    ...derived,
    liveMessage,
    onStartPause,
    onSkip,
    onResetSession,
    onResetDay,
    onPreset,
    onCustom,
    onSettings,
    onGoal,
  };
}
