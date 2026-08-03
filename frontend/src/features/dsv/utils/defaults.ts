import type {
  BinaryTreeState,
  GeneralTreeState,
  GraphState,
  LinkedListState,
  StructureKind,
  StructureState,
} from '../types';
import { createId } from './ids';

export function emptyGeneralTree(): GeneralTreeState {
  return { rootId: null, nodes: {} };
}

export function emptyBinaryTree(): BinaryTreeState {
  return { rootId: null, nodes: {} };
}

export function emptyLinkedList(): LinkedListState {
  return { headId: null, nodes: {} };
}

export function emptyGraph(): GraphState {
  return { vertices: {}, edges: [] };
}

function sampleBinaryShape(kind: 'binary-tree' | 'bst'): StructureState {
  const n40 = createId('bt');
  const n25 = createId('bt');
  const n60 = createId('bt');
  const n10 = createId('bt');
  const n30 = createId('bt');
  // Για απλό δυαδικό: τιμές χωρίς σειρά ΔΔΑ. Για ΔΔΑ: ταξινομημένο δείγμα.
  const values =
    kind === 'bst'
      ? { root: 40, l: 25, r: 60, ll: 10, lr: 30 }
      : { root: 7, l: 12, r: 3, ll: 9, lr: 1 };
  return {
    kind,
    data: {
      rootId: n40,
      nodes: {
        [n40]: { id: n40, value: values.root, left: n25, right: n60 },
        [n25]: { id: n25, value: values.l, left: n10, right: n30 },
        [n60]: { id: n60, value: values.r, left: null, right: null },
        [n10]: { id: n10, value: values.ll, left: null, right: null },
        [n30]: { id: n30, value: values.lr, left: null, right: null },
      },
    },
  };
}

export function createInitialStructure(kind: StructureKind): StructureState {
  switch (kind) {
    case 'general-tree':
      return { kind, data: emptyGeneralTree() };
    case 'binary-tree':
    case 'bst':
      return { kind, data: emptyBinaryTree() };
    case 'linked-list':
      return { kind, data: emptyLinkedList() };
    case 'directed-graph':
    case 'undirected-graph':
      return { kind, data: emptyGraph() };
  }
}

export function sampleStructure(kind: StructureKind): StructureState {
  switch (kind) {
    case 'general-tree': {
      const a = createId('gt');
      const b = createId('gt');
      const c = createId('gt');
      const d = createId('gt');
      const e = createId('gt');
      return {
        kind,
        data: {
          rootId: a,
          nodes: {
            [a]: { id: a, label: 'A', children: [b, c] },
            [b]: { id: b, label: 'B', children: [d] },
            [c]: { id: c, label: 'C', children: [e] },
            [d]: { id: d, label: 'D', children: [] },
            [e]: { id: e, label: 'E', children: [] },
          },
        },
      };
    }
    case 'binary-tree':
    case 'bst':
      return sampleBinaryShape(kind);
    case 'linked-list': {
      const a = createId('ll');
      const b = createId('ll');
      const c = createId('ll');
      return {
        kind,
        data: {
          headId: a,
          nodes: {
            [a]: { id: a, value: 10, next: b },
            [b]: { id: b, value: 20, next: c },
            [c]: { id: c, value: 30, next: null },
          },
        },
      };
    }
    case 'directed-graph':
    case 'undirected-graph': {
      const a = createId('v');
      const b = createId('v');
      const c = createId('v');
      const d = createId('v');
      return {
        kind,
        data: {
          vertices: {
            [a]: { id: a, label: 'A', x: 120, y: 80 },
            [b]: { id: b, label: 'B', x: 320, y: 80 },
            [c]: { id: c, label: 'C', x: 120, y: 240 },
            [d]: { id: d, label: 'D', x: 320, y: 240 },
          },
          edges: [
            { id: createId('e'), source: a, target: b },
            { id: createId('e'), source: a, target: c },
            { id: createId('e'), source: b, target: d },
            { id: createId('e'), source: c, target: d },
          ],
        },
      };
    }
  }
}
