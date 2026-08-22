export type AlgoId = 'bubble' | 'selection' | 'linear' | 'binary';

export type SortOrder = 'asc' | 'desc';

export type CellRole =
  | 'default'
  | 'compare'
  | 'swap'
  | 'sorted'
  | 'key'
  | 'discard'
  | 'found'
  | 'min';

export interface Pointers {
  i?: number;
  j?: number;
  min?: number;
  max?: number;
  low?: number;
  high?: number;
  mid?: number;
}

export interface ArrayView {
  label?: string;
  values: (number | null)[];
  roles: CellRole[];
  pointers?: Pointers;
}

export interface AlgoStep {
  arrays: ArrayView[];
  line: number;
  message: string;
  done?: boolean;
}

export interface AlgoDef {
  id: AlgoId;
  title: string;
  section: 'sorting' | 'search';
  needsKey?: boolean;
  needsOrder?: boolean;
  code: (order: SortOrder) => string[];
}

export const CELL_FILL: Record<CellRole, string> = {
  default: '#ff97b2',
  compare: '#e85a7a',
  swap: '#c2185b',
  sorted: '#22c55e',
  key: '#0ea5e9',
  discard: '#cbd5e1',
  found: '#16a34a',
  min: '#f59e0b',
};

export const CELL_LABEL: Record<CellRole, string> = {
  default: 'Στοιχείο',
  compare: 'Σύγκριση',
  swap: 'Ανταλλαγή',
  sorted: 'Ταξινομημένο',
  key: 'Κλειδί / όριο',
  discard: 'Αποκλείστηκε',
  found: 'Βρέθηκε',
  min: 'Ελάχ. / μέγ.',
};
