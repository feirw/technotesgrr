import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores combined User + Profile data
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Helper: Fetch extra details (username, role, progress) from 'profiles' table
  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Profile fetch error:', err);
      return null;
    }
  };

  useEffect(() => {
    // 1. Check active session on startup
    const initializeAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        // Combine Auth data (email, id) with Database data (username, role, progress)
        setUser({ ...session.user, ...profile });
      }
      setLoading(false);
    };

    initializeAuth();

    // 2. Listen for login/logout events automatically
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await fetchProfile(session.user.id);
        setUser({ ...session.user, ...profile });
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Login Function
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  // Signup Function
  // We pass 'username' in metadata so the SQL Trigger can save it to the profiles table
  const signup = async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username: username }, // This is sent to the 'profiles' table via SQL Trigger
      },
    });

    if (error) throw error;
    return data;
  };

  // Logout Function
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error);
    setUser(null);
    navigate('/login');
  };

  const value = {
    user, // Contains id, email, username, role, quiz_progress
    role: user?.role || 'user', // Shortcut for role
    isAdmin: user?.role === 'admin',
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
