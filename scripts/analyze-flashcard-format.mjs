import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, '../frontend/src/data/flashcards');

const NUMBERED_SPLIT_RE =
  /\s+(?=\d+\.\s+(?:[Α-ΩΑ-ωA-Za-z«"(]|ΚΑΤΑΝΟΗΣΗ|ΑΝΑΛΥΣΗ|ΕΠΙΛΥΣΗ|Ώθηση|Απώθηση|Εισαγωγή|Εξαγωγή|Συντακτικά|Ενθυλάκωση|Πρώτα|Δίνεται|Το αλφάβητο|Ρίζα|Κανόνες))/;

const NOTE_PREFIX_RE = /\s+(Σημείωση:|Έλεγχος:|Πρώτα:|Στη συνέχεια:)\s+/;

function parseFlashcardText(text) {
  const trimmed = (text || '').trim();
  if (!trimmed) return [{ type: 'empty' }];

  const numbered = tryParseNumberedList(trimmed);
  if (numbered) return numbered;
  const bullet = tryParseBulletList(trimmed, '•');
  if (bullet) return bullet;
  const check = tryParseBulletList(trimmed, '✓');
  if (check) return check;
  return [{ type: 'paragraph', content: trimmed }];
}

function tryParseNumberedList(text) {
  const parts = text.split(NUMBERED_SPLIT_RE);
  if (parts.length < 2) return null;
  return [{ type: 'ordered-list', count: parts.length - 1 }];
}

function tryParseBulletList(text, marker) {
  if (!text.includes(marker)) return null;
  const parts = text.split(new RegExp(`\\s*${marker}\\s+`)).filter(Boolean);
  if (parts.length < 2) return null;
  return [{ type: 'bullet-list', marker, count: parts.length }];
}

function hasExplicitMarkers(text) {
  return {
    bullet: text.includes('•'),
    check: text.includes('✓'),
    bold: /\*\*[^*]+\*\*/.test(text),
    arrow: text.includes('➢'),
    numbered: /\d+\.\s+/.test(text),
  };
}

function detectMissedPatterns(text) {
  const missed = [];
  const t = text.trim();
  if (!t) return missed;

  const parsed = parseFlashcardText(t);
  const isList = parsed.some((b) => b.type === 'ordered-list' || b.type === 'bullet-list');
  const markers = hasExplicitMarkers(t);

  // Numbered exists but parser failed
  if (markers.numbered && !parsed.some((b) => b.type === 'ordered-list')) {
    missed.push('numbered_unparsed');
  }

  // ➢ pseudo-bullets
  if (markers.arrow && !isList) missed.push('arrow_bullet');

  // "Δυο/Δύο στοιχεία ... είναι:" list
  if (/[Δδ]ύο\s+στοιχε/i.test(t) && /είναι:/i.test(t) && !isList) {
    missed.push('duo_stoicheia_colon');
  }

  // ➢ not handled by parser (only • and ✓ are)
  if (t.includes('➢') && !isList) missed.push('arrow_bullet_unparsed');

  // Comparison table rows (Δένδρο ... / Γράφος ...)
  if (/\d+\.\s+\w+:\s*\S+\s+\S+\s*\/\s*\S+/i.test(t)) {
    missed.push('comparison_table_numbered');
  }

  // Short comma-only enumeration (answer lists, not prose)
  if (!isList && !markers.bullet && !markers.numbered) {
    const commaParts = t.split(/,\s+/);
    const looksLikeProse = /\.\s/.test(t) && commaParts.some((p) => p.length > 80);
    if (commaParts.length >= 3 && t.length < 250 && !looksLikeProse) {
      missed.push('short_comma_list');
    }
  }

  // Label: value blocks (Σύνταξη / Λειτουργία / Παράδειγμα)
  const labelCount = (t.match(/(?:Σύνταξη|Λειτουργία|Παράδειγμα|Χαρακτηριστικό|Σημαντικό):/g) || [])
    .length;
  if (labelCount >= 2 && !isList) missed.push('label_blocks');

  // Colon intro + "και" items (Δυο στοιχεία style without bullet)
  if (/είναι:\s+[Α-Ωα-ω«"']/.test(t) && /\s+και\s+/.test(t.split(':').pop()) && !isList) {
    missed.push('colon_kai_items');
  }

  // Parenthetical count in question fronts - not back formatting
  if (/\(\d+\)/.test(t) && t.endsWith('?')) missed.push('paren_count_question');

  return missed;
}

function categorizeSide(text) {
  const t = (text || '').trim();
  if (!t) return 'empty';

  const parsed = parseFlashcardText(t);
  const markers = hasExplicitMarkers(t);
  const isParsedList = parsed.some((b) => b.type === 'ordered-list' || b.type === 'bullet-list');

  if (isParsedList || markers.bullet || markers.check || markers.bold || markers.arrow) {
    return 'already_formatted';
  }

  const missed = detectMissedPatterns(t);
  if (missed.length > 0) return { category: 'needs_formatting', patterns: missed };

  return 'single_paragraph';
}

const files = fs
  .readdirSync(dir)
  .filter((f) => /^chap\d+\.json$/.test(f))
  .sort((a, b) => parseInt(a.match(/\d+/)[0], 10) - parseInt(b.match(/\d+/)[0], 10));

let totalCards = 0;
const globalPatternCounts = {};
const needsFormattingByChapter = {};
const alreadyFormattedSamples = {};
const perChapter = {};

for (const file of files) {
  const chap = file.replace('.json', '');
  const cards = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
  totalCards += cards.length;
  needsFormattingByChapter[chap] = [];
  alreadyFormattedSamples[chap] = [];
  perChapter[chap] = { cards: cards.length, already: 0, needs: 0, paragraph: 0, back: { already: 0, needs: 0, paragraph: 0 } };

  for (const card of cards) {
    for (const side of ['front', 'back']) {
      const text = card[side] || '';
      const result = categorizeSide(text);
      const cat = typeof result === 'string' ? result : result.category;

      if (cat === 'already_formatted') {
        perChapter[chap].already++;
        if (alreadyFormattedSamples[chap].length < 2) {
          alreadyFormattedSamples[chap].push({ id: card.id, side, preview: text.slice(0, 100) });
        }
      } else if (cat === 'needs_formatting') {
        perChapter[chap].needs++;
        if (side === 'back') perChapter[chap].back.needs++;
        result.patterns.forEach((p) => {
          globalPatternCounts[p] = (globalPatternCounts[p] || 0) + 1;
        });
        if (needsFormattingByChapter[chap].length < 8) {
          needsFormattingByChapter[chap].push({
            id: card.id,
            side,
            patterns: result.patterns,
            preview: text.slice(0, 200).replace(/\n/g, ' '),
          });
        }
      } else if (cat === 'single_paragraph') {
        perChapter[chap].paragraph++;
        if (side === 'back') perChapter[chap].back.paragraph++;
      }
    }
  }
}

const totalNeeds = Object.values(perChapter).reduce((s, c) => s + c.needs, 0);
const totalAlready = Object.values(perChapter).reduce((s, c) => s + c.already, 0);
const totalPara = Object.values(perChapter).reduce((s, c) => s + c.paragraph, 0);

// Numbered lists present but not parsed
const numberedUnparsed = [];
for (const file of files) {
  const chap = file.replace('.json', '');
  const cards = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
  for (const card of cards) {
    for (const side of ['front', 'back']) {
      const t = (card[side] || '').trim();
      if (/\d+\.\s+/.test(t) && !(NUMBERED_SPLIT_RE.test(t) && t.split(NUMBERED_SPLIT_RE).length >= 2)) {
        numberedUnparsed.push({ chap, id: card.id, side, preview: t.slice(0, 150) });
      }
    }
  }
}

// Cards with ➢ not handled by parser
const arrowBullets = [];
for (const file of files) {
  const chap = file.replace('.json', '');
  const cards = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
  for (const card of cards) {
    for (const side of ['front', 'back']) {
      const t = card[side] || '';
      if (t.includes('➢')) arrowBullets.push({ chap, id: card.id, side });
    }
  }
}

console.log(
  JSON.stringify(
    {
      totalCards,
      totalSides: totalCards * 2,
      summary: { already_formatted: totalAlready, needs_formatting: totalNeeds, single_paragraph: totalPara },
      globalPatternCounts: Object.fromEntries(
        Object.entries(globalPatternCounts).sort((a, b) => b[1] - a[1]),
      ),
      numberedUnparsed,
      arrowBullets,
      perChapter,
      needsFormattingByChapter,
      alreadyFormattedSamples,
    },
    null,
    2,
  ),
);
