/** Συντελεστές βαρύτητας 2026 — 4ο πεδίο (ΓΕΛ). Πηγή: AeiTei.gr */

export type SchoolCoefficient = { subject: string; weight: number; note?: string };
export type SchoolCoefficientsEntry = {
  id: string;
  name: string;
  coefficients: SchoolCoefficient[];
};

export const FIELD_4_TITLE = "Επιστήμες Οικονομίας και Πληροφορικής (4ο Πεδίο)";
export const COEFFICIENTS_YEAR = 2026;

export const SCHOOL_COEFFICIENTS_2026: SchoolCoefficientsEntry[] = [
  {
    id: "school-1",
    name: "Αγροτικής Ανάπτυξης (Ορεστιάδα) (ΔΠΘ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-2",
    name: "Αγροτικής Ανάπτυξης, Αγροδιατροφής και Διαχείρισης Φυσικών Πόρων (Ψαχνά Εύβοιας) (ΕΚΠΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-3",
    name: "Αγροτικής Οικονομίας και Ανάπτυξης (Αθήνα) (ΓΕΩΠ ΠΑΝ ΑΘ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-4",
    name: "Αγωγής και Φροντίδας στην Πρώιμη Παιδική Ηλικία (Αιγάλεω) (ΠΑΝ. ΔΥΤ. ΑΤΤΙΚΗΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 40 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-5",
    name: "Αγωγής και Φροντίδας στην Πρώιμη Παιδική Ηλικία (Θεσσαλονίκη) (ΔΙΠΑΕ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-6",
    name: "Αγωγής και Φροντίδας στην Πρώιμη Παιδική Ηλικία (Ιωάννινα) (ΠΑΝ ΙΩΑΝΝΙΝΩΝ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 34 },
      { subject: "Μαθηματικά", weight: 22 },
      { subject: "Πληροφορική", weight: 22 },
      { subject: "Οικονομία", weight: 22 },
    ],
  },
  {
    id: "school-7",
    name: "Αλιείας και Υδατοκαλλιεργειών (Μεσολόγγι) (ΠΑΝ ΠΑΤΡΩΝ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 27 },
      { subject: "Πληροφορική", weight: 27 },
      { subject: "Οικονομία", weight: 26 },
    ],
  },
  {
    id: "school-8",
    name: "Ανθρωπιστικών Σπουδών (Κομοτηνή) (ΔΠΘ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-9",
    name: "Ανώτερη Σχολή Τουριστικής Εκπαίδευσης Κρήτης (ΑΣΤΕΚ) (Αγ. Νικόλαος) (ΑΣΤΕ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 22 },
      { subject: "Μαθηματικά", weight: 22 },
      { subject: "Πληροφορική", weight: 28 },
      { subject: "Οικονομία", weight: 28 },
      { subject: "Ειδικό Μάθημα", weight: 20, note: "Ειδικό μάθημα: Ένα από τα Αγγλικά, Γαλλικά, Γερμανικά, Ιταλικά" },
    ],
  },
  {
    id: "school-10",
    name: "Ανώτερη Σχολή Τουριστικής Εκπαίδευσης Ρόδου (ΑΣΤΕΡ) (Ρόδος) (ΑΣΤΕ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 22 },
      { subject: "Μαθηματικά", weight: 22 },
      { subject: "Πληροφορική", weight: 28 },
      { subject: "Οικονομία", weight: 28 },
      { subject: "Ειδικό Μάθημα", weight: 20, note: "Ειδικό μάθημα: Ένα από τα Αγγλικά, Γαλλικά, Γερμανικά, Ιταλικά" },
    ],
  },
  {
    id: "school-11",
    name: "Αξιωματικών Ελληνικής Αστυνομίας (Μόνο για Αστυνομικούς) (ΑΣΤΥΝ ΣΧΟΛ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-12",
    name: "Αξιωματικών Ελληνικής Αστυνομίας (Μόνο για Πολίτες) (ΑΣΤΥΝ ΣΧΟΛ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-13",
    name: "Αξιωματικών Πυροσβεστικής Ακαδημίας (Μόνο για Πολίτες) (ΣΠΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-14",
    name: "Αξιωματικών Πυροσβεστικής Ακαδημίας (Μόνο για Πυροσβέστες) (ΣΠΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-15",
    name: "Αρχειονομίας, Βιβλιοθηκονομίας και Συστημάτων Πληροφόρησης (Αιγάλεω) (ΠΑΝ. ΔΥΤ. ΑΤΤΙΚΗΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-16",
    name: "Αστυφυλάκων (Μόνο για Πολίτες) (ΑΣΤΥΝ ΣΧΟΛ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-17",
    name: "Βαλκανικών, Σλαβικών και Ανατολικών Σπουδών (Θεσσαλονίκη) (ΠΑΜΑΚ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-18",
    name: "Βιβλιοθηκονομίας, Αρχειονομίας και Συστημάτων Πληροφόρησης (Θεσσαλονίκη) (ΔΙΠΑΕ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-19",
    name: "Βιομηχανικής Διοίκησης και Τεχνολογίας (Πειραιάς) (ΠΑΝ ΠΕΙΡΑΙΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 35 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-20",
    name: "Γεωγραφίας (Αθήνα) (ΧΑΡΟΚΟΠΕΙΟ ΠΑΝ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-21",
    name: "Γεωγραφίας (Μυτιλήνη) (ΠΑΝ ΑΙΓΑΙΟΥ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-22",
    name: "Γραφιστικής και Οπτικής Επικοινωνίας (Αιγάλεω) (ΠΑΝ. ΔΥΤ. ΑΤΤΙΚΗΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
      { subject: "Ελεύθερο Σχέδιο", weight: 10 },
      { subject: "Γραμμικό Σχέδιο", weight: 10 },
    ],
  },
  {
    id: "school-23",
    name: "Δασολογίας, Επιστημών Ξύλου και Σχεδιασμού (Καρδίτσα) (ΠΑΝ ΘΕΣΣΑΛΙΑΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-24",
    name: "Δασολογίας και Διαχείρισης Περιβάλλοντος και Φυσικών Πόρων (Ορεστιάδα) (ΔΠΘ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 35 },
    ],
  },
  {
    id: "school-25",
    name: "Δασολογίας και Διαχείρισης Φυσικού Περιβάλλοντος (Καρπενήσι) (ΓΕΩΠ ΠΑΝ ΑΘ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-26",
    name: "Δημιουργικού Σχεδιασμού και Ένδυσης (Κιλκίς) (ΔΙΠΑΕ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-27",
    name: "Δημόσιας Διοίκησης (Αθήνα) (ΠΑΝΤΕΙΟ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-28",
    name: "Διαχείρισης Λιμένων και Ναυτιλίας (Ψαχνά Εύβοιας) (ΕΚΠΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-29",
    name: "Διεθνών και Ευρωπαϊκών Οικονομικών Σπουδών (Αθήνα) (ΟΠΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-30",
    name: "Διεθνών και Ευρωπαϊκών Οικονομικών Σπουδών (Κοζάνη) (ΠΑΝ ΔΥΤ ΜΑΚ/ΝΙΑΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-31",
    name: "Διεθνών και Ευρωπαϊκών Σπουδών (Αθήνα) (ΠΑΝΤΕΙΟ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 30 },
      { subject: "Ειδικό Μάθημα", weight: 10, note: "Ειδικό μάθημα: Ένα από τα Αγγλικά, Γαλλικά, Γερμανικά, Ιταλικά" },
    ],
  },
  {
    id: "school-32",
    name: "Διεθνών και Ευρωπαϊκών Σπουδών (Θεσσαλονίκη) (ΠΑΜΑΚ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 35 },
      { subject: "Ειδικό Μάθημα", weight: 20, note: "Ειδικό μάθημα: Ένα από τα Αγγλικά, Γαλλικά, Γερμανικά, Ιταλικά" },
    ],
  },
  {
    id: "school-33",
    name: "Διεθνών και Ευρωπαϊκών Σπουδών (Πειραιάς) (ΠΑΝ ΠΕΙΡΑΙΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 30 },
      { subject: "Ειδικό Μάθημα", weight: 20, note: "Ειδικό μάθημα: Ένα από τα Αγγλικά, Γαλλικά, Γερμανικά, Ιταλικά" },
    ],
  },
  {
    id: "school-34",
    name: "Διοίκησης Γεωργικών Επιχειρήσεων και Συστημάτων Εφοδιασμού (Θήβα) (ΓΕΩΠ ΠΑΝ ΑΘ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-35",
    name: "Διοίκησης Επιχειρήσεων (Αιγάλεω) (ΠΑΝ. ΔΥΤ. ΑΤΤΙΚΗΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-36",
    name: "Διοίκησης Επιχειρήσεων (Λάρισα) (ΠΑΝ ΘΕΣΣΑΛΙΑΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-37",
    name: "Διοίκησης Επιχειρήσεων (Πάτρα) (ΠΑΝ ΠΑΤΡΩΝ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 28 },
      { subject: "Μαθηματικά", weight: 28 },
      { subject: "Πληροφορική", weight: 22 },
      { subject: "Οικονομία", weight: 22 },
    ],
  },
  {
    id: "school-38",
    name: "Διοίκησης Επιχειρήσεων (Χίος) (ΠΑΝ ΑΙΓΑΙΟΥ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-39",
    name: "Διοίκησης Επιχειρήσεων και Οργανισμών (Αθήνα) (ΕΚΠΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-40",
    name: "Διοίκησης Επιχειρήσεων και Οργανισμών (Καλαμάτα) (ΠΑΝ ΠΕΛ/ΝΗΣΟΥ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 35 },
    ],
  },
  {
    id: "school-41",
    name: "Διοίκησης Επιχειρήσεων και Τουρισμού (Ηράκλειο) (ΕΛΜΕΠΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 24 },
      { subject: "Μαθηματικά", weight: 28 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 28 },
    ],
  },
  {
    id: "school-42",
    name: "Διοίκησης Εφοδιαστικής Αλυσίδας (Κατερίνη) (ΔΙΠΑΕ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-43",
    name: "Διοίκησης Οργανισμών, Marketing και Τουρισμού (Θεσσαλονίκη) (ΔΙΠΑΕ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-44",
    name: "Διοίκησης Τουρισμού (Αιγάλεω) (ΠΑΝ. ΔΥΤ. ΑΤΤΙΚΗΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 30 },
      { subject: "Ειδικό Μάθημα", weight: 20, note: "Ειδικό μάθημα: Ένα από τα Αγγλικά, Γαλλικά, Γερμανικά, Ιταλικά" },
    ],
  },
  {
    id: "school-45",
    name: "Διοίκησης Τουρισμού (Πάτρα) (ΠΑΝ ΠΑΤΡΩΝ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
      { subject: "Ειδικό Μάθημα", weight: 20, note: "Ειδικό μάθημα: Ένα από τα Αγγλικά, Γαλλικά, Γερμανικά, Ιταλικά" },
    ],
  },
  {
    id: "school-46",
    name: "Διοικητικής Επιστήμης και Τεχνολογίας (Αγ. Νικόλαος) (ΕΛΜΕΠΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-47",
    name: "Διοικητικής Επιστήμης και Τεχνολογίας (Αθήνα) (ΟΠΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-48",
    name: "Διοικητικής Επιστήμης και Τεχνολογίας (Καβάλα) (ΔΠΘ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-49",
    name: "Διοικητικής Επιστήμης και Τεχνολογίας (Κοζάνη) (ΠΑΝ ΔΥΤ ΜΑΚ/ΝΙΑΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-50",
    name: "Διοικητικής Επιστήμης και Τεχνολογίας (Πάτρα) (ΠΑΝ ΠΑΤΡΩΝ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-51",
    name: "Διοικητικής Επιστήμης και Τεχνολογίας (Τρίπολη) (ΠΑΝ ΠΕΛ/ΝΗΣΟΥ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-52",
    name: "Εκπαίδευσης και Αγωγής στην Προσχολική Ηλικία (Αθήνα) (ΕΚΠΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-53",
    name: "Επικοινωνίας και Ψηφιακών Μέσων (Καστοριά) (ΠΑΝ ΔΥΤ ΜΑΚ/ΝΙΑΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 20 },
      { subject: "Ειδικό Μάθημα", weight: 10, note: "Ειδικό μάθημα: Ένα από τα Αγγλικά, Γαλλικά, Γερμανικά, Ιταλικά" },
    ],
  },
  {
    id: "school-54",
    name: "Επιστήμης της Πληροφορίας (Κέρκυρα) (ΙΟΝΙΟ ΠΑΝ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-55",
    name: "Επιστήμης Υπολογιστών (Ηράκλειο) (ΠΑΝ ΚΡΗΤΗΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 26 },
      { subject: "Μαθηματικά", weight: 27 },
      { subject: "Πληροφορική", weight: 27 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-56",
    name: "Επιστήμης Φυσικής Αγωγής και Αθλητισμού (Αθήνα) (ΕΚΠΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 20 },
      { subject: "Αγωνίσματα", weight: 20 },
    ],
  },
  {
    id: "school-57",
    name: "Επιστήμης Φυσικής Αγωγής και Αθλητισμού (Θεσσαλονίκη) (ΑΠΘ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 25 },
      { subject: "Αγωνίσματα", weight: 20 },
    ],
  },
  {
    id: "school-58",
    name: "Επιστήμης Φυσικής Αγωγής και Αθλητισμού (Κομοτηνή) (ΔΠΘ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 20 },
      { subject: "Αγωνίσματα", weight: 20 },
    ],
  },
  {
    id: "school-59",
    name: "Επιστήμης Φυσικής Αγωγής και Αθλητισμού (Σέρρες) (ΑΠΘ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 25 },
      { subject: "Αγωνίσματα", weight: 20 },
    ],
  },
  {
    id: "school-60",
    name: "Επιστήμης Φυσικής Αγωγής και Αθλητισμού (Τρίκαλα) (ΠΑΝ ΘΕΣΣΑΛΙΑΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 20 },
      { subject: "Αγωνίσματα", weight: 20 },
    ],
  },
  {
    id: "school-61",
    name: "Επιστημών Προσχολικής Αγωγής και Εκπαίδευσης (Θεσσαλονίκη) (ΑΠΘ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-62",
    name: "Επιστημών της Εκπαίδευσης και Κοινωνικής Εργασίας (Πάτρα) (ΠΑΝ ΠΑΤΡΩΝ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 35 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-63",
    name: "Επιστημών της Εκπαίδευσης και της Αγωγής στην Προσχολική Ηλικία (Πάτρα) (ΠΑΝ ΠΑΤΡΩΝ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 40 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-64",
    name: "Επιστημών της Εκπαίδευσης στην Προσχολική Ηλικία (Αλεξ/πολη) (ΔΠΘ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-65",
    name: "Επιστημών της Προσχολικής Αγωγής και Εκπαιδευτικού Σχεδιασμού (Ρόδος) (ΠΑΝ ΑΙΓΑΙΟΥ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-66",
    name: "Εσωτερικής Αρχιτεκτονικής (Αιγάλεω) (ΠΑΝ. ΔΥΤ. ΑΤΤΙΚΗΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 35 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 20 },
      { subject: "Ελεύθερο Σχέδιο", weight: 10 },
      { subject: "Γραμμικό Σχέδιο", weight: 10 },
    ],
  },
  {
    id: "school-67",
    name: "Εσωτερικής Αρχιτεκτονικής (Σέρρες) (ΔΙΠΑΕ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
      { subject: "Ελεύθερο Σχέδιο", weight: 10 },
      { subject: "Γραμμικό Σχέδιο", weight: 10 },
    ],
  },
  {
    id: "school-68",
    name: "Ευελπίδων (ΣΣΕ) - Όπλα (ΣΣΕ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 35 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-69",
    name: "Ευελπίδων (ΣΣΕ) - Σώματα (ΣΣΕ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 35 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-70",
    name: "Εφαρμοσμένης Πληροφορικής - Επιστήμη και Τεχνολογία Υπολογιστών (Θεσσαλονίκη) (ΠΑΜΑΚ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-71",
    name: "Εφαρμοσμένης Πληροφορικής - Πληροφοριακά Συστήματα (Θεσσαλονίκη) (ΠΑΜΑΚ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-72",
    name: "Ηλεκτρονικών Μηχανικών (Χανιά) (ΕΛΜΕΠΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-73",
    name: "Θεατρικών Σπουδών (Αθήνα) (ΕΚΠΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-74",
    name: "Θεατρικών Σπουδών (Ναύπλιο) (ΠΑΝ ΠΕΛ/ΝΗΣΟΥ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-75",
    name: "Θεατρικών Σπουδών (Πάτρα) (ΠΑΝ ΠΑΤΡΩΝ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-76",
    name: "Θεάτρου (Θεσσαλονίκη) (ΑΠΘ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-77",
    name: "Ικάρων (ΣΙ) Διοικητικών (Δ) (ΣΙ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 35 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-78",
    name: "Ικάρων (ΣΙ) Εφοδιαστών (Ε) (ΣΙ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-79",
    name: "Ιστορίας και Φιλοσοφίας της Επιστήμης (Αθήνα) (ΕΚΠΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 28 },
      { subject: "Μαθηματικά", weight: 28 },
      { subject: "Πληροφορική", weight: 22 },
      { subject: "Οικονομία", weight: 22 },
    ],
  },
  {
    id: "school-80",
    name: "Κινηματογράφου (Θεσσαλονίκη) (ΑΠΘ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-81",
    name: "Κοινωνικής Πολιτικής (Αθήνα) (ΠΑΝΤΕΙΟ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-82",
    name: "Κοινωνικής Πολιτικής (Κομοτηνή) (ΔΠΘ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-83",
    name: "Λογιστικής και Πληροφοριακών Συστημάτων (Θεσσαλονίκη) (ΔΙΠΑΕ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-84",
    name: "Λογιστικής και Χρηματοοικονομικής (Αθήνα) (ΟΠΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-85",
    name: "Λογιστικής και Χρηματοοικονομικής (Αιγάλεω) (ΠΑΝ. ΔΥΤ. ΑΤΤΙΚΗΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 33 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 27 },
    ],
  },
  {
    id: "school-86",
    name: "Λογιστικής και Χρηματοοικονομικής (Ηράκλειο) (ΕΛΜΕΠΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-87",
    name: "Λογιστικής και Χρηματοοικονομικής (Θεσσαλονίκη) (ΠΑΜΑΚ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-88",
    name: "Λογιστικής και Χρηματοοικονομικής (Καβάλα) (ΔΠΘ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 35 },
    ],
  },
  {
    id: "school-89",
    name: "Λογιστικής και Χρηματοοικονομικής (Καλαμάτα) (ΠΑΝ ΠΕΛ/ΝΗΣΟΥ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-90",
    name: "Λογιστικής και Χρηματοοικονομικής (Κοζάνη) (ΠΑΝ ΔΥΤ ΜΑΚ/ΝΙΑΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-91",
    name: "Λογιστικής και Χρηματοοικονομικής (Λάρισα) (ΠΑΝ ΘΕΣΣΑΛΙΑΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 24 },
      { subject: "Μαθηματικά", weight: 24 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 27 },
    ],
  },
  {
    id: "school-92",
    name: "Λογιστικής και Χρηματοοικονομικής (Πρέβεζα) (ΠΑΝ ΙΩΑΝΝΙΝΩΝ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-93",
    name: "Μάρκετινγκ και Επικοινωνίας (Αθήνα) (ΟΠΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-94",
    name: "Μεσογειακών Σπουδών: Αρχαιολογία, Γλωσσολογία, Διεθνείς Σχέσεις (Ρόδος) (ΠΑΝ ΑΙΓΑΙΟΥ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-95",
    name: "Μηχανικών Βιομηχανικής Σχεδίασης και Παραγωγής (Αιγάλεω) (ΠΑΝ. ΔΥΤ. ΑΤΤΙΚΗΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 22 },
      { subject: "Μαθηματικά", weight: 28 },
      { subject: "Πληροφορική", weight: 28 },
      { subject: "Οικονομία", weight: 22 },
    ],
  },
  {
    id: "school-96",
    name: "Μηχανικών Οικονομίας και Διοίκησης (Χίος) (ΠΑΝ ΑΙΓΑΙΟΥ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-97",
    name: "Μηχανικών Παραγωγής και Διοίκησης (Θεσσαλονίκη) (ΔΙΠΑΕ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-98",
    name: "Μηχανικών Παραγωγής και Διοίκησης (Ξάνθη) (ΔΠΘ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-99",
    name: "Μηχανικών Παραγωγής και Διοίκησης (Χανιά) (ΠΟΛ/ΧΝΕΙΟ ΚΡΗΤΗΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-100",
    name: "Μηχανικών Πληροφοριακών και Επικοινωνιακών Συστημάτων (Σάμος) (ΠΑΝ ΑΙΓΑΙΟΥ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-101",
    name: "Μηχανικών Πληροφορικής και Ηλεκτρονικών Συστημάτων (Θεσσαλονίκη) (ΔΙΠΑΕ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-102",
    name: "Μηχανικών Πληροφορικής και Υπολογιστών (Αιγάλεω) (ΠΑΝ. ΔΥΤ. ΑΤΤΙΚΗΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 24 },
      { subject: "Μαθηματικά", weight: 28 },
      { subject: "Πληροφορική", weight: 28 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-103",
    name: "Μηχανικών Πληροφορικής, Υπολογιστών και Τηλεπικοινωνιών (Σέρρες) (ΔΙΠΑΕ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-104",
    name: "Μηχανικών Σχεδίασης Προϊόντων και Συστημάτων (Κοζάνη) (ΠΑΝ ΔΥΤ ΜΑΚ/ΝΙΑΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-105",
    name: "Μηχανικών Σχεδίασης Προϊόντων και Συστημάτων (Σύρος) (ΠΑΝ ΑΙΓΑΙΟΥ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-106",
    name: "Μονίμων Υπαξιωματικών Αεροπορίας (ΣΜΥΑ) - Κατεύθυνση Διοικητικής και Εφοδιαστικής Υποστήριξης (ΣΜΥΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-107",
    name: "Μονίμων Υπαξιωματικών Αεροπορίας (ΣΜΥΑ) - Κατεύθυνση Επιχειρησιακής Υποστήριξης (ΣΜΥΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-108",
    name: "Μονίμων Υπαξιωματικών Αεροπορίας (ΣΜΥΑ) - Κατεύθυνση Επιχειρησιακής Υποστήριξης - Ραδιοναυτίλοι (ΣΜΥΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-109",
    name: "Μονίμων Υπαξιωματικών Αεροπορίας (ΣΜΥΑ) - Κατεύθυνση Τεχνολογικής Υποστήριξης (ΣΜΥΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-110",
    name: "Μονίμων Υπαξιωματικών Ναυτικού (ΣΜΥΝ) (ΣΜΥΝ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-111",
    name: "Μονίμων Υπαξιωματικών Στρατού (ΣΜΥ) - Όπλα (ΣΜΥ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-112",
    name: "Μονίμων Υπαξιωματικών Στρατού (ΣΜΥ) - Σώματα (ΣΜΥ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-113",
    name: "Μουσικής Επιστήμης και Τέχνης (Θεσσαλονίκη) (ΠΑΜΑΚ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Μουσική Εκτέλεση και Ερμηνεία", weight: 40 },
      { subject: "Μουσική Αντίληψη, Θεωρία και Αρμονία", weight: 20 },
    ],
  },
  {
    id: "school-114",
    name: "Μουσικής Τεχνολογίας και Ακουστικής (Ρέθυμνο) (ΕΛΜΕΠΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-115",
    name: "Μουσικών Σπουδών (Αθήνα) (ΕΚΠΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Μουσική Εκτέλεση και Ερμηνεία", weight: 20 },
      { subject: "Μουσική Αντίληψη, Θεωρία και Αρμονία", weight: 30 },
    ],
  },
  {
    id: "school-116",
    name: "Μουσικών Σπουδών (Άρτα) (ΠΑΝ ΙΩΑΝΝΙΝΩΝ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Μουσική Εκτέλεση και Ερμηνεία", weight: 30 },
      { subject: "Μουσική Αντίληψη, Θεωρία και Αρμονία", weight: 20 },
    ],
  },
  {
    id: "school-117",
    name: "Μουσικών Σπουδών (Θεσσαλονίκη) (ΑΠΘ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Μουσική Εκτέλεση και Ερμηνεία", weight: 25 },
      { subject: "Μουσική Αντίληψη, Θεωρία και Αρμονία", weight: 30 },
    ],
  },
  {
    id: "school-118",
    name: "Μουσικών Σπουδών (Κέρκυρα) (ΙΟΝΙΟ ΠΑΝ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Μουσική Εκτέλεση και Ερμηνεία", weight: 30 },
      { subject: "Μουσική Αντίληψη, Θεωρία και Αρμονία", weight: 30 },
    ],
  },
  {
    id: "school-119",
    name: "Ναυτιλιακών Σπουδών (Πειραιάς) (ΠΑΝ ΠΕΙΡΑΙΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 30 },
      { subject: "Αγγλικά", weight: 20 },
    ],
  },
  {
    id: "school-120",
    name: "Ναυτιλίας και Επιχειρηματικών Υπηρεσιών (Χίος) (ΠΑΝ ΑΙΓΑΙΟΥ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-121",
    name: "Οικονομίας και Βιώσιμης Ανάπτυξης (Αθήνα) (ΧΑΡΟΚΟΠΕΙΟ ΠΑΝ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 23 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 27 },
    ],
  },
  {
    id: "school-122",
    name: "Οικονομικής Επιστήμης (Αθήνα) (ΟΠΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-123",
    name: "Οικονομικής Επιστήμης (Πειραιάς) (ΠΑΝ ΠΕΙΡΑΙΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-124",
    name: "Οικονομικής και Διοίκησης Τουρισμού (Χίος) (ΠΑΝ ΑΙΓΑΙΟΥ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 30 },
      { subject: "Αγγλικά", weight: 20 },
    ],
  },
  {
    id: "school-125",
    name: "Οικονομικής και Περιφερειακής Ανάπτυξης (Αθήνα) (ΠΑΝΤΕΙΟ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-126",
    name: "Οικονομικό (ΣΣΑΣ) (Θεσσαλονίκη) (ΣΣΑΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-127",
    name: "Οικονομικών Επιστημών (Αθήνα) (ΕΚΠΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 22 },
      { subject: "Μαθηματικά", weight: 34 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 24 },
    ],
  },
  {
    id: "school-128",
    name: "Οικονομικών Επιστημών (Βόλος) (ΠΑΝ ΘΕΣΣΑΛΙΑΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 27 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 23 },
    ],
  },
  {
    id: "school-129",
    name: "Οικονομικών Επιστημών (Θεσσαλονίκη) (ΠΑΜΑΚ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-130",
    name: "Οικονομικών Επιστημών (Θεσσαλονίκη) (ΑΠΘ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-131",
    name: "Οικονομικών Επιστημών (Ιωάννινα) (ΠΑΝ ΙΩΑΝΝΙΝΩΝ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-132",
    name: "Οικονομικών Επιστημών (Καστοριά) (ΠΑΝ ΔΥΤ ΜΑΚ/ΝΙΑΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 35 },
    ],
  },
  {
    id: "school-133",
    name: "Οικονομικών Επιστημών (Κομοτηνή) (ΔΠΘ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 28 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 32 },
    ],
  },
  {
    id: "school-134",
    name: "Οικονομικών Επιστημών (Πάτρα) (ΠΑΝ ΠΑΤΡΩΝ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 26 },
      { subject: "Μαθηματικά", weight: 26 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 28 },
    ],
  },
  {
    id: "school-135",
    name: "Οικονομικών Επιστημών (Ρέθυμνο) (ΠΑΝ ΚΡΗΤΗΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-136",
    name: "Οικονομικών Επιστημών (Σέρρες) (ΔΙΠΑΕ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 35 },
    ],
  },
  {
    id: "school-137",
    name: "Οικονομικών Επιστημών (Τρίπολη) (ΠΑΝ ΠΕΛ/ΝΗΣΟΥ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-138",
    name: "Οργάνωσης και Διαχείρισης Αθλητισμού (Σπάρτη) (ΠΑΝ ΠΕΛ/ΝΗΣΟΥ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-139",
    name: "Οργάνωσης και Διοίκησης Επιχειρήσεων (Αθήνα) (ΟΠΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-140",
    name: "Οργάνωσης και Διοίκησης Επιχειρήσεων (Γρεβενά) (ΠΑΝ ΔΥΤ ΜΑΚ/ΝΙΑΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 35 },
    ],
  },
  {
    id: "school-141",
    name: "Οργάνωσης και Διοίκησης Επιχειρήσεων (Θεσσαλονίκη) (ΠΑΜΑΚ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 23 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 22 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-142",
    name: "Οργάνωσης και Διοίκησης Επιχειρήσεων (Πειραιάς) (ΠΑΝ ΠΕΙΡΑΙΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-143",
    name: "Οργάνωσης και Διοίκησης Επιχειρήσεων (Σέρρες) (ΔΙΠΑΕ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-144",
    name: "Παιδαγωγικό Δημοτικής Εκπαίδευσης (Αθήνα) (ΕΚΠΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-145",
    name: "Παιδαγωγικό Δημοτικής Εκπαίδευσης (Αλεξ/πολη) (ΔΠΘ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-146",
    name: "Παιδαγωγικό Δημοτικής Εκπαίδευσης (Βόλος) (ΠΑΝ ΘΕΣΣΑΛΙΑΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-147",
    name: "Παιδαγωγικό Δημοτικής Εκπαίδευσης (Θεσσαλονίκη) (ΑΠΘ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-148",
    name: "Παιδαγωγικό Δημοτικής Εκπαίδευσης (Ιωάννινα) (ΠΑΝ ΙΩΑΝΝΙΝΩΝ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-149",
    name: "Παιδαγωγικό Δημοτικής Εκπαίδευσης (Ρέθυμνο) (ΠΑΝ ΚΡΗΤΗΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-150",
    name: "Παιδαγωγικό Δημοτικής Εκπαίδευσης (Ρόδος) (ΠΑΝ ΑΙΓΑΙΟΥ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-151",
    name: "Παιδαγωγικό Δημοτικής Εκπαίδευσης (Φλώρινα) (ΠΑΝ ΔΥΤ ΜΑΚ/ΝΙΑΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-152",
    name: "Παιδαγωγικό Ειδικής Αγωγής (Βόλος) (ΠΑΝ ΘΕΣΣΑΛΙΑΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-153",
    name: "Παιδαγωγικό Νηπιαγωγών (Ιωάννινα) (ΠΑΝ ΙΩΑΝΝΙΝΩΝ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-154",
    name: "Παιδαγωγικό Νηπιαγωγών (Φλώρινα) (ΠΑΝ ΔΥΤ ΜΑΚ/ΝΙΑΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-155",
    name: "Παιδαγωγικό Προσχολικής Εκπαίδευσης (Βόλος) (ΠΑΝ ΘΕΣΣΑΛΙΑΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-156",
    name: "Παιδαγωγικό Προσχολικής Εκπαίδευσης (Ρέθυμνο) (ΠΑΝ ΚΡΗΤΗΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 40 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-157",
    name: "Παραστατικών και Ψηφιακών Τεχνών (Ναύπλιο) (ΠΑΝ ΠΕΛ/ΝΗΣΟΥ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-158",
    name: "Περιβάλλοντος (Ζάκυνθος) (ΙΟΝΙΟ ΠΑΝ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-159",
    name: "Περιβάλλοντος (Λάρισα) (ΠΑΝ ΘΕΣΣΑΛΙΑΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-160",
    name: "Περιβάλλοντος (Μυτιλήνη) (ΠΑΝ ΑΙΓΑΙΟΥ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-161",
    name: "Περιφερειακής και Οικονομικής Ανάπτυξης (Άμφισσα) (ΓΕΩΠ ΠΑΝ ΑΘ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-162",
    name: "Πληροφορικής (Αθήνα) (ΟΠΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-163",
    name: "Πληροφορικής (Θεσσαλονίκη) (ΑΠΘ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-164",
    name: "Πληροφορικής (Καβάλα) (ΔΠΘ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-165",
    name: "Πληροφορικής (Καστοριά) (ΠΑΝ ΔΥΤ ΜΑΚ/ΝΙΑΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 40 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-166",
    name: "Πληροφορικής (Κέρκυρα) (ΙΟΝΙΟ ΠΑΝ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-167",
    name: "Πληροφορικής (Πειραιάς) (ΠΑΝ ΠΕΙΡΑΙΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-168",
    name: "Πληροφορικής και Τηλεματικής (Αθήνα) (ΧΑΡΟΚΟΠΕΙΟ ΠΑΝ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-169",
    name: "Πληροφορικής και Τηλεπικοινωνιών (Αθήνα) (ΕΚΠΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 35 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-170",
    name: "Πληροφορικής και Τηλεπικοινωνιών (Άρτα) (ΠΑΝ ΙΩΑΝΝΙΝΩΝ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 23 },
      { subject: "Μαθηματικά", weight: 23 },
      { subject: "Πληροφορική", weight: 31 },
      { subject: "Οικονομία", weight: 23 },
    ],
  },
  {
    id: "school-171",
    name: "Πληροφορικής και Τηλεπικοινωνιών (Λαμία) (ΠΑΝ ΘΕΣΣΑΛΙΑΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-172",
    name: "Πληροφορικής και Τηλεπικοινωνιών (Τρίπολη) (ΠΑΝ ΠΕΛ/ΝΗΣΟΥ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-173",
    name: "Πληροφορικής με Εφαρμογές στη Βιοϊατρική (Λαμία) (ΠΑΝ ΘΕΣΣΑΛΙΑΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 27 },
      { subject: "Πληροφορική", weight: 28 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-174",
    name: "Πληροφορικής (ΣΣΑΣ) (Θεσσαλονίκη) (ΣΣΑΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 35 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-175",
    name: "Πολιτισμικής Τεχνολογίας και Επικοινωνίας (Μυτιλήνη) (ΠΑΝ ΑΙΓΑΙΟΥ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-176",
    name: "Πολιτισμού και Δημιουργικών Μέσων και Βιομηχανιών (Βόλος) (ΠΑΝ ΘΕΣΣΑΛΙΑΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-177",
    name: "Πυροσβεστών (Μόνο για Πολίτες) (ΣΠΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 30 },
    ],
  },
  {
    id: "school-178",
    name: "Στατιστικής (Αθήνα) (ΟΠΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 22 },
      { subject: "Μαθηματικά", weight: 34 },
      { subject: "Πληροφορική", weight: 22 },
      { subject: "Οικονομία", weight: 22 },
    ],
  },
  {
    id: "school-179",
    name: "Στατιστικής (Γρεβενά) (ΠΑΝ ΔΥΤ ΜΑΚ/ΝΙΑΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 35 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-180",
    name: "Στατιστικής και Αναλογιστικών - Χρηματοοικονομικών Μαθηματικών (Σάμος) (ΠΑΝ ΑΙΓΑΙΟΥ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-181",
    name: "Στατιστικής και Ασφαλιστικής Επιστήμης (Πειραιάς) (ΠΑΝ ΠΕΙΡΑΙΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-182",
    name: "Συστημάτων Ενέργειας (Λάρισα) (ΠΑΝ ΘΕΣΣΑΛΙΑΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-183",
    name: "Σχολή Δοκίμων Λιμενοφυλάκων (ΛΣ-ΕΛΑΚΤ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-184",
    name: "Σχολή Δοκίμων Σημαιοφόρων Λιμενικού Σώματος - Ελληνικής Ακτοφυλακής (Μόνο για Στελέχη ΛΣ - ΕΛ.ΑΚΤ.) (ΛΣ-ΕΛΑΚΤ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-185",
    name: "Σχολή Δοκίμων Σημαιοφόρων Λιμενικού Σώματος - Ελληνικής Ακτοφυλακής (Σ.Δ.Σ.Λ.Σ. - ΕΛ.ΑΚΤ.) (ΛΣ-ΕΛΑΚΤ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 20 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-186",
    name: "Σχολή Μηχανικών (ΑΕΝ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-187",
    name: "Σχολή Πλοιάρχων (ΑΕΝ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-188",
    name: "Τεχνολογιών Ψηφιακής Βιομηχανίας (Ψαχνά Εύβοιας) (ΕΚΠΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-189",
    name: "Τεχνών Ήχου και Εικόνας (Κέρκυρα) (ΙΟΝΙΟ ΠΑΝ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-190",
    name: "Τουρισμού (Κέρκυρα) (ΙΟΝΙΟ ΠΑΝ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 30 },
      { subject: "Αγγλικά", weight: 10 },
    ],
  },
  {
    id: "school-191",
    name: "Τουριστικών Σπουδών (Πειραιάς) (ΠΑΝ ΠΕΙΡΑΙΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
      { subject: "Αγγλικά", weight: 10 },
    ],
  },
  {
    id: "school-192",
    name: "Φωτογραφίας και Οπτικοακουστικών Τεχνών (Αιγάλεω) (ΠΑΝ. ΔΥΤ. ΑΤΤΙΚΗΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 35 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-193",
    name: "Χρηματοοικονομικής και Τραπεζικής Διοικητικής (Πειραιάς) (ΠΑΝ ΠΕΙΡΑΙΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 25 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-194",
    name: "Ψηφιακών Μέσων και Επικοινωνίας (Αργοστόλι) (ΙΟΝΙΟ ΠΑΝ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 30 },
      { subject: "Μαθηματικά", weight: 20 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-195",
    name: "Ψηφιακών Συστημάτων (Λάρισα) (ΠΑΝ ΘΕΣΣΑΛΙΑΣ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 25 },
    ],
  },
  {
    id: "school-196",
    name: "Ψηφιακών Συστημάτων (Πειραιάς) (ΠΑΝ ΠΕΙΡΑΙΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 20 },
      { subject: "Μαθηματικά", weight: 30 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
  {
    id: "school-197",
    name: "Ψηφιακών Συστημάτων (Σπάρτη) (ΠΑΝ ΠΕΛ/ΝΗΣΟΥ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 22 },
      { subject: "Μαθηματικά", weight: 22 },
      { subject: "Πληροφορική", weight: 28 },
      { subject: "Οικονομία", weight: 28 },
    ],
  },
  {
    id: "school-198",
    name: "Ψηφιακών Τεχνών και Κινηματογράφου (Ψαχνά Εύβοιας) (ΕΚΠΑ)",
    coefficients: [
      { subject: "Νεοελληνική Γλώσσα και Λογοτεχνία", weight: 25 },
      { subject: "Μαθηματικά", weight: 25 },
      { subject: "Πληροφορική", weight: 30 },
      { subject: "Οικονομία", weight: 20 },
    ],
  },
];
