import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  GripVertical,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { MENU_ICONS, MenuIconImg } from '@/data/menuIcons';
import { ALL_SCHOOLS, type School } from '@/data/schools';
import { normalizeSearch } from '@/utils/schoolCoefficientsUtils';
import { formatEbeDisplay, parseEbeGrade } from '@/utils/schoolBasisMatching';

const STORAGE_KEY = 'technotesgr_mixanografiko_v2';
const MINEDU_URL = 'https://www.minedu.gov.gr/mixanografiko';

type StoredState = {
  meanGrade: string;
  rankedIds: string[];
};

function loadState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { meanGrade: '', rankedIds: [] };
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    return {
      meanGrade: typeof parsed.meanGrade === 'string' ? parsed.meanGrade : '',
      rankedIds: Array.isArray(parsed.rankedIds)
        ? parsed.rankedIds.filter((x): x is string => typeof x === 'string')
        : [],
    };
  } catch {
    return { meanGrade: '', rankedIds: [] };
  }
}

function schoolMatchesQuery(school: School, query: string): boolean {
  const q = normalizeSearch(query);
  if (!q) return true;
  const haystack = normalizeSearch(`${school.name} ${school.uni} ${school.city} ${school.category}`);
  return q.split(' ').filter(Boolean).every((token) => haystack.includes(token));
}

