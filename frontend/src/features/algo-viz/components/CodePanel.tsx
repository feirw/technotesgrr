import React from 'react';

export const CodePanel: React.FC<{ lines: string[]; active: number }> = ({ lines, active }) => (
  <div className="h-full overflow-auto rounded-2xl border border-[#ff97b2]/25 bg-[#1a1028] p-3 font-mono text-[12px] leading-6 text-slate-100 shadow-sm sm:p-4 sm:text-[13px]">
    {lines.map((line, index) => {
      const isKw = /^(Αλγόριθμος|Δεδομένα|Αποτελέσματα|Για |Όσο |Αν |αλλιώς|Τέλος|άξονας|κλειδί)/.test(line.trim()) ||
        /\b(Για|Όσο|Αν|τότε|αλλιώς|Τέλος_αν|Τέλος_επανάληψης|Αντιμετάθεσε|DIV)\b/.test(line);
      return (
        <div
          key={index}
          className={`flex gap-3 rounded-md px-2 py-0.5 ${
            index === active ? 'bg-emerald-400/25 font-semibold text-white' : ''
          }`}
        >
          <span className="w-6 shrink-0 select-none text-right text-slate-500">{index + 1}</span>
          <span className={isKw && index !== active ? 'text-[#c4b5fd]' : ''}>{line || ' '}</span>
        </div>
      );
    })}
  </div>
);
