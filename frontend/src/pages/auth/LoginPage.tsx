import React, { useState, useEffect, useRef } from 'react';
import { LogIn, Mail, Lock, AlertTriangle, UserPlus, ArrowRight } from 'lucide-react';
import { Link, useLocation, useNavigate, Location } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

/**
 * LoginPage Component
 * 
 * Handles user authentication/login.
 * Key features:
 * - Redirects to intended destination after successful login
 * - Preserves location state from ProtectedRoute redirects
 * - Prevents logged-in users from accessing this page
 * - Comprehensive error handling with user-friendly messages
 */

interface LocationState {
  from?: Location;
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  // 1. Ref για την αποφυγή update σε unmounted component
  const isMounted = useRef(true);
  // 2. Ref για το timeout ώστε να είναι προσβάσιμο παντού
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { login, user, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect if already logged in
  // This prevents logged-in users from seeing the login page
  useEffect(() => {
    if (user && !authLoading) {
      const state = location.state as LocationState | null;
      const intendedDestination = state?.from?.pathname || '/profile';
      navigate(intendedDestination, { replace: true });
    }
  }, [user, authLoading, location.state, navigate]);

  // Cleanup effect για το unmount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  /**
   * Handle login form submission
   * Authenticates user and redirects to intended destination
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Clear any existing timeout
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Safety timeout - prevents infinite loading state
    timeoutRef.current = setTimeout(() => {
      if (isMounted.current) {
        setLoading(false);
        setError('Η σύνδεση κράτησε πολύ. Ελέγξτε τη σύνδεσή σας και δοκιμάστε ξανά.');
      }
    }, 15000);

    try {
      console.log('🚀 Attempting login...');
      await login(email, password);
      
      // Clear timeout on success
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      if (isMounted.current) {
        setLoading(false);
        console.log('✅ Login completed');
        
        // Navigate to intended destination (from ProtectedRoute) or default to profile
        // This preserves the user's intended navigation path
        const state = location.state as LocationState | null;
        const intendedDestination = state?.from?.pathname || '/profile';
        
        // Small delay to ensure auth state has propagated
        setTimeout(() => {
          navigate(intendedDestination, { replace: true });
        }, 100);
      }
    } catch (err: any) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      if (isMounted.current) {
        console.error('❌ Login error:', err);
        setLoading(false);

        const message = err?.message || '';

        // Map error messages to user-friendly Greek
        if (message.includes('Invalid login credentials') || message.includes('Invalid')) {
          setError('Λάθος email ή κωδικός πρόσβασης.');
        } else if (message.includes('Email not confirmed')) {
          setError('Παρακαλώ επιβεβαιώστε το email σας πριν συνδεθείτε.');
        } else if (
          message.includes('fetch') ||
          message.includes('network') ||
          message.includes('timeout')
        ) {
          setError('Πρόβλημα σύνδεσης. Ελέγξτε το internet και τα Supabase credentials.');
        } else if (message.includes('authentication') || message.includes('σύστημα')) {
          setError(
            'Το σύστημα authentication δεν είναι ρυθμισμένο. Επικοινωνήστε με τον διαχειριστή.'
          );
        } else {
          setError(message || 'Προέκυψε σφάλμα σύνδεσης. Δοκιμάστε ξανά.');
        }
      }
    }
  };

  return (
    // ... Το υπόλοιπο JSX παραμένει το ίδιο ...
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border-2 border-pink-100 dark:border-gray-700"
      >
        <header className="text-center mb-8">
          <motion.div
            className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <LogIn className="w-8 h-8 text-pink-600" />
          </motion.div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Welcome Back</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Συνδέσου για να δεις την πρόοδο των Quiz σου
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl"
            >
              <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">{error}</p>
                {error.includes('σύστημα') && (
                  <p className="text-xs mt-1 opacity-75">
                    Προσθέστε Supabase credentials στο .env file
                  </p>
                )}
              </div>
            </motion.div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all dark:text-white"
                placeholder="name@example.com"
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
              Κωδικός
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all dark:text-white"
                placeholder="••••••••"
                required
                disabled={loading}
                autoComplete="current-password"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Σύνδεση...
              </>
            ) : (
              <>
                Είσοδος
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Δεν έχεις λογαριασμό;</p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-pink-100 dark:border-gray-600 rounded-xl font-bold text-gray-700 dark:text-white hover:border-pink-500 hover:text-pink-600 transition-all w-full"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Δημιουργία Λογαριασμού
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;