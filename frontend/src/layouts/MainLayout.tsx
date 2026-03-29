import React, { Suspense, lazy, useState, useMemo, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Home,
  Trophy,
  Brain,
  Code,
  FileText,
  Menu,
  X,
  GraduationCap,
  LogOut,
  LogIn,
  UserPlus,
  Compass,
  ShoppingBag,
  LucideIcon,
  User,
  ChevronDown,
  Shield,
  School2Icon,
  Timer,
  Globe,
  MessagesSquare,
  Sun,
  Moon,
  Map,
  Heart,
  Laugh,
  Wind,
} from 'lucide-react';
import technotesLogo from '../assets/technotes_logo.png';
import { useAuth } from '@/contexts/AuthContext';
import { toggleTheme, getPreferredTheme } from '@/utils/theme';
import { flushPendingQuizSubmissions } from '@/utils/quizSubmissionSync';
const ChatWidget = lazy(() => import('@/components/ai/ChatWidget'));

// --- Constants & Animations ---
const BRAND = '#fda8a9';
const BRAND_DARK = '#f88b8c';

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
}

interface MainLayoutProps {
  children?: React.ReactNode;
}

// --- Components ---

const PrepMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const LinkItem: React.FC<{ to: string; label: string; icon: LucideIcon }> = ({ to, label, icon: Icon }) => (
    <button
      onClick={() => navigate(to)}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-pink-50 dark:hover:bg-gray-800 text-sm text-gray-700 dark:text-gray-200"
    >
      <Icon className="w-4 h-4 text-pink-600" />
      <span className="font-semibold">{label}</span>
    </button>
  );

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="py-2 px-3 rounded-xl font-semibold text-sm xl:text-base text-gray-700 dark:text-gray-200 hover:text-pink-600 dark:hover:text-pink-400 inline-flex items-center gap-1"
      >
        Μάθηση
        <ChevronDown className="w-4 h-4" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 mt-2 w-[560px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-pink-100 dark:border-gray-800 p-3 z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="grid grid-cols-2 gap-1">
              <LinkItem to="/quiz" label="Quiz" icon={Trophy} />
              <LinkItem to="/flashcards" label="Flashcards" icon={Brain} />
              <LinkItem to="/progress-tracker" label="Progress Tracker" icon={Map} />
              <LinkItem to="/study-timer" label="Study Timer" icon={Timer} />
              <LinkItem to="/prosanatolismos" label="Προσανατολισμός" icon={Compass} />
              <LinkItem to="/paliathemata" label="Παλιά Θέματα" icon={FileText} />
              <LinkItem to="/algorithms" label="Αλγόριθμοι" icon={Code} />
              <LinkItem to="/sxoles" label="Σχολές" icon={School2Icon} />
              <LinkItem to="/online" label="Online Μαθήματα" icon={GraduationCap} />
              <LinkItem to="/community" label="Community" icon={MessagesSquare} />
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
          : 'text-gray-700 dark:text-gray-200 hover:text-pink-600 dark:hover:text-pink-400'
      }`
    }
  >
    {({ isActive }) => (
      <>
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})` }}
            layoutId="activeNav"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
        <span className="relative z-10">{children}</span>
      </>
    )}
  </NavLink>
);

