/** Πανεπιστήμιο Κρήτης · Οικονομικών Επιστημών (Ρέθυμνο) */
import type { SchoolCurriculum } from './schoolCurricula';

const y = 'Υποχρεωτικό' as const;
const ep = 'Επιλογής' as const;
const sem = 'Σεμινάριο' as const;

const sem57Courses = [
  { code: 'OIK3108', ects: 6, name: 'Θεωρία Διεθνούς Εμπορίου', kind: y },
  { code: 'OIK3101', ects: 6, name: 'Δημόσια Οικονομική Ι', kind: y },
  { code: 'OIK3202', ects: 6, name: 'Μάνατζμεντ Ι', kind: y },
  { code: 'OIK3207', ects: 6, name: 'Χρηματοοικονομική Διοίκηση Ι', kind: y },
  { code: 'OIK3110', ects: 6, name: 'Οικονομική Μεγέθυνση Ι', kind: y },
  { code: 'OIK3302', ects: 6, name: 'Οικονομική Ανάπτυξη Ι', kind: ep },
  {
    code: 'OIK3212',
    ects: 6,
    name: 'Οικονομική των Μέσων Ενημέρωσης και Ψυχαγωγίας',
    kind: ep,
  },
  { code: 'OIK3214', ects: 6, name: 'Financial Institutions Management', kind: ep },
  { code: 'OIK3216', ects: 6, name: 'Ανάλυση Χρηματοοικονομικών Παραγώγων', kind: ep },
  {
    code: 'OIK3502',
    ects: 6,
    name: 'Μηχανική Μάθηση με Εφαρμογές στα Οικονομικά Ι',
    kind: ep,
  },
  { code: 'OIK3305', ects: 6, name: 'Διεθνής Πολιτική Οικονομία', kind: ep },
  { code: 'OIK3303', ects: 6, name: 'Μαρξιστική Οικονομική', kind: ep },
  { code: 'OIK3313', ects: 6, name: 'Βιώσιμη Ανάπτυξη', kind: ep },
  { code: 'OIK3601', ects: 6, name: 'Διδακτική της Οικονομικής Επιστήμης', kind: ep },
  { code: 'OIK3401', ects: 6, name: 'Προχωρημένα Αγγλικά Ι', kind: ep },
  { code: 'OIK4301', ects: 6, name: 'Ειδικά Θέματα Οικονομικής Θεωρίας', kind: sem },
  { code: 'OIK4106', ects: 6, name: 'Οικονομική Μεγέθυνση ΙΙ', kind: sem },
  { code: 'OIK4201', ects: 6, name: 'Ειδικά Θέματα Βιομηχανικής Οργάνωσης', kind: sem },
  {
    code: 'OIK4205',
    ects: 6,
    name: 'Οικονομική των Μέσων Επικοινωνίας και Ψυχαγωγίας ΙΙ',
    kind: sem,
  },
  {
    code: 'OIK4207',
    ects: 6,
    name: 'Οικονομικά Υποδείγματα της Θεωρίας Καινοτομίας',
    kind: sem,
  },
  { code: 'OIK4502', ects: 6, name: 'Εισαγωγή στον Προγραμματισμό με R', kind: sem },
] as const;

const sem68Courses = [
  { code: 'OIK3110', ects: 6, name: 'Οικονομική Μεγέθυνση Ι', kind: y },
  { code: 'OIK3107', ects: 6, name: 'Δημόσια Οικονομική ΙΙ', kind: ep },
  { code: 'OIK3215', ects: 6, name: 'Οικονομικά του Τουρισμού', kind: ep },
  { code: 'OIK3219', ects: 6, name: 'Μάρκετινγκ με έμφαση στον Τουρισμό', kind: ep },
  { code: 'OIK3211', ects: 6, name: 'Οικονομική των Επιχειρήσεων', kind: ep },
  { code: 'OIK3113', ects: 6, name: 'Ελληνική Οικονομία Ι', kind: ep },
  { code: 'OIK3117', ects: 6, name: 'Νομισματική Θεωρία Ι', kind: ep },
  { code: 'OIK3201', ects: 6, name: 'Βιομηχανική Οργάνωση Ι', kind: ep },
  { code: 'OIK3222', ects: 6, name: 'Βιώσιμη Χρηματοοικονομική', kind: ep },
  { code: 'OIK3209', ects: 6, name: 'Μάνατζμεντ ΙΙ', kind: ep },
  { code: 'OIK3210', ects: 6, name: 'Economics of Innovation and New Technologies', kind: ep },
  { code: 'OIK3218', ects: 6, name: 'Strategic Change Management', kind: ep },
  { code: 'OIK3217', ects: 6, name: 'Marketing', kind: ep },
  { code: 'OIK3402', ects: 6, name: 'Προχωρημένα Αγγλικά ΙΙ', kind: ep },
  { code: 'SKE611', ects: 4, name: 'Επιστημολογία των Κοινωνικών Επιστημών', kind: ep },
  { code: 'OIK4101', ects: 6, name: 'Ειδικά Θέματα Οικονομετρίας', kind: sem },
  { code: 'OIK4501', ects: 6, name: 'Ηλεκτρονικοί Υπολογιστές ΙΙΙ', kind: sem },
  { code: 'OIK4305', ects: 6, name: 'Συγκριτικά Οικονομικά Συστήματα ΙΙ', kind: sem },
] as const;

