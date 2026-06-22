import React from 'react';

const HP = '/images/home%20page';

/** Custom pixel icons — ίδια paths στο μενού, στην αρχική και στις σελίδες. */
export const MENU_ICONS = {
  home: `${HP}/16.png`,
  about: `${HP}/4.png`,
  announcements: `${HP}/7.png`,
  quiz: `${HP}/11.png`,
  flashcards: `${HP}/10.png`,
  methodologies: `${HP}/13.png`,
  askiseis: `${HP}/9.png`,
  aiCorrector: `${HP}/5.png`,
  schools: `${HP}/6.png`,
  syntelestesSxolon: `${HP}/15.png`,
  paliathemata: `${HP}/2.png`,
  gloglossa: `${HP}/12.png`,
  progressTracker: `${HP}/14.png`,
  studyTimer: `${HP}/3.png`,
  prosanatolismos: `${HP}/17.png`,
  algorithms: `${HP}/5.png`,
  takeABreath: `${HP}/8.png`,
  faq: `${HP}/17.png`,
} as const;

export type MenuIconKey = keyof typeof MENU_ICONS;

/** Σταθερό πλαίσιο + μέγεθος για ευθυγράμμιση icons στο μενού. */
export const MENU_ICON_SLOT = 'inline-flex h-9 w-9 shrink-0 items-center justify-center';
export const MENU_ICON_SIZE = 'h-8 w-8';
export const MENU_ICON_SIZE_COMPACT = 'h-7 w-7';

export const MenuIconImg: React.FC<{ src: string; className?: string }> = ({
  src,
  className = MENU_ICON_SIZE,
}) => (
  <img
    src={src}
    alt=""
    className={`${className} object-contain shrink-0 mix-blend-normal [image-rendering:pixelated]`}
    decoding="async"
  />
);

export const MenuNavIcon: React.FC<{ src: string; compact?: boolean }> = ({
  src,
  compact = false,
}) => (
  <span className={MENU_ICON_SLOT} aria-hidden>
    <MenuIconImg src={src} className={compact ? MENU_ICON_SIZE_COMPACT : MENU_ICON_SIZE} />
  </span>
);

export const PageMenuIcon: React.FC<{
  icon: MenuIconKey;
  wrapperClassName?: string;
  className?: string;
}> = ({
  icon,
  wrapperClassName = 'inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 mb-3',
  className = 'w-10 h-10 sm:w-12 sm:h-12',
}) => (
  <div className={wrapperClassName}>
    <MenuIconImg src={MENU_ICONS[icon]} className={className} />
  </div>
);
