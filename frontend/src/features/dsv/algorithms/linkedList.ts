import type { AnimationStep, LinkedListState } from '../types';
import { createId, stepId } from '../utils/ids';
import { deepClone } from '../utils/clone';

function toArray(list: LinkedListState): string[] {
  const ids: string[] = [];
  let cur = list.headId;
  while (cur) {
    ids.push(cur);
    cur = list.nodes[cur]?.next ?? null;
  }
  return ids;
}

export function insertBeginning(
  list: LinkedListState,
  value: number
): { list: LinkedListState; steps: AnimationStep[] } {
  const next = deepClone(list);
  const id = createId('ll');
  const steps: AnimationStep[] = [];
  next.nodes[id] = { id, value, next: next.headId };
  steps.push({
    id: stepId(),
    explanation: `Δημιουργία κόμβου ${value}. Το next δείχνει στην τρέχουσα κεφαλή.`,
    nodeHighlights: { [id]: 'creating', ...(next.headId ? { [next.headId]: 'current' } : {}) },
    edgeHighlights: {},
    pointerHighlights: { head: next.headId, new: id },
  });
  next.headId = id;
  steps.push({
    id: stepId(),
    explanation: `Ενημέρωση δείκτη κεφαλής στο ${value}.`,
    nodeHighlights: { [id]: 'found' },
    edgeHighlights: {},
    pointerHighlights: { head: id },
  });
  return { list: next, steps };
}

export function insertEnd(
  list: LinkedListState,
  value: number
): { list: LinkedListState; steps: AnimationStep[] } {
  const next = deepClone(list);
  const id = createId('ll');
  const steps: AnimationStep[] = [];
  next.nodes[id] = { id, value, next: null };

  if (!next.headId) {
    next.headId = id;
    steps.push({
      id: stepId(),
      explanation: `Η λίστα είναι κενή. Ο ${value} γίνεται κεφαλή.`,
      nodeHighlights: { [id]: 'creating' },
      edgeHighlights: {},
      pointerHighlights: { head: id },
    });
    return { list: next, steps };
  }

  let cur = next.headId;
  const visited: Record<string, 'visited'> = {};
  while (next.nodes[cur].next) {
    steps.push({
      id: stepId(),
      explanation: `Διάσχιση στον επόμενο κόμβο (${next.nodes[cur].value}).`,
      nodeHighlights: { ...visited, [cur]: 'current' },
      edgeHighlights: { [`${cur}->${next.nodes[cur].next}`]: 'active' },
      pointerHighlights: { head: next.headId, curr: cur },
    });
    visited[cur] = 'visited';
    cur = next.nodes[cur].next!;
  }
  steps.push({
    id: stepId(),
    explanation: `Φτάσαμε στο τέλος (${next.nodes[cur].value}). Σύνδεση next με ${value}.`,
    nodeHighlights: { ...visited, [cur]: 'current', [id]: 'creating' },
    edgeHighlights: { [`${cur}->${id}`]: 'active' },
    pointerHighlights: { head: next.headId, curr: cur },
  });
  next.nodes[cur].next = id;
  steps.push({
    id: stepId(),
    explanation: `Η εισαγωγή στο τέλος ολοκληρώθηκε.`,
    nodeHighlights: { [id]: 'found' },
    edgeHighlights: {},
    pointerHighlights: { head: next.headId },
  });
  return { list: next, steps };
}

/** Εισαγωγή αμέσως μετά τον κόμβο `afterId` (μεταξύ κόμβων). */
export function insertAfter(
  list: LinkedListState,
  afterId: string,
  value: number
): { list: LinkedListState; steps: AnimationStep[] } {
  const ids = toArray(list);
  const idx = ids.indexOf(afterId);
  if (idx < 0) {
    return {
      list: deepClone(list),
      steps: [
        {
          id: stepId(),
          explanation: 'Επίλεξε έναν κόμβο για να γίνει η εισαγωγή μετά από αυτόν.',
          nodeHighlights: {},
          edgeHighlights: {},
        },
      ],
    };
  }
  return insertAtPosition(list, value, idx + 1);
}

