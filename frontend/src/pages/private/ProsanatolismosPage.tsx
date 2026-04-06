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
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabaseClient';
import { getBackendUrl } from '@/utils/backendUrl';
import { apiFetch } from '@/utils/apiClient';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
type CategoryKey = 'INFO' | 'FIN' | 'DIOIK' | 'OIK' | 'SERV' | 'PEDAGOGIKA' | 'SOMATA' | 'TEXNES';

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
interface ScoredCategory {
  category: CategoryKey;
  rawScore: number;
  displayPct: number; // 0-100, normalized above-neutral
}
interface CalculationResult {
  finalScores: Record<CategoryKey, number>;
  topCategory: CategoryKey;
  tiedCategories: CategoryKey[];
  sortedScores: ScoredCategory[];
}
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
  11: 'Μεταξύ μιας σίγουρης/μέτριας επιλογής και μιας ριψοκίνδυνης/πολλά υποσχόμενης, διαλέγεις την ριψοκίνδυνη. (1=ποτέ → 5=πάντα)',
  12: 'Μετά από λάθος απόφαση, αναλύεις τι πήγε στραβά αντί να μετανιώνεις απλώς.',
  13: 'Παίρνεις σημαντικές αποφάσεις κυρίως με βάση το ένστικτο/συναίσθημα, όχι υπολογισμό. (1=σπάνια → 5=συχνά)',
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
  31: 'Το να μην ξέρεις τι σου επιφυλάσσει το μέλλον (π.χ. σχολή, δουλειά) σε αγχώνει έντονα. (1=καθόλου → 5=πολύ)',
  32: 'Αν σε κριτικάρουν άδικα μπροστά σε άλλους, το αφήνεις πίσω σου χωρίς να σε "κατατρώει".',
  33: 'Σε περιόδους έντονης πίεσης, γίνεσαι πιο focused και παραγωγικός/ή παρά να μπλοκάρεις.',
  34: 'Όταν αλλάζει κάτι απρόσμενα, προσαρμόζεσαι γρήγορα αντί να κολλάς σε ό,τι χάθηκε.',
  // ΚΙΝΗΤΡΑ & ΑΞΙΕΣ (35-41)
  35: 'Αν επέλεγες καριέρα, θα έδινες βαρύτητα στις υψηλές αποδοχές έναντι του νοήματος. (1=νόημα πρώτα → 5=χρήματα πρώτα)',
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
// SCORE MATRIX  [INFO, FIN, DIOIK, OIK, SERV, PED, SOM, TEX]
// ─────────────────────────────────────────────────────────────
const SCORE_MATRIX: Record<number, number[]> = {
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

// Υπολογισμένα από Python: Σ(weight[i]*3) για neutral, Σ(weight[i]*5) για max
const NEUTRAL_SCORES: Record<CategoryKey, number> = {
  INFO: 345,
  FIN: 234,
  DIOIK: 309,
  OIK: 222,
  SERV: 198,
  PEDAGOGIKA: 141,
  SOMATA: 204,
  TEXNES: 228,
};
const SPREAD_SCORES: Record<CategoryKey, number> = {
  INFO: 230,
  FIN: 156,
  DIOIK: 206,
  OIK: 148,
  SERV: 132,
  PEDAGOGIKA: 94,
  SOMATA: 136,
  TEXNES: 152,
};

// ─────────────────────────────────────────────────────────────
// SECTIONS
// ─────────────────────────────────────────────────────────────
const SECTIONS: Section[] = [
  {
    id: 'thinking',
    title: 'Τρόπος Σκέψης',
    icon: Brain,
    color: 'text-violet-600',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    questions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  {
    id: 'decisions',
    title: 'Λήψη Αποφάσεων',
    icon: Zap,
    color: 'text-amber-600',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    questions: [11, 12, 13, 14, 15, 16, 17, 18],
  },
  {
    id: 'social',
    title: 'Κοινωνική Συμπεριφορά',
    icon: Users,
    color: 'text-sky-600',
    bg: 'bg-sky-50 dark:bg-sky-900/20',
    questions: [19, 20, 21, 22, 23, 24, 25, 26],
  },
  {
    id: 'stress',
    title: 'Αντίδραση στο Στρες',
    icon: Wind,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    questions: [27, 28, 29, 30, 31, 32, 33, 34],
  },
  {
    id: 'motivation',
    title: 'Κίνητρα & Αξίες',
    icon: Target,
    color: 'text-rose-600',
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    questions: [35, 36, 37, 38, 39, 40, 41],
  },
  {
    id: 'creativity',
    title: 'Δημιουργικότητα',
    icon: Lightbulb,
    color: 'text-fuchsia-600',
    bg: 'bg-fuchsia-50 dark:bg-fuchsia-900/20',
    questions: [42, 43, 44, 45, 46, 47],
  },
  {
    id: 'practical',
    title: 'Πρακτική Νοημοσύνη',
    icon: Code,
    color: 'text-teal-600',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
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
  INFO: 'border-fuchsia-500',
  FIN: 'border-pink-500',
  DIOIK: 'border-rose-500',
  OIK: 'border-red-400',
  SERV: 'border-purple-500',
  PEDAGOGIKA: 'border-pink-300',
  SOMATA: 'border-orange-400',
  TEXNES: 'border-fuchsia-600',
};
const BAR_MAP: Record<CategoryKey, string> = {
  INFO: 'from-fuchsia-400 to-fuchsia-600',
  FIN: 'from-pink-400 to-pink-600',
  DIOIK: 'from-rose-400 to-rose-600',
  OIK: 'from-red-400 to-red-500',
  SERV: 'from-purple-400 to-purple-600',
  PEDAGOGIKA: 'from-pink-300 to-pink-500',
  SOMATA: 'from-orange-400 to-orange-500',
  TEXNES: 'from-fuchsia-500 to-fuchsia-700',
};

const RESULTS: Record<CategoryKey, CategoryData> = {
  INFO: {
    title: 'Πληροφορική & Τεχνολογική Διοίκηση 🚀',
    description:
      'Σκέφτεσαι αναλυτικά, αγαπάς τα δεδομένα και σε συναρπάζει η τεχνολογία. Ταιριάζεις σε ρόλους που συνδυάζουν λογική και ψηφιακά εργαλεία.',
    icon: Code,
    color: 'text-fuchsia-600',
    gradient: 'from-fuchsia-50 to-white dark:from-fuchsia-900/30 dark:to-gray-900',
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
    title: 'Λογιστική, Χρηματοοικονομικά & Στατιστική 📊',
    description:
      'Είσαι μεθοδικός/ή και ακριβής. Σε ελκύει ο κόσμος των αριθμών, των επενδύσεων και της ανάλυσης κινδύνου.',
    icon: DollarSign,
    color: 'text-pink-600',
    gradient: 'from-pink-50 to-white dark:from-pink-900/30 dark:to-gray-900',
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
    title: 'Οργάνωση, Διοίκηση & Marketing 🎯',
    description:
      'Έχεις φυσική κλίση στην ηγεσία, στη στρατηγική και στο να κινητοποιείς ανθρώπους. Σε βλέπουμε ως manager ή επιχειρηματία.',
    icon: Briefcase,
    color: 'text-rose-600',
    gradient: 'from-rose-50 to-white dark:from-rose-900/30 dark:to-gray-900',
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
    title: 'Θεωρητικά & Ακαδημαϊκά Οικονομικά 🎓',
    description:
      'Σε ελκύει η βαθιά ανάλυση, η θεωρία και η έρευνα. Ταιριάζεις σε ακαδημαϊκό ή ερευνητικό περιβάλλον.',
    icon: TrendingUp,
    color: 'text-red-500',
    gradient: 'from-red-50 to-white dark:from-red-900/30 dark:to-gray-900',
    schools: [
      { name: 'Οικονομικής Επιστήμης (ΟΠΑ)', city: 'Αθήνα', code: 312, base: '15.900' },
      { name: 'Οικονομικών Επιστημών (ΕΚΠΑ)', city: 'Αθήνα', code: 309, base: '13.896' },
      { name: 'Οικονομικών Επιστημών (ΑΠΘ)', city: 'Θεσσαλονίκη', code: 311, base: '13.240' },
    ],
  },
  SERV: {
    title: 'Διεθνείς Σπουδές, Τουρισμός & Ναυτιλία 🌎',
    description:
      'Σε ελκύει η επαφή με διαφορετικούς ανθρώπους, το διεθνές περιβάλλον και η δυναμική των υπηρεσιών.',
    icon: Globe,
    color: 'text-purple-600',
    gradient: 'from-purple-50 to-white dark:from-purple-900/30 dark:to-gray-900',
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
    title: 'Παιδαγωγικές Σπουδές & Εκπαίδευση 🍎',
    description:
      'Έχεις εξαιρετική ενσυναίσθηση, υπομονή και αληθινή επιθυμία να βοηθάς άλλους να μαθαίνουν.',
    icon: GraduationCap,
    color: 'text-pink-500',
    gradient: 'from-pink-50 to-white dark:from-pink-800/30 dark:to-gray-900',
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
    title: 'Σώματα Ασφαλείας & Φυσική Αγωγή 🛡️',
    description:
      'Έχεις ψυχραιμία υπό πίεση, πειθαρχία και ισχυρή φυσική παρουσία. Απαιτούνται Αγωνίσματα & Υγειονομικές Εξετάσεις.',
    icon: Shield,
    color: 'text-orange-500',
    gradient: 'from-orange-50 to-white dark:from-orange-900/30 dark:to-gray-900',
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
    title: 'Τέχνες, Design & Μουσική 🎨',
    description:
      'Η δημιουργικότητα είναι ο τρόπος που σκέφτεσαι. Ταιριάζεις σε σχολές που απαιτούν Ειδικά Μαθήματα.',
    icon: Palette,
    color: 'text-fuchsia-700',
    gradient: 'from-fuchsia-100 to-white dark:from-fuchsia-900/40 dark:to-gray-900',
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
const BACKEND_URL = getBackendUrl();
const ALL_IDS = Object.keys(QUESTIONS).map(Number);
const RANK_LABELS = ['🥇 Κορυφαία κλίση', '🥈 2η κλίση', '🥉 3η κλίση'];

// ─────────────────────────────────────────────────────────────
// SCORING LOGIC  (pure function — εύκολο να τεσταριστεί)
// ─────────────────────────────────────────────────────────────
function computeResults(answers: Record<number, number>): CalculationResult {
  // 1. Raw scores — κάθε απάντηση 1–5 πολλαπλασιάζεται με το βάρος της ερώτησης ανά κατηγορία.
  // Για μερικώς συμπληρωμένα δεδομένα (π.χ. παλιό API) λείπουσες ερωτήσεις → ουδέτερο 3.
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
  ALL_IDS.forEach((id) => {
    const w = SCORE_MATRIX[id];
    if (!w) return;
    const a = answers[id];
    const value = typeof a === 'number' && a >= 1 && a <= 5 ? a : 3;
    CAT_NAMES.forEach((cat, i) => {
      raw[cat] += value * w[i];
    });
  });

  // 2. Above-neutral ratio:  (score - neutral) / spread  → [0, 1]
  //    Κλιπάρουμε στο 0 (αρνητικό = λιγότερο από neutral)
  const aboveNeutral: Record<CategoryKey, number> = {} as any;
  CAT_NAMES.forEach((cat) => {
    aboveNeutral[cat] = Math.max(0, (raw[cat] - NEUTRAL_SCORES[cat]) / SPREAD_SCORES[cat]);
  });

  // 3. Normalize: ο winner παίρνει 100, οι υπόλοιποι αναλογικά
  const topRatio = Math.max(...CAT_NAMES.map((c) => aboveNeutral[c]));

  const sorted: ScoredCategory[] = CAT_NAMES.map((cat) => ({
    category: cat,
    rawScore: raw[cat],
    // Αν topRatio=0 (όλα neutral) → 0%, αλλιώς relative
    displayPct: topRatio > 0 ? Math.round((aboveNeutral[cat] / topRatio) * 100) : 0,
  })).sort((a, b) => b.rawScore - a.rawScore);

  const topScore = sorted[0].rawScore;
  const tied = sorted.filter((x) => x.rawScore === topScore).map((x) => x.category);

  return {
    finalScores: raw,
    topCategory: sorted[0].category,
    tiedCategories: tied,
    sortedScores: sorted,
  };
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
const Prosanatolismospage: React.FC = () => {
  const { user } = useAuth();
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
  const scrollResultsAfterUpdate = useRef<'off' | 'calculate' | 'hydrate'>('off');

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
        if (p && typeof p === 'object') setAnswers(p);
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
    const loadLatestSavedResult = async () => {
      if (!user) return;
      if (Object.keys(answers).length > 0) return;

      setIsHydrating(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const token = session?.access_token;
        if (!token) return;

        const response = await apiFetch<{ found: boolean; result?: SavedResultApiShape }>(
          `${BACKEND_URL}/api/career-orientation/result`,
          {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
            timeoutMs: 8000,
            retries: 1,
            dedupeKey: `career-orientation-result:${user.id}`,
          }
        );

        if (!response.found || !response.result) return;

        const restoredAnswers = Object.entries(response.result.answers ?? {}).reduce<
          Record<number, number>
        >((acc, [key, value]) => {
          const qId = Number(key);
          if (Number.isFinite(qId) && value >= 1 && value <= 5) acc[qId] = value;
          return acc;
        }, {});

        if (Object.keys(restoredAnswers).length > 0 && isMounted.current) {
          scrollResultsAfterUpdate.current = 'hydrate';
          setAnswers(restoredAnswers);
          // If backend payload is partial, compute safely from answers.
          setResults(computeResults(restoredAnswers));
          setSuccess('✅ Φορτώθηκε το τελευταίο αποθηκευμένο αποτέλεσμα.');
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
  }, [user, answers]);

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
      if (!user) return;
      setIsSaving(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const token = session?.access_token;
        if (!token) throw new Error('Not authenticated');
        await apiFetch<{ message: string }>(`${BACKEND_URL}/api/career-orientation/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
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
          setSuccess('✅ Αποθηκεύτηκε!');
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
    [user, answers]
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
      const calc = computeResults(answers);
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
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10 bg-white dark:bg-gray-900 min-h-screen">
      {/* HEADER */}
      <header className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
          Επαγγελματικός Προσανατολισμός
        </h1>
        <p className="text-gray-400 text-sm mb-4">
          50 ερωτήσεις βιωματικής προσωπικότητας · 8 κατηγορίες
        </p>
        <div className="max-w-sm mx-auto">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>
              <strong className="text-rose-500">{totalAnswered}</strong>/{totalQuestions}
            </span>
            <div className="flex items-center gap-2">
              <span>{progress}%</span>
              {totalAnswered > 0 && (
                <button
                  onClick={handleReset}
                  title="Επαναφορά"
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-rose-500 to-pink-400"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </div>
        </div>
      </header>

      {isHydrating && (
        <div className="mb-4 inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Ανάκτηση τελευταίου αποθηκευμένου αποτελέσματος...
        </div>
      )}

      {/* ΑΠΟΤΕΛΕΣΜΑΤΑ */}
      <AnimatePresence>
        {results && (
          <motion.section
            ref={resultsAnchorRef}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-10 p-5 md:p-7 rounded-2xl bg-gradient-to-br from-rose-50 to-white dark:from-gray-800 dark:to-gray-800 border border-rose-200 dark:border-rose-800 shadow-xl scroll-mt-24"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-rose-700 dark:text-rose-300 text-center">
                🏆 Τα Αποτελέσματά Σου
              </h2>
              {isSaving && (
                <span className="flex items-center justify-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                  Αποθήκευση online…
                </span>
              )}
            </div>
            <p className="text-center text-xs text-gray-400 mb-6">
              Το % δείχνει πόσο <em>ξεπερνάς το ουδέτερο</em> σε κάθε κατηγορία, σε σχέση με την
              κορυφαία σου κλίση
            </p>

            {/* Top 3 cards */}
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {results.sortedScores.slice(0, 3).map((item, rank) => (
                <ResultCard
                  key={item.category}
                  category={item.category}
                  displayPct={item.displayPct}
                  rank={rank + 1}
                />
              ))}
            </div>

            {/* Full ranking */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Πλήρης Κατάταξη
              </p>
              <div className="space-y-2">
                {results.sortedScores.map((item, idx) => {
                  const data = RESULTS[item.category];
                  const Icon = data.icon;
                  return (
                    <div key={item.category} className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 w-4 text-right shrink-0">
                        {idx + 1}
                      </span>
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${data.color}`} />
                      <span className="text-xs text-gray-600 dark:text-gray-300 w-32 truncate shrink-0">
                        {data.title.split(' ').slice(0, 2).join(' ')}
                      </span>
                      <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full bg-gradient-to-r ${BAR_MAP[item.category]}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.displayPct}%` }}
                          transition={{ duration: 0.6, delay: idx * 0.07, ease: 'easeOut' }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-300 w-9 text-right shrink-0">
                        {item.displayPct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* SECTION PILLS */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {SECTIONS.map((sec, idx) => {
          const Icon = sec.icon;
          const done = sectionFull(sec);
          const active = sectionIdx === idx;
          return (
            <button
              key={sec.id}
              onClick={() => setSectionIdx(idx)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all shrink-0 ${
                active
                  ? 'bg-rose-500 text-white border-rose-500 shadow'
                  : done
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700'
                    : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700 hover:border-rose-300'
              }`}
            >
              <Icon className="w-3 h-3" />
              {sec.title}
              {done && !active && <span className="ml-0.5 text-green-500 text-[10px]">✓</span>}
              {!done && !active && (
                <span className="ml-0.5 text-gray-300 dark:text-gray-600 text-[10px]">
                  {sectionDone(sec)}/{sec.questions.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ΕΡΩΤΗΣΕΙΣ */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.18 }}
        >
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl mb-4 ${currentSection.bg}`}>
            {React.createElement(currentSection.icon, {
              className: `w-5 h-5 ${currentSection.color}`,
            })}
            <h2 className={`font-bold ${currentSection.color}`}>{currentSection.title}</h2>
            <span className="ml-auto text-xs text-gray-400">
              {sectionDone(currentSection)}/{currentSection.questions.length}
            </span>
          </div>

          <p className="text-xs text-gray-400 mb-4 px-1">
            Απάντα αυθόρμητα.&nbsp;
            <span className="font-medium text-gray-500 dark:text-gray-400">
              1 = Διαφωνώ απόλυτα&nbsp;·&nbsp;5 = Συμφωνώ απόλυτα
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
                accentColor={currentSection.color}
              />
            ))}
          </div>

          {/* Prev / Next */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setSectionIdx((i) => Math.max(0, i - 1))}
              disabled={sectionIdx === 0}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-25 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Προηγούμενη
            </button>

            {sectionIdx < SECTIONS.length - 1 ? (
              <button
                onClick={() => setSectionIdx((i) => i + 1)}
                className="flex items-center gap-1 px-5 py-2 text-sm font-semibold bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors shadow-sm"
              >
                Επόμενη <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleCalculate}
                disabled={totalAnswered < totalQuestions || isCalc}
                className={`flex items-center gap-1.5 px-6 py-2 text-sm font-extrabold rounded-lg shadow transition-all ${
                  totalAnswered < totalQuestions || isCalc
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-rose-600 text-white hover:bg-rose-700 hover:scale-105 active:scale-95'
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
        </motion.div>
      </AnimatePresence>

      {/* ΜΗΝΥΜΑΤΑ */}
      <div className="mt-5 flex flex-col items-center gap-2">
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-2 text-green-700 bg-green-50 border border-green-300 px-4 py-2 rounded-lg text-sm font-semibold"
            >
              <CheckCircle2 className="w-4 h-4" />
              {success}
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-2 text-red-700 bg-red-50 border border-red-300 px-4 py-2 rounded-lg text-sm font-semibold"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
        {totalAnswered < totalQuestions && (
          <p className="text-xs text-gray-400">
            Απομένουν <strong className="text-rose-500">{totalQuestions - totalAnswered}</strong>{' '}
            ερωτήσεις
          </p>
        )}
      </div>
    </div>
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
      className={`p-4 border-t-4 ${border} rounded-xl shadow-md bg-gradient-to-br ${data.gradient} hover:shadow-lg transition-shadow`}
    >
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">
        {RANK_LABELS[rank - 1]}
      </p>
      <div className="flex items-start gap-2 mb-3">
        <Icon className={`w-5 h-5 mt-0.5 ${data.color} shrink-0`} />
        <h3 className={`text-sm font-extrabold ${data.color} leading-tight`}>{data.title}</h3>
      </div>
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-400">Ταύτιση</span>
          <span className={`font-bold ${data.color}`}>{displayPct}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${bar}`}
            initial={{ width: 0 }}
            animate={{ width: `${displayPct}%` }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        </div>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
        {data.description}
      </p>
      <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
        <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
          Προτεινόμενες Σχολές:
        </p>
        <ul className="space-y-1.5">
          {data.schools.map((s) => (
            <li
              key={s.code}
              className="flex items-start gap-1.5 bg-white/70 dark:bg-gray-800/70 p-2 rounded-lg"
            >
              <CheckCircle className={`w-3.5 h-3.5 mt-0.5 ${data.color} shrink-0`} />
              <div>
                <p className="text-xs font-semibold text-gray-900 dark:text-white leading-snug">
                  {s.name} ({s.city})
                </p>
                <p className="text-[10px] text-gray-400">
                  Κωδ.: {s.code} · Βάση: {s.base}
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
  accentColor?: string;
}> = ({ qId, question, selectedScore, onChange, accentColor = 'text-rose-500' }) => (
  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:border-rose-300 dark:hover:border-rose-700 transition-colors">
    <p className="text-sm text-gray-800 dark:text-gray-200 mb-3 leading-relaxed">
      <span className={`${accentColor} font-bold mr-1.5 text-xs`}>{qId}.</span>
      {question}
    </p>
    <div className="flex items-center gap-1 sm:gap-2">
      <span className="text-[10px] text-gray-400 w-12 hidden sm:block leading-tight">Διαφωνώ</span>
      {[1, 2, 3, 4, 5].map((score) => (
        <motion.button
          key={score}
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(qId, score)}
          className={`flex-1 sm:flex-none sm:w-10 h-9 rounded-lg text-sm font-bold transition-all ${
            selectedScore === score
              ? 'bg-rose-500 text-white shadow ring-2 ring-rose-300 dark:ring-rose-700'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600'
          }`}
        >
          {score}
        </motion.button>
      ))}
      <span className="text-[10px] text-gray-400 w-12 text-right hidden sm:block leading-tight">
        Συμφωνώ
      </span>
    </div>
  </div>
);

export default Prosanatolismospage;
