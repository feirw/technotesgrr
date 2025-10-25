import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, Search, Calendar, FileText, Download, X } from 'lucide-react';
import Palia from '../components/Palia.jsx';

/**
 * ═══════════════════════════════════════════════════════════════
 * 📝 PALIATHEMATA PAGE - technotesgr
 * ═══════════════════════════════════════════════════════════════
 *
 * Σελίδα παλιών θεμάτων Πανελληνίων Πληροφορικής
 *
 * Features:
 * - Animated tabs (Κανονικές/Επαναληπτικές)
 * - Year cards με hover effects
 * - Search functionality
 * - Stats display
 * - Smooth transitions
 * - PDF viewer integration
 * - Responsive design
 * - Dark mode support
 *
 * ═══════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════
// 📊 ΔΕΔΟΜΕΝΑ ΕΤΩΝ
// ═══════════════════════════════════════════════════════════════

const KANONIKES_YEARS = [
  2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015,
  2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,
];

const EPANALIPTIKES_YEARS = [
  2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015,
  2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,
];

// ═══════════════════════════════════════════════════════════════
// 🎴 YEAR CARD COMPONENT
// ═══════════════════════════════════════════════════════════════

const YearCard = ({ year, mode, isSelected, onClick, index }) => {
  return (
    <motion.button
      className={`
        relative group p-6 rounded-2xl font-bold text-lg
        transition-all duration-300 shadow-lg
        focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
        ${
          isSelected
            ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white scale-105 shadow-2xl'
            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:shadow-xl'
        }
      `}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -4, scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      aria-label={`${mode === 'kanonikes' ? 'Κανονικές' : 'Επαναληπτικές'} ${year}`}
    >
      {/* Year Number */}
      <div className="text-2xl font-black mb-2">{year}</div>

      {/* Icon */}
      <div className="flex justify-center">
        <FileText
          className={`w-5 h-5 ${
            isSelected ? 'text-white' : 'text-pink-500 group-hover:text-pink-600'
          }`}
        />
      </div>

      {/* Hover gradient overlay */}
      {!isSelected && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />
      )}

      {/* Selected indicator */}
      {isSelected && (
        <motion.div
          className="absolute -top-2 -right-2 bg-white text-pink-500 rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 500 }}
        >
          ✓
        </motion.div>
      )}
    </motion.button>
  );
};

// ═══════════════════════════════════════════════════════════════
// 🏠 MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

