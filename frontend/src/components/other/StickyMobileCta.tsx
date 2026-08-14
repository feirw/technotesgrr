import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap } from 'lucide-react';

/** Fixed conversion bar — mobile only, hidden on quiz/flashcards (already studying). */
const HIDDEN_PREFIXES = ['/quiz', '/flashcards'];

const StickyMobileCta: React.FC = () => {
  const { pathname } = useLocation();
  const hidden = HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (hidden) return null;

  return (
    <div
      className="md:hidden fixed z-[70] left-3 right-3 bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] pointer-events-none"
      aria-hidden={false}
    >
      <Link
        to="/quiz"
        className="pointer-events-auto flex items-center justify-center gap-2 w-full max-w-md mx-auto py-3.5 px-5 rounded-full bg-[#f07f97] hover:bg-[#e06d88] text-white font-bold text-sm shadow-lg shadow-[#f07f97]/30 transition-colors"
      >
        <Zap className="w-4 h-4 shrink-0" aria-hidden />
        Ξεκίνα δωρεάν Quiz
      </Link>
    </div>
  );
};

export default StickyMobileCta;
