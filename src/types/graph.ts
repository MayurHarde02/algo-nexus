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

export type GraphAlgorithmKey = 'bfs' | 'dfs' | 'kruskal' | 'prim' | 'bellmanFord';
export type TraversalAlgorithmKey = GraphAlgorithmKey; // Backward compatibility alias

export interface DsuNodeState {
  id: string;
  parent: string;
  rank: number;
}

export interface BellmanFordState {
  pass: number;
  maxPasses: number;
  distances: Record<string, number>;
  predecessors: Record<string, string | null>;
  hasNegativeCycle: boolean;
  cycleNodes?: string[];
  activeEdge?: { source: string; target: string; weight: number; relaxed: boolean };
}

export interface GraphSnapshot {
  activeNode: string | null;
  activeEdge: string | null; // e.g. "e1" or "A-B"
  visitedNodes: string[];
  frontierNodes: string[]; // queue for BFS, stack for DFS
  traversalOrder: string[];
  description: string;
  
  // Kruskal / Prim MST additions
  mstEdges?: string[];
  rejectedEdges?: string[];
  totalMstWeight?: number;
  dsuSets?: DsuNodeState[];
  candidateEdges?: { id: string; source: string; target: string; weight: number }[];
  
  // Bellman-Ford additions
  bellmanFord?: BellmanFordState;
}

export type TraversalSnapshot = GraphSnapshot;
