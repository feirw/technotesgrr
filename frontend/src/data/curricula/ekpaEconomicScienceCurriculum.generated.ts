/** ΕΚΠΑ · Οικονομικών Επιστημών (Αθήνα) */
import type { SchoolCurriculum } from './schoolCurricula';

const y = 'Υποχρεωτικό' as const;
const be = 'Βασικής Επιλογής' as const;
const el = 'Ελεύθερης Επιλογής' as const;
const elOther = 'Ελεύθερης Επιλογής (άλλα τμήματα)' as const;

const te = (unit: string) => `Θεματική Ενότητα · ${unit}`;

const teTheory = te('Οικονομική Θεωρία και Ιστορία');
const teQuant = te('Ποσοτικές Μέθοδοι και Πληροφορική');
const teGrowth = te('Ανάπτυξη και Οικονομική Πολιτική');
const teApplied = te('Εφαρμοσμένη Οικονομική');
const teBizFin = te('Οικονομική και Διοίκηση των Επιχειρήσεων – Χρηματοοικονομική');
const teTheoryQuant = te('Οικονομική Θεωρία και Ιστορία & Ποσοτικές Μέθοδοι και Πληροφορική');
const teAppliedQuant = te('Εφαρμοσμένη Οικονομική & Ποσοτικές Μέθοδοι και Πληροφορική');
const teBizFinApplied = te('Οικονομική και Διοίκηση των Επιχειρήσεων – Χρηματοοικονομική & Εφαρμοσμένη Οικονομική');

