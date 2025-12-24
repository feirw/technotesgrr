import React, { useState } from 'react';
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
} from 'lucide-react';

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
  18: 'Θέλω μια καριέρα με σαφείς ρόλους, προσφορά στην πατρίδα/ασφάλεια και σταθερότητα (Στρατός, Αστυνομία, Πυροσβεστική).',
  19: 'Με ενδιαφέρει η εκγύμναση και η προπόνηση αθλητών (Επιστήμη Φυσικής Αγωγής & Αθλητισμού - ΕΦΑΑ).',
  // ΕΝΟΤΗΤΑ Ζ: ΠΑΙΔΑΓΩΓΙΚΑ (PEDAGOGIKA)
  20: 'Με ενδιαφέρει η διδασκαλία και η φροντίδα παιδιών προσχολικής ή σχολικής ηλικίας (Δημοτικό/Νηπιαγωγείο).',
  21: 'Έχω υπομονή, ενσυναίσθηση και θέλω να συμβάλλω στη γνωστική ανάπτυξη των μαθητών.',
  22: 'Ενδιαφέρομαι για την Ειδική Αγωγή και τη στήριξη μαθητών με ιδιαίτερες ανάγκες.',
  23: 'Προτιμώ μια καριέρα όπου ο κύριος ρόλος μου είναι η εκπαίδευση και η καθοδήγηση.',
  // ΕΝΟΤΗΤΑ Η: ΤΕΧΝΕΣ & ΚΑΛΛΙΤΕΧΝΙΚΕΣ ΣΧΟΛΕΣ (TEXNES)
  24: 'Έχω έντονο καλλιτεχνικό ενδιαφέρον (π.χ. Μουσική, Θέατρο, Σχέδιο) και θέλω να το σπουδάσω.',
  25: 'Με ενδιαφέρει η τεχνική πλευρά της τέχνης, όπως ο Ήχος, η Εικόνα, η Φωτογραφία ή ο Κινηματογράφος.',
  26: 'Είμαι έτοιμος/η να εξεταστώ σε ειδικά μαθήματα (π.χ. Αρμονία, Σχέδιο) για την εισαγωγή μου.',
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
  37: 'Μου αρέσει να δουλεύω με παιδιά (Παιδαγωγικά) και με ενδιαφέρει η ψυχολογία της ανάπτυξης.',
  38: 'Η δημιουργία (π.χ. σκηνοθεσία, σύνθεση) είναι πιο σημαντική από την ερμηνεία ενός έτοιμου ρόλου.',
  39: 'Η ιδέα της ένταξης σε ένα Σώμα με αυστηρούς κανονισμούς μου προσφέρει ασφάλεια.',
  40: 'Θα προτιμούσα μια καριέρα που συνδυάζει Οικονομία/Διοίκηση με τη Ναυτιλία/Διεθνείς Σχέσεις.',
  41: 'Είμαι οργανωτικός/ή και με ενδιαφέρει η μεθοδική καταγραφή (π.χ. Αρχειονομία, Βιβλιοθηκονομία).',
  42: 'Έχω καλή αίσθηση του χώρου και με ενδιαφέρει η αρχιτεκτονική ή ο σχεδιασμός προϊόντων.',
  43: 'Η επιλογή σχολής πρέπει να είναι μια από τις πιο ανταγωνιστικές και υψηλόβαθμες (βάσει μορίων).',
  44: 'Είμαι καλός/ή στην ιστορία, τη φιλοσοφία και τη θεωρητική ανάλυση (Ιστορίας και Φιλοσοφίας της Επιστήμης).',
  45: 'Η δημόσια διοίκηση και η νομική/κοινωνική πολιτική με ελκύουν.',
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
  18: [0, 0, 0, 0, 0, 0, 0, 2],
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
  INFO: 170,
  FIN: 155,
  DIOIK: 140,
  OIK: 125,
  SERV: 110,
  PEDAGOGIKA: 80,
  SOMATA: 80,
  TEXNES: 95,
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

