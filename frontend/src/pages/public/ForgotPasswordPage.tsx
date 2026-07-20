import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, AlertCircle, CheckCircle2, Send } from 'lucide-react';
import { getBackendUrl } from '@/utils/backendUrl';
import { apiFetch } from '@/utils/apiClient';
import { PageMenuIcon } from '@/data/menuIcons';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Συμπλήρωσε το email σου.');
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError('Το email δεν είναι έγκυρο.');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await apiFetch<{ message: string }>(
        `${getBackendUrl()}/api/auth/forgot-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
          retries: 0,
        }
      );
      setMessage(data.message);
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
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Ξέχασες τον κωδικό;</h1>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            Στείλε μας το email σου και θα σου στείλουμε οδηγίες επαναφοράς.
          </p>
        </div>

        {message ? (
          <div className="flex items-start gap-2 text-sm text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3.5 py-3 rounded-xl">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="forgot-email" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                <Send className="w-4.5 h-4.5" />
              )}
              Αποστολή οδηγιών
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

export default ForgotPasswordPage;
