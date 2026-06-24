/** ΠΑΜΑΚ · Οικονομικών Επιστημών (Θεσσαλονίκη) */
import type { CourseHours, SchoolCurriculum } from './schoolCurricula';

const h = (lecture: number): CourseHours => ({ lecture });

const y = 'Υποχρεωτικό' as const;
const gl = 'Επιλογής (ξένη γλώσσα)' as const;
const gC = 'Επιλογής · Ομάδα Γ' as const;
const gA = 'Επιλογής · Ομάδα Α' as const;
const gB = 'Επιλογής · Ομάδα Β' as const;
const de = 'Διπλωματική Εργασία' as const;

/** Ομάδα Γ — χειμερινά (Α' & Γ' εξ.) */
const groupCWinter = [
  { code: 'ΟΙ0109', ects: 5, name: 'Αρχές Κοινωνιολογίας', kind: gC, hours: h(4) },
  { code: 'ΟΙ0411', ects: 5, name: 'Διεθνές Οικονομικό Δίκαιο και Δίκαιο Διεθνών Συναλλαγών', kind: gC, hours: h(4) },
  { code: 'ΟΙ0213', ects: 5, name: 'Marketing', kind: gC, hours: h(4) },
  { code: 'ΟΙ0105', ects: 7, name: 'Πληροφοριακά Συστήματα στην Οικονομία και Διοίκηση', kind: gC, hours: h(4) },
  { code: 'ΟΙ0114', ects: 5, name: 'Πολιτική Οικονομία της Ευρωπαϊκής Ένωσης', kind: gC, hours: h(4) },
] as const;

/** Ομάδα Γ — εαρινά (Β' & Δ' εξ.) */
const groupCSpring = [
  { code: 'ΟΙ0115', ects: 5, name: 'Δημογραφία', kind: gC, hours: h(4) },
  { code: 'ΟΙ0312', ects: 5, name: 'Δίκαιο και Θεσμοί της Ευρωπαϊκής Ένωσης', kind: gC, hours: h(4) },
  { code: 'ΟΙ0410', ects: 5, name: 'Εισαγωγή στο Εμπορικό & Οικονομικό Δίκαιο', kind: gC, hours: h(4) },
  { code: 'ΟΙ0205', ects: 7, name: 'Εφαρμογές των Πληροφοριακών Συστημάτων στην Οικονομία & Διοίκηση', kind: gC, hours: h(4) },
  { code: 'ΟΙ0210', ects: 5, name: 'Πολιτική Επιστήμη', kind: gC, hours: h(4) },
  { code: 'ΟΙ0113', ects: 5, name: 'Χρηματοοικονομικά Μαθηματικά', kind: gC, hours: h(4) },
] as const;

/** Ομάδα Α — χειμερινά (Ε' & Ζ' εξ.) · Βασική Οικονομική Παιδεία */
const groupAWinter = [
  { code: 'ΟΙ0512', ects: 7, name: 'Αγορές Χρήματος & Κεφαλαίου', kind: gA, hours: h(4) },
  { code: 'ΟΙ0624', ects: 7, name: 'Βιομηχανική Οργάνωση', kind: gA, hours: h(4) },
  { code: 'ΟΙ0501', ects: 7, name: 'Δημόσια Οικονομική', kind: gA, hours: h(4) },
  { code: 'ΟΙ0503', ects: 7, name: 'Διεθνές Εμπόριο', kind: gA, hours: h(4) },
  { code: 'ΟΙ0602', ects: 7, name: 'Διεθνής Χρηματοδότηση', kind: gA, hours: h(4) },
  { code: 'ΟΙ0102', ects: 7, name: 'Πολιτική Οικονομία', kind: gA, hours: h(4) },
] as const;

