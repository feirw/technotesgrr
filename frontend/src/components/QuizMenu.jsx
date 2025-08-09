import React, { useEffect, useMemo, useRef, useState } from 'react';
import { fetchAllQuizzes } from '../utils/quizUtils';

// Brand palette
const BRAND = '#fda8a9';
const BRAND_HOVER = '#f88b8c';
const BRAND_LIGHT = '#ffe6e6';
const BRAND_BORDER = '#fdd0d0';
const TEXT_DARK = '#1f2937';

const QuizMenu = ({ onSelect, onClose, categoryAnswers = {} }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('title'); // 'title' | 'progress'
  const dialogRef = useRef(null);

  // Load data
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr('');
      try {
        const data = await fetchAllQuizzes();
        setQuizzes(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Error loading quizzes:', e);
        setErr('Αποτυχία φόρτωσης. Δοκίμασε ξανά.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Close on Esc
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Autofocus first focusable
  useEffect(() => {
    if (loading) return;
    const el = dialogRef.current;
    if (!el) return;
    const focusable = el.querySelector(
      'input, select, button, [href], [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();
  }, [loading]);

  // Progress helpers
  const withProgress = useMemo(() => {
    return quizzes.map((quiz) => {
      const answered = Object.keys(categoryAnswers[quiz.id] || {}).length;
      const total = quiz?.questions?.length || 0;
      const percent = total ? Math.round((answered / total) * 100) : 0;
      return { ...quiz, answered, total, percent };
    });
  }, [quizzes, categoryAnswers]);

  const filtered = useMemo(() => {
    const f = withProgress.filter(
      (x) => !q.trim() || x.title.toLowerCase().includes(q.toLowerCase())
    );
    if (sort === 'title') return f.sort((a, b) => a.title.localeCompare(b.title, 'el'));
    if (sort === 'progress') return f.sort((a, b) => b.percent - a.percent || a.title.localeCompare(b.title, 'el'));
    return f;
  }, [withProgress, q, sort]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quizmenu-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose} />

      <div
        ref={dialogRef}
        className="relative rounded-2xl shadow-2xl w-[92%] max-w-4xl p-6 sm:p-8"
        style={{ background: BRAND_LIGHT, border: `1px solid ${BRAND_BORDER}` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 id="quizmenu-title" className="text-2xl font-extrabold" style={{ color: TEXT_DARK }}>
              Επιλέξτε Κεφάλαιο για Quiz
            </h3>
            <p className="text-sm" style={{ color: '#6b7280' }}>
              Φιλτράρισε, διάλεξε και συνέχισε από εκεί που έμεινες.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg shadow-sm hover:shadow"
            aria-label="Κλείσιμο"
            style={{ background: '#fff', border: `1px solid ${BRAND_BORDER}` }}
          >
            ✕
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-5">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Αναζήτηση κεφαλαίου…"
            aria-label="Αναζήτηση"
            className="w-full sm:w-80 rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
            style={{
              background: '#fff',
              border: `1px solid ${BRAND_BORDER}`,
              boxShadow: 'none',
              outline: 'none',
            }}
          />
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm" style={{ color: '#6b7280' }}>
              Ταξινόμηση:
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
              style={{
                background: '#fff',
                border: `1px solid ${BRAND_BORDER}`,
              }}
            >
              <option value="title">Αλφαβητικά</option>
              <option value="progress">Πρόοδος (φθίνουσα)</option>
            </select>
          </div>
        </div>

        {/* Body */}
        {loading ? (
          <div className="flex justify-center my-10">
            <div
              className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2"
              style={{ borderColor: BRAND }}
            />
          </div>
        ) : err ? (
          <div className="my-6 rounded-lg px-4 py-3 text-sm" style={{ background: '#fef2f2', color: '#b91c1c' }}>
            {err}
          </div>
        ) : filtered.length === 0 ? (
          <div className="my-6 text-center" style={{ color: '#6b7280' }}>
            Δεν βρέθηκαν κεφάλαια.
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6">
            {filtered.map((quiz) => (
              <button
                key={quiz.id}
                onClick={() => onSelect?.(quiz)}
                className="relative inline-flex items-center font-semibold rounded-full px-6 py-2 text-base shadow-sm transition-all overflow-hidden focus:outline-none"
                style={{
                  background: '#fff',
                  color: '#9d174d',
                  border: `1px solid ${BRAND_BORDER}`,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = BRAND)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = BRAND_BORDER)}
                aria-label={`${quiz.title}, πρόοδος ${quiz.percent}%`}
              >
                {/* progress background */}
                <span
                  className="absolute left-0 top-0 h-full z-0 transition-all"
                  style={{ width: `${quiz.percent}%`, background: BRAND }}
                  aria-hidden="true"
                />
                {/* title */}
                <span className="relative z-10">{quiz.title}</span>

                {/* badge */}
                <span
                  className="ml-3 relative z-10 text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: '#fff',
                    color: TEXT_DARK,
                    border: `1px solid ${BRAND_BORDER}`,
                  }}
                >
                  {quiz.answered}/{quiz.total} ({quiz.percent}%)
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="rounded-full px-8 py-2 font-semibold shadow-sm transition"
            style={{ background: BRAND, color: '#000' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = BRAND_HOVER)}
            onMouseLeave={(e) => (e.currentTarget.style.background = BRAND)}
          >
            Κλείσιμο
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizMenu;
