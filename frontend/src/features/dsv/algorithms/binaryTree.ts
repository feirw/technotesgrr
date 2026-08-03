import type { AnimationStep, BinaryTreeNode, BinaryTreeState } from '../types';
import { createId, stepId } from '../utils/ids';
import { deepClone } from '../utils/clone';

function nodeByValue(tree: BinaryTreeState, value: number): BinaryTreeNode | null {
  return Object.values(tree.nodes).find((n) => n.value === value) ?? null;
}

export function binaryTreeHeight(tree: BinaryTreeState, id: string | null): number {
  if (!id) return -1;
  const n = tree.nodes[id];
  if (!n) return -1;
  return 1 + Math.max(binaryTreeHeight(tree, n.left), binaryTreeHeight(tree, n.right));
}

export function binaryTreeDepth(
  tree: BinaryTreeState,
  targetId: string,
  id: string | null = tree.rootId,
  depth = 0
): number {
  if (!id) return -1;
  if (id === targetId) return depth;
  const n = tree.nodes[id];
  if (!n) return -1;
  const left = binaryTreeDepth(tree, targetId, n.left, depth + 1);
  if (left >= 0) return left;
  return binaryTreeDepth(tree, targetId, n.right, depth + 1);
}

export function findParentId(tree: BinaryTreeState, childId: string): string | null {
  for (const n of Object.values(tree.nodes)) {
    if (n.left === childId || n.right === childId) return n.id;
  }
  return null;
}

export function leafIds(tree: BinaryTreeState): string[] {
  return Object.values(tree.nodes)
    .filter((n) => !n.left && !n.right)
    .map((n) => n.id);
}

export function internalIds(tree: BinaryTreeState): string[] {
  return Object.values(tree.nodes)
    .filter((n) => n.left || n.right)
    .map((n) => n.id);
}

type TravOrder = 'preorder' | 'inorder' | 'postorder' | 'levelorder';

const TRAV_ORDER_LABEL: Record<TravOrder, string> = {
  preorder: 'προδιάταξη',
  inorder: 'ενδοδιάταξη',
  postorder: 'μεταδιάταξη',
  levelorder: 'κατά επίπεδα',
};

export function insertBinaryTree(
  tree: BinaryTreeState,
  value: number
): { tree: BinaryTreeState; steps: AnimationStep[] } {
  const next = deepClone(tree);
  const steps: AnimationStep[] = [];
  const visited: Record<string, 'visited'> = {};

  if (nodeByValue(next, value)) {
    const existing = nodeByValue(next, value)!;
    steps.push({
      id: stepId(),
      explanation: `Η τιμή ${value} υπάρχει ήδη στο δέντρο.`,
      nodeHighlights: { [existing.id]: 'found' },
      edgeHighlights: {},
    });
    return { tree: next, steps };
  }

  const newId = createId('bt');
  const newNode: BinaryTreeNode = { id: newId, value, left: null, right: null };

  if (!next.rootId) {
    next.rootId = newId;
    next.nodes[newId] = newNode;
    steps.push({
      id: stepId(),
      explanation: `Το δέντρο είναι κενό. Ο κόμβος ${value} γίνεται ρίζα.`,
      nodeHighlights: { [newId]: 'creating' },
      edgeHighlights: {},
    });
    steps.push({
      id: stepId(),
      explanation: `Η εισαγωγή ολοκληρώθηκε. Ρίζα είναι ο ${value}.`,
      nodeHighlights: { [newId]: 'found' },
      edgeHighlights: {},
    });
    return { tree: next, steps };
  }

  let curId: string | null = next.rootId;
  let parentId: string | null = null;
  let wentLeft = false;

  while (curId) {
    const cur: BinaryTreeNode = next.nodes[curId]!;
    steps.push({
      id: stepId(),
      explanation: `Σύγκριση ${value} με κόμβο ${cur.value}.`,
      nodeHighlights: { ...visited, [curId]: 'current' },
      edgeHighlights: {},
    });
    visited[curId] = 'visited';
    parentId = curId;
    if (value < cur.value) {
      wentLeft = true;
      steps.push({
        id: stepId(),
        explanation: `${value} < ${cur.value}, πάμε αριστερά.`,
        nodeHighlights: { ...visited, [curId]: 'current' },
        edgeHighlights: cur.left ? { [`${curId}->${cur.left}`]: 'active' } : {},
      });
      curId = cur.left;
    } else {
      wentLeft = false;
      steps.push({
        id: stepId(),
        explanation: `${value} > ${cur.value}, πάμε δεξιά.`,
        nodeHighlights: { ...visited, [curId]: 'current' },
        edgeHighlights: cur.right ? { [`${curId}->${cur.right}`]: 'active' } : {},
      });
      curId = cur.right;
    }
  }

  next.nodes[newId] = newNode;
  if (parentId) {
    if (wentLeft) next.nodes[parentId].left = newId;
    else next.nodes[parentId].right = newId;
    steps.push({
      id: stepId(),
      explanation: `Ο κόμβος ${value} γίνεται ${wentLeft ? 'αριστερό' : 'δεξί'} παιδί του κόμβου ${next.nodes[parentId].value}.`,
      nodeHighlights: { ...visited, [parentId]: 'parent', [newId]: 'creating' },
      edgeHighlights: { [`${parentId}->${newId}`]: 'active' },
    });
  }

  steps.push({
    id: stepId(),
    explanation: `Η εισαγωγή του ${value} ολοκληρώθηκε.`,
    nodeHighlights: { [newId]: 'found' },
    edgeHighlights: {},
  });

  return { tree: next, steps };
}

