import { notes } from '../utils/notes';

const Notes = () => {
  return (
    <div className="flex h-screen flex-col items-center gap-8">
      {notes.map((note) => (
        <div
          key={note.id}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow w-full max-w-2xl"
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-800">{note.title}</h3>
          <p className="text-sm text-pink-600 mb-3">{note.subject}</p>

          {note.pdfUrl && (
            <div className="mb-4">
              <iframe
                src={note.pdfUrl}
                width="100%"
                height="300"
                className="rounded border"
                title={`Preview of ${note.title}`}
              />
            </div>
          )}

          <div className="flex flex-col items-center gap-3 mb-4">
            <a
              href={note.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-xs text-center py-2 px-4 rounded-lg transition-colors bg-blue-500 text-white hover:bg-blue-600"
            >
              Προβολή σε νέο παράθυρο
            </a>
            <a
              href={note.pdfUrl}
              download
              className="w-full max-w-xs text-center py-2 px-4 rounded-lg transition-colors bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Λήψη PDF
            </a>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-pink-600">€{note.price}</span>
            <button className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors">
              Αγορά
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notes;
