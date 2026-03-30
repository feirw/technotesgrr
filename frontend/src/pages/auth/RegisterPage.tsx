import React, { useState } from 'react';
import { UserPlus, Mail, Lock, User, AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * RegisterPage Component
 *
 * Handles user registration/signup.
 * Key features:
 * - Client-side form validation
 * - Creates user account and profile in database
 * - Shows success screen with email confirmation instructions
 * - Prevents logged-in users from accessing this page
 * - Comprehensive error handling
 */

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const { signup } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(''); // Καθαρισμός σφάλματος κατά την πληκτρολόγηση
  };

  /**
   * Validate form data before submission
   * Returns true if all validations pass, false otherwise
   */
  const validateForm = () => {
    // 1. Email format validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Παρακαλώ εισάγετε μια έγκυρη διεύθυνση email.');
      return false;
    }

    // 2. Password confirmation match
    if (formData.password !== formData.confirmPassword) {
      setError('Οι κωδικοί πρόσβασης δεν ταιριάζουν.');
      return false;
    }

    // 3. Password minimum length (Supabase requirement)
    if (formData.password.length < 6) {
      setError('Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες.');
      return false;
    }

    // 4. Username minimum length
    if (formData.username.trim().length < 3) {
      setError('Το Username πρέπει να έχει τουλάχιστον 3 χαρακτήρες.');
      return false;
    }

    return true;
  };

  /**
   * Handle registration form submission
   * Creates user account and shows success screen
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate form before submission
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Create user account via Supabase Auth
      // Profile creation is handled by AuthContext (or database trigger)
      await signup(formData.email, formData.password, formData.username);
      setSuccess(true);
    } catch (err: any) {
      console.error('Registration error:', err);

      // 5. Βελτιωμένο Error Handling
      const message = err.message || '';

      if (message.includes('User already registered') || message.includes('already exists')) {
        setError('Αυτό το email χρησιμοποιείται ήδη.');
      } else if (message.includes('Password should be')) {
        setError('Ο κωδικός είναι πολύ αδύναμος.');
      } else if (message.includes('fetch') || message.includes('network')) {
        setError('Πρόβλημα σύνδεσης. Ελέγξτε το internet σας.');
      } else if (message.includes('confirmation')) {
        // Ειδική περίπτωση για αποτυχία αποστολής email
        setError(
          'Ο λογαριασμός δημιουργήθηκε, αλλά υπήρξε πρόβλημα με το email επιβεβαίωσης. Επικοινωνήστε με την υποστήριξη.'
        );
      } else {
        setError(err.message || 'Προέκυψε σφάλμα κατά την εγγραφή. Δοκιμάστε ξανά.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border-2 border-green-100 dark:border-green-900 text-center"
        >
          <motion.div
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle className="w-10 h-10 text-green-600" />
          </motion.div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
            Η εγγραφή ολοκληρώθηκε!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Στείλαμε ένα email επιβεβαίωσης στο <strong>{formData.email}</strong>. Παρακαλώ ελέγξτε
            τα εισερχόμενά σας (και τα spam) και κάντε κλικ στο σύνδεσμο για να ενεργοποιήσετε το
            λογαριασμό σας.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-8 py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition-all"
          >
            Επιστροφή στη Σύνδεση
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 py-12">
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
            <UserPlus className="w-8 h-8 text-pink-600" />
          </motion.div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
            Δημιουργία Λογαριασμού
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Ξεκίνα το ταξίδι σου στο 100άρι! 🚀</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl mb-4"
              >
                <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Username Field */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
              Username (Όνομα Χρήστη)
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all dark:text-white"
                placeholder="π.χ. CyberStudent24"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all dark:text-white"
                placeholder="name@example.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
              Κωδικός
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all dark:text-white"
                placeholder="Τουλάχιστον 6 χαρακτήρες"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
              Επιβεβαίωση Κωδικού
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all dark:text-white"
                placeholder="Ξανά τον κωδικό"
                required
                disabled={loading}
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full py-4 mt-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Εγγραφή...
              </>
            ) : (
              <>
                Εγγραφή
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Έχεις ήδη λογαριασμό;</p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-pink-100 dark:border-gray-600 rounded-xl font-bold text-gray-700 dark:text-white hover:border-pink-500 hover:text-pink-600 transition-all w-full"
          >
            Σύνδεση τώρα
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
