import type { School } from '@/data/schools';
import {
  filterCurriculum,
  type CurriculumCourse,
  type CurriculumFilter,
  type SchoolCurriculum,
} from '@/data/schoolCurricula';

export type FlattenedCourse = CurriculumCourse & {
  semester: number;
  schoolId: string;
};

export type ComparedSchool = {
  school: School;
  curriculum: SchoolCurriculum;
  courses: FlattenedCourse[];
  totalEcts: number;
};

export type SharedCourseGroup = {
  key: string;
  label: string;
  entries: { schoolId: string; course: FlattenedCourse }[];
  /** 'exact' = ίδιο κανονικοποιημένο όνομα. 'similar' = παρόμοιο όνομα, όχι ταυτόσημο. */
  matchType: 'exact' | 'similar';
};

const SIMILARITY_THRESHOLD = 0.6;

/** Jaccard similarity σε λέξεις-tokens του κανονικοποιημένου ονόματος. 0–1. */
export function courseNameSimilarity(a: string, b: string): number {
  const tokensA = new Set(normalizeCourseName(a).split(' ').filter((t) => t.length > 2));
  const tokensB = new Set(normalizeCourseName(b).split(' ').filter((t) => t.length > 2));
  if (tokensA.size === 0 || tokensB.size === 0) return 0;
  let intersection = 0;
  for (const t of tokensA) {
    if (tokensB.has(t)) intersection += 1;
  }
  const union = tokensA.size + tokensB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export type CurriculumComparison = {
  schools: ComparedSchool[];
  shared: SharedCourseGroup[];
  uniqueBySchool: Record<string, FlattenedCourse[]>;
  sharedCount: number;
  unionCount: number;
  overlapPercent: number;
};

export function normalizeCourseName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s+&/-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function flattenCurriculum(
  schoolId: string,
  curriculum: SchoolCurriculum,
  filter: CurriculumFilter,
): FlattenedCourse[] {
  const source = filter === 'all' ? curriculum : filterCurriculum(curriculum, filter);
  return source.semesters.flatMap((sem) =>
    sem.courses.map((course) => ({
      ...course,
      semester: sem.semester,
      schoolId,
    })),
  );
}

function pickDisplayName(entries: { course: FlattenedCourse }[]): string {
  const sorted = [...entries].sort((a, b) => a.course.name.length - b.course.name.length);
  return sorted[0]?.course.name ?? '';
}

export function compareCurricula(
  schools: ComparedSchool[],
  filter: CurriculumFilter = 'all',
): CurriculumComparison {
  const prepared = schools.map((entry) => ({
    ...entry,
    courses: flattenCurriculum(entry.school.id, entry.curriculum, filter),
    totalEcts: flattenCurriculum(entry.school.id, entry.curriculum, filter).reduce(
      (sum, course) => sum + course.ects,
      0,
    ),
  }));

  if (prepared.length === 0) {
    return {
      schools: prepared,
      shared: [],
      uniqueBySchool: {},
      sharedCount: 0,
      unionCount: 0,
      overlapPercent: 0,
    };
  }

  const buckets = new Map<string, { schoolId: string; course: FlattenedCourse }[]>();

  for (const entry of prepared) {
    for (const course of entry.courses) {
      const key = normalizeCourseName(course.name);
      if (!key) continue;
      const list = buckets.get(key) ?? [];
      list.push({ schoolId: entry.school.id, course });
      buckets.set(key, list);
    }
  }

  const schoolIds = prepared.map((entry) => entry.school.id);
  const shared: SharedCourseGroup[] = [];
  const matchedKeys = new Set<string>();

  for (const [key, entries] of buckets) {
    const present = new Set(entries.map((entry) => entry.schoolId));
    if (!schoolIds.every((id) => present.has(id))) continue;
    matchedKeys.add(key);
    shared.push({
      key,
      label: pickDisplayName(entries),
      entries,
      matchType: 'exact',
    });
  }

  // Δεύτερο πέρασμα: μαθήματα με παρόμοιο (όχι ταυτόσημο) όνομα ανάμεσα σε δύο σχολές.
  // Μόνο για σύγκριση ακριβώς δύο σχολών — για περισσότερες, η κατά ζεύγη αντιστοίχιση
  // γίνεται πολυσήμαντη (ποιο ζευγάρι "ανήκει" μαζί).
  if (schoolIds.length === 2) {
    const [idA, idB] = schoolIds;
    const remainingA = (prepared.find((e) => e.school.id === idA)?.courses ?? []).filter(
      (c) => !matchedKeys.has(normalizeCourseName(c.name)),
    );
    const remainingB = (prepared.find((e) => e.school.id === idB)?.courses ?? []).filter(
      (c) => !matchedKeys.has(normalizeCourseName(c.name)),
    );
    const usedB = new Set<number>();

    for (const courseA of remainingA) {
      let bestIndex = -1;
      let bestScore = 0;
      remainingB.forEach((courseB, index) => {
        if (usedB.has(index)) return;
        const score = courseNameSimilarity(courseA.name, courseB.name);
        if (score > bestScore) {
          bestScore = score;
          bestIndex = index;
        }
      });
      if (bestIndex >= 0 && bestScore >= SIMILARITY_THRESHOLD) {
        const courseB = remainingB[bestIndex];
        usedB.add(bestIndex);
        matchedKeys.add(normalizeCourseName(courseA.name));
        matchedKeys.add(normalizeCourseName(courseB.name));
        shared.push({
          key: `similar:${normalizeCourseName(courseA.name)}~${normalizeCourseName(courseB.name)}`,
          label: pickDisplayName([{ course: courseA }, { course: courseB }]),
          entries: [
            { schoolId: idA, course: courseA },
            { schoolId: idB, course: courseB },
          ],
          matchType: 'similar',
        });
      }
    }
  }

  shared.sort((a, b) => a.label.localeCompare(b.label, 'el'));

  const uniqueBySchool: Record<string, FlattenedCourse[]> = {};
  for (const entry of prepared) {
    uniqueBySchool[entry.school.id] = entry.courses
      .filter((course) => !matchedKeys.has(normalizeCourseName(course.name)))
      .sort((a, b) => a.name.localeCompare(b.name, 'el'));
  }

  const unionKeys = new Set(buckets.keys());
  const similarCount = shared.filter((g) => g.matchType === 'similar').length;
  const sharedCount = shared.length;
  // Κάθε «similar» ζεύγος συγχωνεύει δύο ξεχωριστά ονόματα σε ένα κοινό μάθημα,
  // άρα μειώνει το σύνολο των διακριτών μαθημάτων κατά ένα.
  const unionCount = unionKeys.size - similarCount;
  const overlapPercent =
    unionCount === 0 ? 0 : Math.round((sharedCount / unionCount) * 1000) / 10;

  return {
    schools: prepared,
    shared,
    uniqueBySchool,
    sharedCount,
    unionCount,
    overlapPercent,
  };
}
