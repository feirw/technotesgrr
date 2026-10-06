export const STUDY_TIMER_STORAGE_KEY = 'studyTimer:v1';
export const STUDY_TIMER_SCHEMA_VERSION = 2;

export type Phase = 'focus' | 'shortBreak' | 'longBreak';
export type PomodoroPresetId = '25-5' | '50-10' | '90-20' | 'custom';

export interface PomodoroPreset {
  id: Exclude<PomodoroPresetId, 'custom'>;
  label: string;
  focusMin: number;
  shortBreakMin: number;
  longBreakMin: number;
}

export const POMODORO_PRESETS: PomodoroPreset[] = [
  { id: '25-5', label: '25 / 5', focusMin: 25, shortBreakMin: 5, longBreakMin: 15 },
  { id: '50-10', label: '50 / 10', focusMin: 50, shortBreakMin: 10, longBreakMin: 20 },
  { id: '90-20', label: '90 / 20', focusMin: 90, shortBreakMin: 20, longBreakMin: 30 },
];

export interface PomodoroSettings {
  presetId: PomodoroPresetId;
  focusMin: number;
  shortBreakMin: number;
  longBreakMin: number;
  longBreakEvery: number;
  autoStart: boolean;
  muted: boolean;
  volume: number;
}

export interface StudyTimerState {
  version: typeof STUDY_TIMER_SCHEMA_VERSION;
  focusElapsedMs: number;
  sessionsToday: number;
  dailyGoalMin: number;
  lastDayKey: string;
  streakDays: number;
  lastCompletedDate: string | null;
  phase: Phase;
  isRunning: boolean;
  remainingMs: number;
  endsAt: number | null;
  completedFocusCount: number;
  settings: PomodoroSettings;
}

export type StudyTimerActionResult = {
  state: StudyTimerState;
  phaseJustEnded: Phase | null;
};

const MIN_FOCUS = 1;
const MAX_FOCUS = 180;
const MIN_BREAK = 1;
const MAX_BREAK = 60;
const MIN_EVERY = 1;
const MAX_EVERY = 12;
const MIN_GOAL = 10;
const MAX_GOAL = 720;

