/** ΑΠΘ · Οικονομικών Επιστημών (Θεσσαλονίκη) */
import type { SchoolCurriculum } from './schoolCurricula';

const y = 'Υποχρεωτικό' as const;
const gl = 'Επιλογής (ξένη γλώσσα)' as const;
const ep = 'Επιλογής' as const;
const dEco = 'Υποχρεωτικό κατεύθυνσης · Οικονομία' as const;
const dMgmt = 'Υποχρεωτικό κατεύθυνσης · Διοίκηση Επιχειρήσεων' as const;

const sem5Electives = [
  { code: 'ΟΑ-5Ε01', ects: 3, name: 'Οικονομική των Διακρίσεων', kind: ep },
  { code: 'ΟΑ-5Ε02', ects: 3, name: 'Μαθηματική Οικονομική', kind: ep },
  { code: 'ΟΑ-5Ε03', ects: 3, name: 'Μάθημα Επιλογής από Άλλο Τμήμα 1', kind: ep },
  { code: 'ΟΑ-5Ε04', ects: 3, name: 'Συμπεριφορά Καταναλωτή', kind: ep },
  { code: 'ΟΑ-5Ε05', ects: 3, name: 'Τεχνικές Προσομοίωσης στη Διοίκηση Επιχειρήσεων', kind: ep },
  { code: 'ΟΑ-5Ε06', ects: 3, name: 'Καινοτομία και Επιχειρηματικότητα', kind: ep },
  { code: 'ΟΑ-5Ε07', ects: 3, name: 'Ειδικά Θέματα Πολιτικής Οικονομίας', kind: ep },
  { code: 'ΟΑ-5Ε08', ects: 3, name: 'Έρευνα Μάρκετινγκ', kind: ep },
  { code: 'ΟΑ-5Ε09', ects: 3, name: 'Διοικητική Λογιστική', kind: ep },
  { code: 'ΟΑ-5Ε10', ects: 3, name: 'Διεθνής Χρηματοοικονομική', kind: ep },
  { code: 'ΟΑ-5Ε11', ects: 3, name: 'Οικονομία της Υγείας', kind: ep },
] as const;

const sem6Electives = [
  { code: 'ΟΑ-6Ε01', ects: 3, name: 'Δημόσια Οικονομική ΙΙ', kind: ep },
  { code: 'ΟΑ-6Ε02', ects: 3, name: 'Οικονομικά των Προμηθειών του Δημοσίου', kind: ep },
  { code: 'ΟΑ-6Ε03', ects: 3, name: 'Θεωρία Παιγνίων', kind: ep },
  { code: 'ΟΑ-6Ε04', ects: 3, name: 'Οικονομία της Υγείας', kind: ep },
  { code: 'ΟΑ-6Ε05', ects: 3, name: 'Ευρωπαϊκή Οικονομία', kind: ep },
  { code: 'ΟΑ-6Ε06', ects: 3, name: 'Τουριστική Ανάπτυξη', kind: ep },
  { code: 'ΟΑ-6Ε07', ects: 3, name: 'Υποδείγματα Αποθεμάτων και Προβλέψεων', kind: ep },
  { code: 'ΟΑ-6Ε08', ects: 3, name: 'Πληροφοριακά Συστήματα Διοίκησης — Ηλεκτρονικό Εμπόριο', kind: ep },
  { code: 'ΟΑ-6Ε09', ects: 3, name: 'Επιχείρηση και Κοινωνία: Εταιρική Κοινωνική Ευθύνη', kind: ep },
  { code: 'ΟΑ-6Ε10', ects: 3, name: 'Διοίκηση Μικρομεσαίων Επιχειρήσεων — Επιχειρηματικότητα', kind: ep },
  { code: 'ΟΑ-6Ε11', ects: 3, name: 'Διοίκηση Λιανικού Εμπορίου και Δικτύου Διανομής', kind: ep },
  { code: 'ΟΑ-6Ε12', ects: 3, name: 'Ειδικά Θέματα Μικροοικονομίας (επαναλαμβανόμενο)', kind: ep },
  { code: 'ΟΑ-6Ε13', ects: 3, name: 'Μάθημα Επιλογής από Άλλο Τμήμα 1', kind: ep },
  { code: 'ΟΑ-6Ε14', ects: 3, name: 'Μάθημα Επιλογής από Άλλο Τμήμα 2', kind: ep },
  { code: 'ΟΑ-6Ε15', ects: 3, name: 'Νομισματική Οικονομική', kind: ep },
] as const;

