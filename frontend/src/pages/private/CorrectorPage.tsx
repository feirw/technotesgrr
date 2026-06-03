import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Camera,
  X,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Trash2,
  RotateCcw,
  FileText,
  Eye,
  Clock,
  TrendingUp,
  Award,
  Image as ImageIcon,
  Info,
} from 'lucide-react';
import { apiFetch } from '@/utils/apiClient';
import { getBackendUrl } from '@/utils/backendUrl';

// ── Types ────────────────────────────────────────────────────────────────────

interface GradingError {
  description: string;
  severity: 'minor' | 'major' | 'critical';
  points_lost: number;
}

interface GradedQuestion {
  number: string;
  topic: string;
  student_answer_summary: string;
  is_correct: boolean;
  score: number;
  max_score: number;
  errors: GradingError[];
  correct_answer: string;
  feedback: string;
  improvement_tips: string[];
}

interface GradingResult {
  image_quality: 'clear' | 'partial' | 'unclear';
  image_quality_note: string | null;
  detected_exercise_type: string;
  detected_exercise_title: string;
  questions: GradedQuestion[];
  total_score: number;
  max_total_score: number;
  percentage: number;
  grade_label: string;
  overall_feedback: string;
  strengths: string[];
  weaknesses: string[];
  study_recommendations: string[];
  confidence_score: number;
}

interface HistoryEntry {
  id: string;
  timestamp: string;
  imageThumbnail: string;
  result: GradingResult;
}

const HISTORY_KEY = 'technotesgr_corrector_history_v1';
const MAX_HISTORY = 30;

// ── Helpers ──────────────────────────────────────────────────────────────────

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, MAX_HISTORY)));
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function createThumbnail(file: File, maxSize = 120): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.6));
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
}

