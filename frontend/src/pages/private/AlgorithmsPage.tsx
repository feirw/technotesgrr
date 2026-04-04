import React from 'react';

const AlgorithmsPage: React.FC = () => {
  return (
    <div className="min-h-[100dvh] bg-[#fff2f2] dark:bg-gray-950 px-3 py-4 sm:px-6 sm:py-6 md:p-10 box-border">
      <div className="mx-auto w-full max-w-[1450px]">
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
