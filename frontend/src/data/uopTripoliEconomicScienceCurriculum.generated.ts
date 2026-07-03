/** Πανεπιστήμιο Πελοποννήσου · Οικονομικών Επιστημών (Τρίπολη) */
import type { SchoolCurriculum } from './schoolCurricula';

const y = 'Υποχρεωτικό' as const;
const ep = 'Επιλογής' as const;
const dPOL = 'Υποχρεωτικό κατεύθυνσης · Οικονομική Πολιτική και Ανάπτυξη' as const;
const dFIN = 'Υποχρεωτικό κατεύθυνσης · Χρηματοοικονομική και Επενδύσεις' as const;
const dBUS =
  'Υποχρεωτικό κατεύθυνσης · Οικονομικά των Επιχειρήσεων και των Αγορών' as const;
const thesis = 'Πτυχιακή Εργασία' as const;

export const UOP_TRIPOLI_ECONOMIC_SCIENCE_CURRICULUM: SchoolCurriculum = {
  title: 'Οικονομικών Επιστημών',
  subtitle:
    'Πανεπιστήμιο Πελοποννήσου · Τρίπολη · 3 κατευθύνσεις (Ε\'–Η\'): Οικονομική Πολιτική και Ανάπτυξη · Χρηματοοικονομική και Επενδύσεις · Οικονομικά των Επιχειρήσεων και των Αγορών',
  externalCoursesUrl: 'https://es.uop.gr/courses',
  semesters: [
    {
      semester: 1,
      courses: [
        { code: 'ECO11A', ects: 6, name: 'Εισαγωγή στην Οικονομική Επιστήμη Ι', kind: y },
        { code: 'ECO12A', ects: 6, name: 'Εφαρμοσμένα Μαθηματικά για Οικονομολόγους Ι', kind: y },
        { code: 'ECO14A', ects: 5, name: 'Λογιστική Ι', kind: y },
        {
          code: 'ECO15',
          ects: 5,
          name: 'Εισαγωγή στην Πληροφορική και τις Διαδικτυακές Εφαρμογές',
          kind: y,
        },
        { code: 'ECO16A', ects: 3, name: 'Αγγλική Ορολογία Οικονομικών Ι', kind: y },
        { code: 'ECO23', ects: 5, name: 'Μεθοδολογία Οικονομικής Επιστήμης', kind: y },
      ],
    },
    {
      semester: 2,
      courses: [
        { code: 'ECO26B', ects: 3, name: 'Αγγλική Ορολογία Οικονομικών ΙΙ', kind: y },
        { code: 'ECO13', ects: 5, name: 'Οικονομική Ιστορία', kind: y },
        { code: 'ECO21B', ects: 6, name: 'Εισαγωγή στην Οικονομική Επιστήμη ΙΙ', kind: y },
        { code: 'ECO22B', ects: 6, name: 'Εφαρμοσμένα Μαθηματικά για Οικονομολόγους ΙΙ', kind: y },
        { code: 'ECO24B', ects: 5, name: 'Λογιστική ΙΙ', kind: y },
        {
          code: 'ECO25',
          ects: 5,
          name: 'Εισαγωγή στις Βάσεις Δεδομένων και στον Προγραμματισμό',
          kind: y,
        },
      ],
    },
    {
      semester: 3,
      courses: [
        { code: 'ECO31A', ects: 6, name: 'Μικροοικονομική Θεωρία Ι', kind: y },
        { code: 'ECO32A', ects: 6, name: 'Μακροοικονομική Θεωρία Ι', kind: y },
        { code: 'ECO33A', ects: 6, name: 'Στατιστική Ι', kind: y },
        { code: 'ECO34A', ects: 6, name: 'Χρηματοοικονομική των Επιχειρήσεων Ι', kind: y },
        { code: 'ECO35C', ects: 3, name: 'Αγγλική Ορολογία Οικονομικών ΙΙΙ', kind: y },
        { code: 'OPT31', ects: 3, name: 'Διοίκηση Επιχειρήσεων', kind: ep },
        { code: 'OPT32', ects: 3, name: 'Ελληνικά και Διεθνή Λογιστικά Πρότυπα', kind: ep },
        { code: 'OPT33', ects: 3, name: 'Κοινές Πολιτικές της ΕΕ', kind: ep },
        {
          code: 'OPT34',
          ects: 3,
          name: 'Θεωρία Λήψης Αποφάσεων και Πληροφοριακά Συστήματα Διοίκησης',
          kind: ep,
        },
        { code: 'OPT35', ects: 3, name: 'Παιδαγωγική στην Οικονομική Επιστήμη', kind: ep },
        { code: 'OPT44', ects: 3, name: 'Οικονομική Γεωγραφία και Γεωοικονομία', kind: ep },
      ],
    },
    {
      semester: 4,
      courses: [
        { code: 'ECO44B', ects: 6, name: 'Χρηματοοικονομική των Επιχειρήσεων ΙΙ', kind: y },
        { code: 'ECO41B', ects: 6, name: 'Μικροοικονομική Θεωρία ΙΙ', kind: y },
        { code: 'ECO42B', ects: 6, name: 'Μακροοικονομική Θεωρία ΙΙ', kind: y },
        { code: 'ECO43B', ects: 6, name: 'Στατιστική ΙΙ', kind: y },
        {
          code: 'OPT41',
          ects: 3,
          name: 'Αγγλική Ορολογία Οικονομικών και Ακαδημαϊκές Δεξιότητες',
          kind: ep,
        },
        { code: 'OPT42', ects: 3, name: 'Γενική Παιδεία', kind: ep },
        { code: 'OPT43', ects: 3, name: 'Μάρκετινγκ', kind: ep },
        { code: 'OPT45', ects: 3, name: 'Εφαρμογές Ψηφιακής Οικονομίας', kind: ep },
        { code: 'OPT46', ects: 3, name: 'Μεθοδολογία Επιστημονικής Έρευνας', kind: ep },
        {
          code: 'OPT47',
          ects: 3,
          name: 'Ευρωπαϊκή Επιχειρηματικότητα και Ευρωπαϊκές Επιχειρήσεις (Jean Monnet Module)',
          kind: ep,
        },
      ],
    },
    {
      semester: 5,
      courses: [
        { code: 'ECO51A', ects: 6, name: 'Οικονομετρία Ι', kind: y },
        {
          code: 'OPT51',
          ects: 6,
          name: 'Οικονομικά του Περιβάλλοντος και των Φυσικών Πόρων',
          kind: ep,
        },
        { code: 'OPT52', ects: 6, name: 'Οικονομική Ολοκλήρωση', kind: ep },
        { code: 'OPT53', ects: 6, name: 'Οικονομικά της Υγείας', kind: ep },
        {
          code: 'OPT54',
          ects: 6,
          name: 'Ηλεκτρονική Διακυβέρνηση και Ηλεκτρονικές Υπηρεσίες',
          kind: ep,
        },
        { code: 'OPT55', ects: 6, name: 'Οικονομική Διακυβέρνηση της ΕΕ', kind: ep },
        {
          code: 'POL51',
          ects: 6,
          name: 'Θεωρίες Οικονομικής Ανάπτυξης & Μεγέθυνσης',
          kind: dPOL,
        },
        { code: 'POL52', ects: 6, name: 'Δημόσια Οικονομικά', kind: dPOL },
        { code: 'FIN52', ects: 6, name: 'Τραπεζική Οικονομική', kind: dFIN },
        { code: 'FIN61', ects: 6, name: 'Υπολογιστικά Χρηματοοικονομικά', kind: dFIN },
        { code: 'BUS51', ects: 6, name: 'Βιομηχανική Οργάνωση Ι', kind: dBUS },
        {
          code: 'BUS52',
          ects: 6,
          name: 'Οικονομικά της Καινοτομίας & Τεχνολογίας',
          kind: dBUS,
        },
      ],
    },
    {
      semester: 6,
      courses: [
        { code: 'ECO62B', ects: 6, name: 'Οικονομετρία ΙΙ', kind: y },
        { code: 'OPT63', ects: 6, name: 'Οικονομική των Μεταφορών', kind: ep },
        { code: 'OPT64', ects: 6, name: 'Διοίκηση Έργων', kind: ep },
        { code: 'OPT65', ects: 6, name: 'Ειδικά Θέματα Βιομηχανικής Οργάνωσης', kind: ep },
        {
          code: 'OPT83',
          ects: 6,
          name: 'Τρέχουσες Εξελίξεις στην Ελληνική και Διεθνή Οικονομία',
          kind: ep,
        },
        { code: 'OPT62', ects: 6, name: 'Αειφόρος Ανάπτυξη', kind: ep },
        {
          code: 'OPT61',
          ects: 6,
          name: 'Οικονομική Ανάλυση και Πολιτική των Θεσμών',
          kind: dPOL,
        },
        { code: 'POL61', ects: 6, name: 'Διεθνής Οικονομική Θεωρία', kind: dPOL },
        { code: 'POL62', ects: 6, name: 'Νομισματική Θεωρία και Πολιτική', kind: dPOL },
        { code: 'FIN51', ects: 6, name: 'Αγορές Χρήματος και Κεφαλαίου', kind: dFIN },
        { code: 'FIN62', ects: 6, name: 'Αξιολόγηση Επενδύσεων', kind: dFIN },
        { code: 'BUS61', ects: 6, name: 'Οικονομική των Επιχειρήσεων', kind: dBUS },
        { code: 'BUS62', ects: 6, name: 'Θεωρία Παιγνίων', kind: dBUS },
      ],
    },
    {
      semester: 7,
      courses: [
        { code: 'OPT71', ects: 6, name: 'Οικονομικά της Άμυνας', kind: ep },
        { code: 'OPT72', ects: 6, name: 'Αγροτικά Οικονομικά', kind: ep },
        { code: 'OPT73', ects: 6, name: 'Φορολογία και Φορολογική Πολιτική', kind: ep },
        { code: 'OPT74', ects: 6, name: 'Επιχειρηματική Ηθική', kind: ep },
        {
          code: 'OPT76',
          ects: 6,
          name: 'Χρηματοοικονομικά Παράγωγα και Προϊόντα Σταθερού Εισοδήματος',
          kind: ep,
        },
        { code: 'OPT77', ects: 6, name: 'Οικονομική Ψυχολογία', kind: ep },
        { code: 'OPT78', ects: 6, name: 'Οικονομικά της Εκπαίδευσης', kind: ep },
        {
          code: 'OPT75',
          ects: 6,
          name: 'Λήψη Επιχειρηματικών Αποφάσεων με Πολυκριτηριακές Μεθόδους',
          kind: ep,
        },
        {
          code: 'POL71',
          ects: 6,
          name: 'Ειδικά Θέματα Μικροοικονομικής Θεωρίας',
          kind: dPOL,
        },
        { code: 'POL72', ects: 6, name: 'Περιφερειακή και Αστική Οικονομική', kind: dPOL },
        { code: 'FIN71', ects: 6, name: 'Διαχείριση Τραπεζικών Κινδύνων', kind: dFIN },
        { code: 'FIN72', ects: 6, name: 'Χρηματοοικονομικά της Ενέργειας', kind: dFIN },
        {
          code: 'BUS71',
          ects: 6,
          name: 'Οικονομικά της Επιχειρησιακής Στρατηγικής',
          kind: dBUS,
        },
        {
          code: 'BUS72A',
          ects: 6,
          name: 'Επιχειρηματικότητα Ι: Θεωρία, Έννοια και Ρόλος',
          kind: dBUS,
        },
      ],
    },
    {
      semester: 8,
      courses: [
        { code: 'OPT82', ects: 6, name: 'Κοινωνική και Αλληλέγγυα Οικονομία', kind: ep },
        { code: 'OPT84', ects: 6, name: 'Θεωρία Ηγεσίας', kind: ep },
        { code: 'OPT85', ects: 6, name: 'Χρονολογικές Σειρές', kind: ep },
        {
          code: 'OPT88',
          ects: 6,
          name: 'Οικονομικά και Διοίκηση Ανθρώπινων Πόρων',
          kind: ep,
        },
        {
          code: 'OPT81',
          ects: 6,
          name: 'Εφαρμογές Πληροφορικής στην Οικονομική Διαχείριση Μονάδων Υγείας',
          kind: ep,
        },
        { code: 'OPT86', ects: 6, name: 'Πτυχιακή Εργασία', kind: thesis },
        { code: 'POL81', ects: 6, name: 'Οικονομικά της Εργασίας', kind: dPOL },
        { code: 'POL82', ects: 6, name: 'Διεθνές Εμπόριο', kind: dPOL },
        {
          code: 'FIN81',
          ects: 6,
          name: 'Εφαρμογές στη Χρηματοοικονομική Οικονομετρία',
          kind: dFIN,
        },
        { code: 'FIN82', ects: 6, name: 'Διαχείριση Επενδύσεων', kind: dFIN },
        { code: 'BUS81', ects: 6, name: 'Συμπεριφορικά Οικονομικά', kind: dBUS },
        {
          code: 'BUS82B',
          ects: 6,
          name: 'Επιχειρηματικότητα ΙΙ: Επιχειρηματική Ιδέα και Υλοποίηση',
          kind: dBUS,
        },
      ],
    },
  ],
};
