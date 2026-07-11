import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type CarouselProps = {
  children: React.ReactNode[];
  /** Αυτόματη εναλλαγή σε ms. 0 = απενεργοποιημένη. */
  autoAdvanceMs?: number;
  className?: string;
};

export const Carousel: React.FC<CarouselProps> = ({ children, autoAdvanceMs = 6000, className }) => {
  const slides = React.Children.toArray(children);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = (next: number) => {
    setDirection(next > index ? 1 : -1);
    setIndex((next + slides.length) % slides.length);
  };

  useEffect(() => {
    if (autoAdvanceMs <= 0 || slides.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % slides.length);
    }, autoAdvanceMs);
    return () => clearInterval(timer);
  }, [autoAdvanceMs, slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className={`relative overflow-hidden ${className ?? ''}`}>
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 24 : -24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -24 : 24 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {slides[index]}
        </motion.div>
      </AnimatePresence>

      {slides.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Προηγούμενο"
            className="absolute left-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Επόμενο"
            className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Carousel;
