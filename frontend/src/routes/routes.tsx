import React from 'react';

// Public Pages
import HomePage from '@/pages/public/HomePage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import AboutPage from '@/pages/public/AboutMe';
import MerchPage from '@/pages/public/MerchPage';
import PrivacyPolicyPage from '@/pages/public/PrivacyPolicyPage';
import DataProtectionPage from '@/pages/public/DataProtectionPage';

// User Pages (Protected)
// import NotesPage from '@/pages/private/NotesPage';
import QuizPage from '@/pages/private/QuizPage';
import FlashcardsPage from '@/pages/private/FlashcardsPage';
import LeaderboardPage from '@/pages/public/LeaderboardPage';
import AlgorithmsPage from '@/pages/private/AlgorithmsPage';
import PaliathemataPage from '@/pages/private/PaliathemataPage';
import OnlinePage from '@/pages/private/OnlinePage';
import ProsanatolismosPage from '@/pages/private/ProsanatolismosPage';
import ProfilePage from '@/pages/private/ProfilePage';
import NotFound from '@/pages/other/NotFound';
import NotAuthorized from '@/pages/other/NotAuthorized';

import SchoolsPage from '@/pages/private/SchoolsPage';
// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';

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
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/merch',
    element: <MerchPage />,
  },
  {
    path: '/privacy-policy',
    element: <PrivacyPolicyPage />,
  },
  {
    path: '/data',
    element: <DataProtectionPage />,
  },
  {
    path: '/not-authorized',
    element: <NotAuthorized />,
  },

  // ═══════════════════════════════════════════════════════════════
  // 🔒 USER ROUTES (Requires Login)
  // ═══════════════════════════════════════════════════════════════

  // path: '/notes',
  // element: <NotesPage />,
  // // protected: true,
  // // roles: ['user', 'admin'],

  {
    path: '/quiz',
    element: <QuizPage />,
    protected: true,
    roles: ['user', 'admin'],
  },
  {
    path: '/flashcards',
    element: <FlashcardsPage />,
    protected: true,
    roles: ['user', 'admin'],
  },
  {
    path: '/leaderboard',
    element: <LeaderboardPage />,
    protected: true,
    roles: ['user', 'admin'],
  },
  {
    path: '/algorithms',
    element: <AlgorithmsPage />,
    protected: true,
    roles: ['user', 'admin'],
  },
  {
    path: '/paliathemata',
    element: <PaliathemataPage />,
    protected: true,
    roles: ['user', 'admin'],
  },
  {
    path: '/online',
    element: <OnlinePage />,
    protected: true,
    roles: ['user', 'admin'],
  },
  {
    path: '/prosanatolismos',
    element: <ProsanatolismosPage />,
    protected: true,
    roles: ['user', 'admin'],
  },
  {
    path: '/profile',
    element: <ProfilePage />,
    protected: true,
    roles: ['user', 'admin'],
  },
  {
    path: '/sxoles',
    element: <SchoolsPage />,
    protected: true,
    roles: ['user', 'admin'],
  },

  // ═══════════════════════════════════════════════════════════════
  // 🛡️ ADMIN ROUTES
  // ═══════════════════════════════════════════════════════════════
  {
    path: '/admin',
    element: <AdminDashboard />,
    protected: true,
    roles: ['admin'],
  },

  // ═══════════════════════════════════════════════════════════════
  // ⚠️ 404 NOT FOUND
  // ═══════════════════════════════════════════════════════════════
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