export function getDayKey(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function daysBetween(fromDayKey: string, toDayKey: string): number {
  const from = new Date(`${fromDayKey}T00:00:00`);
  const to = new Date(`${toDayKey}T00:00:00`);
  return Math.round((to.getTime() - from.getTime()) / 86400000);
}

export function clampInt(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}

export function clampVolume(value: number): number {
  if (!Number.isFinite(value)) return 0.6;
  return Math.min(1, Math.max(0, value));
}

export function defaultSettings(): PomodoroSettings {
  const preset = POMODORO_PRESETS[0];
  return {
    presetId: preset.id,
    focusMin: preset.focusMin,
    shortBreakMin: preset.shortBreakMin,
    longBreakMin: preset.longBreakMin,
    longBreakEvery: 4,
    autoStart: false,
    muted: false,
    volume: 0.6,
  };
}

export function normalizeSettings(partial?: Partial<PomodoroSettings>): PomodoroSettings {
  const base = defaultSettings();
  const merged = { ...base, ...partial };
  return {
    presetId: merged.presetId ?? 'custom',
    focusMin: clampInt(merged.focusMin, MIN_FOCUS, MAX_FOCUS),
    shortBreakMin: clampInt(merged.shortBreakMin, MIN_BREAK, MAX_BREAK),
    longBreakMin: clampInt(merged.longBreakMin, MIN_BREAK, MAX_BREAK),
    longBreakEvery: clampInt(merged.longBreakEvery, MIN_EVERY, MAX_EVERY),
    autoStart: Boolean(merged.autoStart),
    muted: Boolean(merged.muted),
    volume: clampVolume(merged.volume),
  };
}

export function durationMsForPhase(settings: PomodoroSettings, phase: Phase): number {
  const minutes =
    phase === 'focus'
      ? settings.focusMin
      : phase === 'shortBreak'
        ? settings.shortBreakMin
        : settings.longBreakMin;
  return Math.max(1, minutes) * 60_000;
}

export function createFreshState(now: Date = new Date()): StudyTimerState {
  const settings = defaultSettings();
  return {
    version: STUDY_TIMER_SCHEMA_VERSION,
    focusElapsedMs: 0,
    sessionsToday: 0,
    dailyGoalMin: 120,
    lastDayKey: getDayKey(now),
    streakDays: 0,
    lastCompletedDate: null,
    phase: 'focus',
    isRunning: false,
    remainingMs: durationMsForPhase(settings, 'focus'),
    endsAt: null,
    completedFocusCount: 0,
    settings,
  };
}

function withRollover(state: StudyTimerState, now: Date): StudyTimerState {
  const today = getDayKey(now);
  if (state.lastDayKey === today) return state;

  const gap = state.lastCompletedDate ? daysBetween(state.lastCompletedDate, today) : Infinity;
  return {
    ...state,
    focusElapsedMs: 0,
    sessionsToday: 0,
    isRunning: false,
    lastDayKey: today,
    streakDays: gap > 1 ? 0 : state.streakDays,
    phase: 'focus',
    remainingMs: durationMsForPhase(state.settings, 'focus'),
    endsAt: null,
    completedFocusCount: 0,
  };
}

export function applyDayRollover(state: StudyTimerState, now: Date = new Date()): StudyTimerState {
  return withRollover(state, now);
}

export function migrateTimerState(raw: unknown, now: Date = new Date()): StudyTimerState {
  const fresh = createFreshState(now);
  if (!raw || typeof raw !== 'object') return fresh;

  const input = raw as Record<string, unknown>;
  const settings = normalizeSettings(
    typeof input.settings === 'object' && input.settings !== null
      ? (input.settings as Partial<PomodoroSettings>)
      : undefined,
  );

  const version = input.version === STUDY_TIMER_SCHEMA_VERSION ? STUDY_TIMER_SCHEMA_VERSION : 1;
  const focusElapsedMs =
    typeof input.focusElapsedMs === 'number'
      ? Math.max(0, input.focusElapsedMs)
      : typeof input.elapsedMs === 'number'
        ? Math.max(0, input.elapsedMs)
        : 0;

  const phase: Phase =
    input.phase === 'shortBreak' || input.phase === 'longBreak' || input.phase === 'focus'
      ? input.phase
      : 'focus';

  const remainingMs =
    typeof input.remainingMs === 'number' && input.remainingMs >= 0
      ? input.remainingMs
      : durationMsForPhase(settings, phase);

  const endsAt = typeof input.endsAt === 'number' ? input.endsAt : null;
  const isRunning = Boolean(input.isRunning) && endsAt != null && endsAt > now.getTime();

  const migrated: StudyTimerState = {
    version: STUDY_TIMER_SCHEMA_VERSION,
    focusElapsedMs,
    sessionsToday: typeof input.sessionsToday === 'number' ? Math.max(0, input.sessionsToday) : 0,
    dailyGoalMin: clampInt(
      typeof input.dailyGoalMin === 'number' ? input.dailyGoalMin : fresh.dailyGoalMin,
      MIN_GOAL,
      MAX_GOAL,
    ),
    lastDayKey: typeof input.lastDayKey === 'string' ? input.lastDayKey : getDayKey(now),
    streakDays: typeof input.streakDays === 'number' ? Math.max(0, input.streakDays) : 0,
    lastCompletedDate: typeof input.lastCompletedDate === 'string' ? input.lastCompletedDate : null,
    phase,
    isRunning,
    remainingMs: isRunning ? Math.max(0, (endsAt as number) - now.getTime()) : remainingMs,
    endsAt: isRunning ? endsAt : null,
    completedFocusCount:
      typeof input.completedFocusCount === 'number' ? Math.max(0, input.completedFocusCount) : 0,
    settings,
  };

  if (version === 1) {
    migrated.phase = 'focus';
    migrated.isRunning = false;
    migrated.endsAt = null;
    migrated.remainingMs = durationMsForPhase(settings, 'focus');
    migrated.completedFocusCount = 0;
  }

  return withRollover(migrated, now);
}

export function remainingMs(state: StudyTimerState, nowMs: number): number {
  if (state.isRunning && state.endsAt != null) {
    return Math.max(0, state.endsAt - nowMs);
  }
  return Math.max(0, state.remainingMs);
}

export function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hh = Math.floor(totalSeconds / 3600);
  const mm = Math.floor((totalSeconds % 3600) / 60);
  const ss = totalSeconds % 60;
  if (hh > 0) {
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  }
  return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

export function formatElapsed(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hh = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const mm = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const ss = String(totalSeconds % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

export function phaseLabel(phase: Phase): string {
  if (phase === 'focus') return 'Εστίαση';
  if (phase === 'shortBreak') return 'Μικρό διάλειμμα';
  return 'Μεγάλο διάλειμμα';
}

export function nextPhaseAfterFocus(completedFocusCount: number, longBreakEvery: number): Phase {
  const every = clampInt(longBreakEvery, MIN_EVERY, MAX_EVERY);
  return completedFocusCount > 0 && completedFocusCount % every === 0 ? 'longBreak' : 'shortBreak';
}

function applyStreak(state: StudyTimerState, now: Date): StudyTimerState {
  const studiedMin = Math.floor(state.focusElapsedMs / 60_000);
  if (studiedMin < state.dailyGoalMin) return state;
  const today = getDayKey(now);
  if (state.lastCompletedDate === today) return state;
  const gap = state.lastCompletedDate ? daysBetween(state.lastCompletedDate, today) : Infinity;
  const nextStreak = gap <= 1 ? state.streakDays + 1 : 1;
  return { ...state, streakDays: nextStreak, lastCompletedDate: today };
}

function beginPhase(
  state: StudyTimerState,
  phase: Phase,
  nowMs: number,
  running: boolean,
): StudyTimerState {
  const remaining = durationMsForPhase(state.settings, phase);
  return {
    ...state,
    phase,
    remainingMs: remaining,
    isRunning: running,
    endsAt: running ? nowMs + remaining : null,
  };
}

function completePhase(state: StudyTimerState, now: Date): StudyTimerActionResult {
  const nowMs = now.getTime();
  let next = state;
  let ended: Phase = state.phase;

  if (state.phase === 'focus') {
    const completedFocusCount = state.completedFocusCount + 1;
    next = {
      ...state,
      sessionsToday: state.sessionsToday + 1,
      completedFocusCount,
    };
    next = applyStreak(next, now);
    ended = 'focus';
    const following = nextPhaseAfterFocus(completedFocusCount, next.settings.longBreakEvery);
    next = beginPhase(next, following, nowMs, next.settings.autoStart);
  } else {
    ended = state.phase;
    next = beginPhase(next, 'focus', nowMs, next.settings.autoStart);
  }

  return { state: next, phaseJustEnded: ended };
}

export function tick(state: StudyTimerState, now: Date = new Date()): StudyTimerActionResult {
  const rolled = withRollover(state, now);
  const nowMs = now.getTime();
  if (!rolled.isRunning || rolled.endsAt == null) {
    return { state: rolled, phaseJustEnded: null };
  }

  const rem = Math.max(0, rolled.endsAt - nowMs);
  const spent = Math.max(0, rolled.remainingMs - rem);
  let next: StudyTimerState = {
    ...rolled,
    remainingMs: rem,
    focusElapsedMs:
      rolled.phase === 'focus' ? rolled.focusElapsedMs + spent : rolled.focusElapsedMs,
  };
  next = applyStreak(next, now);

  if (rem > 0) return { state: next, phaseJustEnded: null };
  return completePhase(next, now);
}

export function start(state: StudyTimerState, now: Date = new Date()): StudyTimerState {
  const rolled = withRollover(state, now);
  if (rolled.isRunning) return rolled;
  const nowMs = now.getTime();
  const rem = Math.max(0, rolled.remainingMs) || durationMsForPhase(rolled.settings, rolled.phase);
  return {
    ...rolled,
    isRunning: true,
    remainingMs: rem,
    endsAt: nowMs + rem,
  };
}

export function pause(state: StudyTimerState, now: Date = new Date()): StudyTimerState {
  const rolled = withRollover(state, now);
  if (!rolled.isRunning) return rolled;
  const { state: ticked } = tick(rolled, now);
  return {
    ...ticked,
    isRunning: false,
    remainingMs: remainingMs(ticked, now.getTime()),
    endsAt: null,
  };
}

export function toggleRunning(state: StudyTimerState, now: Date = new Date()): StudyTimerState {
  return state.isRunning ? pause(state, now) : start(state, now);
}

export function skip(state: StudyTimerState, now: Date = new Date()): StudyTimerActionResult {
  const { state: ticked, phaseJustEnded } = tick(state, now);
  if (phaseJustEnded) return { state: ticked, phaseJustEnded };
  return completePhase({ ...ticked, remainingMs: 0, endsAt: null, isRunning: false }, now);
}

export function resetSession(state: StudyTimerState, now: Date = new Date()): StudyTimerState {
  const rolled = withRollover(state, now);
  return beginPhase(rolled, rolled.phase, now.getTime(), false);
}

export function resetDay(state: StudyTimerState, now: Date = new Date()): StudyTimerState {
  const rolled = withRollover(state, now);
  return {
    ...rolled,
    focusElapsedMs: 0,
    sessionsToday: 0,
    isRunning: false,
    endsAt: null,
    phase: 'focus',
    remainingMs: durationMsForPhase(rolled.settings, 'focus'),
    completedFocusCount: 0,
  };
}

export function setDailyGoal(state: StudyTimerState, minutes: number, now: Date = new Date()): StudyTimerState {
  const rolled = withRollover(state, now);
  return applyStreak({ ...rolled, dailyGoalMin: clampInt(minutes, MIN_GOAL, MAX_GOAL) }, now);
}

export function applyPreset(
  state: StudyTimerState,
  presetId: PomodoroPresetId,
  now: Date = new Date(),
): StudyTimerState {
  const rolled = withRollover(state, now);
  if (presetId === 'custom') {
    return { ...rolled, settings: normalizeSettings({ ...rolled.settings, presetId: 'custom' }) };
  }
  const preset = POMODORO_PRESETS.find((p) => p.id === presetId);
  if (!preset) return rolled;
  const settings = normalizeSettings({
    ...rolled.settings,
    presetId: preset.id,
    focusMin: preset.focusMin,
    shortBreakMin: preset.shortBreakMin,
    longBreakMin: preset.longBreakMin,
  });
  const next = { ...rolled, settings, isRunning: false, endsAt: null };
  return beginPhase(next, next.phase, now.getTime(), false);
}

export function updateCustomDurations(
  state: StudyTimerState,
  patch: Partial<Pick<PomodoroSettings, 'focusMin' | 'shortBreakMin' | 'longBreakMin' | 'longBreakEvery'>>,
  now: Date = new Date(),
): StudyTimerState {
  const rolled = withRollover(state, now);
  const settings = normalizeSettings({ ...rolled.settings, ...patch, presetId: 'custom' });
  const next = { ...rolled, settings, isRunning: false, endsAt: null };
  return beginPhase(next, next.phase, now.getTime(), false);
}

export function patchSettings(
  state: StudyTimerState,
  patch: Partial<Pick<PomodoroSettings, 'autoStart' | 'muted' | 'volume'>>,
  now: Date = new Date(),
): StudyTimerState {
  const rolled = withRollover(state, now);
  return { ...rolled, settings: normalizeSettings({ ...rolled.settings, ...patch }) };
}

export function sessionProgress(state: StudyTimerState, nowMs: number): number {
  const total = durationMsForPhase(state.settings, state.phase);
  if (total <= 0) return 0;
  const rem = remainingMs(state, nowMs);
  return Math.min(100, Math.max(0, Math.round(((total - rem) / total) * 100)));
}

export function dailyGoalProgress(state: StudyTimerState): number {
  return Math.min(100, Math.round((Math.floor(state.focusElapsedMs / 60_000) / Math.max(state.dailyGoalMin, 1)) * 100));
}
