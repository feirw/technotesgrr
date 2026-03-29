import React from 'react';
import { ExternalLink } from 'lucide-react';

const EMBED_URL = 'https://gloglossa.gr/';

const GloglossaEmbedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-black text-pink-600">GloGlossa</h1>
          <a
            href={EMBED_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-pink-200 text-pink-700 font-semibold hover:border-pink-400"
          >
            Άνοιγμα σε νέο tab
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="rounded-2xl overflow-hidden border-2 border-pink-200 shadow-xl bg-white">
          <iframe
            src={EMBED_URL}
            title="GloGlossa Embedded"
            className="w-full h-[80vh]"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>

        <p className="text-xs text-gray-500 mt-3">
          Αν το site δεν εμφανιστεί, πιθανότατα μπλοκάρει iframe embedding από headers ασφαλείας.
          Χρησιμοποίησε το κουμπί "Άνοιγμα σε νέο tab".
        </p>
      </div>
    </div>
  );
};

export default GloglossaEmbedPage;

