import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import technotesLogo from '../assets/technotes_logo.png';

// Το NavLink αντί για button θα αλλάζει αυτόματα το στυλ όταν το URL ταιριάζει
const NavButton = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `py-2 px-4 rounded transition-colors border border-transparent ${
        isActive
          ? 'bg-pink-500 text-white'
          : 'text-gray-700 hover:text-pink-500 hover:border-pink-500'
      }`
    }
  >
    {children}
  </NavLink>
);

const MobileNavButton = ({ to, children, icon, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `block w-full text-left py-4 px-4 rounded-lg transition-colors ${
        isActive ? 'bg-pink-500 text-white' : 'text-gray-700 hover:bg-pink-50'
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
    <div className="App">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            <NavLink to="/" className="flex items-center space-x-2 ">
              <div className="w-8 h-8 bg-pink-400 rounded flex items-center justify-center overflow-hidden">
                <img
                  src={technotesLogo}
                  alt="Technotesgr Logo"
                  className="object-contain w-full h-full"
                />
              </div>
              <span className="text-xl font-bold text-gray-800">technotesgr</span>
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex space-x-8">
              <NavButton to="/">Αρχική</NavButton>
              <NavButton to="/notes">Οι σημειώσεις μας</NavButton>
              <NavButton to="/quiz">Quiz</NavButton>
              <NavButton to="/flashcards">Flashcards</NavButton>
              <NavButton to="/leaderboard">Leaderboard</NavButton>
              <NavButton to="/about">Σχετικά</NavButton>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none"
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
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeMenu} />
      )}

      {/* Mobile Side Drawer */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6">
          <div className="flex justify-end items-center mb-8">
            <button onClick={closeMenu} className="p-2 rounded-lg text-gray-700 hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="space-y-4">
            <MobileNavButton to="/" icon="🏠" onClick={closeMenu}>
              Αρχική
            </MobileNavButton>
            <MobileNavButton to="/notes" icon="📚" onClick={closeMenu}>
              Σημειώσεις
            </MobileNavButton>
            <MobileNavButton to="/quiz" icon="🎯" onClick={closeMenu}>
              Quiz
            </MobileNavButton>
            <MobileNavButton to="/flashcards" icon="🗂️" onClick={closeMenu}>
              Flashcards
            </MobileNavButton>
            <MobileNavButton to="/leaderboard" icon="🏆" onClick={closeMenu}>
              Leaderboard
            </MobileNavButton>
            <MobileNavButton to="/about" icon="ℹ️" onClick={closeMenu}>
              Σχετικά
            </MobileNavButton>
          </div>
        </div>
      </div>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
