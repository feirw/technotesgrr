import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Laptop, Coins, Landmark, BarChart3, Ship, ShieldCheck, 
  Globe, Trophy, Music, Palette, Users, GraduationCap, BookOpen,
  MapPin, TrendingUp, Info, ChevronDown
} from 'lucide-react';

// --- Types ---
interface School {
  id: string;
  name: string;
  uni: string;
  city: string;
  points: number;
  ebe: string;
  category: string;
  requirements?: string;
}

// --- Configuration ---
const CATEGORIES: Record<string, { icon: React.ReactNode, color: string }> = {
  "Πληροφορική": { icon: <Laptop size={20} />, color: "bg-blue-100 text-blue-600" },
  "Βιομηχανία & Προϊόν": { icon: <Laptop size={20} />, color: "bg-blue-100 text-blue-600" },
  "Οικονομικά": { icon: <Coins size={20} />, color: "bg-emerald-100 text-emerald-600" },
  "Λογιστική & Χρηματοοικονομικά": { icon: <BarChart3 size={20} />, color: "bg-teal-100 text-teal-600" },
  "Διοίκηση Επιχειρήσεων": { icon: <Landmark size={20} />, color: "bg-indigo-100 text-indigo-600" },
  "Marketing & Επικοινωνία": { icon: <TrendingUp size={20} />, color: "bg-pink-100 text-pink-600" },
  "Διοικητικής Επιστήμης": { icon: <GraduationCap size={20} />, color: "bg-orange-100 text-orange-600" },
  "Διεθνών & Ευρωπαϊκών": { icon: <Globe size={20} />, color: "bg-sky-100 text-sky-600" },
  "Στατιστική": { icon: <BookOpen size={20} />, color: "bg-gray-100 text-gray-600" },
  "Σώματα Ασφαλείας & Στρατιωτικές": { icon: <ShieldCheck size={20} />, color: "bg-slate-100 text-slate-600" },
  "Ναυτιλιακά & Τουρισμός": { icon: <Ship size={20} />, color: "bg-cyan-100 text-cyan-600" },
  "Παιδαγωγικά": { icon: <GraduationCap size={20} />, color: "bg-orange-100 text-orange-600" },
  "Ανθρωπιστικά & Κοινωνικά": { icon: <Users size={20} />, color: "bg-rose-100 text-rose-600" },
  "Μουσική & Πολιτισμός": { icon: <Music size={20} />, color: "bg-purple-100 text-purple-600" },
  "Τέχνες": { icon: <BookOpen size={20} />, color: "bg-gray-100 text-gray-600" },
  "Αθλητισμός": { icon: <Trophy size={20} />, color: "bg-amber-100 text-amber-600" },
  "Άλλα (Γεωγραφία, Περιβάλλον κ.α.)": { icon: <BookOpen size={20} />, color: "bg-gray-100 text-gray-600" },
  "Σχέδιο Μόδας": { icon: <BookOpen size={20} />, color: "bg-gray-100 text-gray-600" },
};

