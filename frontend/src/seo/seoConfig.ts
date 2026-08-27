import { DEFAULT_OG_IMAGE_PATH } from '@/seo/siteMeta';

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export type PageSeo = {
  /** URL path key, e.g. `/quiz` */
  path: string;
  /** Stable slug for OG image filename (`/og/pages/{slug}.png`) */
  slug: string;
  title: string;
  description: string;
  ogTitle?: string;
  ogImage?: string;
  robots?: string;
  breadcrumbs?: BreadcrumbItem[];
  /** Include Course JSON-LD on this page */
  includeCourseSchema?: boolean;
  noindex?: boolean;
};

const og = (slug: string) => `/og/pages/${slug}.png`;

export const PAGE_SEO: Record<string, PageSeo> = {
  '/': {
    path: '/',
    slug: 'home',
    title: 'Quiz, Flashcards, Αλγόριθμοι | Πληροφορική Πανελλήνιες',
    description:
      'Δωρεάν προετοιμασία Πανελληνίων Πληροφορικής: quiz, flashcards, δομές δεδομένων, αλγόριθμοι, παλιά θέματα, ασκήσεις και οπτικοποιήσεις για Γ\' Λυκείου.',
    ogImage: og('home'),
    includeCourseSchema: true,
  },
  '/about': {
    path: '/about',
    slug: 'about',
    title: 'Σχετικά | Technotes | Quiz, Flashcards, Αλγόριθμοι',
    description:
      'Το Technotes είναι δωρεάν πλατφόρμα Πανελληνίων Πληροφορικής: quiz, flashcards, δομές δεδομένων, αλγόριθμοι, παλιά θέματα και ασκήσεις.',
    ogImage: og('about'),
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'Σχετικά', path: '/about' },
    ],
    includeCourseSchema: true,
  },
  '/privacy-policy': {
    path: '/privacy-policy',
    slug: 'privacy-policy',
    title: 'Όροι Χρήσης & Απόρρητο | Technotes',
    description:
      'Όροι χρήσης και πολιτική απορρήτου του technotes.gr. Πληροφορίες για cookies, δεδομένα χρηστών και υπηρεσίες προετοιμασίας Πληροφορικής.',
    ogImage: og('privacy-policy'),
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'Όροι & Απόρρητο', path: '/privacy-policy' },
    ],
  },
  '/data': {
    path: '/data',
    slug: 'data-protection',
    title: 'Προστασία Δεδομένων | Technotes',
    description:
      'Πολιτική προστασίας προσωπικών δεδομένων (GDPR) για την πλατφόρμα προετοιμασίας Πανελληνίων Πληροφορικής technotes.gr.',
    ogImage: og('data-protection'),
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'Προστασία Δεδομένων', path: '/data' },
    ],
  },
  '/thank-you': {
    path: '/thank-you',
    slug: 'thank-you',
    title: 'Ευχαριστούμε | Technotes',
    description:
      'Το μήνυμά σας καταχωρήθηκε. Η ομάδα Technotes θα απαντήσει εντός 48 ωρών (εργάσιμες).',
    ogImage: og('home'),
    noindex: true,
    robots: 'noindex, follow',
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'Ευχαριστίες', path: '/thank-you' },
    ],
  },
  '/gloglossa': {
    path: '/gloglossa',
    slug: 'gloglossa',
    title: 'Διερμηνευτής ΓΛΩΣΣΑΣ | Technotes',
    description:
      'Online διερμηνευτής ΓΛΩΣΣΑΣ και Ψευδογλώσσας για Πανελλήνιες Πληροφορικής (ΑΕΠΠ). Γράψε και εκτέλεσε κώδικα ΓΛΩΣΣΑΣ στον browser.',
    ogImage: og('gloglossa'),
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'Διερμηνευτής ΓΛΩΣΣΑΣ', path: '/gloglossa' },
    ],
  },
  '/announcements': {
    path: '/announcements',
    slug: 'announcements',
    title: 'Ανακοινώσεις | Technotes Πληροφορική',
    description:
      'Νέα Technotes για Πανελλήνιες Πληροφορικής: quiz, flashcards, δομές δεδομένων, αλγόριθμοι, παλιά θέματα και εργαλεία μελέτης.',
    ogImage: og('announcements'),
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'Ανακοινώσεις', path: '/announcements' },
    ],
  },
  '/faq': {
    path: '/faq',
    slug: 'faq',
    title: 'FAQ Πανελληνίων Πληροφορικής | Technotes',
    description:
      'Συχνές ερωτήσεις για Πανελλήνιες Πληροφορικής: quiz, flashcards, δομές δεδομένων, αλγόριθμοι, παλιά θέματα και δωρεάν μελέτη στο Technotes.',
    ogImage: og('faq'),
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'FAQ', path: '/faq' },
    ],
  },
  '/quiz': {
    path: '/quiz',
    slug: 'quiz',
    title: 'Quiz Πληροφορικής Πανελληνίων | Technotes',
    description:
      'Δωρεάν quiz Πληροφορικής Πανελληνίων: θεωρία, αλγόριθμοι, δομές δεδομένων και ερωτήσεις ανά κεφάλαιο με άμεση ανατροφοδότηση.',
    ogImage: og('quiz'),
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'Quiz', path: '/quiz' },
    ],
  },
  '/flashcards': {
    path: '/flashcards',
    slug: 'flashcards',
    title: 'Flashcards Πληροφορικής | Πανελλήνιες',
    description:
      'Flashcards Πληροφορικής για Πανελλήνιες: έννοιες, ορισμοί, αλγόριθμοι και δομές δεδομένων για γρήγορη επανάληψη θεωρίας.',
    ogImage: og('flashcards'),
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'Flashcards', path: '/flashcards' },
    ],
  },
  '/leaderboard': {
    path: '/leaderboard',
    slug: 'leaderboard',
    title: 'Κατάταξη Quiz | Technotes Πληροφορική',
    description:
      'Δες την κατάταξη μαθητών στο quiz Πληροφορικής. Κάνε προετοιμασία Πανελληνίων και μέτρησε την πρόοδό σου με το Technotes.',
    ogImage: og('leaderboard'),
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'Κατάταξη', path: '/leaderboard' },
    ],
  },
  '/algorithms': {
    path: '/algorithms',
    slug: 'algorithms',
    title: 'Αλγόριθμοι Πανελληνίων | Technotes',
    description:
      'Οπτικοποίηση αλγορίθμων για Πανελλήνιες Πληροφορικής: φυσαλίδα, επιλογή, σειριακή και δυαδική αναζήτηση, βήμα-βήμα.',
    ogImage: og('algorithms'),
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'Αλγόριθμοι', path: '/algorithms' },
    ],
  },
  '/domes-dedomenon': {
    path: '/domes-dedomenon',
    slug: 'domes-dedomenon',
    title: 'Δομές Δεδομένων Visualizer | Technotes',
    description:
      'Διαδραστικός οπτικοποιητής δομών δεδομένων: δέντρα, λίστες, στοίβα, ουρά και γράφοι με animations, learning mode και παραγωγή κώδικα.',
    ogImage: og('algorithms'),
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'Δομές Δεδομένων', path: '/domes-dedomenon' },
    ],
  },
  '/paliathemata': {
    path: '/paliathemata',
    slug: 'paliathemata',
    title: 'Παλιά Θέματα Πληροφορικής | Πανελλήνιες',
    description:
      'Παλιά θέματα Πανελληνίων Πληροφορικής με λύσεις: θεωρία, αλγόριθμοι, δομές δεδομένων και ασκήσεις για Γ\' Λυκείου.',
    ogImage: og('paliathemata'),
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'Παλιά Θέματα', path: '/paliathemata' },
    ],
  },
  '/prosanatolismos': {
    path: '/prosanatolismos',
    slug: 'prosanatolismos',
    title: 'Προσανατολισμός Σχολών | 4ο Πεδίο',
    description:
      'Βρες σχολές 4ου επιστημονικού πεδίου (Πληροφορική): προσανατολισμός τμημάτων, πανεπιστήμια και κατευθύνσεις για Πανελλήνιες 2026.',
    ogImage: og('prosanatolismos'),
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'Προσανατολισμός', path: '/prosanatolismos' },
    ],
  },
  '/prosanatolismos-pliroforikis': {
    path: '/prosanatolismos-pliroforikis',
    slug: 'prosanatolismos-pliroforikis',
    title: 'Προσανατολισμός Πληροφορικής | CS Career Path',
    description:
      'Τεστ καριέρας πληροφορικής: δες ποιες από τις 12 tech κατευθύνσεις σου ταιριάζουν και πάρε roadmap για να ξεκινήσεις.',
    ogImage: og('prosanatolismos'),
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'Προσανατολισμός Πληροφορικής', path: '/prosanatolismos-pliroforikis' },
    ],
  },
  '/study-timer': {
    path: '/study-timer',
    slug: 'study-timer',
    title: 'Χρονόμετρο Μελέτης | Technotes',
    description:
      'Pomodoro χρονόμετρο για οργανωμένη μελέτη Πληροφορικής Πανελληνίων. Προγραμμάτισε διαλείμματα και κράτα σταθερό ρυθμό προετοιμασίας.',
    ogImage: og('study-timer'),
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'Χρονόμετρο Μελέτης', path: '/study-timer' },
    ],
  },
  '/sxoles': {
    path: '/sxoles',
    slug: 'sxoles',
    title: 'Σχολές 4ου Πεδίου | Πληροφορική Πανελλήνιες',
    description:
      'Λίστα σχολών 4ου επιστημονικού πεδίου με βάσεις 2025, ΕΒΕ, κατηγορίες και σύγκριση προγραμμάτων σπουδών.',
    ogImage: og('sxoles'),
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'Σχολές', path: '/sxoles' },
    ],
  },
  '/progress-tracker': {
    path: '/progress-tracker',
    slug: 'progress-tracker',
    title: 'Progress Tracker | Technotes Πληροφορική',
    description:
      'Παρακολούθησε την πρόοδό σου στην Πληροφορική Πανελληνίων: quiz, flashcards, θεματικές ενότητες και στόχους προετοιμασίας.',
    ogImage: og('progress-tracker'),
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'Progress Tracker', path: '/progress-tracker' },
    ],
  },
  '/methodologies': {
    path: '/methodologies',
    slug: 'methodologies',
    title: 'Μεθοδολογίες Πληροφορικής | Πανελλήνιες',
    description:
      'Μεθοδολογίες Πληροφορικής Πανελληνίων: αλγόριθμοι, δομές δεδομένων, ασκήσεις και τεχνικές επίλυσης ανά ενότητα.',
    ogImage: og('methodologies'),
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'Μεθοδολογίες', path: '/methodologies' },
    ],
  },
  '/syntelestes-sxolon': {
    path: '/syntelestes-sxolon',
    slug: 'syntelestes-sxolon',
    title: 'Συντελεστές Σχολών 2026 | 4ο Πεδίο',
    description:
      'Συντελεστές βαθμών 2026 για σχολές 4ου επιστημονικού πεδίου. Υπολόγισε μόρια Πανελληνίων Πληροφορικής και σύγκρινε τμήματα.',
    ogImage: og('syntelestes-sxolon'),
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'Συντελεστές Σχολών', path: '/syntelestes-sxolon' },
    ],
  },
  '/saek': {
    path: '/saek',
    slug: 'saek',
    title: 'ΣΑΕΚ ΔΥΠΑ | Σχολές Ανώτερης Επαγγελματικής Κατάρτισης',
    description:
      'ΣΑΕΚ ΔΥΠΑ: δωρεάν Σχολές Ανώτερης Επαγγελματικής Κατάρτισης με ειδικότητες αιχμής και πρακτική άσκηση. Δες όλες τις σχολές και ειδικότητες.',
    ogImage: og('saek'),
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'ΣΑΕΚ', path: '/saek' },
    ],
  },
  '/vivlia': {
    path: '/vivlia',
    slug: 'vivlia',
    title: 'Σχολικά Βιβλία Πληροφορικής | Technotes',
    description:
      'Σχολικά βιβλία ΑΕΠΠ και Πληροφορικής Γ\' Λυκείου σε online προβολή — βιβλίο μαθητή και συμπληρωματικό εκπαιδευτικό υλικό.',
    ogImage: og('vivlia'),
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'Σχολικά βιβλία', path: '/vivlia' },
    ],
  },
  '/ypologismos-morion': {
    path: '/ypologismos-morion',
    slug: 'ypologismos-morion',
    title: 'Υπολογισμός Μορίων | 4ο Πεδίο Πανελλήνιες',
    description:
      'Υπολόγισε τα μόριά σου για σχολές 4ου επιστημονικού πεδίου με βάση τους συντελεστές και τους βαθμούς σου στα Πανελλήνια εξεταζόμενα μαθήματα.',
    ogImage: og('ypologismos-morion'),
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'Υπολογισμός Μορίων', path: '/ypologismos-morion' },
    ],
  },
  '/mixanografiko': {
    path: '/mixanografiko',
    slug: 'mixanografiko',
    title: 'Μηχανογραφικό (Πρόβα) | 4ο Πεδίο',
    description:
      'Φτιάξε πρόβα μηχανογραφικού για σχολές 4ου επιστημονικού πεδίου: σειρά προτίμησης, μόρια και βάσεις εισαγωγής.',
    ogImage: og('mixanografiko'),
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'Μηχανογραφικό', path: '/mixanografiko' },
    ],
  },
  '/antistoixies-sxolon': {
    path: '/antistoixies-sxolon',
    slug: 'antistoixies-sxolon',
    title: 'Αντιστοιχίες Σχολών | 4ο Πεδίο',
    description:
      'Επίσημος πίνακας αντίστοιχων τμημάτων ΑΕΙ 4ου επιστημονικού πεδίου — ποια τμήματα θεωρούνται «αντίστοιχα» μεταξύ τους.',
    ogImage: og('antistoixies-sxolon'),
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'Αντιστοιχίες Σχολών', path: '/antistoixies-sxolon' },
    ],
  },
  '/meteggrafes': {
    path: '/meteggrafes',
    slug: 'meteggrafes',
    title: 'Μετεγγραφές Φοιτητών | Προϋποθέσεις & Μόρια',
    description:
      'Προϋποθέσεις και μοριοδότηση μετεγγραφών φοιτητών ΑΕΙ — οικογενειακό εισόδημα, αδέλφια σε άλλη πόλη και λοιπά κριτήρια.',
    ogImage: og('meteggrafes'),
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'Μετεγγραφές', path: '/meteggrafes' },
    ],
  },
  '/sygkrisi-mathimaton': {
    path: '/sygkrisi-mathimaton',
    slug: 'sygkrisi-mathimaton',
    title: 'Σύγκριση Μαθημάτων Σχολών | Technotes',
    description: 'Σύγκριση εξεταζόμενων μαθημάτων και προγραμμάτων σπουδών σχολών 4ου επιστημονικού πεδίου.',
    ogImage: og('sygkrisi-mathimaton'),
    noindex: true,
  },
};

export const NOT_FOUND_SEO: PageSeo = {
  path: '/404',
  slug: '404',
  title: '404 | Η σελίδα δεν βρέθηκε | Technotes',
  description:
    'Η σελίδα που ζητήσατε δεν υπάρχει. Επιστρέψτε στην αρχική για προετοιμασία Πανελληνίων Πληροφορικής με το Technotes.',
  ogImage: DEFAULT_OG_IMAGE_PATH,
  noindex: true,
  robots: 'noindex, follow',
};

export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

export function getSeoForPathname(pathname: string): PageSeo {
  const path = normalizePathname(pathname);
  return PAGE_SEO[path] ?? NOT_FOUND_SEO;
}

/** Public indexable routes for sitemap generation. */
export const SITEMAP_PATHS = Object.values(PAGE_SEO)
  .filter((page) => !page.noindex)
  .map((page) => page.path);

export const ALL_OG_PAGES = [
  ...Object.values(PAGE_SEO),
  NOT_FOUND_SEO,
];
