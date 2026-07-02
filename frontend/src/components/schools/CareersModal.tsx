import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, Search } from 'lucide-react';
import { FUTURE_CAREERS_ICON, MenuIconImg } from '@/data/menuIcons';
import type { Career } from '@/data/careers';

interface CareersModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle: string;
  careers: Career[];
  columnTitle?: string;
}

export const CareersModal: React.FC<CareersModalProps> = ({
  open,
  onClose,
  title = 'Μελλοντική καριέρα',
  subtitle,
  careers,
  columnTitle = 'Επάγγελμα',
}) => {
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!open) {
      setSearch('');
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return careers;
    return careers.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (c.section?.toLowerCase().includes(q) ?? false)
    );
  }, [search, careers]);

  const grouped = useMemo(() => {
    const hasSections = careers.some((c) => c.section);
    if (!hasSections) return [{ heading: null as string | null, items: filtered }];

    const order: string[] = [];
    const map = new Map<string, Career[]>();
    for (const career of filtered) {
      const key = career.section ?? '';
      if (!map.has(key)) {
        order.push(key);
        map.set(key, []);
      }
      map.get(key)!.push(career);
    }
    return order.map((heading) => ({ heading: heading || null, items: map.get(heading)! }));
  }, [filtered, careers]);

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
          aria-labelledby="careers-modal-title"
        >
          <motion.div
            className="relative flex flex-col w-[92%] max-w-lg sm:w-full sm:max-w-2xl lg:max-w-3xl max-h-[70vh] sm:max-h-[min(80vh,720px)] bg-white dark:bg-[#3a2658] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-[#f07f97]/20 dark:border-white/10"
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
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
                  <MenuIconImg src={FUTURE_CAREERS_ICON} className="h-8 w-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 id="careers-modal-title" className="text-lg sm:text-2xl font-black leading-tight">
                    {title}
                  </h2>
                  <p className="mt-1 text-sm text-white/90 font-medium">{subtitle}</p>
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

            <div className="shrink-0 px-3 sm:px-6 py-3 border-b border-[#f07f97]/15 dark:border-white/10 bg-[#fff5f8] dark:bg-[#2d1c48]/60">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Αναζήτηση επαγγέλματος..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#3a2658] border border-[#f07f97]/25 dark:border-white/15 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#f07f97]/40 dark:text-white"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-3 sm:px-6 py-4 min-h-0">
              {filtered.length === 0 ? (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
                  Δεν βρέθηκαν επαγγέλματα.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-[#f07f97]/20 dark:border-white/15">
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 z-10 bg-[#fff5f8] dark:bg-[#2d1c48]">
                      <tr>
                        <th className="px-3 sm:px-4 py-2.5 font-black text-[#f07f97] dark:text-[#ff97b2] uppercase tracking-wide text-xs whitespace-nowrap">
                          {columnTitle}
                        </th>
                        <th className="px-3 sm:px-4 py-2.5 font-black text-[#f07f97] dark:text-[#ff97b2] uppercase tracking-wide text-xs">
                          Σύντομη περιγραφή
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f07f97]/10 dark:divide-white/10">
                      {grouped.map(({ heading, items }) => (
                        <React.Fragment key={heading ?? 'all'}>
                          {heading && (
                            <tr className="bg-[#fff5f8] dark:bg-[#2d1c48]">
                              <td
                                colSpan={2}
                                className="px-3 sm:px-4 py-2.5 font-black text-[#f07f97] dark:text-[#ff97b2] text-xs uppercase tracking-wide"
                              >
                                {heading}
                              </td>
                            </tr>
                          )}
                          {items.map((career) => (
                            <tr
                              key={`${heading ?? 'row'}-${career.title}`}
                              className="bg-white dark:bg-[#3a2658]/40 hover:bg-[#fff5f8]/80 dark:hover:bg-[#2d1c48]/80 transition-colors"
                            >
                              <td className="px-3 sm:px-4 py-3 font-bold text-gray-900 dark:text-white align-top whitespace-nowrap">
                                {career.title}
                              </td>
                              <td className="px-3 sm:px-4 py-3 text-gray-700 dark:text-gray-200 leading-relaxed align-top">
                                {career.description}
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
