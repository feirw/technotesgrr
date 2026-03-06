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
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ═══════════════════════════════════════════════════════════════
 * 🦕 TYPES & INTERFACES
 * ═══════════════════════════════════════════════════════════════
 */

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

interface CalculationResult {
  finalScores: Record<CategoryKey, number>;
  topCategory: CategoryKey;
  tiedCategories: CategoryKey[];
  sortedScores: { category: CategoryKey; score: number }[];
}

// ═══════════════════════════════════════════════════════════════
// 📊 ΔΕΔΟΜΕΝΑ
// ═══════════════════════════════════════════════════════════════

// 1. Ερωτήσεις (Q_ID: Ερώτηση)
const QUESTIONS: Record<number, string> = {
  // ΕΝΟΤΗΤΑ Α: ΠΛΗΦΟΡΙΚΗ & ΤΕΧΝΟΛΟΓΙΑ (INFO)
  1: 'Με ενδιαφέρει ο προγραμματισμός και η δημιουργία εφαρμογών ή ιστοσελίδων.',
  2: 'Μου αρέσει να βρίσκω λύσεις σε επιχειρηματικά προβλήματα χρησιμοποιώντας δεδομένα και αλγόριθμους.',
  3: 'Η χρήση της Πληροφορικής (AI, Big Data) για την πρόβλεψη οικονομικών τάσεων είναι συναρπαστική.',
  // ΕΝΟΤΗΤΑ Β: ΑΚΑΔΗΜΑΪΚΑ ΟΙΚΟΝΟΜΙΚΑ (OIK)
  4: 'Θέλω να ασχοληθώ με τη θεωρία, να γράψω μελέτες και να αναλύσω τα αίτια των οικονομικών κρίσεων.',
  5: 'Η μελέτη της Μακροοικονομίας (ΑΕΠ, πληθωρισμός) και οι πολιτικές των Κεντρικών Τραπεζών με ελκύουν.',
  6: 'Προτιμώ την ακαδημαϊκή έρευνα και τη συστηματική μελέτη των οικονομικών συστημάτων.',
  // ΕΝΟΤΗΤΑ Γ: ΔΙΟΙΚΗΣΗ & MARKETING (DIOIK)
  7: 'Θέλω να διαχειρίζομαι ομάδες, να παίρνω αποφάσεις και να ηγούμαι στην υλοποίηση στόχων μιας εταιρείας.',
  8: 'Με ενδιαφέρει το πώς θα προωθήσω ένα προϊόν ή υπηρεσία, χτίζοντας μια επιτυχημένη μάρκα (Marketing).',
  9: 'Είμαι καλός/ή στην οργάνωση διαδικασιών και πιστεύω ότι η βελτιστοποίηση της παραγωγής είναι κλειδί (Management).',
  // ΕΝΟΤΗΤΑ Δ: ΛΟΓΙΣΤΙΚΗ & ΧΡΗΜΑΤΟΟΙΚΟΝΟΜΙΚΑ (FIN)
  10: 'Είμαι προσεκτικός/ή στις λεπτομέρειες και με ενδιαφέρει η τήρηση οικονομικών βιβλίων (Λογιστική).',
  11: 'Θέλω να εργαστώ στον χρηματοπιστωτικό τομέα (Τράπεζες, Επενδυτικές) και να διαχειρίζομαι κεφάλαια.',
  12: 'Με ευχαριστεί η Στατιστική Ανάλυση, η πιθανότητα και η εφαρμογή σύνθετων μαθηματικών μοντέλων.',
  // ΕΝΟΤΗΤΑ Ε: ΔΙΕΘΝΗ & ΥΠΗΡΕΣΙΕΣ (SERV)
  13: 'Θέλω να ασχοληθώ με τις διεθνείς οικονομικές σχέσεις, το εμπόριο και τις γεωπολιτικές επιπτώσεις τους.',
  14: 'Με ενδιαφέρει ο κλάδος του Τουρισμού ή της Ναυτιλίας και η διοίκηση υπηρεσιών.',
  15: 'Θεωρώ ότι μια ξένη γλώσσα (π.χ. Αγγλικά, Γερμανικά) είναι απαραίτητο εφόδιο για την καριέρα μου.',
  // ΕΝΟΤΗΤΑ ΣΤ: ΣΩΜΑΤΑ ΑΣΦΑΛΕΙΑΣ & ΕΦΑΑ (SOMATA)
  16: 'Με ελκύει η στρατιωτική/αστυνομική ζωή, η πειθαρχία και η ιεραρχία.',
  17: 'Έχω εξαιρετική φυσική κατάσταση και θα με ενδιέφερε μια καριέρα που απαιτεί σωματική ετοιμότητα.',
  18: 'Θέλω μια καριέρα με σαφείς ρόλους, προσφορά στην πατρίδα/ασφάλεια και σταθερότητα.',
  19: 'Με ενδιαφέρει η εκγύμναση και η προπόνηση αθλητών.',
  // ΕΝΟΤΗΤΑ Ζ: ΠΑΙΔΑΓΩΓΙΚΑ (PEDAGOGIKA)
  20: 'Με ενδιαφέρει η διδασκαλία και η φροντίδα παιδιών προσχολικής ή σχολικής ηλικίας .',
  21: 'Έχω υπομονή, ενσυναίσθηση και θέλω να συμβάλλω στη γνωστική ανάπτυξη των μαθητών.',
  22: 'Ενδιαφέρομαι για την Ειδική Αγωγή και τη στήριξη μαθητών με ιδιαίτερες ανάγκες.',
  23: 'Προτιμώ μια καριέρα όπου ο κύριος ρόλος μου είναι η εκπαίδευση και η καθοδήγηση.',
  // ΕΝΟΤΗΤΑ Η: ΤΕΧΝΕΣ & ΚΑΛΛΙΤΕΧΝΙΚΕΣ ΣΧΟΛΕΣ (TEXNES)
  24: 'Έχω έντονο καλλιτεχνικό ενδιαφέρον και θέλω να το σπουδάσω.',
  25: 'Με ενδιαφέρει η τεχνική πλευρά της τέχνης, όπως ο Ήχος, η Εικόνα, η Φωτογραφία ή ο Κινηματογράφος.',
  26: 'Είμαι έτοιμος/η να εξεταστώ σε ειδικά μαθήματα για την εισαγωγή μου.',
  27: 'Η δημιουργία οπτικών έργων (design, γραφιστική) ή η εσωτερική αρχιτεκτονική με ελκύει.',
  // ΕΝΟΤΗΤΑ Θ: ΓΕΝΙΚΕΣ ΠΡΟΤΙΜΗΣΕΙΣ
  28: 'Η επιλογή μου θα πρέπει να οδηγήσει σε επάγγελμα με υψηλή ζήτηση και υψηλές αποδοχές.',
  29: 'Είμαι πρόθυμος/η να σπουδάσω μακριά από τη Θεσσαλονίκη ή την Αθήνα.',
  30: 'Θεωρώ τον εαυτό μου πιο τεχνοκράτη παρά διοικητικό.',
  31: 'Η ακρίβεια και η τάξη είναι πιο σημαντικές από την ταχύτητα στην εκτέλεση της εργασίας μου.',
  32: 'Προτιμώ τη διαχείριση ανθρώπων από τη διαχείριση χρημάτων ή συστημάτων.',
  33: 'Πιστεύω ότι το μέλλον της Οικονομίας συνδέεται άρρηκτα με την Τεχνολογία.',
  34: 'Ενδιαφέρομαι για την ανακύκλωση, τη βιώσιμη ανάπτυξη και το περιβάλλον.',
  35: 'Με ενδιαφέρει να ασχοληθώ με την ανάλυση κινδύνου και την ασφαλιστική επιστήμη.',
  36: 'Προτιμώ τη δουλειά γραφείου και τη συστηματική ανάλυση έναντι των εξωτερικών ή απαιτητικών φυσικά εργασιών.',
  37: 'Μου αρέσει να δουλεύω με παιδιά και με ενδιαφέρει η ψυχολογία της ανάπτυξης.',
  38: 'Η δημιουργία είναι πιο σημαντική από την ερμηνεία ενός έτοιμου ρόλου.',
  39: 'Η ιδέα της ένταξης σε ένα Σώμα με αυστηρούς κανονισμούς μου προσφέρει ασφάλεια.',
  40: 'Θα προτιμούσα μια καριέρα που συνδυάζει Οικονομία/Διοίκηση με τη Ναυτιλία/Διεθνείς Σχέσεις.',
  41: 'Είμαι οργανωτικός/ή και με ενδιαφέρει η μεθοδική καταγραφή.',
  42: 'Έχω καλή αίσθηση του χώρου και με ενδιαφέρει η αρχιτεκτονική ή ο σχεδιασμός προϊόντων.',
  43: 'Η επιλογή σχολής πρέπει να είναι μια από τις πιο ανταγωνιστικές και υψηλόβαθμες (βάσει μορίων).',
  44: 'Είμαι καλός/ή στην ιστορία, τη φιλοσοφία και τη θεωρητική ανάλυση.',
  45: 'Η δημόσια διοίκηση και η νομική/κοινωνική πολιτική με ελκύουν.',
  // ΕΝΟΤΗΤΑ Ι: ΧΑΡΑΚΤΗΡΑΣ & ΠΡΟΣΩΠΙΚΟΤΗΤΑ
  46: 'Είμαι οργανωτικός/ή και μου αρέσει να έχω τα πάντα σε τάξη και προγραμματισμένα.',
  47: 'Προτιμώ να δουλεύω μόνος/η μου παρά σε ομάδα.',
  48: 'Είμαι άτομο που λαμβάνει γρήγορες αποφάσεις και δεν με πτοεί η αλλαγή.',
  49: 'Μου αρέσει να βοηθώ άλλους και να λύνω τα προβλήματά τους.',
  50: 'Είμαι περιπετειώδης τύπος και μου αρέσει να δοκιμάζω νέα πράγματα.',
  51: 'Προτιμώ τη σταθερότητα και την ασφάλεια έναντι της αβεβαιότητας.',
  52: 'Είμαι δημιουργικός/ή και μου αρέσει να φαντασιώνω και να σχεδιάζω.',
  53: 'Μου αρέσει να ασχολούμαι με πολλά διαφορετικά πράγματα ταυτόχρονα.',
  54: 'Είμαι λεπτολόγος/ος και προσεκτικός/ή στις λεπτομέρειες.',
  55: 'Προτιμώ να ακολουθώ καθορισμένες διαδικασίες και κανόνες.',
  56: 'Είμαι κοινωνικός/ή και μου αρέσει να συνεργάζομαι με άλλους.',
  57: 'Μου αρέσει να αναλύω προβλήματα βαθιά πριν πάρω αποφάσεις.',
  58: 'Είμαι αμφιθυμικός/ή και μου αρέσει να κάνω παρέα με πολλούς ανθρώπους.',
  59: 'Προτιμώ να έχω πολύ προσωπικό χρόνο και χώρο.',
  60: 'Είμαι ανταγωνιστικός/ή και θέλω να είμαι ο καλύτερος/η σε ότι κάνω.',
  61: 'Μου αρέσει να διδάσκω και να εξηγώ πράγματα σε άλλους.',
  62: 'Είμαι ευέλικτος/η και προσαρμόζομαι εύκολα σε νέες καταστάσεις.',
  63: 'Προτιμώ να έχω καθαρό, οργανωμένο χώρο εργασίας.',
  64: 'Μου αρέσει να εκφράζω τον εαυτό μου μέσα από την τέχνη ή τη δημιουργία.',
  65: 'Είμαι πρακτικός/ή και προτιμώ να δω άμεσα τα αποτελέσματα της δουλειάς μου.',
  66: 'Μου αρέσει να μελετάω και να εμβαθύνω σε ένα θέμα για πολύ ώρα.',
  67: 'Είμαι ενεργητικός/ή και προτιμώ να είμαι σε κίνηση.',
  68: 'Μου αρέσει να έχω έναν ηγέτη που μου δίνει σαφείς οδηγίες.',
  69: 'Είμαι αυτόνομος/η και προτιμώ να παίρνω τις δικές μου αποφάσεις.',
  70: 'Μου αρέσει να βλέπω τη δουλειά μου να έχει άμεση επίδραση στους ανθρώπους.',
  71: 'Είμαι υπομονετικός/ή και μου αρέσει να δουλεύω σε μακροπρόθεσμα έργα.',
  72: 'Προτιμώ να εργάζομαι σε ένα ήσυχο, ήρεμο περιβάλλον.',
  73: 'Μου αρέσει να λύνω προβλήματα που απαιτούν λογική και ανάλυση.',
  74: 'Είμαι ευαίσθητος/η και μου αρέσει να κατανοώ τα συναισθήματα των άλλων.',
  75: 'Προτιμώ να έχω έναν ρουτίνα και προβλέψιμο πρόγραμμα.',
  76: 'Μου αρέσει να πειραματίζομαι και να δοκιμάζω διαφορετικές λύσεις.',
  77: 'Είμαι φιλόδοξος/η και θέλω να φτάσω ψηλά στην καριέρα μου.',
  78: 'Μου αρέσει να δουλεύω σε ένα δυναμικό, γρήγορο περιβάλλον.',
  79: 'Είμαι συστηματικός/ή και προτιμώ να ακολουθώ μια μέθοδο.',
  80: 'Μου αρέσει να δημιουργώ κάτι από το μηδέν.',
  81: 'Είμαι καλός/ή στη διαπραγμάτευση και στην επικοινωνία.',
  82: 'Προτιμώ να εστιάζω σε ένα έργο τη φορά παρά να κάνω πολλά ταυτόχρονα.',
  83: 'Μου αρέσει να βλέπω άμεσα τα αποτελέσματα των επιλογών μου.',
  84: 'Είμαι οργανωτικός/ή και προτιμώ να έχω ένα σχέδιο πριν ξεκινήσω.',
  85: 'Μου αρέσει να μαθαίνω νέα πράγματα συνεχώς.',
  86: 'Είμαι ομαδικός/ή παίκτης και μου αρέσει να συνεργάζομαι.',
  87: 'Προτιμώ να έχω ευκαιρίες για προσωπική ανάπτυξη και ανέλιξη.',
  88: 'Μου αρέσει να είμαι υπεύθυνος/η για αποτελέσματα και να έχω ελευθερία.',
  89: 'Είμαι προσεκτικός/ή και προτιμώ να σκεφτώ καλά πριν ενεργήσω.',
  90: 'Μου αρέσει να βοηθάω άλλους να αναπτυχθούν και να μάθουν.',
  91: 'Είμαι ανεξάρτητος/η και δεν μου αρέσει να με ελέγχουν συνεχώς.',
  92: 'Προτιμώ να έχω σταθερό εισόδημα και ασφάλεια εργασίας.',
  93: 'Μου αρέσει να αντιμετωπίζω προκλήσεις και να λύνω δύσκολα προβλήματα.',
  94: 'Είμαι ισορροπημένος/η και προτιμώ μια σταθερή ζωή.',
  95: 'Μου αρέσει να έχω επαφή με πολλά διαφορετικά άτομα.',
  96: 'Είμαι αυτοπειθαρχημένος/η και μου αρέσει να ορίζω τους δικούς μου στόχους.',
  97: 'Προτιμώ να δουλεύω σε ένα περιβάλλον με σαφείς κανόνες και ρόλους.',
  98: 'Μου αρέσει να βλέπω πώς η δουλειά μου συνεισφέρει σε κάτι μεγαλύτερο.',
  99: 'Είμαι καινοτόμος/η και μου αρέσει να εισάγω νέες ιδέες.',
  100: 'Προτιμώ να έχω μια καριέρα που μου επιτρέπει να εξισορροπώ την προσωπική και επαγγελματική ζωή.',
};

