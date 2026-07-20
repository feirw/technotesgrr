import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  Info,
  ChevronDown,
  BookOpen,
  TrendingUp,
  Copy,
  Check,
  GitCompare,
} from 'lucide-react';
import {
  MenuIconImg,
  MENU_ICONS,
  FUTURE_CAREERS_ICON,
  SCHOOL_CATEGORY_ICON_BY_NAME,
  SCHOOL_PAGE_NOTICE_ICONS,
  PageMenuIcon,
} from '@/data/menuIcons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SchoolCourseComparePanel } from '@/components/schools/SchoolCourseComparePanel';
import { SchoolCurriculumModal } from '@/components/schools/SchoolCurriculumModal';
import { CareersModal } from '@/components/schools/CareersModal';
import { SCHOOL_CURRICULA, canOpenSchoolCurriculum } from '@/data/schoolCurricula';


import { ALL_SCHOOLS, type School } from '@/data/schools';
import { IT_CAREERS } from '@/data/itCareers';
import { ECONOMICS_CAREERS } from '@/data/economicsCareers';
import { BUSINESS_ADMINISTRATION_CAREERS } from '@/data/businessAdministrationCareers';
import { INDUSTRY_CAREERS } from '@/data/industryCareers';
import { ACCOUNTING_FINANCE_CAREERS } from '@/data/accountingFinanceCareers';
import { MARKETING_CAREERS } from '@/data/marketingCareers';
import { MARITIME_TOURISM_CAREERS } from '@/data/maritimeTourismCareers';
import { SPORTS_CAREERS } from '@/data/sportsCareers';
import { STATISTICS_CAREERS } from '@/data/statisticsCareers';
import { MANAGEMENT_SCIENCE_CAREERS } from '@/data/managementScienceCareers';
import { INTERNATIONAL_EUROPEAN_CAREERS } from '@/data/internationalEuropeanCareers';
import { PEDAGOGY_CAREERS } from '@/data/pedagogyCareers';
import { ARTS_CAREERS } from '@/data/artsCareers';
import type { Career } from '@/data/careers';
import { formatEbeDisplay, formatMoriaDisplay } from '@/utils/schoolBasisMatching';

export type { School };
export { ALL_SCHOOLS };

