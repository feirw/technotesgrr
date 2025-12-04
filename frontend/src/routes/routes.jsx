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
// Το ProtectedRoute ΔΕΝ εισάγεται

const routes = [
    {
        path: '/',
        element: <HomePage />, // Δημόσια
    },
    {
        path: 'notes',
        element: <NotesPage />, // Δημόσια (Πριν ήταν προστατευμένο)
    },
    {
        path: 'quiz',
        element: <QuizPage />, // Δημόσια (Πριν ήταν προστατευμένο)
    },
    {
        path: 'flashcards',
        element: <FlashcardsPage />, // Δημόσια (Πριν ήταν προστατευμένο)
    },
    {
        path: 'leaderboard',
        element: <LeaderboardPage />, // Δημόσια (Πριν ήταν προστατευμένο)
    },
    {
        path: 'algorithms',
        element: <AlgorithmsPage />, // Δημόσια (Πριν ήταν προστατευμένο)
    },
    {
        path: 'paliathemata',
        element: <PaliathemataPage />, // Δημόσια (Πριν ήταν προστατευμένο)
    },
    {
        path: 'online',
        element: <OnlinePage />, // Δημόσια (Πριν ήταν προστατευμένο)
    },
    {
        path: 'merch',
        element: <MerchPage />, // Δημόσια
    },
    {
        path: 'privacy-policy',
        element: <PrivacyPolicyPage />, // Δημόσια
    },
    {
        path: 'data',
        element: <DataProtectionPage />, // Δημόσια
    },
    {
        path: 'about',
        element: <AboutPage />, // Δημόσια
    },
    {
        path: 'prosanatolismos',
        element: <ProsanatolismosPage />, // Δημόσια (Πριν ήταν προστατευμένο)
    },
    {
        path: 'login',
        element: <LoginPage />, // Δημόσια
    },
    {
        path: '*',
        element: <div>404 - Η σελίδα δεν βρέθηκε</div>, // Δημόσια
    },
];

export default routes;