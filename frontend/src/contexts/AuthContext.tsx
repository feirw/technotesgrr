import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase, isMockMode } from '@/utils/supabaseClient';
import { User as SupabaseUser } from '@supabase/supabase-js';

/**
 * Authentication Context
 *
 * Handles user authentication, session management, and profile data.
 * Key features:
 * - Session restoration on page refresh
 * - Login/logout functionality
 * - User registration with profile creation
 * - Role-based access control (admin/user)
 */

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
  /** True until getSession() (or fallback) has finished resolving. */
  loading: boolean;
  /** True while DB profile is loading after we already have a session user (optimistic UI). */
  profileLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfileUsername: (username: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const missingProviderError = () => {
  throw new Error('AuthContext is not available. Ensure AuthProvider wraps the app.');
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  isAdmin: false,
  loading: true,
  profileLoading: false,
  login: async () => missingProviderError(),
  signup: async () => missingProviderError(),
  logout: async () => missingProviderError(),
  updateProfileUsername: async () => missingProviderError(),
  requestPasswordReset: async () => missingProviderError(),
  updatePassword: async () => missingProviderError(),
  refreshUserProfile: async () => missingProviderError(),
});

export const useAuth = () => useContext(AuthContext);

const devLog = (...args: unknown[]) => {
  if (import.meta.env.DEV) console.log(...args);
};

const devWarn = (...args: unknown[]) => {
  if (import.meta.env.DEV) console.warn(...args);
};

// Helper: Promise with timeout
const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    ),
  ]);
};

