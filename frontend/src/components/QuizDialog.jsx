import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, CheckCircle, XCircle, Trophy, AlertCircle } from 'lucide-react';

const BRAND = '#fda8a9';
const BRAND_DARK = '#f88b8c';

const QuizDialog = ({ quiz, isOpen, onClose, onQuestionAnswered, selectedAnswers }) => {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [error, setError] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const selected = selectedAnswers?.[current] ?? null;
  const question = quiz?.questions?.[current];
  const isLastQuestion = current === (quiz?.questions?.length || 0) - 1;
  const allAnswered = quiz?.questions?.every((_, idx) => selectedAnswers?.[idx] !== undefined);

  // Calculate score
  useEffect(() => {
    if (quiz?.questions && selectedAnswers) {
      const correct = Object.entries(selectedAnswers).filter(([idx, ans]) => {
        const q = quiz.questions[parseInt(idx)];
        return q?.answers?.[ans.selectedAnswer]?.correct;
      }).length;
      setScore({ correct, total: Object.keys(selectedAnswers).length });
    }
  }, [selectedAnswers, quiz]);

  // Reset state when quiz changes
  useEffect(() => {
    setCurrent(0);
    setShowConfetti(false);
    setError(null);
  }, [isOpen, quiz]);

  // Confetti animation on completion
  useEffect(() => {
    if (allAnswered && isLastQuestion) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [allAnswered, isLastQuestion]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && current > 0) {
        setCurrent(prev => prev - 1);
      } else if (e.key === 'ArrowRight' && current < quiz.questions.length - 1) {
        setCurrent(prev => prev + 1);
      } else if (e.key >= '1' && e.key <= '4' && !selected) {
        const answerIndex = parseInt(e.key) - 1;
        if (answerIndex < question?.answers?.length) {
          handleSelect(answerIndex);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, current, quiz, selected, question]);

  const handleSelect = useCallback(async (idx) => {
    if (selected != null || !onQuestionAnswered || loading) return;

    setLoading(true);
    setError(null);

    try {
      const nickname = localStorage.getItem('nickname') || 'Anonymous';
      
      const response = await fetch('http://localhost:8001/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname,
          question_id: question.id,
          selected_answer: idx,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      onQuestionAnswered(quiz.id, current, idx, result.correct, result.points_earned);

      // Auto-advance to next question after a delay (if not last question)
      if (!isLastQuestion && result.correct) {
        setTimeout(() => {
          setCurrent(prev => prev + 1);
        }, 1500);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      setError('Σφάλμα κατά την υποβολή της απάντησης. Δοκίμασε ξανά.');
    } finally {
      setLoading(false);
    }
  }, [selected, onQuestionAnswered, loading, question, quiz, current, isLastQuestion]);

  if (!isOpen || !quiz) return null;

  const progress = ((current + 1) / quiz.questions.length) * 100;
  const scorePercentage = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

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
                  x: (Math.random() - 0.5) * 200
                }}
                transition={{ 
                  duration: 2 + Math.random() * 2, 
                  delay: Math.random() * 0.5,
                  ease: 'easeOut'
                }}
              />
            ))}
          </div>
        )}

        {/* Dialog */}
        <motion.div
          className="relative w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden bg-white"
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
                </motion.h3>
                {score.total > 0 && (
                  <motion.div
                    className="flex items-center gap-2 mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-semibold text-gray-600">
                      Σκορ: {score.correct}/{score.total} ({scorePercentage}%)
                    </span>
                  </motion.div>
                )}
              </div>

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
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Answers */}
            <div className="space-y-3 mb-8">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <motion.div
                    className="w-16 h-16 rounded-full border-4 border-t-transparent"
                    style={{ borderColor: BRAND }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <p className="mt-4 text-gray-500 font-medium">Υποβολή απάντησης...</p>
                </div>
              ) : (
                question?.answers?.map((ans, idx) => {
                  const isSelected = selected?.selectedAnswer === idx;
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
                        scale: isRevealed && isSelected ? [1, 1.02, 1] : 1
                      }}
                      transition={{ 
                        delay: idx * 0.08,
                        scale: { duration: 0.3 }
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
                })
              )}
            </div>

            {/* Explanation (if answered) */}
            {selected !== null && question?.explanation && (
              <motion.div
                className="mb-6 p-5 rounded-xl bg-blue-50 border-2 border-blue-200"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.4 }}
              >
                <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Επεξήγηση:
                </h4>
                <p className="text-blue-700">{question.explanation}</p>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6 border-t-2 border-pink-100">
              <motion.button
                onClick={() => setCurrent(p => p - 1)}
                disabled={current === 0}
                className={`
                  flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all
                  ${current === 0 
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
              <div className="hidden md:flex gap-2">
                {quiz.questions.slice(0, 10).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={`
                      w-8 h-8 rounded-full font-bold text-xs transition-all
                      ${current === idx ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white scale-110' : ''}
                      ${selectedAnswers?.[idx] !== undefined && current !== idx ? 'bg-green-200 text-green-700' : ''}
                      ${selectedAnswers?.[idx] === undefined && current !== idx ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' : ''}
                    `}
                    aria-label={`Μετάβαση στην ερώτηση ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                ))}
                {quiz.questions.length > 10 && (
                  <span className="flex items-center text-gray-500 text-xs">...</span>
                )}
              </div>

              <motion.button
                onClick={() => {
                  if (isLastQuestion) {
                    onClose();
                  } else {
                    setCurrent(p => p + 1);
                  }
                }}
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
                {isLastQuestion ? <CheckCircle className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </motion.button>
            </div>

            {/* Keyboard Shortcuts Hint */}
            <div className="mt-4 text-center text-xs text-gray-500">
              💡 Tip: Χρησιμοποίησε τα βέλη ←/→ για πλοήγηση και 1-4 για απαντήσεις
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuizDialog;