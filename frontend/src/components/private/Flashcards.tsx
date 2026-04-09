import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Zap,
  Shuffle,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Target,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { fetchFlashcardsFromBackend } from '@/utils/flashcardsFetch';

// --- Types & Interfaces ---

interface RawFlashcard {
  id: number;
  category: string;
  question: string;
  answer: string;
}

interface FlashcardItem {
  id: number | string;
  front: string;
  back: string;
}

interface FlashcardSet {
  id: string;
  title: string;
  questions: FlashcardItem[];
}

interface CardProgress {
  studied: boolean;
  known: boolean;
  difficult: boolean;
  needReview: boolean;
  lastStudied?: number;
  timesStudied: number;
  timesCorrect: number;
}

type StudyMode = 'all' | 'difficult' | 'review' | 'new';

interface FlashcardProgress {
  [setId: string]: {
    [cardId: string]: CardProgress;
  };
}

// --- Constants ---

const BRAND = '#ff6b7a';
const STORAGE_KEY = 'flashcardProgress';
const FLASHCARD_CACHE_KEY = 'flashcardData:v1';

const Flashcards: React.FC = () => {
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [selectedSetIndex, setSelectedSetIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [studyMode, setStudyMode] = useState<StudyMode>('all');
  const [shuffled, setShuffled] = useState<boolean>(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);

  const isMountedRef = useRef(true);
  const cardBodyRef = useRef<HTMLButtonElement | null>(null);
  const studySessionRef = useRef<{ cardsStudied: Set<string> }>({ cardsStudied: new Set() });

  // Load progress from localStorage
  const [progress, setProgress] = useState<FlashcardProgress>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Save progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (err) {
      console.warn('Failed to save progress:', err);
    }
  }, [progress]);

  const fetchFlashcardData = useCallback(async () => {
    if (!isMountedRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const cached = sessionStorage.getItem(FLASHCARD_CACHE_KEY);
      const cachedData = cached ? (JSON.parse(cached) as FlashcardSet[]) : null;

      if (cachedData && cachedData.length) {
        setFlashcardSets(cachedData);
        setLoading(false);
      }

      const flashcardsData = await fetchFlashcardsFromBackend();
      const flashcards = flashcardsData.flashcards || [];

      const byCategory = flashcards.reduce<Record<string, RawFlashcard[]>>((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
      }, {});

      const sets: FlashcardSet[] = Object.entries(byCategory).map(([category, cards]) => ({
        id: category.toLowerCase().replace(/\s+/g, '-'),
        title: category,
        questions: cards.map((card) => ({
          id: card.id,
          front: card.question,
          back: card.answer,
        })),
      }));

      if (!isMountedRef.current) return;
      setFlashcardSets(sets);
      sessionStorage.setItem(FLASHCARD_CACHE_KEY, JSON.stringify(sets));
    } catch (err) {
      console.error('Error fetching flashcard data:', err);
      if (!isMountedRef.current) return;
      setError('Αποτυχία φόρτωσης Flashcards. Δοκίμασε ξανά.');
    } finally {
      if (!isMountedRef.current) return;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    void fetchFlashcardData();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchFlashcardData]);

  // Get current set
  const currentSet = useMemo(() => {
    return selectedSetIndex !== null ? (flashcardSets[selectedSetIndex] ?? null) : null;
  }, [selectedSetIndex, flashcardSets]);

  // Get filtered cards based on study mode
  const filteredCards = useMemo(() => {
    if (!currentSet) return [];

    const setProgress = progress[currentSet.id] || {};
    let cards = [...currentSet.questions];

    // Apply study mode filter
    if (studyMode === 'difficult') {
      cards = cards.filter((card) => setProgress[String(card.id)]?.difficult);
    } else if (studyMode === 'review') {
      cards = cards.filter((card) => {
        const cardProg = setProgress[String(card.id)];
        return (
          cardProg?.needReview ||
          (cardProg?.lastStudied && Date.now() - cardProg.lastStudied > 7 * 24 * 60 * 60 * 1000)
        ); // 7 days
      });
    } else if (studyMode === 'new') {
      cards = cards.filter((card) => !setProgress[String(card.id)]?.studied);
    }

    // Shuffle if enabled
    if (shuffled) {
      const shuffledCards = [...cards];
      for (let i = shuffledCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
      }
      return shuffledCards;
    }

    return cards;
  }, [currentSet, studyMode, shuffled, progress]);

  const currentCard = useMemo(
    () => filteredCards[currentCardIndex] ?? null,
    [filteredCards, currentCardIndex]
  );

  const hasCards = filteredCards.length > 0;
  const currentCardProgress = useMemo(() => {
    if (!currentSet || !currentCard) return null;
    return progress[currentSet.id]?.[String(currentCard.id)] || null;
  }, [progress, currentSet, currentCard]);

  // Update card progress
  const updateCardProgress = useCallback(
    (cardId: string | number, updates: Partial<CardProgress>) => {
      if (!currentSet) return;

      setProgress((prev) => {
        const setId = currentSet.id;
        const cardIdStr = String(cardId);
        const current = prev[setId]?.[cardIdStr] || {
          studied: false,
          known: false,
          difficult: false,
          needReview: false,
          timesStudied: 0,
          timesCorrect: 0,
        };

        return {
          ...prev,
          [setId]: {
            ...prev[setId],
            [cardIdStr]: {
              ...current,
              ...updates,
              studied: true,
              lastStudied: Date.now(),
              timesStudied: current.timesStudied + 1,
            },
          },
        };
      });

      // Track in session
      studySessionRef.current.cardsStudied.add(String(cardId));
    },
    [currentSet]
  );

  // Mark card as known
  const markAsKnown = useCallback(
    (cardId: string | number) => {
      updateCardProgress(cardId, {
        known: true,
        difficult: false,
        needReview: false,
        timesCorrect: (progress[currentSet?.id || '']?.[String(cardId)]?.timesCorrect || 0) + 1,
      });
    },
    [updateCardProgress, progress, currentSet]
  );

  // Mark card as difficult
  const markAsDifficult = useCallback(
    (cardId: string | number) => {
      updateCardProgress(cardId, { difficult: true, needReview: true, known: false });
    },
    [updateCardProgress]
  );

  // Mark card for review
  const markForReview = useCallback(
    (cardId: string | number) => {
      updateCardProgress(cardId, { needReview: true });
    },
    [updateCardProgress]
  );

  // Reset progress for current set
  const resetProgress = useCallback(() => {
    if (!currentSet || !window.confirm('Θέλεις να επαναφέρεις την πρόοδο για αυτό το σετ;')) return;

    setProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[currentSet.id];
      return newProgress;
    });
  }, [currentSet]);

  const goNext = useCallback(() => {
    if (!hasCards) return;
    setSlideDirection(1);
    setCurrentCardIndex((prev) => Math.min(prev + 1, filteredCards.length - 1));
    setIsFlipped(false);
  }, [filteredCards.length, hasCards]);

  const goPrev = useCallback(() => {
    if (!hasCards) return;
    setSlideDirection(-1);
    setCurrentCardIndex((prev) => Math.max(prev - 1, 0));
    setIsFlipped(false);
  }, [hasCards]);

  const shuffleCards = useCallback(() => {
    setShuffled((prev) => !prev);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, []);

  // Calculate statistics for current set
  const stats = useMemo(() => {
    if (!currentSet) {
      return { total: 0, studied: 0, known: 0, difficult: 0, accuracy: 0, progress: 0 };
    }

    const setProgressData = progress[currentSet.id] || {};
    const total = currentSet.questions.length;
    const studied = Object.values(setProgressData).filter((p) => p.studied).length;
    const known = Object.values(setProgressData).filter((p) => p.known).length;
    const difficult = Object.values(setProgressData).filter((p) => p.difficult).length;
    const totalTimesStudied = Object.values(setProgressData).reduce(
      (sum, p) => sum + p.timesStudied,
      0
    );
    const totalTimesCorrect = Object.values(setProgressData).reduce(
      (sum, p) => sum + p.timesCorrect,
      0
    );
    const accuracy =
      totalTimesStudied > 0 ? Math.round((totalTimesCorrect / totalTimesStudied) * 100) : 0;
    const progressPercent = total > 0 ? Math.round((studied / total) * 100) : 0;

    return { total, studied, known, difficult, accuracy, progress: progressPercent };
  }, [currentSet, progress]);

  // Calculate overall statistics
  const overallStats = useMemo(() => {
    let totalCards = 0;
    let totalStudied = 0;
    let totalKnown = 0;
    let totalTimesStudied = 0;
    let totalTimesCorrect = 0;

    flashcardSets.forEach((set) => {
      totalCards += set.questions.length;
      const setProgressData = progress[set.id] || {};
      totalStudied += Object.values(setProgressData).filter((p) => p.studied).length;
      totalKnown += Object.values(setProgressData).filter((p) => p.known).length;
      Object.values(setProgressData).forEach((p) => {
        totalTimesStudied += p.timesStudied;
        totalTimesCorrect += p.timesCorrect;
      });
    });

    const overallProgress = totalCards > 0 ? Math.round((totalStudied / totalCards) * 100) : 0;
    const overallAccuracy =
      totalTimesStudied > 0 ? Math.round((totalTimesCorrect / totalTimesStudied) * 100) : 0;

    return { totalCards, totalStudied, totalKnown, overallProgress, overallAccuracy };
  }, [flashcardSets, progress]);

  // Keep index valid when filtering changes.
  useEffect(() => {
    if (!filteredCards.length) {
      setCurrentCardIndex(0);
      setIsFlipped(false);
      return;
    }
    setCurrentCardIndex((prev) => Math.min(prev, filteredCards.length - 1));
  }, [filteredCards]);

  // Pre-focus card so space/enter flip feels instant.
  useEffect(() => {
    if (selectedSetIndex !== null) {
      cardBodyRef.current?.focus();
    }
  }, [selectedSetIndex, currentCardIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    if (selectedSetIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Escape') {
        setSelectedSetIndex(null);
      } else if (e.key === 's' || e.key === 'S') {
        shuffleCards();
      } else if (e.key === 'r' || e.key === 'R') {
        resetProgress();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (hasCards) setIsFlipped((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedSetIndex, resetProgress, shuffleCards, goNext, goPrev, hasCards]);

  if (loading) {
    return (
      <div className="min-h-screen bg-coral-wash flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div
            className="w-16 h-16 rounded-full border-4 border-t-transparent mb-4"
            style={{ borderColor: BRAND }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-gray-600 font-semibold">Φόρτωση Flashcards...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-coral-wash p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl sm:text-5xl font-black mb-4 text-coral-accent dark:text-coral-light">
            ⚡ Flashcards
          </h1>
          {selectedSetIndex === null && (
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-coral-accent" />
                  <span className="text-sm font-semibold text-gray-700">
                    Σύνολο: {overallStats.totalCards} κάρτες
                  </span>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    Πρόοδος: {overallStats.overallProgress}%
                  </span>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    Ακρίβεια: {overallStats.overallAccuracy}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {!loading && error && (
          <motion.div
            className="mb-8 bg-red-50 border-2 border-red-300 rounded-2xl p-6 text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-4xl mb-2">⚠️</div>
            <h2 className="text-lg font-bold text-red-800 mb-2">Σφάλμα φόρτωσης Flashcards</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => void fetchFlashcardData()}
              className="px-6 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
            >
              Δοκίμασε ξανά
            </button>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {/* Category Selection */}
          {selectedSetIndex === null ? (
            <motion.div
              key="categories"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {flashcardSets.map((set, index) => {
                const setProgressData = progress[set.id] || {};
                const setStats = {
                  studied: Object.values(setProgressData).filter((p) => p.studied).length,
                  known: Object.values(setProgressData).filter((p) => p.known).length,
                  difficult: Object.values(setProgressData).filter((p) => p.difficult).length,
                  progress:
                    set.questions.length > 0
                      ? Math.round(
                          (Object.values(setProgressData).filter((p) => p.studied).length /
                            set.questions.length) *
                            100
                        )
                      : 0,
                };

                return (
                  <motion.button
                    key={set.id}
                    onClick={() => {
                      setSelectedSetIndex(index);
                      setCurrentCardIndex(0);
                      setIsFlipped(false);
                      studySessionRef.current = { cardsStudied: new Set() };
                    }}
                    className="group relative p-4 sm:p-6 rounded-2xl bg-white border-2 border-coral-accent/25 hover:border-coral-accent hover:shadow-2xl transition-all text-left overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Progress Bar */}
                    {setStats.progress > 0 && (
                      <div className="absolute top-0 left-0 h-1 w-full bg-gray-200">
                        <motion.div
                          className="h-full bg-gradient-to-r from-coral-accent to-coral-strong"
                          initial={{ width: 0 }}
                          animate={{ width: `${setStats.progress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-coral-wash to-coral-light/30 flex items-center justify-center group-hover:from-coral-light/40 group-hover:to-coral-accent/25 transition-all">
                        <BookOpen className="w-6 h-6 text-coral-accent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-base text-gray-800 group-hover:text-coral-accent transition-colors">
                          {set.title}
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{set.questions.length} κάρτες</span>
                        {setStats.progress > 0 && (
                          <span className="font-bold text-coral-accent">{setStats.progress}%</span>
                        )}
                      </div>
                      {setStats.studied > 0 && (
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span>✓ {setStats.known}</span>
                          <span>⚠️ {setStats.difficult}</span>
                          <span>📚 {setStats.studied}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-coral-wash to-coral-light/30">
                        <Zap className="w-4 h-4 text-coral-accent" />
                        <span className="font-bold text-coral-accent text-sm">Start</span>
                      </div>
                    </div>

                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-coral-accent to-coral-strong opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            /* Flashcard View */
            <motion.div
              key="flashcards"
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {/* Controls Bar */}
              <div className="w-full max-w-4xl mb-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <motion.button
                    onClick={() => {
                      setSelectedSetIndex(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold bg-white border-2 border-coral-accent/40 text-gray-800 hover:border-coral-accent shadow-md transition-all"
                    whileHover={{ scale: 1.05, x: -4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="hidden sm:inline">Πίσω</span>
                  </motion.button>

                  <div className="flex items-center gap-2">
                    <select
                      value={studyMode}
                      onChange={(e) => {
                        setStudyMode(e.target.value as StudyMode);
                      }}
                      className="px-3 py-2 rounded-lg border-2 border-coral-accent/25 bg-white text-gray-800 font-semibold text-sm focus:outline-none focus:border-coral-accent"
                    >
                      <option value="all">Όλες</option>
                      <option value="new">Νέες</option>
                      <option value="difficult">Δύσκολες</option>
                      <option value="review">Επανάληψη</option>
                    </select>

                    <motion.button
                      onClick={shuffleCards}
                      className={`p-2 rounded-lg border-2 transition-all ${
                        shuffled
                          ? 'bg-coral-accent border-coral-accent text-white'
                          : 'bg-white border-coral-accent/25 text-gray-800 hover:border-coral-accent'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Ανακάτεμα (S)"
                    >
                      <Shuffle className="w-5 h-5" />
                    </motion.button>

                    <motion.button
                      onClick={resetProgress}
                      className="p-2 rounded-lg border-2 border-red-200 bg-white text-red-600 hover:border-red-400 transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Επαναφορά (R)"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-coral-accent" />
                      <span className="text-xs font-medium text-gray-600">Πρόοδος</span>
                    </div>
                    <div className="text-xl font-black text-gray-800">{stats.progress}%</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-medium text-gray-600">Ξέρω</span>
                    </div>
                    <div className="text-xl font-black text-gray-800">{stats.known}</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-xs font-medium text-gray-600">Δύσκολες</span>
                    </div>
                    <div className="text-xl font-black text-gray-800">{stats.difficult}</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-medium text-gray-600">Ακρίβεια</span>
                    </div>
                    <div className="text-xl font-black text-gray-800">{stats.accuracy}%</div>
                  </div>
                </div>

                {/* Session Info */}
                <div className="bg-gradient-to-r from-coral-wash to-coral-light/25 rounded-xl p-3 shadow-md">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-coral-accent" />
                      <span className="text-gray-700 font-semibold">
                        Κάρτα {hasCards ? currentCardIndex + 1 : 0} από {filteredCards.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-coral-accent" />
                      <span className="text-gray-700 font-semibold">
                        Μελετημένες: {studySessionRef.current.cardsStudied.size}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flashcard Display */}
              <motion.div
                className="flex justify-center w-full mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {hasCards && currentCard ? (
                  <div className="w-full max-w-2xl">
                    <div className="relative">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.button
                          key={currentCard.id}
                          ref={cardBodyRef}
                          onClick={() => setIsFlipped((prev) => !prev)}
                          className="relative w-full min-h-[340px] rounded-3xl bg-white border-2 border-coral-accent/25 p-6 text-left shadow-2xl focus:outline-none focus:ring-2 focus:ring-coral-accent/35"
                          style={{ transformStyle: 'preserve-3d' }}
                          initial={{ opacity: 0, y: 24 * slideDirection, rotateY: 0 }}
                          animate={{ opacity: 1, y: 0, rotateY: isFlipped ? 180 : 0 }}
                          exit={{ opacity: 0, y: -24 * slideDirection }}
                          transition={{ type: 'spring', stiffness: 240, damping: 26 }}
                          whileTap={{ scale: 0.995 }}
                          aria-label="Flip flashcard"
                        >
                          {currentCardProgress?.difficult && (
                            <AlertCircle className="absolute top-4 right-4 w-5 h-5 text-red-500" />
                          )}
                          {currentCardProgress?.known && (
                            <CheckCircle className="absolute top-4 right-4 w-5 h-5 text-green-500" />
                          )}

                          <div
                            className="text-xs font-bold uppercase tracking-wide text-coral-accent mb-4"
                            style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                          >
                            {isFlipped ? 'Απάντηση' : 'Ερώτηση'}
                          </div>
                          <p
                            className={`text-xl sm:text-2xl leading-relaxed ${
                              isFlipped ? 'text-gray-800 font-normal' : 'text-coral-strong font-bold'
                            }`}
                            style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                          >
                            {isFlipped ? currentCard.back : currentCard.front}
                          </p>
                        </motion.button>
                      </AnimatePresence>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={goPrev}
                          disabled={currentCardIndex === 0}
                          className="px-3 py-2 rounded-lg border border-coral-accent/25 bg-white disabled:opacity-40"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={goNext}
                          disabled={currentCardIndex >= filteredCards.length - 1}
                          className="px-3 py-2 rounded-lg border border-coral-accent/25 bg-white disabled:opacity-40"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => markAsKnown(currentCard.id)}
                          className="px-3 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors text-sm font-semibold"
                        >
                          ✓ Ξέρω
                        </button>
                        <button
                          onClick={() => markAsDifficult(currentCard.id)}
                          className="px-3 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors text-sm font-semibold"
                        >
                          ✗ Δύσκολο
                        </button>
                        <button
                          onClick={() => markForReview(currentCard.id)}
                          className="px-3 py-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors text-sm font-semibold"
                        >
                          🔄 Επανάληψη
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 text-center text-sm text-gray-600">
                      {filteredCards.length}{' '}
                      {studyMode !== 'all' &&
                        `(${studyMode === 'difficult' ? 'δύσκολες' : studyMode === 'review' ? 'για επανάληψη' : 'νέες'})`}{' '}
                      κάρτες διαθέσιμες
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-8 shadow-2xl text-center border-2 border-coral-accent/25 max-w-md">
                    <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-semibold mb-2">Δεν υπάρχουν κάρτες</p>
                    <p className="text-sm text-gray-500">
                      {studyMode === 'difficult'
                        ? 'Δεν έχεις σημειώσει δύσκολες κάρτες ακόμα'
                        : studyMode === 'review'
                          ? 'Δεν υπάρχουν κάρτες για επανάληψη'
                          : 'Όλες οι κάρτες έχουν μελετηθεί'}
                    </p>
                    <button
                      onClick={() => setStudyMode('all')}
                      className="mt-4 px-4 py-2 bg-coral-accent text-white rounded-lg font-semibold hover:bg-coral-strong transition-colors"
                    >
                      Προβολή όλων
                    </button>
                  </div>
                )}
              </motion.div>

              {/* Tips */}
              <motion.div
                className="bg-gradient-to-r from-coral-wash to-coral-light/20 rounded-2xl p-4 sm:p-6 max-w-2xl w-full"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="space-y-2 text-sm text-gray-700">
                  <p className="font-semibold text-center">💡 Συμβουλές:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                    <li>Κάνε κλικ στην κάρτα για να τη γυρίσεις</li>
                    <li>Βελάκια ← → για προηγούμενη/επόμενη κάρτα</li>
                    <li>Χρησιμοποίησε τα κουμπιά για να σημειώσεις την πρόοδό σου</li>
                    <li>
                      Πάτα <kbd className="px-1 py-0.5 bg-white rounded border">S</kbd> για
                      ανακάτεμα
                    </li>
                    <li>
                      Πάτα <kbd className="px-1 py-0.5 bg-white rounded border">R</kbd> για
                      επαναφορά
                    </li>
                    <li>
                      Πάτα <kbd className="px-1 py-0.5 bg-white rounded border">Esc</kbd> για
                      επιστροφή
                    </li>
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Flashcards;
