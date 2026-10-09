import React from 'react';
import { Link } from 'react-router-dom';
import { PREP_TOOLS } from '@/data/prepTools';
import { MenuIconImg } from '@/data/menuIcons';

const PrepPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#ff97b2] dark:bg-[#2d1c48] text-gray-900 dark:text-gray-100 px-4 sm:px-6 py-10 sm:py-14">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-[#faf5ef]">
            Προετοιμασία
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
            Όλα τα εργαλεία μελέτης για τις Πανελλήνιες Πληροφορικής.
          </p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {PREP_TOOLS.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className="aspect-square flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-[#f07f97]/30 dark:border-white/15 bg-white/90 dark:bg-[#3a2658]/90 px-3 py-4 text-center shadow-md hover:border-[#f07f97] hover:bg-[#fff5f8] dark:hover:bg-white/10 transition-colors"
            >
              <MenuIconImg src={tool.iconSrc} className="w-12 h-12 sm:w-14 sm:h-14" />
              <span className="text-xs sm:text-sm font-bold leading-tight text-gray-800 dark:text-gray-100">
                {tool.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrepPage;