export const EKPA_ECONOMIC_SCIENCE_CURRICULUM: SchoolCurriculum = {
  title: 'Οικονομικών Επιστημών',
  subtitle: 'Εθνικό και Καποδιστριακό Πανεπιστήμιο Αθηνών · Αθήνα',
  hoursNote:
    'Θεματικές ενότητες: (1) Οικονομική Θεωρία και Ιστορία, (2) Ποσοτικές Μέθοδοι και Πληροφορική, ' +
    '(3) Ανάπτυξη και Οικονομική Πολιτική, (4) Εφαρμοσμένη Οικονομική, ' +
    '(5) Οικονομική και Διοίκηση των Επιχειρήσεων – Χρηματοοικονομική. ' +
    'Βασικής επιλογής: επιλογή μαθημάτων ανά εξάμηνο (3ο–8ο). ' +
    'Ελεύθερης επιλογής: απαιτούνται 8 μαθήματα κατά τη διάρκεια των σπουδών (συμπεριλ. μαθημάτων άλλων τμημάτων).',
  semesters: [
    {
      semester: 1,
      courses: [
        { code: '41ACC101', ects: 6, name: 'Λογιστική Ι', kind: y },
        { code: '41ECO101', ects: 6, name: 'Εισαγωγή στην Οικονομική Ανάλυση', kind: y },
        { code: '41MTH101', ects: 6, name: 'Μαθηματικά Ι', kind: y },
        { code: '41PEC101', ects: 6, name: 'Εισαγωγή στην Πολιτική Οικονομία', kind: y },
        { code: '41QNT101', ects: 6, name: 'Στατιστική Ι', kind: y },
        { code: '41MTH100', ects: 6, name: 'Εισαγωγή στα Μαθηματικά', kind: el },
      ],
    },
    {
      semester: 2,
      courses: [
        { code: '41HIS101', ects: 6, name: 'Εισαγωγή στην Ευρωπαϊκή Οικονομική Ιστορία, 19ος–20ος', kind: y },
        { code: '41MTH102', ects: 6, name: 'Μαθηματικά ΙΙ', kind: y },
        { code: '41PEC102', ects: 6, name: 'Πολιτική Οικονομία της Απασχόλησης και του Χρήματος', kind: y },
        { code: '41QNT101', ects: 6, name: 'Στατιστική Ι', kind: y },
      ],
    },
    {
      semester: 3,
      courses: [
        { code: '41CSC201', ects: 6, name: 'Εισαγωγή στην Επιστήμη των Υπολογιστών και τη Διαχείριση Πληροφοριών', kind: y },
        { code: '41ECO201', ects: 6, name: 'Μικροοικονομική Θεωρία Ι', kind: y },
        { code: '41ECO211', ects: 6, name: 'Μακροοικονομική Θεωρία Ι', kind: y },
        { code: '41ECO221', ects: 6, name: 'Οικονομική των Επιχειρήσεων', kind: y },
        { code: '41LAB201', ects: 6, name: 'Εργαστήριο Ποσοτικής Ανάλυσης με το Excel', kind: y },
        { code: '41QNT201', ects: 6, name: 'Στατιστική ΙΙ', kind: y },
        { code: '41CSC202', ects: 6, name: 'Οργάνωση και Λειτουργία Υπολογιστικών Συστημάτων', kind: be },
        { code: '41HIS202', ects: 6, name: 'Ελληνική Οικονομική Ιστορία Ι, 19ος Αιώνας – 1940', kind: teGrowth },
        { code: '41LAB222', ects: 6, name: 'Εργαστήριο Ηλεκτρονικού Επιχειρείν', kind: el },
      ],
    },
    {
      semester: 4,
      courses: [
        { code: '41ACC201', ects: 6, name: 'Λογιστική ΙΙ', kind: be },
        { code: '41ECO202', ects: 6, name: 'Μικροοικονομική Θεωρία ΙΙ', kind: y },
        { code: '41ECO212', ects: 6, name: 'Μακροοικονομική Θεωρία ΙΙ', kind: y },
        { code: '41ECO221', ects: 6, name: 'Οικονομική των Επιχειρήσεων', kind: y },
        { code: '41QNT202', ects: 6, name: 'Οικονομετρία', kind: y },
        { code: '41HIS201', ects: 6, name: 'Θέματα Οικονομικής Ιστορίας του 16ου–20ου Αι.', kind: teTheory },
        { code: '41LAB221', ects: 6, name: 'Εργαστήριο Ηλεκτρονικής Διακυβέρνησης', kind: el },
      ],
    },
    {
      semester: 5,
      courses: [
        { code: '41PEC301', ects: 6, name: 'Πολιτική Οικονομία της Ανάπτυξης και της Μεγέθυνσης', kind: y },
        { code: '41ECO301', ects: 6, name: 'Προχωρημένη Οικονομική Ανάλυση', kind: y },
        { code: '41ECO311', ects: 6, name: 'Βιομηχανική Οικονομική Ι', kind: be },
        { code: '41ECO313', ects: 6, name: 'Ιστορία Οικονομικών Θεωριών', kind: be },
        { code: '41FIN301', ects: 6, name: 'Οικονομική Ανάλυση του Χρήματος και της Πίστης', kind: be },
        { code: '41HIS301', ects: 6, name: 'Ελληνική Οικονομική Ιστορία ΙΙ, 1940–2000', kind: be },
        { code: '41PEC312', ects: 6, name: 'Πολιτική Οικονομία Κοινωνικής Πολιτικής', kind: be },
        { code: '41FIN331', ects: 6, name: 'Αγορές Χρήματος και Κεφαλαίου Ι', kind: teBizFinApplied },
        { code: '41MTH302', ects: 6, name: 'Δυναμικά Μαθηματικά', kind: teTheory },
        { code: '41QNT302', ects: 6, name: 'Στατιστική ΙΙΙ', kind: teQuant },
      ],
    },
    {
      semester: 6,
      courses: [
        { code: '41ACC301', ects: 6, name: 'Λογιστική ΙΙΙ', kind: el },
        { code: '41CSC301', ects: 6, name: 'Βάσεις και Διαχείριση Δεδομένων', kind: teQuant },
        { code: '41CSC302', ects: 6, name: 'Δομές Δεδομένων και Αρχές Προγραμματισμού Υπολογιστών', kind: el },
        { code: '41ECO302', ects: 6, name: 'Δημόσια Οικονομική', kind: y },
        { code: '41ECO303', ects: 6, name: 'Διεθνής Οικονομική', kind: y },
        { code: '41ECO312', ects: 6, name: 'Οικονομικά του Περιβάλλοντος', kind: be },
        { code: '41ECO314', ects: 6, name: 'Θεωρίες Οικονομικής Μεγέθυνσης', kind: be },
        { code: '41FIN302', ects: 6, name: 'Χρηματοοικονομική Ανάλυση Επιχειρήσεων', kind: be },
        { code: '41FIN332', ects: 6, name: 'Αγορές Χρήματος και Κεφαλαίου ΙΙ', kind: teBizFin },
        { code: '41FIN333', ects: 6, name: 'Τραπεζική Ι', kind: teBizFin },
        { code: '41LAB301', ects: 6, name: 'Εργαστήριο για το μάθημα Βάσεις και Διαχείριση Δεδομένων', kind: teQuant },
        { code: '41MTH301', ects: 6, name: 'Γραμμικά Μαθηματικά', kind: teQuant },
        { code: '41QNT301', ects: 6, name: 'Εφαρμοσμένη Οικονομετρία', kind: teAppliedQuant },
        { code: '41LAB302', ects: 6, name: 'Εργαστήριο Γλώσσας Προγραμματισμού Visual Basic', kind: el },
        { code: '41PEC311', ects: 6, name: 'Πολιτική Οικονομία της Παγκοσμιοποίησης', kind: el },
        { code: '41PRC000', ects: 6, name: 'Πρακτική Άσκηση', kind: el },
      ],
    },
    {
      semester: 7,
      courses: [
        { code: '41ECO412', ects: 6, name: 'Θεωρία Παιγνίων', kind: teTheoryQuant },
        { code: '41ECO424', ects: 6, name: 'Οικονομική Πολιτική στην Ελληνική Οικονομία', kind: teGrowth },
        { code: '41ECO426', ects: 6, name: 'Αξιολόγηση Επενδύσεων', kind: teGrowth },
        { code: '41ECO452', ects: 6, name: 'Οικονομικά της Εργασίας', kind: teApplied },
        { code: '41ECO453', ects: 6, name: 'Οικονομικά της Τεχνολογίας', kind: teApplied },
        { code: '41PEC411', ects: 6, name: 'Μαρξιστική Πολιτική Οικονομία Ι', kind: teTheory },
        { code: '41QNT402', ects: 6, name: 'Ανάλυση Χρονολογικών Σειρών και Προβλέψεις', kind: teBizFin },
        { code: '41ECO467', ects: 6, name: 'Οικονομική της Εκπαίδευσης', kind: el },
        { code: '41ECO469', ects: 6, name: 'Μετα-Κευνσιανά Οικονομικά', kind: el },
        { code: '41ECO490', ects: 6, name: 'Δημοσιονομική Πολιτική', kind: el },
        { code: '41ECO493', ects: 6, name: 'Συγκριτικά Οικονομικά Συστήματα', kind: el },
        { code: '41ECO495', ects: 6, name: 'Οικονομική Θεωρία και Πολιτική Ιδεολογία', kind: el },
        { code: '41FIN466', ects: 6, name: 'Δίκαιο των Χρηματοπιστωτικών Αγορών', kind: el },
        { code: '41FIN467', ects: 6, name: 'Χρηματοοικ. Υποδείγματα για Επιχειρ. Αποφάσεις', kind: el },
        { code: '41HIS402', ects: 6, name: 'Ιστορία των Πόλεων', kind: el },
        { code: '41MGT461', ects: 6, name: 'Εισαγωγή στο Marketing', kind: el },
        { code: '41MGT471', ects: 6, name: 'Επιχειρηματική Πολιτική και Στρατηγική', kind: el },
        { code: '41MGT474', ects: 6, name: 'Διοίκηση Ανθρώπινων Πόρων', kind: el },
        { code: '42501', ects: 6, name: 'Πολιτική Επιστήμη Ι', kind: elOther },
      ],
    },
    {
      semester: 8,
      courses: [
        { code: '41ACC401', ects: 6, name: 'Λογιστική IV (Μηχανογραφημένη Λογιστική)', kind: el },
        { code: '41CSC403', ects: 6, name: 'Πληροφοριακά Συστήματα Επιχειρήσεων', kind: el },
        { code: '41ECO411', ects: 6, name: 'Προχωρημένη Μακροοικονομική', kind: teTheory },
        { code: '41ECO413', ects: 6, name: 'Οικονομικά της Ενέργειας και των Φυσικών Πόρων', kind: el },
        { code: '41ECO421', ects: 6, name: 'Οικονομική Μετασχηματισμού και Ανάπτυξης', kind: be },
        { code: '41ECO422', ects: 6, name: 'Οικονομική Πολιτική', kind: teGrowth },
        { code: '41ECO423', ects: 6, name: 'Ευρωπαϊκή Οικονομική Ολοκλήρωση', kind: teGrowth },
        { code: '41ECO451', ects: 6, name: 'Βιομηχανική Οικονομική ΙΙ', kind: teApplied },
        { code: '41ECO454', ects: 6, name: 'Νομισματική Θεωρία και Πολιτική', kind: teApplied },
        { code: '41ECO492', ects: 6, name: 'Κοινωνικοοικονομική Αξιολόγηση Επενδύσεων', kind: teGrowth },
        { code: '41HIS401', ects: 6, name: 'Ιστορία των Επιχειρήσεων και Χρηματοοικονομικών Θεσμών', kind: teBizFin },
        { code: '41MGT470', ects: 6, name: 'Θεωρία και Στρατηγική Πολυεθνικών Επιχειρήσεων', kind: el },
        { code: '41MGT473', ects: 6, name: 'Θεωρία Επιχειρησιακής Οργάνωσης', kind: el },
        { code: '41QNT401', ects: 6, name: 'Εφαρμοσμένη Επιχειρησιακή Έρευνα', kind: teQuant },
        { code: '41ECO463', ects: 6, name: 'Ιστορία της Οικονομ. Σκέψης στη Σύγχρονη Ελλάδα', kind: el },
        { code: '41ECO464', ects: 6, name: 'Θεσμική Οικονομική', kind: el },
        { code: '41ECO481', ects: 6, name: 'Ειδικά Θέματα Οικονομικής Ανάπτυξης: Επιχειρηματικότητα', kind: el },
        { code: '41ECO482', ects: 6, name: 'Ανθρώπινοι Πόροι και Ανάπτυξη', kind: el },
        { code: '41ECO483', ects: 6, name: 'Αναπτυξιακή Χρηματοοικονομική', kind: el },
        { code: '41ECO485', ects: 6, name: 'Ειδικά Θέματα Διεθνούς Οικονομικής', kind: el },
        { code: '41ECO494', ects: 6, name: 'Σύγχρονη Ελληνική Οικονομία', kind: el },
        { code: '41FIN463', ects: 6, name: 'Διεθνής Χρηματοοικονομική', kind: el },
        { code: '41LAB403', ects: 6, name: 'Εργαστήριο Joomla', kind: el },
        { code: '41MGT461-EN', ects: 6, name: 'Εισαγωγή στο Marketing (Αγγλικά)', kind: el },
        { code: '41MGT462', ects: 6, name: 'Marketing Υπηρεσιών', kind: el },
        { code: '41MGT468', ects: 6, name: 'Διεθνείς Επιχειρήσεις', kind: el },
        { code: '41PEC461', ects: 6, name: 'Κλασικά Κείμενα Πολιτικής Οικονομίας', kind: el },
        { code: '41PEC462', ects: 6, name: 'Μαρξιστική Πολιτική Οικονομία ΙΙ', kind: el },
        { code: '41PEC463', ects: 6, name: 'Εξελικτική Πολιτική Οικονομία', kind: el },
        { code: '41PHI461', ects: 6, name: 'Φιλοσοφία των Κοινωνικών Επιστημών', kind: el },
        { code: '42499Β', ects: 6, name: 'Σύγχρονη Κοινωνική Θεωρία', kind: elOther },
        { code: '42902', ects: 6, name: 'Πολιτική Φιλοσοφία Ι', kind: elOther },
        { code: '42969', ects: 6, name: 'Ομάδες Συμφερόντων και Lobbying στην Ευρωπαϊκή και Διεθνή Πολιτική', kind: elOther },
        { code: '44FF415', ects: 6, name: 'Επενδύσεις Αξίας', kind: elOther },
        { code: 'BA289', ects: 6, name: 'Ελεγκτική Λογιστική', kind: elOther },
        { code: 'BA290', ects: 6, name: 'Διεθνή Λογιστικά Πρότυπα / Διεθνή Πρότυπα Χρηματοοικονομικής Αναφοράς', kind: elOther },
        { code: 'BA291', ects: 6, name: 'Λογιστικά Πληροφοριακά Συστήματα', kind: elOther },
        { code: '41ECO480', ects: 6, name: 'Εφαρμοσμένη Αναπτυξιακή Οικονομική', kind: be },
      ],
    },
  ],
};
