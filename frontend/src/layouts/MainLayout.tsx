import React, { Suspense, lazy, useState, useMemo, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Home,
  Trophy,
  Brain,
  Code,
  FileText,
  Menu,
  X,
  Compass,
  // ShoppingBag,
  LucideIcon,
  User,
  ChevronDown,
  School2Icon,
  Timer,
  Globe,
  Sun,
  Moon,
  Map,
  Heart,
  Laugh,
  Wind,
  Instagram,
  Linkedin,
  Youtube,
  Music2,
  Megaphone,
  BookOpen,
  ClipboardList,
} from 'lucide-react';
import { toggleTheme, getPreferredTheme } from '@/utils/theme';
import { prefetchCriticalPrivateRoutes, shouldShowChatWidgetOnPath } from '@/routes/routes';
import CookieConsent from '@/components/other/CookieConsent';
const ChatWidget = lazy(() => import('@/components/ai/ChatWidget'));

// --- Constants & Animations ---

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

// --- Interfaces ---
interface NavButtonProps {
  to: string;
  children: React.ReactNode;
}

interface MobileNavButtonProps {
  to: string;
  children: React.ReactNode;
  icon: LucideIcon;
  onClick: () => void;
  /** Παράκαμψη isActive (π.χ. `/methodologies?t=...`). */
  isActiveOverride?: boolean;
}

interface MainLayoutProps {
  children?: React.ReactNode;
}

// --- Components ---

const PrepMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const LinkItem: React.FC<{
    to: string;
    label: string;
    icon: LucideIcon;
    onPrefetch?: () => void;
  }> = ({ to, label, icon: Icon, onPrefetch }) => (
    <button
      type="button"
      onClick={() => navigate(to)}
      onMouseEnter={() => onPrefetch?.()}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-coral-wash dark:hover:bg-gray-800 text-sm text-gray-700 dark:text-gray-200"
    >
      <Icon className="w-4 h-4 text-coral-accent" />
      <span className="font-semibold">{label}</span>
    </button>
  );

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="py-2 px-3 rounded-xl font-semibold text-sm xl:text-base text-gray-700 dark:text-gray-200 hover:text-coral-accent dark:hover:text-coral-light inline-flex items-center gap-1">
        Μάθηση
        <ChevronDown className="w-4 h-4" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 mt-2 w-[min(560px,calc(100vw-1.5rem))] max-w-[calc(100vw-1.5rem)] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-coral-accent/15 dark:border-gray-800 p-3 z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="grid grid-cols-2 gap-1">
              <LinkItem to="/quiz" label="Quiz" icon={Trophy} />
              <LinkItem to="/flashcards" label="Flashcards" icon={Brain} />
              <LinkItem to="/methodologies" label="Μεθοδολογίες" icon={BookOpen} />
              <LinkItem to="/askiseis" label="Ασκήσεις" icon={ClipboardList} />
              <LinkItem to="/sxoles" label="Σχολές" icon={School2Icon} />
              <LinkItem to="/paliathemata" label="Παλιά Θέματα" icon={FileText} />
              <LinkItem to="/gloglossa" label="GloGlossa" icon={Globe} />
              <LinkItem to="/progress-tracker" label="Progress Tracker" icon={Map} />
              <LinkItem to="/study-timer" label="Study Timer" icon={Timer} />
              <LinkItem to="/prosanatolismos" label="Προσανατολισμός" icon={Compass} />
              <LinkItem to="/algorithms" label="Αλγόριθμοι" icon={Code} />
              {/* <LinkItem to="/online" label="Online Μαθήματα" icon={GraduationCap} /> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavButton: React.FC<NavButtonProps> = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `relative py-2 px-3 rounded-xl font-semibold text-sm xl:text-base transition-all duration-200 whitespace-nowrap ${
        isActive
          ? 'text-white'
          : 'text-gray-700 dark:text-gray-200 hover:text-coral-accent dark:hover:text-coral-light'
      }`
    }
  >
    {({ isActive }) => (
      <>
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-xl bg-coral-accent"
            layoutId="activeNav"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
        <span className="relative z-10">{children}</span>
      </>
    )}
  </NavLink>
);

const MobileNavButton: React.FC<MobileNavButtonProps> = ({
  to,
  children,
  icon: Icon,
  onClick,
  isActiveOverride,
}) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) => {
      const active = isActiveOverride !== undefined ? isActiveOverride : isActive;
      return `relative block w-full text-left min-h-11 py-3.5 px-4 rounded-xl transition-all touch-manipulation border border-transparent ${
        active
          ? 'border-coral-accent/25 shadow-sm'
          : 'text-gray-700 dark:text-gray-200 hover:bg-rose-50/90 dark:hover:bg-gray-800/90'
      }`;
    }}
  >
    {({ isActive }) => {
      const active = isActiveOverride !== undefined ? isActiveOverride : isActive;
      return (
        <>
          {active && (
            <motion.div
              className="absolute inset-0 rounded-xl bg-rose-50 dark:bg-[rgba(255,107,122,0.14)] border border-coral-accent/20"
              layoutId="mobileActiveNav"
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            />
          )}
          <div className="flex items-center gap-3 relative z-10">
            <Icon
              className={`w-5 h-5 shrink-0 ${active ? 'text-coral-accent dark:text-coral-light' : 'text-gray-500 dark:text-gray-400'}`}
            />
            <span className={`font-semibold ${active ? 'text-slate-800 dark:text-gray-50' : ''}`}>{children}</span>
          </div>
        </>
      );
    }}
  </NavLink>
);

// --- Main Layout Component ---

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const chatPathAllowed = shouldShowChatWidgetOnPath(location.pathname);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() => getPreferredTheme() === 'dark');
  const [shouldLoadChat, setShouldLoadChat] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);
  const lastScrollYRef = React.useRef(0);
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const closeMenu = () => setIsMenuOpen(false);

  // Global Panic Button (top-left)
  const [showPanic, setShowPanic] = useState(false);
  const [panicMsg, setPanicMsg] = useState<{ type: 'tip' | 'joke' | 'breath'; text: string }>({
    type: 'tip',
    text: '',
  });
  const panicMessages: Array<{ type: 'tip' | 'joke' | 'breath'; text: string }> = [
    { type: 'tip', text: 'Δεν χρειάζεται να είμαι τέλειος — αρκεί να προσπαθώ.' },
    { type: 'tip', text: 'Κάθε μέρα που διαβάζω, έρχομαι πιο κοντά στον στόχο μου.' },
    { type: 'tip', text: 'Το άγχος είναι προσωρινό, οι προσπάθειές μου μένουν.' },
    { type: 'tip', text: 'Μπορώ να τα καταφέρω — το έχω ξανακάνει σε δύσκολα.' },
    { type: 'tip', text: 'Ένα βήμα τη φορά είναι αρκετό.' },
    { type: 'tip', text: 'Δεν με καθορίζει ένα διαγώνισμα ή μια εξέταση.' },
    { type: 'tip', text: 'Αξίζω, ανεξάρτητα από τους βαθμούς μου.' },
    { type: 'tip', text: 'Η πρόοδος είναι πιο σημαντική από την τελειότητα.' },
    { type: 'tip', text: 'Αν κουραστώ, κάνω διάλειμμα — δεν τα παρατάω.' },
    { type: 'tip', text: 'Το μέλλον μου δεν κρίνεται μόνο από αυτή τη στιγμή.' },
  ];
  const triggerPanic = () => {
    const pick = panicMessages[Math.floor(Math.random() * panicMessages.length)];
    setPanicMsg(pick);
    setShowPanic(true);
  };

  // Prefetch heavy routes after idle.
  useEffect(() => {
    const run = () => prefetchCriticalPrivateRoutes();
    if (typeof window.requestIdleCallback === 'function') {
      const idleId = window.requestIdleCallback(run, { timeout: 8000 });
      return () => window.cancelIdleCallback(idleId);
    }
    const t = window.setTimeout(run, 3000);
    return () => clearTimeout(t);
  }, []);

  // Defer ChatWidget loading — μόνο σε δημόσιες αρχικές σελίδες (όχι quiz / flashcards / κ.λπ.).
  useEffect(() => {
    if (!chatPathAllowed) return;

    const idle = (window as any).requestIdleCallback as
      | ((cb: () => void, opts?: { timeout: number }) => number)
      | undefined;
    let timeoutId: number | undefined;
    let idleId: number | undefined;

    if (idle) {
      idleId = idle(() => setShouldLoadChat(true), { timeout: 1500 });
    } else {
      timeoutId = window.setTimeout(() => setShouldLoadChat(true), 900);
    }

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      if (idleId && (window as any).cancelIdleCallback) {
        (window as any).cancelIdleCallback(idleId);
      }
    };
  }, [chatPathAllowed]);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const prevY = lastScrollYRef.current;
      const atTop = currentY <= 8;
      const scrollingUp = currentY < prevY;
      setShowNavbar(atTop || scrollingUp);
      lastScrollYRef.current = currentY;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-coral-wash dark:bg-gradient-to-br dark:from-[#0b1020] dark:via-[#141b34] dark:to-[#0b1020] text-gray-900 dark:text-gray-100 flex flex-col">
      {shouldLoadChat && chatPathAllowed && (
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      )}
      {/* Navbar Container */}
      <motion.div
        initial={false}
        animate={{
          y: showNavbar ? 0 : -96,
          opacity: showNavbar ? 1 : 0,
          pointerEvents: showNavbar ? 'auto' : 'none',
        }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="bg-white/55 dark:bg-[#0f152a]/75 backdrop-blur-md fixed top-0 left-0 right-0 z-30 border-b border-coral-accent/15 dark:border-white/10 pt-[env(safe-area-inset-top,0px)]"
      >
        <div className="container mx-auto px-3 sm:px-6 max-w-[100vw]">
          <div className="flex justify-between items-center gap-2 py-3 sm:py-4 min-h-[3.25rem]">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <NavLink to="/" className="flex items-center gap-3 group shrink-0">
                <motion.img
                  src="/images/logo.png"
                  alt="Technotesgr"
                  width={40}
                  height={40}
                  decoding="async"
                  fetchPriority="high"
                  className="w-10 h-10 object-contain bg-transparent p-0 m-0"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                />
                <span className="font-bold text-gray-800 dark:text-white hidden sm:block">
                  technotesgr
                </span>
              </NavLink>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2 flex-wrap justify-end">
              {/* Panic Button moved right and enlarged */}
              <button
                type="button"
                onClick={triggerPanic}
                className="mr-2 px-6 py-3 rounded-full bg-coral-accent hover:bg-coral-strong text-white font-black shadow-lg hover:shadow-xl touch-manipulation min-h-11 transition-colors"
                title="Panic Button"
                aria-label="Panic Button"
              >
                Panic Button
              </button>
              <NavButton to="/">Αρχική</NavButton>
              <NavButton to="/about">Σχετικά με εμένα</NavButton>
              <NavButton to="/announcements">Ανακοινώσεις</NavButton>
              {/* GloGlossa moved into private "Μάθηση" menu */}
              {/* <NavButton to="/merch">Η Ατζέντα</NavButton> */}
              <button
                type="button"
                aria-label="Theme toggle"
                onClick={() => setIsDark(toggleTheme() === 'dark')}
                className="ml-2 min-h-11 min-w-11 p-2 rounded-xl border border-coral-accent/35 text-coral-accent hover:bg-coral-wash transition-colors touch-manipulation inline-flex items-center justify-center"
                title={isDark ? 'Φωτεινό θέμα' : 'Σκοτεινό θέμα'}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2"></div>

              <PrepMenu />
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              type="button"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={isMenuOpen ? 'Κλείσιμο μενού' : 'Άνοιγμα μενού'}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden min-h-11 min-w-11 p-3 rounded-xl text-white bg-coral-accent hover:bg-coral-strong shadow-lg shrink-0 touch-manipulation inline-flex items-center justify-center transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Global Panic Modal */}
      <AnimatePresence>
        {showPanic && (
          <motion.div
            className="fixed inset-0 z-[95] flex items-center justify-center p-3 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowPanic(false)} />
            <motion.div
              className="relative max-w-md w-full max-h-[min(90dvh,32rem)] overflow-y-auto overscroll-contain rounded-3xl bg-white dark:bg-gray-900 border-2 border-coral-accent/40 p-5 sm:p-6 shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 240, damping: 20 }}
            >
              <div className="flex items-center gap-3 mb-3">
                {panicMsg.type === 'tip' && <Heart className="w-5 h-5 text-coral-accent" />}
                {panicMsg.type === 'joke' && <Laugh className="w-5 h-5 text-coral-strong" />}
                {panicMsg.type === 'breath' && <Wind className="w-5 h-5 text-fuchsia-600" />}
                <h3 className="text-xl font-black text-gray-900 dark:text-white">Take a breath</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{panicMsg.text}</p>
              <div className="mt-5 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={triggerPanic}
                  className="min-h-11 px-4 py-3 rounded-xl bg-coral-accent hover:bg-coral-strong text-white font-bold touch-manipulation transition-colors"
                >
                  Άλλο ένα
                </button>
                <button
                  type="button"
                  onClick={() => setShowPanic(false)}
                  className="min-h-11 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold touch-manipulation"
                >
                  Κλείσιμο
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[85]"
              onClick={closeMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Κύριο μενού"
              className="lg:hidden fixed top-0 right-0 h-[100dvh] max-h-[100dvh] w-[min(100vw-2.5rem,20rem)] max-w-sm bg-white dark:bg-gray-900 z-[90] shadow-2xl overflow-y-auto overscroll-contain pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] border-l-[3px] border-blue-500/85 dark:border-blue-400/70"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg sm:text-xl font-black text-coral-accent dark:text-coral-light">Μενού</span>
                  <button
                    type="button"
                    onClick={closeMenu}
                    className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-xl text-gray-600 dark:text-gray-300 hover:bg-coral-wash dark:hover:bg-gray-800 touch-manipulation"
                    aria-label="Κλείσιμο μενού"
                  >
                    <X className="w-6 h-6" aria-hidden />
                  </button>
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      triggerPanic();
                      closeMenu();
                    }}
                    className="w-full flex items-center gap-3 py-4 px-4 rounded-xl text-coral-strong dark:text-coral-light bg-coral-wash dark:bg-coral-accent/15 font-bold border border-coral-accent/30 dark:border-coral-accent/35 touch-manipulation min-h-11"
                  >
                    <Heart size={20} aria-hidden /> Take a breath
                  </button>

                  <MobileNavButton to="/" icon={Home} onClick={closeMenu}>
                    Αρχική
                  </MobileNavButton>
                  <MobileNavButton to="/about" icon={User} onClick={closeMenu}>
                    Σχετικά με εμένα
                  </MobileNavButton>
                  <MobileNavButton to="/announcements" icon={Megaphone} onClick={closeMenu}>
                    Ανακοινώσεις
                  </MobileNavButton>
                  {/* <MobileNavButton to="/merch" icon={ShoppingBag} onClick={closeMenu}>
                    Ατζέντα
                  </MobileNavButton> */}
                  <div className="border-t border-coral-accent/15 dark:border-gray-800 my-2" />

                  <MobileNavButton to="/quiz" icon={Trophy} onClick={closeMenu}>
                    Quiz
                  </MobileNavButton>
                  <MobileNavButton to="/flashcards" icon={Brain} onClick={closeMenu}>
                    Flashcards
                  </MobileNavButton>
                  <MobileNavButton
                    to="/methodologies"
                    icon={BookOpen}
                    onClick={closeMenu}
                    isActiveOverride={location.pathname === '/methodologies'}
                  >
                    Μεθοδολογίες
                  </MobileNavButton>
                  <MobileNavButton to="/askiseis" icon={ClipboardList} onClick={closeMenu}>
                    Ασκήσεις
                  </MobileNavButton>
                  <MobileNavButton to="/sxoles" icon={School2Icon} onClick={closeMenu}>
                    Σχολές
                  </MobileNavButton>
                  <MobileNavButton to="/paliathemata" icon={FileText} onClick={closeMenu}>
                    Παλιά Θέματα
                  </MobileNavButton>
                  <div className="border-t border-coral-accent/15 dark:border-gray-800 my-2" />
                  <MobileNavButton to="/progress-tracker" icon={Map} onClick={closeMenu}>
                    Tracker ύλης
                  </MobileNavButton>
                  <MobileNavButton to="/gloglossa" icon={Globe} onClick={closeMenu}>
                    GloGlossa
                  </MobileNavButton>
                  <MobileNavButton to="/study-timer" icon={Timer} onClick={closeMenu}>
                    Study Timer
                  </MobileNavButton>
                  <MobileNavButton to="/prosanatolismos" icon={Compass} onClick={closeMenu}>
                    Προσανατολισμός
                  </MobileNavButton>
                  {/* <MobileNavButton to="/online" icon={GraduationCap} onClick={closeMenu}>
                    Online Μαθήματα
                  </MobileNavButton> */}
                  <MobileNavButton to="/algorithms" icon={Code} onClick={closeMenu}>
                    Algorithms
                  </MobileNavButton>

                  <div className="border-t border-coral-accent/15 dark:border-gray-800 my-2" />
                  <div className="flex items-center justify-between px-4 py-2">
                    <span className="text-sm font-semibold">Θέμα</span>
                    <button
                      type="button"
                      aria-label="Theme toggle"
                      onClick={() => setIsDark(toggleTheme() === 'dark')}
                      className="min-h-11 min-w-11 p-2 rounded-lg border border-coral-accent/35 text-coral-accent touch-manipulation inline-flex items-center justify-center"
                    >
                      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow relative z-10 pb-[env(safe-area-inset-bottom,0px)] pt-20">{children}</main>

      {/* Footer */}
      <footer className="relative overflow-hidden mt-12 -mt-px bg-transparent">
        {/* Light: απαλό κοραλί */}
        <div
          className="pointer-events-none absolute inset-0 dark:hidden"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255, 143, 142, 0.14) 35%, rgba(255, 107, 122, 0.2) 65%, rgba(255, 176, 164, 0.28) 100%)',
          }}
        />
        {/* Dark */}
        <div
          className="pointer-events-none absolute inset-0 hidden dark:block"
          style={{
            background:
              'linear-gradient(180deg, rgba(17,24,39,0.55) 0%, rgba(30,41,59,0.72) 45%, rgba(17,24,39,0.88) 100%)',
          }}
        />

        <div className="relative container mx-auto px-4 sm:px-6 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 items-start w-full max-w-[100vw]">
          <motion.div
            {...fadeIn}
            className="text-center md:text-left md:border-r md:border-coral-accent/25 md:pr-6 dark:md:border-gray-700"
          >
            <h3 className="text-lg font-extrabold text-coral-accent dark:text-coral-light mb-3">Νομικά</h3>
            <div className="flex flex-col gap-2 text-gray-700 dark:text-gray-200 text-sm md:items-start md:mx-0 mx-auto max-w-xs md:max-w-none">
              <NavLink to="/privacy-policy" className="hover:text-coral-accent dark:hover:text-coral-light transition-colors">
                Όροι Χρήσης & Πολιτική Απορρήτου
              </NavLink>
              <NavLink to="/data" className="hover:text-coral-accent dark:hover:text-coral-light transition-colors">
                Προστασία Προσωπικών Δεδομένων
              </NavLink>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Τελευταία ενημέρωση: {new Date().toLocaleDateString('el-GR')}
              </span>
            </div>
          </motion.div>

          <motion.div
            {...fadeIn}
            transition={{ delay: 0.15 }}
            className="text-center md:border-r md:border-coral-accent/25 md:px-6 dark:md:border-gray-700 flex flex-col items-center"
          >
            <h3 className="text-lg font-extrabold text-coral-accent dark:text-coral-light mb-3 w-full">Socials</h3>
            <div className="flex flex-col gap-2 text-gray-700 dark:text-gray-200 text-sm items-center">
              <a
                href="https://instagram.com/technotesgr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-coral-accent dark:hover:text-coral-light transition-colors justify-center"
              >
                <Instagram className="w-4 h-4" /> <span>Instagram</span>
              </a>
              <a
                href="https://tiktok.com/@technotesgr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-coral-accent dark:hover:text-coral-light transition-colors justify-center"
              >
                <Music2 className="w-4 h-4" /> <span>TikTok</span>
              </a>
              <a
                href="https://www.linkedin.com/company/technotesgr/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-coral-accent dark:hover:text-coral-light transition-colors justify-center"
              >
                <Linkedin className="w-4 h-4" /> <span>LinkedIn</span>
              </a>
              <a
                href="https://www.youtube.com/@technotesgr-elenizafeiri"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-coral-accent dark:hover:text-coral-light transition-colors justify-center"
              >
                <Youtube className="w-4 h-4" /> <span>YouTube</span>
              </a>
            </div>
          </motion.div>

          <motion.div
            {...fadeIn}
            transition={{ delay: 0.25 }}
            className="text-center md:text-right md:pl-6 flex flex-col items-center md:items-end"
          >
            <h3 className="text-lg font-extrabold text-coral-accent dark:text-coral-light mb-3 w-full md:w-auto">Τοποθεσία</h3>
            <div className="flex flex-col gap-2 text-gray-700 dark:text-gray-200 text-sm items-center md:items-end">
              <div className="inline-flex items-center gap-2 justify-center md:justify-end">
                <span role="img" aria-label="location">
                  📍
                </span>
                <span>Αθήνα, Ελλάδα</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative py-4">
          <div className="container mx-auto px-6 text-center text-xs text-gray-600 dark:text-gray-300">
            <span>All Rights Reserved © technotesgr • {currentYear}</span>
          </div>
        </div>
      </footer>

      <CookieConsent />
    </div>
  );
};

export default MainLayout;
