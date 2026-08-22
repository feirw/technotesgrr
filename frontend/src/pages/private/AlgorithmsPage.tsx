import React from 'react';
import { PageMenuIcon } from '@/data/menuIcons';
import { AlgoVisualizer } from '@/features/algo-viz';

const AlgorithmsPage: React.FC = () => {
  return (
    <div className="min-h-[100dvh] bg-[#fff5f8] px-3 py-4 text-slate-900 dark:bg-[#2d1c48] dark:text-[#faf5ef] sm:px-6 sm:py-6">
      <div className="mx-auto mb-4 flex max-w-[1200px] flex-col items-center">
        <PageMenuIcon
          icon="algorithms"
          wrapperClassName="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#ff97b2]/15 dark:bg-white/10 mb-3"
          className="w-9 h-9"
        />
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Προσομοίωση Αλγορίθμων</h1>
      </div>
      <AlgoVisualizer />
    </div>
  );
};

export default AlgorithmsPage;
