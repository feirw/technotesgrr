import React from 'react';
import Flashcards from '../components/Flashcards.jsx';

const FlashcardsPage = () => {
  // Αυτή η σελίδα δεν χρειάζεται δική της κατάσταση (state) ή πολύπλοκη λογική.
  // Ο ρόλος της είναι να παρέχει τη γενική δομή της σελίδας (π.χ. background, τίτλος)
  // και να αποδίδει το component των Flashcards.

  return (
    <div className="min-h-screen bg-pink-50 py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        <p className="text-lg sm:text-xl text-gray-700 mb-6 text-center font-semibold">
          Εδώ θα βρείτε flashcards για να επαναλάβετε τις έννοιες της θεωρίας μας.
        </p>

        {/* 
          Το component <Flashcards /> είναι πλήρως αυτόνομο.
          Διαχειρίζεται μόνο του τη φόρτωση των δεδομένων, την επιλογή κατηγορίας
          και την εμφάνιση των καρτών.
        */}
        <Flashcards />
      </div>
    </div>
  );
};

export default FlashcardsPage;
