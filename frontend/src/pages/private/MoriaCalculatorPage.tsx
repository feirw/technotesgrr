import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, ExternalLink, Info, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MENU_ICONS, MenuIconImg } from '@/data/menuIcons';
import {
  COEFFICIENTS_YEAR,
  FIELD_4_TITLE,
  SCHOOL_COEFFICIENTS_2026,
  type SchoolCoefficientsEntry,
} from '@/data/schoolCoefficients2026';
import type { School } from '@/data/schools';
import {
  calculateSchoolMoria,
  coreGradesComplete,
  parseExamGrade,
  schoolUsesOnlyCoreExams,
  type GradeInputs,
  type SchoolMoriaResult,
} from '@/utils/moriaCalculation';
import {
  averageCoreGrade,
  formatGradeDisplay,
  formatEbeDisplay,
  formatMoriaDisplay,
  getSchoolDisplayCity,
  matchSchoolBasis,
  parseEbeGrade,
} from '@/utils/schoolBasisMatching';
import {
  CORE_EXAM_SUBJECTS,
  matchesSchool,
  SPECIAL_EXAM_SUBJECTS,
} from '@/utils/schoolCoefficientsUtils';

const EMPTY_GRADES: GradeInputs = Object.fromEntries(
  [...CORE_EXAM_SUBJECTS, ...SPECIAL_EXAM_SUBJECTS.map(({ key }) => key)].map((key) => [key, '']),
);

type SchoolRow = {
  school: SchoolCoefficientsEntry;
  basis: School | null;
  result: SchoolMoriaResult | null;
};

function shortSubjectLabel(subject: string): string {
  if (subject === 'Νεοελληνική Γλώσσα και Λογοτεχνία') return 'Νεοελληνική';
  return subject;
}

function extractUniLabel(name: string): string {
  const match = name.match(/\(([^)]+)\)\s*$/);
  return match?.[1] ?? '';
}

function isSecuritySchoolRow(row: SchoolRow): boolean {
  if (row.basis?.category === 'Σώματα Ασφαλείας & Στρατιωτικές') return true;
  return /\(ΑΣΤΥΝ ΣΧΟΛ\)|\(ΣΠΑ\)|\(ΣΣΑΣ\)|\(ΣΣΕ\)|\(ΣΙ\)|\(ΣΜΥΑ\)|\(ΣΜΥ\)|\(ΣΜΥΝ\)|\(ΛΣ-ΕΛΑΚΤ\)/.test(
    row.school.name,
  );
}

function schoolRowGroup(row: SchoolRow): number {
  if (isSecuritySchoolRow(row)) return 2;
  if (!schoolUsesOnlyCoreExams(row.school)) return 1;
  return 0;
}

const DiffValue: React.FC<{ value: number | null; invert?: boolean }> = ({ value, invert }) => {
  if (value === null) return <span className="text-gray-400">—</span>;
  const positive = invert ? value < 0 : value > 0;
  const negative = invert ? value > 0 : value < 0;
  const cls = positive
    ? 'text-emerald-600 dark:text-emerald-400'
    : negative
      ? 'text-red-600 dark:text-red-400'
      : 'text-gray-700 dark:text-gray-200';
  const prefix = value > 0 ? '+' : value < 0 ? '−' : '';
  return (
    <span className={`font-black tabular-nums ${cls}`}>
      {prefix}
      {formatMoriaDisplay(Math.abs(value))}
    </span>
  );
};

const StatCell: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="text-center px-2 py-2">
    <div className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">{label}</div>
    <div className="text-lg sm:text-xl font-black tabular-nums">{children}</div>
  </div>
);

