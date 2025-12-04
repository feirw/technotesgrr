import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  CheckCircle,
  Clock,
  TrendingUp,
  Filter,
  SortAsc,
  Award,
  Play,
  RotateCcw,
  BookOpen,
  Code,
  Terminal,
} from 'lucide-react';
import QuizDialog from '../components/QuizDialog.jsx';
import { fetchAllQuizzes } from '../utils/quizUtils';
import { useAuth } from '../contexts/AuthContext';

// Χρήση πιο καθορισμένων χρωμάτων (Tailwind friendly)
const BRAND = 'rgb(236, 72, 153)'; // pink-600
const BRAND_DARK = 'rgb(187, 12, 60)'; // A deeper red/pink for gradients

const QuizPage = () => {
  // 1. Use AuthContext instead of AppContext
  const { user } = useAuth();
  // Derive nickname from user object or fallback
  const nickname = user?.username || user?.email?.split('@')[0] || 'Guest';

  // --- QuizPage State ---
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [categoryAnswers, setCategoryAnswers] = useState({});

  // --- QuizMenu State (Merged Logic) ---
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [q, setQ] = useState('');
  const [sortBy, setSortBy] = useState('progress');
  const [filterBy, setFilterBy] = useState('all');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterBy] = useState(false);

  const searchInputRef = useRef(null);

  // Initial setup & progress load
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchAllQuizzes();
        // Load progress from localStorage (for now)
        const initialAnswers = JSON.parse(localStorage.getItem('quizProgress') || '{}');
        setCategoryAnswers(initialAnswers);

        const withProgress = (Array.isArray(data) ? data : []).map((quiz) => {
          const answered = Object.keys(initialAnswers[quiz.id] || {}).length;
          const total = quiz?.questions?.length || 0;
          const percent = total ? Math.round((answered / total) * 100) : 0;

          // Simplified correct answers calculation
          const correctAnswers = Object.values(initialAnswers[quiz.id] || {}).filter(
            (ans, idx) => quiz.questions[idx]?.answers?.[ans]?.correct
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
  }, []); // Removed nickname dependency

  // Keyboard shortcut for search focus
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Handle Answered Question (Update local progress)
  const handleQuestionAnswered = (quizId, questionIdx, selectedIdx, isCorrect) => {
    setCategoryAnswers((prev) => {
      const prevQuiz = prev[quizId] ? { ...prev[quizId] } : {};
      prevQuiz[questionIdx] = selectedIdx;

      const newAnswers = { ...prev, [quizId]: prevQuiz };

      localStorage.setItem('quizProgress', JSON.stringify(newAnswers));

      return newAnswers;
    });
    // Note: We removed fetchLeaderboard() here because the LeaderboardPage 
    // fetches fresh data on mount, and backend handles updates automatically.
  };

  // Quiz Menu Handlers
  const handleQuizCategorySelect = (quiz) => {
    setSelectedQuiz(quiz);
    setIsQuizDialogOpen(true);
  };

  const handleQuizDialogClose = () => {
    setIsQuizDialogOpen(false);
    // Force re-evaluation of quiz progress on the main screen by reloading state logic if needed
    // or just re-triggering the effect. For simplicity here, we rely on local state updates.
    setQuizzes((prev) => [...prev]); 
  };

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
      result.sort((a, b) => {
        const getLatestTimestamp = (quizId) => {
          const answers = categoryAnswers[quizId] || {};
          // Assuming answers might store timestamps in future, currently just length/keys
          // Fallback to simpler logic or metadata if available. 
          // For now, using keys as proxies for activity if sequential.
          const latestIndex = Math.max(...Object.keys(answers).map(Number));
          return latestIndex > -1 ? latestIndex : 0;
        };
        return getLatestTimestamp(b.id) - getLatestTimestamp(a.id);
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

  // Utility Functions
  const getQuizStatus = (quiz) => {
    if (quiz.percent === 100) return { label: 'Ολοκληρωμένο', color: 'green', icon: CheckCircle };
    if (quiz.percent > 0) return { label: 'Σε εξέλιξη', color: 'blue', icon: TrendingUp };
    return { label: 'Εκκρεμές', color: 'gray', icon: Clock };
  };

  const continueQuiz = (quiz) => {
    const firstUnanswered = quiz.questions.findIndex((_, idx) => !categoryAnswers[quiz.id]?.[idx]);
    handleQuizCategorySelect(quiz, firstUnanswered !== -1 ? firstUnanswered : 0);
  };

  const restartQuiz = (quiz, e) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Θέλεις να επαναρχίσεις το "${quiz.title}"; Θα χαθεί η πρόοδός σου σε αυτό το κεφάλαιο.`
      )
    ) {
      setCategoryAnswers((prev) => {
        const newAnswers = { ...prev };
        delete newAnswers[quiz.id];
        localStorage.setItem('quizProgress', JSON.stringify(newAnswers));
        return newAnswers;
      });
      // Force refresh of quizzes state to reflect reset
      setQuizzes((prev) =>
        prev.map((q) =>
          q.id === quiz.id
            ? { ...q, percent: 0, answered: 0, correctAnswers: 0 }
            : q
        )
      );
    }
  };

  // Background Component
  const TechBackgroundPattern = useMemo(
    () => (
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-800 transition-colors duration-500">
        {/* Binary Code Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-5 font-mono text-xs overflow-hidden text-pink-300 dark:text-purple-400/50">
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.div
              key={i}
              className="whitespace-nowrap"
              initial={{ x: i % 2 === 0 ? '100%' : '-100%' }}
              animate={{ x: i % 2 === 0 ? '-100%' : '100%' }}
              transition={{
                duration: 30 + i * 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              {Array.from({ length: 200 })
                .map((_, j) => (Math.random() > 0.5 ? '1' : '0'))
                .join('')}
            </motion.div>
          ))}
        </div>

        {/* Floating Code Symbols */}
        <div className="absolute inset-0 opacity-10 dark:opacity-10 text-pink-400 dark:text-rose-500/20">
          <div className="absolute top-10 left-10 text-6xl">
            <Code size={80} />
          </div>
          <div className="absolute top-40 right-20 text-7xl">{'{ }'}</div>
          <div className="absolute bottom-20 left-1/4 text-5xl">[ ]</div>
          <div className="absolute top-1/3 right-1/3 text-4xl">
            <Terminal size={60} />
          </div>
          <div className="absolute bottom-40 right-10 text-6xl">=&gt;</div>
          <div className="absolute top-60 left-1/2 text-8xl">#</div>
        </div>

        {/* Gradient Overlay for soft edge */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/50 dark:from-gray-900/50 to-transparent pointer-events-none" />
      </div>
    ),
    []
  );

  return (
    <div className="min-h-screen relative">
      {TechBackgroundPattern}

      {/* Main Content Area */}
      <div className="relative z-20 flex flex-col min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white p-6 shadow-xl dark:shadow-pink-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="text-2xl md:text-3xl font-black mb-1">📚 Επιλογή Κεφαλαίου</h3>
                <p className="text-white/90 text-sm">
                  {quizzes.length} διαθέσιμα κεφάλαια • {stats.answeredQuestions} συνολικές
                  απαντήσεις
                </p>
              </motion.div>
            </div>
            
            {/* Stats Bar */}
            {!loading && quizzes.length > 0 && (
              <motion.div
                className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {[
                  { label: 'Πρόοδος', value: stats.overallProgress + '%', icon: Award },
                  { label: 'Ακρίβεια', value: stats.accuracy + '%', icon: TrendingUp },
                  { label: 'Ολοκληρωμένα', value: stats.completed, icon: CheckCircle },
                  { label: 'Σε εξέλιξη', value: stats.inProgress, icon: Clock },
                  { label: 'Εκκρεμή', value: stats.notStarted, icon: BookOpen },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Icon className="w-4 h-4" />
                        <span className="text-xs font-medium opacity-90">{item.label}</span>
                      </div>
                      <div className="text-xl font-black">{item.value}</div>
                    </div>
                  );
                })}
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
                  <motion.button
                    onClick={() => setQ('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Καθαρισμός αναζήτησης"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </div>

              {/* Sort Button */}
              <div className="relative">
                <motion.button
                  onClick={() => {
                    setShowSortMenu(!showSortMenu);
                    setShowFilterBy(false);
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
                        { value: 'progress', label: 'Πρόοδος' },
                        { value: 'title', label: 'Αλφαβητικά' },
                        { value: 'recent', label: 'Πρόσφατα' },
                        { value: 'default', label: 'Προεπιλογή' },
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
                    setShowFilterBy(!showFilterMenu);
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
                              setShowFilterBy(false);
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
        </div>

        {/* Content (Quiz Grid) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto w-full">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
              {processedQuizzes.map((quiz, i) => {
                const status = getQuizStatus(quiz);
                const StatusIcon = status.icon;

                return (
                  <motion.div
                    key={quiz.id}
                    className="group relative p-6 rounded-2xl bg-white dark:bg-gray-700 border-2 border-pink-200 hover:border-pink-400 hover:shadow-2xl transition-all overflow-hidden cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.05, 0.5) }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    onClick={() => continueQuiz(quiz)}
                  >
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 h-2 w-full bg-gray-200 dark:bg-gray-600 rounded-t-2xl overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-red-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${quiz.percent}%` }}
                        transition={{ duration: 1, delay: Math.min(i * 0.05 + 0.3, 0.8) }}
                      />
                    </div>

                    {/* Icon & Badge */}
                    <div className="flex items-center justify-between mb-4 mt-2">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/50 dark:to-rose-900/50 group-hover:from-pink-200 group-hover:to-rose-200 transition-all">
                        <BookOpen className="w-7 h-7 text-pink-600 dark:text-pink-300" />
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
                    <h4 className="font-bold text-lg text-gray-800 dark:text-white group-hover:text-pink-600 transition-colors mb-3 line-clamp-2 leading-tight">
                      {quiz.title}
                    </h4>

                    {/* Description */}
                    {quiz.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {quiz.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Ερωτήσεις
                        </span>
                        <span className="font-bold text-gray-800 dark:text-white">
                          {quiz.answered}/{quiz.total}
                        </span>
                      </div>

                      {quiz.answered > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Σωστές
                          </span>
                          <span className="font-bold text-green-600 dark:text-green-400">
                            {quiz.correctAnswers}/{quiz.answered}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-600">
                      <motion.button
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
                          className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 transition-colors"
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
      </div>

      {/* Quiz Dialog */}
      {isQuizDialogOpen && selectedQuiz && (
        <QuizDialog
          quiz={selectedQuiz}
          isOpen={isQuizDialogOpen}
          onClose={handleQuizDialogClose}
          onQuestionAnswered={handleQuestionAnswered}
          selectedAnswers={categoryAnswers[selectedQuiz.id] || {}}
        />
      )}
    </div>
  );
};

export default QuizPage;