import React from 'react';

type ListItemNode =
  | string
  | {
      main: string;
      subBullets: string[];
    };

type FlashcardBlock =
  | { type: 'paragraph'; content: string }
  | { type: 'labeled'; label: string; content: string }
  | { type: 'section'; title: string }
  | { type: 'ordered-list'; items: ListItemNode[] }
  | { type: 'bullet-list'; items: string[]; marker: '•' | '✓' | '➢' };

const BULLET_MARKERS = ['•', '✓', '➢'] as const;

const NOTE_PREFIXES =
  'Σημείωση|Σημαντικό|Παράδειγμα|Κενό δένδρο|Εκτέλεση|Επικέντρωση|Παρομοίωση|Αποκλίσεις|Συντάκτης|Πηγαίο πρόγραμμα|Έλεγχος';

const NOTE_PREFIX_RE = new RegExp(`\\s+(${NOTE_PREFIXES}):\\s+`);

const SECTION_LABELS =
  'Σύνταξη|Λειτουργία|Παράδειγμα|Χαρακτηριστικά|Χαρακτηριστικό|Συντάκτης|Μεταγλωττιστής|Διερμηνευτής|Συνδετής|Πηγαίο πρόγραμμα|Επικέντρωση|Σχέση|Προσέγγιση|Παρομοίωση|Εκτέλεση|Αποκλίσεις|Κλάση|Αντικείμενο|Δένδρο|Γράφος|Προσπέλαση|Πίνακας|Λίστα|Φυσικές γλώσσες|Τεχνητές γλώσσες|Επίπεδα αλλαγών|Πρώτα|Στη συνέχεια|Ρίζα|Κανόνες|Κατεύθυνση|Ροή|Βρόχοι|Συνδέσεις|Ακμές|Ορισμός|Κλήση|Επιστροφή|Αρχή|Μειονέκτημα|Πλεονέκτημα';

const NUMBERED_SPLIT_RE = /\s+(?=\d+\.\s+\p{L})/u;

const TERM_DEFINITION_RE =
  /(?:^|\s)([\p{L}][\p{L}\s]*(?:\([^)]+\))?):(?=\s)/gu;

function preprocessText(text: string): string {
  return text.replace(/\*\*([^*]+?):\s+\*\*/g, '**$1:** ');
}

function parseListItem(item: string): ListItemNode {
  if (!item.includes(' • ')) return item;

  const [main, ...rest] = item.split(/\s•\s/);
  return {
    main: main.trim(),
    subBullets: rest.map((part) => part.trim()).filter(Boolean),
  };
}

function splitTrailingNote(text: string): { body: string; note?: string } {
  const match = text.match(NOTE_PREFIX_RE);
  if (!match || match.index === undefined || match.index === 0) {
    return { body: text };
  }

  return {
    body: text.slice(0, match.index).trim(),
    note: text.slice(match.index).trim(),
  };
}

function tryParseLabelBlocks(text: string): FlashcardBlock[] | null {
  const labelPattern = `(?:\\*\\*)?(${SECTION_LABELS})(?:\\*\\*)?:\\s*`;
  const matches = [...text.matchAll(new RegExp(labelPattern, 'g'))];
  if (matches.length < 1) return null;

  const blocks: FlashcardBlock[] = [];
  const intro = text.slice(0, matches[0].index).trim();
  if (intro) blocks.push({ type: 'paragraph', content: intro });

  matches.forEach((match, index) => {
    const label = match[1];
    const start = match.index! + match[0].length;
    const end = matches[index + 1]?.index ?? text.length;
    const content = text.slice(start, end).trim();
    if (content || matches.length === 1) blocks.push({ type: 'labeled', label, content });
  });

  return blocks.length > 0 && (matches.length >= 2 || blocks.some((b) => b.type === 'labeled'))
    ? blocks
    : matches.length === 1 && blocks.some((b) => b.type === 'labeled')
      ? blocks
      : null;
}

