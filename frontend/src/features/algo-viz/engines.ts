import type { AlgoId, AlgoStep, ArrayView, CellRole, Pointers, SortOrder } from './types';

export function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function randomArray(n: number, unique = true): number[] {
  const size = Math.max(2, Math.min(20, Math.floor(n) || 12));
  if (!unique) {
    return Array.from({ length: size }, () => randomInt(10, 99));
  }
  const used = new Set<number>();
  const out: number[] = [];
  while (out.length < size) {
    const v = randomInt(10, 99);
    if (!used.has(v)) {
      used.add(v);
      out.push(v);
    }
  }
  return out;
}

export function parseArray(text: string): number[] | null {
  const parts = text
    .trim()
    .split(/[\s,;]+/)
    .filter(Boolean);
  if (parts.length < 2) return null;
  const nums = parts.map(Number);
  if (nums.some((n) => !Number.isFinite(n))) return null;
  return nums.slice(0, 20);
}

function fillRoles(n: number, patch: Record<number, CellRole> = {}): CellRole[] {
  const roles: CellRole[] = Array.from({ length: n }, () => 'default');
  for (const [k, v] of Object.entries(patch)) roles[Number(k)] = v;
  return roles;
}

function sortedRoles(n: number, sortedIdx: Iterable<number>, extra: Record<number, CellRole> = {}): CellRole[] {
  const patch: Record<number, CellRole> = {};
  for (const i of sortedIdx) patch[i] = 'sorted';
  return fillRoles(n, { ...patch, ...extra });
}

function view(values: number[], roles: CellRole[], pointers?: Pointers, label?: string): ArrayView {
  return { label, values: [...values], roles, pointers };
}

function step(
  values: number[],
  line: number,
  message: string,
  extra: { roles?: CellRole[]; pointers?: Pointers; done?: boolean } = {}
): AlgoStep {
  return {
    arrays: [view(values, extra.roles ?? fillRoles(values.length), extra.pointers)],
    line,
    message,
    done: extra.done,
  };
}

function swap(a: number[], i: number, j: number) {
  const t = a[i];
  a[i] = a[j];
  a[j] = t;
}

function bubble(a0: number[], order: SortOrder): AlgoStep[] {
  const a = [...a0];
  const n = a.length;
  const asc = order === 'asc';
  const steps: AlgoStep[] = [
    step(a, 1, asc ? 'Αύξουσα ταξινόμηση: τα μικρότερα «φουσκώνουν» αριστερά.' : 'Φθίνουσα ταξινόμηση: τα μεγαλύτερα «φουσκώνουν» αριστερά.'),
  ];
  const sorted = new Set<number>();
  for (let i = 1; i < n; i++) {
    steps.push(step(a, 2, `Εξωτερικός βρόχος: i = ${i + 1}.`, { roles: sortedRoles(n, sorted), pointers: { i } }));
    for (let j = n - 1; j >= i; j--) {
      steps.push(
        step(a, 4, `Σύγκριση Α[${j + 1}]=${a[j]} με Α[${j}]=${a[j - 1]}.`, {
          roles: sortedRoles(n, sorted, { [j]: 'compare', [j - 1]: 'compare' }),
          pointers: { i, j },
        })
      );
      const shouldSwap = asc ? a[j] < a[j - 1] : a[j] > a[j - 1];
      if (shouldSwap) {
        swap(a, j, j - 1);
        steps.push(
          step(a, 5, asc ? 'Ανταλλαγή: το μικρότερο πάει αριστερά.' : 'Ανταλλαγή: το μεγαλύτερο πάει αριστερά.', {
            roles: sortedRoles(n, sorted, { [j]: 'swap', [j - 1]: 'swap' }),
            pointers: { i, j },
          })
        );
      }
    }
    sorted.add(i - 1);
    steps.push(step(a, 7, `Η θέση ${i} πήρε την οριστική της τιμή.`, { roles: sortedRoles(n, sorted) }));
  }
  sorted.add(n - 1);
  steps.push(step(a, 9, 'Ο πίνακας ταξινομήθηκε.', { roles: sortedRoles(n, sorted), done: true }));
  return steps;
}