export function insertAtPosition(
  list: LinkedListState,
  value: number,
  position: number
): { list: LinkedListState; steps: AnimationStep[] } {
  if (position <= 0) return insertBeginning(list, value);
  const ids = toArray(list);
  if (position >= ids.length) return insertEnd(list, value);

  const next = deepClone(list);
  const id = createId('ll');
  const steps: AnimationStep[] = [];
  next.nodes[id] = { id, value, next: null };

  let cur = next.headId!;
  const visited: Record<string, 'visited'> = {};
  for (let i = 0; i < position - 1; i++) {
    steps.push({
      id: stepId(),
      explanation: `Μετάβαση στη θέση ${i + 1} (κόμβος ${next.nodes[cur].value}).`,
      nodeHighlights: { ...visited, [cur]: 'current' },
      edgeHighlights: {},
      pointerHighlights: { head: next.headId, curr: cur },
    });
    visited[cur] = 'visited';
    cur = next.nodes[cur].next!;
  }
  const after = next.nodes[cur].next;
  next.nodes[id].next = after;
  next.nodes[cur].next = id;
  steps.push({
    id: stepId(),
    explanation: `Εισαγωγή ${value} μετά τον ${next.nodes[cur].value}. Ενημέρωση δεικτών next.`,
    nodeHighlights: { [cur]: 'parent', [id]: 'creating', ...(after ? { [after]: 'child' } : {}) },
    edgeHighlights: {
      [`${cur}->${id}`]: 'active',
      ...(after ? { [`${id}->${after}`]: 'active' } : {}),
    },
    pointerHighlights: { head: next.headId, curr: cur },
  });
  return { list: next, steps };
}

export function deleteBeginning(
  list: LinkedListState
): { list: LinkedListState; steps: AnimationStep[] } {
  const next = deepClone(list);
  const steps: AnimationStep[] = [];
  if (!next.headId) {
    steps.push({
      id: stepId(),
      explanation: 'Η λίστα είναι κενή. Δεν υπάρχει τίποτα προς διαγραφή.',
      nodeHighlights: {},
      edgeHighlights: {},
    });
    return { list: next, steps };
  }
  const old = next.headId;
  const newHead = next.nodes[old].next;
  steps.push({
    id: stepId(),
    explanation: `Διαγραφή από την αρχή: η κεφαλή μετακινείται από ${next.nodes[old].value} σε ${newHead ? next.nodes[newHead].value : 'null'}.`,
    nodeHighlights: { [old]: 'deleting', ...(newHead ? { [newHead]: 'current' } : {}) },
    edgeHighlights: {},
    pointerHighlights: { head: newHead },
  });
  delete next.nodes[old];
  next.headId = newHead;
  steps.push({
    id: stepId(),
    explanation: 'Η κεφαλή ενημερώθηκε. Ο κόμβος αφαιρέθηκε.',
    nodeHighlights: newHead ? { [newHead]: 'found' } : {},
    edgeHighlights: {},
    pointerHighlights: { head: newHead },
  });
  return { list: next, steps };
}

export function deleteEnd(
  list: LinkedListState
): { list: LinkedListState; steps: AnimationStep[] } {
  const next = deepClone(list);
  const steps: AnimationStep[] = [];
  const ids = toArray(next);
  if (ids.length === 0) {
    steps.push({
      id: stepId(),
      explanation: 'Η λίστα είναι κενή.',
      nodeHighlights: {},
      edgeHighlights: {},
    });
    return { list: next, steps };
  }
  if (ids.length === 1) return deleteBeginning(next);

  let cur = next.headId!;
  const visited: Record<string, 'visited'> = {};
  while (next.nodes[cur].next && next.nodes[next.nodes[cur].next!].next) {
    steps.push({
      id: stepId(),
      explanation: `Διάσχιση προς το τέλος (στον ${next.nodes[cur].value}).`,
      nodeHighlights: { ...visited, [cur]: 'current' },
      edgeHighlights: {},
      pointerHighlights: { head: next.headId, curr: cur },
    });
    visited[cur] = 'visited';
    cur = next.nodes[cur].next!;
  }
  const last = next.nodes[cur].next!;
  steps.push({
    id: stepId(),
    explanation: `Ορίζουμε next του ${next.nodes[cur].value} σε null. Αφαιρούμε τον ${next.nodes[last].value}.`,
    nodeHighlights: { [cur]: 'current', [last]: 'deleting' },
    edgeHighlights: {},
    pointerHighlights: { head: next.headId, curr: cur },
  });
  next.nodes[cur].next = null;
  delete next.nodes[last];
  return { list: next, steps };
}

export function deletePosition(
  list: LinkedListState,
  position: number
): { list: LinkedListState; steps: AnimationStep[] } {
  if (position <= 0) return deleteBeginning(list);
  const ids = toArray(list);
  if (position >= ids.length - 1) return deleteEnd(list);

  const next = deepClone(list);
  const steps: AnimationStep[] = [];
  let cur = next.headId!;
  for (let i = 0; i < position - 1; i++) cur = next.nodes[cur].next!;
  const victim = next.nodes[cur].next!;
  const after = next.nodes[victim].next;
  steps.push({
    id: stepId(),
    explanation: `Διαγραφή κόμβου ${next.nodes[victim].value} στη θέση ${position}. Επανασύνδεση δεικτών.`,
    nodeHighlights: {
      [cur]: 'parent',
      [victim]: 'deleting',
      ...(after ? { [after]: 'child' } : {}),
    },
    edgeHighlights: after ? { [`${cur}->${after}`]: 'active' } : {},
    pointerHighlights: { head: next.headId, curr: cur },
  });
  next.nodes[cur].next = after;
  delete next.nodes[victim];
  steps.push({
    id: stepId(),
    explanation: 'Η διαγραφή στη θέση ολοκληρώθηκε.',
    nodeHighlights: {},
    edgeHighlights: {},
    pointerHighlights: { head: next.headId },
  });
  return { list: next, steps };
}

