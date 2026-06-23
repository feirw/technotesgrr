import type { SchoolCoefficientsEntry } from '@/data/schoolCoefficients2026';

export const CORE_EXAM_SUBJECTS = [
  'Νεοελληνική Γλώσσα και Λογοτεχνία',
  'Μαθηματικά',
  'Πληροφορική',
  'Οικονομία',
] as const;

export type CoreExamSubject = (typeof CORE_EXAM_SUBJECTS)[number];

/** Ειδικά μαθήματα — ξεχωριστά πεδία βαθμολογίας στον υπολογιστή μορίων */
export const SPECIAL_EXAM_SUBJECTS = [
  { key: 'Αγωνίσματα', label: 'Αγωνίσματα (1)' },
  { key: 'Αγγλικά', label: 'Αγγλικά' },
  { key: 'Γαλλικά', label: 'Γαλλικά' },
  { key: 'Γερμανικά', label: 'Γερμανικά' },
  { key: 'Ιταλικά', label: 'Ιταλικά' },
  { key: 'Ελεύθερο Σχέδιο', label: 'Ελεύθερο Σχέδιο' },
  { key: 'Γραμμικό Σχέδιο', label: 'Γραμμικό Σχέδιο' },
  { key: 'Μουσική Εκτέλεση και Ερμηνεία', label: 'Μουσική Εκτέλεση και Ερμηνεία (2)' },
  { key: 'Μουσική Αντίληψη, Θεωρία και Αρμονία', label: 'Μουσική Αντίληψη, Θεωρία και Αρμονία (2)' },
] as const;

export type SpecialExamSubjectKey = (typeof SPECIAL_EXAM_SUBJECTS)[number]['key'];

export const LANGUAGE_SPECIAL_SUBJECT_KEYS: SpecialExamSubjectKey[] = [
  'Αγγλικά',
  'Γαλλικά',
  'Γερμανικά',
  'Ιταλικά',
];

export const CORE_EXAM_SUBJECT_SET = new Set<string>(CORE_EXAM_SUBJECTS);

export function isSpecialCoefficientSubject(subject: string): boolean {
  return !CORE_EXAM_SUBJECT_SET.has(subject);
}

export function normalizeSearch(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ς/g, 'σ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenizeSearch(query: string): string[] {
  return normalizeSearch(query).split(/\s+/).filter(Boolean);
}

/** Κείμενο αναζήτησης: όνομα σχολής + ειδικά μαθήματα/σημειώσεις (όχι τα 4 βασικά πανελληνιακά). */
export function schoolSearchText(school: SchoolCoefficientsEntry): string {
  const parts = [school.name];
  for (const coef of school.coefficients) {
    if (!CORE_EXAM_SUBJECT_SET.has(coef.subject)) {
      parts.push(coef.subject);
    }
    if (coef.note) {
      parts.push(coef.note);
    }
  }
  return normalizeSearch(parts.join(' '));
}

export function matchesSchool(school: SchoolCoefficientsEntry, query: string): boolean {
  const tokens = tokenizeSearch(query);
  if (tokens.length === 0) return true;
  const haystack = schoolSearchText(school);
  return tokens.every((token) => haystack.includes(token));
}
