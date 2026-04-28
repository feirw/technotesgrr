import React, { useEffect, useMemo, useState } from 'react';
import { Calculator, School as SchoolIcon, TrendingUp, AlertCircle, Search } from 'lucide-react';
import { ALL_SCHOOLS, type School } from '@/pages/private/SchoolsPage';

type SubjectKey =
  | 'language'
  | 'math'
  | 'informatics'
  | 'economics'
  | 'foreignLanguage'
  | 'english'
  | 'sports'
  | 'freeDrawing'
  | 'linearDrawing'
  | 'musicPerformance'
  | 'musicTheory';

type WeightMap = Partial<Record<SubjectKey, number>>;

const SUBJECT_LABELS: Record<SubjectKey, string> = {
  language: 'Νεοελληνική Γλώσσα και Λογοτεχνία',
  math: 'Μαθηματικά',
  informatics: 'Πληροφορική',
  economics: 'Οικονομία',
  foreignLanguage: 'Ειδικό Μάθημα (Ξένη Γλώσσα)',
  english: 'Αγγλικά',
  sports: 'Αγωνίσματα',
  freeDrawing: 'Ελεύθερο Σχέδιο',
  linearDrawing: 'Γραμμικό Σχέδιο',
  musicPerformance: 'Μουσική Εκτέλεση και Ερμηνεία',
  musicTheory: 'Μουσική Αντίληψη, Θεωρία και Αρμονία',
};

const SUBJECT_ORDER: SubjectKey[] = [
  'language',
  'math',
  'informatics',
  'economics',
  'foreignLanguage',
  'english',
  'sports',
  'freeDrawing',
  'linearDrawing',
  'musicPerformance',
  'musicTheory',
];

const DEFAULT_WEIGHTS: WeightMap = {
  language: 25,
  math: 25,
  informatics: 25,
  economics: 25,
};

const CATEGORY_WEIGHTS: Record<string, WeightMap> = {
  Πληροφορική: { language: 20, math: 30, informatics: 30, economics: 20 },
  'Βιομηχανία & Προϊόν': { language: 20, math: 30, informatics: 30, economics: 20 },
  Βιομηχανία: { language: 20, math: 30, informatics: 30, economics: 20 },
  Οικονομικά: { language: 20, math: 30, informatics: 20, economics: 30 },
  'Λογιστική & Χρηματοοικονομικά': { language: 20, math: 30, informatics: 20, economics: 30 },
  'Διοίκηση Επιχειρήσεων': { language: 25, math: 25, informatics: 25, economics: 25 },
  'Διοικητικής Επιστήμης': { language: 20, math: 20, informatics: 30, economics: 30 },
  'Διεθνών & Ευρωπαϊκών': {
    language: 30,
    math: 20,
    informatics: 20,
    economics: 30,
    foreignLanguage: 20,
  },
  Στατιστική: { language: 22, math: 34, informatics: 22, economics: 22 },
  'Ναυτιλιακά & Τουρισμός': { language: 25, math: 25, informatics: 25, economics: 25, english: 10 },
  Παιδαγωγικά: { language: 25, math: 25, informatics: 25, economics: 25 },
  Τέχνες: { language: 25, math: 25, informatics: 25, economics: 25, freeDrawing: 10, linearDrawing: 10 },
  Αθλητισμός: { language: 30, math: 25, informatics: 25, economics: 20, sports: 20 },
  'Μουσική & Πολιτισμός': {
    language: 25,
    informatics: 20,
    musicPerformance: 25,
    musicTheory: 30,
  },
  'Marketing & Επικοινωνία': { language: 25, math: 25, informatics: 25, economics: 25 },
  'Ανθρωπιστικά & Κοινωνικά': { language: 25, math: 25, informatics: 25, economics: 25 },
  'Άλλα (Γεωγραφία, Περιβάλλον κ.α.)': { language: 25, math: 25, informatics: 25, economics: 25 },
  'Σχέδιο Μόδας': { language: 25, math: 25, informatics: 25, economics: 25 },
  'Σώματα Ασφαλείας & Στρατιωτικές': { language: 25, math: 25, informatics: 25, economics: 25 },
};