// --- Configuration ---
const CATEGORIES: Record<string, { iconSrc: string; color: string }> = {
  Πληροφορική: { iconSrc: SCHOOL_CATEGORY_ICON_BY_NAME['Πληροφορική'], color: 'bg-blue-100 text-blue-600' },
  'Ενέργεια & Μηχανική': { iconSrc: SCHOOL_CATEGORY_ICON_BY_NAME['Ενέργεια & Μηχανική'], color: 'bg-amber-100 text-amber-700' },
  'Βιομηχανία & Προϊόν': { iconSrc: SCHOOL_CATEGORY_ICON_BY_NAME['Βιομηχανία & Προϊόν'], color: 'bg-blue-100 text-blue-600' },
  Βιομηχανία: { iconSrc: SCHOOL_CATEGORY_ICON_BY_NAME['Βιομηχανία'], color: 'bg-blue-100 text-blue-600' },
  Οικονομικά: { iconSrc: SCHOOL_CATEGORY_ICON_BY_NAME['Οικονομικά'], color: 'bg-emerald-100 text-emerald-600' },
  'Λογιστική & Χρηματοοικονομικά': {
    iconSrc: SCHOOL_CATEGORY_ICON_BY_NAME['Λογιστική & Χρηματοοικονομικά'],
    color: 'bg-teal-100 text-teal-600',
  },
  'Διοίκηση Επιχειρήσεων': { iconSrc: SCHOOL_CATEGORY_ICON_BY_NAME['Διοίκηση Επιχειρήσεων'], color: 'bg-indigo-100 text-indigo-600' },
  'Marketing & Επικοινωνία': { iconSrc: SCHOOL_CATEGORY_ICON_BY_NAME['Marketing & Επικοινωνία'], color: 'bg-coral-wash text-coral-accent' },
  'Διοικητικής Επιστήμης': {
    iconSrc: SCHOOL_CATEGORY_ICON_BY_NAME['Διοικητικής Επιστήμης'],
    color: 'bg-orange-100 text-orange-600',
  },
  'Διεθνών & Ευρωπαϊκών': { iconSrc: SCHOOL_CATEGORY_ICON_BY_NAME['Διεθνών & Ευρωπαϊκών'], color: 'bg-sky-100 text-sky-600' },
  Στατιστική: { iconSrc: SCHOOL_CATEGORY_ICON_BY_NAME['Στατιστική'], color: 'bg-gray-100 text-gray-600' },
  'Σώματα Ασφαλείας & Στρατιωτικές': {
    iconSrc: SCHOOL_CATEGORY_ICON_BY_NAME['Σώματα Ασφαλείας & Στρατιωτικές'],
    color: 'bg-slate-100 text-slate-600',
  },
  'Ναυτιλιακά & Τουρισμός': { iconSrc: SCHOOL_CATEGORY_ICON_BY_NAME['Ναυτιλιακά & Τουρισμός'], color: 'bg-cyan-100 text-cyan-600' },
  Παιδαγωγικά: { iconSrc: SCHOOL_CATEGORY_ICON_BY_NAME['Παιδαγωγικά'], color: 'bg-orange-100 text-orange-600' },
  'Ανθρωπιστικά & Κοινωνικά': { iconSrc: SCHOOL_CATEGORY_ICON_BY_NAME['Ανθρωπιστικά & Κοινωνικά'], color: 'bg-coral-light/30 text-coral-strong' },
  'Μουσική & Πολιτισμός': { iconSrc: SCHOOL_CATEGORY_ICON_BY_NAME['Μουσική & Πολιτισμός'], color: 'bg-purple-100 text-purple-600' },
  Τέχνες: { iconSrc: SCHOOL_CATEGORY_ICON_BY_NAME['Τέχνες'], color: 'bg-gray-100 text-gray-600' },
  Αθλητισμός: { iconSrc: SCHOOL_CATEGORY_ICON_BY_NAME['Αθλητισμός'], color: 'bg-amber-100 text-amber-600' },
  'Άλλα (Γεωγραφία, Περιβάλλον κ.α.)': {
    iconSrc: SCHOOL_CATEGORY_ICON_BY_NAME['Άλλα (Γεωγραφία, Περιβάλλον κ.α.)'],
    color: 'bg-gray-100 text-gray-600',
  },
  'Σχέδιο Μόδας': { iconSrc: SCHOOL_CATEGORY_ICON_BY_NAME['Σχέδιο Μόδας'], color: 'bg-gray-100 text-gray-600' },
  Logistics: { iconSrc: SCHOOL_CATEGORY_ICON_BY_NAME['Logistics'], color: 'bg-teal-100 text-teal-600' },
};

type CareersCategory =
  | 'Πληροφορική'
  | 'Οικονομικά'
  | 'Διοίκηση Επιχειρήσεων'
  | 'Βιομηχανία'
  | 'Λογιστική & Χρηματοοικονομικά'
  | 'Marketing & Επικοινωνία'
  | 'Ναυτιλιακά & Τουρισμός'
  | 'Αθλητισμός'
  | 'Στατιστική'
  | 'Διοικητικής Επιστήμης'
  | 'Διεθνών & Ευρωπαϊκών'
  | 'Παιδαγωγικά'
  | 'Τέχνες';

const CATEGORY_CAREERS: Record<
  CareersCategory,
  { careers: Career[]; blurb: string; subtitle: string; columnTitle: string }
