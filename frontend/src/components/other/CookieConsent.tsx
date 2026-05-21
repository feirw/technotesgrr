import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie } from 'lucide-react';
import { hasCookieConsent, setCookieConsent } from '@/utils/cookieConsent';

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasCookieConsent()) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    setCookieConsent('accepted');
    setVisible(false);
  };

  const essentialOnly = () => {
    setCookieConsent('essential');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-desc"
          aria-live="polite"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed z-[80] left-3 right-3 sm:left-4 sm:right-4 bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] sm:bottom-4 max-w-3xl mx-auto pointer-events-auto"
        >
          <div className="rounded-2xl border border-[#ff8f8e]/40 dark:border-[#ff6b7a]/35 bg-white/95 dark:bg-[#17233a]/95 backdrop-blur-xl shadow-[0_20px_50px_-12px_rgba(255,107,122,0.35)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div
                className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center bg-[#fff5f4] border border-[#ff8f8e]/35 text-[#ff6b7a] dark:bg-[#2a1815]/55 dark:border-[#ff6b7a]/35 dark:text-[#ffb0a4]"
                aria-hidden
              >
                <Cookie className="w-6 h-6" />
              </div>

              <div className="flex-1 min-w-0">
                <h2
                  id="cookie-consent-title"
                  className="text-base sm:text-lg font-bold text-gray-900 dark:text-white"
                >
                  Cookies & τοπική αποθήκευση
                </h2>
                <p
                  id="cookie-consent-desc"
                  className="mt-1.5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed"
                >
                  Χρησιμοποιούμε τοπική αποθήκευση (π.χ. localStorage) για προτιμήσεις, πρόοδο
                  μελέτης και τη λειτουργία της πλατφόρμας. Δεν χρησιμοποιούμε διαφημιστικά
                  cookies.{' '}
                  <Link
                    to="/privacy-policy"
                    className="font-semibold text-[#ff6b7a] dark:text-[#ffb0a4] underline underline-offset-2 hover:opacity-90"
                  >
                    Πολιτική Απορρήτου
                  </Link>
                </p>

                <div className="mt-4 flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={accept}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#ff6b7a] hover:bg-[#e85563] text-white font-bold text-sm shadow-md transition-colors"
                  >
                    Αποδοχή
                  </button>
                  <button
                    type="button"
                    onClick={essentialOnly}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#ff8f8e]/45 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-100 font-semibold text-sm hover:bg-[#fff5f4] dark:hover:bg-gray-700/80 transition-colors"
                  >
                    Μόνο απαραίτητα
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
