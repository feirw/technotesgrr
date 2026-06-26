/** Δημοκρίτειο Πανεπιστήμιο Θράκης · Οικονομικών Επιστημών (Κομοτηνή) */
import type { SchoolCurriculum } from './schoolCurricula';

const y = 'Υποχρεωτικό' as const;
const ep = 'Επιλογής' as const;

export const DPTH_KOMOTINI_ECONOMIC_SCIENCE_CURRICULUM: SchoolCurriculum = {
  title: 'Οικονομικών Επιστημών',
  subtitle: 'Δημοκρίτειο Πανεπιστήμιο Θράκης · Κομοτηνή',
  semesters: [
    {
      semester: 1,
      courses: [
        { code: 'NK101', ects: 6, name: 'Μικροοικονομική Θεωρία Ι', kind: y },
        {
          code: 'NK102',
          ects: 6,
          name: 'Μεθοδολογία και Ιστορία της Οικονομικής Σκέψης',
          kind: y,
        },
        { code: 'NK103', ects: 6, name: 'Μαθηματικά Οικονομικών Επιστημών Ι', kind: y },
        { code: 'NK104', ects: 6, name: 'Λογιστική Ι', kind: y },
        { code: 'NK105', ects: 6, name: 'Πληροφορική — Προγραμματισμός', kind: y },
      ],
    },
    {
      semester: 2,
      courses: [
        { code: 'NK201', ects: 6, name: 'Μακροοικονομική Θεωρία Ι', kind: y },
        { code: 'NK202', ects: 6, name: 'Διοίκηση Επιχειρήσεων Ι', kind: y },
        { code: 'NK203', ects: 6, name: 'Μαθηματικά Οικονομικών Επιστημών ΙΙ', kind: y },
        { code: 'NK204', ects: 6, name: 'Λογιστική ΙΙ', kind: y },
        { code: 'NK205', ects: 6, name: 'Μικροοικονομική Θεωρία ΙΙ', kind: y },
      ],
    },
    {
      semester: 3,
      courses: [
        { code: 'NK301', ects: 6, name: 'Μακροοικονομική Θεωρία ΙΙ', kind: y },
        { code: 'NK302', ects: 6, name: 'Στατιστική Ι', kind: y },
        { code: 'NK303', ects: 6, name: 'Διοίκηση Επιχειρήσεων ΙΙ', kind: y },
        { code: 'NK304', ects: 4, name: 'Κοστολόγηση και Αναλυτική Λογιστική', kind: y },
        { code: 'NK305', ects: 6, name: 'Χρηματοοικονομική Ανάλυση', kind: y },
      ],
    },
    {
      semester: 4,
      courses: [
        { code: 'NK401', ects: 6, name: 'Δημόσια Οικονομική', kind: y },
        { code: 'NK402', ects: 6, name: 'Μάρκετινγκ', kind: y },
        { code: 'NK403', ects: 6, name: 'Τραπεζική', kind: y },
        { code: 'NK404', ects: 6, name: 'Κλαδική Οικονομική', kind: y },
        {
          code: 'NK405',
          ects: 6,
          name: 'Διοίκηση Λειτουργιών και Διαχείριση Ποιότητας',
          kind: y,
        },
      ],
    },
    {
      semester: 5,
      courses: [
        { code: 'NK501', ects: 5, name: 'Διεθνής Οικονομική Ι', kind: ep },
        { code: 'NK502', ects: 5, name: 'Οικονομετρία Ι', kind: ep },
        {
          code: 'NK503',
          ects: 5,
          name: 'Οικονομική και Management των Μεταφορών και των Υποδομών',
          kind: ep,
        },
        { code: 'NK504', ects: 5, name: 'Διεθνής Πολιτική Οικονομία', kind: ep },
        {
          code: 'NK505',
          ects: 5,
          name: 'Χρηματοοικονομική Ανάλυση των Διεθνών Επιχειρήσεων',
          kind: ep,
        },
        {
          code: 'NK506',
          ects: 5,
          name: 'Εταιρική Κοινωνική Ευθύνη και Βιώσιμη Ανάπτυξη',
          kind: ep,
        },
        { code: 'NK507', ects: 5, name: 'Διαχείριση Ανθρώπινων Πόρων', kind: ep },
        {
          code: 'NE501',
          ects: 5,
          name: 'Διεθνής Οικονομική Ανάπτυξη: Θεσμοί και Πολιτικές',
          kind: ep,
        },
        { code: 'NE502', ects: 5, name: 'Οικονομική Πολιτική', kind: ep },
        {
          code: 'NE503',
          ects: 5,
          name: 'Ειδικά Θέματα Διαχείρισης Αλλαγής και Καινοτομίας',
          kind: ep,
        },
        { code: 'NE504', ects: 5, name: 'Οργανωσιακή Συμπεριφορά', kind: ep },
      ],
    },
    {
      semester: 6,
      courses: [
        { code: 'NK601', ects: 5, name: 'Διεθνής Οικονομική ΙΙ', kind: ep },
        { code: 'NK602', ects: 5, name: 'Οικονομετρία ΙΙ', kind: ep },
        { code: 'NK603', ects: 5, name: 'Επιχειρησιακή Έρευνα', kind: ep },
        { code: 'NK604', ects: 5, name: 'Διεθνείς Επιχειρηματικές Σχέσεις', kind: ep },
        { code: 'NK605', ects: 5, name: 'Οικονομική Δυναμική', kind: ep },
        { code: 'NK606', ects: 5, name: 'Επιχειρησιακή Στρατηγική', kind: ep },
        {
          code: 'NK607',
          ects: 5,
          name: 'Διοίκηση Εφοδιαστικής Αλυσίδας (Logistics)',
          kind: ep,
        },
        { code: 'NE601', ects: 5, name: 'Οικονομικά του Περιβάλλοντος', kind: ep },
        { code: 'NE602', ects: 5, name: 'Δυναμικά Συστήματα', kind: ep },
        { code: 'NE603', ects: 5, name: 'Οικονομικά της Εργασίας', kind: ep },
        { code: 'NE604', ects: 5, name: 'Διοικητική και Επιχειρηματική Ηθική', kind: ep },
      ],
    },
    {
      semester: 7,
      courses: [
        { code: 'NK701', ects: 5, name: 'Νομισματική Πολιτική', kind: ep },
        {
          code: 'NK702',
          ects: 5,
          name: 'Θεωρία Οικονομικών Διακυμάνσεων και Ευρωπαϊκή Οικονομία',
          kind: ep,
        },
        { code: 'NK703', ects: 5, name: 'Επιχειρηματικότητα Ι', kind: ep },
        {
          code: 'NK704',
          ects: 5,
          name: 'Διεθνείς Οικονομικές Σχέσεις και Οικονομική Διπλωματία',
          kind: ep,
        },
        {
          code: 'NK705',
          ects: 5,
          name: 'Συμπεριφορική και Πειραματική Οικονομική',
          kind: ep,
        },
        { code: 'NK706', ects: 5, name: 'Συμπεριφορά Καταναλωτή — Έρευνα Αγοράς', kind: ep },
        {
          code: 'NK707',
          ects: 5,
          name: 'Διαχείριση Ψηφιακής Πληροφορίας και Εφαρμογές Πληροφορικής',
          kind: ep,
        },
        { code: 'NE701', ects: 5, name: 'Αγορές Κεφαλαίου', kind: ep },
        { code: 'NE702', ects: 5, name: 'Οικονομικά της Ενέργειας', kind: ep },
        { code: 'NE703', ects: 5, name: 'Χρηματοοικονομικές Συγχωνεύσεις — Εξαγορές', kind: ep },
        { code: 'NE704', ects: 6, name: 'Διαχείριση Κινδύνων', kind: ep },
        { code: 'NE705', ects: 5, name: 'Δίκαιο των Επιχειρήσεων', kind: ep },
        { code: 'NE706', ects: 5, name: 'Διοίκηση Έργου', kind: ep },
        { code: 'NE803', ects: 5, name: 'Χρηματοοικονομικά Παράγωγα', kind: ep },
      ],
    },
    {
      semester: 8,
      courses: [
        {
          code: 'NK801',
          ects: 5,
          name: 'Ξένες Άμεσες Επενδύσεις & Πολυεθνικές Εταιρείες',
          kind: ep,
        },
        { code: 'NK802', ects: 5, name: 'Θεωρίες Οικονομικής Μεγέθυνσης', kind: ep },
        { code: 'NK803', ects: 5, name: 'Θεωρία Αποφάσεων', kind: ep },
        {
          code: 'NK804',
          ects: 5,
          name: 'Τεχνητή Νοημοσύνη στην Οικονομική Επιστήμη',
          kind: ep,
        },
        { code: 'NK805', ects: 5, name: 'Ασφαλιστική', kind: ep },
        { code: 'NK806', ects: 5, name: 'Επιχειρηματικότητα ΙΙ', kind: ep },
        { code: 'NK807', ects: 5, name: 'Ψηφιακό Μάρκετινγκ', kind: ep },
        { code: 'NE801', ects: 5, name: 'Περιφερειακή Οικονομική Ανάπτυξη', kind: ep },
        { code: 'NE802', ects: 5, name: 'Ειδικά Χρηματοοικονομικά Θέματα', kind: ep },
        { code: 'NE804', ects: 5, name: 'Εργασιακές Σχέσεις', kind: ep },
        {
          code: 'NE805',
          ects: 5,
          name: 'Εταιρική Διακυβέρνηση Επιχειρήσεων και Οργανισμών',
          kind: ep,
        },
        { code: 'NE806', ects: 5, name: 'Συστήματα Υποστήριξης Αποφάσεων', kind: ep },
      ],
    },
  ],
};
