import type { EdgeHighlight, NodeHighlight } from '../types';
import { DSV_COLORS } from '../types';

export function nodeFill(h?: NodeHighlight): string {
  switch (h) {
    case 'current':
      return DSV_COLORS.current;
    case 'visited':
      return DSV_COLORS.visited;
    case 'found':
      return DSV_COLORS.found;
    case 'parent':
      return DSV_COLORS.parent;
    case 'child':
      return DSV_COLORS.child;
    case 'ancestor':
      return DSV_COLORS.ancestor;
    case 'descendant':
      return DSV_COLORS.descendant;
    case 'creating':
      return '#86efac';
    case 'deleting':
      return '#f87171';
    case 'top':
    case 'front':
      return DSV_COLORS.primary;
    case 'rear':
      return DSV_COLORS.rear;
    default:
      return DSV_COLORS.primary;
  }
}

export function edgeStroke(h?: EdgeHighlight): string {
  switch (h) {
    case 'active':
      return DSV_COLORS.activeEdge;
    case 'visited':
      return DSV_COLORS.visited;
    default:
      return '#f0b4c4';
  }
}
