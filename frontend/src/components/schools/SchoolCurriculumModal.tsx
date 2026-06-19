import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen } from 'lucide-react';
import {
  getMandatoryCurriculum,
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
  const mandatory = getMandatoryCurriculum(curriculum);
  const totalCourses = mandatory.semesters.reduce((n, s) => n + s.courses.length, 0);
  const totalEcts = mandatory.semesters.reduce(
    (n, s) => n + s.courses.reduce((sum, c) => sum + c.ects, 0),
    0,
  );

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
            className="relative w-full sm:max-w-3xl max-h-[92vh] sm:max-h-[88vh] bg-white dark:bg-[#3a2658] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
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
                    {totalCourses} υποχρεωτικά μαθήματα · {totalEcts} ECTS
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-6">
              {mandatory.semesters.map((sem) => (
                <section key={sem.semester}>
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#f07f97] dark:text-[#ff97b2] mb-3">
                    Εξάμηνο: {SEMESTER_LABEL[sem.semester] ?? `${sem.semester}ο`}
                  </h3>
                  <div className="rounded-2xl border border-[#f07f97]/25 dark:border-white/15 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#fff5f8] dark:bg-[#2d1c48]/80 text-left">
                          <th className="px-3 py-2.5 font-bold text-gray-500 dark:text-gray-400 w-16">
                            Κωδ.
                          </th>
                          <th className="px-3 py-2.5 font-bold text-gray-500 dark:text-gray-400">
                            Μάθημα
                          </th>
                          <th className="px-3 py-2.5 font-bold text-gray-500 dark:text-gray-400 w-14 text-right">
                            ECTS
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sem.courses.map((course) => (
                          <tr
                            key={`${sem.semester}-${course.code}`}
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
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
