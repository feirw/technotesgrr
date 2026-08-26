import React from 'react';

const HP = '/images/home%20page';

/** Custom pixel icons — ίδια paths στο μενού, στην αρχική και στις σελίδες. */
export const MENU_ICONS = {
  home: `${HP}/16.png`,
  about: `${HP}/4.png`,
  announcements: `${HP}/7.png`,
  quiz: `${HP}/11.png`,
  flashcards: `${HP}/10.png`,
  methodologies: `${HP}/13.png`,
  aiCorrector: `${HP}/5.png`,
  schools: `${HP}/6.png`,
  syntelestesSxolon: `${HP}/15.png`,
  ypologismosMorion: `${HP}/40.png`,
  paliathemata: `${HP}/2.png`,
  gloglossa: `${HP}/12.png`,
  progressTracker: `${HP}/14.png`,
  studyTimer: `${HP}/3.png`,
  prosanatolismos: `${HP}/17.png`,
  algorithms: `${HP}/5.png`,
  dataStructures: `${HP}/51.png`,
  takeABreath: `${HP}/8.png`,
  faq: `${HP}/17.png`,
  saek: `${HP}/44.png`,
  mixanografiko: `${HP}/47.png`,
  antistixia: `${HP}/48.png`,
  meteggrafes: `${HP}/49.png`,
  vivlia: `${HP}/50.png`,
  prosanatolismosPliroforikis: `${HP}/23.png`,
} as const;

/** Εικονίδια σημειώσεων στη σελίδα Σχολών. */
export const SCHOOL_PAGE_NOTICE_ICONS = {
  panellinies: `${HP}/41.png`,
  credits: `${HP}/42.png`,
  note: `${HP}/43.png`,
  saek: `${HP}/44.png`,
} as const;

/** Εικονίδιο «Μελλοντική καριέρα» στη σελίδα Σχολών. */
export const FUTURE_CAREERS_ICON = `${HP}/45.png`;

/** Pixel icons 22–39 — κατηγορίες στη σελίδα Σχολών. */
export const SCHOOL_CATEGORY_ICONS = {
  economics: `${HP}/22.png`,
  informatics: `${HP}/23.png`,
  energy: `${HP}/24.png`,
  industry: `${HP}/25.png`,
  accounting: `${HP}/26.png`,
  marketing: `${HP}/27.png`,
  management: `${HP}/28.png`,
  international: `${HP}/29.png`,
  statistics: `${HP}/30.png`,
  security: `${HP}/31.png`,
  maritime: `${HP}/32.png`,
  education: `${HP}/33.png`,
  humanities: `${HP}/34.png`,
  music: `${HP}/35.png`,
  arts: `${HP}/36.png`,
  sports: `${HP}/37.png`,
  geography: `${HP}/38.png`,
  fashion: `${HP}/39.png`,
} as const;

export const SCHOOL_CATEGORY_ICON_BY_NAME: Record<string, string> = {
  Πληροφορική: SCHOOL_CATEGORY_ICONS.informatics,
  'Ενέργεια & Μηχανική': SCHOOL_CATEGORY_ICONS.energy,
  'Βιομηχανία & Προϊόν': SCHOOL_CATEGORY_ICONS.industry,
  Βιομηχανία: SCHOOL_CATEGORY_ICONS.industry,
  Οικονομικά: SCHOOL_CATEGORY_ICONS.economics,
  'Λογιστική & Χρηματοοικονομικά': SCHOOL_CATEGORY_ICONS.accounting,
  'Διοίκηση Επιχειρήσεων': SCHOOL_CATEGORY_ICONS.management,
  'Marketing & Επικοινωνία': SCHOOL_CATEGORY_ICONS.marketing,
  'Διοικητικής Επιστήμης': SCHOOL_CATEGORY_ICONS.statistics,
  'Διεθνών & Ευρωπαϊκών': SCHOOL_CATEGORY_ICONS.international,
  Στατιστική: SCHOOL_CATEGORY_ICONS.statistics,
  'Σώματα Ασφαλείας & Στρατιωτικές': SCHOOL_CATEGORY_ICONS.security,
  'Ναυτιλιακά & Τουρισμός': SCHOOL_CATEGORY_ICONS.maritime,
  Παιδαγωγικά: SCHOOL_CATEGORY_ICONS.education,
  'Ανθρωπιστικά & Κοινωνικά': SCHOOL_CATEGORY_ICONS.humanities,
  'Μουσική & Πολιτισμός': SCHOOL_CATEGORY_ICONS.music,
  Τέχνες: SCHOOL_CATEGORY_ICONS.arts,
  Αθλητισμός: SCHOOL_CATEGORY_ICONS.sports,
  'Άλλα (Γεωγραφία, Περιβάλλον κ.α.)': SCHOOL_CATEGORY_ICONS.geography,
  'Σχέδιο Μόδας': SCHOOL_CATEGORY_ICONS.fashion,
  Logistics: SCHOOL_CATEGORY_ICONS.industry,
};

