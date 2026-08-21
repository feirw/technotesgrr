import React from 'react';

type ListItemNode =
  | string
  | {
      main: string;
      subBullets: string[];
    };

type OrderedListItem = {
  n: number;
  item: ListItemNode;
};

type FlashcardBlock =
  | { type: 'paragraph'; content: string }
  | { type: 'labeled'; label: string; content: string }
  | { type: 'section'; title: string }
  | { type: 'code'; lines: string[] }
  | { type: 'ordered-list'; items: OrderedListItem[] }
  | { type: 'bullet-list'; items: ListItemNode[]; marker: '•' | '✓' | '➢' };

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
  return text.replace(/\*\*/g, '');
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

  const items: OrderedListItem[] = [];
  const trailing: string[] = [];

  parts.slice(1).forEach((part, index, all) => {
    const numMatch = part.match(/^(\d+)\.\s+/u);
    const n = numMatch ? Number(numMatch[1]) : index + 1;
    const rest = part.replace(/^\d+\.\s+/u, '').trim();

    if (index === all.length - 1) {
      const { body, note } = splitTrailingNote(rest);
      items.push({ n, item: parseListItem(body) });
      if (note) trailing.push(note);
      return;
    }
    items.push({ n, item: parseListItem(rest) });
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

const CODE_LINE_RE =
  /^\s*(?:ΑΝ |ΟΣΟ |ΓΙΑ |ΕΠΙΛΕΞΕ|ΔΙΑΒΑΣΕ|ΓΡΑΨΕ|ΑΡΧΗ_ΕΠΑΝΑΛΗΨΗΣ|ΜΕΧΡΙΣ_ΟΤΟΥ|ΤΕΛΟΣ_|ΑΛΛΙΩΣ|ΠΕΡΙΠΤΩΣΗ|ΤΟΤΕ|ΕΠΑΝΑΛΑΒΕ|ΑΠΟ |ΜΕΧΡΙ |ΜΕ_ΒΗΜΑ|εντολ|Μεταβλητή\s*←|\S+\s*←|\.\.\.|…)/;

function isShortLabel(label: string): boolean {
  const plain = label.replace(/\*\*/g, '').trim();
  if (!plain || plain.length > 42) return false;
  if (plain.includes('.')) return false;
  return plain.split(/\s+/).length <= 6;
}

type ClassifiedLine =
  | { kind: 'empty' }
  | { kind: 'bullet'; marker: '•' | '✓' | '➢'; content: string }
  | { kind: 'sub'; content: string }
  | { kind: 'numbered'; n: number; content: string }
  | { kind: 'labeled'; label: string; content: string }
  | { kind: 'text'; content: string };

function classifyLine(raw: string): ClassifiedLine {
  const line = raw.trimEnd();
  if (!line.trim()) return { kind: 'empty' };

  const trimmed = line.trimStart();
  const bullet = trimmed.match(/^([•✓➢])\s+(.*)$/);
  if (bullet) {
    return { kind: 'bullet', marker: bullet[1] as '•' | '✓' | '➢', content: bullet[2].trim() };
  }

  const sub = trimmed.match(/^[-–]\s+(.*)$/);
  if (sub) return { kind: 'sub', content: sub[1].trim() };

  const numbered = trimmed.match(/^(\d+)\.\s+(.*)$/);
  if (numbered) return { kind: 'numbered', n: Number(numbered[1]), content: numbered[2].trim() };

  const labeled = trimmed.match(/^(?:\*\*)?([^:*]{1,42}):(?:\*\*)?\s*(.*)$/);
  if (labeled && isShortLabel(labeled[1])) {
    return { kind: 'labeled', label: labeled[1].replace(/\*\*/g, '').trim(), content: labeled[2].trim() };
  }

  return { kind: 'text', content: line };
}

function appendSubBullet(items: ListItemNode[], content: string) {
  if (items.length === 0) {
    items.push({ main: '', subBullets: [content] });
    return;
  }
  const last = items[items.length - 1];
  if (typeof last === 'string') {
    items[items.length - 1] = { main: last, subBullets: [content] };
    return;
  }
  last.subBullets.push(content);
}

function parseMultiline(text: string): FlashcardBlock[] {
  const lines = text.replace(/\r\n/g, '\n').split('\n').map(classifyLine);
  const blocks: FlashcardBlock[] = [];
  let i = 0;

  const flushParagraph = (parts: string[]) => {
    const content = parts.join(' ').trim();
    if (content) blocks.push({ type: 'paragraph', content });
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.kind === 'empty') {
      i += 1;
      continue;
    }

    if (line.kind === 'bullet') {
      const marker = line.marker;
      const items: ListItemNode[] = [];
      while (i < lines.length) {
        const current = lines[i];
        if (current.kind === 'empty') {
          const next = lines[i + 1];
          if (
            next &&
            (next.kind === 'sub' || (next.kind === 'bullet' && next.marker === marker))
          ) {
            i += 1;
            continue;
          }
          break;
        }
        if (current.kind === 'bullet' && current.marker === marker) {
          items.push(current.content);
          i += 1;
          continue;
        }
        if (current.kind === 'sub' && items.length > 0) {
          appendSubBullet(items, current.content);
          i += 1;
          continue;
        }
        break;
      }
      if (items.length > 0) blocks.push({ type: 'bullet-list', items, marker });
      continue;
    }

    if (line.kind === 'numbered') {
      const items: OrderedListItem[] = [];
      const wrapItems: ListItemNode[] = [];
      while (i < lines.length) {
        const current = lines[i];
        if (current.kind === 'empty') {
          const next = lines[i + 1];
          if (
            next &&
            (next.kind === 'numbered' || next.kind === 'bullet' || next.kind === 'sub')
          ) {
            i += 1;
            continue;
          }
          break;
        }
        if (current.kind === 'numbered') {
          wrapItems.push(current.content);
          items.push({ n: current.n, item: current.content });
          i += 1;
          continue;
        }
        if ((current.kind === 'bullet' || current.kind === 'sub') && items.length > 0) {
          appendSubBullet(wrapItems, current.content);
          items[items.length - 1] = {
            n: items[items.length - 1].n,
            item: wrapItems[wrapItems.length - 1],
          };
          i += 1;
          continue;
        }
        break;
      }
      if (items.length > 0) blocks.push({ type: 'ordered-list', items });
      continue;
    }

    if (line.kind === 'labeled') {
      blocks.push({ type: 'labeled', label: line.label, content: line.content });
      i += 1;
      continue;
    }

    if (line.kind === 'sub') {
      const items: ListItemNode[] = [];
      while (i < lines.length && (lines[i].kind === 'sub' || lines[i].kind === 'empty')) {
        if (lines[i].kind === 'sub') items.push(lines[i].content);
        i += 1;
      }
      if (items.length > 0) blocks.push({ type: 'bullet-list', items, marker: '•' });
      continue;
    }

    const codeLines: string[] = [];
    const prose: string[] = [];
    while (i < lines.length && lines[i].kind === 'text') {
      const content = lines[i].kind === 'text' ? lines[i].content : '';
      if (CODE_LINE_RE.test(content)) {
        if (prose.length) {
          flushParagraph(prose);
          prose.length = 0;
        }
        codeLines.push(content);
      } else if (codeLines.length > 0) {
        codeLines.push(content);
      } else {
        prose.push(content);
      }
      i += 1;
    }
    if (prose.length) flushParagraph(prose);
    if (codeLines.length) blocks.push({ type: 'code', lines: codeLines });
  }

  return blocks.length > 0 ? blocks : [{ type: 'paragraph', content: text.trim() }];
}

export function parseFlashcardText(text: string): FlashcardBlock[] {
  const trimmed = preprocessText(text.trim());
  if (!trimmed) return [];

  if (trimmed.includes('\n')) {
    return parseMultiline(trimmed);
  }

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
    tryParseTrailingLabel(trimmed) ?? [{ type: 'paragraph', content: trimmed }]
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

        if (block.type === 'code') {
          return (
            <div
              key={index}
              className="overflow-x-auto rounded-lg bg-black/5 px-3 py-2 font-mono text-[0.92em] leading-relaxed dark:bg-white/10"
            >
              {block.lines.map((codeLine, lineIndex) => (
                <p key={lineIndex} className="whitespace-nowrap">
                  {renderInline(codeLine)}
                </p>
              ))}
            </div>
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
            <ol key={index} className="list-none space-y-2">
              {block.items.map((entry, itemIndex) => (
                <li key={itemIndex} className="flex gap-2 leading-relaxed">
                  <span className="w-7 shrink-0 font-bold text-coral-accent">
                    {entry.n}.
                  </span>
                  <span className="min-w-0">{renderListItem(entry.item)}</span>
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
                <span className="min-w-0">{renderListItem(item)}</span>
              </li>
            ))}
          </ul>
        );
      })}
    </div>
  );
};