export function searchBinaryTree(
  tree: BinaryTreeState,
  value: number
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const visited: Record<string, 'visited'> = {};
  let curId = tree.rootId;

  if (!curId) {
    steps.push({
      id: stepId(),
      explanation: 'Το δέντρο είναι κενό. Η αναζήτηση απέτυχε.',
      nodeHighlights: {},
      edgeHighlights: {},
    });
    return steps;
  }

  while (curId) {
    const cur: BinaryTreeNode = tree.nodes[curId]!;
    steps.push({
      id: stepId(),
      explanation: `Επίσκεψη κόμβου ${cur.value}.`,
      nodeHighlights: { ...visited, [curId]: 'current' },
      edgeHighlights: {},
    });
    if (cur.value === value) {
      steps.push({
        id: stepId(),
        explanation: `Βρέθηκε ο ${value}.`,
        nodeHighlights: { ...visited, [curId]: 'found' },
        edgeHighlights: {},
      });
      return steps;
    }
    visited[curId] = 'visited';
    if (value < cur.value) {
      steps.push({
        id: stepId(),
        explanation: `${value} < ${cur.value}, κίνηση αριστερά.`,
        nodeHighlights: { ...visited, [curId]: 'current' },
        edgeHighlights: cur.left ? { [`${curId}->${cur.left}`]: 'active' } : {},
      });
      curId = cur.left;
    } else {
      steps.push({
        id: stepId(),
        explanation: `${value} > ${cur.value}, κίνηση δεξιά.`,
        nodeHighlights: { ...visited, [curId]: 'current' },
        edgeHighlights: cur.right ? { [`${curId}->${cur.right}`]: 'active' } : {},
      });
      curId = cur.right;
    }
  }

  steps.push({
    id: stepId(),
    explanation: `Ο ${value} δεν βρέθηκε.`,
    nodeHighlights: { ...visited },
    edgeHighlights: {},
  });
  return steps;
}

function minNode(tree: BinaryTreeState, id: string): BinaryTreeNode {
  let cur = tree.nodes[id];
  while (cur.left) cur = tree.nodes[cur.left];
  return cur;
}

