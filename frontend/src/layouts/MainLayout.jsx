import React, { useState, useMemo } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
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
} from 'lucide-react';
import technotesLogo from '../assets/technotes_logo.png';
import ChatWidget from '../components/ChatWidget.jsx';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext.jsx';

const BRAND = '#fda8a9';
const BRAND_DARK = '#f88b8c';

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const NavButton = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `relative py-2 px-4 rounded-xl font-semibold transition-all duration-200 ${
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

const MobileNavButton = ({ to, children, icon: Icon, onClick }) => (
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

const MainLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { nickname } = useAppContext();
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-gray-900 flex flex-col">
      
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-3 group">
            
              
                <img src={technotesLogo} alt="Technotesgr" className="w-10 h-10 pink object-contain" />
              
            
                technotesgr
              
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              <NavButton to="/">Αρχική</NavButton>
              <NavButton to="/about">About Us</NavButton>
              {/* <NavButton to ="/login">Σύνδεση</NavButton> */}
              <NavButton to ="/prosanatolismos">Προσανατολισμός</NavButton>
              <NavButton to="/online">Online Μαθήματα</NavButton>
              <NavButton to="/notes">Διαγωνίσματα</NavButton>
              <NavButton to="/quiz">Quiz</NavButton>
              <NavButton to="/flashcards">Flashcards</NavButton>
              <NavButton to="/paliathemata">Παλιά Θέματα</NavButton>
              <NavButton to="/algorithms">Algorithms</NavButton>
              <NavButton to="/merch">Σχολικά είδη</NavButton>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 rounded-xl text-white shadow-lg"
              style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})` }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
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

                {/* Menu Items */}
                <motion.div
                  className="space-y-2"
                  initial="closed"
                  animate="open"
                  variants={{
                    open: {
                      transition: { staggerChildren: 0.07, delayChildren: 0.2 },
                    },
                    closed: {
                      transition: { staggerChildren: 0.05, staggerDirection: -1 },
                    },
                  }}
                >
                  <motion.div
                    variants={{
                      open: { y: 0, opacity: 1 },
                      closed: { y: 20, opacity: 0 },
                    }}
                  >
                    <MobileNavButton to="/" icon={Home} onClick={closeMenu}>
                      Αρχική
                    </MobileNavButton>
                  </motion.div>

                  <motion.div
                    variants={{
                      open: { y: 0, opacity: 1 },
                      closed: { y: 20, opacity: 0 },
                    }}
                  >
                    <MobileNavButton to="/online" icon={GraduationCap} onClick={closeMenu}>
                      Online Μαθήματα
                    </MobileNavButton>
                  </motion.div>

                  <motion.div
                    variants={{
                      open: { y: 0, opacity: 1 },
                      closed: { y: 20, opacity: 0 },
                    }}
                  >
                    <MobileNavButton to="/notes" icon={BookOpen} onClick={closeMenu}>
                      Διαγωνίσματα
                    </MobileNavButton>
                  </motion.div>

                  <motion.div
                    variants={{
                      open: { y: 0, opacity: 1 },
                      closed: { y: 20, opacity: 0 },
                    }}
                  >
                    <MobileNavButton to="/quiz" icon={Trophy} onClick={closeMenu}>
                      Quiz
                    </MobileNavButton>
                  </motion.div>

                  <motion.div
                    variants={{
                      open: { y: 0, opacity: 1 },
                      closed: { y: 20, opacity: 0 },
                    }}
                  >
                    <MobileNavButton to="/flashcards" icon={Brain} onClick={closeMenu}>
                      Flashcards
                    </MobileNavButton>
                  </motion.div>

                  <motion.div
                    variants={{
                      open: { y: 0, opacity: 1 },
                      closed: { y: 20, opacity: 0 },
                    }}
                  >
                    <MobileNavButton to="/algorithms" icon={Code} onClick={closeMenu}>
                      Algorithms Games
                    </MobileNavButton>
                  </motion.div>

                  <motion.div
                    variants={{
                      open: { y: 0, opacity: 1 },
                      closed: { y: 20, opacity: 0 },
                    }}
                  >
                    <MobileNavButton to="/paliathemata" icon={FileText} onClick={closeMenu}>
                      Παλιά Θέματα
                    </MobileNavButton>
                  </motion.div>
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

      {/* Main Content - grows to fill available space */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Chat Widget - now accessible on all pages */}
      <ChatWidget nickname={nickname} />

      {/* Enhanced Footer */}
      <footer className="relative bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 border-t border-pink-200 dark:border-gray-700 mt-20">
        <div className="container mx-auto px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {/* --- Σχετικά με εμάς --- */}
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
              μαθητές Γ' Λυκείου να προετοιμαστούν αποτελεσματικά για τις Πανελλαδικές Πληροφορικής
              — σημειώσεις, quiz & διαδραστικά εργαλεία.
            </p>
          </motion.div>

          {/* --- Επικοινωνία --- */}
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
              {[
                {
                  href: 'https://www.instagram.com/technotesgr/',
                  label: 'Instagram: @technotesgr',
                },
                { href: 'https://www.tiktok.com/@technotesgr', label: 'TikTok: @technotesgr' },
                {
                  href: 'https://www.linkedin.com/company/technotesgr/',
                  label: 'LinkedIn: technotesgr',
                },
              ].map((social) => (
                <motion.a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 font-medium transition-transform duration-200"
                  whileHover={{ x: 6, scale: 1.05 }}
                >
                  {social.label}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* --- Όροι και Δεδομένα --- */}
          <motion.div
            {...fadeIn}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">
              Όροι και Δεδομένα
            </h3>
            <div className="space-y-2">
              {[
                { href: '/privacy-policy', label: 'Όροι Χρήσης & Πολιτική Απορρήτου' },
                { href: '/data', label: 'Προσωπικά Δεδομένα' },
              ].map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 font-medium transition-transform duration-200"
                  whileHover={{ scale: 1.05 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* --- Κάτω μέρος --- */}
        <div className="bg-gradient-to-r from-pink-100/40 to-rose-100/40 dark:from-gray-800/40 dark:to-purple-900/30 backdrop-blur border-t border-pink-200 dark:border-gray-700 py-6">
          <div className="container mx-auto px-6 text-center">
            <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
              © {currentYear} technotesgr. All rights reserved.
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
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
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
