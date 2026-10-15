export type TerrainType = 'empty' | 'mud' | 'water' | 'wall';

export type CellType =
  | 'empty'
  | 'mud'
  | 'water'
  | 'wall'
  | 'start'
  | 'target'
  | 'visited'
  | 'frontier'
  | 'path';

export const TERRAIN_COSTS: Record<TerrainType, number> = {
  empty: 1,
  mud: 3,
  water: 5,
  wall: Infinity,
};

export interface GridCell {
  row: number;
  col: number;
  type: CellType;
  terrain?: TerrainType;
  distance: number;
  fCost?: number;
  gCost?: number;
  hCost?: number;
  parent?: { row: number; col: number } | null;
}

export type PathfindingAlgorithmKey = 'bfs' | 'dfs' | 'dijkstra' | 'astar';

export interface PathfindingSnapshot {
  grid: CellType[][];
  terrain?: TerrainType[][];
  visitedCount: number;
  pathLength: number;
  pathCost?: number;
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