const PaliathemataPage = () => {
  const [mode, setMode] = useState('kanonikes');
  const [selectedYear, setSelectedYear] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // ═══════════════════════════════════════════════════════════════
  // 📊 DATA & FILTERING
  // ═══════════════════════════════════════════════════════════════

  const allYears = mode === 'kanonikes' ? KANONIKES_YEARS : EPANALIPTIKES_YEARS;
  const uniqueYears = Array.from(new Set(allYears)).sort((a, b) => b - a); // Reverse chronological

  // Filter years based on search
  const filteredYears = useMemo(() => {
    if (!searchQuery.trim()) return uniqueYears;
    return uniqueYears.filter((year) => year.toString().includes(searchQuery.trim()));
  }, [uniqueYears, searchQuery]);

  // ═══════════════════════════════════════════════════════════════
  // 🎬 HANDLERS
  // ═══════════════════════════════════════════════════════════════

  const handleYearClick = (year) => {
    setSelectedYear(selectedYear === year ? null : year);
    // Scroll to PDF viewer after selection
    if (selectedYear !== year) {
      setTimeout(() => {
        document.getElementById('pdf-viewer')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 300);
    }
  };

  const handleModeChange = (newMode) => {
    // **Αφαιρέθηκε ο υπολογισμός direction**
    setMode(newMode);
    setSelectedYear(null);
    setSearchQuery('');
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Track scroll for "back to top" button
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // 🎨 RENDER
  // ═══════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white py-16 px-6">
        {/* Animated Background Circles */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <motion.div
            className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <motion.div
            className="absolute -bottom-24 -right-24 w-96 h-96 bg-white rounded-full"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-6xl font-black mb-4 flex items-center justify-center gap-3">
              <FileText className="w-12 h-12" />
              Παλιά Θέματα
            </h1>
            <p className="text-xl md:text-2xl text-pink-100 mb-8">
              Πανελλήνιες Πληροφορικής • Όλες οι Χρονιές
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-center">
              <div className="text-4xl font-bold">{KANONIKES_YEARS.length}</div>
              <div className="text-pink-100">Κανονικές Περίοδοι</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{EPANALIPTIKES_YEARS.length}</div>
              <div className="text-pink-100">Επαναληπτικές Περίοδοι</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">
                {KANONIKES_YEARS.length + EPANALIPTIKES_YEARS.length}
              </div>
              <div className="text-pink-100">Σύνολο Θεμάτων</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs & Search Section - Εφαρμογή layoutId */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg border-b border-pink-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Tabs */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            {/* Mode Tabs Container */}
            <div
              className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-full shadow-inner relative"
              role="tablist"
              aria-label="Επιλογή κατηγορίας"
            >
              <motion.button
                role="tab"
                aria-selected={mode === 'kanonikes'}
                className={`
                  relative px-6 py-3 rounded-full font-bold text-sm transition-all z-10 
                  focus:outline-none focus:ring-2 focus:ring-pink-500
                  ${
                    mode === 'kanonikes'
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400'
                  }
                `}
                onClick={() => handleModeChange('kanonikes')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Ενεργό Background (για slide animation) */}
                {mode === 'kanonikes' && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg"
                    layoutId="activeTabIndicator"
                    transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
                  />
                )}
                {/* Περιεχόμενο (Πάνω από το background) */}
                <div className="relative z-20 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Κανονικές
                  <span className="ml-1 text-xs opacity-75">({KANONIKES_YEARS.length})</span>
                </div>
              </motion.button>

              <motion.button
                role="tab"
                aria-selected={mode === 'epanaliptikes'}
                className={`
                  relative px-6 py-3 rounded-full font-bold text-sm transition-all z-10 
                  focus:outline-none focus:ring-2 focus:ring-pink-500
                  ${
                    mode === 'epanaliptikes'
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400'
                  }
                `}
                onClick={() => handleModeChange('epanaliptikes')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Ενεργό Background (για slide animation) */}
                {mode === 'epanaliptikes' && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg"
                    layoutId="activeTabIndicator"
                    transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
                  />
                )}
                {/* Περιεχόμενο (Πάνω από το background) */}
                <div className="relative z-20 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Επαναληπτικές
                  <span className="ml-1 text-xs opacity-75">({EPANALIPTIKES_YEARS.length})</span>
                </div>
              </motion.button>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Αναζήτηση έτους..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-11 pr-10 rounded-xl border-2 border-pink-200 dark:border-gray-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Καθαρισμός αναζήτησης"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-600 dark:text-gray-400">
              Βρέθηκαν{' '}
              <span className="font-bold text-pink-600 dark:text-pink-400">
                {filteredYears.length}
              </span>{' '}
              χρονιές
              {selectedYear && (
                <span className="ml-2">
                  • Επιλεγμένη:{' '}
                  <span className="font-bold text-pink-600 dark:text-pink-400">{selectedYear}</span>
                </span>
              )}
            </div>

            {selectedYear && (
              <motion.button
                onClick={() => setSelectedYear(null)}
                className="text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 font-semibold flex items-center gap-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
              >
                <X className="w-4 h-4" />
                Καθαρισμός
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Years Grid Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {filteredYears.length === 0 ? (
            <motion.div
              className="text-center py-20"
              key={`${mode}-empty`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Δεν βρέθηκαν χρονιές
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Δοκίμασε να αλλάξεις την αναζήτησή σου
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors"
                >
                  Καθαρισμός Αναζήτησης
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4"
              key={`${mode}-grid`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {filteredYears.map((year, index) => (
                <YearCard
                  key={`${mode}-${year}`}
                  year={year}
                  mode={mode}
                  isSelected={selectedYear === year}
                  onClick={() => handleYearClick(year)}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PDF Viewer Section */}
      <AnimatePresence>
        {selectedYear && (
          <motion.div
            id="pdf-viewer"
            className="max-w-7xl mx-auto px-6 pb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* PDF Header */}
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-t-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8" />
                  <div>
                    <h2 className="text-2xl font-bold">
                      {mode === 'kanonikes' ? 'Κανονικές' : 'Επαναληπτικές'} {selectedYear}
                    </h2>
                    <p className="text-pink-100 text-sm">Θέματα Πανελληνίων Πληροφορικής</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <motion.a
                    href={`/pdfs/${mode}/${selectedYear}.pdf`}
                    download={`${mode}-${selectedYear}.pdf`}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-pink-600 rounded-lg font-semibold hover:bg-pink-50 transition-colors shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="w-4 h-4" />
                    Λήψη
                  </motion.a>

                  <motion.button
                    onClick={() => setSelectedYear(null)}
                    className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                    whileHover={{ scale: 1.05, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Κλείσιμο"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* PDF Component */}
            <div className="bg-white dark:bg-gray-800 rounded-b-3xl shadow-2xl overflow-hidden">
              <Palia
                pdfPath={`/pdfs/${mode}/${selectedYear}.pdf`}
                fileName={`${mode}-${selectedYear}.pdf`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={handleScrollTop}
            className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full shadow-2xl hover:shadow-pink-500/50 transition-all group"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Μετάβαση στην κορυφή"
          >
            <ChevronUp className="w-6 h-6 group-hover:animate-bounce" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaliathemataPage;
