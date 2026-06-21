/** Πρόγραμμα σπουδών — τύποι και helpers */

import { EKPA_IPT_CURRICULUM } from './ekpaIptCurriculum.generated';
import { AUTH_INFORMATICS_CURRICULUM } from './authInformaticsCurriculum.generated';
import { OPA_INFORMATICS_CURRICULUM } from './opaInformaticsCurriculum.generated';

export { EKPA_IPT_CURRICULUM, AUTH_INFORMATICS_CURRICULUM, OPA_INFORMATICS_CURRICULUM };

export type SemesterSlotMark = 'Υ' | 'B';

export type CurriculumSlots = Partial<
  Record<'s1' | 's2' | 's3' | 's4' | 's5' | 's6', SemesterSlotMark>
>;

export type CourseCategory =
  | 'mandatory'
  | 'mandatory-choice'
  | 'elective'
  | 'general'
  | 'lab'
  | 'project';

export type CurriculumCourse = {
  name: string;
  code: string;
  ects: number;
  kind: string;
  slots?: CurriculumSlots;
};

export type CurriculumSemester = {
  semester: number;
  courses: CurriculumCourse[];
};

export type SchoolCurriculum = {
  title: string;
  subtitle?: string;
  semesters: CurriculumSemester[];
};

export type CurriculumFilter = 'all' | 'mandatory' | 'elective';

const CATEGORY_LABELS: Record<CourseCategory, string> = {
  mandatory: 'Υποχρεωτικό',
  'mandatory-choice': "Κατ' επιλογή",
  elective: 'Επιλογής',
  general: 'Γενικής επιλογής',
  lab: 'Εργαστήριο',
  project: 'Πτυχιακή / Project',
};

const CATEGORY_COLORS: Record<CourseCategory, string> = {
  mandatory: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
  'mandatory-choice': 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200',
  elective: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200',
  general: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200',
  lab: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200',
  project: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/40 dark:text-fuchsia-200',
};

export function getCourseCategory(kind: string): CourseCategory {
  if (kind.includes('Υποχρεωτικό (ΥΜ)')) return 'mandatory';
  if (kind.includes('ΕΥΜ') || kind.includes("Κατ' Επιλογή")) return 'mandatory-choice';
  if (kind.toLowerCase() === 'project') return 'project';
  if (kind.includes('Πρακτική')) return 'project';
  if (kind.includes('ΓΠ') || kind.includes('Γενικής')) return 'general';
  if (kind.includes('ΕΡ')) return 'lab';
  return 'elective';
}

export function getCourseCategoryLabel(kind: string): string {
  return CATEGORY_LABELS[getCourseCategory(kind)];
}

export function getCourseCategoryClass(kind: string): string {
  return CATEGORY_COLORS[getCourseCategory(kind)];
}

export function isMandatoryCourse(kind: string): boolean {
  return getCourseCategory(kind) === 'mandatory';
}

export function isElectiveCourse(kind: string): boolean {
  const cat = getCourseCategory(kind);
  return cat === 'elective' || cat === 'lab' || cat === 'project';
}

export function matchesCurriculumFilter(course: CurriculumCourse, filter: CurriculumFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'mandatory') {
    const cat = getCourseCategory(course.kind);
    return cat === 'mandatory' || cat === 'mandatory-choice';
  }
  return isElectiveCourse(course.kind) || getCourseCategory(course.kind) === 'general';
}

export function filterCurriculum(
  curriculum: SchoolCurriculum,
  filter: CurriculumFilter,
): SchoolCurriculum {
  return {
    ...curriculum,
    semesters: curriculum.semesters
      .map((sem) => ({
        ...sem,
        courses: sem.courses.filter((c) => matchesCurriculumFilter(c, filter)),
      }))
      .filter((sem) => sem.courses.length > 0),
  };
}

export function countCurriculumCourses(
  curriculum: SchoolCurriculum,
  predicate: (course: CurriculumCourse) => boolean,
): number {
  return curriculum.semesters.reduce(
    (n, sem) => n + sem.courses.filter(predicate).length,
    0,
  );
}

/** Αντιστοίχιση school.id → πρόγραμμα σπουδών */
export const SCHOOL_CURRICULA: Record<string, SchoolCurriculum> = {
  '330': EKPA_IPT_CURRICULUM,
  '338': AUTH_INFORMATICS_CURRICULUM,
  '333': OPA_INFORMATICS_CURRICULUM,
};

export function hasSchoolCurriculum(schoolId: string): boolean {
  return schoolId in SCHOOL_CURRICULA;
}
