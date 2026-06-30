import React from 'react';
import { GitCompare, Layers, Sparkles } from 'lucide-react';
import { formatCourseHours } from '@/data/schoolCurricula';
import type { CurriculumComparison } from '@/utils/curriculumComparison';

const SEMESTER_LABEL: Record<number, string> = {
  1: '1ο',
  2: '2ο',
  3: '3ο',
  4: '4ο',
  5: '5ο',
  6: '6ο',
  7: '7ο',
  8: '8ο',
  9: '9ο',
  10: '10ο',
};

type SchoolCourseCompareViewProps = {
  comparison: CurriculumComparison;
};

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#f07f97]/20 dark:border-white/10 bg-white dark:bg-[#3a2658] px-4 py-3">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-gray-400">{label}</p>
      <p className="mt-1 text-2xl font-black text-gray-900 dark:text-white tabular-nums">{value}</p>
      {hint ? <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{hint}</p> : null}
    </div>
  );
}

function CourseRow({
  name,
  code,
  semester,
  hours,
}: {
  name: string;
  code: string;
  semester: number;
  hours?: { lecture: number; lab?: number; tutorial?: number };
}) {
  return (
    <li className="rounded-xl border border-[#f07f97]/15 dark:border-white/10 bg-white dark:bg-[#2d1c48]/60 px-3 py-2.5">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug">{name}</p>
        <p className="mt-1 text-[11px] font-bold text-gray-500 dark:text-gray-400">
          {code} · {SEMESTER_LABEL[semester] ?? `${semester}ο`} εξάμηνο
          {hours ? ` · ${formatCourseHours(hours)}` : ''}
        </p>
      </div>
    </li>
  );
}

export const SchoolCourseCompareView: React.FC<SchoolCourseCompareViewProps> = ({
  comparison,
}) => {
  const [a, b] = comparison.schools;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Κοινά μαθήματα"
          value={comparison.sharedCount}
          hint="ίδιος ή πολύ κοντινός τίτλος"
        />
        <StatCard label="Επικάλυψη" value={`${comparison.overlapPercent}%`} hint="ποσοστό κοινών μαθημάτων" />
        <StatCard label={`Μόνο ${a.school.uni}`} value={comparison.uniqueBySchool[a.school.id]?.length ?? 0} />
        <StatCard label={`Μόνο ${b.school.uni}`} value={comparison.uniqueBySchool[b.school.id]?.length ?? 0} />
      </div>

      <section className="rounded-3xl border border-[#f07f97]/20 dark:border-white/10 bg-white/95 dark:bg-[#3a2658]/85 overflow-hidden">
        <div className="flex items-center gap-3 px-4 sm:px-5 py-4 border-b border-[#f07f97]/15 dark:border-white/10 bg-[#fff5f8] dark:bg-[#2d1c48]/80">
          <Sparkles size={18} className="text-[#f07f97] shrink-0" />
          <div>
            <h2 className="text-sm sm:text-base font-black text-gray-900 dark:text-white">
              Κοινά μαθήματα ({comparison.sharedCount})
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Σύγκριση με βάση τον τίτλο μαθήματος — όχι τον κωδικό.
            </p>
          </div>
        </div>
        {comparison.shared.length === 0 ? (
          <p className="px-4 sm:px-5 py-8 text-sm text-gray-500 dark:text-gray-400">
            Δεν βρέθηκαν κοινά μαθήματα.
          </p>
        ) : (
          <ul className="p-3 sm:p-4 space-y-2 max-h-[420px] overflow-y-auto">
            {comparison.shared.map((group) => (
              <li
                key={group.key}
                className="rounded-2xl border border-emerald-200/80 dark:border-emerald-900/40 bg-emerald-50/70 dark:bg-emerald-950/20 px-3 py-3"
              >
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{group.label}</p>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {group.entries.map(({ schoolId, course }) => {
                    const school = comparison.schools.find((entry) => entry.school.id === schoolId);
                    return (
                      <div
                        key={`${group.key}-${schoolId}-${course.code}`}
                        className="rounded-xl bg-white/80 dark:bg-[#2d1c48]/70 px-2.5 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-300"
                      >
                        <span className="font-black text-[#f07f97] dark:text-[#ff97b2]">
                          {school?.school.uni}
                        </span>
                        <span className="mx-1">·</span>
                        {course.code} ·{' '}
                        {SEMESTER_LABEL[course.semester] ?? `${course.semester}ο`}
                      </div>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {comparison.schools.map((entry) => (
          <section
            key={entry.school.id}
            className="rounded-3xl border border-[#f07f97]/20 dark:border-white/10 bg-white/95 dark:bg-[#3a2658]/85 overflow-hidden"
          >
            <div className="px-4 sm:px-5 py-4 border-b border-[#f07f97]/15 dark:border-white/10 bg-[#fff5f8] dark:bg-[#2d1c48]/80">
              <div className="flex items-start gap-3">
                <Layers size={18} className="text-[#f07f97] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <h2 className="text-sm sm:text-base font-black text-gray-900 dark:text-white leading-tight">
                    Μόνο σε {entry.school.name}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {entry.school.uni} · {entry.school.city} · {entry.courses.length} μαθήματα
                  </p>
                </div>
              </div>
            </div>
            <ul className="p-3 sm:p-4 space-y-2 max-h-[520px] overflow-y-auto">
              {(comparison.uniqueBySchool[entry.school.id] ?? []).length === 0 ? (
                <li className="text-sm text-gray-500 dark:text-gray-400 py-4">
                  Όλα τα μαθήματα ταιριάζουν με την άλλη σχολή.
                </li>
              ) : (
                (comparison.uniqueBySchool[entry.school.id] ?? []).map((course) => (
                  <CourseRow
                    key={`${entry.school.id}-${course.code}-${course.semester}`}
                    name={course.name}
                    code={course.code}
                    semester={course.semester}
                    hours={course.hours}
                  />
                ))
              )}
            </ul>
          </section>
        ))}
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-[#f07f97]/15 dark:border-white/10 bg-white/80 dark:bg-[#2d1c48]/50 px-4 py-3 text-xs text-gray-600 dark:text-gray-300">
        <GitCompare size={16} className="text-[#f07f97] shrink-0 mt-0.5" />
        <p>
          Η σύγκριση γίνεται στον κατάλογο μαθημάτων, όχι στο ακριβές πρόγραμμα που θα
          ακολουθήσεις (επιλογές, κατευθύνσεις, πρακτική). Τα κοινά μαθήματα ταυτοποιούνται από
          τον τίτλο — μικρές διαφορές στη διατύπωση μπορεί να μην εμφανίζονται ως κοινά.
        </p>
      </div>
    </div>
  );
};
