import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import QuizDialog from '../components/QuizDialog.jsx';
import QuizMenu from '../components/QuizMenu.jsx';

const QuizPage = () => {
  // 1. Παίρνουμε την καθολική κατάσταση και συναρτήσεις από το Context.
  const { nickname, setNickname, fetchLeaderboard } = useAppContext();

  // 2. Τοπική κατάσταση (state) που αφορά μόνο αυτή τη σελίδα.
  // Το `localNickname` χρησιμοποιείται για το πεδίο εισαγωγής.
  const [localNickname, setLocalNickname] = useState(nickname);
  // Το `quizStarted` ελέγχει αν έχουμε περάσει το βήμα της εισαγωγής ονόματος.
  const [quizStarted, setQuizStarted] = useState(!!nickname);

  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [showQuizMenu, setShowQuizMenu] = useState(!!nickname); // Αν υπάρχει όνομα, δείξε το μενού κατευθείαν.
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  // Παρακολουθεί τις απαντήσεις ανά κατηγορία για την τρέχουσα συνεδρία.
  const [categoryAnswers, setCategoryAnswers] = useState({});
  const [showExitWarning, setShowExitWarning] = useState(false);

  // Συγχρονίζουμε το `quizStarted` και `showQuizMenu` αν το καθολικό `nickname` αλλάξει.
  useEffect(() => {
    const hasNickname = !!nickname;
    setQuizStarted(hasNickname);
    setShowQuizMenu(hasNickname);
    setLocalNickname(nickname); // Ενημέρωσε και το τοπικό πεδίο.
  }, [nickname]);

  const startQuiz = () => {
    if (localNickname.trim()) {
      // Ενημερώνουμε το καθολικό nickname μέσω της συνάρτησης του context.
      setNickname(localNickname.trim());
      setQuizStarted(true);
      setShowQuizMenu(true);
      setCategoryAnswers({}); // Καθαρίζουμε την προηγούμενη πρόοδο.
    } else {
      alert('Παρακαλώ εισάγετε το όνομα σας για να ξεκινήσετε το quiz!');
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

  // Κλείσιμο του μενού επιλογής Quiz
  const handleMenuClose = () => {
    const hasProgress = Object.values(categoryAnswers).some((obj) => Object.keys(obj).length > 0);
    if (hasProgress) {
      setShowExitWarning(true);
    } else {
      setShowQuizMenu(false); // Απλά κλείνει το μενού, δεν κάνει logout τον χρήστη.
    }
  };

  // Επιβεβαίωση εξόδου από το quiz (χάνεται η πρόοδος)
  const confirmExit = () => {
    setShowExitWarning(false);
    resetProgress();
    setShowQuizMenu(false);
  };

  const cancelExit = () => setShowExitWarning(false);

  // Κλείσιμο του παραθύρου του Quiz (επιστροφή στο μενού)
  const handleQuizDialogClose = () => {
    setIsQuizDialogOpen(false);
    setShowQuizMenu(true); // Εμφανίζουμε ξανά το μενού
  };

  // Καλείται από το QuizDialog όταν απαντηθεί μια ερώτηση
  const handleQuestionAnswered = (quizId, questionIdx, selectedIdx, isCorrect, pointsEarned) => {
    setCategoryAnswers((prev) => {
      const prevQuiz = prev[quizId] ? { ...prev[quizId] } : {};
      prevQuiz[questionIdx] = selectedIdx;
      return { ...prev, [quizId]: prevQuiz };
    });

    // Αν η απάντηση ήταν σωστή, ανανεώνουμε το leaderboard στο background.
    // Έτσι, όταν ο χρήστης πάει στη σελίδα του leaderboard, τα δεδομένα θα είναι ήδη φρέσκα.
    if (isCorrect) {
      fetchLeaderboard();
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
          Quiz Θεωρίας
        </h1>

        {!quizStarted ? (
          // --- ΟΘΟΝΗ ΕΙΣΑΓΩΓΗΣ ΟΝΟΜΑΤΟΣ ---
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Ξεκινήστε το Quiz</h2>
            <p className="text-gray-600 mb-6">
              Εισάγετε το όνομα σας για να συμμετάσχετε στο leaderboard
            </p>
            <input
              type="text"
              placeholder="Ψευδώνυμο"
              value={localNickname}
              onChange={(e) => setLocalNickname(e.target.value)}
              className="w-full max-w-sm mx-auto p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-pink-500"
              onKeyPress={(e) => e.key === 'Enter' && startQuiz()}
            />
            <br />
            <button
              onClick={startQuiz}
              className="bg-pink-500 text-white px-6 sm:px-8 py-3 rounded-lg hover:bg-pink-600 transition-colors text-base sm:text-lg font-semibold"
            >
              Ξεκινήστε το Quiz
            </button>
          </div>
        ) : (
          // --- ΟΘΟΝΗ ΚΑΛΩΣΟΡΙΣΜΑΤΟΣ & ΕΠΙΛΟΓΗΣ QUIZ ---
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Καλώς ήρθες, {nickname}!</h2>
            <p className="text-gray-600 mb-6">
              Είσαι έτοιμος/η; Επίλεξε μια κατηγορία για να ξεκινήσεις.
            </p>
            <button
              onClick={() => setShowQuizMenu(true)}
              className="bg-pink-500 text-white px-8 py-3 rounded-lg hover:bg-pink-600 transition-colors text-base sm:text-lg font-semibold"
            >
              Εμφάνιση Κατηγοριών Quiz
            </button>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}

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

      {showExitWarning && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-8 shadow-xl text-center">
            <p className="mb-6 text-lg text-pink-700 font-semibold">
              Αν επιστρέψετε τώρα, η πρόοδός σας θα χαθεί. Θέλετε σίγουρα να συνεχίσετε;
            </p>
            <div className="flex justify-center gap-6">
              <button
                onClick={confirmExit}
                className="bg-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-pink-600"
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
