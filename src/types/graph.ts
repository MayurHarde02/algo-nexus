export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export type TraversalAlgorithmKey = 'bfs' | 'dfs';

export interface TraversalSnapshot {
  activeNode: string | null;
  activeEdge: string | null;
  visitedNodes: string[];
  frontierNodes: string[]; // queue for BFS, stack for DFS
  traversalOrder: string[];
  description: string;
}
