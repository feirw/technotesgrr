/** Career orientation quiz — scoring engine (50 questions × 8 categories). */

export type CategoryKey =
  | 'INFO'
  | 'FIN'
  | 'DIOIK'
  | 'OIK'
  | 'SERV'
  | 'PEDAGOGIKA'
  | 'SOMATA'
  | 'TEXNES';

export const CATEGORY_KEYS: CategoryKey[] = [
  'INFO',
  'FIN',
  'DIOIK',
  'OIK',
  'SERV',
  'PEDAGOGIKA',
  'SOMATA',
  'TEXNES',
];

/** Per-question weights: [INFO, FIN, DIOIK, OIK, SERV, PED, SOM, TEX] */
export const SCORE_MATRIX: Record<number, number[]> = {
  1: [4, 3, 1, 3, 0, 0, 1, 0],
  2: [4, 2, 0, 3, 0, 0, 0, 1],
  3: [4, 1, 0, 3, 1, 0, 0, 2],
  4: [3, 1, 2, 2, 1, 0, 0, 4],
  5: [2, 4, 3, 2, 0, 1, 3, 0],
  6: [3, 4, 1, 3, 0, 0, 1, 0],
  7: [4, 3, 0, 3, 0, 0, 0, 0],
  8: [2, 0, 1, 0, 0, 1, 0, 4],
  9: [3, 1, 2, 4, 1, 0, 0, 1],
  10: [3, 3, 2, 3, 0, 0, 1, 0],
  11: [2, 0, 3, 0, 4, 0, 2, 3],
  12: [3, 4, 1, 3, 0, 0, 1, 0],
  13: [0, 0, 1, 0, 1, 4, 0, 3],
  14: [2, 1, 4, 1, 2, 0, 3, 0],
  15: [2, 4, 1, 2, 0, 0, 0, 0],
  16: [3, 3, 2, 2, 1, 0, 1, 1],
  17: [1, 2, 3, 2, 2, 3, 1, 0],
  18: [3, 3, 2, 3, 0, 0, 1, 0],
  19: [1, 0, 5, 0, 3, 1, 2, 0],
  20: [2, 1, 3, 1, 1, 1, 1, 0],
  21: [1, 0, 4, 0, 4, 2, 2, 1],
  22: [3, 2, 0, 3, 0, 0, 0, 4],
  23: [0, 0, 2, 0, 2, 5, 0, 0],
  24: [1, 0, 3, 0, 4, 3, 0, 1],
  25: [4, 3, 0, 3, 0, 0, 0, 3],
  26: [1, 0, 2, 1, 2, 4, 1, 1],
  27: [2, 4, 3, 2, 1, 1, 3, 0],
  28: [3, 3, 3, 2, 1, 0, 3, 0],
  29: [1, 2, 3, 1, 2, 1, 5, 0],
  30: [3, 2, 3, 1, 3, 0, 4, 1],
  31: [0, 3, 1, 2, 0, 1, 4, 0],
  32: [2, 2, 3, 1, 2, 0, 4, 0],
  33: [3, 2, 3, 1, 2, 0, 3, 0],
  34: [3, 1, 3, 0, 3, 0, 2, 2],
  35: [1, 5, 3, 1, 2, 0, 1, 0],
  36: [1, 1, 4, 0, 2, 0, 4, 2],
  37: [1, 0, 2, 1, 3, 5, 1, 1],
  38: [1, 0, 1, 2, 1, 5, 0, 3],
  39: [1, 2, 5, 0, 2, 0, 3, 0],
  40: [3, 3, 1, 4, 0, 2, 1, 2],
  41: [1, 0, 1, 2, 1, 5, 0, 4],
  42: [3, 0, 1, 0, 0, 1, 0, 5],
  43: [3, 0, 2, 1, 2, 0, 0, 4],
  44: [4, 1, 1, 3, 1, 0, 0, 3],
  45: [4, 0, 2, 1, 1, 0, 0, 4],
  46: [0, 0, 1, 0, 0, 0, 0, 5],
  47: [3, 0, 2, 1, 2, 0, 0, 4],
  48: [4, 1, 2, 0, 1, 0, 3, 2],
  49: [3, 0, 2, 0, 2, 1, 4, 2],
  50: [4, 1, 3, 1, 3, 0, 2, 3],
};

export const QUESTION_IDS = Object.keys(SCORE_MATRIX).map(Number);

/** Σ(weight) ανά κατηγορία — χρησιμοποιείται για neutral baseline και μέγιστη δυνατή απόκλιση. */
const WEIGHT_SUMS: Record<CategoryKey, number> = CATEGORY_KEYS.reduce(
  (acc, cat, i) => {
    acc[cat] = QUESTION_IDS.reduce((sum, id) => sum + (SCORE_MATRIX[id]?.[i] ?? 0), 0);
    return acc;
  },
  {} as Record<CategoryKey, number>
);

/** Σ(weight × 3) — αναμενόμενο σκορ αν όλες οι απαντήσεις είναι 3 (ουδέτερο). */
export const NEUTRAL_SCORES: Record<CategoryKey, number> = CATEGORY_KEYS.reduce(
  (acc, cat) => {
    acc[cat] = WEIGHT_SUMS[cat] * 3;
    return acc;
  },
  {} as Record<CategoryKey, number>
);

