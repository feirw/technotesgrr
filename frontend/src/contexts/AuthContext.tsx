import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase, isMockMode } from '@/utils/supabaseClient';
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

// Helper: Promise with timeout
const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    ),
  ]);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isInitialized = useRef(false);
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- Helper: Safe Profile Fetch ---
  const fetchProfileSafe = useCallback(async (baseUser: SupabaseUser): Promise<UserProfile> => {
    if (isMockMode) {
      return {
        ...baseUser,
        username: baseUser.email?.split('@')[0] || 'MockUser',
        role: 'user',
      } as UserProfile;
    }

    try {
      const profilePromise = Promise.resolve(
        supabase.from('profiles').select('*').eq('id', baseUser.id).single()
      );

      const { data, error } = await withTimeout<{ data: any; error: any }>(profilePromise, 5000);

      if (error) {
        console.warn('⚠️ Could not fetch profile, using defaults:', error.message);
        return {
          ...baseUser,
          username: baseUser.email?.split('@')[0] || 'User',
          role: 'user',
        } as UserProfile;
      }

      console.log('📋 Profile data fetched:', {
        userId: baseUser.id,
        role: data?.role,
        roleType: typeof data?.role,
        username: data?.username,
        fullData: data,
      });

      // Ensure role is properly extracted and normalized
      const roleValue = data?.role;
      let normalizedRole: UserRole = 'user';
      if (roleValue) {
        const lowerRole = String(roleValue).toLowerCase();
        if (lowerRole === 'admin') {
          normalizedRole = 'admin';
        } else if (lowerRole === 'user') {
          normalizedRole = 'user';
        }
      }

      const profile = {
        ...baseUser,
        ...data,
        role: normalizedRole,
      } as UserProfile;

      console.log('✅ Final profile object:', {
        userId: profile.id,
        role: profile.role,
        roleFromData: roleValue,
        isAdmin: profile.role === 'admin',
      });

      return profile;
    } catch (e) {
      console.error('❌ Profile fetch error:', e);
      return {
        ...baseUser,
        username: baseUser.email?.split('@')[0] || 'User',
        role: 'user',
      } as UserProfile;
    }
  }, []);

  useEffect(() => {
    // Increased timeout for better session restoration support
    // This gives more time for the session to be restored on slower connections
    loadingTimeoutRef.current = setTimeout(() => {
      if (loading) {
        console.warn('⚠️ Auth loading timeout - forcing to false after 5 seconds');
        setLoading(false);
      }
    }, 5000);

    const initializeAuth = async () => {
      if (isInitialized.current) return;
      isInitialized.current = true;

      if (isMockMode) {
        console.warn('🔧 MOCK MODE - Auth disabled');
        setLoading(false);
        if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
        return;
      }

      try {
        // Use getSession which is synchronous and checks localStorage first
        const sessionPromise = supabase.auth.getSession();
        const {
          data: { session },
          error,
        } = await withTimeout(sessionPromise, 4000);

        if (error) {
          console.warn('⚠️ Session fetch error (non-critical):', error.message);
          // Don't throw - allow the app to continue
        }

        if (session?.user) {
          const profile = await fetchProfileSafe(session.user);
          setUser(profile);
          console.log('✅ Session restored on page load');
        } else {
          console.log('ℹ️ No active session found');
        }
      } catch (err) {
        console.error('Auth init error:', err);
        // Don't block the app - set loading to false so user can see what's happening
      } finally {
        if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
        setLoading(false);
      }
    };

    initializeAuth();

    if (isMockMode) {
      return () => {
        if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      };
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`🔔 Auth Event: ${event}`);

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session?.user) {
          const profile = await fetchProfileSafe(session.user);
          setUser(profile);
          setLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      subscription.unsubscribe();
    };
  }, [fetchProfileSafe]);

  const login = async (email: string, password: string) => {
    console.log('🔐 Login attempt for:', email);

    if (isMockMode) {
      console.error('❌ Cannot login - Supabase not configured');
      throw new Error(
        'Το σύστημα authentication δεν είναι ρυθμισμένο. Παρακαλώ προσθέστε Supabase credentials στο .env file.'
      );
    }

    try {
      // Login with 10 second timeout
      const loginPromise = supabase.auth.signInWithPassword({ email, password });
      const { data, error } = await withTimeout(loginPromise, 10000);

      if (error) {
        console.error('❌ Login error:', error);
        throw error;
      }

      console.log('✅ Login successful');

      if (data.user) {
        const profile = await fetchProfileSafe(data.user);
        setUser(profile);

        // Small delay to ensure state update
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Don't redirect here - let the AuthRedirectHandler or the component handle it
        // This allows the user to stay on their intended page after login
        console.log('✅ Login successful, user state updated');
      }
    } catch (error: any) {
      console.error('❌ Login failed:', error);

      // Re-throw with better message
      if (error.message === 'Request timeout') {
        throw new Error('Η σύνδεση με το server κράτησε πολύ. Ελέγξτε τη σύνδεσή σας.');
      }

      throw error;
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    console.log('📝 Signup attempt for:', email);

    if (isMockMode) {
      throw new Error('Το σύστημα authentication δεν είναι ρυθμισμένο.');
    }

    try {
      const signupPromise = supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });

      const { error } = await withTimeout(signupPromise, 10000);

      if (error) throw error;

      console.log('✅ Signup successful');
    } catch (error: any) {
      console.error('❌ Signup failed:', error);

      if (error.message === 'Request timeout') {
        throw new Error('Η εγγραφή κράτησε πολύ. Δοκιμάστε ξανά.');
      }

      throw error;
    }
  };

  const logout = async () => {
    console.log('👋 Logging out...');

    if (!isMockMode) {
      try {
        await withTimeout(supabase.auth.signOut(), 5000);
      } catch (e) {
        console.error('Logout error:', e);
      }
    }

    setUser(null);
    navigate('/login', { replace: true });
  };

  // Normalize role to lowercase for comparison (in case DB has 'Admin' instead of 'admin')
  let normalizedRole: UserRole = user?.role || null;
  if (normalizedRole) {
    const lowerRole = normalizedRole.toLowerCase();
    if (lowerRole === 'admin') {
      normalizedRole = 'admin';
    } else if (lowerRole === 'user') {
      normalizedRole = 'user';
    }
  }

  const value: AuthContextType = {
    user: user ? { ...user, role: normalizedRole } : null,
    role: normalizedRole,
    isAdmin: normalizedRole === 'admin',
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
