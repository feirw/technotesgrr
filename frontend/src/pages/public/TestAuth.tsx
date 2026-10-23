import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn, LogOut, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { OptimizedImg } from '@/components/shared/OptimizedImg';

const fieldClass =
  'w-full rounded-xl border-2 border-[#f07f97]/30 dark:border-white/15 bg-white dark:bg-[#2d1c48] px-4 py-3 text-sm font-medium text-gray-900 dark:text-[#faf5ef] outline-none transition-colors placeholder:text-gray-400 focus:border-[#f07f97] focus:ring-2 focus:ring-[#f07f97]/25';

const LoginPage: React.FC = () => {
  const { user, login, register, logout } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const resetMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    resetMessages();
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password, rememberMe);
        setSuccess('Συνδέθηκες επιτυχώς.');
      } else {
        await register(name, email, password);
        setSuccess('Ο λογαριασμός δημιουργήθηκε.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Κάτι πήγε στραβά. Δοκίμασε ξανά.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    resetMessages();
    setIsSubmitting(true);

    try {
      await logout();
      setSuccess('Αποσυνδέθηκες.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Η αποσύνδεση απέτυχε.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ff97b2] dark:bg-[#2d1c48] text-gray-900 dark:text-gray-100 px-4 sm:px-6 py-10 sm:py-14">
      <div className="max-w-md mx-auto">
        <div className="rounded-3xl border-2 border-[#f07f97]/30 dark:border-white/15 bg-white/90 dark:bg-[#3a2658]/90 p-6 sm:p-9 shadow-xl">
          <div className="text-center mb-6">
            <OptimizedImg
              src="/images/logo-80.webp"
              alt="Technotes"
              width={56}
              height={56}
              className="w-14 h-14 mx-auto mb-3 object-contain [image-rendering:pixelated]"
            />
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-[#faf5ef]">
              {user ? 'Ο λογαριασμός σου' : mode === 'login' ? 'Σύνδεση' : 'Εγγραφή'}
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {user
                ? 'Κράτα την πρόοδό σου στα quiz, στα flashcards και στο tracker ύλης.'
                : 'Συνδέσου για να αποθηκεύεται η πρόοδός σου στα quiz, στα flashcards και στο tracker ύλης.'}
            </p>
          </div>

          {user ? (
            <section className="space-y-5">
              <div className="rounded-2xl border border-[#f07f97]/25 dark:border-white/10 bg-[#fff5f8] dark:bg-[#2d1c48]/70 p-4 space-y-3">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wider text-[#f07f97] dark:text-[#ff97b2]">
                    Όνομα
                  </p>
                  <p className="text-sm font-bold text-gray-900 dark:text-[#faf5ef]">{user.name || '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wider text-[#f07f97] dark:text-[#ff97b2]">
                    Email
                  </p>
                  <p className="text-sm font-bold text-gray-900 dark:text-[#faf5ef] break-all">{user.email}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => void handleLogout()}
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 min-h-12 rounded-2xl border-2 border-[#f07f97]/40 dark:border-white/20 bg-white dark:bg-[#2d1c48] px-4 py-3 text-sm font-extrabold text-[#e06d88] dark:text-[#ffc4d6] hover:bg-[#fff5f8] dark:hover:bg-white/5 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LogOut className="w-4 h-4 shrink-0" aria-hidden />
                {isSubmitting ? 'Αποσύνδεση…' : 'Αποσύνδεση'}
              </button>
            </section>
          ) : (
            <>
              <div className="mb-6 flex rounded-2xl bg-[#ff97b2]/20 dark:bg-white/10 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    resetMessages();
                  }}
                  className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-extrabold transition-colors ${
                    mode === 'login'
                      ? 'bg-white dark:bg-[#2d1c48] text-[#e06d88] dark:text-[#ffc4d6] shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Σύνδεση
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    resetMessages();
                  }}
                  className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-extrabold transition-colors ${
                    mode === 'register'
                      ? 'bg-white dark:bg-[#2d1c48] text-[#e06d88] dark:text-[#ffc4d6] shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Εγγραφή
                </button>
              </div>

              <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
                {mode === 'register' && (
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-sm font-bold text-gray-800 dark:text-gray-100">
                      Όνομα
                    </label>
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="π.χ. Μαρία"
                      className={fieldClass}
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-bold text-gray-800 dark:text-gray-100">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@email.com"
                    className={fieldClass}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-sm font-bold text-gray-800 dark:text-gray-100">
                    Κωδικός
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={mode === 'register' ? 8 : undefined}
                      placeholder={mode === 'register' ? 'Τουλάχιστον 8 χαρακτήρες' : '••••••••'}
                      className={`${fieldClass} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#f07f97] hover:text-[#e06d88]"
                      aria-label={showPassword ? 'Απόκρυψη κωδικού' : 'Εμφάνιση κωδικού'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {mode === 'login' && (
                  <label className="flex cursor-pointer items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-[#f07f97]/50 text-[#f07f97] accent-[#f07f97]"
                    />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Θυμήσου με</span>
                  </label>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="hero-cta-glow w-full inline-flex items-center justify-center gap-2 min-h-12 rounded-2xl bg-white hover:bg-[#fff5f8] px-4 py-3 text-sm font-extrabold text-[#e06d88] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {mode === 'login' ? (
                    <LogIn className="w-4 h-4 shrink-0" aria-hidden />
                  ) : (
                    <UserPlus className="w-4 h-4 shrink-0" aria-hidden />
                  )}
                  {isSubmitting
                    ? 'Περίμενε…'
                    : mode === 'login'
                      ? 'Σύνδεση'
                      : 'Δημιουργία λογαριασμού'}
                </button>
              </form>
            </>
          )}

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-2xl border-2 border-[#d94f6b]/30 bg-[#d94f6b]/10 px-4 py-3 text-sm font-semibold text-[#d94f6b] dark:text-[#ff97b2]"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="mt-5 rounded-2xl border-2 border-[#f07f97]/30 bg-[#fff5f8] dark:bg-[#2d1c48]/70 px-4 py-3 text-sm font-semibold text-[#e06d88] dark:text-[#ffc4d6]"
            >
              {success}
            </div>
          )}

          {!user && (
            <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
              Με την εγγραφή συμφωνείς με τους{' '}
              <Link
                to="/privacy-policy"
                className="font-bold text-[#f07f97] underline underline-offset-2 hover:text-[#e06d88]"
              >
                Όρους Χρήσης
              </Link>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
