import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Το URL του backend μας
const BACKEND_URL = 'http://localhost:8001';

// 1. Δημιουργούμε το Context
const AppContext = createContext(null);

// 2. Δημιουργούμε τον "Provider" component
// Αυτός θα "αγκαλιάσει" την εφαρμογή μας και θα παρέχει την καθολική κατάσταση.
export const AppProvider = ({ children }) => {
  // --- State ---
  // Παίρνουμε το nickname από το localStorage κατά την αρχικοποίηση.
  const [nickname, setNicknameState] = useState(() => localStorage.getItem('nickname') || '');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  // --- Functions ---

  // Συνάρτηση για την ενημέρωση του leaderboard.
  // Χρησιμοποιούμε useCallback για να μην δημιουργείται εκ νέου σε κάθε render,
  // κάτι που είναι καλή πρακτική για συναρτήσεις που περνιούνται μέσω context.
  const fetchLeaderboard = useCallback(async () => {
    setLoadingLeaderboard(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/leaderboard`);
      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLeaderboard([]); // Σε περίπτωση σφάλματος, αδειάζουμε το leaderboard
    } finally {
      setLoadingLeaderboard(false);
    }
  }, []);

  // Κάνουμε το πρώτο fetch του leaderboard όταν φορτώνει η εφαρμογή.
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Δημιουργούμε μια δική μας συνάρτηση setNickname που κάνει δύο πράγματα:
  // 1. Ενημερώνει την κατάσταση (state)
  // 2. Αποθηκεύει το nickname στο localStorage για να παραμένει μετά από refresh.
  const setNickname = (newNickname) => {
    if (newNickname) {
      localStorage.setItem('nickname', newNickname);
    } else {
      localStorage.removeItem('nickname'); // Αφαίρεση αν το όνομα είναι κενό
    }
    setNicknameState(newNickname);
  };

  // Αυτό είναι το αντικείμενο που θα μοιραστούμε με όλη την εφαρμογή.
  const value = {
    nickname,
    setNickname,
    leaderboard,
    fetchLeaderboard,
    loadingLeaderboard,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// 3. Δημιουργούμε ένα custom hook για εύκολη χρήση του Context.
// Αντί να γράφουμε `useContext(AppContext)` σε κάθε component,
// θα γράφουμε απλά `useAppContext()`.
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === null) {
    // Αυτό το σφάλμα θα εμφανιστεί αν προσπαθήσουμε να χρησιμοποιήσουμε το context
    // εκτός του AppProvider, κάτι που μας βοηθά να αποφύγουμε λάθη.
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
