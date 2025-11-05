// μόλις ανοίξει η επιχείρηση

<motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-4xl bg-gradient-to-br from-white to-pink-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl shadow-2xl overflow-hidden"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Κλείσιμο"
          >
            <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                className="inline-block mb-4"
                animate={{ rotate: [0, 10, -10, 10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span className="text-6xl">🔓</span>
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-3">
                Ξεκλείδωσε όλα τα μαθήματα!
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Αποκτήστε πρόσβαση σε περισσότερα από 50 μαθήματα 
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Basic Plan */}
              <motion.div
                className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700"
                whileHover={{ scale: 1.02 }}
              >
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Basic</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-gray-900 dark:text-white">€0</span>
                    <span className="text-gray-600 dark:text-gray-400">/μήνα</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">9 δωρεάν μαθήματα</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Βασικό υλικό</span>
                  </li>
                </ul>
                <button className="w-full py-3 px-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Τρέχον Πλάνο
                </button>
              </motion.div>

              {/* Pro Plan */}
              <motion.div
                className="relative bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 text-white shadow-xl"
                whileHover={{ scale: 1.05 }}
              >
                <div className="absolute -top-3 -right-3 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                  🔥 Δημοφιλές
                </div>
                <div className="mb-4">
                  <h3 className="text-2xl font-bold mb-2">Pro</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black">€50</span>
                    <span className="text-pink-100"></span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-yellow-300 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="">52 μαθήματα που καλύπτουν όλη την ύλη</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-yellow-300 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span> 24/7 Υποστήριξη , Διαδικτυακές Κλήσεις Για Επίλυση Αποριών</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-yellow-300 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span> Διόρθωση Όσων Ασκήσεων Θέλεις</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-yellow-300 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span> Επαγγελματικός Προσανατολισμός μέσω ερωτηματολογίου για να βρείς τις κλήσεις σου</span>
                  </li>
                </ul>
                <button className="w-full py-3 px-4 rounded-xl bg-white text-pink-600 font-bold hover:bg-pink-50 transition-colors shadow-lg">
                  Ξεκλείδωσε τις Pro Παροχές🚀
                </button>
              </motion.div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-pink-50 dark:bg-gray-800 rounded-xl">
                <div className="text-3xl mb-2">📚</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">50+ Μαθήματα</div>
              </div>
              <div className="p-4 bg-pink-50 dark:bg-gray-800 rounded-xl">
                <div className="text-3xl mb-2">⏱️</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">80+ Ώρες</div>
              </div>
              <div className="p-4 bg-pink-50 dark:bg-gray-800 rounded-xl">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">100% Κάλυψη της Ύλης</div>
              </div>
              <div className="p-4 bg-pink-50 dark:bg-gray-800 rounded-xl">
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">Σίγουρο 100άρι</div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>