function tryParsePhasedNumberedList(text: string): FlashcardBlock[] | null {
  if (!/(Πρώτα|Στη συνέχεια):/.test(text)) return null;

  const blocks: FlashcardBlock[] = [];
  const introMatch = text.match(/^(.+?)(?=Πρώτα:|Στη συνέχεια:)/s);
  if (introMatch?.[1]?.trim()) {
    blocks.push({ type: 'paragraph', content: introMatch[1].trim() });
  }

  const phaseRegex = /(Πρώτα|Στη συνέχεια):\s*(.*?)(?=(?:Πρώτα|Στη συνέχεια):|$)/gs;
  let found = false;

  for (const match of text.matchAll(phaseRegex)) {
    found = true;
    const label = match[1];
    const body = match[2].trim();
    blocks.push({ type: 'labeled', label, content: '' });

    const numbered = tryParseNumberedList(body);
    if (numbered) {
      numbered.forEach((block) => blocks.push(block));
    } else {
      blocks[blocks.length - 1] = { type: 'labeled', label, content: body };
    }
  }

  return found ? blocks : null;
}

function tryParseNumberedList(text: string): FlashcardBlock[] | null {
  const parts = text.split(NUMBERED_SPLIT_RE);
  if (parts.length < 2) return null;

  const blocks: FlashcardBlock[] = [];
  const intro = parts[0].trim();
  if (intro) blocks.push({ type: 'paragraph', content: intro });

  const rawItems = parts.slice(1).map((part) => part.replace(/^\d+\.\s+/u, '').trim());
  const items: ListItemNode[] = [];
  const trailing: string[] = [];

  rawItems.forEach((item, index) => {
    if (index === rawItems.length - 1) {
      const { body, note } = splitTrailingNote(item);
      items.push(parseListItem(body));
      if (note) trailing.push(note);
      return;
    }
    items.push(parseListItem(item));
  });

  blocks.push({ type: 'ordered-list', items });
  trailing.forEach((note) => blocks.push({ type: 'paragraph', content: note }));
  return blocks;
}

function tryParseBulletList(text: string, marker: (typeof BULLET_MARKERS)[number]): FlashcardBlock[] | null {
  if (!text.includes(marker)) return null;

  const parts = text
    .split(new RegExp(`\\s*${marker}\\s+`))
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length < 2) return null;

  const blocks: FlashcardBlock[] = [];
  const startsWithMarker = text.trimStart().startsWith(marker);

  if (!startsWithMarker) {
    blocks.push({ type: 'paragraph', content: parts[0] });
    const bulletParts = parts.slice(1);
    const last = bulletParts[bulletParts.length - 1];
    const { body, note } = splitTrailingNote(last);
    const items = [...bulletParts.slice(0, -1), body];
    blocks.push({ type: 'bullet-list', items, marker });
    if (note) blocks.push({ type: 'paragraph', content: note });
    return blocks;
  }

  const last = parts[parts.length - 1];
  const { body, note } = splitTrailingNote(last);
  const items = [...parts.slice(0, -1), body];
  blocks.push({ type: 'bullet-list', items, marker });
  if (note) blocks.push({ type: 'paragraph', content: note });
  return blocks;
}

function tryParseAnyBulletList(text: string): FlashcardBlock[] | null {
  for (const marker of BULLET_MARKERS) {
    const parsed = tryParseBulletList(text, marker);
    if (parsed) return parsed;
  }
  return null;
}

function tryParseSectionedBullets(text: string): FlashcardBlock[] | null {
  if (!text.includes(' • ')) return null;

  const parts = text.split(/\s•\s/).map((part) => part.trim()).filter(Boolean);
  if (parts.length < 2) return null;

  const hasSectionHeaders = parts.some(
    (part) => /^[^•]{0,60}:$/.test(part) || /^[^•]{0,60}:\s*$/.test(part),
  );
  const hasNestedLabels = parts.some(
    (part, index) => index > 0 && /^[^:]+:\s+\S/.test(part) && !part.startsWith('- '),
  );

  if (!hasSectionHeaders && !hasNestedLabels) return null;

  const blocks: FlashcardBlock[] = [];

  parts.forEach((part) => {
    if (/^[^:]+:\s*$/.test(part) && part.length < 60) {
      blocks.push({ type: 'section', title: part.replace(/:\s*$/, '') });
      return;
    }

    const labelMatch = part.match(/^([^:]+):\s+(.+)$/s);
    if (labelMatch && labelMatch[1].length < 40) {
      blocks.push({ type: 'labeled', label: labelMatch[1].trim(), content: labelMatch[2].trim() });
      return;
    }

    blocks.push({ type: 'paragraph', content: part });
  });

  return blocks.length > 1 ? blocks : null;
}

