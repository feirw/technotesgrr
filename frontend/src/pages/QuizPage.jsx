import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import QuizDialog from '../components/QuizDialog.jsx';
import QuizMenu from '../components/QuizMenu.jsx';

const QuizPage = () => {
  const { nickname, setNickname, fetchLeaderboard } = useAppContext();

  const [localNickname, setLocalNickname] = useState(nickname);
  const [quizStarted, setQuizStarted] = useState(!!nickname);
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [showQuizMenu, setShowQuizMenu] = useState(!!nickname);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [categoryAnswers, setCategoryAnswers] = useState({});
  const [showExitWarning, setShowExitWarning] = useState(false);

  useEffect(() => {
    const hasNickname = !!nickname;
    setQuizStarted(hasNickname);
    setShowQuizMenu(hasNickname);
    setLocalNickname(nickname);
  }, [nickname]);

  const startQuiz = () => {
    if (localNickname.trim()) {
      setNickname(localNickname.trim());
      setQuizStarted(true);
      setShowQuizMenu(true);
      setCategoryAnswers({});
    } else {
      alert('Παρακαλώ εισάγετε το όνομά σας για να ξεκινήσετε το quiz!');
    }
  };

  const resetProgress = () => {
    setCategoryAnswers({});
  };

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
    resetProgress();
    setShowQuizMenu(false);
  };

  const cancelExit = () => setShowExitWarning(false);

  const handleQuizDialogClose = () => {
    setIsQuizDialogOpen(false);
    setShowQuizMenu(true);
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
    <div className="min-h-screen bg-[#fff2f2] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">🎯 Quiz Θεωρίας</h1>

        {!quizStarted ? (
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Ξεκινήστε το Quiz</h2>
            <p className="text-gray-600 mb-6">
              Εισάγετε το όνομά σας για να συμμετάσχετε στο leaderboard.
            </p>
            <input
              type="text"
              placeholder="Ψευδώνυμο"
              value={localNickname}
              onChange={(e) => setLocalNickname(e.target.value)}
              className="w-full max-w-sm mx-auto p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-[#ffa9a9]"
              onKeyPress={(e) => e.key === 'Enter' && startQuiz()}
            />
            <br />
            <button
              onClick={startQuiz}
              className="bg-[#ffa9a9] text-white px-8 py-3 rounded-lg hover:bg-[#ff8c8c] transition-colors text-lg font-semibold shadow-md"
            >
              Ξεκινήστε το Quiz
            </button>
          </div>
        ) : (
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Καλώς ήρθες, {nickname}!</h2>
            <p className="text-gray-600 mb-6">
              Είσαι έτοιμος/η; Επίλεξε μια κατηγορία για να ξεκινήσεις.
            </p>
            <button
              onClick={() => setShowQuizMenu(true)}
              className="bg-[#ffa9a9] text-white px-8 py-3 rounded-lg hover:bg-[#ff8c8c] transition-colors text-lg font-semibold shadow-md"
            >
              Εμφάνιση Κατηγοριών Quiz
            </button>
          </div>
        )}
      </div>

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
      {showExitWarning && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-8 shadow-xl text-center max-w-md mx-auto">
            <p className="mb-6 text-lg text-[#ff7b7b] font-semibold">
              Αν επιστρέψετε τώρα, η πρόοδός σας θα χαθεί. Θέλετε σίγουρα να συνεχίσετε;
            </p>
            <div className="flex justify-center gap-6">
              <button
                onClick={confirmExit}
                className="bg-[#ffa9a9] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#ff8c8c] transition"
              >
                Ναι, έξοδος
              </button>
              <button
                onClick={cancelExit}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300"
              >
                Ακύρωση
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
