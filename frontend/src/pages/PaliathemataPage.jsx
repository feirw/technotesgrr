import React from 'react';
import Palia from '../components/Palia.jsx';

const PaliathemataPage = () => {
  return (
    <div className="min-h-screen bg-[#fff2f2] p-10 text-center">

      {/* Κουμπί για scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-4 right-4 bg-[#ff7b7b] text-white rounded-full p-3 shadow-lg hover:bg-[#ffa9a9] transition-colors"
        title="Go to top"
      >
        ⬆
      </button>

      {/* <div className="max-w-4xl mx-auto bg-white/60 dark:bg-[#1f1f1f]/70 backdrop-blur-md rounded-xl shadow-lg p-8"> */}

        {/* Κουμπί με alert */}
        <button
          className="mt-6 px-6 py-3 bg-[#ffa9a9] text-black font-semibold rounded-lg shadow-md hover:bg-[#ff8c8c] transition"
        >
          Πατήστε εδώ
        </button>
      </div>
  );
};

export default PaliathemataPage;
