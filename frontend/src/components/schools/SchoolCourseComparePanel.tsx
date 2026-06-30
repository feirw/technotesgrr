import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, GitCompare, Search, X } from 'lucide-react';
import { SchoolCourseCompareView } from '@/components/schools/SchoolCourseCompareView';
import { ALL_SCHOOLS } from '@/data/schools';
import {
  SCHOOL_CURRICULA,
  hasSchoolCurriculum,
  type CurriculumFilter,
} from '@/data/schoolCurricula';
import { compareCurricula, type ComparedSchool } from '@/utils/curriculumComparison';

const CURRICULUM_SCHOOLS = ALL_SCHOOLS.filter((school) => hasSchoolCurriculum(school.id)).sort(
  (a, b) => b.points - a.points,
);

function schoolLabel(school: (typeof CURRICULUM_SCHOOLS)[number]): string {
  return `${school.name} · ${school.uni} · ${school.city}`;
}

function SchoolPicker({
  label,
  value,
  otherId,
  onChange,
}: {
  label: string;
  value: string;
  otherId: string;
  onChange: (id: string) => void;
}) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const selected = CURRICULUM_SCHOOLS.find((school) => school.id === value);

  const options = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CURRICULUM_SCHOOLS.filter((school) => {
      if (school.id === otherId) return false;
      if (!q) return true;
      return (
        school.name.toLowerCase().includes(q) ||
        school.uni.toLowerCase().includes(q) ||
        school.city.toLowerCase().includes(q)
      );
    });
  }, [search, otherId]);

  return (
    <div className="relative">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-gray-400 mb-2">{label}</p>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full rounded-2xl border border-[#f07f97]/25 dark:border-white/15 bg-white dark:bg-[#2d1c48] px-4 py-3 text-left shadow-inner hover:border-[#f07f97]/50 transition-colors"
      >
        {selected ? (
          <span className="block text-sm font-bold text-gray-900 dark:text-white leading-snug">
            {schoolLabel(selected)}
          </span>
        ) : (
          <span className="text-sm font-semibold text-gray-400">Επίλεξε σχολή…</span>
        )}
      </button>

      {open ? (
        <div className="absolute z-20 mt-2 w-full rounded-2xl border border-[#f07f97]/25 dark:border-white/15 bg-white dark:bg-[#3a2658] shadow-2xl overflow-hidden">
          <div className="p-3 border-b border-[#f07f97]/15 dark:border-white/10">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Αναζήτηση…"
                className="w-full rounded-xl border border-[#f07f97]/20 dark:border-white/10 bg-[#fff5f8] dark:bg-[#2d1c48] pl-9 pr-9 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#f07f97]/30 dark:text-white"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg text-gray-400 hover:text-gray-600"
                aria-label="Κλείσιμο"
              >
                <X size={14} />
              </button>
            </div>
          </div>
          <ul className="max-h-64 overflow-y-auto p-2">
            {options.length === 0 ? (
              <li className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Δεν βρέθηκε σχολή.</li>
            ) : (
              options.map((school) => (
                <li key={school.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(school.id);
                      setOpen(false);
                      setSearch('');
                    }}
                    className="w-full rounded-xl px-3 py-2.5 text-left hover:bg-[#fff5f8] dark:hover:bg-white/5 transition-colors"
                  >
                    <span className="block text-sm font-bold text-gray-900 dark:text-white leading-snug">
                      {school.name}
                    </span>
                    <span className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mt-0.5">
                      {school.uni} · {school.city}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

type SchoolCourseComparePanelProps = {
  schoolAId: string;
  schoolBId: string;
  onSchoolAChange: (id: string) => void;
  onSchoolBChange: (id: string) => void;
  onSwapSchools: () => void;
};

export const SchoolCourseComparePanel: React.FC<SchoolCourseComparePanelProps> = ({
  schoolAId,
  schoolBId,
  onSchoolAChange,
  onSchoolBChange,
  onSwapSchools,
}) => {
  const [filter, setFilter] = useState<CurriculumFilter>('all');

  const comparedSchools = useMemo((): ComparedSchool[] | null => {
    if (!schoolAId || !schoolBId || schoolAId === schoolBId) return null;
    const schoolA = CURRICULUM_SCHOOLS.find((school) => school.id === schoolAId);
    const schoolB = CURRICULUM_SCHOOLS.find((school) => school.id === schoolBId);
    const curriculumA = SCHOOL_CURRICULA[schoolAId];
    const curriculumB = SCHOOL_CURRICULA[schoolBId];
    if (!schoolA || !schoolB || !curriculumA || !curriculumB) return null;
    return [
      { school: schoolA, curriculum: curriculumA, courses: [], totalEcts: 0 },
      { school: schoolB, curriculum: curriculumB, courses: [], totalEcts: 0 },
    ];
  }, [schoolAId, schoolBId]);

  const comparison = useMemo(() => {
    if (!comparedSchools) return null;
    return compareCurricula(comparedSchools, filter);
  }, [comparedSchools, filter]);

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-white/60 dark:border-white/10 bg-white/95 dark:bg-[#3a2658]/85 p-4 sm:p-6 shadow-lg shadow-[#f07f97]/10"
      >
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Διάλεξε δύο σχολές και δες κοινά και διαφορετικά μαθήματα.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 items-end">
          <SchoolPicker
            label="Σχολή Α"
            value={schoolAId}
            otherId={schoolBId}
            onChange={onSchoolAChange}
          />
          <button
            type="button"
            onClick={onSwapSchools}
            disabled={!schoolAId && !schoolBId}
            className="mx-auto mb-1 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#f07f97]/25 dark:border-white/15 bg-[#fff5f8] dark:bg-[#2d1c48] text-[#f07f97] hover:bg-[#f07f97] hover:text-white transition-colors disabled:opacity-40"
            aria-label="Εναλλαγή σχολών"
          >
            <ArrowLeftRight size={18} />
          </button>
          <SchoolPicker
            label="Σχολή Β"
            value={schoolBId}
            otherId={schoolAId}
            onChange={onSchoolBChange}
          />
        </div>

        {schoolAId && schoolBId && schoolAId === schoolBId ? (
          <p className="mt-4 text-sm font-semibold text-amber-700 dark:text-amber-300">
            Επίλεξε δύο διαφορετικές σχολές για σύγκριση.
          </p>
        ) : null}
      </motion.section>

      {!comparison ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-3xl border border-dashed border-[#f07f97]/30 dark:border-white/15 bg-white/70 dark:bg-[#3a2658]/50 px-6 py-16 text-center"
        >
          <GitCompare size={40} className="mx-auto text-[#f07f97]/60 mb-4" />
          <p className="text-base font-bold text-gray-700 dark:text-gray-200">
            Επίλεξε δύο σχολές για να ξεκινήσει η σύγκριση.
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Διαθέσιμες {CURRICULUM_SCHOOLS.length} σχολές με καταχωρημένο πρόγραμμα σπουδών.
          </p>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <SchoolCourseCompareView
            comparison={comparison}
            filter={filter}
            onFilterChange={setFilter}
          />
        </motion.div>
      )}
    </div>
  );
};
