import React, { useEffect, useRef, useState } from "react";

const BTN =
  "w-full max-w-xs text-center py-2 px-4 rounded-lg font-semibold shadow transition focus:outline-none focus:ring-2 focus:ring-offset-2";
const BTN_PRIMARY = `${BTN} bg-[#feabab] text-black hover:bg-[#fd9a9a] focus:ring-[#feabab]`;
const BTN_SECONDARY = `${BTN} bg-white text-gray-800 hover:bg-gray-100 border border-gray-200 focus:ring-gray-300`;

const Palia = ({ pdfPath = "/pdfs/panel.pdf", fileName = "panel.pdf" }) => {
  const [loading, setLoading] = useState(true);
  const [timedOut, setTimedOut] = useState(false);
  const frameRef = useRef(null);
  const containerRef = useRef(null);

  // Timeout fallback αν αργήσει πολύ να φορτώσει το iframe
  useEffect(() => {
    setLoading(true);
    setTimedOut(false);
    const t = setTimeout(() => setTimedOut(true), 8000);
    return () => clearTimeout(t);
  }, [pdfPath]);

  const handleOpenNew = () => {
    window.open(pdfPath, "_blank", "noopener,noreferrer");
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = pdfPath;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handlePrint = () => {
    // Ανοίγουμε σε νέο tab και κάνουμε print (οι περισσότεροι browsers το τιμάνε)
    const w = window.open(pdfPath, "_blank", "noopener,noreferrer");
    if (w) {
      const tryPrint = () => {
        try {
          w.focus();
          w.print();
        } catch {
          // ignore
        }
      };
      setTimeout(tryPrint, 800);
    }
  };

  const handleFullscreen = async () => {
    try {
      if (containerRef.current?.requestFullscreen) {
        await containerRef.current.requestFullscreen();
      } else if (frameRef.current?.requestFullscreen) {
        await frameRef.current.requestFullscreen();
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center gap-8 p-6 bg-[#fff2f2]">
      <div
        ref={containerRef}
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl transition-shadow hover:shadow-2xl"
      >
        <header className="mb-4">
          <h1 className="text-xl font-bold">Παλιά Θέματα Οργανωμένα (PDF)</h1>
          <p className="text-gray-500 text-sm">
            Αν δεν εμφανίζεται, πάτα «Προβολή σε νέο παράθυρο».
          </p>
        </header>

        {/* Viewer */}
        <div className="mb-4 rounded border overflow-hidden relative">
          {/* Loading skeleton */}
          {loading && (
            <div className="h-[60vh] min-h-[420px] w-full animate-pulse bg-gray-100 grid place-items-center">
              <span className="text-gray-500">Φόρτωση PDF…</span>
            </div>
          )}

          {/* Fallback μήνυμα αν αργεί υπερβολικά */}
          {loading && timedOut && (
            <div className="absolute inset-x-0 bottom-0 m-3 rounded bg-yellow-50 border border-yellow-200 p-3 text-yellow-800 text-sm shadow">
              Αργεί να φορτώσει; Μπορεί να το μπλοκάρει ο browser. Δοκίμασε
              «Προβολή σε νέο παράθυρο».
            </div>
          )}

          <iframe
            ref={frameRef}
            src={pdfPath}
            title={fileName}
            width="100%"
            height="720"
            className={`block ${loading ? "invisible absolute -z-10" : ""}`}
            onLoad={() => setLoading(false)}
            allow="fullscreen"
            allowFullScreen
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:justify-center gap-3">
          <button
            onClick={handleOpenNew}
            className={BTN_PRIMARY}
            aria-label="Προβολή PDF σε νέο παράθυρο"
          >
            Προβολή σε νέο παράθυρο
          </button>

          <button
            onClick={handleDownload}
            className={BTN_PRIMARY}
            aria-label="Λήψη PDF"
          >
            Λήψη PDF
          </button>

          <button
            onClick={handlePrint}
            className={BTN_SECONDARY}
            aria-label="Εκτύπωση PDF"
          >
            Εκτύπωση
          </button>

          <button
            onClick={handleFullscreen}
            className={BTN_SECONDARY}
            aria-label="Πλήρης οθόνη"
          >
            Πλήρης οθόνη
          </button>
        </div>
      </div>
    </div>
  );
};

export default Palia; 