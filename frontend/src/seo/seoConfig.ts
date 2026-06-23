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
    title: 'Πληροφορική Πανελλήνιες | Technotes | ΑΕΠΠ & Quiz',
    description:
      'Δωρεάν προετοιμασία Πανελληνίων Πληροφορικής: quiz, flashcards, ΑΕΠΠ, δομημένος προγραμματισμός, παλιά θέματα και ασκήσεις για Γ\' Λυκείου. Ξεκίνα τώρα!',
    ogImage: og('home'),
    includeCourseSchema: true,
  },
  '/about': {
    path: '/about',
    slug: 'about',
    title: 'Σχετικά | Technotes | Ιδιαίτερα Πληροφορικής',
    description:
      'Γνώρισε την Ελένη και το Technotes: online φροντιστήριο Πληροφορικής για Πανελλήνιες, με έμφαση σε ΑΕΠΠ, θεωρία και πρακτική εξάσκηση.',
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
      'Όροι χρήσης και πολιτική απορρήτου του technotesgr.com. Πληροφορίες για cookies, δεδομένα χρηστών και υπηρεσίες προετοιμασίας Πληροφορικής.',
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
      'Πολιτική προστασίας προσωπικών δεδομένων (GDPR) για την πλατφόρμα προετοιμασίας Πανελληνίων Πληροφορικής technotesgr.com.',
    ogImage: og('data-protection'),
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'Προστασία Δεδομένων', path: '/data' },
    ],
  },
  '/gloglossa': {
    path: '/gloglossa',
    slug: 'gloglossa',
    title: 'GloGlossa | Ορολογία Πληροφορικής Πανελληνίων',
    description:
      'GloGlossa: γλωσσάρι όρων Πληροφορικής για Πανελλήνιες, ΑΕΠΠ, αλγόριθμοι, δομές δεδομένων και θεωρία μαθήματος Γ\' Λυκείου.',
    ogImage: og('gloglossa'),
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'GloGlossa', path: '/gloglossa' },
    ],
  },
  '/announcements': {
    path: '/announcements',
    slug: 'announcements',
    title: 'Ανακοινώσεις | Technotes Πληροφορική',
    description:
      'Νέα, ενημερώσεις και ανακοινώσεις για την προετοιμασία Πανελληνίων Πληροφορικής, quiz, ύλη και εργαλεία μελέτης στο Technotes.',
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
      'Απαντήσεις σε συχνές ερωτήσεις για Πανελλήνιες Πληροφορικής: ΑΕΠΠ, δομημένος προγραμματισμός, βαθμολογία, ύλη και στρατηγική μελέτης.',
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
      'Δωρεάν quiz Πληροφορικής για Πανελλήνιες: ΑΕΠΠ, δομημένος προγραμματισμός, θεωρία και κατηγορίες ερωτήσεων με άμεση ανατροφοδότηση.',
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
      'Flashcards για γρήγορη επανάληψη Πληροφορικής Πανελληνίων: έννοιες, ΑΕΠΠ, ορισμοί και θεωρία μαθήματος Γ\' Λυκείου.',
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
      'Οπτικοποιήσεις και υλικό αλγορίθμων για Πανελλήνιες Πληροφορικής: ΑΕΠΠ, δομημένος προγραμματισμός και κατανόηση βημάτων εκτέλεσης.',
    ogImage: og('algorithms'),
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'Αλγόριθμοι', path: '/algorithms' },
    ],
  },
  '/paliathemata': {
    path: '/paliathemata',
    slug: 'paliathemata',
    title: 'Παλιά Θέματα Πληροφορικής | Πανελλήνιες',
    description:
      'Αρχείο παλιών θεμάτων Πανελληνίων Πληροφορικής με λύσεις. Εξάσκηση σε ΑΕΠΠ, θεωρία και δομημένο προγραμματισμό για Γ\' Λυκείου.',
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
      'Λίστα σχολών 4ου επιστημονικού πεδίου με βάσεις 2025, ΕΒΕ και κατηγορίες. Πληροφορική, Οικονομικά, Μηχανικού και άλλα τμήματα.',
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
      'Μεθοδολογίες και τεχνικές επίλυσης για Πανελληνίες Πληροφορικής: ΑΕΠΠ, δομημένος προγραμματισμός, θεωρία και πρακτικές ασκήσεις.',
    ogImage: og('methodologies'),
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'Μεθοδολογίες', path: '/methodologies' },
    ],
  },
  '/askiseis': {
    path: '/askiseis',
    slug: 'askiseis',
    title: 'Ασκήσεις Πληροφορικής | Πανελλήνιες',
    description:
      'Ασκήσεις προετοιμασίας για Πανελλήνιες Πληροφορικής: ΑΕΠΠ, θεωρία, δομημένος προγραμματισμός και εξάσκηση ανά ενότητα.',
    ogImage: og('askiseis'),
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'Ασκήσεις', path: '/askiseis' },
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
  '/ypologismos-morion': {
    path: '/ypologismos-morion',
    slug: 'ypologismos-morion',
    title: 'Υπολογισμός Μορίων | Πανελλήνιες 4ο Πεδίο',
    description:
      'Υπολογισμός μορίων Πανελληνίων για 4ο πεδίο: βάλε βαθμούς, δες μόρια ανά σχολή, βάσεις 2025 και διαφορά από ΕΒΕ.',
    ogImage: og('ypologismos-morion'),
    breadcrumbs: [
      { name: 'Αρχική', path: '/' },
      { name: 'Υπολογισμός Μορίων', path: '/ypologismos-morion' },
    ],
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
