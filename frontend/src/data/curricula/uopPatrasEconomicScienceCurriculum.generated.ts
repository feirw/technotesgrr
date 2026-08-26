/** Πανεπιστήμιο Πατρών · Οικονομικών Επιστημών */
import type { SchoolCurriculum } from './schoolCurricula';

const y = 'Υποχρεωτικό' as const;
const ep = 'Επιλογής Οικονομικού' as const;
const epOther = 'Επιλογής Άλλου Τμήματος' as const;

export const UOP_PATRAS_ECONOMIC_SCIENCE_CURRICULUM: SchoolCurriculum = {
  title: 'Οικονομικών Επιστημών',
  subtitle: 'Πανεπιστήμιο Πατρών · Πάτρα',
  semesters: [
    {
      semester: 1,
      courses: [
        { code: 'ECO_101N', ects: 8, name: 'Εισαγωγή στην Οικονομική Επιστήμη Ι', kind: y },
        { code: 'ECO_111N', ects: 8, name: 'Μαθηματικά για Οικονομολόγους Ι', kind: y },
        { code: 'ECO_121N', ects: 8, name: 'Στατιστική Ι', kind: y },
        { code: 'ECO_150', ects: 6, name: 'Εισαγωγή στην Επιστήμη Δεδομένων', kind: y },
      ],
    },
    {
      semester: 2,
      courses: [
        { code: 'ECO_102N', ects: 8, name: 'Εισαγωγή στην Οικονομική Επιστήμη II', kind: y },
        { code: 'ECO_112N', ects: 8, name: 'Μαθηματικά για Οικονομολόγους II', kind: y },
        { code: 'ECO_122N', ects: 8, name: 'Στατιστική ΙΙ', kind: y },
        { code: 'ECO_130', ects: 6, name: 'Οικονομική Ιστορία', kind: y },
      ],
    },
    {
      semester: 3,
      courses: [
        { code: 'ECO_201N', ects: 8, name: 'Μικροοικονομική I', kind: y },
        { code: 'ECO_203N', ects: 8, name: 'Μακροοικονομική I', kind: y },
        { code: 'ECO_Ξ01N', ects: 2, name: 'Αγγλικά για Οικονομολόγους Ι', kind: y },
        { code: 'ECO_131', ects: 6, name: 'Λογιστική I', kind: ep },
        { code: 'ECO_154', ects: 6, name: 'Εισαγωγή στην Ελληνική Οικονομία', kind: ep },
        { code: 'ECO_220', ects: 6, name: 'Εισαγωγή στο Μάρκετινγκ-Μάνατζμεντ', kind: ep },
        { code: 'ECO_252', ects: 6, name: 'Συμπεριφορική Οικονομική', kind: ep },
        { code: 'ECO_DE113', ects: 6, name: 'Οργάνωση & Διοίκηση Επιχειρήσεων Ι', kind: epOther },
        { code: 'ECO_DE115', ects: 6, name: 'Εισαγωγή στο Αστικό και Εμπορικό Δίκαιο', kind: epOther },
      ],
    },
    {
      semester: 4,
      courses: [
        { code: 'ECO_202N', ects: 8, name: 'Μικροοικονομική II', kind: y },
        { code: 'ECO_204N', ects: 8, name: 'Μακροοικονομική II', kind: y },
        { code: 'ECO_Ξ02N', ects: 2, name: 'Αγγλικά για Οικονομολόγους ΙΙ', kind: y },
        { code: 'ECO_132', ects: 6, name: 'Λογιστική ΙΙ', kind: ep },
        { code: 'ECO_222', ects: 6, name: 'Στατιστική με υπολογιστή', kind: ep },
        { code: 'ECO_240', ects: 6, name: 'Οικονομική Γεωγραφία', kind: ep },
        { code: 'ECO_241', ects: 6, name: 'Θέματα Ψηφιακής Οικονομίας', kind: ep },
      ],
    },
    {
      semester: 5,
      courses: [
        { code: 'ECO_320', ects: 6, name: 'Οικονομετρία', kind: y },
        { code: 'ECO_355', ects: 6, name: 'Οικονομική των Επιχειρήσεων', kind: y },
        { code: 'ECO_322', ects: 6, name: 'Χρηματοοικονομική', kind: ep },
        { code: 'ECO_340', ects: 6, name: 'Εξέλιξη της Οικονομικής Σκέψης', kind: ep },
        { code: 'ECO_393', ects: 6, name: 'Οικονομικά της Ενέργειας', kind: ep },
        { code: 'ECO_441', ects: 6, name: 'Οικονομική της Καινοτομίας και της Τεχνολογίας', kind: ep },
        { code: 'ECO_353', ects: 6, name: 'Εισαγωγή στη Θεωρία Παιγνίων', kind: ep },
        { code: 'ECO_354', ects: 6, name: 'Επιχειρηματικός Σχεδιασμός', kind: ep },
        { code: 'ECO_DE225', ects: 6, name: 'Ειδικά Θέματα Πολιτικής Οικονομίας', kind: epOther },
        { code: 'ECO_DE227', ects: 6, name: 'Δίκαιο Επιχειρήσεων και Αξιογράφων', kind: epOther },
      ],
    },
    {
      semester: 6,
      courses: [
        { code: 'ECO_312', ects: 6, name: 'Δημόσια Οικονομική', kind: y },
        { code: 'ECO_350', ects: 6, name: 'Οικονομική Πολιτική', kind: y },
        { code: 'ECO_230', ects: 6, name: 'Ελληνική Οικονομική Ιστορία', kind: ep },
        { code: 'ECO_332', ects: 6, name: 'Χρηματοοικονομική Ανάλυση και Διαχείριση', kind: ep },
        { code: 'ECO_352', ects: 6, name: 'Επιχειρησιακή Έρευνα', kind: ep },
        { code: 'ECO_361', ects: 6, name: 'Περιφερειακή Οικονομική', kind: ep },
        { code: 'ECO_492', ects: 6, name: 'Ειδικά Θέματα Μακροοικονομικής', kind: ep },
        { code: 'ECO_356', ects: 6, name: 'Θέματα Οικονομικής Γεωγραφίας', kind: ep },
        { code: 'ECO_DE141', ects: 6, name: 'Προσομοίωση Επιχειρηματικών Διαδικασιών', kind: epOther },
        { code: 'ECO_DE205', ects: 6, name: 'Εργατικό Δίκαιο & Εργασιακές Σχέσεις', kind: epOther },
      ],
    },
    {
      semester: 7,
      courses: [
        { code: 'ECO_410', ects: 6, name: 'Οικονομική της Ανάπτυξης', kind: y },
        { code: 'ECO_430', ects: 6, name: 'Θεωρία και Πολιτική Διεθνούς Εμπορίου', kind: y },
        { code: 'ECO_351', ects: 6, name: 'Ανάλυση Δεδομένων', kind: ep },
        {
          code: 'ECO_360',
          ects: 6,
          name: 'Οικονομική των Φυσικών Πόρων & του Περιβάλλοντος',
          kind: ep,
        },
        { code: 'ECO_396', ects: 6, name: 'Οικονομικά της Εκπαίδευσης', kind: ep },
        { code: 'ECO_465', ects: 6, name: 'Αγροτική Πολιτική', kind: ep },
        { code: 'ECO_482', ects: 6, name: 'Χρήμα και Τραπεζική', kind: ep },
        { code: 'ECO_466', ects: 6, name: 'Θέματα Περιφερειακής Ανάπτυξης', kind: ep },
        { code: 'ECO_452', ects: 6, name: 'Μεθοδολογία Έρευνας στην Οικονομική Επιστήμη', kind: ep },
        { code: 'ECO_473', ects: 6, name: 'Οικονομικά της Υγείας', kind: ep },
        { code: 'ECO_DE413', ects: 6, name: 'Επιχειρησιακή Στρατηγική Ι', kind: epOther },
      ],
    },
    {
      semester: 8,
      courses: [
        { code: 'ECO_401', ects: 6, name: 'Οικονομική της Βιομηχανικής Οργάνωσης', kind: y },
        { code: 'ECO_420', ects: 6, name: 'Οικονομική της Εργασίας', kind: y },
        { code: 'ECO_330', ects: 6, name: 'Αξιολόγηση Επενδύσεων', kind: ep },
        { code: 'ECO_421', ects: 6, name: 'Εφαρμοσμένη Οικονομετρία', kind: ep },
        { code: 'ECO_424', ects: 6, name: 'Διαχείριση Βάσεων Δεδομένων', kind: ep },
        { code: 'ECO_450', ects: 6, name: 'Μαθηματική Οικονομική', kind: ep },
        { code: 'ECO_472', ects: 6, name: 'Διαχείριση Χαρτοφυλακίου', kind: ep },
        { code: 'ECO_494', ects: 6, name: 'Οικονομικά της Κλιματικής Αλλαγής', kind: ep },
        { code: 'ECO_499', ects: 3, name: 'Πρακτική Άσκηση', kind: ep },
        { code: 'ECO_471', ects: 6, name: 'Οικονομικά της Επιχειρηματικότητας', kind: ep },
        { code: 'ECO_474', ects: 6, name: 'Ειδικά Θέματα Οικονομικών της Στρατηγικής', kind: ep },
        { code: 'ECO_475', ects: 6, name: 'Προχωρημένη Μακροοικονομική', kind: ep },
      ],
    },
  ],
};
