import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, LogIn, LogOut, UserPlus, UserRound } from 'lucide-react';
import { AUTH_STRINGS } from '@/data/authStrings';
import { logout } from '@/lib/auth/mockAuth';
import { useMockUser } from '@/lib/auth/hooks';

const N = AUTH_STRINGS.nav;

const initialOf = (name: string) => name.trim().charAt(0).toUpperCase() || '?';

const Avatar: React.FC<{ name: string }> = ({ name }) => (
  <span
    aria-hidden
    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e06d88] text-sm font-black text-white"
  >
    {initialOf(name)}
  </span>
);

/** Σύνδεση / Εγγραφή ή μενού χρήστη (mock session) για το desktop nav. */
export const AuthNavDesktop: React.FC = () => {
  // TODO: connect real API (αντικατάσταση με useAuth όταν συνδεθεί το backend)
  const user = useMockUser();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!user) {
    return (
      <div className="ml-2 flex items-center gap-1">
        <NavLink
          to="/login"
          title={N.login}
          className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 min-[1680px]:px-3 rounded-xl font-semibold text-sm xl:text-base text-gray-700 dark:text-gray-200 hover:text-coral-accent dark:hover:text-coral-light whitespace-nowrap"
        >
          <LogIn className="h-5 w-5 min-[1680px]:h-4 min-[1680px]:w-4" aria-hidden />
          <span className="sr-only min-[1680px]:not-sr-only">{N.login}</span>
        </NavLink>
        <NavLink
          to="/signup"
          className="inline-flex min-h-11 items-center px-4 rounded-xl bg-coral-accent hover:bg-coral-strong text-white font-bold shadow touch-manipulation transition-colors whitespace-nowrap"
        >
          {N.signup}
        </NavLink>
      </div>
    );
  }

  return (
    <div className="relative ml-2" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${N.userMenu}: ${user.name}`}
        className="inline-flex min-h-11 items-center gap-2 rounded-xl pl-1 pr-2 text-gray-700 dark:text-gray-200 hover:bg-coral-wash dark:hover:bg-[#2d1c48]"
      >
        <Avatar name={user.name} />
        <span className="hidden min-[1680px]:block max-w-[7rem] truncate text-sm font-semibold">
          {user.name}
        </span>
        <ChevronDown className="h-4 w-4" aria-hidden />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#3a2658] rounded-2xl shadow-2xl border border-coral-accent/15 dark:border-white/10 p-3 z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <p className="truncate px-3 pb-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
              {user.email}
            </p>
            <button
              type="button"
              role="menuitem"
              onClick={() => navigate('/account')}
              className="flex w-full min-h-11 items-center gap-3 px-3 py-2 rounded-lg hover:bg-coral-wash dark:hover:bg-[#2d1c48] text-sm font-semibold text-gray-700 dark:text-gray-200 text-left"
            >
              <UserRound className="h-4 w-4" aria-hidden />
              {N.account}
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                void logout();
              }}
              className="flex w-full min-h-11 items-center gap-3 px-3 py-2 rounded-lg hover:bg-coral-wash dark:hover:bg-[#2d1c48] text-sm font-semibold text-gray-700 dark:text-gray-200 text-left"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              {N.logout}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const mobileItemClass =
  'w-full flex min-h-11 items-center gap-3 py-3.5 px-4 rounded-xl font-bold touch-manipulation text-gray-700 dark:text-gray-200 hover:bg-coral-wash dark:hover:bg-[#2d1c48]';

/** Ενότητα λογαριασμού για το mobile drawer. */
export const AuthNavMobile: React.FC<{ onNavigate: () => void }> = ({ onNavigate }) => {
  // TODO: connect real API
  const user = useMockUser();

  return (
    <>
      <p className="px-4 pt-4 pb-1 text-[11px] font-black uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {N.sectionTitle}
      </p>
      {user ? (
        <>
          <NavLink to="/account" onClick={onNavigate} className={mobileItemClass}>
            <Avatar name={user.name} />
            <span className="min-w-0 truncate leading-tight">{N.account}</span>
          </NavLink>
          <button
            type="button"
            onClick={() => {
              void logout();
              onNavigate();
            }}
            className={mobileItemClass}
          >
            <LogOut className="h-5 w-5 shrink-0" aria-hidden />
            {N.logout}
          </button>
        </>
      ) : (
        <>
          <NavLink to="/login" onClick={onNavigate} className={mobileItemClass}>
            <LogIn className="h-5 w-5 shrink-0" aria-hidden />
            {N.login}
          </NavLink>
          <NavLink
            to="/signup"
            onClick={onNavigate}
            className="w-full flex min-h-11 items-center gap-3 py-3.5 px-4 rounded-xl text-white bg-coral-accent hover:bg-coral-strong font-bold shadow touch-manipulation"
          >
            <UserPlus className="h-5 w-5 shrink-0" aria-hidden />
            {N.signup}
          </NavLink>
        </>
      )}
    </>
  );
};
