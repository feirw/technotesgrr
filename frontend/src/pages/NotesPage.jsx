import Notes from '../components/Notes.jsx';
import Palia from '../components/Palia.jsx';
// import FlipbookViewer from '../components/FlipbookViewer.jsx';

const NotesPage = () => {
  return (
    <div className="min-h-screen bg-pink-50 py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        <Notes />
        <Palia />
      </div>
    </div>
  );
};

export default NotesPage;
