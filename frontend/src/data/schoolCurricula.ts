/** Πρόγραμμα σπουδών — τύποι και helpers */

import { EKPA_IPT_CURRICULUM } from './ekpaIptCurriculum.generated';
import { EKPA_DIGITAL_INDUSTRY_CURRICULUM } from './ekpaDigitalIndustryCurriculum.generated';
import { EKPA_ECONOMIC_SCIENCE_CURRICULUM } from './ekpaEconomicScienceCurriculum.generated';
import { AUTH_INFORMATICS_CURRICULUM } from './authInformaticsCurriculum.generated';
import { OPA_INFORMATICS_CURRICULUM } from './opaInformaticsCurriculum.generated';
import { OPA_ECONOMIC_SCIENCE_CURRICULUM } from './opaEconomicScienceCurriculum.generated';
import { UNIPI_INFORMATICS_CURRICULUM } from './unipiInformaticsCurriculum.generated';
import { PAMAK_CSC_CURRICULUM } from './pamakCscCurriculum.generated';
import { PAMAK_ECONOMIC_SCIENCE_CURRICULUM } from './pamakEconomicScienceCurriculum.generated';
import { PAMAK_ISC_CURRICULUM } from './pamakIscCurriculum.generated';
import { HAROKOPIO_INFORMATICS_CURRICULUM } from './harokopioInformaticsCurriculum.generated';
import { PAPEI_DIGITAL_SYSTEMS_CURRICULUM } from './papeiDigitalSystemsCurriculum.generated';
import { PAPEI_INDUSTRIAL_MANAGEMENT_CURRICULUM } from './papeiIndustrialManagementCurriculum.generated';
import { PAPEI_ECONOMIC_SCIENCE_CURRICULUM } from './papeiEconomicScienceCurriculum.generated';
import { UOC_CS_CURRICULUM } from './uocCsCurriculum.generated';
import { DIPAE_CPE_CURRICULUM } from './dipaeCpeCurriculum.generated';
import { DIPAE_PRODUCTION_MANAGEMENT_CURRICULUM } from './dipaeProductionManagementCurriculum.generated';
import { TUC_PRODUCTION_MANAGEMENT_CURRICULUM } from './tucProductionManagementCurriculum.generated';
import { DIPAE_SERRES_CPE_CURRICULUM } from './dipaeSerresCpeCurriculum.generated';
import { DPTH_KAVALA_INFORMATICS_CURRICULUM } from './dpthKavalaInformaticsCurriculum.generated';
import { DPTH_PRODUCTION_MANAGEMENT_CURRICULUM } from './dpthProductionManagementCurriculum.generated';
import { UTH_BIOMED_INFORMATICS_CURRICULUM } from './uthBiomedInformaticsCurriculum.generated';
import { UOP_TRIPOLI_ICT_CURRICULUM } from './uopTripoliIctCurriculum.generated';
import { UTH_ICT_CURRICULUM } from './uthIctCurriculum.generated';
import { UTH_DIGITAL_SYSTEMS_CURRICULUM } from './uthDigitalSystemsCurriculum.generated';
import { UOWM_KASTORIA_INFORMATICS_CURRICULUM } from './uowmKastoriaInformaticsCurriculum.generated';
import { UOWM_KOZANI_PRODUCT_DESIGN_CURRICULUM } from './uowmKozaniProductDesignCurriculum.generated';
import { ELMEPA_ECE_CURRICULUM } from './elmepaEceCurriculum.generated';
import { AEGEAN_SAMOS_ICS_CURRICULUM } from './aegeanSamosIcsCurriculum.generated';
import { AEGEAN_SYROS_PRODUCT_DESIGN_CURRICULUM } from './aegeanSyrosProductDesignCurriculum.generated';
import { UOP_SPARTA_DIGITAL_SYSTEMS_CURRICULUM } from './uopSpartaDigitalSystemsCurriculum.generated';
import { UTH_ENERGY_SYSTEMS_CURRICULUM } from './uthEnergySystemsCurriculum.generated';
import { UOI_ARTA_ICT_CURRICULUM } from './uoiArtaIctCurriculum.generated';
import { IONIO_CORFU_INFORMATICS_CURRICULUM } from './ionioCorfuInformaticsCurriculum.generated';
import { PADA_CPE_CURRICULUM } from './padaCpeCurriculum.generated';
import { PADA_INDUSTRIAL_DESIGN_PRODUCTION_CURRICULUM } from './padaIndustrialDesignProductionCurriculum.generated';

