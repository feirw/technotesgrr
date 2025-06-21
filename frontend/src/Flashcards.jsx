import React from 'react';
import { FlashcardArray } from "react-quizlet-flashcard";

const Flashcards = () => {
  const cards = [
    {
      id: 1,
      frontHTML: <div className="flex h-full items-center justify-center text-center text-2xl">Τι είναι η μεταβλητή;</div>,
      backHTML: <div className="flex h-full items-center justify-center text-center text-2xl">Θέση μνήμης στην οποία μπορούμε να αποθηκεύσουμε δεδομένα.</div>,
    },
    {
      id: 2,
      frontHTML: <div className="flex h-full items-center justify-center text-center text-2xl">Ποια εντολή χρησιμοποιούμε για είσοδο δεδομένων στην ΓΛΩΣΣΑ;</div>,
      backHTML: <div className="flex h-full items-center justify-center text-center text-2xl">ΔΙΑΒΑΣΕ</div>,
    },
    {
      id: 3,
      frontHTML: <div className="flex h-full items-center justify-center text-center text-2xl">Ποια εντολή χρησιμοποιούμε για έξοδο δεδομένων στην ΓΛΩΣΣΑ;</div>,
      backHTML: <div className="flex h-full items-center justify-center text-center text-2xl">ΓΡΑΨΕ</div>,
    },
  ];

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-xl">
        <FlashcardArray cards={cards} style={{ width: 400, height: 300 }}/>
      </div>
    </div>
  );
};

export default Flashcards;