const SchoolResultCard: React.FC<{ row: SchoolRow; averageGrade: number | null; index: number }> = ({
  row,
  averageGrade,
  index,
}) => {
  const { school, basis, result } = row;
  const moriaDiff = result && basis ? result.total - basis.points : null;
  const ebe = basis ? parseEbeGrade(basis.ebe) : null;
  const ebeDiff = averageGrade !== null && ebe !== null ? averageGrade - ebe : null;
  const uniLabel = extractUniLabel(school.name);
  const city = getSchoolDisplayCity(school, basis);
  const locationLabel = [uniLabel, city].filter(Boolean).join(' · ');
  const departmentName = school.name.replace(/\s*\([^)]+\)\s*$/, '').replace(/\s*\([^)]+\)\s*$/, '');

  return (
    <motion.article
      className="rounded-2xl border border-[#f07f97]/25 dark:border-white/15 bg-white dark:bg-[#3a2658] shadow-md overflow-hidden"
      initial={index < 10 ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.015, 0.2), duration: 0.2 }}
    >
      <div className="p-4 sm:p-5 flex flex-col lg:flex-row gap-4 lg:items-start">
        <div className="flex-1 min-w-0">
          {locationLabel ? (
            <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
              {locationLabel}
            </p>
          ) : null}
          <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white leading-snug">
            {departmentName}
          </h2>
          {basis?.requirements ? (
            <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">{basis.requirements}</p>
          ) : null}
          {!schoolUsesOnlyCoreExams(school) ? (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Απαιτεί επιπλέον βαθμούς (ειδικό μάθημα κ.λπ.)
            </p>
          ) : null}
        </div>

        <div className="shrink-0 w-full lg:w-[min(100%,22rem)]">
          <div className="grid grid-cols-3 border border-[#f07f97]/20 dark:border-white/10 rounded-xl overflow-hidden text-sm">
            <StatCell label="Μόρια">
              {result ? (
                <span className="text-[#f07f97]">{formatMoriaDisplay(result.total)}</span>
              ) : (
                <span className="text-gray-400">—</span>
              )}
            </StatCell>
            <StatCell label="Βάση 2025">
              {basis ? (
                <span>{formatMoriaDisplay(basis.points)}</span>
              ) : (
                <span className="text-gray-400">—</span>
              )}
            </StatCell>
            <StatCell label="Διαφορά">
              <DiffValue value={moriaDiff} />
            </StatCell>
            <StatCell label="Μ.Ο.">
              {averageGrade !== null ? (
                <span>{formatGradeDisplay(averageGrade)}</span>
              ) : (
                <span className="text-gray-400">—</span>
              )}
            </StatCell>
            <StatCell label="ΕΒΕ 2026">
              {basis ? (
                <span>{formatEbeDisplay(basis.ebe)}</span>
              ) : (
                <span className="text-gray-400">—</span>
              )}
            </StatCell>
            <StatCell label="Διαφορά">
              {ebeDiff !== null ? (
                <span
                  className={
                    ebeDiff >= 0
                      ? 'text-emerald-600 dark:text-emerald-400 font-black tabular-nums'
                      : 'text-red-600 dark:text-red-400 font-black tabular-nums'
                  }
                >
                  {ebeDiff >= 0 ? '+' : ''}
                  {formatGradeDisplay(ebeDiff)}
                </span>
              ) : (
                <span className="text-gray-400">—</span>
              )}
            </StatCell>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

const MoriaCalculatorPage: React.FC = () => {
  const [grades, setGrades] = useState<GradeInputs>(EMPTY_GRADES);
  const [searchQuery, setSearchQuery] = useState('');

  const parsedCoreGrades = useMemo(
    () =>
      CORE_EXAM_SUBJECTS.map((s) => parseExamGrade(grades[s] ?? '')).filter(
        (g): g is number => g !== null,
      ),
    [grades],
  );

  const averageGrade = useMemo(() => averageCoreGrade(parsedCoreGrades), [parsedCoreGrades]);
  const coreComplete = coreGradesComplete(grades);

  const allRows = useMemo(
    () =>
      SCHOOL_COEFFICIENTS_2026.map((school) => ({
        school,
        basis: matchSchoolBasis(school),
        result: calculateSchoolMoria(school, grades),
      })),
    [grades],
  );

  const filteredRows = useMemo(() => {
    const rows = allRows.filter((row) => matchesSchool(row.school, searchQuery));

    rows.sort((a, b) => {
      const groupDiff = schoolRowGroup(a) - schoolRowGroup(b);
      if (groupDiff !== 0) return groupDiff;

      if (a.result && !b.result) return -1;
      if (!a.result && b.result) return 1;

      return (b.basis?.points ?? -1) - (a.basis?.points ?? -1);
    });

    return rows;
  }, [allRows, searchQuery]);

  const coreOnlyMoria = useMemo(() => {
    if (!coreComplete) return [];
    return allRows
      .filter((row) => schoolUsesOnlyCoreExams(row.school) && row.result)
      .map((row) => row.result!.total);
  }, [coreComplete, allRows]);

  const moriaRange =
    coreOnlyMoria.length > 0
      ? { min: Math.min(...coreOnlyMoria), max: Math.max(...coreOnlyMoria) }
      : null;

  const calculableCount = filteredRows.filter((row) => row.result !== null).length;
  const coreOnlyCount = SCHOOL_COEFFICIENTS_2026.filter(schoolUsesOnlyCoreExams).length;

  const setGrade = (key: string, value: string) => {
    setGrades((prev) => ({ ...prev, [key]: value }));
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
            <MenuIconImg src={MENU_ICONS.ypologismosMorion} className="w-14 h-14" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 tracking-tight">
            Υπολογισμός Μορίων
          </h1>
          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
            {FIELD_4_TITLE} — Πανελλήνιες {COEFFICIENTS_YEAR}
          </p>
          <p className="text-sm text-white/80 mt-3">
            Πηγή συντελεστών:{' '}
            <a
              href="https://aeitei.gr/sintelestes-barititas.php"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold underline decoration-2 underline-offset-2"
            >
              AeiTei.gr
              <ExternalLink className="w-3.5 h-3.5" aria-hidden />
            </a>
            . Βάσεις εισαγωγής {COEFFICIENTS_YEAR}. Ο υπολογισμός είναι ενδεικτικός.
          </p>
        </div>
      </div>

      <div className="sticky top-20 z-20 bg-white/95 dark:bg-[#3a2658]/95 backdrop-blur-lg border-b border-[#f07f97]/20 dark:border-white/10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-[#f07f97]/20 dark:border-white/10 bg-[#fff5f8]/70 dark:bg-[#2d1c48]/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="w-4 h-4 text-[#f07f97]" aria-hidden />
                <h2 className="font-black text-gray-900 dark:text-white">Βαθμολογία</h2>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {CORE_EXAM_SUBJECTS.map((subject) => (
                    <tr key={subject} className="border-t border-[#f07f97]/10 dark:border-white/10">
                      <td className="py-2 pr-3 text-gray-700 dark:text-gray-200">
                        {shortSubjectLabel(subject)}
                      </td>
                      <td className="py-2 w-24">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={grades[subject] ?? ''}
                          onChange={(e) => setGrade(subject, e.target.value)}
                          placeholder="0–20"
                          className="w-full px-2 py-1.5 rounded-lg border border-[#f07f97]/25 dark:border-white/15 bg-white dark:bg-[#2d1c48] text-right tabular-nums outline-none focus:border-[#f07f97]"
                          aria-label={`Βαθμός ${subject}`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 pt-4 border-t border-[#f07f97]/10 dark:border-white/10">
                <h3 className="text-sm font-black text-gray-900 dark:text-white mb-3">Ειδικά Μαθήματα</h3>
                <table className="w-full text-sm">
                  <tbody>
                    {SPECIAL_EXAM_SUBJECTS.map(({ key, label }) => (
                      <tr key={key} className="border-t border-[#f07f97]/10 dark:border-white/10">
                        <td className="py-2 pr-3 text-gray-700 dark:text-gray-200">{label}</td>
                        <td className="py-2 w-24">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={grades[key] ?? ''}
                            onChange={(e) => setGrade(key, e.target.value)}
                            placeholder="0–20"
                            className="w-full px-2 py-1.5 rounded-lg border border-[#f07f97]/25 dark:border-white/15 bg-white dark:bg-[#2d1c48] text-right tabular-nums outline-none focus:border-[#f07f97]"
                            aria-label={`Βαθμός ${label}`}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-[#f07f97]/20 dark:border-white/10 bg-[#fff5f8]/70 dark:bg-[#2d1c48]/50 p-4">
              <h2 className="font-black text-gray-900 dark:text-white mb-3">Συνοπτικά αποτελέσματα</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Για {coreOnlyCount} σχολές χωρίς ειδικά μαθήματα
              </p>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-t border-[#f07f97]/10 dark:border-white/10">
                    <td className="py-2 text-gray-700 dark:text-gray-200">Μέσος όρος (Μ.Ο.)</td>
                    <td className="py-2 text-right font-black tabular-nums">
                      {averageGrade !== null ? formatGradeDisplay(averageGrade) : '—'}
                    </td>
                  </tr>
                  <tr className="border-t border-[#f07f97]/10 dark:border-white/10">
                    <td className="py-2 text-gray-700 dark:text-gray-200">Μόρια από</td>
                    <td className="py-2 text-right font-black tabular-nums text-[#f07f97]">
                      {moriaRange ? formatMoriaDisplay(moriaRange.min) : '—'}
                    </td>
                  </tr>
                  <tr className="border-t border-[#f07f97]/10 dark:border-white/10">
                    <td className="py-2 text-gray-700 dark:text-gray-200">Μόρια έως</td>
                    <td className="py-2 text-right font-black tabular-nums text-[#f07f97]">
                      {moriaRange ? formatMoriaDisplay(moriaRange.max) : '—'}
                    </td>
                  </tr>
                </tbody>
              </table>
              {coreComplete ? (
                <p className="mt-3 text-xs text-gray-600 dark:text-gray-300">
                  Υπολογισμένα μόρια για{' '}
                  <span className="font-bold text-[#f07f97]">{calculableCount}</span> σχολές
                </p>
              ) : (
                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  Συμπλήρωσε τους 4 βαθμούς για άμεσο υπολογισμό.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[#f07f97]/20 dark:border-white/10 bg-white dark:bg-[#2d1c48] p-4 space-y-3">
            <h2 className="font-black text-gray-900 dark:text-white text-sm">Επιλογές εμφάνισης</h2>
            <div className="relative">
              <span className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Αναζήτηση</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="π.χ. ΟΠΑ, Αθήνα, Πάτρα, Αγγλικά..."
                className="w-full px-3 py-2 pl-9 rounded-xl border border-[#f07f97]/25 dark:border-white/15 bg-white dark:bg-[#3a2658] outline-none focus:border-[#f07f97]"
              />
              <Search className="absolute left-3 top-[2.15rem] w-4 h-4 text-gray-400" aria-hidden />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-[2.15rem] text-gray-400 hover:text-gray-600"
                  aria-label="Καθαρισμός"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : null}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Μόρια = (Σ βαθμός × συντελεστής) × 1.000. Συντελεστές από{' '}
              <Link to="/syntelestes-sxolon" className="text-[#f07f97] font-semibold hover:underline">
                Συντελεστές Σχολών
              </Link>
              , βάσεις/ΕΒΕ από{' '}
              <Link to="/sxoles" className="text-[#f07f97] font-semibold hover:underline">
                Σχολές
              </Link>
              . Η λίστα ταξινομείται κατά βάση 2025.
            </p>
          </div>

          <div
            role="note"
            className="rounded-2xl border-2 border-amber-400/80 dark:border-amber-500/50 bg-amber-50 dark:bg-amber-950/30 px-4 py-3.5 sm:px-5 sm:py-4"
          >
            <div className="flex gap-3">
              <Info
                className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5"
                aria-hidden
              />
              <p className="text-sm sm:text-base font-bold text-amber-900 dark:text-amber-100 leading-snug">
                Οι σχολές με ειδικά μαθήματα εμφανίζονται στο τέλος, ακολουθούμενες από τα{' '}
                <span className="text-amber-700 dark:text-amber-200">Σώματα Ασφαλείας & Στρατιωτικές</span>.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 pb-16 space-y-4">
        {filteredRows.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 py-16">
            Δεν βρέθηκαν σχολές για «{searchQuery}».
          </p>
        ) : (
          filteredRows.map((row, index) => {
            const prevRow = index > 0 ? filteredRows[index - 1] : null;
            const prevGroup = prevRow ? schoolRowGroup(prevRow) : null;
            const group = schoolRowGroup(row);
            const showSpecialHeader = prevGroup !== null && prevGroup < 1 && group === 1;
            const showSecurityHeader = prevGroup !== null && prevGroup < 2 && group === 2;

            return (
              <React.Fragment key={row.school.id}>
                {showSpecialHeader ? (
                  <h2 className="pt-4 pb-1 text-sm font-black uppercase tracking-wide text-gray-600 dark:text-gray-300">
                    Σχολές με ειδικά μαθήματα
                  </h2>
                ) : null}
                {showSecurityHeader ? (
                  <h2 className="pt-4 pb-1 text-sm font-black uppercase tracking-wide text-gray-600 dark:text-gray-300">
                    Σώματα Ασφαλείας & Στρατιωτικές
                  </h2>
                ) : null}
                <SchoolResultCard row={row} averageGrade={averageGrade} index={index} />
              </React.Fragment>
            );
          })
        )}

      </main>
    </motion.div>
  );
};

export default MoriaCalculatorPage;
