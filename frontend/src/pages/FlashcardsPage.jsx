import React from 'react';
import Flashcards from '../components/Flashcards.jsx';

const FlashcardsPage = () => {
  return (
    <div className="min-h-screen bg-[#fff2f2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-md rounded-xl shadow-md p-8 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
            Flashcards Θεωρίας ΑΕΠΠ
        </h1>
        <p className="text-center text-gray-700 text-lg sm:text-xl mb-8">
          Κάνε επανάληψη στις βασικές έννοιες μέσα από διαδραστικές κάρτες.
        </p>

        {/* Flashcards Component */}
        <Flashcards />
      </div>
    </div>
  );
};

export default FlashcardsPage;
