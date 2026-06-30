/** ΑΣΤΕ · Αστε Κρήτης (ΑΣΤΕΚ) — ΦΕΚ Β' 5510/15.10.2025 */
import type { SchoolCurriculum } from './schoolCurricula';

export const ASTE_CRETE_CURRICULUM: SchoolCurriculum = {
  title: "Διοίκηση Τουριστικών και Ξενοδοχειακών Επιχειρήσεων",
  subtitle: "Ανώτατη Σχολή Τουριστικής Εκπαίδευσης · Αγ. Νικόλαος",
  hoursNote:
    "180 ECTS · 6 εξάμηνα · 30 ECTS/εξάμηνο. 5ο & 6ο εξ.: επιλογή μίας εξειδίκευσης (Βιώσιμη Ανάπτυξη · Πολυτελής Φιλοξενία · Τεχνολογία και Καινοτομία). Θ=θεωρία, Ε=εργαστήριο.",
  semesters: [
    { semester: 1, courses: [
      { code: "ASTEK-A1", ects: 6, name: "Διοίκηση Τουριστικών και Ξενοδοχειακών Επιχειρήσεων", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTEK-A2", ects: 4, name: "Λειτουργία Επισιτιστικών Τμημάτων", kind: "Υποχρεωτικό", hours: { lecture: 1, lab: 2 } },
      { code: "ASTEK-A3", ects: 4, name: "Χρήση Τεχνολογιών, Πληροφορικής και Επικοινωνίας (Τ.Π.Ε.) — Αγγλική Ορολογία", kind: "Υποχρεωτικό", hours: { lecture: 2, lab: 1 } },
      { code: "ASTEK-A4", ects: 5, name: "Λειτουργία και Οργάνωση Τμήματος Υποδοχής και Ορόφων", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTEK-A5", ects: 6, name: "Οικονομικά Τουρισμού", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTEK-A6", ects: 5, name: "Εισαγωγή στην Γαστρονομία", kind: "Υποχρεωτικό", hours: { lecture: 1, lab: 2 } },
    ] },
    { semester: 2, courses: [
      { code: "ASTEK-B1", ects: 5, name: "Οινολογία και Μπαρ", kind: "Υποχρεωτικό", hours: { lecture: 2, lab: 1 } },
      { code: "ASTEK-B2", ects: 6, name: "Διοίκηση Τομέα Τροφίμων και Ποτών Ξενοδοχείου", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTEK-B3", ects: 4, name: "Αρχές Γενικής και Ξενοδοχειακής Λογιστικής", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTEK-B4", ects: 6, name: "Στατιστική Επιχειρήσεων και Ανάλυση Δεδομένων", kind: "Υποχρεωτικό", hours: { lecture: 2, lab: 1 } },
      { code: "ASTEK-B5", ects: 5, name: "Εφαρμογές Διαχείρισης Υποδοχής Ξενοδοχείου", kind: "Υποχρεωτικό" },
      { code: "ASTEK-B6", ects: 4, name: "Διοίκηση Ολικής Ποιότητας — Αγγλική Ορολογία", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
    ] },
    { semester: 3, courses: [
      { code: "ASTEK-Γ1", ects: 6, name: "Οργάνωση και Διαχείριση Συνεδρίων και Εκδηλώσεων", kind: "Υποχρεωτικό", hours: { lecture: 2, lab: 1 } },
      { code: "ASTEK-Γ2", ects: 6, name: "Οργάνωση και Διοίκηση Τομέα Δωματίων Ξενοδοχείου", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTEK-Γ3", ects: 5, name: "Διοίκηση Τμήματος Συντήρησης Εξοπλισμού και Εγκαταστάσεων Ξενοδοχείων", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTEK-Γ4", ects: 5, name: "Ξενοδοχειακό και Τουριστικό Marketing", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTEK-Γ5", ects: 4, name: "Σχεδιασμός και μελλοντικές τάσεις του ξενοδοχειακού προϊόντος — Αγγλική Ορολογία", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTEK-Γ6", ects: 4, name: "Ξένη Γλώσσα Ι — Γερμανικά, Γαλλικά, Ιταλικά", kind: "Υποχρεωτικό", hours: { lecture: 2 } },
    ] },
    { semester: 4, courses: [
      { code: "ASTEK-Δ1", ects: 4, name: "Τεχνητή Νοημοσύνη στον Τουρισμό", kind: "Υποχρεωτικό", hours: { lecture: 2, lab: 1 } },
      { code: "ASTEK-Δ2", ects: 6, name: "Στρατηγική Διοίκηση Ξενοδοχείων", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTEK-Δ3", ects: 6, name: "Στρατηγικές Διαχείρισης Εσόδων", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTEK-Δ4", ects: 5, name: "Επιχειρηματικότητα και Καινοτομία στον Τουρισμό", kind: "Υποχρεωτικό", hours: { lecture: 2, lab: 1 } },
      { code: "ASTEK-Δ5", ects: 5, name: "Ψηφιακό Marketing — Αγγλική Ορολογία", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTEK-Δ6", ects: 4, name: "Ξένη Γλώσσα ΙΙ — Γερμανικά, Γαλλικά, Ιταλικά", kind: "Υποχρεωτικό", hours: { lecture: 2 } },
    ] },
    { semester: 5, courses: [
      { code: "ASTEK-E1", ects: 5, name: "Διαχείριση Πελατειακών Σχέσεων", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTEK-E2", ects: 5, name: "Διοίκηση Ανθρωπίνων Πόρων", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTEK-E3", ects: 4, name: "Διαπολιτισμική Επικοινωνία — Αγγλική Ορολογία", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTEK-E4", ects: 4, name: "Διεθνή Συστήματα Κρατήσεων", kind: "Υποχρεωτικό", hours: { lecture: 2, lab: 1 } },
      { code: "ASTEK-E5", ects: 6, name: "Μεθοδολογία Έρευνας", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTEK-E6A", ects: 6, name: "Βιώσιμη Ανάπτυξη και Τουριστική Επιχειρηματικότητα", kind: "Εξειδίκευση · Βιώσιμη Ανάπτυξη στον Τουρισμό", hours: { lecture: 3 } },
      { code: "ASTEK-E6B", ects: 6, name: "Διαχείριση Τουριστικών Πόρων και Πολιτιστική Κληρονομιά", kind: "Εξειδίκευση · Διοίκηση Πολυτελούς Φιλοξενίας", hours: { lecture: 3 } },
      { code: "ASTEK-E6C", ects: 6, name: "Ψηφιακός Σχεδιασμός Εμπειριών", kind: "Εξειδίκευση · Τεχνολογία και Καινοτομία στα Ξενοδοχεία", hours: { lecture: 3 } },
    ] },
    { semester: 6, courses: [
      { code: "ASTEK-ΣΤ1", ects: 6, name: "Εφαρμοσμένο Τελικό Έργο", kind: "Υποχρεωτικό", hours: { lecture: 2 } },
      { code: "ASTEK-ΣΤ2", ects: 4, name: "Διαχείριση Κρίσεων και Κινδύνων", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTEK-ΣΤ3", ects: 4, name: "Οργανωσιακή Ψυχολογία — Αγγλική Ορολογία", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTEK-ΣΤ4", ects: 4, name: "Ξενοδοχειακή και Τουριστική Νομοθεσία", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTEK-ΣΤ5A", ects: 6, name: "Διαχείριση Τουριστικών Πόρων και Πολιτιστική Κληρονομιά", kind: "Εξειδίκευση · Βιώσιμη Ανάπτυξη στον Τουρισμό", hours: { lecture: 3 } },
      { code: "ASTEK-ΣΤ5B", ects: 6, name: "Διοίκηση Διεθνών Θέρετρων και Υπηρεσιών Ευεξίας", kind: "Εξειδίκευση · Διοίκηση Πολυτελούς Φιλοξενίας", hours: { lecture: 3 } },
      { code: "ASTEK-ΣΤ5C", ects: 6, name: "Έξυπνα Ξενοδοχεία", kind: "Εξειδίκευση · Τεχνολογία και Καινοτομία στα Ξενοδοχεία", hours: { lecture: 3 } },
      { code: "ASTEK-ΣΤ6", ects: 6, name: "Πρακτική Άσκηση — 3 μήνες ανά έτος × 3 έτη", kind: "Πρακτική Άσκηση" },
    ] },
  ],
};
