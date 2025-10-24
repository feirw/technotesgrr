import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';

const BRAND = '#fda8a9';
const BRAND_DARK = '#f88b8c';

const QuizDialog = ({ quiz, isOpen, onClose, onQuestionAnswered, selectedAnswers }) => {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const selected = selectedAnswers?.[current] ?? null;
  const question = quiz?.questions?.[current];
  const isLastQuestion = current === (quiz?.questions?.length || 0) - 1;
  const allAnswered = quiz?.questions?.every((_, idx) => selectedAnswers?.[idx] !== undefined);

  useEffect(() => {
    setCurrent(0);
    setShowConfetti(false);
  }, [isOpen, quiz]);

  useEffect(() => {
    if (allAnswered && isLastQuestion) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [allAnswered, isLastQuestion]);

  if (!isOpen || !quiz) return null;

  const handleSelect = async (idx) => {
    if (selected == null && onQuestionAnswered) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8001/api/quiz/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nickname: localStorage.getItem('nickname') || 'Anonymous',
            question_id: question.id,
            selected_answer: idx,
          }),
        });
        const result = await response.json();
        onQuestionAnswered(quiz.id, current, idx, result.correct, result.points_earned);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const progress = ((current + 1) / quiz.questions.length) * 100;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />

        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div key={i} className="absolute w-3 h-3 rounded-full" style={{ left: `${Math.random() * 100}%`, top: '-10%', backgroundColor: ['#fda8a9', '#10b981', '#3b82f6', '#f59e0b'][Math.floor(Math.random() * 4)] }} initial={{ y: 0, opacity: 1, rotate: 0 }} animate={{ y: window.innerHeight + 100, opacity: 0, rotate: 360 }} transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 0.5 }} />
            ))}
          </div>
        )}

        <motion.div className="relative w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden bg-white" style={{ border: `4px solid ${BRAND}` }} initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }} transition={{ type: 'spring', stiffness: 300 }}>
          
          {/* Progress Bar */}
          <div className="h-2 bg-gray-200">
            <motion.div className="h-full bg-gradient-to-r from-pink-500 to-rose-500" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
          </div>

          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <motion.h3 className="text-2xl font-black" style={{ color: BRAND_DARK }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                Ερώτηση {current + 1} / {quiz.questions.length}
              </motion.h3>
              <motion.button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors" whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
                <X className="w-6 h-6 text-gray-600" />
              </motion.button>
            </div>

            {/* Question */}
            <motion.div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50" style={{ border: `2px solid ${BRAND}` }} key={current} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-xl font-semibold text-gray-800 text-center">
                {question?.question}
              </p>
            </motion.div>

            {/* Answers */}
            <div className="space-y-3 mb-8">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <motion.div className="w-12 h-12 rounded-full border-4 border-t-transparent" style={{ borderColor: BRAND }} animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
                </div>
              ) : (
                question?.answers?.map((ans, idx) => {
                  const isSelected = selected?.selectedAnswer === idx;
                  const isRevealed = selected !== null;
                  const isCorrect = ans.correct;

                  return (
                    <motion.button key={idx} onClick={() => handleSelect(idx)} disabled={isRevealed} className={`
                      relative flex items-center gap-3 w-full px-6 py-4 rounded-xl
                      border-2 font-semibold text-left transition-all
                      ${!isRevealed ? 'bg-white border-pink-200 hover:border-pink-400 hover:shadow-lg' : ''}
                      ${isRevealed && isCorrect ? 'bg-green-50 border-green-500' : ''}
                      ${isRevealed && !isCorrect && isSelected ? 'bg-red-50 border-red-500' : ''}
                      ${isRevealed && !isCorrect && !isSelected ? 'bg-gray-100 border-gray-300 opacity-60' : ''}
                    `} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0, scale: isRevealed && isSelected ? 1.02 : 1 }} transition={{ delay: idx * 0.1 }} whileHover={!isRevealed ? { scale: 1.02, x: 4 } : {}} whileTap={!isRevealed ? { scale: 0.98 } : {}}>
                      
                      <div className={`
                        flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm flex-shrink-0
                        ${!isRevealed ? 'bg-pink-100 text-pink-600' : ''}
                        ${isRevealed && isCorrect ? 'bg-green-500 text-white' : ''}
                        ${isRevealed && !isCorrect ? 'bg-gray-300 text-gray-600' : ''}
                      `}>
                        {String.fromCharCode(65 + idx)}
                      </div>

                      <span className={`flex-1 ${isRevealed && isCorrect ? 'text-green-800' : isRevealed && !isCorrect && isSelected ? 'text-red-800' : 'text-gray-800'}`}>
                        {ans.text}
                      </span>

                      {isRevealed && isCorrect && (
                        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 500 }}>
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        </motion.div>
                      )}
                      {isRevealed && isSelected && !isCorrect && (
                        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 500 }}>
                          <XCircle className="w-6 h-6 text-red-500" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4 border-t-2 border-pink-100">
              <motion.button onClick={() => setCurrent(p => p - 1)} disabled={current === 0} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold ${current === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border-2 border-pink-200 hover:border-pink-400'}`} whileHover={current > 0 ? { scale: 1.05, x: -4 } : {}} whileTap={current > 0 ? { scale: 0.95 } : {}}>
                <ChevronLeft className="w-5 h-5" />
                Προηγούμενη
              </motion.button>

              <motion.button onClick={() => setCurrent(p => p + 1)} disabled={isLastQuestion} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white ${isLastQuestion ? 'bg-gray-400 cursor-not-allowed' : ''}`} style={{ background: isLastQuestion ? '#9ca3af' : `linear-gradient(90deg, ${BRAND}, ${BRAND_DARK})` }} whileHover={!isLastQuestion ? { scale: 1.05, x: 4 } : {}} whileTap={!isLastQuestion ? { scale: 0.95 } : {}}>
                Επόμενη
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuizDialog;