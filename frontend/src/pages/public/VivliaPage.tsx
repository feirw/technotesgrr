import React, { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { Download, ExternalLink, RefreshCw } from 'lucide-react';
import { MenuIconImg, MENU_ICONS } from '@/data/menuIcons';

const PaliaMobilePdf = lazy(() => import('@/components/private/PaliaMobilePdf'));

interface VivlioItem {
  id: string;
  title: string;
  shortTitle: string;
  path: string;
}

const VIVLIA: VivlioItem[] = [
  {
    id: 'aep',
    title: 'Ανάπτυξη Εφαρμογών σε Προγραμματιστικό Περιβάλλον — Βιβλίο Μαθητή',
    shortTitle: 'Βιβλίο Μαθητή',
    path: '/pdfs/vivlia/22-0275-01_Anaptyxi-Efarmogon-se-Programmatistiko-Perivallon_G-Lykeiou-SpOikPlir_Vivlio-Mathiti.pdf',
  },
  {
    id: 'pliroforiki',
    title: 'Πληροφορική Γ’ Λυκείου — Συμπληρωματικό Εκπαιδευτικό Υλικό',
    shortTitle: 'Συμπληρωματικό',
    path: '/pdfs/vivlia/22-0279-01_Pliroforiki_G-Lykeiou-SpOikPlir_Sympliromatiko-Ekpaideutiko-Yliko.pdf',
  },
];

const prefetchedUrls = new Set<string>();

/** Warm HTTP cache so switching books / revisiting is instant. */
export function prefetchVivliaPdfs(paths: string[] = VIVLIA.map((v) => v.path)) {
  for (const path of paths) {
    if (prefetchedUrls.has(path)) continue;
    prefetchedUrls.add(path);
    void fetch(path, { credentials: 'same-origin', cache: 'force-cache' }).catch(() => {
      prefetchedUrls.delete(path);
    });
  }
}

function usePreferNativePdfViewer() {
  const [preferNative, setPreferNative] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(min-width: 768px) and (pointer: fine)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (pointer: fine)');
    const sync = () => setPreferNative(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return preferNative;
}

const VivliaPage: React.FC = () => {
  const [activeId, setActiveId] = useState<string>(VIVLIA[0].id);
  const active = useMemo(() => VIVLIA.find((v) => v.id === activeId) ?? VIVLIA[0], [activeId]);
  const [viewerError, setViewerError] = useState(false);
  const [loading, setLoading] = useState(true);
  const preferNative = usePreferNativePdfViewer();
  const iframeSrc = `${active.path}#view=FitH&toolbar=1`;

  useEffect(() => {
    prefetchVivliaPdfs();
  }, []);

  useEffect(() => {
    setViewerError(false);
    setLoading(true);
  }, [activeId, preferNative]);

  const handleIframeLoad = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-coral-wash dark:bg-gradient-to-br dark:from-[#2d1c48] dark:via-[#2d1c48] dark:to-[#1a1028] px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <MenuIconImg src={MENU_ICONS.vivlia} className="w-9 h-9 sm:w-10 sm:h-10" />
          <h1 className="text-2xl sm:text-3xl font-black text-coral-accent dark:text-coral-light">
            Βιβλία
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          {VIVLIA.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setActiveId(v.id)}
              onMouseEnter={() => prefetchVivliaPdfs([v.path])}
              onFocus={() => prefetchVivliaPdfs([v.path])}
              className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                activeId === v.id
                  ? 'bg-coral-accent text-white shadow-lg'
                  : 'bg-white dark:bg-[#3a2658] border-2 border-coral-accent/25 dark:border-white/15 text-gray-700 dark:text-gray-200 hover:border-coral-accent'
              }`}
              title={v.title}
            >
              {v.shortTitle}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{active.title}</h2>
          <div className="flex items-center gap-2">
            <a
              href={active.path}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#3a2658] border-2 border-coral-accent/30 dark:border-white/15 text-coral-strong dark:text-coral-light font-semibold hover:border-coral-accent"
            >
              Άνοιγμα σε νέο tab
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={active.path}
              download
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#3a2658] border-2 border-coral-accent/30 dark:border-white/15 text-coral-strong dark:text-coral-light font-semibold hover:border-coral-accent"
            >
              Λήψη
              <Download className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden border-2 border-coral-accent/25 dark:border-white/15 shadow-xl bg-white dark:bg-[#3a2658] h-[min(82vh,880px)]">
          {loading && !viewerError && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white dark:bg-[#3a2658]">
              <div className="w-12 h-12 rounded-full border-4 border-coral-accent border-t-transparent animate-spin" />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Φόρτωση βιβλίου…</p>
            </div>
          )}
          {viewerError ? (
            <div className="h-full w-full flex flex-col items-center justify-center gap-4 px-4 text-center">
              <p className="text-sm sm:text-base font-semibold text-gray-600 dark:text-gray-300">
                Δεν ήταν δυνατή η προβολή του PDF. Άνοιξέ το σε νέα καρτέλα ή κατέβασέ το από τα κουμπιά από πάνω.
              </p>
              <button
                type="button"
                onClick={() => {
                  setViewerError(false);
                  setLoading(true);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-coral-accent px-4 py-3 text-sm font-bold text-white shadow"
              >
                <RefreshCw className="w-4 h-4" />
                Ξανά φόρτωση
              </button>
            </div>
          ) : preferNative ? (
            <iframe
              key={active.id}
              title={active.title}
              src={iframeSrc}
              className="block h-full w-full border-0 bg-white"
              onLoad={handleIframeLoad}
              onError={() => setViewerError(true)}
            />
          ) : (
            <div className="h-full w-full overflow-y-auto overflow-x-hidden overscroll-contain">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-full min-h-[240px] text-sm font-semibold text-gray-500">
                    Άνοιγμα προβολής PDF…
                  </div>
                }
              >
                <PaliaMobilePdf
                  key={active.id}
                  fileUrl={active.path}
                  onReady={() => setLoading(false)}
                  onFatal={() => setViewerError(true)}
                  className="px-1 py-2 sm:px-4"
                />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VivliaPage;
