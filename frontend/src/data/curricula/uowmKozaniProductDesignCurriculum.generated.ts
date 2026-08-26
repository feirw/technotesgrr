/** Πανεπιστήμιο Δυτικής Μακεδονίας · Μηχανικών Σχεδίασης Προϊόντων και Συστημάτων (Κοζάνη) */
import type { CourseHours, SchoolCurriculum } from './schoolCurricula';

const h = (lecture: number, lab = 0): CourseHours => ({
  lecture,
  ...(lab ? { lab } : {}),
});

const y = 'Υποχρεωτικό (Υ)' as const;
const ee = 'Ελεύθερης Επιλογής (ΕΕ)' as const;
const yek1 = 'Υποχρεωτικό-Επιλογής (ΥΕΚ1)' as const;
const yek2 = 'Υποχρεωτικό-Επιλογής (ΥΕΚ2)' as const;
const yek3 = 'Υποχρεωτικό-Επιλογής (ΥΕΚ3)' as const;

export const UOWM_KOZANI_PRODUCT_DESIGN_CURRICULUM: SchoolCurriculum = {
  title: 'Μηχανικών Σχεδίασης Προϊόντων και Συστημάτων',
  subtitle: 'Πανεπιστήμιο Δυτικής Μακεδονίας · Κοζάνη',
  hoursNote:
    'Πρόγραμμα σπουδών 2025–2026. Ώρες/εβδομάδα: θεωρία + εργαστήριο (Ε). ' +
    '7ο–9ο εξ.: κατευθύνσεις ΥΕΚ1 (ψηφιακά/διαδραστικά), ΥΕΚ2 (βιομηχανικός σχεδιασμός), ΥΕΚ3 (συστήματα/διοίκηση).',
  semesters: [
    {
      semester: 1,
      courses: [
        { code: '1201', ects: 6, name: 'Ιστορία Design', kind: y, hours: h(3) },
        { code: '1202', ects: 6, name: 'Στούντιο 1 – Γραμμικό Σχέδιο', kind: y, hours: h(0, 4) },
        { code: '1101', ects: 6, name: 'Πληροφορική', kind: y, hours: h(2, 2) },
        { code: '1203', ects: 6, name: 'Θεωρία και Μεθοδολογία Σχεδίασης', kind: y, hours: h(3) },
        { code: '1001', ects: 6, name: 'Μαθηματικά Ι', kind: y, hours: h(3) },
      ],
    },
    {
      semester: 2,
      courses: [
        { code: '1204', ects: 6, name: 'Στούντιο 2 – Ελεύθερο Σχέδιο – Χρώμα', kind: y, hours: h(0, 4) },
        { code: '1002', ects: 2, name: 'Αγγλικά – Ορολογία', kind: y, hours: h(3) },
        { code: '1003', ects: 6, name: 'Μαθηματικά ΙΙ', kind: y, hours: h(3) },
        { code: '1102', ects: 6, name: 'Τεχνολογίες και Μεθοδολογίες Προγραμματισμού', kind: y, hours: h(2, 2) },
        { code: '1004', ects: 6, name: 'Εισαγωγή στην Επιστήμη των Υλικών', kind: y, hours: h(3) },
        { code: '1205', ects: 4, name: 'Εργονομία', kind: y, hours: h(3) },
      ],
    },
    {
      semester: 3,
      courses: [
        { code: '2201', ects: 6, name: 'Εισαγωγή στη Σχεδίαση με Η/Υ (CAGD)', kind: y, hours: h(3) },
        { code: '2202', ects: 6, name: 'Στούντιο 3 – Ιδεασμός', kind: y, hours: h(2, 2) },
        { code: '2301', ects: 6, name: 'Οργάνωση και Διοίκηση Επιχειρήσεων', kind: y, hours: h(3) },
        { code: '2001', ects: 6, name: 'Πιθανότητες – Στατιστική', kind: y, hours: h(3) },
        { code: '2101', ects: 6, name: 'Αλγόριθμοι και Δομές Δεδομένων', kind: y, hours: h(3) },
      ],
    },
    {
      semester: 4,
      courses: [
        { code: '2203', ects: 6, name: 'Στούντιο 4 – Concept Design', kind: y, hours: h(2, 2) },
        { code: '2002', ects: 6, name: 'Τεχνολογία Υλικών', kind: y, hours: h(3) },
        { code: '2204', ects: 6, name: 'Σχεδίαση με Η/Υ', kind: y, hours: h(3) },
        { code: '2205', ects: 6, name: 'Αλληλεπίδραση Ανθρώπου Υπολογιστή', kind: y, hours: h(3) },
        { code: '2302', ects: 6, name: 'Οργάνωση Παραγωγής', kind: y, hours: h(3) },
      ],
    },
    {
      semester: 5,
      courses: [
        { code: '3001', ects: 6, name: 'Τεχνική Μηχανική', kind: y, hours: h(3) },
        { code: '3201', ects: 6, name: 'Στούντιο 5 – Product Design I', kind: y, hours: h(2, 2) },
        { code: '3301', ects: 6, name: 'Επιχειρησιακή Έρευνα', kind: y, hours: h(3) },
        { code: '3101', ects: 6, name: 'Σχεδίαση και Ανάπτυξη Πληροφοριακών Συστημάτων', kind: y, hours: h(3) },
        { code: '3302', ects: 6, name: 'Αρχές Marketing', kind: y, hours: h(3) },
      ],
    },
    {
      semester: 6,
      courses: [
        { code: '3202', ects: 6, name: 'Διαδραστική Σχεδίαση', kind: y, hours: h(3) },
        { code: '3203', ects: 6, name: 'Στούντιο 6 – Product Design II', kind: y, hours: h(2, 2) },
        { code: '3303', ects: 6, name: 'Ολοκληρωμένα Συστήματα Παραγωγής – CIM', kind: y, hours: h(3) },
        { code: '3204', ects: 6, name: 'Ανάλυση & Κατασκευή Προϊόντων με Η/Υ (CAE/CAM)', kind: y, hours: h(3) },
        { code: '3102', ects: 6, name: 'Γραφικά Υπολογιστών', kind: y, hours: h(3) },
      ],
    },
    {
      semester: 7,
      courses: [
        { code: '4003', ects: 6, name: 'Στοιχεία Μηχανών', kind: y, hours: h(3) },
        { code: '4004', ects: 6, name: 'Μεθοδολογία Έρευνας', kind: y, hours: h(3) },
        { code: '4101', ects: 6, name: 'Προηγμένες Τεχνολογίες Αλληλεπίδρασης και Εφαρμογές', kind: yek1, hours: h(3) },
        { code: '4102', ects: 6, name: 'Επεξεργασία Εικόνας', kind: yek1, hours: h(3) },
        { code: '4103', ects: 6, name: 'Συστήματα Ασαφούς Λογικής', kind: yek1, hours: h(3) },
        { code: '4201', ects: 6, name: 'Υπολογιστικός Σχεδιασμός και Βιομιμητική στο Σχεδιασμό Προϊόντων', kind: yek2, hours: h(3) },
        { code: '4202', ects: 6, name: 'Αειφόρος Σχεδίαση και Κυκλική Οικονομία', kind: yek2, hours: h(3) },
        { code: '4203', ects: 6, name: 'Σχεδίαση/Οργάνωση Εκθέσεων και Εσωτερική Διακόσμηση', kind: yek2, hours: h(0, 3) },
        { code: '4205', ects: 6, name: 'Ειδικά Θέματα στη Σχεδίαση με Η/Υ', kind: yek2, hours: h(3) },
        { code: '4301', ects: 6, name: 'Αρχές Μηχατρονικής', kind: yek3, hours: h(3) },
        { code: '4303', ects: 6, name: 'Ειδικά Θέματα Υλικών', kind: yek3, hours: h(3) },
        { code: '4311', ects: 6, name: 'Συμπεριφορά Καταναλωτή και Έρευνα Αγοράς', kind: yek3, hours: h(3) },
        { code: '4312', ects: 6, name: 'Περιβαλλοντική Εκπαίδευση', kind: yek3, hours: h(3) },
        { code: '5201', ects: 6, name: 'Κατασκευαστική Τέχνης (Craft) και Τέχνη του Δρόμου (Street Art)', kind: ee, hours: h(0, 3) },
        { code: '5001', ects: 6, name: 'Σχεδιασμός Προηγμένων Υλικών για Ενεργειακές και Περιβαλλοντικές Εφαρμογές', kind: ee, hours: h(3, 3) },
        { code: '5101', ects: 6, name: 'Σχεδίαση και Προγραμματισμός για τον Παγκόσμιο Ιστό', kind: ee, hours: h(3) },
        { code: '5309', ects: 6, name: 'Επιχειρηματικότητα και Καινοτομία', kind: ee, hours: h(3) },
        { code: '5401', ects: 6, name: 'Εισαγωγή στη Μακροοικονομική Θεωρία', kind: ee, hours: h(3) },
      ],
    },
    {
      semester: 8,
      courses: [
        { code: '4104', ects: 6, name: 'K1 – Σχεδίαση και Προγραμματισμός Εφαρμογών για Φορητές Συσκευές', kind: yek1, hours: h(3) },
        { code: '4105', ects: 6, name: 'K1 – Εικονική και Επαυξημένη Πραγματικότητα', kind: yek1, hours: h(3) },
        { code: '4106', ects: 6, name: 'K1 – Τεχνητή Νοημοσύνη', kind: yek1, hours: h(3) },
        { code: '4204', ects: 6, name: 'K2 – Μηχανική και Υλικά στον Σχεδιασμό', kind: yek2, hours: h(3) },
        { code: '4206', ects: 6, name: 'K2 – Σχεδιασμός Συσκευασιών', kind: yek2, hours: h(3) },
        { code: '4207', ects: 6, name: 'K2 – Ειδικά Θέματα Προσομοίωσης Σχεδιασμού και Κατασκευαστικής', kind: yek2, hours: h(3) },
        { code: '4210', ects: 6, name: 'K2 – Πρωτοτυποποίηση για Μηχανικούς Σχεδίασης', kind: yek2, hours: h(0, 3) },
        { code: '4212', ects: 6, name: 'K2 – Η Διδακτική της Ρομποτικής, των STEAM και των Νέων Τεχνολογιών', kind: yek2, hours: h(3) },
        { code: '4211', ects: 6, name: 'K2 – Σχεδιασμός Φορετών Προϊόντων (Wearables)', kind: yek2, hours: h(0, 3) },
        { code: '4306', ects: 6, name: 'K3 – Διαχείριση Εφοδιαστικής Αλυσίδας', kind: yek3, hours: h(3) },
        { code: '4302', ects: 6, name: 'K3 – Συντήρηση και Αξιοπιστία Συστημάτων', kind: yek3, hours: h(3) },
        { code: '4309', ects: 6, name: 'K3 – Σχεδιασμός Υπηρεσιών', kind: yek3, hours: h(3) },
        { code: '5202', ects: 6, name: 'Παραστατική Κινηματογραφία (Animation)', kind: ee, hours: h(0, 3) },
        { code: '5203', ects: 6, name: 'Ρομποτική και Ψηφιακή Κατασκευαστική', kind: ee, hours: h(3) },
        { code: '5302', ects: 6, name: 'Σχεδίαση για Όλους', kind: ee, hours: h(3) },
        { code: '5303', ects: 6, name: 'Πολυπλοκότητα Σχεδιαστικών Διεργασιών', kind: ee, hours: h(3) },
        { code: '5304', ects: 6, name: 'Σχεδίαση Πληροφορίας', kind: ee, hours: h(3) },
        { code: '5305', ects: 6, name: 'Ειδικά Θέματα Μηχατρονικής', kind: ee, hours: h(3) },
        { code: '5307', ects: 6, name: 'Οικοδόμηση και Διοίκηση Μαρκών', kind: ee, hours: h(3) },
        { code: '5209', ects: 6, name: 'Σύγχρονος Αρχιτεκτονικός Σχεδιασμός', kind: ee, hours: h(3) },
        { code: '5402', ects: 6, name: 'Μικροοικονομική Ανάλυση', kind: ee, hours: h(3) },
      ],
    },
    {
      semester: 9,
      courses: [
        { code: '4107', ects: 6, name: 'K1 – Project στο Σχεδιασμό Διαδραστικών Συστημάτων', kind: yek1, hours: h(0, 4) },
        { code: '4108', ects: 6, name: 'K1 – Computer Vision', kind: yek1, hours: h(3) },
        { code: '4109', ects: 6, name: 'K1 – Μηχανική Μάθηση', kind: yek1, hours: h(3) },
        { code: '4208', ects: 6, name: 'K2 – Project στο Σχεδιασμό και στην Κατασκευαστική Προϊόντων', kind: yek2, hours: h(0, 4) },
        { code: '4209', ects: 6, name: 'Σχεδιασμός Επίπλου και Ξύλινων Αντικειμένων', kind: yek2, hours: h(3) },
        { code: '4304', ects: 6, name: 'Αλγόριθμοι και Συνδυαστική Βελτιστοποίηση', kind: yek3, hours: h(3) },
        { code: '4305', ects: 6, name: 'K3 – Διοίκηση Ολικής Ποιότητας', kind: yek3, hours: h(3) },
        { code: '4307', ects: 6, name: 'K3 – Project στη Σχεδίαση Συστημάτων', kind: yek3, hours: h(0, 4) },
        { code: '4308', ects: 6, name: 'Μέθοδοι Σχεδιασμού Κίνησης και Αυτόνομες Κινούμενες Μονάδες', kind: yek3, hours: h(3) },
        { code: '4310', ects: 6, name: 'Συστήματα Υποστήριξης Αποφάσεων', kind: yek3, hours: h(3) },
        { code: '5102', ects: 6, name: 'Ψηφιακά Παιχνίδια και Παιγνιώδης Μάθηση', kind: ee, hours: h(3) },
        { code: '5103', ects: 6, name: 'Επεξεργασία Φυσικής Γλώσσας', kind: ee, hours: h(3) },
        { code: '5308', ects: 6, name: 'Σχεδιασμός Μεταφορών', kind: ee, hours: h(3) },
        { code: '5205', ects: 6, name: 'Σχεδιασμός Οχημάτων', kind: ee, hours: h(0, 3) },
        { code: '5206', ects: 6, name: 'Γραφιστικές Εφαρμογές', kind: ee, hours: h(3) },
        { code: '5207', ects: 6, name: 'Παραδοσιακές Λαϊκές Τέχνες', kind: ee, hours: h(0, 3) },
        { code: '5208', ects: 6, name: 'Ψηφιακή Πολιτιστική Κληρονομιά', kind: ee, hours: h(3) },
      ],
    },
    {
      semester: 10,
      courses: [{ code: '6001', ects: 30, name: 'Διπλωματική', kind: 'Διπλωματική Εργασία' }],
    },
  ],
};