function gradeColor(pct: number): string {
  if (pct >= 85) return 'text-emerald-600 dark:text-emerald-400';
  if (pct >= 65) return 'text-blue-600 dark:text-blue-400';
  if (pct >= 50) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

function gradeBg(pct: number): string {
  if (pct >= 85) return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700/50';
  if (pct >= 65) return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700/50';
  if (pct >= 50) return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700/50';
  return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/50';
}

function severityBadge(s: GradingError['severity']) {
  const map = {
    minor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
    major: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
    critical: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  };
  const labels = { minor: 'Μικρό', major: 'Σημαντικό', critical: 'Κρίσιμο' };
  return (
    <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full ${map[s]}`}>
      {labels[s]}
    </span>
  );
}

// ── QuestionCard ─────────────────────────────────────────────────────────────

const QuestionCard: React.FC<{ q: GradedQuestion; idx: number }> = ({ q, idx }) => {
  const [expanded, setExpanded] = useState(false);
  const qPct = q.max_score > 0 ? (q.score / q.max_score) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.06 }}
      className={`rounded-xl border p-4 sm:p-5 ${gradeBg(qPct)}`}
    >
      <button
        type="button"
        className="w-full text-left"
        onClick={() => setExpanded((p) => !p)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {q.is_correct ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500 shrink-0" />
            )}
            <div className="min-w-0">
              <span className="font-bold text-gray-900 dark:text-white">{q.number}</span>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{q.topic}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-lg font-black ${gradeColor(qPct)}`}>
              {q.score}/{q.max_score}
            </span>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-4 text-sm">
              {q.student_answer_summary && (
                <div>
                  <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Απάντηση μαθητή:</p>
                  <p className="text-gray-600 dark:text-gray-400 bg-white/60 dark:bg-gray-800/60 rounded-lg p-3">
                    {q.student_answer_summary}
                  </p>
                </div>
              )}

              {q.errors.length > 0 && (
                <div>
                  <p className="font-semibold text-red-700 dark:text-red-400 mb-2">Λάθη:</p>
                  <div className="space-y-2">
                    {q.errors.map((err, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 bg-white/60 dark:bg-gray-800/60 rounded-lg p-3"
                      >
                        <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            {severityBadge(err)}
                            <span className="text-xs text-gray-500">-{err.points_lost} μόρια</span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">{err.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Σχόλια:</p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{q.feedback}</p>
              </div>

              {q.correct_answer && (
                <div>
                  <p className="font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                    Σωστή απάντηση:
                  </p>
                  <pre className="whitespace-pre-wrap bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50 rounded-lg p-3 text-gray-800 dark:text-gray-200 text-xs font-mono leading-relaxed">
                    {q.correct_answer}
                  </pre>
                </div>
              )}

              {q.improvement_tips.length > 0 && (
                <div>
                  <p className="font-semibold text-blue-700 dark:text-blue-400 mb-1">Συμβουλές:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                    {q.improvement_tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── ResultsView ──────────────────────────────────────────────────────────────

const ResultsView: React.FC<{ result: GradingResult; imagePreview?: string }> = ({
  result,
  imagePreview,
}) => {
  const pct = result.percentage;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Score header */}
      <div className={`rounded-2xl border-2 p-5 sm:p-6 text-center ${gradeBg(pct)}`}>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
          Συνολική Βαθμολογία
        </p>
        <p className={`text-5xl sm:text-6xl font-black ${gradeColor(pct)}`}>
          {result.total_score}/{result.max_total_score}
        </p>
        <p className={`mt-1 text-xl font-bold ${gradeColor(pct)}`}>
          {pct}% — {result.grade_label}
        </p>
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Info className="w-3.5 h-3.5" />
          <span>Confidence: {Math.round(result.confidence_score * 100)}%</span>
        </div>
      </div>

      {/* Image quality warning */}
      {result.image_quality !== 'clear' && result.image_quality_note && (
        <div className="flex items-start gap-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 p-4">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm">
              Ποιότητα εικόνας: {result.image_quality === 'partial' ? 'Μερική' : 'Δυσανάγνωστη'}
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
              {result.image_quality_note}
            </p>
          </div>
        </div>
      )}

      {/* Exercise info */}
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ff6b7a]/10 text-[#ff6b7a] dark:text-[#ffb0a4] font-semibold">
          <FileText className="w-3.5 h-3.5" />
          {result.detected_exercise_type}
        </span>
        {result.detected_exercise_title && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium">
            {result.detected_exercise_title}
          </span>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Αναλυτική Βαθμολογία ({result.questions.length} ερωτήματα)
        </h3>
        {result.questions.map((q, i) => (
          <QuestionCard key={`${q.number}-${i}`} q={q} idx={i} />
        ))}
      </div>

      {/* Overall feedback */}
      {result.overall_feedback && (
        <div className="rounded-xl bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="font-bold text-gray-900 dark:text-white mb-2">Γενική Αξιολόγηση</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {result.overall_feedback}
          </p>
        </div>
      )}

      {/* Strengths + Weaknesses */}
      <div className="grid sm:grid-cols-2 gap-4">
        {result.strengths.length > 0 && (
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-200 dark:border-emerald-700/40 p-4">
            <h4 className="font-bold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Δυνατά σημεία
            </h4>
            <ul className="space-y-1 text-sm text-emerald-800 dark:text-emerald-300">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {s}
                </li>
              ))}
            </ul>
          </div>
        )}
        {result.weaknesses.length > 0 && (
          <div className="rounded-xl bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-700/40 p-4">
            <h4 className="font-bold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Αδύνατα σημεία
            </h4>
            <ul className="space-y-1 text-sm text-red-800 dark:text-red-300">
              {result.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2">
                  <XCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {w}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Study recommendations */}
      {result.study_recommendations.length > 0 && (
        <div className="rounded-xl bg-blue-50 dark:bg-blue-900/15 border border-blue-200 dark:border-blue-700/40 p-4">
          <h4 className="font-bold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
            <Award className="w-4 h-4" /> Προτάσεις μελέτης
          </h4>
          <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
            {result.study_recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="shrink-0">📚</span> {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Preview image */}
      {imagePreview && (
        <details className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <summary className="cursor-pointer select-none px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/60 flex items-center gap-2">
            <Eye className="w-4 h-4" /> Προβολή εικόνας
          </summary>
          <div className="p-3 bg-white dark:bg-gray-900">
            <img
              src={imagePreview}
              alt="Uploaded exercise"
              className="max-w-full rounded-lg mx-auto"
            />
          </div>
        </details>
      )}
    </motion.div>
  );
};

// ── Main Page ────────────────────────────────────────────────────────────────

const CorrectorPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GradingResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory());
  const [viewingHistory, setViewingHistory] = useState<HistoryEntry | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith('image/')) {
      setError('Παρακαλώ ανέβασε εικόνα (JPG, PNG, WEBP).');
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setError('Η εικόνα είναι πολύ μεγάλη (max 20 MB).');
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError(null);
    setResult(null);
    setViewingHistory(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile],
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const reset = useCallback(() => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setContext('');
    setResult(null);
    setError(null);
    setViewingHistory(null);
  }, [preview]);

  const handleGrade = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const b64 = await fileToBase64(file);
      const backendUrl = getBackendUrl();
      const resp = await apiFetch<{ success: boolean; result: GradingResult }>(
        `${backendUrl}/api/corrector/grade`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: b64,
            mime_type: file.type || 'image/jpeg',
            context: context.trim(),
          }),
          timeoutMs: 120_000,
          retries: 1,
        },
      );

      setResult(resp.result);

      const thumb = await createThumbnail(file);
      const entry: HistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: new Date().toISOString(),
        imageThumbnail: thumb,
        result: resp.result,
      };
      setHistory((prev) => [entry, ...prev].slice(0, MAX_HISTORY));
    } catch (e: any) {
      setError(e?.message || 'Κάτι πήγε στραβά. Δοκίμασε ξανά.');
    } finally {
      setLoading(false);
    }
  }, [file, context]);

  const activeResult = viewingHistory?.result ?? result;
  const activePreview = viewingHistory ? viewingHistory.imageThumbnail : preview;

  const historyStats = useMemo(() => {
    if (history.length === 0) return null;
    const total = history.length;
    const avg = Math.round(history.reduce((s, h) => s + h.result.percentage, 0) / total);
    const best = Math.max(...history.map((h) => h.result.percentage));
    return { total, avg, best };
  }, [history]);

  return (
    <motion.div
      className="min-h-[100dvh] bg-[#fff5f4] dark:bg-gray-950 px-3 py-6 sm:px-6 sm:py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#ff6b7a] dark:text-[#ffb0a4] tracking-tight">
            AI Corrector
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-xl mx-auto">
            Ανέβασε φωτογραφία με τις απαντήσεις σου σε θέμα ΑΕΠΠ και πάρε αναλυτική
            διόρθωση και βαθμολογία.
          </p>
        </motion.header>

        {/* Stats bar */}
        {historyStats && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Διορθώσεις', value: historyStats.total, icon: FileText },
              { label: 'Μ.Ο. Βαθμολογίας', value: `${historyStats.avg}%`, icon: TrendingUp },
              { label: 'Καλύτερη', value: `${historyStats.best}%`, icon: Award },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-xl bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 p-3 text-center"
              >
                <Icon className="w-4 h-4 mx-auto mb-1 text-[#ff6b7a] dark:text-[#ffb0a4]" />
                <p className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">{value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3 mb-6 justify-end">
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setShowHistory((p) => !p);
                setViewingHistory(null);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Clock className="w-4 h-4" />
              Ιστορικό ({history.length})
            </button>
          )}
        </div>

        {/* History panel */}
        <AnimatePresence>
          {showHistory && history.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/60 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 dark:text-white">Ιστορικό Διορθώσεων</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setHistory([]);
                      setShowHistory(false);
                    }}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Καθαρισμός
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
                  {history.map((entry) => (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => {
                        setViewingHistory(entry);
                        setResult(null);
                        setShowHistory(false);
                      }}
                      className={`rounded-xl border p-2 text-left hover:shadow-md transition-shadow ${
                        viewingHistory?.id === entry.id
                          ? 'border-[#ff6b7a] ring-2 ring-[#ff6b7a]/30'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <img
                        src={entry.imageThumbnail}
                        alt=""
                        className="w-full h-16 object-cover rounded-lg mb-2"
                      />
                      <p className={`text-sm font-black ${gradeColor(entry.result.percentage)}`}>
                        {entry.result.total_score}/{entry.result.max_total_score}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(entry.timestamp).toLocaleDateString('el-GR')}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload area */}
        {!activeResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => !file && fileInputRef.current?.click()}
              className={`
                relative rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300
                ${
                  dragActive
                    ? 'border-[#ff6b7a] bg-[#ff6b7a]/10 scale-[1.01]'
                    : file
                      ? 'border-emerald-300 dark:border-emerald-700 bg-white dark:bg-gray-800/60'
                      : 'border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/40 cursor-pointer hover:border-[#ff6b7a]/60 hover:bg-[#ff6b7a]/5'
                }
              `}
            >
              {file && preview ? (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-64 rounded-xl mx-auto shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        reset();
                      }}
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center bg-[#fff5f4] dark:bg-[#2a1815]/55 border border-[#ff8f8e]/35">
                    <ImageIcon className="w-8 h-8 text-[#ff6b7a] dark:text-[#ffb0a4]" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                      Σύρε ή πάτα για upload
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      JPG, PNG, WEBP — max 20 MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                  e.target.value = '';
                }}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                  e.target.value = '';
                }}
              />

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#ff8f8e]/40 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 font-semibold hover:bg-[#fff5f4] dark:hover:bg-gray-700 transition-colors"
              >
                <Camera className="w-5 h-5" />
                Φωτογραφία
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#ff8f8e]/40 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 font-semibold hover:bg-[#fff5f4] dark:hover:bg-gray-700 transition-colors"
              >
                <Upload className="w-5 h-5" />
                Upload αρχείου
              </button>
            </div>

            {/* Context */}
            {file && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4"
              >
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Προαιρετικά: γράψε πρόσθετες πληροφορίες (π.χ. ποιο θέμα είναι, τι μονάδες έχει...)"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-[#ff6b7a]/40 focus:border-[#ff6b7a] resize-none"
                  rows={2}
                  maxLength={2000}
                />
              </motion.div>
            )}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 p-4"
              >
                <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </motion.div>
            )}

            {/* Submit */}
            {file && (
              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                type="button"
                disabled={loading}
                onClick={handleGrade}
                className="mt-4 w-full py-3.5 rounded-xl bg-[#ff6b7a] hover:bg-[#e85563] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-base shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Ο AI διορθώνει...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Διόρθωση & Βαθμολόγηση
                  </>
                )}
              </motion.button>
            )}

            {loading && (
              <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
                Η διόρθωση μπορεί να πάρει 15-30 δευτερόλεπτα ανάλογα με την πολυπλοκότητα.
              </p>
            )}
          </motion.div>
        )}

        {/* Results */}
        {activeResult && (
          <div>
            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Νέα διόρθωση
              </button>
            </div>
            <ResultsView result={activeResult} imagePreview={activePreview ?? undefined} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CorrectorPage;
