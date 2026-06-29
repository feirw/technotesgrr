import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  Info,
  ChevronDown,
  BookOpen,
  TrendingUp,
} from 'lucide-react';
import {
  MenuIconImg,
  MENU_ICONS,
  SCHOOL_CATEGORY_ICON_BY_NAME,
  SCHOOL_PAGE_NOTICE_ICONS,
} from '@/data/menuIcons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SchoolCurriculumModal } from '@/components/schools/SchoolCurriculumModal';
import { SCHOOL_CURRICULA, hasSchoolCurriculum } from '@/data/schoolCurricula';


import { ALL_SCHOOLS, type School } from '@/data/schools';
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
}: {
  iconSrc: string;
  label: string;
  children: React.ReactNode;
  variant: PageNoticeVariant;
}) {
  const styles = PAGE_NOTICE_STYLES[variant];

  return (
    <div className={`flex gap-3.5 sm:gap-4 px-4 py-3.5 sm:px-5 sm:py-4 ${styles.row}`}>
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
    </div>
  );
}

function SchoolsPageNotices() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-8 overflow-hidden rounded-3xl border border-white/60 dark:border-white/10 bg-white/95 dark:bg-[#3a2658]/85 shadow-lg shadow-[#f07f97]/10 dark:shadow-black/20 backdrop-blur-sm divide-y divide-[#f07f97]/10 dark:divide-white/10"
    >
      <PageNotice iconSrc={SCHOOL_PAGE_NOTICE_ICONS.panellinies} label="Πανελλήνιες 2026" variant="amber">
        Οι βάσεις 2025 προέρχονται από τα επίσημα αποτελέσματα. Ορισμένα τμήματα προστέθηκαν ή
        ενημερώθηκαν στη λίστα φέτος (2026), με τους επίσημους κωδικούς τους από το Υπουργείο
        Παιδείας.
      </PageNotice>
      <PageNotice iconSrc={SCHOOL_PAGE_NOTICE_ICONS.credits} label="Credits" variant="coral">
        Η ιδέα για να εμφανίζονται και τα μαθήματα των σχολών είναι της Βαλεντίνας και της
        Δέσποινας!
      </PageNotice>
      <PageNotice iconSrc={SCHOOL_PAGE_NOTICE_ICONS.note} label="Σημείωση" variant="slate">
        Το πρόγραμμα περιλαμβάνει υποχρεωτικά μαθήματα και μαθήματα επιλογής. Η ακριβής κατανομή
        και οι επιλογές ορίζονται από το τμήμα.
      </PageNotice>
    </motion.div>
  );
}

const SchoolsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCity, setActiveCity] = useState('Όλες');
  const [curriculumSchoolId, setCurriculumSchoolId] = useState<string | null>(null);

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
    <div className="-mt-20 pt-20 min-h-screen bg-[#ff97b2] dark:bg-[#2d1c48] text-gray-900 dark:text-gray-100 transition-colors duration-500 pb-24">
      {/* Navbar / Filters */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-[#3a2658]/90 backdrop-blur-xl border-b border-[#f07f97]/30 dark:border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-28 flex flex-col justify-center">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="text-xl font-black text-gray-900 dark:text-[#faf5ef] shrink-0 flex items-center gap-2.5">
              <MenuIconImg src={MENU_ICONS.schools} className="w-8 h-8 shrink-0" />
              <span>
                Σχολές <span className="text-[#f07f97] dark:text-[#ff97b2]">4ο Επιστημονικό πεδίο</span>
              </span>
            </h1>

            <div className="flex w-full max-w-3xl gap-3">
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
        <SchoolsPageNotices />

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
                      hasSchoolCurriculum(school.id)
                        ? () => setCurriculumSchoolId(school.id)
                        : undefined
                    }
                  />
                ))}
              </div>
            </motion.section>
          );
        })}
      </main>

      {activeCurriculum && (
        <SchoolCurriculumModal
          open={curriculumSchoolId !== null}
          onClose={() => setCurriculumSchoolId(null)}
          curriculum={activeCurriculum}
        />
      )}
    </div>
  );
};

const SchoolCard: React.FC<{
  school: School;
  onOpenCurriculum?: () => void;
}> = ({ school, onOpenCurriculum }) => (
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
    className={`bg-white dark:bg-[#3a2658] p-6 rounded-[2.5rem] border border-[#f07f97]/20 dark:border-white/15 shadow-sm overflow-hidden relative ${
      onOpenCurriculum
        ? 'cursor-pointer hover:border-[#f07f97]/50 hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f07f97]'
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
        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
          {school.name}
        </h3>
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

export default SchoolsPage;
