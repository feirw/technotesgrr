/** ΕΚΠΑ · Τεχνολογιών Ψηφιακής Βιομηχανίας (Ψαχνά Εύβοιας) */
import type { CourseHours, SchoolCurriculum } from './schoolCurricula';

const h = (lecture: number, tutorial = 0, lab = 0): CourseHours => ({
  lecture,
  ...(tutorial ? { tutorial } : {}),
  ...(lab ? { lab } : {}),
});

const k = 'Υποχρεωτικό (Κ)' as const;
const s = 'Σεμινάριο (Σ)' as const;
const ya = 'Υποχρεωτικό κατεύθυνσης Α (ΥΑ)' as const;
const yb = 'Υποχρεωτικό κατεύθυνσης Β (ΥΒ)' as const;
const ea = 'Επιλογής (ΕΑ)' as const;
const eb = 'Επιλογής (ΕΒ)' as const;
const eab = 'Επιλογής (ΕΑΒ)' as const;
const el = 'Ελεύθερης Επιλογής (ΕΛ)' as const;

export const EKPA_DIGITAL_INDUSTRY_CURRICULUM: SchoolCurriculum = {
  title: 'Τεχνολογιών Ψηφιακής Βιομηχανίας',
  subtitle: 'ΕΚΠΑ · Ψαχνά',
  hoursNote:
    'Ώρες/εβδομάδα: Θ = θεωρία, Φ = φροντιστήριο, Ε = εργαστήριο. ' +
    'Κατευθύνσεις Α (τεχνολογική) και Β (διοικητική). ' +
    '5ο–8ο εξ.: επιλογή μαθημάτων από ομάδες ΕΑ/ΕΒ/ΕΑΒ/ΕΛ σύμφωνα με το πρόγραμμα.',
  semesters: [
    {
      semester: 1,
      courses: [
        { code: '17.111', ects: 6, name: 'Μαθηματικά Ι', kind: k, hours: h(4, 2) },
        { code: '17.110', ects: 6, name: 'Φυσική Ι (Μηχανική)', kind: k, hours: h(4, 2) },
        { code: '17.120', ects: 6, name: 'Εισαγωγή στον Προγραμματισμό', kind: k, hours: h(3, 1, 2) },
        { code: '17.160', ects: 4, name: 'Εισαγωγή στην Οικονομική', kind: k, hours: h(4) },
        { code: '17.140', ects: 6, name: 'Ψηφιακή Σχεδίαση', kind: k, hours: h(3, 1, 2) },
        { code: '17.010', ects: 0, name: 'Γενικά Αγγλικά', kind: s, hours: h(2) },
        { code: '17.015', ects: 2, name: 'Ακαδημαϊκή Γραφή και Τεχνικές Παρουσιάσεων', kind: s, hours: h(1, 0, 1) },
      ],
    },
    {
      semester: 2,
      courses: [
        { code: '17.112', ects: 6, name: 'Μαθηματικά ΙΙ', kind: k, hours: h(4, 2) },
        { code: '17.113', ects: 6, name: 'Φυσική ΙΙ (Ηλεκτρομαγνητισμός, Οπτική)', kind: k, hours: h(4, 2) },
        { code: '17.121', ects: 6, name: 'Αντικειμενοστραφής Προγραμματισμός', kind: k, hours: h(3, 1, 2) },
        { code: '17.161', ects: 4, name: 'Μικροοικονομική', kind: k, hours: h(3, 1) },
        { code: '17.143', ects: 6, name: 'Αρχιτεκτονική Υπολογιστών', kind: k, hours: h(3, 1, 2) },
        { code: '17.011', ects: 2, name: 'Αγγλική Ορολογία', kind: s, hours: h(2) },
        { code: '17.020', ects: 2, name: 'Σεμινάριο Python', kind: s, hours: h(0, 0, 3) },
      ],
    },
    {
      semester: 3,
      courses: [
        { code: '17.141', ects: 6, name: 'Ηλεκτρονική & Ηλεκτρικά Κυκλώματα', kind: k, hours: h(4, 0, 2) },
        { code: '17.150', ects: 6, name: 'Σήματα και Συστήματα', kind: k, hours: h(3, 1, 2) },
        { code: '17.114', ects: 4, name: 'Πιθανότητες και Στατιστική', kind: k, hours: h(3, 1) },
        { code: '17.162', ects: 4, name: 'Διοίκηση και Λήψη Αποφάσεων', kind: k, hours: h(3, 1) },
        { code: '17.115', ects: 4, name: 'Διακριτά Μαθηματικά', kind: ya, hours: h(3, 1) },
        { code: '17.123', ects: 4, name: 'Δομές Δεδομένων και Τεχνικές Προγραμματισμού', kind: ya, hours: h(2, 0, 2) },
        { code: '17.163', ects: 4, name: 'Διοίκηση Καινοτομίας και Τεχνολογίας', kind: yb, hours: h(3, 1) },
        { code: '17.166', ects: 4, name: 'Διοίκηση Ανθρωπίνων Πόρων', kind: yb, hours: h(3, 1) },
        { code: '17.040', ects: 2, name: 'Σεμινάριο MATLAB', kind: s, hours: h(0, 0, 2) },
        { code: '17.013', ects: 2, name: 'Σύνταξη τεχνικών εγχειριδίων', kind: s, hours: h(1, 0, 1) },
      ],
    },
    {
      semester: 4,
      courses: [
        { code: '17.142', ects: 6, name: 'Συστήματα Αυτόματου Ελέγχου', kind: k, hours: h(4, 0, 2) },
        { code: '17.152', ects: 4, name: 'Δίκτυα Δεδομένων – Υπολογιστών', kind: k, hours: h(3, 0, 1) },
        { code: '17.151', ects: 5, name: 'Συστήματα Επικοινωνιών', kind: k, hours: h(2, 1, 2) },
        { code: '17.122', ects: 6, name: 'Λειτουργικά Συστήματα', kind: k, hours: h(3, 1, 2) },
        { code: '17.350', ects: 4, name: 'Ψηφιακή Επεξεργασία Σήματος', kind: ya, hours: h(3, 0, 1) },
        { code: '17.221', ects: 3, name: 'Αλγόριθμοι και Πολυπλοκότητα', kind: ya, hours: h(2, 1) },
        { code: '17.164', ects: 3, name: 'Τεχνική Ελεγκτική', kind: yb, hours: h(2, 1) },
        { code: '17.165', ects: 4, name: 'Διαχείριση Έργων', kind: yb, hours: h(2, 1, 1) },
        { code: '17.041', ects: 2, name: 'Σεμινάριο LabVIEW', kind: s, hours: h(0, 0, 2) },
        { code: '17.042', ects: 2, name: 'Βιομηχανικά Προβλήματα', kind: s, hours: h(2) },
        { code: '17.051', ects: 2, name: 'Στατιστικά πακέτα', kind: s, hours: h(0, 0, 2) },
      ],
    },
    {
      semester: 5,
      courses: [
        { code: '17.260', ects: 4, name: 'Βιομηχανική Οργάνωση', kind: k, hours: h(3, 1) },
        { code: '17.220', ects: 5, name: 'Βάσεις Δεδομένων', kind: k, hours: h(3, 0, 2) },
        { code: '17.320', ects: 4, name: 'Τεχνητή Νοημοσύνη', kind: k, hours: h(3, 1) },
        { code: '17.241', ects: 5, name: 'Βιομηχανικός Έλεγχος και Αισθητήρες', kind: ya, hours: h(3, 1, 1) },
        { code: '17.242', ects: 4, name: 'Βιομηχανικά Ηλεκτρονικά', kind: ya, hours: h(3, 0, 1) },
        { code: '17.153', ects: 4, name: 'Επικοινωνίες μικρής εμβέλειας', kind: ya, hours: h(3, 1) },
        { code: '17.261', ects: 4, name: 'Διοίκηση Ποιότητας', kind: yb, hours: h(3, 1) },
        { code: '17.262', ects: 4, name: 'Χρηματοοικονομική Ανάλυση – Επενδύσεις', kind: yb, hours: h(3, 0, 1) },
        { code: '17.230', ects: 5, name: 'Πληροφοριακά Συστήματα', kind: yb, hours: h(3, 2) },
        { code: '17.352', ects: 4, name: 'Συστήματα Κινητών Επικοινωνιών', kind: ea, hours: h(3, 1) },
        { code: '17.213', ects: 4, name: 'Ανανεώσιμες Πηγές Ενέργειας', kind: eab, hours: h(3, 1) },
        { code: '17.324', ects: 4, name: 'Τεχνικές Εξόρυξης Δεδομένων', kind: eab, hours: h(3, 1) },
        { code: '17.263', ects: 4, name: 'Ηλεκτρονικό Επιχειρείν και Ψηφιακή Επιχειρηματικότητα', kind: eb, hours: h(3, 1) },
        { code: '17.364', ects: 4, name: 'Μάρκετινγκ', kind: eb, hours: h(3, 1) },
      ],
    },
    {
      semester: 6,
      courses: [
        { code: '17.360', ects: 4, name: 'Χρηματοοικονομική Λογιστική & Διοίκηση', kind: k, hours: h(3, 1) },
        { code: '17.321', ects: 4, name: 'Τεχνολογίες Εφαρμογών Διαδικτύου', kind: k, hours: h(2, 1, 1) },
        { code: '17.322', ects: 5, name: 'Προγραμματισμός Συστήματος', kind: k, hours: h(4, 1) },
        { code: '17.440', ects: 6, name: 'Ρομποτική και Εφαρμογές', kind: k, hours: h(3, 1, 2) },
        { code: '17.154', ects: 3, name: 'Διαχείριση Συστημάτων και Δικτύων', kind: ya, hours: h(2, 0, 1) },
        { code: '17.420', ects: 4, name: 'Μηχανική Μάθηση', kind: ya, hours: h(3, 0, 1) },
        { code: '17.361', ects: 4, name: 'Τεχνοοικονομική Ανάλυση και Μελέτες', kind: yb, hours: h(3, 1) },
        { code: '17.362', ects: 3, name: 'Συστήματα Υποστήριξης Αποφάσεων', kind: yb, hours: h(2, 1) },
        { code: '17.212', ects: 4, name: 'Χημικές Βιομηχανικές Διεργασίες', kind: ea, hours: h(3, 1) },
        { code: '17.354', ects: 4, name: 'Δίκτυα Ευρείας Κλίμακας', kind: ea, hours: h(3, 1) },
        { code: '17.333', ects: 4, name: 'Ανάλυση/Σχεδίαση Συστημάτων Λογισμικού', kind: eab, hours: h(3, 0, 1) },
        { code: '17.251', ects: 4, name: 'Έξυπνα Δίκτυα Ενέργειας (Smart Grid)', kind: eab, hours: h(3, 1) },
        { code: '17.421', ects: 4, name: 'Ανάλυση Δεδομένων και Τεχνικές Προβλέψεων', kind: eb, hours: h(2, 1, 1) },
        { code: '17.365', ects: 4, name: 'Χρηματοοικονομική Μηχανική – Χαρτοφυλάκια', kind: eb, hours: h(3, 0, 1) },
      ],
    },
    {
      semester: 7,
      courses: [
        { code: '17.240', ects: 4, name: 'Επικοινωνία Ανθρώπου – Μηχανής', kind: ya, hours: h(3, 1) },
        { code: '17.323', ects: 4, name: 'Διαδίκτυο των Πραγμάτων (IoT)', kind: ya, hours: h(3, 1) },
        { code: '17.231', ects: 4, name: 'Διοικητική Πληροφοριακών και Τηλεπικοινωνιακών Συστημάτων', kind: yb, hours: h(3, 1) },
        { code: '17.330', ects: 4, name: 'Πληροφοριακά Συστήματα Διοίκησης και Επιχειρησιακών Πόρων', kind: yb, hours: h(3, 1) },
        { code: '17.441', ects: 5, name: 'Έλεγχος και Προγραμματισμός Ρομπότ', kind: ea, hours: h(3, 1, 1) },
        { code: '17.450', ects: 5, name: 'Προγραμματισμός Κινητών Συσκευών (Mobile Programming)', kind: ea, hours: h(3, 1, 1) },
        { code: '17.422', ects: 4, name: 'Υπολογιστική Νεφών (Cloud Computing)', kind: ea, hours: h(3, 0, 1) },
        { code: '17.423', ects: 4, name: 'Τεχνολογίες Εικονικής και Επαυξημένης Πραγματικότητας (AR/VR)', kind: ea, hours: h(3, 0, 1) },
        { code: '17.442', ects: 5, name: 'Ενσωματωμένα Συστήματα', kind: ea, hours: h(3, 1, 1) },
        { code: '17.451', ects: 4, name: 'Τεχνολογίες Ψηφιακού Διδύμου (Digital Twin)', kind: ea, hours: h(3, 1) },
        { code: '17.410', ects: 4, name: 'Εργονομία και Σχεδιασμός Προϊόντων', kind: eab, hours: h(3, 1) },
        { code: '17.443', ects: 4, name: 'Μοντελοποίηση Συστημάτων – Προσομοίωση', kind: eab, hours: h(3, 0, 1) },
        { code: '17.444', ects: 5, name: 'Σχεδιασμός/Παραγωγή με Υπολογιστή (CAD/CAM)', kind: eab, hours: h(3, 1, 1) },
        { code: '17.460', ects: 5, name: 'Εφοδιαστική Αλυσίδα', kind: eb, hours: h(4, 1) },
        { code: '17.461', ects: 3, name: 'Οργανωσιακή Συμπεριφορά', kind: eb, hours: h(2, 1) },
        { code: '17.080', ects: 3, name: 'Επιστήμη, Τεχνολογία, Κοινωνία', kind: el, hours: h(3) },
        { code: '17.081', ects: 3, name: 'Οικονομική Ιστορία', kind: el, hours: h(2, 1) },
      ],
    },
    {
      semester: 8,
      courses: [
        { code: '17.497', ects: 8, name: 'Πρακτική Άσκηση', kind: 'Πρακτική Άσκηση' },
        { code: '17.498', ects: 4, name: 'Πτυχιακή Εργασία Ι', kind: 'Πτυχιακή Εργασία' },
        { code: '17.499', ects: 4, name: 'Πτυχιακή Εργασία ΙΙ', kind: 'Πτυχιακή Εργασία' },
        { code: '17.445', ects: 4, name: 'Μηχανική Όραση', kind: ea, hours: h(3, 0, 1) },
        { code: '17.411', ects: 4, name: 'Γραμμική & Μη Γραμμική Βελτιστοποίηση', kind: eab, hours: h(3, 1) },
        { code: '17.452', ects: 4, name: 'Προστασία και Ασφάλεια Υπολογιστικών και Τηλεπικοινωνιακών Συστημάτων', kind: eab, hours: h(3, 1) },
        { code: '17.446', ects: 4, name: 'Συστήματα τρισδιάστατης εκτύπωσης και προσθετικής κατασκευής (3D Printing)', kind: eab, hours: h(3, 0, 1) },
        { code: '17.447', ects: 4, name: 'Κυβερνοφυσικά Συστήματα (Cyber-Physical Systems)', kind: eab, hours: h(3, 1) },
        { code: '17.448', ects: 4, name: 'Αντιρρυπαντική τεχνολογία και περιβαλλοντικός έλεγχος', kind: eab, hours: h(3, 1) },
        { code: '17.462', ects: 4, name: 'Ηλεκτρονική Διακυβέρνηση', kind: eb, hours: h(3, 1) },
        { code: '17.463', ects: 3, name: 'Τεχνολογική Πρόβλεψη', kind: eb, hours: h(2, 1) },
        { code: '17.449', ects: 3, name: 'Ειδικά Θέματα Συστημάτων Ψηφιακής Βιομηχανίας', kind: ea, hours: h(2, 1) },
        { code: '17.464', ects: 3, name: 'Ειδικά Θέματα Διοίκησης Ψηφιακής Βιομηχανίας', kind: eb, hours: h(2, 1) },
        { code: '17.082', ects: 3, name: 'Δίκαιο και Νομοθεσία', kind: el, hours: h(3) },
        { code: '17.083', ects: 3, name: 'Ιστορία και Φιλοσοφία της Τεχνολογίας', kind: el, hours: h(3) },
      ],
    },
  ],
};
