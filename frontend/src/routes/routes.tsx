import React, { lazy } from 'react';

// Home is eager so refresh on "/" paints immediately (no extra chunk wait).
import HomePage from '@/pages/public/HomePage';
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const AboutPage = lazy(() => import('@/pages/public/AboutMe'));
const MerchPage = lazy(() => import('@/pages/public/MerchPage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/public/PrivacyPolicyPage'));
const DataProtectionPage = lazy(() => import('@/pages/public/DataProtectionPage'));
const GloglossaEmbedPage = lazy(() => import('@/pages/public/GloglossaEmbedPage'));

// User Pages (Protected)
// import NotesPage from '@/pages/private/NotesPage';
const loadQuizPage = () => import('@/pages/private/QuizPage');
const loadFlashcardsPage = () => import('@/pages/private/FlashcardsPage');
const loadCommunityPage = () => import('@/pages/private/CommunityPage');
const loadProgressTrackerPage = () => import('@/pages/private/ProgressTrackerPage');
const loadProsanatolismosPage = () => import('@/pages/private/ProsanatolismosPage');

const QuizPage = lazy(loadQuizPage);
const FlashcardsPage = lazy(loadFlashcardsPage);
const LeaderboardPage = lazy(() => import('@/pages/public/LeaderboardPage'));
const AlgorithmsPage = lazy(() => import('@/pages/private/AlgorithmsPage'));
const PaliathemataPage = lazy(() => import('@/pages/private/PaliathemataPage'));
const OnlinePage = lazy(() => import('@/pages/private/OnlinePage'));
const ProsanatolismosPage = lazy(loadProsanatolismosPage);
const ProfilePage = lazy(() => import('@/pages/private/ProfilePage'));
const StudyTimerPage = lazy(() => import('@/pages/private/StudyTimerPage'));
const NotFound = lazy(() => import('@/pages/other/NotFound'));
const NotAuthorized = lazy(() => import('@/pages/other/NotAuthorized'));

const SchoolsPage = lazy(() => import('@/pages/private/SchoolsPage'));
const CommunityPage = lazy(loadCommunityPage);
const ProgressTrackerPage = lazy(loadProgressTrackerPage);
// Admin Pages
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));

// Type Definition
export type RouteConfig = {
  path: string;
  element: React.ReactNode;
  protected?: boolean;
  roles?: Array<'user' | 'admin'>;
  children?: RouteConfig[];
};

export const prefetchCriticalPrivateRoutes = () => {
  const importers = [
    loadQuizPage,
    loadFlashcardsPage,
    loadCommunityPage,
    loadProgressTrackerPage,
    loadProsanatolismosPage,
  ];
  for (const importer of importers) {
    void importer();
  }
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
    path: '/reset-password',
    element: <ResetPasswordPage />,
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
    path: '/gloglossa',
    element: <GloglossaEmbedPage />,
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
    path: '/study-timer',
    element: <StudyTimerPage />,
    protected: true,
    roles: ['user', 'admin'],
  },
  {
    path: '/sxoles',
    element: <SchoolsPage />,
    protected: true,
    roles: ['user', 'admin'],
  },
  {
    path: '/community',
    element: <CommunityPage />,
    protected: true,
    roles: ['user', 'admin'],
  },
  {
    path: '/progress-tracker',
    element: <ProgressTrackerPage />,
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
