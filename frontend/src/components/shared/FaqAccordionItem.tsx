import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ExternalLink } from 'lucide-react';

export const FaqAccordionItem: React.FC<{
  question: string;
  answer: string;
  link?: string;
  linkLabel?: string;
}> = ({ question, answer, link, linkLabel }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white/90 dark:bg-[#3a2658]/90 backdrop-blur-md rounded-2xl border border-[#f07f97]/25 dark:border-white/10 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-4 sm:px-5 py-4 text-left hover:bg-[#f07f97]/5 dark:hover:bg-white/5 transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base leading-snug">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 shrink-0 text-[#f07f97] dark:text-[#ff97b2] transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>
      {open && (
        <div className="px-4 sm:px-5 pb-4 pt-0 text-sm sm:text-base text-gray-700 dark:text-gray-200 leading-relaxed border-t border-[#f07f97]/15 dark:border-white/10">
          <p className="pt-3">{answer}</p>
          {link ? (
            link.startsWith('/') ? (
              <Link
                to={link}
                className="mt-2 inline-flex items-center gap-1 text-[#f07f97] dark:text-[#ff97b2] font-semibold hover:underline"
              >
                {linkLabel || link}
              </Link>
            ) : (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-[#f07f97] dark:text-[#ff97b2] font-semibold hover:underline"
              >
                {linkLabel || link}
                <ExternalLink className="w-3.5 h-3.5" aria-hidden />
              </a>
            )
          ) : null}
        </div>
      )}
    </div>
  );
};

export default FaqAccordionItem;
