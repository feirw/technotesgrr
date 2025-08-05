import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import technotesLogo from '../assets/technotes_logo.png';

const NavButton = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `py-2 px-4 rounded transition-all duration-200 font-medium ${
        isActive
          ? 'bg-[#ffa9a9] text-white shadow-sm dark:bg-[#ff7b7b]'
          : 'text-gray-700 hover:text-[#ff7b7b] hover:bg-[#fff2f2] hover:shadow-sm dark:text-gray-200 dark:hover:text-[#ffa9a9] dark:hover:bg-[#1f1f1f]'
      }`
    }
  >
    {children}
  </NavLink>
);

const ExternalNavButton = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="py-2 px-4 rounded transition-all duration-200 font-medium text-gray-700 hover:text-[#ff7b7b] hover:bg-[#fff2f2] hover:shadow-sm dark:text-gray-200 dark:hover:text-[#ffa9a9] dark:hover:bg-[#1f1f1f]"
  >
    {children}
  </a>
);

const MobileNavButton = ({ to, children, icon, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `block w-full text-left py-4 px-4 rounded-lg transition-colors ${
        isActive
          ? 'bg-[#ffa9a9] text-white dark:bg-[#ff7b7b]'
          : 'text-gray-700 hover:bg-[#fff2f2] dark:text-gray-200 dark:hover:bg-[#1f1f1f]'
      }`
    }
  >
    <div className="flex items-center space-x-3">
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{children}</span>
    </div>
  </NavLink>
);

const MainLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="App font-sans bg-white dark:bg-[#121212] text-gray-800 dark:text-gray-100 min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50 dark:bg-[#1a1a1a]/80">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <NavLink to="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-[#ffa9a9] rounded flex items-center justify-center overflow-hidden shadow-sm">
                <img
                  src={technotesLogo}
                  alt="Technotesgr Logo"
                  className="object-contain w-full h-full"
                />
              </div>
              <span className="text-xl font-bold text-gray-800 tracking-tight dark:text-white">technotesgr</span>
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex space-x-4 items-center">
              <NavButton to="/">Αρχική</NavButton>
              <NavButton to="/notes">Οι σημειώσεις μας</NavButton>
              <NavButton to="/quiz">Quiz</NavButton>
              <NavButton to="/flashcards">Flashcards</NavButton>
              <NavButton to="/algorithms">Algorithms Games</NavButton>
              <NavButton to="/paliathemata">Παλιά Θέματα</NavButton>
              {/* <ΝavButton to="/palia">Παλια Θεματα</NavButton> */}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Side Drawer */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-72 bg-white dark:bg-[#1a1a1a] z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-700 dark:text-gray-100">Μενού</span>
            <button onClick={closeMenu} className="p-2 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <MobileNavButton to="/" icon="🏠" onClick={closeMenu}>Αρχική</MobileNavButton>
          <MobileNavButton to="/notes" icon="📚" onClick={closeMenu}>Σημειώσεις</MobileNavButton>
          <MobileNavButton to="/quiz" icon="🎯" onClick={closeMenu}>Quiz</MobileNavButton>
          <MobileNavButton to="/flashcards" icon="🧠" onClick={closeMenu}>Flashcards</MobileNavButton>
          
            <a
            href="https://evripides.mysch.gr/dave/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="block w-full text-left py-4 px-4 rounded-lg text-gray-700 hover:bg-[#fff2f2] dark:text-gray-200 dark:hover:bg-[#1f1f1f] transition-colors"
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">💻</span>
              <span className="font-medium">Algorithms Games</span>
            </div>
          </a>
        </div>
      </div>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
