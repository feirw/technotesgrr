import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LESSONS = [
  {
    id: 1,
    title: 'Μάθημα 1ο - Ανάλυση Προβλήματος',
    description: 'Η έννοια του προβλήματος,Κατανόηση και Δομή προβλήματος,Καθορισμός Απαιτήσεων. ',
    duration: '45 λεπτά',
    category: 'Θεωρητικά Μαθήματα',
    thumbnail: '/images/1.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Eλένη Ζαφείρη',
    views: 1500,
    level: 'Easy',
    locked: false,
  },
  {
    id: 2,
    title: 'Μάθημα 2ο - Βασικές Έννοιες Προγραμματισμού',
    description:
      'Μεταβλητές,Σταθερές,Τύποι Δεδομένων,Εκφράσεις,Εντολή Εκχώρησης,Ενσωματωμένες Συναρτήσεις.',
    duration: '60 λεπτά',
    category: 'Βασικά για Αλγορίθμους',
    thumbnail: '/images/2.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 1024,
    level: 'Easy',
    locked: false,
  },
  {
    id: 3,
    title: 'Μάθημα 3ο - Αλγόριθμοι: Βασικές εντολές και Έννοιες',
    description:
      'Τι είναι αλγόριθμος,Σπουδαιότητα Αλγορίθμων,Περιγραφή-Αναπαράσταση Αλγορίθμων,Διάγραμμα Ροής,Βασικές Συνιστώσες Αλγορίθμου,Δομή Ακολουθίας με Αλγόριθμο.',
    duration: '55 λεπτά',
    category: 'Αλγόριθμοι',
    thumbnail: '/images/3.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 756,
    level: 'Easy',
    locked: false,
  },
  {
    id: 4,
    title: 'Μάθημα 4ο - Προγράμματα : Βασικές Εντολές και Έννοιες ',
    description: 'Βασικές συνιστώσεις ενός προγράμματος σε ΓΛΩΣΣΑ, Δομή Ακολουθίας στη ΓΛΩΣΣΑ',
    duration: '70 λεπτά',
    level: 'Easy',
    category: 'Προγράμματα',
    thumbnail: '/images/4.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 1100,
    locked: false,
  },
  {
    id: 5,
    title: 'Μάθημα 5ο - Απλή Δομή επιλογής',
    description: 'Σύνταξη, Λειτουργία και Παραδείγματα της Απλής Δομής Επιλογής σε ΓΛΩΣΣΑ.',
    duration: '50 λεπτά',
    level: 'Easy',
    category: 'Εντολές Επιλογής',
    thumbnail: '/images/1.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 890,
    locked: false,
  },
  {
    id: 6,
    title: 'Μάθημα 6ο - Σύνθετη Δομή επιλογής',
    description: 'Σύνταξη, Λειτουργία και Παραδείγματα της Σύνθετης Δομής Επιλογής σε ΓΛΩΣΣΑ.',
    duration: '65 λεπτά',
    level: 'Easy',
    category: 'Εντολές Επιλογής',
    thumbnail: '/images/2.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 645,
    locked: false,
  },
  {
    id: 7,
    title: 'Μάθημα 7ο - Πολλαπλή Δομή επιλογής',
    description: 'Σύνταξη, Λειτουργία και Παραδείγματα της Πολλαπλής Δομής Επιλογής σε ΓΛΩΣΣΑ.',
    duration: '65 λεπτά',
    level: 'Easy',
    category: 'Εντολές Επιλογής',
    thumbnail: '/images/3.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 645,
    locked: false,
  },
  {
    id: 8,
    title: 'Μάθημα 8ο - Πολλαπλή Επίλεξε',
    description: 'Σύνταξη, Λειτουργία και Παραδείγματα της ΕΠΙΛΕΞΕ σε ΓΛΩΣΣΑ.',
    duration: '65 λεπτά',
    level: 'Easy',
    category: 'Εντολές Επιλογής',
    thumbnail: '/images/4.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 645,
    locked: false,
  },
  {
    id: 9,
    title: 'Μάθημα 9ο - Εμφωλευμένη Δομή επιλογής',
    description: 'Παραδείγματα, Μετατροπές και Μεθοδολογίες Εμφωλευμένης Δομής Επιλογής σε ΓΛΩΣΣΑ.',
    duration: '65 λεπτά',
    level: 'Easy',
    category: 'Εντολές Επιλογής',
    thumbnail: '/images/1.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 645,
    locked: false,
  },
  // ═══════════════════════════════════════════════════════════════
  // 🔒 ΚΛΕΙΔΩΜΕΝΑ ΜΑΘΗΜΑΤΑ (PRO)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 10,
    title: 'Μάθημα 10ο - Εντολή Επανάληψης ΟΣΟ...ΕΠΑΝΑΛΑΒΕ',
    description: 'Σύνταξη, Λειτουργία και Παραδείγματα της Δομής Επανάληψης ΟΣΟ...ΕΠΑΝΑΛΑΒΕ.',
    duration: '75 λεπτά',
    level: 'Medium',
    category: 'Εντολές Επανάληψης',
    thumbnail: '/images/2.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 543,
    locked: true,
  },
  {
    id: 11,
    title: 'Μάθημα 11ο - Εντολή Επανάληψης ΜΕΧΡΙΣ_ΟΤΟΥ',
    description: 'Σύνταξη, Λειτουργία και Παραδείγματα της Δομής Επανάληψης ΜΕΧΡΙΣ_ΟΤΟΥ.',
    duration: '70 λεπτά',
    level: 'Medium',
    category: 'Εντολές Επανάληψης',
    thumbnail: '/images/3.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 489,
    locked: true,
  },
  {
    id: 12,
    title: 'Μάθημα 12ο - Εντολή Επανάληψης ΓΙΑ...ΑΠΟ...ΜΕΧΡΙ',
    description: 'Σύνταξη, Λειτουργία και Παραδείγματα της Δομής Επανάληψης ΓΙΑ...ΑΠΟ...ΜΕΧΡΙ.',
    duration: '80 λεπτά',
    level: 'Medium',
    category: 'Εντολές Επανάληψης',
    thumbnail: '/images/4.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 612,
    locked: true,
  },
  {
    id: 13,
    title: 'Μάθημα 13ο - Πίνακες: Μονοδιάστατοι',
    description: 'Δήλωση, Δημιουργία και Χειρισμός Μονοδιάστατων Πινάκων σε ΓΛΩΣΣΑ.',
    duration: '90 λεπτά',
    level: 'Medium',
    category: 'Πίνακες',
    thumbnail: '/images/1.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 728,
    locked: true,
  },
  {
    id: 14,
    title: 'Μάθημα 14ο - Πίνακες: Δισδιάστατοι',
    description: 'Δήλωση, Δημιουργία και Χειρισμός Δισδιάστατων Πινάκων σε ΓΛΩΣΣΑ.',
    duration: '95 λεπτά',
    level: 'Hard',
    category: 'Πίνακες',
    thumbnail: '/images/2.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 654,
    locked: true,
  },
  {
    id: 15,
    title: 'Μάθημα 15ο - Υποπρογράμματα: Διαδικασίες',
    description: 'Δήλωση, Κλήση και Χρήση Διαδικασιών στη ΓΛΩΣΣΑ.',
    duration: '85 λεπτά',
    level: 'Hard',
    category: 'Υποπρογράμματα',
    thumbnail: '/images/3.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 571,
    locked: true,
  },
  {
    id: 16,
    title: 'Μάθημα 16ο - Υποπρογράμματα: Συναρτήσεις',
    description: 'Δήλωση, Κλήση και Χρήση Συναρτήσεων στη ΓΛΩΣΣΑ.',
    duration: '90 λεπτά',
    level: 'Hard',
    category: 'Υποπρογράμματα',
    thumbnail: '/images/4.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 598,
    locked: true,
  },
  {
    id: 17,
    title: 'Μάθημα 17ο - Αναδρομή',
    description: 'Η έννοια της Αναδρομής και Αναδρομικά Υποπρογράμματα.',
    duration: '100 λεπτά',
    level: 'Hard',
    category: 'Προχωρημένα',
    thumbnail: '/images/1.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 432,
    locked: true,
  },
  {
    id: 18,
    title: 'Μάθημα 18ο - Αρχεία: Ανάγνωση και Εγγραφή',
    description: 'Δημιουργία, Ανάγνωση και Εγγραφή Αρχείων σε ΓΛΩΣΣΑ.',
    duration: '85 λεπτά',
    level: 'Hard',
    category: 'Αρχεία',
    thumbnail: '/images/2.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Ελένη Ζαφείρη',
    views: 387,
    locked: true,
  },
];