export function deleteBinaryTree(
  tree: BinaryTreeState,
  value: number
): { tree: BinaryTreeState; steps: AnimationStep[] } {
  const next = deepClone(tree);
  const steps = searchBinaryTree(next, value);
  const target = nodeByValue(next, value);
  if (!target) return { tree: next, steps };

  const removeNode = (id: string | null, val: number): string | null => {
    if (!id) return null;
    const node = next.nodes[id];
    if (val < node.value) {
      node.left = removeNode(node.left, val);
      return id;
    }
    if (val > node.value) {
      node.right = removeNode(node.right, val);
      return id;
    }
    // found
    if (!node.left && !node.right) {
      delete next.nodes[id];
      steps.push({
        id: stepId(),
        explanation: `Ο κόμβος ${val} είναι φύλλο. Αφαιρείται.`,
        nodeHighlights: { [id]: 'deleting' },
        edgeHighlights: {},
      });
      return null;
    }
    if (!node.left) {
      const r = node.right!;
      delete next.nodes[id];
      steps.push({
        id: stepId(),
        explanation: `Ο κόμβος ${val} έχει μόνο δεξί παιδί. Αναβαθμίζεται.`,
        nodeHighlights: { [id]: 'deleting', [r]: 'child' },
        edgeHighlights: {},
      });
      return r;
    }
    if (!node.right) {
      const l = node.left!;
      delete next.nodes[id];
      steps.push({
        id: stepId(),
        explanation: `Ο κόμβος ${val} έχει μόνο αριστερό παιδί. Αναβαθμίζεται.`,
        nodeHighlights: { [id]: 'deleting', [l]: 'child' },
        edgeHighlights: {},
      });
      return l;
    }
    const succ = minNode(next, node.right);
    steps.push({
      id: stepId(),
      explanation: `Ο κόμβος ${val} έχει δύο παιδιά. Αντικαθίσταται με τον επόμενο κατά ενδοδιάταξη ${succ.value}.`,
      nodeHighlights: { [id]: 'current', [succ.id]: 'found' },
      edgeHighlights: {},
    });
    node.value = succ.value;
    node.right = removeNode(node.right, succ.value);
    return id;
  };

  next.rootId = removeNode(next.rootId, value);
  steps.push({
    id: stepId(),
    explanation: `Η διαγραφή του ${value} ολοκληρώθηκε.`,
    nodeHighlights: {},
    edgeHighlights: {},
  });
  return { tree: next, steps };
}

export function traverseBinaryTree(
  tree: BinaryTreeState,
  order: TravOrder
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const visited: Record<string, 'visited'> = {};
  const sequence: number[] = [];

  const visit = (id: string, edgeFrom?: string) => {
    const n = tree.nodes[id];
    steps.push({
      id: stepId(),
      explanation: `Επίσκεψη κόμβου ${n.value}.`,
      nodeHighlights: { ...visited, [id]: 'current' },
      edgeHighlights: edgeFrom ? { [`${edgeFrom}->${id}`]: 'active' } : {},
    });
    visited[id] = 'visited';
    sequence.push(n.value);
  };

  const pre = (id: string | null, from?: string) => {
    if (!id) return;
    visit(id, from);
    const n = tree.nodes[id];
    pre(n.left, id);
    pre(n.right, id);
  };
  const ino = (id: string | null, from?: string) => {
    if (!id) return;
    const n = tree.nodes[id];
    ino(n.left, id);
    visit(id, from);
    ino(n.right, id);
  };
  const post = (id: string | null, from?: string) => {
    if (!id) return;
    const n = tree.nodes[id];
    post(n.left, id);
    post(n.right, id);
    visit(id, from);
  };
  const level = () => {
    if (!tree.rootId) return;
    const q = [tree.rootId];
    while (q.length) {
      const id = q.shift()!;
      visit(id);
      const n = tree.nodes[id];
      if (n.left) q.push(n.left);
      if (n.right) q.push(n.right);
    }
  };

  steps.push({
    id: stepId(),
    explanation: `Έναρξη διάσχισης ${TRAV_ORDER_LABEL[order]}.`,
    nodeHighlights: {},
    edgeHighlights: {},
  });

  if (order === 'preorder') pre(tree.rootId);
  else if (order === 'inorder') ino(tree.rootId);
  else if (order === 'postorder') post(tree.rootId);
  else level();

  steps.push({
    id: stepId(),
    explanation: `Αποτέλεσμα ${TRAV_ORDER_LABEL[order]}: [${sequence.join(', ')}]`,
    nodeHighlights: { ...visited },
    edgeHighlights: {},
    meta: { sequence },
  });
  return steps;
}