/** Session-only snapshot so the shell can render before profiles row loads (fast refresh). */
function optimisticUserFromSession(baseUser: SupabaseUser): UserProfile {
  const meta = (baseUser.user_metadata || {}) as Record<string, unknown>;
  const appMeta = (baseUser.app_metadata || {}) as Record<string, unknown>;
  const metaUsername = typeof meta.username === 'string' ? meta.username : undefined;
  const roleHint =
    (typeof meta.role === 'string' && meta.role) ||
    (typeof appMeta.role === 'string' && appMeta.role) ||
    '';
  let role: UserRole = 'user';
  if (String(roleHint).toLowerCase() === 'admin') role = 'admin';

  return {
    ...baseUser,
    username: metaUsername ?? baseUser.email?.split('@')[0] ?? 'User',
    role,
  } as UserProfile;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // Track initialization to prevent duplicate session checks
  const isInitialized = useRef(false);
  // Timeout ref for safety - ensures loading state doesn't hang forever
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Safely fetches user profile from database
   * Falls back to default values if profile doesn't exist or fetch fails
   * This ensures the app continues to work even if profile table has issues
   */
  const fetchProfileSafe = useCallback(async (baseUser: SupabaseUser): Promise<UserProfile> => {
    if (isMockMode) {
      return {
        ...baseUser,
        username: baseUser.email?.split('@')[0] || 'MockUser',
        role: 'user',
      } as UserProfile;
    }

    try {
      // Fetch profile with timeout to prevent hanging
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', baseUser.id)
        .maybeSingle();
      const { data, error } = await withTimeout<{ data: any; error: any }>(profilePromise, 5000);

      if (error) {
        devWarn('⚠️ Could not fetch profile, using defaults:', error.message);
        // Return default profile - allows app to continue functioning
        return {
          ...baseUser,
          username: baseUser.email?.split('@')[0] || 'User',
          role: 'user',
        } as UserProfile;
      }

      devLog('📋 Profile data fetched:', {
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

      devLog('✅ Final profile object:', {
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

  /**
   * Initialize authentication state on app load
   * This effect runs once when the component mounts and:
   * 1. Checks for existing session in localStorage (fast)
   * 2. Restores user profile if session exists
   * 3. Sets up listener for auth state changes
   *
   * IMPORTANT: This does NOT redirect - that's handled by ProtectedRoute
   * This ensures the current page is preserved on refresh
   */
  useEffect(() => {
    // Safety timeout - ensures loading state doesn't hang forever
    loadingTimeoutRef.current = setTimeout(() => {
      if (loading) {
        devWarn('⚠️ Auth loading timeout - forcing to false after 12 seconds');
        setLoading(false);
      }
    }, 12000);

    const initializeAuth = async () => {
      // Prevent duplicate initialization
      if (isInitialized.current) return;
      isInitialized.current = true;

      if (isMockMode) {
        devWarn('🔧 MOCK MODE - Auth disabled');
        setProfileLoading(false);
        setLoading(false);
        if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
        return;
      }

      try {
        // getSession() checks localStorage first and is the main refresh-preservation path.
        // Keep timeout relaxed for slow mobile connections.
        let session: any = null;
        let error: any = null;
        try {
          const sessionPromise = supabase.auth.getSession();
          const sessionRes = await withTimeout(sessionPromise, 8000);
          session = sessionRes?.data?.session ?? null;
          error = sessionRes?.error ?? null;
        } catch (sessionErr) {
          // Fallback: try getUser() once before concluding user is logged out.
          devWarn('⚠️ getSession timed out/failed, trying getUser fallback...');
          try {
            const userRes = await withTimeout(supabase.auth.getUser(), 8000);
            if (userRes?.data?.user) {
              const authUser = userRes.data.user;
              setUser(optimisticUserFromSession(authUser));
              setProfileLoading(true);
              setLoading(false);
              if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
              try {
                const profile = await fetchProfileSafe(authUser);
                setUser(profile);
              } finally {
                setProfileLoading(false);
              }
              devLog('✅ Session restored via getUser fallback');
              return;
            }
          } catch (fallbackErr) {
            devWarn('⚠️ getUser fallback failed:', fallbackErr);
          }
        }

        if (error) {
          devWarn('⚠️ Session fetch error (non-critical):', error.message);
          // Do not force logout immediately on refresh. Continue and let auth listener update state.
        }

        if (session?.user) {
          const authUser = session.user;
          setUser(optimisticUserFromSession(authUser));
          setProfileLoading(true);
          setLoading(false);
          if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
          try {
            const profile = await fetchProfileSafe(authUser);
            setUser(profile);
            devLog('✅ Session restored on page load - user stays on current page');
          } finally {
            setProfileLoading(false);
          }
        } else {
          devLog('ℹ️ No active session found');
        }
      } catch (err) {
        console.error('❌ Auth init error:', err);
        // Don't block the app - set loading to false so user can see what's happening
      } finally {
        // Always clear timeout and set loading to false
        if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
        setLoading(false);
      }
    };

    // Start initialization
    initializeAuth();

    // Setup auth state change listener
    // This handles login/logout events AFTER initial load
    if (isMockMode) {
      return () => {
        if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      };
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      devLog(`🔔 Auth Event: ${event}`);

      // Only process events AFTER initial load is complete
      // This prevents duplicate session restoration on page load
      if (isInitialized.current) {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          if (session?.user) {
            const authUser = session.user;
            setUser(optimisticUserFromSession(authUser));
            setProfileLoading(true);
            setLoading(false);
            try {
              const profile = await fetchProfileSafe(authUser);
              setUser(profile);
            } finally {
              setProfileLoading(false);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfileLoading(false);
          setLoading(false);
        }
      }
    });

    // Cleanup function
    return () => {
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      subscription.unsubscribe();
    };
  }, [fetchProfileSafe]);

  /**
   * Login function
   * Authenticates user with email and password
   * Updates user state on success
   * Does NOT redirect - that's handled by LoginPage component
   */
  const login = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    devLog('🔐 Login attempt for:', normalizedEmail);

    if (isMockMode) {
      console.error('❌ Cannot login - Supabase not configured');
      throw new Error(
        'Το σύστημα authentication δεν είναι ρυθμισμένο. Παρακαλώ προσθέστε Supabase credentials στο .env file.'
      );
    }

    try {
      // Attempt login with timeout
      const loginPromise = supabase.auth.signInWithPassword({ email: normalizedEmail, password });
      const { data, error } = await withTimeout(loginPromise, 10000);

      if (error) {
        console.error('❌ Login error:', error);
        throw error;
      }

      devLog('✅ Login successful');

      if (data.user) {
        // Fetch user profile and update state
        const profile = await fetchProfileSafe(data.user);
        setUser(profile);

        // Small delay to ensure state update propagates
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Note: Redirect is handled by LoginPage component
        // This allows the user to stay on their intended page after login
        devLog('✅ Login successful, user state updated');
      }
    } catch (error: any) {
      console.error('❌ Login failed:', error);

      // Provide user-friendly error messages
      if (error.message === 'Request timeout') {
        throw new Error('Η σύνδεση με το server κράτησε πολύ. Ελέγξτε τη σύνδεσή σας.');
      }

      throw error;
    }
  };

  /**
   * Signup function
   * Creates new user account with email and password
   * Also creates profile entry in database (handled by database trigger)
   *
   * IMPORTANT: Supabase requires email confirmation by default
   * User will receive confirmation email after signup
   */
  const signup = async (email: string, password: string, username: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();
    devLog('📝 Signup attempt for:', normalizedEmail);

    if (isMockMode) {
      throw new Error('Το σύστημα authentication δεν είναι ρυθμισμένο.');
    }

    try {
      // Create user account
      // The username is stored in user_metadata
      // A database trigger should create the profile entry automatically
      const signupPromise = supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: { username: normalizedUsername },
          // Optional: You can disable email confirmation for testing
          // emailRedirectTo: `${window.location.origin}/login`
        },
      });

      const { data, error } = await withTimeout(signupPromise, 10000);

      if (error) {
        console.error('❌ Signup error:', error);
        throw error;
      }

      // If profile creation is needed manually (if trigger doesn't exist)
      // This would be done here, but typically handled by database trigger
      if (data.user) {
        try {
          // Try to create profile if it doesn't exist
          // This is a fallback if database trigger is not set up
          const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            username: normalizedUsername,
            email: normalizedEmail,
            role: 'user',
          });

          if (profileError) {
            // If profile already exists or other error, log but don't fail signup
            devWarn('⚠️ Profile creation warning:', profileError.message);
          }
        } catch (profileErr) {
          // Profile creation is optional - signup can still succeed
          devWarn('⚠️ Profile creation failed (non-critical):', profileErr);
        }
      }

      devLog('✅ Signup successful');
    } catch (error: any) {
      console.error('❌ Signup failed:', error);

      // Provide user-friendly error messages
      if (error.message === 'Request timeout') {
        throw new Error('Η εγγραφή κράτησε πολύ. Δοκιμάστε ξανά.');
      }

      throw error;
    }
  };

  /**
   * Logout function
   * Signs out user and clears session
   * Note: Redirect is handled by the component calling logout
   * This keeps navigation logic out of the context
   */
  const logout = async () => {
    devLog('👋 Logging out...');

    if (!isMockMode) {
      try {
        await withTimeout(supabase.auth.signOut(), 5000);
      } catch (e) {
        console.error('Logout error:', e);
      }
    }

    // Clear user state
    setUser(null);
    setProfileLoading(false);

    // Note: Navigation is handled by the component that calls logout
    // This keeps the context focused on auth state management
  };

  const refreshUserProfile = async () => {
    if (isMockMode || !user) return;
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (!authUser) {
      setUser(null);
      return;
    }
    const profile = await fetchProfileSafe(authUser);
    setUser(profile);
  };

  const updateProfileUsername = async (username: string) => {
    if (isMockMode) throw new Error('Το σύστημα authentication δεν είναι ρυθμισμένο.');
    if (!user) throw new Error('Δεν υπάρχει συνδεδεμένος χρήστης.');

    const nextUsername = username.trim();
    if (nextUsername.length < 3)
      throw new Error('Το username πρέπει να έχει τουλάχιστον 3 χαρακτήρες.');

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ username: nextUsername })
      .eq('id', user.id);
    if (profileError) throw profileError;

    const { error: authError } = await supabase.auth.updateUser({
      data: { username: nextUsername },
    });
    if (authError) throw authError;

    setUser((prev) => (prev ? { ...prev, username: nextUsername } : prev));
  };

  const requestPasswordReset = async (email: string) => {
    if (isMockMode) throw new Error('Το σύστημα authentication δεν είναι ρυθμισμένο.');
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) throw new Error('Συμπλήρωσε email.');

    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  const updatePassword = async (newPassword: string) => {
    if (isMockMode) throw new Error('Το σύστημα authentication δεν είναι ρυθμισμένο.');
    const nextPassword = newPassword.trim();
    if (nextPassword.length < 6) {
      throw new Error('Ο νέος κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες.');
    }

    const { error } = await supabase.auth.updateUser({ password: nextPassword });
    if (error) throw error;
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
    profileLoading,
    login,
    signup,
    logout,
    updateProfileUsername,
    requestPasswordReset,
    updatePassword,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
