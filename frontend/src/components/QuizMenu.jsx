import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  BookOpen,
  CheckCircle,
  Clock,
  TrendingUp,
  Filter,
  SortAsc,
  Award,
  Play,
  RotateCcw,
  Info,
} from 'lucide-react';
import { fetchAllQuizzes } from '../utils/quizUtils';

const BRAND = '#fda8a9';
const BRAND_HOVER = '#f88b8c';

const QuizMenu = ({ onSelect, onClose, categoryAnswers = {} }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [q, setQ] = useState('');
  const [sortBy, setSortBy] = useState('default'); // default, progress, title, recent
  const [filterBy, setFilterBy] = useState('all'); // all, completed, inProgress, notStarted
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid, list

  const dialogRef = useRef(null);
  const searchInputRef = useRef(null);

  // Load quizzes
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchAllQuizzes();
        const withProgress = (Array.isArray(data) ? data : []).map((quiz) => {
          const answered = Object.keys(categoryAnswers[quiz.id] || {}).length;
          const total = quiz?.questions?.length || 0;
          const percent = total ? Math.round((answered / total) * 100) : 0;
          const correctAnswers = Object.values(categoryAnswers[quiz.id] || {}).filter(
            (ans, idx) => quiz.questions[idx]?.answers?.[ans.selectedAnswer]?.correct
          ).length;
          return { ...quiz, answered, total, percent, correctAnswers };
        });
        setQuizzes(withProgress);
      } catch (e) {
        console.error('Error loading quizzes:', e);
        setError('Αποτυχία φόρτωσης κεφαλαίων. Δοκίμασε ξανά.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [categoryAnswers]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (showSortMenu) setShowSortMenu(false);
        else if (showFilterMenu) setShowFilterMenu(false);
        else onClose?.();
      } else if (e.key === '/' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'g' && !showSortMenu && !showFilterMenu) {
        setViewMode('grid');
      } else if (e.key === 'l' && !showSortMenu && !showFilterMenu) {
        setViewMode('list');
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, showSortMenu, showFilterMenu]);

  // Auto-focus search on mount
  useEffect(() => {
    setTimeout(() => searchInputRef.current?.focus(), 100);
  }, []);

  // Filter and sort quizzes
  const processedQuizzes = useMemo(() => {
    let result = [...quizzes];

    // Search filter
    if (q.trim()) {
      const searchTerm = q.toLowerCase();
      result = result.filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(searchTerm) ||
          quiz.description?.toLowerCase().includes(searchTerm)
      );
    }

    // Progress filter
    if (filterBy !== 'all') {
      result = result.filter((quiz) => {
        if (filterBy === 'completed') return quiz.percent === 100;
        if (filterBy === 'inProgress') return quiz.percent > 0 && quiz.percent < 100;
        if (filterBy === 'notStarted') return quiz.percent === 0;
        return true;
      });
    }

    // Sort
    if (sortBy === 'progress') {
      result.sort((a, b) => b.percent - a.percent);
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title, 'el'));
    } else if (sortBy === 'recent') {
      // Sort by most recently answered (based on categoryAnswers timestamps)
      result.sort((a, b) => {
        const aLastAnswer =
          Object.values(categoryAnswers[a.id] || {})
            .map((ans) => new Date(ans.timestamp || 0))
            .sort((d1, d2) => d2 - d1)[0] || new Date(0);
        const bLastAnswer =
          Object.values(categoryAnswers[b.id] || {})
            .map((ans) => new Date(ans.timestamp || 0))
            .sort((d1, d2) => d2 - d1)[0] || new Date(0);
        return bLastAnswer - aLastAnswer;
      });
    }

    return result;
  }, [quizzes, q, sortBy, filterBy, categoryAnswers]);

  // Statistics
  const stats = useMemo(() => {
    const completed = quizzes.filter((q) => q.percent === 100).length;
    const inProgress = quizzes.filter((q) => q.percent > 0 && q.percent < 100).length;
    const notStarted = quizzes.filter((q) => q.percent === 0).length;
    const totalQuestions = quizzes.reduce((sum, q) => sum + q.total, 0);
    const answeredQuestions = quizzes.reduce((sum, q) => sum + q.answered, 0);
    const correctQuestions = quizzes.reduce((sum, q) => sum + (q.correctAnswers || 0), 0);
    const overallProgress = totalQuestions
      ? Math.round((answeredQuestions / totalQuestions) * 100)
      : 0;
    const accuracy = answeredQuestions
      ? Math.round((correctQuestions / answeredQuestions) * 100)
      : 0;

    return {
      completed,
      inProgress,
      notStarted,
      totalQuestions,
      answeredQuestions,
      correctQuestions,
      overallProgress,
      accuracy,
    };
  }, [quizzes]);

  const getQuizStatus = (quiz) => {
    if (quiz.percent === 100) return { label: 'Ολοκληρωμένο', color: 'green', icon: CheckCircle };
    if (quiz.percent > 0) return { label: 'Σε εξέλιξη', color: 'blue', icon: TrendingUp };
    return { label: 'Εκκρεμές', color: 'gray', icon: Clock };
  };

  const continueQuiz = (quiz) => {
    // Find first unanswered question
    const firstUnanswered = quiz.questions.findIndex((_, idx) => !categoryAnswers[quiz.id]?.[idx]);
    onSelect?.(quiz, firstUnanswered !== -1 ? firstUnanswered : 0);
  };

  const restartQuiz = (quiz, e) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Θέλεις να επαναρχίσεις το "${quiz.title}"; Θα χαθεί η πρόοδός σου σε αυτό το κεφάλαιο.`
      )
    ) {
      // Clear answers for this quiz
      const newAnswers = { ...categoryAnswers };
      delete newAnswers[quiz.id];
      localStorage.setItem('quizProgress', JSON.stringify(newAnswers));
      window.location.reload();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Dialog */}
        <motion.div
          ref={dialogRef}
          className="relative rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden bg-gradient-to-br from-white via-pink-50/30 to-rose-50/30"
          style={{ border: `3px solid ${BRAND}`, maxHeight: '75vh' }}
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="text-2xl md:text-3xl font-black mb-1">📚 Επιλογή Κεφαλαίου</h3>
                <p className="text-white/90 text-sm">
                  {quizzes.length} διαθέσιμα κεφάλαια • {stats.answeredQuestions} συνολικές
                  απαντήσεις
                </p>
              </motion.div>

              <motion.button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Κλείσιμο"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Stats Bar */}
            {!loading && quizzes.length > 0 && (
              <motion.div
                className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="w-4 h-4" />
                    <span className="text-xs font-medium opacity-90">Πρόοδος</span>
                  </div>
                  <div className="text-2xl font-black">{stats.overallProgress}%</div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-medium opacity-90">Ακρίβεια</span>
                  </div>
                  <div className="text-2xl font-black">{stats.accuracy}%</div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-medium opacity-90">Ολοκληρωμένα</span>
                  </div>
                  <div className="text-2xl font-black">{stats.completed}</div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-medium opacity-90">Σε εξέλιξη</span>
                  </div>
                  <div className="text-2xl font-black">{stats.inProgress}</div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-xs font-medium opacity-90">Εκκρεμή</span>
                  </div>
                  <div className="text-2xl font-black">{stats.notStarted}</div>
                </div>
              </motion.div>
            )}

            {/* Search & Filters */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  ref={searchInputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Αναζήτηση... (πάτα / για εστίαση)"
                  className="w-full rounded-xl px-4 py-3 pl-11 pr-10 text-gray-800 outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  aria-label="Αναζήτηση κεφαλαίων"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                {q && (
                  <button
                    onClick={() => setQ('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Καθαρισμός αναζήτησης"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Sort Button */}
              <div className="relative">
                <motion.button
                  onClick={() => {
                    setShowSortMenu(!showSortMenu);
                    setShowFilterMenu(false);
                  }}
                  className="px-4 py-3 rounded-xl bg-white/90 hover:bg-white text-gray-800 font-semibold flex items-center gap-2 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Ταξινόμηση"
                >
                  <SortAsc className="w-5 h-5" />
                  <span className="hidden md:inline">Ταξινόμηση</span>
                </motion.button>

                <AnimatePresence>
                  {showSortMenu && (
                    <motion.div
                      className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-2xl border-2 border-pink-200 overflow-hidden z-20 min-w-[200px]"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {[
                        { value: 'default', label: 'Προεπιλογή' },
                        { value: 'title', label: 'Αλφαβητικά' },
                        { value: 'progress', label: 'Πρόοδος' },
                        { value: 'recent', label: 'Πρόσφατα' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setShowSortMenu(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-pink-50 transition-colors ${
                            sortBy === option.value
                              ? 'bg-pink-100 text-pink-700 font-bold'
                              : 'text-gray-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Filter Button */}
              <div className="relative">
                <motion.button
                  onClick={() => {
                    setShowFilterMenu(!showFilterMenu);
                    setShowSortMenu(false);
                  }}
                  className="px-4 py-3 rounded-xl bg-white/90 hover:bg-white text-gray-800 font-semibold flex items-center gap-2 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Φίλτρα"
                >
                  <Filter className="w-5 h-5" />
                  {filterBy !== 'all' && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
                  <span className="hidden md:inline">Φίλτρα</span>
                </motion.button>

                <AnimatePresence>
                  {showFilterMenu && (
                    <motion.div
                      className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-2xl border-2 border-pink-200 overflow-hidden z-20 min-w-[200px]"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {[
                        { value: 'all', label: 'Όλα', icon: BookOpen },
                        { value: 'completed', label: 'Ολοκληρωμένα', icon: CheckCircle },
                        { value: 'inProgress', label: 'Σε εξέλιξη', icon: TrendingUp },
                        { value: 'notStarted', label: 'Εκκρεμή', icon: Clock },
                      ].map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            onClick={() => {
                              setFilterBy(option.value);
                              setShowFilterMenu(false);
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-pink-50 transition-colors flex items-center gap-2 ${
                              filterBy === option.value
                                ? 'bg-pink-100 text-pink-700 font-bold'
                                : 'text-gray-700'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {option.label}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 320px)' }}>
            {/* Error State */}
            {error && (
              <motion.div
                className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-red-800 mb-2">Σφάλμα</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
                >
                  Δοκίμασε ξανά
                </button>
              </motion.div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <motion.div
                  className="w-16 h-16 rounded-full border-4 border-t-transparent"
                  style={{ borderColor: BRAND }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <p className="mt-4 text-gray-500 font-semibold">Φόρτωση κεφαλαίων...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && processedQuizzes.length === 0 && (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {q.trim() ? 'Δεν βρέθηκαν αποτελέσματα' : 'Δεν βρέθηκαν κεφάλαια'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {q.trim()
                    ? 'Δοκίμασε διαφορετική αναζήτηση'
                    : 'Κανένα κεφάλαιο διαθέσιμο αυτή τη στιγμή'}
                </p>
                {(q.trim() || filterBy !== 'all') && (
                  <button
                    onClick={() => {
                      setQ('');
                      setFilterBy('all');
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Καθαρισμός φίλτρων
                  </button>
                )}
              </motion.div>
            )}

            {/* Quiz Grid */}
            {!loading && !error && processedQuizzes.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {processedQuizzes.map((quiz, i) => {
                  const status = getQuizStatus(quiz);
                  const StatusIcon = status.icon;

                  return (
                    <motion.div
                      key={quiz.id}
                      className="group relative p-6 rounded-2xl bg-white border-2 border-pink-200 hover:border-pink-400 hover:shadow-2xl transition-all overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.05, 0.5) }}
                      whileHover={{ y: -8, scale: 1.02 }}
                    >
                      {/* Progress Bar */}
                      <div className="absolute top-0 left-0 h-2 w-full bg-gray-200 rounded-t-2xl overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-red-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${quiz.percent}%` }}
                          transition={{ duration: 1, delay: Math.min(i * 0.05 + 0.3, 0.8) }}
                        />
                      </div>

                      {/* Icon & Badge */}
                      <div className="flex items-center justify-between mb-4 mt-2">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-100 group-hover:from-pink-200 group-hover:to-rose-200 transition-all">
                          <BookOpen className="w-7 h-7 text-pink-600" />
                        </div>

                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: Math.min(i * 0.05 + 0.4, 0.9) }}
                        >
                          <div
                            className={`
                            flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold
                            ${status.color === 'green' ? 'bg-green-100 text-green-700' : ''}
                            ${status.color === 'blue' ? 'bg-blue-100 text-blue-700' : ''}
                            ${status.color === 'gray' ? 'bg-gray-100 text-gray-700' : ''}
                          `}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </div>
                        </motion.div>
                      </div>

                      {/* Title */}
                      <h4 className="font-bold text-lg text-gray-800 group-hover:text-pink-600 transition-colors mb-3 line-clamp-2 leading-tight">
                        {quiz.title}
                      </h4>

                      {/* Description */}
                      {quiz.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {quiz.description}
                        </p>
                      )}

                      {/* Stats */}
                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Ερωτήσεις
                          </span>
                          <span className="font-bold">
                            {quiz.answered}/{quiz.total}
                          </span>
                        </div>

                        {quiz.answered > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              Σωστές
                            </span>
                            <span className="font-bold text-green-600">
                              {quiz.correctAnswers}/{quiz.answered}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                          <span className="text-gray-600">Πρόοδος</span>
                          <span
                            className="font-black text-xl"
                            style={{
                              color:
                                quiz.percent === 100
                                  ? '#10b981'
                                  : quiz.percent > 0
                                    ? BRAND
                                    : '#6b7280',
                            }}
                          >
                            {quiz.percent}%
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => continueQuiz(quiz)}
                          className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Play className="w-4 h-4" />
                          {quiz.percent > 0 ? 'Συνέχεια' : 'Έναρξη'}
                        </motion.button>

                        {quiz.answered > 0 && (
                          <motion.button
                            onClick={(e) => restartQuiz(quiz, e)}
                            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                            whileHover={{ scale: 1.1, rotate: -180 }}
                            whileTap={{ scale: 0.9 }}
                            title="Επανεκκίνηση"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>

                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 to-rose-500/0 group-hover:from-pink-500/5 group-hover:to-rose-500/5 transition-all rounded-2xl pointer-events-none" />
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer info */}
          {!loading && processedQuizzes.length > 0 && (
            <div className="sticky bottom-0 bg-gradient-to-r from-pink-50 to-rose-50 px-6 py-3 border-t-2 border-pink-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  Εμφανίζονται {processedQuizzes.length} από {quizzes.length} κεφάλαια
                  {(q.trim() || filterBy !== 'all') && ' (φιλτραρισμένα)'}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuizMenu;