export function highlightRelation(
  tree: BinaryTreeState,
  value: number,
  relation: 'parent' | 'left' | 'right' | 'leaves' | 'internal' | 'height' | 'depth'
): AnimationStep[] {
  if (relation === 'leaves') {
    const ids = leafIds(tree);
    const hl: Record<string, 'found'> = {};
    ids.forEach((id) => {
      hl[id] = 'found';
    });
    return [
      {
        id: stepId(),
        explanation: `Φύλλα: ${ids.map((id) => tree.nodes[id].value).join(', ') || 'κανένα'}.`,
        nodeHighlights: hl,
        edgeHighlights: {},
      },
    ];
  }
  if (relation === 'internal') {
    const ids = internalIds(tree);
    const hl: Record<string, 'found'> = {};
    ids.forEach((id) => {
      hl[id] = 'found';
    });
    return [
      {
        id: stepId(),
        explanation: `Εσωτερικοί κόμβοι: ${ids.map((id) => tree.nodes[id].value).join(', ') || 'κανένας'}.`,
        nodeHighlights: hl,
        edgeHighlights: {},
      },
    ];
  }
  if (relation === 'height') {
    const h = binaryTreeHeight(tree, tree.rootId);
    return [
      {
        id: stepId(),
        explanation: `Το ύψος του δέντρου είναι ${h} (ακμές στη μακρύτερη διαδρομή ρίζα–φύλλο).`,
        nodeHighlights: tree.rootId ? { [tree.rootId]: 'current' } : {},
        edgeHighlights: {},
        meta: { height: h },
      },
    ];
  }

  const node = nodeByValue(tree, value);
  if (!node) {
    return [
      {
        id: stepId(),
        explanation: `Η τιμή ${value} δεν βρέθηκε.`,
        nodeHighlights: {},
        edgeHighlights: {},
      },
    ];
  }

  if (relation === 'depth') {
    const d = binaryTreeDepth(tree, node.id);
    return [
      {
        id: stepId(),
        explanation: `Το βάθος του ${value} είναι ${d}.`,
        nodeHighlights: { [node.id]: 'found' },
        edgeHighlights: {},
        meta: { depth: d },
      },
    ];
  }
  if (relation === 'parent') {
    const p = findParentId(tree, node.id);
    return [
      {
        id: stepId(),
        explanation: p
          ? `Ο γονέας του ${value} είναι ο ${tree.nodes[p].value}.`
          : `Ο ${value} είναι η ρίζα (χωρίς γονέα).`,
        nodeHighlights: p
          ? { [node.id]: 'child', [p]: 'parent' }
          : { [node.id]: 'found' },
        edgeHighlights: {},
      },
    ];
  }
  if (relation === 'left') {
    return [
      {
        id: stepId(),
        explanation: node.left
          ? `Το αριστερό παιδί του ${value} είναι ο ${tree.nodes[node.left].value}.`
          : `Ο ${value} δεν έχει αριστερό παιδί.`,
        nodeHighlights: node.left
          ? { [node.id]: 'parent', [node.left]: 'child' }
          : { [node.id]: 'current' },
        edgeHighlights: node.left ? { [`${node.id}->${node.left}`]: 'active' } : {},
      },
    ];
  }
  return [
    {
      id: stepId(),
      explanation: node.right
        ? `Το δεξί παιδί του ${value} είναι ο ${tree.nodes[node.right].value}.`
        : `Ο ${value} δεν έχει δεξί παιδί.`,
      nodeHighlights: node.right
        ? { [node.id]: 'parent', [node.right]: 'child' }
        : { [node.id]: 'current' },
      edgeHighlights: node.right ? { [`${node.id}->${node.right}`]: 'active' } : {},
    },
  ];
}
