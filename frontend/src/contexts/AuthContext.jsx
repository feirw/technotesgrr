import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Δημιουργία Context
const AuthContext = createContext(null);

// Custom hook για εύκολη χρήση του context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 2. Auth Provider Component
export const AuthProvider = ({ children }) => {
  // Placeholder: Αλλάξτε το σε Firebase ή άλλη λογική σύνδεσης
  const [user, setUser] = useState(null); 
  const [isLoading, setIsLoading] = useState(true); // Χρειάζεται για να περιμένουμε τον έλεγχο σύνδεσης

  useEffect(() => {
    // Simulate checking auth status (e.g., from a token or Firebase)
    const checkAuthStatus = () => {
      // In a real app, this would check localStorage or call a backend API
      const storedUser = localStorage.getItem('mockUser'); 
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = (username) => {
    const mockUser = { id: '123', name: username };
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const logout = () => {
    localStorage.removeItem('mockUser');
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user, // Booelean flag
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};