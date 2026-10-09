import { MENU_ICONS } from '@/data/menuIcons';

export type PrepTool = {
  to: string;
  label: string;
  iconSrc: string;
};

export const PREP_TOOLS: PrepTool[] = [
  { to: '/online-mathimata', label: 'Online Μαθήματα', iconSrc: MENU_ICONS.onlineLessons },
  { to: '/quiz', label: 'Quiz', iconSrc: MENU_ICONS.quiz },
  { to: '/flashcards', label: 'Flashcards', iconSrc: MENU_ICONS.flashcards },
  { to: '/methodologies', label: 'Μεθοδολογίες', iconSrc: MENU_ICONS.methodologies },
  { to: '/domes-dedomenon', label: 'Δομές Δεδομένων', iconSrc: MENU_ICONS.dataStructures },
  { to: '/paliathemata', label: 'Παλιά Θέματα', iconSrc: MENU_ICONS.paliathemata },
  { to: '/algorithms', label: 'Αλγόριθμοι', iconSrc: MENU_ICONS.algorithms },
  { to: '/progress-tracker', label: 'Tracker Ύλης', iconSrc: MENU_ICONS.progressTracker },
  { to: '/study-timer', label: 'Study Timer', iconSrc: MENU_ICONS.studyTimer },
  { to: '/gloglossa', label: 'Διερμηνευτής ΓΛΩΣΣΑΣ', iconSrc: MENU_ICONS.gloglossa },
  { to: '/vivlia', label: 'Σχολικά βιβλία', iconSrc: MENU_ICONS.vivlia },
];
