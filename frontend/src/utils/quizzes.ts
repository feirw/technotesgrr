import quiz_chap1 from '../data/quizzes/chap1.json';
import quiz_chap2 from '../data/quizzes/chap2.json';
import quiz_chap3 from '../data/quizzes/chap3.json';
import quiz_chap6 from '../data/quizzes/chap6.json';
import quiz_chap7 from '../data/quizzes/chap7.json';
import quiz_chap8 from '../data/quizzes/chap8.json';
import quiz_chap10 from '../data/quizzes/chap10.json';
import quiz_stack from '../data/quizzes/stack.json';
import quiz_queue from '../data/quizzes/queue.json';
import quiz_lists from '../data/quizzes/lists.json';
import quiz_trees from '../data/quizzes/trees.json';
import quiz_oop from '../data/quizzes/oop.json';
import quiz_debug from '../data/quizzes/debug.json';

export interface Answer {
  text: string;
  correct: boolean;
}

export interface Question {
  id: string;
  question: string;
  answers: Answer[];
}

export interface Quiz {
  id: string;
  title: string;
  number: string;
  description: string;
  questions: Question[];
}

export const quizzes: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'Ανάλυση προβλήματος',
    number: '1',
    description: '',
    questions: quiz_chap1 as Question[],
  },
  {
    id: 'quiz-2',
    title: 'Βασικές έννοιες αλγορίθμων',
    number: '2',
    description: '',
    questions: quiz_chap2 as Question[],
  },
  {
    id: 'quiz-3',
    title: 'Δομές δεδομένων και Αλγόριθμοι',
    number: '3',
    description: '',
    questions: quiz_chap3 as Question[],
  },
  {
    id: 'quiz-4',
    title: 'Εισαγωγή στον προγραμματισμό',
    number: '4',
    description: '',
    questions: quiz_chap6 as Question[],
  },
  {
    id: 'quiz-5',
    title: 'Βασικές έννοιες προγραμματισμού',
    number: '5',
    description: '',
    questions: quiz_chap7 as Question[],
  },
  {
    id: 'quiz-6',
    title: 'Επιλογή και επανάληψη',
    number: '6',
    description: '',
    questions: quiz_chap8 as Question[],
  },
  {
    id: 'quiz-7',
    title: 'Υποπρογράμματα',
    number: '7',
    description: '',
    questions: quiz_chap10 as Question[],
  },
  {
    id: 'quiz-8',
    title: 'Στοίβα',
    number: '8',
    description: '',
    questions: quiz_stack as Question[],
  },
  {
    id: 'quiz-9',
    title: 'Ουρά',
    number: '9',
    description: '',
    questions: quiz_queue as Question[],
  },
  {
    id: 'quiz-10',
    title: 'Λίστες',
    number: '10',
    description: '',
    questions: quiz_lists as Question[],
  },
  {
    id: 'quiz-11',
    title: 'Δένδρα',
    number: '11',
    description: '',
    questions: quiz_trees as Question[],
  },
  {
    id: 'quiz-12',
    title: 'Αντικειμενοστραφής προγραμματισμός',
    number: '12',
    description: '',
    questions: quiz_oop as Question[],
  },
  {
    id: 'quiz-13',
    title: 'Εκσφαλμάτωση',
    number: '13',
    description: '',
    questions: quiz_debug as Question[],
  },
];
