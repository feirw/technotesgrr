/** Πάντειο · Οικονομικής & Περιφερειακής Ανάπτυξης (Αθήνα) — πρόγραμμα σπουδών ΤΟΠΑ */
import type { SchoolCurriculum } from './schoolCurricula';

const y = 'Υποχρεωτικό' as const;
const ep = 'Επιλογής' as const;

export const OPA_REGIONAL_DEVELOPMENT_CURRICULUM: SchoolCurriculum = {
  title: 'Οικονομικής & Περιφερειακής Ανάπτυξης',
  subtitle: 'Πάντειο Πανεπιστήμιο · Αθήνα',
  semesters: [
    {
      semester: 1,
      courses: [
        { code: '800001', ects: 5, name: 'Εισαγωγή στην Περιφερειακή Επιστήμη', kind: y },
        { code: '800003', ects: 5, name: 'Αρχές Οικονομικής Θεωρίας Ι', kind: y },
        { code: '800004', ects: 5, name: 'Στατιστική Ι', kind: y },
        { code: '800005', ects: 5, name: 'Μαθηματικά Ι', kind: y },
        { code: '800006', ects: 5, name: 'Εισαγωγή στα Πληροφοριακά Συστήματα', kind: y },
      ],
    },
    {
      semester: 2,
      courses: [
        { code: '800011', ects: 5, name: 'Οικονομική των Επιχειρήσεων και Λογιστική', kind: y },
        { code: '800012', ects: 5, name: 'Στατιστική ΙΙ', kind: y },
        { code: '800109', ects: 5, name: 'Μαθηματικά ΙΙ', kind: y },
        { code: '800110', ects: 5, name: 'Οικονομική και Αστική Γεωγραφία', kind: y },
        { code: '800111', ects: 5, name: 'Αρχές Οικονομικής Θεωρίας ΙΙ', kind: y },
      ],
    },
    {
      semester: 3,
      courses: [
        { code: '800008', ects: 5, name: 'Θεσμικό Πλαίσιο Περιφερειακής Ανάπτυξης', kind: y },
        { code: '800009', ects: 5, name: 'Μικροοικονομική Θεωρία Ι', kind: y },
        { code: '800010', ects: 5, name: 'Μακροοικονομική Θεωρία & Πολιτική Ι', kind: y },
        { code: '800013', ects: 5, name: 'Ανάλυση Τόπου Εγκατάστασης', kind: y },
        { code: '800014', ects: 5, name: 'Χωροταξία - Χωρικός Σχεδιασμός', kind: y },
      ],
    },
    {
      semester: 4,
      courses: [
        { code: '800020', ects: 5, name: 'Οικονομική Αστικών Κέντρων', kind: y },
        { code: '800021', ects: 5, name: 'Δημόσια Οικονομική: Οικονομικές Λειτουργίες του Κράτους', kind: y },
        { code: '800032', ects: 5, name: 'Ποσοτικές Μέθοδοι Οικονομικής Ανάλυσης', kind: y },
        { code: '800075', ects: 5, name: 'Μικροοικονομική Θεωρία ΙΙ', kind: y },
        { code: '800112', ects: 5, name: 'Μακροοικονομική Θεωρία και Πολιτική ΙΙ', kind: y },
      ],
    },
    {
      semester: 5,
      courses: [
        { code: '800017', ects: 5, name: 'Οικονομική Ανάπτυξη', kind: y },
        { code: '800018', ects: 5, name: 'Οικονομετρία Ι', kind: y },
        { code: '800029', ects: 5, name: 'Μέθοδοι Περιφερειακής Ανάλυσης', kind: y },
        { code: '800031', ects: 5, name: 'Δημόσια Οικονομική: Δημοσιονομικοί Θεσμοί', kind: y },
        { code: '800026', ects: 5, name: 'Εφαρμοσμένη Στατιστική', kind: ep },
        { code: '800062', ects: 5, name: 'Πολιτικές Συνοχής της Ε.Ε.', kind: ep },
        { code: '800079', ects: 5, name: 'Γενική Λογιστική', kind: ep },
        {
          code: '800101',
          ects: 5,
          name: 'Γεωγραφικά Συστήματα Πληροφοριών και Περιφερειακή Ανάλυση',
          kind: ep,
        },
        { code: '800115', ects: 5, name: 'Τοπική Ανάπτυξη και Τοπική Επιχειρηματικότητα', kind: ep },
        { code: '800142', ects: 5, name: 'Θαλάσσιος Χωροταξικός Σχεδιασμός', kind: ep },
        {
          code: '800144',
          ects: 5,
          name: 'Erasmus+ Contemporary issues in urban geography and urban economics',
          kind: ep,
        },
      ],
    },
    {
      semester: 6,
      courses: [
        { code: '800034', ects: 5, name: 'Οικονομική της Εργασίας', kind: y },
        { code: '800040', ects: 5, name: 'Περιφερειακή Οικονομική Ανάλυση', kind: y },
        { code: '800041', ects: 5, name: 'Οικονομική & Πολιτική Περιβάλλοντος', kind: y },
        { code: '800114', ects: 5, name: 'Νομισματική και Πιστωτική Θεωρία και Πολιτική', kind: y },
        { code: '800071', ects: 5, name: 'Τουριστική Ανάπτυξη', kind: ep },
        {
          code: '800107',
          ects: 5,
          name: 'Οικονομική Θεωρία από τη σκοπιά του φύλου: Γυναίκες, Οικονομική Θεωρία & Πολιτικές',
          kind: ep,
        },
        { code: '800116', ects: 5, name: 'Μικροοικονομική Ανάλυση', kind: ep },
        {
          code: '800136',
          ects: 5,
          name: 'Erasmus+ Contemporary issues in local and region development',
          kind: ep,
        },
        { code: '800141', ects: 5, name: 'Φορολογία- Δημόσιο και Ιδιωτικό Λογιστικό', kind: ep },
        {
          code: '800146',
          ects: 5,
          name: 'Οικονομία, Βιωσιμότητα, και Στόχοι Βιώσιμης Ανάπτυξης',
          kind: ep,
        },
        { code: '800113', ects: 6, name: 'Πρακτική άσκηση', kind: ep },
      ],
    },
    {
      semester: 7,
      courses: [
        { code: '800019', ects: 5, name: 'Περιφερειακή Οικονομική Πολιτική', kind: y },
        { code: '800030', ects: 5, name: 'Οικονομική Ανάλυση και Πολιτική Μεταφορών', kind: y },
        { code: '800053', ects: 5, name: 'Βιομηχανική Οικονομική & Πολιτική', kind: y },
        { code: '800022', ects: 5, name: 'Οικονομική Μεγέθυνση', kind: ep },
        { code: '800042', ects: 5, name: 'Δημοσιονομική Θεωρία & Πολιτική ΙΙ', kind: ep },
        { code: '800051', ects: 5, name: 'Πολεοδομική Οικιστική Ανάπτυξη & Πολιτική', kind: ep },
        { code: '800052', ects: 5, name: 'Πολιτιστική Ανάπτυξη & Πολιτική', kind: ep },
        { code: '800060', ects: 5, name: 'Κεφαλαιαγορά-Χρηματαγορά', kind: ep },
        { code: '800076', ects: 5, name: 'Σχολές Οικονομικής Σκέψης Ι', kind: ep },
        {
          code: '800082',
          ects: 5,
          name: 'Οικονομική Περιβάλλοντος, Φυσικών Πόρων, Βιώσιμης Ανάπτυξης',
          kind: ep,
        },
        { code: '800096', ects: 5, name: 'Διοικητική Λογιστική', kind: ep },
        { code: '800106', ects: 5, name: 'Πολιτικές Απασχόλησης και Μέθοδοι Αξιολόγησης', kind: ep },
        {
          code: '800117',
          ects: 5,
          name: 'Η Ταυτότητα των Ελληνικών και Ευρωπαϊκών Περιφερειών',
          kind: ep,
        },
        { code: '800118', ects: 5, name: 'Οικονομική Ακίνητης Περιουσίας', kind: ep },
        { code: '800119', ects: 5, name: 'Χωρική και Εφαρμοσμένη Οικονομετρία', kind: ep },
        { code: '800149', ects: 6, name: 'Πρακτική άσκηση', kind: ep },
      ],
    },
    {
      semester: 8,
      courses: [
        { code: '800043', ects: 5, name: 'Διεθνής Οικονομική', kind: y },
        { code: '800063', ects: 5, name: 'Περιφερειακός Προγραμματισμός', kind: y },
        { code: '800069', ects: 5, name: 'Οικονομικοί Θεσμοί & Πολιτικές της Ε.Ε.', kind: y },
        { code: '800061', ects: 5, name: 'Αξιολόγηση Περιφερειακών Προγραμμάτων', kind: ep },
        { code: '800064', ects: 5, name: 'Ελληνική Οικονομία', kind: ep },
        { code: '800065', ects: 5, name: 'Θέματα Οικονομικής & Κοινωνικής Πολιτικής', kind: ep },
        { code: '800067', ects: 5, name: 'Πολιτική Γης και Κατοικίας', kind: ep },
        { code: '800074', ects: 5, name: 'Πληροφορική και Οικονομία', kind: ep },
        { code: '800122', ects: 5, name: 'Αξιολόγηση Ιδιωτικών & Δημόσιων Επενδύσεων', kind: ep },
        { code: '800123', ects: 5, name: 'Οικονομετρία ΙΙ', kind: ep },
        { code: '800124', ects: 5, name: 'Παγκοσμιοποίηση', kind: ep },
        {
          code: '800145',
          ects: 5,
          name: 'Αρχές Διοίκησης & Μάνατζμεντ Οργανισμών και Επιχειρήσεων',
          kind: ep,
        },
        {
          code: '800148',
          ects: 5,
          name: 'Οικολογική Οικονομική, Κυκλική Οικονομία & Βιοοικονομία',
          kind: ep,
        },
        { code: '800143', ects: 10, name: 'Πτυχιακή Εργασία', kind: ep },
        { code: '800113', ects: 6, name: 'Πρακτική άσκηση', kind: ep },
      ],
    },
  ],
};
