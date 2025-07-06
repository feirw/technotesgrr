import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-pink-50 py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
            Σχετικά με εμάς
          </h1>

          {/* 
            Η κλάση 'prose' πιθανόν να προέρχεται από το plugin 'tailwindcss/typography'.
            Βοηθάει στη γρήγορη και όμορφη μορφοποίηση κειμένου όπως άρθρα, χωρίς
            να χρειάζεται να βάζεις κλάσεις σε κάθε παράγραφο, λίστα κ.λπ.
          */}
          <div className="prose max-w-none">
            <p className="text-base sm:text-lg text-gray-700 mb-6">
              Καλώς ήρθατε στο technotesgr! Είμαι μία καθηγήτρια πληροφορικής που στοχεύει να
              βοηθήσει τους μαθητές της Γ' Λυκείου να επιτύχουν στις Πανελλαδικές εξετάσεις
              Πληροφορικής.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Ο σκοπός μας</h2>
            <p className="text-gray-700 mb-6">
              Να παρέχουμε ποιοτικό εκπαιδευτικό υλικό και διαδραστικές δραστηριότητες που θα
              βοηθήσουν τους μαθητές να κατανοήσουν σε βάθος την πληροφορική και να προετοιμαστούν
              αποτελεσματικά για τις εξετάσεις τους.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Τι προσφέρουμε</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Ολοκληρωμένες σημειώσεις εφ'όλης της ύλης</li>
              <li>Quiz με ερωτήσεις από παλιές πανελλαδικές εξετάσεις</li>
              <li>Flashcards για εύκολη επανάληψη εννοιών από την θεωρία μας</li>
              <li>
                Παιχνίδια οπτικοποίησης αλγορίθμων (δυαδική αναζήτηση, γραμμική
                αναζήτηση,δέντρα,λίστες,γράφοι)
              </li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              Στοιχεία Επικοινωνίας
            </h2>
            <div className="space-y-2 text-gray-700">
              <p> Instagram: @technotesgr</p>
              <p> TikTok: @technotesgr</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