// 2. Πίνακας Βαθμολόγησης (Συντελεστές)
const SCORE_MATRIX: Record<number, number[]> = {
  // INFO, FIN, DIOIK, OIK, SERV, PEDAGOGIKA (P), SOMATA (S), TEXNES (T)
  1: [4, 1, 1, 0, 0, 0, 0, 0],
  2: [3, 1, 1, 0, 0, 0, 0, 0],
  3: [4, 1, 0, 1, 0, 0, 0, 0],
  4: [0, 1, 0, 4, 1, 0, 0, 0],
  5: [0, 1, 0, 3, 0, 0, 0, 0],
  6: [0, 0, 0, 4, 0, 0, 0, 0],
  7: [1, 1, 4, 0, 0, 0, 0, 0],
  8: [0, 0, 4, 0, 1, 0, 0, 0],
  9: [0, 1, 3, 0, 0, 0, 0, 0],
  10: [0, 4, 0, 0, 0, 0, 0, 0],
  11: [0, 4, 0, 1, 0, 0, 0, 0],
  12: [1, 3, 0, 1, 0, 0, 0, 0],
  13: [0, 0, 0, 1, 4, 0, 0, 0],
  14: [0, 0, 1, 0, 3, 0, 0, 0],
  15: [0, 0, 0, 0, 4, 0, 0, 0],
  16: [0, 0, 0, 0, 0, 0, 3, 0],
  17: [0, 0, 0, 0, 0, 0, 4, 0],
  18: [0, 0, 0, 0, 0, 0, 4, 0], // Σώματα Ασφαλείας (SOMATA) - διορθωμένο από TEXNES
  19: [3, 1, 1, 0, 0, 0, 0, 0],
  20: [0, 0, 0, 0, 0, 4, 0, 0],
  21: [0, 0, 0, 0, 0, 4, 0, 0],
  22: [0, 0, 0, 0, 0, 3, 0, 0],
  23: [0, 0, 0, 0, 0, 5, 0, 0],
  24: [0, 0, 0, 0, 0, 0, 0, 4],
  25: [0, 0, 0, 0, 0, 0, 0, 4],
  26: [0, 0, 0, 0, 0, 0, 0, 5],
  27: [0, 0, 0, 0, 0, 0, 0, 3],
  28: [2, 2, 2, 1, 2, 0, 1, 1],
  29: [0, 1, 1, 1, 1, 1, 1, 1],
  30: [3, 0, 1, 1, 0, 0, 0, 0],
  31: [0, 4, 0, 0, 0, 0, 0, 0],
  32: [0, 0, 3, 0, 1, 1, 0, 0],
  33: [3, 1, 1, 0, 0, 0, 0, 0],
  34: [0, 0, 0, 1, 0, 0, 0, 0],
  35: [0, 4, 0, 0, 0, 0, 0, 0],
  36: [1, 2, 0, 1, 0, 1, 0, 0],
  37: [0, 0, 0, 0, 0, 4, 0, 0],
  38: [0, 0, 0, 0, 0, 0, 0, 3],
  39: [0, 0, 0, 0, 0, 0, 4, 0],
  40: [0, 0, 0, 0, 3, 0, 0, 0],
  41: [0, 0, 0, 0, 1, 1, 0, 0],
  42: [0, 0, 0, 0, 0, 0, 0, 3],
  43: [1, 1, 1, 1, 1, 0, 2, 0],
  44: [0, 0, 0, 3, 0, 0, 0, 0],
  45: [0, 0, 0, 3, 0, 1, 1, 0],
  // ΧΑΡΑΚΤΗΡΑΣ & ΠΡΟΣΩΠΙΚΟΤΗΤΑ (46-100)
  46: [1, 2, 2, 1, 0, 1, 1, 0], // Οργανωτικότητα - FIN, DIOIK
  47: [2, 2, 0, 2, 0, 0, 0, 2], // Μόνος - INFO, FIN, OIK, TEXNES
  48: [1, 0, 3, 0, 2, 0, 1, 0], // Γρήγορες αποφάσεις - DIOIK, SERV
  49: [0, 0, 1, 0, 1, 4, 0, 0], // Βοήθεια - PEDAGOGIKA, DIOIK, SERV
  50: [2, 0, 2, 0, 3, 0, 2, 2], // Περιπετειώδης - SERV, DIOIK, TEXNES
  51: [0, 3, 1, 2, 0, 1, 3, 0], // Σταθερότητα - FIN, OIK, SOMATA
  52: [1, 0, 1, 0, 0, 0, 0, 4], // Δημιουργικός - TEXNES
  53: [2, 1, 2, 1, 2, 0, 0, 1], // Πολλά ταυτόχρονα - INFO, DIOIK, SERV
  54: [2, 4, 1, 2, 0, 1, 0, 0], // Λεπτολόγος - FIN, INFO, OIK
  55: [1, 3, 2, 1, 0, 1, 3, 0], // Διαδικασίες - FIN, DIOIK, SOMATA
  56: [1, 0, 3, 0, 3, 3, 1, 1], // Κοινωνικός - DIOIK, SERV, PEDAGOGIKA
  57: [3, 2, 1, 4, 0, 0, 0, 0], // Βαθιά ανάλυση - INFO, OIK
  58: [0, 0, 3, 0, 3, 3, 0, 1], // Εξωστρέφεια - DIOIK, SERV, PEDAGOGIKA
  59: [3, 3, 0, 3, 0, 0, 0, 2], // Προσωπικός χώρος - INFO, FIN, OIK, TEXNES
  60: [2, 1, 3, 1, 2, 0, 3, 2], // Ανταγωνιστικός - DIOIK, SOMATA
  61: [1, 0, 2, 0, 1, 5, 0, 1], // Διδασκαλία - PEDAGOGIKA
  62: [2, 1, 3, 0, 3, 1, 1, 2], // Ευέλικτος - DIOIK, SERV
  63: [2, 3, 2, 1, 0, 1, 1, 0], // Οργανωμένος χώρος - FIN, DIOIK
  64: [0, 0, 0, 0, 0, 0, 0, 5], // Έκφραση μέσω τέχνης - TEXNES
  65: [2, 2, 3, 1, 2, 1, 2, 1], // Πρακτικός - DIOIK
  66: [3, 2, 0, 4, 0, 0, 0, 1], // Μελέτη - INFO, OIK
  67: [1, 0, 2, 0, 2, 0, 4, 0], // Ενεργητικός - SOMATA, SERV
  68: [0, 1, 0, 0, 0, 1, 3, 0], // Ηγέτης - SOMATA
  69: [3, 2, 2, 2, 2, 0, 0, 3], // Αυτόνομος - INFO, FIN, OIK
  70: [1, 0, 2, 0, 2, 4, 1, 1], // Άμεση επίδραση - PEDAGOGIKA
  71: [2, 3, 1, 3, 1, 2, 1, 2], // Υπομονετικός - FIN, OIK
  72: [3, 4, 1, 3, 0, 1, 0, 2], // Ησυχία - FIN, OIK, INFO
  73: [4, 3, 1, 3, 0, 0, 0, 0], // Λογική - INFO, FIN, OIK
  74: [0, 0, 1, 0, 1, 4, 0, 1], // Ευαίσθητος - PEDAGOGIKA
  75: [1, 3, 2, 2, 0, 2, 3, 0], // Ρουτίνα - FIN, SOMATA
  76: [3, 1, 2, 1, 1, 0, 0, 3], // Πειραματισμός - INFO, TEXNES
  77: [2, 2, 4, 1, 2, 0, 2, 2], // Φιλόδοξος - DIOIK
  78: [2, 1, 3, 0, 3, 0, 2, 1], // Δυναμικό - DIOIK, SERV
  79: [2, 4, 2, 2, 0, 1, 1, 0], // Συστηματικός - FIN, DIOIK
  80: [3, 0, 2, 0, 1, 0, 0, 4], // Δημιουργία - INFO, TEXNES
  81: [1, 1, 4, 0, 3, 1, 0, 0], // Διαπραγμάτευση - DIOIK, SERV
  82: [2, 3, 1, 3, 0, 2, 1, 2], // Ένα έργο - FIN, OIK
  83: [2, 2, 3, 1, 2, 1, 2, 1], // Άμεσα αποτελέσματα - DIOIK
  84: [2, 3, 3, 2, 1, 1, 1, 0], // Σχέδιο - FIN, DIOIK
  85: [3, 2, 2, 3, 2, 2, 1, 2], // Μάθηση - INFO, OIK
  86: [1, 0, 4, 0, 3, 4, 1, 1], // Ομαδικός - DIOIK, PEDAGOGIKA, SERV
  87: [2, 2, 4, 1, 2, 1, 2, 2], // Ανάπτυξη - DIOIK
  88: [3, 2, 3, 2, 2, 0, 1, 2], // Ελευθερία - INFO, DIOIK
  89: [2, 4, 1, 3, 0, 2, 1, 0], // Προσεκτικός - FIN, OIK
  90: [0, 0, 2, 0, 1, 5, 0, 0], // Βοήθεια ανάπτυξη - PEDAGOGIKA
  91: [3, 3, 1, 3, 1, 0, 0, 3], // Ανεξάρτητος - INFO, FIN, OIK
  92: [1, 4, 2, 2, 1, 1, 3, 0], // Σταθερό εισόδημα - FIN, SOMATA
  93: [3, 2, 3, 2, 2, 0, 2, 2], // Προκλήσεις - INFO, DIOIK
  94: [1, 3, 1, 3, 0, 2, 3, 0], // Ισορροπία - FIN, OIK, SOMATA
  95: [1, 0, 4, 0, 4, 3, 1, 1], // Επαφή με πολλούς - DIOIK, SERV, PEDAGOGIKA
  96: [3, 2, 2, 3, 1, 1, 2, 2], // Αυτοπειθαρχημένος - INFO, OIK
  97: [1, 3, 2, 2, 0, 2, 4, 0], // Σαφείς κανόνες - FIN, SOMATA
  98: [1, 1, 3, 1, 2, 4, 2, 1], // Συνεισφορά - PEDAGOGIKA, DIOIK
  99: [3, 1, 3, 1, 2, 0, 0, 3], // Καινοτόμος - INFO, DIOIK, TEXNES
  100: [1, 2, 2, 1, 1, 3, 1, 2], // Ισορροπία ζωής - PEDAGOGIKA, DIOIK
};

