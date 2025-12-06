import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const NotAuthorized: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    // If user is admin, maybe go to admin dashboard, otherwise profile or home
    if (isAdmin) {
      navigate('/admin');
    } else if (user) {
      navigate('/profile');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border-2 border-pink-100 dark:border-gray-700 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-6"
        >
          <ShieldAlert className="h-10 w-10 text-red-600 dark:text-red-400" />
        </motion.div>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-3">
          Απαγορεύεται η Πρόσβαση
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          Δεν έχετε τα απαραίτητα δικαιώματα για να δείτε αυτή τη σελίδα. Αν πιστεύετε ότι πρόκειται
          για λάθος, επικοινωνήστε με τη διαχείριση.
        </p>

        <div className="flex flex-col gap-3">
          <motion.button
            onClick={handleGoHome}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Επιστροφή στην Αρχική
          </motion.button>

          <motion.button
            onClick={handleGoBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-white font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Πίσω
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotAuthorized;
