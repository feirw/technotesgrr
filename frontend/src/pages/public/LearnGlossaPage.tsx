import React from 'react';
import { ExternalLink } from 'lucide-react';

export const LEARN_GLOSSA_URL = 'https://www.learnglossa.gr/';

const LearnGlossaPage: React.FC = () => (
  <div className="min-h-screen bg-[#ff97b2] dark:bg-[#2d1c48] text-gray-900 dark:text-gray-100 px-4 sm:px-6 py-10 sm:py-14">
    <div className="max-w-4xl mx-auto">
      <div className="rounded-3xl border-2 border-[#f07f97]/30 dark:border-white/15 bg-white/90 dark:bg-[#3a2658]/90 p-6 sm:p-10 shadow-xl">
        <div className="text-center">
          <img
            src="/images/learn-glossa-logo.png"
            alt="Learn Glossa"
            width={64}
            height={64}
            className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-2xl shadow-md"
          />
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-[#faf5ef]">
            Learn Glossa
          </h1>
        </div>

        <a
          href={LEARN_GLOSSA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 block overflow-hidden rounded-2xl border border-[#f07f97]/25 dark:border-white/10 shadow-lg hover:opacity-95 transition-opacity"
        >
          <img
            src="/images/learn-glossa-home.webp"
            alt="Η αρχική σελίδα του Learn Glossa"
            width={1024}
            height={457}
            className="w-full h-auto block"
            loading="lazy"
            decoding="async"
          />
        </a>

        <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300">
          <p>
            Το Learn Glossa είναι πλατφόρμα εξάσκησης στη ΓΛΩΣΣΑ της ΑΕΠΠ για τις Πανελλήνιες
            Πληροφορικής. Γράφεις με τις εντολές και τους κανόνες του σχολικού βιβλίου, εκτελείς τον
            κώδικα στον browser και βλέπεις αμέσως τι χρειάζεται διόρθωση.
          </p>
          <p>
            Το Learn Glossa το έφτιαξε ο συνάδελφος{' '}
            <a
              href="https://www.linkedin.com/in/georgios-grammenoudis/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#f07f97] underline underline-offset-2 hover:text-[#e06d88]"
            >
              Giorgos Grammenoudis
            </a>{' '}
            από το Τμήμα Πληροφορικής του ΑΠΘ.
          </p>
        </div>

        <div className="text-center">
          <a
            href={LEARN_GLOSSA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center gap-3 w-full sm:w-auto min-h-14 px-10 py-4 rounded-2xl bg-[#f07f97] hover:bg-[#e06d88] text-white text-lg font-extrabold shadow-lg transition-colors"
          >
            Άνοιγμα του Learn Glossa
            <ExternalLink className="w-5 h-5 shrink-0" aria-hidden />
          </a>
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            learnglossa.gr · ανοίγει σε νέα καρτέλα
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default LearnGlossaPage;
