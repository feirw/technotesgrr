/** ΑΣΤΕ · Αστε Ρόδου (ΑΣΤΕΡ) */
import type { SchoolCurriculum } from './schoolCurricula';

export const ASTE_RHODES_CURRICULUM: SchoolCurriculum = {
  title: "Διοίκηση Τουριστικών και Ξενοδοχειακών Επιχειρήσεων",
  subtitle: "Ανώτατη Σχολή Τουριστικής Εκπαίδευσης · Ρόδος",
  hoursNote:
    "180 ECTS · 6 εξάμηνα · 30 ECTS/εξάμηνο. 5ο & 6ο εξ.: επιλογή μίας εξειδίκευσης (Βιώσιμη Ανάπτυξη · Πολυτελής Φιλοξενία · Τεχνολογία και Καινοτομία). Θ=θεωρία, Ε=εργαστήριο.",
  semesters: [
    { semester: 1, courses: [
      { code: "ASTER-A1", ects: 6, name: "Διοίκηση Τουριστικών και Ξενοδοχειακών Επιχειρήσεων", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTER-A2", ects: 4, name: "Λειτουργία Επισιτιστικών Τμημάτων", kind: "Υποχρεωτικό", hours: { lecture: 1, lab: 2 } },
      { code: "ASTER-A3", ects: 4, name: "Χρήση Τεχνολογιών, Πληροφορικής και Επικοινωνίας (Τ.Π.Ε.) — Αγγλική Ορολογία", kind: "Υποχρεωτικό", hours: { lecture: 2, lab: 1 } },
      { code: "ASTER-A4", ects: 5, name: "Λειτουργία και Οργάνωση Τμήματος Υποδοχής και Ορόφων", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTER-A5", ects: 6, name: "Οικονομικά Τουρισμού", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTER-A6", ects: 5, name: "Εισαγωγή στη Γαστρονομία", kind: "Υποχρεωτικό", hours: { lecture: 1, lab: 2 } },
    ] },
    { semester: 2, courses: [
      { code: "ASTER-B1", ects: 5, name: "Οινολογία και Μπαρ", kind: "Υποχρεωτικό", hours: { lecture: 2, lab: 1 } },
      { code: "ASTER-B2", ects: 6, name: "Διοίκηση Τομέα Τροφίμων και Ποτών Ξενοδοχείου", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTER-B3", ects: 4, name: "Αρχές Γενικής και Ξενοδοχειακής Λογιστικής", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTER-B4", ects: 6, name: "Στατιστική Επιχειρήσεων και Ανάλυση Δεδομένων", kind: "Υποχρεωτικό", hours: { lecture: 2, lab: 1 } },
      { code: "ASTER-B5", ects: 5, name: "Εφαρμογές Διαχείρισης Υποδοχής Ξενοδοχείου", kind: "Υποχρεωτικό" },
      { code: "ASTER-B6", ects: 4, name: "Διοίκηση Ολικής Ποιότητας — Αγγλική Ορολογία", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
    ] },
    { semester: 3, courses: [
      { code: "ASTER-Γ1", ects: 6, name: "Οργάνωση και Διαχείριση Συνεδρίων και Εκδηλώσεων", kind: "Υποχρεωτικό", hours: { lecture: 2, lab: 1 } },
      { code: "ASTER-Γ2", ects: 6, name: "Οργάνωση και Διοίκηση Τομέα Δωματίων Ξενοδοχείου", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTER-Γ3", ects: 5, name: "Διοίκηση Τμήματος Συντήρησης Εξοπλισμού και Εγκαταστάσεων Ξενοδοχείων", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTER-Γ4", ects: 5, name: "Ξενοδοχειακό και Τουριστικό Marketing", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTER-Γ5", ects: 4, name: "Σχεδιασμός και Μελλοντικές Τάσεις του Ξενοδοχειακού Προϊόντος — Αγγλική Ορολογία", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTER-Γ6", ects: 4, name: "Ξένη Γλώσσα Ι (Γερμανικά / Γαλλικά / Ιταλικά)", kind: "Υποχρεωτικό", hours: { lecture: 2 } },
    ] },
    { semester: 4, courses: [
      { code: "ASTER-Δ1", ects: 4, name: "Τεχνητή Νοημοσύνη στον Τουρισμό", kind: "Υποχρεωτικό", hours: { lecture: 2, lab: 1 } },
      { code: "ASTER-Δ2", ects: 6, name: "Στρατηγική Διοίκηση Ξενοδοχείων", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTER-Δ3", ects: 6, name: "Στρατηγικές Διαχείρισης Εσόδων (Revenue & Yield Management)", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTER-Δ4", ects: 5, name: "Επιχειρηματικότητα και Καινοτομία στον Τουρισμό", kind: "Υποχρεωτικό", hours: { lecture: 2, lab: 1 } },
      { code: "ASTER-Δ5", ects: 5, name: "Ψηφιακό Marketing — Αγγλική Ορολογία", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTER-Δ6", ects: 4, name: "Ξένη Γλώσσα ΙΙ (Γερμανικά / Γαλλικά / Ιταλικά)", kind: "Υποχρεωτικό", hours: { lecture: 2 } },
    ] },
    { semester: 5, courses: [
      { code: "ASTER-E1", ects: 5, name: "Διαχείριση Πελατειακών Σχέσεων (CRM)", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTER-E2", ects: 5, name: "Διοίκηση Ανθρωπίνων Πόρων", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTER-E3", ects: 4, name: "Διαπολιτισμική Επικοινωνία — Αγγλική Ορολογία", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTER-E4", ects: 4, name: "Διεθνή Συστήματα Κρατήσεων", kind: "Υποχρεωτικό", hours: { lecture: 2, lab: 1 } },
      { code: "ASTER-E5", ects: 6, name: "Μεθοδολογία Έρευνας", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTER-E6A", ects: 6, name: "Βιώσιμη Ανάπτυξη και Τουριστική Επιχειρηματικότητα", kind: "Εξειδίκευση · Βιώσιμη Ανάπτυξη στον Τουρισμό", hours: { lecture: 3 } },
      { code: "ASTER-E6B", ects: 6, name: "Διαχείριση Τουριστικών Πόρων και Πολιτιστική Κληρονομιά", kind: "Εξειδίκευση · Διοίκηση Πολυτελούς Φιλοξενίας", hours: { lecture: 3 } },
      { code: "ASTER-E6C", ects: 6, name: "Ψηφιακός Σχεδιασμός Εμπειριών", kind: "Εξειδίκευση · Τεχνολογία και Καινοτομία στα Ξενοδοχεία", hours: { lecture: 3 } },
    ] },
    { semester: 6, courses: [
      { code: "ASTER-ΣΤ1", ects: 6, name: "Εφαρμοσμένο Τελικό Έργο (Capstone Project)", kind: "Υποχρεωτικό", hours: { lecture: 2 } },
      { code: "ASTER-ΣΤ2", ects: 4, name: "Διαχείριση Κρίσεων και Κινδύνων", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTER-ΣΤ3", ects: 4, name: "Οργανωσιακή Ψυχολογία — Αγγλική Ορολογία", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTER-ΣΤ4", ects: 4, name: "Ξενοδοχειακή και Τουριστική Νομοθεσία", kind: "Υποχρεωτικό", hours: { lecture: 3 } },
      { code: "ASTER-ΣΤ5A", ects: 6, name: "Διαχείριση Τουριστικών Πόρων και Πολιτιστική Κληρονομιά", kind: "Εξειδίκευση · Βιώσιμη Ανάπτυξη στον Τουρισμό", hours: { lecture: 3 } },
      { code: "ASTER-ΣΤ5B", ects: 6, name: "Διοίκηση Διεθνών Θέρετρων και Υπηρεσιών Ευεξίας", kind: "Εξειδίκευση · Διοίκηση Πολυτελούς Φιλοξενίας", hours: { lecture: 3 } },
      { code: "ASTER-ΣΤ5C", ects: 6, name: "Έξυπνα Ξενοδοχεία", kind: "Εξειδίκευση · Τεχνολογία και Καινοτομία στα Ξενοδοχεία", hours: { lecture: 3 } },
      { code: "ASTER-ΣΤ6", ects: 6, name: "Πρακτική Άσκηση (3 μήνες ανά έτος × 3 έτη)", kind: "Πρακτική Άσκηση" },
    ] },
  ],
};
