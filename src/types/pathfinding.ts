export type CellType = 'empty' | 'wall' | 'start' | 'target' | 'visited' | 'frontier' | 'path';

export interface GridCell {
  row: number;
  col: number;
  type: CellType;
  distance: number;
  fCost?: number;
  gCost?: number;
  hCost?: number;
  parent?: { row: number; col: number } | null;
}

export type PathfindingAlgorithmKey = 'bfs' | 'dfs' | 'dijkstra' | 'astar';

export interface PathfindingSnapshot {
  grid: CellType[][];
  visitedCount: number;
  pathLength: number;
  currentCell: { row: number; col: number } | null;
  statusText: string;
  isComplete: boolean;
  hasPath: boolean;
}

export interface PathfindingMetadata {
  key: PathfindingAlgorithmKey;
  name: string;
  timeComplexity: string;
  spaceComplexity: string;
  guaranteesShortestPath: boolean;
  weighted: boolean;
  heuristic: string;
  description: string;
}
