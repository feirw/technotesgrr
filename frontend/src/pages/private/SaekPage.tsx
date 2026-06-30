import React from 'react';
import { ExternalLink } from 'lucide-react';
import { MenuIconImg, SCHOOL_PAGE_NOTICE_ICONS } from '@/data/menuIcons';

const DYPA_SAEK_URL = 'https://schools.dypa.gov.gr/schools-cat/saek/page/2/#sxoles-feed';

const cardClass =
  'bg-white/90 dark:bg-[#3a2658]/90 backdrop-blur-md rounded-2xl border border-[#f07f97]/25 dark:border-white/10';

const HIGHLIGHTS: { title: string; text: string }[] = [
  {
    title: 'Δωρεάν σπουδές',
    text: 'Η φοίτηση στις ΣΑΕΚ της ΔΥΠΑ είναι δωρεάν και απευθύνεται σε απόφοιτους Λυκείου.',
  },
  {
    title: 'Ειδικότητες αιχμής',
    text: 'Σύγχρονες ειδικότητες με ζήτηση στην αγορά εργασίας, σε πολλούς κλάδους.',
  },
  {
    title: 'Πρακτική άσκηση',
    text: 'Το πρόγραμμα συνδυάζει θεωρητική κατάρτιση με πρακτική εξάσκηση σε επιχειρήσεις.',
  },
];

const SaekPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#ff97b2] dark:bg-[#2d1c48] text-gray-900 dark:text-gray-100 transition-colors duration-500 pb-16">
      <header className="border-b border-[#f07f97]/35 dark:border-white/10 bg-white/90 dark:bg-[#3a2658]/90 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12 text-center">
          <div className="flex justify-center mb-3">
            <MenuIconImg src={SCHOOL_PAGE_NOTICE_ICONS.saek} className="h-16 w-16 sm:h-20 sm:w-20" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#f07f97] dark:text-[#ff97b2] tracking-tight">
            ΣΑΕΚ
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Σχολές Ανώτερης Επαγγελματικής Κατάρτισης (ΔΥΠΑ) — δωρεάν σπουδές με ειδικότητες αιχμής.
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
        <section className={`${cardClass} px-5 sm:px-6 py-5 sm:py-6`}>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 leading-relaxed">
            Οι <strong>ΣΑΕΚ</strong> (Σχολές Ανώτερης Επαγγελματικής Κατάρτισης) λειτουργούν υπό τη
            ΔΥΠΑ και προσφέρουν δωρεάν επαγγελματική κατάρτιση σε ένα ευρύ φάσμα ειδικοτήτων. Αποτελούν
            μια εναλλακτική ή συμπληρωματική επιλογή σπουδών, με έμφαση στην πρακτική εξάσκηση και τη
            σύνδεση με την αγορά εργασίας.
          </p>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          {HIGHLIGHTS.map((item) => (
            <div key={item.title} className={`${cardClass} px-4 py-4`}>
              <p className="text-[13px] sm:text-sm font-black text-[#f07f97] dark:text-[#ff97b2] mb-1">
                {item.title}
              </p>
              <p className="text-[13px] sm:text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </section>

        <section className={`${cardClass} px-5 sm:px-6 py-6 text-center`}>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 leading-relaxed mb-4">
            Δες όλες τις σχολές και τις ειδικότητες ΣΑΕΚ στην επίσημη σελίδα της ΔΥΠΑ.
          </p>
          <a
            href={DYPA_SAEK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#f07f97] hover:bg-[#e76a85] text-white font-bold text-sm sm:text-base px-5 py-3 transition-colors"
          >
            Δες όλες τις σχολές ΣΑΕΚ
            <ExternalLink className="w-4 h-4" aria-hidden />
          </a>
        </section>
      </main>
    </div>
  );
};

export default SaekPage;