export {
  EKPA_IPT_CURRICULUM,
  EKPA_DIGITAL_INDUSTRY_CURRICULUM,
  EKPA_ECONOMIC_SCIENCE_CURRICULUM,
  AUTH_INFORMATICS_CURRICULUM,
  OPA_INFORMATICS_CURRICULUM,
  OPA_ECONOMIC_SCIENCE_CURRICULUM,
  UNIPI_INFORMATICS_CURRICULUM,
  PAMAK_CSC_CURRICULUM,
  PAMAK_ECONOMIC_SCIENCE_CURRICULUM,
  PAMAK_ISC_CURRICULUM,
  HAROKOPIO_INFORMATICS_CURRICULUM,
  PAPEI_DIGITAL_SYSTEMS_CURRICULUM,
  PAPEI_INDUSTRIAL_MANAGEMENT_CURRICULUM,
  PAPEI_ECONOMIC_SCIENCE_CURRICULUM,
  UOC_CS_CURRICULUM,
  DIPAE_CPE_CURRICULUM,
  DIPAE_PRODUCTION_MANAGEMENT_CURRICULUM,
  TUC_PRODUCTION_MANAGEMENT_CURRICULUM,
  DIPAE_SERRES_CPE_CURRICULUM,
  DPTH_KAVALA_INFORMATICS_CURRICULUM,
  DPTH_PRODUCTION_MANAGEMENT_CURRICULUM,
  UTH_BIOMED_INFORMATICS_CURRICULUM,
  UOP_TRIPOLI_ICT_CURRICULUM,
  UTH_ICT_CURRICULUM,
  UTH_DIGITAL_SYSTEMS_CURRICULUM,
  UOWM_KASTORIA_INFORMATICS_CURRICULUM,
  UOWM_KOZANI_PRODUCT_DESIGN_CURRICULUM,
  ELMEPA_ECE_CURRICULUM,
  AEGEAN_SAMOS_ICS_CURRICULUM,
  AEGEAN_SYROS_PRODUCT_DESIGN_CURRICULUM,
  UOP_SPARTA_DIGITAL_SYSTEMS_CURRICULUM,
  UTH_ENERGY_SYSTEMS_CURRICULUM,
  UOI_ARTA_ICT_CURRICULUM,
  IONIO_CORFU_INFORMATICS_CURRICULUM,
  PADA_CPE_CURRICULUM,
  PADA_INDUSTRIAL_DESIGN_PRODUCTION_CURRICULUM,
};

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

export type CourseHours = {
  lecture: number;
  /** Ε — εργαστήριο */
  lab?: number;
  /** Φ — φροντιστήριο */
  tutorial?: number;
};

export type CurriculumCourse = {
  name: string;
  code: string;
  ects: number;
  kind: string;
  hours?: CourseHours;
  slots?: CurriculumSlots;
};

export type CurriculumSemester = {
  semester: number;
  courses: CurriculumCourse[];
};

