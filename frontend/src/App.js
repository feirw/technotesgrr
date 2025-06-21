import React, { useState, useEffect } from 'react';
import './App.css';
import Flashcards from './Flashcards';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [notes, setNotes] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [nickname, setNickname] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchNotes();
    fetchQuizQuestions();
    fetchLeaderboard();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/notes`);
      const data = await response.json();
      setNotes(data.notes || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const fetchQuizQuestions = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/quiz/questions`);
      const data = await response.json();
      setQuizQuestions(data.questions || []);
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/leaderboard`);
      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const submitAnswer = async (selectedAnswer) => {
    if (!nickname) return;

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/quiz/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nickname: nickname,
          question_id: quizQuestions[currentQuestion].id,
          selected_answer: selectedAnswer
        })
      });
      
      const result = await response.json();
      
      if (result.correct) {
        setScore(score + result.points_earned);
      }
      
      setShowResult(true);
      setTimeout(() => {
        setShowResult(false);
        if (currentQuestion < quizQuestions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          // Quiz finished
          fetchLeaderboard();
          setQuizStarted(false);
          setCurrentQuestion(0);
          alert(`Συγχαρητήρια! Τελικό σκορ: ${score + (result.correct ? result.points_earned : 0)} πόντοι!`);
          setScore(0);
        }
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
    setLoading(false);
  };

  const startQuiz = () => {
    if (!nickname.trim()) {
      alert('Παρακαλώ εισάγετε ψευδώνυμο');
      return;
    }
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
  };

  const renderHome = () => (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-pink-400 to-pink-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-pink-200 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💖</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Technotesgr</h1>
          <p className="text-lg sm:text-xl mb-8">Οι καλύτερες σημειώσεις για ΑΕΠΠ - Πανελλαδικές Εξετάσεις</p>
          <p className="text-base sm:text-lg opacity-90">Πληροφορική Γ' Γενικού Λυκείου </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-12">Τι προσφέρουμε</h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Σημειώσεις</h3>
              <p className="text-gray-600">Σημειώσεις που καλύπτουν σε βάθος όλη την θεωρία και τις μεθοδολογίες της ύλης </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Quiz</h3>
              <p className="text-gray-600">Τεστάρετε τις γνώσεις σας σε όλη την θεωρία του ΑΕΠΠ</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Leaderboard</h3>
              <p className="text-gray-600">Ανταγωνιστείτε με άλλους μαθητές!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotes = () => (
    <div className="min-h-screen bg-pink-50 py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">Σημειώσεις</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div key={note.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{note.title}</h3>
              <p className="text-sm text-pink-600 mb-3">{note.subject}</p>
              <p className="text-gray-600 mb-4">{note.preview}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-pink-600">€{note.price}</span>
                <button className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors">
                  Αγορά
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">{note.download_count} λήψεις</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderQuiz = () => (
    <div className="min-h-screen bg-pink-50 py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">Quiz Θεωρίας</h1>
        
        {!quizStarted ? (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Ξεκινήστε το Quiz</h2>
            <p className="text-gray-600 mb-6">Εισάγετε το όνομα σας για να συμμετάσχετε στο leaderboard</p>
            <input
              type="text"
              placeholder="Ψευδώνυμο"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full max-w-sm mx-auto p-3 border border-gray-300 rounded-lg mb-4"
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
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            {showResult ? (
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">Αποτέλεσμα</h2>
                <div className="text-6xl mb-4">
                  {/* Result will be shown here */}
                </div>
              </div>
            ) : quizQuestions.length > 0 && (
              <div>
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
                    <span className="text-sm text-gray-600">
                      Ερώτηση {currentQuestion + 1} από {quizQuestions.length}
                    </span>
                    <span className="text-sm font-semibold text-pink-600">
                      Σκορ: {score} πόντοι
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <h2 className="text-lg sm:text-xl font-semibold mb-6">
                  {quizQuestions[currentQuestion]?.question}
                </h2>
                
                <div className="space-y-3">
                  {quizQuestions[currentQuestion]?.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => submitAnswer(index)}
                      disabled={loading}
                      className="w-full p-4 text-left bg-gray-50 hover:bg-pink-50 border border-gray-200 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {option}
                    </button>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <span className="text-sm text-gray-600">
                    Αξία: {quizQuestions[currentQuestion]?.points} πόντοι
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderLeaderboard = () => (
    <div className="min-h-screen bg-pink-50 py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">Leaderboard</h1>
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-6 text-center">Κατάταξη</h2>
          {leaderboard.length === 0 ? (
            <p className= "font-semibold text-pink-800 mb-2">Δεν υπάρχουν ακόμα συμμετοχές</p>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <div key={entry.nickname} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <span className="text-xl sm:text-2xl font-bold text-pink-600">#{index + 1}</span>
                    <span className="font-semibold text-sm sm:text-base">{entry.nickname}</span>
                  </div>
                  <span className="text-base sm:text-lg font-bold text-gray-800">{entry.total_points} πόντοι</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-8 p-4 bg-pink-50 rounded-lg">
          </div>
        </div>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="min-h-screen bg-pink-50 py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">Σχετικά με εμάς</h1>
          
          <div className="prose max-w-none">
            <p className="text-base sm:text-lg text-gray-700 mb-6">
              Καλώς ήρθατε στο technotesgr! Είμαι μία καθηγήτρια πληροφορικής που στοχεύει να βοηθήσει 
              τους μαθητές της Γ' Λυκείου να επιτύχουν στις Πανελλαδικές εξετάσεις Πληροφορικής.
            </p>
            
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Ο σκοπός μας</h2>
            <p className="text-gray-700 mb-6">
              Να παρέχουμε ποιοτικό εκπαιδευτικό υλικό και διαδραστικές δραστηριότητες που θα βοηθήσουν 
              τους μαθητές να κατανοήσουν σε βάθος την πληροφορική και να προετοιμαστούν αποτελεσματικά για τις εξετάσεις τους.
            </p>
            
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Τι προσφέρουμε</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Ολοκληρωμένες σημειώσεις εφ'όλης της ύλης</li>
              <li>Quiz με ερωτήσεις από παλιές πανελλαδικές εξετάσεις</li>
              <li>Flashcards για εύκολη επανάληψη εννοιών από την θεωρία μας</li>
              <li>Παιχνίδια οπτικοποίησης αλγορίθμων (δυαδική αναζήτηση, γραμμική αναζήτηση,δέντρα,λίστες,γράφοι)</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Στοιχεία Επικοινωνίας</h2>
            <div className="space-y-2 text-gray-700">
              <p> Instagram: @technotesgr</p>
              <p> TikTok: @technotesgr</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-pink-400 rounded flex items-center justify-center">
              </div>
              <span className="text-xl font-bold text-gray-800">technotesgr</span>
            </div>
            
            {/* Desktop Navigation */}
            
            <div className="hidden lg:flex space-x-8">
              <button
                onClick={() => setActiveTab('home')}
                className={`py-2 px-4 rounded transition-colors ${
                  activeTab === 'home' ? 'bg-pink-500 text-white' : 'text-gray-700 hover:text-pink-500'
                }`}
              >
                Αρχική
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`py-2 px-4 rounded transition-colors ${
                  activeTab === 'notes' ? 'bg-pink-500 text-white' : 'text-gray-700 hover:text-pink-500'
                }`}
              >
                Οι σημειώσεις μας
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`py-2 px-4 rounded transition-colors ${
                  activeTab === 'quiz' ? 'bg-pink-500 text-white' : 'text-gray-700 hover:text-pink-500'
                }`}
              >
                Quiz
              </button>
              <button
                onClick={() => setActiveTab('flashcards')}
                className={`py-2 px-4 rounded transition-colors ${
                  activeTab === 'flashcards ' ? 'bg-pink-500 text-white' : 'text-gray-700 hover:text-pink-500'
                }`}
              >
                Flashcards
                </button>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`py-2 px-4 rounded transition-colors ${
                  activeTab === 'leaderboard' ?  'bg-pink-500 text-white' : 'text-gray-700 hover:text-pink-500'
                }`}
              >
                Leaderboard
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`py-2 px-4 rounded transition-colors ${
                  activeTab === 'about' ? 'bg-pink-500 text-white' : 'text-gray-700 hover:text-pink-500'
                }`}
              >
                Σχετικά
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Side Drawer */}
      <div className={`lg:hidden fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6">
          {/* Drawer Header */}
          <div className="flex justify-between items-center mb-8">
            {/* <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-pink-400 rounded flex items-center justify-center">
                <span className="text-white text-sm">💖</span>
              </div>
              <span className="text-xl font-bold text-gray-800">TechNotesGR</span>
            </div> */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 ml-auto"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Drawer Navigation Items */}
          <div className="space-y-4">
            <button
              onClick={() => handleNavClick('home')}
              className={`block w-full text-left py-4 px-4 rounded-lg transition-colors ${
                activeTab === 'home' ? 'bg-pink-500 text-white' : 'text-gray-700 hover:bg-pink-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">🏠</span>
                <span className="font-medium">Αρχική</span>
              </div>
            </button>
            <button
              onClick={() => handleNavClick('notes')}
              className={`block w-full text-left py-4 px-4 rounded-lg transition-colors ${
                activeTab === 'notes' ? 'bg-pink-500 text-white' : 'text-gray-700 hover:bg-pink-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">📚</span>
                <span className="font-medium">Σημειώσεις</span>
              </div>
            </button>
            <button
              onClick={() => handleNavClick('quiz')}
              className={`block w-full text-left py-4 px-4 rounded-lg transition-colors ${
                activeTab === 'quiz' ? 'bg-pink-500 text-white' : 'text-gray-700 hover:bg-pink-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">🎯</span>
                <span className="font-medium">Quiz</span>
              </div>
            </button>
            <button
              onClick={() => handleNavClick('leaderboard')}
              className={`block w-full text-left py-4 px-4 rounded-lg transition-colors ${
                activeTab === 'leaderboard' ? 'bg-pink-500 text-white' : 'text-gray-700 hover:bg-pink-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">🏆</span>
                <span className="font-medium">Leaderboard</span>
              </div>
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`block w-full text-left py-4 px-4 rounded-lg transition-colors ${
                activeTab === 'about' ? 'bg-pink-500 text-white' : 'text-gray-700 hover:bg-pink-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">ℹ️</span>
                <span className="font-medium">Σχετικά</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'home' && renderHome()}
      {activeTab === 'notes' && renderNotes()}
      {activeTab === 'quiz' && renderQuiz()}
      {activeTab === 'leaderboard' && renderLeaderboard()}
      {activeTab === 'about' && renderAbout()}
      {activeTab === 'flashcards' && (
      <div className="min-h-screen bg-pink-50 py-8">
      <div className="container mx-auto px-6 max-w-4xl">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">Flashcards Επανάληψης</h1>
      <Flashcards />
      </div>
      </div>
      )}
    </div>
  );
  
}

export default App;