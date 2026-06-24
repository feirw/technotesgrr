/** Πανεπιστήμιο Αιγαίου · Μηχανικών Σχεδίασης Προϊόντων και Συστημάτων (Σύρος) */
import type { CourseHours, SchoolCurriculum } from './schoolCurricula';

const h = (lecture: number, lab = 0): CourseHours => ({
  lecture,
  ...(lab ? { lab } : {}),
});

const y = 'Υποχρεωτικό (Υ)' as const;
const pr = 'Προπαρασκευαστικό (ΠΡ)' as const;
const ee = 'Ελεύθερης Επιλογής (ΕΕ)' as const;
const yek1 = 'Υποχρεωτικό-Επιλογής (ΥΕΚ1)' as const;
const yek2 = 'Υποχρεωτικό-Επιλογής (ΥΕΚ2)' as const;
const yek3 = 'Υποχρεωτικό-Επιλογής (ΥΕΚ3)' as const;

export const AEGEAN_SYROS_PRODUCT_DESIGN_CURRICULUM: SchoolCurriculum = {
  title: 'Μηχανικών Σχεδίασης Προϊόντων και Συστημάτων',
  subtitle: 'Πανεπιστήμιο Αιγαίου · Σύρος',
  hoursNote:
    'Ώρες/εβδομάδα: θεωρία + εργαστήριο (Ε). ' +
    'Μαθήματα με (*) εμπίπτουν στο γνωστικό αντικείμενο της Πληροφορικής. ' +
    '7ο–9ο εξ.: κατευθύνσεις ΥΕΚ1 (διαδραστικά/ψηφιακά), ΥΕΚ2 (βιομηχανικός σχεδιασμός), ΥΕΚ3 (συστήματα/υπηρεσίες).',
  semesters: [
    {
      semester: 1,
      courses: [
        { code: '1004', ects: 0, name: 'Αγγλικά – Προπαρασκευαστικό', kind: pr, hours: h(2) },
        { code: '1253', ects: 6, name: 'Ιστορία Design I', kind: y, hours: h(4) },
        { code: '1307', ects: 4, name: 'Στούντιο 1A – Σχέδιο Χρώμα', kind: y, hours: h(0, 6) },
        { code: '2155', ects: 6, name: 'Πληροφορική (*)', kind: y, hours: h(3, 2) },
        { code: '2204', ects: 6, name: 'Θεωρία και Μεθοδολογία Σχεδίασης', kind: y, hours: h(3, 2) },
        { code: '2454', ects: 2, name: 'Στούντιο 1Β – Ελεύθερο Σχέδιο', kind: y, hours: h(0, 2) },
        { code: '3056', ects: 6, name: 'Μαθηματικά Ι', kind: y, hours: h(4, 2) },
      ],
    },
    {
      semester: 2,
      courses: [
        { code: '2252', ects: 4, name: 'Ιστορία Design II', kind: y, hours: h(4) },
        { code: '2306', ects: 4, name: 'Στούντιο 2A – Σχέδιο Χρώμα', kind: y, hours: h(0, 6) },
        { code: '2354', ects: 2, name: 'Αγγλικά – Ορολογία', kind: y, hours: h(3) },
        { code: '3455', ects: 6, name: 'Μαθηματικά ΙΙ', kind: y, hours: h(4, 2) },
        { code: '3500', ects: 2, name: 'Στούντιο 2Β – Ελεύθερο Σχέδιο', kind: y, hours: h(0, 2) },
        { code: '4054', ects: 6, name: 'Συστημική Θεωρία και Πολυπλοκότητα στη Σχεδίαση', kind: y, hours: h(3) },
        { code: '4203', ects: 6, name: 'Τεχνολογίες και Μεθοδολογίες Προγραμματισμού (*)', kind: y, hours: h(3, 2) },
      ],
    },
    {
      semester: 3,
      courses: [
        { code: '1403', ects: 6, name: 'Φυσική για Μηχανικούς', kind: y, hours: h(4) },
        { code: '2404', ects: 6, name: 'Εισαγωγή στη Σχεδίαση με Η/Υ (CAGD) (*)', kind: y, hours: h(3, 2) },
        { code: '3254', ects: 6, name: 'Στούντιο 3 – Ιδεασμός', kind: y, hours: h(0, 6) },
        { code: '5003', ects: 6, name: 'Σχεδίαση και Ανάπτυξη Πληροφοριακών Συστημάτων (*)', kind: y, hours: h(3, 2) },
        { code: '6356', ects: 6, name: 'Marketing', kind: y, hours: h(3) },
      ],
    },
    {
      semester: 4,
      courses: [
        { code: '4304', ects: 6, name: 'Στούντιο 4 – Concept Design', kind: y, hours: h(0, 6) },
        { code: '5154', ects: 6, name: 'Σχεδίαση με Η/Υ (*)', kind: y, hours: h(2, 2) },
        { code: '6105', ects: 6, name: 'Αλληλεπίδραση Ανθρώπου Υπολογιστή (*)', kind: y, hours: h(2, 2) },
        { code: '7259', ects: 6, name: 'Θεωρία Πολύπλοκων Οργανώσεων', kind: y, hours: h(3) },
        { code: '8154', ects: 6, name: 'Γνωστική Επιστήμη', kind: y, hours: h(4) },
      ],
    },
    {
      semester: 5,
      courses: [
        { code: '3406', ects: 6, name: 'Τεχνική Μηχανική', kind: y, hours: h(2, 2) },
        { code: '4503', ects: 6, name: 'Τεχνικό Σχέδιο', kind: y, hours: h(2, 2) },
        { code: '5303', ects: 6, name: 'Στούντιο 5 – Product Design I', kind: y, hours: h(0, 6) },
        { code: '7204', ects: 6, name: 'Εργονομία', kind: y, hours: h(4) },
        { code: '11000', ects: 6, name: 'Συστημικές Μεθοδολογίες Σχεδίασης', kind: y, hours: h(2, 2) },
      ],
    },
    {
      semester: 6,
      courses: [
        { code: '4153', ects: 6, name: 'Διαδραστική Σχεδίαση (*)', kind: y, hours: h(3, 2) },
        { code: '4356', ects: 6, name: 'Υλικά', kind: y, hours: h(3, 2) },
        { code: '6303', ects: 6, name: 'Στούντιο 6 – Product Design II', kind: y, hours: h(0, 6) },
        { code: '8454', ects: 6, name: 'Ανάλυση Προϊόντων με Η/Υ (CAE)', kind: y, hours: h(2, 2) },
        { code: '9906', ects: 6, name: 'Οικοδόμηση και Διοίκηση Μαρκών', kind: y, hours: h(3) },
      ],
    },
    {
      semester: 7,
      courses: [
        { code: '3304', ects: 2, name: 'Αγγλικά για Ειδικούς Σκοπούς', kind: y, hours: h(3) },
        { code: '5204', ects: 5, name: 'Μηχανική και Υλικά στον Σχεδιασμό', kind: yek2, hours: h(2, 2) },
        { code: '6205', ects: 5, name: 'Σχεδίαση Υπηρεσιών', kind: yek3, hours: h(2, 2) },
        { code: '8254', ects: 5, name: 'Ρομποτική Ι: Εισαγωγή στη Ρομποτική (*)', kind: yek2, hours: h(2, 2) },
        { code: '8606', ects: 4, name: 'Βάσεις Δεδομένων και Εξόρυξη Γνώσης (*)', kind: ee, hours: h(3, 3) },
        { code: '8903', ects: 15, name: 'Πρακτική Άσκηση', kind: 'Πρακτική Άσκηση', hours: h(1) },
        { code: '9305', ects: 5, name: 'Συμπεριφορά Καταναλωτή', kind: yek3, hours: h(3) },
        { code: '9354', ects: 5, name: 'Μηχανοτρονική Ι: Συστήματα Ελέγχου', kind: yek2, hours: h(2, 2) },
        { code: '9804', ects: 5, name: 'Ειδικά Θέματα Αλληλεπίδρασης Ανθρώπου – Υπολογιστή (*)', kind: yek1, hours: h(2, 2) },
        { code: '9855', ects: 5, name: 'Ψηφιακά Παιχνίδια και Παιγνιώδης Μάθηση', kind: yek1, hours: h(2, 2) },
        { code: '10700', ects: 5, name: 'Πρωτοτυποποίηση Διαδραστικών Συστημάτων (*)', kind: yek1, hours: h(2, 2) },
        { code: '10750', ects: 5, name: 'Σχεδίαση Βιώσιμων & Ανθεκτικών Συστημάτων', kind: yek3, hours: h(3) },
      ],
    },
    {
      semester: 8,
      courses: [
        { code: '3353', ects: 4, name: 'Διακριτά Μαθηματικά', kind: ee, hours: h(3) },
        { code: '4011', ects: 2, name: 'Ακαδημαϊκά Αγγλικά 1', kind: ee, hours: h(2) },
        { code: '5053', ects: 4, name: 'Ιστορία Τέχνης Ι', kind: ee, hours: h(3) },
        { code: '6155', ects: 5, name: 'Γραφικά (*)', kind: yek2, hours: h(2, 2) },
        { code: '6404', ects: 5, name: 'Σχεδίαση και Προγραμματισμός για τον Παγκόσμιο Ιστό (*)', kind: yek1, hours: h(2, 2) },
        { code: '7056', ects: 4, name: 'Ειδικά θέματα προγραμματισμού & αλγορίθμων (*)', kind: ee, hours: h(3) },
        { code: '7355', ects: 4, name: 'Ειδικά Θέματα Υλικών', kind: ee, hours: h(3) },
        { code: '7554', ects: 5, name: 'Ψηφιακές Μορφές Αφήγησης', kind: yek1, hours: h(2, 2) },
        { code: '7901', ects: 4, name: 'Ψηφιακή Πολιτιστική Κληρονομιά (*)', kind: ee, hours: h(3) },
        { code: '8056', ects: 5, name: 'Σχεδίαση και Προγραμματισμός Εφαρμογών για Φορητές Συσκευές', kind: yek1, hours: h(2, 2) },
        { code: '8205', ects: 4, name: 'Παραστατική Κινηματογραφία (Animation) (*)', kind: ee, hours: h(3) },
        { code: '8857', ects: 5, name: 'Σχεδιασμός και Ανάλυση Μηχανισμών', kind: yek2, hours: h(2, 2) },
        { code: '8903', ects: 15, name: 'Πρακτική Άσκηση', kind: 'Πρακτική Άσκηση', hours: h(1) },
        { code: '9255', ects: 4, name: 'Υλικά, Τεχνικές και Μέσα Παρουσίασης', kind: ee, hours: h(3, 3) },
        { code: '9454', ects: 5, name: 'Συστήματα Υποστήριξης Αποφάσεων & Πολυπλοκότητα', kind: yek3, hours: h(3) },
        { code: '9503', ects: 5, name: 'Σχεδίαση και Τεχνολογίες Παραγωγής', kind: yek2, hours: h(2, 2) },
        { code: '9555', ects: 5, name: 'Εικονική Πραγματικότητα (*)', kind: yek1, hours: h(2, 2) },
        { code: '10153', ects: 5, name: 'Σχεδίαση για προσθετική κατασκευή προϊόντων (*)', kind: yek2, hours: h(2, 2) },
        { code: '10303', ects: 5, name: 'Λειτουργικός Ιδεασμός & Αισθητική στη Συστημική Σχεδίαση', kind: yek3, hours: h(3) },
        { code: '10450', ects: 2, name: 'Σεμινάρια για την Σχεδίαση και την Έρευνα', kind: ee, hours: h(2) },
        { code: '10500', ects: 4, name: 'Ποσοτικές Μέθοδοι', kind: ee, hours: h(3) },
        { code: '10600', ects: 4, name: 'Μηχανοτρονική ΙΙ', kind: ee, hours: h(3) },
        { code: '10650', ects: 4, name: 'Ρομποτική ΙΙ: Πλοήγηση Αυτόνομων Ρομποτικών Συστημάτων (*)', kind: ee, hours: h(3) },
        { code: '10800', ects: 5, name: 'Σχεδίαση Συστημάτων Υποδομών', kind: yek3, hours: h(3) },
        { code: '10850', ects: 5, name: 'Σχεδίαση Κοινωνικοτεχνικών Αστικών Συστημάτων', kind: yek3, hours: h(3) },
      ],
    },
    {
      semester: 9,
      courses: [
        { code: '6054', ects: 4, name: 'Ιστορία Τέχνης ΙΙ', kind: ee, hours: h(3) },
        { code: '7313', ects: 8, name: 'Στούντιο 7α – Σχεδίαση Διαδραστικών Συστημάτων (*)', kind: yek1, hours: h(0, 6) },
        { code: '7323', ects: 8, name: 'Στούντιο 7β – Λεπτομερής Βιομηχανικός Σχεδιασμός', kind: yek2, hours: h(0, 6) },
        { code: '7334', ects: 8, name: 'Στούντιο 7γ – Συστημική Σχεδίαση & Υπηρεσίες', kind: yek3, hours: h(0, 6) },
        { code: '7404', ects: 4, name: 'Γραφιστική', kind: ee, hours: h(3) },
        { code: '8015', ects: 4, name: 'Επιχειρηματικότητα', kind: ee, hours: h(2, 2) },
        { code: '8553', ects: 4, name: 'Τεχνητή Νοημοσύνη', kind: ee, hours: h(3) },
        { code: '8754', ects: 4, name: 'Σχεδίαση Οχημάτων & Νέες Τεχνολογίες Υποστήριξης Οδηγού', kind: ee, hours: h(3) },
        { code: '8952', ects: 0, name: 'Πρακτική Άσκηση (συνεχιζόμενη)', kind: ee },
        { code: '9103', ects: 4, name: 'Νομικά στο Design', kind: ee, hours: h(3) },
        { code: '9606', ects: 4, name: 'Πληροφορική Κινηματογραφία (Computer Animation)', kind: ee, hours: h(3, 3) },
        { code: '10550', ects: 4, name: 'Σχεδίαση Ιατρικών Προϊόντων και Συστημάτων', kind: ee, hours: h(3) },
        { code: '10950', ects: 4, name: 'Ταχεία Πρωτοτυποποίηση & Εφαρμογές στη Βιομηχανική Σχεδίαση', kind: ee, hours: h(1, 2) },
      ],
    },
    {
      semester: 10,
      courses: [
        { code: '10200', ects: 2, name: 'Ακαδημαϊκά Αγγλικά ΙΙ', kind: ee, hours: h(2) },
        { code: '10903', ects: 30, name: 'Διπλωματική', kind: 'Διπλωματική Εργασία' },
      ],
    },
  ],
};
