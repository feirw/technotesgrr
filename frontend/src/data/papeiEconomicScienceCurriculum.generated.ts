/** ΠΑΠΕΙ · Οικονομικής Επιστήμης (Πειραιάς) */
import type { CourseHours, SchoolCurriculum } from './schoolCurricula';

const h = (lecture: number, tutorial = 0, lab = 0): CourseHours => ({
  lecture,
  ...(tutorial ? { tutorial } : {}),
  ...(lab ? { lab } : {}),
});

const y = 'Υποχρεωτικό' as const;
const gl = 'Επιλογής (ξένη γλώσσα)' as const;
const ep = 'Επιλογής' as const;

export const PAPEI_ECONOMIC_SCIENCE_CURRICULUM: SchoolCurriculum = {
  title: 'Οικονομικής Επιστήμης',
  subtitle: 'Πανεπιστήμιο Πειραιώς · Πειραιάς',
  hoursNote:
    'Ώρες/εβδομάδα: θεωρία + φροντιστήριο (Φ) + εργαστήριο (Ε). ' +
    '3ο–6ο εξ.: επιλογή 1 ξένης γλώσσας. 3ο–4ο εξ.: επιλογή 1 μαθήματος · 5ο–8ο: επιλογή 2 μαθημάτων.',
  semesters: [
    {
      semester: 1,
      courses: [
        { code: 'ΟΕ-101', ects: 6, name: 'Εισαγωγή στην Οικονομική Ανάλυση Ι', kind: y, hours: h(4) },
        { code: 'ΟΕ-102', ects: 6, name: 'Μαθηματικά Ι', kind: y, hours: h(4) },
        { code: 'ΟΕ-103', ects: 6, name: 'Στατιστική Ι', kind: y, hours: h(4) },
        { code: 'ΟΕ-104', ects: 6, name: 'Πληροφοριακά Συστήματα', kind: y, hours: h(2, 0, 4) },
        { code: 'ΟΕ-105', ects: 6, name: 'Λογιστική Ι', kind: y, hours: h(4) },
      ],
    },
    {
      semester: 2,
      courses: [
        { code: 'ΟΕ-201', ects: 6, name: 'Εισαγωγή στην Οικονομική Ανάλυση ΙΙ', kind: y, hours: h(4) },
        { code: 'ΟΕ-202', ects: 6, name: 'Μαθηματικά ΙΙ', kind: y, hours: h(4, 2) },
        { code: 'ΟΕ-203', ects: 6, name: 'Στατιστική ΙΙ', kind: y, hours: h(4) },
        { code: 'ΟΕ-204', ects: 6, name: 'Αρχές Διοίκησης Επιχειρήσεων', kind: y, hours: h(4) },
        { code: 'ΟΕ-205', ects: 6, name: 'Λογιστική ΙΙ', kind: y, hours: h(4) },
      ],
    },
    {
      semester: 3,
      courses: [
        { code: 'ΟΕ-301', ects: 6, name: 'Μικροοικονομική Θεωρία Ι', kind: y, hours: h(4) },
        { code: 'ΟΕ-302', ects: 6, name: 'Μακροοικονομική Θεωρία Ι', kind: y, hours: h(4) },
        { code: 'ΟΕ-303', ects: 6, name: 'Χρηματοοικονομική Ι', kind: y, hours: h(4, 2) },
        { code: 'ΟΕ-304', ects: 5, name: 'Οικονομικές Εφαρμογές Η/Υ', kind: y, hours: h(0, 0, 4) },
        { code: 'ΟΕ-311', ects: 2, name: 'Αγγλικά', kind: gl, hours: h(3) },
        { code: 'ΟΕ-312', ects: 2, name: 'Γαλλικά', kind: gl, hours: h(3) },
        { code: 'ΟΕ-313', ects: 2, name: 'Γερμανικά', kind: gl, hours: h(3) },
        { code: 'ΟΕ-321', ects: 5, name: 'Αγροτική Οικονομική', kind: ep, hours: h(4) },
        { code: 'ΟΕ-322', ects: 5, name: 'Διοικητική Λογιστική και Έλεγχος', kind: ep, hours: h(4) },
        { code: 'ΟΕ-323', ects: 5, name: 'Μαθηματική Οικονομική', kind: ep, hours: h(4) },
        { code: 'ΟΕ-324', ects: 5, name: 'Οικονομική των Μεταφορών και της Ναυτιλίας', kind: ep, hours: h(4) },
        { code: 'ΟΕ-325', ects: 5, name: 'Χρήμα και Τράπεζες', kind: ep, hours: h(4) },
      ],
    },
    {
      semester: 4,
      courses: [
        { code: 'ΟΕ-401', ects: 6, name: 'Μικροοικονομική Θεωρία ΙΙ', kind: y, hours: h(4) },
        { code: 'ΟΕ-402', ects: 6, name: 'Μακροοικονομική Θεωρία ΙΙ', kind: y, hours: h(4) },
        { code: 'ΟΕ-403', ects: 6, name: 'Χρηματοοικονομική ΙΙ', kind: y, hours: h(4) },
        { code: 'ΟΕ-404', ects: 5, name: 'Επιχειρηματικότητα', kind: y, hours: h(4) },
        { code: 'ΟΕ-411', ects: 2, name: 'Αγγλικά', kind: gl, hours: h(3) },
        { code: 'ΟΕ-412', ects: 2, name: 'Γαλλικά', kind: gl, hours: h(3) },
        { code: 'ΟΕ-413', ects: 2, name: 'Γερμανικά', kind: gl, hours: h(3) },
        { code: 'ΟΕ-421', ects: 5, name: 'Εμπορικό Δίκαιο', kind: ep, hours: h(4) },
        { code: 'ΟΕ-422', ects: 5, name: 'Επιχειρησιακή Έρευνα', kind: ep, hours: h(4) },
        { code: 'ΟΕ-423', ects: 5, name: 'Ηλεκτρονικό Εμπόριο', kind: ep, hours: h(0, 0, 4) },
        { code: 'ΟΕ-424', ects: 5, name: 'Οικονομικά της Κοινωνικής Προστασίας', kind: ep, hours: h(4) },
        { code: 'ΟΕ-425', ects: 5, name: 'Οικονομικά των Τηλεπικοινωνιών και των Δικτύων', kind: ep, hours: h(4) },
        { code: 'ΟΕ-426', ects: 5, name: 'Πειραματικά Οικονομικά', kind: ep, hours: h(4) },
      ],
    },
    {
      semester: 5,
      courses: [
        { code: 'ΟΕ-501', ects: 6, name: 'Οικονομετρία Ι', kind: y, hours: h(4) },
        { code: 'ΟΕ-502', ects: 6, name: 'Δημόσια Οικονομική Ι', kind: y, hours: h(4) },
        { code: 'ΟΕ-503', ects: 6, name: 'Περιφερειακή Οικονομική', kind: y, hours: h(4) },
        { code: 'ΟΕ-511', ects: 2, name: 'Αγγλικά', kind: gl, hours: h(3) },
        { code: 'ΟΕ-512', ects: 2, name: 'Γαλλικά', kind: gl, hours: h(3) },
        { code: 'ΟΕ-513', ects: 2, name: 'Γερμανικά', kind: gl, hours: h(3) },
        { code: 'ΟΕ-521', ects: 5, name: 'Διεθνής Χρηματοοικονομική', kind: ep, hours: h(4) },
        { code: 'ΟΕ-522', ects: 5, name: 'Δίκαιο Ανταγωνισμού', kind: ep, hours: h(4) },
        { code: 'ΟΕ-523', ects: 5, name: 'Επιχειρηματική Αναλυτική', kind: ep, hours: h(0, 0, 4) },
        { code: 'ΟΕ-524', ects: 5, name: 'Marketing', kind: ep, hours: h(4) },
        { code: 'ΟΕ-525', ects: 5, name: 'Οικονομικά της Ενέργειας και των Φυσικών Πόρων', kind: ep, hours: h(4) },
        { code: 'ΟΕ-526', ects: 5, name: 'Οικονομική της Εκπαίδευσης', kind: ep, hours: h(4) },
      ],
    },
    {
      semester: 6,
      courses: [
        { code: 'ΟΕ-601', ects: 6, name: 'Οικονομετρία ΙΙ', kind: y, hours: h(4) },
        { code: 'ΟΕ-602', ects: 6, name: 'Δημόσια Οικονομική ΙΙ', kind: y, hours: h(4) },
        { code: 'ΟΕ-603', ects: 6, name: 'Οικονομική των Επιχειρήσεων και των Αποθεμάτων', kind: y, hours: h(6) },
        { code: 'ΟΕ-611', ects: 2, name: 'Αγγλικά', kind: gl, hours: h(4) },
        { code: 'ΟΕ-612', ects: 2, name: 'Γαλλικά', kind: gl, hours: h(3) },
        { code: 'ΟΕ-613', ects: 2, name: 'Γερμανικά', kind: gl, hours: h(3) },
        { code: 'ΟΕ-621', ects: 5, name: 'Ανάλυση Οικονομικών Καταστάσεων και Αποτίμηση Επιχειρήσεων', kind: ep, hours: h(4) },
        { code: 'ΟΕ-622', ects: 5, name: 'Διοίκηση και Αξιολόγηση Υπηρεσιών Υγείας', kind: ep, hours: h(4) },
        { code: 'ΟΕ-623', ects: 5, name: 'Ειδικά Θέματα Μικροοικονομικής', kind: ep, hours: h(4) },
        { code: 'ΟΕ-624', ects: 5, name: 'Εφαρμοσμένα Κοινωνικά Οικονομικά', kind: ep, hours: h(4) },
        { code: 'ΟΕ-625', ects: 5, name: 'Ιστορία Οικονομικών Θεωριών', kind: ep, hours: h(4) },
        { code: 'ΟΕ-626', ects: 6, name: 'Οικονομικά της Αγοράς Ακινήτων', kind: ep, hours: h(6) },
        { code: 'ΟΕ-627', ects: 5, name: 'Οικονομική της Εργασίας', kind: ep, hours: h(4) },
        { code: 'ΟΕ-628', ects: 5, name: 'Οικονομική του Περιβάλλοντος', kind: ep, hours: h(4) },
        { code: 'ΟΕ-629', ects: 5, name: 'Τραπεζική Οικονομική', kind: ep, hours: h(4) },
        { code: 'ΟΕ-630', ects: 6, name: 'Χωροταξική Ανάλυση', kind: ep, hours: h(2, 0, 4) },
      ],
    },
    {
      semester: 7,
      courses: [
        { code: 'ΟΕ-701', ects: 7, name: 'Διεθνές Εμπόριο', kind: y, hours: h(4) },
        { code: 'ΟΕ-702', ects: 6, name: 'Βιομηχανική Οργάνωση', kind: y, hours: h(4) },
        { code: 'ΟΕ-703', ects: 7, name: 'Οικονομική Μεγέθυνση', kind: y, hours: h(4) },
        { code: 'ΟΕ-711', ects: 5, name: 'Διεθνής Επιχειρηματική Δραστηριότητα', kind: ep, hours: h(4) },
        { code: 'ΟΕ-712', ects: 5, name: 'Ειδικά Θέματα Δημόσιας Οικονομικής', kind: ep, hours: h(4) },
        { code: 'ΟΕ-713', ects: 5, name: 'Ειδικά Θέματα στην Διεθνή Μακροοικονομική', kind: ep, hours: h(4) },
        { code: 'ΟΕ-714', ects: 5, name: 'Ειδικά Θέματα Χρηματοοικονομικής', kind: ep, hours: h(4) },
        { code: 'ΟΕ-715', ects: 5, name: 'Ηγεσία στην Ψηφιακή Εποχή', kind: ep, hours: h(4) },
        { code: 'ΟΕ-716', ects: 5, name: 'Θέματα Εφαρμοσμένης Οικονομετρίας', kind: ep, hours: h(4) },
        { code: 'ΟΕ-717', ects: 5, name: 'Οικονομικά της Καινοτομίας', kind: ep, hours: h(4) },
        { code: 'ΟΕ-718', ects: 5, name: 'Οικονομικά της Υγείας και της Ασφάλισης', kind: ep, hours: h(4) },
        { code: 'ΟΕ-719', ects: 5, name: 'Οικονομικά των Ανισοτήτων και της Φτώχειας', kind: ep, hours: h(4) },
      ],
    },
    {
      semester: 8,
      courses: [
        { code: 'ΟΕ-801', ects: 7, name: 'Διεθνείς Νομισματικές Σχέσεις', kind: y, hours: h(4) },
        { code: 'ΟΕ-802', ects: 7, name: 'Νομισματική Θεωρία', kind: y, hours: h(4) },
        { code: 'ΟΕ-803', ects: 6, name: 'Επιχειρησιακή Στρατηγική', kind: y, hours: h(4) },
        { code: 'ΟΕ-811', ects: 5, name: 'Ανάλυση Δεδομένων για την Λήψη Αποφάσεων', kind: ep, hours: h(4) },
        { code: 'ΟΕ-812', ects: 5, name: 'Βιομηχανική και Τεχνολογική Πολιτική', kind: ep, hours: h(4) },
        { code: 'ΟΕ-813', ects: 5, name: 'Βιώσιμη Επιχειρηματικότητα και Βιώσιμη Ανάπτυξη', kind: ep, hours: h(4) },
        { code: 'ΟΕ-814', ects: 5, name: 'Διεθνείς Επιχειρήσεις και Επενδύσεις', kind: ep, hours: h(4) },
        { code: 'ΟΕ-815', ects: 6, name: 'Ειδικά Θέματα Μακροοικονομικής', kind: ep, hours: h(6) },
        { code: 'ΟΕ-816', ects: 6, name: 'Μεταφορές και Εφοδιαστική Αλυσίδα', kind: ep, hours: h(4) },
        { code: 'ΟΕ-817', ects: 5, name: 'Οικονομοτεχνικές Μελέτες', kind: ep, hours: h(4) },
        { code: 'ΟΕ-818', ects: 5, name: 'Χρηματοοικονομική Ανάλυση της Αγοράς Ακινήτων', kind: ep, hours: h(4) },
        { code: 'ΟΕ-819', ects: 5, name: 'Πρακτική Άσκηση', kind: 'Πρακτική Άσκηση', hours: h(4) },
        { code: 'ΟΕ-820', ects: 5, name: 'Πτυχιακή Εργασία', kind: 'Πτυχιακή Εργασία', hours: h(4) },
      ],
    },
  ],
};
