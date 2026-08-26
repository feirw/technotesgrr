/** Πανεπιστήμιο Θεσσαλίας · Οικονομικών Επιστημών (Βόλος) · 2025–26 */
import type { CourseHours, SchoolCurriculum } from './schoolCurricula';

const y = 'Υποχρεωτικό' as const;
const gl = 'Επιλογής (ξένη γλώσσα)' as const;
const ep = 'Επιλογής' as const;
const dA = 'Υποχρεωτικό κατεύθυνσης · Οικονομική Πολιτική & Ανάπτυξη' as const;
const dB = 'Υποχρεωτικό κατεύθυνσης · Τραπεζική & Χρηματοοικονομικές Τεχνολογίες' as const;
const dC = 'Υποχρεωτικό κατεύθυνσης · Οικονομική των Επιχειρήσεων' as const;
const epA = 'Επιλογής κατεύθυνσης · Οικονομική Πολιτική & Ανάπτυξη' as const;
const epB = 'Επιλογής κατεύθυνσης · Τραπεζική & FinTech' as const;
const epC = 'Επιλογής κατεύθυνσης · Οικονομική των Επιχειρήσεων' as const;

const h = (lecture: number, lab = 0): CourseHours =>
  lab ? { lecture, lab } : { lecture };

export const UTH_VOLOS_ECONOMIC_SCIENCE_CURRICULUM: SchoolCurriculum = {
  title: 'Οικονομικών Επιστημών',
  subtitle:
    'Πανεπιστήμιο Θεσσαλίας · Βόλος · 3 κατευθύνσεις (Ζ\'–Η\'): Οικονομική Πολιτική & Ανάπτυξη · Τραπεζική & FinTech · Οικονομική των Επιχειρήσεων',
  semesters: [
    {
      semester: 1,
      courses: [
        { code: 'TOE-101', ects: 5, name: 'Εισαγωγή στην Οικονομική Σκέψη', kind: y },
        { code: 'TOE-102', ects: 5, name: 'Οικονομική Ιστορία', kind: y },
        { code: 'TOE-103', ects: 6, name: 'Μαθηματικά Ι', kind: y },
        { code: 'TOE-104', ects: 4, name: 'Εισαγωγή στο Δίκαιο', kind: y },
        { code: 'TOE-105', ects: 5, name: 'Πληροφορική Ι', kind: y, hours: h(3, 2) },
        { code: 'TOE-106', ects: 3, name: 'Σεμινάριο Ακαδημαϊκής Μελέτης και Γραφής', kind: y },
        { code: 'TOE-107', ects: 2, name: 'Αγγλικά για Οικονομικά και Επιχειρήσεις Ι', kind: y },
        {
          code: 'TOE-108',
          ects: 2,
          name: 'Ξένη Γλώσσα (Γαλλικά, Γερμανικά, Ιταλικά)',
          kind: gl,
        },
      ],
    },
    {
      semester: 2,
      courses: [
        { code: 'TOE-201', ects: 6, name: 'Μικροοικονομική Ανάλυση Ι', kind: y },
        { code: 'TOE-202', ects: 6, name: 'Μακροοικονομική Ανάλυση Ι', kind: y },
        { code: 'TOE-203', ects: 6, name: 'Μαθηματικά ΙΙ', kind: y },
        { code: 'TOE-204', ects: 6, name: 'Στατιστική Ι', kind: y },
        { code: 'TOE-211', ects: 4, name: 'Εμπορικό Δίκαιο', kind: ep },
        { code: 'TOE-212', ects: 4, name: 'Πληροφορική ΙΙ', kind: ep },
        { code: 'TOE-213', ects: 2, name: 'Αγγλικά για Οικονομικά και Επιχειρήσεις ΙΙ', kind: y },
        {
          code: 'TOE-214',
          ects: 2,
          name: 'Ξένη Γλώσσα (Γαλλικά, Γερμανικά, Ιταλικά)',
          kind: gl,
        },
      ],
    },
    {
      semester: 3,
      courses: [
        { code: 'TOE-301', ects: 6, name: 'Μικροοικονομική Ανάλυση ΙΙ', kind: y },
        { code: 'TOE-302', ects: 6, name: 'Μακροοικονομική Ανάλυση ΙΙ', kind: y },
        { code: 'TOE-303', ects: 6, name: 'Λογιστική', kind: y },
        { code: 'TOE-304', ects: 6, name: 'Στατιστική ΙΙ', kind: y },
        { code: 'TOE-311', ects: 4, name: 'Επιχειρησιακή Οικονομική', kind: ep },
        {
          code: 'TOE-312',
          ects: 4,
          name: 'Εισαγωγή στην Πολιτική Επιστήμη και στη Δημόσια Διοίκηση',
          kind: ep,
        },
        { code: 'TOE-313', ects: 4, name: 'Ευρωπαϊκό Δίκαιο', kind: ep },
        { code: 'TOE-314', ects: 2, name: 'Αγγλικά για Οικονομικά και Επιχειρήσεις ΙΙΙ', kind: y },
        {
          code: 'TOE-315',
          ects: 2,
          name: 'Ξένη Γλώσσα (Γαλλικά, Γερμανικά, Ιταλικά)',
          kind: gl,
        },
      ],
    },
    {
      semester: 4,
      courses: [
        { code: 'TOE-401', ects: 6, name: 'Μικροοικονομική Ανάλυση ΙΙΙ', kind: y },
        { code: 'TOE-402', ects: 6, name: 'Μακροοικονομική Ανάλυση ΙΙΙ', kind: y },
        { code: 'TOE-403', ects: 6, name: 'Οικονομετρία Ι', kind: y },
        { code: 'TOE-404', ects: 6, name: 'Ιστορία Οικονομικών Θεωριών', kind: y },
        { code: 'TOE-411', ects: 4, name: 'Οικονομική του Χώρου', kind: ep },
        { code: 'TOE-412', ects: 4, name: 'Δειγματοληψία', kind: ep },
        {
          code: 'TOE-413',
          ects: 4,
          name: 'Διεθνείς Οικονομικοί Οργανισμοί και Κλιματική Αλλαγή',
          kind: ep,
        },
        { code: 'TOE-414', ects: 2, name: 'Αγγλικά για Οικονομικά και Επιχειρήσεις IV', kind: y },
        {
          code: 'TOE-415',
          ects: 2,
          name: 'Ξένη Γλώσσα (Γαλλικά, Γερμανικά, Ιταλικά)',
          kind: gl,
        },
      ],
    },
    {
      semester: 5,
      courses: [
        { code: 'TOE-501', ects: 6, name: 'Δημόσια Οικονομική Ι', kind: y },
        { code: 'TOE-502', ects: 7, name: 'Οικονομετρία ΙΙ', kind: y },
        { code: 'TOE-503', ects: 6, name: 'Νομισματική Θεωρία και Πολιτική', kind: y },
        { code: 'TOE-504', ects: 6, name: 'Αρχές Διοίκησης (Μάνατζμεντ)', kind: y },
        { code: 'TOE-511', ects: 5, name: 'Οικονομική Ανάλυση Κοινωνικής Πολιτικής', kind: ep },
        { code: 'TOE-512', ects: 5, name: 'Οικονομικά της Ευρωπαϊκής Ένωσης', kind: ep },
        { code: 'TOE-513', ects: 5, name: 'Κοινωνιολογία', kind: ep },
        {
          code: 'TOE-514',
          ects: 5,
          name: 'Ειδικά Θέματα Εφαρμοσμένης Μικροοικονομικής (στα Αγγλικά)',
          kind: ep,
        },
      ],
    },
    {
      semester: 6,
      courses: [
        { code: 'TOE-601', ects: 6, name: 'Οικονομική των Θεσμών', kind: y },
        { code: 'TOE-602', ects: 7, name: 'Χρηματοοικονομική Ανάλυση των Επιχειρήσεων', kind: y },
        { code: 'TOE-603', ects: 6, name: 'Μάρκετινγκ', kind: y },
        { code: 'TOE-604', ects: 6, name: 'Δημόσια Οικονομική II', kind: y },
        { code: 'TOE-611', ects: 5, name: 'Διεθνές Εμπόριο', kind: ep },
        { code: 'TOE-612', ects: 5, name: 'Οικονομική Μεγέθυνση', kind: ep },
        { code: 'TOE-613', ects: 5, name: 'Οικονομική Ανθρωπολογία', kind: ep },
        {
          code: 'TOE-614',
          ects: 5,
          name: 'Ειδικά Θέματα Εφαρμοσμένης Μακροοικονομικής (στα Αγγλικά)',
          kind: ep,
        },
        { code: 'TOE-615', ects: 5, name: 'Πρακτική Άσκηση', kind: ep },
      ],
    },
    {
      semester: 7,
      courses: [
        {
          code: 'TOE-7A01',
          ects: 6,
          name: 'Οικονομική της Ανάπτυξης (Θεωρία και Πολιτική)',
          kind: dA,
        },
        { code: 'TOE-7A02', ects: 6, name: 'Θεσμοί και Ανάπτυξη', kind: dA },
        { code: 'TOE-7A11', ects: 6, name: 'Περιφερειακή Ανάπτυξη και Πολιτική', kind: epA },
        {
          code: 'TOE-7A12',
          ects: 6,
          name: 'Διεθνής Πολιτική Οικονομία (στα Αγγλικά)',
          kind: epA,
        },
        { code: 'TOE-7A13', ects: 6, name: 'Οικονομική της Εργασίας', kind: epA },
        { code: 'TOE-7A14', ects: 6, name: 'Θεωρίες Οικονομικής Εξέλιξης', kind: epA },
        {
          code: 'TOE-7A15',
          ects: 6,
          name: 'Παγκοσμιοποίηση, Ενέργεια και Ευρωπαϊκή Ολοκλήρωση',
          kind: epA,
        },
        { code: 'TOE-7A16', ects: 6, name: 'Οικονομική των Μεταφορών', kind: epA },
        { code: 'TOE-7B01', ects: 6, name: 'Διεθνής Τραπεζική & Χρηματοοικονομική', kind: dB },
        { code: 'TOE-7B02', ects: 6, name: 'Χρηματοοικονομική Τεχνολογία (FinTech)', kind: dB },
        { code: 'TOE-7B11', ects: 6, name: 'Ανάλυση Χρονολογικών Σειρών', kind: epB },
        { code: 'TOE-7B12', ects: 6, name: 'Οικονομική Δυναμική', kind: epB },
        { code: 'TOE-7B13', ects: 6, name: 'Αστική Οικονομική και Αγορά Ακινήτων', kind: epB },
        { code: 'TOE-7B14', ects: 6, name: 'Θέματα Χρηματοοικονομικής Λογιστικής', kind: epB },
        {
          code: 'TOE-7B15',
          ects: 6,
          name: 'Αναλυτική Δεδομένων με Τεχνητή Νοημοσύνη',
          kind: epB,
        },
        { code: 'TOE-7C01', ects: 6, name: 'Διοικητική Επιστήμη', kind: dC },
        {
          code: 'TOE-7C02',
          ects: 6,
          name: 'Διοίκηση Λειτουργιών (Επιχειρησιακή Διαχείριση)',
          kind: dC,
        },
        { code: 'TOE-7C11', ects: 6, name: 'Βιομηχανική Οργάνωση', kind: epC },
        { code: 'TOE-7C12', ects: 6, name: 'Οργανωσιακή Συμπεριφορά', kind: epC },
        { code: 'TOE-7C13', ects: 6, name: 'Θέματα Χρηματοοικονομικής Λογιστικής', kind: epC },
        { code: 'TOE-7C14', ects: 6, name: 'Αστική Οικονομική και Αγορά Ακινήτων', kind: epC },
        { code: 'TOE-7C15', ects: 6, name: 'Πολυεθνικές Επιχειρήσεις', kind: epC },
        { code: 'TOE-7C16', ects: 6, name: 'Ψηφιακό Μάρκετινγκ', kind: epC },
        {
          code: 'TOE-7C17',
          ects: 6,
          name: 'Οικονομικές Θεωρήσεις της Επιχείρησης και της Επιχειρηματικότητας',
          kind: epC,
        },
        { code: 'TOE-7R01', ects: 6, name: 'Μέθοδοι Έρευνας', kind: ep },
      ],
    },
    {
      semester: 8,
      courses: [
        { code: 'TOE-8A01', ects: 6, name: 'Θεωρία Οικονομικής Πολιτικής', kind: dA },
        { code: 'TOE-8A02', ects: 6, name: 'Ελληνική Οικονομία', kind: dA },
        { code: 'TOE-8A11', ects: 6, name: 'Οικονομική του Περιβάλλοντος', kind: epA },
        {
          code: 'TOE-8A12',
          ects: 6,
          name: 'Τουριστική Ανάπτυξη και Σχεδιασμός (στα Αγγλικά)',
          kind: epA,
        },
        { code: 'TOE-8A13', ects: 6, name: 'Πολιτικές Απασχόλησης', kind: epA },
        { code: 'TOE-8A14', ects: 6, name: 'Οικονομική της Άμυνας', kind: epA },
        { code: 'TOE-8A15', ects: 6, name: 'Αγροτική Οικονομική', kind: epA },
        { code: 'TOE-8B01', ects: 6, name: 'Αξιολόγηση Επενδύσεων', kind: dB },
        { code: 'TOE-8B02', ects: 6, name: 'Διαχείριση Χαρτοφυλακίου', kind: dB },
        { code: 'TOE-8B11', ects: 6, name: 'Διοικητική Λογιστική', kind: epB },
        { code: 'TOE-8B12', ects: 6, name: 'Διεθνείς Νομισματικές Σχέσεις', kind: epB },
        { code: 'TOE-8B13', ects: 6, name: 'Θεωρία Παιγνίων', kind: epB },
        {
          code: 'TOE-8B14',
          ects: 6,
          name: 'Κρυπτοοικονομία και Αλυσίδες Συστοιχιών-Blockchain',
          kind: epB,
        },
        { code: 'TOE-8C01', ects: 6, name: 'Διοίκηση Μικρομεσαίων Επιχειρήσεων', kind: dC },
        { code: 'TOE-8C02', ects: 6, name: 'Διοικητική Λογιστική', kind: dC },
        { code: 'TOE-8C11', ects: 6, name: 'Οικονομική της Τεχνολογίας', kind: epC },
        { code: 'TOE-8C12', ects: 6, name: 'Εφοδιαστική (Logistics)', kind: epC },
        { code: 'TOE-8C13', ects: 6, name: 'Υπολογιστικές Μέθοδοι', kind: epC },
        { code: 'TOE-8C14', ects: 6, name: 'Θεωρία Παιγνίων', kind: epC },
        { code: 'TOE-8C15', ects: 6, name: 'Ηλεκτρονικό Εμπόριο', kind: epC },
        { code: 'TOE-8C16', ects: 6, name: 'Οικονομική της Τεχνητής Νοημοσύνης', kind: epC },
        { code: 'TOE-8R02', ects: 6, name: 'Πτυχιακή Εργασία', kind: ep },
      ],
    },
  ],
};
