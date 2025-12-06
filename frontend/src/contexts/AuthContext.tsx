import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { User as SupabaseUser } from '@supabase/supabase-js';

// --- Types ---

export type UserRole = 'admin' | 'user' | null;

export interface UserProfile extends Omit<SupabaseUser, 'role'> {
  username?: string;
  email?: string;
  role?: UserRole;
  quiz_progress?: Record<string, any>;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Track initialization to avoid double-fetching the initial session
  const isInitialized = useRef(false);

  // --- Helper: Safe Profile Fetch ---
  const fetchProfileSafe = useCallback(async (baseUser: SupabaseUser): Promise<UserProfile> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', baseUser.id)
        .single();

      if (error) {
        console.warn('⚠️ Could not fetch profile data. Using basic auth data.', error.message);
        return {
          ...baseUser,
          username: baseUser.email?.split('@')[0] || 'User',
          role: 'user',
        } as UserProfile;
      }

      return { ...baseUser, ...data } as UserProfile;
    } catch (e) {
      console.error('❌ Unexpected error fetching profile:', e);
      return baseUser as UserProfile;
    }
  }, []);

  useEffect(() => {
    // 1. Initial Session Check (Run once)
    const initializeAuth = async () => {
      if (isInitialized.current) return;
      isInitialized.current = true;

      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.user) {
          const profile = await fetchProfileSafe(session.user);
          setUser(profile);
        }
      } catch (err) {
        // console.error("Auth init error:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // 2. Real-time Subscription (Must run on every mount/unmount cycle)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`🔔 Auth Event: ${event}`);

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session?.user) {
          // Only show loading if we are essentially logging in (user was null)
          // or if we want to force a UI refresh.
          if (!user) setLoading(true);

          const profile = await fetchProfileSafe(session.user);
          setUser(profile);
          setLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfileSafe, user]); // Added user dependency to check state inside listener if needed

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signup = async (email: string, password: string, username: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    role: user?.role || null,
    isAdmin: user?.role === 'admin',
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
