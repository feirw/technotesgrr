import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { PANELLINIES_FAQ } from '@/data/panelliniesFaq';

const cardClass =
  'bg-white/90 dark:bg-[#3a2658]/90 backdrop-blur-md rounded-2xl border border-[#f07f97]/25 dark:border-white/10 overflow-hidden';

const FaqAccordionItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={cardClass}>
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
        </div>
      )}
    </div>
  );
};

const FaqPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#ff97b2] dark:bg-[#2d1c48] text-gray-900 dark:text-gray-100 transition-colors duration-500 pb-16">
      <header className="border-b border-[#f07f97]/35 dark:border-white/10 bg-white/90 dark:bg-[#3a2658]/90 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-[#f07f97] dark:text-[#ff97b2] tracking-tight">
            FAQ
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Συχνές ερωτήσεις για Πανελλήνιες, βαθμολόγηση, ΕΒΕ και μηχανογραφικό.
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10">
        {PANELLINIES_FAQ.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl sm:text-2xl font-black text-white mb-4 drop-shadow-sm">
              {section.title}
            </h2>
            <div className="space-y-3">
              {section.items.map((item) => (
                <FaqAccordionItem key={item.question} question={item.question} answer={item.answer} />
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default FaqPage;
