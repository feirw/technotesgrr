/** ΠΑΔΑ · Λογιστικής & Χρηματοοικονομικής (Αιγάλεω) */
import type { SchoolCurriculum } from './schoolCurricula';

export const PADA_ACCOUNTING_FINANCE_CURRICULUM: SchoolCurriculum = {
  title: "Λογιστικής & Χρηματοοικονομικής",
  subtitle: "Πανεπιστήμιο Δυτικής Αττικής · Αιγάλεω",
  hoursNote:
    "ΜΓΥ: μάθημα γενικού υποβάθρου · ΜΕΥ: μάθημα επιλογής υποχρεωτικό. 5ο–8ο εξ.: μαθήματα κατεύθυνσης και επιλογής.",
  semesters: [
    { semester: 1, courses: [
      { code: "12010001", ects: 6, name: "Μικροοικονομική Θεωρία", kind: "Κορμού (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12010002", ects: 6, name: "Χρηματοοικονομική Λογιστική Ι", kind: "Κορμού (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12010003", ects: 6, name: "Μαθηματικά Οικονομικών Επιστημών", kind: "Κορμού (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12010004", ects: 6, name: "Επιχειρησιακή Πληροφορική", kind: "Κορμού (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12010005", ects: 6, name: "Αστικό Δίκαιο", kind: "Κορμού (ΜΓΥ)", hours: { lecture: 4 } },
    ] },
    { semester: 2, courses: [
      { code: "12020001", ects: 5, name: "Μακροοικονομική Θεωρία", kind: "Κορμού (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12020002", ects: 5, name: "Χρηματοοικονομική Λογιστική ΙΙ", kind: "Κορμού (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12020003", ects: 5, name: "Οργάνωση και Διοίκηση Επιχειρήσεων", kind: "Κορμού (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12020004", ects: 5, name: "Εισαγωγή στη Στατιστική", kind: "Κορμού (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12020005", ects: 5, name: "Εμπορικό Δίκαιο", kind: "Κορμού (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12020006", ects: 5, name: "Μεθοδολογία Έρευνας", kind: "Κορμού (ΜΓΥ)", hours: { lecture: 4 } },
    ] },
    { semester: 3, courses: [
      { code: "12030001", ects: 6, name: "Μάρκετινγκ", kind: "Κορμού (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12030002", ects: 6, name: "Στατιστική για Επιχειρήσεις", kind: "Κορμού (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12030003", ects: 6, name: "Λογιστική Κόστους", kind: "Κορμού (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12030004", ects: 6, name: "Χρηματοοικονομική Διοίκηση Ι", kind: "Κορμού (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12030005", ects: 6, name: "Θεσμοί και Δίκαιο Ε.Ε.", kind: "Κορμού (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12030006", ects: 0, name: "Ακαδημαϊκά Αγγλικά", kind: "Κορμού (ΜΓΥ)", hours: { lecture: 4 } },
    ] },
    { semester: 4, courses: [
      { code: "12040001", ects: 6, name: "Διοικητική Λογιστική", kind: "Κορμού (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12040002", ects: 6, name: "Φορολογική Λογιστική", kind: "Κορμού (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12040003", ects: 6, name: "Χρηματοοικονομική Διοίκηση ΙΙ", kind: "Κορμού (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12040004", ects: 6, name: "Χρηματοπιστωτικό Σύστημα", kind: "Κορμού (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12040005", ects: 6, name: "Εργατικό Δίκαιο", kind: "Κορμού (ΜΓΥ)", hours: { lecture: 4 } },
    ] },
    { semester: 5, courses: [
      { code: "12050008", ects: 5, name: "Επιχειρησιακή Επικοινωνία", kind: "Επιλογής (ΜΕΥ)", hours: { lecture: 4 } },
      { code: "12050001", ects: 5, name: "Διοίκηση Ανθρωπίνων Πόρων", kind: "Κορμού (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12050002", ects: 5, name: "Επιχειρησιακή Στρατηγική και Πολιτική", kind: "Κορμού (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12050003", ects: 5, name: "Φορολογία Εισοδήματος", kind: "Κατεύθυνσης (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12050004", ects: 5, name: "Λογιστική Έμμεσων Φόρων", kind: "Κατεύθυνσης (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12050005", ects: 5, name: "Εφαρμογές Λογιστικής με Η/Υ", kind: "Κατεύθυνσης (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12050006", ects: 5, name: "Χρηματοπιστωτικό Τραπεζικό Δίκαιο", kind: "Κατεύθυνσης (ΜΕΥ)", hours: { lecture: 4 } },
      { code: "12050007", ects: 5, name: "Ναυτιλιακή Οικονομική και Χρηματοοικονομική", kind: "Κατεύθυνσης (ΜΕΥ)", hours: { lecture: 4 } },
    ] },
    { semester: 6, courses: [
      { code: "12060001", ects: 6, name: "Ανάλυση Χρηματοοικονομικών Καταστάσεων", kind: "Κορμού (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12060002", ects: 4, name: "Επιχειρησιακά Αγγλικά", kind: "Κορμού (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12060003", ects: 5, name: "Λογιστική Εταιρειών", kind: "Κατεύθυνσης (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12060004", ects: 5, name: "Λογιστική Επιχειρηματικών Ομίλων", kind: "Κατεύθυνσης (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12060005", ects: 5, name: "Λογιστικά Πληροφοριακά Συστήματα", kind: "Κατεύθυνσης (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12060006", ects: 5, name: "Διεθνής Χρηματοοικονομική", kind: "Κατεύθυνσης (ΜΕΥ)", hours: { lecture: 4 } },
      { code: "12060007", ects: 5, name: "Ποσοτικές Μέθοδοι στη Χρηματοοικονομική", kind: "Κατεύθυνσης (ΜΕΥ)", hours: { lecture: 4 } },
      { code: "12060008", ects: 5, name: "Επιχειρηματικότητα και Καινοτομία", kind: "Κατεύθυνσης (ΜΕΥ)", hours: { lecture: 4 } },
    ] },
    { semester: 7, courses: [
      { code: "12070004", ects: 6, name: "Αγγλική Επιχειρησιακή Επικοινωνία", kind: "Επιλογής (ΜΕΥ)", hours: { lecture: 4 } },
      { code: "12070007", ects: 6, name: "Δημόσια Οικονομική", kind: "Επιλογής (ΜΕΥ)", hours: { lecture: 4 } },
      { code: "12070001", ects: 6, name: "Διεθνή Λογιστικά και Χρηματοοικονομικά Πρότυπα", kind: "Κορμού (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12070002", ects: 6, name: "Ελεγκτική", kind: "Κατεύθυνσης (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12070003", ects: 6, name: "Ειδικά Θέματα Λογιστικής Τυποποίησης", kind: "Κατεύθυνσης (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12070005", ects: 6, name: "Διαχείριση Χαρτοφυλακίου", kind: "Κατεύθυνσης (ΜΕΥ)", hours: { lecture: 4 } },
      { code: "12070006", ects: 6, name: "Επιχειρηματική Ηθική και Αρχές Εταιρικής Διακυβέρνησης", kind: "Κατεύθυνσης (ΜΕΥ)", hours: { lecture: 4 } },
    ] },
    { semester: 8, courses: [
      { code: "12080001", ects: 6, name: "Λογιστική Επιχειρήσεων Παροχής Υπηρεσιών", kind: "Κατεύθυνσης (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12080002", ects: 6, name: "Λογιστική Δημοσίου", kind: "Κατεύθυνσης (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12080003", ects: 6, name: "Τραπεζική Λογιστική", kind: "Κατεύθυνσης (ΜΓΥ)", hours: { lecture: 4 } },
      { code: "12080004", ects: 6, name: "Διαχείριση Κινδύνων", kind: "Κατεύθυνσης (ΜΕΥ)", hours: { lecture: 4 } },
      { code: "12080005", ects: 6, name: "Τραπεζική Χρηματοοικονομική", kind: "Κατεύθυνσης (ΜΕΥ)", hours: { lecture: 4 } },
      { code: "12080006", ects: 6, name: "Χρηματοοικονομικά Παράγωγα", kind: "Κατεύθυνσης (ΜΕΥ)", hours: { lecture: 4 } },
      { code: "12080008", ects: 12, name: "Πρακτική Άσκηση", kind: "Υποχρεωτικό κατ' επιλογήν" },
    ] },
  ],
};
