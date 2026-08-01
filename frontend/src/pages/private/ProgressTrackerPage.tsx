import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Search, RotateCcw, BookOpen } from 'lucide-react';
import { PageMenuIcon } from '@/data/menuIcons';

type Lesson = {
  id: number;
  title: string;
};

const STORAGE_KEY = 'syllabusProgress:v1';

const LESSONS: Lesson[] = [
  { id: 1, title: 'Ανάλυση Προβλήματος' },
  { id: 2, title: 'Βασικές Έννοιες Προγραμματισμού' },
  { id: 3, title: 'Θεωρία Αλγορίθμου' },
  { id: 4, title: 'Δομή Ακολουθίας (Αλγόριθμος)' },
  { id: 5, title: 'Δομή Ακολουθίας (ΓΛΩΣΣΑ)' },
  { id: 6, title: 'Απλή - Σύνθετη Αν' },
  { id: 7, title: 'Πολλαπλή Αν' },
  { id: 8, title: 'Επίλεξε' },
  { id: 9, title: 'Εμφωλευμένα Αν' },
  { id: 10, title: 'Όσο... Επανάλαβε' },
  { id: 11, title: 'Μέχρις_Ότου' },
  { id: 12, title: 'Για...Από...Μέχρι' },
  { id: 13, title: 'Εμφωλευμένοι Βρόχοι και Μετατροπές' },
  { id: 14, title: 'Αριθμητικά προβλήματα' },
  { id: 15, title: 'Δεδομένα - Μονοδιάστατοι Πίνακες' },
  { id: 16, title: 'Ταξινόμηση' },
  { id: 17, title: 'Αναζήτηση' },
  { id: 18, title: 'Πολλαπλασιασμός αλά ρωσικά - Ολίσθηση' },
  { id: 19, title: 'Διαίρει και Βασίλευε' },
  { id: 20, title: 'Φυσική Γλώσσα' },
  { id: 21, title: 'Δισδιάστατοι Πίνακες' },
  { id: 22, title: 'Ταξινόμηση - Αναζήτηση Δισδιάστατοι' },
  { id: 23, title: 'Τμηματικός Προγραμματισμός' },
  { id: 24, title: 'Διαδικασία' },
  { id: 25, title: 'Πίνακες και Υποπρογράμματα' },
  { id: 26, title: 'Μεταγλωττιστής' },
  { id: 27, title: 'Στοίβα' },
  { id: 28, title: 'Ουρά' },
  { id: 29, title: 'Η Στοίβα και η Ουρά στα Υποπρογράμματα' },
  { id: 30, title: 'Λίστες' },
  { id: 31, title: 'Δένδρα' },
  { id: 32, title: 'Γράφοι' },
  { id: 33, title: 'Αντικειμενοστραφής Προγραμματισμός' },
  { id: 34, title: 'Εκσφαλμάτωση' },
];

const ProgressTrackerPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [completed, setCompleted] = useState<Record<number, boolean>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Record<number, boolean>) : {};
    } catch {
      return {};
    }
  });

  const toggleLesson = (id: number) => {
    setCompleted((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const resetAll = () => {
    if (!window.confirm('Θέλεις να μηδενίσεις όλη την πρόοδο;')) return;
    setCompleted({});
    localStorage.removeItem(STORAGE_KEY);
  };

  const filteredLessons = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return LESSONS;
    return LESSONS.filter((l) => l.title.toLowerCase().includes(q) || String(l.id).includes(q));
  }, [search]);

  const doneCount = useMemo(() => LESSONS.filter((l) => completed[l.id]).length, [completed]);
  const progressPercent = Math.round((doneCount / LESSONS.length) * 100);

  const isAllComplete = LESSONS.length > 0 && doneCount === LESSONS.length;
  const [showConfetti, setShowConfetti] = useState(false);
  const wasAllCompleteRef = useRef(isAllComplete);

  useEffect(() => {
    const wasComplete = wasAllCompleteRef.current;
    wasAllCompleteRef.current = isAllComplete;
    if (isAllComplete && !wasComplete) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isAllComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-wash via-white to-coral-wash dark:from-[#2d1c48] dark:via-[#2d1c48] dark:to-[#1a1028] p-4 sm:p-6">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 80 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                backgroundColor: ['#fda8a9', '#10b981', '#3b82f6', '#f59e0b', '#ef4444'][
                  Math.floor(Math.random() * 5)
                ],
              }}
              initial={{ y: 0, opacity: 1, rotate: 0 }}
              animate={{
                y: window.innerHeight + 100,
                opacity: 0,
                rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                x: (Math.random() - 0.5) * 200,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/90 dark:bg-[#3a2658]/90 rounded-3xl border-2 border-coral-accent/25 dark:border-white/15 shadow-xl p-5 sm:p-7 mb-5">
          <div className="flex flex-col items-center text-center">
            <PageMenuIcon
              icon="progressTracker"
              wrapperClassName="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#ff97b2]/15 dark:bg-white/10 mb-3"
              className="w-9 h-9"
            />
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-[#faf5ef] tracking-tight">
              Διαδραστικός Χάρτης Ύλης
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Παρακολούθησε την πρόοδο σου σε όλη την ύλη από Μάθημα 1 έως 35.
            </p>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={resetAll}
              className="px-4 py-2 rounded-xl bg-white dark:bg-[#2d1c48] border border-coral-accent/30 dark:border-white/15 text-coral-strong dark:text-coral-light font-semibold inline-flex items-center gap-2 hover:border-coral-accent transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <span>Πρόοδος</span>
              <span>
                {doneCount}/{LESSONS.length} ({progressPercent}%)
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-coral-accent/15 dark:bg-[#2d1c48] overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-coral-accent to-coral-strong"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div className="mt-5 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Αναζήτηση μαθήματος..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border-2 border-coral-accent/25 dark:border-white/15 bg-white dark:bg-[#2d1c48] dark:text-white focus:outline-none focus:border-coral-accent"
            />
          </div>
        </div>

        <div className="space-y-2">
          {filteredLessons.map((lesson) => {
            const isDone = Boolean(completed[lesson.id]);
            return (
              <button
                key={lesson.id}
                onClick={() => toggleLesson(lesson.id)}
                className={`w-full text-left rounded-2xl border p-4 transition ${
                  isDone
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                    : 'bg-white dark:bg-[#2d1c48] border-coral-accent/25 dark:border-white/15'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-coral-accent" />
                  )}
                  <span className="font-bold text-gray-900 dark:text-white min-w-[80px]">
                    ΜΑΘΗΜΑ {lesson.id}
                  </span>
                  <BookOpen className="w-4 h-4 text-coral-accent/80 hidden sm:block" />
                  <span className="text-gray-700 dark:text-gray-300">{lesson.title}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressTrackerPage;
