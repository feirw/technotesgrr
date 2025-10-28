import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import NotesPage from './pages/NotesPage';
import QuizPage from './pages/QuizPage';
import FlashcardsPage from './pages/FlashcardsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AlgorithmsPage from './pages/AlgorithmsPage';
import PaliathemataPage from './pages/PaliathemataPage';
import OnlinePage from './pages/OnlinePage';
import MerchPage from './pages/MerchPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import DataProtectionPage from './pages/DataProtectionPage';
import AboutPage from './pages/AboutMe';  

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="notes" element={<NotesPage />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="flashcards" element={<FlashcardsPage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
        <Route path="algorithms" element={<AlgorithmsPage />} />
        <Route path="paliathemata" element={<PaliathemataPage />} />
        <Route path="online" element={<OnlinePage />} />
        <Route path="/merch" element={<MerchPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/data" element={<DataProtectionPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<div>404 - Η σελίδα δεν βρέθηκε</div>} />
      </Route>
    </Routes>
  );
}

export default App;
