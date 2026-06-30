/**
 * Στατικές ανακοινώσεις για `/announcements`.
 * Πρόσθεσε/άλλαξε γραμμές εδώ και κάνε deploy — χωρίς API ή βάση.
 */
export interface Announcement {
  /** Προαιρετικό id για κλειδιά React */
  id: string;
  /** Εμφανίζεται ως ημερομηνία (π.χ. 2026-04-09 ή 9 Απριλίου 2026) */
  date: string;
  title: string;
  /** Πλήρες κείμενο· υποστηρίζονται αλλαγές γραμμής με \n */
  body: string;
  /** Προαιρετικός εξωτερικός σύνδεσμος (https://… ή www.…) */
  link?: string;
  /** Κείμενο για το link (π.χ. «Δες το έγγραφο»). Αν λείπει, εμφανίζεται συνοπτικά το URL. */
  linkLabel?: string;
}

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: '3',
    date: '2026-06-29',
    title: 'Μηχανογραφικό 2026: Προθεσμία κωδικού',
    body:
      'Λήγει την Τρίτη 30 Ιουνίου η προθεσμία για απόκτηση προσωπικού κωδικού ασφαλείας (password) από το Λύκειο — απαραίτητου για υποβολή Μηχανογραφικού Δελτίου και Παράλληλου Μηχανογραφικού (ΣΑΕΚ). Ισχύει για υποψηφίους ΓΕΛ/ΕΠΑΛ 2026, αποφοίτους 10% και τελειόφοιους που υποβάλλουν μόνο Π.Μ.Δ. Μην αφήνετε την τελευταία στιγμή.',
    link: 'https://www.dnews.gr/eidhseis/paideia/596808/vaseis-2026-ligei-tin-triti-30-iouniou-i-prothesmia-gia-ton-kodiko-gia-ypovoli-mixanografikoy',
    linkLabel: 'Διάβασε στο Dnews',
  },
  {
    id: '2',
    date: '2026-06-18',
    title: 'Αποτελέσματα Πανελληνίων',
    body:
      'Χρονοδιάγραμμα μέχρι τις Βάσεις 2026: 23/6 καταχώριση κινητού για SMS, 26/6 ανακοίνωση βαθμολογιών γενικής εξέτασης, 30/6 λήξη για password από τα Λύκεια. Οι βάσεις αναμένονται τέλη Ιουλίου (εκτίμηση 28–30/7).',
    link: 'https://www.dnews.gr/eidhseis/paideia/594847/apotelesmata-panellinion-2026-oi-imerominies-orosimo-mexri-tis-vaseis',
    linkLabel: 'Διάβασε στο Dnews',
  },
  {
    id: '1',
    date: '2026-04-09',
    title: 'ΠΡΟΓΡΑΜΜΑ ΠΑΝΕΛΛΗΝΙΩΝ',
    body: 'Ανακοίνωση του Υπουργείου Παιδείας για το πρόγραμμα των Πανελλαδικών.',
    link: 'https://www.minedu.gov.gr/news/62639-11-09-25-programma-panelladikon-eksetaseon-2026',
    linkLabel: 'Άνοιγμα στο minedu.gov.gr',
  },
];
