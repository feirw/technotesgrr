/** ΔΙΠΑΕ · Οικονομικών Επιστημών (Σέρρες) */
import type { SchoolCurriculum } from './schoolCurricula';

const gy = 'Γενικού υποβάθρου' as const;
const ey = 'Ειδικού υποβάθρου' as const;
const eid = 'Ειδίκευσης' as const;

export const DIPAE_SERRES_ECONOMIC_SCIENCE_CURRICULUM: SchoolCurriculum = {
  title: 'Οικονομικών Επιστημών',
  subtitle: 'Διεθνές Πανεπιστήμιο της Ελλάδος · Σέρρες',
  semesters: [
    {
      semester: 1,
      courses: [
        { code: '2101', ects: 5, name: 'Μικροοικονομική Ι', kind: gy },
        { code: '102', ects: 5, name: 'Μαθηματικά για Οικονομολόγους', kind: gy },
        { code: '103', ects: 5, name: 'Στατιστική Ι', kind: gy },
        { code: '104', ects: 5, name: 'Μακροοικονομική Ι', kind: ey },
        { code: '105', ects: 5, name: 'Επιστήμη των Υπολογιστών', kind: gy },
        { code: '106', ects: 5, name: 'Λογιστική', kind: gy },
      ],
    },
    {
      semester: 2,
      courses: [
        { code: '2012', ects: 5, name: 'Μικροοικονομική ΙΙ', kind: gy },
        { code: '202', ects: 5, name: 'Χρηματοοικονομική Λογιστική', kind: gy },
        { code: '203', ects: 5, name: 'Οικονομική Γεωγραφία', kind: gy },
        { code: '204', ects: 5, name: 'Οικονομική Ανάπτυξη', kind: gy },
        { code: '205', ects: 5, name: 'Στατιστική ΙΙ', kind: eid },
        { code: '206', ects: 5, name: 'Οργάνωση και Διοίκηση Επιχειρήσεων', kind: ey },
      ],
    },
    {
      semester: 3,
      courses: [
        { code: '301', ects: 5, name: 'Διοίκηση Ανθρώπινου Δυναμικού', kind: ey },
        {
          code: '302',
          ects: 5,
          name: 'Εφαρμοσμένη Οικονομική και Λογιστική Διαχείριση',
          kind: ey,
        },
        { code: '303', ects: 5, name: 'Πληροφοριακά Συστήματα', kind: ey },
        { code: '3041', ects: 5, name: 'Διεθνής Οικονομική', kind: eid },
        { code: '305', ects: 5, name: 'Μακροοικονομική ΙΙ', kind: eid },
        { code: '306', ects: 5, name: 'Επιχειρησιακή Έρευνα', kind: eid },
      ],
    },
    {
      semester: 4,
      courses: [
        { code: '401', ects: 5, name: 'Οικονομετρία', kind: eid },
        { code: '402', ects: 5, name: 'Οικονομική των Επιχειρήσεων', kind: ey },
        { code: '403', ects: 5, name: 'Ιστορία Οικονομικών Θεωριών', kind: gy },
        { code: '404', ects: 5, name: 'Μάρκετινγκ', kind: gy },
        { code: '405', ects: 5, name: 'Διοικητική Λογιστική', kind: ey },
        { code: '461', ects: 5, name: 'Αστικό Δίκαιο', kind: gy },
        { code: '462', ects: 5, name: 'Επιστήμη των Δεδομένων', kind: ey },
        { code: '463', ects: 5, name: 'Αρχές Κοινωνιολογίας', kind: gy },
        { code: '465', ects: 5, name: 'Αγγλικά', kind: gy },
      ],
    },
    {
      semester: 5,
      courses: [
        { code: '552', ects: 6, name: 'Λογιστική Εταιρικών Επιχειρήσεων', kind: ey },
        { code: '501', ects: 6, name: 'Δημόσια Οικονομική', kind: eid },
        { code: '5022', ects: 6, name: 'Καινοτομία και Ολική Ποιότητα', kind: gy },
        { code: '503', ects: 6, name: 'Συγχωνεύσεις Δημοσίου και Ιδιωτικού Τομέα', kind: eid },
        { code: '504', ects: 6, name: 'Αγροτική Οικονομική', kind: eid },
        {
          code: '551',
          ects: 6,
          name: 'Μεθοδολογία Έρευνας και Ανάλυσης Δεδομένων στις Κοινωνικές Επιστήμες',
          kind: ey,
        },
        { code: '553', ects: 6, name: 'Ηλεκτρονικό Εμπόριο και Επιχειρείν', kind: eid },
        { code: '554', ects: 6, name: 'Αγορές Χρήματος και Κεφαλαίου', kind: eid },
        { code: '555', ects: 6, name: 'Οικονομικά της Ευρωπαϊκής Ολοκλήρωσης', kind: eid },
        { code: '556', ects: 6, name: 'Οικονομική Ιστορία της Ελλάδος', kind: eid },
      ],
    },
    {
      semester: 6,
      courses: [
        { code: '601', ects: 5, name: 'Χρηματοοικονομική Ανάλυση', kind: eid },
        { code: '602', ects: 5, name: 'Επιχειρηματικότητα', kind: eid },
        { code: '603', ects: 5, name: 'Ελεγκτική', kind: ey },
        { code: '604', ects: 5, name: 'Νομισματική Θεωρία και Τραπεζική', kind: eid },
        { code: '6051', ects: 5, name: 'Εμπορικό και Οικονομικό Δίκαιο', kind: gy },
        { code: '661', ects: 5, name: 'Ανάλυση Οικονομικών και Κοινωνικών Δικτύων', kind: ey },
        { code: '662', ects: 5, name: 'Δημόσια Λογιστική και Προϋπολογισμοί Δημοσίου', kind: eid },
        { code: '663', ects: 5, name: 'Εφοδιαστική Αλυσίδα', kind: eid },
        { code: '665', ects: 5, name: 'Οικονομική Πολιτική', kind: eid },
        { code: '666', ects: 5, name: 'Ψηφιακό Μάρκετινγκ', kind: ey },
      ],
    },
    {
      semester: 7,
      courses: [
        { code: '701', ects: 6, name: 'Οικονομικές Μελέτες και Έρευνες', kind: eid },
        { code: '702', ects: 6, name: 'Αποτίμηση', kind: ey },
        { code: '703', ects: 6, name: 'Τουριστική Οικονομική', kind: ey },
        { code: '704', ects: 6, name: 'Χρηματοοικονομική Διοίκηση', kind: eid },
        { code: '751', ects: 6, name: 'Βάσεις Δεδομένων', kind: ey },
        { code: '752', ects: 6, name: 'Οικονομικά της Εργασίας', kind: ey },
        { code: '753', ects: 6, name: 'Φορολογική Λογιστική', kind: ey },
        {
          code: '755',
          ects: 6,
          name: 'Οικονομικά του Ελεύθερου Ανταγωνισμού και της Ρύθμισης Αγορών',
          kind: eid,
        },
        { code: '756', ects: 6, name: 'Παραοικονομία', kind: eid },
        { code: '757', ects: 6, name: 'Διεθνής Πολιτική Οικονομία', kind: eid },
      ],
    },
    {
      semester: 8,
      courses: [
        {
          code: '801',
          ects: 6,
          name: 'Διεθνές Εμπόριο και Άμεσες Ξένες Επενδύσεις',
          kind: eid,
        },
        { code: '802', ects: 6, name: 'Διεθνή Λογιστικά Πρότυπα', kind: eid },
        { code: '803', ects: 6, name: 'Βιομηχανική Οργάνωση και Πολιτική', kind: eid },
        { code: '804', ects: 6, name: 'Οικονομικά του Περιβάλλοντος', kind: eid },
        { code: '851', ects: 6, name: 'Εταιρική Κοινωνική Ευθύνη', kind: ey },
        {
          code: '852',
          ects: 6,
          name: 'Λογιστική Ομίλων και Χρηματοοικονομικών Προϊόντων',
          kind: ey,
        },
        { code: '853', ects: 6, name: 'Εφαρμοσμένη Οικονομετρία', kind: eid },
        { code: '854', ects: 6, name: 'Φορολογικό Δίκαιο', kind: eid },
        { code: '855', ects: 6, name: 'Ειδικά Θέματα Μακροοικονομικής', kind: eid },
        { code: '856', ects: 6, name: 'Οικονομική Μεγέθυνση', kind: eid },
        {
          code: '857',
          ects: 6,
          name: 'Σχεδιασμός και Ανάπτυξη Διαδικτυακών Εφαρμογών',
          kind: eid,
        },
      ],
    },
  ],
};