const SCHOOL_WEIGHTS_BY_ID: Record<string, WeightMap> = {
  '548': { language: 25, math: 25, informatics: 25, economics: 25 },
  '1001': { language: 20, math: 20, informatics: 30, economics: 30 },
  '326': { language: 20, math: 30, informatics: 20, economics: 30 },
  '552': { language: 40, math: 20, informatics: 20, economics: 20 },
  '1610': { language: 25, math: 25, informatics: 25, economics: 25 },
  '1241': { language: 34, math: 22, informatics: 22, economics: 22 },
  '1276': { language: 20, math: 27, informatics: 27, economics: 26 },
  '1669': { language: 25, math: 25, informatics: 25, economics: 25 },
  '614': { language: 22, math: 22, informatics: 28, economics: 28, foreignLanguage: 20 },
  '616': { language: 22, math: 22, informatics: 28, economics: 28, foreignLanguage: 20 },
  '872': { language: 30, math: 30, informatics: 20, economics: 20 },
  '869': { language: 30, math: 30, informatics: 20, economics: 20 },
  '877': { language: 20, math: 30, informatics: 20, economics: 30 },
  '871': { language: 20, math: 30, informatics: 20, economics: 30 },
  '557': { language: 30, math: 20, informatics: 30, economics: 20 },
  '870': { language: 30, math: 30, informatics: 20, economics: 20 },
  '176': { language: 20, math: 20, informatics: 30, economics: 30 },
  '1609': { language: 25, math: 25, informatics: 25, economics: 25 },
  '560': { language: 20, math: 35, informatics: 25, economics: 20 },
  '356': { language: 25, math: 25, informatics: 25, economics: 25 },
  '310': { language: 20, math: 30, informatics: 20, economics: 30 },
  '674': { language: 25, math: 25, informatics: 25, economics: 25, freeDrawing: 10, linearDrawing: 10 },
  '1424': { language: 25, math: 20, informatics: 30, economics: 25 },
  '212': { language: 20, math: 20, informatics: 25, economics: 35 },
  '566': { language: 25, math: 25, informatics: 25, economics: 25 },
  '124': { language: 25, math: 25, informatics: 25, economics: 25 },
  '1004': { language: 25, math: 25, informatics: 25, economics: 25 },
  '150': { language: 20, math: 30, informatics: 20, economics: 30 },
  '1549': { language: 25, math: 25, informatics: 25, economics: 25 },
  '179': { language: 30, math: 20, informatics: 20, economics: 30, foreignLanguage: 10 },
  '161': { language: 20, math: 25, informatics: 20, economics: 35, foreignLanguage: 20 },
  '355': { language: 30, math: 20, informatics: 20, economics: 30, foreignLanguage: 20 },
  '1063': { language: 20, math: 25, informatics: 25, economics: 30 },
  '575': { language: 30, math: 30, informatics: 20, economics: 20 },
  '1427': { language: 20, math: 25, informatics: 25, economics: 30 },
  '352': { language: 25, math: 25, informatics: 25, economics: 25 },
  '320': { language: 25, math: 25, informatics: 20, economics: 30 },
  '1005': { language: 20, math: 20, informatics: 30, economics: 30 },
  '580': { language: 20, math: 20, informatics: 25, economics: 35 },
  '1655': { language: 24, math: 28, informatics: 20, economics: 28 },
  '1603': { language: 20, math: 20, informatics: 30, economics: 30 },
  '583': { language: 20, math: 20, informatics: 30, economics: 30 },
  '670': { language: 30, math: 20, informatics: 20, economics: 30, foreignLanguage: 20 },
  '1283': { language: 25, math: 25, informatics: 25, economics: 25, foreignLanguage: 20 },
  '1656': { language: 20, math: 20, informatics: 30, economics: 30 },
  '240': { language: 25, math: 25, informatics: 25, economics: 25 },
  '1607': { language: 20, math: 20, informatics: 30, economics: 30 },
  '1544': { language: 20, math: 20, informatics: 30, economics: 30 },
  '1282': { language: 20, math: 20, informatics: 30, economics: 30 },
  '591': { language: 25, math: 25, informatics: 25, economics: 25 },
  '154': { language: 25, math: 25, informatics: 25, economics: 25 },
  '1551': { language: 30, math: 20, informatics: 30, economics: 20, foreignLanguage: 10 },
  '216': { language: 26, math: 27, informatics: 27, economics: 20 },
  '401': { language: 30, math: 25, informatics: 25, economics: 20, sports: 20 },
  '403': { language: 30, math: 25, informatics: 20, economics: 25, sports: 20 },
  '404': { language: 30, math: 25, informatics: 25, economics: 20, sports: 20 },
  '402': { language: 30, math: 25, informatics: 20, economics: 25, sports: 20 },
  '405': { language: 30, math: 25, informatics: 25, economics: 20, sports: 20 },
  '134': { language: 25, math: 25, informatics: 25, economics: 25 },
  '1286': { language: 28, math: 28, informatics: 24, economics: 20 },
  '136': { language: 40, math: 20, informatics: 20, economics: 20 },
  '160': { language: 25, math: 25, informatics: 25, economics: 25 },
  '162': { language: 25, math: 25, informatics: 25, economics: 25 },
  '675': { language: 35, math: 25, informatics: 20, economics: 20, freeDrawing: 10, linearDrawing: 10 },
  '1626': { language: 25, math: 25, informatics: 25, economics: 25, freeDrawing: 10, linearDrawing: 10 },
  '1211': { language: 25, math: 30, informatics: 25, economics: 20 },
  '1212': { language: 25, math: 30, informatics: 25, economics: 20 },
  '1662': { language: 30, math: 20, informatics: 30, economics: 20 },
  '610': { language: 25, math: 25, informatics: 25, economics: 25 },
  '886': { language: 35, math: 20, informatics: 25, economics: 20 },
  '887': { language: 25, math: 20, informatics: 25, economics: 30 },
  '173': { language: 28, math: 28, informatics: 22, economics: 22 },
  '163': { language: 25, math: 25, informatics: 25, economics: 25 },
  '159': { language: 30, math: 20, informatics: 20, economics: 30 },
  '1606': { language: 20, math: 20, informatics: 30, economics: 30 },
  '347': { language: 25, math: 25, informatics: 25, economics: 25 },
  '617': { language: 20, math: 33, informatics: 20, economics: 27 },
  '1654': { language: 20, math: 30, informatics: 20, economics: 30 },
  '337': { language: 25, math: 25, informatics: 25, economics: 25 },
  '1604': { language: 20, math: 20, informatics: 25, economics: 35 },
  '1513': { language: 20, math: 25, informatics: 25, economics: 30 },
  '1545': { language: 20, math: 30, informatics: 20, economics: 30 },
  '1430': { language: 27, math: 27, informatics: 23, economics: 23 },
  '1244': { language: 20, math: 30, informatics: 20, economics: 30 },
  '314': { language: 25, math: 25, informatics: 25, economics: 25 },
  '181': { language: 30, math: 20, informatics: 25, economics: 25 },
  '389': { language: 20, math: 28, informatics: 28, economics: 24 },
  '222': { language: 25, math: 25, informatics: 25, economics: 25 },
  '629': { language: 20, math: 25, informatics: 30, economics: 25 },
  '224': { language: 20, math: 30, informatics: 30, economics: 20 },
  '230': { language: 20, math: 30, informatics: 25, economics: 25 },
  '344': { language: 25, math: 25, informatics: 30, economics: 20 },
  '1625': { language: 25, math: 30, informatics: 25, economics: 20 },
  '390': { language: 24, math: 28, informatics: 28, economics: 20 },
  '1622': { language: 20, math: 30, informatics: 30, economics: 20 },
  '1542': { language: 25, math: 25, informatics: 25, economics: 25 },
  '238': { language: 20, math: 30, informatics: 30, economics: 20 },
  '880': { language: 25, math: 30, informatics: 25, economics: 20 },
  '864': { language: 30, math: 30, informatics: 20, economics: 20 },
  '863': { language: 20, math: 30, informatics: 30, economics: 20 },
  '409': { language: 20, informatics: 20, musicPerformance: 40, musicTheory: 20 },
  '1664': { language: 25, math: 25, informatics: 25, economics: 25 },
  '408': { language: 30, informatics: 20, musicPerformance: 20, musicTheory: 30 },
  '641': { language: 30, informatics: 20, musicPerformance: 30, musicTheory: 20 },
  '406': { language: 25, informatics: 20, musicPerformance: 25, musicTheory: 30 },
  '407': { language: 20, informatics: 20, musicPerformance: 30, musicTheory: 30 },
  '157': { language: 20, math: 30, informatics: 20, economics: 30, english: 20 },
  '180': { language: 30, math: 30, informatics: 20, economics: 20 },
  '646': { language: 23, math: 30, informatics: 20, economics: 27 },
  '312': { language: 25, math: 25, informatics: 25, economics: 25 },
  '315': { language: 20, math: 30, informatics: 20, economics: 30 },
  '613': { language: 25, math: 25, informatics: 20, economics: 30, english: 20 },
  '152': { language: 25, math: 25, informatics: 25, economics: 25 },
  '867': { language: 25, math: 25, informatics: 20, economics: 30 },
  '309': { language: 22, math: 34, informatics: 20, economics: 24 },
  '350': { language: 27, math: 25, informatics: 25, economics: 23 },
  '311': { language: 30, math: 30, informatics: 20, economics: 20 },
  '317': { language: 30, math: 30, informatics: 20, economics: 20 },
  '345': { language: 25, math: 25, informatics: 25, economics: 25 },
  '1548': { language: 20, math: 20, informatics: 25, economics: 35 },
  '97': { language: 20, math: 28, informatics: 20, economics: 32 },
  '319': { language: 26, math: 26, informatics: 20, economics: 28 },
  '321': { language: 25, math: 30, informatics: 20, economics: 25 },
  '1602': { language: 20, math: 25, informatics: 20, economics: 35 },
  '361': { language: 20, math: 30, informatics: 20, economics: 30 },
  '400': { language: 20, math: 20, informatics: 30, economics: 30 },
  '313': { language: 25, math: 25, informatics: 25, economics: 25 },
  '1546': { language: 20, math: 20, informatics: 25, economics: 35 },
  '322': { language: 23, math: 30, informatics: 22, economics: 25 },
  '316': { language: 20, math: 20, informatics: 30, economics: 30 },
  '1601': { language: 25, math: 25, informatics: 25, economics: 25 },
  '128': { language: 25, math: 25, informatics: 25, economics: 25 },
  '142': { language: 25, math: 25, informatics: 25, economics: 25 },
  '164': { language: 25, math: 25, informatics: 25, economics: 25 },
  '140': { language: 25, math: 25, informatics: 25, economics: 25 },
  '130': { language: 25, math: 25, informatics: 25, economics: 25 },
  '132': { language: 25, math: 25, informatics: 25, economics: 25 },
  '143': { language: 25, math: 25, informatics: 25, economics: 25 },
  '334': { language: 30, math: 25, informatics: 25, economics: 20 },
  '178': { language: 25, math: 25, informatics: 25, economics: 25 },
  '156': { language: 30, math: 20, informatics: 30, economics: 20 },
  '341': { language: 25, math: 25, informatics: 25, economics: 25 },
  '166': { language: 25, math: 25, informatics: 25, economics: 25 },
  '158': { language: 40, math: 20, informatics: 20, economics: 20 },
  '276': { language: 20, math: 20, informatics: 30, economics: 30 },
  '1453': { language: 20, math: 20, informatics: 30, economics: 30 },
  '1434': { language: 25, math: 30, informatics: 20, economics: 25 },
  '1436': { language: 25, math: 25, informatics: 25, economics: 25 },
  '818': { language: 25, math: 25, informatics: 25, economics: 25 },
  '817': { language: 25, math: 25, informatics: 25, economics: 25 },
  '882': { language: 30, math: 30, informatics: 20, economics: 20 },
  '881': { language: 30, math: 30, informatics: 20, economics: 20 },
  '375': { language: 25, math: 25, informatics: 25, economics: 25, english: 10 },
  '1008': { language: 20, math: 30, informatics: 25, economics: 25 },
  '367': { language: 20, math: 30, informatics: 30, economics: 20 },
  '1455': { language: 20, math: 20, informatics: 30, economics: 30, english: 10 },
  '677': { language: 35, math: 20, informatics: 25, economics: 20 },
  '155': { language: 25, math: 25, informatics: 25, economics: 25 },
  '1456': { language: 30, math: 20, informatics: 30, economics: 20 },
  '1439': { language: 20, math: 25, informatics: 30, economics: 25 },
  '262': { language: 20, math: 30, informatics: 30, economics: 20 },
  '1519': { language: 22, math: 22, informatics: 28, economics: 28 },
  '715': { language: 25, math: 25, informatics: 30, economics: 20 },
  '98': { language: 25, math: 25, informatics: 25, economics: 25 },
  '99': { language: 25, math: 25, informatics: 25, economics: 25 },
  '330': { language: 20, math: 35, informatics: 25, economics: 20 },
  '339': { language: 25, math: 25, informatics: 30, economics: 20 },
  '354': { language: 25, math: 25, informatics: 30, economics: 20 },
  '369': { language: 25, math: 25, informatics: 30, economics: 20 },
  '700': { language: 25, math: 25, informatics: 25, economics: 25 },
  '701': { language: 20, math: 35, informatics: 20, economics: 25 },
  '702': { language: 20, math: 30, informatics: 25, economics: 25 },
  '889': { language: 25, math: 20, informatics: 35, economics: 20 },
  '1250': { language: 23, math: 23, informatics: 31, economics: 23 },
  '1435': { language: 30, math: 20, informatics: 20, economics: 30 },
  '1554': { language: 20, math: 20, informatics: 40, economics: 20 },
  '1630': { language: 25, math: 25, informatics: 30, economics: 20 },
  '1517': { language: 25, math: 25, informatics: 25, economics: 25 },
};

