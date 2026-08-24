import type { SchoolCoefficientsEntry } from '@/data/schoolCoefficients2026';
import type { School } from '@/data/schools';
import { ALL_SCHOOLS } from '@/data/schools';
import { normalizeSearch } from '@/utils/schoolCoefficientsUtils';

/** Συντομογραφίες παν/νίων: συντελεστές AeiTei → δεδομένα βάσεων (Σχολές). */
const UNI_ALIASES: Record<string, string> = {
  'ΠΑΝ ΠΑΤΡΩΝ': 'ΠΑΤΡΩΝ',
  'ΠΑΝ. ΔΥΤ. ΑΤΤΙΚΗΣ': 'ΠΑΔΑ',
  'ΠΑΝ ΔΥΤ. ΑΤΤΙΚΗΣ': 'ΠΑΔΑ',
  'ΠΑΝ ΔΥΤ ΜΑΚ/ΝΙΑΣ': 'ΔΥΤ. ΜΑΚΕΔΟΝΙΑΣ',
  'ΠΑΝ ΠΕΙΡΑΙΑ': 'ΠΑΠΕΙ',
  'ΠΑΝ ΠΕΛ/ΝΗΣΟΥ': 'ΠΕΛΟΠΟΝΝΗΣΟΥ',
  'ΠΑΝ ΘΕΣΣΑΛΙΑΣ': 'ΘΕΣΣΑΛΙΑΣ',
  'ΠΑΝ ΙΩΑΝΝΙΝΩΝ': 'ΙΩΑΝΝΙΝΩΝ',
  'ΠΑΝ ΑΙΓΑΙΟΥ': 'ΑΙΓΑΙΟΥ',
  'ΓΕΩΠ ΠΑΝ ΑΘ': 'ΓΕΩΠΟΝΙΚΟ',
  'ΧΑΡΟΚΟΠΕΙΟ ΠΑΝ': 'ΧΑΡΟΚΟΠΕΙΟ',
  'ΑΣΤΥΝ ΣΧΟΛ': 'ΑΣΤΥΝΟΜΙΑ',
  'ΣΠΑ': 'ΠΥΡΟΣΒΕΣΤΙΚΗ',
  'ΣΣΑΣ': 'ΣΣΑΣ',
  'ΣΣΕ': 'ΣΤΡΑΤΟΣ',
  'ΣΙ': 'ΑΕΡΟΠΟΡΙΑ',
  'ΣΜΥΑ': 'ΑΕΡΟΠΟΡΙΑ',
  'ΣΜΥ': 'ΣΤΡΑΤΟΣ',
  'ΣΜΥΝ': 'ΝΑΥΤΙΚΟ',
  'ΛΣ-ΕΛΑΚΤ': 'ΛΙΜΕΝΙΚΟ',
  'ΙΟΝΙΟ ΠΑΝ': 'ΙΟΝΙΟ',
  'ΠΑΝ ΚΡΗΤΗΣ': 'ΚΡΗΤΗΣ',
  'ΠΟΛ/ΧΝΕΙΟ ΚΡΗΤΗΣ': 'Πολυτεχνείο Κρήτης',
  'ΔΥΤ. ΜΑΚΕΔΟΝΙΑΣ': 'Δυτικής Μακεδονίας',
};

const SECURITY_UNI_CODES = new Set([
  'ΑΣΤΥΝ ΣΧΟΛ',
  'ΣΠΑ',
  'ΣΣΑΣ',
  'ΣΣΕ',
  'ΣΙ',
  'ΣΜΥΑ',
  'ΣΜΥ',
  'ΣΜΥΝ',
  'ΛΣ-ΕΛΑΚΤ',
]);

const NON_CITY_SUFFIXES = /^(Μόνο για|Σ\.Δ\.Σ\.|Σ\.Μ\.Υ\.|Σ\.Ν\.Δ\.)/i;

const CITY_ALIASES: Record<string, string> = {
  'Ψαχνά Εύβοιας': 'Ψαχνά',
  'Αλεξ/πολη': 'Αλεξ/πολη',
  'Αγ. Νικόλαος': 'Αγ. Νικόλαος',
};

