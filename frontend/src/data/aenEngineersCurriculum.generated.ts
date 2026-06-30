/** ΑΕΝ · Σχολή Μηχανικών */
import type { SchoolCurriculum } from './schoolCurricula';

export const AEN_ENGINEERS_CURRICULUM: SchoolCurriculum = {
  title: "Σχολή Μηχανικών",
  subtitle: "Ακαδημία Εμπορικού Ναυτικού",
  hoursNote:
    "Πρόγραμμα Δ΄ και Γ΄ Πλοιάρχου Μηχανικού. 3ο & 4ο εξ.: μη πλήρως διαθέσιμα online. Ώρες/εβδομάδα όπου αναφέρονται.",
  semesters: [
    { semester: 1, courses: [
      { code: "AENM-A1", ects: 0, name: "Θεωρία Ηλεκτρικών Κυκλωμάτων", kind: "Υποχρεωτικό" },
      { code: "AENM-A2", ects: 0, name: "Μαθηματικά", kind: "Υποχρεωτικό" },
      { code: "AENM-A3", ects: 0, name: "Μηχανουργείο", kind: "Υποχρεωτικό" },
      { code: "AENM-A4", ects: 0, name: "Μηχανολογικό Σχέδιο", kind: "Υποχρεωτικό" },
      { code: "AENM-A5", ects: 0, name: "Ναυτικά Αγγλικά", kind: "Υποχρεωτικό" },
      { code: "AENM-A6", ects: 0, name: "Ναυτικές Μηχανές", kind: "Υποχρεωτικό" },
      { code: "AENM-A7", ects: 0, name: "Ναυτιλιακές Γνώσεις – Ναυπηγία", kind: "Υποχρεωτικό" },
      { code: "AENM-A8", ects: 0, name: "Πληροφορική", kind: "Υποχρεωτικό" },
      { code: "AENM-A9", ects: 0, name: "Φυσική", kind: "Υποχρεωτικό" },
      { code: "AENM-A10", ects: 0, name: "Χημεία", kind: "Υποχρεωτικό" },
    ] },
    { semester: 2, courses: [
      { code: "AENM-B1", ects: 0, name: "Βοηθητικά Μηχανήματα", kind: "Υποχρεωτικό" },
      { code: "AENM-B2", ects: 0, name: "Εφαρμοσμένη Θερμοδυναμική Ι", kind: "Υποχρεωτικό" },
      { code: "AENM-B3", ects: 0, name: "Αντοχή Υλικών", kind: "Υποχρεωτικό" },
      { code: "AENM-B4", ects: 0, name: "Τεχνολογία Υλικών", kind: "Υποχρεωτικό" },
      { code: "AENM-B5", ects: 0, name: "Στοιχεία Ναυτικού Δικαίου", kind: "Υποχρεωτικό" },
      { code: "AENM-B6", ects: 0, name: "Ηλεκτρονικά", kind: "Υποχρεωτικό" },
      { code: "AENM-B7", ects: 0, name: "Μηχανουργείο", kind: "Υποχρεωτικό" },
      { code: "AENM-B8", ects: 0, name: "Ναυτικά Αγγλικά", kind: "Υποχρεωτικό" },
      { code: "AENM-B9", ects: 0, name: "Ναυτικές Μηχανές", kind: "Υποχρεωτικό" },
    ] },
    { semester: 3, courses: [
      { code: "AENM-Γ1", ects: 0, name: "Μηχανική Ρευστών", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "AENM-Γ2", ects: 0, name: "Μηχανουργείο", kind: "Υποχρεωτικό", hours: { lecture: 4 } },
      { code: "AENM-Γ3", ects: 0, name: "Ναυτικά Αγγλικά", kind: "Υποχρεωτικό", hours: { lecture: 2 } },
      { code: "AENM-Γ4", ects: 0, name: "Πληροφορική", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
    ] },
    { semester: 5, courses: [
      { code: "AENM-E1", ects: 0, name: "Θερμοδυναμική", kind: "Υποχρεωτικό", hours: { lecture: 4 } },
      { code: "AENM-E2", ects: 0, name: "Μηχανές Εσωτερικής Καύσης", kind: "Υποχρεωτικό", hours: { lecture: 5 } },
      { code: "AENM-E3", ects: 0, name: "Μηχανική Ρευστών", kind: "Υποχρεωτικό", hours: { lecture: 4 } },
      { code: "AENM-E4", ects: 0, name: "Ναυτικά Αγγλικά", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "AENM-E5", ects: 0, name: "Προσομοιωτής Μηχανοστασίου", kind: "Υποχρεωτικό", hours: { lecture: 4 } },
      { code: "AENM-E6", ects: 0, name: "Συστήματα Αυτομάτου Ελέγχου", kind: "Υποχρεωτικό", hours: { lecture: 5 } },
    ] },
    { semester: 6, courses: [
      { code: "AENM-ΣΤ1", ects: 0, name: "Βοηθητικά Μηχανήματα", kind: "Υποχρεωτικό", hours: { lecture: 4 } },
      { code: "AENM-ΣΤ2", ects: 0, name: "Καύσιμα – Λιπαντικά", kind: "Υποχρεωτικό", hours: { lecture: 4 } },
      { code: "AENM-ΣΤ3", ects: 0, name: "Μηχανουργείο", kind: "Υποχρεωτικό", hours: { lecture: 5 } },
      { code: "AENM-ΣΤ4", ects: 0, name: "Ναυτικά Αγγλικά", kind: "Υποχρεωτικό", hours: { lecture: 4 } },
      { code: "AENM-ΣΤ5", ects: 0, name: "Ψυκτικές Εγκαταστάσεις", kind: "Υποχρεωτικό", hours: { lecture: 4 } },
    ] },
  ],
};
