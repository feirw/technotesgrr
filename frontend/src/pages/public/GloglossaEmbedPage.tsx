import React from 'react';
import { ExternalLink } from 'lucide-react';

const EMBED_URL = 'https://gloglossa.gr/';

const GloglossaEmbedPage: React.FC = () => {
  return (
    <div
      className="bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 px-4 sm:px-6 pt-4 sm:pt-6 pb-4 [overflow-anchor:none] overscroll-y-contain"
      /* CHANGED: overflow-anchor:none — όταν τρέχει κώδικας στο iframe, το browser δεν «τραβάει» το scroll του parent για να «κρατήσει» στοιχεία που άλλαξαν ύψος. */
      style={{ overflowAnchor: 'none' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 shrink-0">
          <h1 className="text-2xl sm:text-3xl font-black text-pink-600">GloGlossa</h1>
          <a
            href={EMBED_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border-2 border-pink-200 dark:border-gray-700 text-pink-700 dark:text-pink-300 font-semibold hover:border-pink-400"
          >
            Άνοιγμα σε νέο tab
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* CHANGED: σταθερό ύψος ≈ viewport − nav/padding ώστε η κύλιση της εφαρμογής gloglossa να μένει ΜΕΣΑ στο iframe, όχι να «βουλιάζει» όλη η σελίδα TechNotes. */}
        <div className="rounded-2xl overflow-hidden border-2 border-pink-200 dark:border-gray-700 shadow-xl bg-white dark:bg-gray-900 h-[min(80vh,calc(100dvh-9.5rem))] min-h-[280px] sm:min-h-[360px] overscroll-y-contain isolate">
          <iframe
            src={EMBED_URL}
            title="GloGlossa Embedded"
            className="w-full h-full border-0 block"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>

        {/* CHANGED: κλειστό <details> ώστε να μην επιμηκύνει τη σελίδα από κάτω και να μην τραβάει scroll μετά το τρέξιμο κώδικα. */}
        <details className="shrink-0 rounded-xl border border-pink-200/80 dark:border-gray-700 bg-white/60 dark:bg-gray-900/60 text-sm text-gray-600 dark:text-gray-300">
          <summary className="cursor-pointer select-none px-4 py-3 font-semibold text-pink-700 dark:text-pink-300">
            Ευχαριστίες &amp; σχετικά
          </summary>
          <p className="px-4 pb-4 pt-0 leading-relaxed">
            Ευχαριστούμε θερμά τον κ.{' '}
            <span className="font-semibold text-pink-600 dark:text-pink-400">Κομνηνό Χατζηπάπα</span> για τον
            Online Διερμηνευτή της Γλώσσας.
          </p>
        </details>
      </div>
    </div>
  );
};

export default GloglossaEmbedPage;