const DEPARTMENT_ALIASES: Record<string, string> = {
  'Ανώτερη Σχολή Τουριστικής Εκπαίδευσης Κρήτης (ΑΣΤΕΚ)':
    'Αστε Κρήτης (ΑΣΤΕΚ)',
  'Ανώτερη Σχολή Τουριστικής Εκπαίδευσης Ρόδου (ΑΣΤΕΡ)':
    'Αστε Ρόδου (ΑΣΤΕΡ)',
  'Διεθνών και Ευρωπαϊκών Οικονομικών Σπουδών':
    'Διεθνών και Ευρωπαϊκών Οικ. Σπουδών',
  'Οργάνωσης και Διοίκησης Επιχειρήσεων':
    'Οργάνωσης και Διοίκησης Επιχειρήσεων',
  'Χρηματοοικονομικής και Τραπεζικής Διοικητικής':
    'Χρηματοοικονομικής & Τραπεζικής Διοικητικής',
  'Αξιωματικών Πυροσβεστικής Ακαδημίας': 'Αξιωματικών Πυροσβεστικής',
  'Αξιωματικών Πυροσβεστικής Ακαδημίας (Μόνο για Πυροσβέστες)':
    'Αξιωματικών Πυροσβεστικής (Πυροσβέστες)',
  'Αστυφυλάκων': 'Αστυφυλάκων (για Πολίτες)',
  'Πυροσβεστών': 'Πυροσβεστών (για Πολίτες)',
  'Σχολή Δοκίμων Σημαιοφόρων Λιμενικού Σώματος - Ελληνικής Ακτοφυλακής':
    'Σχολή Δοκίμων Σημαιοφόρων Λ.Σ.',
  'Μονίμων Υπαξιωματικών Αεροπορίας (ΣΜΥΑ) - Κατεύθυνση Διοικητικής και Εφοδιαστικής Υποστήριξης':
    'ΣΜΥΑ - Κατ. Διοικ. & Εφοδ. Υποστήριξης',
  'Μονίμων Υπαξιωματικών Αεροπορίας (ΣΜΥΑ) - Κατεύθυνση Επιχειρησιακής Υποστήριξης':
    'ΣΜΥΑ - Κατ. Επιχειρησιακής Υποστήριξης',
  'Μονίμων Υπαξιωματικών Αεροπορίας (ΣΜΥΑ) - Κατεύθυνση Επιχειρησιακής Υποστήριξης - Ραδιοναυτίλοι':
    'ΣΜΥΑ - Κατ. Επιχειρησιακής Υποστήριξης - Ραδιοναυτίλοι',
  'Μονίμων Υπαξιωματικών Αεροπορίας (ΣΜΥΑ) - Κατεύθυνση Τεχνολογικής Υποστήριξης':
    'ΣΜΥΑ - Κατ. Τεχνολογικής Υποστήριξης',
  'Μονίμων Υπαξιωματικών Ναυτικού (ΣΜΥΝ)':
    'ΣΜΥΝ (Μονίμων Υπαξιωματικών Ναυτικού)',
  'Μονίμων Υπαξιωματικών Στρατού (ΣΜΥ) - Σώματα': 'ΣΜΥ - Σώματα',
  'Μονίμων Υπαξιωματικών Στρατού (ΣΜΥ) - Όπλα': 'ΣΜΥ - Όπλα',
  'Ευελπίδων (ΣΣΕ) - Όπλα': 'Ευελπίδων (ΣΣΕ) - Όπλα',
  'Ευελπίδων (ΣΣΕ) - Σώματα': 'Ευελπίδων (ΣΣΕ) - Σώματα',
  'Αγροτικής Ανάπτυξης, Αγροδιατροφής και Διαχείρισης Φυσικών Πόρων':
    'Αγροτικής Ανάπτυξης',
  'Αγωγής και Φροντίδας στην Πρώιμη Παιδική Ηλικία':
    'Αγωγής και Φροντίδας στην Πρώιμη Ηλικία',
  'Αρχειονομίας, Βιβλιοθηκονομίας και Συστημάτων Πληροφόρησης':
    'Αρχειονομίας,Βιβλιοθηκονομίας και Συστημάτων Πληροφόρησης',
  'Βαλκανικών, Σλαβικών και Ανατολικών Σπουδών':
    'Βαλκανικών, Σλαβικών & Ανατολικών Σπουδών',
  'Βιβλιοθηκονομίας, Αρχειονομίας και Συστημάτων Πληροφόρησης':
    'Βιβλιοθηκονομίας & Συστημάτων Πληροφόρησης',
  'Δασολογίας και Διαχείρισης Περιβάλλοντος και Φυσικών Πόρων':
    'Δασολογίας & Διαχείρησης Περιβάλλοντος και Φυσικών Πόρων',
  'Δασολογίας και Διαχείρισης Φυσικού Περιβάλλοντος':
    'Δασολογίας και Διαχείρισης Φυσικού Περιβάλλοντος',
  'Διοίκησης Γεωργικών Επιχειρήσεων και Συστημάτων Εφοδιασμού':
    'Διοίκησης Γεωργικών Επιχειρήσεων',
  'Διοίκησης Επιχειρήσεων και Οργανισμών': 'Διοίκησης Επιχειρήσεων',
  'Εκπαίδευσης και Αγωγής στην Προσχολική Ηλικία':
    'Εκπαίδευσης και Αγωγής στην Προσχολική',
  'Επιστημών της Εκπαίδευσης και Κοινωνικής Εργασίας':
    'Επιστημών Εκπαίδευσης & Κοινωνικής Εργασίας',
  'Επιστημών της Εκπαίδευσης και της Αγωγής στην Προσχολική Ηλικία':
    'Επιστημών Της Εκπαίδευσης & Της Αγωγής Στην Προσχολική Ηλικία',
  'Εφαρμοσμένης Πληροφορικής - Επιστήμη και Τεχνολογία Υπολογιστών':
    'Εφαρμοσμένης Πληροφορικής (Επιστήμη και Τεχνολογία Υπολογιστών)',
  'Εφαρμοσμένης Πληροφορικής - Πληροφοριακά Συστήματα':
    'Εφαρμοσμένης Πληροφορικής (Πληροφοριακά Συστήματα)',
  'Μεσογειακών Σπουδών: Αρχαιολογία, Γλωσσολογία, Διεθνείς Σχέσεις':
    'Μεσογειακών Σπουδών : Αρχαιολογία,Γλωσσολογία,Διεθνέις Σχέσεις',
  'Μηχανικών Πληροφοριακών και Επικοινωνιακών Συστημάτων':
    'Μηχανικών Πληροφοριακών & Επικοινωνιακών Συστημάτων',
  'Μηχανικών Πληροφορικής και Ηλεκτρονικών Συστημάτων':
    'Μηχανικών Πληροφορικής & Ηλεκτρονικών Συστημάτων',
  'Μηχανικών Πληροφορικής, Υπολογιστών και Τηλεπικοινωνιών':
    'Μηχανικών Πληροφορικής,Υπολογιστών & Τηλεπικοινωνιών',
  'Μουσικής Τεχνολογίας και Ακουστικής': 'Μουσικής Τεχνολογίας & Ακουστικής',
  'Οικονομικής και Περιφερειακής Ανάπτυξης': 'Οικονομικής & Περιφερειακής Ανάπτυξης',
  'Πολιτισμικής Τεχνολογίας και Επικοινωνίας': 'Πολιτισμικής Τεχνολογίας & Επικοινωνίας',
  'Πολιτισμού και Δημιουργικών Μέσων και Βιομηχανιών':
    'Πολιτισμού & Δημιουργικών Μέσων και Βιομηχανιών',
  'Στατιστικής και Αναλογιστικών - Χρηματοοικονομικών Μαθηματικών':
    'Στατιστικής και Αναλογιστικών-Χρηματοοικονομικών Μαθηματικών',
  'Σχολή Μηχανικών': 'ΑΕΝ Σχολή Μηχανικών',
  'Σχολή Πλοιάρχων': 'ΑΕΝ Σχολή Πλοιάρχων',
  'Φωτογραφίας και Οπτικοακουστικών Τεχνών': 'Φωτογραφίας & Οπτικοακουστικών Τεχνών',
};