const MixanografikoPage: React.FC = () => {
  const [meanGrade, setMeanGrade] = useState('');
  const [rankedIds, setRankedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    const s = loadState();
    setMeanGrade(s.meanGrade);
    setRankedIds(s.rankedIds);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ meanGrade, rankedIds }));
  }, [hydrated, meanGrade, rankedIds]);

  const schoolsById = useMemo(() => {
    const map = new Map<string, School>();
    for (const s of ALL_SCHOOLS) map.set(s.id, s);
    return map;
  }, []);

  const rankedSchools = useMemo(
    () => rankedIds.map((id) => schoolsById.get(id)).filter((s): s is School => Boolean(s)),
    [rankedIds, schoolsById],
  );

  const numericMean = meanGrade.trim() ? Number(meanGrade.trim().replace(',', '.')) : null;
  const validMean = numericMean !== null && Number.isFinite(numericMean) && numericMean >= 0 && numericMean <= 20;

  const isEligible = (school: School): boolean => {
    if (!validMean) return false;
    const ebeThreshold = parseEbeGrade(school.ebe);
    if (ebeThreshold === null) return true;
    return (numericMean as number) >= ebeThreshold;
  };

  const availableSchools = useMemo(() => {
    if (!validMean) return [];
    const rankedSet = new Set(rankedIds);
    return ALL_SCHOOLS.filter(
      (s) => !rankedSet.has(s.id) && isEligible(s) && schoolMatchesQuery(s, searchQuery),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rankedIds, searchQuery, validMean, numericMean]);

  const addSchool = (id: string) => {
    setRankedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };
  const removeSchool = (id: string) => {
    setRankedIds((prev) => prev.filter((x) => x !== id));
  };
  const moveUp = (index: number) => {
    if (index === 0) return;
    setRankedIds((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };
  const moveDown = (index: number) => {
    setRankedIds((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index + 1], next[index]] = [next[index], next[index + 1]];
      return next;
    });
  };
  const clearAll = () => setRankedIds([]);

  const reorderTo = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    setRankedIds((prev) => {
      const next = [...prev];
      const [moved] = next.splice(draggedIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
    setDraggedIndex(targetIndex);
  };

  return (
    <motion.div
      className="min-h-screen bg-[#ff97b2] dark:bg-[#2d1c48] text-gray-900 dark:text-gray-100 transition-colors duration-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative overflow-hidden bg-gradient-to-r from-[#f07f97] via-[#f07f97] to-[#e06d88] text-white py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-[4.5rem] h-[4.5rem] rounded-2xl bg-white/20 mb-4">
            <MenuIconImg src={MENU_ICONS.mixanografiko} className="w-14 h-14" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 tracking-tight">Μηχανογραφικό</h1>
          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
            Πρόβα μηχανογραφικού — κατάταξε με σειρά προτίμησης τις σχολές που πληροίς την ΕΒΕ τους
          </p>
          <p className="text-xs text-white/70 mt-3">💡 Ιδέα της Βαλεντίνας</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Mean grade input */}
        <div className="rounded-2xl border border-[#f07f97]/20 dark:border-white/10 bg-white dark:bg-[#3a2658] p-4 sm:p-5">
          <h2 className="font-black text-gray-900 dark:text-white mb-3">Ο μέσος όρος σου</h2>
          <label className="block max-w-xs">
            <span className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
              Μέσος όρος βαθμών (0–20) <span className="text-[#f07f97]">*</span>
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={meanGrade}
              onChange={(e) => setMeanGrade(e.target.value)}
              placeholder="π.χ. 15,4"
              className="w-full px-3 py-2.5 rounded-xl border border-[#f07f97]/25 dark:border-white/15 bg-white dark:bg-[#2d1c48] outline-none focus:border-[#f07f97] tabular-nums"
            />
            {!validMean && meanGrade.trim() ? (
              <span className="text-xs text-red-600 dark:text-red-400 mt-1 block">Πρέπει να είναι 0–20.</span>
            ) : (
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                Μπορείς να δηλώσεις μια σχολή μόνο αν ο μέσος όρος σου είναι μεγαλύτερος ή ίσος από την ΕΒΕ της.
              </span>
            )}
          </label>
        </div>

        {/* Ranked preference list */}
        <div className="rounded-2xl border border-[#f07f97]/20 dark:border-white/10 bg-white dark:bg-[#3a2658] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-black text-gray-900 dark:text-white">
              Η σειρά προτίμησής σου{' '}
              <span className="text-[#f07f97] font-black">({rankedSchools.length})</span>
            </h2>
            {rankedSchools.length > 0 ? (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              >
                Καθαρισμός όλων
              </button>
            ) : null}
          </div>

          {rankedSchools.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">
              Δεν έχεις δηλώσει σχολές ακόμα. Ψάξε παρακάτω και πρόσθεσέ τες με τη σειρά που τις προτιμάς — μπορείς
              να τις σύρεις για να αλλάξεις τη σειρά.
            </p>
          ) : (
            <ul className="space-y-2">
              {rankedSchools.map((school, index) => (
                <li
                  key={school.id}
                  draggable
                  onDragStart={() => setDraggedIndex(index)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    reorderTo(index);
                  }}
                  onDragEnd={() => setDraggedIndex(null)}
                  className={`flex items-center gap-2 sm:gap-3 rounded-xl border border-[#f07f97]/15 dark:border-white/10 bg-[#fff5f8]/60 dark:bg-[#2d1c48]/50 px-3 py-2.5 cursor-grab active:cursor-grabbing transition-opacity ${
                    draggedIndex === index ? 'opacity-40' : ''
                  }`}
                >
                  <GripVertical className="w-4 h-4 text-gray-400 shrink-0 hidden sm:block" aria-hidden />
                  <span className="shrink-0 w-7 h-7 rounded-full bg-[#f07f97] text-white text-sm font-black flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                      {school.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {school.uni} · {school.city} · ΕΒΕ {formatEbeDisplay(school.ebe)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      aria-label="Μετακίνηση πάνω"
                      className="p-1.5 rounded-lg text-gray-500 hover:bg-white dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(index)}
                      disabled={index === rankedSchools.length - 1}
                      aria-label="Μετακίνηση κάτω"
                      className="p-1.5 rounded-lg text-gray-500 hover:bg-white dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSchool(school.id)}
                      aria-label="Αφαίρεση"
                      className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Search + add schools */}
        <div className="rounded-2xl border border-[#f07f97]/20 dark:border-white/10 bg-white dark:bg-[#3a2658] p-4 sm:p-5">
          <h2 className="font-black text-gray-900 dark:text-white mb-3">Δήλωσε σχολές</h2>

          {!validMean ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">
              Συμπλήρωσε τον μέσο όρο σου παραπάνω για να δεις ποιες σχολές μπορείς να δηλώσεις.
            </p>
          ) : (
            <>
              <div className="relative mb-4">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="π.χ. Πληροφορικής, Αθήνα, ΑΠΘ..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[#f07f97]/25 dark:border-white/15 bg-white dark:bg-[#2d1c48] outline-none focus:border-[#f07f97]"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Καθαρισμός αναζήτησης"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : null}
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                {availableSchools.length} σχολές πληρούν την ΕΒΕ τους με μέσο όρο {meanGrade}
              </p>

              <div className="max-h-[28rem] overflow-y-auto space-y-2 pr-1">
                {availableSchools.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">
                    Δεν βρέθηκαν σχολές που να πληροίς{searchQuery ? ` για «${searchQuery}»` : ''}.
                  </p>
                ) : (
                  availableSchools.map((school) => (
                    <div
                      key={school.id}
                      className="flex items-center gap-3 rounded-xl border border-[#f07f97]/10 dark:border-white/10 px-3 py-2.5 hover:bg-[#fff5f8]/60 dark:hover:bg-white/5"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                          {school.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {school.uni} · {school.city} · ΕΒΕ {formatEbeDisplay(school.ebe)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addSchool(school.id)}
                        aria-label={`Δήλωση ${school.name}`}
                        className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#f07f97]/10 text-[#f07f97] hover:bg-[#f07f97] hover:text-white font-bold text-sm transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Δήλωση
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        <p className="text-xs text-gray-600 dark:text-gray-400 text-center pt-2 pb-8 leading-relaxed">
          ΕΒΕ 2026 από τη σελίδα{' '}
          <a href="/sxoles" className="text-[#f07f97] font-semibold hover:underline">
            Σχολές
          </a>
          . Πρόβα εξάσκησης — για την πραγματική υποβολή χρησιμοποίησε το επίσημο σύστημα του Υπουργείου Παιδείας:{' '}
          <a
            href={MINEDU_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#f07f97] font-semibold hover:underline"
          >
            minedu.gov.gr/mixanografiko
            <ExternalLink className="w-3 h-3" aria-hidden />
          </a>
        </p>
      </div>
    </motion.div>
  );
};

export default MixanografikoPage;
