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
import ProsanatolismosPage from '../pages/ProsanatolismosPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ProtectedRoute from '../components/ProtectedRoute';

const routes = [
  // ═══════════════════════════════════════════════════════════════
  // 🔓 PUBLIC ROUTES (Accessible by everyone)
  // ═══════════════════════════════════════════════════════════════
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: 'register',
    element: <RegisterPage />,
  },
  // Informational pages usually stay public so users can read them before signing up
  {
    path: 'about',
    element: <AboutPage />,
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

  // ═══════════════════════════════════════════════════════════════
  // 🔒 USER PROTECTED ROUTES (Requires Login)
  // ═══════════════════════════════════════════════════════════════
  {
    element: <ProtectedRoute />, // Default: requireAdmin={false}
    children: [
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
        path: 'prosanatolismos',
        element: <ProsanatolismosPage />,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 🛡️ ADMIN PROTECTED ROUTES (Requires Role: 'admin')
  // ═══════════════════════════════════════════════════════════════
  {
    element: <ProtectedRoute requireAdmin={true} />,
    children: [
      {
        path: 'admin',
        element: <AdminDashboard />,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // ⚠️ 404 CATCH ALL
  // ═══════════════════════════════════════════════════════════════
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center text-xl font-bold">
        404 - Η σελίδα δεν βρέθηκε
      </div>
    ),
  },
];

export default routes;
