import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, ArrowLeft, FileText, Info } from 'lucide-react';
import type { SchoolCurriculum } from '@/data/schoolCurricula';

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
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    // Lock background scroll without jumping (iOS-safe): freeze the body in place
    // and restore the exact scroll position on close.
    const scrollY = window.scrollY;
    const { body } = document;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [open, onClose]);

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

            <div className="flex-1 overflow-y-auto overscroll-contain px-3 sm:px-6 py-4 sm:py-5 space-y-5 min-h-0">
              <div className="flex items-start gap-2.5 rounded-xl border border-[#f07f97]/25 dark:border-white/15 bg-[#fff5f8] dark:bg-[#2d1c48]/60 px-3 py-2.5">
                <Info size={16} className="mt-0.5 shrink-0 text-[#f07f97] dark:text-[#ff97b2]" />
                <p className="text-[13px] sm:text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                  Κάποια μαθήματα είναι υποχρεωτικά και κάποια επιλογής. Η ακριβής κατανομή και οι
                  επιλογές ορίζονται από το τμήμα.
                </p>
              </div>
              {curriculum.semesters.map((sem) => (
                <section key={sem.semester}>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2 sm:mb-3">
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#f07f97] dark:text-[#ff97b2]">
                      Εξάμηνο: {SEMESTER_LABEL[sem.semester] ?? `${sem.semester}ο`}
                    </h3>
                    {curriculum.semesterPdfLinks?.[sem.semester]?.map((pdf) => (
                      <a
                        key={`${sem.semester}-${pdf.url}`}
                        href={pdf.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#f07f97]/25 dark:border-white/15 bg-white dark:bg-[#2d1c48]/60 px-2.5 py-1 text-[11px] sm:text-xs font-bold text-[#f07f97] dark:text-[#ff97b2] hover:bg-[#fff5f8] dark:hover:bg-white/5 transition-colors"
                      >
                        <FileText size={13} />
                        PDF · {pdf.label}
                      </a>
                    ))}
                  </div>
                  <ul className="space-y-1.5">
                    {sem.courses.map((course) => (
                      <li
                        key={`${sem.semester}-${course.code}-${course.name}`}
                        className="rounded-xl border border-[#f07f97]/20 dark:border-white/15 bg-white dark:bg-[#2d1c48]/60 px-3 py-2.5 text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug"
                      >
                        {course.name}
                      </li>
                    ))}
                  </ul>
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