// --- Full Data Array ---
const ALL_SCHOOLS: School[] = [
  // ΔΙΕΘΝΩΝ & ΕΥΡΩΠΑΪΚΩΝ
  { id: "161", name: "Διεθνών και Ευρωπαϊκών Σπουδών", uni: "ΠΑΜΑΚ", city: "Θεσσαλονίκη", points: 19295, ebe: "13.22", category: "Διεθνών & Ευρωπαϊκών", requirements: "Ξένη Γλώσσα" },
  { id: "355", name: "Διεθνών και Ευρωπαϊκών Σπουδών", uni: "ΠΑΠΕΙ", city: "Πειραιάς", points: 18990, ebe: "13.22", category: "Διεθνών & Ευρωπαϊκών", requirements: "Ξένη Γλώσσα" },
  { id: "179", name: "Διεθνών και Ευρωπαϊκών Σπουδών", uni: "ΠΑΝΤΕΙΟ", city: "Αθήνα", points: 17040, ebe: "11.02", category: "Διεθνών & Ευρωπαϊκών", requirements: "Ξένη Γλώσσα" },
    { id: "150", name: "Διεθνών και Ευρωπαϊκών Οικ. Σπουδών", uni: "ΟΠΑ", city: "Αθήνα", points: 15150, ebe: "12.60", category: "Διεθνών & Ευρωπαϊκών" },
  { id: "1549", name: "Διεθνών και Ευρωπαϊκών Οικ. Σπουδών", uni: "ΔΥΤ. ΜΑΚΕΔΟΝΙΑΣ", city: "Κοζάνη", points: 8400, ebe: "8.40", category: "Διεθνών & Ευρωπαϊκών" },

  // ΝΑΥΤΙΛΙΑΚΑ & ΤΟΥΡΙΣΜΟΣ
  { id: "157", name: "Ναυτιλιακών Σπουδών", uni: "ΠΑΠΕΙ", city: "Πειραιάς", points: 19210, ebe: "11.02", category: "Ναυτιλιακά & Τουρισμός", requirements: "Αγγλικά" },
  { id: "670", name: "Διοίκησης Τουρισμού", uni: "ΠΑΔΑ", city: "Αιγάλεω", points: 15850, ebe: "13.22", category: "Ναυτιλιακά & Τουρισμός", requirements: "Ξένη Γλώσσα" },
  { id: "375", name: "Τουριστικών Σπουδών", uni: "ΠΑΠΕΙ", city: "Πειραιάς", points: 14785, ebe: "13.22", category: "Ναυτιλιακά & Τουρισμός", requirements: "Αγγλικά" },
  { id: "1004", name: "Διαχείρισης Λιμένων και Ναυτιλίας", uni: "ΕΚΠΑ", city: "Ψαχνά", points: 12600, ebe: "12.60", category: "Ναυτιλιακά & Τουρισμός" },
  { id: "1283", name: "Διοίκησης Τουρισμού", uni: "ΠΑΤΡΩΝ", city: "Πάτρα", points: 13275, ebe: "8.81", category: "Ναυτιλιακά & Τουρισμός", requirements: "Ξένη Γλώσσα" },
  { id: "614", name: "Αστε Κρήτης (ΑΣΤΕΚ)", uni: "ΑΣΤΕ", city: "Αγ. Νικόλαος", points: 11706, ebe: "8.81", category: "Ναυτιλιακά & Τουρισμός", requirements: "Ξένη Γλώσσα" },
  { id: "613", name: "Οικονομικής και Διοίκησης Τουρισμού", uni: "ΑΙΓΑΙΟΥ", city: "Χίος", points: 11550, ebe: "8.81", category: "Ναυτιλιακά & Τουρισμός", requirements: "Ξένη Γλώσσα" },
  { id: "613", name: "Αστε Ρόδου (ΑΣΤΕΡ)", uni: "ΑΣΤΕ", city: "Ρόδος", points: 11312, ebe: "8.81", category: "Ναυτιλιακά & Τουρισμός", requirements: "Ξένη Γλώσσα" },
  { id: "180", name: "Ναυτιλίας και Επιχειρηματικών Υπηρεσιών", uni: "ΑΙΓΑΙΟΥ", city: "Χίος", points: 9890, ebe: "10.50", category: "Ναυτιλιακά & Τουρισμός" },
  
  { id: "1455", name: "Τουρισμού", uni: "ΙΟΝΙΟ", city: "Κέρκυρα", points: 9820, ebe: "8.81", category: "Ναυτιλιακά & Τουρισμός", requirements: "Αγγλικά" },
  { id: "818", name: "ΑΕΝ Σχολή Μηχανικών", uni: "ΑΕΝ", city: "Μη προσδιορισμένη", points: 8400, ebe: "8.40", category: "Ναυτιλιακά & Τουρισμός" },
  { id: "817", name: "ΑΕΝ Σχολή Πλοιάρχων", uni: "ΑΕΝ", city: "Μη προσδιορισμένη", points: 8400, ebe: "8.40", category: "Ναυτιλιακά & Τουρισμός" },

  // ΔΙΟΙΚΗΣΗ ΕΠΙΧΕΙΡΗΣΕΩΝ
  { id: "240", name: "Διοικητικής Επιστήμης και Τεχνολογίας", uni: "ΟΠΑ", city: "Αθήνα", points: 18400, ebe: "12.60", category: "Διοικητικής Επιστήμης" },
  { id: "313", name: "Οργάνωσης και Διοίκησης Επιχειρήσεων", uni: "ΟΠΑ", city: "Αθήνα", points: 17425, ebe: "12.60", category: "Διοίκηση Επιχειρήσεων" },
  { id: "316", name: "Οργάνωσης και Διοίκησης Επιχειρήσεων", uni: "ΠΑΠΕΙ", city: "Πειραιάς", points: 16620, ebe: "12.60", category: "Διοίκηση Επιχειρήσεων" },
  { id: "1005", name: "Διοίκησης Επιχειρήσεων και Οργανισμών", uni: "ΕΚΠΑ", city: "Αθήνα", points: 16220, ebe: "12.60", category: "Διοίκηση Επιχειρήσεων" },
  { id: "322", name: "Οργάνωσης και Διοίκησης Επιχειρήσεων", uni: "ΠΑΜΑΚ", city: "Θεσσαλονίκη", points: 15532, ebe: "12.60", category: "Διοίκηση Επιχειρήσεων" },
  { id: "575", name: "Διοίκησης Επιχειρήσεων", uni: "ΠΑΔΑ", city: "Αιγάλεω", points: 12920, ebe: "12.60", category: "Διοίκηση Επιχειρήσεων" },
  { id: "583", name: "Διοίκησης Οργανισμών, Marketing και Τουρισμού", uni: "ΔΙΠΑΕ", city: "Θεσσαλονίκη", points: 12170, ebe: "9.45", category: "Διοίκηση Επιχειρήσεων" },
  { id: "1282", name: "Διοικητικής Επιστήμης και Τεχνολογίας", uni: "ΠΑΤΡΩΝ", city: "Πάτρα", points: 12150, ebe: "11.55", category: "Διοικητικής Επιστήμης" },
  { id: "352", name: "Διοίκησης Επιχειρήσεων", uni: "ΠΑΤΡΩΝ", city: "Πάτρα", points: 11900, ebe: "11.55", category: "Διοίκηση Επιχειρήσεων" },
  { id: "1518", name: "Διοικητικής Επιστήμης και Τεχνολογίας", uni: "ΠΕΛΟΠΟΝΝΗΣΟΥ", city: "Τρίπολη", points: 10075, ebe: "9.45", category: "Διοικητικής Επιστήμης" },
  { id: "1655", name: "Διοίκησης Επιχειρήσεων και Τουρισμού", uni: "ΕΛΜΕΠΑ", city: "Ηράκλειο", points: 10088, ebe: "10.50", category: "Ναυτιλιακά & Τουρισμός" },
    { id: "591", name: "Διοικητικής Επιστήμης και Τεχνολογίας", uni: "ΠΕΛΟΠΟΝΝΗΣΟΥ", city: "Τρίπολη", points: 10075, ebe: "9.45", category: "Διοικητικής Επιστήμης" },
  { id: "1427", name: "Διοίκησης Επιχειρήσεων", uni: "ΘΕΣΣΑΛΙΑΣ", city: "Λάρισα", points: 9825, ebe: "9.45", category: "Διοίκηση Επιχειρήσεων" },
  { id: "580", name: "Διοίκησης Επιχειρήσεων", uni: "ΠΕΛΟΠΟΝΝΗΣΟΥ", city: "Καλαμάτα", points: 7715, ebe: "8.40", category: "Διοίκηση Επιχειρήσεων" },
  { id: "1603", name: "Διοίκησης Εφοδιαστικής Αλυσίδας", uni: "ΔΙΠΑΕ", city: "Κατερίνη", points: 9660, ebe: "8.40", category: "Διοίκηση Επιχειρήσεων" },
  { id: "1607", name: "Διοικητικής Επιστήμης και Τεχνολογίας", uni: "ΔΠΘ", city: "Καβάλα", points: 9530, ebe: "8.40", category: "Διοικητικής Επιστήμης" },
  { id: "1063", name: "Διοίκησης Γεωργικών Επιχειρήσεων", uni: "ΓΕΩΠΟΝΙΚΟ", city: "Θήβα", points: 9095, ebe: "9.45", category: "Άλλα (Γεωγραφία, Περιβάλλον κ.α.)" },
  { id: "1601", name: "Οργάνωσης και Διοίκησης Επιχειρήσεων", uni: "ΔΙΠΑΕ", city: "Σέρρες", points: 8950, ebe: "8.40", category: "Διοίκηση Επιχειρήσεων" },
  { id: "1544", name: "Διοικητικής Επιστήμης και Τεχνολογίας", uni: "ΔΥΤ. ΜΑΚΕΔΟΝΙΑΣ", city: "Κοζάνη", points: 8920, ebe: "8.40", category: "Διοικητικής Επιστήμης" },
  { id: "1656", name: "Διοικητικής Επιστήμης και Τεχνολογίας", uni: "ΕΛΜΕΠΑ", city: "Αγ. Νικόλαος", points: 8875, ebe: "8.40", category: "Διοικητικής Επιστήμης" },
  { id: "320", name: "Διοίκησης Επιχειρήσεων", uni: "ΑΙΓΑΙΟΥ", city: "Χίος", points: 8630, ebe: "8.40", category: "Διοίκηση Επιχειρήσεων" },
  { id: "1546", name: "Οργάνωσης και Διοίκησης Επιχειρήσεων", uni: "ΔΥΤ. ΜΑΚΕΔΟΝΙΑΣ", city: "Γρεβενά", points: 7840, ebe: "8.40", category: "Διοίκηση Επιχειρήσεων" },

  //marketing
  { id: "314", name: "Μάρκετινγκ και Επικοινωνίας", uni: "ΟΠΑ", city: "Αθήνα", points: 16350, ebe: "12.60", category: "Marketing & Επικοινωνία" },
  { id: "1456", name: "Ψηφιακών Μέσων και Επικοινωνίας", uni: "ΙΟΝΙΟ", city: "Αργοστόλι", points: 8550, ebe: "8.40", category: "Marketing & Επικοινωνία" },
  { id: "1551", name: "Επικοινωνίας και Ψηφιακών Μέσων", uni: "ΔΥΤ. ΜΑΚΕΔΟΝΙΑΣ", city: "Καστοριά", points: 11020, ebe: "9.48", category: "Marketing & Επικοινωνία", requirements: "Ξένη Γλώσσα" },


// ΠΛΗΡΟΦΟΡΙΚΗ
  { id: "889", name: "Πληροφορικής (ΣΣΑΣ)", uni: "ΣΣΑΣ", city: "Θεσσαλονίκη", points: 18240, ebe: "12.60", category: "Πληροφορική" },
  { id: "338", name: "Πληροφορικής", uni: "ΑΠΘ", city: "Θεσσαλονίκη", points: 17720, ebe: "12.60", category: "Πληροφορική" },
  { id: "333", name: "Πληροφορικής", uni: "ΟΠΑ", city: "Αθήνα", points: 17590, ebe: "12.60", category: "Πληροφορική" },
  { id: "330", name: "Πληροφορικής και Τηλεπικοινωνιών", uni: "ΕΚΠΑ", city: "Αθήνα", points: 16955, ebe: "12.60", category: "Πληροφορική" },
  { id: "339", name: "Πληροφορικής", uni: "ΠΑΠΕΙ", city: "Πειραιάς", points: 16935, ebe: "12.60", category: "Πληροφορική" },
  { id: "1211", name: "Εφαρμοσμένης Πληροφορικής (Επιστήμη και Τεχνολογία Υπολογιστών)", uni: "ΠΑΜΑΚ", city: "Θεσσαλονίκη", points: 16915, ebe: "12.60", category: "Πληροφορική" },
  { id: "1212", name: "Εφαρμοσμένης Πληροφορικής (Πληροφοριακά Συστήματα)", uni: "ΠΑΜΑΚ", city: "Θεσσαλονίκη", points: 16705, ebe: "12.60", category: "Πληροφορική" },
  { id: "412", name: "Πληροφορικής και Τηλεματικής", uni: "ΧΑΡΟΚΟΠΕΙΟ", city: "Αθήνα", points: 16320, ebe: "12.60", category: "Πληροφορική" },
  { id: "262", name: "Ψηφιακών Συστημάτων", uni: "ΠΑΠΕΙ", city: "Πειραιάς", points: 15940, ebe: "12.60", category: "Πληροφορική" },
  { id: "216", name: "Επιστήμης Υπολογιστών", uni: "ΚΡΗΤΗΣ", city: "Ηράκλειο", points: 15646, ebe: "12.60", category: "Πληροφορική" },
  { id: "390", name: "Μηχανικών Πληροφορικής και Υπολογιστών", uni: "ΠΑΔΑ", city: "Αιγάλεω", points: 15336, ebe: "12.60", category: "Πληροφορική" },
  { id: "1625", name: "Μηχανικών Πληροφορικής & Ηλεκτρονικών Συστημάτων", uni: "ΔΙΠΑΕ", city: "Θεσσαλονίκη", points: 14740, ebe: "12.60", category: "Πληροφορική" },
  { id: "1622", name: "Μηχανικών Πληροφορικής,Υπολογιστών & Τηλεπικοινωνιών", uni: "ΔΙΠΑΕ", city: "Σέρρες", points: 13450, ebe: "10.50", category: "Πληροφορική" },
  { id: "1630", name: "Πληροφορικής", uni: "ΔΠΘ", city: "Καβάλα", points: 12880, ebe: "11.55", category: "Πληροφορική" },
  { id: "369", name: "Πληροφορικής με Εφαρμογές στη Βιοϊατρική", uni: "ΘΕΣΣΑΛΙΑΣ", city: "Λαμία", points: 12515, ebe: "10.50", category: "Πληροφορική" },
  { id: "98", name: "Πληροφορικής και Τηλεπικοινωνιών", uni: "ΠΕΛΟΠΟΝΝΗΣΟΥ", city: "Τρίπολη", points: 11550, ebe: "11.55", category: "Πληροφορική" },
  { id: "99", name: "Πληροφορικής και Τηλεπικοινωνιών", uni: "ΘΕΣΣΑΛΙΑΣ", city: "Λαμία", points: 10500, ebe: "10.50", category: "Πληροφορική" },
  { id: "1439", name: "Ψηφιακών Συστημάτων", uni: "ΘΕΣΣΑΛΙΑΣ", city: "Λάρισα", points: 10445, ebe: "10.50", category: "Πληροφορική" },
  { id: "1554", name: "Πληροφορικής", uni: "ΔΥΤ. ΜΑΚΕΔΟΝΙΑΣ", city: "Καστοριά", points: 10340, ebe: "10.50", category: "Πληροφορική" },
  { id: "1662", name: "Ηλεκτρονικών Μηχανικών", uni: "ΕΛΜΕΠΑ", city: "Χανιά", points: 10071, ebe: "8.40", category: "Πληροφορική" },
  { id: "344", name: "Μηχανικών Πληρ/κών & Επικ. Συστημάτων", uni: "ΑΙΓΑΙΟΥ", city: "Σάμος", points: 9660, ebe: "8.40", category: "Πληροφορική" },
  { id: "1519", name: "Ψηφιακών Συστημάτων", uni: "ΠΕΛΟΠΟΝΝΗΣΟΥ", city: "Σπάρτη", points: 9040, ebe: "8.40", category: "Πληροφορική" },
  { id: "1436", name: "Συστημάτων Ενέργειας", uni: "ΘΕΣΣΑΛΙΑΣ", city: "Λάρισα", points: 8990, ebe: "8.40", category: "Πληροφορική" },
  { id: "1250", name: "Πληροφορικής και Τηλεπικοινωνιών", uni: "ΙΩΑΝΝΙΝΩΝ", city: "Άρτα", points: 8911, ebe: "8.40", category: "Πληροφορική" },
  { id: "366", name: "Πληροφορικής", uni: "ΙΟΝΙΟ", city: "Κέρκυρα", points: 8640, ebe: "8.40", category: "Πληροφορική" },
  
  //βιομηχανια

  { id: "560", name: "Βιομηχανικής Διοίκησης και Τεχνολογίας", uni: "ΠΑΠΕΙ", city: "Πειραιάς", points: 13465, ebe: "12.6", category: "Βιομηχανία" },
  {id : "629", name :"Μηχανικών Παραγωγής και Διοίκησης", uni : "ΔΙΠΑΕ", city : "Θεσσαλονική", points : 12585, ebe : "10.50",category : "Βιομηχανία"},
   { id: "230", name: "Μηχανικών Παραγωγής και Διοίκησης", uni: "Πολυτεχνείο Κρήτης", city: "Χανιά", points: 12290, ebe: "12.60", category: "Βιομηχανία" },
  { id: "389", name: "Μηχανικών Βιομηχανικής Σχεδίασης και Παραγωγής", uni: "ΠΑΔΑ", city: "Αιγάλεω", points: 12032, ebe: "12.39", category: "Βιομηχανία" },
  { id: "224", name: "Μηχανικών Παραγωγής και Διοίκησης", uni: "ΔΠΘ", city: "Ξάνθη", points: 11590, ebe: "11.55", category: "Βιομηχανία" },
  { id: "238", name: "Μηχανικών Σχεδίασης Προϊόντων και Συστημάτων", uni: "ΑΙΓΑΙΟΥ", city: "Σύρος", points: 10330, ebe: "10.50", category: "Βιομηχανία" },
  { id: "1542", name: "Μηχανικών Σχεδίασης Προϊόντων και Συστημάτων", uni: "ΔΥΤ. ΜΑΚΕΔΟΝΙΑΣ", city: "Κοζάνη", points: 9225, ebe: "8.92", category: "Βιομηχανία" },
  { id: "1008", name: "Τεχνολογιών Ψηφιακής Βιομηχανίας", uni: "ΕΚΠΑ", city: "Ψαχνά", points: 9830, ebe: "8.92", category: "Βιομηχανία" },
  // ΟΙΚΟΝΟΜΙΚΑ
  {
  id: "867", name: "Οικονομικό (ΣΣΑΣ)", uni: "ΣΣΑΣ", city: "Θεσσαλονίκη", points: 17735, ebe: "12.60", category: "Οικονομικά", requirements: "Επιπλέον προϋποθέσεις"
},
  { id: "312", name: "Οικονομικής Επιστήμης", uni: "ΟΠΑ", city: "Αθήνα", points: 15900, ebe: "12.60", category: "Οικονομικά" },
  { id: "315", name: "Οικονομικής Επιστήμης", uni: "ΠΑΠΕΙ", city: "Πειραιάς", points: 15100, ebe: "12.60", category: "Οικονομικά" },
  { id: "317", name: "Οικονομικών Επιστημών", uni: "ΠΑΜΑΚ", city: "Θεσσαλονίκη", points: 14460, ebe: "12.60", category: "Οικονομικά" },
  { id: "309", name: "Οικονομικών Επιστημών", uni: "ΕΚΠΑ", city: "Αθήνα", points: 13896, ebe: "12.60", category: "Οικονομικά" },
  { id: "311", name: "Οικονομικών Επιστημών", uni: "ΑΠΘ", city: "Θεσσαλονίκη", points: 13240, ebe: "12.60", category: "Οικονομικά" },
  { id: "152", name: "Οικονομικής & Περιφερειακής Ανάπτυξης", uni: "ΠΑΝΤΕΙΟ", city: "Αθήνα", points: 12675, ebe: "12.60", category: "Οικονομικά" },
  { id: "646", name: "Οικονομίας και Βιώσιμης Ανάπτυξης", uni: "ΧΑΡΟΚΟΠΕΙΟ", city: "Αθήνα", points: 12556, ebe: "11.55", category: "Οικονομικά" },
  { id: "319", name: "Οικονομικών Επιστημών", uni: "ΠΑΤΡΩΝ", city: "Πάτρα", points: 12426, ebe: "12.60", category: "Οικονομικά" },
  { id: "326", name: "Αγροτικής Οικονομίας και Ανάπτυξης", uni: "ΓΕΩΠΟΝΙΚΟ", city: "Αθήνα", points: 12310, ebe: "8.92", category: "Οικονομικά" },
  { id: "350", name: "Οικονομικών Επιστημών", uni: "ΘΕΣΣΑΛΙΑΣ", city: "Βόλος", points: 11851, ebe: "10.50", category: "Οικονομικά" },
  { id: "345", name: "Οικονομικών Επιστημών", uni: "ΙΩΑΝΝΙΝΩΝ", city: "Ιωάννινα", points: 11450, ebe: "10.50", category: "Οικονομικά" },
  { id: "321", name: "Οικονομικών Επιστημών", uni: "ΚΡΗΤΗΣ", city: "Ρέθυμνο", points: 10415, ebe: "11.02", category: "Οικονομικά" },
  { id: "1548", name: "Οικονομικών Επιστημών", uni: "ΔΥΤ. ΜΑΚΕΔΟΝΙΑΣ", city: "Καστοριά", points: 10330, ebe: "8.40", category: "Οικονομικά" },
  { id: "361", name: "Οικονομικών Επιστημών", uni: "ΠΕΛΟΠΟΝΝΗΣΟΥ", city: "Τρίπολη", points: 10030, ebe: "10.50", category: "Οικονομικά" },
  { id: "97", name: "Οικονομικών Επιστημών", uni: "ΔΠΘ", city: "Κομοτηνή", points: 9696, ebe: "9.45", category: "Οικονομικά" },
  { id: "1602", name: "Οικονομικών Επιστημών", uni: "ΔΙΠΑΕ", city: "Σέρρες", points: 9555, ebe: "8.40", category: "Οικονομικά" },
  { id: "222", name: "Μηχανικών Οικονομίας και Διοίκησης", uni: "ΑΙΓΑΙΟΥ", city: "Χίος", points: 9050, ebe: "8.40", category: "Διοίκηση Επιχειρήσεων" },
  { id: "1064", name: "Περιφερειακής και Οικονομικής Ανάπτυξης", uni: "ΓΕΩΠΟΝΙΚΟ", city: "Άμφισσα", points: 7040, ebe: "8.40", category: "Οικονομικά" },
    
  // ΛΟΓΙΣΤΙΚΗ & ΧΡΗΜΑΤΟΟΙΚΟΝΟΜΙΚΑ
  { id: "347", name: "Λογιστικής και Χρηματοοικονομικής", uni: "ΟΠΑ", city: "Αθήνα", points: 15775, ebe: "12.60", category: "Λογιστική & Χρηματοοικονομικά" },
  { id: "155", name: "Χρηματοοικονομικής & Τραπεζικής Διοικητικής", uni: "ΠΑΠΕΙ", city: "Πειραιάς", points: 14850, ebe: "12.60", category: "Λογιστική & Χρηματοοικονομικά" },
  { id: "337", name: "Λογιστικής και Χρηματοοικονομικής", uni: "ΠΑΜΑΚ", city: "Θεσσαλονίκη", points: 13525, ebe: "12.60", category: "Λογιστική & Χρηματοοικονομικά" },
  { id: "617", name: "Λογιστικής και Χρηματοοικονομικής", uni: "ΠΑΔΑ", city: "Αιγάλεω", points: 12765, ebe: "12.60", category: "Λογιστική & Χρηματοοικονομικά" },
  { id: "1606", name: "Λογιστικής και Πληροφοριακών Συστημάτων", uni: "ΔΙΠΑΕ", city: "Θεσσαλονίκη", points: 12360, ebe: "10.50", category: "Λογιστική & Χρηματοοικονομικά" },
  { id: "1513", name: "Λογιστικής και Χρηματοοικονομικής", uni: "ΠΕΛΟΠΟΝΝΗΣΟΥ", city: "Καλαμάτα", points: 9250, ebe: "8.40", category: "Λογιστική & Χρηματοοικονομικά" },
  { id: "1430", name: "Λογιστικής και Χρηματοοικονομικής", uni: "ΘΕΣΣΑΛΙΑΣ", city: "Λάρισα", points: 8867, ebe: "8.40", category: "Λογιστική & Χρηματοοικονομικά" },
  { id: "1654", name: "Λογιστικής και Χρηματοοικονομικής", uni: "ΕΛΜΕΠΑ", city: "Ηράκλειο", points: 8780, ebe: "9.45", category: "Λογιστική & Χρηματοοικονομικά" },
  { id: "1604", name: "Λογιστικής και Χρηματοοικονομικής", uni: "ΔΠΘ", city: "Καβάλα", points: 8300, ebe: "8.40", category: "Λογιστική & Χρηματοοικονομικά" },
  { id: "1244", name: "Λογιστικής και Χρηματοοικονομικής", uni: "ΙΩΑΝΝΙΝΩΝ", city: "Πρέβεζα", points: 7890, ebe: "8.40", category: "Λογιστική & Χρηματοοικονομικά" },
  { id: "1545", name: "Λογιστικής και Χρηματοοικονομικής", uni: "ΔΥΤ. ΜΑΚΕΔΟΝΙΑΣ", city: "Κοζάνη", points: 7310, ebe: "8.40", category: "Λογιστική & Χρηματοοικονομικά" },

  //στατιστική
  {id: "703", name: "Στατιστικής", uni: "ΟΠΑ", city: "Αθήνα", points: 14440, ebe: "12.6", category: "Στατιστική" },
  {id: "702", name: "Στατιστικής και Ασφαλιστικής Επιστήμης", uni: "ΠΑΠΕΙ", city: "Πειραιάς", points: 14440, ebe: "12.6", category: "Στατιστική" },
  {id: "700", name: "Στατιστικής και Αναλογιστικών-Χρηματοοικονομικών Μαθηματικών", uni: "ΑΙΓΑΙΟΥ", city: "Σάμος", points: 8550, ebe: "8.40", category: "Στατιστική" },
  {id: "701", name: "Στατιστικής", uni: "Δυτικής Μακεδονίας", city: "Γρεβενά", points: 7280, ebe: "8.40", category: "Στατιστική" },
    




  // ΣΩΜΑΤΑ ΑΣΦΑΛΕΙΑΣ & ΣΤΡΑΤΙΩΤΙΚΕΣ
  { id: "869", name: "Αξιωματικών Ελληνικής Αστυνομίας", uni: "ΑΣΤΥΝΟΜΙΑ", city: "Μη προσδιορισμένη", points: 17590, ebe: "8.40", category: "Σώματα Ασφαλείας & Στρατιωτικές" },
  { id: "887", name: "Ικάρων (ΣΙ) Εφοδιαστών", uni: "ΑΕΡΟΠΟΡΙΑ", city: "Μη προσδιορισμένη", points: 17465, ebe: "12.60", category: "Σώματα Ασφαλείας & Στρατιωτικές" },
  { id: "877", name: "Αξιωματικών Πυροσβεστικής", uni: "ΠΥΡΟΣΒΕΣΤΙΚΗ", city: "Μη προσδιορισμένη", points: 17460, ebe: "8.40", category: "Σώματα Ασφαλείας & Στρατιωτικές" },
  { id: "872", name: "Αξιωματικών ΕΛ.ΑΣ. (για Αστυνομικούς)", uni: "ΑΣΤΥΝΟΜΙΑ", city: "Μη προσδιορισμένη", points: 17370, ebe: "8.40", category: "Σώματα Ασφαλείας & Στρατιωτικές" },
  { id: "886", name: "Ικάρων (ΣΙ) Διοικητικών", uni: "ΑΕΡΟΠΟΡΙΑ", city: "Μη προσδιορισμένη", points: 17260, ebe: "12.60", category: "Σώματα Ασφαλείας & Στρατιωτικές" },
  { id: "881", name: "Σχολή Δοκίμων Σημαιοφόρων Λ.Σ.", uni: "ΛΙΜΕΝΙΚΟ", city: "Μη προσδιορισμένη", points: 16650, ebe: "9.45", category: "Σώματα Ασφαλείας & Στρατιωτικές" },
  { id: "880", name: "ΣΜΥΑ - Κατ. Διοικ. & Εφοδ. Υποστήριξης", uni: "ΑΕΡΟΠΟΡΙΑ", city: "Μη προσδιορισμένη", points: 16030, ebe: "10.50", category: "Σώματα Ασφαλείας & Στρατιωτικές" },
  { id: "876", name: "Πυροσβεστών (για Πολίτες)", uni: "ΠΥΡΟΣΒΕΣΤΙΚΗ", city: "Μη προσδιορισμένη", points: 14460, ebe: "8.40", category: "Σώματα Ασφαλείας & Στρατιωτικές" },
  { id: "882", name: "Σχολή Δοκίμων Λιμενοφυλάκων", uni: "ΛΙΜΕΝΙΚΟ", city: "Μη προσδιορισμένη", points: 13970, ebe: "9.45", category: "Σώματα Ασφαλείας & Στρατιωτικές" },
  { id: "863", name: "ΣΜΥ - Σώματα", uni: "ΣΤΡΑΤΟΣ", city: "Μη προσδιορισμένη", points: 13080, ebe: "8.40", category: "Σώματα Ασφαλείας & Στρατιωτικές" },
  { id: "870", name: "Αστυφυλάκων (για Πολίτες)", uni: "ΑΣΤΥΝΟΜΙΑ", city: "Μη προσδιορισμένη", points: 11710, ebe: "8.40", category: "Σώματα Ασφαλείας & Στρατιωτικές" },
  { id: "871", name: "Αξιωματικών Πυροσβεστικής (Πυροσβέστες)", uni: "ΠΥΡΟΣΒΕΣΤΙΚΗ", city: "Μη προσδιορισμένη", points: 9940, ebe: "8.40", category: "Σώματα Ασφαλείας & Στρατιωτικές" },
  { id: "864", name: "ΣΜΥΝ (Μονίμων Υπαξιωματικών Ναυτικού)", uni: "ΝΑΥΤΙΚΟ", city: "Μη προσδιορισμένη", points: 8940, ebe: "9.45", category: "Σώματα Ασφαλείας & Στρατιωτικές" },

  // ΜΟΥΣΙΚΗ & ΠΟΛΙΤΙΣΜΟΣ
  { id: "409", name: "Μουσικής Επιστήμης και Τέχνης", uni: "ΠΑΜΑΚ", city: "Θεσσαλονίκη", points: 15600, ebe: "14.86", category: "Μουσική & Πολιτισμός", requirements: "Μουσικά Μαθήματα" },
  { id: "408", name: "Μουσικών Σπουδών", uni: "ΕΚΠΑ", city: "Αθήνα", points: 15050, ebe: "11.15", category: "Μουσική & Πολιτισμός", requirements: "Μουσικά Μαθήματα" },
  { id: "406", name: "Μουσικών Σπουδών", uni: "ΑΠΘ", city: "Θεσσαλονίκη", points: 14590, ebe: "9.91", category: "Μουσική & Πολιτισμός", requirements: "Μουσικά Μαθήματα" },
  { id: "407", name: "Μουσικών Σπουδών", uni: "ΙΟΝΙΟ", city: "Κέρκυρα", points: 13440, ebe: "9.91", category: "Μουσική & Πολιτισμός", requirements: "Μουσικά Μαθήματα" },
  { id: "163", name: "Κινηματογράφου", uni: "ΑΠΘ", city: "Θεσσαλονίκη", points: 13125, ebe: "12.60", category: "Μουσική & Πολιτισμός" },
   { id: "641", name: "Μουσικών Σπουδών", uni: "ΙΩΑΝΝΙΝΩΝ", city: "Άρτα", points: 11660, ebe: "11.15", category: "Μουσική & Πολιτισμός", requirements: "Μουσικά Μαθήματα" },
  { id: "677", name: "Φωτογραφίας & Οπτικοακουστικών Τεχνών", uni: "ΠΑΔΑ", city: "Αιγάλεω", points: 11540, ebe: "10.50", category: "Μουσική & Πολιτισμός" },
 { id: "610", name: "Θεάτρου", uni: "ΑΠΘ", city: "Θεσσαλονίκη", points: 11425, ebe: "8.40", category: "Μουσική & Πολιτισμός" },
  { id: "715", name: "Ψηφιακών Τεχνών και Κινηματογράφου", uni: "ΕΚΠΑ", city: "Ψαχνά", points: 10520, ebe: "8.40", category: "Μουσική & Πολιτισμός" },
  { id: "1435", name: "Πολιτισμού & Δημιουργικών Μέσων και Βιομηχανιών", uni: "ΘΕΣΣΑΛΙΑΣ", city: "Βόλος", points: 9410, ebe: "8.40", category: "Μουσική & Πολιτισμός" },
  { id: "367", name: "Τεχνών Ήχου και Εικόνας", uni: "ΙΟΝΙΟ", city: "Κέρκυρα", points: 9410, ebe: "8.40", category: "Μουσική & Πολιτισμός" },
  { id: "1517", name: "Παραστατικών και Ψηφιακών Τεχνών", uni: "ΠΕΛΟΠΟΝΝΗΣΟΥ", city: "Ναύπλιο", points: 9200, ebe: "8.40", category: "Μουσική & Πολιτισμός" },
  { id: "1664", name: "Μουσικής Τεχνολογίας & Ακουστικής", uni: "ΕΛΜΕΠΑ", city: "Ρέθυμνο", points: 8400, ebe: "8.40", category: "Μουσική & Πολιτισμός" },
  { id: "354", name: "Πολιτισμικής Τεχνολογίας & Επικοινωνίας", uni: "ΑΙΓΑΙΟΥ", city: "Μυτιλήνη", points: 8355, ebe: "8.40", category: "Μουσική & Πολιτισμός" },

  // ΑΘΛΗΤΙΣΜΟΣ
  { id: "401", name: "Επιστήμης Φυσικής Αγωγής και Αθλητισμού", uni: "ΕΚΠΑ", city: "Αθήνα", points: 17399, ebe: "8.55", category: "Αθλητισμός", requirements: "Αγωνίσματα" },
  { id: "403", name: "Επιστήμης Φυσικής Αγωγής και Αθλητισμού", uni: "ΑΠΘ", city: "Θεσσαλονίκη", points: 17161, ebe: "8.55", category: "Αθλητισμός", requirements: "Αγωνίσματα" },
  { id: "405", name: "Επιστήμης Φυσικής Αγωγής και Αθλητισμού", uni: "ΘΕΣΣΑΛΙΑΣ", city: "Τρίκαλα", points: 15134, ebe: "10.69", category: "Αθλητισμός", requirements: "Αγωνίσματα" },
  { id: "402", name: "Επιστήμης Φυσικής Αγωγής και Αθλητισμού", uni: "ΑΠΘ", city: "Σέρρες", points: 13729, ebe: "8.55", category: "Αθλητισμός", requirements: "Αγωνίσματα" },
  { id: "404", name: "Επιστήμης Φυσικής Αγωγής και Αθλητισμού", uni: "ΔΠΘ", city: "Κομοτηνή", points: 13219, ebe: "8.55", category: "Αθλητισμός", requirements: "Αγωνίσματα" },
   { id: "400", name: "Οργάνωσης και Διαχείρισης Αθλητισμού", uni: "ΠΕΛΟΠΟΝΝΗΣΟΥ", city: "Σπάρτη", points: 8940, ebe: "8.40", category: "Αθλητισμός" },
  // ΠΑΙΔΑΓΩΓΙΚΑ
  { id: "128", name: "Παιδαγωγικό Δημοτικής Εκπαίδευσης", uni: "ΕΚΠΑ", city: "Αθήνα", points: 16250, ebe: "12.60", category: "Παιδαγωγικά" },
  { id: "140", name: "Παιδαγωγικό Δημοτικής Εκπαίδευσης", uni: "ΑΠΘ", city: "Θεσσαλονίκη", points: 15950, ebe: "8.40", category: "Παιδαγωγικά" },
  { id: "164", name: "Παιδαγωγικό Δημοτικής Εκπαίδευσης", uni: "ΘΕΣΣΑΛΙΑΣ", city: "Βόλος", points: 15125, ebe: "8.40", category: "Παιδαγωγικά" },
  { id: "154", name: "Εκπαίδευσης και Αγωγής στην Προσχολική", uni: "ΕΚΠΑ", city: "Αθήνα", points: 14800, ebe: "8.40", category: "Παιδαγωγικά" },
  { id: "130", name: "Παιδαγωγικό Δημοτικής Εκπαίδευσης", uni: "ΙΩΑΝΝΙΝΩΝ", city: "Ιωάννινα", points: 14575, ebe: "10.50", category: "Παιδαγωγικά" },
  { id: "1286", name: "Επιστημών Εκπαίδευσης & Κοινωνικής Εργασίας", uni: "ΠΑΤΡΩΝ", city: "Πάτρα", points: 14422, ebe: "12.60", category: "Παιδαγωγικά" },
  { id: "134", name: "Επιστημών Προσχολικής Αγωγής και Εκπαίδευσης", uni: "ΑΠΘ", city: "Θεσσαλονίκη", points: 13875, ebe: "8.40", category: "Παιδαγωγικά" },
  { id: "132", name: "Παιδαγωγικό Δημοτικής Εκπαίδευσης", uni: "ΚΡΗΤΗΣ", city: "Ρέθυμνο", points: 13375, ebe: "10.50", category: "Παιδαγωγικά" },
  { id: "552", name:"Αγωγής και Φροντίδας στην Πρώιμη Παιδική Ηλικία", uni: "Παδά", city: "Αιγάλεω", points: 13120, ebe: "8.40", category: "Παιδαγωγικά" },
  { id: "178", name: "Παιδαγωγικό Ειδικής Αγωγής", uni: "ΘΕΣΣΑΛΙΑΣ", city: "Βόλος", points: 13050, ebe: "10.50", category: "Παιδαγωγικά" },
  { id: "142", name: "Παιδαγωγικό Δημοτικής Εκπαίδευσης", uni: "ΔΠΘ", city: "Αλεξ/πολη", points: 13000, ebe: "8.40", category: "Παιδαγωγικά" },
  { id: "136", name: "Επιστημών Της Εκπαίδευσης & Της Αγωγής Στην Προσχολική Ηλικία", uni: "ΠΑΤΡΩΝ", city: "Πάτρα", points: 13000, ebe: "9.45", category: "Παιδαγωγικά" },
  { id: "334", name: "Παιδαγωγικό Δημοτικής Εκπαίδευσης", uni: "ΔΥΤ. ΜΑΚΕΔΟΝΙΑΣ", city: "Φλώρινα", points: 12860, ebe: "8.40", category: "Παιδαγωγικά" },
  { id: "166", name: "Παιδαγωγικό Προσχολικής Εκπαίδευσης", uni: "ΘΕΣΣΑΛΙΑΣ", city: "Βόλος", points: 12425, ebe: "8.40", category: "Παιδαγωγικά" },
  { id: "156", name: "Παιδαγωγικό Νηπιαγωγών", uni: "ΙΩΑΝΝΙΝΩΝ", city: "Ιωάννινα", points: 11905, ebe: "10.50", category: "Παιδαγωγικά" },
  { id: "143", name: "Παιδαγωγικό Δημοτικής Εκπαίδευσης", uni: "ΑΙΓΑΙΟΥ", city: "Ρόδος", points: 11875, ebe: "8.40", category: "Παιδαγωγικά" },
  { id: "158", name: "Παιδαγωγικό Προσχολικής Εκπαίδευσης", uni: "ΚΡΗΤΗΣ", city: "Ρέθυμνο", points: 11600, ebe: "10.50", category: "Παιδαγωγικά" },
  { id: "1610", name:"Αγωγής και Φροντίδας στην Πρώιμη Ηλικία", uni: "ΔΙΠΑΕ", city: "Θεσσαλονίκη", points: 11250, ebe: "8.40", category: "Παιδαγωγικά" },
  { id: "341", name: "Παιδαγωγικό Νηπιαγωγών", uni: "ΔΥΤ. ΜΑΚΕΔΟΝΙΑΣ", city: "Φλώρινα", points: 10975, ebe: "10.50", category: "Παιδαγωγικά" },
  { id: "1241", name: "Αγωγής και Φροντίδας στην Πρώιμη Ηλικία", uni: "ΙΩΑΝΝΙΝΩΝ", city: "Ιωάννινα", points: 10914, ebe: "10.50", category: "Παιδαγωγικά" },
  { id: "160", name: "Επιστημών της Εκπαίδευσης στην Προσχολική Ηλικία", uni: "ΔΠΘ", city: "Αλεξ/πολη", points: 10750, ebe: "8.40", category: "Παιδαγωγικά" },
  { id: "162", name: "Επιστημών της Προσχολικής Αγωγής και Εκπαιδευτικού Σχεδιασμού", uni: "ΑΙΓΑΙΟΥ", city: "Ρόδος", points: 10150, ebe: "8.40", category: "Παιδαγωγικά" },
  
  // ΑΝΘΡΩΠΙΣΤΙΚΑ & ΚΟΙΝΩΝΙΚΑ
  { id: "124", name: "Δημόσιας Διοίκησης", uni: "ΠΑΝΤΕΙΟ", city: "Αθήνα", points: 13075, ebe: "12.60", category: "Ανθρωπιστικά & Κοινωνικά" },
  { id: "159", name: "Κοινωνικής Πολιτικής", uni: "ΠΑΝΤΕΙΟ", city: "Αθήνα", points: 12430, ebe: "8.40", category: "Ανθρωπιστικά & Κοινωνικά" },
    { id: "176", name: "Βαλκανικών, Σλαβικών & Ανατολικών Σπουδών", uni: "ΠΑΜΑΚ", city: "Θεσσαλονίκη", points: 12240, ebe: "12.60", category: "Ανθρωπιστικά & Κοινωνικά" },
  { id: "1302", name: "Κοινωνικής Πολιτικής", uni: "ΔΠΘ", city: "Κομοτηνή", points: 10820, ebe: "8.40", category: "Ανθρωπιστικά & Κοινωνικά" },
  { id: "173", name: "Ιστορίας και Φιλοσοφίας της Επιστήμης", uni: "ΕΚΠΑ", city: "Αθήνα", points: 10810, ebe: "10.50", category: "Ανθρωπιστικά & Κοινωνικά" },
  {id: "557", name: "Αρχειονομίας,Βιβλιοθηκονομίας και Συστημάτων Πληροφόρησης", uni: "ΠΑΔΑ", city: "Αιγάλεω", points: 10730, ebe: "9.45", category: "Ανθρωπιστικά & Κοινωνικά"},
  { id: "181", name: "Μεσογειακών Σπουδών : Αρχαιολογία,Γλωσσολογία,Διεθνέις Σχέσεις", uni: "ΑΙΓΑΙΟΥ", city: "Ρόδος", points: 8798, ebe: "8.40", category: "Ανθρωπιστικά & Κοινωνικά" },
  { id: "1609", name: "Βιβλιοθηκονομίας & Συστημάτων Πληροφόρησης", uni: "ΔΙΠΑΕ", city: "Θεσσαλονίκη", points: 9300, ebe: "8.40", category: "Ανθρωπιστικά & Κοινωνικά" },
  { id: "1669", name: "Ανθρωπιστικών Σπουδών", uni: "ΔΠΘ", city: "Κομοτηνή", points: 8650, ebe: "8.40", category: "Ανθρωπιστικά & Κοινωνικά" },
    { id: "1669", name: "Αρχειονομίας και Βιβλιοθηκονομίας", uni: "ΙΟΝΙΟ", city: "Κέρκυρα", points: 8525, ebe: "8.40", category: "Ανθρωπιστικά & Κοινωνικά" },

  // ΑΛΛΑ (ΠΕΡΙΒΑΛΛΟΝ, ΓΕΩΓΡΑΦΙΑ κλπ)
  
  { id: "356", name: "Γεωγραφίας", uni: "ΧΑΡΟΚΟΠΕΙΟ", city: "Αθήνα", points: 10725, ebe: "9.45", category: "Άλλα (Γεωγραφία, Περιβάλλον κ.α.)" },
  { id: "1001", name: "Αγροτικής Ανάπτυξης", uni: "ΕΚΠΑ", city: "Ψαχνά", points: 9870, ebe: "8.40", category: "Άλλα (Γεωγραφία, Περιβάλλον κ.α.)" },
  { id: "1434", name: "Περιβάλλοντος", uni: "ΘΕΣΣΑΛΙΑΣ", city: "Λάρισα", points: 9590, ebe: "8.40", category: "Άλλα (Γεωγραφία, Περιβάλλον κ.α.)" },
  { id: "548", name: "Αγροτικής Ανάπτυξης", uni: "ΔΠΘ", city: "Ορεστιάδα", points: 9125, ebe: "8.40", category: "Άλλα (Γεωγραφία, Περιβάλλον κ.α.)" },
  { id: "1453", name: "Περιβάλλοντος", uni: "ΙΟΝΙΟ", city: "Ζάκυνθος", points: 8670, ebe: "8.40", category: "Άλλα (Γεωγραφία, Περιβάλλον κ.α.)" },
  { id: "212", name: "Δασολογίας & Διαχείρησης Περιβάλλοντος και Φυσικών Πόρων", uni: "ΔΠΘ", city: "Ορεστιάδα", points: 8640, ebe: "8.40", category: "Άλλα (Γεωγραφία, Περιβάλλον κ.α.)" },
  { id: "1424", name: "Δασολογίας, Επιστημών Ξύλου και Σχεδιασμού", uni: "ΘΕΣΣΑΛΙΑΣ", city: "Καρδίτσα", points: 8605, ebe: "8.40", category: "Άλλα (Γεωγραφία, Περιβάλλον κ.α.)" },
  { id: "276", name: "Περιβάλλοντος", uni: "ΑΙΓΑΙΟΥ", city: "Μυτιλήνη", points: 8550, ebe: "8.40", category: "Άλλα (Γεωγραφία, Περιβάλλον κ.α.)" },
  { id: "1276", name: "Αλιείας & Υδατοκαλλιεργειών", uni: "ΠΑΤΡΩΝ", city: "Μεσολόγγι", points: 8335, ebe: "8.40", category: "Άλλα (Γεωγραφία, Περιβάλλον κ.α.)" },
  { id: "310", name: "Γεωγραφίας", uni: "ΑΙΓΑΙΟΥ", city: "Μυτιλήνη", points: 7740, ebe: "8.40", category: "Άλλα (Γεωγραφία, Περιβάλλον κ.α.)" },

  //Τεχνες
  { id: "675", name: "Εσωτερικής Αρχιτεκτονικής", uni: "ΠΑΔΑ", city: "Αιγάλεω", points: 14405, ebe: "13.06", category: "Τέχνες", requirements: "Σχέδιο" },
  { id: "674", name: "Γραφιστικής και Οπτικής Επικοινωνίας", uni: "ΠΑΔΑ", city: "Αιγάλεω", points: 13745, ebe: "9.09", category: "Τέχνες", requirements: "Σχέδιο" },
  { id: "1626", name: "Εσωτερικής Αρχιτεκτονικής", uni: "ΔΙΠΑΕ", city: "Σέρρες", points: 13545, ebe: "9.09", category: "Τέχνες", requirements: "Σχέδιο" },

  //Σχεδιο Μοδας
  { id: "566", name: "Δημιουργικού Σχεδιασμού και Ένδυσης", uni: "ΔΙΠΑΕ", city: "Κιλκίς", points: 8650, ebe: "8.4", category: "Σχέδιο Μόδας"},

];

const BasesPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [activeCity, setActiveCity] = useState("Όλες");

  const cities = useMemo(() => ["Όλες", ...Array.from(new Set(ALL_SCHOOLS.map(s => s.city))).sort()], []);

  const filteredSchools = useMemo(() => {
    return ALL_SCHOOLS.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                           s.uni.toLowerCase().includes(search.toLowerCase());
      const matchesCity = activeCity === "Όλες" || s.city === activeCity;
      return matchesSearch && matchesCity;
    }).sort((a, b) => b.points - a.points);
  }, [search, activeCity]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 pb-24">
      {/* Navbar / Filters */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-28 flex flex-col justify-center">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="text-xl font-black text-gray-900 dark:text-white shrink-0">Σχολές <span className="text-pink-600">4ο Επιστημονικό πεδίο</span></h1>
            
            <div className="flex w-full max-w-3xl gap-3">
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Αναζήτηση σχολής ή πανεπιστημίου..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none dark:text-white transition-all shadow-inner"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="relative shrink-0">
                <select 
                  className="appearance-none bg-gray-100 dark:bg-gray-800 pl-10 pr-10 py-3 rounded-2xl font-bold text-sm dark:text-white cursor-pointer outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-inner"
                  value={activeCity}
                  onChange={(e) => setActiveCity(e.target.value)}
                >
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-600" size={16} />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 mt-12">
        {Object.entries(CATEGORIES).map(([catName, config]) => {
          const schools = filteredSchools.filter(s => s.category === catName);
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
                <div className={`p-3 rounded-2xl ${config.color} shadow-sm border border-white/20`}>
                  {config.icon}
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-800 dark:text-white tracking-tight">{catName}</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">{schools.length} Σχολές</p>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-800 ml-4"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schools.map((school) => (
                  <SchoolCard key={school.id} school={school} />
                ))}
              </div>
            </motion.section>
          );
        })}
      </main>
    </div>
  );
};