function selection(a0: number[], order: SortOrder): AlgoStep[] {
  const a = [...a0];
  const n = a.length;
  const asc = order === 'asc';
  const pickName = asc ? 'ελάχιστο' : 'μέγιστο';
  const steps: AlgoStep[] = [step(a, 1, `Σε κάθε πέρασμα βρίσκουμε το ${pickName} του υπόλοιπου πίνακα.`)];
  const sorted = new Set<number>();
  for (let i = 0; i < n - 1; i++) {
    let pick = i;
    const pickPtr = asc ? { min: pick } : { max: pick };
    steps.push(
      step(a, 3, `i = ${i + 1}, θέση_${asc ? 'ελάχ' : 'μεγ'} ← ${i + 1} (τιμή ${a[pick]}).`, {
        roles: sortedRoles(n, sorted, { [pick]: 'min' }),
        pointers: { i, ...pickPtr },
      })
    );
    for (let j = i + 1; j < n; j++) {
      steps.push(
        step(a, 5, `Σύγκριση Α[${j + 1}]=${a[j]} με τρέχον ${pickName} ${a[pick]}.`, {
          roles: sortedRoles(n, sorted, { [pick]: 'min', [j]: 'compare' }),
          pointers: { i, j, ...(asc ? { min: pick } : { max: pick }) },
        })
      );
      const better = asc ? a[j] < a[pick] : a[j] > a[pick];
      if (better) {
        pick = j;
        steps.push(
          step(a, 6, `Νέο ${pickName} στη θέση ${pick + 1}.`, {
            roles: sortedRoles(n, sorted, { [pick]: 'min' }),
            pointers: { i, j, ...(asc ? { min: pick } : { max: pick }) },
          })
        );
      }
    }
    if (pick !== i) {
      swap(a, i, pick);
      steps.push(
        step(a, 9, `Ανταλλαγή θέσεων ${i + 1} και ${pick + 1}.`, {
          roles: sortedRoles(n, sorted, { [i]: 'swap', [pick]: 'swap' }),
          pointers: { i, ...(asc ? { min: pick } : { max: pick }) },
        })
      );
    } else {
      steps.push(
        step(a, 9, `Το ${pickName} είναι ήδη στη θέση ${i + 1}.`, {
          roles: sortedRoles(n, sorted, { [i]: 'sorted' }),
          pointers: { i, ...(asc ? { min: pick } : { max: pick }) },
        })
      );
    }
    sorted.add(i);
  }
  sorted.add(n - 1);
  steps.push(step(a, 11, 'Ο πίνακας ταξινομήθηκε.', { roles: sortedRoles(n, sorted), done: true }));
  return steps;
}

function linear(a0: number[], key: number): AlgoStep[] {
  const a = [...a0];
  const n = a.length;
  const steps: AlgoStep[] = [step(a, 1, `Αναζήτηση του κλειδιού ${key}.`)];
  let i = 0;
  let found = false;
  steps.push(step(a, 2, 'i ← 1, βρέθηκε ← ΨΕΥΔΗΣ.', { pointers: { i: 0 } }));
  while (i < n && !found) {
    steps.push(
      step(a, 5, `Α[${i + 1}] = ${a[i]} ίσον με ${key};`, {
        roles: fillRoles(n, { [i]: 'compare' }),
        pointers: { i },
      })
    );
    if (a[i] === key) {
      found = true;
      steps.push(step(a, 6, `Βρέθηκε στη θέση ${i + 1}.`, { roles: fillRoles(n, { [i]: 'found' }), pointers: { i }, done: true }));
    } else {
      i += 1;
      steps.push(step(a, 8, `Όχι. i ← ${Math.min(i + 1, n)}.`, { pointers: { i: Math.min(i, n - 1) }, roles: fillRoles(n) }));
    }
  }
  if (!found) {
    steps.push(
      step(a, 11, `Το ${key} δεν υπάρχει στον πίνακα.`, {
        roles: fillRoles(n, Object.fromEntries(a.map((_, idx) => [idx, 'discard' as const]))),
        done: true,
      })
    );
  }
  return steps;
}

function binary(a0: number[], key: number): AlgoStep[] {
  const a = [...a0].sort((x, y) => x - y);
  const n = a.length;
  const steps: AlgoStep[] = [step(a, 1, `Ταξινομημένος πίνακας. Ζητείται το ${key}.`)];
  let low = 0;
  let high = n - 1;
  let found = false;
  steps.push(step(a, 2, `αρχή ← 1, τέλος ← ${n}.`, { pointers: { low, high } }));
  while (low <= high && !found) {
    const mid = Math.floor((low + high) / 2);
    const discard: Record<number, CellRole> = {};
    for (let k = 0; k < n; k++) {
      if (k < low || k > high) discard[k] = 'discard';
    }
    steps.push(
      step(a, 6, `μέση ← (${low + 1} + ${high + 1}) DIV 2 = ${mid + 1}. Α[μέση]=${a[mid]}.`, {
        roles: fillRoles(n, { ...discard, [mid]: 'compare', [low]: 'min', [high]: 'key' }),
        pointers: { low, high, mid },
      })
    );
    if (a[mid] === key) {
      found = true;
      steps.push(
        step(a, 8, `Βρέθηκε στη θέση ${mid + 1}.`, {
          roles: fillRoles(n, { ...discard, [mid]: 'found' }),
          pointers: { low, high, mid },
          done: true,
        })
      );
    } else if (a[mid] < key) {
      low = mid + 1;
      steps.push(step(a, 10, `${a[mid]} < ${key} → αρχή ← ${low + 1}.`, { roles: fillRoles(n, discard), pointers: { low, high, mid } }));
    } else {
      high = mid - 1;
      steps.push(step(a, 12, `${a[mid]} > ${key} → τέλος ← ${high + 1}.`, { roles: fillRoles(n, discard), pointers: { low, high, mid } }));
    }
  }
  if (!found) {
    steps.push(
      step(a, 15, `Το ${key} δεν υπάρχει στον πίνακα.`, {
        roles: fillRoles(n, Object.fromEntries(a.map((_, i) => [i, 'discard' as const]))),
        done: true,
      })
    );
  }
  return steps;
}

export function buildSteps(
  id: AlgoId,
  array: number[],
  extra?: { key?: number; order?: SortOrder }
): AlgoStep[] {
  const order = extra?.order ?? 'asc';
  switch (id) {
    case 'bubble':
      return bubble(array, order);
    case 'selection':
      return selection(array, order);
    case 'linear':
      return linear(array, extra?.key ?? array[0]);
    case 'binary':
      return binary(array, extra?.key ?? array[Math.floor(array.length / 2)]);
    default:
      return [step(array, 0, 'Έτοιμο.')];
  }
}