function tryParseTermDefinitions(text: string): FlashcardBlock[] | null {
  const matches = [...text.matchAll(TERM_DEFINITION_RE)];
  if (matches.length < 3) return null;

  const blocks: FlashcardBlock[] = [];

  matches.forEach((match, index) => {
    const label = match[1].trim();
    const start = match.index! + match[0].length;
    const end = matches[index + 1]?.index ?? text.length;
    const content = text.slice(start, end).trim();
    if (content) blocks.push({ type: 'labeled', label, content });
  });

  return blocks.length >= 3 ? blocks : null;
}

function tryParseCommaList(text: string): FlashcardBlock[] | null {
  if (text.includes('•') || text.includes('✓') || text.includes('➢')) return null;
  if (/\d+\.\s+\p{L}/u.test(text)) return null;
  if (text.includes('. ') && !/^\([^)]+\)(,\s)/.test(text)) return null;

  const parts = text.split(/,\s+/).map((p) => p.trim()).filter(Boolean);
  if (parts.length < 3) return null;
  if (parts.some((p) => p.length > 120)) return null;
  if (/\b(είναι|δηλώνει|εννοείται|αναφέρεται|πρέπει|μπορεί|όπου|ότι|αποτελείται)\b/iu.test(text)) {
    return null;
  }

  return [{ type: 'bullet-list', items: parts, marker: '•' }];
}

function tryParseCommaListWithParens(text: string): FlashcardBlock[] | null {
  if (text.includes('•') || /\d+\.\s/.test(text)) return null;
  if (!text.includes(', ') || text.includes('. ')) return null;

  const parts = text.split(/,\s+/).map((p) => p.trim()).filter(Boolean);
  if (parts.length < 2 || parts.length > 8) return null;
  if (parts.some((p) => p.length > 100)) return null;
  if (/\b(είναι|δηλώνει|εννοείται|αποτελείται|πρέπει)\b/iu.test(text)) return null;

  return [{ type: 'bullet-list', items: parts, marker: '•' }];
}

function tryParseColonAndList(text: string): FlashcardBlock[] | null {
  const match = text.match(/^(.+?:\s*)(.+)$/s);
  if (!match) return null;

  const intro = match[1].trim();
  const rest = match[2];
  const periodSplit = rest.match(/^(.+?)\.\s+([Α-ΩA-ZΒέβαια].+)$/s);
  const listPart = periodSplit ? periodSplit[1] : rest;
  const trailing = periodSplit ? periodSplit[2].trim() : '';

  if (!listPart.includes(' και ') || /\d+\.\s/.test(listPart)) return null;

  const items = listPart.split(/\s+και\s+/).map((s) => s.trim()).filter(Boolean);
  if (items.length < 2 || items.length > 6) return null;
  if (items.some((i) => i.length > 90)) return null;
  if (!/(Δυο|Τρεις|Τρία|στοιχεία|λόγοι|τρόποι|κριτήρια|σκοποί|παράγοντες)/iu.test(intro)) {
    return null;
  }

  const blocks: FlashcardBlock[] = [{ type: 'paragraph', content: intro }];
  blocks.push({ type: 'bullet-list', items, marker: '•' });
  if (trailing) blocks.push({ type: 'paragraph', content: trailing });
  return blocks;
}

function tryParseTwoPartAnd(text: string): FlashcardBlock[] | null {
  if (text.includes('•') || text.includes('. ') || /\d+\.\s/.test(text)) return null;

  const match = text.match(/^(.{10,120}?)\s+και\s+(.{10,120})$/iu);
  if (!match) return null;
  if (/\b(είναι|δηλώνει|εννοείται|αποτελείται|πρέπει|μπορεί)\b/iu.test(text)) return null;

  return [
    {
      type: 'bullet-list',
      items: [match[1].trim(), match[2].trim()],
      marker: '•',
    },
  ];
}

