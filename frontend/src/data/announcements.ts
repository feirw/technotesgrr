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
    id: '1',
    date: '2026-04-09',
    title: 'ΠΡΟΓΡΑΜΜΑ ΠΑΝΕΛΛΗΝΙΩΝ',
    body: 'Ανακοίνωση του Υπουργείου Παιδείας για το πρόγραμμα των Πανελλαδικών.',
    link: 'https://www.minedu.gov.gr/news/62639-11-09-25-programma-panelladikon-eksetaseon-2026',
    linkLabel: 'Άνοιγμα στο minedu.gov.gr',
  },
];
