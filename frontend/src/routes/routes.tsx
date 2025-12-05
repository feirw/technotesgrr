import React from 'react';

// Public Pages
import HomePage from '@/pages/HomePage';
// import LoginPage from '@/pages/LoginPage';
// import RegisterPage from '@/pages/RegisterPage';
// import AboutPage from '@/pages/AboutMe';
// import MerchPage from '@/pages/MerchPage';
// import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
// import DataProtectionPage from '@/pages/DataProtectionPage';

// User Pages (Protected)
// import NotesPage from '@/pages/NotesPage';
// import QuizPage from '@/pages/QuizPage';
// import FlashcardsPage from '@/pages/FlashcardsPage';
// import LeaderboardPage from '@/pages/LeaderboardPage';
// import AlgorithmsPage from '@/pages/AlgorithmsPage';
// import PaliathemataPage from '@/pages/PaliathemataPage';
// import OnlinePage from '@/pages/OnlinePage';
// import ProsanatolismosPage from '@/pages/ProsanatolismosPage';
// import ProfilePage from '@/pages/ProfilePage';
import NotFound from '@/pages/NotFound';

// Admin Pages
// import AdminDashboard from '@/pages/admin/AdminDashboard';

// Type Definition
export type RouteConfig = {
  path: string;
  element: React.ReactNode;
  protected?: boolean;
  roles?: Array<'user' | 'admin'>;
  children?: RouteConfig[];
};

const routes: RouteConfig[] = [
  // ═══════════════════════════════════════════════════════════════
  // 🔓 PUBLIC ROUTES
  // ═══════════════════════════════════════════════════════════════
  {
    path: '/',
    element: <HomePage />,
  },
  // {
  //   path: '/login',
  //   element: <LoginPage />,
  // },
  // {
  //   path: '/register',
  //   element: <RegisterPage />,
  // },
  // {
  //   path: '/about',
  //   element: <AboutPage />,
  // },
  // {
  //   path: '/merch',
  //   element: <MerchPage />,
  // },
  // {
  //   path: '/privacy-policy',
  //   element: <PrivacyPolicyPage />,
  // },
  // {
  //   path: '/data',
  //   element: <DataProtectionPage />,
  // },

  // ═══════════════════════════════════════════════════════════════
  // 🔒 USER ROUTES (Requires Login)
  // ═══════════════════════════════════════════════════════════════
  // {
  //   path: '/notes',
  //   element: <NotesPage />,
  //   protected: true,
  //   roles: ['user', 'admin'],
  // },
  // {
  //   path: '/quiz',
  //   element: <QuizPage />,
  //   protected: true,
  //   roles: ['user', 'admin'],
  // },
  // {
  //   path: '/flashcards',
  //   element: <FlashcardsPage />,
  //   protected: true,
  //   roles: ['user', 'admin'],
  // },
  // {
  //   path: '/leaderboard',
  //   element: <LeaderboardPage />,
  //   protected: true,
  //   roles: ['user', 'admin'],
  // },
  // {
  //   path: '/algorithms',
  //   element: <AlgorithmsPage />,
  //   protected: true,
  //   roles: ['user', 'admin'],
  // },
  // {
  //   path: '/paliathemata',
  //   element: <PaliathemataPage />,
  //   protected: true,
  //   roles: ['user', 'admin'],
  // },
  // {
  //   path: '/online',
  //   element: <OnlinePage />,
  //   protected: true,
  //   roles: ['user', 'admin'],
  // },
  // {
  //   path: '/prosanatolismos',
  //   element: <ProsanatolismosPage />,
  //   protected: true,
  //   roles: ['user', 'admin'],
  // },
  // {
  //   path: '/profile',
  //   element: <ProfilePage />,
  //   protected: true,
  //   roles: ['user', 'admin'],
  // },

  // ═══════════════════════════════════════════════════════════════
  // 🛡️ ADMIN ROUTES
  // ═══════════════════════════════════════════════════════════════
  // {
  //   path: '/admin',
  //   element: <AdminDashboard />,
  //   protected: true,
  //   roles: ['admin'],
  // },

  // ═══════════════════════════════════════════════════════════════
  // ⚠️ 404 NOT FOUND
  // ═══════════════════════════════════════════════════════════════
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
