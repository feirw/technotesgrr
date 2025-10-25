import React, { useState } from 'react';
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

const BRAND = '#fda8a9';
const BRAND_DARK = '#f88b8c';

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

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-gray-900">
      {/* Navigation */}
      <motion.nav
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b-2 border-pink-200 dark:border-gray-700 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-3 group">
              <motion.div
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})` }}
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <img src={technotesLogo} alt="Technotesgr" className="w-10 h-10 object-contain" />
              </motion.div>
              <span className="text-2xl font-black bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                technotesgr
              </span>
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              <NavButton to="/">Αρχική</NavButton>
              <NavButton to="/online">Online</NavButton>
              <NavButton to="/notes">Σημειώσεις</NavButton>
              <NavButton to="/quiz">Quiz</NavButton>
              <NavButton to="/flashcards">Flashcards</NavButton>
              <NavButton to="/algorithms">Algorithms</NavButton>
              <NavButton to="/paliathemata">Παλιά Θέματα</NavButton>
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
      </motion.nav>

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
                      Σημειώσεις
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

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
