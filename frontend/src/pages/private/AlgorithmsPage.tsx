import React from 'react';

const AlgorithmsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fff2f2] p-10 text-center flex justify-center">
      <iframe
        src="https://evripides.mysch.gr/dave/"
        height="1000"
        width="1450"
        title="Algorithms Visualization"
        className="max-w-full border-none shadow-xl rounded-xl"
      />
    </div>
  );
};

export default AlgorithmsPage;