export const UOC_RETHYMNO_ECONOMIC_SCIENCE_CURRICULUM: SchoolCurriculum = {
  title: 'Οικονομικών Επιστημών',
  subtitle:
    'Πανεπιστήμιο Κρήτης · Ρέθυμνο · Γ\'–Δ\' έτος: ίδια μαθήματα στο 5ο/7ο και 6ο/8ο εξάμηνο',
  externalCoursesUrl: 'https://economics.soc.uoc.gr/el/page/1/6/mathimata',
  semesters: [
    {
      semester: 1,
      courses: [
        { code: 'OIK1001', ects: 8, name: 'Μαθηματικά Ι', kind: y },
        { code: 'OIK1003', ects: 8, name: 'Στατιστική Ι', kind: y },
        { code: 'OIK1007', ects: 6, name: 'Εισαγωγή στην Οικονομική Θεωρία', kind: y },
        { code: 'OIK1401', ects: 6, name: 'Αγγλικά για Οικονομολόγους Ι', kind: y },
        { code: 'OIK1501', ects: 6, name: 'Ηλεκτρονικοί Υπολογιστές Ι', kind: y },
      ],
    },
    {
      semester: 2,
      courses: [
        { code: 'OIK1002', ects: 8, name: 'Μακροοικονομική Θεωρία Ι', kind: y },
        { code: 'OIK1004', ects: 8, name: 'Μαθηματικά ΙΙ', kind: y },
        { code: 'OIK1005', ects: 8, name: 'Μικροοικονομική Θεωρία Ι', kind: y },
        { code: 'OIK1006', ects: 8, name: 'Στατιστική ΙΙ', kind: y },
        { code: 'OIK1402', ects: 6, name: 'Αγγλικά για Οικονομολόγους ΙΙ', kind: y },
      ],
    },
    {
      semester: 3,
      courses: [
        { code: 'OIK2001', ects: 8, name: 'Μακροοικονομική Θεωρία ΙΙ', kind: y },
        { code: 'OIK2002', ects: 8, name: 'Μικροοικονομική Θεωρία ΙΙ', kind: y },
        { code: 'OIK2003', ects: 8, name: 'Οικονομετρία Ι', kind: y },
        { code: 'OIK2303', ects: 6, name: 'Ιστορία Οικονομικών Θεωριών Ι', kind: ep },
        { code: 'OIK2502', ects: 6, name: 'Εισαγωγή στις Γλώσσες Προγραμματισμού', kind: ep },
        { code: 'OIK2201', ects: 6, name: 'Χρηματοοικονομική Λογιστική', kind: ep },
      ],
    },
    {
      semester: 4,
      courses: [
        { code: 'OIK2004', ects: 8, name: 'Μακροοικονομική Θεωρία ΙΙΙ', kind: y },
        { code: 'OIK2005', ects: 8, name: 'Μικροοικονομική Θεωρία ΙΙΙ', kind: y },
        { code: 'OIK2006', ects: 8, name: 'Οικονομετρία ΙΙ', kind: y },
        { code: 'OIK2501', ects: 6, name: 'Ηλεκτρονικοί Υπολογιστές ΙΙ', kind: y },
        { code: 'OIK1301', ects: 6, name: 'Πολιτική Οικονομία Ι', kind: ep },
        { code: 'OIK3206', ects: 6, name: 'Χρηματοοικονομική Ανάλυση Ι', kind: ep },
      ],
    },
    {
      semester: 5,
      courses: [...sem57Courses],
    },
    {
      semester: 6,
      courses: [...sem68Courses],
    },
    {
      semester: 7,
      courses: [...sem57Courses],
    },
    {
      semester: 8,
      courses: [...sem68Courses],
    },
  ],
};
