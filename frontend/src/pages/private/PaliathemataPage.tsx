import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, X, FileText } from 'lucide-react';
import Palia from '@/components/private/Palia';
import { MENU_ICONS, MenuIconImg } from '@/data/menuIcons';

/**
 * ═══════════════════════════════════════════════════════════════
 * 📝 PALIATHEMATA PAGE - technotesgr
 * ═══════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════
// 🦕 TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════

type ExamMode =
  | 'kanonikes'
  | 'epanaliptikes'
  | 'oefe-a'
  | 'oefe-b'
  | 'eimaste-mesa-a'
  | 'eimaste-mesa-b'
  | 'eimaste-mesa-c'
  | 'trapeza-thema-b'
  | 'trapeza-thema-d';

interface ExamItem {
  id: string;
  label: string;
}

interface TopicCardProps {
  item: ExamItem;
  mode: ExamMode;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

interface ModeTabConfig {
  mode: ExamMode;
  label: string;
  mobileLabel: string;
  count: number;
}

// ═══════════════════════════════════════════════════════════════
// 📊 ΔΕΔΟΜΕΝΑ
// ═══════════════════════════════════════════════════════════════

const KANONIKES_YEARS: number[] = [
  2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015,
  2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026,
];

const EPANALIPTIKES_YEARS: number[] = [
  2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015,
  2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,
];

const OEFE_YEARS2: number[] = [
  2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021,
  2022, 2023, 2024, 2025,2026
];

const OEFE_YEARS1: number[] = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,2026];

const EIMASTE_MESA_MONTHS: Record<string, string> = {
  oct: 'Οκτώβριος',
  jan: 'Ιανουάριος',
  april: 'Απρίλιος',
};

const EIMASTE_MESA_A_IDS = ['oct25', 'oct24', 'oct23', 'oct22', 'oct21'];
const EIMASTE_MESA_B_IDS = ['jan26', 'jan25', 'jan24', 'jan23', 'jan22', 'jan21', 'jan20'];
const EIMASTE_MESA_C_IDS = ['april25', 'april24', 'april23', 'april22', 'april21', 'april20'];

const yearsToItems = (years: number[]): ExamItem[] =>
  years.map((year) => ({ id: year.toString(), label: year.toString() }));

const parseEimasteMesaId = (id: string): ExamItem => {
  const match = id.match(/^([a-z]+)(\d{2})$/);
  if (!match) return { id, label: id };
  const [, month, yy] = match;
  const monthLabel = EIMASTE_MESA_MONTHS[month] ?? month;
  return { id, label: `${monthLabel} 20${yy}` };
};

const EIMASTE_MESA_A = EIMASTE_MESA_A_IDS.map(parseEimasteMesaId);
const EIMASTE_MESA_B = EIMASTE_MESA_B_IDS.map(parseEimasteMesaId);
const EIMASTE_MESA_C = EIMASTE_MESA_C_IDS.map(parseEimasteMesaId);

const numberedTrapezaItems = (count: number): ExamItem[] =>
  Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    return { id: n.toString(), label: `Θέμα ${n}` };
  });

const TRAPEZA_THEMA_B = numberedTrapezaItems(75);
const TRAPEZA_THEMA_D = numberedTrapezaItems(80);

const MODE_ITEMS: Record<ExamMode, ExamItem[]> = {
  kanonikes: yearsToItems(KANONIKES_YEARS),
  epanaliptikes: yearsToItems(EPANALIPTIKES_YEARS),
  'oefe-a': yearsToItems(OEFE_YEARS1),
  'oefe-b': yearsToItems(OEFE_YEARS2),
  'eimaste-mesa-a': EIMASTE_MESA_A,
  'eimaste-mesa-b': EIMASTE_MESA_B,
  'eimaste-mesa-c': EIMASTE_MESA_C,
  'trapeza-thema-b': TRAPEZA_THEMA_B,
  'trapeza-thema-d': TRAPEZA_THEMA_D,
};

const MODE_TABS: ModeTabConfig[] = [
  { mode: 'kanonikes', label: 'Κανονικές', mobileLabel: 'Κανονικές', count: KANONIKES_YEARS.length },
  {
    mode: 'epanaliptikes',
    label: 'Επαναληπτικές',
    mobileLabel: 'Επαναληπτικές',
    count: EPANALIPTIKES_YEARS.length,
  },
  { mode: 'oefe-a', label: 'ΟΕΦΕ Α Φάση', mobileLabel: 'ΟΕΦΕ Α', count: OEFE_YEARS1.length },
  { mode: 'oefe-b', label: 'ΟΕΦΕ Β Φάση', mobileLabel: 'ΟΕΦΕ Β', count: OEFE_YEARS2.length },
  {
    mode: 'eimaste-mesa-a',
    label: 'Είμαστε Μέσα · Α',
    mobileLabel: 'Είμαστε Μέσα · Α',
    count: EIMASTE_MESA_A.length,
  },
  {
    mode: 'eimaste-mesa-b',
    label: 'Είμαστε Μέσα · Β',
    mobileLabel: 'Είμαστε Μέσα · Β',
    count: EIMASTE_MESA_B.length,
  },
  {
    mode: 'eimaste-mesa-c',
    label: 'Είμαστε Μέσα · Γ',
    mobileLabel: 'Είμαστε Μέσα · Γ',
    count: EIMASTE_MESA_C.length,
  },
  {
    mode: 'trapeza-thema-b',
    label: 'Τράπεζα Θεμάτων · Β',
    mobileLabel: 'Τράπεζα · Β',
    count: TRAPEZA_THEMA_B.length,
  },
  {
    mode: 'trapeza-thema-d',
    label: 'Τράπεζα Θεμάτων · Δ',
    mobileLabel: 'Τράπεζα · Δ',
    count: TRAPEZA_THEMA_D.length,
  },
];

const YEAR_MODES: ExamMode[] = ['kanonikes', 'epanaliptikes', 'oefe-a', 'oefe-b'];

const getModeLabel = (currentMode: ExamMode): string => {
  const tab = MODE_TABS.find((t) => t.mode === currentMode);
  return tab?.label ?? '';
};

// ═══════════════════════════════════════════════════════════════
// 🎴 TOPIC CARD COMPONENT
// ═══════════════════════════════════════════════════════════════

const TopicCard: React.FC<TopicCardProps> = ({ item, mode, isSelected, onClick, index }) => {
  const staggerDelay = Math.min(index * 0.015, 0.2);
  const isYearMode = YEAR_MODES.includes(mode);

  return (
    <motion.button
      className={`
        relative group p-3 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg
        transition-all duration-300 shadow-lg touch-manipulation min-h-[4.5rem] sm:min-h-0
        focus:outline-none focus:ring-2 focus:ring-coral-accent focus:ring-offset-2
        ${
          isSelected
            ? 'bg-coral-accent text-white sm:scale-105 shadow-2xl ring-2 ring-coral-light/60'
            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:shadow-xl active:scale-[0.98]'
        }
      `}
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: staggerDelay, duration: 0.2 }}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      aria-label={`${getModeLabel(mode)} ${item.label}`}
    >
      <div
        className={`font-black mb-1 sm:mb-2 leading-tight ${
          isYearMode ? 'text-lg sm:text-2xl' : 'text-xs sm:text-base'
        }`}
      >
        {item.label}
      </div>

      <div className="flex justify-center">
        <FileText
          className={`w-5 h-5 ${
            isSelected ? 'text-white' : 'text-coral-accent group-hover:text-coral-strong'
          }`}
        />
      </div>

      {!isSelected && (
        <motion.div
          className="absolute inset-0 rounded-xl sm:rounded-2xl bg-coral-accent/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />
      )}

      {isSelected && (
        <motion.div
          className="absolute -top-2 -right-2 bg-white text-coral-accent rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg"
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

const PaliathemataPage: React.FC = () => {
  const [mode, setMode] = useState<ExamMode>('kanonikes');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allItems = MODE_ITEMS[mode];

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return allItems;
    const query = searchQuery.trim().toLowerCase();
    return allItems.filter(
      (item) => item.label.toLowerCase().includes(query) || item.id.toLowerCase().includes(query),
    );
  }, [allItems, searchQuery]);

  const selectedItem = allItems.find((item) => item.id === selectedId) ?? null;

  const handleItemClick = (id: string) => {
    setSelectedId(selectedId === id ? null : id);
  };

  const handleModeChange = (newMode: ExamMode) => {
    setMode(newMode);
    setSelectedId(null);
    setSearchQuery('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (selectedId == null) return;
    let cancelled = false;
    const raf1 = requestAnimationFrame(() => {
      if (cancelled) return;
      requestAnimationFrame(() => {
        if (cancelled) return;
        document.getElementById('pdf-viewer')?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
    };
  }, [selectedId]);

  const searchPlaceholder = mode.startsWith('eimaste-mesa')
    ? 'Αναζήτηση περιόδου...'
    : mode.startsWith('trapeza')
      ? 'Αναζήτηση θέματος...'
      : 'Αναζήτηση έτους...';

  const resultsLabel = mode.startsWith('eimaste-mesa')
    ? 'περίοδοι'
    : mode.startsWith('trapeza')
      ? 'θέματα'
      : 'χρονιές';

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-wash via-white to-coral-wash dark:from-[#0b1020] dark:via-[#141b34] dark:to-[#0b1020]">
      {/* Header Section */}
      <header className="border-b border-[#f07f97]/35 dark:border-white/10 bg-white/90 dark:bg-[#3a2658]/90 backdrop-blur-md py-10 sm:py-12 px-4 sm:px-6">
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#ff97b2]/15 dark:bg-white/10 mb-3">
              <MenuIconImg src={MENU_ICONS.paliathemata} className="w-9 h-9" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-[#faf5ef] tracking-tight">
              Παλιά Θέματα
            </h1>
          </motion.div>
        </div>
      </header>

      {/* Tabs & Search Section */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg border-b border-coral-accent/20 dark:border-gray-700 [overflow-anchor:none]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-5 sm:mb-6">
            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-2 w-full"
              role="tablist"
              aria-label="Επιλογή κατηγορίας"
            >
              {MODE_TABS.map((tab) => (
                <motion.button
                  key={tab.mode}
                  role="tab"
                  aria-selected={mode === tab.mode}
                  className={`
                    relative px-3 sm:px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all
                    focus:outline-none focus:ring-2 focus:ring-coral-accent
                    ${
                      mode === tab.mode
                        ? 'bg-coral-accent text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-coral-accent/10 dark:hover:bg-gray-700'
                    }
                  `}
                  onClick={() => handleModeChange(tab.mode)}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="flex flex-col items-center gap-1 leading-tight">
                    <Calendar className="w-4 h-4 shrink-0" />
                    {tab.mode.startsWith('eimaste-mesa') ? (
                      <span className="sm:hidden text-center text-[10px] leading-snug">
                        <span className="block">Είμαστε Μέσα</span>
                        <span className="block">
                          {tab.mode === 'eimaste-mesa-a'
                            ? 'Α Φάση'
                            : tab.mode === 'eimaste-mesa-b'
                              ? 'Β Φάση'
                              : 'Γ Φάση'}
                        </span>
                      </span>
                    ) : tab.mode.startsWith('trapeza') ? (
                      <span className="sm:hidden text-center text-[10px] leading-snug">
                        <span className="block">Τράπεζα Θεμάτων</span>
                        <span className="block">
                          {tab.mode === 'trapeza-thema-b' ? 'Θέμα Β' : 'Θέμα Δ'}
                        </span>
                      </span>
                    ) : (
                      <span className="sm:hidden">{tab.mobileLabel}</span>
                    )}
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="text-[10px] sm:text-xs opacity-75">({tab.count})</span>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="relative w-full md:w-64 shrink-0">
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-3 pl-11 pr-10 rounded-xl border-2 border-coral-accent/25 dark:border-gray-600 focus:border-coral-accent focus:ring-2 focus:ring-coral-accent/25 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm">
            <div className="text-gray-600 dark:text-gray-400">
              Βρέθηκαν{' '}
              <span className="font-bold text-coral-accent dark:text-coral-light">
                {filteredItems.length}
              </span>{' '}
              {resultsLabel}
              {selectedItem && (
                <span className="ml-2">
                  • Επιλεγμένη:{' '}
                  <span className="font-bold text-coral-accent dark:text-coral-light">
                    {selectedItem.label}
                  </span>
                </span>
              )}
            </div>

            {selectedId && (
              <motion.button
                onClick={() => setSelectedId(null)}
                className="text-coral-accent hover:text-coral-strong dark:text-coral-light dark:hover:text-coral-light font-semibold flex items-center gap-1"
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

      {/* Topics Grid Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-12">
        <AnimatePresence mode="wait">
          {filteredItems.length === 0 ? (
            <motion.div
              className="text-center py-20"
              key={`${mode}-empty`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Δεν βρέθηκαν αποτελέσματα
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Δοκίμασε να αλλάξεις την αναζήτησή σου
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-3 bg-coral-accent text-white rounded-lg font-semibold hover:bg-coral-strong transition-colors"
                >
                  Καθαρισμός Αναζήτησης
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-4"
              key={`${mode}-grid`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {filteredItems.map((item, index) => (
                <TopicCard
                  key={`${mode}-${item.id}`}
                  item={item}
                  mode={mode}
                  isSelected={selectedId === item.id}
                  onClick={() => handleItemClick(item.id)}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PDF Viewer Section */}
      <AnimatePresence>
        {selectedId && (
          <motion.div
            id="pdf-viewer"
            className="max-w-7xl mx-auto px-3 sm:px-6 pb-8 sm:pb-12 scroll-mt-20 sm:scroll-mt-24"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-b-3xl shadow-2xl overflow-hidden">
              <Palia
                pdfPath={`/pdfs/${mode}/${selectedId}.pdf`}
                fileName={`${mode}-${selectedId}.pdf`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaliathemataPage;
