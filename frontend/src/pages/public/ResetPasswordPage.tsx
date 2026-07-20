import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { getBackendUrl } from '@/utils/backendUrl';
import { apiFetch } from '@/utils/apiClient';
import { PageMenuIcon } from '@/data/menuIcons';

const MIN_PASSWORD_LENGTH = 8;

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Ο σύνδεσμος επαναφοράς δεν είναι έγκυρος.');
      return;
    }
    if (!password || !confirmPassword) {
      setError('Συμπλήρωσε τον νέο κωδικό και στα δύο πεδία.');
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Ο κωδικός πρέπει να έχει τουλάχιστον ${MIN_PASSWORD_LENGTH} χαρακτήρες.`);
      return;
    }
    if (password !== confirmPassword) {
      setError('Οι κωδικοί δεν ταιριάζουν.');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiFetch(`${getBackendUrl()}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
        retries: 0,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Κάτι πήγε στραβά. Δοκίμασε ξανά.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-[#fff5f8] dark:bg-[#1a1229]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md rounded-3xl border border-[#f07f97]/20 dark:border-white/10 bg-white dark:bg-[#2d1c48] shadow-[0_20px_50px_-12px_rgba(240,127,151,0.25)] p-6 sm:p-8"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <PageMenuIcon
            icon="quiz"
            wrapperClassName="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#fff5f8] dark:bg-[#1a1229] mb-4"
            className="w-9 h-9"
          />
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Νέος κωδικός</h1>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            Όρισε τον νέο κωδικό πρόσβασής σου.
          </p>
        </div>

        {success ? (
          <div className="flex items-start gap-2 text-sm text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3.5 py-3 rounded-xl">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            Ο κωδικός σου άλλαξε επιτυχώς. Μεταφέρεσαι στη σύνδεση...
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="reset-password" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
                Νέος κωδικός
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  id="reset-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Τουλάχιστον 8 χαρακτήρες"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 bg-white dark:bg-[#1a1229] border border-[#f07f97]/25 dark:border-white/15 rounded-2xl focus:ring-2 focus:ring-[#f07f97]/40 focus:border-[#f07f97] outline-none dark:text-white transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Απόκρυψη κωδικού' : 'Εμφάνιση κωδικού'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="reset-confirm" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
                Επιβεβαίωση κωδικού
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  id="reset-confirm"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#1a1229] border border-[#f07f97]/25 dark:border-white/15 rounded-2xl focus:ring-2 focus:ring-[#f07f97]/40 focus:border-[#f07f97] outline-none dark:text-white transition-all shadow-inner"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 px-3.5 py-2.5 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#f07f97] hover:bg-[#e06d88] disabled:opacity-60 text-white font-bold shadow-md transition-colors"
            >
              {isSubmitting ? (
                <span className="w-4.5 h-4.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
              ) : (
                <KeyRound className="w-4.5 h-4.5" />
              )}
              Αλλαγή κωδικού
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <Link to="/login" className="font-bold text-[#f07f97] hover:underline">
            Επιστροφή στη σύνδεση
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
