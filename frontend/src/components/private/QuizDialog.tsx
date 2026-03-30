import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Trophy,
  AlertCircle,
  Flag,
  Lightbulb,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import { apiFetch } from '@/utils/apiClient';
import { getBackendUrl } from '@/utils/backendUrl';
import { enqueueQuizSubmission, flushPendingQuizSubmissions } from '@/utils/quizSubmissionSync';

// --- Types ---

interface Answer {
  text: string;
  correct: boolean;
}

interface Question {
  id: string;
  question: string;
  answers: Answer[];
  explanation?: string;
}

interface QuizData {
  id: string;
  title: string;
  questions: Question[];
}

interface QuizDialogProps {
  quiz: QuizData | null;
  isOpen: boolean;
  onClose: () => void;
  onQuestionAnswered: (
    quizId: string,
    questionIdx: number,
    selectedIdx: number,
    isCorrect: boolean,
    points: number
  ) => void;
  // Maps question index to the selected answer index
  selectedAnswers: Record<number, number>;
}

interface Score {
  correct: number;
  total: number;
}

interface SubmitResponse {
  correct: boolean;
  points_earned: number;
}

// --- Constants ---

const BRAND = '#fda8a9';
const BRAND_DARK = '#f88b8c';
const BACKEND_URL = getBackendUrl();

