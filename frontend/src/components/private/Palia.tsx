import React, { useEffect, useMemo, useRef, useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Download, Printer, ExternalLink, Maximize, FileText } from 'lucide-react';

const PaliaMobilePdf = lazy(() => import('./PaliaMobilePdf'));

const BRAND = '#fda8a9';
const BRAND_DARK = '#f88b8c';

interface PaliaProps {
  pdfPath?: string;
  fileName?: string;
}

const MOBILE_MQ = '(max-width: 767px)';

const Palia: React.FC<PaliaProps> = ({ pdfPath = '/pdfs/notes.pdf', fileName = 'panel.pdf' }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [narrowViewport, setNarrowViewport] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_MQ).matches : false
  );
  const [iframeFallback, setIframeFallback] = useState(false);

  const fileUrl = useMemo(() => {
    try {
      return new URL(pdfPath, window.location.origin).href;
    } catch {
      return pdfPath;
    }
  }, [pdfPath]);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const onChange = () => setNarrowViewport(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    setLoading(true);
    setIframeFallback(false);
  }, [pdfPath]);

  const usePdfJs = narrowViewport && !iframeFallback;

  const handleOpenNew = () => {
    if (pdfPath) {
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownload = () => {
    if (!pdfPath) return;
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handlePrint = () => {
    if (!pdfPath) return;
    const w = window.open(fileUrl, '_blank', 'noopener,noreferrer');
    if (w) {
      setTimeout(() => {
        try {
          w.focus();
          w.print();
        } catch (error) {
          console.error('Print failed:', error);
        }
      }, 800);
    }
  };

  const handleFullscreen = async () => {
    if (containerRef.current?.requestFullscreen) {
      try {
        await containerRef.current.requestFullscreen();
      } catch (error) {
        console.error('Fullscreen failed:', error);
      }
    }
  };

  const viewerFrameClass =
    'block w-full h-[min(720px,calc(100dvh-14rem))] sm:h-[min(720px,80dvh)] md:h-[720px]';

  return (
    <div className="w-full bg-gradient-to-br from-pink-50 to-rose-50 p-2 sm:p-4">
      <motion.div
        ref={containerRef}
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-w-6xl mx-auto"
        style={{ border: `3px solid ${BRAND}` }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      >
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-3 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-black truncate">Παλιό θέμα (PDF)</h1>
              <p className="text-pink-100 text-xs sm:text-sm truncate">{fileName}</p>
            </div>
          </div>
        </div>

        <div className={`relative bg-gray-100 min-h-[200px] ${viewerFrameClass}`}>
          {loading && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-t-transparent mb-3 sm:mb-4"
                style={{ borderColor: BRAND }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <p className="text-gray-600 font-semibold text-sm sm:text-base px-4 text-center">
                Φόρτωση PDF…
              </p>
            </motion.div>
          )}

          {usePdfJs ? (
            <div className="h-full w-full overflow-y-auto overflow-x-hidden overscroll-y-contain touch-pan-y">
              <Suspense
                fallback={
                  <div className="flex flex-col items-center justify-center min-h-[200px] py-8">
                    <div
                      className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mb-3"
                      style={{ borderColor: BRAND }}
                    />
                    <p className="text-gray-600 text-sm font-semibold">Άνοιγμα προβολής PDF…</p>
                  </div>
                }
              >
                <PaliaMobilePdf
                  fileUrl={fileUrl}
                  onReady={() => setLoading(false)}
                  onFatal={() => setIframeFallback(true)}
                  className="px-1 py-2"
                />
              </Suspense>
            </div>
          ) : (
            <iframe
              ref={frameRef}
              src={`${fileUrl}#navpanes=0`}
              title={fileName}
              width="100%"
              className={`${viewerFrameClass} border-0`}
              onLoad={() => setLoading(false)}
              allow="fullscreen"
              loading="eager"
            />
          )}
        </div>

        <div className="p-3 sm:p-6 bg-gradient-to-r from-pink-50 to-rose-50 border-t-2 border-pink-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
            <motion.button
              onClick={handleOpenNew}
              className="flex items-center justify-center gap-1.5 px-2 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-base font-semibold text-white shadow-lg touch-manipulation"
              style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})` }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="truncate">Άνοιγμα</span>
            </motion.button>

            <motion.button
              onClick={handleDownload}
              className="flex items-center justify-center gap-1.5 px-2 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-base font-semibold bg-white border-2 border-pink-300 text-gray-800 hover:border-pink-400 shadow-lg touch-manipulation"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="truncate">Λήψη</span>
            </motion.button>

            <motion.button
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 px-2 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-base font-semibold bg-white border-2 border-pink-300 text-gray-800 hover:border-pink-400 shadow-lg touch-manipulation"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Printer className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="truncate">Εκτύπωση</span>
            </motion.button>

            <motion.button
              onClick={handleFullscreen}
              className="flex items-center justify-center gap-1.5 px-2 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-base font-semibold bg-white border-2 border-pink-300 text-gray-800 hover:border-pink-400 shadow-lg touch-manipulation"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Maximize className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="truncate">Πλήρης</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Palia;
