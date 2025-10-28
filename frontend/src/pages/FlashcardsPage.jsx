import React from 'react';
import Flashcards from '../components/Flashcards.jsx';

const FlashcardsPage = () => {
  return (
    <div className="min-h-screen bg-[#fff2f2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-md rounded-xl shadow-md p-8 sm:p-10">
        {/* Flashcards Component */}
        <Flashcards />
      </div>
      
    </div>
    
  );
};

export default FlashcardsPage;
