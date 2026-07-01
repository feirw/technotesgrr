/**
 * Verification for career orientation scoring.
 * Run: bun scripts/verify_career_orientation.mjs
 */
import {
  computeCareerOrientationResults,
  normalizeAnswersMap,
  QUESTION_IDS,
} from '../frontend/src/utils/careerOrientationScoring.ts';

const ALL = QUESTION_IDS;

function profile(name, answers, expectedWinner) {
  const result = computeCareerOrientationResults(answers);
  const winner = result.topCategory;
  const topPct = result.sortedScores[0].displayPct;
  const ok = winner === expectedWinner;
  console.log(`${ok ? '✓' : '✗'} ${name}: winner=${winner} (${topPct}%) expected=${expectedWinner}`);
  if (!ok) {
    console.log('  ranking:', result.sortedScores.map((s) => `${s.category}:${s.displayPct}%`).join(', '));
    process.exitCode = 1;
  }
  return result;
}

// All neutral → flat (0% everywhere, arbitrary top)
const neutral = Object.fromEntries(ALL.map((id) => [id, 3]));
const neutralResult = computeCareerOrientationResults(neutral);
if (neutralResult.sortedScores.some((s) => s.displayPct !== 0)) {
  console.error('✗ all neutral should be 0% everywhere');
  process.exitCode = 1;
} else {
  console.log('✓ all neutral: 0% flat');
}

// String keys from JSON
const stringKeys = normalizeAnswersMap(
  Object.fromEntries(ALL.map((id) => [String(id), id <= 25 ? '5' : '1']))
);
const stringResult = computeCareerOrientationResults(stringKeys);
if (stringResult.sortedScores[0].displayPct === 0 && stringResult.sortedScores.every((s) => s.displayPct === 0)) {
  console.error('✗ string-key answers should not all be 0%');
  process.exitCode = 1;
} else {
  console.log(`✓ string JSON keys: top=${stringResult.topCategory} ${stringResult.sortedScores[0].displayPct}%`);
}

profile(
  'info / tech',
  Object.fromEntries(ALL.map((id) => [id, [1, 2, 3, 6, 7, 25, 42, 44, 45, 48, 49, 50].includes(id) ? 5 : 1])),
  'INFO'
);

profile(
  'finance',
  Object.fromEntries(ALL.map((id) => [id, [6, 15, 35, 12, 5].includes(id) ? 5 : 2])),
  'FIN'
);

profile(
  'pedagogy',
  Object.fromEntries(ALL.map((id) => [id, [23, 26, 37, 38, 41, 17, 19].includes(id) ? 5 : 2])),
  'PEDAGOGIKA'
);

profile(
  'arts',
  Object.fromEntries(ALL.map((id) => [id, [4, 8, 22, 42, 46, 47, 45].includes(id) ? 5 : 2])),
  'TEXNES'
);

profile(
  'typical high-4 user',
  Object.fromEntries(ALL.map((id) => [id, id <= 25 ? 4 : 3])),
  'INFO'
);

// Winner must always be 100%
for (const [label, answers] of [
  ['mixed', Object.fromEntries(ALL.map((id) => [id, (id % 5) + 1]))],
  ['all max', Object.fromEntries(ALL.map((id) => [id, 5]))],
]) {
  const r = computeCareerOrientationResults(answers);
  if (r.sortedScores[0].displayPct !== 100) {
    console.error(`✗ ${label}: top category should be 100%, got ${r.sortedScores[0].displayPct}%`);
    process.exitCode = 1;
  } else {
    console.log(`✓ ${label}: top is 100%`);
  }
}

if (process.exitCode) {
  console.error('\nSome checks failed.');
  process.exit(1);
}
console.log('\nAll career orientation checks passed.');
