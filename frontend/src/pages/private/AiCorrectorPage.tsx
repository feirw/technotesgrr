import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, XCircle, BookOpen, Camera, ImagePlus, X, Type } from 'lucide-react';
import { MENU_ICONS, MenuIconImg } from '@/data/menuIcons';
import { apiFetch } from '@/utils/apiClient';
import { getBackendUrlCandidates } from '@/utils/backendUrl';
import { compressImageFile } from '@/utils/imageCompress';

type InputMode = 'photo' | 'text';

type CorrectorResult = {
  score?: number;
  maxScore?: number;
  correctPoints?: string[];
  mistakes?: string[];
  correctedSolution?: string;
  explanation?: string;
  extractedExercise?: string;
  extractedStudentAnswer?: string;
  raw?: string;
};

type KnowledgeStats = {
  loaded?: boolean;
  chunkCount?: number;
  fileCount?: number;
};

const MAX_PHOTOS = 4;

const EXERCISE_PLACEHOLDER =
  'Π.χ. Να γραφεί πρόγραμμα σε ψευδογλώσσα που διαβάζει N ακέραιους και εμφανίζει το άθροισμά τους.';

const ANSWER_PLACEHOLDER = `ΑΡΧΗ_ΠΡΟΓΡΑΜΜΑΤΟΣ
  ΔΙΑΒΑΣΕ(N)
  ΑΘΡΟΙΣΜΑ <- 0
  ΓΙΑ Ι ΑΠΟ 1 ΜΕΧΡΙ N
    ΔΙΑΒΑΣΕ(ΑΡΙΘΜΟΣ)
    ΑΘΡΟΙΣΜΑ <- ΑΘΡΟΙΣΜΑ + ΑΡΙΘΜΟΣ
  ΤΕΛΟΣ_ΓΙΑ
  ΓΡΑΨΕ(ΑΘΡΟΙΣΜΑ)
ΤΕΛΟΣ_ΠΡΟΓΡΑΜΜΑΤΟΣ`;

