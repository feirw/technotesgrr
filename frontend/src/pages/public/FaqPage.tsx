import React from 'react';
import { PANELLINIES_FAQ } from '@/data/panelliniesFaq';
import { FaqAccordionItem } from '@/components/shared/FaqAccordionItem';
import { PageMenuIcon } from '@/data/menuIcons';

const FaqPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#ff97b2] dark:bg-[#2d1c48] text-gray-900 dark:text-gray-100 transition-colors duration-500 pb-16">
      <header className="border-b border-[#f07f97]/35 dark:border-white/10 bg-white/90 dark:bg-[#3a2658]/90 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 pb-10 sm:pt-20 sm:pb-12 text-center">
          <PageMenuIcon
            icon="faq"
            wrapperClassName="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#ff97b2]/15 dark:bg-white/10 mb-3"
            className="w-9 h-9"
          />
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-[#faf5ef] tracking-tight">
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
                <FaqAccordionItem
                  key={item.question}
                  question={item.question}
                  answer={item.answer}
                  link={item.link}
                  linkLabel={item.linkLabel}
                />
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default FaqPage;
