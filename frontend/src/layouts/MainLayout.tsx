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
  User,
  ChevronDown,
} from 'lucide-react';
import technotesLogo from '../assets/technotes_logo.png';
import { useAuth } from '@/contexts/AuthContext';

// --- Constants & Animations ---
const BRAND = '#fda8a9';
const BRAND_DARK = '#f88b8c';

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
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
  const { user, logout } = useAuth();
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
                  onClick={() => { navigate('/profile'); setIsOpen(false); }} 
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-pink-50 dark:hover:bg-gray-700 transition-all text-gray-700 dark:text-gray-200"
                  whileHover={{ x: 5 }}
                >
                  <User size={18} className="text-pink-600" /> <span className="font-semibold">Προφίλ</span>
                </motion.button>
                <motion.button 
                  onClick={async () => { await logout(); setIsOpen(false); navigate('/login'); }} 
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
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const navigate = useNavigate();

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-gray-900 flex flex-col">
      
      {/* Navbar Container */}
      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md sticky top-0 z-30 border-b border-pink-100 dark:border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
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

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2 flex-wrap justify-end">
              <NavButton to="/">Αρχική</NavButton>
              <NavButton to="/about">About us</NavButton>
              <NavButton to="/merch">Η Ατζέντα</NavButton>
              
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2"></div>

              {loading ? (
                <div className="flex gap-2 animate-pulse">
                  <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                </div>
              ) : user ? (
                <>
                  <NavButton to="/prosanatolismos">Προσανατολισμός</NavButton>
                  <NavButton to="/online">Online Μαθήματα</NavButton>
                  <NavButton to="/quiz">Quiz</NavButton>
                  <NavButton to="/flashcards">Flashcards</NavButton>
                  <NavButton to="/paliathemata">Παλιά Θέματα</NavButton>
                  <NavButton to="/algorithms">Αλγόριθμοι</NavButton>
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
                  <MobileNavButton to="/" icon={Home} onClick={closeMenu}>Αρχική</MobileNavButton>
                  
                  {user ? (
                    <>
                      <MobileNavButton to="/prosanatolismos" icon={Compass} onClick={closeMenu}>Προσανατολισμός</MobileNavButton>
                      <MobileNavButton to="/online" icon={GraduationCap} onClick={closeMenu}>Online Μαθήματα</MobileNavButton>
                      <MobileNavButton to="/quiz" icon={Trophy} onClick={closeMenu}>Quiz</MobileNavButton>
                      <MobileNavButton to="/flashcards" icon={Brain} onClick={closeMenu}>Flashcards</MobileNavButton>
                      <MobileNavButton to="/algorithms" icon={Code} onClick={closeMenu}>Algorithms</MobileNavButton>
                      <MobileNavButton to="/paliathemata" icon={FileText} onClick={closeMenu}>Παλιά Θέματα</MobileNavButton>
                      <MobileNavButton to="/profile" icon={User} onClick={closeMenu}>Προφίλ</MobileNavButton>
                      <div className="pt-4 mt-4 border-t border-gray-100">
                         <button onClick={async () => { await logout(); closeMenu(); navigate('/login'); }} className="w-full flex items-center gap-3 py-4 px-4 rounded-xl text-red-600 bg-red-50 font-bold">
                          <LogOut size={20} /> Έξοδος
                         </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <MobileNavButton to="/login" icon={LogIn} onClick={closeMenu}>Σύνδεση</MobileNavButton>
                      <MobileNavButton to="/register" icon={UserPlus} onClick={closeMenu}>Εγγραφή</MobileNavButton>
                    </>
                  )}
                  <div className="my-2 border-t border-gray-100 dark:border-gray-800" />
                  <MobileNavButton to="/merch" icon={ShoppingBag} onClick={closeMenu}>Σχολικά είδη</MobileNavButton>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 border-t border-pink-200 dark:border-gray-700 mt-20">
        <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <motion.div {...fadeIn}>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Σχετικά με εμάς 🎓
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Το <strong className="text-pink-600 dark:text-pink-400">technotesgr</strong> βοηθά μαθητές Γ' Λυκείου να προετοιμαστούν αποτελεσματικά για τις Πανελλαδικές Πληροφορικής.
            </p>
          </motion.div>

          <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">Επικοινωνία</h3>
            <div className="space-y-3">
              <a href="https://instagram.com/technotesgr" target="_blank" rel="noopener noreferrer" className="block text-gray-600 dark:text-gray-300 hover:text-pink-600 transition-colors">Instagram: @technotesgr</a>
              <a href="https://tiktok.com/@technotesgr" target="_blank" rel="noopener noreferrer" className="block text-gray-600 dark:text-gray-300 hover:text-pink-600 transition-colors">TikTok: @technotesgr</a>
              <a href="https://www.linkedin.com/company/technotesgr/" target="_blank" rel="noopener noreferrer" className="block text-gray-600 dark:text-gray-300 hover:text-pink-600 transition-colors">LinkedIn: technotesgr</a>
            </div>
          </motion.div>

          <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">Νομικά</h3>
            <div className="space-y-2">
              <NavLink to="/privacy-policy" className="block text-gray-600 dark:text-gray-300 hover:text-pink-600">Πολιτική Απορρήτου</NavLink>
              <NavLink to="/data" className="block text-gray-600 dark:text-gray-300 hover:text-pink-600">Προσωπικά Δεδομένα</NavLink>
            </div>
          </motion.div>
        </div>

        <div className="bg-white/40 dark:bg-black/20 py-6 text-center border-t border-pink-100 dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} technotesgr. All rights reserved.
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
            Made with <motion.span className="inline-block text-pink-600" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }}>♡</motion.span> by{' '}
            <span className="font-semibold text-pink-600">feirw, a-reynbaw & mgiannopoulos24</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;