import React from 'react';
import { ExternalLink } from 'lucide-react';

const EMBED_URL = 'https://gloglossa.gr/';

const GloglossaEmbedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
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

        <div className="rounded-2xl overflow-hidden border-2 border-pink-200 dark:border-gray-700 shadow-xl bg-white dark:bg-gray-900">
          <iframe
            src={EMBED_URL}
            title="GloGlossa Embedded"
            className="w-full h-[80vh]"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>

        <p className="text-xl text-gray-600 dark:text-gray-300 mt-4">
          Ευχαριστούμε θερμά τον κ.{' '}
          <span className="font-semibold text-pink-600">Κομνηνό Χατζηπάπα</span> για τον Online
          Διερμηνευτή της Γλώσσας.
        </p>
      </div>
    </div>
  );
};

export default GloglossaEmbedPage;
