/** Γεωπονικό Αθηνών · Αγροτικής Οικονομίας και Ανάπτυξης */
import type { SchoolCurriculum } from './schoolCurricula';

const y = 'Υποχρεωτικό' as const;
const ep = 'Επιλογής' as const;

export const AUA_AGRICULTURAL_ECONOMICS_CURRICULUM: SchoolCurriculum = {
  title: 'Αγροτικής Οικονομίας και Ανάπτυξης',
  subtitle: 'Γεωπονικό Πανεπιστήμιο Αθηνών · Αθήνα',
  semesters: [
    {
      semester: 1,
      courses: [
        { code: 'AEA-101', ects: 5, name: 'Ζωοτεχνία', kind: y },
        { code: 'AEA-102', ects: 5, name: 'Βοτανική (Συστηματική-Ανατομία Φυτών)', kind: y },
        { code: 'AEA-103', ects: 5, name: 'Πληροφορική', kind: y },
        { code: 'AEA-104', ects: 5, name: 'Στατιστική', kind: y },
        { code: 'AEA-105', ects: 5, name: 'Εισαγωγή στην Οικονομική Θεωρία', kind: y },
        { code: 'AEA-106', ects: 5, name: 'Μαθηματικά για Οικονομολόγους Ι', kind: y },
        { code: 'AEA-107', ects: 5, name: 'Αγγλικά I', kind: y },
      ],
    },
    {
      semester: 2,
      courses: [
        { code: 'AEA-201', ects: 5, name: 'Δενδροκομία', kind: y },
        { code: 'AEA-202', ects: 5, name: 'Αγροτική Κοινωνιολογία', kind: y },
        { code: 'AEA-203', ects: 5, name: 'Μαθηματικά για Οικονομολόγους ΙΙ', kind: y },
        { code: 'AEA-204', ects: 5, name: 'Γεωργία', kind: y },
        { code: 'AEA-205', ects: 5, name: 'Διατροφή Αγροτικών Ζώων', kind: y },
        { code: 'AEA-206', ects: 5, name: 'Ιστορία του Αγροτικού Κόσμου', kind: y },
        { code: 'AEA-207', ects: 5, name: 'Αγγλικά ΙΙ', kind: y },
      ],
    },
    {
      semester: 3,
      courses: [
        { code: 'AEA-301', ects: 5, name: 'Λογιστική I', kind: y },
        { code: 'AEA-302', ects: 5, name: 'Μακροοικονομική Θεωρία Ι', kind: y },
        { code: 'AEA-303', ects: 5, name: 'Εισαγωγή στη Γεωργική Οικονομική', kind: y },
        { code: 'AEA-304', ects: 5, name: 'Εφαρμοσμένη Οικονομική Στατιστική', kind: y },
        { code: 'AEA-305', ects: 5, name: 'Μικροοικονομική Θεωρία Ι', kind: y },
        { code: 'AEA-306', ects: 5, name: 'Αγγλικά III', kind: y },
        {
          code: 'AEA-307',
          ects: 5,
          name: 'Μέθοδοι Γεωργοοικονομικής και Κοινωνιολογικής Έρευνας',
          kind: y,
        },
      ],
    },
    {
      semester: 4,
      courses: [
        { code: 'AEA-401', ects: 5, name: 'Γεωργικά Συστήματα στον Κόσμο', kind: y },
        { code: 'AEA-402', ects: 5, name: 'Μακροοικονομική Θεωρία ΙΙ', kind: y },
        { code: 'AEA-403', ects: 5, name: 'Συμπεριφορική και Πειραματική Οικονομική', kind: y },
        {
          code: 'AEA-404',
          ects: 5,
          name: 'Διαχείριση και Προστασία Αγροτικού Περιβάλλοντος',
          kind: y,
        },
        { code: 'AEA-405', ects: 5, name: 'Μικροοικονομική Θεωρία ΙΙ', kind: y },
        { code: 'AEA-406', ects: 5, name: 'Προγραμματισμός Υπολογιστών & Εφαρμογές', kind: y },
        { code: 'AEA-407', ects: 5, name: 'Αγγλικά IV', kind: y },
      ],
    },
    {
      semester: 5,
      courses: [
        { code: 'AEA-501', ects: 5, name: 'Οικονομικά του Περιβάλλοντος', kind: y },
        { code: 'AEA-502', ects: 5, name: 'Μάρκετινγκ Γεωργικών Προϊόντων και Τροφίμων', kind: y },
        { code: 'AEA-503', ects: 5, name: 'Αγγλικά V', kind: y },
        { code: 'AEA-504', ects: 5, name: 'Λογιστική II', kind: y },
        { code: 'AEA-505', ects: 5, name: 'Γεωργική Ζωολογία & Εντομολογία', kind: y },
        { code: 'AEA-511', ects: 5, name: 'Οικονομικά των Θεσμών', kind: ep },
        { code: 'AEA-512', ects: 5, name: 'Ειδικά Θέματα Στατιστικής', kind: ep },
        { code: 'AEA-513', ects: 5, name: 'Αστική Οικονομική & Χωροταξία', kind: ep },
        { code: 'AEA-514', ects: 5, name: 'Περιφερειακή Οικονομική και Ανάπτυξη', kind: ep },
        { code: 'AEA-515', ects: 5, name: 'Συστήματα Επιχειρηματικής Ευφυΐας', kind: ep },
      ],
    },
    {
      semester: 6,
      courses: [
        { code: 'AEA-601', ects: 5, name: 'Αξιολόγηση Γεωργικών Επενδύσεων', kind: y },
        { code: 'AEA-602', ects: 5, name: 'Ηλεκτρονικό Εμπόριο και Υπηρεσίες', kind: y },
        { code: 'AEA-603', ects: 5, name: 'Αγγλικά VI', kind: y },
        { code: 'AEA-604', ects: 5, name: 'Πολιτική Οικονομία του Αγροδιατροφικού Τομέα', kind: y },
        { code: 'AEA-605', ects: 5, name: 'Οικονομικά της Αγροτικής Ανάπτυξης', kind: y },
        { code: 'AEA-611', ects: 5, name: 'Φυσιολογία Φυτών', kind: ep },
        { code: 'AEA-612', ects: 5, name: 'Εδαφολογία-Λιπασματολογία', kind: ep },
        { code: 'AEA-613', ects: 5, name: 'Γεωγραφικά Πληροφοριακά Συστήματα', kind: ep },
        { code: 'AEA-614', ects: 5, name: 'Δημόσια Οικονομική', kind: ep },
        { code: 'AEA-615', ects: 5, name: 'Διδακτική - Γεωργική Εκπαίδευση', kind: ep },
        {
          code: 'AEA-616',
          ects: 5,
          name: 'Εισαγωγή στη γλώσσα R για την Επιστήμη των Δεδομένων',
          kind: ep,
        },
      ],
    },
    {
      semester: 7,
      courses: [
        { code: 'AEA-701', ects: 5, name: 'Γεωργικές Εφαρμογές', kind: y },
        { code: 'AEA-702', ects: 5, name: 'Οικονομετρία', kind: y },
        {
          code: 'AEA-703',
          ects: 5,
          name: 'Οργάνωση & Διαχείριση Γεωργικών Εκμεταλλεύσεων Ι',
          kind: y,
        },
        { code: 'AEA-704', ects: 5, name: 'Αρχές Βιομηχανιών Τροφίμων', kind: y },
        { code: 'AEA-711', ects: 5, name: 'Αγροτουρισμός', kind: ep },
        { code: 'AEA-712', ects: 5, name: 'Ανάλυση Εισροών-Εκροών', kind: ep },
        { code: 'AEA-713', ects: 5, name: 'Διαδίκτυο και Εφαρμογές στη Γεωπονία', kind: ep },
        { code: 'AEA-714', ects: 5, name: 'Συνεταιριστική Οικονομία', kind: ep },
        { code: 'AEA-715', ects: 5, name: 'Γενική Αμπελουργία', kind: ep },
        { code: 'AEA-716', ects: 5, name: 'Εισαγωγή στην Διαχείριση Υδατικών Πόρων', kind: ep },
      ],
    },
    {
      semester: 8,
      courses: [
        { code: 'AEA-801', ects: 5, name: 'Αγροτική Πολιτική', kind: y },
        { code: 'AEA-802', ects: 5, name: 'Οικονομικά των Φυσικών Πόρων', kind: y },
        {
          code: 'AEA-803',
          ects: 5,
          name: 'Οργάνωση & Διαχείριση Γεωργικών Εκμεταλλεύσεων ΙΙ',
          kind: y,
        },
        { code: 'AEA-804', ects: 5, name: 'Φυτοπαθολογία', kind: y },
        { code: 'AEA-811', ects: 5, name: 'Εφαρμοσμένη Μικροοικονομετρία', kind: ep },
        { code: 'AEA-812', ects: 5, name: 'Μελισσοκομία - Σηροτροφία', kind: ep },
        {
          code: 'AEA-813',
          ects: 5,
          name: 'Παράγωγα με εφαρμογές στην εφοδιαστική αλυσίδα αγροτικών προϊόντων και τροφίμων',
          kind: ep,
        },
        {
          code: 'AEA-814',
          ects: 5,
          name: 'Χρηματοδότηση και Χρηματοοικονομική Ανάλυση Γεωργικών Επιχειρήσεων',
          kind: ep,
        },
        { code: 'AEA-815', ects: 5, name: 'Πληροφοριακά Συστήματα Διοίκησης', kind: ep },
        { code: 'AEA-816', ects: 5, name: 'Λαχανοκομία', kind: ep },
      ],
    },
    {
      semester: 9,
      courses: [
        { code: 'AEA-901', ects: 5, name: 'Οικονομετρία II', kind: y },
        { code: 'AEA-902', ects: 5, name: 'Θεωρία και Πολιτική Διεθνούς Εμπορίου', kind: y },
        { code: 'AEA-903', ects: 5, name: 'Βιομηχανική Οργάνωση', kind: y },
        { code: 'AEA-904', ects: 5, name: 'Πολιτική Προστασίας Αγροτικού Περιβάλλοντος', kind: y },
        {
          code: 'AEA-911',
          ects: 5,
          name: 'Ηλεκτρονική διακυβέρνηση και ανοιχτά δεδομένα',
          kind: ep,
        },
        { code: 'AEA-912', ects: 5, name: 'Εναλλακτικές Καλλιέργειες', kind: ep },
        { code: 'AEA-913', ects: 5, name: 'Επιχειρηματικότητα', kind: ep },
        { code: 'AEA-914', ects: 5, name: 'Επιχειρησιακή Έρευνα', kind: ep },
        { code: 'AEA-915', ects: 5, name: 'Ειδικά Θέματα Ποσοτικής Ανάλυσης', kind: ep },
        { code: 'AEA-916', ects: 5, name: 'Ολοκληρωμένη Αντιμετώπιση Ζωικών Εχθρών', kind: ep },
        { code: 'AEA-917', ects: 5, name: 'Ειδικά Θέματα Οικονομικής Ανάλυσης', kind: ep },
      ],
    },
  ],
};
