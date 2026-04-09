import { apiFetch } from '@/utils/apiClient';
import { getBackendUrlCandidates } from '@/utils/backendUrl';

// --- Types ---

export interface Answer {
  text: string;
  correct: boolean;
}

export interface Question {
  id: string;
  question: string;
  answers: Answer[];
  chapter: string | number;
  explanation?: string;
}

export interface QuizData {
  id: string;
  title: string;
  questions: Question[];
  number?: string;
  description?: string;
}

interface BackendCategoriesResponse {
  quiz_categories: string[];
}

interface BackendChapterResponse {
  chapter: string | number;
  questions: Question[];
}

interface BackendAllQuestionsResponse {
  questions: Question[];
  total?: number;
  has_more?: boolean;
  limit?: number;
  offset?: number;
}

// --- Constants ---

const QUIZ_CACHE_KEY = 'quizDataCache:v2';
const QUIZ_CACHE_TTL_MS = 5 * 60 * 1000;
/** Συντηρητικό page size για συμβατότητα με αυστηρά backend validators και proxies. */
const QUIZ_FETCH_LIMIT = 500;
const QUIZ_FETCH_TIMEOUT_MS = 60_000;

let inMemoryQuizCache: { ts: number; data: QuizData[] } | null = null;
/** Ένα inflight fetch — αποφεύγει διπλό backend load (π.χ. prefetch + QuizPage ταυτόχρονα). */
let fetchAllQuizzesInFlight: Promise<QuizData[]> | null = null;

const normalizeGreek = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

const chapterNameMap: Record<string | number, string> = {
  1: 'Ανάλυση προβλήματος',
  2: 'Βασικές έννοιες αλγορίθμων',
  3: 'Δομές δεδομένων και Αλγόριθμοι',
  6: 'Εισαγωγή στον προγραμματισμό',
  7: 'Βασικές έννοιες προγραμματισμού',
  8: 'Επιλογή και επανάληψη',
  10: 'Υποπρογράμματα',
  12: 'Γράφοι',
  13: 'Τεχνικές σχεδίασης και ανάλυσης αλγορίθμων',
  lists: 'Λίστες',
  stack: 'Στοίβα',
  queue: 'Ουρά',
  trees: 'Δένδρα',
  oop: 'Αντικειμενοστραφής προγραμματισμός',
  debug: 'Εκσφαλμάτωση',
};

// --- Functions ---

export const fetchQuizCategories = async (): Promise<string[]> => {
  let lastError: unknown = null;
  try {
    for (const base of getBackendUrlCandidates()) {
      try {
        const data = await apiFetch<BackendCategoriesResponse>(`${base}/api/categories`, {
          dedupeKey: `quiz:categories:${base}`,
          cacheTtlMs: 10 * 60 * 1000,
          cacheKey: `quiz:categories:${base}`,
        });
        return data.quiz_categories || [];
      } catch (error) {
        lastError = error;
      }
    }
  } catch (error) {
    lastError = error;
  }
  console.error('Error fetching quiz categories:', lastError);
  return [];
};

export const fetchQuizzesByChapter = async (chapter: string | number): Promise<QuizData> => {
  let lastError: unknown = null;
  try {
    for (const base of getBackendUrlCandidates()) {
      try {
        const data = await apiFetch<BackendChapterResponse>(`${base}/api/quiz/questions/${chapter}`, {
          dedupeKey: `quiz:chapter:${chapter}:${base}`,
          cacheKey: `quiz:chapter:${chapter}:${base}`,
          cacheTtlMs: QUIZ_CACHE_TTL_MS,
          timeoutMs: QUIZ_FETCH_TIMEOUT_MS,
          retries: 1,
        });

        return {
          id: `chapter-${chapter}`,
          title: String(data.chapter),
          questions: data.questions.map((q) => ({
            ...q,
            answers: q.answers,
          })),
        };
      } catch (error) {
        lastError = error;
      }
    }
  } catch (error) {
    lastError = error;
  }
  console.error(`Error fetching quizzes for chapter ${chapter}:`, lastError);
  return {
    id: `chapter-${chapter}`,
    title: `Chapter ${chapter}`,
    questions: [],
  };
};

