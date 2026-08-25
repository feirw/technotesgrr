/** Εμφάνιση τιμής σε κόμβο: Infinity, επιστημονική μορφή, περικοπή μεγάλων labels. */
export function formatNodeLabel(raw: string | number, maxChars = 6): string {
  const s = String(raw).trim();
  if (!s) return s;
  if (s === 'Infinity' || s === '∞') return '∞';
  if (s === '-Infinity' || s === '-∞') return '-∞';

  const n = Number(s);
  if (/^-?\d+(\.\d+)?([eE][-+]?\d+)?$/.test(s) && !Number.isFinite(n)) {
    return s.startsWith('-') ? '-∞' : '∞';
  }

  if (Number.isFinite(n) && s.length > maxChars) {
    const abs = Math.abs(n);
    if (abs >= 1e6 || (abs > 0 && abs < 1e-3)) {
      return n.toExponential(1).replace('+', '');
    }
  }

  if (s.length <= maxChars) return s;
  return `${s.slice(0, Math.max(1, maxChars - 1))}…`;
}
