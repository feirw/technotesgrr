import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 text-center">
      <div className="text-9xl mb-4">🤔</div>
      <p className="text-6xl font-black text-gray-900 dark:text-white mb-2" aria-hidden="true">
        404
      </p>
      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2">
        Η σελίδα δεν βρέθηκε
      </h1>
      <p className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-6">
        Δεν υπάρχει αυτή η σελίδα στο Technotes
      </p>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
        Η σελίδα που ψάχνεις ίσως έχει μετακινηθεί ή διαγραφεί.
      </p>

      <Link
        to="/"
        className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-transform hover:-translate-y-1"
      >
        <Home className="w-5 h-5" />
        Επιστροφή στην Αρχική
      </Link>
    </div>
  );
};

export default NotFound;