const SchoolCard: React.FC<{ school: School }> = ({ school }) => (
  <motion.div 
    whileHover={{ y: -8, scale: 1.01 }}
    className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-pink-500/10 transition-all group overflow-hidden relative"
  >
    {/* Background Pattern */}
    <div className="absolute -top-10 -right-10 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl group-hover:bg-pink-500/10 transition-all" />

    <div className="flex justify-between items-start mb-4">
      <div className="space-y-1 pr-10">
        <span className="text-[10px] font-black text-pink-600 bg-pink-50 dark:bg-pink-900/30 px-2 py-0.5 rounded-lg uppercase tracking-wider">
          {school.uni}
        </span>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight group-hover:text-pink-600 transition-colors">
          {school.name}
        </h3>
      </div>
      <div className="shrink-0 bg-slate-50 dark:bg-gray-800 p-2 rounded-2xl">
        <TrendingUp className="text-gray-400 group-hover:text-pink-500 transition-colors" size={18} />
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

    <div className="flex items-end justify-between mt-8 pt-5 border-t border-slate-50 dark:border-gray-800/50">
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
          <MapPin size={14} className="text-pink-500" />
          <span className="text-xs font-bold">{school.city}</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-gray-800 rounded-full text-gray-400">
          <span className="text-[10px] font-black">EBE: {school.ebe}</span>
        </div>
      </div>

      <div className="text-right">
        <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Βάση 2025</span>
        <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter tabular-nums leading-none">
          {school.points.toLocaleString()}
        </span>
      </div>
    </div>
  </motion.div>
);

export default BasesPage;