export function getSchoolCategoryIcon(category: string): string {
  return SCHOOL_CATEGORY_ICON_BY_NAME[category] ?? SCHOOL_CATEGORY_ICONS.education;
}

export type MenuIconKey = keyof typeof MENU_ICONS;

export function menuIconWebpSrc(pngSrc: string): string {
  return pngSrc.endsWith('.png') ? pngSrc.replace(/\.png$/, '-96.webp') : pngSrc;
}

const CRITICAL_NAV_ICON_PNGS = [
  MENU_ICONS.home,
  MENU_ICONS.about,
  MENU_ICONS.announcements,
  MENU_ICONS.faq,
];

const ALL_MENU_ICON_PNG_URLS = [
  ...new Set([
    ...Object.values(MENU_ICONS),
    ...Object.values(SCHOOL_PAGE_NOTICE_ICONS),
    FUTURE_CAREERS_ICON,
    ...Object.values(SCHOOL_CATEGORY_ICONS),
  ]),
];

const prefetchedMenuIconUrls = new Set<string>();

/** Warm cache for a small set of icons without flooding the network. */
export function prefetchMenuIcons(urls: string[] = CRITICAL_NAV_ICON_PNGS): void {
  if (typeof document === 'undefined') return;

  for (const png of urls) {
    const webp = menuIconWebpSrc(png);
    if (prefetchedMenuIconUrls.has(webp)) continue;
    prefetchedMenuIconUrls.add(webp);
    const img = new Image();
    img.src = webp;
  }
}

export function prefetchAllMenuIcons(): void {
  prefetchMenuIcons(ALL_MENU_ICON_PNG_URLS);
}

/** Σταθερό πλαίσιο + μέγεθος για ευθυγράμμιση icons στο μενού. */
export const MENU_ICON_SLOT = 'inline-flex h-9 w-9 shrink-0 items-center justify-center';
export const MENU_ICON_SIZE = 'h-8 w-8';
export const MENU_ICON_SIZE_COMPACT = 'h-7 w-7';

export const MenuIconImg: React.FC<{
  src: string;
  className?: string;
  alt?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
}> = ({
  src,
  className = MENU_ICON_SIZE,
  alt,
  loading = 'lazy',
  fetchPriority = 'low',
}) => {
  const webpSrc = menuIconWebpSrc(src);

  return (
    <picture>
      <source type="image/webp" srcSet={webpSrc} />
      <img
        src={src}
        alt={alt ?? ''}
        aria-hidden={alt ? undefined : true}
        className={`${className} object-contain shrink-0 mix-blend-normal [image-rendering:pixelated]`}
        decoding="async"
        loading={loading}
        fetchPriority={fetchPriority}
        width={96}
        height={96}
      />
    </picture>
  );
};

export const MenuNavIcon: React.FC<{ src: string; compact?: boolean; label?: string }> = ({
  src,
  compact = false,
  label,
}) => (
  <span className={MENU_ICON_SLOT} aria-hidden={label ? undefined : true}>
    <MenuIconImg
      src={src}
      className={compact ? MENU_ICON_SIZE_COMPACT : MENU_ICON_SIZE}
      fetchPriority="high"
      loading="eager"
      alt={label}
    />
  </span>
);

const PAGE_MENU_ICON_LABELS: Record<MenuIconKey, string> = {
  home: 'Αρχική',
  about: 'Σχετικά',
  announcements: 'Ανακοινώσεις',
  quiz: 'Quiz',
  flashcards: 'Flashcards',
  methodologies: 'Μεθοδολογίες',
  aiCorrector: 'AI Διορθωτής',
  schools: 'Σχολές',
  syntelestesSxolon: 'Συντελεστές σχολών',
  ypologismosMorion: 'Υπολογισμός μορίων',
  paliathemata: 'Παλιά θέματα',
  gloglossa: 'Διερμηνευτής ΓΛΩΣΣΑΣ',
  progressTracker: 'Πρόοδος',
  studyTimer: 'Χρονόμετρο μελέτης',
  prosanatolismos: 'Προσανατολισμός',
  algorithms: 'Αλγόριθμοι',
  dataStructures: 'Δομές δεδομένων',
  takeABreath: 'Take a breath',
  faq: 'FAQ',
  saek: 'ΣΑΕΚ',
  mixanografiko: 'Μηχανογραφικό',
  antistixia: 'Αντιστοιχίες σχολών',
  meteggrafes: 'Μεταγγραφές',
  vivlia: 'Βιβλία',
  prosanatolismosPliroforikis: 'Προσανατολισμός Πληροφορικής',
};

export const PageMenuIcon: React.FC<{
  icon: MenuIconKey;
  wrapperClassName?: string;
  className?: string;
  label?: string;
}> = ({
  icon,
  wrapperClassName = 'inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 mb-3',
  className = 'w-10 h-10 sm:w-12 sm:h-12',
  label,
}) => (
  <div className={wrapperClassName}>
    <MenuIconImg
      src={MENU_ICONS[icon]}
      className={className}
      alt={label ?? PAGE_MENU_ICON_LABELS[icon]}
      loading="eager"
      fetchPriority="high"
    />
  </div>
);
