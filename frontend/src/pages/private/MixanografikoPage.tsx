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
import { SCHOOL_COEFFICIENTS_2026, type SchoolCoefficientsEntry } from '@/data/schoolCoefficients2026';
import {
  LANGUAGE_SPECIAL_SUBJECT_KEYS,
  SPECIAL_EXAM_SUBJECTS,
  isSpecialCoefficientSubject,
  normalizeSearch,
  type SpecialExamSubjectKey,
} from '@/utils/schoolCoefficientsUtils';
import { formatEbeDisplay, matchSchoolBasis, parseEbeGrade } from '@/utils/schoolBasisMatching';
import { parseExamGrade, type GradeInputs } from '@/utils/moriaCalculation';

const STORAGE_KEY = 'technotesgr_mixanografiko_v3';
const MINEDU_URL = 'https://www.minedu.gov.gr/mixanografiko';

const EMPTY_SPECIAL_GRADES: GradeInputs = Object.fromEntries(
  SPECIAL_EXAM_SUBJECTS.map(({ key }) => [key, '']),
);

type StoredState = {
  meanGrade: string;
  specialGrades: GradeInputs;
  rankedIds: string[];
};

function loadState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { meanGrade: '', specialGrades: { ...EMPTY_SPECIAL_GRADES }, rankedIds: [] };
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    return {
      meanGrade: typeof parsed.meanGrade === 'string' ? parsed.meanGrade : '',
      specialGrades:
        parsed.specialGrades && typeof parsed.specialGrades === 'object'
          ? { ...EMPTY_SPECIAL_GRADES, ...parsed.specialGrades }
          : { ...EMPTY_SPECIAL_GRADES },
      rankedIds: Array.isArray(parsed.rankedIds)
        ? parsed.rankedIds.filter((x): x is string => typeof x === 'string')
        : [],
    };
  } catch {
    return { meanGrade: '', specialGrades: { ...EMPTY_SPECIAL_GRADES }, rankedIds: [] };
  }
}

function schoolMatchesQuery(school: School, query: string): boolean {
  const q = normalizeSearch(query);
  if (!q) return true;
  const haystack = normalizeSearch(`${school.name} ${school.uni} ${school.city} ${school.category}`);
  return q.split(' ').filter(Boolean).every((token) => haystack.includes(token));
}

/** Ποια ειδικά μαθήματα απαιτεί μια σχολή — null αν δεν απαιτεί κανένα, 'anyLanguage' αν δέχεται
 * οποιαδήποτε ξένη γλώσσα, αλλιώς η λίστα των συγκεκριμένων ειδικών μαθημάτων που απαιτεί. */
function getRequiredSpecialKeys(entry: SchoolCoefficientsEntry): SpecialExamSubjectKey[] | 'anyLanguage' | null {
  const specialCoefs = entry.coefficients.filter((c) => isSpecialCoefficientSubject(c.subject));
  if (specialCoefs.length === 0) return null;
  if (specialCoefs.some((c) => c.subject === 'Ειδικό Μάθημα')) return 'anyLanguage';
  return specialCoefs.map((c) => c.subject as SpecialExamSubjectKey);
}

type Eligibility = { eligible: boolean; missing: boolean };

function evaluateSchool(
  school: School,
  entry: SchoolCoefficientsEntry | undefined,
  coreMean: number | null,
  specialGrades: GradeInputs,
): Eligibility {
  const ebeThreshold = parseEbeGrade(school.ebe);
  if (ebeThreshold === null) return { eligible: true, missing: false };

  const requiredKeys = entry ? getRequiredSpecialKeys(entry) : null;

  if (requiredKeys === null) {
    if (coreMean === null) return { eligible: false, missing: true };
    return { eligible: coreMean >= ebeThreshold, missing: false };
  }

  if (requiredKeys === 'anyLanguage') {
    const entered = LANGUAGE_SPECIAL_SUBJECT_KEYS.map((k) => parseExamGrade(specialGrades[k] ?? '')).filter(
      (g): g is number => g !== null,
    );
    if (entered.length === 0) return { eligible: false, missing: true };
    return { eligible: Math.max(...entered) >= ebeThreshold, missing: false };
  }

  const grades = requiredKeys.map((k) => parseExamGrade(specialGrades[k] ?? ''));
  if (grades.some((g) => g === null)) return { eligible: false, missing: true };
  const validGrades = grades as number[];
  return { eligible: Math.min(...validGrades) >= ebeThreshold, missing: false };
}

function requiredSubjectsLabel(entry: SchoolCoefficientsEntry | undefined): string | null {
  if (!entry) return null;
  const requiredKeys = getRequiredSpecialKeys(entry);
  if (requiredKeys === null) return null;
  if (requiredKeys === 'anyLanguage') return 'Ξένη γλώσσα (μία από Αγγλικά/Γαλλικά/Γερμανικά/Ιταλικά)';
  return requiredKeys.join(', ');
}

