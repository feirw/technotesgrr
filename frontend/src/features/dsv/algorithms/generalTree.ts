import type { AnimationStep, GeneralTreeState, TreeNodeData } from '../types';
import { createId, stepId } from '../utils/ids';
import { deepClone } from '../utils/clone';

export function findParent(
  tree: GeneralTreeState,
  childId: string
): string | null {
  for (const n of Object.values(tree.nodes)) {
    if (n.children.includes(childId)) return n.id;
  }
  return null;
}

function collectDescendants(tree: GeneralTreeState, id: string): string[] {
  const out: string[] = [];
  const walk = (nid: string) => {
    for (const c of tree.nodes[nid]?.children ?? []) {
      out.push(c);
      walk(c);
    }
  };
  walk(id);
  return out;
}

function collectAncestors(tree: GeneralTreeState, id: string): string[] {
  const out: string[] = [];
  let p = findParent(tree, id);
  while (p) {
    out.push(p);
    p = findParent(tree, p);
  }
  return out;
}

export function addChild(
  tree: GeneralTreeState,
  parentId: string,
  label: string
): { tree: GeneralTreeState; steps: AnimationStep[] } {
  const next = deepClone(tree);
  const steps: AnimationStep[] = [];
  if (!next.nodes[parentId]) {
    steps.push({
      id: stepId(),
      explanation: 'Ο γονικός κόμβος δεν βρέθηκε.',
      nodeHighlights: {},
      edgeHighlights: {},
    });
    return { tree: next, steps };
  }
  const id = createId('gt');
  const node: TreeNodeData = { id, label, children: [] };
  next.nodes[id] = node;
  next.nodes[parentId].children.push(id);
  if (!next.rootId) next.rootId = id;
  steps.push({
    id: stepId(),
    explanation: `Προσθήκη κόμβου «${label}» ως παιδί του «${next.nodes[parentId].label}».`,
    nodeHighlights: { [parentId]: 'parent', [id]: 'creating' },
    edgeHighlights: { [`${parentId}->${id}`]: 'active' },
  });
  return { tree: next, steps };
}

