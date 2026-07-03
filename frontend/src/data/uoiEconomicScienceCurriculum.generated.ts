/** Πανεπιστήμιο Ιωαννίνων · Οικονομικών Επιστημών · 2024–25 */
import type { SchoolCurriculum } from './schoolCurricula';

const y = 'Υποχρεωτικό' as const;
const ep = 'Επιλογής' as const;

const electives6And8 = [
  { code: 'OIK-681', ects: 6, name: 'Ιστορία Οικονομικών Θεωριών Ι', kind: ep },
  { code: 'OIK-682', ects: 6, name: 'Οικονομική Μεγέθυνση', kind: ep },
  { code: 'OIK-683', ects: 6, name: 'Διεθνές Εμπόριο', kind: ep },
  {
    code: 'OIK-684',
    ects: 6,
    name: 'Ειδικά Θέματα Επιχειρηματικότητας για μη Οικονομολόγους',
    kind: ep,
  },
  { code: 'OIK-685', ects: 6, name: 'Ειδικά Θέματα Επιχειρηματικότητας', kind: ep },
  { code: 'OIK-686', ects: 6, name: 'Οικονομική Ανάπτυξη', kind: ep },
  { code: 'OIK-687', ects: 6, name: 'Οικονομικά της Υγείας', kind: ep },
  { code: 'OIK-688', ects: 6, name: 'Ιστορία Οικονομικών Θεωριών ΙΙ', kind: ep },
  {
    code: 'OIK-689',
    ects: 6,
    name: 'Μάρκετινγκ Αγροτικών Προϊόντων και Ανάλυση Τιμών',
    kind: ep,
  },
  { code: 'OIK-690', ects: 6, name: 'Εφαρμοσμένη Οικονομετρία', kind: ep },
  { code: 'OIK-691', ects: 6, name: 'Θεωρία Παιγνίων', kind: ep },
  {
    code: 'OIK-692',
    ects: 6,
    name: 'Αγγλικά για Τραπεζική και Διοίκηση Επιχειρήσεων',
    kind: ep,
  },
  { code: 'OIK-693', ects: 6, name: 'Βιομηχανική Οργάνωση ΙΙ', kind: ep },
  { code: 'OIK-694', ects: 6, name: 'Στατιστική ΙΙΙ', kind: ep },
  { code: 'OIK-695', ects: 6, name: 'Μακροοικονομική ΙΙΙ', kind: ep },
  { code: 'OIK-696', ects: 6, name: 'Μαθηματική Στατιστική', kind: ep },
  { code: 'OIK-697', ects: 6, name: 'Ειδικά Θέματα Συμπεριφοράς Καταναλωτή', kind: ep },
] as const;

export const UOI_ECONOMIC_SCIENCE_CURRICULUM: SchoolCurriculum = {
  title: 'Οικονομικών Επιστημών',
  subtitle: 'Πανεπιστήμιο Ιωαννίνων · Ιωάννινα',
  externalCoursesUrl: 'https://econ.uoi.gr/ekpaideysi/proptychiakes-spoydes/',
  semesters: [
    {
      semester: 1,
      courses: [
        { code: 'OIK-101', ects: 8, name: 'Εισαγωγή στα Οικονομικά Ι', kind: y },
        { code: 'OIK-102', ects: 8, name: 'Μαθηματικά για Οικονομολόγους Ι', kind: y },
        { code: 'OIK-103', ects: 8, name: 'Εισαγωγή στα Υπολογιστικά Οικονομικά', kind: y },
        { code: 'OIK-104', ects: 8, name: 'Στατιστική Ι', kind: y },
      ],
    },
    {
      semester: 2,
      courses: [
        { code: 'OIK-201', ects: 8, name: 'Εισαγωγή στα Οικονομικά ΙΙ', kind: y },
        { code: 'OIK-202', ects: 8, name: 'Μαθηματικά για Οικονομολόγους ΙΙ', kind: y },
        { code: 'OIK-203', ects: 8, name: 'Στατιστική ΙΙ', kind: y },
        {
          code: 'OIK-204',
          ects: 8,
          name: 'Διαχείριση Δεδομένων και Βάσεις Δεδομένων',
          kind: y,
        },
      ],
    },
    {
      semester: 3,
      courses: [
        { code: 'OIK-301', ects: 8, name: 'Μικροοικονομική Θεωρία Ι', kind: y },
        { code: 'OIK-302', ects: 8, name: 'Μακροοικονομική Θεωρία Ι', kind: y },
        { code: 'OIK-303', ects: 8, name: 'Οικονομετρία Ι', kind: y },
        { code: 'OIK-304', ects: 8, name: 'Λογιστική Ι', kind: y },
      ],
    },
    {
      semester: 4,
      courses: [
        { code: 'OIK-401', ects: 8, name: 'Μικροοικονομική Θεωρία ΙΙ', kind: y },
        { code: 'OIK-402', ects: 8, name: 'Μακροοικονομική Θεωρία ΙΙ', kind: y },
        { code: 'OIK-403', ects: 8, name: 'Οικονομετρία ΙΙ', kind: y },
        {
          code: 'OIK-404',
          ects: 8,
          name: 'Διοικητική Επιστήμη και Λήψη Αποφάσεων',
          kind: y,
        },
      ],
    },
    {
      semester: 5,
      courses: [
        { code: 'OIK-501', ects: 6, name: 'Οικονομική Ιστορία', kind: y },
        { code: 'OIK-502', ects: 6, name: 'Δημόσια Οικονομική Ι', kind: y },
        { code: 'OIK-503', ects: 6, name: 'Βιομηχανική Οργάνωση Ι', kind: y },
        { code: 'OIK-504', ects: 6, name: 'Οικονομική Πολιτική', kind: y },
        {
          code: 'OIK-505',
          ects: 6,
          name: 'Διεθνείς Νομισματικές Σχέσεις και Μακροοικονομικά της Ανοικτής Οικονομίας',
          kind: y,
        },
        { code: 'OIK-506', ects: 2, name: 'Πρακτική Άσκηση', kind: y },
      ],
    },
    {
      semester: 6,
      courses: [...electives6And8],
    },
    {
      semester: 7,
      courses: [
        { code: 'OIK-701', ects: 6, name: 'Χρηματοοικονομική Ανάλυση', kind: ep },
        { code: 'OIK-702', ects: 6, name: 'Οικονομικά της Εργασίας', kind: ep },
        { code: 'OIK-703', ects: 6, name: 'Αγροτική Οικονομική', kind: ep },
        { code: 'OIK-704', ects: 6, name: 'Αγορές Χρήματος & Κεφαλαίου', kind: ep },
        { code: 'OIK-705', ects: 6, name: 'Επιχειρηματικότητα', kind: ep },
        {
          code: 'OIK-706',
          ects: 6,
          name: 'Οικονομικές Εφαρμογές Υπολογιστικών πακέτων',
          kind: ep,
        },
        { code: 'OIK-707', ects: 6, name: 'Εφαρμοσμένη Χρηματοοικονομική', kind: ep },
        {
          code: 'OIK-708',
          ects: 6,
          name: 'Οικονομική του Περιβάλλοντος & των Φυσικών Πόρων',
          kind: ep,
        },
        { code: 'OIK-709', ects: 6, name: 'Τραπεζική Οικονομική', kind: ep },
      ],
    },
    {
      semester: 8,
      courses: [...electives6And8],
    },
  ],
};
