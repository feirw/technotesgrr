import React from 'react';
import { Calendar, ExternalLink, MapPin } from 'lucide-react';

const SUIHUB_URL = 'https://suihubathens.io/';
const LUMA_URL = 'https://luma.com/ot03om4c';

const CommunityPage: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-coral-wash via-white to-coral-wash dark:from-[#2d1c48] dark:via-[#2d1c48] dark:to-[#1a1028]">
    <header className="border-b border-[#f07f97]/35 dark:border-white/10 bg-white/90 dark:bg-[#3a2658]/90 backdrop-blur-md py-10 sm:py-12 px-4 sm:px-6">
      <div className="relative max-w-4xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-[#faf5ef] tracking-tight">
          Community
        </h1>
      </div>
    </header>

    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-16">
      <article className="overflow-hidden rounded-3xl border-2 border-[#f07f97]/25 dark:border-white/15 bg-white dark:bg-[#3a2658] shadow-xl">
        <div className="bg-white flex items-center justify-center px-6 sm:px-10 py-8 sm:py-12">
          <img
            src="/images/technotes-meetup.png"
            alt="Technotes Meetup — pixel καρδιά με σκούφο"
            width={490}
            height={119}
            className="w-full max-w-xl h-auto object-contain"
          />
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ff97b2]/20 dark:bg-white/10 px-3 py-1.5 text-sm font-bold text-[#e06d88] dark:text-coral-light">
              <Calendar className="w-4 h-4 shrink-0" aria-hidden />
              7 Δεκεμβρίου 2026
            </span>
            <a
              href={SUIHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#ff97b2]/20 dark:bg-white/10 px-3 py-1.5 text-sm font-bold text-[#e06d88] dark:text-coral-light hover:bg-[#ff97b2]/30"
            >
              <MapPin className="w-4 h-4 shrink-0" aria-hidden />
              Sui Hub Athens
            </a>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-[#faf5ef] leading-tight">
            Εσύ θα είσαι στο 1ο Technotes Meetup; 🩷
          </h2>

          <div className="mt-5 space-y-4 text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300">
            <p>
              Δίνεις Πανελλήνιες ή είσαι φοιτητής/φοιτήτρια; Έλα να γνωρίσεις νέους ανθρώπους, να
              μιλήσουμε για στόχους, όνειρα και όλα όσα σε απασχολούν για την καριέρα σου!
            </p>
            <p className="font-bold text-gray-900 dark:text-white">Τι θα γίνει:</p>
            <ul className="space-y-3">
              <li>
                ✨ Θα παρουσιαστεί το Technotes by Eleni Zafeiri: πώς ξεκίνησε και ποιος είναι ο
                στόχος του
              </li>
              <li>
                💼 Θα συζητήσουμε για καριέρες, διάβασμα και πώς μπορούμε να αξιοποιήσουμε την
                τεχνητή νοημοσύνη αποδοτικά στα παραπάνω
              </li>
              <li>
                🚀 Όποιος θέλει, μπορεί να συστηθεί και να μοιραστεί κάτι που φτιάχνει ή ετοιμάζει
                αυτόν τον καιρό!
              </li>
            </ul>
            <p className="font-semibold text-gray-900 dark:text-[#faf5ef]">Σε περιμένω🩷</p>
          </div>

          <div className="mt-8 text-center">
            <a
              href={LUMA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 w-full sm:w-auto min-h-14 px-10 py-4 rounded-2xl bg-[#f07f97] hover:bg-[#e06d88] text-white text-lg font-extrabold shadow-lg transition-colors"
            >
              Δήλωσε συμμετοχή
              <ExternalLink className="w-5 h-5 shrink-0" aria-hidden />
            </a>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              luma.com · ανοίγει σε νέα καρτέλα
            </p>
          </div>
        </div>
      </article>
    </main>
  </div>
);

export default CommunityPage;