const sem7Electives = [
  { code: 'ΟΑ-7Ε01', ects: 3, name: 'Προγραμματισμός και Σχεδιασμός Οικονομικής Ανάπτυξης', kind: ep },
  { code: 'ΟΑ-7Ε02', ects: 3, name: 'Επενδύσεις', kind: ep },
  { code: 'ΟΑ-7Ε03', ects: 3, name: 'Λογιστικά Πληροφοριακά Συστήματα', kind: ep },
  { code: 'ΟΑ-7Ε04', ects: 3, name: 'Τραπεζική Χρηματοοικονομική', kind: ep },
  { code: 'ΟΑ-7Ε05', ects: 3, name: 'Διοίκηση Ποιότητας και Στατιστικός Έλεγχος Ποιότητας', kind: ep },
  { code: 'ΟΑ-7Ε06', ects: 3, name: 'Εξόρυξη Πληροφορίας και Αναλυτική Οικονομικών Δεδομένων', kind: ep },
  { code: 'ΟΑ-7Ε07', ects: 3, name: 'Διεθνές Μάρκετινγκ', kind: ep },
  { code: 'ΟΑ-7Ε08', ects: 3, name: 'Βιομηχανική Ανάπτυξη', kind: ep },
  { code: 'ΟΑ-7Ε09', ects: 3, name: 'Οικονομική του Περιβάλλοντος', kind: ep },
  { code: 'ΟΑ-7Ε10', ects: 3, name: 'Πρακτική Άσκηση', kind: ep },
] as const;

const sem8Electives = [
  { code: 'ΟΑ-8Ε01', ects: 3, name: 'Φορολογική Λογιστική', kind: ep },
  { code: 'ΟΑ-8Ε02', ects: 3, name: 'Παράγωγα Χρηματοοικονομικά Προϊόντα', kind: ep },
  { code: 'ΟΑ-8Ε03', ects: 3, name: 'Διαχείριση Χρηματοοικονομικών Κινδύνων', kind: ep },
  { code: 'ΟΑ-8Ε04', ects: 3, name: 'Ειδικά Θέματα Χρηματοδότησης', kind: ep },
  { code: 'ΟΑ-8Ε05', ects: 3, name: 'Οικονομική Πολιτική', kind: ep },
  { code: 'ΟΑ-8Ε06', ects: 3, name: 'Ελληνική Οικονομική Ιστορία', kind: ep },
  { code: 'ΟΑ-8Ε07', ects: 3, name: 'Ελληνική Κεφαλαιαγορά', kind: ep },
  { code: 'ΟΑ-8Ε08', ects: 3, name: 'Πειραματικά Οικονομικά', kind: ep },
  { code: 'ΟΑ-8Ε09', ects: 3, name: 'Περιφερειακή Οικονομική Ανάπτυξη ΙΙ', kind: ep },
  { code: 'ΟΑ-8Ε10', ects: 3, name: 'Οικονομικά της Φτωχείας', kind: ep },
  { code: 'ΟΑ-8Ε11', ects: 3, name: 'Εφαρμοσμένη Στατιστική Έρευνα', kind: ep },
  { code: 'ΟΑ-8Ε12', ects: 3, name: 'Εφαρμογές Χρηματοοικονομικής Οικονομετρίας', kind: ep },
  { code: 'ΟΑ-8Ε13', ects: 3, name: 'Οικονομική του Περιβάλλοντος (επαναλαμβανόμενο)', kind: ep },
  { code: 'ΟΑ-8Ε14', ects: 3, name: 'Πρακτική Άσκηση', kind: ep },
] as const;