const Prosanatolismospage: React.FC = () => {
  // Answers state: key is question ID (string from Object.keys), value is score
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string>('');

  const allQuestions = Object.keys(QUESTIONS);
  const questionsPerColumn = Math.ceil(allQuestions.length / 2);
  const column1Questions = allQuestions.slice(0, questionsPerColumn);
  const column2Questions = allQuestions.slice(questionsPerColumn);

  const handleChange = (questionId: string, score: number | string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: typeof score === 'string' ? parseInt(score, 10) : score,
    }));
    setError('');
  };

  const calculateResults = () => {
    // 1. Έλεγχος αν απαντήθηκαν όλες οι ερωτήσεις
    if (
      Object.keys(answers).length !== allQuestions.length ||
      allQuestions.some((qId) => answers[qId] === undefined || isNaN(answers[qId]))
    ) {
      setError('Παρακαλώ απαντήστε και στις 45 ερωτήσεις για να δείτε τα αποτελέσματα.');
      setResults(null);
      return;
    }

    // 2. Υπολογισμός συνολικών σκορ ανά κατηγορία
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
      // Convert qId to number for MATRIX lookup
      const numId = parseInt(qId, 10);
      const weights = SCORE_MATRIX[numId];

      if (weights) {
        acc.INFO += score * weights[0];
        acc.FIN += score * weights[1];
        acc.DIOIK += score * weights[2];
        acc.OIK += score * weights[3];
        acc.SERV += score * weights[4];
        acc.PEDAGOGIKA += score * weights[5];
        acc.SOMATA += score * weights[6];
        acc.TEXNES += score * weights[7];
      }

      return acc;
    }, initialScores);

    let maxScore = -1;

    // Explicitly cast to entries of CategoryKey and number
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

    setResults({
      finalScores,
      topCategory: sortedScores[0].category,
      tiedCategories,
      sortedScores,
    });
    setError('');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-white dark:bg-gray-900 min-h-screen">
      <header className="text-center mb-10 border-b pb-5 border-gray-200 dark:border-gray-700">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-3 flex items-center justify-center">
          <div className="w-10 h-10 mr-4 text-rose-600" /> {/* Rose Accent */}
          Επαγγελματικός Προσανατολισμός 4ο Πεδίo
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Ανακαλύψτε ποια από τις 8 εξειδικεύσεις σας ταιριάζει περισσότερο βάσει των 45 ερωτήσεων.
        </p>
      </header>

      {/* Ενότητα Αποτελεσμάτων */}
      {results && (
        <div className="mb-12 p-8 rounded-2xl bg-rose-50 dark:bg-gray-800 border border-rose-200 dark:border-rose-800 shadow-2xl">
          <h2 className="text-3xl font-bold text-rose-700 dark:text-rose-300 mb-5 text-center">
            🏆 Τα Κορυφαία Αποτελέσματά Σας
          </h2>
          <p className="text-xl text-gray-800 dark:text-gray-200 mb-8 text-center font-extrabold">
            {results.tiedCategories.length === 1
              ? `Η κυρίαρχη επαγγελματική σας κλίση είναι: **${RESULTS_MAPPING[results.topCategory].title}**`
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
                  results={results}
                />
              ))}
          </div>
        </div>
      )}

      {/* Κουίζ - Φόρμα Ερωτήσεων */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 font-extrabold">
          Επιλέξτε τον βαθμό συμφωνίας (1 έως 5) για κάθε δήλωση.
          <span className="block font-normal text-sm text-gray-500 mt-1">
            1: Διαφωνώ απόλυτα / 3: Ουδέτερο / 5: Συμφωνώ απόλυτα
          </span>
        </p>
        <div className="grid lg:grid-cols-2 gap-x-10 gap-y-6">
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

        {/* Submit Button & Error */}
        <div className="mt-12 text-center">
          {error && (
            <p className="text-red-600 bg-red-100 dark:bg-red-900/40 border border-red-500 p-4 rounded-lg mb-4 font-bold transition-all duration-500">
              🚨 {error}
            </p>
          )}
          <button
            onClick={calculateResults}
            className="px-10 py-4 bg-rose-600 text-white font-extrabold text-xl rounded-xl shadow-lg hover:bg-rose-700 transition duration-300 transform hover:scale-105 active:scale-95 tracking-wide"
          >
            Υπολογισμός Επαγγελματικής Κατεύθυνσης
          </button>
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
  results: CalculationResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ category, currentScore }) => {
  const data = RESULTS_MAPPING[category];
  const IconComponent = data.icon;
  const maxPossibleScore = RECALCULATED_MAX_SCORES[category];
  const percentage = Math.min(100, Math.round((currentScore / maxPossibleScore) * 100));

  return (
    <div
      className={`p-6 border-t-8 border-${data.color.split('-')[1]}-600 rounded-lg shadow-2xl bg-gradient-to-br ${data.gradient} transition transform hover:scale-[1.02] duration-300`}
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
          {data.schools.map((school, index) => (
            <li
              key={index}
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

const QuestionBlock: React.FC<QuestionBlockProps> = ({
  qId,
  question,
  selectedScore,
  onChange,
}) => {
  const scoreOptions = [1, 2, 3, 4, 5];

  return (
    <div className="mb-6 p-5 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 shadow-md hover:shadow-lg transition duration-300">
      <label className="block text-gray-800 dark:text-gray-200 font-semibold mb-3 text-md">
        <span className="text-rose-600 dark:text-rose-400 font-extrabold mr-2">{qId}.</span>{' '}
        {question}
      </label>
      <div className="flex justify-between space-x-2 bg-white dark:bg-gray-900 p-2 rounded-lg shadow-inner">
        {scoreOptions.map((score) => (
          <div
            key={score}
            className="flex flex-col items-center cursor-pointer transition duration-150 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-md"
            onClick={() => onChange(qId, score)}
          >
            <input
              type="radio"
              id={`q${qId}-${score}`}
              name={`question-${qId}`}
              value={score}
              checked={selectedScore === score}
              onChange={(e) => onChange(qId, parseInt(e.target.value, 10))}
              className="form-radio h-5 w-5 text-rose-600 dark:bg-gray-700 dark:border-gray-600 focus:ring-rose-500"
            />
            <label
              htmlFor={`q${qId}-${score}`}
              className={`text-xs font-bold mt-1 ${
                selectedScore === score
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {score}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Prosanatolismospage;
