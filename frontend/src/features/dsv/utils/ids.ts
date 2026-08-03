let counter = 0;

export function createId(prefix = 'n'): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}_${counter.toString(36)}`;
}

export function resetIdCounter(): void {
  counter = 0;
}

export function stepId(prefix = 'step'): string {
  return createId(prefix);
}
