import React, { useState, useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  BookOpen,
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
} from 'lucide-react';
import technotesLogo from '../assets/technotes_logo.png';
// import ChatWidget from '../components/ChatWidget';
import { useAuth } from '@/contexts/AuthContext';

const BRAND = '#fda8a9';
const BRAND_DARK = '#f88b8c';

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
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
      `block w-full text-left py-4 px-4 rounded-xl transition-all ${
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
            layoutId="activeMobileNav"
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

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, loading } = useAuth(); // Destructure loading here
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const navigate = useNavigate();

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior
    await logout();
    closeMenu();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-gray-900 flex flex-col">
      {/* Navbar Container */}
      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md sticky top-0 z-30 border-b border-pink-100 dark:border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-3 group shrink-0">
              <img
                src={technotesLogo}
                alt="Technotesgr"
                className="w-10 h-10 pink object-contain"
              />
              <span className="font-bold text-gray-800 dark:text-white hidden sm:block">
                technotesgr
              </span>
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2 flex-wrap justify-end">
              {/* --- PUBLIC LINKS (Visible to everyone) --- */}
              <NavButton to="/">Αρχική</NavButton>
              <NavButton to="/about">About Us</NavButton>
              <NavButton to="/merch">Σχολικά είδη</NavButton>
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2"></div> {/* Divider */}
              {/* --- LOADING STATE --- */}
              {loading ? (
                // Skeleton Loader for Navbar while checking Auth
                <div className="flex gap-2 animate-pulse">
                  <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                  <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                </div>
              ) : user ? (
                /* --- LOGGED IN LINKS --- */
                <>
                  <NavButton to="/prosanatolismos">Προσανατολισμός</NavButton>
                  <NavButton to="/online">Online Μαθήματα</NavButton>
                  <NavButton to="/notes">Διαγωνίσματα</NavButton>
                  <NavButton to="/quiz">Quiz</NavButton>
                  <NavButton to="/flashcards">Flashcards</NavButton>
                  <NavButton to="/paliathemata">Παλιά Θέματα</NavButton>
                  <NavButton to="/algorithms">Algorithms</NavButton>
                  <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2"></div> {/* Divider */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 py-2 px-4 rounded-xl font-bold text-pink-600 border-2 border-pink-200 hover:bg-pink-50 transition-all text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Έξοδος
                  </button>
                </>
              ) : (
                /* --- GUEST LINKS --- */
                <>
                  <NavButton to="/login">Σύνδεση</NavButton>
                  <NavLink
                    to="/register"
                    className="py-2 px-4 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 transition-all text-sm shadow-md"
                  >
                    Εγγραφή
                  </NavLink>
                </>
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
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={closeMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Drawer */}
            <motion.div
              className="lg:hidden fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 z-50 shadow-2xl overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})` }}
                    >
                      <img src={technotesLogo} alt="Logo" className="w-8 h-8" />
                    </div>
                    <span className="text-xl font-black bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                      Μενού
                    </span>
                  </div>
                  <motion.button
                    onClick={closeMenu}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

                {/* User Info (Mobile) */}
                {loading ? (
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>
                ) : user ? (
                  <div className="mb-6 p-4 bg-pink-50 dark:bg-gray-800 rounded-2xl border border-pink-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Συνδεδεμένος ως:</p>
                    <p className="font-bold text-gray-900 dark:text-white truncate">
                      {user.username || user.email}
                    </p>
                  </div>
                ) : null}

                {/* Menu Items */}
                <motion.div
                  className="space-y-2"
                  initial="closed"
                  animate="open"
                  variants={{
                    open: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
                    closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
                  }}
                >
                  {/* --- PUBLIC LINKS (Mobile) --- */}
                  <motion.div
                    variants={{ open: { y: 0, opacity: 1 }, closed: { y: 20, opacity: 0 } }}
                  >
                    <MobileNavButton to="/" icon={Home} onClick={closeMenu}>
                      Αρχική
                    </MobileNavButton>
                  </motion.div>

                  {/* --- CONDITIONAL LINKS (Mobile) --- */}
                  {loading ? (
                    // Simple skeleton for mobile links
                    <div className="space-y-4 py-4 opacity-50">
                      <div className="h-10 bg-gray-100 rounded-xl"></div>
                      <div className="h-10 bg-gray-100 rounded-xl"></div>
                      <div className="h-10 bg-gray-100 rounded-xl"></div>
                    </div>
                  ) : user ? (
                    <>
                      <motion.div
                        variants={{ open: { y: 0, opacity: 1 }, closed: { y: 20, opacity: 0 } }}
                      >
                        <MobileNavButton to="/online" icon={GraduationCap} onClick={closeMenu}>
                          Online Μαθήματα
                        </MobileNavButton>
                      </motion.div>
                      <motion.div
                        variants={{ open: { y: 0, opacity: 1 }, closed: { y: 20, opacity: 0 } }}
                      >
                        <MobileNavButton to="/prosanatolismos" icon={Compass} onClick={closeMenu}>
                          Προσανατολισμός
                        </MobileNavButton>
                      </motion.div>
                      <motion.div
                        variants={{ open: { y: 0, opacity: 1 }, closed: { y: 20, opacity: 0 } }}
                      >
                        <MobileNavButton to="/notes" icon={BookOpen} onClick={closeMenu}>
                          Διαγωνίσματα
                        </MobileNavButton>
                      </motion.div>
                      <motion.div
                        variants={{ open: { y: 0, opacity: 1 }, closed: { y: 20, opacity: 0 } }}
                      >
                        <MobileNavButton to="/quiz" icon={Trophy} onClick={closeMenu}>
                          Quiz
                        </MobileNavButton>
                      </motion.div>
                      <motion.div
                        variants={{ open: { y: 0, opacity: 1 }, closed: { y: 20, opacity: 0 } }}
                      >
                        <MobileNavButton to="/flashcards" icon={Brain} onClick={closeMenu}>
                          Flashcards
                        </MobileNavButton>
                      </motion.div>
                      <motion.div
                        variants={{ open: { y: 0, opacity: 1 }, closed: { y: 20, opacity: 0 } }}
                      >
                        <MobileNavButton to="/algorithms" icon={Code} onClick={closeMenu}>
                          Algorithms Games
                        </MobileNavButton>
                      </motion.div>
                      <motion.div
                        variants={{ open: { y: 0, opacity: 1 }, closed: { y: 20, opacity: 0 } }}
                      >
                        <MobileNavButton to="/paliathemata" icon={FileText} onClick={closeMenu}>
                          Παλιά Θέματα
                        </MobileNavButton>
                      </motion.div>
                    </>
                  ) : (
                    /* --- GUEST LINKS (Mobile) --- */
                    <>
                      <motion.div
                        variants={{ open: { y: 0, opacity: 1 }, closed: { y: 20, opacity: 0 } }}
                      >
                        <MobileNavButton to="/login" icon={LogIn} onClick={closeMenu}>
                          Σύνδεση
                        </MobileNavButton>
                      </motion.div>
                      <motion.div
                        variants={{ open: { y: 0, opacity: 1 }, closed: { y: 20, opacity: 0 } }}
                      >
                        <MobileNavButton to="/register" icon={UserPlus} onClick={closeMenu}>
                          Εγγραφή
                        </MobileNavButton>
                      </motion.div>
                    </>
                  )}

                  {/* Always Visible Lower Links */}
                  <motion.div
                    variants={{ open: { y: 0, opacity: 1 }, closed: { y: 20, opacity: 0 } }}
                  >
                    <MobileNavButton to="/merch" icon={ShoppingBag} onClick={closeMenu}>
                      Σχολικά είδη
                    </MobileNavButton>
                  </motion.div>

                  {/* Logout Mobile */}
                  {user && !loading && (
                    <motion.div
                      variants={{ open: { y: 0, opacity: 1 }, closed: { y: 20, opacity: 0 } }}
                      className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700"
                    >
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 py-4 px-4 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition-all font-bold"
                      >
                        <LogOut className="w-5 h-5" />
                        Έξοδος
                      </button>
                    </motion.div>
                  )}
                </motion.div>

                {/* Footer */}
                <motion.div
                  className="mt-8 pt-8 border-t-2 border-pink-200 dark:border-gray-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Made with 💖 by technotesgr
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Chat Widget - Only show if logged in */}
      {/* {user && (
        <ChatWidget
          nickname={user.username || user.email?.split('@')[0] || 'Guest'}
        />
      )} */}

      {/* Footer - THE LOWER PART */}
      <footer className="relative bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 border-t border-pink-200 dark:border-gray-700 mt-20">
        <div className="container mx-auto px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {/* About Section */}
          <motion.div
            {...fadeIn}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Σχετικά με εμάς 🎓
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Το <strong className="text-pink-600 dark:text-pink-400">technotesgr</strong> βοηθά
              μαθητές Γ' Λυκείου να προετοιμαστούν αποτελεσματικά για τις Πανελλαδικές Πληροφορικής.
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div
            {...fadeIn}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">
              Επικοινωνία
            </h3>
            <div className="space-y-3">
              <a
                href="https://www.instagram.com/technotesgr/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-600 dark:text-gray-300 hover:text-pink-600 transition-colors"
              >
                Instagram: @technotesgr
              </a>
              <a
                href="https://www.tiktok.com/@technotesgr"
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
            </div>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            {...fadeIn}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">Νομικά</h3>
            <div className="space-y-2">
              <a
                href="/privacy-policy"
                className="block text-gray-600 dark:text-gray-300 hover:text-pink-600"
              >
                Πολιτική Απορρήτου
              </a>
              <a
                href="/data"
                className="block text-gray-600 dark:text-gray-300 hover:text-pink-600"
              >
                Προσωπικά Δεδομένα
              </a>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <div className="bg-white/40 dark:bg-black/20 py-4 text-center border-t border-pink-100 dark:border-gray-800">
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
            <span className="font-semibold">
              <motion.a
                href="https://github.com/feirw"
                target="_blank"
                className="text-pink-600 dark:text-pink-400 hover:underline transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                feirw
              </motion.a>
              {', '}
              <motion.a
                href="https://github.com/a-reynbaw"
                target="_blank"
                className="text-pink-600 dark:text-pink-400 hover:underline transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                a-reynbaw
              </motion.a>
              {' & '}
              <motion.a
                href="https://github.com/mgiannopoulos24"
                target="_blank"
                className="text-pink-600 dark:text-pink-400 hover:underline transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                mgiannopoulos24
              </motion.a>
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
