import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  category: string;
  thumbnail: string;
  videoUrl: string;
  videoType: string;
  instructor: string;
  views: number;
  level: string;
  locked: boolean;
}

const LESSONS: Lesson[] = [
  // ═══════════════════════════════════════════════════════════════
  // 🆓 ΔΩΡΕΑΝ ΜΑΘΗΜΑΤΑ (BASIC)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 1,
    title: 'Μάθημα 1ο - Ανάλυση Προβλήματος',
    description: 'Η έννοια του προβλήματος, Κατανόηση και Δομή προβλήματος, Καθορισμός Απαιτήσεων.',
    duration: '45 λεπτά',
    category: 'Θεωρητικά Μαθήματα',
    thumbnail: '/images/m.png',
    videoUrl: 'https://www.youtube.com/embed/Ht2-2PMPvcY?si=whQ8m8fFoQJbt21n',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 1500,
    level: 'Easy',
    locked: false,
  },
  {
    id: 2,
    title: 'Μάθημα 2ο - Βασικές Έννοιες Προγραμματισμού',
    description:
      'Μεταβλητές, Σταθερές, Τύποι Δεδομένων, Εκφράσεις, Εντολή Εκχώρησης, Ενσωματωμένες Συναρτήσεις.',
    duration: '60 λεπτά',
    category: 'Βασικά για Αλγορίθμους',
    thumbnail: '/images/2.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 1024,
    level: 'Easy',
    locked: true,
  },
  {
    id: 3,
    title: 'Μάθημα 3ο - Αλγόριθμοι: Βασικές εντολές και Έννοιες',
    description:
      'Τι είναι αλγόριθμος, Σπουδαιότητα Αλγορίθμων, Περιγραφή-Αναπαράσταση Αλγορίθμων, Διάγραμμα Ροής, Βασικές Συνιστώσες Αλγορίθμου, Δομή Ακολουθίας με Αλγόριθμο.',
    duration: '55 λεπτά',
    category: 'Βασικά για Αλγορίθμους',
    thumbnail: '/images/3.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 756,
    level: 'Easy',
    locked: true,
  },
  {
    id: 4,
    title: 'Μάθημα 4ο - Προγράμματα: Βασικές Εντολές και Έννοιες',
    description: 'Βασικές συνιστώσεις ενός προγράμματος σε ΓΛΩΣΣΑ, Δομή Ακολουθίας στη ΓΛΩΣΣΑ.',
    duration: '70 λεπτά',
    category: 'Προγράμματα',
    thumbnail: '/images/4.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 1100,
    level: 'Easy',
    locked: true,
  },
  {
    id: 5,
    title: 'Μάθημα 5ο - Απλή Δομή Επιλογής',
    description: 'Σύνταξη, Λειτουργία και Παραδείγματα της Απλής Δομής Επιλογής σε ΓΛΩΣΣΑ.',
    duration: '50 λεπτά',
    category: 'Δομές Επιλογής',
    thumbnail: '/images/1.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 890,
    level: 'Easy',
    locked: true,
  },
  {
    id: 6,
    title: 'Μάθημα 6ο - Σύνθετη Δομή Επιλογής',
    description: 'Σύνταξη, Λειτουργία και Παραδείγματα της Σύνθετης Δομής Επιλογής σε ΓΛΩΣΣΑ.',
    duration: '65 λεπτά',
    category: 'Δομές Επιλογής',
    thumbnail: '/images/2.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 645,
    level: 'Easy',
    locked: true,
  },
  {
    id: 7,
    title: 'Μάθημα 7ο - Πολλαπλή Δομή Επιλογής',
    description: 'Σύνταξη, Λειτουργία και Παραδείγματα της Πολλαπλής Δομής Επιλογής σε ΓΛΩΣΣΑ.',
    duration: '65 λεπτά',
    category: 'Δομές Επιλογής',
    thumbnail: '/images/3.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 645,
    level: 'Easy',
    locked: true,
  },
  {
    id: 8,
    title: 'Μάθημα 8ο - Πολλαπλή Επίλεξε',
    description: 'Σύνταξη, Λειτουργία και Παραδείγματα της εντολής ΕΠΙΛΕΞΕ σε ΓΛΩΣΣΑ.',
    duration: '65 λεπτά',
    category: 'Δομές Επιλογής',
    thumbnail: '/images/4.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 645,
    level: 'Easy',
    locked: true,
  },
  {
    id: 9,
    title: 'Μάθημα 9ο - Εμφωλευμένη Δομή Επιλογής',
    description: 'Παραδείγματα, Μετατροπές και Μεθοδολογίες Εμφωλευμένης Δομής Επιλογής σε ΓΛΩΣΣΑ.',
    duration: '65 λεπτά',
    category: 'Δομές Επιλογής',
    thumbnail: '/images/1.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 645,
    level: 'Easy',
    locked: true,
  },

  // ═══════════════════════════════════════════════════════════════
  // 🔒 ΚΛΕΙΔΩΜΕΝΑ ΜΑΘΗΜΑΤΑ (PRO)
  // ═══════════════════════════════════════════════════════════════

  // --- Δομές Επανάληψης ---
  {
    id: 10,
    title: 'Μάθημα 10ο - Εντολή Επανάληψης ΟΣΟ...ΕΠΑΝΑΛΑΒΕ',
    description:
      'Σύνταξη, Λειτουργία, Μεθοδολογίες και Ασκήσεις με Δομή Επανάληψης ΟΣΟ...ΕΠΑΝΑΛΑΒΕ.',
    duration: '75 λεπτά',
    category: 'Δομές Επανάληψης',
    thumbnail: '/images/2.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 543,
    level: 'Medium',
    locked: true,
  },
  {
    id: 11,
    title: 'Μάθημα 11ο - Δομή Επανάληψης ΜΕΧΡΙΣ_ΟΤΟΥ',
    description:
      'Σύνταξη, Λειτουργία, Μεθοδολογίες και Ασκήσεις με Δομή Επανάληψης ΜΕΧΡΙΣ_ΟΤΟΥ, Σχέση με ΟΣΟ...ΕΠΑΝΑΛΑΒΕ.',
    duration: '70 λεπτά',
    category: 'Δομές Επανάληψης',
    thumbnail: '/images/3.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 489,
    level: 'Medium',
    locked: true,
  },
  {
    id: 12,
    title: 'Μάθημα 12ο - Εντολή Επανάληψης ΓΙΑ...ΑΠΟ...ΜΕΧΡΙ',
    description:
      'Σύνταξη, Λειτουργία, Μεθοδολογίες και Ασκήσεις με Δομή Επανάληψης ΓΙΑ...ΑΠΟ...ΜΕΧΡΙ.',
    duration: '80 λεπτά',
    category: 'Δομές Επανάληψης',
    thumbnail: '/images/4.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 612,
    level: 'Medium',
    locked: true,
  },
  {
    id: 13,
    title: 'Μάθημα 13ο - Εμφωλευμένοι Βρόχοι Δομών Επανάληψης',
    description:
      'Παραδείγματα, Μετατροπές και Μεθοδολογίες Εμφωλευμένων Δομών Επανάληψης σε ΓΛΩΣΣΑ.',
    duration: '90 λεπτά',
    category: 'Δομές Επανάληψης',
    thumbnail: '/images/1.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 728,
    level: 'Medium',
    locked: true,
  },
  {
    id: 14,
    title: 'Μάθημα 14ο - Μετατροπές Δομών Επανάληψης',
    description: 'Όλες οι περιπτώσεις μετατροπών μεταξύ των δομών επανάληψης στη ΓΛΩΣΣΑ.',
    duration: '90 λεπτά',
    category: 'Δομές Επανάληψης',
    thumbnail: '/images/2.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 701,
    level: 'Medium',
    locked: true,
  },
  {
    id: 15,
    title: 'Μάθημα 15ο - Δύσκολες Μεθοδολογίες με Δομές Επανάληψης (1)',
    description: 'Ανάλυση και επίλυση σύνθετων προβλημάτων με Δομές Επανάληψης στη ΓΛΩΣΣΑ.',
    duration: '90 λεπτά',
    category: 'Δομές Επανάληψης',
    thumbnail: '/images/3.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 685,
    level: 'Hard',
    locked: true,
  },
  {
    id: 16,
    title: 'Μάθημα 16ο - Δύσκολες Μεθοδολογίες με Δομές Επανάληψης (2)',
    description:
      'Ανάλυση και επίλυση σύνθετων προβλημάτων με Δομές Επανάληψης στη ΓΛΩΣΣΑ - Μέρος 2.',
    duration: '90 λεπτά',
    category: 'Δομές Επανάληψης',
    thumbnail: '/images/4.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 662,
    level: 'Hard',
    locked: true,
  },
  {
    id: 17,
    title: 'Μάθημα 17ο - Αριθμητικά Προβλήματα - Σχηματισμός Ακολουθιών',
    description:
      'Μάθε να σχηματίζεις αριθμητικές ακολουθίες για θέμα Β με χρήση της ΓΙΑ...ΑΠΟ...ΜΕΧΡΙ.',
    duration: '90 λεπτά',
    category: 'Δομές Επανάληψης',
    thumbnail: '/images/1.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 639,
    level: 'Medium',
    locked: true,
  },
  {
    id: 18,
    title: 'Μάθημα 18ο - Ειδικές Περιπτώσεις Διαγραμμάτων Ροής',
    description:
      'Ειδικές περιπτώσεις διαγραμμάτων ροής με δομές επανάληψης και μετατροπή σε κώδικα ΓΛΩΣΣΑ.',
    duration: '85 λεπτά',
    category: 'Δομές Επανάληψης',
    thumbnail: '/images/2.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 614,
    level: 'Medium',
    locked: true,
  },
  {
    id: 19,
    title: 'Μάθημα 19ο - Θέματα Πανελλαδικών με Δομές Επανάληψης (1)',
    description: 'Επίλυση θεμάτων Πανελλαδικών Εξετάσεων που αφορούν Δομές Επανάληψης - Μέρος 1.',
    duration: '95 λεπτά',
    category: 'Δομές Επανάληψης',
    thumbnail: '/images/3.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 654,
    level: 'Hard',
    locked: true,
  },
  {
    id: 20,
    title: 'Μάθημα 20ο - Θέματα Πανελλαδικών με Δομές Επανάληψης (2)',
    description: 'Επίλυση θεμάτων Πανελλαδικών Εξετάσεων που αφορούν Δομές Επανάληψης - Μέρος 2.',
    duration: '85 λεπτά',
    category: 'Δομές Επανάληψης',
    thumbnail: '/images/4.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 571,
    level: 'Hard',
    locked: true,
  },

  // --- Θεωρητικά Μαθήματα ---
  {
    id: 21,
    title: 'Μάθημα 21ο - Πολλαπλασιασμός αλά Ρωσικά - Ολίσθηση',
    description:
      'Περιγραφή και Υλοποίηση του Αλγορίθμου Πολλαπλασιασμού αλά Ρωσικά και εξήγηση της Ολίσθησης.',
    duration: '90 λεπτά',
    category: 'Θεωρητικά Μαθήματα',
    thumbnail: '/images/1.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 598,
    level: 'Medium',
    locked: true,
  },
  {
    id: 22,
    title: 'Μάθημα 22ο - Φυσική Γλώσσα - Διάγραμμα Ροής - Κώδικας',
    description:
      'Ανάλυση και Επίλυση Προβλημάτων με τη μέθοδο Φυσικής Γλώσσας Κατά Βήματα, Διάγραμμα Ροής και Κώδικα ΓΛΩΣΣΑ.',
    duration: '100 λεπτά',
    category: 'Θεωρητικά Μαθήματα',
    thumbnail: '/images/2.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 432,
    level: 'Medium',
    locked: true,
  },

  // --- Πίνακες ---
  {
    id: 23,
    title: 'Μάθημα 23ο - Εισαγωγή στις Δομές Δεδομένων - Πίνακες',
    description: 'Εισαγωγή στις βασικές έννοιες των Δομών Δεδομένων και των Πινάκων στη ΓΛΩΣΣΑ.',
    duration: '85 λεπτά',
    category: 'Πίνακες',
    thumbnail: '/images/3.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 543,
    level: 'Easy',
    locked: true,
  },
  {
    id: 24,
    title: 'Μάθημα 24ο - Μονοδιάστατοι Πίνακες',
    description: 'Δήλωση, Δημιουργία και Χειρισμός Μονοδιάστατων Πινάκων σε ΓΛΩΣΣΑ.',
    duration: '85 λεπτά',
    category: 'Πίνακες',
    thumbnail: '/images/4.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 521,
    level: 'Easy',
    locked: true,
  },
  {
    id: 25,
    title: 'Μάθημα 25ο - Ταξινόμηση Πινάκων',
    description: 'Αλγόριθμοι Ταξινόμησης (Bubble Sort, Selection Sort) για Μονοδιάστατους Πίνακες.',
    duration: '85 λεπτά',
    category: 'Πίνακες',
    thumbnail: '/images/1.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 498,
    level: 'Medium',
    locked: true,
  },
  {
    id: 26,
    title: 'Μάθημα 26ο - Σειριακή Αναζήτηση σε Μονοδιάστατους Πίνακες',
    description: 'Μέθοδοι Σειριακής Αναζήτησης (Linear Search) σε Μονοδιάστατους Πίνακες.',
    duration: '85 λεπτά',
    category: 'Πίνακες',
    thumbnail: '/images/2.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 476,
    level: 'Medium',
    locked: true,
  },
  {
    id: 27,
    title: 'Μάθημα 27ο - Δυαδική Αναζήτηση σε Μονοδιάστατους Πίνακες',
    description: 'Αλγόριθμος Δυαδικής Αναζήτησης (Binary Search) σε Ταξινομημένους Πίνακες.',
    duration: '85 λεπτά',
    category: 'Πίνακες',
    thumbnail: '/images/3.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 454,
    level: 'Hard',
    locked: true,
  },
  {
    id: 28,
    title: 'Μάθημα 28ο - Συγχώνευση Πινάκων',
    description: 'Συγχώνευση δύο ή περισσοτέρων Πινάκων σε έναν νέο Πίνακα.',
    duration: '85 λεπτά',
    category: 'Πίνακες',
    thumbnail: '/images/4.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 432,
    level: 'Medium',
    locked: true,
  },
  {
    id: 29,
    title: 'Μάθημα 29ο - Δισδιάστατοι Πίνακες (1)',
    description: 'Δήλωση, Δημιουργία και Χειρισμός Δισδιάστατων Πινάκων - Μέρος 1.',
    duration: '85 λεπτά',
    category: 'Πίνακες',
    thumbnail: '/images/1.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 489,
    level: 'Medium',
    locked: true,
  },
  {
    id: 30,
    title: 'Μάθημα 30ο - Δισδιάστατοι Πίνακες (2)',
    description: 'Επεξεργασία και Χειρισμός Δισδιάστατων Πινάκων - Μέρος 2.',
    duration: '85 λεπτά',
    category: 'Πίνακες',
    thumbnail: '/images/2.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 467,
    level: 'Medium',
    locked: true,
  },
  {
    id: 31,
    title: 'Μάθημα 31ο - Δισδιάστατοι Πίνακες (3)',
    description: 'Αναζήτηση και Ταξινόμηση σε Δισδιάστατους Πίνακες - Μέρος 3.',
    duration: '85 λεπτά',
    category: 'Πίνακες',
    thumbnail: '/images/3.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 445,
    level: 'Medium',
    locked: true,
  },

  // --- Υποπρογράμματα ---
  {
    id: 32,
    title: 'Μάθημα 32ο - Τμηματικός Προγραμματισμός',
    description: 'Εισαγωγή στον Τμηματικό Προγραμματισμό και τη χρήση Υποπρογραμμάτων.',
    duration: '85 λεπτά',
    category: 'Υποπρογράμματα',
    thumbnail: '/images/4.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 512,
    level: 'Medium',
    locked: true,
  },
  {
    id: 33,
    title: 'Μάθημα 33ο - Υποπρογράμματα (1)',
    description: 'Βασικές Έννοιες Υποπρογραμμάτων - Δήλωση και Κλήση.',
    duration: '85 λεπτά',
    category: 'Υποπρογράμματα',
    thumbnail: '/images/1.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 498,
    level: 'Medium',
    locked: true,
  },
  {
    id: 34,
    title: 'Μάθημα 34ο - Υποπρογράμματα (2) - Συναρτήσεις',
    description: 'Δήλωση, Κλήση και Χρήση Συναρτήσεων στη ΓΛΩΣΣΑ.',
    duration: '85 λεπτά',
    category: 'Υποπρογράμματα',
    thumbnail: '/images/2.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 476,
    level: 'Medium',
    locked: true,
  },
  {
    id: 35,
    title: 'Μάθημα 35ο - Διαδικασίες',
    description: 'Δήλωση, Κλήση και Χρήση Διαδικασιών στη ΓΛΩΣΣΑ.',
    duration: '85 λεπτά',
    category: 'Υποπρογράμματα',
    thumbnail: '/images/3.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 454,
    level: 'Medium',
    locked: true,
  },
  {
    id: 36,
    title: 'Μάθημα 36ο - Πίνακες και Υποπρογράμματα',
    description: 'Χρήση Πινάκων σε Υποπρογράμματα - Παράμετροι και Επιστροφή Τιμών.',
    duration: '85 λεπτά',
    category: 'Υποπρογράμματα',
    thumbnail: '/images/4.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 432,
    level: 'Medium',
    locked: true,
  },

  // --- Δομές Δεδομένων Προχωρημένες ---
  {
    id: 37,
    title: 'Μάθημα 37ο - Εισαγωγή στον Προγραμματισμό (Κεφ. 6)',
    description: 'Φυσικές και Τεχνητές Γλώσσες, Διαδικασία Μεταγλώττισης και Σύνδεσης',
    duration: '85 λεπτά',
    category: 'Θεωρητικά Μαθήματα',
    thumbnail: '/images/1.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 398,
    level: 'Medium',
    locked: true,
  },
  {
    id: 38,
    title: 'Μάθημα 38ο - Ανάλυση Προβλήματος και Διαίρει και Βασίλευε',
    description: 'Κεφάλαιο 4 Σχολικό και Κεφάλαιο 2 Συμπληρωματικό - Τεχνικές Ανάλυσης.',
    duration: '85 λεπτά',
    category: 'Θεωρητικά Μαθήματα',
    thumbnail: '/images/2.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 376,
    level: 'Medium',
    locked: true,
  },
  {
    id: 39,
    title: 'Μάθημα 39ο - Στοίβα',
    description: 'Δομή Δεδομένων Στοίβα (Stack) - Λειτουργίες PUSH και POP.',
    duration: '85 λεπτά',
    category: 'Δομές Δεδομένων',
    thumbnail: '/images/3.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 445,
    level: 'Medium',
    locked: true,
  },
  {
    id: 40,
    title: 'Μάθημα 40ο - Ουρά',
    description: 'Δομή Δεδομένων Ουρά (Queue) - Λειτουργίες ENQUEUE και DEQUEUE.',
    duration: '85 λεπτά',
    category: 'Δομές Δεδομένων',
    thumbnail: '/images/4.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 423,
    level: 'Medium',
    locked: true,
  },
  {
    id: 41,
    title: 'Μάθημα 41ο - Στοίβα και Ουρά στα Υποπρογράμματα',
    description: 'Υλοποίηση Στοίβας και Ουράς με χρήση Υποπρογραμμάτων.',
    duration: '85 λεπτά',
    category: 'Δομές Δεδομένων',
    thumbnail: '/images/1.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 401,
    level: 'Medium',
    locked: true,
  },
  {
    id: 42,
    title: 'Μάθημα 42ο - Λίστες',
    description: 'Συνδεδεμένες Λίστες (Linked Lists) - Δημιουργία και Διαχείριση.',
    duration: '85 λεπτά',
    category: 'Δομές Δεδομένων',
    thumbnail: '/images/2.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 389,
    level: 'Hard',
    locked: true,
  },
  {
    id: 43,
    title: 'Μάθημα 43ο - Δένδρα',
    description: 'Δένδρα (Trees) - Βασικές Έννοιες και Διασχίσεις.',
    duration: '85 λεπτά',
    category: 'Δομές Δεδομένων',
    thumbnail: '/images/3.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 367,
    level: 'Hard',
    locked: true,
  },
  {
    id: 44,
    title: 'Μάθημα 44ο - Γράφοι',
    description: 'Γράφοι (Graphs) - Αναπαράσταση και Βασικοί Αλγόριθμοι.',
    duration: '85 λεπτά',
    category: 'Δομές Δεδομένων',
    thumbnail: '/images/4.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 345,
    level: 'Hard',
    locked: true,
  },

  // --- Αντικειμενικός Προγραμματισμός ---
  {
    id: 45,
    title: 'Μάθημα 45ο - Αντικειμενικός Προγραμματισμός (1)',
    description: 'Εισαγωγή στον Αντικειμενικό Προγραμματισμό - Κλάσεις και Αντικείμενα.',
    duration: '85 λεπτά',
    category: 'Αντικειμενικός Προγραμματισμός',
    thumbnail: '/images/1.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 412,
    level: 'Medium',
    locked: true,
  },
  {
    id: 46,
    title: 'Μάθημα 46ο - Αντικειμενικός Προγραμματισμός (2)',
    description: 'Κληρονομικότητα και Πολυμορφισμός στον Αντικειμενικό Προγραμματισμό.',
    duration: '85 λεπτά',
    category: 'Αντικειμενικός Προγραμματισμός',
    thumbnail: '/images/2.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 398,
    level: 'Medium',
    locked: true,
  },
  {
    id: 47,
    title: 'Μάθημα 47ο - Αντικειμενικός Προγραμματισμός (3)',
    description: 'Ενθυλάκωση και Αφαίρεση στον Αντικειμενικό Προγραμματισμό.',
    duration: '85 λεπτά',
    category: 'Αντικειμενικός Προγραμματισμός',
    thumbnail: '/images/3.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 376,
    level: 'Medium',
    locked: true,
  },

  // --- Έλεγχος και Τεστ ---
  {
    id: 48,
    title: 'Μάθημα 48ο - Κατηγορίες Λαθών - Εκσφαλμάτωση',
    description: 'Τύποι Λαθών (Συντακτικά, Σημασιολογικά, Λογικά) και Τεχνικές Εκσφαλμάτωσης.',
    duration: '85 λεπτά',
    category: 'Έλεγχος Προγραμμάτων',
    thumbnail: '/images/4.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 434,
    level: 'Medium',
    locked: true,
  },
  {
    id: 49,
    title: 'Μάθημα 49ο - Σενάρια Ελέγχου',
    description: 'Δημιουργία και Εκτέλεση Σεναρίων Ελέγχου για Προγράμματα.',
    duration: '85 λεπτά',
    category: 'Έλεγχος Προγραμμάτων',
    thumbnail: '/images/1.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 412,
    level: 'Medium',
    locked: true,
  },

  // --- Επαναληπτικά Θέματα ---
  {
    id: 50,
    title: 'Μάθημα 50ο - Επαναληπτικά Θέματα Πανελληνίων (1)',
    description: 'Επίλυση Θεμάτων Πανελλαδικών Εξετάσεων - Συλλογή Θεμάτων Μέρος 1.',
    duration: '95 λεπτά',
    category: 'Επανάληψη',
    thumbnail: '/images/2.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 567,
    level: 'Hard',
    locked: true,
  },
  {
    id: 51,
    title: 'Μάθημα 51ο - Επαναληπτικά Θέματα Πανελληνίων (2)',
    description: 'Επίλυση Θεμάτων Πανελλαδικών Εξετάσεων - Συλλογή Θεμάτων Μέρος 2.',
    duration: '95 λεπτά',
    category: 'Επανάληψη',
    thumbnail: '/images/3.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 545,
    level: 'Hard',
    locked: true,
  },
  {
    id: 52,
    title: 'Μάθημα 52ο - Επαναληπτικά Θέματα Πανελληνίων (3)',
    description: 'Επίλυση Θεμάτων Πανελλαδικών Εξετάσεων - Συλλογή Θεμάτων Μέρος 3.',
    duration: '95 λεπτά',
    category: 'Επανάληψη',
    thumbnail: '/images/3.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 545,
    level: 'Hard',
    locked: true,
  },
];

