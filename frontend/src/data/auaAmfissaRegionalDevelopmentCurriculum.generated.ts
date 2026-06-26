/** Γεωπονικό Αθηνών · Περιφερειακής και Οικονομικής Ανάπτυξης (Άμφισσα) */
import type { SchoolCurriculum } from './schoolCurricula';

const y = 'Υποχρεωτικό' as const;
const ep = 'Επιλογής' as const;

export const AUA_AMFISSA_REGIONAL_DEVELOPMENT_CURRICULUM: SchoolCurriculum = {
  title: 'Περιφερειακής και Οικονομικής Ανάπτυξης',
  subtitle: 'Γεωπονικό Πανεπιστήμιο Αθηνών · Άμφισσα',
  semesters: [
    {
      semester: 1,
      courses: [
        { code: '6101', ects: 5, name: 'Αρχές Οικονομικής Θεωρίας', kind: y },
        { code: '6102', ects: 5, name: 'Μαθηματικά για Οικονομολόγους Ι', kind: y },
        { code: '6103', ects: 5, name: 'Στατιστική Ι', kind: y },
        {
          code: '6104',
          ects: 5,
          name: 'Στοιχεία Αστικού Δικαίου & Δικαίου Αξιογράφων',
          kind: y,
        },
        { code: '6105', ects: 5, name: 'Πληροφορική Ι', kind: y },
        { code: '6106', ects: 5, name: 'Αγγλικά Ι', kind: y },
      ],
    },
    {
      semester: 2,
      courses: [
        { code: '6207', ects: 5, name: 'Προγραμματισμός Η/Υ Ι', kind: y },
        { code: '6208', ects: 5, name: 'Μαθηματικά για Οικονομολόγους ΙΙ', kind: y },
        { code: '6209', ects: 5, name: 'Στατιστική ΙΙ', kind: y },
        { code: '6210', ects: 5, name: 'Κοινωνιολογία', kind: y },
        { code: '6211', ects: 5, name: 'Εισαγωγή στην Περιφερειακή Επιστήμη', kind: y },
        { code: '6212', ects: 5, name: 'Αγγλικά ΙΙ', kind: y },
      ],
    },
    {
      semester: 3,
      courses: [
        { code: '6313', ects: 5, name: 'Μικροοικονομική Ι', kind: y },
        { code: '6314', ects: 5, name: 'Μακροοικονομική Θεωρία Ι', kind: y },
        { code: '6315', ects: 5, name: 'Στατιστική ΙΙΙ', kind: y },
        { code: '6317', ects: 5, name: 'Περιφερειακή Οικονομική Ι', kind: y },
        { code: '6318', ects: 5, name: 'Προγραμματισμός Η/Υ ΙΙ', kind: y },
      ],
    },
    {
      semester: 4,
      courses: [
        { code: '6319', ects: 5, name: 'Λογιστική Ι', kind: y },
        { code: '6419', ects: 5, name: 'Μικροοικονομική Θεωρία ΙΙ', kind: y },
        { code: '6420', ects: 5, name: 'Μακροοικονομική Θεωρία ΙΙ', kind: y },
        { code: '6422', ects: 5, name: 'Στοιχεία Εμπορικού Δικαίου', kind: y },
        { code: '6423', ects: 5, name: 'Περιφερειακή Οικονομική ΙΙ', kind: y },
        { code: '6424', ects: 5, name: 'Οικονομετρία Ι', kind: y },
      ],
    },
    {
      semester: 5,
      courses: [
        { code: '6501', ects: 5, name: 'Λογιστική ΙΙ', kind: ep },
        { code: '6502', ects: 5, name: 'Κοινωνική Οικονομία & Πολιτική', kind: ep },
        { code: '6503', ects: 5, name: 'Γεωγραφικά Συστήματα Πληροφοριών', kind: ep },
        { code: '6504', ects: 5, name: 'Πληροφορική ΙΙ', kind: ep },
        { code: '6505', ects: 5, name: 'Πραγματική Ανάλυση για Οικονομολόγους', kind: ep },
        { code: '6524', ects: 5, name: 'Πολιτιστικός Τουρισμός και Ανάπτυξη', kind: ep },
        { code: '6526', ects: 5, name: 'Οικονομική των Φυσικών Πόρων', kind: y },
        { code: '6527', ects: 5, name: 'Οικονομετρία ΙΙ', kind: y },
        { code: '6528', ects: 5, name: 'Μαθηματικές Μέθοδοι στα Οικονομικά', kind: y },
        { code: '6529', ects: 5, name: 'Δημόσια Οικονομική', kind: y },
      ],
    },
    {
      semester: 6,
      courses: [
        { code: '6601', ects: 5, name: 'Θεωρία Παιγνίων', kind: ep },
        { code: '6603', ects: 5, name: 'Οικονομική του Περιβάλλοντος & Αποτίμηση Περιβαλλοντικών Αγαθών', kind: ep },
        { code: '6604', ects: 5, name: 'Οικονομική Ιστορία', kind: ep },
        { code: '6605', ects: 5, name: 'Στοιχεία Δημοσίου Δικαίου', kind: ep },
        { code: '6630', ects: 5, name: 'Αστική Οικονομική Ι', kind: y },
        { code: '6631', ects: 5, name: 'Οικονομική Ανάπτυξη Ι', kind: y },
        { code: '6632', ects: 5, name: 'Τουριστική Οικονομική', kind: y },
        {
          code: '6633',
          ects: 5,
          name: 'Αξιολόγηση Επενδύσεων & Χρηματο-οικονομικές Αποφάσεις',
          kind: y,
        },
        { code: '6634', ects: 5, name: 'Οικονομικά της Ενέργειας', kind: y },
      ],
    },
    {
      semester: 7,
      courses: [
        { code: '6525', ects: 5, name: 'Μέθοδοι Περιφερειακής Ανάλυσης', kind: y },
        { code: '6701', ects: 5, name: 'Χρηματοοικονομική Διοίκηση Επιχειρήσεων', kind: ep },
        { code: '6703', ects: 5, name: 'Χωρική Οικονομετρία', kind: ep },
        { code: '6704', ects: 5, name: 'Τοπική Ανάπτυξη και Αυτοδιοίκηση', kind: ep },
        { code: '6735', ects: 5, name: 'Αστική Οικονομική ΙΙ', kind: y },
        {
          code: '6736',
          ects: 5,
          name: 'Θεσμοί & Πολιτικές Περιφερειακής Ανάπτυξης',
          kind: y,
        },
        { code: '6737', ects: 5, name: 'Βιομηχανική Οργάνωση', kind: y },
        { code: '6738', ects: 5, name: 'Τουριστική Ανάπτυξη', kind: y },
        { code: '6739', ects: 5, name: 'Νομισματική Θεωρία', kind: y },
      ],
    },
    {
      semester: 8,
      courses: [
        { code: '6316', ects: 5, name: 'Αγροτική Οικονομική', kind: y },
        { code: '6801', ects: 5, name: 'Οικονομική Ανάπτυξη ΙΙ', kind: ep },
        { code: '6802', ects: 5, name: 'Οικονομικά της Αγοράς Ακινήτων', kind: ep },
        { code: '6839', ects: 5, name: 'Τουριστικό Μάνατζμεντ και Μάρκετινγκ', kind: ep },
        { code: '6840', ects: 5, name: 'Θεωρία Διεθνών Συναλλαγών', kind: y },
        { code: '6841', ects: 5, name: 'Οικονομικά της Εργασίας', kind: y },
        { code: '6842', ects: 5, name: 'Ειδικά Θέματα Οικονομικών', kind: y },
        { code: '6843', ects: 5, name: 'Χωροταξία και Χωρικός Σχεδιασμός', kind: y },
        { code: '6844', ects: 5, name: 'Επιχειρησιακή Έρευνα', kind: y },
      ],
    },
  ],
};