function scoreColorClass(score: number, maxScore: number): string {
  const ratio = maxScore > 0 ? score / maxScore : 0;
  if (ratio > 0.7) return 'text-emerald-600 dark:text-emerald-400';
  if (ratio >= 0.4) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

type CorrectPayload = {
  exercise?: string;
  studentAnswer?: string;
  exerciseImages?: string[];
  studentAnswerImages?: string[];
};

async function postCorrect(payload: CorrectPayload): Promise<CorrectorResult> {
  const body = JSON.stringify(payload);
  const errors: string[] = [];

  for (const base of getBackendUrlCandidates()) {
    try {
      return await apiFetch<CorrectorResult>(`${base}/api/correct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        timeoutMs: 120000,
        retries: 0,
      });
    } catch (err) {
      errors.push(err instanceof Error ? err.message : String(err));
    }
  }

  throw new Error(errors[errors.length - 1] || 'Κάτι πήγε στραβά. Δοκίμασε ξανά.');
}

const ModeTab: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ active, onClick, icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
      active
        ? 'bg-[#f07f97] text-white shadow-sm'
        : 'bg-white/80 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-[#ff97b2]/20'
    }`}
  >
    {icon}
    {label}
  </button>
);

const PhotoField: React.FC<{
  id: string;
  label: string;
  hint: string;
  photos: string[];
  onChange: (photos: string[]) => void;
  disabled?: boolean;
}> = ({ id, label, hint, photos, onChange, disabled }) => {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const addFiles = async (files: FileList | null) => {
    if (!files?.length || disabled) return;
    setLocalError(null);

    const remaining = MAX_PHOTOS - photos.length;
    if (remaining <= 0) {
      setLocalError(`Μέγιστο ${MAX_PHOTOS} φωτογραφίες.`);
      return;
    }

    const next = [...photos];
    for (const file of Array.from(files).slice(0, remaining)) {
      try {
        const dataUrl = await compressImageFile(file);
        next.push(dataUrl);
      } catch (err) {
        setLocalError(err instanceof Error ? err.message : 'Αποτυχία επεξεργασίας φωτογραφίας.');
        break;
      }
    }
    onChange(next);
  };

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
        {label}
      </label>
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{hint}</p>

      <div className="flex flex-wrap gap-2 mb-3">
        <button
          type="button"
          disabled={disabled || photos.length >= MAX_PHOTOS}
          onClick={() => cameraRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl border border-[#ff97b2]/50 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-semibold text-gray-800 dark:text-gray-100 disabled:opacity-50"
        >
          <Camera className="w-4 h-4 text-[#f07f97]" aria-hidden />
          Φωτογραφία
        </button>
        <button
          type="button"
          disabled={disabled || photos.length >= MAX_PHOTOS}
          onClick={() => galleryRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl border border-[#ff97b2]/50 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-semibold text-gray-800 dark:text-gray-100 disabled:opacity-50"
        >
          <ImagePlus className="w-4 h-4 text-[#f07f97]" aria-hidden />
          Από gallery
        </button>
      </div>

      <input
        ref={cameraRef}
        id={id}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          void addFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          void addFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {localError && (
        <p className="mb-3 text-sm text-red-600 dark:text-red-400" role="alert">
          {localError}
        </p>
      )}

      {photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photos.map((photo, index) => (
            <div
              key={`${id}-${index}`}
              className="relative overflow-hidden rounded-xl border border-[#ff97b2]/35 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
            >
              <img src={photo} alt={`${label} ${index + 1}`} className="h-36 w-full object-cover" />
              <button
                type="button"
                disabled={disabled}
                onClick={() => removePhoto(index)}
                className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 disabled:opacity-50"
                aria-label={`Αφαίρεση φωτογραφίας ${index + 1}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#ff97b2]/50 dark:border-gray-600 px-4 py-8 text-center text-sm text-gray-600 dark:text-gray-400">
          Δεν έχεις προσθέσει φωτογραφία ακόμα.
        </div>
      )}
    </div>
  );
};

const AiCorrectorPage: React.FC = () => {
  const [inputMode, setInputMode] = useState<InputMode>('photo');
  const [exercise, setExercise] = useState('');
  const [studentAnswer, setStudentAnswer] = useState('');
  const [exercisePhotos, setExercisePhotos] = useState<string[]>([]);
  const [answerPhotos, setAnswerPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CorrectorResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [knowledge, setKnowledge] = useState<KnowledgeStats | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loadKnowledge = async () => {
      for (const base of getBackendUrlCandidates()) {
        try {
          const stats = await apiFetch<KnowledgeStats>(`${base}/api/correct/knowledge`, {
            cacheTtlMs: 60000,
          });
          if (!cancelled) setKnowledge(stats);
          return;
        } catch {
          // try next backend candidate
        }
      }
    };
    void loadKnowledge();
    return () => {
      cancelled = true;
    };
  }, []);

  const canSubmit = useMemo(() => {
    if (loading) return false;
    if (inputMode === 'photo') {
      return exercisePhotos.length > 0 && answerPhotos.length > 0;
    }
    return exercise.trim().length > 0 && studentAnswer.trim().length > 0;
  }, [loading, inputMode, exercise, studentAnswer, exercisePhotos, answerPhotos]);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload: CorrectPayload =
        inputMode === 'photo'
          ? {
              exerciseImages: exercisePhotos,
              studentAnswerImages: answerPhotos,
            }
          : {
              exercise: exercise.trim(),
              studentAnswer: studentAnswer.trim(),
            };

      const data = await postCorrect(payload);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Κάτι πήγε στραβά. Δοκίμασε ξανά.');
    } finally {
      setLoading(false);
    }
  };

  const maxScore = result?.maxScore ?? 10;
  const hasStructuredResult = result && !result.raw;

  return (
    <motion.div
      className="min-h-[100dvh] bg-[#fff5f4] dark:bg-gray-950 px-3 py-6 sm:px-6 sm:py-10 -mt-20 pt-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto max-w-3xl">
        <header className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <MenuIconImg src={MENU_ICONS.aiCorrector} className="w-14 h-14" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#f07f97] dark:text-[#ff97b2] tracking-tight">
            AI Corrector Πληροφορικής
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Βγάλε φωτογραφία την εκφώνηση και τη λύση σου σε ψευδογλώσσα — το σύστημα θα αναγνωρίσει
            το κείμενο και θα σου δώσει αυτόματη διόρθωση με βαθμό, σχόλια και διορθωμένη λύση.
          </p>
          {knowledge?.loaded && (knowledge.fileCount ?? 0) > 0 && (
            <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#ff97b2]/40 bg-white/70 dark:bg-gray-900/60 px-4 py-1.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              <BookOpen className="w-4 h-4 text-[#f07f97]" aria-hidden />
              Εκπαιδευμένο με {knowledge.fileCount} αρχεία ύλης από τα μαθήματα ΑΕΠΠ
            </p>
          )}
        </header>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-300 dark:border-red-700/60 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-800 dark:text-red-200"
          >
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-[#ff97b2]/35 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 shadow-sm p-5 sm:p-7 space-y-5">
          <div className="flex flex-wrap gap-2">
            <ModeTab
              active={inputMode === 'photo'}
              onClick={() => setInputMode('photo')}
              icon={<Camera className="w-4 h-4" aria-hidden />}
              label="Φωτογραφία"
            />
            <ModeTab
              active={inputMode === 'text'}
              onClick={() => setInputMode('text')}
              icon={<Type className="w-4 h-4" aria-hidden />}
              label="Κείμενο"
            />
          </div>

          {inputMode === 'photo' ? (
            <>
              <PhotoField
                id="exercise-photo"
                label="Εκφώνηση άσκησης"
                hint="Βγάλε φωτογραφία ή ανέβασε εικόνα της εκφώνησης (έως 4 σελίδες)."
                photos={exercisePhotos}
                onChange={setExercisePhotos}
                disabled={loading}
              />
              <PhotoField
                id="answer-photo"
                label="Η λύση σου σε ψευδογλώσσα"
                hint="Φωτογράφισε το χειρόγραφο ή εκτυπωμένο πρόγραμμά σου (έως 4 σελίδες)."
                photos={answerPhotos}
                onChange={setAnswerPhotos}
                disabled={loading}
              />
            </>
          ) : (
            <>
              <div>
                <label
                  htmlFor="exercise"
                  className="block text-sm font-bold text-gray-900 dark:text-white mb-2"
                >
                  Εκφώνηση άσκησης
                </label>
                <textarea
                  id="exercise"
                  rows={6}
                  value={exercise}
                  onChange={(e) => setExercise(e.target.value)}
                  placeholder={EXERCISE_PLACEHOLDER}
                  className="w-full rounded-xl border border-[#ff97b2]/40 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-sm sm:text-base text-gray-800 dark:text-gray-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#f07f97]/50 resize-y min-h-[8rem]"
                />
              </div>

              <div>
                <label
                  htmlFor="studentAnswer"
                  className="block text-sm font-bold text-gray-900 dark:text-white mb-2"
                >
                  Η λύση σου σε ψευδογλώσσα
                </label>
                <textarea
                  id="studentAnswer"
                  rows={10}
                  value={studentAnswer}
                  onChange={(e) => setStudentAnswer(e.target.value)}
                  placeholder={ANSWER_PLACEHOLDER}
                  spellCheck={false}
                  className="w-full rounded-xl border border-[#ff97b2]/40 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-sm font-mono text-gray-800 dark:text-gray-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#f07f97]/50 resize-y min-h-[12rem]"
                />
              </div>
            </>
          )}

          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={!canSubmit}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-[#f07f97] hover:bg-[#e86d88] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden />
                {inputMode === 'photo' ? 'Αναγνώριση & διόρθωση...' : 'Διορθώνεται...'}
              </>
            ) : (
              'Διόρθωση'
            )}
          </button>
        </div>

        {loading && (
          <div className="mt-8 rounded-2xl border border-[#ff97b2]/25 dark:border-gray-700 bg-white/60 dark:bg-gray-900/50 p-6 animate-pulse">
            <div className="h-4 w-48 rounded bg-[#ff97b2]/30 mb-4" />
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-4/6 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        )}

        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-2xl border border-[#ff97b2]/40 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-md p-5 sm:p-7 space-y-6"
          >
            {(result.extractedExercise || result.extractedStudentAnswer) && (
              <section className="rounded-xl border border-[#ff97b2]/25 dark:border-gray-700 bg-[#fff5f4]/70 dark:bg-gray-800/50 p-4 space-y-3">
                <h2 className="text-sm font-black text-gray-900 dark:text-white">
                  Αναγνωρισμένο κείμενο από τις φωτογραφίες
                </h2>
                {result.extractedExercise && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Εκφώνηση</p>
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                      {result.extractedExercise}
                    </pre>
                  </div>
                )}
                {result.extractedStudentAnswer && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Λύση</p>
                    <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 dark:text-gray-200 leading-relaxed">
                      {result.extractedStudentAnswer}
                    </pre>
                  </div>
                )}
              </section>
            )}

            {result.raw && !hasStructuredResult ? (
              <div>
                <h2 className="text-lg font-black text-gray-900 dark:text-white mb-3">Αποτέλεσμα</h2>
                <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                  {result.raw}
                </pre>
              </div>
            ) : (
              <>
                {typeof result.score === 'number' && (
                  <div className="text-center pb-4 border-b border-[#ff97b2]/25 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Βαθμός</p>
                    <p
                      className={`text-4xl sm:text-5xl font-black ${scoreColorClass(result.score, maxScore)}`}
                    >
                      {result.score}/{maxScore}
                    </p>
                  </div>
                )}

                {(result.correctPoints?.length ?? 0) > 0 && (
                  <section>
                    <h2 className="text-base font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      Σωστά σημεία
                    </h2>
                    <ul className="space-y-2">
                      {result.correctPoints!.map((point, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300"
                        >
                          <span className="text-emerald-600 dark:text-emerald-400 shrink-0">✅</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {(result.mistakes?.length ?? 0) > 0 && (
                  <section>
                    <h2 className="text-base font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      Λάθη
                    </h2>
                    <ul className="space-y-2">
                      {result.mistakes!.map((mistake, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300"
                        >
                          <span className="text-red-600 dark:text-red-400 shrink-0">❌</span>
                          <span>{mistake}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {result.correctedSolution && (
                  <section>
                    <h2 className="text-base font-black text-gray-900 dark:text-white mb-3">
                      Διορθωμένη λύση
                    </h2>
                    <pre className="rounded-xl bg-slate-900/95 text-slate-100 p-4 text-sm font-mono leading-relaxed overflow-x-auto border border-slate-700/80 max-h-96 overflow-y-auto">
                      <code>{result.correctedSolution}</code>
                    </pre>
                  </section>
                )}

                {result.explanation && (
                  <section>
                    <h2 className="text-base font-black text-gray-900 dark:text-white mb-3">Εξήγηση</h2>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {result.explanation}
                    </p>
                  </section>
                )}
              </>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AiCorrectorPage;
