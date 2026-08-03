export type StructureKind =
  | 'general-tree'
  | 'binary-tree'
  | 'bst'
  | 'linked-list'
  | 'directed-graph'
  | 'undirected-graph';

export type CodeLanguage = 'c' | 'cpp' | 'java' | 'python' | 'javascript' | 'pseudocode';

export type NodeHighlight =
  | 'default'
  | 'current'
  | 'visited'
  | 'found'
  | 'parent'
  | 'child'
  | 'ancestor'
  | 'descendant'
  | 'creating'
  | 'deleting'
  | 'top'
  | 'front'
  | 'rear';

export type EdgeHighlight = 'default' | 'active' | 'visited';

export interface AnimationStep {
  id: string;
  explanation: string;
  nodeHighlights: Record<string, NodeHighlight>;
  edgeHighlights: Record<string, EdgeHighlight>;
  pointerHighlights?: Record<string, string | null>;
  meta?: Record<string, unknown>;
}

export interface TreeNodeData {
  id: string;
  label: string;
  children: string[];
  collapsed?: boolean;
}

export interface GeneralTreeState {
  rootId: string | null;
  nodes: Record<string, TreeNodeData>;
}

export interface BinaryTreeNode {
  id: string;
  value: number;
  left: string | null;
  right: string | null;
}

export interface BinaryTreeState {
  rootId: string | null;
  nodes: Record<string, BinaryTreeNode>;
}

export interface LinkedListNode {
  id: string;
  value: number;
  next: string | null;
}

export interface LinkedListState {
  headId: string | null;
  nodes: Record<string, LinkedListNode>;
}

export interface GraphVertex {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
}

export interface GraphState {
  vertices: Record<string, GraphVertex>;
  edges: GraphEdge[];
}

export type StructureState =
  | { kind: 'general-tree'; data: GeneralTreeState }
  | { kind: 'binary-tree'; data: BinaryTreeState }
  | { kind: 'bst'; data: BinaryTreeState }
  | { kind: 'linked-list'; data: LinkedListState }
  | { kind: 'directed-graph'; data: GraphState }
  | { kind: 'undirected-graph'; data: GraphState };

export interface HistoryEntry {
  structure: StructureState;
  label: string;
}

export const STRUCTURE_KINDS: StructureKind[] = [
  'general-tree',
  'binary-tree',
  'bst',
  'linked-list',
  'directed-graph',
  'undirected-graph',
];

export const STRUCTURE_LABELS: Record<StructureKind, string> = {
  'general-tree': 'Κανονικό δέντρο',
  'binary-tree': 'Δυαδικό δέντρο',
  bst: 'Δυαδικό δέντρο αναζήτησης',
  'linked-list': 'Λίστες',
  'directed-graph': 'Κατευθυνόμενος γράφος',
  'undirected-graph': 'Μη κατευθυνόμενος γράφος',
};

export const DSV_COLORS = {
  primary: '#ff97b2',
  background: '#fff5f8',
  current: '#e85a7a',
  visited: '#ff80a3',
  activeEdge: '#f07f97',
  found: '#22c55e',
  parent: '#e86a8f',
  child: '#ff80a3',
  ancestor: '#f07f97',
  descendant: '#ff97b2',
  top: '#ff97b2',
  front: '#ff97b2',
  rear: '#ff80a3',
} as const;
