import React, { lazy } from 'react';

// Home is eager so refresh on "/" paints immediately (no extra chunk wait).
import HomePage from '@/pages/public/HomePage';
const AboutPage = lazy(() => import('@/pages/public/AboutMe'));
const MerchPage = lazy(() => import('@/pages/public/MerchPage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/public/PrivacyPolicyPage'));
const DataProtectionPage = lazy(() => import('@/pages/public/DataProtectionPage'));
const GloglossaEmbedPage = lazy(() => import('@/pages/public/GloglossaEmbedPage'));
const AnnouncementsPage = lazy(() => import('@/pages/public/AnnouncementsTablePage'));

// User Pages (Protected)
// import NotesPage from '@/pages/private/NotesPage';
const loadQuizPage = () => import('@/pages/private/QuizPage');
const loadFlashcardsPage = () => import('@/pages/private/FlashcardsPage');
const loadProgressTrackerPage = () => import('@/pages/private/ProgressTrackerPage');
const loadProsanatolismosPage = () => import('@/pages/private/ProsanatolismosPage');

const QuizPage = lazy(loadQuizPage);
const FlashcardsPage = lazy(loadFlashcardsPage);
const LeaderboardPage = lazy(() => import('@/pages/public/LeaderboardPage'));
const AlgorithmsPage = lazy(() => import('@/pages/private/AlgorithmsPage'));
const PaliathemataPage = lazy(() => import('@/pages/private/PaliathemataPage'));
const OnlinePage = lazy(() => import('@/pages/private/OnlinePage'));
const ProsanatolismosPage = lazy(loadProsanatolismosPage);
const StudyTimerPage = lazy(() => import('@/pages/private/StudyTimerPage'));
const NotFound = lazy(() => import('@/pages/other/NotFound'));

const SchoolsPage = lazy(() => import('@/pages/private/SchoolsPage'));
const ProgressTrackerPage = lazy(loadProgressTrackerPage);

// Type Definition
export type RouteConfig = {
  path: string;
  element: React.ReactNode;
  children?: RouteConfig[];
};

/** Μόνο τα πιο συχνά routes — λιγότερο parse/main thread μετά το login (κοινότητα/progress κ.λπ. από hover). */
export const prefetchCriticalPrivateRoutes = () => {
  void loadQuizPage();
  void loadFlashcardsPage();
  void import('@/utils/quizUtils').then((m) => {
    void m.fetchAllQuizzes().catch(() => {});
  });
  void import('@/utils/flashcardsFetch').then((m) => {
    void m.fetchFlashcardsFromBackend().catch(() => {});
  });
};

/** Chat widget: μόνο δημόσιες «εισόδου» / αρχικές σελίδες — όχι quiz, flashcards, κ.λπ. */
export function shouldShowChatWidgetOnPath(pathname: string): boolean {
  const p =
    pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  const allowList = new Set(['/', '/about', '/merch', '/privacy-policy', '/data', '/announcements']);
  return allowList.has(p);
}

const routes: RouteConfig[] = [
  {
    path: '/',
    element: <HomePage />,
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
    path: '/announcements',
    element: <AnnouncementsPage />,
  },
  {
    path: '/quiz',
    element: <QuizPage />,
  },
  {
    path: '/flashcards',
    element: <FlashcardsPage />,
  },
  {
    path: '/leaderboard',
    element: <LeaderboardPage />,
  },
  {
    path: '/algorithms',
    element: <AlgorithmsPage />,
  },
  {
    path: '/paliathemata',
    element: <PaliathemataPage />,
  },
  {
    path: '/online',
    element: <OnlinePage />,
  },
  {
    path: '/prosanatolismos',
    element: <ProsanatolismosPage />,
  },
  {
    path: '/study-timer',
    element: <StudyTimerPage />,
  },
  {
    path: '/sxoles',
    element: <SchoolsPage />,
  },
  {
    path: '/progress-tracker',
    element: <ProgressTrackerPage />,
  },

  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
