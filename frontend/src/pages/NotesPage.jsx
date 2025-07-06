import React from 'react';
import Notes from '../components/Notes.jsx';

const NotesPage = () => {
  return (
    <div className="min-h-screen bg-pink-50 py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        <p className="text-lg sm:text-xl text-gray-700 mb-6 text-center font-semibold">
          Εδώ θα βρείτε σημειώσεις για την θεωρία του ΑΕΠΠ.
        </p>
        <Notes />
      </div>
    </div>
  );
};

export default NotesPage;
