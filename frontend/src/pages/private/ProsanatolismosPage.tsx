import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Code,
  Briefcase,
  TrendingUp,
  DollarSign,
  Globe,
  Shield,
  Palette,
  CheckCircle,
  GraduationCap,
  LucideIcon,
  RotateCcw,
  Save,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Brain,
  Zap,
  Users,
  Wind,
  Target,
  Lightbulb,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { getBackendUrl } from '@/utils/backendUrl';
import { apiFetch } from '@/utils/apiClient';
import { motion, AnimatePresence } from 'framer-motion';
import { PageMenuIcon } from '@/data/menuIcons';
import {
  type CategoryKey,
  computeCareerOrientationResults,
  normalizeAnswersMap,
} from '@/utils/careerOrientationScoring';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface School {
  name: string;
  city: string;
  code: number;
  base: string;
  note?: string;
}
interface CategoryData {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  schools: School[];
}
type CalculationResult = ReturnType<typeof computeCareerOrientationResults>;
interface Section {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  questions: number[];
}
interface SavedResultApiShape {
  answers?: Record<string, number>;
  final_scores?: Record<CategoryKey, number>;
  top_category?: CategoryKey;
  sorted_scores?: Array<{ category: CategoryKey; score: number; pct?: number }>;
}

// ─────────────────────────────────────────────────────────────
// 50 ΕΡΩΤΗΣΕΙΣ
// ─────────────────────────────────────────────────────────────
const QUESTIONS: Record<number, string> = {
  // ΤΡΟΠΟΣ ΣΚΕΨΗΣ (1-10)
  1: 'Όταν αντιμετωπίζεις άγνωστο πρόβλημα, το χωρίζεις αυτόματα σε μικρότερα βήματα πριν κινηθείς.',
  2: 'Σε ενοχλεί να χρησιμοποιείς κάτι χωρίς να καταλαβαίνεις πώς λειτουργεί εσωτερικά.',
  3: 'Όταν ψάχνεις κάτι που σε ενδιαφέρει, καταλήγεις με δεκάδες ανοιχτές καρτέλες και ξεχνάς τον χρόνο.',
  4: 'Βλέπεις εύκολα συνδέσεις μεταξύ φαινομενικά άσχετων πραγμάτων (π.χ. μαθηματικά & μουσική).',
  5: 'Πριν ξεκινήσεις οτιδήποτε σημαντικό, φτιάχνεις λίστα ή σχέδιο — ακόμα και για τις διακοπές.',
  6: 'Νιώθεις πιο άνετα με αριθμούς και δεδομένα παρά με αόριστες εκτιμήσεις.',
  7: 'Αν κάτι δεν έχει λογική εξήγηση, δεν μπορείς να το αφήσεις — το ψάχνεις μέχρι να το καταλάβεις.',
  8: 'Θυμάσαι καλύτερα πράγματα που τα είδες οπτικά (διάγραμμα, mind map) παρά αυτά που μόνο διάβασες.',
  9: 'Σε συζήτηση, συχνά εσύ λες "ναι, αλλά αν το δούμε από την άλλη πλευρά...".',
  10: 'Όταν κάτι πάει στραβά, ψάχνεις πρώτα την αιτία — όχι τον ένοχο.',
  // ΛΗΨΗ ΑΠΟΦΑΣΕΩΝ (11-18)
  11: 'Μεταξύ μιας σίγουρης/μέτριας επιλογής και μιας ριψοκίνδυνης/πολλά υποσχόμενης, διαλέγεις την ριψοκίνδυνη.',
  12: 'Μετά από λάθος απόφαση, αναλύεις τι πήγε στραβά αντί να μετανιώνεις απλώς.',
  13: 'Παίρνεις σημαντικές αποφάσεις κυρίως με βάση το ένστικτο/συναίσθημα, όχι υπολογισμό.',
  14: 'Αν φίλος σε πιέζει να κάνεις κάτι που δεν θέλεις, του λες εύκολα "όχι" χωρίς τύψεις.',
  15: 'Πριν αγοράσεις κάτι αξίας 50€+, κάνεις πάντα σύγκριση και ανάγνωση κριτικών.',
  16: 'Αν ανακαλύψεις στη μέση ενός project ότι η προσέγγισή σου ήταν λάθος, σταματάς και αλλάζεις κατεύθυνση.',
  17: 'Σε ομαδικές αποφάσεις, ακούς όλους πριν εκφράσεις τη γνώμη σου.',
  18: 'Μετά από αποτυχία, σκέφτεσαι "τι θα έκανα διαφορετικά" — όχι "γιατί μου συνέβη αυτό".',
  // ΚΟΙΝΩΝΙΚΗ ΣΥΜΠΕΡΙΦΟΡΑ (19-26)
  19: 'Σε ομαδική εργασία, αναλαμβάνεις αυτόματα τον ρόλο του συντονιστή χωρίς να σου ζητηθεί.',
  20: 'Όταν φίλος μοιράζεται πρόβλημα, η πρώτη σου αντίδραση είναι να του προτείνεις λύσεις.',
  21: 'Αισθάνεσαι άνετα να μιλάς μπροστά σε ομάδα ανθρώπων που δεν γνωρίζεις.',
  22: 'Μετά από βραδιά με πολύ κόσμο, χρειάζεσαι χρόνο μόνος/η για να "επαναφορτιστείς".',
  23: 'Νιώθεις αληθινή ικανοποίηση όταν κάποιος βελτιώνεται ή μαθαίνει κάτι χάρη σε σένα.',
  24: 'Σε νέα παρέα, συνήθως εσύ ξεκινάς τις συζητήσεις και κρατάς ζωντανή την ατμόσφαιρα.',
  25: 'Προτιμάς να δουλεύεις ήσυχα μόνος/η παρά σε ανοιχτό χώρο με διαρκή ανθρώπινη επαφή.',
  26: 'Καταλαβαίνεις εύκολα πώς νιώθει κάποιος, ακόμα και αν δεν το εκφράζει ανοιχτά.',
  // ΑΝΤΙΔΡΑΣΗ ΣΤΟ ΣΤΡΕΣ (27-34)
  27: 'Με τρεις εργασίες και ίδιο deadline, οργανώνεσαι χωρίς πανικό και τις παραδίδεις όλες.',
  28: 'Αν σε εξέταση "κολλήσεις" σε ερώτηση, προχωράς αμέσως στην επόμενη χωρίς να χάσεις ρυθμό.',
  29: 'Σε κατάσταση έκτακτης ανάγκης (ατύχημα, πανικός), παραμένεις ψύχραιμος/η και οργανώνεις.',
  30: 'Αν αποτύχεις σε κάτι σημαντικό, το ξεπερνάς σε λίγες μέρες και συνεχίζεις.',
  31: 'Το να μην ξέρεις τι σου επιφυλάσσει το μέλλον (π.χ. σχολή, δουλειά) σε αγχώνει έντονα.',
  32: 'Αν σε κριτικάρουν άδικα μπροστά σε άλλους, το αφήνεις πίσω σου χωρίς να σε "κατατρώει".',
  33: 'Σε περιόδους έντονης πίεσης, γίνεσαι πιο focused και παραγωγικός/ή παρά να μπλοκάρεις.',
  34: 'Όταν αλλάζει κάτι απρόσμενα, προσαρμόζεσαι γρήγορα αντί να κολλάς σε ό,τι χάθηκε.',
  // ΚΙΝΗΤΡΑ & ΑΞΙΕΣ (35-41)
  35: 'Αν επέλεγες καριέρα, θα έδινες βαρύτητα στις υψηλές αποδοχές έναντι του νοήματος.',
  36: 'Σε παρακινεί περισσότερο η αναγνώριση και ο έπαινος παρά η προσωπική σου ικανοποίηση.',
  37: 'Θέλεις η δουλειά σου να έχει άμεση επίδραση σε ζωές ανθρώπων — να βλέπεις τη διαφορά που κάνεις.',
  38: 'Αν εταιρεία που εκτιμάς κάνει κάτι ανήθικο, θα σταματούσες να τη στηρίζεις έστω και αν κοστίζει.',
  39: 'Το να ανεβείς ιεραρχικά και να έχεις εξουσία είναι σημαντικό κίνητρο για σένα.',
  40: 'Προτιμάς να δουλεύεις για μακροπρόθεσμο στόχο (χρόνια μακριά) παρά να βλέπεις άμεσα αποτελέσματα.',
  41: 'Αν η δουλειά σου δεν συμφωνεί με τις αξίες σου, δεν θα μπορούσες να τη συνεχίσεις ακόμα και αν πληρώνεσαι καλά.',
  // ΔΗΜΙΟΥΡΓΙΚΟΤΗΤΑ & ΠΕΡΙΕΡΓΕΙΑ (42-47)
  42: 'Στον ελεύθερο χρόνο σου καταλήγεις να δημιουργείς κάτι: σχέδιο, κώδικα, μουσική, κείμενο.',
  43: 'Βαριέσαι γρήγορα αν κάτι είναι επαναληπτικό χωρίς καμία πνευματική πρόκληση.',
  44: 'Ερευνάς θέματα που σε ενδιαφέρουν μόνος/η, έξω από το σχολικό πρόγραμμα.',
  45: 'Για να λύσεις πρόβλημα, προτιμάς εντελώς νέα προσέγγιση παρά τον γνωστό τρόπο.',
  46: 'Η αισθητική ενός χώρου ή αντικειμένου σε επηρεάζει έντονα — ένας άσχημος χώρος σε κάνει χειρότερα.',
  47: 'Project με πλήρη ελευθερία (χωρίς οδηγίες) σε ενθουσιάζει περισσότερο από ένα με σαφές πλαίσιο.',
  // ΠΡΑΚΤΙΚΗ ΝΟΗΜΟΣΥΝΗ (48-50)
  48: 'Αν κάτι χαλάσει, η πρώτη σου αντίδραση είναι να το φτιάξεις μόνος/η — όχι να καλέσεις κάποιον.',
  49: 'Μαθαίνεις πολύ καλύτερα κάνοντας κάτι παρά ακούγοντας θεωρία.',
  50: 'Αν έπρεπε να μάθεις κάτι δύσκολο σε μια εβδομάδα, το αντιμετωπίζεις ως συναρπαστική πρόκληση.',
};

