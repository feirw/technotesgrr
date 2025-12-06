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
}

// --- Constants ---

const BACKEND_URL = 'http://localhost:8001';

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
  debug: 'Αποσφαλμάτωση',
};

// --- Functions ---

export const fetchQuizCategories = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/categories`);
    const data: BackendCategoriesResponse = await response.json();
    return data.quiz_categories || [];
  } catch (error) {
    console.error('Error fetching quiz categories:', error);
    return [];
  }
};

export const fetchQuizzesByChapter = async (chapter: string | number): Promise<QuizData> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/quiz/questions/${chapter}`);
    const data: BackendChapterResponse = await response.json();

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
  try {
    const response = await fetch(`${BACKEND_URL}/api/quiz/questions`);
    const data: BackendAllQuestionsResponse = await response.json();

    const questionsByChapter: Record<string, Question[]> = {};

    data.questions.forEach((question) => {
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

    return quizzes;
  } catch (error) {
    console.error('Error fetching all quizzes:', error);
    return [];
  }
};
