export type ElementState = 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'auxiliary';

export interface ArrayElement {
  value: number;
  state: ElementState;
  id: string;
}

export type SortingAlgorithmKey = 
  | 'bubble'
  | 'insertion'
  | 'selection'
  | 'merge'
  | 'quick'
  | 'heap';

export interface SortingEvent {
  type: 'compare' | 'swap' | 'overwrite' | 'mark_sorted' | 'mark_pivot' | 'clear_highlights';
  array: number[];
  elementStates: Record<number, ElementState>;
  description: string;
  pseudocodeLine: number;
  comparisonsDelta: number;
  swapsDelta: number;
}

export interface SortingSnapshot {
  array: ArrayElement[];
  comparisons: number;
  swaps: number;
  description: string;
  pseudocodeLine: number;
}

export interface AlgorithmMetadata {
  key: SortingAlgorithmKey;
  name: string;
  category: string;
  timeBest: string;
  timeAverage: string;
  timeWorst: string;
  spaceComplexity: string;
  stability: 'Stable' | 'Unstable';
  inPlace: boolean;
  pseudocode: string[];
  description: string;
  invariants: string;
}
