import type { BinaryTreeState, GeneralTreeState } from '../types';

export interface LayoutPoint {
  id: string;
  x: number;
  y: number;
}

const H_GAP = 90;
const V_GAP = 100;

export function layoutGeneralTree(tree: GeneralTreeState): LayoutPoint[] {
  if (!tree.rootId) return [];
  const positions: LayoutPoint[] = [];
  let nextX = 0;

  const walk = (id: string, depth: number): void => {
    const node = tree.nodes[id];
    if (!node) return;
    const kids = node.collapsed ? [] : node.children;
    if (kids.length === 0) {
      positions.push({ id, x: nextX * H_GAP, y: depth * V_GAP });
      nextX += 1;
      return;
    }
    kids.forEach((cid) => walk(cid, depth + 1));
    const childPts = kids
      .map((cid) => positions.find((p) => p.id === cid))
      .filter(Boolean) as LayoutPoint[];
    const x =
      childPts.reduce((s, p) => s + p.x, 0) / Math.max(childPts.length, 1);
    positions.push({ id, x, y: depth * V_GAP });
  };

  walk(tree.rootId, 0);
  return positions;
}

export function layoutBinaryTree(tree: BinaryTreeState): LayoutPoint[] {
  if (!tree.rootId) return [];
  const positions: LayoutPoint[] = [];
  let nextX = 0;

  const walk = (id: string | null, depth: number): void => {
    if (!id) return;
    const node = tree.nodes[id];
    if (!node) return;
    walk(node.left, depth + 1);
    positions.push({ id, x: nextX * H_GAP, y: depth * V_GAP });
    nextX += 1;
    walk(node.right, depth + 1);
  };

  walk(tree.rootId, 0);
  return positions;
}