function tryParseInlineNumberedSuffix(text: string): FlashcardBlock[] | null {
  const match = text.match(/^(.+?(?:[:.]|\s))\s*((?:\d+\.\s+[^,]+(?:,\s*)?)+)$/u);
  if (!match) return null;

  const intro = match[1].trim();
  const listPart = match[2].trim();
  const numbered = tryParseNumberedList(listPart);
  if (!numbered) return null;

  return [{ type: 'paragraph', content: intro }, ...numbered];
}

function tryParseTrailingLabel(text: string): FlashcardBlock[] | null {
  const match = text.match(/^(.+?[.!?])\s+(Χαρακτηριστικό|Σημαντικό|Προσέγγιση|Παράδειγμα):\s+(.+)$/s);
  if (!match) return null;

  return [
    { type: 'paragraph', content: match[1].trim() },
    { type: 'labeled', label: match[2], content: match[3].trim() },
  ];
}

export function parseFlashcardText(text: string): FlashcardBlock[] {
  const trimmed = preprocessText(text.trim());
  if (!trimmed) return [];

  const hasBullets = BULLET_MARKERS.some((marker) => trimmed.includes(marker));

  return (
    tryParsePhasedNumberedList(trimmed) ??
    (hasBullets ? tryParseAnyBulletList(trimmed) : null) ??
    tryParseLabelBlocks(trimmed) ??
    tryParseSectionedBullets(trimmed) ??
    tryParseInlineNumberedSuffix(trimmed) ??
    tryParseNumberedList(trimmed) ??
    (!hasBullets ? tryParseAnyBulletList(trimmed) : null) ??
    tryParseTermDefinitions(trimmed) ??
    tryParseColonAndList(trimmed) ??
    tryParseTrailingLabel(trimmed) ??
    tryParseCommaList(trimmed) ??
    tryParseCommaListWithParens(trimmed) ??
    tryParseTwoPartAnd(trimmed) ?? [{ type: 'paragraph', content: trimmed }]
  );
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

function renderListItem(item: ListItemNode): React.ReactNode {
  if (typeof item === 'string') return renderInline(item);

  return (
    <>
      {renderInline(item.main)}
      {item.subBullets.length > 0 && (
        <ul className="mt-2 ml-4 list-disc space-y-1 marker:text-coral-accent/80">
          {item.subBullets.map((sub, index) => (
            <li key={index} className="pl-1">
              {renderInline(sub)}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export const FlashcardText: React.FC<{ text: string; className?: string }> = ({
  text,
  className = '',
}) => {
  const blocks = parseFlashcardText(text);

  return (
    <div className={`space-y-3 text-left ${className}`}>
      {blocks.map((block, index) => {
        if (block.type === 'paragraph') {
          return (
            <p key={index} className="leading-relaxed">
              {renderInline(block.content)}
            </p>
          );
        }

        if (block.type === 'section') {
          return (
            <p key={index} className="pt-1 font-bold text-coral-strong dark:text-coral-light">
              {block.title}:
            </p>
          );
        }

        if (block.type === 'labeled') {
          return (
            <div key={index} className="leading-relaxed">
              <p className="mb-1">
                <strong className="font-bold text-coral-strong dark:text-coral-light">
                  {block.label}:
                </strong>
              </p>
              {block.content ? <p className="pl-1">{renderInline(block.content)}</p> : null}
            </div>
          );
        }

        if (block.type === 'ordered-list') {
          return (
            <ol
              key={index}
              className="list-decimal space-y-2 pl-5 marker:font-bold marker:text-coral-accent/90"
            >
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="pl-1 leading-relaxed">
                  {renderListItem(item)}
                </li>
              ))}
            </ol>
          );
        }

        return (
          <ul
            key={index}
            className="list-none space-y-2"
            aria-label={block.marker === '✓' ? 'Σημεία' : 'Λίστα'}
          >
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex} className="flex gap-2 leading-relaxed">
                <span className="shrink-0 font-bold text-coral-accent" aria-hidden>
                  {block.marker}
                </span>
                <span className="min-w-0">{renderInline(item)}</span>
              </li>
            ))}
          </ul>
        );
      })}
    </div>
  );
};