/** Ομάδα Α — εαρινά (ΣΤ' & Η' εξ.) */
const groupASpring = [
  { code: 'ΟΙ0601', ects: 7, name: 'Δημόσια Χρηματοδότηση', kind: gA, hours: h(4) },
  { code: 'ΟΙ0515-1', ects: 7, name: 'Ειδικά Θέματα Μικροοικονομικής', kind: gA, hours: h(4) },
  { code: 'ΟΙ0702', ects: 7, name: 'Ιστορία Οικονομικών Θεωριών', kind: gA, hours: h(4) },
  { code: 'ΟΙ0701', ects: 7, name: 'Οικονομική Ανάπτυξη', kind: gA, hours: h(4) },
  { code: 'ΟΙ0617-1', ects: 7, name: 'Προχωρημένη Μακροοικονομική', kind: gA, hours: h(4) },
  { code: 'ΟΙ0502', ects: 7, name: 'Χρήμα & Τράπεζες', kind: gA, hours: h(4) },
] as const;

/** Ομάδα Β — χειμερινά (Ε' & Ζ' εξ.) · Οικονομικό Περιεχόμενο */
const groupBWinter = [
  { code: 'ΟΙ0704', ects: 5.5, name: 'Ανάλυση Κόστους-Οφέλους', kind: gB, hours: h(4) },
  { code: 'ΟΙ0403', ects: 5.5, name: 'Αρχές Χρηματοοικονομικής', kind: gB, hours: h(4) },
  { code: 'ΟΙ0901', ects: 11, name: 'Διπλωματική Εργασία', kind: de, hours: h(4) },
  { code: 'ΟΙ0530', ects: 5.5, name: 'Ειδικά Θέματα Ανάλυσης Δεδομένων', kind: gB, hours: h(4) },
  { code: 'ΟΙ0802', ects: 5.5, name: 'Ειδικά Θέματα Ιστορίας της Οικονομικής Θεωρίας & Πολιτικής', kind: gB, hours: h(4) },
  { code: 'ΟΙ0531', ects: 5.5, name: 'Εισαγωγή στην Python', kind: gB, hours: h(4) },
  { code: 'ΟΙ0533', ects: 5.5, name: 'Εισαγωγή στην Τεχνητή Νοημοσύνη', kind: gB, hours: h(4) },
  { code: 'ΟΙ0603', ects: 5.5, name: 'Θεωρία Οικονομικής Πολιτικής', kind: gB, hours: h(4) },
  { code: 'ΟΙ0526', ects: 5.5, name: 'Θεωρίες των Οικονομικών Κρίσεων', kind: gB, hours: h(4) },
  { code: 'ΟΙ0532', ects: 5.5, name: 'Μέθοδοι Μηχανικής Μάθησης στα Οικονομικά', kind: gB, hours: h(4) },
  { code: 'ΟΙ0212', ects: 5.5, name: 'Οικονομικά & Πολιτικές Περιβάλλοντος', kind: gB, hours: h(4) },
  { code: 'ΟΙ0528', ects: 5.5, name: 'Οικονομικά της Ενέργειας', kind: gB, hours: h(4) },
  { code: 'ΟΙ0527', ects: 5.5, name: 'Οικονομικά της Ναυτιλίας', kind: gB, hours: h(4) },
  { code: 'ΟΙ0627', ects: 5.5, name: 'Οικονομικά της Υγείας', kind: gB, hours: h(4) },
  { code: 'ΟΙ0703', ects: 5.5, name: 'Οικονομικά των Θεσμών και της Κουλτούρας', kind: gB, hours: h(4) },
  { code: 'ΟΙ0801', ects: 5.5, name: 'Οικονομική Μεγέθυνση', kind: gB, hours: h(4) },
  { code: 'ΟΙ0523', ects: 5.5, name: 'Οικονομική της Εργασίας', kind: gB, hours: h(4) },
  { code: 'ΟΙ0310', ects: 5.5, name: 'Περιφερειακή Οικονομική Ι', kind: gB, hours: h(4) },
  { code: 'ΟΙ0629', ects: 5.5, name: 'Σεμινάριο Διεθνών Οικονομικών', kind: gB, hours: h(4) },
  { code: 'ΟΙ0529', ects: 5.5, name: 'Προχωρημένη Μικροοικονομική', kind: gB, hours: h(4) },
  { code: 'ΟΙ0614', ects: 5.5, name: 'Τα Μακροοικονομικά της Ευρωπαϊκής Ολοκλήρωσης', kind: gB, hours: h(4) },
] as const;

