import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Home, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ThankYouPage: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 bg-gradient-to-br from-coral-wash via-white to-coral-wash dark:from-[#2d1c48] dark:via-[#2d1c48] dark:to-[#1a1028]">
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-lg w-full text-center rounded-3xl border border-coral-accent/25 dark:border-white/10 bg-white/90 dark:bg-[#3a2658]/90 backdrop-blur-md p-8 sm:p-10 shadow-xl"
    >
      <CheckCircle className="w-16 h-16 mx-auto text-emerald-500 mb-4" aria-hidden />
      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-3">
        Ευχαριστούμε!
      </h1>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-2">
        Το μήνυμά σου καταχωρήθηκε επιτυχώς.
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        Θα σου απαντήσουμε εντός <strong className="font-semibold">48 ωρών</strong> (εργάσιμες).
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-coral-accent hover:bg-coral-strong text-white font-bold transition-colors"
        >
          <Home className="w-4 h-4" aria-hidden />
          Αρχική
        </Link>
        <Link
          to="/faq"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-coral-accent/40 text-coral-strong dark:text-coral-light font-bold hover:bg-coral-accent/10 transition-colors"
        >
          <HelpCircle className="w-4 h-4" aria-hidden />
          FAQ
        </Link>
      </div>
    </motion.div>
  </div>
);

export default ThankYouPage;
