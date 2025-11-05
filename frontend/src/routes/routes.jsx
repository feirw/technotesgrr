import HomePage from '../pages/HomePage';
import NotesPage from '../pages/NotesPage';
import QuizPage from '../pages/QuizPage';
import FlashcardsPage from '../pages/FlashcardsPage';
import LeaderboardPage from '../pages/LeaderboardPage';
import AlgorithmsPage from '../pages/AlgorithmsPage';
import PaliathemataPage from '../pages/PaliathemataPage';
import OnlinePage from '../pages/OnlinePage';
import MerchPage from '../pages/MerchPage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import DataProtectionPage from '../pages/DataProtectionPage';
import AboutPage from '../pages/AboutMe';

const routes = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: 'notes',
    element: <NotesPage />,
  },
  {
    path: 'quiz',
    element: <QuizPage />,
  },
  {
    path: 'flashcards',
    element: <FlashcardsPage />,
  },
  {
    path: 'leaderboard',
    element: <LeaderboardPage />,
  },
  {
    path: 'algorithms',
    element: <AlgorithmsPage />,
  },
  {
    path: 'paliathemata',
    element: <PaliathemataPage />,
  },
  {
    path: 'online',
    element: <OnlinePage />,
  },
  {
    path: 'merch',
    element: <MerchPage />,
  },
  {
    path: 'privacy-policy',
    element: <PrivacyPolicyPage />,
  },
  {
    path: 'data',
    element: <DataProtectionPage />,
  },
  {
    path: 'about',
    element: <AboutPage />,
  },
  {
    path: '*',
    element: <div>404 - Η σελίδα δεν βρέθηκε</div>,
  },
];

export default routes;
