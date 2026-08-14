import React from 'react';
import { ExternalLink } from 'lucide-react';
import { MenuIconImg, MENU_ICONS } from '@/data/menuIcons';

export const GLOSSA_INTERPRETER_URL = 'https://www.didactics.gr/glossa';

const GloglossaEmbedPage: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 bg-coral-wash dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
    <div className="max-w-lg w-full text-center rounded-3xl border-2 border-coral-accent/25 dark:border-white/15 bg-white/90 dark:bg-[#3a2658]/90 backdrop-blur-md p-8 sm:p-12 shadow-xl">
      <MenuIconImg
        src={MENU_ICONS.gloglossa}
        className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4"
        alt="Διερμηνευτής ΓΛΩΣΣΑΣ"
      />
      <h1 className="text-2xl sm:text-4xl font-black text-coral-accent dark:text-coral-light mb-8">
        Διερμηνευτής ΓΛΩΣΣΑΣ
      </h1>
      <a
        href={GLOSSA_INTERPRETER_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-3 w-full sm:w-auto min-h-14 px-10 py-5 rounded-2xl bg-[#f07f97] hover:bg-[#e06d88] text-white text-lg sm:text-xl font-extrabold shadow-lg shadow-[#f07f97]/30 transition-colors"
      >
        Άνοιγμα σε νέο tab
        <ExternalLink className="w-6 h-6 shrink-0" aria-hidden />
      </a>
    </div>
  </div>
);

export default GloglossaEmbedPage;
