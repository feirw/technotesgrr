import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Printer, ExternalLink, Maximize, FileText } from 'lucide-react';

const BRAND = '#fda8a9';
const BRAND_DARK = '#f88b8c';

const Palia = ({ pdfPath = '/pdfs/notes.pdf', fileName = 'panel.pdf' }) => {
  const [loading, setLoading] = useState(true);
  const frameRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setLoading(true);
  }, [pdfPath]);

  const handleOpenNew = () => window.open(pdfPath, '_blank', 'noopener,noreferrer');

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = pdfPath;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handlePrint = () => {
    const w = window.open(pdfPath, '_blank', 'noopener,noreferrer');
    if (w) {
      setTimeout(() => {
        try {
          w.focus();
          w.print();
        } catch {}
      }, 800);
    }
  };

  const handleFullscreen = async () => {
    if (containerRef.current?.requestFullscreen) {
      await containerRef.current.requestFullscreen();
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className="bg-white rounded-3xl shadow-2xl overflow-hidden"
      style={{ border: `3px solid ${BRAND}` }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Σημειώσεις PDF</h1>
            <p className="text-pink-100 text-sm">{fileName}</p>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="relative bg-gray-100">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
            <motion.div
              className="w-16 h-16 rounded-full border-4 border-t-transparent mb-4"
              style={{ borderColor: BRAND }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-gray-600 font-semibold">Φόρτωση PDF...</p>
          </div>
        )}

        <iframe
          ref={frameRef}
          src={pdfPath}
          title={fileName}
          width="100%"
          height="720"
          className="block"
          onLoad={() => setLoading(false)}
          allow="fullscreen"
        />
      </div>

      {/* Actions */}
      <div className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 border-t-2 border-pink-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <motion.button
            onClick={handleOpenNew}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white shadow-lg"
            style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})` }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ExternalLink className="w-5 h-5" />
            <span className="hidden sm:inline">Νέο Παράθυρο</span>
          </motion.button>

          <motion.button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold bg-white border-2 border-pink-300 text-gray-800 hover:border-pink-400 shadow-lg"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-5 h-5" />
            <span className="hidden sm:inline">Λήψη</span>
          </motion.button>

          <motion.button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold bg-white border-2 border-pink-300 text-gray-800 hover:border-pink-400 shadow-lg"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Printer className="w-5 h-5" />
            <span className="hidden sm:inline">Εκτύπωση</span>
          </motion.button>

          <motion.button
            onClick={handleFullscreen}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold bg-white border-2 border-pink-300 text-gray-800 hover:border-pink-400 shadow-lg"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Maximize className="w-5 h-5" />
            <span className="hidden sm:inline">Πλήρης</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Palia;
