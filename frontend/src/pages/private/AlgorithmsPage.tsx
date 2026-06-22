import React from 'react';
import { PageMenuIcon } from '@/data/menuIcons';

const AlgorithmsPage: React.FC = () => {
  return (
    <div className="min-h-[100dvh] bg-[#fff2f2] dark:bg-gray-950 px-3 py-4 sm:px-6 sm:py-6 md:p-10 box-border">
      <div className="mx-auto w-full max-w-[1450px]">
        <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
          <PageMenuIcon
            icon="algorithms"
            wrapperClassName="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/80 dark:bg-gray-900/90 mb-0"
            className="w-9 h-9"
          />
          <h1 className="text-2xl sm:text-3xl font-black text-[#f07f97] dark:text-[#ff97b2]">
            Αλγόριθμοι
          </h1>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-3 sm:mb-4 px-1">
          Αν δεν φορτώνει σωστά, δοκίμασε οριζόντια περιστροφή ή desktop — το embed μπορεί να απαιτεί πλάτος οθόνης.
        </p>
        <iframe
          src="https://evripides.mysch.gr/dave/"
          title="Algorithms Visualization"
          className="w-full max-w-full rounded-xl border-none shadow-xl bg-white dark:bg-gray-900 block"
          style={{
            height: 'clamp(320px, calc(100dvh - 8.5rem), 1000px)',
            maxWidth: '1450px',
          }}
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default AlgorithmsPage;
