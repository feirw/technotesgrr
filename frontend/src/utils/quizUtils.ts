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

/** Σειρά κεφαλαίων όπως στο σχολικό βιβλίο / ύλη Πανελληνίων. */
const QUIZ_CHAPTER_ORDER = [
  '1',
  '2',
  '3',
  '6',
  '7',
  '8',
  '10',
  '12',
  '13',
  'stack',
  'queue',
  'lists',
  'trees',
  'oop',
  'debug',
] as const;

export const getQuizChapterSortIndex = (quiz: Pick<QuizData, 'number' | 'id'>): number => {
  const key = String(quiz.number ?? quiz.id.replace(/^chapter-/, ''));
  const idx = QUIZ_CHAPTER_ORDER.indexOf(key as (typeof QUIZ_CHAPTER_ORDER)[number]);
  return idx === -1 ? QUIZ_CHAPTER_ORDER.length + 1 : idx;
};

export const sortQuizzesByChapterOrder = <T extends Pick<QuizData, 'number' | 'id'>>(
  quizzes: T[],
): T[] => [...quizzes].sort((a, b) => getQuizChapterSortIndex(a) - getQuizChapterSortIndex(b));

// Το backend απλώς φορτώνει αυτά τα ίδια JSON σε DB και τα σερβίρει· τα quiz είναι ουσιαστικά
// στατικό περιεχόμενο, οπότε τα δένουμε στο bundle στο build time (Vite import.meta.glob) αντί
// να χτυπάμε το backend σε κάθε φόρτωση — μηδενικό network round trip, καμία εξάρτηση από
// cold-start του Render backend.
const quizFileModules = import.meta.glob<Array<Omit<Question, 'chapter'>>>('../data/quizzes/*.json', {
  eager: true,
  import: 'default',
});

const extractChapterFromFilename = (path: string): string => {
  const filename = path.split('/').pop()?.replace(/\.json$/, '') ?? path;
  const match = /^chap(\d+)$/i.exec(filename);
  return match ? match[1] : filename;
};

const buildStaticQuizzes = (): QuizData[] => {
  const questionsByChapter: Record<string, Question[]> = {};

  for (const [path, questions] of Object.entries(quizFileModules)) {
    const chapter = extractChapterFromFilename(path);
    if (!questionsByChapter[chapter]) questionsByChapter[chapter] = [];
    questionsByChapter[chapter].push(...questions.map((q) => ({ ...q, chapter })));
  }

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

  return sortQuizzesByChapterOrder(Array.from(mergedByKey.values()));
};

const STATIC_QUIZZES: QuizData[] = buildStaticQuizzes();

export const fetchAllQuizzes = async (): Promise<QuizData[]> => STATIC_QUIZZES;
