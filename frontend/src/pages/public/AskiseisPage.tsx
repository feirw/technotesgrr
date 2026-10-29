import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, X } from 'lucide-react';
import Palia from '@/components/private/Palia';
import { MENU_ICONS, MenuIconImg } from '@/data/menuIcons';

type AskisiItem = {
  id: string;
  title: string;
  path: string;
};

type AskisiCategory = {
  id: string;
  title: string;
  items: AskisiItem[];
};

const ASKISEIS: AskisiCategory[] = [
  {
    id: 'thema-g',
    title: 'ΘΕΜΑ Γ',
    items: [
      {
        id: 'halloween',
        title: 'Ο Στοιχειωμένος Λαβύρινθος',
        path: '/pdfs/askiseis/halloween.pdf',
      },
    ],
  },
];

const TopicCard: React.FC<{
  item: AskisiItem;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}> = ({ item, isSelected, onClick, index }) => (
  <motion.button
    type="button"
    className={`
      relative group p-3 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg
      transition-all duration-300 shadow-lg touch-manipulation min-h-[4.5rem] sm:min-h-0
      focus:outline-none focus:ring-2 focus:ring-coral-accent focus:ring-offset-2
      ${
        isSelected
          ? 'bg-coral-accent text-white sm:scale-105 shadow-2xl ring-2 ring-coral-light/60'
          : 'bg-white dark:bg-[#2d1c48] text-gray-800 dark:text-white hover:shadow-xl active:scale-[0.98]'
      }
    `}
    onClick={onClick}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: Math.min(index * 0.015, 0.2), duration: 0.2 }}
    whileHover={{ y: -2, scale: 1.02 }}
    whileTap={{ scale: 0.97 }}
    aria-label={item.title}
  >
    <div className="font-black mb-1 sm:mb-2 leading-tight text-xs sm:text-base">{item.title}</div>
    <div className="flex justify-center">
      <FileText
        className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-coral-accent group-hover:text-coral-strong'}`}
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

const AskiseisPage: React.FC = () => {
  const [categoryId, setCategoryId] = useState(ASKISEIS[0].id);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const category = useMemo(
    () => ASKISEIS.find((cat) => cat.id === categoryId) ?? ASKISEIS[0],
    [categoryId],
  );
  const selectedItem = category.items.find((item) => item.id === selectedId) ?? null;

  const handleCategoryChange = (id: string) => {
    setCategoryId(id);
    setSelectedId(null);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-wash via-white to-coral-wash dark:from-[#2d1c48] dark:via-[#2d1c48] dark:to-[#1a1028]">
      <header className="border-b border-[#f07f97]/35 dark:border-white/10 bg-white/90 dark:bg-[#3a2658]/90 backdrop-blur-md py-10 sm:py-12 px-4 sm:px-6">
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#ff97b2]/15 dark:bg-white/10 mb-3">
              <MenuIconImg src={MENU_ICONS.askiseis} className="w-9 h-9" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-[#faf5ef] tracking-tight">
              Ασκήσεις
            </h1>
          </motion.div>
        </div>
      </header>

      <div className="sticky top-0 z-40 bg-white/95 dark:bg-[#3a2658]/95 backdrop-blur-lg shadow-lg border-b border-coral-accent/20 dark:border-white/15 [overflow-anchor:none]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 w-full"
            role="tablist"
            aria-label="Επιλογή κατηγορίας"
          >
            {ASKISEIS.map((tab) => (
              <motion.button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={categoryId === tab.id}
                className={`
                  relative px-3 sm:px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all
                  focus:outline-none focus:ring-2 focus:ring-coral-accent
                  ${
                    categoryId === tab.id
                      ? 'bg-coral-accent text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-[#2d1c48] text-gray-700 dark:text-gray-300 hover:bg-coral-accent/10 dark:hover:bg-gray-700'
                  }
                `}
                onClick={() => handleCategoryChange(tab.id)}
                whileTap={{ scale: 0.97 }}
              >
                <div className="flex flex-col items-center gap-1 leading-tight">
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>{tab.title}</span>
                  <span className="text-[10px] sm:text-xs opacity-75">({tab.items.length})</span>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm mt-5 sm:mt-6">
            <div className="text-gray-600 dark:text-gray-400">
              Βρέθηκαν{' '}
              <span className="font-bold text-coral-accent dark:text-coral-light">{category.items.length}</span>{' '}
              ασκήσεις
              {selectedItem && (
                <span className="ml-2">
                  • Επιλεγμένη:{' '}
                  <span className="font-bold text-coral-accent dark:text-coral-light">{selectedItem.title}</span>
                </span>
              )}
            </div>
            {selectedId && (
              <motion.button
                type="button"
                onClick={() => setSelectedId(null)}
                className="text-coral-accent hover:text-coral-strong dark:text-coral-light font-semibold flex items-center gap-1"
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

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-12">
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4"
          key={`${categoryId}-grid`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {category.items.map((item, index) => (
            <TopicCard
              key={item.id}
              item={item}
              isSelected={selectedId === item.id}
              onClick={() => setSelectedId(selectedId === item.id ? null : item.id)}
              index={index}
            />
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedId && selectedItem && (
          <motion.div
            id="pdf-viewer"
            className="max-w-7xl mx-auto px-3 sm:px-6 pb-8 sm:pb-12 scroll-mt-20 sm:scroll-mt-24"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="bg-white dark:bg-[#2d1c48] rounded-b-3xl shadow-2xl overflow-hidden">
              <Palia
                pdfPath={selectedItem.path}
                fileName={`${selectedItem.title}.pdf`}
                heading="Άσκηση (PDF)"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AskiseisPage;
