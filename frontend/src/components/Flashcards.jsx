import React, { useState, useEffect } from 'react';
import { FlashcardArray } from 'react-quizlet-flashcard';

const BACKEND_URL = 'http://localhost:8001';
const BRAND = '#fda8a9';
const BRAND_DARK = '#f88b8c';
const BRAND_LIGHT = '#ffe6e6';

const Flashcards = () => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSetIndex, setSelectedSetIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      console.error('Error fetching flashcard data:', err);
      setError('Σφάλμα κατά τη φόρτωση των flashcards');
    } finally {
      setLoading(false);
    }
  };

  const selectedCards =
    selectedSetIndex !== null && flashcardSets[selectedSetIndex]
      ? flashcardSets[selectedSetIndex].questions.map((card, idx) => ({
          id: card.id || idx + 1,
          frontHTML: (
            <div className="flex h-full items-center justify-center text-center text-xl font-semibold p-4">
              {card.front}
            </div>
          ),
          backHTML: (
            <div className="flex h-full items-center justify-center text-center text-xl p-4">
              {card.back}
            </div>
          ),
        }))
      : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4"
          style={{ borderColor: BRAND }}
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-600">
        <p>{error}</p>
        <button
          onClick={fetchFlashcardData}
          className="mt-4 px-4 py-2 rounded-lg text-white font-semibold shadow"
          style={{ background: BRAND }}
        >
          Προσπαθήστε ξανά
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      {/* Επιλογή κατηγορίας */}
      {selectedSetIndex === null && (
        <div className="flex flex-wrap gap-4 justify-center">
          {flashcardSets.map((set, index) => (
            <button
              key={set.id}
              onClick={() => setSelectedSetIndex(index)}
              className="px-6 py-3 rounded-full text-lg font-semibold shadow transition-all"
              style={{
                background: BRAND_LIGHT,
                color: BRAND_DARK,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = BRAND)}
              onMouseLeave={(e) => (e.currentTarget.style.background = BRAND_LIGHT)}
            >
              {set.title}
              <span className="ml-2 text-sm opacity-80">
                ({set.questions.length})
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Flashcards */}
      {selectedSetIndex !== null && (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setSelectedSetIndex(null)}
            className="px-5 py-2 rounded-full text-base font-medium shadow"
            style={{
              background: BRAND_LIGHT,
              color: BRAND_DARK,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = BRAND)}
            onMouseLeave={(e) => (e.currentTarget.style.background = BRAND_LIGHT)}
          >
            🔙 Πίσω στις ενότητες
          </button>

          <h2 className="text-2xl font-bold mb-4" style={{ color: BRAND_DARK }}>
            {flashcardSets[selectedSetIndex]?.title}
          </h2>

          <div className="w-full max-w-xl">
            {selectedCards.length > 0 ? (
              <FlashcardArray
                cards={selectedCards}
                style={{
                  width: 400,
                  height: 300,
                  border: `3px solid ${BRAND_LIGHT}`,
                  borderRadius: '1rem',
                  background: '#fff',
                }}
              />
            ) : (
              <p className="text-gray-500 text-center text-lg mt-4">
                Δεν υπάρχουν διαθέσιμα flashcards για αυτήν την κατηγορία.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcards;