> = {
  Πληροφορική: {
    careers: IT_CAREERS,
    blurb: 'επαγγέλματα πληροφορικής',
    subtitle: 'Επαγγέλματα πληροφορικής και σύντομες περιγραφές',
    columnTitle: 'Επάγγελμα',
  },
  Οικονομικά: {
    careers: ECONOMICS_CAREERS,
    blurb: 'καριέρες οικονομικών',
    subtitle: 'Καριέρες οικονομικών και σύντομες περιγραφές',
    columnTitle: 'Καριέρα',
  },
  'Διοίκηση Επιχειρήσεων': {
    careers: BUSINESS_ADMINISTRATION_CAREERS,
    blurb: 'καριέρες διοίκησης επιχειρήσεων',
    subtitle: 'Καριέρες διοίκησης επιχειρήσεων και σύντομες περιγραφές',
    columnTitle: 'Καριέρα',
  },
  Βιομηχανία: {
    careers: INDUSTRY_CAREERS,
    blurb: 'καριέρες βιομηχανικής διοίκησης',
    subtitle: 'Καριέρες βιομηχανίας και βιομηχανικής διοίκησης',
    columnTitle: 'Καριέρα',
  },
  'Λογιστική & Χρηματοοικονομικά': {
    careers: ACCOUNTING_FINANCE_CAREERS,
    blurb: 'καριέρες λογιστικής και χρηματοοικονομικών',
    subtitle: 'Καριέρες λογιστικής και χρηματοοικονομικών',
    columnTitle: 'Καριέρα',
  },
  'Marketing & Επικοινωνία': {
    careers: MARKETING_CAREERS,
    blurb: 'καριέρες marketing και επικοινωνίας',
    subtitle: 'Καριέρες marketing και επικοινωνίας',
    columnTitle: 'Καριέρα',
  },
  'Ναυτιλιακά & Τουρισμός': {
    careers: MARITIME_TOURISM_CAREERS,
    blurb: 'καριέρες ναυτιλίας και τουρισμού',
    subtitle: 'Καριέρες ναυτιλίας και τουρισμού',
    columnTitle: 'Καριέρα',
  },
  Αθλητισμός: {
    careers: SPORTS_CAREERS,
    blurb: 'καριέρες φυσικής αγωγής και αθλητισμού',
    subtitle: 'Καριέρες επιστήμης φυσικής αγωγής και αθλητισμού',
    columnTitle: 'Καριέρα',
  },
  Στατιστική: {
    careers: STATISTICS_CAREERS,
    blurb: 'καριέρες στατιστικής',
    subtitle: 'Καριέρες στατιστικής και ανάλυσης δεδομένων',
    columnTitle: 'Καριέρα',
  },
  'Διοικητικής Επιστήμης': {
    careers: MANAGEMENT_SCIENCE_CAREERS,
    blurb: 'καριέρες διοικητικής επιστήμης',
    subtitle: 'Καριέρες διοικητικής επιστήμης και τεχνολογίας',
    columnTitle: 'Καριέρα',
  },
  'Διεθνών & Ευρωπαϊκών': {
    careers: INTERNATIONAL_EUROPEAN_CAREERS,
    blurb: 'καριέρες διεθνών και ευρωπαϊκών σπουδών',
    subtitle: 'Καριέρες διεθνών και ευρωπαϊκών σπουδών',
    columnTitle: 'Καριέρα',
  },
  Παιδαγωγικά: {
    careers: PEDAGOGY_CAREERS,
    blurb: 'καριέρες παιδαγωγικών σπουδών',
    subtitle: 'Καριέρες παιδαγωγικών και εκπαιδευτικών σπουδών',
    columnTitle: 'Καριέρα',
  },
  Τέχνες: {
    careers: ARTS_CAREERS,
    blurb: 'καριέρες σχεδιασμού και τεχνών',
    subtitle: 'Εσωτερική Αρχιτεκτονική, Γραφιστική & Οπτική Επικοινωνία και σύντομες περιγραφές',
    columnTitle: 'Καριέρα',
  },
};

type PageNoticeVariant = 'amber' | 'coral' | 'slate';

const PAGE_NOTICE_STYLES: Record<PageNoticeVariant, { row: string; label: string }> = {
  amber: {
    row: 'bg-amber-50/80 dark:bg-amber-950/20',
    label: 'text-amber-800 dark:text-amber-200',
  },
  coral: {
    row: 'bg-[#fff5f8]/90 dark:bg-[#3a2658]/50',
    label: 'text-[#f07f97] dark:text-[#ff97b2]',
  },
  slate: {
    row: 'bg-white/70 dark:bg-[#2d1c48]/40',
    label: 'text-gray-700 dark:text-gray-200',
  },
};

