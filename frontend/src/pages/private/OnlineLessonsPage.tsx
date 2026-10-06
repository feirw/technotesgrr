import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Lock } from 'lucide-react';
import {
  ALL_ONLINE_LESSONS,
  ONLINE_LESSON_CHAPTERS,
  chapterIdForLesson,
  type OnlineLesson,
} from '@/data/onlineLessons';
import { PageMenuIcon } from '@/data/menuIcons';

const COURSE_THUMB = '/images/Technotesgr.png';

function LockedPlayer({ lesson }: { lesson: OnlineLesson }) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-[#f07f97]/40 bg-[#1a0f16] shadow-2xl">
      <div className="relative aspect-video w-full bg-[#ffd6e3]">
        <img
          src={COURSE_THUMB}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-xs font-bold text-white">
          <Lock className="h-3.5 w-3.5" aria-hidden />
          Coming soon
        </span>
      </div>
      <div className="bg-white px-4 py-3 dark:bg-[#3a2658]">
        <p className="text-xs font-bold uppercase tracking-wide text-[#f07f97]">Σειρά βιντεομαθημάτων</p>
        <h2 className="mt-0.5 text-lg font-black leading-snug text-gray-900 dark:text-white sm:text-xl">
          {lesson.code}
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">Το μάθημα είναι κλειδωμένο.</p>
      </div>
    </div>
  );
}

function LessonThumb({ selected }: { selected: boolean }) {
  return (
    <div
      className={`relative aspect-video w-[7.25rem] shrink-0 overflow-hidden rounded-lg ${
        selected ? 'ring-2 ring-[#f07f97]' : 'ring-1 ring-[#f07f97]/25'
      } bg-[#ffd6e3]`}
    >
      <img src={COURSE_THUMB} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <span className="absolute bottom-1 right-1 inline-flex items-center rounded bg-black/65 p-0.5 text-white">
        <Lock className="h-3 w-3" aria-hidden />
      </span>
    </div>
  );
}

const OnlineLessonsPage: React.FC = () => {
  const firstLesson = ALL_ONLINE_LESSONS[0];
  const [selectedId, setSelectedId] = useState(firstLesson.id);
  const [openChapterId, setOpenChapterId] = useState(() => chapterIdForLesson(firstLesson.id) ?? 'intro');

  const selected = useMemo(
    () => ALL_ONLINE_LESSONS.find((lesson) => lesson.id === selectedId) ?? firstLesson,
    [selectedId, firstLesson],
  );

  useEffect(() => {
    const chapterId = chapterIdForLesson(selectedId);
    if (chapterId) setOpenChapterId(chapterId);
  }, [selectedId]);

  const selectLesson = (lesson: OnlineLesson, chapterId: string) => {
    setSelectedId(lesson.id);
    setOpenChapterId(chapterId);
  };

  return (
    <div className="min-h-screen bg-[#ff97b2] dark:bg-[#2d1c48] text-gray-900 dark:text-gray-100 transition-colors duration-500 pb-16">
      <header className="border-b border-[#f07f97]/35 dark:border-white/10 bg-white/90 dark:bg-[#3a2658]/90 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-10 text-center sm:px-6 sm:py-12">
          <PageMenuIcon
            icon="onlineLessons"
            wrapperClassName="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#ff97b2]/15 dark:bg-white/10 mb-3"
            className="w-9 h-9"
          />
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-[#faf5ef] sm:text-4xl">
            Online Μαθήματα
          </h1>
          <span className="mt-4 inline-flex items-center rounded-full bg-[#f07f97] px-6 py-2.5 text-lg font-black uppercase tracking-wide text-white sm:text-xl">
            Coming soon
          </span>
          <p className="mt-3 text-xs font-bold uppercase tracking-wide text-[#f07f97]">
            {ALL_ONLINE_LESSONS.length} βίντεο · {ONLINE_LESSON_CHAPTERS.length} ενότητες
          </p>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,22rem)] lg:items-start lg:py-8">
        <LockedPlayer lesson={selected} />

        <aside className="overflow-hidden rounded-2xl border-2 border-[#f07f97]/35 bg-white shadow-xl dark:border-white/10 dark:bg-[#3a2658] lg:sticky lg:top-24 lg:max-h-[min(78dvh,44rem)] lg:flex lg:flex-col">
          <div className="border-b border-[#f07f97]/20 px-4 py-3 dark:border-white/10">
            <p className="text-sm font-black text-gray-900 dark:text-white">Σειρά βιντεομαθημάτων</p>
            <p className="text-xs text-gray-500 dark:text-gray-300">Coming soon</p>
          </div>
          <div className="max-h-[min(70dvh,36rem)] overflow-y-auto overscroll-contain lg:max-h-none lg:flex-1">
            {ONLINE_LESSON_CHAPTERS.map((chapter) => {
              const open = openChapterId === chapter.id;
              const count = chapter.sections.reduce((n, section) => n + section.lessons.length, 0);
              return (
                <div key={chapter.id} className="border-b border-[#f07f97]/15 last:border-0 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setOpenChapterId(open ? '' : chapter.id)}
                    className="flex w-full items-start justify-between gap-2 px-4 py-3 text-left hover:bg-[#fff5f8] dark:hover:bg-white/5"
                    aria-expanded={open}
                  >
                    <span>
                      <span className="block text-sm font-bold leading-snug text-gray-900 dark:text-white">
                        {chapter.title}
                      </span>
                      <span className="mt-0.5 block text-[11px] font-medium text-gray-500 dark:text-gray-400">
                        {count} μαθήματα
                      </span>
                    </span>
                    <ChevronDown
                      className={`mt-0.5 h-4 w-4 shrink-0 text-[#f07f97] transition-transform ${open ? 'rotate-180' : ''}`}
                      aria-hidden
                    />
                  </button>
                  {open ? (
                    <ul className="pb-2">
                      {chapter.sections.map((section) => (
                        <li key={section.id}>
                          {section.title ? (
                            <p className="px-4 pb-1 pt-2 text-[11px] font-black uppercase tracking-wide text-[#f07f97]">
                              {section.title}
                            </p>
                          ) : null}
                          {section.lessons.map((lesson) => {
                            const isSelected = lesson.id === selected.id;
                            return (
                              <button
                                key={lesson.id}
                                type="button"
                                onClick={() => selectLesson(lesson, chapter.id)}
                                className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors ${
                                  isSelected
                                    ? 'bg-[#ff97b2]/25 dark:bg-[#ff97b2]/15'
                                    : 'hover:bg-[#fff5f8] dark:hover:bg-white/5'
                                }`}
                                aria-current={isSelected ? 'true' : undefined}
                                aria-label={`Κλειδωμένο: ${lesson.code} ${lesson.title}`}
                              >
                                <LessonThumb selected={isSelected} />
                                <span className="min-w-0 flex-1">
                                  <span className="block text-[13px] font-bold leading-snug text-gray-900 dark:text-white">
                                    {lesson.code}
                                  </span>
                                  <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#f07f97]">
                                    <Lock className="h-3 w-3" aria-hidden />
                                    Κλειδωμένο
                                  </span>
                                </span>
                              </button>
                            );
                          })}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              );
            })}
          </div>
        </aside>
      </main>
    </div>
  );
};

export default OnlineLessonsPage;
