import React, { useState } from 'react';
import Palia from '../components/Palia.jsx';

// 👉 Βάλε εδώ τις σωστές χρονιές για κάθε κατηγορία
const KANONIKES_YEARS = [
  2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015,
  2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024,
];

const EPANALIPTIKES_YEARS = [
  2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015,
  2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024,
];

const BTN_BASE =
  'px-6 py-3 bg-[#feabab] text-black font-semibold rounded-lg shadow-md ' +
  'hover:bg-[#fd9a9a] transition focus:outline-none focus:ring-2 ' +
  'focus:ring-offset-2 focus:ring-[#feabab]';

const TAB_BTN =
  'px-5 py-2 rounded-full font-semibold ' +
  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#feabab]';

const PaliathemataPage = () => {
  const [mode, setMode] = useState('kanonikes');
  const [selectedYear, setSelectedYear] = useState(null);

  const visibleYears = Array.from(
    new Set(mode === 'kanonikes' ? KANONIKES_YEARS : EPANALIPTIKES_YEARS)
  ).sort((a, b) => a - b);

  const handleYearClick = (year) => {
    setSelectedYear(year);
    // εδώ θα μπορούσες να ορίσεις path ανάλογα το mode/year
    // π.χ. `/pdfs/${mode}/${year}.pdf`
  };

  return (
    <div className="min-h-screen bg-[#fff2f2] flex flex-col items-center p-6">
      {/* Τίτλος & περιγραφή */}
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold">Παλιά Θέματα</h1>
        <p className="text-gray-600">Διάλεξε κατηγορία και έτος για να δεις τα θέματα.</p>
      </div>

      {/* Tabs */}
      <div
        className="inline-flex items-center gap-2 bg-white p-1 rounded-full shadow mb-6"
        role="tablist"
        aria-label="Επιλογή κατηγορίας"
      >
        <button
          role="tab"
          aria-selected={mode === 'kanonikes'}
          className={`${TAB_BTN} ${
            mode === 'kanonikes'
              ? 'bg-[#feabab] text-black'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => {
            setMode('kanonikes');
            setSelectedYear(null);
          }}
        >
          Κανονικές
        </button>
        <button
          role="tab"
          aria-selected={mode === 'epanaliptikes'}
          className={`${TAB_BTN} ${
            mode === 'epanaliptikes'
              ? 'bg-[#feabab] text-black'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => {
            setMode('epanaliptikes');
            setSelectedYear(null);
          }}
        >
          Επαναληπτικές
        </button>
      </div>

      {/* Λίστα ετών */}
      {visibleYears.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
          {visibleYears.map((year) => (
            <button
              key={`${mode}-${year}`}
              className={BTN_BASE}
              onClick={() => handleYearClick(year)}
              aria-label={`${mode === 'kanonikes' ? 'Κανονικές' : 'Επαναληπτικές'} ${year}`}
            >
              {year}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Δεν υπάρχουν διαθέσιμες χρονιές για αυτή την κατηγορία.</p>
      )}

      {/* Προβολή PDF μόνο όταν έχει επιλεγεί έτος */}
      {selectedYear && (
        <div className="mt-10 w-full max-w-4xl">
          <Palia
            pdfPath={`/pdfs/${mode}/${selectedYear}.pdf`}
            fileName={`${mode}-${selectedYear}.pdf`}
          />
        </div>
      )}

      {/* Go to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-4 right-4 bg-[#ff7b7b] text-white rounded-full p-3 shadow-lg hover:bg-[#ffa9a9] transition-colors"
        aria-label="Μετάβαση στην κορυφή"
      >
        ↑
      </button>
    </div>
  );
};

export default PaliathemataPage;