export function searchList(list: LinkedListState, value: number): AnimationStep[] {
  const steps: AnimationStep[] = [];
  let cur = list.headId;
  const visited: Record<string, 'visited'> = {};
  let index = 0;
  while (cur) {
    steps.push({
      id: stepId(),
      explanation: `Έλεγχος κόμβου στον δείκτη ${index}: ${list.nodes[cur].value}.`,
      nodeHighlights: { ...visited, [cur]: 'current' },
      edgeHighlights: {},
      pointerHighlights: { head: list.headId, curr: cur },
    });
    if (list.nodes[cur].value === value) {
      steps.push({
        id: stepId(),
        explanation: `Βρέθηκε ο ${value} στον δείκτη ${index}.`,
        nodeHighlights: { ...visited, [cur]: 'found' },
        edgeHighlights: {},
        pointerHighlights: { head: list.headId, curr: cur },
      });
      return steps;
    }
    visited[cur] = 'visited';
    steps.push({
      id: stepId(),
      explanation: 'Μετάβαση στον επόμενο κόμβο.',
      nodeHighlights: { ...visited },
      edgeHighlights: list.nodes[cur].next
        ? { [`${cur}->${list.nodes[cur].next}`]: 'active' }
        : {},
      pointerHighlights: { head: list.headId, curr: list.nodes[cur].next },
    });
    cur = list.nodes[cur].next;
    index += 1;
  }
  steps.push({
    id: stepId(),
    explanation: `Ο ${value} δεν βρέθηκε.`,
    nodeHighlights: { ...visited },
    edgeHighlights: {},
  });
  return steps;
}

export function reverseList(
  list: LinkedListState
): { list: LinkedListState; steps: AnimationStep[] } {
  const next = deepClone(list);
  const steps: AnimationStep[] = [];
  let prev: string | null = null;
  let cur = next.headId;
  steps.push({
    id: stepId(),
    explanation: 'Αρχικοποίηση prev = null, curr = head.',
    nodeHighlights: cur ? { [cur]: 'current' } : {},
    edgeHighlights: {},
    pointerHighlights: { head: next.headId, prev: null, curr: cur },
  });
  while (cur) {
    const nxt = next.nodes[cur].next;
    steps.push({
      id: stepId(),
      explanation: `Αντιστροφή δείκτη του ${next.nodes[cur].value} ώστε να δείχνει στο ${prev ? next.nodes[prev].value : 'null'}.`,
      nodeHighlights: {
        [cur]: 'current',
        ...(prev ? { [prev]: 'visited' } : {}),
        ...(nxt ? { [nxt]: 'child' } : {}),
      },
      edgeHighlights: prev ? { [`${cur}->${prev}`]: 'active' } : {},
      pointerHighlights: { prev, curr: cur, next: nxt },
    });
    next.nodes[cur].next = prev;
    prev = cur;
    cur = nxt;
  }
  next.headId = prev;
  steps.push({
    id: stepId(),
    explanation: `Ορίζουμε head στο ${prev ? next.nodes[prev].value : 'null'}. Η αντιστροφή ολοκληρώθηκε.`,
    nodeHighlights: prev ? { [prev]: 'found' } : {},
    edgeHighlights: {},
    pointerHighlights: { head: prev },
  });
  return { list: next, steps };
}

export function traverseList(list: LinkedListState): AnimationStep[] {
  const steps: AnimationStep[] = [];
  let cur = list.headId;
  const visited: Record<string, 'visited'> = {};
  const values: number[] = [];
  steps.push({
    id: stepId(),
    explanation: 'Έναρξη διάσχισης από την κεφαλή.',
    nodeHighlights: {},
    edgeHighlights: {},
    pointerHighlights: { head: list.headId, curr: list.headId },
  });
  while (cur) {
    values.push(list.nodes[cur].value);
    steps.push({
      id: stepId(),
      explanation: `Επίσκεψη ${list.nodes[cur].value}.`,
      nodeHighlights: { ...visited, [cur]: 'current' },
      edgeHighlights: {},
      pointerHighlights: { head: list.headId, curr: cur },
    });
    visited[cur] = 'visited';
    cur = list.nodes[cur].next;
  }
  steps.push({
    id: stepId(),
    explanation: `Σειρά διάσχισης: [${values.join(', ')}]`,
    nodeHighlights: { ...visited },
    edgeHighlights: {},
    meta: { sequence: values },
  });
  return steps;
}