/** Σύνδεση συντελεστών AeiTei → βάσεις 2025 (Σχολές). */
const COEFFICIENT_BASIS_SCHOOL_ID: Record<string, string> = {
  'school-10': '613',
  'school-11': '872',
  'school-12': '869',
  'school-13': '877',
  'school-14': '871',
  'school-16': '870',
  'school-68': '801',
  'school-69': '806',
  'school-77': '886',
  'school-78': '887',
  'school-106': '880',
  'school-107': '879',
  'school-108': '888',
  'school-109': '878',
  'school-110': '864',
  'school-111': '862',
  'school-112': '863',
  'school-126': '867',
  'school-174': '889',
  'school-177': '876',
  'school-183': '882',
  'school-184': '873',
  'school-185': '881',
  'school-2': '1001',
  'school-5': '1610',
  'school-6': '1241',
  'school-7': '1276',
  'school-15': '668',
  'school-17': '176',
  'school-18': '1609',
  'school-24': '212',
  'school-25': '1061',
  'school-34': '1063',
  'school-40': '1514',
  'school-52': '154',
  'school-54': '342',
  'school-55': '216',
  'school-62': '1286',
  'school-63': '136',
  'school-70': '1211',
  'school-71': '1212',
  'school-73': '146',
  'school-74': '362',
  'school-75': '169',
  'school-94': '181',
  'school-99': '230',
  'school-100': '344',
  'school-101': '1625',
  'school-103': '1622',
  'school-114': '1664',
  'school-118': '407',
  'school-124': '612',
  'school-125': '152',
  'school-135': '321',
  'school-149': '132',
  'school-156': '158',
  'school-158': '1453',
  'school-166': '366',
  'school-175': '354',
  'school-176': '1435',
  'school-179': '1547',
  'school-180': '218',
  'school-186': '818',
  'school-187': '817',
  'school-189': '367',
  'school-190': '1455',
  'school-192': '677',
  'school-194': '1456',
};

