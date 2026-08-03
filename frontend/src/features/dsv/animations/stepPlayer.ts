import type { AnimationStep } from '../types';

export function emptyStep(explanation = 'Έτοιμο.'): AnimationStep {
  return {
    id: 'idle',
    explanation,
    nodeHighlights: {},
    edgeHighlights: {},
    pointerHighlights: {},
  };
}

export function mergeHighlights(
  base: AnimationStep,
  patch: Partial<AnimationStep>
): AnimationStep {
  return {
    ...base,
    ...patch,
    nodeHighlights: { ...base.nodeHighlights, ...patch.nodeHighlights },
    edgeHighlights: { ...base.edgeHighlights, ...patch.edgeHighlights },
    pointerHighlights: {
      ...base.pointerHighlights,
      ...patch.pointerHighlights,
    },
  };
}

export function speedToMs(speed: number): number {
  // speed 0.25–3 → delay 1600ms–200ms
  const clamped = Math.min(3, Math.max(0.25, speed));
  return Math.round(900 / clamped);
}
