import React from 'react';
import Palia from '../components/Palia.jsx';

const PaliathemataPage = () => {
  return (
    <div className="min-h-screen bg-[#fff2f2] p-10 text-center">
      <button
        onClick={() => window.scrollTo(0, 0)}
        className="fixed bottom-4 right-4 bg-[#ff7b7b] text-white rounded-full p-3 shadow-lg hover:bg-[#ffa9a9] transition-colors"
      >
        <span className="material-icons">go on the top</span>
      </button>
      <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-md rounded-xl shadow-md p-8 sm:p-10">
        <Palia />
      </div>
    </div>
  );
};

export default PaliathemataPage;
