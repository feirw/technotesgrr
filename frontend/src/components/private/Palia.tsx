import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  lazy,
  Suspense,
  Component,
  type ErrorInfo,
  type ReactNode,
} from 'react';
import { motion } from 'framer-motion';
import { Download, Printer, ExternalLink, Maximize, FileText, RefreshCw } from 'lucide-react';

const PaliaMobilePdf = lazy(() => import('./PaliaMobilePdf'));

const BRAND = '#fea2bb';
const BRAND_DARK = '#f088a5';

interface PaliaProps {
  pdfPath?: string;
  fileName?: string;
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

class PdfErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    this.props.onError();
  }

  componentDidUpdate(prevProps: { children: ReactNode }) {
    if (prevProps.children !== this.props.children && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

const Palia: React.FC<PaliaProps> = ({ pdfPath = '/pdfs/notes.pdf', fileName = 'panel.pdf' }) => {
  const [loading, setLoading] = useState(true);
  const [viewerError, setViewerError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const preferNative = usePreferNativePdfViewer();

  const fileUrl = useMemo(() => {
    try {
      return new URL(pdfPath, window.location.origin).href;
    } catch {
      return pdfPath;
    }
  }, [pdfPath]);

  const iframeSrc = `${fileUrl}#view=FitH&toolbar=1`;

  useEffect(() => {
    setLoading(true);
    setViewerError(false);
  }, [pdfPath, preferNative]);

  const handleIframeLoad = useCallback(() => {
    setLoading(false);
  }, []);

  const handleOpenNew = () => {
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handlePrint = () => {
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
    <div className="w-full bg-[#fff5f8] p-2 sm:p-4">
      <motion.div
        ref={containerRef}
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-w-6xl mx-auto"
        style={{ border: `3px solid ${BRAND}` }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      >
        <div
          className="text-gray-900 p-3 sm:p-6"
          style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})` }}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/35 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-black truncate">Παλιό θέμα (PDF)</h1>
              <p className="text-gray-800/80 text-xs sm:text-sm truncate">{fileName}</p>
            </div>
          </div>
        </div>

        <div className={`relative bg-gray-100 min-h-[200px] ${viewerFrameClass}`}>
          {loading && !viewerError && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white">
              <div
                className="mb-3 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent sm:mb-4 sm:h-16 sm:w-16"
                style={{ borderColor: BRAND }}
              />
              <p className="px-4 text-center text-sm font-semibold text-gray-600 sm:text-base">
                Φόρτωση PDF…
              </p>
            </div>
          )}

          {viewerError ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-white px-4 text-center">
              <FileText className="h-12 w-12 text-[#f088a5]" />
              <div>
                <h2 className="text-lg font-black text-gray-900 sm:text-xl">
                  Δεν ήταν δυνατή η προβολή του PDF.
                </h2>
                <p className="mt-2 text-sm font-semibold text-gray-600 sm:text-base">
                  Άνοιξέ το σε νέα καρτέλα ή κατέβασέ το από τα κουμπιά από κάτω.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setViewerError(false);
                  setLoading(true);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#fea2bb] px-4 py-3 text-sm font-bold text-gray-900 shadow"
              >
                <RefreshCw className="h-4 w-4" />
                Ξανά φόρτωση
              </button>
            </div>
          ) : preferNative ? (
            <iframe
              key={pdfPath}
              title={fileName}
              src={iframeSrc}
              className="block h-full w-full border-0 bg-white"
              onLoad={handleIframeLoad}
              onError={() => setViewerError(true)}
            />
          ) : (
            <div className="h-full w-full overflow-x-hidden overflow-y-auto overscroll-y-contain touch-pan-y">
              <Suspense
                fallback={
                  <div className="flex min-h-[200px] flex-col items-center justify-center py-8">
                    <div
                      className="mb-3 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"
                      style={{ borderColor: BRAND }}
                    />
                    <p className="text-sm font-semibold text-gray-600">Άνοιγμα προβολής PDF…</p>
                  </div>
                }
              >
                <PdfErrorBoundary onError={() => setViewerError(true)}>
                  <PaliaMobilePdf
                    key={pdfPath}
                    fileUrl={fileUrl}
                    onReady={() => setLoading(false)}
                    onFatal={() => setViewerError(true)}
                    className="px-1 py-2 sm:px-4"
                  />
                </PdfErrorBoundary>
              </Suspense>
            </div>
          )}
        </div>

        <div className="border-t-2 border-[#fea2bb]/30 bg-[#fff5f8] p-3 sm:p-6">
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
            <motion.button
              type="button"
              onClick={handleOpenNew}
              className="flex touch-manipulation items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-xs font-semibold text-gray-900 shadow-lg sm:rounded-xl sm:px-4 sm:py-3 sm:text-base"
              style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})` }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ExternalLink className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
              <span className="truncate">Άνοιγμα</span>
            </motion.button>

            <motion.button
              type="button"
              onClick={handleDownload}
              className="flex touch-manipulation items-center justify-center gap-1.5 rounded-lg border-2 border-[#fea2bb]/45 bg-white px-2 py-2.5 text-xs font-semibold text-gray-800 shadow-lg hover:border-[#fea2bb] sm:rounded-xl sm:px-4 sm:py-3 sm:text-base"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
              <span className="truncate">Λήψη</span>
            </motion.button>

            <motion.button
              type="button"
              onClick={handlePrint}
              className="flex touch-manipulation items-center justify-center gap-1.5 rounded-lg border-2 border-[#fea2bb]/45 bg-white px-2 py-2.5 text-xs font-semibold text-gray-800 shadow-lg hover:border-[#fea2bb] sm:rounded-xl sm:px-4 sm:py-3 sm:text-base"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Printer className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
              <span className="truncate">Εκτύπωση</span>
            </motion.button>

            <motion.button
              type="button"
              onClick={handleFullscreen}
              className="flex touch-manipulation items-center justify-center gap-1.5 rounded-lg border-2 border-[#fea2bb]/45 bg-white px-2 py-2.5 text-xs font-semibold text-gray-800 shadow-lg hover:border-[#fea2bb] sm:rounded-xl sm:px-4 sm:py-3 sm:text-base"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Maximize className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
              <span className="truncate">Πλήρης</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Palia;
