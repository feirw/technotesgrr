/** ΠΑΔΑ · Μηχανικών Βιομηχανικής Σχεδίασης και Παραγωγής (Αιγάλεω) */
import type { CourseHours, SchoolCurriculum } from './schoolCurricula';

const h = (lecture: number): CourseHours => ({ lecture });

const gy = 'Μάθημα Υποχρεωτικό - Γενικού Υπόβαθρου' as const;
const ey = 'Μάθημα Υποχρεωτικό - Ειδικού Υπόβαθρου' as const;
const em = 'Μάθημα Υποχρεωτικό - Εμβάθυνσης/Εμπέδωσης' as const;
const epEy = 'Μάθημα Επιλογής Υποχρεωτικό - Ειδικού Υπόβαθρου' as const;
const epEm = 'Μάθημα Επιλογής Υποχρεωτικό - Εμβάθυνσης/Εμπέδωσης' as const;

export const PADA_INDUSTRIAL_DESIGN_PRODUCTION_CURRICULUM: SchoolCurriculum = {
  title: 'Μηχανικών Βιομηχανικής Σχεδίασης και Παραγωγής',
  subtitle: 'Πανεπιστήμιο Δυτικής Αττικής · Αιγάλεω',
  hoursNote:
    'Εβδομαδιαίες ώρες διδασκαλίας ανά μάθημα (θεωρία). ' +
    '7ο–9ο εξάμηνο: μαθήματα «Επιλογής Υποχρεωτικό» — επιλογή από την ομάδα του εξαμήνου.',
  semesters: [
    {
      semester: 1,
      courses: [
        { code: '1001', ects: 5, name: 'Γραμμική Άλγεβρα', kind: gy, hours: h(4) },
        { code: '1002', ects: 5, name: 'Γενική Φυσική', kind: gy, hours: h(4) },
        { code: '1003', ects: 5, name: 'Προγραμματισμός Η/Υ', kind: gy, hours: h(4) },
        { code: '1004', ects: 5, name: 'Μηχανολογικό Σχέδιο', kind: gy, hours: h(4) },
        { code: '1005', ects: 5, name: 'Θεωρία και Μεθοδολογία Σχεδίασης', kind: gy, hours: h(4) },
        { code: '1006', ects: 5, name: 'Ηλεκτρικά Κυκλώματα', kind: gy, hours: h(4) },
      ],
    },
    {
      semester: 2,
      courses: [
        { code: '2001', ects: 5, name: 'Αριθμητική Ανάλυση', kind: gy, hours: h(4) },
        { code: '2002', ects: 5, name: 'Τεχνική Μηχανική – Στατική', kind: gy, hours: h(4) },
        { code: '2003', ects: 5, name: 'Αλγόριθμοι και Δομές Δεδομένων', kind: gy, hours: h(4) },
        { code: '2004', ects: 5, name: 'Διαφορικός και Ολοκληρωτικός Λογισμός Ι', kind: gy, hours: h(4) },
        { code: '2005', ects: 5, name: 'Τεχνολογία Μετρήσεων και Αισθητήρων', kind: gy, hours: h(4) },
        { code: '2006', ects: 5, name: 'Οικονομικά των Επιχειρήσεων', kind: gy, hours: h(4) },
      ],
    },
    {
      semester: 3,
      courses: [
        { code: '3001', ects: 5, name: 'Διαφορικός και Ολοκληρωτικός Λογισμός ΙΙ', kind: ey, hours: h(4) },
        { code: '3002', ects: 5, name: 'Σχεδίαση και Παραγωγή με την Βοήθεια Η/Υ (CAD/CAM)', kind: ey, hours: h(4) },
        { code: '3003', ects: 5, name: 'Τεχνολογία Παραγωγής Ι', kind: ey, hours: h(4) },
        { code: '3004', ects: 5, name: 'Αντοχή Υλικών', kind: ey, hours: h(4) },
        { code: '3005', ects: 5, name: 'Ηλεκτρονική', kind: ey, hours: h(4) },
        { code: '3006', ects: 5, name: 'Ανάλυση Συστημάτων και Σημάτων', kind: ey, hours: h(4) },
      ],
    },
    {
      semester: 4,
      courses: [
        { code: '4001', ects: 5, name: 'Στοιχεία Μηχανών', kind: gy, hours: h(4) },
        { code: '4002', ects: 5, name: 'Στατιστική και Πιθανότητες για Μηχανικούς', kind: gy, hours: h(4) },
        { code: '4003', ects: 5, name: 'Διαχείριση Εφοδιαστικής Αλυσίδας (Logistics)', kind: ey, hours: h(4) },
        { code: '4004', ects: 5, name: 'Συλλογή και Ανάλυση Δεδομένων', kind: ey, hours: h(4) },
        { code: '4005', ects: 5, name: 'Διαφορικές Εξισώσεις', kind: gy, hours: h(4) },
        { code: '4006', ects: 5, name: 'Εργονομική Ανάλυση και Σχεδιασμός', kind: ey, hours: h(4) },
      ],
    },
    {
      semester: 5,
      courses: [
        { code: '5001', ects: 5, name: 'Σχεδίαση Βιομηχανικών Συστημάτων Κίνησης', kind: ey, hours: h(4) },
        { code: '5002', ects: 5, name: 'Μέθοδοι Βελτιστοποίησης', kind: ey, hours: h(4) },
        { code: '5003', ects: 5, name: 'Τεχνολογία Παραγωγής ΙΙ', kind: ey, hours: h(4) },
        { code: '5004', ects: 5, name: 'Συστήματα Αυτόματου Ελέγχου (ΣΑΕ) Ι', kind: ey, hours: h(4) },
        { code: '5005', ects: 5, name: 'Διαχείριση Ασφάλειας Εργασίας', kind: ey, hours: h(4) },
        { code: '5006', ects: 5, name: 'Θερμοδυναμική', kind: ey, hours: h(4) },
      ],
    },
    {
      semester: 6,
      courses: [
        { code: '6001', ects: 5, name: 'Σχεδίαση Βιομηχανικών Προϊόντων Ι', kind: ey, hours: h(4) },
        { code: '6002', ects: 5, name: 'Ποιοτικός Έλεγχος και Διοίκηση Ολικής Ποιότητας', kind: ey, hours: h(4) },
        { code: '6003', ects: 5, name: 'Συστήματα Υποστήριξης Αποφάσεων', kind: ey, hours: h(4) },
        { code: '6004', ects: 5, name: 'Σχεδίαση Συστημάτων με Μικροελεγκτές', kind: ey, hours: h(4) },
        { code: '6005', ects: 5, name: 'Ρευστομηχανική', kind: ey, hours: h(4) },
        { code: '6006', ects: 5, name: 'Τεχνολογία Διαδικτύου στην Ψηφιακή Βιομηχανία', kind: ey, hours: h(4) },
      ],
    },
    {
      semester: 7,
      courses: [
        { code: '7001', ects: 5, name: 'Μηχατρονική', kind: ey, hours: h(4) },
        { code: '7002', ects: 5, name: 'Πληροφοριακά Συστήματα Παραγωγής', kind: em, hours: h(4) },
        { code: '7003', ects: 5, name: 'Τεχνητή Νοημοσύνη', kind: em, hours: h(4) },
        { code: '7004', ects: 5, name: 'Επιχειρηματικότητα και Διοίκηση Καινοτομίας', kind: epEy, hours: h(4) },
        { code: '7005', ects: 5, name: 'Διαχείριση Παραπροϊόντων και Περιβάλλον', kind: epEm, hours: h(4) },
        { code: '7006', ects: 5, name: 'Ηλεκτρονικά Ισχύος-Ευφυές Πλέγμα', kind: epEm, hours: h(4) },
        { code: '7007', ects: 5, name: 'Σχεδίαση Ηλεκτρομηχανολογικών Εγκαταστάσεων', kind: epEy, hours: h(4) },
        { code: '7008', ects: 5, name: 'Σχεδίαση Βιομηχανικών Προϊόντων ΙΙ', kind: epEy, hours: h(4) },
        { code: '7009', ects: 5, name: 'Επιχειρηματική Ευφυΐα και Ανάλυση Μεγάλων Δεδομένων', kind: epEm, hours: h(4) },
        { code: '7010', ects: 5, name: 'Τέχνη, Τεχνολογία και Πολιτισμός', kind: epEm, hours: h(4) },
        { code: '7011', ects: 5, name: 'Αγγλική Ορολογία Ι', kind: epEy, hours: h(4) },
      ],
    },
    {
      semester: 8,
      courses: [
        { code: '8001', ects: 5, name: 'Πρόσθετες Κατεργασίες Παραγωγής – 3D Printing', kind: em, hours: h(4) },
        { code: '8002', ects: 5, name: 'Βιομηχανικοί Αυτοματισμοί – PLC', kind: em, hours: h(4) },
        { code: '8003', ects: 5, name: 'Συστήματα Παραγωγής', kind: ey, hours: h(4) },
        { code: '8004', ects: 5, name: 'Συστήματα Αυτόματου Ελέγχου (ΣΑΕ) ΙΙ', kind: epEy, hours: h(4) },
        { code: '8005', ects: 5, name: 'Μη Καταστροφικός Έλεγχος', kind: epEm, hours: h(4) },
        { code: '8006', ects: 5, name: 'Διαδίκτυο των Πραγμάτων (IoT)', kind: epEm, hours: h(4) },
        { code: '8007', ects: 5, name: 'Καινοτόμη Σχεδίαση και Αειφορία', kind: epEm, hours: h(4) },
        { code: '8008', ects: 5, name: 'Ευφυή Συστήματα', kind: epEm, hours: h(4) },
        { code: '8009', ects: 5, name: 'Ανανεώσιμες Πηγές Ενέργειας', kind: epEm, hours: h(4) },
        { code: '8010', ects: 5, name: 'Σχεδίαση και Ανάπτυξη Νανοδιατάξεων', kind: epEm, hours: h(4) },
        { code: '8011', ects: 5, name: 'Αγγλική Ορολογία ΙΙ', kind: epEy, hours: h(4) },
      ],
    },
    {
      semester: 9,
      courses: [
        { code: '9001', ects: 5, name: 'Ρομποτική', kind: em, hours: h(4) },
        { code: '9002', ects: 5, name: 'Σχεδίαση Αυτοκινούμενων Οχημάτων', kind: epEm, hours: h(4) },
        { code: '9003', ects: 5, name: 'Νεφοϋπολογιστική Μηχανική', kind: epEm, hours: h(4) },
        { code: '9004', ects: 5, name: 'Έξυπνα Υλικά', kind: epEy, hours: h(4) },
        { code: '9005', ects: 5, name: 'Μάρκετινγκ', kind: epEy, hours: h(4) },
        { code: '9006', ects: 5, name: 'Μεθοδολογία Ερευνητικού Έργου', kind: epEm, hours: h(4) },
        { code: '9007', ects: 5, name: 'Κυβερνοφυσικά Συστήματα', kind: epEm, hours: h(4) },
        { code: '9008', ects: 5, name: 'Διαχείριση Συστημάτων Μεταφορών', kind: epEm, hours: h(4) },
        { code: '9009', ects: 5, name: 'Διοίκηση Έργου', kind: epEy, hours: h(4) },
        { code: '9010', ects: 5, name: 'Ασφάλεια και Προστασία Δεδομένων', kind: epEm, hours: h(4) },
        { code: '9011', ects: 5, name: 'Σχεδίαση Διαδραστικών Συστημάτων', kind: epEm, hours: h(4) },
      ],
    },
    {
      semester: 10,
      courses: [
        { code: '10001', ects: 30, name: 'Διπλωματική Εργασία', kind: em },
        { code: '10002', ects: 10, name: 'Πρακτική Άσκηση', kind: epEm },
      ],
    },
  ],
};