function clampGrade(v: string): number | null {
  if (v.trim() === '') return null;
  const n = Number(v.replace(',', '.'));
  if (Number.isNaN(n) || n < 0 || n > 20) return null;
  return Math.round(n * 10) / 10;
}

function getWeightsForSchool(school: School): WeightMap {
  return SCHOOL_WEIGHTS_BY_ID[school.id] ?? CATEGORY_WEIGHTS[school.category] ?? DEFAULT_WEIGHTS;
}

function getActiveSubjects(weights: WeightMap): SubjectKey[] {
  return (Object.keys(weights) as SubjectKey[]).filter((k) => (weights[k] ?? 0) > 0);
}

function computeMoriaForSchool(
  school: School,
  grades: Partial<Record<SubjectKey, string>>
): { moria: number | null; incomplete: boolean } {
  const weights = getWeightsForSchool(school);
  const active = getActiveSubjects(weights);
  const parsed: Partial<Record<SubjectKey, number | null>> = {};
  for (const s of active) {
    parsed[s] = clampGrade(grades[s] ?? '');
  }
  const incomplete = active.some((s) => parsed[s] === null);
  if (incomplete) return { moria: null, incomplete: true };
  const weightedSum = active.reduce((sum, s) => sum + (parsed[s] as number) * (weights[s] ?? 0), 0);
  return { moria: Math.round((weightedSum / 100) * 1000), incomplete: false };
}

