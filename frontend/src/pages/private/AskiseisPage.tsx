import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, X } from 'lucide-react';
import { MENU_ICONS, MenuIconImg } from '@/data/menuIcons';
import Palia from '@/components/private/Palia';
import {
  ASKISI_THEMES,
  ASKISEIS,
  type Askisi,
  type AskisiStatement,
  type AskisiThemeId,
  filterAskiseis,
  pdfPathForAskisi,
  askiseisForTheme,
} from '@/data/askiseis';

const StatementView: React.FC<{ statement: AskisiStatement; title: string }> = ({ statement, title }) => (
  <article className="p-6 sm:p-8">
    <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-4 border-b border-coral-accent/30 pb-3">
      {title}
    </h2>
    {statement.intro.split('\n\n').map((para, i) => (
      <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        {para}
      </p>
    ))}
    {statement.bullets && statement.bullets.length > 0 && (
      <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700 dark:text-gray-300 leading-relaxed pl-1">
        {statement.bullets.map((bullet, i) => (
          <li key={i}>{bullet}</li>
        ))}
      </ol>
    )}
    {statement.introClosing && (
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 font-semibold">{statement.introClosing}</p>
    )}
    {statement.note && (
      <p className="mb-6 rounded-xl border border-amber-200 dark:border-amber-700/50 bg-amber-50/80 dark:bg-amber-900/20 px-4 py-3 text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
        <span className="font-bold">Σημείωση:</span> {statement.note}
      </p>
    )}
    <ol className="space-y-5">
      {statement.tasks.map((task) => (
        <li
          key={task.code}
          className="rounded-xl border border-coral-accent/20 dark:border-gray-700 bg-coral-wash/40 dark:bg-gray-800/60 p-4 sm:p-5"
        >
          <div className="flex flex-wrap items-baseline gap-2 mb-2">
            <span className="inline-flex items-center justify-center min-w-[2.25rem] px-2 py-0.5 rounded-lg bg-coral-accent text-white text-sm font-black">
              {task.code}
            </span>
            {task.points > 0 && (
              <span className="text-xs font-semibold text-coral-strong dark:text-coral-light">
                ({task.points} {task.points === 1 ? 'μονάδα' : 'μονάδες'})
              </span>
            )}
          </div>
          {task.text ? (
            <p className="text-gray-800 dark:text-gray-100 leading-relaxed">{task.text}</p>
          ) : null}
          {task.subItems && (
            <ul className={`space-y-2 list-none ${task.text ? 'mt-3' : ''}`}>
              {task.subItems.map((sub, j) => (
                <li key={j} className="flex gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  <span className="font-bold text-coral-accent shrink-0">
                    {task.subListNumeric ? `${j + 1}.` : `${String.fromCharCode(945 + j)})`}
                  </span>
                  <span>{sub}</span>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
    <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
      Σύνολο μονάδων:{' '}
      <span className="font-bold text-coral-accent">
        {statement.tasks.reduce((sum, t) => sum + t.points, 0)}
      </span>
    </p>
  </article>
);

const ExerciseCard: React.FC<{
  item: Askisi;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}> = ({ item, isSelected, onClick, index }) => {
  const staggerDelay = Math.min(index * 0.02, 0.2);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`
        relative group p-4 sm:p-5 rounded-xl sm:rounded-2xl text-left w-full
        transition-all duration-300 shadow-lg touch-manipulation min-h-[5.5rem]
        focus:outline-none focus:ring-2 focus:ring-coral-accent focus:ring-offset-2
        ${
          isSelected
            ? 'bg-coral-accent text-white shadow-2xl ring-2 ring-coral-light/60'
            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:shadow-xl active:scale-[0.98]'
        }
      `}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: staggerDelay, duration: 0.2 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      aria-pressed={isSelected}
      aria-label={item.title}
    >
      <div
        className={`mb-2 inline-flex rounded-lg p-2 ${
          isSelected ? 'bg-white/20' : 'bg-coral-accent/10 dark:bg-coral-accent/15'
        }`}
      >
        <FileText
          className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-coral-accent'}`}
          aria-hidden
        />
      </div>
      <div className="font-black text-base sm:text-lg leading-snug">{item.title}</div>
      {item.publishedAt && (
        <p className={`mt-1 text-xs sm:text-sm ${isSelected ? 'text-white/85' : 'text-gray-500 dark:text-gray-400'}`}>
          {item.publishedAt}
        </p>
      )}
      {item.description && (
        <p
          className={`mt-2 text-xs sm:text-sm line-clamp-2 ${isSelected ? 'text-white/90' : 'text-gray-600 dark:text-gray-300'}`}
        >
          {item.description}
        </p>
      )}
      {isSelected && (
        <motion.div
          className="absolute -top-2 -right-2 bg-white text-coral-accent rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500 }}
          aria-hidden
        >
          ✓
        </motion.div>
      )}
    </motion.button>
  );
};

const AskiseisPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTheme = searchParams.get('t') || '';
  const activeTheme: AskisiThemeId = rawTheme === 'd' ? 'd' : 'g';

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (rawTheme && rawTheme !== 'g' && rawTheme !== 'd') {
      setSearchParams({ t: 'g' }, { replace: true });
    }
  }, [rawTheme, setSearchParams]);

  const themeExercises = useMemo(() => askiseisForTheme(activeTheme), [activeTheme]);

  const filtered = useMemo(
    () => filterAskiseis(activeTheme, searchQuery),
    [activeTheme, searchQuery]
  );

  const selected = useMemo(
    () => ASKISEIS.find((x) => x.id === selectedId) ?? null,
    [selectedId]
  );

  useEffect(() => {
    setSelectedId(null);
    setSearchQuery('');
  }, [activeTheme]);

  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    const raf1 = requestAnimationFrame(() => {
      if (cancelled) return;
      requestAnimationFrame(() => {
        if (cancelled) return;
        document.getElementById('askisi-detail-viewer')?.scrollIntoView({
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

  const setTheme = (theme: AskisiThemeId) => setSearchParams({ t: theme }, { replace: true });

  const handleSelect = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const activeThemeLabel = ASKISI_THEMES.find((t) => t.id === activeTheme)?.label ?? '';

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-coral-wash via-white to-coral-wash dark:from-gray-900 dark:via-gray-900 dark:to-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative overflow-hidden bg-gradient-to-r from-coral-accent via-coral-strong to-coral-accent text-white py-10 sm:py-14 px-4 sm:px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 mb-4">
            <MenuIconImg src={MENU_ICONS.askiseis} className="w-12 h-12" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 tracking-tight">Ασκήσεις</h1>
          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto">
            Προτεινόμενες ασκήσεις σε ΓΛΩΣΣΑ — επίλεξε θέμα και άσκηση για την εκφώνηση.
          </p>
        </motion.div>
      </div>

      <motion.div
        className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-coral-accent/15 dark:border-gray-800 shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {ASKISI_THEMES.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setTheme(theme.id)}
                className={`min-h-11 px-5 sm:px-6 py-2.5 rounded-xl text-sm font-bold border transition-all touch-manipulation ${
                  activeTheme === theme.id
                    ? 'bg-coral-accent text-white border-coral-accent shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-coral-accent/35 dark:border-gray-600 hover:border-coral-accent/60'
                }`}
              >
                {theme.label}
              </button>
            ))}
          </div>

          <motion.div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <input
                type="search"
                placeholder={`Αναζήτηση στο ${activeThemeLabel}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-11 pr-10 rounded-xl border-2 border-coral-accent/25 dark:border-gray-600 focus:border-coral-accent focus:ring-2 focus:ring-coral-accent/25 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                aria-label="Αναζήτηση άσκησης"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Καθαρισμός αναζήτησης"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              {themeExercises.length === 0 ? (
                <span>Δεν υπάρχουν ακόμη ασκήσεις στο {activeThemeLabel}.</span>
              ) : (
                <>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{activeThemeLabel}:</span>{' '}
                  <span className="font-bold text-coral-accent dark:text-coral-light">{filtered.length}</span>{' '}
                  {filtered.length === 1 ? 'άσκηση' : 'ασκήσεις'}
                  {selected && (
                    <span className="ml-2 hidden sm:inline">
                      • Επιλεγμένη:{' '}
                      <span className="font-bold text-coral-accent dark:text-coral-light">{selected.title}</span>
                    </span>
                  )}
                </>
              )}
            </div>
          </motion.div>

          {selected && (
            <motion.button
              type="button"
              onClick={() => setSelectedId(null)}
              className="text-coral-accent hover:text-coral-strong dark:text-coral-light font-semibold flex items-center gap-1 sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <X className="w-4 h-4" />
              Κλείσιμο
            </motion.button>
          )}
        </motion.div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-12">
        <AnimatePresence mode="wait">
          {themeExercises.length === 0 ? (
            <motion.div
              key={`empty-${activeTheme}`}
              className="text-center py-16 sm:py-24 rounded-2xl border-2 border-dashed border-coral-accent/30 dark:border-gray-700 bg-white/60 dark:bg-gray-800/40"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <FileText className="w-12 h-12 mx-auto text-coral-accent/70 mb-4" aria-hidden />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Σύντομα διαθέσιμες ασκήσεις
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-sm sm:text-base px-4">
                Οι ασκήσεις για το {activeThemeLabel} θα προστίθενται εδώ.
              </p>
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div
              key={`search-empty-${activeTheme}`}
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-5xl mb-4" aria-hidden>
                🔍
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Δεν βρέθηκαν ασκήσεις</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Δοκίμασε άλλη αναζήτηση</p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-6 py-3 bg-coral-accent text-white rounded-lg font-semibold hover:bg-coral-strong transition-colors"
              >
                Καθαρισμός αναζήτησης
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`grid-${activeTheme}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {filtered.map((item, index) => (
                <ExerciseCard
                  key={item.id}
                  item={item}
                  isSelected={selectedId === item.id}
                  onClick={() => handleSelect(item.id)}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            id="askisi-detail-viewer"
            className="max-w-7xl mx-auto px-3 sm:px-6 pb-8 sm:pb-12 scroll-mt-20 sm:scroll-mt-24 space-y-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 300 }}
          >
            {selected.statement && (
              <motion.div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-coral-accent/15 dark:border-gray-700">
                <StatementView statement={selected.statement} title={selected.title} />
              </motion.div>
            )}
            {pdfPathForAskisi(selected) && (
              <motion.div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
                <Palia pdfPath={pdfPathForAskisi(selected)!} fileName={selected.fileName ?? 'askisi.pdf'} />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AskiseisPage;