// 3. Κατηγορίες και Πληροφορίες Αποτελεσμάτων
const CATEGORY_NAMES: CategoryKey[] = [
  'INFO',
  'FIN',
  'DIOIK',
  'OIK',
  'SERV',
  'PEDAGOGIKA',
  'SOMATA',
  'TEXNES',
];

const RECALCULATED_MAX_SCORES: Record<CategoryKey, number> = {
  INFO: 248, // 170 + 78 (from questions 46-100)
  FIN: 287, // 155 + 132
  DIOIK: 261, // 140 + 121
  OIK: 235, // 125 + 110
  SERV: 205, // 110 + 95
  PEDAGOGIKA: 200, // 80 + 120
  SOMATA: 153, // 80 + 73
  TEXNES: 190, // 95 + 95
};

// Mapping για border colors (Tailwind CSS δεν υποστηρίζει dynamic classes)
const BORDER_COLOR_MAP: Record<CategoryKey, string> = {
  INFO: 'border-fuchsia-600',
  FIN: 'border-pink-600',
  DIOIK: 'border-rose-600',
  OIK: 'border-red-500',
  SERV: 'border-purple-600',
  PEDAGOGIKA: 'border-pink-400',
  SOMATA: 'border-rose-400',
  TEXNES: 'border-fuchsia-700',
};