const unionSubjectsForCatalog = (): SubjectKey[] => {
  const set = new Set<SubjectKey>();
  for (const school of ALL_SCHOOLS) {
    const w = getWeightsForSchool(school);
    getActiveSubjects(w).forEach((k) => set.add(k));
  }
  return SUBJECT_ORDER.filter((k) => set.has(k));
};

const UNION_SUBJECTS = unionSubjectsForCatalog();

const PedioMathisiMoriaPage: React.FC = () => {
  const [grades, setGrades] = useState<Partial<Record<SubjectKey, string>>>({});
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setGrades((prev) => {
      const next = { ...prev };
      for (const k of UNION_SUBJECTS) {
        if (next[k] === undefined) next[k] = '';
      }
      return next;
    });
  }, []);

  const hasInvalidInput = useMemo(
    () =>
      UNION_SUBJECTS.some((key) => {
        const value = grades[key] ?? '';
        if (value.trim() === '') return false;
        return clampGrade(value) === null;
      }),
    [grades]
  );

  const schoolRows = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const list = ALL_SCHOOLS.filter((s) => {
      if (!q) return true;
      const hay = `${s.name} ${s.uni} ${s.city}`.toLowerCase();
      return hay.includes(q);
    });

    const rows = list.map((school) => {
      const { moria, incomplete } = computeMoriaForSchool(school, grades);
      const base = school.points;
      const diff = moria !== null ? moria - base : null;
      const pass = moria !== null && moria >= base;
      return { school, moria, diff, pass, incomplete };
    });

    rows.sort((a, b) => {
      if (a.moria === null && b.moria === null) return a.school.name.localeCompare(b.school.name, 'el');
      if (a.moria === null) return 1;
      if (b.moria === null) return -1;
      if (a.pass !== b.pass) return a.pass ? -1 : 1;
      if (b.moria !== a.moria) return b.moria - a.moria;
      return a.school.name.localeCompare(b.school.name, 'el');
    });

    return rows;
  }, [grades, filter]);

  const passCount = useMemo(() => schoolRows.filter((r) => r.pass).length, [schoolRows]);
  const computedCount = useMemo(() => schoolRows.filter((r) => r.moria !== null).length, [schoolRows]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <section className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-coral-wash dark:bg-coral-accent/15 grid place-items-center">
              <Calculator className="w-5 h-5 text-coral-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">Υπολογισμός Μορίων 4ου Πεδίου</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Συμπλήρωσε τους βαθμούς μία φορά· εμφανίζονται όλα τα τμήματα του καταλόγου με μόρια έναντι της βάσης
                2025.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {UNION_SUBJECTS.map((subject) => (
              <label key={subject} className="block">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {SUBJECT_LABELS[subject]}
                </span>
                <input
                  inputMode="decimal"
                  placeholder="0 – 20 (κενό αν δεν εξετάζεσαι)"
                  value={grades[subject] ?? ''}
                  onChange={(e) =>
                    setGrades((prev) => ({
                      ...prev,
                      [subject]: e.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm"
                />
              </label>
            ))}
          </div>

          {hasInvalidInput && (
            <div className="mt-4 rounded-xl border border-red-300 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 p-3 text-sm flex gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              Επιτρέπονται μόνο αριθμοί από 0 έως 20.
            </div>
          )}

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            Για κάθε σχολή χρησιμοποιούνται οι συντελεστές του τμήματος (ΥΠΑΙΘ 2025 όπου έχουν καταχωρηθεί). Αν λείπει
            βαθμός σε μάθημα που ζητά η σχολή, τα μόρια εμφανίζονται ως «—».
          </p>
        </section>

        <section className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <SchoolIcon className="w-5 h-5 text-coral-accent" />
              <h2 className="text-lg font-black text-gray-900 dark:text-white">Αποτελέσματα ανά σχολή</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 px-3 py-1 font-bold">
                Περνάς: {passCount}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                Υπολογισμός για {computedCount}/{schoolRows.length} σειρές
              </span>
            </div>
          </div>

          <label className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 mb-4 bg-gray-50 dark:bg-gray-800/50">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Αναζήτηση ονόματος, ιδρύματος, πόλης…"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
          </label>

          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                  <th className="p-3 font-bold text-gray-800 dark:text-gray-100">Τμήμα</th>
                  <th className="p-3 font-bold text-gray-800 dark:text-gray-100 hidden md:table-cell">Ίδρυμα</th>
                  <th className="p-3 font-bold text-gray-800 dark:text-gray-100 hidden sm:table-cell">Πόλη</th>
                  <th className="p-3 font-bold text-gray-800 dark:text-gray-100 text-right tabular-nums">Μόρια</th>
                  <th className="p-3 font-bold text-gray-800 dark:text-gray-100 text-right tabular-nums hidden lg:table-cell">
                    Βάση 2025
                  </th>
                  <th className="p-3 font-bold text-gray-800 dark:text-gray-100 text-right">Διαφορά</th>
                </tr>
              </thead>
              <tbody>
                {schoolRows.map(({ school, moria, diff, pass, incomplete }) => {
                  const rowBg = incomplete
                    ? 'bg-gray-50/80 dark:bg-gray-900/40'
                    : pass
                      ? 'bg-emerald-50/90 dark:bg-emerald-950/25'
                      : 'bg-red-50/90 dark:bg-red-950/20';
                  const diffText =
                    moria === null || diff === null ? '—' : diff >= 0 ? `+${diff.toLocaleString()}` : diff.toLocaleString();
                  const diffColor =
                    moria === null
                      ? 'text-gray-400'
                      : diff !== null && diff >= 0
                        ? 'text-emerald-700 dark:text-emerald-300 font-bold'
                        : 'text-red-700 dark:text-red-300 font-bold';
                  return (
                    <tr key={`${school.id}-${school.uni}`} className={`border-b border-gray-100 dark:border-gray-800 ${rowBg}`}>
                      <td className="p-3 align-top">
                        <p className="font-semibold text-gray-900 dark:text-white leading-snug">{school.name}</p>
                        <p className="text-xs text-gray-500 md:hidden mt-0.5">
                          {school.uni} · {school.city}
                        </p>
                        {!incomplete && moria !== null && (
                          <p className={`text-xs font-bold mt-1 ${pass ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>
                            {pass ? 'Πέρασμα βάσης' : 'Κάτω από βάση'}
                          </p>
                        )}
                        {incomplete && (
                          <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">Λείπουν βαθμοί για αυτό το τμήμα</p>
                        )}
                      </td>
                      <td className="p-3 text-gray-600 dark:text-gray-300 hidden md:table-cell align-top">{school.uni}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-300 hidden sm:table-cell align-top">{school.city}</td>
                      <td className="p-3 text-right font-black tabular-nums text-gray-900 dark:text-white align-top">
                        {moria !== null ? moria.toLocaleString() : '—'}
                      </td>
                      <td className="p-3 text-right tabular-nums text-gray-600 dark:text-gray-400 hidden lg:table-cell align-top">
                        {school.points.toLocaleString()}
                      </td>
                      <td className={`p-3 text-right tabular-nums align-top ${diffColor}`}>
                        <span className="inline-flex items-center gap-1">
                          {moria !== null && <TrendingUp className="w-3.5 h-3.5 shrink-0" />}
                          {diffText}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            Η σύγκριση γίνεται με τα μόρια βάσης 2025 του κάθε τμήματος στον κατάλογο. Πράσινη γραμμή όταν τα υπολογισμένα
            μόριά σου είναι ≥ βάση, κόκκινη όταν είναι χαμηλότερα· στη διαφορά φαίνεται πόσα μόρια πάνω ή κάτω είσαι.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PedioMathisiMoriaPage;
