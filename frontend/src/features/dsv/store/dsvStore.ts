import { create } from 'zustand';
import type { StructureKind, StructureState } from '../types';
import { createInitialStructure } from '../utils/defaults';
import { deepClone } from '../utils/clone';
import { STRUCTURE_LABELS } from '../types';

export type DsvMessageType = 'info' | 'ok' | 'error';

interface DsvState {
  structure: StructureState;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  message: string;
  messageType: DsvMessageType;

  setKind: (kind: StructureKind) => void;
  setStructure: (structure: StructureState) => void;
  /** Εφαρμογή αλλαγής. Αν η δομή δεν άλλαξε → μήνυμα σφάλματος. */
  commitChange: (
    next: StructureState,
    okMessage: string,
    failMessage?: string
  ) => boolean;
  setMessage: (message: string, type?: DsvMessageType) => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  clearStructure: () => void;
}

function sameStructure(a: StructureState, b: StructureState): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const useDsvStore = create<DsvState>((set, get) => ({
  structure: createInitialStructure('bst'),
  selectedNodeId: null,
  selectedEdgeId: null,
  message: 'Ξεκίνα από την αρχή: πρόσθεσε κόμβους για να φτιάξεις τη δομή.',
  messageType: 'info',

  setKind: (kind) => {
    set({
      structure: createInitialStructure(kind),
      selectedNodeId: null,
      selectedEdgeId: null,
      message: `Κενό ${STRUCTURE_LABELS[kind]}. Φτιάξε τη δική σου δομή.`,
      messageType: 'info',
    });
  },

  setStructure: (structure) => set({ structure }),

  commitChange: (next, okMessage, failMessage) => {
    const prev = get().structure;
    if (sameStructure(prev, next)) {
      set({
        message: failMessage ?? 'Η ενέργεια δεν μπορεί να ολοκληρωθεί.',
        messageType: 'error',
      });
      return false;
    }
    set({
      structure: deepClone(next),
      message: okMessage,
      messageType: 'ok',
      selectedEdgeId: null,
    });
    return true;
  },

  setMessage: (message, type = 'info') => set({ message, messageType: type }),

  selectNode: (id) => set({ selectedNodeId: id }),
  selectEdge: (id) => set({ selectedEdgeId: id }),

  clearStructure: () => {
    const kind = get().structure.kind;
    set({
      structure: createInitialStructure(kind),
      selectedNodeId: null,
      selectedEdgeId: null,
      message: 'Η δομή καθαρίστηκε. Ξεκίνα από την αρχή.',
      messageType: 'info',
    });
  },
}));