export type SchoolCurriculum = {
  title: string;
  subtitle?: string;
  /** Σημείωση για ώρες διδασκαλίας (π.χ. Ε=εργαστήριο, Φ=φροντιστήριο) */
  hoursNote?: string;
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
  if (kind.includes('Υποχρεωτικό-Επιλογής') || kind.includes('ΥΠ-ΕΠ')) {
    return 'mandatory-choice';
  }
  if (kind.includes('Εξειδίκευση')) return 'mandatory-choice';
  if (kind.includes('Εργαλειοθήκη')) return 'elective';
  if (kind.includes('Βασικά κατεύθυνσης') || kind.includes('Υποχρεωτικό ροής')) {
    return 'mandatory-choice';
  }
  if (kind.includes('Υποχρεωτικό κατεύθυνσης') || kind.includes('Υποχρεωτικό δευτερεύουσας')) {
    return 'mandatory-choice';
  }
  if (kind.includes('Υποχρεωτικό (ΥΜ)') || kind.includes('Υποχρεωτικό κορμού')) return 'mandatory';
  if (kind.includes('υποβάθρου')) return 'mandatory';
  if (kind.includes('Υποχρεωτικό')) return 'mandatory';
  if (kind.includes('ΕΥΜ') || kind.includes("Κατ' Επιλογή") || kind.includes('Επιλογής Υποχρεωτικό')) {
    return 'mandatory-choice';
  }
  if (kind.includes('ΓΟΕΥ') || kind.includes('Γενικής Ομάδας')) return 'mandatory-choice';
  if (kind.startsWith('Ροής ·')) return 'mandatory-choice';
  if (kind.toLowerCase() === 'project') return 'project';
  if (kind.includes('Διπλωματική') || kind.includes('Πτυχιακή')) return 'project';
  if (kind.includes('Πρακτική') || kind.includes('Δεξιοτήτων')) return 'project';
  if (kind.includes('ΓΠ') || kind.includes('Γενικής') || kind.includes('Γνώσεων') || kind.includes('Ελεύθερης') || kind.includes('Παιδαγωγικής') || kind.includes('Επάρκειας') || kind.includes('Προαιρετικό')) {
    return 'general';
  }
  if (kind.includes('ΕΡ')) return 'lab';
  if (kind.includes('Επιλογής ροής') || kind.includes('Επιλογής (όλες')) return 'elective';
  if (kind.includes('Επιλογής') && !kind.includes('Υποχρεωτικό')) return 'elective';
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
export function formatCourseHours(hours: CourseHours): string {
  const parts = [`${hours.lecture}`];
  if (hours.tutorial) parts.push(`${hours.tutorial}Φ`);
  if (hours.lab) parts.push(`${hours.lab}Ε`);
  return parts.join('+');
}

/** ΣΣΑΣ — ίδιο ακαδημαϊκό πρόγραμμα με ΑΠΘ Πληροφορικής + στρατιωτική εκπαίδευση */
export const SSAS_INFORMATICS_CURRICULUM: SchoolCurriculum = {
  ...AUTH_INFORMATICS_CURRICULUM,
  title: 'Πληροφορικής (ΣΣΑΣ)',
  subtitle: 'ΣΣΑΣ · Θεσσαλονίκη',
  hoursNote:
    'Ακολουθεί το πρόγραμμα σπουδών της Πληροφορικής ΑΠΘ. ' +
    'Παράλληλα παρέχεται στρατιωτική εκπαίδευση.',
};

export const SCHOOL_CURRICULA: Record<string, SchoolCurriculum> = {
  '309': EKPA_ECONOMIC_SCIENCE_CURRICULUM,
  '330': EKPA_IPT_CURRICULUM,
  '338': AUTH_INFORMATICS_CURRICULUM,
  '312': OPA_ECONOMIC_SCIENCE_CURRICULUM,
  '333': OPA_INFORMATICS_CURRICULUM,
  '339': UNIPI_INFORMATICS_CURRICULUM,
  '1008': EKPA_DIGITAL_INDUSTRY_CURRICULUM,
  '1211': PAMAK_CSC_CURRICULUM,
  '1212': PAMAK_ISC_CURRICULUM,
  '317': PAMAK_ECONOMIC_SCIENCE_CURRICULUM,
  '412': HAROKOPIO_INFORMATICS_CURRICULUM,
  '238': AEGEAN_SYROS_PRODUCT_DESIGN_CURRICULUM,
  '262': PAPEI_DIGITAL_SYSTEMS_CURRICULUM,
  '315': PAPEI_ECONOMIC_SCIENCE_CURRICULUM,
  '336': PAPEI_INDUSTRIAL_MANAGEMENT_CURRICULUM,
  '216': UOC_CS_CURRICULUM,
  '1625': DIPAE_CPE_CURRICULUM,
  '1624': DIPAE_PRODUCTION_MANAGEMENT_CURRICULUM,
  '224': DPTH_PRODUCTION_MANAGEMENT_CURRICULUM,
  '230': TUC_PRODUCTION_MANAGEMENT_CURRICULUM,
  '1622': DIPAE_SERRES_CPE_CURRICULUM,
  '1630': DPTH_KAVALA_INFORMATICS_CURRICULUM,
  '369': UTH_BIOMED_INFORMATICS_CURRICULUM,
  '98': UOP_TRIPOLI_ICT_CURRICULUM,
  '99': UTH_ICT_CURRICULUM,
  '1439': UTH_DIGITAL_SYSTEMS_CURRICULUM,
  '1542': UOWM_KOZANI_PRODUCT_DESIGN_CURRICULUM,
  '1554': UOWM_KASTORIA_INFORMATICS_CURRICULUM,
  '1662': ELMEPA_ECE_CURRICULUM,
  '344': AEGEAN_SAMOS_ICS_CURRICULUM,
  '1519': UOP_SPARTA_DIGITAL_SYSTEMS_CURRICULUM,
  '1436': UTH_ENERGY_SYSTEMS_CURRICULUM,
  '1250': UOI_ARTA_ICT_CURRICULUM,
  '366': IONIO_CORFU_INFORMATICS_CURRICULUM,
  '389': PADA_INDUSTRIAL_DESIGN_PRODUCTION_CURRICULUM,
  '390': PADA_CPE_CURRICULUM,
  '889': SSAS_INFORMATICS_CURRICULUM,
};

export function hasSchoolCurriculum(schoolId: string): boolean {
  return schoolId in SCHOOL_CURRICULA;
}