function normalizeUni(raw: string): string {
  const key = raw.trim();
  return UNI_ALIASES[key] ?? key;
}

function normalizeCity(raw: string): string {
  const key = raw.trim();
  return CITY_ALIASES[key] ?? key;
}

function normalizeDepartment(raw: string): string {
  const aliased = DEPARTMENT_ALIASES[raw.trim()] ?? raw.trim();
  return normalizeSearch(aliased);
}

function resolveCity(rawCity: string, uniCode: string): string {
  if (
    SECURITY_UNI_CODES.has(uniCode) ||
    NON_CITY_SUFFIXES.test(rawCity) ||
    rawCity.length <= 3 ||
    rawCity.includes('ΕΛ.ΑΚΤ')
  ) {
    return 'Μη προσδιορισμένη';
  }
  return normalizeCity(rawCity);
}

export function parseCoefficientSchoolName(fullName: string): {
  department: string;
  city: string;
  uni: string;
} | null {
  const groups = [...fullName.matchAll(/\(([^)]+)\)/g)].map((m) => m[1].trim());
  if (groups.length === 0) return null;

  if (groups.length === 1) {
    const uniCode = groups[0];
    return {
      department: fullName.replace(/\s*\([^)]+\)\s*$/, '').trim(),
      city: 'Μη προσδιορισμένη',
      uni: normalizeUni(uniCode),
    };
  }

  const uniCode = groups[groups.length - 1];
  const rawCity = groups[groups.length - 2];
  let department = fullName;
  for (let i = 0; i < 2; i++) {
    department = department.replace(/\s*\([^)]+\)\s*$/, '');
  }

  return {
    department: department.trim(),
    city: resolveCity(rawCity, uniCode),
    uni: normalizeUni(uniCode),
  };
}

function schoolLookupKey(name: string, city: string, uni: string): string {
  return `${normalizeDepartment(name)}|${normalizeSearch(normalizeCity(city))}|${normalizeSearch(normalizeUni(uni))}`;
}

const BASIS_BY_SCHOOL_ID = new Map<string, School>(ALL_SCHOOLS.map((s) => [s.id, s]));

const BASIS_BY_KEY = new Map<string, School>(
  ALL_SCHOOLS.map((s) => [schoolLookupKey(s.name, s.city, s.uni), s]),
);

