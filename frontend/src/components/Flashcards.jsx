import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlashcardArray } from 'react-quizlet-flashcard';
import { ArrowLeft, BookOpen, Zap } from 'lucide-react';

const BACKEND_URL = 'http://localhost:8001';
const BRAND = '#fda8a9';
const BRAND_DARK = '#f88b8c';

const Flashcards = () => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSetIndex, setSelectedSetIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlashcardData();
  }, []);

  const fetchFlashcardData = async () => {
    setLoading(true);
    try {
      const categoriesResponse = await fetch(`${BACKEND_URL}/api/categories`);
      const categoriesData = await categoriesResponse.json();

      const flashcardsResponse = await fetch(`${BACKEND_URL}/api/flashcards`);
      const flashcardsData = await flashcardsResponse.json();

      const flashcards = flashcardsData.flashcards || [];
      const categories = categoriesData.flashcard_categories || [];

      const sets = categories.map((category) => {
        const categoryCards = flashcards.filter((card) => card.category === category);
        return {
          id: category.toLowerCase().replace(/\s+/g, '-'),
          title: category,
          questions: categoryCards.map((card) => ({
            id: card.id,
            front: card.question,
            back: card.answer,
          })),
        };
      });

      setFlashcardSets(sets);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedCards =
    selectedSetIndex !== null && flashcardSets[selectedSetIndex]
      ? flashcardSets[selectedSetIndex].questions.map((card, idx) => ({
          id: card.id || idx + 1,
          frontHTML: (
            <div className="flex h-full items-center justify-center text-center text-xl font-semibold p-6">
              {card.front}
            </div>
          ),
          backHTML: (
            <div className="flex h-full items-center justify-center text-center text-xl p-6">
              {card.back}
            </div>
          ),
        }))
      : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div
            className="w-16 h-16 rounded-full border-4 border-t-transparent mb-4"
            style={{ borderColor: BRAND }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-gray-600 font-semibold">Φόρτωση Flashcards...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            ⚡ Flashcards
          </h1>
          <p className="text-gray-600 text-lg">Επίλεξε κατηγορία και ξεκίνα την εξάσκηση!</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Category Selection */}
          {selectedSetIndex === null ? (
            <motion.div
              key="categories"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {flashcardSets.map((set, index) => (
                <motion.button
                  key={set.id}
                  onClick={() => setSelectedSetIndex(index)}
                  className="group relative p-4 rounded-2xl bg-white border-2 border-pink-200 hover:border-pink-400 hover:shadow-2xl transition-all text-left overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -6, scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center group-hover:from-pink-200 group-hover:to-rose-200 transition-all">
                      <BookOpen className="w-6 h-6 text-pink-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm text-gray-800 group-hover:text-pink-600 transition-colors">
                        {set.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{set.questions.length} κάρτες</span>
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-pink-100 to-rose-100">
                      <Zap className="w-4 h-4 text-pink-600" />
                      <span className="font-bold text-pink-600">Start</span>
                    </div>
                  </div>

                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              ))}
            </motion.div>
          ) : (
            /* Flashcard View */
            <motion.div
              key="flashcards"
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.button
                onClick={() => setSelectedSetIndex(null)}
                className="mb-6 flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-white border-2 border-pink-300 text-gray-800 hover:border-pink-400 shadow-lg"
                whileHover={{ scale: 1.05, x: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
                Πίσω
              </motion.button>

              <motion.div
                className="bg-white rounded-3xl p-8 shadow-2xl mb-8"
                style={{ border: `3px solid ${BRAND}` }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-800">
                      {flashcardSets[selectedSetIndex]?.title}
                    </h2>
                    <p className="text-gray-500 text-sm">{selectedCards.length} κάρτες</p>
                  </div>
                </div>

                {selectedCards.length > 0 ? (
                  <div className="flex justify-center">
                    <FlashcardArray
                      cards={selectedCards}
                      style={{
                        width: 500,
                        height: 350,
                        border: `3px solid ${BRAND}`,
                        borderRadius: '1.5rem',
                        background: '#fff',
                        boxShadow: '0 10px 40px rgba(253, 168, 169, 0.2)',
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-12">
                    Δεν υπάρχουν διαθέσιμα flashcards.
                  </p>
                )}
              </motion.div>

              <motion.div
                className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 max-w-md"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-center text-gray-600">
                  💡 <strong>Tip:</strong> Κάνε κλικ στην κάρτα για να τη γυρίσεις!
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Flashcards;
