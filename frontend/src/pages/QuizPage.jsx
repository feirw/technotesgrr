import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../contexts/AppContext';
import { AlertTriangle, BookOpen } from 'lucide-react';
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

  useEffect(() => {
    if (!nickname) setNickname('Guest');
  }, [nickname, setNickname]);

  const handleQuizCategorySelect = (quiz) => {
    setSelectedQuiz(quiz);
    setIsQuizDialogOpen(true);
    setShowQuizMenu(false);
  };

  const handleMenuClose = () => {
    const hasProgress = Object.values(categoryAnswers).some((obj) => Object.keys(obj).length > 0);
    if (hasProgress) {
      setShowExitWarning(true);
    } else {
      setShowQuizMenu(false);
    }
  };

  const confirmExit = () => {
    setShowExitWarning(false);
    setCategoryAnswers({});
    setShowQuizMenu(false);
  };

  const handleQuizDialogClose = () => {
    setIsQuizDialogOpen(false);
    setShowQuizMenu(false);
  };

  const handleQuestionAnswered = (quizId, questionIdx, selectedIdx, isCorrect) => {
    setCategoryAnswers((prev) => {
      const prevQuiz = prev[quizId] ? { ...prev[quizId] } : {};
      prevQuiz[questionIdx] = selectedIdx;
      return { ...prev, [quizId]: prevQuiz };
    });
    if (isCorrect) fetchLeaderboard();
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Tech Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-rose-100 to-red-100">
        {/* Binary Code Pattern */}
        <div className="absolute inset-0 opacity-5 font-mono text-xs overflow-hidden">
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
                .map((_, j) => (Math.random() > 0.5 ? '1' : '0'))
                .join('')}
            </motion.div>
          ))}
        </div>

        {/* Code Symbols */}
        <div className="absolute inset-0 opacity-10 font-mono text-6xl">
          <div className="absolute top-10 left-10">&lt;/&gt;</div>
          <div className="absolute top-40 right-20">{'{ }'}</div>
          <div className="absolute bottom-20 left-1/4">[ ]</div>
          <div className="absolute top-1/3 right-1/3">( )</div>
          <div className="absolute bottom-40 right-10">=&gt;</div>
          <div className="absolute top-60 left-1/2">##</div>
          <div className="absolute bottom-10 left-10">!=</div>
          <div className="absolute top-20 right-1/4">++</div>
          <div className="absolute top-1/4 left-20">&amp;&amp;</div>
          <div className="absolute bottom-1/3 right-1/4">||</div>
        </div>

        {/* Floating Code Snippets */}
        <div className="absolute inset-0 opacity-5 font-mono text-sm">
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
        <div className="absolute inset-0 opacity-8 text-8xl">
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
        </div>
      </div>

      <div className="relative z-10">
        {/* Center Button */}
        <AnimatePresence>
          {!showQuizMenu && !isQuizDialogOpen && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.button
                onClick={() => setShowQuizMenu(true)}
                className="px-12 py-6 rounded-2xl shadow-2xl font-black text-2xl text-white"
                style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})` }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-8 h-8" />
                  Εμφάνιση Κατηγοριών
                </div>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {showQuizMenu && (
          <QuizMenu
            onSelect={handleQuizCategorySelect}
            onClose={handleMenuClose}
            categoryAnswers={categoryAnswers}
          />
        )}

        {isQuizDialogOpen && selectedQuiz && (
          <QuizDialog
            quiz={selectedQuiz}
            isOpen={isQuizDialogOpen}
            onClose={handleQuizDialogClose}
            onQuestionAnswered={handleQuestionAnswered}
            selectedAnswers={categoryAnswers[selectedQuiz.id] || {}}
          />
        )}

        <AnimatePresence>
          {showExitWarning && (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowExitWarning(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              <motion.div
                className="relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full"
                style={{ border: `3px solid ${BRAND}` }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="bg-gradient-to-r from-red-500 to-rose-500 text-white p-6 text-center">
                  <AlertTriangle className="w-16 h-16 mx-auto mb-2" />
                  <h3 className="text-2xl font-black">Προσοχή!</h3>
                </div>

                <div className="p-6">
                  <p className="text-gray-700 text-center mb-6 text-lg">
                    Η πρόοδός σου θα χαθεί. Θέλεις σίγουρα να συνεχίσεις;
                  </p>

                  <div className="flex gap-3">
                    <motion.button
                      onClick={confirmExit}
                      className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Ναι, έξοδος
                    </motion.button>
                    <motion.button
                      onClick={() => setShowExitWarning(false)}
                      className="flex-1 py-3 rounded-xl font-bold bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-lg"
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
