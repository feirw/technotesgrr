import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Code, Briefcase, TrendingUp, DollarSign, Globe, Shield,
  Palette, CheckCircle, GraduationCap, LucideIcon, RotateCcw,
  Save, AlertCircle, CheckCircle2, Loader2, Brain, Zap,
  Users, Wind, Target, Lightbulb,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

type CategoryKey = 'INFO' | 'FIN' | 'DIOIK' | 'OIK' | 'SERV' | 'PEDAGOGIKA' | 'SOMATA' | 'TEXNES';

interface School { name: string; city: string; code: number; base: string; note?: string; }
interface CategoryData { title: string; description: string; icon: LucideIcon; color: string; gradient: string; schools: School[]; }
interface CalculationResult {
  finalScores: Record<CategoryKey, number>;
  topCategory: CategoryKey;
  tiedCategories: CategoryKey[];
  sortedScores: { category: CategoryKey; score: number }[];
}
interface PersonalitySection { id: string; title: string; icon: LucideIcon; color: string; questions: number[]; }

// ═══════════════════════════════════════════════════════════════
// 50 ΣΤΟΧΕΥΜΕΝΕΣ ΕΡΩΤΗΣΕΙΣ ΠΡΟΣΩΠΙΚΟΤΗΤΑΣ
// ═══════════════════════════════════════════════════════════════

