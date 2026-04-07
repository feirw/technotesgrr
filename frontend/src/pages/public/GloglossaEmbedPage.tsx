import React from 'react';
import { ExternalLink } from 'lucide-react';

const EMBED_URL = 'https://gloglossa.gr/';

const GloglossaEmbedPage: React.FC = () => {
  return (
    <div
      className="overflow-hidden flex flex-col overscroll-none bg-coral-wash dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 px-4 sm:px-6 pt-3 sm:pt-4 pb-2"
      style={{
        overscrollBehavior: 'none',
        overflowAnchor: 'none',
        height: 'calc(100dvh - 5.75rem - env(safe-area-inset-top, 0px))',
        maxHeight: 'calc(100dvh - 5.75rem - env(safe-area-inset-top, 0px))',
      }}
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-2 sm:gap-3 flex-1 min-h-0">
        <div className="flex flex-wrap items-center justify-between gap-3 shrink-0">
          <h1 className="text-2xl sm:text-3xl font-black text-coral-accent dark:text-coral-light">GloGlossa</h1>
          <a
            href={EMBED_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border-2 border-coral-accent/30 dark:border-gray-700 text-coral-strong dark:text-coral-light font-semibold hover:border-coral-accent"
          >
            Άνοιγμα σε νέο tab
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="flex-1 min-h-0 rounded-2xl overflow-hidden border-2 border-coral-accent/25 dark:border-gray-700 shadow-xl bg-white dark:bg-gray-900 overscroll-y-contain isolate">
          <iframe
            src={EMBED_URL}
            title="GloGlossa Embedded"
            className="w-full h-full min-h-0 border-0 block"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>

        <details className="shrink-0 max-h-[28vh] overflow-y-auto overscroll-y-contain rounded-xl border border-coral-accent/25 dark:border-gray-700 bg-white/60 dark:bg-gray-900/60 text-sm text-gray-600 dark:text-gray-300">
          <summary className="cursor-pointer select-none px-4 py-3 font-semibold text-coral-strong dark:text-coral-light sticky top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-[1]">
            Ευχαριστίες &amp; σχετικά
          </summary>
          <p className="px-4 pb-4 pt-0 leading-relaxed">
            Ευχαριστούμε θερμά τον κ.{' '}
            <span className="font-semibold text-coral-accent dark:text-coral-light">Κομνηνό Χατζηπάπα</span> για τον
            Online Διερμηνευτή της Γλώσσας.
          </p>
        </details>
      </div>
    </div>
  );
};

export default GloglossaEmbedPage;