// ═══════════════════════════════════════════════════════════════
// 🔒 UPGRADE MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════

const UpgradeModal = ({ isOpen, onClose }) => {
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
            <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                className="inline-block mb-4"
                animate={{ rotate: [0, 10, -10, 10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span className="text-6xl">🔓</span>
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-3">
                Ξεκλείδωσε όλα τα μαθήματα!
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Αποκτήστε πρόσβαση σε περισσότερα από 18 μαθήματα και βοηθήματα
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Basic Plan */}
              <motion.div
                className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700"
                whileHover={{ scale: 1.02 }}
              >
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Basic</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-gray-900 dark:text-white">€0</span>
                    <span className="text-gray-600 dark:text-gray-400">/μήνα</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">9 δωρεάν μαθήματα</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Βασικό υλικό</span>
                  </li>
                </ul>
                <button className="w-full py-3 px-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Τρέχον Πλάνο
                </button>
              </motion.div>

              {/* Pro Plan */}
              <motion.div
                className="relative bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 text-white shadow-xl"
                whileHover={{ scale: 1.05 }}
              >
                <div className="absolute -top-3 -right-3 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                  🔥 Δημοφιλές
                </div>
                <div className="mb-4">
                  <h3 className="text-2xl font-bold mb-2">Pro</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black">€11.99</span>
                    <span className="text-pink-100">/μήνα</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-yellow-300 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">18+ μαθήματα (όλα ξεκλειδωμένα)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-yellow-300 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Προχωρημένα θέματα</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-yellow-300 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Αποκλειστικό υλικό</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-yellow-300 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Ασκήσεις & λυμένα παραδείγματα</span>
                  </li>
                </ul>
                <button className="w-full py-3 px-4 rounded-xl bg-white text-pink-600 font-bold hover:bg-pink-50 transition-colors shadow-lg">
                  Αναβάθμιση σε Pro 🚀
                </button>
              </motion.div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-pink-50 dark:bg-gray-800 rounded-xl">
                <div className="text-3xl mb-2">📚</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">18+ Μαθήματα</div>
              </div>
              <div className="p-4 bg-pink-50 dark:bg-gray-800 rounded-xl">
                <div className="text-3xl mb-2">⏱️</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">15+ Ώρες</div>
              </div>
              <div className="p-4 bg-pink-50 dark:bg-gray-800 rounded-xl">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">100% Κάλυψη</div>
              </div>
              <div className="p-4 bg-pink-50 dark:bg-gray-800 rounded-xl">
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">Επιτυχία 20/20</div>
              </div>
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

const VideoModal = ({ lesson, isOpen, onClose }) => {
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
              <video className="absolute inset-0 w-full h-full" controls autoPlay src={lesson.videoUrl} />
            )}
          </div>

          <div className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-gray-800 dark:to-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{lesson.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{lesson.description}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {lesson.duration}
              </span>
              <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                {lesson.views} προβολές
              </span>
              <span className="px-3 py-1 rounded-full bg-pink-500 text-white text-xs font-semibold">
                {lesson.level}
              </span>
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

const LessonCard = ({ lesson, onClick, index }) => {
  const isLocked = lesson.locked;

  return (
    <motion.div
      className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-pink-200 to-rose-200">
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
                <svg className="w-16 h-16 text-yellow-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
              <span className="text-white font-bold text-sm">Κλειδωμένο</span>
              <div className="mt-2 px-3 py-1 bg-pink-500 rounded-full text-white text-xs font-semibold inline-block">
                Pro 💎
              </div>
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

        {/* Duration Badge */}
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 text-white text-xs font-semibold backdrop-blur-sm">
          {lesson.duration}
        </div>

        {/* Level Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-pink-500 text-white text-xs font-semibold">
          {lesson.level}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="text-xs font-semibold text-pink-600 dark:text-pink-400 mb-2">
          {lesson.category}
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
          {lesson.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {lesson.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-xs font-bold">
              {lesson.instructor.charAt(0)}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">{lesson.instructor}</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            {lesson.views}
          </div>
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

const OnlinePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('Όλα');
  const [selectedCategory, setSelectedCategory] = useState('Όλες');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

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

  const handleCardClick = (lesson) => {
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
            Καταγεγραμμένα μαθήματα Πληροφορικής για τις Πανελλήνιες - Όλα όσα πρέπει να ξέρεις για να γράψεις 20!
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
              <div className="text-sm text-pink-100">Δωρεάν 🎁</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4">
              <div className="text-3xl font-black">{lockedLessons}</div>
              <div className="text-sm text-pink-100">Pro Μαθήματα 💎</div>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
            Βρέθηκαν <span className="font-bold text-pink-600">{filteredLessons.length}</span> μαθήματα
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