// ─────────────────────────────────────────────────────────────
// SECTIONS
// ─────────────────────────────────────────────────────────────
const SECTIONS: Section[] = [
  {
    id: 'thinking',
    title: 'Τρόπος Σκέψης',
    icon: Brain,
    color: 'text-[#f07f97] dark:text-[#ff97b2]',
    bg: 'bg-[#fff5f8] dark:bg-[#2d1c48]/80 border border-[#f07f97]/20 dark:border-white/10',
    questions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  {
    id: 'decisions',
    title: 'Λήψη Αποφάσεων',
    icon: Zap,
    color: 'text-[#f07f97] dark:text-[#ff97b2]',
    bg: 'bg-[#fff5f8] dark:bg-[#2d1c48]/80 border border-[#f07f97]/20 dark:border-white/10',
    questions: [11, 12, 13, 14, 15, 16, 17, 18],
  },
  {
    id: 'social',
    title: 'Κοινωνική Συμπεριφορά',
    icon: Users,
    color: 'text-[#f07f97] dark:text-[#ff97b2]',
    bg: 'bg-[#fff5f8] dark:bg-[#2d1c48]/80 border border-[#f07f97]/20 dark:border-white/10',
    questions: [19, 20, 21, 22, 23, 24, 25, 26],
  },
  {
    id: 'stress',
    title: 'Αντίδραση στο Στρες',
    icon: Wind,
    color: 'text-[#f07f97] dark:text-[#ff97b2]',
    bg: 'bg-[#fff5f8] dark:bg-[#2d1c48]/80 border border-[#f07f97]/20 dark:border-white/10',
    questions: [27, 28, 29, 30, 31, 32, 33, 34],
  },
  {
    id: 'motivation',
    title: 'Κίνητρα & Αξίες',
    icon: Target,
    color: 'text-[#f07f97] dark:text-[#ff97b2]',
    bg: 'bg-[#fff5f8] dark:bg-[#2d1c48]/80 border border-[#f07f97]/20 dark:border-white/10',
    questions: [35, 36, 37, 38, 39, 40, 41],
  },
  {
    id: 'creativity',
    title: 'Δημιουργικότητα',
    icon: Lightbulb,
    color: 'text-[#f07f97] dark:text-[#ff97b2]',
    bg: 'bg-[#fff5f8] dark:bg-[#2d1c48]/80 border border-[#f07f97]/20 dark:border-white/10',
    questions: [42, 43, 44, 45, 46, 47],
  },
  {
    id: 'practical',
    title: 'Πρακτική Νοημοσύνη',
    icon: Code,
    color: 'text-[#f07f97] dark:text-[#ff97b2]',
    bg: 'bg-[#fff5f8] dark:bg-[#2d1c48]/80 border border-[#f07f97]/20 dark:border-white/10',
    questions: [48, 49, 50],
  },
];

// ─────────────────────────────────────────────────────────────
// RESULTS DATA
// ─────────────────────────────────────────────────────────────
const CAT_NAMES: CategoryKey[] = [
  'INFO',
  'FIN',
  'DIOIK',
  'OIK',
  'SERV',
  'PEDAGOGIKA',
  'SOMATA',
  'TEXNES',
];

const BORDER_MAP: Record<CategoryKey, string> = {
  INFO: 'border-[#f07f97]',
  FIN: 'border-[#e06d88]',
  DIOIK: 'border-[#ff97b2]',
  OIK: 'border-[#d96a85]',
  SERV: 'border-[#f07f97]/80',
  PEDAGOGIKA: 'border-[#ffb3c7]',
  SOMATA: 'border-[#e06d88]/90',
  TEXNES: 'border-[#f07f97]',
};
const BAR_MAP: Record<CategoryKey, string> = {
  INFO: 'from-[#f07f97] to-[#e06d88]',
  FIN: 'from-[#e06d88] to-[#d96a85]',
  DIOIK: 'from-[#ff97b2] to-[#f07f97]',
  OIK: 'from-[#f07f97] to-[#ff97b2]',
  SERV: 'from-[#d96a85] to-[#f07f97]',
  PEDAGOGIKA: 'from-[#ffb3c7] to-[#f07f97]',
  SOMATA: 'from-[#e06d88] to-[#ff97b2]',
  TEXNES: 'from-[#f07f97] to-[#d96a85]',
};

const CATEGORY_ACCENT = 'text-[#f07f97] dark:text-[#ff97b2]';
const CATEGORY_GRADIENT =
  'from-[#fff5f8] to-white dark:from-[#2d1c48]/70 dark:to-[#3a2658]';

const RESULTS: Record<CategoryKey, CategoryData> = {
  INFO: {
    title: 'Πληροφορική & Τεχνολογική Διοίκηση',
    description:
      'Σκέφτεσαι αναλυτικά, αγαπάς τα δεδομένα και σε συναρπάζει η τεχνολογία. Ταιριάζεις σε ρόλους που συνδυάζουν λογική και ψηφιακά εργαλεία.',
    icon: Code,
    color: CATEGORY_ACCENT,
    gradient: CATEGORY_GRADIENT,
    schools: [
      {
        name: 'Διοικητικής Επιστήμης & Τεχνολογίας (ΟΠΑ)',
        city: 'Αθήνα',
        code: 240,
        base: '18.400',
      },
      { name: 'Πληροφορικής (ΑΠΘ)', city: 'Θεσσαλονίκη', code: 338, base: '17.720' },
      { name: 'Πληροφορικής & Τηλεπικοινωνιών (ΕΚΠΑ)', city: 'Αθήνα', code: 330, base: '16.955' },
    ],
  },
  FIN: {
    title: 'Λογιστική, Χρηματοοικονομικά & Στατιστική',
    description:
      'Είσαι μεθοδικός/ή και ακριβής. Σε ελκύει ο κόσμος των αριθμών, των επενδύσεων και της ανάλυσης κινδύνου.',
    icon: DollarSign,
    color: CATEGORY_ACCENT,
    gradient: CATEGORY_GRADIENT,
    schools: [
      { name: 'Λογιστικής & Χρηματοοικονομικής (ΟΠΑ)', city: 'Αθήνα', code: 347, base: '15.775' },
      {
        name: 'Χρηματοοικονομικής & Τραπεζικής (ΠΑΠΕΙ)',
        city: 'Πειραιάς',
        code: 155,
        base: '14.850',
      },
      { name: 'Στατιστικής (ΟΠΑ)', city: 'Αθήνα', code: 329, base: '14.440' },
    ],
  },
  DIOIK: {
    title: 'Οργάνωση, Διοίκηση & Marketing',
    description:
      'Έχεις φυσική κλίση στην ηγεσία, στη στρατηγική και στο να κινητοποιείς ανθρώπους. Σε βλέπουμε ως manager ή επιχειρηματία.',
    icon: Briefcase,
    color: CATEGORY_ACCENT,
    gradient: CATEGORY_GRADIENT,
    schools: [
      {
        name: 'Οργάνωσης & Διοίκησης Επιχειρήσεων (ΟΠΑ)',
        city: 'Αθήνα',
        code: 313,
        base: '17.425',
      },
      { name: 'Μάρκετινγκ & Επικοινωνίας (ΟΠΑ)', city: 'Αθήνα', code: 314, base: '16.350' },
      { name: 'Διοίκησης Επιχειρήσεων (ΕΚΠΑ)', city: 'Αθήνα', code: 1005, base: '16.220' },
    ],
  },
  OIK: {
    title: 'Θεωρητικά & Ακαδημαϊκά Οικονομικά',
    description:
      'Σε ελκύει η βαθιά ανάλυση, η θεωρία και η έρευνα. Ταιριάζεις σε ακαδημαϊκό ή ερευνητικό περιβάλλον.',
    icon: TrendingUp,
    color: CATEGORY_ACCENT,
    gradient: CATEGORY_GRADIENT,
    schools: [
      { name: 'Οικονομικής Επιστήμης (ΟΠΑ)', city: 'Αθήνα', code: 312, base: '15.900' },
      { name: 'Οικονομικών Επιστημών (ΕΚΠΑ)', city: 'Αθήνα', code: 309, base: '13.896' },
      { name: 'Οικονομικών Επιστημών (ΑΠΘ)', city: 'Θεσσαλονίκη', code: 311, base: '13.240' },
    ],
  },
  SERV: {
    title: 'Διεθνείς Σπουδές, Τουρισμός & Ναυτιλία',
    description:
      'Σε ελκύει η επαφή με διαφορετικούς ανθρώπους, το διεθνές περιβάλλον και η δυναμική των υπηρεσιών.',
    icon: Globe,
    color: CATEGORY_ACCENT,
    gradient: CATEGORY_GRADIENT,
    schools: [
      {
        name: 'Διεθνών & Ευρωπαϊκών Σπουδών (ΠΑΜΑΚ)',
        city: 'Θεσσαλονίκη',
        code: 161,
        base: '19.295',
        note: 'Ειδ. Γλώσσα',
      },
      {
        name: 'Ναυτιλιακών Σπουδών (ΠΑΠΕΙ)',
        city: 'Πειραιάς',
        code: 157,
        base: '19.210',
        note: 'Ειδ. Αγγλικά',
      },
      {
        name: 'Διεθνών & Ευρωπαϊκών Σπουδών (ΠΑΠΕΙ)',
        city: 'Πειραιάς',
        code: 355,
        base: '18.990',
        note: 'Ειδ. Γλώσσα',
      },
    ],
  },
  PEDAGOGIKA: {
    title: 'Παιδαγωγικές Σπουδές & Εκπαίδευση',
    description:
      'Έχεις εξαιρετική ενσυναίσθηση, υπομονή και αληθινή επιθυμία να βοηθάς άλλους να μαθαίνουν.',
    icon: GraduationCap,
    color: CATEGORY_ACCENT,
    gradient: CATEGORY_GRADIENT,
    schools: [
      {
        name: 'Παιδαγωγικό Δημοτικής Εκπαίδευσης (ΕΚΠΑ)',
        city: 'Αθήνα',
        code: 128,
        base: '16.250',
      },
      {
        name: 'Παιδαγωγικό Δημοτικής Εκπαίδευσης (ΑΠΘ)',
        city: 'Θεσσαλονίκη',
        code: 140,
        base: '15.950',
      },
      { name: 'Εκπαίδευσης Προσχολικής Ηλικίας (ΕΚΠΑ)', city: 'Αθήνα', code: 154, base: '14.800' },
    ],
  },
  SOMATA: {
    title: 'Σώματα Ασφαλείας & Φυσική Αγωγή',
    description:
      'Έχεις ψυχραιμία υπό πίεση, πειθαρχία και ισχυρή φυσική παρουσία. Απαιτούνται Αγωνίσματα & Υγειονομικές Εξετάσεις.',
    icon: Shield,
    color: CATEGORY_ACCENT,
    gradient: CATEGORY_GRADIENT,
    schools: [
      {
        name: 'ΣΣΑΣ Πληροφορικής / Οικονομικό',
        city: 'Θεσσαλονίκη',
        code: 889,
        base: '18.240–17.735',
        note: 'Αγων./Υγειον.',
      },
      {
        name: 'Αξιωματικών Ελληνικής Αστυνομίας',
        city: 'Ελλάδα',
        code: 869,
        base: '17.590',
        note: 'Αγων./Ψυχοτ.',
      },
      {
        name: 'Επιστήμης Φυσικής Αγωγής (ΕΚΠΑ)',
        city: 'Αθήνα',
        code: 401,
        base: '17.399',
        note: 'Αγωνίσματα',
      },
    ],
  },
  TEXNES: {
    title: 'Τέχνες, Design & Μουσική',
    description:
      'Η δημιουργικότητα είναι ο τρόπος που σκέφτεσαι. Ταιριάζεις σε σχολές που απαιτούν Ειδικά Μαθήματα.',
    icon: Palette,
    color: CATEGORY_ACCENT,
    gradient: CATEGORY_GRADIENT,
    schools: [
      {
        name: 'Μουσικής Επιστήμης & Τέχνης (ΠΑΜΑΚ)',
        city: 'Θεσσαλονίκη',
        code: 409,
        base: '15.600',
        note: 'Ειδ. Μουσικής',
      },
      {
        name: 'Γραφιστικής & Οπτικής Επικοινωνίας (ΠΑΔΑ)',
        city: 'Αιγάλεω',
        code: 674,
        base: '13.745',
        note: 'Ειδ. Σχέδιο',
      },
      { name: 'Κινηματογράφου (ΑΠΘ)', city: 'Θεσσαλονίκη', code: 163, base: '13.125' },
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const STORAGE_KEY = 'prosanatolismos_v3';
const ALL_IDS = Object.keys(QUESTIONS).map(Number);
const RANK_LABELS = ['1η κλίση', '2η κλίση', '3η κλίση'];

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
const Prosanatolismospage: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isCalc, setIsCalc] = useState(false);
  const [isHydrating, setIsHydrating] = useState(false);
  const [sectionIdx, setSectionIdx] = useState(0);
  const isMounted = useRef(true);
  /** Κύλιση προς τα αποτελέσματα μόνο μετά «Υπολογισμός» ή φόρτωση αποθηκευμένου — όχι σε κάθε re-render. */
  const resultsAnchorRef = useRef<HTMLElement | null>(null);
  const sectionNavRef = useRef<HTMLDivElement | null>(null);
  const scrollResultsAfterUpdate = useRef<'off' | 'calculate' | 'hydrate'>('off');

  const scrollSectionNav = useCallback((direction: -1 | 1) => {
    sectionNavRef.current?.scrollBy({ left: direction * 220, behavior: 'smooth' });
  }, []);

  const totalAnswered = ALL_IDS.filter((id) => answers[id] !== undefined).length;
  const totalQuestions = ALL_IDS.length;
  const progress = Math.round((totalAnswered / totalQuestions) * 100);
  const currentSection = SECTIONS[sectionIdx];

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s) {
        const p = JSON.parse(s);
        if (p && typeof p === 'object' && !Array.isArray(p)) {
          const norm = normalizeAnswersMap(p as Record<string, unknown>);
          if (Object.keys(norm).length > 0) setAnswers(norm);
        }
      }
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    if (Object.keys(answers).length > 0)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
      } catch {
        /* silent */
      }
  }, [answers]);

  useEffect(() => {
    if (!results) return;
    const mode = scrollResultsAfterUpdate.current;
    if (mode === 'off') return;
    scrollResultsAfterUpdate.current = 'off';
    const frame = requestAnimationFrame(() => {
      resultsAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, [results]);

  useEffect(() => {
    const nav = sectionNavRef.current;
    if (!nav) return;
    const active = nav.querySelector<HTMLElement>(`[data-section-idx="${sectionIdx}"]`);
    active?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [sectionIdx]);

  useEffect(() => {
    const loadLatestSavedResult = async () => {
      if (Object.keys(answers).length > 0) return;

      setIsHydrating(true);
      try {
        const response = await apiFetch<{ found: boolean; result?: SavedResultApiShape }>(
          `${getBackendUrl()}/api/career-orientation/result`,
          {
            method: 'GET',
            timeoutMs: 8000,
            retries: 1,
            dedupeKey: 'career-orientation-result:public',
          }
        );

        if (!response.found || !response.result) return;

        const restoredAnswers = normalizeAnswersMap(
          (response.result.answers ?? {}) as Record<string, unknown>
        );

        if (Object.keys(restoredAnswers).length > 0 && isMounted.current) {
          scrollResultsAfterUpdate.current = 'hydrate';
          setAnswers(restoredAnswers);
          // If backend payload is partial, compute safely from answers.
          setResults(computeCareerOrientationResults(restoredAnswers));
          setSuccess('Φορτώθηκε το τελευταίο αποθηκευμένο αποτέλεσμα.');
          setTimeout(() => {
            if (isMounted.current) setSuccess('');
          }, 4500);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted.current) setIsHydrating(false);
      }
    };

    loadLatestSavedResult();
  }, [answers]);

  const handleChange = useCallback((qId: number, score: number) => {
    if (score < 1 || score > 5) return;
    setAnswers((prev) => ({ ...prev, [qId]: score }));
    setError('');
  }, []);

  const handleReset = useCallback(() => {
    if (!window.confirm('Διαγραφή όλων των απαντήσεων;')) return;
    setAnswers({});
    setResults(null);
    setError('');
    setSuccess('');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* silent */
    }
  }, []);

  const saveToBackend = useCallback(
    async (calc: CalculationResult) => {
      setIsSaving(true);
      try {
        await apiFetch<{ message: string }>(`${getBackendUrl()}/api/career-orientation/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            answers,
            results: {
              final_scores: calc.finalScores,
              top_category: calc.topCategory,
              sorted_scores: calc.sortedScores.map((x) => ({
                category: x.category,
                score: x.rawScore,
                pct: x.displayPct,
              })),
            },
          }),
          timeoutMs: 10000,
          retries: 1,
        });
        if (isMounted.current) {
          setSuccess('Αποθηκεύτηκε επιτυχώς.');
          setTimeout(() => {
            if (isMounted.current) setSuccess('');
          }, 4000);
        }
      } catch (e) {
        console.error(e);
        if (isMounted.current) {
          setError(
            'Αποθηκεύτηκε τοπικά, αλλά απέτυχε η online αποθήκευση. Δοκιμάστε ξανά αργότερα.'
          );
        }
      } finally {
        if (isMounted.current) setIsSaving(false);
      }
    },
    [answers]
  );

  const handleCalculate = useCallback(async () => {
    const missing = ALL_IDS.filter((id) => answers[id] === undefined).length;
    if (missing > 0) {
      setError(`Λείπουν ${missing} απαντήσεις από τις ${totalQuestions}.`);
      return;
    }
    setIsCalc(true);
    setError('');
    try {
      const calc = computeCareerOrientationResults(answers);
      if (isMounted.current) {
        scrollResultsAfterUpdate.current = 'calculate';
        setResults(calc);
        void saveToBackend(calc);
      }
    } catch (e) {
      console.error(e);
      if (isMounted.current) setError('Σφάλμα υπολογισμού. Δοκιμάστε ξανά.');
    } finally {
      if (isMounted.current) setIsCalc(false);
    }
  }, [answers, saveToBackend, totalQuestions]);

  const sectionDone = (sec: Section) =>
    sec.questions.filter((id) => answers[id] !== undefined).length;
  const sectionFull = (sec: Section) => sectionDone(sec) === sec.questions.length;

  return (
    <motion.div
      className="min-h-screen bg-[#ff97b2] dark:bg-[#2d1c48] text-gray-900 dark:text-gray-100 transition-colors duration-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero */}
      <header className="border-b border-[#f07f97]/35 dark:border-white/10 bg-white/90 dark:bg-[#3a2658]/90 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12 text-center">
          <PageMenuIcon
            icon="prosanatolismos"
            wrapperClassName="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#ff97b2]/15 dark:bg-white/10 mb-3"
            className="w-9 h-9"
          />
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-[#faf5ef] tracking-tight">
            Επαγγελματικός Προσανατολισμός
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            50 ερωτήσεις προσωπικότητας · 8 κατηγορίες σπουδών
          </p>

          <div className="max-w-md mx-auto mt-6">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2 font-semibold">
              <span>
                {totalAnswered}/{totalQuestions} απαντήσεις
              </span>
              <div className="flex items-center gap-2">
                <span>{progress}%</span>
                {totalAnswered > 0 && (
                  <button
                    type="button"
                    onClick={handleReset}
                    title="Επαναφορά"
                    className="p-1 rounded-lg bg-[#f07f97]/10 hover:bg-[#f07f97]/20 dark:bg-white/10 dark:hover:bg-white/15 text-[#f07f97] dark:text-[#ff97b2] transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
            <div className="w-full bg-[#f07f97]/15 dark:bg-white/10 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-[#f07f97] rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </header>

      {isHydrating && (
        <div className="max-w-3xl mx-auto px-4 pt-4">
          <div className="inline-flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 bg-white/90 dark:bg-[#3a2658]/90 px-3 py-2 rounded-xl border border-[#f07f97]/20">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#f07f97]" />
            Ανάκτηση τελευταίου αποθηκευμένου αποτελέσματος…
          </div>
        </div>
      )}

      {/* Section nav */}
      <div className="sticky top-20 z-20 bg-white/95 dark:bg-[#3a2658]/95 backdrop-blur-lg shadow-sm">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => scrollSectionNav(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 shrink-0 p-2 rounded-xl border border-[#f07f97]/25 dark:border-white/15 bg-white dark:bg-[#2d1c48] text-[#f07f97] dark:text-[#ff97b2] hover:bg-[#fff5f8] dark:hover:bg-white/5 transition-colors touch-manipulation shadow-sm"
              aria-label="Κύλιση ενότητων αριστερά"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div
              ref={sectionNavRef}
              className="scrollbar-none flex gap-2 overflow-x-auto mx-11 sm:mx-12 scroll-smooth"
            >
              {SECTIONS.map((sec, idx) => {
                const Icon = sec.icon;
                const done = sectionFull(sec);
                const active = sectionIdx === idx;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    data-section-idx={idx}
                    onClick={() => setSectionIdx(idx)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all shrink-0 ${
                      active
                        ? 'bg-[#f07f97] text-white border-[#f07f97] shadow-sm'
                        : done
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : 'bg-white dark:bg-[#2d1c48] text-gray-600 dark:text-gray-300 border-[#f07f97]/20 dark:border-white/10 hover:border-[#f07f97]/40'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {sec.title}
                    {done && !active ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    ) : !done && !active ? (
                      <span className="text-[10px] font-semibold opacity-60">
                        {sectionDone(sec)}/{sec.questions.length}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => scrollSectionNav(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 shrink-0 p-2 rounded-xl border border-[#f07f97]/25 dark:border-white/15 bg-white dark:bg-[#2d1c48] text-[#f07f97] dark:text-[#ff97b2] hover:bg-[#fff5f8] dark:hover:bg-white/5 transition-colors touch-manipulation shadow-sm"
              aria-label="Κύλιση ενότητων δεξιά"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8 sm:py-10 pb-16">
        {/* ΑΠΟΤΕΛΕΣΜΑΤΑ */}
        <AnimatePresence>
          {results && (
            <motion.section
              ref={resultsAnchorRef}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-10 rounded-2xl border border-[#f07f97]/25 dark:border-white/15 bg-white dark:bg-[#3a2658] shadow-lg overflow-hidden scroll-mt-28"
            >
              <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-[#f07f97]/15 dark:border-white/10 bg-[#fff5f8] dark:bg-[#2d1c48]/80">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                    Τα αποτελέσματά σου
                  </h2>
                  {isSaving && (
                    <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 text-[#f07f97]" />
                      Αποθήκευση online…
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Το % δείχνει τη σχετική προτίμησή σου ανάμεσα στις 8 κατηγορίες (η 1η κλίση = 100%).
                  Η κατάταξη βασίζεται στο πόσο ξεχωρίζει κάθε κατηγορία από το ουδέτερο προφίλ σου.
                </p>
              </div>

              <div className="p-5 sm:p-6 space-y-6">
                <div className="grid sm:grid-cols-3 gap-4">
                  {results.sortedScores.slice(0, 3).map((item, rank) => (
                    <ResultCard
                      key={item.category}
                      category={item.category}
                      displayPct={item.displayPct}
                      rank={rank + 1}
                    />
                  ))}
                </div>

                <div className="rounded-xl border border-[#f07f97]/15 dark:border-white/10 bg-[#fff5f8]/60 dark:bg-[#2d1c48]/50 p-4 sm:p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#f07f97] dark:text-[#ff97b2] mb-4">
                    Πλήρης κατάταξη
                  </p>
                  <div className="space-y-3">
                    {results.sortedScores.map((item, idx) => {
                      const data = RESULTS[item.category];
                      const Icon = data.icon;
                      return (
                        <div key={item.category} className="flex items-center gap-3">
                          <span className="text-[11px] font-bold text-gray-400 w-5 text-right shrink-0 tabular-nums">
                            {idx + 1}
                          </span>
                          <Icon className={`w-4 h-4 shrink-0 ${data.color}`} />
                          <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 flex-1 min-w-0 truncate">
                            {data.title}
                          </span>
                          <div className="hidden sm:block flex-[1.5] max-w-[140px] bg-white dark:bg-[#3a2658] rounded-full h-2 overflow-hidden border border-[#f07f97]/10">
                            <motion.div
                              className={`h-full rounded-full bg-gradient-to-r ${BAR_MAP[item.category]}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${item.displayPct}%` }}
                              transition={{ duration: 0.6, delay: idx * 0.05, ease: 'easeOut' }}
                            />
                          </div>
                          <span className="text-xs font-black text-[#f07f97] dark:text-[#ff97b2] w-10 text-right shrink-0 tabular-nums">
                            {item.displayPct}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-[#f07f97]/25 dark:border-white/15 bg-white dark:bg-[#3a2658] shadow-md overflow-hidden"
          >
            <div className={`flex items-center gap-3 px-4 sm:px-5 py-4 ${currentSection.bg}`}>
              {React.createElement(currentSection.icon, {
                className: `w-5 h-5 shrink-0 ${currentSection.color}`,
              })}
              <div className="min-w-0">
                <h2 className={`font-black text-base sm:text-lg ${currentSection.color}`}>
                  {currentSection.title}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Ενότητα {sectionIdx + 1} από {SECTIONS.length}
                </p>
              </div>
              <span className="ml-auto text-xs font-bold text-gray-500 dark:text-gray-400 shrink-0 tabular-nums">
                {sectionDone(currentSection)}/{currentSection.questions.length}
              </span>
            </div>

            <div className="px-4 sm:px-5 py-5 sm:py-6">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 px-1 leading-relaxed">
                Απάντα αυθόρμητα.{' '}
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  1 = Διαφωνώ απόλυτα · 5 = Συμφωνώ απόλυτα
                </span>
              </p>

              <div className="space-y-3">
                {currentSection.questions.map((id) => (
                  <QuestionBlock
                    key={id}
                    qId={id}
                    question={QUESTIONS[id]}
                    selectedScore={answers[id]}
                    onChange={handleChange}
                  />
                ))}
              </div>

              <div className="flex justify-between items-center mt-6 pt-5 border-t border-[#f07f97]/15 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setSectionIdx((i) => Math.max(0, i - 1))}
                  disabled={sectionIdx === 0}
                  className="flex items-center gap-1 px-3 sm:px-4 py-2.5 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Προηγούμενη
                </button>

                {sectionIdx < SECTIONS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setSectionIdx((i) => i + 1)}
                    className="flex items-center gap-1 px-5 py-2.5 text-sm font-bold bg-[#f07f97] text-white rounded-xl hover:bg-[#e06d88] transition-colors shadow-sm"
                  >
                    Επόμενη <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCalculate}
                    disabled={totalAnswered < totalQuestions || isCalc}
                    className={`flex items-center gap-1.5 px-5 sm:px-6 py-2.5 text-sm font-black rounded-xl transition-all ${
                      totalAnswered < totalQuestions || isCalc
                        ? 'bg-gray-200 dark:bg-[#2d1c48] text-gray-400 cursor-not-allowed'
                        : 'bg-[#f07f97] text-white hover:bg-[#e06d88] shadow-md'
                    }`}
                  >
                    {isCalc ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Υπολογισμός…
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> Δες τα αποτελέσματά σου
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex flex-col items-center gap-2">
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center gap-2 text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-4 py-2.5 rounded-xl text-sm font-semibold"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {success}
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center gap-2 text-red-800 dark:text-red-200 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 px-4 py-2.5 rounded-xl text-sm font-semibold"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          {totalAnswered < totalQuestions && (
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Απομένουν{' '}
              <strong className="text-[#f07f97] dark:text-[#ff97b2]">
                {totalQuestions - totalAnswered}
              </strong>{' '}
              ερωτήσεις
            </p>
          )}
        </div>
      </main>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────
// RESULT CARD
// ─────────────────────────────────────────────────────────────
const ResultCard: React.FC<{ category: CategoryKey; displayPct: number; rank: number }> = ({
  category,
  displayPct,
  rank,
}) => {
  const data = RESULTS[category];
  const Icon = data.icon;
  const border = BORDER_MAP[category];
  const bar = BAR_MAP[category];
  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl border border-[#f07f97]/15 dark:border-white/10 border-t-4 ${border} bg-gradient-to-br ${data.gradient}`}
    >
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#f07f97] dark:text-[#ff97b2] mb-3">
        {RANK_LABELS[rank - 1]}
      </p>
      <div className="flex items-start gap-2.5 mb-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fff5f8] dark:bg-[#2d1c48] border border-[#f07f97]/15">
          <Icon className={`w-4 h-4 ${data.color}`} />
        </div>
        <h3 className="text-sm font-black text-gray-900 dark:text-white leading-snug">{data.title}</h3>
      </div>
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-gray-500 dark:text-gray-400">Ταύτιση</span>
          <span className={`font-black tabular-nums ${data.color}`}>{displayPct}%</span>
        </div>
        <div className="w-full bg-white dark:bg-[#2d1c48] rounded-full h-2 overflow-hidden border border-[#f07f97]/10">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${bar}`}
            initial={{ width: 0 }}
            animate={{ width: `${displayPct}%` }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        </div>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{data.description}</p>
      <div className="border-t border-[#f07f97]/15 dark:border-white/10 pt-3">
        <p className="text-[11px] font-black uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400 mb-2">
          Προτεινόμενες σχολές
        </p>
        <ul className="space-y-2">
          {data.schools.map((s) => (
            <li
              key={s.code}
              className="flex items-start gap-2 bg-white/80 dark:bg-[#2d1c48]/80 p-2.5 rounded-xl border border-[#f07f97]/10 dark:border-white/5"
            >
              <CheckCircle className={`w-3.5 h-3.5 mt-0.5 ${data.color} shrink-0`} />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-900 dark:text-white leading-snug">
                  {s.name}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                  {s.city} · Κωδ. {s.code} · Βάση {s.base}
                  {s.note ? ` · ${s.note}` : ''}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// QUESTION BLOCK
// ─────────────────────────────────────────────────────────────
const QuestionBlock: React.FC<{
  qId: number;
  question: string;
  selectedScore?: number;
  onChange: (id: number, score: number) => void;
}> = ({ qId, question, selectedScore, onChange }) => (
  <div className="p-4 rounded-xl border border-[#f07f97]/15 dark:border-white/10 bg-[#fff5f8]/40 dark:bg-[#2d1c48]/40 hover:border-[#f07f97]/30 transition-colors">
    <p className="text-sm text-gray-800 dark:text-gray-100 mb-3.5 leading-relaxed">
      <span className="text-[#f07f97] dark:text-[#ff97b2] font-black mr-2 text-xs tabular-nums">
        {qId}.
      </span>
      {question}
    </p>
    <div className="flex items-center gap-1 sm:gap-1.5">
      <span className="text-[10px] text-gray-400 w-10 hidden sm:block leading-tight">Όχι</span>
      {[1, 2, 3, 4, 5].map((score) => (
        <button
          key={score}
          type="button"
          onClick={() => onChange(qId, score)}
          className={`flex-1 h-10 rounded-xl text-sm font-black transition-all ${
            selectedScore === score
              ? 'bg-[#f07f97] text-white shadow-sm ring-2 ring-[#f07f97]/30 dark:ring-[#ff97b2]/30'
              : 'bg-white dark:bg-[#3a2658] text-gray-600 dark:text-gray-300 border border-[#f07f97]/10 dark:border-white/10 hover:border-[#f07f97]/40 hover:text-[#f07f97] dark:hover:text-[#ff97b2]'
          }`}
        >
          {score}
        </button>
      ))}
      <span className="text-[10px] text-gray-400 w-10 text-right hidden sm:block leading-tight">
        Ναι
      </span>
    </div>
  </div>
);

export default Prosanatolismospage;
