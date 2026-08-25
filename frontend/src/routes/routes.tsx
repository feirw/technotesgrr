import React, { lazy } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Home is eager so refresh on "/" paints immediately (no extra chunk wait).
import HomePage from '@/pages/public/HomePage';
const AboutPage = lazy(() => import('@/pages/public/AboutMe'));
// const MerchPage = lazy(() => import('@/pages/public/MerchPage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/public/PrivacyPolicyPage'));
const DataProtectionPage = lazy(() => import('@/pages/public/DataProtectionPage'));
export const loadGloglossaPage = () => import('@/pages/public/GloglossaEmbedPage');
const GloglossaEmbedPage = lazy(loadGloglossaPage);
const VivliaPage = lazy(() => import('@/pages/public/VivliaPage'));
const AnnouncementsPage = lazy(() => import('@/pages/public/AnnouncementsTablePage'));
const FaqPage = lazy(() => import('@/pages/public/FaqPage'));
// const LoginPage = lazy(() => import('@/pages/public/LoginPage'));
// const RegisterPage = lazy(() => import('@/pages/public/RegisterPage'));
// const ForgotPasswordPage = lazy(() => import('@/pages/public/ForgotPasswordPage'));
// const ResetPasswordPage = lazy(() => import('@/pages/public/ResetPasswordPage'));

// User Pages (Protected)
const loadQuizPage = () => import('@/pages/private/QuizPage');
const loadFlashcardsPage = () => import('@/pages/private/FlashcardsPage');
const loadProgressTrackerPage = () => import('@/pages/private/ProgressTrackerPage');
const loadProsanatolismosPage = () => import('@/pages/private/ProsanatolismosPage');

const QuizPage = lazy(loadQuizPage);
const FlashcardsPage = lazy(loadFlashcardsPage);
const LeaderboardPage = lazy(() => import('@/pages/public/LeaderboardPage'));
const AlgorithmsPage = lazy(() => import('@/pages/private/AlgorithmsPage'));
const DataStructuresPage = lazy(() => import('@/pages/private/DataStructuresPage'));
const PaliathemataPage = lazy(() => import('@/pages/private/PaliathemataPage'));
// const OnlinePage = lazy(() => import('@/pages/private/OnlinePage'));
const ProsanatolismosPage = lazy(loadProsanatolismosPage);
const StudyTimerPage = lazy(() => import('@/pages/private/StudyTimerPage'));
const ThankYouPage = lazy(() => import('@/pages/public/ThankYouPage'));
const NotFound = lazy(() => import('@/pages/other/NotFound'));

const SchoolsPage = lazy(() => import('@/pages/private/SchoolsPage'));

function SchoolCompareRedirect() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  params.set('view', 'compare');
  return <Navigate to={`/sxoles?${params.toString()}`} replace />;
}
const ProgressTrackerPage = lazy(loadProgressTrackerPage);
const MethodologiesPage = lazy(() => import('@/pages/private/MethodologiesPage'));
const AskiseisPage = lazy(() => import('@/pages/private/AskiseisPage'));
// const AiCorrectorPage = lazy(() => import('@/pages/private/AiCorrectorPage'));
const SchoolCoefficientsPage = lazy(() => import('@/pages/private/SchoolCoefficientsPage'));
const MoriaCalculatorPage = lazy(() => import('@/pages/private/MoriaCalculatorPage'));
const SaekPage = lazy(() => import('@/pages/private/SaekPage'));
const CsCareerPathPage = lazy(() => import('@/pages/private/CsCareerPathPage'));
const MixanografikoPage = lazy(() => import('@/pages/private/MixanografikoPage'));
const AntistoixiesSxolonPage = lazy(() => import('@/pages/private/AntistoixiesSxolonPage'));
const MeteggrafesPage = lazy(() => import('@/pages/private/MeteggrafesPage'));

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
  void import('@/utils/flashcards');
};

/** Chat widget: μόνο δημόσιες «εισόδου» / αρχικές σελίδες — όχι quiz, flashcards, κ.λπ. */
export function shouldShowChatWidgetOnPath(pathname: string): boolean {
  const p =
    pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  const allowList = new Set(['/', '/about', '/privacy-policy', '/data', '/announcements']);
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
  // {
  //   path: '/merch',
  //   element: <MerchPage />,
  // },
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
    path: '/vivlia',
    element: <VivliaPage />,
  },
  {
    path: '/announcements',
    element: <AnnouncementsPage />,
  },
  {
    path: '/thank-you',
    element: <ThankYouPage />,
  },
  {
    path: '/terms',
    element: <Navigate to="/privacy-policy" replace />,
  },
  {
    path: '/terms-of-service',
    element: <Navigate to="/privacy-policy" replace />,
  },
  {
    path: '/faq',
    element: <FaqPage />,
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
  //   path: '/forgot-password',
  //   element: <ForgotPasswordPage />,
  // },
  // {
  //   path: '/reset-password',
  //   element: <ResetPasswordPage />,
  // },
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
    path: '/domes-dedomenon',
    element: <DataStructuresPage />,
  },
  {
    path: '/paliathemata',
    element: <PaliathemataPage />,
  },
  // {
  //   path: '/online',
  //   element: <OnlinePage />,
  // },
  {
    path: '/prosanatolismos',
    element: <ProsanatolismosPage />,
  },
  {
    path: '/prosanatolismos-pliroforikis',
    element: <CsCareerPathPage />,
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
    path: '/sygkrisi-mathimaton',
    element: <SchoolCompareRedirect />,
  },
  {
    path: '/progress-tracker',
    element: <ProgressTrackerPage />,
  },
  {
    path: '/methodologies',
    element: <MethodologiesPage />,
  },
  {
    path: '/askiseis',
    element: <AskiseisPage />,
  },
  // {
  //   path: '/ai-corrector',
  //   element: <AiCorrectorPage />,
  // },
  {
    path: '/syntelestes-sxolon',
    element: <SchoolCoefficientsPage />,
  },
  {
    path: '/ypologismos-morion',
    element: <MoriaCalculatorPage />,
  },
  {
    path: '/saek',
    element: <SaekPage />,
  },
  {
    path: '/mixanografiko',
    element: <MixanografikoPage />,
  },
  {
    path: '/antistoixies-sxolon',
    element: <AntistoixiesSxolonPage />,
  },
  {
    path: '/meteggrafes',
    element: <MeteggrafesPage />,
  },

  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
