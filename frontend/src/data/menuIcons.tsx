import React from 'react';

/** Custom icons — ίδια paths στο μενού και στην αρχική. */
export const MENU_ICONS = {
  paliathemata: '/images/home%20page/icon1.jpg',
  progressTracker: '/images/home%20page/icon3.jpg',
  gloglossa: '/images/home%20page/icon6.jpg',
  studyTimer: '/images/home%20page/timer.webp',
  prosanatolismos: '/images/home%20page/icon9.jpg',
  algorithms: '/images/home%20page/icon10.jpg',
  schools: '/images/home%20page/icon11.jpg',
  askiseis: '/images/home%20page/kitie.png',
  methodologies: '/images/home%20page/icon15.jpg',
  flashcards: '/images/home%20page/icon16.jpg',
  about: '/images/icon20.jpg',
  quiz: '/images/con21.jpg',
  home: '/images/home%20page/icon23.webp',
  takeABreath: '/images/home%20page/icon24.jpg',
  announcements: '/images/home%20page/icon18.webp',
} as const;

export const MenuIconImg: React.FC<{ src: string; className?: string }> = ({
  src,
  className = 'w-7 h-7',
}) => {
  const isPng = src.toLowerCase().includes('.png');
  const blendClass = isPng
    ? 'mix-blend-normal'
    : 'mix-blend-multiply dark:mix-blend-normal';

  return (
    <img
      src={src}
      alt=""
      className={`${className} object-contain shrink-0 ${blendClass}`}
      decoding="async"
    />
  );
};
