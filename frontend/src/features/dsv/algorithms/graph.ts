import type { AnimationStep, GraphEdge, GraphState } from '../types';
import { createId, stepId } from '../utils/ids';
import { deepClone } from '../utils/clone';

export function addVertex(
  graph: GraphState,
  label: string,
  x = 200 + Math.random() * 200,
  y = 120 + Math.random() * 160
): { graph: GraphState; steps: AnimationStep[] } {
  const next = deepClone(graph);
  const id = createId('v');
  next.vertices[id] = { id, label, x, y };
  return {
    graph: next,
    steps: [
      {
        id: stepId(),
        explanation: `Προσθήκη κορυφής ${label}.`,
        nodeHighlights: { [id]: 'creating' },
        edgeHighlights: {},
      },
    ],
  };
}

export function removeVertex(
  graph: GraphState,
  vertexId: string
): { graph: GraphState; steps: AnimationStep[] } {
  const next = deepClone(graph);
  const label = next.vertices[vertexId]?.label ?? vertexId;
  next.edges = next.edges.filter((e) => e.source !== vertexId && e.target !== vertexId);
  delete next.vertices[vertexId];
  return {
    graph: next,
    steps: [
      {
        id: stepId(),
        explanation: `Αφαίρεση κορυφής ${label} και των συνδεδεμένων ακμών.`,
        nodeHighlights: { [vertexId]: 'deleting' },
        edgeHighlights: {},
      },
    ],
  };
}

export function addEdge(
  graph: GraphState,
  source: string,
  target: string,
  undirected: boolean
): { graph: GraphState; steps: AnimationStep[] } {
  const next = deepClone(graph);
  const exists = next.edges.some(
    (e) =>
      (e.source === source && e.target === target) ||
      (undirected && e.source === target && e.target === source)
  );
  if (exists || source === target) {
    return {
      graph: next,
      steps: [
        {
          id: stepId(),
          explanation: 'Η ακμή υπάρχει ήδη ή είναι μη έγκυρη.',
          nodeHighlights: { [source]: 'current', [target]: 'current' },
          edgeHighlights: {},
        },
      ],
    };
  }
  const edge: GraphEdge = { id: createId('e'), source, target };
  next.edges.push(edge);
  const a = next.vertices[source]?.label;
  const b = next.vertices[target]?.label;
  return {
    graph: next,
    steps: [
      {
        id: stepId(),
        explanation: undirected
          ? `Προσθήκη μη κατευθυνόμενης ακμής ${a} — ${b}.`
          : `Προσθήκη κατευθυνόμενης ακμής ${a} → ${b}.`,
        nodeHighlights: { [source]: 'parent', [target]: 'child' },
        edgeHighlights: { [edge.id]: 'active' },
      },
    ],
  };
}

export function removeEdge(
  graph: GraphState,
  edgeId: string
): { graph: GraphState; steps: AnimationStep[] } {
  const next = deepClone(graph);
  const edge = next.edges.find((e) => e.id === edgeId);
  next.edges = next.edges.filter((e) => e.id !== edgeId);
  return {
    graph: next,
    steps: [
      {
        id: stepId(),
        explanation: edge
          ? `Αφαίρεση ακμής ${next.vertices[edge.source]?.label} → ${next.vertices[edge.target]?.label}.`
          : 'Η ακμή δεν βρέθηκε.',
        nodeHighlights: {},
        edgeHighlights: edge ? { [edge.id]: 'active' } : {},
      },
    ],
  };
}

function neighbors(graph: GraphState, id: string, undirected: boolean): string[] {
  const out: string[] = [];
  for (const e of graph.edges) {
    if (e.source === id) out.push(e.target);
    else if (undirected && e.target === id) out.push(e.source);
  }
  return out;
}

function edgeKey(graph: GraphState, a: string, b: string, undirected: boolean): string | null {
  const e = graph.edges.find(
    (ed) =>
      (ed.source === a && ed.target === b) ||
      (undirected && ed.source === b && ed.target === a)
  );
  return e?.id ?? null;
}

