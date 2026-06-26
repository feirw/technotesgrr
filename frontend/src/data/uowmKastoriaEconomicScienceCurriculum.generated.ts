/** Πανεπιστήμιο Δυτικής Μακεδονίας · Οικονομικών Επιστημών (Καστοριά) */
import type { SchoolCurriculum } from './schoolCurricula';

const y = 'Υποχρεωτικό' as const;
const dCore = 'Υποχρεωτικό κατεύθυνσης' as const;
const epA = 'Επιλογής κατεύθυνσης · Οικονομική Ανάλυση (2 από 3)' as const;
const epB = 'Επιλογής κατεύθυνσης · Οικονομική των Επιχειρήσεων (2 από 3)' as const;

export const UOWM_KASTORIA_ECONOMIC_SCIENCE_CURRICULUM: SchoolCurriculum = {
  title: 'Οικονομικών Επιστημών',
  subtitle:
    'Πανεπιστήμιο Δυτικής Μακεδονίας · Καστοριά · 2 κατευθύνσεις (Ε\'–Η\'): Οικονομική Ανάλυση · Οικονομική των Επιχειρήσεων',
  semesters: [
    {
      semester: 1,
      courses: [
        { code: 'ΟΑ119', ects: 6, name: 'Γενικά Μαθηματικά', kind: y },
        { code: 'ΟΑ219', ects: 6, name: 'Γενική Λογιστική', kind: y },
        { code: 'ΟΑ319', ects: 6, name: 'Εισαγωγή στη Μακροοικονομική Θεωρία', kind: y },
        {
          code: 'ΟΑ419',
          ects: 6,
          name: 'Εισαγωγή στην Επιστήμη των Η/Υ και της Διαχείρισης Πληροφοριών',
          kind: y,
        },
        { code: 'ΟΑ519', ects: 6, name: 'Εισαγωγή στη Διοίκηση Επιχειρήσεων', kind: y },
      ],
    },
    {
      semester: 2,
      courses: [
        { code: 'ΟΒ119', ects: 6, name: 'Στατιστική Επιχειρήσεων', kind: y },
        { code: 'ΟΒ219', ects: 6, name: 'Βάσεις και Διαχείριση Δεδομένων', kind: y },
        { code: 'ΟΒ319', ects: 6, name: 'Μικροοικονομική Ανάλυση', kind: y },
        { code: 'ΟΒ419', ects: 6, name: 'Λογιστική Εταιριών', kind: y },
        { code: 'ΟΒ519', ects: 6, name: 'Οικονομικά Μαθηματικά', kind: y },
      ],
    },
    {
      semester: 3,
      courses: [
        { code: 'ΟΓ119', ects: 7.5, name: 'Μαθηματικά Οικονομικής Ανάλυσης', kind: y },
        { code: 'ΟΓ219', ects: 7.5, name: 'Μάρκετινγκ', kind: y },
        { code: 'ΟΓ319', ects: 7.5, name: 'Δημόσια Οικονομική', kind: y },
        { code: 'ΟΓ419', ects: 7.5, name: 'Χρηματοοικονομική Ανάλυση', kind: y },
      ],
    },
    {
      semester: 4,
      courses: [
        { code: 'ΟΔ119', ects: 7.5, name: 'Επιχειρησιακή Έρευνα', kind: y },
        { code: 'ΟΔ219', ects: 7.5, name: 'Μακροοικονομική Ανάλυση', kind: y },
        { code: 'ΟΔ319', ects: 7.5, name: 'Διεθνής Χρηματοδότηση', kind: y },
        { code: 'ΟΔ419', ects: 7.5, name: 'Στρατηγική Διοίκηση', kind: y },
      ],
    },
    {
      semester: 5,
      courses: [
        { code: 'ΟΕ119', ects: 7.5, name: 'Βιομηχανική Οργάνωση', kind: dCore },
        { code: 'ΟΕ219', ects: 7.5, name: 'Οικονομετρία', kind: dCore },
        { code: 'ΟΕΑ119', ects: 7.5, name: 'Αγορές Χρήματος και Κεφαλαίου', kind: epA },
        { code: 'ΟΕΑ219', ects: 7.5, name: 'Οικονομικά της Εργασίας', kind: epA },
        {
          code: 'ΟΕΑ319',
          ects: 7.5,
          name: 'Μακροοικονομική της Ευρωπαϊκής Ολοκλήρωσης',
          kind: epA,
        },
        {
          code: 'ΟΕΒ119',
          ects: 7.5,
          name: 'Διεθνής Διοίκηση Επιχειρήσεων',
          kind: epB,
        },
        {
          code: 'ΟΕΒ219',
          ects: 7.5,
          name: 'Διαχείριση Εφοδιαστικής Αλυσίδας — Logistics',
          kind: epB,
        },
        { code: 'ΟΕΒ319', ects: 7.5, name: 'Συμπεριφορά Καταναλωτή', kind: epB },
      ],
    },
    {
      semester: 6,
      courses: [
        { code: 'ΟΣΤ119', ects: 7.5, name: 'Θεωρία Διεθνούς Εμπορίου', kind: dCore },
        { code: 'ΟΣΤ219', ects: 7.5, name: 'Νομισματική Θεωρία και Πολιτική', kind: dCore },
        { code: 'ΟΣΤΑ119', ects: 7.5, name: 'Διεθνής Εμπορική Πολιτική', kind: epA },
        { code: 'ΟΣΤΑ219', ects: 7.5, name: 'Οικονομική του Περιβάλλοντος', kind: epA },
        { code: 'ΟΣΤΑ319', ects: 7.5, name: 'Οικονομική του Τουρισμού', kind: epA },
        {
          code: 'ΟΣΤΒ119',
          ects: 7.5,
          name: 'Πληροφοριακά Συστήματα Διοίκησης',
          kind: epB,
        },
        { code: 'ΟΣΤΒ219', ects: 7.5, name: 'Διοίκηση Ολικής Ποιότητας', kind: epB },
        { code: 'ΟΣΤΒ319', ects: 7.5, name: 'Ψηφιακό Μάρκετινγκ', kind: epB },
      ],
    },
    {
      semester: 7,
      courses: [
        { code: 'ΟΖ119', ects: 7.5, name: 'Διεθνείς Νομισματικές Σχέσεις', kind: dCore },
        { code: 'ΟΖ219', ects: 7.5, name: 'Διεθνές Μάρκετινγκ', kind: dCore },
        {
          code: 'ΟΖΑ119',
          ects: 7.5,
          name: 'Θεωρίες Οικονομικής Ανάπτυξης και Μεγέθυνσης',
          kind: epA,
        },
        { code: 'ΟΖΑ219', ects: 7.5, name: 'Ιστορία Οικονομικής Σκέψης', kind: epA },
        {
          code: 'ΟΖΑ319',
          ects: 7.5,
          name: 'Υπολογιστικά Οικονομικά και Δυναμικά Οικονομικά Συστήματα',
          kind: epA,
        },
        { code: 'ΟΖΒ119', ects: 7.5, name: 'Καινοτομία και Επιχειρηματικότητα', kind: epB },
        { code: 'ΟΖΒ219', ects: 7.5, name: 'Διοίκηση Ανθρώπινων Πόρων', kind: epB },
        { code: 'ΟΖΒ319', ects: 7.5, name: 'Λογιστική Κόστους', kind: epB },
      ],
    },
    {
      semester: 8,
      courses: [
        { code: 'ΟΗ119', ects: 7.5, name: 'Ανάλυση Χρονοσειρών', kind: dCore },
        {
          code: 'ΟΗ219',
          ects: 7.5,
          name: 'Οργανωτική Θεωρία και Οργανωσιακή Συμπεριφορά',
          kind: dCore,
        },
        { code: 'ΟΗΑ119', ects: 7.5, name: 'Εφαρμοσμένη Χρηματοοικονομική', kind: epA },
        { code: 'ΟΗΑ219', ects: 7.5, name: 'Τραπεζική Χρηματοοικονομική', kind: epA },
        { code: 'ΟΗΑ319', ects: 7.5, name: 'Τεχνολογική Πολιτική', kind: epA },
        { code: 'ΟΗΒ119', ects: 7.5, name: 'Ηλεκτρονικό Επιχειρείν', kind: epB },
        { code: 'ΟΗΒ219', ects: 7.5, name: 'Διοίκηση Υπηρεσιών', kind: epB },
        { code: 'ΟΗΒ319', ects: 7.5, name: 'Έρευνα Μάρκετινγκ', kind: epB },
      ],
    },
  ],
};
