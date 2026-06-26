import type { SchoolCoefficientsEntry } from '@/data/schoolCoefficients2026';
import {
  CORE_EXAM_SUBJECT_SET,
  LANGUAGE_SPECIAL_SUBJECT_KEYS,
  isSpecialCoefficientSubject,
} from '@/utils/schoolCoefficientsUtils';

export type GradeInputs = Record<string, string>;

export type SubjectMoriaBreakdown = {
  subject: string;
  weight: number;
  grade: number;
  moria: number;
  note?: string;
};

export type SchoolMoriaResult = {
  total: number;
  breakdown: SubjectMoriaBreakdown[];
};

/** Προσέγγιση δεκάτου, κλίμακα 0–20. Κενό ή μη αριθμός → null. */
export function parseExamGrade(raw: string): number | null {
  const trimmed = raw.trim().replace(',', '.');
  if (!trimmed) return null;
  const value = Number(trimmed);
  if (!Number.isFinite(value) || value < 0 || value > 20) return null;
  return Math.round(value * 10) / 10;
}

function gradeForGenericSpecialSubject(grades: GradeInputs): number | null {
  const entered = LANGUAGE_SPECIAL_SUBJECT_KEYS.map((key) => parseExamGrade(grades[key] ?? '')).filter(
    (g): g is number => g !== null,
  );
  if (entered.length === 0) return null;
  return Math.max(...entered);
}

function gradeForCoefficient(coefSubject: string, grades: GradeInputs): number | null {
  if (coefSubject === 'Ειδικό Μάθημα') {
    return gradeForGenericSpecialSubject(grades);
  }
  return parseExamGrade(grades[coefSubject] ?? '');
}

/**
 * Επίσημος τύπος: (Σ βαθμός × συντελεστής) × 1.000
 * Οι συντελεστές στο dataset είναι ποσοστά (π.χ. 25 = 25%).
 */
export function calculateSchoolMoria(
  school: SchoolCoefficientsEntry,
  grades: GradeInputs,
): SchoolMoriaResult | null {
  const breakdown: SubjectMoriaBreakdown[] = [];
  let weightedSum = 0;

  for (const coef of school.coefficients) {
    const grade = gradeForCoefficient(coef.subject, grades);
    if (grade === null) return null;

    const weightDecimal = coef.weight / 100;
    weightedSum += grade * weightDecimal;
    breakdown.push({
      subject: coef.subject,
      weight: coef.weight,
      grade,
      moria: Math.round(grade * coef.weight * 10),
      note: coef.note,
    });
  }

  return {
    total: Math.round(weightedSum * 1000),
    breakdown,
  };
}

export function schoolRequiresSpecialGrade(school: SchoolCoefficientsEntry): boolean {
  return school.coefficients.some((c) => isSpecialCoefficientSubject(c.subject));
}

/** Μόνο τα 4 βασικά πανελληνικά — χωρίς ειδικά/αγωνίσματα/σχέδιο. */
export function schoolUsesOnlyCoreExams(school: SchoolCoefficientsEntry): boolean {
  return school.coefficients.every((c) => CORE_EXAM_SUBJECT_SET.has(c.subject));
}

export function coreGradesComplete(grades: GradeInputs): boolean {
  return [...CORE_EXAM_SUBJECT_SET].every((subject) => parseExamGrade(grades[subject] ?? '') !== null);
}