export function dfs(
  graph: GraphState,
  startId: string,
  undirected: boolean
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const visited = new Set<string>();
  const order: string[] = [];

  const walk = (id: string, from?: string) => {
    visited.add(id);
    order.push(id);
    const hl: Record<string, 'visited' | 'current'> = {};
    visited.forEach((v) => {
      hl[v] = 'visited';
    });
    hl[id] = 'current';
    const ek = from ? edgeKey(graph, from, id, undirected) : null;
    steps.push({
      id: stepId(),
      explanation: `Επίσκεψη DFS: ${graph.vertices[id].label}.`,
      nodeHighlights: hl,
      edgeHighlights: ek ? { [ek]: 'active' } : {},
    });
    for (const n of neighbors(graph, id, undirected)) {
      if (!visited.has(n)) walk(n, id);
    }
  };

  steps.push({
    id: stepId(),
    explanation: `Έναρξη DFS από ${graph.vertices[startId]?.label ?? startId}.`,
    nodeHighlights: { [startId]: 'current' },
    edgeHighlights: {},
  });
  if (graph.vertices[startId]) walk(startId);
  steps.push({
    id: stepId(),
    explanation: `Σειρά DFS: [${order.map((id) => graph.vertices[id].label).join(', ')}]`,
    nodeHighlights: Object.fromEntries([...visited].map((id) => [id, 'visited' as const])),
    edgeHighlights: {},
    meta: { sequence: order },
  });
  return steps;
}

export function bfs(
  graph: GraphState,
  startId: string,
  undirected: boolean
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const visited = new Set<string>([startId]);
  const q = [startId];
  const order: string[] = [];

  steps.push({
    id: stepId(),
    explanation: `Έναρξη BFS από ${graph.vertices[startId]?.label ?? startId}. Εισαγωγή στην ουρά.`,
    nodeHighlights: { [startId]: 'current' },
    edgeHighlights: {},
  });

  while (q.length) {
    const id = q.shift()!;
    order.push(id);
    const hl: Record<string, 'visited' | 'current'> = {};
    visited.forEach((v) => {
      hl[v] = 'visited';
    });
    hl[id] = 'current';
    steps.push({
      id: stepId(),
      explanation: `Dequeue και επίσκεψη ${graph.vertices[id].label}.`,
      nodeHighlights: hl,
      edgeHighlights: {},
    });
    for (const n of neighbors(graph, id, undirected)) {
      if (visited.has(n)) continue;
      visited.add(n);
      q.push(n);
      const ek = edgeKey(graph, id, n, undirected);
      steps.push({
        id: stepId(),
        explanation: `Ανακάλυψη ${graph.vertices[n].label} και εισαγωγή στην ουρά.`,
        nodeHighlights: { ...hl, [n]: 'child' },
        edgeHighlights: ek ? { [ek]: 'active' } : {},
      });
    }
  }

  steps.push({
    id: stepId(),
    explanation: `Σειρά BFS: [${order.map((id) => graph.vertices[id].label).join(', ')}]`,
    nodeHighlights: Object.fromEntries([...visited].map((id) => [id, 'visited' as const])),
    edgeHighlights: {},
    meta: { sequence: order },
  });
  return steps;
}

export function connectedComponents(graph: GraphState): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const remaining = new Set(Object.keys(graph.vertices));
  let comp = 0;
  const colors = ['found', 'child', 'parent', 'ancestor', 'descendant'] as const;

  while (remaining.size) {
    const start = remaining.values().next().value as string;
    const stack = [start];
    const component: string[] = [];
    while (stack.length) {
      const id = stack.pop()!;
      if (!remaining.has(id)) continue;
      remaining.delete(id);
      component.push(id);
      for (const n of neighbors(graph, id, true)) {
        if (remaining.has(n)) stack.push(n);
      }
    }
    const tone = colors[comp % colors.length];
    const hl: Record<string, (typeof colors)[number]> = {};
    component.forEach((id) => {
      hl[id] = tone;
    });
    steps.push({
      id: stepId(),
      explanation: `Συνιστώσα ${comp + 1}: [${component.map((id) => graph.vertices[id].label).join(', ')}]`,
      nodeHighlights: hl,
      edgeHighlights: {},
    });
    comp += 1;
  }

  if (!comp) {
    steps.push({
      id: stepId(),
      explanation: 'Το γράφημα δεν έχει κορυφές.',
      nodeHighlights: {},
      edgeHighlights: {},
    });
  } else {
    steps.push({
      id: stepId(),
      explanation: `Βρέθηκαν ${comp} συνεκτικ${comp === 1 ? 'ή' : 'ές'} συνιστώσ${comp === 1 ? 'α' : 'ες'}.`,
      nodeHighlights: {},
      edgeHighlights: {},
      meta: { components: comp },
    });
  }
  return steps;
}
