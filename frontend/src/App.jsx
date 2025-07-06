import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import NotesPage from './pages/NotesPage';
import QuizPage from './pages/QuizPage';
import FlashcardsPage from './pages/FlashcardsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Οι εσωτερικές διαδρομές αποδίδονται μέσα στο Outlet του MainLayout */}
        <Route index element={<HomePage />} />
        <Route path="notes" element={<NotesPage />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="flashcards" element={<FlashcardsPage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
        <Route path="about" element={<AboutPage />} />
        {/* Μπορείς να προσθέσεις και μια σελίδα 404 Not Found */}
        <Route path="*" element={<div>404 - Η σελίδα δεν βρέθηκε</div>} />
      </Route>
    </Routes>
  );
}

export default App;