const QUESTIONS: Record<number, string> = {

  // ── ΤΡΟΠΟΣ ΣΚΕΨΗΣ (1–10) ─────────────────────────────────────
  1:  'Όταν αντιμετωπίζεις ένα άγνωστο πρόβλημα, η πρώτη σου κίνηση είναι να το χωρίσεις σε μικρότερα κομμάτια πριν κάνεις οτιδήποτε.',
  2:  'Σε ενοχλεί να χρησιμοποιείς κάτι χωρίς να ξέρεις πώς λειτουργεί από μέσα.',
  3:  'Όταν διαβάζεις για ένα θέμα που σε ενδιαφέρει, συχνά καταλήγεις να έχεις ανοιχτές δεκάδες καρτέλες στο browser.',
  4:  'Βλέπεις εύκολα μοτίβα και συνδέσεις μεταξύ φαινομενικά άσχετων πραγμάτων.',
  5:  'Πριν ξεκινήσεις οτιδήποτε σημαντικό, φτιάχνεις λίστα ή σχέδιο — ακόμα και για τις διακοπές.',
  6:  'Αισθάνεσαι πιο άνετα όταν έχεις αριθμούς και δεδομένα μπροστά σου αντί αόριστες εκτιμήσεις.',
  7:  'Αν κάτι δεν έχει λογική εξήγηση, δεν μπορείς να το αφήσεις — ψάχνεις μέχρι να καταλάβεις.',
  8:  'Θυμάσαι πολύ καλύτερα πράγματα που τα είδες οπτικά (διάγραμμα, mind map) παρά αυτά που διάβασες.',
  9:  'Σε μια συζήτηση, συχνά εσύ είσαι αυτός/ή που λέει "ναι αλλά αν το δούμε από την άλλη πλευρά...".',
  10: 'Όταν κάτι πάει στραβά, η πρώτη σου αντίδραση είναι να αναζητήσεις την αιτία, όχι να βρεις τον ένοχο.',

  // ── ΛΗΨΗ ΑΠΟΦΑΣΕΩΝ (11–18) ───────────────────────────────────
  11: 'Αν σου δώσουν 2 επιλογές — μία σίγουρη με μέτριο αποτέλεσμα και μία αβέβαιη αλλά με μεγάλο ανταμοιβή — συνήθως διαλέγεις την αβέβαιη. (1=ποτέ, 5=πάντα)',
  12: 'Μετά από μια λάθος απόφαση, η πρώτη σου αντίδραση είναι να αναλύσεις τι πήγε στραβά, όχι να μετανιώσεις.',
  13: 'Παίρνεις σημαντικές αποφάσεις κυρίως με βάση τα συναισθήματά σου και όχι με υπολογισμό. (1=σπάνια, 5=συχνά)',
  14: 'Αν ο φίλος σου σε πιέζει να κάνεις κάτι που δεν θέλεις, μπορείς να πεις "όχι" χωρίς τύψεις.',
  15: 'Πριν αγοράσεις κάτι αξίας άνω των 50€, κάνεις πάντα σύγκριση τιμών και ανάγνωση κριτικών.',
  16: 'Αν ανακαλύψεις στη μέση ενός project ότι η αρχική σου προσέγγιση ήταν λάθος, σταματάς και αλλάζεις κατεύθυνση.',
  17: 'Στις ομαδικές αποφάσεις, προτιμάς να ακούσεις όλους πριν εκφράσεις τη γνώμη σου.',
  18: 'Αν ένα σχέδιο αποτύχει, αναρωτιέσαι κυρίως "τι θα έκανα διαφορετικά" και όχι "γιατί μου συνέβη αυτό".',

  // ── ΚΟΙΝΩΝΙΚΗ ΣΥΜΠΕΡΙΦΟΡΑ (19–26) ───────────────────────────
  19: 'Σε μια ομαδική εργασία, τείνεις να αναλαμβάνεις αυτόματα τον ρόλο του συντονιστή χωρίς κανείς να σου το ζητήσει.',
  20: 'Όταν ένας φίλος σου μοιράζεται ένα πρόβλημα, η πρώτη σου αντίδραση είναι να του προτείνεις λύσεις.',
  21: 'Αισθάνεσαι άνετα να μιλάς μπροστά σε ομάδα ανθρώπων που δεν γνωρίζεις.',
  22: 'Μετά από μια βραδιά με πολύ κόσμο, χρειάζεσαι χρόνο μόνος/η για να "επαναφορτιστείς".',
  23: 'Βρίσκεις αληθινή ικανοποίηση όταν βλέπεις κάποιον να βελτιώνεται ή να μαθαίνει κάτι χάρη σε σένα.',
  24: 'Σε νέα παρέα, συνήθως εσύ ξεκινάς τις συζητήσεις και κρατάς ζωντανή την ατμόσφαιρα.',
  25: 'Προτιμάς να δουλεύεις ήσυχα μόνος/η παρά σε ανοιχτό γραφείο με συνεχή ανθρώπινη επαφή.',
  26: 'Μπορείς εύκολα να καταλάβεις πώς νιώθει κάποιος, ακόμα και αν δεν το λέει ανοιχτά.',

  // ── ΑΝΤΙΔΡΑΣΗ ΣΤΟ ΣΤΡΕΣ (27–34) ─────────────────────────────
  27: 'Όταν έχεις τρεις διαφορετικές εργασίες με ίδιο deadline, οργανώνεσαι χωρίς πανικό και τις παραδίδεις όλες.',
  28: 'Αν σε μια εξέταση "κολλήσεις" σε μια ερώτηση, προχωράς στην επόμενη χωρίς να χάσεις τον ρυθμό σου.',
  29: 'Σε κατάσταση έκτακτης ανάγκης (π.χ. ατύχημα, πανικός στο σχολείο), η τάση σου είναι να παραμένεις ψύχραιμος/η και να οργανώνεις.',
  30: 'Αν αποτύχεις σε κάτι που σου είχε σημασία, συνήθως το ξεπερνάς σε λίγες μέρες.',
  31: 'Το να μην ξέρεις τι θα γίνει στο μέλλον (π.χ. πού θα σπουδάσεις) σε αγχώνει πολύ. (1=καθόλου, 5=πολύ)',
  32: 'Αν κάποιος σε κριτικάρει άδικα μπροστά σε άλλους, μπορείς να το αφήσεις πίσω σου χωρίς να σε κατατρώει.',
  33: 'Σε περιόδους έντονης πίεσης, γίνεσαι πιο παραγωγικός/ή και focused παρά να μπλοκάρεις.',
  34: 'Όταν αλλάζει κάτι απρόσμενα στα σχέδιά σου, προσαρμόζεσαι γρήγορα αντί να κολλάς στο τι χάθηκε.',

  // ── ΚΙΝΗΤΡΑ & ΑΞΙΕΣ (35–41) ──────────────────────────────────
  35: 'Αν μπορούσες να επιλέξεις, θα προτιμούσες μια δουλειά με υψηλές αποδοχές έναντι μιας με νόημα αλλά λιγότερα χρήματα. (1=σίγουρα νόημα, 5=σίγουρα χρήματα)',
  36: 'Σε παρακινεί περισσότερο η αναγνώριση και ο έπαινος από άλλους παρά η προσωπική σου ικανοποίηση.',
  37: 'Θέλεις η δουλειά σου να έχει άμεση επίδραση στη ζωή ανθρώπων — να βλέπεις τη διαφορά που κάνεις.',
  38: 'Αν ανακαλύψεις ότι μια εταιρεία που εκτιμάς κάνει κάτι ανήθικο, θα σταματούσες να τη στηρίζεις έστω και αν είναι ακριβό.',
  39: 'Το να ανεβείς ιεραρχικά και να έχεις εξουσία πάνω σε άλλους είναι σημαντικό κίνητρο για σένα.',
  40: 'Προτιμάς να δουλεύεις για έναν μακροπρόθεσμο στόχο (χρόνια μακριά) παρά να βλέπεις άμεσα αποτελέσματα.',
  41: 'Αν η δουλειά σου δεν συμφωνεί με τις αξίες σου, δεν θα μπορούσες να τη συνεχίσεις ακόμα και αν πληρώνεσαι καλά.',

  // ── ΔΗΜΙΟΥΡΓΙΚΟΤΗΤΑ & ΠΕΡΙΕΡΓΕΙΑ (42–47) ────────────────────
  42: 'Στον ελεύθερο χρόνο σου καταλήγεις συχνά να δημιουργείς κάτι: σχέδιο, κώδικα, μουσική, κείμενο.',
  43: 'Βαριέσαι πολύ γρήγορα αν η δουλειά είναι επαναληπτική χωρίς καμία πνευματική πρόκληση.',
  44: 'Ερευνάς θέματα που σε ενδιαφέρουν μόνος/η, έξω από το σχολικό πρόγραμμα.',
  45: 'Αν έπρεπε να λύσεις ένα πρόβλημα, θα προτιμούσες μια εντελώς νέα προσέγγιση παρά να χρησιμοποιήσεις τον γνωστό τρόπο.',
  46: 'Η αισθητική ενός χώρου ή αντικειμένου σε επηρεάζει αισθητά — ένας άσχημος χώρος σε κάνει να αισθάνεσαι χειρότερα.',
  47: 'Ένα project με πλήρη ελευθερία (χωρίς οδηγίες) σε ενθουσιάζει περισσότερο από ένα με σαφείς οδηγίες.',

  // ── ΠΡΑΚΤΙΚΗ ΝΟΗΜΟΣΥΝΗ (48–50) ──────────────────────────────
  48: 'Αν κάτι σπάσει ή χαλάσει, η πρώτη σου αντίδραση είναι να το φτιάξεις μόνος/η — όχι να καλέσεις κάποιον.',
  49: 'Μαθαίνεις πολύ καλύτερα κάνοντας κάτι με τα χέρια σου παρά ακούγοντας θεωρία.',
  50: 'Αν χρειαζόταν να μάθεις κάτι εντελώς νέο και δύσκολο σε μια εβδομάδα, θα το αντιμετώπιζες ως συναρπαστική πρόκληση.',
};

