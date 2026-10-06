import { describe, expect, test } from 'bun:test';
import {
  applyDayRollover,
  applyPreset,
  createFreshState,
  daysBetween,
  durationMsForPhase,
  formatCountdown,
  getDayKey,
  migrateTimerState,
  nextPhaseAfterFocus,
  pause,
  remainingMs,
  resetDay,
  resetSession,
  skip,
  start,
  tick,
  updateCustomDurations,
} from './studyTimer';

describe('getDayKey', () => {
  test('uses local calendar date, not UTC', () => {
    const local = new Date(2026, 9, 6, 23, 30, 0);
    expect(getDayKey(local)).toBe('2026-10-06');
  });
});

describe('daysBetween', () => {
  test('counts calendar days', () => {
    expect(daysBetween('2026-10-05', '2026-10-06')).toBe(1);
    expect(daysBetween('2026-10-01', '2026-10-04')).toBe(3);
  });
});

describe('migrateTimerState', () => {
  test('migrates v1 stopwatch into paused focus session', () => {
    const now = new Date('2026-10-06T12:00:00');
    const state = migrateTimerState(
      {
        elapsedMs: 45 * 60_000,
        isRunning: true,
        dailyGoalMin: 90,
        sessionsToday: 3,
        lastDayKey: '2026-10-06',
        streakDays: 2,
        lastCompletedDate: '2026-10-06',
      },
      now,
    );
    expect(state.version).toBe(2);
    expect(state.focusElapsedMs).toBe(45 * 60_000);
    expect(state.isRunning).toBe(false);
    expect(state.endsAt).toBeNull();
    expect(state.phase).toBe('focus');
    expect(state.remainingMs).toBe(25 * 60_000);
    expect(state.dailyGoalMin).toBe(90);
    expect(state.sessionsToday).toBe(3);
  });

  test('clamps invalid numbers', () => {
    const state = migrateTimerState({ dailyGoalMin: -5, settings: { focusMin: 0, volume: 4 } });
    expect(state.dailyGoalMin).toBe(10);
    expect(state.settings.focusMin).toBe(1);
    expect(state.settings.volume).toBe(1);
  });
});

describe('applyDayRollover', () => {
  test('resets daily totals at local midnight and keeps streak if consecutive', () => {
    const yesterday = createFreshState(new Date(2026, 9, 5, 22, 0, 0));
    yesterday.focusElapsedMs = 80 * 60_000;
    yesterday.sessionsToday = 2;
    yesterday.lastCompletedDate = '2026-10-05';
    yesterday.streakDays = 4;
    yesterday.isRunning = true;
    yesterday.endsAt = Date.now() + 10_000;

    const next = applyDayRollover(yesterday, new Date(2026, 9, 6, 0, 5, 0));
    expect(next.lastDayKey).toBe('2026-10-06');
    expect(next.focusElapsedMs).toBe(0);
    expect(next.sessionsToday).toBe(0);
    expect(next.isRunning).toBe(false);
    expect(next.streakDays).toBe(4);
  });

  test('breaks streak after a missed day', () => {
    const state = createFreshState(new Date(2026, 9, 4, 12, 0, 0));
    state.lastCompletedDate = '2026-10-04';
    state.streakDays = 3;
    const next = applyDayRollover(state, new Date(2026, 9, 6, 12, 0, 0));
    expect(next.streakDays).toBe(0);
  });
});