/** Ομάδα Β — εαρινά (ΣΤ' & Η' εξ.) */
const groupBSpring = [
  { code: 'ΟΙ0516', ects: 5.5, name: 'Αγροτική Οικονομική', kind: gB, hours: h(4) },
  { code: 'ΟΙ0404', ects: 5.5, name: 'Ανάλυση Χρονολογικών Σειρών', kind: gB, hours: h(4) },
  { code: 'ΟΙ0901', ects: 11, name: 'Διπλωματική Εργασία', kind: de, hours: h(4) },
  { code: 'ΟΙ0522', ects: 5.5, name: 'Ειδικά Θέματα Οικονομετρίας', kind: gB, hours: h(4) },
  { code: 'ΟΙ0636', ects: 5.5, name: 'Ειδικά Θέματα στα Διεθνή Χρηματοοικονομικά', kind: gB, hours: h(4) },
  { code: 'ΟΙ0803', ects: 5.5, name: 'Θεωρία Παιγνίων', kind: gB, hours: h(4) },
  { code: 'ΟΙ0615', ects: 5.5, name: 'Κοινή Αγροτική Πολιτική', kind: gB, hours: h(4) },
  { code: 'ΟΙ0633', ects: 5.5, name: 'Μεθοδολογία της Έρευνας', kind: gB, hours: h(4) },
  { code: 'ΟΙ0619-1', ects: 5.5, name: 'Οικονομικά & Διαχείριση Φυσικών Πόρων', kind: gB, hours: h(4) },
  { code: 'ΟΙ0409', ects: 5.5, name: 'Οικονομικά Προβλήματα του Σύγχρονου Καπιταλισμού', kind: gB, hours: h(4) },
  { code: 'ΟΙ0631', ects: 5.5, name: 'Οικονομικά των Μεταφορών', kind: gB, hours: h(4) },
  { code: 'ΟΙ0509', ects: 5.5, name: 'Περιφερειακή Οικονομική ΙΙ', kind: gB, hours: h(4) },
  { code: 'ΟΙ0608', ects: 5.5, name: 'Περιφερειακή Πολιτική στην Ελλάδα και στην Ε.Ε.', kind: gB, hours: h(4) },
  { code: 'ΟΙ0305', ects: 5.5, name: 'Προχωρημένα Μαθηματικά', kind: gB, hours: h(4) },
  { code: 'ΟΙ0609', ects: 5.5, name: 'Σεμινάριο Περιφερειακής Οικονομικής', kind: gB, hours: h(4) },
  { code: 'ΟΙ0630', ects: 5.5, name: 'Συμπεριφορική Χρηματοοικονομική', kind: gB, hours: h(4) },
] as const;

/** Ομάδα Γ — χειμερινά (Ε' & Ζ' εξ.) · Β' κύκλος */
const groupC2Winter = [
  { code: 'ΞΓ0105', ects: 5, name: 'Βιβλιογραφική Έρευνα στα Αγγλικά', kind: gC, hours: h(4) },
  { code: 'ΟΙ0514-1', ects: 7, name: 'Εισαγωγή στο Ηλεκτρονικό Εμπόριο', kind: gC, hours: h(4) },
  { code: 'ΟΙ0525', ects: 5, name: 'Επιχειρησιακή Έρευνα', kind: gC, hours: h(5) },
  { code: 'ΟΙ0519', ects: 5, name: 'Λογιστική Εταιρικών Επιχειρήσεων', kind: gC, hours: h(4) },
  { code: 'ΟΙ0520-1', ects: 5, name: 'Οργανωσιακή Θεωρία και Συμπεριφορά', kind: gC, hours: h(3) },
  { code: 'ΟΙ0518', ects: 5, name: 'Συμπεριφορά Καταναλωτή', kind: gC, hours: h(4) },
] as const;

