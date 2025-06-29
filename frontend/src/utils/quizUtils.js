const BACKEND_URL = 'http://localhost:8001';

const chapterNameMap = {
  lists: 'Λίστες',
  stack: 'Στοίβα',
  queue: 'Ουρά',
  trees: 'Δένδρα',
  oop: 'Αντικειμενοστραφής προγραμματισμός',
  debug: 'Αποσφαλμάτωση',
};

export const fetchQuizCategories = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/categories`);
    const data = await response.json();
    return data.quiz_categories || [];
  } catch (error) {
    console.error('Error fetching quiz categories:', error);
    return [];
  }
};

export const fetchQuizzesByChapter = async (chapter) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/quiz/questions/${chapter}`);
    const data = await response.json();

    // Format the response to match the expected structure
    return {
      id: `chapter-${chapter}`,
      title: data.chapter,
      questions: data.questions.map((q) => ({
        ...q,
        answers: q.answers, // Already structured correctly from backend
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

export const fetchAllQuizzes = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/quiz/questions`);
    const data = await response.json();

    // Group questions by chapter
    const questionsByChapter = {};

    data.questions.forEach((question) => {
      if (!questionsByChapter[question.chapter]) {
        questionsByChapter[question.chapter] = [];
      }
      questionsByChapter[question.chapter].push(question);
    });

    // Format into quiz objects with chapter titles
    const quizzes = Object.entries(questionsByChapter).map(([chapter, questions]) => ({
      id: `chapter-${chapter}`,
      title: `Κεφάλαιο ${chapterNameMap[chapter] || chapter}`,
      questions,
    }));

    return quizzes;
  } catch (error) {
    console.error('Error fetching all quizzes:', error);
    return [];
  }
};
