import React, { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  METHODOLOGY_TOPICS,
  METHODOLOGY_BY_TOPIC,
  type MethodologyTopicId,
  type OsoExample,
} from '@/data/methodologies';
import { PageMenuIcon } from '@/data/menuIcons';

const preClass =
  'mt-3 mb-2 rounded-xl bg-slate-900/95 text-slate-100 p-4 text-sm font-mono leading-relaxed overflow-x-auto border border-slate-700/80 whitespace-pre';

const blockTitleClass =
  'scroll-mt-6 mt-10 sm:mt-12 first:mt-0 border-t border-[#fea2bb]/25 dark:border-white/15/45 pt-8 sm:pt-10 text-lg sm:text-xl font-black tracking-tight text-gray-900 dark:text-white first:border-t-0 first:pt-0 inline-flex items-center gap-2.5 before:h-7 before:w-1 before:shrink-0 before:rounded-full before:bg-[#fea2bb]/90';

const blockTitleAfterSectionClass =
  'scroll-mt-4 mt-8 sm:mt-10 border-t-0 pt-0 text-lg sm:text-xl font-black tracking-tight text-gray-900 dark:text-white inline-flex items-center gap-2.5 before:h-7 before:w-1 before:shrink-0 before:rounded-full before:bg-[#fea2bb]/90';

const sectionHeadingClass =
  'scroll-mt-8 mt-14 sm:mt-16 first:mt-10 text-xl sm:text-2xl font-black text-[#fea2bb] dark:text-[#fea2bb] border-b border-[#fea2bb]/30 pb-3 mb-2';

const partSubtitleClass =
  'mt-4 text-base font-bold text-gray-800 dark:text-gray-100 whitespace-pre-line';

const mainSectionTitleClass =
  'text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white pb-3 mb-1 border-b border-[#fea2bb]/35 dark:border-white/15/60';

const ExampleList: React.FC<{ examples: OsoExample[] }> = ({ examples }) => (
  <motion.div className="mt-6 flex flex-col gap-4 text-gray-800 dark:text-gray-100">
    {examples.map((example, index) => (
      <div key={`${index}-${example.sectionHeading ?? ''}-${example.title ?? ''}`} className="pb-2">
        {example.sectionHeading && <h3 className={sectionHeadingClass}>{example.sectionHeading}</h3>}
        {example.title && (
          <h4 className={example.sectionHeading ? blockTitleAfterSectionClass : blockTitleClass}>
            {index + 1}. {example.title}
          </h4>
        )}
        {example.parts?.map((part, partIndex) => (
          <div key={`${part.subtitle ?? partIndex}`}>
            {part.subtitle && <p className={partSubtitleClass}>{part.subtitle}</p>}
            {part.code && <pre className={preClass}>{part.code}</pre>}
          </div>
        ))}
        {example.code && <pre className={preClass}>{example.code}</pre>}
      </div>
    ))}
  </motion.div>
);

const MethodologiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get('t') || '';
  const active: MethodologyTopicId = useMemo(() => {
    const ok = METHODOLOGY_TOPICS.some((x) => x.id === raw);
    return ok ? (raw as MethodologyTopicId) : 'oso';
  }, [raw]);

  useEffect(() => {
    if (raw && !METHODOLOGY_TOPICS.some((x) => x.id === raw)) {
      setSearchParams({ t: 'oso' }, { replace: true });
    }
  }, [raw, setSearchParams]);

  const setTopic = (id: MethodologyTopicId) => setSearchParams({ t: id }, { replace: true });
  const content = METHODOLOGY_BY_TOPIC[active];

  return (
    <motion.div
      className="min-h-[100dvh] bg-[#fff5f4] dark:bg-[#2d1c48] px-3 py-6 sm:px-6 sm:py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div className="mx-auto max-w-3xl">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <PageMenuIcon
            icon="methodologies"
            wrapperClassName="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#ff97b2]/15 dark:bg-white/10 mx-auto mb-3"
            className="w-9 h-9"
          />
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-[#faf5ef] tracking-tight">
            Μεθοδολογίες
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
            Τυπικά παραδείγματα σε ψευδογλώσσα (ΓΛΩΣΣΑ).
          </p>
        </motion.header>

        <motion.div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-12">
          {METHODOLOGY_TOPICS.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => setTopic(topic.id)}
              className={`min-h-11 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold border transition-all touch-manipulation ${
                active === topic.id
                  ? 'bg-[#fea2bb] text-gray-900 border-[#fea2bb] shadow-lg'
                  : 'bg-white/90 dark:bg-[#3a2658]/90 text-gray-800 dark:text-gray-100 border-[#fea2bb]/40 dark:border-white/15 hover:border-[#fea2bb]/60'
              }`}
            >
              {topic.menuLabel}
            </button>
          ))}
        </motion.div>

        <motion.article
          key={active}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border border-[#fea2bb]/30 dark:border-white/15 bg-white/95 dark:bg-[#3a2658]/95 shadow-xl p-6 sm:p-9 sm:pb-10"
        >
          <h2 className={mainSectionTitleClass}>{content.theoryTitle}</h2>

          <ExampleList examples={content.examples} />
        </motion.article>
      </motion.div>
    </motion.div>
  );
};

export default MethodologiesPage;
