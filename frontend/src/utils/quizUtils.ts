import { apiFetch } from '@/utils/apiClient';

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

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8001';
const QUIZ_CACHE_KEY = 'quizDataCache:v2';
const QUIZ_CACHE_TTL_MS = 5 * 60 * 1000;

let inMemoryQuizCache: { ts: number; data: QuizData[] } | null = null;

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
  try {
    const data = await apiFetch<BackendCategoriesResponse>(`${BACKEND_URL}/api/categories`);
    return data.quiz_categories || [];
  } catch (error) {
    console.error('Error fetching quiz categories:', error);
    return [];
  }
};

export const fetchQuizzesByChapter = async (chapter: string | number): Promise<QuizData> => {
  try {
    const data = await apiFetch<BackendChapterResponse>(
      `${BACKEND_URL}/api/quiz/questions/${chapter}`
    );

    return {
      id: `chapter-${chapter}`,
      title: String(data.chapter),
      questions: data.questions.map((q) => ({
        ...q,
        answers: q.answers,
      })),
    };
  } catch (error) {
    console.error(`Error fetching quizzes for chapter ${chapter}:`, error);
    return {
      id: `chapter-${chapter}`,
      title: `Chapter ${chapter}`,
      questions: [],
    };
  }
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

  try {
    // Pull quizzes in pages so this scales when quiz volume grows.
    const pageSize = 250;
    let offset = 0;
    let hasMore = true;
    const allQuestions: Question[] = [];

    while (hasMore) {
      const page = await apiFetch<BackendAllQuestionsResponse>(
        `${BACKEND_URL}/api/quiz/questions?limit=${pageSize}&offset=${offset}`,
        { dedupeKey: `quiz-questions-page-${offset}` }
      );
      const pageQuestions = Array.isArray(page?.questions) ? page.questions : [];
      allQuestions.push(...pageQuestions);
      hasMore = Boolean(page?.has_more);
      offset += pageSize;
      if (!pageQuestions.length) {
        hasMore = false;
      }
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
    return [];
  }
};
