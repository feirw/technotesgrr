import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#fff2f2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg p-8 sm:p-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-8">
            Σχετικά με εμάς 🎓
          </h1>

          <div className="prose max-w-none prose-p:text-gray-700 prose-li:text-gray-700">
            <p className="text-lg">
              Καλώς ήρθατε στο <strong>technotesgr</strong>! Είμαι φοιτήτρια του Τμήματος
              Πληροφορικής και Τηλεπικοινωνιών (ΕΚΠΑ), με στόχο να βοηθήσω τους μαθητές της Γ'
              Λυκείου να επιτύχουν στις Πανελλαδικές εξετάσεις Πληροφορικής.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8">🎯 Ο σκοπός μας</h2>
            <p>
              Να προσφέρουμε ποιοτικό υλικό και σύγχρονα εργαλεία ώστε οι μαθητές να κατανοήσουν την
              Πληροφορική εις βάθος και να είναι πλήρως προετοιμασμένοι για τις εξετάσεις.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8">📚 Τι προσφέρουμε</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Ολοκληρωμένες σημειώσεις εφ’ όλης της ύλης</li>
              <li>Quiz με ερωτήσεις από παλιές Πανελλαδικές</li>
              <li>Flashcards για γρήγορη επανάληψη θεωρίας</li>
              <li>
                Διαδραστικά παιχνίδια οπτικοποίησης αλγορίθμων όπως:
                <ul className="list-disc list-inside pl-5">
                  <li>Δυαδική και Γραμμική Αναζήτηση</li>
                  <li>Δέντρα, Λίστες, Γράφοι</li>
                </ul>
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8">📬 Επικοινωνία</h2>
            <p>Μπορείτε να επικοινωνήσετε ή να ακολουθήσετε το project στα παρακάτω social:</p>
            <div className="mt-4 space-y-2">
              <a
                href="https://www.instagram.com/technotesgr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ff7b7b] hover:underline hover:text-[#ff4d4d] font-medium"
              >
                👉 Instagram: @technotesgr
              </a>
              <br />
              <a
                href="https://www.tiktok.com/@technotesgr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ff7b7b] hover:underline hover:text-[#ff4d4d] font-medium"
              >
                👉 TikTok: @technotesgr
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
