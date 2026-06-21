import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, List, LayoutGrid, Filter } from 'lucide-react';
import {
  countCurriculumCourses,
  filterCurriculum,
  getCourseCategory,
  getCourseCategoryClass,
  getCourseCategoryLabel,
  type CurriculumCourse,
  type CurriculumFilter,
  type SchoolCurriculum,
} from '@/data/schoolCurricula';

const SEMESTER_LABEL: Record<number, string> = {
  1: '1ο',
  2: '2ο',
  3: '3ο',
  4: '4ο',
  5: '5ο',
  6: '6ο',
  7: '7ο',
  8: '8ο',
};

const SLOT_KEYS = ['s1', 's2', 's3', 's4', 's5', 's6'] as const;

function CategoryBadge({ kind }: { kind: string }) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${getCourseCategoryClass(kind)}`}
    >
      {getCourseCategoryLabel(kind)}
    </span>
  );
}

function SlotCell({ mark }: { mark?: string }) {
  if (!mark) return <span className="text-gray-300 dark:text-gray-600">—</span>;
  return (
    <span
      className={`font-black text-xs ${mark === 'Υ' ? 'text-emerald-600 dark:text-emerald-300' : 'text-sky-600 dark:text-sky-300'}`}
    >
      {mark}
    </span>
  );
}

function CourseCard({ course }: { course: CurriculumCourse }) {
  return (
    <article className="rounded-xl border border-[#f07f97]/20 dark:border-white/15 bg-white dark:bg-[#2d1c48]/60 p-3 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{course.code}</span>
        <span className="font-black text-[#f07f97] dark:text-[#ff97b2] text-sm">{course.ects} ECTS</span>
      </div>
      <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 leading-snug">{course.name}</h4>
      <CategoryBadge kind={course.kind} />
      {course.slots && Object.keys(course.slots).length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {SLOT_KEYS.map((key) =>
            course.slots?.[key] ? (
              <span
                key={key}
                className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300"
              >
                {key.toUpperCase()}: {course.slots[key]}
              </span>
            ) : null,
          )}
        </div>
      )}
    </article>
  );
}

interface SchoolCurriculumModalProps {
  open: boolean;
  onClose: () => void;
  curriculum: SchoolCurriculum;
}

export const SchoolCurriculumModal: React.FC<SchoolCurriculumModalProps> = ({
  open,
  onClose,
  curriculum,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activeFilter, setActiveFilter] = useState<CurriculumFilter>('all');

  const filtered = useMemo(
    () => filterCurriculum(curriculum, activeFilter),
    [curriculum, activeFilter],
  );

  const mandatoryCount = countCurriculumCourses(
    curriculum,
    (c) => {
      const cat = getCourseCategory(c.kind);
      return cat === 'mandatory' || cat === 'mandatory-choice';
    },
  );
  const electiveCount = countCurriculumCourses(
    curriculum,
    (c) => getCourseCategory(c.kind) === 'elective' || getCourseCategory(c.kind) === 'lab' || getCourseCategory(c.kind) === 'project' || getCourseCategory(c.kind) === 'general',
  );
  const totalCourses = countCurriculumCourses(curriculum, () => true);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setViewMode('list');
      setActiveFilter('all');
    }
  }, [open]);

  const filterButtons: { id: CurriculumFilter; label: string }[] = [
    { id: 'all', label: `Όλα (${totalCourses})` },
    { id: 'mandatory', label: `Υποχρεωτικά (${mandatoryCount})` },
    { id: 'elective', label: `Επιλογής (${electiveCount})` },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="curriculum-modal-title"
        >
          <motion.div
            className="relative w-full sm:max-w-6xl max-h-[92vh] sm:max-h-[88vh] bg-white dark:bg-[#3a2658] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="shrink-0 bg-gradient-to-r from-[#f07f97] via-[#f07f97] to-[#e06d88] text-white px-5 sm:px-6 py-5">
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                aria-label="Κλείσιμο"
              >
                <X size={20} />
              </button>
              <div className="flex items-start gap-3 pr-10">
                <div className="p-2.5 rounded-xl bg-white/20 shrink-0">
                  <BookOpen size={22} />
                </div>
                <div>
                  <h2 id="curriculum-modal-title" className="text-xl sm:text-2xl font-black leading-tight">
                    {curriculum.title}
                  </h2>
                  {curriculum.subtitle && (
                    <p className="text-sm text-white/90 mt-1">{curriculum.subtitle}</p>
                  )}
                  <p className="text-xs text-white/80 mt-2 font-semibold">
                    {totalCourses} μαθήματα · {mandatoryCount} υποχρεωτικά · {electiveCount} επιλογής
                  </p>
                </div>
              </div>
            </div>

            <div className="shrink-0 px-4 sm:px-6 py-3 border-b border-[#f07f97]/20 dark:border-white/10 bg-[#fff5f8] dark:bg-[#2d1c48]/80 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 rounded-xl border border-[#f07f97]/25 dark:border-white/15 p-1 bg-white dark:bg-[#3a2658]">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    viewMode === 'list'
                      ? 'bg-[#f07f97] text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-[#f07f97]/10'
                  }`}
                >
                  <List size={14} />
                  Λίστα
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-[#f07f97] text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-[#f07f97]/10'
                  }`}
                >
                  <LayoutGrid size={14} />
                  Πλέγμα
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400">
                <Filter size={14} />
                Φίλτρα:
              </div>
              {filterButtons.map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setActiveFilter(btn.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    activeFilter === btn.id
                      ? 'bg-[#f07f97] text-white border-[#f07f97]'
                      : 'bg-white dark:bg-[#3a2658] text-gray-700 dark:text-gray-200 border-[#f07f97]/25 dark:border-white/15 hover:border-[#f07f97]/50'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-6">
              {filtered.semesters.map((sem) => (
                <section key={sem.semester}>
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#f07f97] dark:text-[#ff97b2] mb-3">
                    Εξάμηνο: {SEMESTER_LABEL[sem.semester] ?? `${sem.semester}ο`}
                  </h3>

                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {sem.courses.map((course) => (
                        <CourseCard key={`${sem.semester}-${course.code}-${course.name}`} course={course} />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-[#f07f97]/25 dark:border-white/15 overflow-x-auto">
                      <table className="w-full text-sm min-w-[720px]">
                        <thead>
                          <tr className="bg-[#fff5f8] dark:bg-[#2d1c48]/80 text-left">
                            <th className="px-3 py-2.5 font-bold text-gray-500 dark:text-gray-400 w-16">Κωδ.</th>
                            <th className="px-3 py-2.5 font-bold text-gray-500 dark:text-gray-400">Μάθημα</th>
                            <th className="px-3 py-2.5 font-bold text-gray-500 dark:text-gray-400 w-14 text-right">ECTS</th>
                            <th className="px-3 py-2.5 font-bold text-gray-500 dark:text-gray-400 min-w-[8rem]">Τύπος</th>
                            {SLOT_KEYS.map((k) => (
                              <th
                                key={k}
                                className="px-2 py-2.5 font-bold text-gray-500 dark:text-gray-400 w-10 text-center"
                              >
                                {k.toUpperCase()}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sem.courses.map((course) => (
                            <tr
                              key={`${sem.semester}-${course.code}-${course.name}`}
                              className="border-t border-[#f07f97]/15 dark:border-white/10"
                            >
                              <td className="px-3 py-2.5 font-mono text-xs text-gray-500 dark:text-gray-400 align-top">
                                {course.code}
                              </td>
                              <td className="px-3 py-2.5 font-semibold text-gray-900 dark:text-gray-100 align-top">
                                {course.name}
                              </td>
                              <td className="px-3 py-2.5 font-bold text-[#f07f97] dark:text-[#ff97b2] text-right align-top">
                                {course.ects}
                              </td>
                              <td className="px-3 py-2.5 align-top">
                                <CategoryBadge kind={course.kind} />
                              </td>
                              {SLOT_KEYS.map((key) => (
                                <td key={key} className="px-2 py-2.5 text-center align-top">
                                  <SlotCell mark={course.slots?.[key]} />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