export const AUTH_ECONOMIC_SCIENCE_CURRICULUM: SchoolCurriculum = {
  title: 'Οικονομικών Επιστημών',
  subtitle: 'Αριστοτέλειο Πανεπιστήμιο Θεσσαλονίκης · Θεσσαλονίκη',
  hoursNote:
    'Α\' κύκλος σπουδών (1ο–4ο εξ.) · Β\' κύκλος με κατευθύνσεις Οικονομίας και Διοίκησης Επιχειρήσεων (5ο–8ο εξ.). ' +
    '5ο–8ο εξ.: επιλογή 2 μαθημάτων επιλογής ανά εξάμηνο.',
  semesters: [
    {
      semester: 1,
      courses: [
        { code: 'ΟΑ-101', ects: 6, name: 'Πληροφορική Ι', kind: y },
        { code: 'ΟΑ-102', ects: 6, name: 'Μικροοικονομική Ι', kind: y },
        { code: 'ΟΑ-103', ects: 6, name: 'Στατιστική Ι', kind: y },
        { code: 'ΟΑ-104', ects: 6, name: 'Μαθηματικά Ι', kind: y },
        { code: 'ΟΑ-105', ects: 0.5, name: 'Ελληνικά Α\' Εξαμήνου', kind: y },
      ],
    },
    {
      semester: 2,
      courses: [
        { code: 'ΟΑ-201', ects: 6, name: 'Μακροοικονομική Ι', kind: y },
        { code: 'ΟΑ-202', ects: 6, name: 'Πληροφορική ΙΙ', kind: y },
        { code: 'ΟΑ-203', ects: 6, name: 'Στατιστική ΙΙ', kind: y },
        { code: 'ΟΑ-204', ects: 6, name: 'Μαθηματικά ΙΙ', kind: y },
        { code: 'ΟΑ-205', ects: 6, name: 'Χρηματοοικονομική Λογιστική Ι', kind: y },
        { code: 'ΟΑ-206', ects: 0.5, name: 'Ελληνικά Β\' Εξαμήνου', kind: y },
      ],
    },
    {
      semester: 3,
      courses: [
        { code: 'ΟΑ-301', ects: 5, name: 'Μικροοικονομική ΙΙ', kind: y },
        { code: 'ΟΑ-302', ects: 5, name: 'Οικονομική Ιστορία', kind: y },
        { code: 'ΟΑ-303', ects: 5, name: 'Οικονομική Ανάπτυξη', kind: y },
        { code: 'ΟΑ-304', ects: 5, name: 'Διεθνής Οικονομική Ι', kind: y },
        { code: 'ΟΑ-305', ects: 5, name: 'Οικονομική Επιχειρήσεων', kind: y },
        { code: 'ΟΑ-306', ects: 5, name: 'Χρηματοοικονομική Λογιστική ΙΙ', kind: y },
      ],
    },
    {
      semester: 4,
      courses: [
        { code: 'ΟΑ-401', ects: 5.5, name: 'Οικονομετρία', kind: y },
        { code: 'ΟΑ-402', ects: 5.5, name: 'Μακροοικονομική ΙΙ', kind: y },
        { code: 'ΟΑ-403', ects: 5.5, name: 'Πολιτική Οικονομία', kind: y },
        { code: 'ΟΑ-404', ects: 5.5, name: 'Εισαγωγή στο Marketing', kind: y },
        { code: 'ΟΑ-405', ects: 5.5, name: 'Διοίκηση Επιχειρήσεων Λειτουργιών', kind: y },
        { code: 'ΟΑ-411', ects: 2.5, name: 'Αγγλικά', kind: gl },
        { code: 'ΟΑ-412', ects: 2.5, name: 'Γερμανικά', kind: gl },
        { code: 'ΟΑ-413', ects: 0.5, name: 'Ελληνικά Δ\' Εξαμήνου', kind: y },
      ],
    },
    {
      semester: 5,
      courses: [
        { code: 'ΟΑ-501', ects: 6, name: 'Ανάλυση Χρονοσειρών', kind: y },
        { code: 'ΟΑ-502', ects: 6, name: 'Δημόσια Οικονομική Ι', kind: y },
        { code: 'ΟΑ-503', ects: 6, name: 'Τραπεζική Οικονομική', kind: y },
        { code: 'ΟΑ-504', ects: 6, name: 'Χρηματοοικονομική Ανάλυση Ι', kind: y },
        { code: 'ΟΑ-505', ects: 6, name: 'Διοίκηση Υπηρεσιών', kind: y },
        { code: 'ΟΑ-506', ects: 6, name: 'Οργανωτική Θεωρία και Οργανωτική Συμπεριφορά', kind: y },
        { code: 'ΟΑ-507', ects: 0.5, name: 'Ελληνικά Ε\' Εξαμήνου', kind: y },
        { code: 'ΟΑ-508', ects: 6, name: 'Ειδικά Θέματα Μακροοικονομίας', kind: dEco },
        { code: 'ΟΑ-509', ects: 6, name: 'Ειδικά Θέματα Μικροοικονομίας', kind: dMgmt },
        { code: 'ΟΑ-510', ects: 6, name: 'Ειδικά Θέματα Μακροοικονομίας', kind: dMgmt },
        ...sem5Electives,
      ],
    },
    {
      semester: 6,
      courses: [
        { code: 'ΟΑ-601', ects: 6, name: 'Θεωρίες Οικονομικής Μεγέθυνσης', kind: dEco },
        { code: 'ΟΑ-602', ects: 6, name: 'Νομισματική Οικονομική', kind: dEco },
        { code: 'ΟΑ-603', ects: 6, name: 'Οικονομική του Χώρου', kind: dEco },
        { code: 'ΟΑ-604', ects: 6, name: 'Ειδικά Θέματα Μικροοικονομίας', kind: dEco },
        { code: 'ΟΑ-605', ects: 0.5, name: 'Ελληνικά ΣΤ\' Εξαμήνου', kind: y },
        { code: 'ΟΑ-606', ects: 6, name: 'Επιχειρησιακή Έρευνα', kind: dMgmt },
        { code: 'ΟΑ-607', ects: 6, name: 'Χρηματοοικονομική Ανάλυση ΙΙ', kind: dMgmt },
        { code: 'ΟΑ-608', ects: 6, name: 'Εισαγωγή στην Εφοδιαστική και τη Διαχείριση Εφοδιαστικής Αλυσίδας', kind: dMgmt },
        { code: 'ΟΑ-609', ects: 6, name: 'Ανάλυση Χρηματοοικονομικών Καταστάσεων', kind: dMgmt },
        ...sem6Electives,
      ],
    },
    {
      semester: 7,
      courses: [
        { code: 'ΟΑ-701', ects: 6, name: 'Διαφήμιση', kind: y },
        { code: 'ΟΑ-702', ects: 6, name: 'Στρατηγικό Μάνατζμεντ', kind: y },
        { code: 'ΟΑ-703', ects: 6, name: 'Θεωρία Λήψης Αποφάσεων', kind: y },
        { code: 'ΟΑ-704', ects: 6, name: 'Ειδική Λογιστική', kind: y },
        { code: 'ΟΑ-705', ects: 6, name: 'Ιστορία Οικονομικών Θεωριών', kind: y },
        { code: 'ΟΑ-706', ects: 6, name: 'Διεθνής Μακροοικονομική', kind: y },
        { code: 'ΟΑ-707', ects: 6, name: 'Περιφερειακή Οικονομική Ανάπτυξη Ι', kind: y },
        { code: 'ΟΑ-708', ects: 6, name: 'Βιομηχανική Οργάνωση και Πολιτική', kind: y },
        ...sem7Electives,
      ],
    },
    {
      semester: 8,
      courses: [
        { code: 'ΟΑ-801', ects: 6, name: 'Ελεγκτική', kind: y },
        { code: 'ΟΑ-802', ects: 6, name: 'Στρατηγικό Μάρκετινγκ', kind: y },
        { code: 'ΟΑ-803', ects: 6, name: 'Διοικητική Λογιστική — Λογιστική Κόστους', kind: y },
        { code: 'ΟΑ-804', ects: 6, name: 'Διοίκηση Ανθρώπινων Πόρων', kind: y },
        { code: 'ΟΑ-805', ects: 6, name: 'Χρηματοοικονομική Οικονομετρία', kind: y },
        { code: 'ΟΑ-806', ects: 6, name: 'Οικονομικά της Εργασίας', kind: y },
        { code: 'ΟΑ-807', ects: 6, name: 'Πολιτικές Οικονομικής Ανάπτυξης', kind: y },
        { code: 'ΟΑ-808', ects: 6, name: 'Αγορές Χρήματος και Κεφαλαίου', kind: y },
        ...sem8Electives,
      ],
    },
  ],
};