const RESULTS_MAPPING: Record<CategoryKey, CategoryData> = {
  INFO: {
    title: 'Πληροφορική & Τεχνολογική Διοίκηση 🚀',
    description:
      'Η κλίση σας είναι στον συνδυασμό της τεχνολογίας, των συστημάτων και της διοίκησης. Σας ταιριάζουν σχολές που εστιάζουν στην ανάλυση δεδομένων, τον ψηφιακό μετασχηματισμό και τη λήψη αποφάσεων με τεχνολογικά εργαλεία.',
    icon: Code,
    color: 'text-fuchsia-600',
    gradient: 'from-fuchsia-100 to-white dark:from-fuchsia-900/40 dark:to-gray-900',
    schools: [
      {
        name: 'Διοικητικής Επιστήμης και Τεχνολογίας (ΟΠΑ)',
        city: 'Αθήνα',
        code: 240,
        base: '18.400',
      },
      { name: 'Πληροφορικής (ΑΠΘ)', city: 'Θεσσαλονίκη', code: 338, base: '17.720' },
      { name: 'Πληροφορικής και Τηλεπικοινωνιών (ΕΚΠΑ)', city: 'Αθήνα', code: 330, base: '16.955' },
    ],
  },
  FIN: {
    title: 'Λογιστική, Χρηματοοικονομικά & Στατιστική 📊',
    description:
      'Είστε ακριβής, αναλυτικός/ή και σας ελκύει ο κόσμος των αριθμών, των επενδύσεων και της διαχείρισης κινδύνου. Η καριέρα σας βρίσκεται στις τράπεζες, τα λογιστικά γραφεία και τις ασφαλιστικές εταιρείες.',
    icon: DollarSign,
    color: 'text-pink-600',
    gradient: 'from-pink-100 to-white dark:from-pink-900/40 dark:to-gray-900',
    schools: [
      { name: 'Λογιστικής και Χρηματοοικονομικής (ΟΠΑ)', city: 'Αθήνα', code: 347, base: '15.775' },
      {
        name: 'Χρηματοοικονομικής και Τραπεζικής Διοικητικής (ΠΑΠΕΙ)',
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
      'Έχετε κλίση στην οργάνωση, τη διοίκηση, τη στρατηγική και την επικοινωνία. Σας ταιριάζουν ρόλοι που απαιτούν ηγετικές ικανότητες, διαπραγμάτευση και εστίαση στην ανάπτυξη της επιχείρησης και του προϊόντος.',
    icon: Briefcase,
    color: 'text-rose-600',
    gradient: 'from-rose-100 to-white dark:from-rose-900/40 dark:to-gray-900',
    schools: [
      {
        name: 'Οργάνωσης και Διοίκησης Επιχειρήσεων (ΟΠΑ)',
        city: 'Αθήνα',
        code: 313,
        base: '17.425',
      },
      { name: 'Μάρκετινγκ και Επικοινωνίας (ΟΠΑ)', city: 'Αθήνα', code: 314, base: '16.350' },
      {
        name: 'Διοίκησης Επιχειρήσεων και Οργανισμών (ΕΚΠΑ)',
        city: 'Αθήνα',
        code: 1005,
        base: '16.220',
      },
    ],
  },
  OIK: {
    title: 'Θεωρητικά & Ακαδημαϊκά Οικονομικά 🎓',
    description:
      'Το ενδιαφέρον σας εστιάζεται στην ακαδημαϊκή ανάλυση, τη θεωρία και την εις βάθος κατανόηση του οικονομικού συστήματος. Σας ταιριάζουν ρόλοι που απαιτούν υψηλή μαθηματική/αναλυτική σκέψη για μοντελοποίηση.',
    icon: TrendingUp,
    color: 'text-red-500',
    gradient: 'from-red-100 to-white dark:from-red-900/40 dark:to-gray-900',
    schools: [
      { name: 'Οικονομικής Επιστήμης (ΟΠΑ)', city: 'Αθήνα', code: 312, base: '15.900' },
      { name: 'Οικονομικών Επιστημών (ΕΚΠΑ)', city: 'Αθήνα', code: 309, base: '13.896' },
      { name: 'Οικονομικών Επιστημών (ΑΠΘ)', city: 'Θεσσαλονίκη', code: 311, base: '13.240' },
      { name: 'Δημόσιας Διοίκησης (ΠΑΝΤΕΙΟ)', city: 'Αθήνα', code: 124, base: '13.075' },
    ],
  },
  SERV: {
    title: 'Διεθνείς Σπουδές, Τουρισμός & Ναυτιλία 🌎',
    description:
      'Σας ελκύει το διεθνές περιβάλλον, οι διεθνείς σχέσεις και οι κλάδοι των υπηρεσιών, ειδικά ο Τουρισμός και η Ναυτιλία. Οι κορυφαίες επιλογές απαιτούν **Ειδικό Μάθημα Ξένης Γλώσσας**.',
    icon: Globe,
    color: 'text-purple-600',
    gradient: 'from-purple-100 to-white dark:from-purple-900/40 dark:to-gray-900',
    schools: [
      {
        name: 'Διεθνών και Ευρωπαϊκών Σπουδών (ΠΑΜΑΚ)',
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
        name: 'Διεθνών και Ευρωπαϊκών Σπουδών (ΠΑΠΕΙ)',
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
      'Η κλίση σας είναι στην εκπαίδευση, τη φροντίδα και τη στήριξη των μαθητών. Σας ταιριάζουν σχολές που οδηγούν σε διδακτικούς ρόλους στην Πρωτοβάθμια Εκπαίδευση (Δάσκαλοι, Νηπιαγωγοί) ή την Ειδική Αγωγή.',
    icon: GraduationCap,
    color: 'text-pink-400',
    gradient: 'from-pink-50 to-white dark:from-pink-800/40 dark:to-gray-900',
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
      {
        name: 'Εκπαίδευσης και Αγωγής στην Προσχολική Ηλικία (ΕΚΠΑ)',
        city: 'Αθήνα',
        code: 154,
        base: '14.800',
      },
    ],
  },
  SOMATA: {
    title: 'Σώματα Ασφαλείας & Φυσική Αγωγή 🛡️',
    description:
      'Έχετε ισχυρή κλίση προς τη δράση, την πειθαρχία και την προσφορά μέσα από Σώματα Ασφαλείας ή τον αθλητικό χώρο. ΠΡΟΣΟΧΗ: Αυτές οι σχολές απαιτούν **Αγωνίσματα** και **Υγειονομικές Εξετάσεις**.',
    icon: Shield,
    color: 'text-rose-400',
    gradient: 'from-rose-50 to-white dark:from-rose-800/40 dark:to-gray-900',
    schools: [
      {
        name: 'ΣΣΑΣ Πληροφορικής / Οικονομικό',
        city: 'Θεσσαλονίκη',
        code: 889, // Note: Simplified for TS, logic could handle dual codes
        base: '18.240 - 17.735',
        note: 'Αγων./Υγειονομικά',
      },
      {
        name: 'Αξιωματικών Ελληνικής Αστυνομίας',
        city: 'Ελλάδα',
        code: 869,
        base: '17.590',
        note: 'Αγων./Ψυχοτ.',
      },
      {
        name: 'Επιστήμης Φυσικής Αγωγής & Αθλητισμού (ΕΚΠΑ)',
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
      'Η δημιουργικότητα και η καλλιτεχνική σας έκφραση είναι υψηλές προτεραιότητες. Σας ταιριάζουν σχολές που απαιτούν ταλέντο και εξέταση σε **Ειδικά Μαθήματα** (Σχέδιο, Μουσική).',
    icon: Palette,
    color: 'text-fuchsia-700',
    gradient: 'from-fuchsia-200 to-white dark:from-fuchsia-900/50 dark:to-gray-900',
    schools: [
      {
        name: 'Μουσικής Επιστήμης και Τέχνης (ΠΑΜΑΚ)',
        city: 'Θεσσαλονίκη',
        code: 409,
        base: '15.600',
        note: 'Ειδ. Μουσικής',
      },
      {
        name: 'Γραφιστικής και Οπτικής Επικοινωνίας (ΠΑΔΑ)',
        city: 'Αιγάλεω',
        code: 674,
        base: '13.745',
        note: 'Ειδ. Σχέδιο',
      },
      { name: 'Κινηματογράφου (ΑΠΘ)', city: 'Θεσσαλονίκη', code: 163, base: '13.125' },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════
// 🏗️ MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

/**
 * Career Orientation (Prosanatolismos) Page
 * 
 * This page provides a comprehensive career orientation questionnaire with 100 questions.
 * Users answer questions on a scale of 1-5, and results are calculated based on 8 career categories.
 * 
 * Features:
 * - Auto-save to localStorage for progress preservation
 * - Backend integration for result persistence
 * - Real-time progress tracking
 * - Detailed results with school recommendations
 * - Responsive design for all devices
 * - Error handling and user feedback
 */

const STORAGE_KEY = 'prosanatolismos_answers';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001';

const Prosanatolismospage: React.FC = () => {
  const { user } = useAuth();
  
  // Answers state: key is question ID (string from Object.keys), value is score (1-5)
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  
  // Ref to track if component is mounted (prevents memory leaks)
  const isMountedRef = useRef(true);

  const allQuestions = Object.keys(QUESTIONS);
  const questionsPerColumn = Math.ceil(allQuestions.length / 2);
  const column1Questions = allQuestions.slice(0, questionsPerColumn);
  const column2Questions = allQuestions.slice(questionsPerColumn);

  // Calculate progress
  const answeredCount = Object.keys(answers).filter((qId) => answers[qId] !== undefined && !isNaN(answers[qId])).length;
  const totalQuestions = allQuestions.length;
  const progressPercentage = Math.round((answeredCount / totalQuestions) * 100);

  // Initialize component mount status
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * Load saved answers from localStorage on component mount
   * This preserves user progress across page refreshes
   */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate parsed data
        if (parsed && typeof parsed === 'object') {
          setAnswers(parsed);
        }
      }
    } catch (e) {
      console.warn('⚠️ Failed to load from localStorage:', e);
    }
  }, []);

  /**
   * Auto-save answers to localStorage whenever they change
   * This ensures progress is never lost, even if the user closes the browser
   */
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
      } catch (e) {
        console.warn('⚠️ Failed to save to localStorage:', e);
      }
    }
  }, [answers]);

  /**
   * Handle answer selection for a question
   * Validates the score is between 1-5 and updates state
   */
  const handleChange = useCallback((questionId: string, score: number | string) => {
    const numericScore = typeof score === 'string' ? parseInt(score, 10) : score;
    
    // Validate score range
    if (isNaN(numericScore) || numericScore < 1 || numericScore > 5) {
      console.warn(`Invalid score for question ${questionId}: ${score}`);
      return;
    }

    setAnswers((prevAnswers) => {
      const newAnswers = {
        ...prevAnswers,
        [questionId]: numericScore,
      };
      return newAnswers;
    });
    
    // Clear any previous errors when user makes a selection
    setError('');
    setSuccessMessage('');
  }, []);

  /**
   * Reset all answers and results
   * Clears both state and localStorage
   */
  const handleReset = useCallback(() => {
    if (window.confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε όλες τις απαντήσεις σας;')) {
      setAnswers({});
      setResults(null);
      setError('');
      setSuccessMessage('');
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.warn('⚠️ Failed to clear localStorage:', e);
      }
    }
  }, []);

  /**
   * Save results to backend database
   * This allows users to access their results later and enables analytics
   */
  const saveResultsToBackend = useCallback(async (calculationResults: CalculationResult) => {
    if (!user) {
      console.warn('⚠️ User not authenticated, skipping backend save');
      return;
    }

    setIsSaving(true);
    try {
      // Get authentication token
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('User not authenticated');
      }

      // Prepare data for backend
      const submissionData = {
        answers: answers,
        results: {
          final_scores: calculationResults.finalScores,
          top_category: calculationResults.topCategory,
          sorted_scores: calculationResults.sortedScores.map(({ category, score }) => ({
            category,
            score,
          })),
        },
      };

      // Send to backend
      const response = await fetch(`${BACKEND_URL}/api/career-orientation/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      if (isMountedRef.current) {
        setSuccessMessage('✅ Τα αποτελέσματα αποθηκεύτηκαν επιτυχώς!');
        // Clear success message after 5 seconds
        setTimeout(() => {
          if (isMountedRef.current) {
            setSuccessMessage('');
          }
        }, 5000);
      }
    } catch (err: any) {
      console.error('❌ Error saving results to backend:', err);
      // Don't show error to user - localStorage backup is sufficient
      // Results are still displayed even if backend save fails
    } finally {
      if (isMountedRef.current) {
        setIsSaving(false);
      }
    }
  }, [user, answers]);

  /**
   * Calculate career orientation results based on user answers
   * Validates all questions are answered, calculates scores, and saves to backend
   */
  const calculateResults = useCallback(async () => {
    // 1. Validation: Check if all questions are answered
    const unansweredQuestions = allQuestions.filter(
      (qId) => answers[qId] === undefined || isNaN(answers[qId]) || answers[qId] < 1 || answers[qId] > 5
    );

    if (unansweredQuestions.length > 0) {
      setError(
        `Παρακαλώ απαντήστε και στις ${totalQuestions} ερωτήσεις για να δείτε τα αποτελέσματα. Έχετε απαντήσει σε ${answeredCount} από ${totalQuestions}.`
      );
      setResults(null);
      return;
    }

    setIsCalculating(true);
    setError('');
    setSuccessMessage('');

    try {
      // 2. Calculate total scores per category using SCORE_MATRIX
      // Each question contributes to multiple categories based on weights
      const initialScores: Record<CategoryKey, number> = {
        INFO: 0,
        FIN: 0,
        DIOIK: 0,
        OIK: 0,
        SERV: 0,
        PEDAGOGIKA: 0,
        SOMATA: 0,
        TEXNES: 0,
      };

      const finalScores = allQuestions.reduce((acc, qId) => {
        const score = answers[qId];
        // Convert qId to number for SCORE_MATRIX lookup
        const numId = parseInt(qId, 10);
        const weights = SCORE_MATRIX[numId];

        if (weights && weights.length === 8) {
          // Multiply user's answer (1-5) by each category weight
          acc.INFO += score * weights[0];
          acc.FIN += score * weights[1];
          acc.DIOIK += score * weights[2];
          acc.OIK += score * weights[3];
          acc.SERV += score * weights[4];
          acc.PEDAGOGIKA += score * weights[5];
          acc.SOMATA += score * weights[6];
          acc.TEXNES += score * weights[7];
        } else {
          console.warn(`⚠️ Missing or invalid weights for question ${qId}`);
        }

        return acc;
      }, initialScores);

      // 3. Find top category and handle ties
      let maxScore = -1;
      const scoresArray = Object.entries(finalScores) as [CategoryKey, number][];

      for (const [, score] of scoresArray) {
        if (score > maxScore) {
          maxScore = score;
        }
      }

      const tiedCategories = scoresArray
        .filter(([, score]) => score === maxScore)
        .map(([category]) => category);

      const sortedScores = scoresArray
        .map(([category, score]) => ({ category, score }))
        .sort((a, b) => b.score - a.score);

      const calculationResults: CalculationResult = {
        finalScores,
        topCategory: sortedScores[0].category,
        tiedCategories,
        sortedScores,
      };

      // 4. Update state with results
      if (isMountedRef.current) {
        setResults(calculationResults);
        setError('');

        // Scroll to top to show results
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // 5. Save to backend (non-blocking)
        saveResultsToBackend(calculationResults);
      }
    } catch (err: any) {
      console.error('❌ Error calculating results:', err);
      if (isMountedRef.current) {
        setError('Προέκυψε σφάλμα κατά τον υπολογισμό των αποτελεσμάτων. Παρακαλώ δοκιμάστε ξανά.');
      }
    } finally {
      if (isMountedRef.current) {
        setIsCalculating(false);
      }
    }
  }, [allQuestions, answers, totalQuestions, answeredCount, saveResultsToBackend]);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8 bg-white dark:bg-gray-900 min-h-screen">
      <header className="text-center mb-8 md:mb-10 border-b pb-4 md:pb-5 border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-3 flex items-center justify-center">
          Επαγγελματικός Προσανατολισμός 4ο Πεδίο
        </h1>
        <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-4 px-2">
          Ανακαλύψτε ποια από τις 8 εξειδικεύσεις σας ταιριάζει περισσότερο βάσει των {totalQuestions} ερωτήσεων.
        </p>
        
        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mt-4 md:mt-6 px-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
            <span className="text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300">
              Πρόοδος: <strong className="text-rose-600 dark:text-rose-400">{answeredCount}</strong> / {totalQuestions} ({progressPercentage}%)
            </span>
            {answeredCount > 0 && (
              <button
                onClick={handleReset}
                className="text-xs md:text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-semibold flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                title="Επαναφορά όλων των απαντήσεων"
              >
                <RotateCcw className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Επαναφορά</span>
                <span className="sm:hidden">Reset</span>
              </button>
            )}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 md:h-3 overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-rose-500 to-pink-600"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </header>

      {/* Ενότητα Αποτελεσμάτων */}
      {results && (
        <div className="mb-12 p-8 rounded-2xl bg-rose-50 dark:bg-gray-800 border border-rose-200 dark:border-rose-800 shadow-2xl">
          <h2 className="text-3xl font-bold text-rose-700 dark:text-rose-300 mb-5 text-center">
            🏆 Τα Κορυφαία Αποτελέσματά Σας
          </h2>
          <p className="text-xl text-gray-800 dark:text-gray-200 mb-8 text-center font-extrabold">
            {results.tiedCategories.length === 1
              ? `Η κυρίαρχη επαγγελματική σας κλίση είναι: ${RESULTS_MAPPING[results.topCategory].title}`
              : `Υπάρχει ισοπαλία ανάμεσα σε περισσότερες κατευθύνσεις. Η υψηλότερη βαθμολογία σας είναι: ${results.tiedCategories.map((cat) => RESULTS_MAPPING[cat].title.split(' ')[0]).join(', ')}.`}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.sortedScores
              .slice(0, Math.max(results.tiedCategories.length, 3))
              .map((item) => (
                <ResultCard
                  key={item.category}
                  category={item.category}
                  currentScore={item.score}
                />
              ))}
          </div>
        </div>
      )}

      {/* Κουίζ - Φόρμα Ερωτήσεων */}
      <div className="bg-white dark:bg-gray-900 p-4 md:p-6 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="mb-6 md:mb-8">
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 font-extrabold mb-2">
            Επιλέξτε τον βαθμό συμφωνίας (1 έως 5) για κάθε δήλωση.
          </p>
          <div className="flex flex-wrap gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-400">
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">1: Διαφωνώ απόλυτα</span>
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">3: Ουδέτερο</span>
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">5: Συμφωνώ απόλυτα</span>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-x-6 lg:gap-x-10 gap-y-4 md:gap-y-6">
          {/* Στήλη 1 */}
          <div>
            {column1Questions.map((qId) => (
              <QuestionBlock
                key={qId}
                qId={qId}
                question={QUESTIONS[parseInt(qId, 10)]}
                selectedScore={answers[qId]}
                onChange={handleChange}
              />
            ))}
          </div>
          {/* Στήλη 2 */}
          <div>
            {column2Questions.map((qId) => (
              <QuestionBlock
                key={qId}
                qId={qId}
                question={QUESTIONS[parseInt(qId, 10)]}
                selectedScore={answers[qId]}
                onChange={handleChange}
              />
            ))}
          </div>
        </div>

        {/* Submit Button & Messages */}
        <div className="mt-8 md:mt-12 text-center space-y-4">
          {/* Success Message */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mx-auto max-w-md"
              >
                <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/40 border border-green-500 p-4 rounded-lg font-semibold">
                  <CheckCircle2 className="w-5 h-5" />
                  {successMessage}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mx-auto max-w-md"
              >
                <div className="flex items-start gap-2 text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/40 border border-red-500 p-4 rounded-lg font-semibold">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <button
            onClick={() => calculateResults()}
            disabled={answeredCount < totalQuestions || isCalculating || isSaving}
            className={`relative px-6 md:px-10 py-3 md:py-4 bg-rose-600 text-white font-extrabold text-base md:text-lg lg:text-xl rounded-xl shadow-lg transition duration-300 transform tracking-wide ${
              answeredCount < totalQuestions || isCalculating || isSaving
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:scale-105 active:scale-95 hover:bg-rose-700'
            }`}
          >
            {isCalculating ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Υπολογισμός...
              </span>
            ) : isSaving ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Αποθήκευση...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Save className="w-5 h-5" />
                Υπολογισμός Επαγγελματικής Κατεύθυνσης
              </span>
            )}
          </button>

          {/* Helper Text */}
          {answeredCount < totalQuestions && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Απαιτούνται <strong className="text-rose-600 dark:text-rose-400">{totalQuestions - answeredCount}</strong> ακόμα απαντήσεις
            </p>
          )}
          
          {answeredCount === totalQuestions && !isCalculating && !isSaving && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-2 font-semibold">
              ✅ Όλες οι ερωτήσεις έχουν απαντηθεί! Μπορείτε να υπολογίσετε τα αποτελέσματα.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 🧩 CHILD COMPONENTS
// ═══════════════════════════════════════════════════════════════

interface ResultCardProps {
  category: CategoryKey;
  currentScore: number;
}

const ResultCard: React.FC<ResultCardProps> = ({ category, currentScore }) => {
  const data = RESULTS_MAPPING[category];
  const IconComponent = data.icon;
  const maxPossibleScore = RECALCULATED_MAX_SCORES[category];
  const percentage = Math.min(100, Math.round((currentScore / maxPossibleScore) * 100));
  const borderColor = BORDER_COLOR_MAP[category];

  return (
    <div
      className={`p-6 border-t-8 ${borderColor} rounded-lg shadow-2xl bg-gradient-to-br ${data.gradient} transition transform hover:scale-[1.02] duration-300`}
    >
      <div className="flex items-center mb-4">
        <IconComponent className={`w-8 h-8 mr-3 ${data.color} flex-shrink-0`} />
        <h3 className={`text-xl font-extrabold ${data.color}`}>{data.title}</h3>
      </div>

      <div className="mb-4">
        <div className="w-full bg-gray-300 rounded-full h-3 dark:bg-gray-700 shadow-inner">
          <div
            className={`h-3 rounded-full bg-gradient-to-r from-pink-400 to-rose-600`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mt-1">
          Ποσοστό Ενδιαφέροντος: {percentage}% (Σκορ: {currentScore} / {maxPossibleScore})
        </p>
      </div>

      <p className="text-gray-800 dark:text-gray-200 mb-5 text-sm">{data.description}</p>

      <div className="mt-4 border-t pt-4 border-gray-200 dark:border-gray-700">
        <p className="font-extrabold text-lg text-gray-900 dark:text-white mb-2">
          Κορυφαίες Προτάσεις Σχολών:
        </p>
        <ul className="space-y-3">
          {data.schools.map((school) => (
            <li
              key={school.code}
              className="flex items-start text-sm bg-white dark:bg-gray-800 p-3 rounded-md shadow-inner"
            >
              <CheckCircle className={`w-4 h-4 mt-1 mr-2 ${data.color}`} />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {school.name} ({school.city})
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Κωδ.: {school.code} | Βάση 2025: {school.base} Μόρια{' '}
                  {school.note ? `(${school.note})` : ''}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

interface QuestionBlockProps {
  qId: string;
  question: string;
  selectedScore?: number;
  onChange: (qId: string, score: number) => void;
}

/**
 * QuestionBlock Component
 * 
 * Displays a single question with 5-point scale answer options.
 * Optimized for mobile, tablet, and desktop viewing.
 */
const QuestionBlock: React.FC<QuestionBlockProps> = ({
  qId,
  question,
  selectedScore,
  onChange,
}) => {
  const scoreOptions = [1, 2, 3, 4, 5];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 md:mb-6 p-4 md:p-5 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 shadow-md hover:shadow-lg transition duration-300"
    >
      <label className="block text-gray-800 dark:text-gray-200 font-semibold mb-3 text-sm md:text-base">
        <span className="text-rose-600 dark:text-rose-400 font-extrabold mr-2">{qId}.</span>
        {question}
      </label>
      <div className="flex justify-between gap-1 md:gap-2 bg-white dark:bg-gray-900 p-2 rounded-lg shadow-inner">
        {scoreOptions.map((score) => (
          <motion.div
            key={score}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center cursor-pointer transition duration-150 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700 p-1 md:p-2 rounded-md flex-1"
            onClick={() => onChange(qId, score)}
          >
            <input
              type="radio"
              id={`q${qId}-${score}`}
              name={`question-${qId}`}
              value={score}
              checked={selectedScore === score}
              onChange={(e) => onChange(qId, parseInt(e.target.value, 10))}
              className="form-radio h-4 w-4 md:h-5 md:w-5 text-rose-600 dark:bg-gray-700 dark:border-gray-600 focus:ring-rose-500 cursor-pointer"
            />
            <label
              htmlFor={`q${qId}-${score}`}
              className={`text-xs md:text-sm font-bold mt-1 cursor-pointer ${
                selectedScore === score
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {score}
            </label>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Prosanatolismospage;
