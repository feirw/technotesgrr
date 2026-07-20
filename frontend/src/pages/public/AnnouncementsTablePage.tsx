import React, { useMemo } from 'react';
import { ExternalLink } from 'lucide-react';
import { ANNOUNCEMENTS, type Announcement } from '@/data/announcements';
import { PageMenuIcon } from '@/data/menuIcons';

function parseSortKey(dateStr: string): number {
  const t = Date.parse(dateStr);
  return Number.isNaN(t) ? 0 : t;
}

function hrefFromLink(raw: string): string {
  const t = raw.trim();
  if (!t) return '';
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}

function AnnouncementLink({ row }: { row: Announcement }) {
  const href = row.link ? hrefFromLink(row.link) : '';
  if (!href) return <span className="text-gray-400 dark:text-gray-500">—</span>;

  const label =
    row.linkLabel?.trim() ||
    (() => {
      try {
        const u = new URL(href);
        return u.hostname.replace(/^www\./, '');
      } catch {
        return row.link!.trim().slice(0, 48) + (row.link!.trim().length > 48 ? '…' : '');
      }
    })();

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 font-medium text-[#f07f97] underline underline-offset-2 hover:text-[#e06d88] dark:hover:text-[#ffc4d6] break-all"
    >
      <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" aria-hidden />
      {label}
    </a>
  );
}

const AnnouncementsTablePage: React.FC = () => {
  const rows = useMemo(
    () => [...ANNOUNCEMENTS].sort((a, b) => parseSortKey(b.date) - parseSortKey(a.date)),
    [],
  );

  return (
    <div className="min-h-screen bg-[#ff97b2] dark:bg-[#2d1c48] text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <header className="border-b border-[#f07f97]/35 dark:border-white/10 bg-white/90 dark:bg-[#3a2658]/90 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12 text-center">
          <PageMenuIcon
            icon="announcements"
            wrapperClassName="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#ff97b2]/15 dark:bg-white/10 mb-3"
            className="w-9 h-9"
          />
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-[#faf5ef] tracking-tight">
            Ανακοινώσεις
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 pb-16">
        {rows.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 py-16 text-sm">
            Δεν υπάρχουν ανακοινώσεις ακόμα.
          </p>
        ) : (
          <>
            {/* Desktop / tablet: πίνακας */}
            <div className="hidden sm:block overflow-x-auto rounded-2xl border border-[#f07f97]/25 dark:border-white/15 bg-white dark:bg-[#3a2658] shadow-lg">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#f07f97]/20 dark:border-white/10 bg-[#fff5f8]/80 dark:bg-[#2d1c48]/80">
                    <th scope="col" className="px-4 py-3 font-bold text-[#f07f97] whitespace-nowrap w-36">
                      Ημερομηνία
                    </th>
                    <th scope="col" className="px-4 py-3 font-bold text-[#f07f97] min-w-[10rem]">
                      Τίτλος
                    </th>
                    <th scope="col" className="px-4 py-3 font-bold text-[#f07f97]">
                      Κείμενο
                    </th>
                    <th scope="col" className="px-4 py-3 font-bold text-[#f07f97] min-w-[8rem]">
                      Σύνδεσμος
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row: Announcement) => (
                    <tr
                      key={row.id}
                      className="border-b border-gray-200/70 dark:border-white/5 last:border-0 hover:bg-[#f07f97]/[0.06] dark:hover:bg-white/[0.04] transition-colors"
                    >
                      <td className="px-4 py-3 align-top text-gray-600 dark:text-gray-300 whitespace-nowrap tabular-nums">
                        {row.date}
                      </td>
                      <td className="px-4 py-3 align-top font-semibold text-gray-900 dark:text-gray-50">
                        {row.title}
                      </td>
                      <td className="px-4 py-3 align-top text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                        {row.body}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <AnnouncementLink row={row} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: κάρτες */}
            <ul className="sm:hidden space-y-4">
              {rows.map((row: Announcement) => (
                <li
                  key={row.id}
                  className="rounded-2xl border border-[#f07f97]/25 dark:border-white/15 bg-white dark:bg-[#3a2658] p-4 shadow-md"
                >
                  <p className="text-xs font-semibold text-[#f07f97] tabular-nums">{row.date}</p>
                  <h2 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">{row.title}</h2>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                    {row.body}
                  </p>
                  {row.link?.trim() ? (
                    <p className="mt-3 text-sm">
                      <AnnouncementLink row={row} />
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
};

export default AnnouncementsTablePage;
