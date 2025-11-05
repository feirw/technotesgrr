import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Printer,
  ExternalLink,
  Maximize,
  ClipboardList,
  ChevronRight,
} from 'lucide-react';

const BRAND = '#fda8a9';
const BRAND_DARK = '#f88b8c';

const Palia = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubExam, setSelectedSubExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const frameRef = useRef(null);

  // Κύριες Κατηγορίες - Όλες ροζ!
  const examCategories = [
    { id: 1, name: 'Δομή Ακολουθίας', color: '#ec4899' },
    { id: 2, name: 'Δομές Επιλογής', color: '#f43f5e' },
    { id: 3, name: 'Δομές Επανάληψης', color: '#fb7185' },
    { id: 4, name: 'Πίνακες', color: '#f472b6' },
    { id: 6, name: 'Υποπρογράμματα', color: '#db2777' },
    { id: 7, name: 'Μεταγλωττιστής', color: '#be185d' },
    { id: 8, name: 'Δυναμικές Δομές Δεδομένων', color: '#ec4899' },
    { id: 13, name: 'Αντικειμενοστραφής', color: '#c026d3' },
    { id: 14, name: 'Εκσφαλμάτωση', color: '#a21caf' },
    { id: 15, name: 'Όλη η ύλη', color: '#ec4899' },
  ];

  // Για κάθε κατηγορία, δημιουργούμε 15 διαγωνίσματα
  const getSubExamsForCategory = (categoryId) => {
    const category = examCategories.find((cat) => cat.id === categoryId);
    return Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      name: `Διαγώνισμα ${i + 1}`,
      pdfPath: `/pdfs/category/category${categoryId}_exam${i + 1}.pdf`,
      color: category?.color || '#ec4899',
    }));
  };

  const currentCategory = selectedCategory
    ? examCategories.find((cat) => cat.id === selectedCategory)
    : null;
  const currentSubExams = selectedCategory ? getSubExamsForCategory(selectedCategory) : [];
  
  const currentPdf = selectedSubExam
    ? currentSubExams.find((exam) => exam.id === selectedSubExam)
    : null;

  useEffect(() => {
    if (currentPdf?.pdfPath) {
      setLoading(true);
    }
  }, [currentPdf?.pdfPath]);

  const handleOpenNew = () => window.open(currentPdf.pdfPath, '_blank', 'noopener,noreferrer');

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = currentPdf.pdfPath;
    a.download = currentPdf.name || 'document.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handlePrint = () => {
    const w = window.open(currentPdf.pdfPath, '_blank', 'noopener,noreferrer');
    if (w) {
      setTimeout(() => {
        try {
          w.focus();
          w.print();
        } catch {}
      }, 800);
    }
  };

  const handleFullscreen = async () => {
    if (frameRef.current?.requestFullscreen) {
      await frameRef.current.requestFullscreen();
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubExam(null);
  };

  const handleSubExamClick = (examId) => {
    setSelectedSubExam(examId);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedSubExam(null);
  };

  const handleBackToSubExams = () => {
    setSelectedSubExam(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <ClipboardList className="w-10 h-10 text-white" />
            </motion.div>
            <div>
              <h1 className="text-5xl font-black tracking-tight text-gray-800">Διαγωνίσματα</h1>
              <p className="text-gray-600 text-lg mt-1">
                {!selectedCategory
                  ? ''
                  : selectedSubExam
                    ? currentCategory?.name
                    : `${currentCategory?.name} - Επιλέξτε διαγώνισμα`}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            // Κύριες Κατηγορίες View
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-2xl mx-auto bg-white/80 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-pink-100 dark:border-gray-700">
                <div className="mb-6 text-center">
                  <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                    DISCLAIMER
                  </h2>
                  <div className="w-20 h-1 bg-pink-500 mx-auto rounded-full mb-6"></div>
                </div>

                <div className="space-y-3 text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                  <p>📘 Τα διαγωνίσματα :</p>
                  <p>❗Καλύπτουν μέχρι και την ύλη που αναγράφεται σε κάθε κατηγορία.</p>
                  <p>
                    ❗ΔΕΝ είναι φτιαγμένα από το{' '}
                    <span className="font-semibold text-pink-600">technotesgr</span> αλλά από
                    αξιέπαινους συναδέλφους.
                  </p>
                  <p>
                    ❗Είναι ΉΔΗ αναρτημένα στο διαδίκτυο. Τα συγκεντρώσαμε ανά κεφάλαιο για τα
                    παιδιά που θέλουν να μελετούν και να λύνουν ασκήσεις μόνα τους!
                  </p>
                </div>
              </div>

              <div className="mb-8" />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {examCategories.map((category, index) => (
                  <motion.button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className="group relative overflow-hidden rounded-2xl p-3 text-white font-bold shadow-xl hover:shadow-2xl transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${category.color}, ${category.color}dd)`,
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -8 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                    <div className="relative flex flex-col items-center gap-3 text-center">
                      <div className="text-xl font-black leading-tight">{category.name}</div>
                      <ChevronRight className="w-6 h-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : !selectedSubExam ? (
            // Υπο-διαγωνίσματα View
            <motion.div
              key="subexams"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Breadcrumb */}
              <div className="mb-6">
                <motion.button
                  onClick={handleBackToCategories}
                  className="flex items-center gap-2 text-pink-600 hover:text-pink-800 font-bold text-lg bg-white px-6 py-3 rounded-xl shadow-lg"
                  whileHover={{ x: -5 }}
                >
                  <ChevronRight className="w-6 h-6 rotate-180" />
                  Επιστροφή στις Κατηγορίες
                </motion.button>
              </div>

              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">{currentCategory?.name}</h2>
                <p className="text-xl text-gray-600">Επιλέξτε διαγώνισμα</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {currentSubExams.map((exam, index) => (
                  <motion.button
                    key={exam.id}
                    onClick={() => handleSubExamClick(exam.id)}
                    className="group relative overflow-hidden rounded-2xl p-8 text-white font-bold text-xl shadow-lg hover:shadow-2xl transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${exam.color}, ${exam.color}dd)`,
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ scale: 1.08, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                    <div className="relative flex flex-col items-center gap-2">
                      <div className="text-3xl font-black">{exam.id}</div>
                      <ChevronRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            // Επιλεγμένο Διαγώνισμα View
            <motion.div
              key="selected-exam"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Breadcrumb */}
              <div className="mb-6">
                <motion.button
                  onClick={handleBackToSubExams}
                  className="flex items-center gap-2 text-pink-600 hover:text-pink-800 font-bold text-lg bg-white px-6 py-3 rounded-xl shadow-lg"
                  whileHover={{ x: -5 }}
                >
                  <ChevronRight className="w-6 h-6 rotate-180" />
                  Επιστροφή στα Διαγωνίσματα
                </motion.button>
                <div className="mt-3 text-base text-gray-600">
                  {currentCategory?.name} /{' '}
                  <span className="font-semibold">{currentPdf?.name}</span>
                </div>
              </div>

              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
                {loading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
                    <motion.div
                      className="w-20 h-20 rounded-full border-4 border-t-transparent mb-4"
                      style={{ borderColor: currentPdf?.color || BRAND }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <p className="text-gray-600 font-bold text-xl">Φόρτωση PDF...</p>
                  </div>
                )}

                <iframe
                  ref={frameRef}
                  src={currentPdf?.pdfPath}
                  title={currentPdf?.name}
                  width="100%"
                  height="720"
                  className="block rounded-2xl"
                  onLoad={() => setLoading(false)}
                  allow="fullscreen"
                />
              </div>

              {/* Actions για Διαγώνισμα */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.button
                  onClick={handleOpenNew}
                  className="flex items-center justify-center gap-3 px-6 py-5 rounded-xl font-bold text-lg text-white shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${currentPdf?.color}, ${currentPdf?.color}dd)`,
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ExternalLink className="w-6 h-6" />
                  <span className="hidden sm:inline">Νέο Παράθυρο</span>
                </motion.button>

                <motion.button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-3 px-6 py-5 rounded-xl font-bold text-lg bg-white border-3 border-pink-300 text-gray-800 hover:border-pink-400 shadow-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-6 h-6" />
                  <span className="hidden sm:inline">Λήψη</span>
                </motion.button>

                <motion.button
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-3 px-6 py-5 rounded-xl font-bold text-lg bg-white border-3 border-pink-300 text-gray-800 hover:border-pink-400 shadow-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Printer className="w-6 h-6" />
                  <span className="hidden sm:inline">Εκτύπωση</span>
                </motion.button>

                <motion.button
                  onClick={handleFullscreen}
                  className="flex items-center justify-center gap-3 px-6 py-5 rounded-xl font-bold text-lg bg-white border-3 border-pink-300 text-gray-800 hover:border-pink-400 shadow-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Maximize className="w-6 h-6" />
                  <span className="hidden sm:inline">Πλήρης</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Palia;
