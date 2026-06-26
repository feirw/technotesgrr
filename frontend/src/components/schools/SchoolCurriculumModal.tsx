import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, List, LayoutGrid, ArrowLeft } from 'lucide-react';
import {
  countCurriculumCourses,
  curriculumHasLab,
  type CurriculumCourse,
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
  9: '9ο',
  10: '10ο',
};

const SLOT_KEYS = ['s1', 's2', 's3', 's4', 's5', 's6'] as const;

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
      <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 leading-snug">{course.name}</h4>
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

  const hasLab = useMemo(() => curriculumHasLab(curriculum), [curriculum]);

  const showSlotsColumn = useMemo(
    () => curriculum.semesters.some((sem) => sem.courses.some((c) => c.slots && Object.keys(c.slots).length > 0)),
    [curriculum],
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
    if (!open) setViewMode('list');
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="curriculum-modal-title"
        >
          <motion.div
            className="relative flex flex-col w-full max-w-lg sm:max-w-3xl lg:max-w-6xl max-h-[min(82vh,720px)] sm:max-h-[min(85vh,800px)] bg-white dark:bg-[#3a2658] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-[#f07f97]/20 dark:border-white/10"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="shrink-0 bg-gradient-to-r from-[#f07f97] via-[#f07f97] to-[#e06d88] text-white px-4 sm:px-6 py-4 sm:py-5">
              <div className="flex items-start gap-3 pr-8 sm:pr-10">
                <button
                  type="button"
                  onClick={onClose}
                  className="sm:hidden mt-0.5 p-1.5 -ml-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors shrink-0"
                  aria-label="Πίσω"
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="p-2 rounded-xl bg-white/20 shrink-0 hidden sm:block">
                  <BookOpen size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 id="curriculum-modal-title" className="text-lg sm:text-2xl font-black leading-tight truncate">
                    {curriculum.title}
                  </h2>
                  {curriculum.subtitle && (
                    <p className="text-xs sm:text-sm text-white/90 mt-0.5 line-clamp-2">{curriculum.subtitle}</p>
                  )}
                  <p className="text-xs text-white/80 mt-1.5 font-semibold">{totalCourses} μαθήματα</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="hidden sm:flex absolute top-3.5 right-3.5 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                aria-label="Κλείσιμο"
              >
                <X size={18} />
              </button>
            </div>

            <div className="shrink-0 px-3 sm:px-6 py-2.5 sm:py-3 border-b border-[#f07f97]/20 dark:border-white/10 bg-[#fff5f8] dark:bg-[#2d1c48]/80 space-y-2">
              {hasLab && (
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  Το τμήμα περιλαμβάνει μαθήματα με εργαστήριο.
                </p>
              )}
              <div className="flex items-center gap-1 rounded-xl border border-[#f07f97]/25 dark:border-white/15 p-1 bg-white dark:bg-[#3a2658] w-fit">
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
            </div>

            <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-5 space-y-5 min-h-0">
              {curriculum.semesters.map((sem) => (
                <section key={sem.semester}>
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#f07f97] dark:text-[#ff97b2] mb-2 sm:mb-3">
                    Εξάμηνο: {SEMESTER_LABEL[sem.semester] ?? `${sem.semester}ο`}
                  </h3>

                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                      {sem.courses.map((course) => (
                        <CourseCard key={`${sem.semester}-${course.code}-${course.name}`} course={course} />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl sm:rounded-2xl border border-[#f07f97]/25 dark:border-white/15 overflow-x-auto">
                      <table
                        className={`w-full text-sm ${showSlotsColumn ? 'min-w-[320px]' : 'min-w-0'}`}
                      >
                        <thead>
                          <tr className="bg-[#fff5f8] dark:bg-[#2d1c48]/80 text-left">
                            <th className="px-2.5 sm:px-3 py-2 font-bold text-gray-500 dark:text-gray-400 text-xs">
                              Μάθημα
                            </th>
                            {showSlotsColumn &&
                              SLOT_KEYS.map((k) => (
                                <th
                                  key={k}
                                  className="px-1.5 py-2 font-bold text-gray-500 dark:text-gray-400 w-9 text-center text-xs"
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
                              <td className="px-2.5 sm:px-3 py-2 font-semibold text-gray-900 dark:text-gray-100 align-top text-xs sm:text-sm">
                                {course.name}
                              </td>
                              {showSlotsColumn &&
                                SLOT_KEYS.map((key) => (
                                  <td key={key} className="px-1.5 py-2 text-center align-top">
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

            <div className="shrink-0 px-3 sm:px-6 py-3 border-t border-[#f07f97]/20 dark:border-white/10 bg-[#fff5f8] dark:bg-[#2d1c48]/80 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-[#f07f97] text-white hover:bg-[#e06d88] transition-colors"
              >
                <ArrowLeft size={16} />
                Πίσω
              </button>
              <button
                type="button"
                onClick={onClose}
                className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-bold border border-[#f07f97]/30 dark:border-white/20 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-white/5 transition-colors"
              >
                Κλείσιμο
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
