const Palia = () => {
  // Αν το palia.pdf βρίσκεται στον φάκελο public/
  const pdfUrl = '/pdfs/panel.pdf';

  return (
    <div className="flex h-screen flex-col items-center gap-8 p-6 bg-[#fff2f2]">
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow w-full max-w-2xl">
        {/* Ενσωμάτωση PDF */}
        <div className="mb-4">
          <iframe
            src={pdfUrl}
            width="100%"
            height="500"
            className="rounded border"
            title="panel.pdf"
          />
        </div>

        {/* Κουμπιά προβολής και λήψης */}
        <div className="flex flex-col items-center gap-3 mb-4">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-xs text-center py-2 px-4 rounded-lg transition-colors bg-[#ffabaa] text-white hover:bg-gray-300"
          >
            Προβολή σε νέο παράθυρο
          </a>
          <a
            href={pdfUrl}
            download
            className="w-full max-w-xs text-center py-2 px-4 rounded-lg transition-colors bg-[#ffabaa] text-white hover:bg-gray-300"
          >
            Λήψη PDF
          </a>
        </div>

        {/* Κουμπί αγοράς */}
        <div className="flex justify-between items-center"></div>
      </div>
    </div>
  );
};

export default Palia;