/**
 * Μέγιστη δυνατή απόκλιση από το ουδέτερο ανά κατηγορία: Σ(weight) × 2 (απάντηση 5 σε όλα, ή 1 σε όλα).
 * Οι κατηγορίες έχουν πολύ διαφορετικό άθροισμα βαρών (π.χ. INFO ≈115 vs PEDAGOGIKA ≈47), οπότε η ακατέργαστη
 * απόκλιση δεν συγκρίνεται δίκαια μεταξύ κατηγοριών — πρέπει να κανονικοποιείται πριν την κατάταξη.
 */
const MAX_DEVIATION: Record<CategoryKey, number> = CATEGORY_KEYS.reduce(
  (acc, cat) => {
    acc[cat] = WEIGHT_SUMS[cat] * 2;
    return acc;
  },
  {} as Record<CategoryKey, number>
);

export interface ScoredCategory {
  category: CategoryKey;
  rawScore: number;
  /** 0–100: σχετική προτίμηση μεταξύ των 8 κατηγοριών για αυτόν τον χρήστη */
  displayPct: number;
  /** Απόκλιση από το ουδέτερο baseline (μόνο για εμφάνιση/debug) */
  deviation: number;
  /** Απόκλιση κανονικοποιημένη στο [-1, 1] ως προς τη μέγιστη δυνατή απόκλιση της κατηγορίας — χρησιμοποιείται για κατάταξη */
  normalizedDeviation: number;
}

export interface CalculationResult {
  finalScores: Record<CategoryKey, number>;
  topCategory: CategoryKey;
  tiedCategories: CategoryKey[];
  sortedScores: ScoredCategory[];
}

/** JSON/localStorage συχνά επιστρέφουν "4" αντί για 4. */
export function coerceLikert1to5(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) {
    const r = Math.round(v);
    if (r >= 1 && r <= 5) return r;
    return null;
  }
  if (typeof v === 'string') {
    const n = Number(String(v).trim());
    if (!Number.isFinite(n)) return null;
    const r = Math.round(n);
    if (r >= 1 && r <= 5) return r;
  }
  return null;
}

export function normalizeAnswersMap(raw: Record<string, unknown>): Record<number, number> {
  const out: Record<number, number> = {};
  for (const [k, v] of Object.entries(raw)) {
    const qId = Number(k);
    const score = coerceLikert1to5(v);
    if (Number.isFinite(qId) && qId >= 1 && score !== null) out[qId] = score;
  }
  return out;
}

function readAnswer(answers: Record<number, number>, qId: number): number {
  const cell =
    answers[qId] ?? (answers as unknown as Record<string, unknown>)[String(qId)];
  return coerceLikert1to5(cell) ?? 3;
}

/**
 * Υπολογισμός αποτελεσμάτων.
 *
 * Κατάταξη: απόκλιση raw από ουδέτερο (όχι απόλυτο raw — το INFO έχει περισσότερα βάρη).
 * Εμφάνιση %: min–max κανονικοποίηση των αποκλίσεων στο [0, 100] ώστε η κορυφαία κλίση = 100%.
 * Αυτό αποφεύγει το 0% παντού όταν οι απαντήσεις είναι πολωμένες (πολλά 1 ή 5).
 */
export function computeCareerOrientationResults(
  answers: Record<number, number>
): CalculationResult {
  const raw: Record<CategoryKey, number> = {
    INFO: 0,
    FIN: 0,
    DIOIK: 0,
    OIK: 0,
    SERV: 0,
    PEDAGOGIKA: 0,
    SOMATA: 0,
    TEXNES: 0,
  };

  QUESTION_IDS.forEach((id) => {
    const w = SCORE_MATRIX[id];
    if (!w) return;
    const value = readAnswer(answers, id);
    CATEGORY_KEYS.forEach((cat, i) => {
      raw[cat] += value * w[i];
    });
  });

  const deviation: Record<CategoryKey, number> = {} as Record<CategoryKey, number>;
  const normalizedDeviation: Record<CategoryKey, number> = {} as Record<CategoryKey, number>;
  CATEGORY_KEYS.forEach((cat) => {
    deviation[cat] = raw[cat] - NEUTRAL_SCORES[cat];
    normalizedDeviation[cat] = MAX_DEVIATION[cat] > 0 ? deviation[cat] / MAX_DEVIATION[cat] : 0;
  });

  const minDev = Math.min(...CATEGORY_KEYS.map((c) => normalizedDeviation[c]));
  const maxDev = Math.max(...CATEGORY_KEYS.map((c) => normalizedDeviation[c]));
  const span = maxDev - minDev;

  const sorted: ScoredCategory[] = CATEGORY_KEYS.map((cat) => ({
    category: cat,
    rawScore: raw[cat],
    deviation: deviation[cat],
    normalizedDeviation: normalizedDeviation[cat],
    displayPct:
      span > 0 ? Math.round(((normalizedDeviation[cat] - minDev) / span) * 100) : 0,
  })).sort((a, b) => {
    if (b.normalizedDeviation !== a.normalizedDeviation)
      return b.normalizedDeviation - a.normalizedDeviation;
    return b.rawScore - a.rawScore;
  });

  const topDeviation = sorted[0].normalizedDeviation;
  const tied = sorted
    .filter((x) => x.normalizedDeviation === topDeviation)
    .map((x) => x.category);

  return {
    finalScores: raw,
    topCategory: sorted[0].category,
    tiedCategories: tied,
    sortedScores: sorted,
  };
}
