import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ═══════════════════════════════════════════════════════════════
 * 📚 ONLINE LESSONS PAGE - technotesgr
 * ═══════════════════════════════════════════════════════════════
 * 
 * Σελίδα καταλόγου καταγεγραμμένων μαθημάτων Πληροφορικής
 * 
 * Features:
 * - Grid layout με animated cards
 * - Search & filter functionality
 * - Modal video player (YouTube/mp4)
 * - Hover effects & animations
 * - Fully responsive
 * - Easy to extend
 * 
 * ═══════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════
// 📊 ΔΕΔΟΜΕΝΑ ΜΑΘΗΜΑΤΩΝ
// ═══════════════════════════════════════════════════════════════
// Πρόσθεσε/Αφαίρεσε μαθήματα εδώ!

const LESSONS = [
  {
    id: 1,
    title: 'Μάθημα 1ο - Η έννοια του',
    description: 'Μάθε τα βασικά των αλγορίθμων και της υπολογιστικής σκέψης. Ιδανικό για αρχάριους!',
    duration: '45 λεπτά',
    level: 'Αρχάριος',
    category: 'Αλγόριθμοι',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // YouTube embed URL
    videoType: 'youtube', // 'youtube' ή 'mp4'
    instructor: 'Eλένη Ζαφείρη',
    views: 1250,
  },
  {
    id: 2,
    title: 'Δομές Δεδομένων - Πίνακες',
    description: 'Κατανόησε πώς λειτουργούν οι πίνακες και πώς να τους χρησιμοποιείς αποτελεσματικά.',
    duration: '60 λεπτά',
    level: 'Μεσαίος',
    category: 'Δομές Δεδομένων',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Καθηγητής Β',
    views: 980,
  },
  {
    id: 3,
    title: 'Αναδρομή και Backtracking',
    description: 'Εξερεύνησε προχωρημένες τεχνικές επίλυσης προβλημάτων με αναδρομή.',
    duration: '55 λεπτά',
    level: 'Προχωρημένος',
    category: 'Αλγόριθμοι',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Καθηγητής Γ',
    views: 756,
  },
  {
    id: 4,
    title: 'Γράφοι - Βασικές Έννοιες',
    description: 'Μάθε τα πάντα για τους γράφους: κόμβοι, ακμές, αναπαραστάσεις και αλγόριθμοι.',
    duration: '70 λεπτά',
    level: 'Μεσαίος',
    category: 'Γράφοι',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Καθηγητής Α',
    views: 1100,
  },
  {
    id: 5,
    title: 'Ταξινόμηση - Bubble & Quick Sort',
    description: 'Σύγκριση αλγορίθμων ταξινόμησης με πρακτικά παραδείγματα και οπτικοποιήσεις.',
    duration: '50 λεπτά',
    level: 'Αρχάριος',
    category: 'Αλγόριθμοι',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Καθηγητής Β',
    views: 890,
  },
  {
    id: 6,
    title: 'Δυναμικός Προγραμματισμός',
    description: 'Προχωρημένη τεχνική βελτιστοποίησης για την επίλυση σύνθετων προβλημάτων.',
    duration: '65 λεπτά',
    level: 'Προχωρημένος',
    category: 'Αλγόριθμοι',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    instructor: 'Καθηγητής Γ',
    views: 645,
  },
];

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
        {/* Modal Container */}
        <motion.div
          className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg"
            aria-label="Κλείσιμο"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Video Container */}
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

          {/* Lesson Info */}
          <div className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-gray-800 dark:to-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {lesson.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {lesson.description}
            </p>
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
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Play Overlay */}
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
        {/* Category */}
        <div className="text-xs font-semibold text-pink-600 dark:text-pink-400 mb-2">
          {lesson.category}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
          {lesson.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {lesson.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          {/* Instructor */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-xs font-bold">
              {lesson.instructor.charAt(0)}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {lesson.instructor}
            </span>
          </div>

          {/* Views */}
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            {lesson.views}
          </div>
        </div>
      </div>

      {/* Hover Gradient Border Effect */}
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

  // ═══════════════════════════════════════════════════════════════
  // 🔍 FILTERING LOGIC
  // ═══════════════════════════════════════════════════════════════

  // Get unique levels and categories
  const levels = ['Όλα', ...new Set(LESSONS.map(l => l.level))];
  const categories = ['Όλες', ...new Set(LESSONS.map(l => l.category))];

  // Filter lessons
  const filteredLessons = useMemo(() => {
    return LESSONS.filter(lesson => {
      const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = selectedLevel === 'Όλα' || lesson.level === selectedLevel;
      const matchesCategory = selectedCategory === 'Όλες' || lesson.category === selectedCategory;
      
      return matchesSearch && matchesLevel && matchesCategory;
    });
  }, [searchQuery, selectedLevel, selectedCategory]);

  // ═══════════════════════════════════════════════════════════════
  // 🎬 HANDLERS
  // ═══════════════════════════════════════════════════════════════

  const handleCardClick = (lesson) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedLesson(null), 300); // Wait for animation
  };

  // ═══════════════════════════════════════════════════════════════
  // 🎨 RENDER
  // ═══════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white py-16 px-6">
        {/* Animated Background Circles */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <motion.div
            className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute -bottom-24 -right-24 w-96 h-96 bg-white rounded-full"
            animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
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
            Καταγεγραμμένα μαθήματα Πληροφορικής για τις Πανελλήνιες
          </motion.p>

          {/* Stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div>
              <div className="text-4xl font-bold">{LESSONS.length}</div>
              <div className="text-pink-100">Μαθήματα</div>
            </div>
            <div>
              <div className="text-4xl font-bold">
                {LESSONS.reduce((sum, l) => sum + l.views, 0)}
              </div>
              <div className="text-pink-100">Προβολές</div>
            </div>
            <div>
              <div className="text-4xl font-bold">
                {Math.floor(LESSONS.reduce((sum, l) => sum + parseInt(l.duration), 0) / 60)}h
              </div>
              <div className="text-pink-100">Περιεχόμενο</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg border-b border-pink-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
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

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Βρέθηκαν <span className="font-bold text-pink-600">{filteredLessons.length}</span> μαθήματα
          </div>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {filteredLessons.length === 0 ? (
          // Empty State
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
          // Lessons Grid
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

      {/* Video Modal */}
      <VideoModal
        lesson={selectedLesson}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default OnlinePage;