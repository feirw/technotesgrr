import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, BookOpen, CheckCircle } from 'lucide-react';
import { fetchAllQuizzes } from '../utils/quizUtils';

const BRAND = '#fda8a9';
const BRAND_HOVER = '#f88b8c';

const QuizMenu = ({ onSelect, onClose, categoryAnswers = {} }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const dialogRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAllQuizzes();
        const withProgress = (Array.isArray(data) ? data : []).map((quiz) => {
          const answered = Object.keys(categoryAnswers[quiz.id] || {}).length;
          const total = quiz?.questions?.length || 0;
          const percent = total ? Math.round((answered / total) * 100) : 0;
          return { ...quiz, answered, total, percent };
        });
        setQuizzes(withProgress);
      } catch (e) {
        console.error('Error:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [categoryAnswers]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const filtered = quizzes.filter(
    (x) => !q.trim() || x.title.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <motion.div
          ref={dialogRef}
          className="relative rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden bg-gradient-to-br from-white to-pink-50"
          style={{ border: `3px solid ${BRAND}`, maxHeight: '85vh' }}
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <motion.h3
                className="text-3xl font-black"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                📚 Επιλογή Κεφαλαίου
              </motion.h3>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Search */}
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Αναζήτηση..."
                className="w-full rounded-xl px-4 py-3 pl-11 pr-10 text-gray-800 outline-none"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              {q && (
                <button
                  onClick={() => setQ('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(85vh - 160px)' }}>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <motion.div
                  className="w-16 h-16 rounded-full border-4 border-t-transparent"
                  style={{ borderColor: BRAND }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <p className="mt-4 text-gray-500 font-semibold">Φόρτωση...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Δεν βρέθηκαν κεφάλαια</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((quiz, i) => (
                  <motion.button
                    key={quiz.id}
                    onClick={() => onSelect?.(quiz)}
                    className="group relative p-6 rounded-2xl bg-white border-2 border-pink-200 hover:border-pink-400 hover:shadow-2xl transition-all text-left overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -6, scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 h-1.5 w-full bg-gray-200">
                      <motion.div
                        className="h-full bg-gradient-to-r from-pink-500 to-rose-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${quiz.percent}%` }}
                        transition={{ duration: 1, delay: i * 0.05 + 0.3 }}
                      />
                    </div>

                    {/* Icon */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-100 group-hover:from-pink-200 group-hover:to-rose-200 transition-all">
                        <BookOpen className="w-6 h-6 text-pink-600" />
                      </div>
                      {quiz.percent === 100 && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 500, delay: i * 0.05 + 0.5 }}
                        >
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        </motion.div>
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="font-bold text-lg text-gray-800 group-hover:text-pink-600 transition-colors mb-3 line-clamp-2">
                      {quiz.title}
                    </h4>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {quiz.answered}/{quiz.total} ερωτήσεις
                      </span>
                      <span
                        className="font-black text-xl"
                        style={{ color: quiz.percent === 100 ? '#10b981' : BRAND }}
                      >
                        {quiz.percent}%
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuizMenu;