// ═══════════════════════════════════════════════════════════════
// 🔒 UPGRADE MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-4xl bg-gradient-to-br from-white to-pink-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl shadow-2xl overflow-hidden"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Κλείσιμο"
          >
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="flex items-center justify-center  bg-gradient-to-br from-pink-200 via-white to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Content */}
            <div className="p-8 md:p-4 text-center">
              {/* Header */}
              <motion.div
                className="inline-block mb-6"
                animate={{ rotate: [0, 8, -8, 8, 0], scale: [1, 1.05, 1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 1.5 }}
              >
                <span className="text-7xl md:text-8xl">🚀</span>
              </motion.div>

              <motion.h2
                className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Coming Soon
              </motion.h2>

              <motion.p
                className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-md mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                Δουλεύουμε σκληρά για να καταγράψουμε όλα τα μαθήματα! Μείνετε Συντονισμένοι!
              </motion.p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ═══════════════════════════════════════════════════════════════
// 🎬 VIDEO MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════

interface VideoModalProps {
  lesson: Lesson | null;
  isOpen: boolean;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ lesson, isOpen, onClose }) => {
  if (!isOpen || !lesson) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg"
            aria-label="Κλείσιμο"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            {lesson.videoType === 'youtube' ? (
              <iframe
                className="absolute inset-0 w-full h-full"
                src={lesson.videoUrl}
                title={lesson.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                className="absolute inset-0 w-full h-full"
                controls
                autoPlay
                src={lesson.videoUrl}
              />
            )}
          </div>

          <div className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-gray-800 dark:to-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {lesson.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{lesson.description}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400"></span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ═══════════════════════════════════════════════════════════════
// 🎴 LESSON CARD COMPONENT
// ═══════════════════════════════════════════════════════════════

interface LessonCardProps {
  lesson: Lesson;
  onClick: () => void;
  index: number;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, onClick, index }) => {
  const isLocked = lesson.locked;

  return (
    <motion.div
      className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-pink-200 to-rose-200 flex-shrink-0">
        <motion.img
          src={lesson.thumbnail}
          alt={lesson.title}
          className={`w-full h-full object-cover ${isLocked ? 'blur-sm opacity-50' : ''}`}
          whileHover={{ scale: isLocked ? 1 : 1.1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Lock Overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <motion.div
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                <svg
                  className="w-16 h-16 text-yellow-400 mx-auto mb-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.div>
              <span className="text-white font-bold text-sm">Κλειδωμένο</span>
            </motion.div>
          </div>
        )}

        {/* Play Overlay for unlocked */}
        {!isLocked && (
          <motion.div
            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <motion.div
              className="w-16 h-16 rounded-full bg-pink-500 flex items-center justify-center shadow-xl"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Content - grows to fill space */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs font-semibold text-pink-600 dark:text-pink-400 mb-2">
          {lesson.category}
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
          {lesson.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-grow">
          {lesson.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {lesson.instructor.charAt(0)}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">{lesson.instructor}</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500"></div>
        </div>
      </div>

      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'linear-gradient(45deg, transparent, rgba(236, 72, 153, 0.1), transparent)',
        }}
      />
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 🏠 MAIN ONLINE PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════

const OnlinePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('Όλα');
  const [selectedCategory, setSelectedCategory] = useState<string>('Όλες');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);

  const levels = ['Όλα', ...new Set(LESSONS.map((l) => l.level))];
  const categories = ['Όλες', ...new Set(LESSONS.map((l) => l.category))];

  const filteredLessons = useMemo(() => {
    return LESSONS.filter((lesson) => {
      const matchesSearch =
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = selectedLevel === 'Όλα' || lesson.level === selectedLevel;
      const matchesCategory = selectedCategory === 'Όλες' || lesson.category === selectedCategory;

      return matchesSearch && matchesLevel && matchesCategory;
    });
  }, [searchQuery, selectedLevel, selectedCategory]);

  const handleCardClick = (lesson: Lesson) => {
    if (lesson.locked) {
      setIsUpgradeModalOpen(true);
    } else {
      setSelectedLesson(lesson);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedLesson(null), 300);
  };

  const handleCloseUpgradeModal = () => {
    setIsUpgradeModalOpen(false);
  };

  // Stats
  const totalLessons = LESSONS.length;
  const unlockedLessons = LESSONS.filter((l) => !l.locked).length;
  const lockedLessons = LESSONS.filter((l) => l.locked).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white py-16 px-6">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <motion.div
            className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute -bottom-24 -right-24 w-96 h-96 bg-white rounded-full"
            animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-black mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            📚 Online Μαθήματα
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-pink-100 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Καταγεγραμμένα μαθήματα Πληροφορικής για τις Πανελλήνιες - Όλα όσα πρέπει να ξέρεις για
            να γράψεις 20!
          </motion.p>

          {/* Stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4">
              <div className="text-3xl font-black">{totalLessons}</div>
              <div className="text-sm text-pink-100">Συνολικά Μαθήματα</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4">
              <div className="text-3xl font-black">{unlockedLessons}</div>
              <div className="text-sm text-pink-100">Διαθέσιμα 🎁</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4">
              <div className="text-3xl font-black">{lockedLessons}</div>
              <div className="text-sm text-pink-100">Coming soon 💎</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg border-b border-pink-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Αναζήτηση μαθήματος..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Βρέθηκαν <span className="font-bold text-pink-600">{filteredLessons.length}</span>{' '}
            μαθήματα
          </div>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {filteredLessons.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Δεν βρέθηκαν μαθήματα
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Δοκίμασε να αλλάξεις τα φίλτρα αναζήτησης
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLessons.map((lesson, index) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                index={index}
                onClick={() => handleCardClick(lesson)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <VideoModal lesson={selectedLesson} isOpen={isModalOpen} onClose={handleCloseModal} />
      <UpgradeModal isOpen={isUpgradeModalOpen} onClose={handleCloseUpgradeModal} />
    </div>
  );
};

export default OnlinePage;