// ═══════════════════════════════════════════════════════════════
// SCORE MATRIX  (INFO, FIN, DIOIK, OIK, SERV, PED, SOM, TEX)
// ═══════════════════════════════════════════════════════════════

const SCORE_MATRIX: Record<number, number[]> = {
  // ── ΤΡΟΠΟΣ ΣΚΕΨΗΣ ────────────────────────────────────────────
  1:  [4,3,1,3,0,0,1,0], // βήμα-βήμα ανάλυση      → INFO FIN OIK
  2:  [4,2,0,3,0,0,0,1], // θέλω να καταλαβαίνω     → INFO OIK
  3:  [4,1,0,3,1,0,0,2], // deep dive σε θέματα     → INFO OIK TEX
  4:  [3,1,2,2,1,0,0,4], // βλέπεις μοτίβα          → INFO TEX OIK
  5:  [2,4,3,2,0,1,3,0], // λίστες & σχέδια         → FIN DIOIK SOM
  6:  [3,4,1,3,0,0,1,0], // αριθμοί & δεδομένα      → FIN INFO OIK
  7:  [4,3,0,3,0,0,0,0], // ψάχνεις εξηγήσεις       → INFO FIN OIK
  8:  [2,0,1,0,0,1,0,4], // οπτική μνήμη            → TEX
  9:  [3,1,2,4,1,0,0,1], // "από άλλη πλευρά"       → OIK INFO
  10: [3,3,2,3,0,0,1,0], // αναζητάς αιτία          → INFO FIN OIK

  // ── ΛΗΨΗ ΑΠΟΦΑΣΕΩΝ ───────────────────────────────────────────
  11: [2,0,3,0,4,0,2,3], // ριψοκίνδυνος            → SERV DIOIK TEX
  12: [3,4,1,3,0,0,1,0], // αναλύεις λάθη           → FIN INFO OIK
  13: [0,0,1,0,1,4,0,3], // αποφάσεις με συναίσθημα → PED TEX
  14: [2,1,4,1,2,0,3,0], // λες εύκολα "όχι"        → DIOIK SOM
  15: [2,4,1,2,0,0,0,0], // έρευνα πριν αγοράς      → FIN INFO OIK
  16: [3,3,2,2,1,0,1,1], // αλλάζεις κατεύθυνση     → INFO FIN
  17: [1,2,3,2,2,3,1,0], // ακούς πριν μιλάς        → DIOIK PED
  18: [3,3,2,3,0,0,1,0], // "τι θα έκανα διαφ."     → INFO FIN OIK

  // ── ΚΟΙΝΩΝΙΚΗ ΣΥΜΠΕΡΙΦΟΡΑ ────────────────────────────────────
  19: [1,0,5,0,3,1,2,0], // αναλαμβάνεις συντ.      → DIOIK SERV
  20: [2,1,3,1,1,1,1,0], // δίνεις λύσεις           → DIOIK INFO
  21: [1,0,4,0,4,2,2,1], // μιλάς μπροστά σε κόσμο → DIOIK SERV
  22: [3,2,0,3,0,0,0,4], // recharge μόνος/η        → INFO OIK TEX
  23: [0,0,2,0,2,5,0,0], // ικανοποίηση βοηθώντας   → PED SERV
  24: [1,0,3,0,4,3,0,1], // ξεκινάς συζητήσεις      → SERV DIOIK PED
  25: [4,3,0,3,0,0,0,3], // ήσυχη δουλειά μόνος     → INFO FIN OIK TEX
  26: [1,0,2,1,2,4,1,1], // ενσυναίσθηση            → PED SERV

  // ── ΑΝΤΙΔΡΑΣΗ ΣΤΟ ΣΤΡΕΣ ─────────────────────────────────────
  27: [2,4,3,2,1,1,3,0], // οργάνωση υπό πίεση      → FIN DIOIK SOM
  28: [3,3,3,2,1,0,3,0], // ψυχραιμία στις εξετάσεις→ INFO FIN SOM
  29: [1,2,3,1,2,1,5,0], // ψύχραιμος σε κρίση      → SOM DIOIK
  30: [3,2,3,1,3,0,4,1], // ξεπερνάς αποτυχία       → SOM DIOIK INFO
  31: [0,3,1,2,0,1,4,0], // άγχος αβεβαιότητας (r)  → SOM FIN (υψηλό=αγχώδης)
  32: [2,2,3,1,2,0,4,0], // αδικη κριτική → αφήνεις → SOM DIOIK
  33: [3,2,3,1,2,0,3,0], // πίεση → παραγωγικός     → INFO DIOIK SOM
  34: [3,1,3,0,3,0,2,2], // προσαρμογή αλλαγής      → DIOIK SERV INFO

  // ── ΚΙΝΗΤΡΑ & ΑΞΙΕΣ ──────────────────────────────────────────
  35: [1,5,3,1,2,0,1,0], // χρήματα vs νόημα (5=χρ.)→ FIN DIOIK
  36: [1,1,4,0,2,0,4,2], // αναγνώριση              → DIOIK SOM
  37: [1,0,2,1,3,5,1,1], // επίδραση σε ανθρώπους   → PED SERV
  38: [1,0,1,2,1,5,0,3], // ηθική πάνω από οφέλη    → PED TEX OIK
  39: [1,2,5,0,2,0,3,0], // εξουσία & ιεραρχία      → DIOIK SOM
  40: [3,3,1,4,0,2,1,2], // μακροπρόθεσμος στόχος   → OIK FIN INFO
  41: [1,0,1,2,1,5,0,4], // αξίες > χρήματα         → PED TEX OIK

  // ── ΔΗΜΙΟΥΡΓΙΚΟΤΗΤΑ & ΠΕΡΙΕΡΓΕΙΑ ─────────────────────────────
  42: [3,0,1,0,0,1,0,5], // δημιουργείς στον χρόνο  → TEX INFO
  43: [3,0,2,1,2,0,0,4], // βαριέσαι επανάληψη      → INFO TEX SERV
  44: [4,1,1,3,1,0,0,3], // ερευνάς μόνος/η          → INFO OIK TEX
  45: [4,0,2,1,1,0,0,4], // νέα προσέγγιση           → INFO TEX DIOIK
  46: [0,0,1,0,0,0,0,5], // αισθητική               → TEX
  47: [3,0,2,1,2,0,0,4], // ελευθερία > οδηγίες     → TEX INFO SERV

  // ── ΠΡΑΚΤΙΚΗ ΝΟΗΜΟΣΥΝΗ ───────────────────────────────────────
  48: [4,1,2,0,1,0,3,2], // φτιάχνεις μόνος/η       → INFO SOM
  49: [3,0,2,0,2,1,4,2], // learning by doing       → SOM INFO SERV
  50: [4,1,3,1,3,0,2,3], // νέα πρόκληση = ευκαιρία → INFO DIOIK SERV TEX
};