describe('countdown timestamps', () => {
  test('remainingMs uses endsAt while running', () => {
    const now = new Date('2026-10-06T12:00:00');
    let state = createFreshState(now);
    state = start(state, now);
    expect(state.endsAt).toBe(now.getTime() + 25 * 60_000);
    expect(remainingMs(state, now.getTime() + 5_000)).toBe(25 * 60_000 - 5_000);
  });

  test('pause freezes remaining time', () => {
    const now = new Date('2026-10-06T12:00:00');
    let state = start(createFreshState(now), now);
    const later = new Date(now.getTime() + 10_000);
    state = pause(state, later);
    expect(state.isRunning).toBe(false);
    expect(state.endsAt).toBeNull();
    expect(state.remainingMs).toBe(25 * 60_000 - 10_000);
  });

  test('tick adds only focus time to daily total', () => {
    const now = new Date('2026-10-06T12:00:00');
    let state = start(createFreshState(now), now);
    const { state: afterFocus } = tick(state, new Date(now.getTime() + 8_000));
    expect(afterFocus.focusElapsedMs).toBe(8_000);

    const skipped = skip(afterFocus, new Date(now.getTime() + 8_000));
    expect(skipped.state.phase).toBe('shortBreak');
    const runningBreak = start(skipped.state, new Date(now.getTime() + 8_000));
    const { state: afterBreak } = tick(runningBreak, new Date(now.getTime() + 13_000));
    expect(afterBreak.phase).toBe('shortBreak');
    expect(afterBreak.focusElapsedMs).toBe(afterFocus.focusElapsedMs);
  });

  test('completing a focus session starts a short break', () => {
    const now = new Date('2026-10-06T12:00:00');
    let state = start(createFreshState(now), now);
    state = { ...state, remainingMs: 1, endsAt: now.getTime() + 1 };
    const { state: next, phaseJustEnded } = tick(state, new Date(now.getTime() + 2));
    expect(phaseJustEnded).toBe('focus');
    expect(next.phase).toBe('shortBreak');
    expect(next.sessionsToday).toBe(1);
    expect(next.isRunning).toBe(false);
    expect(next.remainingMs).toBe(5 * 60_000);
  });

  test('skip does not complete twice when remaining is already zero', () => {
    const now = new Date('2026-10-06T12:00:00');
    let state = start(createFreshState(now), now);
    state = { ...state, remainingMs: 0, endsAt: now.getTime() };
    const { state: next, phaseJustEnded } = skip(state, now);
    expect(phaseJustEnded).toBe('focus');
    expect(next.phase).toBe('shortBreak');
    expect(next.sessionsToday).toBe(1);
  });

  test('long break every 4 focus sessions', () => {
    expect(nextPhaseAfterFocus(1, 4)).toBe('shortBreak');
    expect(nextPhaseAfterFocus(4, 4)).toBe('longBreak');
    expect(nextPhaseAfterFocus(8, 4)).toBe('longBreak');
  });
});

describe('controls', () => {
  test('resetSession restores current phase duration', () => {
    const now = new Date('2026-10-06T12:00:00');
    let state = start(createFreshState(now), now);
    state = pause(state, new Date(now.getTime() + 30_000));
    const reset = resetSession(state, now);
    expect(reset.isRunning).toBe(false);
    expect(reset.remainingMs).toBe(durationMsForPhase(reset.settings, 'focus'));
    expect(reset.focusElapsedMs).toBe(state.focusElapsedMs);
  });

  test('resetDay clears today but keeps streak metadata', () => {
    const now = new Date('2026-10-06T12:00:00');
    const state = createFreshState(now);
    state.focusElapsedMs = 20 * 60_000;
    state.sessionsToday = 2;
    state.streakDays = 5;
    state.lastCompletedDate = '2026-10-05';
    const reset = resetDay(state, now);
    expect(reset.focusElapsedMs).toBe(0);
    expect(reset.sessionsToday).toBe(0);
    expect(reset.streakDays).toBe(5);
    expect(reset.phase).toBe('focus');
  });

  test('preset change pauses and applies durations', () => {
    const now = new Date('2026-10-06T12:00:00');
    const state = applyPreset(start(createFreshState(now), now), '50-10', now);
    expect(state.settings.focusMin).toBe(50);
    expect(state.settings.shortBreakMin).toBe(10);
    expect(state.isRunning).toBe(false);
    expect(state.remainingMs).toBe(50 * 60_000);
  });

  test('custom durations reject zero and negatives', () => {
    const state = updateCustomDurations(createFreshState(), {
      focusMin: -10,
      shortBreakMin: 0,
      longBreakMin: 999,
    });
    expect(state.settings.focusMin).toBe(1);
    expect(state.settings.shortBreakMin).toBe(1);
    expect(state.settings.longBreakMin).toBe(60);
    expect(state.settings.presetId).toBe('custom');
  });
});

describe('formatCountdown', () => {
  test('mm:ss under an hour and hh:mm:ss above', () => {
    expect(formatCountdown(90_000)).toBe('01:30');
    expect(formatCountdown(3661_000)).toBe('01:01:01');
    expect(formatCountdown(-5)).toBe('00:00');
  });
});
