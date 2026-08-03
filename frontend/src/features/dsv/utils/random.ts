import type { GeneralTreeState, StructureKind, StructureState } from '../types';
import { createId } from './ids';
import { emptyBinaryTree, emptyGraph, emptyLinkedList } from './defaults';
import { insertBinaryTree } from '../algorithms/binaryTree';
import { insertBinaryChild } from '../algorithms/plainBinaryTree';
import { insertEnd } from '../algorithms/linkedList';

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomStructure(kind: StructureKind): StructureState {
  switch (kind) {
    case 'bst': {
      let tree = emptyBinaryTree();
      const values = new Set<number>();
      while (values.size < 7) values.add(randInt(1, 99));
      for (const v of values) {
        tree = insertBinaryTree(tree, v).tree;
      }
      return { kind, data: tree };
    }
    case 'binary-tree': {
      let tree = emptyBinaryTree();
      const rootVal = randInt(1, 50);
      tree = insertBinaryChild(tree, null, 'root', rootVal).tree;
      const rootId = tree.rootId!;
      const left = insertBinaryChild(tree, rootId, 'left', randInt(1, 99)).tree;
      tree = left;
      const right = insertBinaryChild(tree, rootId, 'right', randInt(1, 99)).tree;
      tree = right;
      const leftId = tree.nodes[rootId].left;
      if (leftId) {
        tree = insertBinaryChild(tree, leftId, 'left', randInt(1, 99)).tree;
        tree = insertBinaryChild(tree, leftId, 'right', randInt(1, 99)).tree;
      }
      return { kind, data: tree };
    }
    case 'linked-list': {
      let list = emptyLinkedList();
      for (let i = 0; i < 5; i++) list = insertEnd(list, randInt(1, 99)).list;
      return { kind, data: list };
    }
    case 'general-tree': {
      const root = createId('gt');
      const nodes: GeneralTreeState['nodes'] = {
        [root]: { id: root, label: 'A', children: [] },
      };
      let labelCode = 66;
      const make = (parent: string, depth: number) => {
        if (depth >= 2) return;
        const count = randInt(1, 3);
        for (let i = 0; i < count; i++) {
          const id = createId('gt');
          nodes[id] = { id, label: String.fromCharCode(labelCode++), children: [] };
          nodes[parent].children.push(id);
          if (Math.random() > 0.4) make(id, depth + 1);
        }
      };
      make(root, 0);
      return { kind, data: { rootId: root, nodes } };
    }
    case 'directed-graph':
    case 'undirected-graph': {
      const g = emptyGraph();
      const ids = ['A', 'B', 'C', 'D', 'E'].map((label, i) => {
        const id = createId('v');
        g.vertices[id] = {
          id,
          label,
          x: 80 + (i % 3) * 160,
          y: 60 + Math.floor(i / 3) * 160,
        };
        return id;
      });
      for (let i = 0; i < 6; i++) {
        const a = ids[randInt(0, ids.length - 1)];
        const b = ids[randInt(0, ids.length - 1)];
        if (a === b) continue;
        const exists = g.edges.some(
          (e) =>
            (e.source === a && e.target === b) ||
            (kind === 'undirected-graph' && e.source === b && e.target === a)
        );
        if (!exists) g.edges.push({ id: createId('e'), source: a, target: b });
      }
      return { kind, data: g };
    }
  }
}