const QuizDialog: React.FC<QuizDialogProps> = ({
  quiz,
  isOpen,
  onClose,
  onQuestionAnswered,
  selectedAnswers,
}) => {
  const { user } = useAuth();
  const [current, setCurrent] = useState<number>(0);
  const [isSyncingAnswer, setIsSyncingAnswer] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<Score>({ correct: 0, total: 0 });
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());

  const syncPendingQueue = useCallback(async () => {
    await flushPendingQuizSubmissions();
  }, []);

  // Determine selected answer for current question (if any)
  const selected = selectedAnswers?.[current] ?? null; // number | null

  const question = quiz?.questions?.[current];
  const isLastQuestion = current === (quiz?.questions?.length || 0) - 1;
  const allAnswered = quiz?.questions?.every((_, idx) => selectedAnswers?.[idx] !== undefined);
  const isFlagged = flaggedQuestions.has(current);

  // Calculate score whenever selectedAnswers changes
  useEffect(() => {
    if (quiz?.questions && selectedAnswers) {
      const correctCount = Object.entries(selectedAnswers).filter(([qIdxStr, ansIdx]) => {
        const qIdx = parseInt(qIdxStr, 10);
        const q = quiz.questions[qIdx];
        // Ensure ansIdx is treated as a number
        return q?.answers?.[ansIdx as number]?.correct;
      }).length;

      setScore({ correct: correctCount, total: Object.keys(selectedAnswers).length });
    }
  }, [selectedAnswers, quiz]);

  // Reset state when quiz changes or dialog opens
  useEffect(() => {
    if (isOpen) {
      setCurrent(0);
      setShowConfetti(false);
      setError(null);
      setShowExplanation(false);
    }
  }, [isOpen, quiz]);

  // Show explanation automatically if the current question is already answered
  useEffect(() => {
    if (selected !== null) {
      setShowExplanation(true);
    }
  }, [selected]);

  // Confetti animation on completion
  useEffect(() => {
    if (allAnswered && isLastQuestion && selected !== null) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [allAnswered, isLastQuestion, selected]);

  // Try to sync queued submissions on open and whenever connection comes back.
  useEffect(() => {
    if (!isOpen) return;
    void syncPendingQueue();

    const handleOnline = () => {
      void syncPendingQueue();
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [isOpen, syncPendingQueue]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen || !quiz) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && current > 0) {
        handlePrevious();
      } else if (e.key === 'ArrowRight' && current < quiz.questions.length - 1) {
        handleNext();
      } else if (e.key >= '1' && e.key <= '4' && selected === null) {
        const answerIndex = parseInt(e.key) - 1;
        if (question && answerIndex < question.answers.length) {
          handleSelect(answerIndex);
        }
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFlag();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, current, quiz, selected, question]);

  const handleSelect = useCallback(
    async (idx: number) => {
      // Prevent selection if already answered or loading or missing props
      if (selected !== null || !onQuestionAnswered || !quiz || !question) return;
      setError(null);

      try {
        const localIsCorrect = Boolean(question.answers?.[idx]?.correct);
        // Update UI immediately to remove perceived lag between questions.
        onQuestionAnswered(quiz.id, current, idx, localIsCorrect, localIsCorrect ? 10 : 0);

        // 1. Get session for token
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) {
          throw new Error('User not authenticated');
        }

        // 2. Determine nickname
        const nickname = user?.username || user?.email?.split('@')[0] || 'Anonymous';

        setIsSyncingAnswer(true);
        const result = await apiFetch<SubmitResponse>(`${BACKEND_URL}/api/quiz/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          timeoutMs: 8000,
          retries: 1,
          body: JSON.stringify({
            nickname,
            question_id: question.id,
            selected_answer: idx,
          }),
        });

        // No auto-advance: user controls navigation with the next button.
      } catch (err) {
        console.error('Error submitting answer:', err);
        enqueueQuizSubmission({
          nickname: user?.username || user?.email?.split('@')[0] || 'Anonymous',
          question_id: question.id,
          selected_answer: idx,
        });
      } finally {
        setIsSyncingAnswer(false);
      }
    },
    [selected, onQuestionAnswered, question, quiz, user]
  );

  const handleNext = useCallback(() => {
    if (quiz && current < quiz.questions.length - 1) {
      setCurrent((p) => p + 1);
      setShowExplanation(false);
      setError(null);
    } else if (isLastQuestion) {
      onClose();
    }
  }, [current, quiz, isLastQuestion, onClose]);

  const handlePrevious = useCallback(() => {
    if (current > 0) {
      setCurrent((p) => p - 1);
      setShowExplanation(false);
      setError(null);
    }
  }, [current]);

  const goToQuestion = useCallback((idx: number) => {
    setCurrent(idx);
    setShowExplanation(false);
    setError(null);
  }, []);

  const toggleFlag = useCallback(() => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(current)) {
        newSet.delete(current);
      } else {
        newSet.add(current);
      }
      return newSet;
    });
  }, [current]);

  if (!isOpen || !quiz) return null;

  const progress = ((current + 1) / quiz.questions.length) * 100;
  const scorePercentage = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
  const unansweredCount = quiz.questions.filter(
    (_, idx) => selectedAnswers?.[idx] === undefined
  ).length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Confetti */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10%',
                  backgroundColor: ['#fda8a9', '#10b981', '#3b82f6', '#f59e0b', '#ef4444'][
                    Math.floor(Math.random() * 5)
                  ],
                }}
                initial={{ y: 0, opacity: 1, rotate: 0 }}
                animate={{
                  y: window.innerHeight + 100,
                  opacity: 0,
                  rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                  x: (Math.random() - 0.5) * 200,
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>
        )}

        {/* Dialog */}
        <motion.div
          className="relative w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden bg-white"
          style={{ border: `4px solid ${BRAND}`, maxHeight: '90vh' }}
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {/* Progress Bar */}
          <div className="h-3 bg-gray-200 relative">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white drop-shadow-lg">
                {current + 1} / {quiz.questions.length}
              </span>
            </div>
          </div>

          <div className="overflow-y-auto p-6 md:p-8" style={{ maxHeight: 'calc(90vh - 12px)' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <motion.h3
                  className="text-xl md:text-2xl font-black"
                  style={{ color: BRAND_DARK }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  Ερώτηση {current + 1}
                  {isFlagged && <Flag className="inline w-5 h-5 ml-2 text-red-500 fill-red-500" />}
                </motion.h3>
                <div className="flex items-center gap-4 mt-2 flex-wrap">
                  {score.total > 0 && (
                    <motion.div
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <span className="text-sm font-semibold text-gray-600">
                        Σκορ: {score.correct}/{score.total} ({scorePercentage}%)
                      </span>
                    </motion.div>
                  )}
                  {unansweredCount > 0 && (
                    <span className="text-sm text-gray-500">{unansweredCount} αναπάντητες</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Flag Button */}
                <motion.button
                  onClick={toggleFlag}
                  className={`p-2 rounded-full transition-colors ${
                    isFlagged
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Σημείωση για επανέλεγχο (πάτα F)"
                >
                  <Flag className={`w-5 h-5 ${isFlagged ? 'fill-red-600' : ''}`} />
                </motion.button>

                {/* Close Button */}
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Κλείσιμο"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </motion.button>
              </div>
            </div>

            {/* Question */}
            <motion.div
              className="mb-6 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50"
              style={{ border: `2px solid ${BRAND}` }}
              key={`question-${current}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-lg md:text-xl font-semibold text-gray-800 leading-relaxed">
                {question?.question}
              </p>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="mb-4 p-4 rounded-xl bg-red-50 border-2 border-red-300 flex items-center gap-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                    <button
                      onClick={() => setError(null)}
                      className="text-xs text-red-600 underline mt-1"
                    >
                      Κλείσιμο
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {isSyncingAnswer && (
              <p className="text-xs text-gray-500 mb-3">Συγχρονισμός απάντησης...</p>
            )}

            {/* Answers */}
            <div className="space-y-3 mb-8">
              {question?.answers?.map((ans, idx) => {
                const isSelected = selected === idx;
                const isRevealed = selected !== null;
                const isCorrect = ans.correct;

                return (
                  <motion.button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={isRevealed}
                    className={`
                        relative flex items-center gap-4 w-full px-5 py-4 md:px-6 md:py-5 rounded-xl
                        border-2 font-semibold text-left transition-all
                        ${!isRevealed ? 'bg-white border-pink-200 hover:border-pink-400 hover:shadow-xl cursor-pointer' : 'cursor-default'}
                        ${isRevealed && isCorrect ? 'bg-green-50 border-green-500 shadow-lg' : ''}
                        ${isRevealed && !isCorrect && isSelected ? 'bg-red-50 border-red-500 shadow-lg' : ''}
                        ${isRevealed && !isCorrect && !isSelected ? 'bg-gray-50 border-gray-300 opacity-70' : ''}
                        ${isRevealed ? '' : 'hover:transform hover:scale-[1.01]'}
                      `}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      scale: isRevealed && isSelected ? [1, 1.02, 1] : 1,
                    }}
                    transition={{
                      delay: idx * 0.08,
                      scale: { duration: 0.3 },
                    }}
                    whileHover={!isRevealed ? { x: 6 } : {}}
                    whileTap={!isRevealed ? { scale: 0.98 } : {}}
                  >
                    {/* Answer Letter */}
                    <div
                      className={`
                          flex items-center justify-center w-10 h-10 rounded-full font-bold text-base flex-shrink-0
                          transition-all duration-300
                          ${!isRevealed ? 'bg-pink-100 text-pink-600' : ''}
                          ${isRevealed && isCorrect ? 'bg-green-500 text-white' : ''}
                          ${isRevealed && !isCorrect ? 'bg-gray-400 text-gray-700' : ''}
                        `}
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>

                    {/* Answer Text */}
                    <span
                      className={`
                          flex-1 text-base md:text-lg
                          ${isRevealed && isCorrect ? 'text-green-800 font-bold' : ''}
                          ${isRevealed && !isCorrect && isSelected ? 'text-red-800' : ''}
                          ${!isRevealed ? 'text-gray-800' : ''}
                        `}
                    >
                      {ans.text}
                    </span>

                    {/* Icons */}
                    {isRevealed && isCorrect && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 500, delay: 0.1 }}
                      >
                        <CheckCircle className="w-7 h-7 text-green-500" />
                      </motion.div>
                    )}
                    {isRevealed && isSelected && !isCorrect && (
                      <motion.div
                        initial={{ scale: 0, rotate: 180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 500, delay: 0.1 }}
                      >
                        <XCircle className="w-7 h-7 text-red-500" />
                      </motion.div>
                    )}

                    {/* Keyboard Hint */}
                    {!isRevealed && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-mono bg-gray-200 px-2 py-1 rounded text-gray-600">
                          {idx + 1}
                        </span>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation (if answered) */}
            <AnimatePresence>
              {selected !== null && question?.explanation && showExplanation && (
                <motion.div
                  className="mb-6 p-5 rounded-xl bg-blue-50 border-2 border-blue-200"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-blue-800 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      Επεξήγηση:
                    </h4>
                    <button
                      onClick={() => setShowExplanation(false)}
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      Απόκρυψη
                    </button>
                  </div>
                  <p className="text-blue-700">{question.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6 border-t-2 border-pink-100">
              <motion.button
                onClick={handlePrevious}
                disabled={current === 0}
                className={`
                  flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all
                  ${
                    current === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border-2 border-pink-200 hover:border-pink-400 hover:shadow-lg'
                  }
                `}
                whileHover={current > 0 ? { scale: 1.05, x: -4 } : {}}
                whileTap={current > 0 ? { scale: 0.95 } : {}}
                aria-label="Προηγούμενη ερώτηση"
              >
                <ChevronLeft className="w-5 h-5" />
                Προηγούμενη
              </motion.button>

              {/* Question Indicators */}
              <div className="hidden md:flex gap-2 overflow-x-auto max-w-md px-2">
                {quiz.questions.map((_, idx) => {
                  const isAnswered = selectedAnswers?.[idx] !== undefined;
                  const isFlaggedQ = flaggedQuestions.has(idx);

                  return (
                    <button
                      key={idx}
                      onClick={() => goToQuestion(idx)}
                      className={`
                        relative w-8 h-8 rounded-full font-bold text-xs transition-all flex-shrink-0
                        ${current === idx ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white scale-110 ring-2 ring-pink-300' : ''}
                        ${isAnswered && current !== idx ? 'bg-green-200 text-green-700' : ''}
                        ${!isAnswered && current !== idx ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' : ''}
                      `}
                      aria-label={`Μετάβαση στην ερώτηση ${idx + 1}`}
                    >
                      {idx + 1}
                      {isFlaggedQ && (
                        <Flag className="absolute -top-1 -right-1 w-3 h-3 text-red-500 fill-red-500 bg-white rounded-full p-0.5 border border-red-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              <motion.button
                onClick={handleNext}
                disabled={false}
                className={`
                  flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white shadow-lg
                  ${isLastQuestion ? 'bg-gradient-to-r from-green-500 to-emerald-500' : ''}
                `}
                style={{
                  background: isLastQuestion
                    ? undefined
                    : `linear-gradient(90deg, ${BRAND}, ${BRAND_DARK})`,
                }}
                whileHover={{ scale: 1.05, x: 4 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isLastQuestion ? 'Ολοκλήρωση' : 'Επόμενη ερώτηση'}
              >
                {isLastQuestion ? 'Ολοκλήρωση' : 'Επόμενη'}
                {isLastQuestion ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuizDialog;
