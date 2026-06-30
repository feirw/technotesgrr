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
};

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
    });
  }

  shared.sort((a, b) => a.label.localeCompare(b.label, 'el'));

  const uniqueBySchool: Record<string, FlattenedCourse[]> = {};
  for (const entry of prepared) {
    uniqueBySchool[entry.school.id] = entry.courses
      .filter((course) => !matchedKeys.has(normalizeCourseName(course.name)))
      .sort((a, b) => a.name.localeCompare(b.name, 'el'));
  }

  const unionKeys = new Set(buckets.keys());
  const sharedCount = shared.length;
  const unionCount = unionKeys.size;
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