const MobileNavButton: React.FC<MobileNavButtonProps> = ({ to, children, icon: Icon, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `relative block w-full text-left py-4 px-4 rounded-xl transition-all ${
        isActive
          ? 'text-white'
          : 'text-gray-700 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-gray-800'
      }`
    }
  >
    {({ isActive }) => (
      <>
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})` }}
            layoutId="mobileActiveNav"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
        <div className="flex items-center gap-3 relative z-10">
          <Icon className="w-5 h-5" />
          <span className="font-semibold">{children}</span>
        </div>
      </>
    )}
  </NavLink>
);

const ProfileDropdown: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const initials = useMemo(() => {
    const name = user?.username || user?.email || 'U';
    return name.charAt(0).toUpperCase();
  }, [user]);

  if (!user) return null;

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-pink-50 dark:hover:bg-gray-800 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="relative w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 flex items-center justify-center text-white font-bold shadow-lg"
          whileHover={{ boxShadow: '0 0 20px rgba(236, 72, 153, 0.6)', scale: 1.1 }}
        >
          {initials}
        </motion.div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
            >
              <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 p-6 text-white">
                <p className="font-bold text-lg truncate">{user.username || 'Χρήστης'}</p>
                <p className="text-sm opacity-80 truncate">{user.email}</p>
              </div>
              <div className="p-2 space-y-1">
                <motion.button
                  onClick={() => {
                    navigate('/profile');
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-pink-50 dark:hover:bg-gray-700 transition-all text-gray-700 dark:text-gray-200"
                  whileHover={{ x: 5 }}
                >
                  <User size={18} className="text-pink-600" />{' '}
                  <span className="font-semibold">Προφίλ</span>
                </motion.button>
                {isAdmin && (
                  <motion.button
                    onClick={() => {
                      navigate('/admin');
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all text-purple-600 dark:text-purple-400"
                    whileHover={{ x: 5 }}
                  >
                    <Shield size={18} /> <span className="font-semibold">Admin Dashboard</span>
                  </motion.button>
                )}
                <motion.button
                  onClick={async () => {
                    await logout();
                    setIsOpen(false);
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-red-600"
                  whileHover={{ x: 5 }}
                >
                  <LogOut size={18} /> <span className="font-semibold">Αποσύνδεση</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};


// --- Main Layout Component ---

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() => getPreferredTheme() === 'dark');
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const navigate = useNavigate();

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

  // Retry pending quiz submissions globally when connection is restored.
  useEffect(() => {
    if (!user) return;

    const sync = () => {
      void flushPendingQuizSubmissions();
    };

    sync();
    window.addEventListener('online', sync);
    const intervalId = window.setInterval(sync, 30000);
    return () => {
      window.removeEventListener('online', sync);
      window.clearInterval(intervalId);
    };
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-gray-900 flex flex-col">
      <Suspense fallback={null}>
        <ChatWidget />
      </Suspense>
      {/* Navbar Container */}
      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md sticky top-0 z-30 border-b border-pink-100 dark:border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <NavLink to="/" className="flex items-center gap-3 group shrink-0">
                <motion.img
                  src={technotesLogo}
                  alt="Technotesgr"
                  className="w-10 h-10 object-contain"
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
                onClick={triggerPanic}
                className="mr-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black shadow-lg hover:shadow-xl"
                title="Panic Button"
                aria-label="Panic Button"
              >
                Panic Button
              </button>
              <NavButton to="/">Αρχική</NavButton>
              <NavButton to="/about">Σχετικά με εμένα</NavButton>
              <NavButton to="/gloglossa">GloGlossa</NavButton>
              <NavButton to="/merch">Η Ατζέντα</NavButton>
              <button
                aria-label="Theme toggle"
                onClick={() => setIsDark(toggleTheme() === 'dark')}
                className="ml-2 p-2 rounded-xl border border-pink-200 text-pink-600 hover:bg-pink-50 transition-colors"
                title={isDark ? 'Φωτεινό θέμα' : 'Σκοτεινό θέμα'}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2"></div>

              {loading ? (
                <div className="flex gap-2 animate-pulse">
                  <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                </div>
              ) : user ? (
                <>
                  <PrepMenu />
                  <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2"></div>
                  <ProfileDropdown />
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <NavButton to="/login">Σύνδεση</NavButton>
                  <NavLink
                    to="/register"
                    className="py-2 px-5 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 transition-all shadow-md"
                  >
                    Εγγραφή
                  </NavLink>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 rounded-xl text-white shadow-lg shrink-0"
              style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})` }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Global Panic Modal */}
      <AnimatePresence>
        {showPanic && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowPanic(false)} />
            <motion.div
              className="relative max-w-md w-full rounded-3xl bg-white dark:bg-gray-900 border-2 border-pink-300 p-6 shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 240, damping: 20 }}
            >
              <div className="flex items-center gap-3 mb-3">
                {panicMsg.type === 'tip' && <Heart className="w-5 h-5 text-pink-600" />}
                {panicMsg.type === 'joke' && <Laugh className="w-5 h-5 text-rose-600" />}
                {panicMsg.type === 'breath' && <Wind className="w-5 h-5 text-fuchsia-600" />}
                <h3 className="text-xl font-black text-gray-900 dark:text-white">Take a breath</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{panicMsg.text}</p>
              <div className="mt-5 flex items-center justify-between">
                <button
                  onClick={triggerPanic}
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold"
                >
                  Άλλο ένα
                </button>
                <button
                  onClick={() => setShowPanic(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold"
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
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={closeMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="lg:hidden fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 z-50 shadow-2xl overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-xl font-black text-pink-600">Μενού</span>
                  <X onClick={closeMenu} className="cursor-pointer" />
                </div>

                {user && (
                  <div className="mb-6 p-4 bg-pink-50 dark:bg-gray-800 rounded-2xl border border-pink-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500">Συνδεδεμένος ως:</p>
                    <p className="font-bold text-gray-900 dark:text-white truncate">
                      {user.username || user.email}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <MobileNavButton to="/" icon={Home} onClick={closeMenu}>
                    Αρχική
                  </MobileNavButton>
                  <div className="flex items-center justify-between px-4 py-2">
                    <span className="text-sm font-semibold">Θέμα</span>
                    <button
                      aria-label="Theme toggle"
                      onClick={() => setIsDark(toggleTheme() === 'dark')}
                      className="p-2 rounded-lg border border-pink-200 text-pink-600"
                    >
                      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                  </div>

                  {user ? (
                    <>
                      <MobileNavButton to="/quiz" icon={Trophy} onClick={closeMenu}>
                        Quiz
                      </MobileNavButton>
                      <MobileNavButton to="/flashcards" icon={Brain} onClick={closeMenu}>
                        Flashcards
                      </MobileNavButton>
                      <MobileNavButton to="/community" icon={MessagesSquare} onClick={closeMenu}>
                        Community
                      </MobileNavButton>
                      <MobileNavButton to="/progress-tracker" icon={Map} onClick={closeMenu}>
                        Progress Tracker
                      </MobileNavButton>
                      <MobileNavButton to="/study-timer" icon={Timer} onClick={closeMenu}>
                        Study Timer
                      </MobileNavButton>
                      <MobileNavButton to="/prosanatolismos" icon={Compass} onClick={closeMenu}>
                        Προσανατολισμός
                      </MobileNavButton>
                      <MobileNavButton to ="/sxoles" icon={School2Icon} onClick={closeMenu} >
                       Σχολές
                      </MobileNavButton>
                      <MobileNavButton to="/online" icon={GraduationCap} onClick={closeMenu}>
                        Online Μαθήματα
                      </MobileNavButton>
                      <MobileNavButton to="/algorithms" icon={Code} onClick={closeMenu}>
                        Algorithms
                      </MobileNavButton>
                      <MobileNavButton to="/paliathemata" icon={FileText} onClick={closeMenu}>
                        Παλιά Θέματα
                      </MobileNavButton>
                      <MobileNavButton to="/profile" icon={User} onClick={closeMenu}>
                        Προφίλ
                      </MobileNavButton>
                      <div className="pt-4 mt-4 border-t border-gray-100">
                        <button
                          onClick={async () => {
                            await logout();
                            closeMenu();
                            navigate('/login');
                          }}
                          className="w-full flex items-center gap-3 py-4 px-4 rounded-xl text-red-600 bg-red-50 font-bold"
                        >
                          <LogOut size={20} /> Έξοδος
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <MobileNavButton to="/login" icon={LogIn} onClick={closeMenu}>
                        Σύνδεση
                      </MobileNavButton>
                      <MobileNavButton to="/register" icon={UserPlus} onClick={closeMenu}>
                        Εγγραφή
                      </MobileNavButton>
                    </>
                  )}
                  <div className="my-2 border-t border-gray-100 dark:border-gray-800" />
                  <MobileNavButton to="/merch" icon={ShoppingBag} onClick={closeMenu}>
                    Ατζέντα
                  </MobileNavButton>
                  <MobileNavButton to="/gloglossa" icon={Globe} onClick={closeMenu}>
                    GloGlossa
                  </MobileNavButton>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow relative z-10">{children}</main>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 border-t border-pink-200 dark:border-gray-700 mt-20">
        <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <motion.div {...fadeIn}>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Σχετικά με εμάς 🎓
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Το <strong className="text-pink-600 dark:text-pink-400">technotesgr</strong> βοηθά
              μαθητές Γ' Λυκείου να προετοιμαστούν αποτελεσματικά για τις Πανελλαδικές στο μάθημα της Πληροφορικής.
            </p>
          </motion.div>

          <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">
              Επικοινωνία
            </h3>
            <div className="space-y-3">
              <a
                href="https://instagram.com/technotesgr"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-600 dark:text-gray-300 hover:text-pink-600 transition-colors"
              >
                Instagram: @technotesgr
              </a>
              <a
                href="https://tiktok.com/@technotesgr"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-600 dark:text-gray-300 hover:text-pink-600 transition-colors"
              >
                TikTok: @technotesgr
              </a>
              <a
                href="https://www.linkedin.com/company/technotesgr/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-600 dark:text-gray-300 hover:text-pink-600 transition-colors"
              >
                LinkedIn: technotesgr
              </a>
              <a
                href="https://www.youtube.com/@technotesgr-elenizafeiri"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-600 dark:text-gray-300 hover:text-pink-600 transition-colors"
              >
                YouTube: technotesgr
              </a>
            </div>
          </motion.div>

          <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">Νομικά</h3>
            <div className="space-y-2">
              <NavLink
                to="/privacy-policy"
                className="block text-gray-600 dark:text-gray-300 hover:text-pink-600"
              >
                Πολιτική Απορρήτου
              </NavLink>
              <NavLink
                to="/data"
                className="block text-gray-600 dark:text-gray-300 hover:text-pink-600"
              >
                Προσωπικά Δεδομένα
              </NavLink>
            </div>
          </motion.div>
        </div>

        <div className="bg-white/40 dark:bg-black/20 py-6 text-center border-t border-pink-100 dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} technotesgr. All rights reserved.
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
            Made with{' '}
            <motion.span
              className="inline-block text-pink-600"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ♡
            </motion.span>{' '}
            by{' '}
            <span className="font-semibold text-pink-600">
              <a
                href="https://github.com/feirw"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                feirw
              </a>
              ,{' '}
              <a
                href="https://github.com/a-reynbaw"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                a-reynbaw
              </a>{' '}
              &{' '}
              <a
                href="https://github.com/mgiannopoulos24"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                mgiannopoulos24
              </a>
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