export const fetchAllQuizzes = async (): Promise<QuizData[]> => {
  // Serve from in-memory cache first for the fastest possible navigation.
  if (inMemoryQuizCache && Date.now() - inMemoryQuizCache.ts < QUIZ_CACHE_TTL_MS) {
    return inMemoryQuizCache.data;
  }

  // Then try session cache to avoid refetching on route changes/refreshes.
  try {
    const rawCached = sessionStorage.getItem(QUIZ_CACHE_KEY);
    if (rawCached) {
      const parsed = JSON.parse(rawCached) as { ts: number; data: QuizData[] };
      if (parsed?.ts && Array.isArray(parsed?.data) && Date.now() - parsed.ts < QUIZ_CACHE_TTL_MS) {
        inMemoryQuizCache = parsed;
        return parsed.data;
      }
    }
  } catch (cacheErr) {
    console.warn('Quiz cache read failed:', cacheErr);
  }

  if (fetchAllQuizzesInFlight) {
    return fetchAllQuizzesInFlight;
  }

  fetchAllQuizzesInFlight = (async () => {
  try {
    const bases = getBackendUrlCandidates();
    let allQuestions: Question[] = [];
    let lastError: unknown = null;

    for (const base of bases) {
      try {
        const fetchPage = (offset: number) =>
          apiFetch<BackendAllQuestionsResponse>(
            `${base}/api/quiz/questions?limit=${QUIZ_FETCH_LIMIT}&offset=${offset}`,
            {
              dedupeKey: `quiz-questions-${base}-${offset}`,
              timeoutMs: QUIZ_FETCH_TIMEOUT_MS,
              retries: 1,
              cacheTtlMs: QUIZ_CACHE_TTL_MS,
              cacheKey: `quiz:raw:${base}:${offset}`,
            }
          );

        const first = await fetchPage(0);
        const candidate: Question[] = Array.isArray(first?.questions) ? [...first.questions] : [];

        let hasMore = Boolean(first?.has_more);
        let offset = QUIZ_FETCH_LIMIT;
        while (hasMore) {
          const page = await fetchPage(offset);
          const chunk = Array.isArray(page?.questions) ? page.questions : [];
          candidate.push(...chunk);
          hasMore = Boolean(page?.has_more) && chunk.length > 0;
          offset += QUIZ_FETCH_LIMIT;
        }

        // Prefer the first backend that returns non-empty quiz data.
        if (candidate.length > 0) {
          allQuestions = candidate;
          break;
        }
      } catch (err) {
        lastError = err;
      }
    }

    if (allQuestions.length === 0 && lastError) {
      throw lastError instanceof Error ? lastError : new Error(String(lastError));
    }

    if (allQuestions.length === 0) {
      throw new Error('No quiz data returned from backend.');
    }

    const questionsByChapter: Record<string, Question[]> = {};

    allQuestions.forEach((question) => {
      const chap = String(question.chapter);
      if (!questionsByChapter[chap]) {
        questionsByChapter[chap] = [];
      }
      questionsByChapter[chap].push(question);
    });

    const quizzes: QuizData[] = Object.entries(questionsByChapter).map(([chapter, questions]) => ({
      id: `chapter-${chapter}`,
      title: `${chapterNameMap[chapter] || chapter}`,
      number: chapter,
      description: '',
      questions,
    }));

    // Merge "debug" and "εκσφαλμάτωση" into one chapter card.
    const mergedByKey = new Map<string, QuizData>();
    quizzes.forEach((quiz) => {
      const normalizedTitle = normalizeGreek(quiz.title);
      const isDebugChapter =
        normalizedTitle === 'debug' ||
        normalizedTitle === 'εκσφαλματωση' ||
        normalizeGreek(String(quiz.number || '')) === 'debug';

      const mergeKey = isDebugChapter ? 'debug-merged' : quiz.id;
      const existing = mergedByKey.get(mergeKey);
      if (!existing) {
        mergedByKey.set(
          mergeKey,
          isDebugChapter
            ? {
                ...quiz,
                id: 'chapter-debug',
                title: 'Εκσφαλμάτωση',
                number: 'debug',
              }
            : quiz
        );
        return;
      }

      const byQuestionId = new Map<string, Question>();
      existing.questions.forEach((q) => byQuestionId.set(String(q.id), q));
      quiz.questions.forEach((q) => byQuestionId.set(String(q.id), q));
      existing.questions = Array.from(byQuestionId.values());
    });

    const mergedQuizzes = Array.from(mergedByKey.values());

    const cachePayload = { ts: Date.now(), data: mergedQuizzes };
    inMemoryQuizCache = cachePayload;
    try {
      sessionStorage.setItem(QUIZ_CACHE_KEY, JSON.stringify(cachePayload));
    } catch (cacheErr) {
      console.warn('Quiz cache write failed:', cacheErr);
    }

    return mergedQuizzes;
  } catch (error) {
    console.error('Error fetching all quizzes:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
  })();

  try {
    return await fetchAllQuizzesInFlight;
  } finally {
    fetchAllQuizzesInFlight = null;
  }
};
