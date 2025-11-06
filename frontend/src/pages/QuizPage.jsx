import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../contexts/AppContext';
import { AlertTriangle, BookOpen, Sparkles, Target, Zap } from 'lucide-react';
import QuizDialog from '../components/QuizDialog.jsx';
import QuizMenu from '../components/QuizMenu.jsx';

const BRAND = '#fda8a9';
const BRAND_DARK = '#f88b8c';

const QuizPage = () => {
  const { nickname, setNickname, fetchLeaderboard } = useAppContext();

  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [showQuizMenu, setShowQuizMenu] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [categoryAnswers, setCategoryAnswers] = useState({});
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize nickname
  useEffect(() => {
    const storedNickname = localStorage.getItem('nickname');
    if (storedNickname) {
      setNickname(storedNickname);
    } else if (!nickname) {
      setNickname('Guest');
      localStorage.setItem('nickname', 'Guest');
    }
    setIsInitialized(true);
  }, [nickname, setNickname]);

  // Load saved progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('quizProgress');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCategoryAnswers(parsed);
      }
    } catch (error) {
      console.error('Error loading saved progress:', error);
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('quizProgress', JSON.stringify(categoryAnswers));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }, [categoryAnswers]);

  const handleQuizCategorySelect = useCallback((quiz) => {
    setSelectedQuiz(quiz);
    setIsQuizDialogOpen(true);
    setShowQuizMenu(false);
  }, []);

  const handleMenuClose = useCallback(() => {
    const hasProgress = Object.values(categoryAnswers).some((obj) => Object.keys(obj).length > 0);
    if (hasProgress) {
      setShowExitWarning(true);
    } else {
      setShowQuizMenu(false);
    }
  }, [categoryAnswers]);

  const confirmExit = useCallback(() => {
    setShowExitWarning(false);
    setCategoryAnswers({});
    setShowQuizMenu(false);
    // Clear localStorage progress
    localStorage.removeItem('quizProgress');
  }, []);

  const cancelExit = useCallback(() => {
    setShowExitWarning(false);
  }, []);

  const handleQuizDialogClose = useCallback(() => {
    setIsQuizDialogOpen(false);
    setShowQuizMenu(false);
  }, []);

  const handleQuestionAnswered = useCallback((quizId, questionIdx, selectedIdx, isCorrect, pointsEarned) => {
    setCategoryAnswers((prev) => {
      const prevQuiz = prev[quizId] ? { ...prev[quizId] } : {};
      prevQuiz[questionIdx] = {
        selectedAnswer: selectedIdx,
        isCorrect,
        pointsEarned: pointsEarned || 0,
        timestamp: new Date().toISOString(),
      };
      return { ...prev, [quizId]: prevQuiz };
    });
    
    // Refresh leaderboard if answer was correct
    if (isCorrect) {
      fetchLeaderboard?.();
    }
  }, [fetchLeaderboard]);

  const totalAnswered = Object.values(categoryAnswers).reduce(
    (sum, quiz) => sum + Object.keys(quiz).length,
    0
  );

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-100 to-red-100">
        <motion.div
          className="w-16 h-16 rounded-full border-4 border-t-transparent"
          style={{ borderColor: BRAND }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Tech Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-rose-100 to-red-100">
        {/* Binary Code Pattern */}
        <div className="absolute inset-0 opacity-5 font-mono text-xs overflow-hidden select-none pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="whitespace-nowrap"
              initial={{ x: '100%' }}
              animate={{ x: '-100%' }}
              transition={{
                duration: 20 + i * 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              {Array.from({ length: 200 })
                .map(() => (Math.random() > 0.5 ? '1' : '0'))
                .join('')}
            </motion.div>
          ))}
        </div>

        {/* Code Symbols */}
        <div className="absolute inset-0 opacity-10 font-mono text-4xl md:text-6xl select-none pointer-events-none">
          <motion.div
            className="absolute top-10 left-10"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            &lt;/&gt;
          </motion.div>
          <motion.div
            className="absolute top-40 right-20"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {'{ }'}
          </motion.div>
          <motion.div className="absolute bottom-20 left-1/4">[ ]</motion.div>
          <motion.div className="absolute top-1/3 right-1/3">( )</motion.div>
          <motion.div
            className="absolute bottom-40 right-10"
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            =&gt;
          </motion.div>
          <motion.div className="absolute top-60 left-1/2">##</motion.div>
          <motion.div className="absolute bottom-10 left-10">!=</motion.div>
          <motion.div className="absolute top-20 right-1/4">++</motion.div>
          <motion.div className="absolute top-1/4 left-20">&amp;&amp;</motion.div>
          <motion.div className="absolute bottom-1/3 right-1/4">||</motion.div>
        </div>

        {/* Floating Code Snippets */}
        <div className="absolute inset-0 opacity-5 font-mono text-xs md:text-sm select-none pointer-events-none">
          <motion.div
            className="absolute top-20 left-10"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            if (true) {'{'} <br />
            &nbsp;&nbsp;return "success"; <br />
            {'}'}
          </motion.div>

          <motion.div
            className="absolute top-40 right-32"
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            for (let i = 0; i &lt; n; i++)
          </motion.div>

          <motion.div
            className="absolute bottom-32 left-1/3"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            function quiz() {'{'} <br />
            &nbsp;&nbsp;console.log("start"); <br />
            {'}'}
          </motion.div>

          <motion.div
            className="absolute top-1/2 right-20"
            animate={{ y: [0, 25, 0] }}
            transition={{ duration: 7, repeat: Infinity }}
          >
            while (learning) {'{'} <br />
            &nbsp;&nbsp;practice(); <br />
            {'}'}
          </motion.div>
        </div>

        {/* Tech Icons */}
        <div className="absolute inset-0 opacity-8 text-6xl md:text-8xl select-none pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            ⚙️
          </motion.div>
          <motion.div
            className="absolute bottom-1/4 right-1/4"
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          >
            💻
          </motion.div>
          <motion.div
            className="absolute top-1/3 right-1/3"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🎯
          </motion.div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Center Content */}
        <AnimatePresence mode="wait">
          {!showQuizMenu && !isQuizDialogOpen && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center max-w-2xl">
                {/* Welcome Message */}
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
                    Καλώς ήρθες στο Quiz! 🎓
                  </h1>
                  <p className="text-lg text-gray-600">
                    Δοκίμασε τις γνώσεις σου και ανέβασε στην κορυφή του leaderboard!
                  </p>
                </motion.div>

                {/* Stats */}
                {totalAnswered > 0 && (
                  <motion.div
                    className="mb-8 grid grid-cols-3 gap-4 max-w-lg mx-auto"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border-2 border-pink-200">
                      <Target className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                      <div className="text-2xl font-black text-gray-800">{totalAnswered}</div>
                      <div className="text-xs text-gray-600">Απαντήσεις</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border-2 border-pink-200">
                      <Zap className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                      <div className="text-2xl font-black text-gray-800">
                        {Object.keys(categoryAnswers).length}
                      </div>
                      <div className="text-xs text-gray-600">Κεφάλαια</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border-2 border-pink-200">
                      <Sparkles className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-black text-gray-800">
                        {Object.values(categoryAnswers).reduce((sum, quiz) => {
                          return (
                            sum +
                            Object.values(quiz).filter((ans) => ans.isCorrect).length
                          );
                        }, 0)}
                      </div>
                      <div className="text-xs text-gray-600">Σωστές</div>
                    </div>
                  </motion.div>
                )}

                {/* Main Button */}
                <motion.button
                  onClick={() => setShowQuizMenu(true)}
                  className="px-10 py-5 rounded-2xl shadow-2xl font-black text-xl md:text-2xl text-white hover:shadow-3xl transition-all"
                  style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})` }}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  whileHover={{ scale: 1.05, y: -8 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-7 h-7" />
                    {totalAnswered > 0 ? 'Συνέχεια Quiz' : 'Ξεκίνησε Quiz'}
                  </div>
                </motion.button>

               
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quiz Menu */}
        {showQuizMenu && (
          <QuizMenu
            onSelect={handleQuizCategorySelect}
            onClose={handleMenuClose}
            categoryAnswers={categoryAnswers}
          />
        )}

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

        {/* Exit Warning */}
        <AnimatePresence>
          {showExitWarning && (
            <div className="fixed inset-0 flex items-center justify-center z-[60] p-4">
              <motion.div
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={cancelExit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              <motion.div
                className="relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full"
                style={{ border: `3px solid ${BRAND}` }}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <div className="bg-gradient-to-r from-red-500 to-rose-500 text-white p-6 text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    <AlertTriangle className="w-16 h-16 mx-auto mb-2" />
                  </motion.div>
                  <h3 className="text-2xl font-black">Προσοχή!</h3>
                </div>

                <div className="p-6">
                  <p className="text-gray-700 text-center mb-2 text-lg font-semibold">
                    Η πρόοδός σου θα χαθεί!
                  </p>
                  <p className="text-gray-600 text-center mb-6 text-sm">
                    Έχεις απαντήσει σε {totalAnswered} ερωτήσεις. Θέλεις σίγουρα να διαγράψεις την πρόοδό σου και να κλείσεις;
                  </p>

                  <div className="flex gap-3">
                    <motion.button
                      onClick={confirmExit}
                      className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg hover:shadow-xl transition-shadow"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Ναι, διαγραφή
                    </motion.button>
                    <motion.button
                      onClick={cancelExit}
                      className="flex-1 py-3 rounded-xl font-bold bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-lg hover:shadow-xl transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Ακύρωση
                    </motion.button>
                  </div>

                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuizPage;