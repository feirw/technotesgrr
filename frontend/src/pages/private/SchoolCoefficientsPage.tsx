import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X, GraduationCap, ExternalLink } from 'lucide-react';
import { MENU_ICONS, MenuIconImg } from '@/data/menuIcons';
import {
  COEFFICIENTS_YEAR,
  FIELD_4_TITLE,
  SCHOOL_COEFFICIENTS_2026,
  type SchoolCoefficientsEntry,
} from '@/data/schoolCoefficients2026';
import { matchesSchool } from '@/utils/schoolCoefficientsUtils';

const SchoolCard: React.FC<{ school: SchoolCoefficientsEntry; index: number }> = ({
  school,
  index,
}) => {
  const total = school.coefficients.reduce((sum, c) => sum + c.weight, 0);

  return (
    <motion.article
      className="rounded-2xl border border-[#f07f97]/25 dark:border-white/15 bg-white dark:bg-[#3a2658] shadow-md overflow-hidden"
      initial={index < 12 ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.24), duration: 0.2 }}
    >
      <div className="px-4 sm:px-5 py-4 border-b border-[#f07f97]/15 dark:border-white/10">
        <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white leading-snug">
          {school.name}
        </h2>
        
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#fff5f8]/80 dark:bg-[#2d1c48]/60 text-left">
              <th className="px-4 py-2.5 font-bold text-[#f07f97]">Μάθημα</th>
              <th className="px-4 py-2.5 font-bold text-[#f07f97] w-28 text-right">Βαρύτητα</th>
            </tr>
          </thead>
          <tbody>
            {school.coefficients.map((coef) => {
              const isInformatics = coef.subject.includes('Πληροφορική');
              return (
                <tr
                  key={`${school.id}-${coef.subject}`}
                  className="border-t border-gray-100 dark:border-white/5"
                >
                  <td className="px-4 py-2.5 text-gray-800 dark:text-gray-100">
                    <span className={isInformatics ? 'font-bold text-[#f07f97]' : undefined}>
                      {coef.subject}
                    </span>
                    {coef.note ? (
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        {coef.note}
                      </p>
                    ) : null}
                  </td>
                  <td
                    className={`px-4 py-2.5 text-right font-black tabular-nums ${
                      isInformatics ? 'text-[#f07f97]' : 'text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {coef.weight}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.article>
  );
};

const SchoolCoefficientsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(
    () => SCHOOL_COEFFICIENTS_2026.filter((s) => matchesSchool(s, searchQuery)),
    [searchQuery],
  );

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
            <MenuIconImg src={MENU_ICONS.syntelestesSxolon} className="w-9 h-9" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-[#faf5ef] tracking-tight">
            Συντελεστές Σχολών
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            {FIELD_4_TITLE} — Πανελλήνιες {COEFFICIENTS_YEAR}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-4 leading-relaxed">
          Πηγή δεδομένων:{' '}
          <a
            href="https://aeitei.gr/sintelestes-barititas.php"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#f07f97] dark:text-[#ff97b2] hover:underline font-semibold"
          >
            AeiTei.gr
            <ExternalLink className="w-3 h-3" aria-hidden />
          </a>
          . Οι συντελεστές αφορούν το 4ο επιστημονικό πεδίο ({COEFFICIENTS_YEAR}).
        </p>
        </div>
      </header>

      <div className="sticky top-20 z-20 bg-white/95 dark:bg-[#3a2658]/95 backdrop-blur-lg border-b border-[#f07f97]/20 dark:border-white/10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Αναζήτηση σχολής (π.χ. ΟΠΑ, Αθήνα, Αγγλικά)..."
              autoComplete="off"
              spellCheck={false}
              className="w-full px-4 py-3 pl-11 pr-10 rounded-xl border-2 border-[#f07f97]/25 dark:border-white/15 focus:border-[#f07f97] focus:ring-2 focus:ring-[#f07f97]/25 outline-none bg-white dark:bg-[#2d1c48] text-gray-900 dark:text-white"
              aria-label="Αναζήτηση σχολής"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label="Καθαρισμός αναζήτησης"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2 flex-wrap">
            <GraduationCap className="w-4 h-4 text-[#f07f97]" aria-hidden />
            <span>
              <span className="font-bold text-[#f07f97]">{filtered.length}</span> από{' '}
              {SCHOOL_COEFFICIENTS_2026.length} σχολές
            </span>
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 pb-16 space-y-4">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 py-16">
            Δεν βρέθηκαν σχολές για «{searchQuery}».
          </p>
        ) : (
          filtered.map((school, index) => (
            <SchoolCard key={school.id} school={school} index={index} />
          ))
        )}

        
      </main>
    </motion.div>
  );
};

export default SchoolCoefficientsPage;
