import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/** Μετά από νέα πλοήγηση (όχι πίσω/μπροστά) σκρολάρει στην κορυφή της σελίδας. */
const ScrollToTop: React.FC = () => {
  const { pathname, search, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === 'POP' || hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    // Μετά από lazy routes / layout — διπλό rAF για σταθερή κορυφή
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      });
    });
  }, [pathname, search, hash, navigationType]);

  return null;
};

export default ScrollToTop;
