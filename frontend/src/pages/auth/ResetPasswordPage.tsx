import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { isSupabaseConfigured } from '@/utils/supabaseClient';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isSupabaseConfigured) {
      setError('Το authentication δεν είναι ρυθμισμένο στο deployment.');
      return;
    }
    if (password.length < 6) {
      setError('Ο νέος κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Οι κωδικοί δεν ταιριάζουν.');
      return;
    }

    setLoading(true);
    try {
      await updatePassword(password);
      setSuccess(true);
      setTimeout(() => navigate('/login', { replace: true }), 1200);
    } catch (err: any) {
      const msg = (err?.message || '').toLowerCase();
      if (msg.includes('session') || msg.includes('expired') || msg.includes('token')) {
        setError('Το link επαναφοράς έληξε. Ζήτησε νέο email επαναφοράς.');
      } else {
        setError(err?.message || 'Αποτυχία αλλαγής κωδικού. Δοκίμασε ξανά.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border-2 border-pink-100 dark:border-gray-700"
      >
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Επαναφορά κωδικού</h1>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
          Βάλε νέο κωδικό για τον λογαριασμό σου.
        </p>

        {error && (
          <div className="flex items-start p-3 mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
            <AlertTriangle className="w-4 h-4 mr-2 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-start p-3 mb-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
            <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5" />
            <p className="text-sm">Ο κωδικός άλλαξε επιτυχώς. Μεταφορά στη σύνδεση...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Νέος κωδικός"
              className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none"
              disabled={loading}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Επιβεβαίωση νέου κωδικού"
              className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none"
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold disabled:opacity-70 inline-flex items-center justify-center gap-2"
          >
            {loading ? 'Αποθήκευση...' : 'Αποθήκευση νέου κωδικού'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-5 text-center">
          <Link to="/login" className="text-sm font-semibold text-pink-600 hover:text-pink-700">
            Επιστροφή στη σύνδεση
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
