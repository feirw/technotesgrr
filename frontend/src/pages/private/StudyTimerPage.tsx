import React from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Target,
  Clock3,
  Trophy,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { PageMenuIcon } from '@/data/menuIcons';
import ShareResultButton from '@/components/shared/ShareResultButton';
import { useStudyTimer } from '@/hooks/useStudyTimer';
import { POMODORO_PRESETS } from '@/utils/studyTimer';

const RING_R = 108;
const RING_C = 2 * Math.PI * RING_R;

const StudyTimerPage: React.FC = () => {
  const timer = useStudyTimer();
  const { state } = timer;
  const isBreak = state.phase !== 'focus';

  const ringClass = isBreak ? 'stroke-teal-400' : 'stroke-coral-accent';
  const textAccent = isBreak
    ? 'text-teal-600 dark:text-teal-300'
    : 'text-coral-accent dark:text-coral-light';
  const chipClass = isBreak
    ? 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-400/10 dark:text-teal-200 dark:border-teal-400/25'
    : 'bg-coral-wash text-coral-strong border-coral-accent/20 dark:bg-coral-accent/15 dark:text-coral-light';
  const primaryBtn = isBreak
    ? 'bg-teal-500 hover:bg-teal-600'
    : 'bg-coral-accent hover:bg-coral-strong';
  const cardBorder = isBreak
    ? 'border-teal-300/50 dark:border-teal-400/20'
    : 'border-coral-accent/25 dark:border-white/15';

  return (
    <div
      className={`min-h-screen p-4 sm:p-8 transition-colors duration-500 ${
        isBreak
          ? 'bg-gradient-to-br from-teal-50 via-white to-teal-50 dark:from-[#1a2a2d] dark:via-[#2d1c48] dark:to-[#1a1028]'
          : 'bg-gradient-to-br from-coral-wash via-white to-coral-wash dark:from-[#2d1c48] dark:via-[#2d1c48] dark:to-[#1a1028]'
      }`}
    >
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {timer.liveMessage}
      </div>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white/90 dark:bg-[#3a2658]/90 backdrop-blur-sm rounded-3xl border-2 shadow-xl p-6 sm:p-8 ${cardBorder}`}
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
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
            Pomodoro εστίασης και διαλειμμάτων. Space έναρξη/παύση, R νέα συνεδρία, S παράλειψη.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {POMODORO_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => timer.onPreset(preset.id)}
                aria-pressed={state.settings.presetId === preset.id}
                className={`min-h-11 px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${
                  state.settings.presetId === preset.id
                    ? `${primaryBtn} text-white border-transparent`
                    : 'bg-white dark:bg-[#2d1c48] border-coral-accent/30 dark:border-white/15 text-gray-800 dark:text-gray-100'
                }`}
              >
                {preset.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => timer.onPreset('custom')}
              aria-pressed={state.settings.presetId === 'custom'}
              className={`min-h-11 px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${
                state.settings.presetId === 'custom'
                  ? `${primaryBtn} text-white border-transparent`
                  : 'bg-white dark:bg-[#2d1c48] border-coral-accent/30 dark:border-white/15 text-gray-800 dark:text-gray-100'
              }`}
            >
              Προσαρμογή
            </button>
          </div>

          <div className="flex flex-col items-center mb-8">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold mb-5 border ${chipClass}`}>
              {timer.phaseName}
              {state.isRunning ? ' · σε εξέλιξη' : ' · σε παύση'}
            </div>

            <div className="relative w-64 h-64 sm:w-72 sm:h-72">
              <svg viewBox="0 0 240 240" className="w-full h-full -rotate-90" aria-hidden>
                <circle
                  cx="120"
                  cy="120"
                  r={RING_R}
                  fill="none"
                  className="stroke-coral-accent/15 dark:stroke-white/10"
                  strokeWidth="14"
                />
                <circle
                  cx="120"
                  cy="120"
                  r={RING_R}
                  fill="none"
                  className={ringClass}
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={RING_C}
                  strokeDashoffset={RING_C * (1 - timer.ringProgress / 100)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p
                  className={`text-5xl sm:text-6xl font-black tabular-nums leading-none ${textAccent}`}
                  aria-label={`Υπόλοιπο ${timer.countdown}`}
                >
                  {timer.countdown}
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-500 dark:text-gray-300">
                  {timer.ringProgress}% της συνεδρίας
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              type="button"
              onClick={timer.onStartPause}
              aria-label={state.isRunning ? 'Παύση' : 'Έναρξη'}
              className={`px-5 py-3 rounded-xl text-white font-bold shadow flex items-center gap-2 transition-colors min-h-11 ${primaryBtn}`}
            >
              {state.isRunning ? <Pause className="w-5 h-5" aria-hidden /> : <Play className="w-5 h-5" aria-hidden />}
              {state.isRunning ? 'Παύση' : 'Έναρξη'}
            </button>
            <button
              type="button"
              onClick={timer.onSkip}
              aria-label="Παράλειψη συνεδρίας"
              className="px-5 py-3 rounded-xl bg-white dark:bg-[#2d1c48] border-2 border-coral-accent/35 dark:border-white/15 text-coral-strong dark:text-coral-light font-bold flex items-center gap-2 hover:border-coral-accent transition-colors min-h-11"
            >
              <SkipForward className="w-5 h-5" aria-hidden />
              Παράλειψη
            </button>
            <button
              type="button"
              onClick={timer.onResetSession}
              aria-label="Μηδενισμός συνεδρίας"
              className="px-5 py-3 rounded-xl bg-white dark:bg-[#2d1c48] border-2 border-coral-accent/35 dark:border-white/15 text-coral-strong dark:text-coral-light font-bold flex items-center gap-2 hover:border-coral-accent transition-colors min-h-11"
            >
              <RotateCcw className="w-5 h-5" aria-hidden />
              Συνεδρία
            </button>
            <button
              type="button"
              onClick={timer.onResetDay}
              aria-label="Μηδενισμός σημερινού χρόνου"
              className="px-5 py-3 rounded-xl bg-white dark:bg-[#2d1c48] border-2 border-coral-accent/35 dark:border-white/15 text-coral-strong dark:text-coral-light font-bold flex items-center gap-2 hover:border-coral-accent transition-colors min-h-11"
            >
              <RotateCcw className="w-5 h-5" aria-hidden />
              Ημέρα
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-coral-wash dark:bg-[#2d1c48] border border-coral-accent/25 dark:border-white/15 rounded-xl p-4">
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Συνεδρίες σήμερα</div>
              <div className={`text-2xl font-black ${textAccent}`}>{state.sessionsToday}</div>
            </div>
            <div className="bg-coral-wash dark:bg-[#2d1c48] border border-coral-accent/25 dark:border-white/15 rounded-xl p-4">
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-1 flex items-center gap-1">
                <Clock3 className="w-4 h-4" aria-hidden />
                Σημερινός χρόνος
              </div>
              <div className={`text-2xl font-black tabular-nums ${textAccent}`}>{timer.todayElapsed}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{timer.studiedMin} λεπτά εστίασης</div>
            </div>
            <div className="bg-coral-wash dark:bg-[#2d1c48] border border-coral-accent/25 dark:border-white/15 rounded-xl p-4">
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Ημερήσιος στόχος</div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-coral-accent" aria-hidden />
                <input
                  type="number"
                  min={10}
                  max={720}
                  step={5}
                  value={state.dailyGoalMin}
                  onChange={(e) => timer.onGoal(Number(e.target.value))}
                  aria-label="Ημερήσιος στόχος σε λεπτά"
                  className="w-24 px-2 py-1 rounded border border-coral-accent/40 dark:border-white/15 text-coral-strong dark:text-coral-light font-bold bg-white dark:bg-[#3a2658]"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">λεπτά</span>
              </div>
            </div>
          </div>

          <div className="mb-3 flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-200">
            <span>Πρόοδος στόχου</span>
            <span>{timer.goalProgress}%</span>
          </div>
          <div
            className="h-3 bg-coral-accent/15 rounded-full overflow-hidden mb-8"
            role="progressbar"
            aria-valuenow={timer.goalProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Πρόοδος ημερήσιου στόχου"
          >
            <motion.div
              className={`h-full ${isBreak ? 'bg-teal-400' : 'bg-gradient-to-r from-coral-accent to-coral-strong'}`}
              initial={{ width: 0 }}
              animate={{ width: `${timer.goalProgress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Εστίαση
              <input
                type="number"
                min={1}
                max={180}
                value={state.settings.focusMin}
                onChange={(e) => timer.onCustom({ focusMin: Number(e.target.value) })}
                aria-label="Λεπτά εστίασης"
                className="mt-1 w-full px-2 py-2 rounded-lg border border-coral-accent/40 dark:border-white/15 bg-white dark:bg-[#2d1c48] font-bold"
              />
            </label>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Μικρό διάλειμμα
              <input
                type="number"
                min={1}
                max={60}
                value={state.settings.shortBreakMin}
                onChange={(e) => timer.onCustom({ shortBreakMin: Number(e.target.value) })}
                aria-label="Λεπτά μικρού διαλείμματος"
                className="mt-1 w-full px-2 py-2 rounded-lg border border-coral-accent/40 dark:border-white/15 bg-white dark:bg-[#2d1c48] font-bold"
              />
            </label>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Μεγάλο διάλειμμα
              <input
                type="number"
                min={1}
                max={60}
                value={state.settings.longBreakMin}
                onChange={(e) => timer.onCustom({ longBreakMin: Number(e.target.value) })}
                aria-label="Λεπτά μεγάλου διαλείμματος"
                className="mt-1 w-full px-2 py-2 rounded-lg border border-coral-accent/40 dark:border-white/15 bg-white dark:bg-[#2d1c48] font-bold"
              />
            </label>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Long break κάθε
              <input
                type="number"
                min={1}
                max={12}
                value={state.settings.longBreakEvery}
                onChange={(e) => timer.onCustom({ longBreakEvery: Number(e.target.value) })}
                aria-label="Μεγάλο διάλειμμα κάθε πόσες συνεδρίες εστίασης"
                className="mt-1 w-full px-2 py-2 rounded-lg border border-coral-accent/40 dark:border-white/15 bg-white dark:bg-[#2d1c48] font-bold"
              />
            </label>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <label className="inline-flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-100">
              <input
                type="checkbox"
                checked={state.settings.autoStart}
                onChange={(e) => timer.onSettings({ autoStart: e.target.checked })}
                className="h-4 w-4 accent-[#f07f97]"
              />
              Αυτόματη έναρξη επόμενης συνεδρίας
            </label>
            <label className="inline-flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-100">
              <input
                type="checkbox"
                checked={state.settings.muted}
                onChange={(e) => timer.onSettings({ muted: e.target.checked })}
                className="h-4 w-4 accent-[#f07f97]"
              />
              {state.settings.muted ? (
                <VolumeX className="w-4 h-4" aria-hidden />
              ) : (
                <Volume2 className="w-4 h-4" aria-hidden />
              )}
              Σίγαση
            </label>
            <label className="inline-flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-100 flex-1">
              Ένταση
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={state.settings.volume}
                disabled={state.settings.muted}
                onChange={(e) => timer.onSettings({ volume: Number(e.target.value) })}
                aria-label="Ένταση ειδοποίησης"
                className="flex-1 accent-[#f07f97]"
              />
            </label>
          </div>

          {timer.goalReached && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-center"
            >
              <p className="text-green-700 dark:text-green-400 font-semibold flex items-center justify-center gap-2 mb-4">
                <Trophy className="w-5 h-5" aria-hidden />
                Μπράβο! Ο σημερινός στόχος μελέτης ολοκληρώθηκε.
                {state.streakDays > 0 ? ` Σερί ${state.streakDays} ημερών.` : ''}
              </p>
              <ShareResultButton
                data={{
                  kind: 'streak',
                  days: Math.max(state.streakDays, 1),
                  minutesToday: timer.studiedMin,
                }}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StudyTimerPage;
