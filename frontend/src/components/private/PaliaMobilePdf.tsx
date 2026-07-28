import React, { useCallback, useEffect, useRef, useState } from 'react';
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

/**
 * Προβολή PDF με PDF.js — στο κινητό τα iframes συχνά κατεβάζουν αρχείο αντί για inline προβολή.
 */
const PaliaMobilePdf: React.FC<Props> = ({ fileUrl, onReady, onFatal, className }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(300);
  const [numPages, setNumPages] = useState(0);

  const measure = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const w = el.getBoundingClientRect().width;
    if (w > 40) setWidth(Math.floor(w));
  }, []);

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

  const onLoadSuccess = useCallback(
    (pdf: { numPages: number }) => {
      setNumPages(pdf.numPages);
      onReady();
    },
    [onReady]
  );

  const onLoadError = useCallback(() => {
    onFatal?.();
    onReady();
  }, [onReady, onFatal]);

  return (
    <div ref={wrapRef} className={className}>
      <Document
        file={fileUrl}
        onLoadSuccess={onLoadSuccess}
        onLoadError={onLoadError}
        loading={null}
        className="flex flex-col items-center gap-2 pb-2"
      >
        {numPages > 0
          ? Array.from({ length: numPages }, (_, i) => (
              <Page
                key={i + 1}
                pageNumber={i + 1}
                width={width}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="shadow-sm bg-white"
              />
            ))
          : null}
      </Document>
    </div>
  );
};

export default PaliaMobilePdf;