function PageNotice({
  iconSrc,
  label,
  children,
  variant,
  href,
}: {
  iconSrc: string;
  label: string;
  children: React.ReactNode;
  variant: PageNoticeVariant;
  href?: string;
}) {
  const styles = PAGE_NOTICE_STYLES[variant];

  const inner = (
    <>
      <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center">
        <MenuIconImg src={iconSrc} className="h-10 w-10 sm:h-11 sm:w-11" />
      </div>
      <div className="min-w-0 pt-0.5">
        <p className={`text-[11px] sm:text-xs font-black uppercase tracking-[0.14em] ${styles.label}`}>
          {label}
        </p>
        <p className="mt-1 text-sm sm:text-[15px] text-gray-700 dark:text-gray-200 leading-relaxed">
          {children}
        </p>
      </div>
    </>
  );

  const rowClass = `flex gap-3.5 sm:gap-4 px-4 py-3.5 sm:px-5 sm:py-4 ${styles.row}`;

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${rowClass} transition-colors hover:brightness-[0.97] dark:hover:brightness-110`}
      >
        {inner}
      </a>
    );
  }

  return <div className={rowClass}>{inner}</div>;
}

function SchoolsPageNotices() {
  

}

const SchoolsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCity, setActiveCity] = useState('Όλες');
  const [curriculumSchoolId, setCurriculumSchoolId] = useState<string | null>(null);
  const [activeCareersCategory, setActiveCareersCategory] = useState<CareersCategory | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const isCompareView = searchParams.get('view') === 'compare';
  const [compareSchoolAId, setCompareSchoolAId] = useState('');
  const [compareSchoolBId, setCompareSchoolBId] = useState('');

  const setCompareView = (enabled: boolean) => {
    const next = new URLSearchParams(searchParams);
    if (enabled) next.set('view', 'compare');
    else next.delete('view');
    setSearchParams(next, { replace: true });
  };

  const activeCurriculum = curriculumSchoolId
    ? SCHOOL_CURRICULA[curriculumSchoolId]
    : null;

  const cities = useMemo(
    () => ['Όλες', ...Array.from(new Set(ALL_SCHOOLS.map((s) => s.city))).sort()],
    []
  );

  const filteredSchools = useMemo(() => {
    return ALL_SCHOOLS.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.uni.toLowerCase().includes(search.toLowerCase());
      const matchesCity = activeCity === 'Όλες' || s.city === activeCity;
      return matchesSearch && matchesCity;
    }).sort((a, b) => b.points - a.points);
  }, [search, activeCity]);

  return (
    <div className="-mt-20 pt-24 min-h-screen bg-[#ff97b2] dark:bg-[#2d1c48] text-gray-900 dark:text-gray-100 transition-colors duration-500 pb-24">
      {/* Header */}
      <header className="border-b border-[#f07f97]/35 dark:border-white/10 bg-white/90 dark:bg-[#3a2658]/90 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#ff97b2]/15 dark:bg-white/10 mb-3">
            <MenuIconImg src={MENU_ICONS.schools} className="w-9 h-9" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-[#faf5ef] tracking-tight">
            Σχολές
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            <span className="text-[#f07f97] dark:text-[#ff97b2] font-semibold">4ο Επιστημονικό Πεδίο</span> —
            αναζήτησε σχολές, δες μόρια/ΕΒΕ και σύγκρινε μαθήματα
          </p>
        </div>
      </header>

      {/* Filters */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-[#3a2658]/90 backdrop-blur-xl border-b border-[#f07f97]/30 dark:border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setCompareView(!isCompareView)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-sm border transition-colors ${
                isCompareView
                  ? 'bg-[#f07f97] text-white border-[#f07f97]'
                  : 'border-[#f07f97]/30 text-[#f07f97] hover:bg-[#fff5f8] dark:hover:bg-white/5'
              }`}
            >
              <GitCompare size={16} />
              {isCompareView ? 'Πίσω στις σχολές' : 'Σύγκριση μαθημάτων'}
            </button>

            <div className={`flex w-full max-w-3xl gap-3 flex-wrap md:flex-nowrap ${isCompareView ? 'hidden' : ''}`}>
              <div className="relative flex-1 group">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#f07f97] transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Αναζήτηση σχολής ή πανεπιστημίου..."
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#2d1c48] border border-[#f07f97]/25 dark:border-white/15 rounded-2xl focus:ring-2 focus:ring-[#f07f97]/40 focus:border-[#f07f97] outline-none dark:text-white transition-all shadow-inner"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="relative shrink-0">
                <Select value={activeCity} onValueChange={setActiveCity}>
                  <SelectTrigger className="relative flex items-center justify-between bg-white dark:bg-[#2d1c48] border border-[#f07f97]/25 dark:border-white/15 pl-10 pr-10 py-3 rounded-2xl font-bold text-sm dark:text-white cursor-pointer outline-none focus:ring-2 focus:ring-[#f07f97]/40 transition-all shadow-inner h-auto w-[200px] [&>svg:not(.absolute)]:hidden">
                    <MapPin
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#f07f97] pointer-events-none z-10"
                      size={16}
                    />
                    <SelectValue placeholder="Επιλέξτε πόλη" className="flex-1 text-left" />
                    <ChevronDown className="h-4 w-4 opacity-50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#3a2658] border-[#f07f97]/25 dark:border-white/15 rounded-xl max-h-[240px]">
                    {cities.map((c) => (
                      <SelectItem
                        key={c}
                        value={c}
                        className="font-semibold text-sm cursor-pointer dark:text-gray-100 focus:bg-[#f07f97]/10 dark:focus:bg-white/10"
                      >
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 mt-8 sm:mt-10">
        {isCompareView ? (
          <SchoolCourseComparePanel
            schoolAId={compareSchoolAId}
            schoolBId={compareSchoolBId}
            onSchoolAChange={setCompareSchoolAId}
            onSchoolBChange={setCompareSchoolBId}
            onSwapSchools={() => {
              setCompareSchoolAId(compareSchoolBId);
              setCompareSchoolBId(compareSchoolAId);
            }}
          />
        ) : (
          <>
        
        

        {Object.entries(CATEGORIES).map(([catName, config]) => {
          const schools = filteredSchools.filter((s) => s.category === catName);
          if (schools.length === 0) return null;

          return (
            <motion.section
              key={catName}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              {catName in CATEGORY_CAREERS && (
                <button
                  type="button"
                  onClick={() => setActiveCareersCategory(catName as CareersCategory)}
                  className="mb-6 w-full flex items-center gap-4 rounded-[2rem] border border-[#f07f97]/30 dark:border-white/15 bg-white/95 dark:bg-[#3a2658] px-5 py-4 sm:px-6 sm:py-5 text-left shadow-md hover:border-[#f07f97]/60 hover:shadow-lg transition-all group"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff5f8] dark:bg-[#2d1c48] shadow-sm border border-[#f07f97]/25">
                    <MenuIconImg src={FUTURE_CAREERS_ICON} className="h-10 w-10" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg sm:text-xl font-black text-gray-900 dark:text-white group-hover:text-[#f07f97] dark:group-hover:text-[#ff97b2] transition-colors">
                      Μελλοντική καριέρα
                    </p>
                    <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-300">
                      Δες {CATEGORY_CAREERS[catName as CareersCategory].careers.length}{' '}
                      {CATEGORY_CAREERS[catName as CareersCategory].blurb} και τι κάνει το καθένα
                    </p>
                  </div>
                  <span className="shrink-0 rounded-xl bg-[#fff5f8] dark:bg-[#2d1c48] px-3 py-1.5 text-xs font-black text-[#f07f97] dark:text-[#ff97b2] uppercase tracking-wide">
                    Άνοιγμα
                  </span>
                </button>
              )}
              <div className="flex items-center gap-4 mb-8">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-2xl ${config.color} shadow-sm border border-white/20 shrink-0`}
                >
                  <MenuIconImg src={config.iconSrc} className="w-10 h-10 sm:w-11 sm:h-11" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-800 dark:text-white tracking-tight">
                    {catName}
                  </h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">
                    {schools.length} Σχολές
                  </p>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-[#f07f97]/40 to-transparent dark:from-white/20 ml-4"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schools.map((school) => (
                  <SchoolCard
                    key={school.id}
                    school={school}
                    onOpenCurriculum={
                      canOpenSchoolCurriculum(school.id)
                        ? () => setCurriculumSchoolId(school.id)
                        : undefined
                    }
                  />
                ))}
              </div>
            </motion.section>
          );
        })}
          </>
        )}
      </main>

      {activeCurriculum && (
        <SchoolCurriculumModal
          open={curriculumSchoolId !== null}
          onClose={() => setCurriculumSchoolId(null)}
          curriculum={activeCurriculum}
        />
      )}

      {activeCareersCategory && (
        <CareersModal
          open={activeCareersCategory !== null}
          onClose={() => setActiveCareersCategory(null)}
          subtitle={CATEGORY_CAREERS[activeCareersCategory].subtitle}
          careers={CATEGORY_CAREERS[activeCareersCategory].careers}
          columnTitle={CATEGORY_CAREERS[activeCareersCategory].columnTitle}
        />
      )}
    </div>
  );
};

const MILITARY_SCHOOL_CATEGORY = 'Σώματα Ασφαλείας & Στρατιωτικές';

function isMilitarySchool(school: School): boolean {
  return school.category === MILITARY_SCHOOL_CATEGORY || school.uni === 'ΣΣΑΣ';
}

const SchoolCard: React.FC<{
  school: School;
  onOpenCurriculum?: () => void;
}> = ({ school, onOpenCurriculum }) => {
  const disableHover = isMilitarySchool(school) || !onOpenCurriculum;
  const [copied, setCopied] = useState(false);

  const copySchoolName = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${school.name} (${school.uni})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
  <motion.div
    role={onOpenCurriculum ? 'button' : undefined}
    tabIndex={onOpenCurriculum ? 0 : undefined}
    onClick={onOpenCurriculum}
    onKeyDown={
      onOpenCurriculum
        ? (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpenCurriculum();
            }
          }
        : undefined
    }
    className={`group bg-white dark:bg-[#3a2658] p-6 rounded-[2.5rem] border border-[#f07f97]/20 dark:border-white/15 shadow-sm overflow-hidden relative transition-all duration-200 ${
      disableHover
        ? ''
        : 'hover:bg-[#fff5f8] dark:hover:bg-[#452d6a] hover:border-[#f07f97]/50 hover:shadow-md'
    } ${
      onOpenCurriculum
        ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f07f97]'
        : ''
    }`}
  >
    {/* Background Pattern */}
    <div className="absolute -top-10 -right-10 w-24 h-24 bg-coral-accent/5 rounded-full blur-2xl" />

    <div className="flex justify-between items-start mb-4">
      <div className="space-y-1 pr-10">
        <span className="text-[10px] font-black text-[#f07f97] bg-[#fff5f8] dark:bg-[#f07f97]/15 px-2 py-0.5 rounded-lg uppercase tracking-wider">
          {school.uni}
        </span>
        <div className="flex items-start gap-1.5 min-w-0">
          <h3
            className={`text-lg font-bold text-gray-900 dark:text-white leading-tight transition-colors min-w-0 ${
              disableHover ? '' : 'group-hover:text-[#f07f97] dark:group-hover:text-[#ff97b2]'
            }`}
          >
            {school.name}
          </h3>
          <button
            type="button"
            onClick={copySchoolName}
            className={`shrink-0 mt-0.5 p-1 rounded-lg border transition-colors ${
              copied
                ? 'border-emerald-300 bg-emerald-50 text-emerald-600 dark:border-emerald-500/40 dark:bg-emerald-950/30 dark:text-emerald-400'
                : 'border-[#f07f97]/25 bg-[#fff5f8] text-[#f07f97] hover:bg-[#f07f97]/10 dark:border-white/15 dark:bg-[#2d1c48] dark:text-[#ff97b2] dark:hover:bg-white/5'
            }`}
            aria-label={copied ? 'Αντιγράφηκε' : 'Αντιγραφή ονόματος σχολής'}
            title={copied ? 'Αντιγράφηκε!' : 'Αντιγραφή'}
          >
            {copied ? <Check size={13} strokeWidth={2.5} /> : <Copy size={13} strokeWidth={2.5} />}
          </button>
        </div>
      </div>
      <div className="shrink-0 bg-[#fff5f8] dark:bg-[#2d1c48] p-2 rounded-2xl">
        <TrendingUp className="text-gray-400" size={18} />
      </div>
    </div>

    {school.requirements && (
      <div className="flex items-center gap-1.5 mb-4">
        <Info size={12} className="text-amber-500 shrink-0" />
        <span className="text-[10px] font-black text-amber-600 uppercase tracking-tighter italic">
          {school.requirements}
        </span>
      </div>
    )}

    {onOpenCurriculum && (
      <div className="flex items-center gap-1.5 mb-4 px-2.5 py-1.5 rounded-xl bg-[#fff5f8] dark:bg-[#f07f97]/10 border border-[#f07f97]/25 w-fit">
        <BookOpen size={13} className="text-[#f07f97] shrink-0" />
        <span className="text-[10px] font-black text-[#f07f97] uppercase tracking-wide">
          Πρόγραμμα σπουδών
        </span>
      </div>
    )}

    <div className="flex items-end justify-between mt-8 pt-5 border-t border-[#f07f97]/15 dark:border-white/10">
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
          <MapPin size={14} className="text-[#f07f97]" />
          <span className="text-xs font-bold">{school.city}</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#fff5f8] dark:bg-[#2d1c48] rounded-full text-gray-500 dark:text-gray-400">
          <span className="text-[10px] font-black">EBE: {formatEbeDisplay(school.ebe)}</span>
        </div>
      </div>

      <div className="text-right">
        <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
          Βάση 2025
        </span>
        <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter tabular-nums leading-none">
          {formatMoriaDisplay(school.points)}
        </span>
      </div>
    </div>
  </motion.div>
  );
};

export default SchoolsPage;