export function deleteNode(
  tree: GeneralTreeState,
  nodeId: string
): { tree: GeneralTreeState; steps: AnimationStep[] } {
  const next = deepClone(tree);
  const steps: AnimationStep[] = [];
  if (!next.nodes[nodeId]) {
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
  if (nodeId === next.rootId) {
    const descendants = collectDescendants(next, nodeId);
    [...descendants, nodeId].forEach((id) => delete next.nodes[id]);
    next.rootId = null;
    steps.push({
      id: stepId(),
      explanation: 'Διαγράφηκε η ρίζα και ολόκληρο το υποδέντρο.',
      nodeHighlights: { [nodeId]: 'deleting' },
      edgeHighlights: {},
    });
    return { tree: next, steps };
  }
  const parent = findParent(next, nodeId);
  const descendants = collectDescendants(next, nodeId);
  steps.push({
    id: stepId(),
    explanation: `Διαγραφή κόμβου «${next.nodes[nodeId].label}» και του υποδέντρου του.`,
    nodeHighlights: Object.fromEntries(
      [nodeId, ...descendants].map((id) => [id, 'deleting' as const])
    ),
    edgeHighlights: {},
  });
  if (parent) {
    next.nodes[parent].children = next.nodes[parent].children.filter((c) => c !== nodeId);
  }
  [...descendants, nodeId].forEach((id) => delete next.nodes[id]);
  return { tree: next, steps };
}

export function renameNode(
  tree: GeneralTreeState,
  nodeId: string,
  label: string
): { tree: GeneralTreeState; steps: AnimationStep[] } {
  const next = deepClone(tree);
  if (!next.nodes[nodeId]) {
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
  const prev = next.nodes[nodeId].label;
  next.nodes[nodeId].label = label;
  return {
    tree: next,
    steps: [
      {
        id: stepId(),
        explanation: `Μετονομασία «${prev}» → «${label}».`,
        nodeHighlights: { [nodeId]: 'found' },
        edgeHighlights: {},
      },
    ],
  };
}

export function moveSubtree(
  tree: GeneralTreeState,
  nodeId: string,
  newParentId: string
): { tree: GeneralTreeState; steps: AnimationStep[] } {
  const next = deepClone(tree);
  const steps: AnimationStep[] = [];
  if (!next.nodes[nodeId] || !next.nodes[newParentId]) {
    return {
      tree: next,
      steps: [
        {
          id: stepId(),
          explanation: 'Μη έγκυρη μετακίνηση: λείπει κόμβος ή γονέας.',
          nodeHighlights: {},
          edgeHighlights: {},
        },
      ],
    };
  }
  if (nodeId === newParentId || collectDescendants(next, nodeId).includes(newParentId)) {
    return {
      tree: next,
      steps: [
        {
          id: stepId(),
          explanation: 'Δεν μπορεί να μετακινηθεί υποδέντρο μέσα στον εαυτό του.',
          nodeHighlights: { [nodeId]: 'current', [newParentId]: 'current' },
          edgeHighlights: {},
        },
      ],
    };
  }
  if (nodeId === next.rootId) {
    return {
      tree: next,
      steps: [
        {
          id: stepId(),
          explanation: 'Δεν μπορεί να μετακινηθεί η ρίζα.',
          nodeHighlights: { [nodeId]: 'current' },
          edgeHighlights: {},
        },
      ],
    };
  }
  const oldParent = findParent(next, nodeId);
  if (oldParent) {
    next.nodes[oldParent].children = next.nodes[oldParent].children.filter((c) => c !== nodeId);
  }
  next.nodes[newParentId].children.push(nodeId);
  steps.push({
    id: stepId(),
    explanation: `Μετακίνηση υποδέντρου «${next.nodes[nodeId].label}» κάτω από «${next.nodes[newParentId].label}».`,
    nodeHighlights: {
      [nodeId]: 'current',
      [newParentId]: 'parent',
      ...(oldParent ? { [oldParent]: 'visited' } : {}),
    },
    edgeHighlights: { [`${newParentId}->${nodeId}`]: 'active' },
  });
  return { tree: next, steps };
}

export function toggleCollapse(
  tree: GeneralTreeState,
  nodeId: string
): { tree: GeneralTreeState; steps: AnimationStep[] } {
  const next = deepClone(tree);
  if (!next.nodes[nodeId]) {
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
  next.nodes[nodeId].collapsed = !next.nodes[nodeId].collapsed;
  const collapsed = next.nodes[nodeId].collapsed;
  return {
    tree: next,
    steps: [
      {
        id: stepId(),
        explanation: collapsed
          ? `Σύμπτυξη παιδιών του «${next.nodes[nodeId].label}».`
          : `Ανάπτυξη παιδιών του «${next.nodes[nodeId].label}».`,
        nodeHighlights: { [nodeId]: 'current' },
        edgeHighlights: {},
      },
    ],
  };
}

export function highlightParent(tree: GeneralTreeState, nodeId: string): AnimationStep[] {
  const p = findParent(tree, nodeId);
  return [
    {
      id: stepId(),
      explanation: p
        ? `Ο γονέας του «${tree.nodes[nodeId]?.label}» είναι «${tree.nodes[p].label}».`
        : 'Ο επιλεγμένος κόμβος δεν έχει γονέα (ρίζα).',
      nodeHighlights: p
        ? { [nodeId]: 'child', [p]: 'parent' }
        : { [nodeId]: 'found' },
      edgeHighlights: p ? { [`${p}->${nodeId}`]: 'active' } : {},
    },
  ];
}

export function highlightChildren(tree: GeneralTreeState, nodeId: string): AnimationStep[] {
  const kids = tree.nodes[nodeId]?.children ?? [];
  const hl: Record<string, 'parent' | 'child'> = { [nodeId]: 'parent' };
  kids.forEach((c) => {
    hl[c] = 'child';
  });
  return [
    {
      id: stepId(),
      explanation: kids.length
        ? `Παιδιά: ${kids.map((c) => tree.nodes[c].label).join(', ')}.`
        : 'Δεν υπάρχουν παιδιά.',
      nodeHighlights: hl,
      edgeHighlights: Object.fromEntries(kids.map((c) => [`${nodeId}->${c}`, 'active' as const])),
    },
  ];
}

export function highlightAncestors(tree: GeneralTreeState, nodeId: string): AnimationStep[] {
  const anc = collectAncestors(tree, nodeId);
  const hl: Record<string, 'ancestor' | 'current'> = { [nodeId]: 'current' };
  anc.forEach((a) => {
    hl[a] = 'ancestor';
  });
  return [
    {
      id: stepId(),
      explanation: anc.length
        ? `Πρόγονοι: ${anc.map((a) => tree.nodes[a].label).join(' → ')}.`
        : 'Δεν υπάρχουν πρόγονοι.',
      nodeHighlights: hl,
      edgeHighlights: {},
    },
  ];
}

export function highlightDescendants(tree: GeneralTreeState, nodeId: string): AnimationStep[] {
  const desc = collectDescendants(tree, nodeId);
  const hl: Record<string, 'descendant' | 'current'> = { [nodeId]: 'current' };
  desc.forEach((d) => {
    hl[d] = 'descendant';
  });
  return [
    {
      id: stepId(),
      explanation: desc.length
        ? `Απόγονοι: ${desc.map((d) => tree.nodes[d].label).join(', ')}.`
        : 'Δεν υπάρχουν απόγονοι.',
      nodeHighlights: hl,
      edgeHighlights: {},
    },
  ];
}