// ═══════════════════════════════════════════════════════════════
// ΕΝΟΤΗΤΕΣ
// ═══════════════════════════════════════════════════════════════

const SECTIONS: PersonalitySection[] = [
  { id: 'thinking',   title: 'Τρόπος Σκέψης',              icon: Brain,     color: 'text-violet-600',  questions: [1,2,3,4,5,6,7,8,9,10] },
  { id: 'decisions',  title: 'Λήψη Αποφάσεων',             icon: Zap,       color: 'text-amber-500',   questions: [11,12,13,14,15,16,17,18] },
  { id: 'social',     title: 'Κοινωνική Συμπεριφορά',      icon: Users,     color: 'text-sky-600',     questions: [19,20,21,22,23,24,25,26] },
  { id: 'stress',     title: 'Αντίδραση στο Στρες',        icon: Wind,      color: 'text-emerald-600', questions: [27,28,29,30,31,32,33,34] },
  { id: 'motivation', title: 'Κίνητρα & Αξίες',            icon: Target,    color: 'text-rose-600',    questions: [35,36,37,38,39,40,41] },
  { id: 'creativity', title: 'Δημιουργικότητα & Περιέργεια',icon: Lightbulb, color: 'text-fuchsia-600', questions: [42,43,44,45,46,47] },
  { id: 'practical',  title: 'Πρακτική Νοημοσύνη',         icon: Code,      color: 'text-teal-600',    questions: [48,49,50] },
];

// ═══════════════════════════════════════════════════════════════
// ΑΠΟΤΕΛΕΣΜΑΤΑ
// ═══════════════════════════════════════════════════════════════

const CATEGORY_NAMES: CategoryKey[] = ['INFO','FIN','DIOIK','OIK','SERV','PEDAGOGIKA','SOMATA','TEXNES'];

const MAX_SCORES: Record<CategoryKey, number> = {
  INFO:310, FIN:280, DIOIK:270, OIK:240, SERV:210, PEDAGOGIKA:180, SOMATA:175, TEXNES:210,
};

const BORDER_MAP: Record<CategoryKey, string> = {
  INFO:'border-fuchsia-600', FIN:'border-pink-600', DIOIK:'border-rose-600',
  OIK:'border-red-500', SERV:'border-purple-600', PEDAGOGIKA:'border-pink-400',
  SOMATA:'border-rose-400', TEXNES:'border-fuchsia-700',
};

