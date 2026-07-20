import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Search, X } from 'lucide-react';
import { MENU_ICONS, MenuIconImg } from '@/data/menuIcons';
import {
  CORRESPONDENCE_GROUPS,
  NON_CORRESPONDING_DEPARTMENTS,
  type CorrespondenceGroup,
} from '@/data/correspondingDepartments2026';
import { normalizeSearch } from '@/utils/schoolCoefficientsUtils';

const SOURCE_URL = 'https://edu.klimaka.gr/tritobathmia-ekpaideysh/581-antistoixia-tmhmatvn-gia-metagrafes';

function groupMatchesQuery(group: CorrespondenceGroup, query: string): boolean {
  const q = normalizeSearch(query);
  if (!q) return true;
  const haystack = normalizeSearch(
    [group.title, ...group.departments.flatMap((d) => [d.name, d.institution, d.city])].join(' '),
  );
  return q.split(' ').filter(Boolean).every((token) => haystack.includes(token));
}

const AntistoixiesSxolonPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNonCorresponding, setShowNonCorresponding] = useState(false);

  const filteredGroups = useMemo(
    () => CORRESPONDENCE_GROUPS.filter((g) => groupMatchesQuery(g, searchQuery)),
    [searchQuery],
  );

  const filteredNonCorresponding = useMemo(() => {
    const q = normalizeSearch(searchQuery);
    if (!q) return NON_CORRESPONDING_DEPARTMENTS;
    return NON_CORRESPONDING_DEPARTMENTS.filter((d) => {
      const haystack = normalizeSearch(`${d.name} ${d.institution} ${d.city}`);
      return q.split(' ').filter(Boolean).every((token) => haystack.includes(token));
    });
  }, [searchQuery]);

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
            <MenuIconImg src={MENU_ICONS.antistixia} className="w-9 h-9" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-[#faf5ef] tracking-tight">
            Αντιστοιχίες Σχολών 2026-2027
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Επίσημος πίνακας αντίστοιχων τμημάτων ΑΕΙ — ποια τμήματα θεωρούνται «αντίστοιχα» μεταξύ τους για
            μετεγγραφή
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Ακαδημαϊκό έτος 2026-2027. Πηγή:{' '}
            <a
              href={SOURCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#f07f97] dark:text-[#ff97b2] font-semibold underline decoration-2 underline-offset-2"
            >
              edu.klimaka.gr
              <ExternalLink className="w-3.5 h-3.5" aria-hidden />
            </a>
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-12 space-y-6">
        <div className="rounded-2xl border border-[#f07f97]/20 dark:border-white/10 bg-white dark:bg-[#3a2658] p-4 sm:p-5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="π.χ. Πληροφορικής, ΑΠΘ, Αθήνα..."
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
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            {filteredGroups.length} από {CORRESPONDENCE_GROUPS.length} ομάδες αντιστοίχισης
          </p>
        </div>

        <div className="space-y-4">
          {filteredGroups.length === 0 ? (
            <p className="text-center text-white/90 py-10">Δεν βρέθηκαν αποτελέσματα για «{searchQuery}».</p>
          ) : (
            filteredGroups.map((group) => (
              <div
                key={group.title}
                className="rounded-2xl border border-[#f07f97]/20 dark:border-white/10 bg-white dark:bg-[#3a2658] overflow-hidden"
              >
                <div className="px-4 sm:px-5 py-3 bg-[#fff5f8] dark:bg-[#2d1c48] border-b border-[#f07f97]/15 dark:border-white/10 flex items-center justify-between gap-3">
                  <h2 className="font-black text-sm sm:text-base text-gray-900 dark:text-white">{group.title}</h2>
                  {group.isIntegratedMaster ? (
                    <span className="shrink-0 text-[10px] font-black uppercase tracking-wide text-[#f07f97] bg-[#f07f97]/10 px-2 py-1 rounded-lg">
                      Integrated Master
                    </span>
                  ) : null}
                </div>
                <ul className="divide-y divide-[#f07f97]/10 dark:divide-white/10">
                  {group.departments.map((dept, index) => (
                    <li key={`${group.title}-${index}`} className="px-4 sm:px-5 py-3">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">{dept.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {dept.institution} · {dept.city}
                        {dept.semesters ? ` · ${dept.semesters} εξάμηνα` : ''}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

        <div className="rounded-2xl border border-amber-300/60 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-950/30 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowNonCorresponding((v) => !v)}
            className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 text-left"
          >
            <span className="font-black text-sm sm:text-base text-amber-900 dark:text-amber-100">
              Τμήματα χωρίς αντίστοιχο ({filteredNonCorresponding.length})
            </span>
            <span className="shrink-0 text-xs font-bold text-amber-700 dark:text-amber-300">
              {showNonCorresponding ? 'Απόκρυψη' : 'Εμφάνιση'}
            </span>
          </button>
          {showNonCorresponding ? (
            <ul className="divide-y divide-amber-200 dark:divide-amber-900/40 border-t border-amber-200 dark:border-amber-900/40">
              {filteredNonCorresponding.map((dept, index) => (
                <li key={index} className="px-4 sm:px-5 py-3">
                  <p className="font-semibold text-sm text-amber-950 dark:text-amber-50">{dept.name}</p>
                  <p className="text-xs text-amber-800/80 dark:text-amber-200/70 mt-0.5">
                    {dept.institution} · {dept.city}
                    {dept.semesters ? ` · ${dept.semesters} εξάμηνα` : ''}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 sm:px-5 pb-4 text-xs text-amber-800/90 dark:text-amber-200/80">
              Αυτά τα τμήματα δεν έχουν αντίστοιχο πουθενά αλλού — μετεγγραφή είναι δυνατή μόνο μέσω «μετακίνησης»
              σε συναφές τμήμα του ίδιου επιστημονικού πεδίου.
            </p>
          )}
        </div>

      </div>
    </motion.div>
  );
};

export default AntistoixiesSxolonPage;
