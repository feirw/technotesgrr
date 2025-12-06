import React from 'react';
import Notes from '../../components/private/Notes';

const NotesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-pink-50 py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        <Notes />
      </div>
    </div>
  );
};

export default NotesPage;
