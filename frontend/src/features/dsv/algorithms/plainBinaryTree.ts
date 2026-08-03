import type { AnimationStep, BinaryTreeNode, BinaryTreeState } from '../types';
import { createId, stepId } from '../utils/ids';
import { deepClone } from '../utils/clone';
import { findParentId } from './binaryTree';

/** Εισαγωγή ως ρίζα ή ως αριστερό/δεξί παιδί επιλεγμένου κόμβου (όχι κανόνες ΔΔΑ). */
export function insertBinaryChild(
  tree: BinaryTreeState,
  parentId: string | null,
  side: 'left' | 'right' | 'root',
  value: number
): { tree: BinaryTreeState; steps: AnimationStep[] } {
  const next = deepClone(tree);
  const steps: AnimationStep[] = [];
  const id = createId('bt');
  const node: BinaryTreeNode = { id, value, left: null, right: null };

  if (side === 'root' || !next.rootId) {
    if (next.rootId) {
      steps.push({
        id: stepId(),
        explanation: 'Το δέντρο έχει ήδη ρίζα. Επίλεξε κόμβο και βάλε αριστερό/δεξί παιδί.',
        nodeHighlights: { [next.rootId]: 'current' },
        edgeHighlights: {},
      });
      return { tree: next, steps };
    }
    next.rootId = id;
    next.nodes[id] = node;
    steps.push({
      id: stepId(),
      explanation: `Ο κόμβος ${value} γίνεται ρίζα του δυαδικού δέντρου.`,
      nodeHighlights: { [id]: 'creating' },
      edgeHighlights: {},
    });
    return { tree: next, steps };
  }

  if (!parentId || !next.nodes[parentId]) {
    steps.push({
      id: stepId(),
      explanation: 'Επίλεξε πρώτα έναν κόμβο-γονέα.',
      nodeHighlights: {},
      edgeHighlights: {},
    });
    return { tree: next, steps };
  }

  const parent = next.nodes[parentId];
  if (side === 'left' && parent.left) {
    steps.push({
      id: stepId(),
      explanation: `Ο κόμβος ${parent.value} έχει ήδη αριστερό παιδί.`,
      nodeHighlights: { [parentId]: 'current', [parent.left]: 'child' },
      edgeHighlights: {},
    });
    return { tree: next, steps };
  }
  if (side === 'right' && parent.right) {
    steps.push({
      id: stepId(),
      explanation: `Ο κόμβος ${parent.value} έχει ήδη δεξί παιδί.`,
      nodeHighlights: { [parentId]: 'current', [parent.right]: 'child' },
      edgeHighlights: {},
    });
    return { tree: next, steps };
  }

  next.nodes[id] = node;
  if (side === 'left') parent.left = id;
  else parent.right = id;

  steps.push({
    id: stepId(),
    explanation: `Ο κόμβος ${value} γίνεται ${side === 'left' ? 'αριστερό' : 'δεξί'} παιδί του ${parent.value}.`,
    nodeHighlights: { [parentId]: 'parent', [id]: 'creating' },
    edgeHighlights: { [`${parentId}->${id}`]: 'active' },
  });
  return { tree: next, steps };
}

export function deleteBinaryNodeById(
  tree: BinaryTreeState,
  nodeId: string
): { tree: BinaryTreeState; steps: AnimationStep[] } {
  const next = deepClone(tree);
  const steps: AnimationStep[] = [];
  const node = next.nodes[nodeId];
  if (!node) {
    return {
      tree: next,
      steps: [
        {
          id: stepId(),
          explanation: 'Ο κόμβος δεν βρέθηκε.',
          nodeHighlights: {},
          edgeHighlights: {},
        },
      ],
    };
  }

  const collect = (id: string): string[] => {
    const n = next.nodes[id];
    if (!n) return [];
    return [id, ...(n.left ? collect(n.left) : []), ...(n.right ? collect(n.right) : [])];
  };
  const toRemove = collect(nodeId);

  if (nodeId === next.rootId) {
    toRemove.forEach((id) => delete next.nodes[id]);
    next.rootId = null;
    steps.push({
      id: stepId(),
      explanation: `Διαγραφή ρίζας ${node.value} και όλου του υποδέντρου.`,
      nodeHighlights: Object.fromEntries(toRemove.map((id) => [id, 'deleting' as const])),
      edgeHighlights: {},
    });
    return { tree: next, steps };
  }

  const parentId = findParentId(next, nodeId);
  if (parentId) {
    const p = next.nodes[parentId];
    if (p.left === nodeId) p.left = null;
    if (p.right === nodeId) p.right = null;
  }
  toRemove.forEach((id) => delete next.nodes[id]);
  steps.push({
    id: stepId(),
    explanation: `Διαγραφή κόμβου ${node.value} και του υποδέντρου του.`,
    nodeHighlights: Object.fromEntries(toRemove.map((id) => [id, 'deleting' as const])),
    edgeHighlights: {},
  });
  return { tree: next, steps };
}