/** Ομάδα Γ — εαρινά (ΣΤ' & Η' εξ.) · Β' κύκλος */
const groupC2Spring = [
  { code: 'ΟΙ0613', ects: 5, name: 'Διδακτική των Οικονομικών', kind: gC, hours: h(4) },
  { code: 'ΟΙ0634', ects: 5, name: 'Διεθνείς Επιχειρηματικές Σχέσεις', kind: gC, hours: h(4) },
  { code: 'ΟΙ0611-1', ects: 7, name: 'Ειδικά Θέματα Ηλεκτρονικού Εμπορίου', kind: gC, hours: h(4) },
  { code: 'ΟΙ0635', ects: 5, name: 'Ειδικά Θέματα Οικονομικής της Ανάπτυξης και Ευημερίας', kind: gC, hours: h(4) },
  { code: 'ΞΓ0106', ects: 5, name: 'Ερευνητική Εργασία στα Αγγλικά', kind: gC, hours: h(4) },
  { code: 'ΟΙ0632', ects: 5, name: 'Εφοδιαστική Αλυσίδα — Logistics', kind: gC, hours: h(4) },
  { code: 'ΟΙ0612', ects: 5, name: 'Κοστολόγηση και Λογιστική Κόστους', kind: gC, hours: h(4) },
  { code: 'ΟΙ0626', ects: 5, name: 'Μέθοδοι Ανάλυσης Διοικητικών Αποφάσεων', kind: gC, hours: h(4) },
  { code: 'ΟΙ0521', ects: 5, name: 'Οικονομικό Δίκαιο της Ευρωπαϊκής Ένωσης', kind: gC, hours: h(4) },
  { code: 'ΟΙ0625', ects: 5, name: 'Πληροφοριακά Συστήματα Logistics', kind: gC, hours: h(4) },
  { code: 'ΟΙ0622', ects: 5, name: 'Χρηματοοικονομική των Νοικοκυριών', kind: gC, hours: h(4) },
] as const;