const MixanografikoPage: React.FC = () => {
  const [meanGrade, setMeanGrade] = useState('');
  const [specialGrades, setSpecialGrades] = useState<GradeInputs>(EMPTY_SPECIAL_GRADES);
  const [rankedIds, setRankedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedGrades, setAppliedGrades] = useState<{
    meanGrade: string;
    specialGrades: GradeInputs;
  } | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    const s = loadState();
    setMeanGrade(s.meanGrade);
    setSpecialGrades(s.specialGrades);
    setRankedIds(s.rankedIds);
    const hasGrades =
      s.meanGrade.trim() !== '' ||
      SPECIAL_EXAM_SUBJECTS.some(({ key }) => parseExamGrade(s.specialGrades[key] ?? '') !== null);
    if (hasGrades) {
      setAppliedGrades({ meanGrade: s.meanGrade, specialGrades: { ...s.specialGrades } });
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ meanGrade, specialGrades, rankedIds }));
  }, [hydrated, meanGrade, specialGrades, rankedIds]);

  const schoolsById = useMemo(() => {
    const map = new Map<string, School>();
    for (const s of ALL_SCHOOLS) map.set(s.id, s);
    return map;
  }, []);

  /** School.id -> αντίστοιχο SchoolCoefficientsEntry (για να ξέρουμε ποια ειδικά μαθήματα απαιτεί). */
  const coeffEntryBySchoolId = useMemo(() => {
    const map = new Map<string, SchoolCoefficientsEntry>();
    for (const entry of SCHOOL_COEFFICIENTS_2026) {
      const basis = matchSchoolBasis(entry);
      if (basis) map.set(basis.id, entry);
    }
    return map;
  }, []);

  const rankedSchools = useMemo(
    () => rankedIds.map((id) => schoolsById.get(id)).filter((s): s is School => Boolean(s)),
    [rankedIds, schoolsById],
  );

  const numericMean = meanGrade.trim() ? Number(meanGrade.trim().replace(',', '.')) : null;
  const validMean = numericMean !== null && Number.isFinite(numericMean) && numericMean >= 0 && numericMean <= 20;
  const anySpecialGradeEntered = SPECIAL_EXAM_SUBJECTS.some(
    ({ key }) => parseExamGrade(specialGrades[key] ?? '') !== null,
  );
  const canSearch = validMean || anySpecialGradeEntered;

  const appliedNumericMean = appliedGrades?.meanGrade.trim()
    ? Number(appliedGrades.meanGrade.trim().replace(',', '.'))
    : null;
  const appliedValidMean =
    appliedNumericMean !== null &&
    Number.isFinite(appliedNumericMean) &&
    appliedNumericMean >= 0 &&
    appliedNumericMean <= 20;
  const appliedCoreMean = appliedValidMean ? (appliedNumericMean as number) : null;
  const appliedSpecialGrades = appliedGrades?.specialGrades ?? EMPTY_SPECIAL_GRADES;
  const appliedAnySpecial = SPECIAL_EXAM_SUBJECTS.some(
    ({ key }) => parseExamGrade(appliedSpecialGrades[key] ?? '') !== null,
  );
  const hasAppliedSearch = appliedGrades !== null && (appliedValidMean || appliedAnySpecial);

  const gradesChangedSinceSearch =
    !appliedGrades ||
    appliedGrades.meanGrade !== meanGrade ||
    SPECIAL_EXAM_SUBJECTS.some(
      ({ key }) => (appliedGrades.specialGrades[key] ?? '') !== (specialGrades[key] ?? ''),
    );

  const runSearch = () => {
    if (!canSearch) return;
    setAppliedGrades({
      meanGrade,
      specialGrades: { ...specialGrades },
    });
  };

  const setSpecialGrade = (key: string, value: string) => {
    setSpecialGrades((prev) => ({ ...prev, [key]: value }));
  };

  const evalFor = (school: School, grades: GradeInputs, coreMean: number | null): Eligibility =>
    evaluateSchool(school, coeffEntryBySchoolId.get(school.id), coreMean, grades);

  const availableSchools = useMemo(() => {
    if (!hasAppliedSearch) return [];
    const rankedSet = new Set(rankedIds);
    return ALL_SCHOOLS.filter((s) => {
      if (rankedSet.has(s.id)) return false;
      if (!schoolMatchesQuery(s, searchQuery)) return false;
      return evalFor(s, appliedSpecialGrades, appliedCoreMean).eligible;
    });
  }, [rankedIds, searchQuery, hasAppliedSearch, appliedSpecialGrades, appliedCoreMean, coeffEntryBySchoolId]);

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
      <header className="border-b border-[#f07f97]/35 dark:border-white/10 bg-white/90 dark:bg-[#3a2658]/90 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#ff97b2]/15 dark:bg-white/10 mb-3">
            <MenuIconImg src={MENU_ICONS.mixanografiko} className="w-9 h-9" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-[#faf5ef] tracking-tight">Μηχανογραφικό</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Πρόβα μηχανογραφικού — κατάταξε με σειρά προτίμησης τις σχολές που πληροίς την ΕΒΕ τους
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-semibold">💡 Η ιδέα είναι της Βαλεντίνας</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Grades */}
        <div className="rounded-2xl border border-[#f07f97]/20 dark:border-white/10 bg-white dark:bg-[#3a2658] p-4 sm:p-5">
          <h2 className="font-black text-gray-900 dark:text-white mb-3">Οι βαθμοί σου</h2>
          <label className="block max-w-xs mb-5">
            <span className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
              Μέσος όρος 4 βασικών μαθημάτων (0–20)
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
                Για σχολές χωρίς ειδικό μάθημα, συγκρίνεται με την ΕΒΕ τους.
              </span>
            )}
          </label>

          <h3 className="text-sm font-black text-gray-900 dark:text-white mb-2">Ειδικά μαθήματα</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Συμπλήρωσε μόνο όσα έχεις δώσει. Σχολές που απαιτούν ειδικό μάθημα που δεν έχεις συμπληρώσει δεν θα σου
            εμφανίζονται.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
            {SPECIAL_EXAM_SUBJECTS.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between gap-3 py-1.5 border-t border-[#f07f97]/10 dark:border-white/10">
                <span className="text-sm text-gray-700 dark:text-gray-200">{label}</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={specialGrades[key] ?? ''}
                  onChange={(e) => setSpecialGrade(key, e.target.value)}
                  placeholder="0–20"
                  className="w-20 px-2 py-1.5 rounded-lg border border-[#f07f97]/25 dark:border-white/15 bg-white dark:bg-[#2d1c48] text-right tabular-nums outline-none focus:border-[#f07f97]"
                  aria-label={`Βαθμός ${label}`}
                />
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={runSearch}
              disabled={!canSearch}
              className="inline-flex items-center gap-2 rounded-xl bg-[#f07f97] px-5 py-2.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#e86a8f] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Search className="w-4 h-4" aria-hidden />
              Αναζήτηση
            </button>
            {gradesChangedSinceSearch && canSearch ? (
              <span className="text-xs font-semibold text-[#f07f97] dark:text-[#ffc4d6]">
                Έχεις αλλάξει βαθμούς — πάτα Αναζήτηση για ενημέρωση.
              </span>
            ) : hasAppliedSearch ? (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Εμφανίζονται σχολές με βάση τους τελευταίους βαθμούς που αναζήτησες.
              </span>
            ) : null}
          </div>
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
              {rankedSchools.map((school, index) => {
                const entry = coeffEntryBySchoolId.get(school.id);
                const requiredLabel = requiredSubjectsLabel(entry);
                return (
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
                        {requiredLabel ? ` · Απαιτεί: ${requiredLabel}` : ''}
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
                );
              })}
            </ul>
          )}
        </div>

        {/* Search + add schools */}
        <div className="rounded-2xl border border-[#f07f97]/20 dark:border-white/10 bg-white dark:bg-[#3a2658] p-4 sm:p-5">
          <h2 className="font-black text-gray-900 dark:text-white mb-3">Δήλωσε σχολές</h2>

          {!hasAppliedSearch ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">
              Συμπλήρωσε τον μέσο όρο σου ή/και κάποιο ειδικό μάθημα και πάτα{' '}
              <span className="font-bold text-[#f07f97]">Αναζήτηση</span> για να δεις ποιες σχολές μπορείς να
              δηλώσεις.
            </p>
          ) : (
            <>
              {gradesChangedSinceSearch ? (
                <p className="mb-4 rounded-xl border border-[#f07f97]/30 bg-[#fff5f8] px-4 py-3 text-sm font-semibold text-[#f07f97] dark:border-[#ffc4d6]/30 dark:bg-[#2d1c48] dark:text-[#ffc4d6]">
                  Άλλαξες βαθμούς — πάτα ξανά <span className="font-black">Αναζήτηση</span> πάνω για να ανανεωθεί η
                  λίστα.
                </p>
              ) : null}
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
                {availableSchools.length} σχολές πληρούν τις προϋποθέσεις τους με τους βαθμούς που έδωσες
              </p>

              <div className="max-h-[28rem] overflow-y-auto space-y-2 pr-1">
                {availableSchools.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">
                    Δεν βρέθηκαν σχολές που να πληροίς{searchQuery ? ` για «${searchQuery}»` : ''}.
                  </p>
                ) : (
                  availableSchools.map((school) => {
                    const entry = coeffEntryBySchoolId.get(school.id);
                    const requiredLabel = requiredSubjectsLabel(entry);
                    return (
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
                            {requiredLabel ? ` · Απαιτεί: ${requiredLabel}` : ''}
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
                    );
                  })
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
            className="inline-flex items-center gap-1 text-[#00000] font-semibold hover:underline"
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