const RESULTS: Record<CategoryKey, CategoryData> = {
  INFO: {
    title:'Πληροφορική & Τεχνολογική Διοίκηση 🚀',
    description:'Έχεις αναλυτική σκέψη, αγαπάς τα δεδομένα και σε συναρπάζει η τεχνολογία. Οι σχολές αυτές σε βάζουν στον πυρήνα του ψηφιακού μετασχηματισμού.',
    icon:Code, color:'text-fuchsia-600', gradient:'from-fuchsia-100 to-white dark:from-fuchsia-900/40 dark:to-gray-900',
    schools:[
      {name:'Διοικητικής Επιστήμης και Τεχνολογίας (ΟΠΑ)',city:'Αθήνα',code:240,base:'18.400'},
      {name:'Πληροφορικής (ΑΠΘ)',city:'Θεσσαλονίκη',code:338,base:'17.720'},
      {name:'Πληροφορικής και Τηλεπικοινωνιών (ΕΚΠΑ)',city:'Αθήνα',code:330,base:'16.955'},
    ],
  },
  FIN: {
    title:'Λογιστική, Χρηματοοικονομικά & Στατιστική 📊',
    description:'Είσαι ακριβής, μεθοδικός/ή και σε ελκύει ο κόσμος των αριθμών, των επενδύσεων και της ανάλυσης κινδύνου.',
    icon:DollarSign, color:'text-pink-600', gradient:'from-pink-100 to-white dark:from-pink-900/40 dark:to-gray-900',
    schools:[
      {name:'Λογιστικής και Χρηματοοικονομικής (ΟΠΑ)',city:'Αθήνα',code:347,base:'15.775'},
      {name:'Χρηματοοικονομικής και Τραπεζικής Διοικητικής (ΠΑΠΕΙ)',city:'Πειραιάς',code:155,base:'14.850'},
      {name:'Στατιστικής (ΟΠΑ)',city:'Αθήνα',code:329,base:'14.440'},
    ],
  },
  DIOIK: {
    title:'Οργάνωση, Διοίκηση & Marketing 🎯',
    description:'Έχεις φυσική κλίση στην ηγεσία, στη στρατηγική σκέψη και στο να κινητοποιείς ομάδες. Σε βλέπουμε σε ρόλο manager ή επιχειρηματία.',
    icon:Briefcase, color:'text-rose-600', gradient:'from-rose-100 to-white dark:from-rose-900/40 dark:to-gray-900',
    schools:[
      {name:'Οργάνωσης και Διοίκησης Επιχειρήσεων (ΟΠΑ)',city:'Αθήνα',code:313,base:'17.425'},
      {name:'Μάρκετινγκ και Επικοινωνίας (ΟΠΑ)',city:'Αθήνα',code:314,base:'16.350'},
      {name:'Διοίκησης Επιχειρήσεων (ΕΚΠΑ)',city:'Αθήνα',code:1005,base:'16.220'},
    ],
  },
  OIK: {
    title:'Θεωρητικά & Ακαδημαϊκά Οικονομικά 🎓',
    description:'Σε ελκύει η βαθιά ανάλυση, η θεωρία και η έρευνα. Σε φαντάζεσαι σε ακαδημαϊκό ή ερευνητικό περιβάλλον.',
    icon:TrendingUp, color:'text-red-500', gradient:'from-red-100 to-white dark:from-red-900/40 dark:to-gray-900',
    schools:[
      {name:'Οικονομικής Επιστήμης (ΟΠΑ)',city:'Αθήνα',code:312,base:'15.900'},
      {name:'Οικονομικών Επιστημών (ΕΚΠΑ)',city:'Αθήνα',code:309,base:'13.896'},
      {name:'Οικονομικών Επιστημών (ΑΠΘ)',city:'Θεσσαλονίκη',code:311,base:'13.240'},
    ],
  },
  SERV: {
    title:'Διεθνείς Σπουδές, Τουρισμός & Ναυτιλία 🌎',
    description:'Σε ελκύει η επαφή με διαφορετικούς ανθρώπους, το διεθνές περιβάλλον και οι κλάδοι υπηρεσιών.',
    icon:Globe, color:'text-purple-600', gradient:'from-purple-100 to-white dark:from-purple-900/40 dark:to-gray-900',
    schools:[
      {name:'Διεθνών και Ευρωπαϊκών Σπουδών (ΠΑΜΑΚ)',city:'Θεσσαλονίκη',code:161,base:'19.295',note:'Ειδ. Γλώσσα'},
      {name:'Ναυτιλιακών Σπουδών (ΠΑΠΕΙ)',city:'Πειραιάς',code:157,base:'19.210',note:'Ειδ. Αγγλικά'},
      {name:'Διεθνών και Ευρωπαϊκών Σπουδών (ΠΑΠΕΙ)',city:'Πειραιάς',code:355,base:'18.990',note:'Ειδ. Γλώσσα'},
    ],
  },
  PEDAGOGIKA: {
    title:'Παιδαγωγικές Σπουδές & Εκπαίδευση 🍎',
    description:'Έχεις εξαιρετική ενσυναίσθηση, υπομονή και βαθιά επιθυμία να βοηθάς άλλους να μαθαίνουν και να αναπτύσσονται.',
    icon:GraduationCap, color:'text-pink-400', gradient:'from-pink-50 to-white dark:from-pink-800/40 dark:to-gray-900',
    schools:[
      {name:'Παιδαγωγικό Δημοτικής Εκπαίδευσης (ΕΚΠΑ)',city:'Αθήνα',code:128,base:'16.250'},
      {name:'Παιδαγωγικό Δημοτικής Εκπαίδευσης (ΑΠΘ)',city:'Θεσσαλονίκη',code:140,base:'15.950'},
      {name:'Εκπαίδευσης στην Προσχολική Ηλικία (ΕΚΠΑ)',city:'Αθήνα',code:154,base:'14.800'},
    ],
  },
  SOMATA: {
    title:'Σώματα Ασφαλείας & Φυσική Αγωγή 🛡️',
    description:'Έχεις ψυχραιμία, πειθαρχία και ισχυρή φυσική παρουσία. ΠΡΟΣΟΧΗ: απαιτούνται Αγωνίσματα & Υγειονομικές Εξετάσεις.',
    icon:Shield, color:'text-rose-400', gradient:'from-rose-50 to-white dark:from-rose-800/40 dark:to-gray-900',
    schools:[
      {name:'ΣΣΑΣ Πληροφορικής / Οικονομικό',city:'Θεσσαλονίκη',code:889,base:'18.240–17.735',note:'Αγων./Υγειον.'},
      {name:'Αξιωματικών Ελληνικής Αστυνομίας',city:'Ελλάδα',code:869,base:'17.590',note:'Αγων./Ψυχοτ.'},
      {name:'Επιστήμης Φυσικής Αγωγής & Αθλητισμού (ΕΚΠΑ)',city:'Αθήνα',code:401,base:'17.399',note:'Αγωνίσματα'},
    ],
  },
  TEXNES: {
    title:'Τέχνες, Design & Μουσική 🎨',
    description:'Η δημιουργικότητα είναι ο τρόπος που σκέφτεσαι και εκφράζεσαι. Σας ταιριάζουν σχολές που απαιτούν Ειδικά Μαθήματα.',
    icon:Palette, color:'text-fuchsia-700', gradient:'from-fuchsia-200 to-white dark:from-fuchsia-900/50 dark:to-gray-900',
    schools:[
      {name:'Μουσικής Επιστήμης και Τέχνης (ΠΑΜΑΚ)',city:'Θεσσαλονίκη',code:409,base:'15.600',note:'Ειδ. Μουσικής'},
      {name:'Γραφιστικής και Οπτικής Επικοινωνίας (ΠΑΔΑ)',city:'Αιγάλεω',code:674,base:'13.745',note:'Ειδ. Σχέδιο'},
      {name:'Κινηματογράφου (ΑΠΘ)',city:'Θεσσαλονίκη',code:163,base:'13.125'},
    ],
  },
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

const STORAGE_KEY = 'prosanatolismos_v3';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001';
const ALL_IDS     = Object.keys(QUESTIONS).map(Number);

const Prosanatolismospage: React.FC = () => {
  const { user } = useAuth();
  const [answers,        setAnswers]        = useState<Record<number, number>>({});
  const [results,        setResults]        = useState<CalculationResult | null>(null);
  const [error,          setError]          = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSaving,       setIsSaving]       = useState(false);
  const [isCalculating,  setIsCalculating]  = useState(false);
  const [activeSection,  setActiveSection]  = useState<string>(SECTIONS[0].id);
  const isMountedRef = useRef(true);

  const totalAnswered  = ALL_IDS.filter(id => answers[id] !== undefined).length;
  const totalQuestions = ALL_IDS.length;
  const progress       = Math.round((totalAnswered / totalQuestions) * 100);

  useEffect(() => { isMountedRef.current = true; return () => { isMountedRef.current = false; }; }, []);

  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s) { const p = JSON.parse(s); if (p && typeof p === 'object') setAnswers(p); }
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(answers)); } catch { /* silent */ }
    }
  }, [answers]);

  const handleChange = useCallback((qId: number, score: number) => {
    if (score < 1 || score > 5) return;
    setAnswers(prev => ({ ...prev, [qId]: score }));
    setError(''); setSuccessMessage('');
  }, []);

  const handleReset = useCallback(() => {
    if (!window.confirm('Διαγραφή όλων των απαντήσεων;')) return;
    setAnswers({}); setResults(null); setError(''); setSuccessMessage('');
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* silent */ }
  }, []);

  const saveToBackend = useCallback(async (calc: CalculationResult) => {
    if (!user) return;
    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error('Not authenticated');
      const res = await fetch(`${BACKEND_URL}/api/career-orientation/submit`, {
        method:'POST',
        headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`},
        body: JSON.stringify({ answers, results: { final_scores: calc.finalScores, top_category: calc.topCategory, sorted_scores: calc.sortedScores } }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (isMountedRef.current) {
        setSuccessMessage('✅ Αποθηκεύτηκε!');
        setTimeout(() => { if (isMountedRef.current) setSuccessMessage(''); }, 4000);
      }
    } catch (e) { console.error(e); }
    finally { if (isMountedRef.current) setIsSaving(false); }
  }, [user, answers]);

  const calculateResults = useCallback(async () => {
    const missing = ALL_IDS.filter(id => answers[id] === undefined).length;
    if (missing > 0) { setError(`Λείπουν ${missing} απαντήσεις.`); return; }
    setIsCalculating(true); setError('');
    try {
      const scores: Record<CategoryKey,number> = {INFO:0,FIN:0,DIOIK:0,OIK:0,SERV:0,PEDAGOGIKA:0,SOMATA:0,TEXNES:0};
      ALL_IDS.forEach(id => {
        const w = SCORE_MATRIX[id]; if (!w) return;
        CATEGORY_NAMES.forEach((cat, i) => { scores[cat] += answers[id] * w[i]; });
      });
      const sorted = (Object.entries(scores) as [CategoryKey,number][])
        .map(([category,score]) => ({category,score}))
        .sort((a,b) => b.score - a.score);
      const max  = sorted[0].score;
      const tied = sorted.filter(x => x.score === max).map(x => x.category);
      const calc: CalculationResult = { finalScores:scores, topCategory:sorted[0].category, tiedCategories:tied, sortedScores:sorted };
      if (isMountedRef.current) { setResults(calc); window.scrollTo({top:0,behavior:'smooth'}); saveToBackend(calc); }
    } catch (e) { console.error(e); if (isMountedRef.current) setError('Σφάλμα υπολογισμού. Δοκιμάστε ξανά.'); }
    finally { if (isMountedRef.current) setIsCalculating(false); }
  }, [answers, saveToBackend]);

  const currentSection = SECTIONS.find(s => s.id === activeSection) ?? SECTIONS[0];
  const sectionIdx     = SECTIONS.findIndex(s => s.id === activeSection);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 bg-white dark:bg-gray-900 min-h-screen">

      {/* HEADER */}
      <header className="text-center mb-8 border-b pb-5 border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-1">
          Επαγγελματικός Προσανατολισμός
        </h1>
        <p className="text-gray-400 text-sm mb-5">50 ερωτήσεις προσωπικότητας · 8 κατηγορίες επαγγελμάτων</p>
        <div className="max-w-xl mx-auto">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              <strong className="text-rose-600">{totalAnswered}</strong>/{totalQuestions} ({progress}%)
            </span>
            {totalAnswered > 0 && (
              <button onClick={handleReset} className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1">
                <RotateCcw className="w-3 h-3"/> Επαναφορά
              </button>
            )}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-rose-500 to-pink-500"
              animate={{width:`${progress}%`}} transition={{duration:0.4,ease:'easeOut'}}/>
          </div>
        </div>
      </header>

      {/* ΑΠΟΤΕΛΕΣΜΑΤΑ */}
      <AnimatePresence>
        {results && (
          <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0}}
            className="mb-10 p-6 rounded-2xl bg-rose-50 dark:bg-gray-800 border border-rose-200 dark:border-rose-700 shadow-xl">
            <h2 className="text-2xl font-bold text-rose-700 dark:text-rose-300 mb-2 text-center">🏆 Αποτελέσματα</h2>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
              {results.tiedCategories.length === 1
                ? `Κυρίαρχη κλίση: ${RESULTS[results.topCategory].title}`
                : `Ισοπαλία: ${results.tiedCategories.map(c => RESULTS[c].title.split(' ')[0]).join(', ')}`}
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.sortedScores.slice(0,3).map(item => (
                <ResultCard key={item.category} category={item.category} score={item.score}/>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION TABS — scrollable pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {SECTIONS.map(sec => {
          const Icon = sec.icon;
          const done = sec.questions.filter(id => answers[id] !== undefined).length;
          const isActive = activeSection === sec.id;
          return (
            <button key={sec.id} onClick={() => setActiveSection(sec.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-rose-500 text-white border-rose-500 shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-rose-300'
              }`}>
              <Icon className="w-3.5 h-3.5"/>
              {sec.title}
              <span className={`text-[10px] ml-0.5 ${isActive ? 'text-rose-100' : 'text-gray-400'}`}>
                {done}/{sec.questions.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* ΕΡΩΤΗΣΕΙΣ ΕΝΕΡΓΗΣ ΕΝΟΤΗΤΑΣ */}
      <AnimatePresence mode="wait">
        <motion.div key={activeSection}
          initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
          transition={{duration:0.2}}>

          {/* Section header */}
          <div className="flex items-center gap-2 mb-5">
            {React.createElement(currentSection.icon, {className:`w-5 h-5 ${currentSection.color}`})}
            <h2 className={`font-bold text-lg ${currentSection.color}`}>{currentSection.title}</h2>
            <span className="text-xs text-gray-400 ml-auto">Απάντα αυθόρμητα — δεν υπάρχει σωστό ή λάθος</span>
          </div>

          <div className="space-y-3">
            {currentSection.questions.map(id => (
              <QuestionBlock key={id} qId={id}
                question={QUESTIONS[id]}
                selectedScore={answers[id]}
                onChange={handleChange}
                accentColor={currentSection.color}/>
            ))}
          </div>

          {/* Πλοήγηση ενοτήτων */}
          <div className="flex justify-between mt-6">
            <button onClick={() => setActiveSection(SECTIONS[Math.max(0, sectionIdx-1)].id)}
              disabled={sectionIdx === 0}
              className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800 disabled:opacity-30 transition-colors">
              ← Προηγούμενη
            </button>
            {sectionIdx < SECTIONS.length - 1 ? (
              <button onClick={() => setActiveSection(SECTIONS[sectionIdx+1].id)}
                className="px-5 py-2 text-sm font-semibold bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors shadow-sm">
                Επόμενη →
              </button>
            ) : (
              <button onClick={calculateResults}
                disabled={totalAnswered < totalQuestions || isCalculating || isSaving}
                className={`px-6 py-2 text-sm font-extrabold rounded-lg shadow-md transition-all ${
                  totalAnswered < totalQuestions || isCalculating || isSaving
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-rose-600 text-white hover:bg-rose-700 hover:scale-105 active:scale-95'
                }`}>
                {isCalculating || isSaving
                  ? <span className="flex items-center gap-1"><Loader2 className="w-4 h-4 animate-spin"/>Επεξεργασία...</span>
                  : <span className="flex items-center gap-1"><Save className="w-4 h-4"/>Δες τα αποτελέσματα</span>
                }
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ΜΗΝΥΜΑΤΑ */}
      <div className="mt-6 text-center space-y-2">
        <AnimatePresence>
          {successMessage && (
            <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
              className="inline-flex items-center gap-2 text-green-700 bg-green-50 border border-green-300 px-4 py-2 rounded-lg text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4"/>{successMessage}
            </motion.div>
          )}
          {error && (
            <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
              className="inline-flex items-center gap-2 text-red-700 bg-red-50 border border-red-300 px-4 py-2 rounded-lg text-sm font-semibold">
              <AlertCircle className="w-4 h-4"/>{error}
            </motion.div>
          )}
        </AnimatePresence>
        {totalAnswered < totalQuestions && (
          <p className="text-xs text-gray-400">Απομένουν <strong className="text-rose-500">{totalQuestions - totalAnswered}</strong> ερωτήσεις</p>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// RESULT CARD
// ═══════════════════════════════════════════════════════════════

const ResultCard: React.FC<{category: CategoryKey; score: number}> = ({category, score}) => {
  const data   = RESULTS[category];
  const Icon   = data.icon;
  const pct    = Math.min(100, Math.round((score / MAX_SCORES[category]) * 100));
  const border = BORDER_MAP[category];
  return (
    <div className={`p-4 border-t-4 ${border} rounded-xl shadow-lg bg-gradient-to-br ${data.gradient} hover:scale-[1.02] transition-transform`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-6 h-6 ${data.color} flex-shrink-0`}/>
        <h3 className={`text-sm font-extrabold ${data.color} leading-tight`}>{data.title}</h3>
      </div>
      <div className="mb-2">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="h-2 rounded-full bg-gradient-to-r from-pink-400 to-rose-600" style={{width:`${pct}%`}}/>
        </div>
        <p className="text-[10px] text-gray-400 mt-0.5">{pct}% ταύτιση</p>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">{data.description}</p>
      <ul className="space-y-1.5">
        {data.schools.map(s => (
          <li key={s.code} className="flex items-start gap-1.5 bg-white dark:bg-gray-800 p-2 rounded-lg">
            <CheckCircle className={`w-3.5 h-3.5 mt-0.5 ${data.color} flex-shrink-0`}/>
            <div>
              <p className="text-xs font-semibold text-gray-900 dark:text-white">{s.name} ({s.city})</p>
              <p className="text-[10px] text-gray-400">Κωδ.: {s.code} · Βάση: {s.base}{s.note ? ` · ${s.note}` : ''}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// QUESTION BLOCK
// ═══════════════════════════════════════════════════════════════

interface QuestionBlockProps {
  qId: number; question: string; selectedScore?: number;
  onChange: (qId: number, score: number) => void; accentColor?: string;
}

const QuestionBlock: React.FC<QuestionBlockProps> = ({qId,question,selectedScore,onChange,accentColor='text-rose-600'}) => (
  <motion.div
    initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}
    className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-md transition-shadow"
  >
    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3 leading-relaxed">
      <span className={`${accentColor} font-bold mr-1`}>{qId}.</span>{question}
    </p>
    <div className="flex items-center justify-between gap-1">
      <span className="text-[10px] text-gray-400 w-14 hidden sm:block">Διαφωνώ</span>
      {[1,2,3,4,5].map(score => (
        <motion.button key={score} type="button"
          whileHover={{scale:1.12}} whileTap={{scale:0.88}}
          onClick={() => onChange(qId, score)}
          className={`w-9 h-9 rounded-full text-sm font-bold transition-all flex items-center justify-center ${
            selectedScore === score
              ? 'bg-rose-500 text-white shadow-md ring-2 ring-rose-300'
              : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-rose-50 dark:hover:bg-rose-900/20'
          }`}>
          {score}
        </motion.button>
      ))}
      <span className="text-[10px] text-gray-400 w-14 text-right hidden sm:block">Συμφωνώ</span>
    </div>
  </motion.div>
);

export default Prosanatolismospage;