export const PAMAK_ECONOMIC_SCIENCE_CURRICULUM: SchoolCurriculum = {
  title: 'Οικονομικών Επιστημών',
  subtitle: 'Πανεπιστήμιο Μακεδονίας · Θεσσαλονίκη',
  hoursNote:
    'Α\' κύκλος (1ο–4ο εξ.): 3 υποχρεωτικά + 1 μάθημα επιλογής (Ομάδα Γ) + 1 ξένη γλώσσα. ' +
    'Β\' κύκλος (5ο–8ο εξ.): επιλογή μαθημάτων από Ομάδες Α, Β, Γ (χειμερινά/εαρινά). ' +
    'Η Διπλωματική Εργασία (ΟΙ0901) ισοδυναμεί με 2 μαθήματα. ' +
    'Τα μαθήματα επιλογής δεν προσφέρονται αναγκαστικά κάθε έτος.',
  semesters: [
    {
      semester: 1,
      courses: [
        { code: 'ΟΙ0101', ects: 8, name: 'Εισαγωγή στη Μικροοικονομική', kind: y, hours: h(4) },
        { code: 'ΟΙ0104', ects: 8, name: 'Μαθηματικά για Οικονομολόγους Ι', kind: y, hours: h(4) },
        { code: 'ΟΙ0203', ects: 8, name: 'Στατιστική για Οικονομολόγους Ι', kind: y, hours: h(4) },
        ...groupCWinter,
        { code: 'ΞΓ0101', ects: 3.5, name: 'Αγγλικά Ι', kind: gl, hours: h(4) },
        { code: 'ΞΓ0201', ects: 3.5, name: 'Γαλλικά Ι', kind: gl, hours: h(4) },
        { code: 'ΞΓ0301', ects: 3.5, name: 'Γερμανικά Ι', kind: gl, hours: h(4) },
        { code: 'ΞΓ0902', ects: 3.5, name: 'Ιταλικά Ι', kind: gl, hours: h(4) },
      ],
    },
    {
      semester: 2,
      courses: [
        { code: 'ΟΙ0201', ects: 8, name: 'Εισαγωγή στη Μακροοικονομική', kind: y, hours: h(4) },
        { code: 'ΟΙ0202', ects: 7, name: 'Λογιστική Ι', kind: y, hours: h(4) },
        { code: 'ΟΙ0204', ects: 8, name: 'Μαθηματικά για Οικονομολόγους ΙΙ', kind: y, hours: h(4) },
        { code: 'ΟΙ0304', ects: 8, name: 'Στατιστική για Οικονομολόγους ΙΙ', kind: y, hours: h(4) },
        ...groupCSpring,
        { code: 'ΞΓ0102', ects: 3.5, name: 'Αγγλικά ΙΙ', kind: gl, hours: h(4) },
        { code: 'ΞΓ0202', ects: 3.5, name: 'Γαλλικά ΙΙ', kind: gl, hours: h(4) },
        { code: 'ΞΓ0302', ects: 3.5, name: 'Γερμανικά ΙΙ', kind: gl, hours: h(4) },
        { code: 'ΞΓ0903', ects: 3.5, name: 'Ιταλικά ΙΙ', kind: gl, hours: h(4) },
      ],
    },
    {
      semester: 3,
      courses: [
        { code: 'ΟΙ0303', ects: 7, name: 'Λογιστική ΙΙ', kind: y, hours: h(4) },
        { code: 'ΟΙ0302', ects: 8, name: 'Μακροοικονομική Ι', kind: y, hours: h(4) },
        { code: 'ΟΙ0301', ects: 8, name: 'Μικροοικονομική Ι', kind: y, hours: h(4) },
        { code: 'ΟΙ0504', ects: 8, name: 'Οικονομετρία Ι', kind: y, hours: h(4) },
        ...groupCWinter,
        { code: 'ΞΓ0103', ects: 3.5, name: 'Αγγλικά ΙΙΙ', kind: gl, hours: h(4) },
        { code: 'ΞΓ0203', ects: 3.5, name: 'Γαλλικά ΙΙΙ', kind: gl, hours: h(4) },
        { code: 'ΞΓ0303', ects: 3.5, name: 'Γερμανικά ΙΙΙ', kind: gl, hours: h(4) },
        { code: 'ΟΙ0904', ects: 3.5, name: 'Ιταλικά ΙΙΙ', kind: gl, hours: h(4) },
      ],
    },
    {
      semester: 4,
      courses: [
        { code: 'ΟΙ0402', ects: 8, name: 'Μακροοικονομική ΙΙ', kind: y, hours: h(4) },
        { code: 'ΟΙ0401', ects: 8, name: 'Μικροοικονομική ΙΙ', kind: y, hours: h(4) },
        { code: 'ΟΙ0604', ects: 8, name: 'Οικονομετρία ΙΙ', kind: y, hours: h(4) },
        { code: 'ΟΙ0412', ects: 7, name: 'Οικονομική Ιστορία της Ελλάδας', kind: y, hours: h(4) },
        ...groupCSpring,
        { code: 'ΞΓ0104', ects: 3.5, name: 'Αγγλικά IV', kind: gl, hours: h(4) },
        { code: 'ΞΓ0204', ects: 3.5, name: 'Γαλλικά IV', kind: gl, hours: h(4) },
        { code: 'ΞΓ0304', ects: 3.5, name: 'Γερμανικά IV', kind: gl, hours: h(4) },
        { code: 'ΟΙ0905', ects: 3.5, name: 'Ιταλικά IV', kind: gl, hours: h(4) },
      ],
    },
    {
      semester: 5,
      courses: [...groupAWinter, ...groupBWinter, ...groupC2Winter],
    },
    {
      semester: 6,
      courses: [...groupASpring, ...groupBSpring, ...groupC2Spring],
    },
    {
      semester: 7,
      courses: [...groupAWinter, ...groupBWinter, ...groupC2Winter],
    },
    {
      semester: 8,
      courses: [...groupASpring, ...groupBSpring, ...groupC2Spring],
    },
  ],
};