function fuzzyMatchBasis(parsed: {
  department: string;
  city: string;
  uni: string;
}): School | null {
  const deptNorm = normalizeDepartment(parsed.department);
  const cityNorm = normalizeSearch(normalizeCity(parsed.city));
  const uniNorm = normalizeSearch(normalizeUni(parsed.uni));

  let best: { school: School; score: number } | null = null;

  for (const school of ALL_SCHOOLS) {
    const sUni = normalizeSearch(normalizeUni(school.uni));
    if (sUni !== uniNorm) continue;

    let score = 3;
    const sCity = normalizeSearch(normalizeCity(school.city));
    if (sCity === cityNorm) score += 2;
    else if (
      parsed.city === 'Μη προσδιορισμένη' &&
      school.city === 'Μη προσδιορισμένη'
    ) {
      score += 2;
    }

    const sDept = normalizeDepartment(school.name);
    if (sDept === deptNorm) {
      score += 5;
    } else {
      const words = deptNorm.split(' ').filter((w) => w.length > 3);
      score += Math.min(
        words.filter((w) => sDept.includes(w)).length,
        4,
      );
      if (
        sDept.includes(deptNorm.slice(0, 12)) ||
        deptNorm.includes(sDept.slice(0, 12))
      ) {
        score += 2;
      }
    }

    if (score >= 7 && (!best || score > best.score)) {
      best = { school, score };
    }
  }

  return best?.school ?? null;
}

/** Πόλη εμφάνισης: προτεραιότητα στα δεδομένα βάσεων, αλλιώς από το όνομα συντελεστών. */
export function getSchoolDisplayCity(
  entry: SchoolCoefficientsEntry,
  basis: School | null,
): string | null {
  if (basis?.city && basis.city !== 'Μη προσδιορισμένη') {
    return basis.city;
  }
  const parsed = parseCoefficientSchoolName(entry.name);
  if (parsed?.city && parsed.city !== 'Μη προσδιορισμένη') {
    return parsed.city;
  }
  return null;
}

export function matchSchoolBasis(entry: SchoolCoefficientsEntry): School | null {
  const mappedId = COEFFICIENT_BASIS_SCHOOL_ID[entry.id];
  if (mappedId) {
    return BASIS_BY_SCHOOL_ID.get(mappedId) ?? null;
  }

  const parsed = parseCoefficientSchoolName(entry.name);
  if (!parsed) return null;

  return (
    BASIS_BY_KEY.get(
      schoolLookupKey(parsed.department, parsed.city, parsed.uni),
    ) ?? fuzzyMatchBasis(parsed)
  );
}

export type ParsedEbePart = { label: string; value: number };

export type ParsedEbe = {
  /** ΕΒΕ των 4 βασικών (μη επισημασμένος αριθμός στην αρχή). */
  core: number | null;
  /** ΕΒΕ ειδικών μαθημάτων, π.χ. «Ξένη Γλώσσα 13.81». */
  specials: ParsedEbePart[];
};

/** Σπάει σύνθετες ΕΒΕ τύπου «12.99, Ξένη Γλώσσα 13.81». */
export function parseEbeParts(raw: string): ParsedEbe {
  const specials: ParsedEbePart[] = [];
  let core: number | null = null;
  let lastIndex = 0;
  const re = /\d+(?:[.,]\d+)?/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(raw)) !== null) {
    const value = Number(match[0].replace(',', '.'));
    if (!Number.isFinite(value)) continue;
    const label = raw.slice(lastIndex, match.index).replace(/^[,\s]+|[,\s]+$/g, '');
    lastIndex = match.index + match[0].length;
    if (!label) {
      if (core === null) core = value;
    } else {
      specials.push({ label, value });
    }
  }
  return { core, specials };
}

export function parseEbeGrade(raw: string): number | null {
  return parseEbeParts(raw).core;
}

export function formatEbeDisplay(raw: string): string {
  return raw.replace('.', ',');
}

export function formatMoriaPoints(value: number): string {
  return value.toLocaleString('el-GR');
}

/** Μορφή AeiTei: 16.750 */
export function formatMoriaDisplay(value: number): string {
  const whole = Math.floor(value / 1000);
  const frac = value % 1000;
  return `${whole.toLocaleString('el-GR')}.${frac.toString().padStart(3, '0')}`;
}

export function formatGradeDisplay(value: number): string {
  return value.toFixed(2).replace('.', ',');
}

export function averageCoreGrade(grades: number[]): number | null {
  if (grades.length === 0) return null;
  const sum = grades.reduce((a, b) => a + b, 0);
  return Math.round((sum / grades.length) * 100) / 100;
}
