import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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
import QuizDialog from '@/components/private/QuizDialog';
import { fetchAllQuizzes } from '@/utils/quizUtils';
import { useAuth } from '@/contexts/AuthContext';

// --- Types & Interfaces ---
// (Τα interfaces παραμένουν ίδια)
interface Answer { text: string; correct: boolean; }
interface Question { id: string; question: string; answers: Answer[]; explanation?: string; }
interface QuizData { id: string; title: string; number: string; description?: string; questions: Question[]; }
interface ProcessedQuiz extends QuizData { answered: number; total: number; percent: number; correctAnswers: number; }
type QuizProgress = Record<string, Record<number, number>>;
interface QuizStats { completed: number; inProgress: number; notStarted: number; totalQuestions: number; answeredQuestions: number; correctQuestions: number; overallProgress: number; accuracy: number; }
interface QuizStatus { label: string; color: 'green' | 'blue' | 'gray'; icon: any; }

const BRAND = 'rgb(236, 72, 153)';

const QuizPage: React.FC = () => {
  const { user } = useAuth();

  // --- QuizPage State ---
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState<boolean>(false);
  const [selectedQuiz, setSelectedQuiz] = useState<ProcessedQuiz | null>(null);
  const [categoryAnswers, setCategoryAnswers] = useState<QuizProgress>({});

  // --- QuizMenu State ---
  const [quizzes, setQuizzes] = useState<ProcessedQuiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState<string>('');
  const [sortBy, setSortBy] = useState<'progress' | 'title' | 'recent' | 'default'>('progress');
  const [filterBy, setFilterBy] = useState<'all' | 'completed' | 'inProgress' | 'notStarted'>('all');
  const [showSortMenu, setShowSortMenu] = useState<boolean>(false);
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // 1. Safe LocalStorage Access Helper
  const safeGetProgress = useCallback((): QuizProgress => {
    try {
      const stored = localStorage.getItem('quizProgress');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.warn('LocalStorage is disabled or corrupted:', e);
      return {};
    }
  }, []);

  const safeSetProgress = useCallback((progress: QuizProgress) => {
    try {
      localStorage.setItem('quizProgress', JSON.stringify(progress));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, []);

  // 2. Load Function (Reusable for re-fetching without reload)
  const loadQuizzes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = (await fetchAllQuizzes()) as QuizData[];
      const initialAnswers = safeGetProgress();
      setCategoryAnswers(initialAnswers);

      const withProgress: ProcessedQuiz[] = (Array.isArray(data) ? data : []).map((quiz) => {
        const quizAnswers = initialAnswers[quiz.id] || {};
        const answered = Object.keys(quizAnswers).length;
        const total = quiz?.questions?.length || 0;
        const percent = total ? Math.round((answered / total) * 100) : 0;
        const correctAnswersCount = Object.entries(quizAnswers).filter(([qIdx, ansIdx]) => {
          return quiz.questions[parseInt(qIdx, 10)]?.answers?.[ansIdx]?.correct;
        }).length;

        return { ...quiz, answered, total, percent, correctAnswers: correctAnswersCount };
      });

      setQuizzes(withProgress);
    } catch (e) {
      console.error('Error loading quizzes:', e);
      setError('Αποτυχία φόρτωσης κεφαλαίων. Δοκίμασε ξανά.');
    } finally {
      setLoading(false);
    }
  }, [safeGetProgress]);

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  // Keyboard shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const handleQuestionAnswered = (
    quizId: string,
    questionIdx: number,
    selectedIdx: number,
    isCorrect: boolean
  ) => {
    setCategoryAnswers((prev) => {
      const prevQuiz = prev[quizId] ? { ...prev[quizId] } : {};
      prevQuiz[questionIdx] = selectedIdx;
      const newAnswers = { ...prev, [quizId]: prevQuiz };
      safeSetProgress(newAnswers);
      return newAnswers;
    });

    setQuizzes((prevQuizzes) =>
      prevQuizzes.map((quiz) => {
        if (quiz.id !== quizId) return quiz;
        const quizAnswers = safeGetProgress()[quizId] || {};
        const answeredCount = Object.keys(quizAnswers).length;
        const newPercent = quiz.total ? Math.round((answeredCount / quiz.total) * 100) : 0;
        
        // Correct answers calculation
        const correctCount = Object.entries(quizAnswers).filter(([qIdx, ansIdx]) => {
          return quiz.questions[parseInt(qIdx, 10)]?.answers?.[ansIdx as number]?.correct;
        }).length;

        return { ...quiz, answered: answeredCount, percent: newPercent, correctAnswers: correctCount };
      })
    );
  };

  const handleQuizDialogClose = () => {
    setIsQuizDialogOpen(false);
    const currentAnswers = safeGetProgress();
    setQuizzes((prev) =>
      prev.map((quiz) => {
        const quizAnswers = currentAnswers[quiz.id] || {};
        const answered = Object.keys(quizAnswers).length;
        const total = quiz.questions.length;
        return { 
          ...quiz, 
          answered, 
          percent: total ? Math.round((answered / total) * 100) : 0,
          correctAnswers: Object.entries(quizAnswers).filter(([qIdx, ansIdx]) => 
            quiz.questions[parseInt(qIdx, 10)]?.answers?.[ansIdx as number]?.correct
          ).length
        };
      })
    );
  };

  // (Memoized Logic for processedQuizzes and stats remains same)
  const processedQuizzes = useMemo(() => {
    let result = [...quizzes];
    if (q.trim()) {
      const searchTerm = q.toLowerCase();
      result = result.filter(z => z.title.toLowerCase().includes(searchTerm) || z.description?.toLowerCase().includes(searchTerm));
    }
    if (filterBy !== 'all') {
      result = result.filter(quiz => {
        if (filterBy === 'completed') return quiz.percent === 100;
        if (filterBy === 'inProgress') return quiz.percent > 0 && quiz.percent < 100;
        if (filterBy === 'notStarted') return quiz.percent === 0;
        return true;
      });
    }
    // Sorting logic
    if (sortBy === 'progress') result.sort((a, b) => b.percent - a.percent);
    else if (sortBy === 'title') result.sort((a, b) => a.title.localeCompare(b.title, 'el'));
    return result;
  }, [quizzes, q, sortBy, filterBy]);

  const stats: QuizStats = useMemo(() => {
    const totalQuestions = quizzes.reduce((sum, q) => sum + q.total, 0);
    const answeredQuestions = quizzes.reduce((sum, q) => sum + q.answered, 0);
    const correctQuestions = quizzes.reduce((sum, q) => sum + (q.correctAnswers || 0), 0);
    return {
      completed: quizzes.filter(q => q.percent === 100).length,
      inProgress: quizzes.filter(q => q.percent > 0 && q.percent < 100).length,
      notStarted: quizzes.filter(q => q.percent === 0).length,
      totalQuestions,
      answeredQuestions,
      correctQuestions,
      overallProgress: totalQuestions ? Math.round((answeredQuestions / totalQuestions) * 100) : 0,
      accuracy: answeredQuestions ? Math.round((correctQuestions / answeredQuestions) * 100) : 0,
    };
  }, [quizzes]);

  const restartQuiz = (quiz: ProcessedQuiz, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Θέλεις να επαναρχίσεις το "${quiz.title}";`)) {
      const current = safeGetProgress();
      delete current[quiz.id];
      safeSetProgress(current);
      setCategoryAnswers(current);
      setQuizzes(prev => prev.map(q => q.id === quiz.id ? { ...q, percent: 0, answered: 0, correctAnswers: 0 } : q));
    }
  };

  // UI components (Background κτλ παραμένουν ίδια)
  return (
    <div className="min-h-screen relative">
      {/* Background κτλ... */}
      <div className="relative z-20 flex flex-col min-h-screen">
        {/* Sticky Header */}
        <div className="sticky top-0 z-30 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white p-6 shadow-xl">
          {/* Header Content... */}
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto w-full">
          {error && (
            <motion.div className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 text-center">
              <h3 className="text-xl font-bold text-red-800">Σφάλμα</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadQuizzes} // 3. FIX: No window.location.reload()
                className="px-6 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
              >
                Δοκίμασε ξανά
              </button>
            </motion.div>
          )}

          {/* Υπόλοιπο UI... */}
          {/* (Το υπόλοιπο JSX παραμένει ως είχε με τις αλλαγές που έγιναν στα handlers) */}
        </div>
      </div>

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