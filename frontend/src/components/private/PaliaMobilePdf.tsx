import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

type Props = {
  fileUrl: string;
  onReady: () => void;
  /** Αν αποτύχει το PDF.js (CORS, corrupt PDF), ο γονέας μπορεί να πέσει σε iframe. */
  onFatal?: () => void;
  className?: string;
};

type PdfProxy = {
  numPages: number;
  getPage: (n: number) => Promise<{ getViewport: (opts: { scale: number }) => { width: number; height: number } }>;
};

const INITIAL_VISIBLE_PAGES = 2;
/** Preload buffer γύρω από το viewport ώστε οι επόμενες σελίδες να είναι έτοιμες πριν φανούν. */
const OBSERVER_ROOT_MARGIN = '1200px 0px';

/**
 * Προβολή PDF με PDF.js — στο κινητό τα iframes συχνά κατεβάζουν αρχείο αντί για inline προβολή.
 * Οι σελίδες γίνονται render προοδευτικά (μόνο όσες πλησιάζουν το viewport) — σε πολυσέλιδα βιβλία
 * το render όλων των σελίδων μαζί καθυστερούσε αισθητά την πρώτη εμφάνιση περιεχομένου.
 */
const PaliaMobilePdf: React.FC<Props> = ({ fileUrl, onReady, onFatal, className }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(300);
  const [numPages, setNumPages] = useState(0);
  const [pageAspect, setPageAspect] = useState(1.414); // height/width — A4 fallback μέχρι να μετρηθεί η 1η σελίδα
  const [visiblePages, setVisiblePages] = useState<Set<number>>(
    () => new Set(Array.from({ length: INITIAL_VISIBLE_PAGES }, (_, i) => i + 1))
  );
  const firstPageReadyRef = useRef(false);

  const measure = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const w = el.getBoundingClientRect().width;
    if (w > 40) setWidth(Math.floor(w));
  }, []);

  useEffect(() => {
    firstPageReadyRef.current = false;
    setNumPages(0);
    setVisiblePages(new Set(Array.from({ length: INITIAL_VISIBLE_PAGES }, (_, i) => i + 1)));
  }, [fileUrl]);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    const el = wrapRef.current;
    if (el) ro.observe(el);
    window.addEventListener('orientationchange', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('orientationchange', measure);
    };
  }, [measure]);

  const onLoadSuccess = useCallback((pdf: PdfProxy) => {
    setNumPages(pdf.numPages);
    pdf
      .getPage(1)
      .then((page) => {
        const vp = page.getViewport({ scale: 1 });
        if (vp.width > 0) setPageAspect(vp.height / vp.width);
      })
      .catch(() => {});
  }, []);

  const onLoadError = useCallback(() => {
    onFatal?.();
    onReady();
  }, [onReady, onFatal]);

  const handleFirstPageRendered = useCallback(() => {
    if (firstPageReadyRef.current) return;
    firstPageReadyRef.current = true;
    onReady();
  }, [onReady]);

  const observerRef = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const newlyVisible: number[] = [];
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const n = Number((entry.target as HTMLElement).dataset.page);
            if (n) newlyVisible.push(n);
          }
        }
        if (newlyVisible.length === 0) return;
        setVisiblePages((prev) => {
          let changed = false;
          const next = new Set(prev);
          for (const n of newlyVisible) {
            if (!next.has(n)) {
              next.add(n);
              changed = true;
            }
          }
          return changed ? next : prev;
        });
      },
      { rootMargin: OBSERVER_ROOT_MARGIN, threshold: 0.01 }
    );
    return () => observerRef.current?.disconnect();
  }, []);

  const registerSlot = useCallback((el: HTMLDivElement | null) => {
    if (el && observerRef.current) observerRef.current.observe(el);
  }, []);

  const placeholderHeight = Math.round(width * pageAspect);

  const pdfOptions = useMemo(
    () => ({ disableStream: false, disableAutoFetch: false }),
    []
  );

  return (
    <div ref={wrapRef} className={className}>
      <Document
        file={fileUrl}
        onLoadSuccess={onLoadSuccess}
        onLoadError={onLoadError}
        loading={null}
        options={pdfOptions}
        className="flex flex-col items-center gap-2 pb-2"
      >
        {numPages > 0
          ? Array.from({ length: numPages }, (_, i) => {
              const pageNumber = i + 1;
              const isVisible = visiblePages.has(pageNumber);
              return (
                <div
                  key={pageNumber}
                  ref={registerSlot}
                  data-page={pageNumber}
                  style={!isVisible ? { width, height: placeholderHeight } : undefined}
                  className="bg-white shadow-sm"
                >
                  {isVisible ? (
                    <Page
                      pageNumber={pageNumber}
                      width={width}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      onRenderSuccess={pageNumber === 1 ? handleFirstPageRendered : undefined}
                      className="bg-white"
                    />
                  ) : null}
                </div>
              );
            })
          : null}
      </Document>
    </div>
  );
};

export default PaliaMobilePdf;
