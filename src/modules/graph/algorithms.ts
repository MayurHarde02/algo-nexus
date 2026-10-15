import type {
  GraphData,
  GraphAlgorithmKey,
  GraphSnapshot,
  DsuNodeState,
  BellmanFordState,
} from '../../types/graph';

export const SAMPLE_GRAPHS: Record<string, { label: string; data: GraphData }> = {
  dag: {
    label: 'Directed Acyclic Graph (DAG)',
    data: {
      nodes: [
        { id: 'A', label: 'A', x: 80, y: 150 },
        { id: 'B', label: 'B', x: 220, y: 70 },
        { id: 'C', label: 'C', x: 220, y: 230 },
        { id: 'D', label: 'D', x: 380, y: 70 },
        { id: 'E', label: 'E', x: 380, y: 230 },
        { id: 'F', label: 'F', x: 520, y: 150 },
      ],
      edges: [
        { id: 'e1', source: 'A', target: 'B', weight: 4 },
        { id: 'e2', source: 'A', target: 'C', weight: 2 },
        { id: 'e3', source: 'B', target: 'D', weight: 5 },
        { id: 'e4', source: 'C', target: 'E', weight: 3 },
        { id: 'e5', source: 'D', target: 'F', weight: 1 },
        { id: 'e6', source: 'E', target: 'F', weight: 6 },
        { id: 'e7', source: 'B', target: 'E', weight: 7 },
      ],
    },
  },
  weightedMst: {
    label: 'Weighted Network (MST Benchmark)',
    data: {
      nodes: [
        { id: 'A', label: 'A', x: 90, y: 150 },
        { id: 'B', label: 'B', x: 220, y: 60 },
        { id: 'C', label: 'C', x: 220, y: 240 },
        { id: 'D', label: 'D', x: 370, y: 60 },
        { id: 'E', label: 'E', x: 370, y: 240 },
        { id: 'F', label: 'F', x: 500, y: 150 },
        { id: 'G', label: 'G', x: 295, y: 150 },
      ],
      edges: [
        { id: 'e1', source: 'A', target: 'B', weight: 7 },
        { id: 'e2', source: 'A', target: 'C', weight: 5 },
        { id: 'e3', source: 'B', target: 'D', weight: 8 },
        { id: 'e4', source: 'B', target: 'G', weight: 9 },
        { id: 'e5', source: 'C', target: 'E', weight: 6 },
        { id: 'e6', source: 'C', target: 'G', weight: 7 },
        { id: 'e7', source: 'D', target: 'F', weight: 5 },
        { id: 'e8', source: 'D', target: 'G', weight: 15 },
        { id: 'e9', source: 'E', target: 'F', weight: 9 },
        { id: 'e10', source: 'E', target: 'G', weight: 8 },
        { id: 'e11', source: 'F', target: 'G', weight: 11 },
      ],
    },
  },
  negativeCycle: {
    label: 'Bellman-Ford Negative Cycle',
    data: {
      nodes: [
        { id: 'S', label: 'S (Src)', x: 90, y: 150 },
        { id: 'A', label: 'A', x: 230, y: 70 },
        { id: 'B', label: 'B', x: 230, y: 230 },
        { id: 'C', label: 'C', x: 420, y: 70 },
        { id: 'D', label: 'D', x: 420, y: 230 },
      ],
      edges: [
        { id: 'e1', source: 'S', target: 'A', weight: 4 },
        { id: 'e2', source: 'S', target: 'B', weight: 5 },
        { id: 'e3', source: 'A', target: 'C', weight: 3 },
        { id: 'e4', source: 'C', target: 'D', weight: -6 },
        { id: 'e5', source: 'D', target: 'A', weight: 2 },
        { id: 'e6', source: 'B', target: 'D', weight: 4 },
      ],
    },
  },
  binaryTree: {
    label: 'Complete Binary Tree',
    data: {
      nodes: [
        { id: '1', label: '1 (Root)', x: 300, y: 50 },
        { id: '2', label: '2', x: 180, y: 140 },
        { id: '3', label: '3', x: 420, y: 140 },
        { id: '4', label: '4', x: 120, y: 230 },
        { id: '5', label: '5', x: 240, y: 230 },
        { id: '6', label: '6', x: 360, y: 230 },
        { id: '7', label: '7', x: 480, y: 230 },
      ],
      edges: [
        { id: 'e1', source: '1', target: '2', weight: 2 },
        { id: 'e2', source: '1', target: '3', weight: 3 },
        { id: 'e3', source: '2', target: '4', weight: 4 },
        { id: 'e4', source: '2', target: '5', weight: 1 },
        { id: 'e5', source: '3', target: '6', weight: 5 },
        { id: 'e6', source: '3', target: '7', weight: 6 },
      ],
    },
  },
  cyclic: {
    label: 'Cyclic Network Graph',
    data: {
      nodes: [
        { id: 'N1', label: 'N1', x: 150, y: 80 },
        { id: 'N2', label: 'N2', x: 450, y: 80 },
        { id: 'N3', label: 'N3', x: 450, y: 240 },
        { id: 'N4', label: 'N4', x: 150, y: 240 },
        { id: 'N5', label: 'N5', x: 300, y: 160 },
      ],
      edges: [
        { id: 'e1', source: 'N1', target: 'N2', weight: 4 },
        { id: 'e2', source: 'N2', target: 'N3', weight: 2 },
        { id: 'e3', source: 'N3', target: 'N4', weight: 7 },
        { id: 'e4', source: 'N4', target: 'N1', weight: 1 },
        { id: 'e5', source: 'N1', target: 'N5', weight: 3 },
        { id: 'e6', source: 'N5', target: 'N3', weight: 5 },
      ],
    },
  },
};

// Disjoint Set Union Helper for Kruskal's
class DisjointSetUnion {
  parent: Map<string, string>;
  rank: Map<string, number>;

  constructor(nodeIds: string[]) {
    this.parent = new Map();
    this.rank = new Map();
    for (const id of nodeIds) {
      this.parent.set(id, id);
      this.rank.set(id, 0);
    }
  }

  find(x: string): string {
    const root = this.parent.get(x) ?? x;
    if (root !== x) {
      const canonical = this.find(root);
      this.parent.set(x, canonical);
      return canonical;
    }
    return x;
  }

  union(x: string, y: string): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX === rootY) return false;

    const rankX = this.rank.get(rootX) ?? 0;
    const rankY = this.rank.get(rootY) ?? 0;

    if (rankX < rankY) {
      this.parent.set(rootX, rootY);
    } else if (rankX > rankY) {
      this.parent.set(rootY, rootX);
    } else {
      this.parent.set(rootY, rootX);
      this.rank.set(rootX, rankX + 1);
    }
    return true;
  }

  getSnapshot(nodeIds: string[]): DsuNodeState[] {
    return nodeIds.map((id) => ({
      id,
      parent: this.find(id),
      rank: this.rank.get(id) ?? 0,
    }));
  }
}

export function runGraphTraversal(
  algo: GraphAlgorithmKey,
  graph: GraphData,
  startNodeId: string
): GraphSnapshot[] {
  if (algo === 'kruskal') {
    return runKruskal(graph);
  }
  if (algo === 'prim') {
    return runPrim(graph, startNodeId);
  }
  if (algo === 'bellmanFord') {
    return runBellmanFord(graph, startNodeId);
  }

  const snapshots: GraphSnapshot[] = [];
  const visited: string[] = [];
  const traversalOrder: string[] = [];

  // Build adjacency list (undirected for BFS/DFS)
  const adj = new Map<string, string[]>();
  for (const n of graph.nodes) {
    adj.set(n.id, []);
  }
  for (const e of graph.edges) {
    adj.get(e.source)?.push(e.target);
    adj.get(e.target)?.push(e.source);
  }

  for (const neighbors of adj.values()) {
    neighbors.sort();
  }

  if (algo === 'bfs') {
    const queue: string[] = [startNodeId];
    const visitedSet = new Set<string>([startNodeId]);
    visited.push(startNodeId);

    snapshots.push({
      activeNode: startNodeId,
      activeEdge: null,
      visitedNodes: [...visited],
      frontierNodes: [...queue],
      traversalOrder: [...traversalOrder],
      description: `Initialized BFS queue with starting node ${startNodeId}.`,
    });

    while (queue.length > 0) {
      const current = queue.shift()!;
      traversalOrder.push(current);

      snapshots.push({
        activeNode: current,
        activeEdge: null,
        visitedNodes: [...visited],
        frontierNodes: [...queue],
        traversalOrder: [...traversalOrder],
        description: `Dequeued node ${current}. Added to traversal sequence.`,
      });

      const neighbors = adj.get(current) || [];
      for (const neighbor of neighbors) {
        if (!visitedSet.has(neighbor)) {
          visitedSet.add(neighbor);
          visited.push(neighbor);
          queue.push(neighbor);

          snapshots.push({
            activeNode: current,
            activeEdge: `${current}-${neighbor}`,
            visitedNodes: [...visited],
            frontierNodes: [...queue],
            traversalOrder: [...traversalOrder],
            description: `Discovered unvisited neighbor ${neighbor}. Enqueued to frontier.`,
          });
        }
      }
    }
  } else {
    // DFS using explicit LIFO stack
    const stack: string[] = [startNodeId];
    const visitedSet = new Set<string>();

    snapshots.push({
      activeNode: startNodeId,
      activeEdge: null,
      visitedNodes: [...visited],
      frontierNodes: [...stack],
      traversalOrder: [...traversalOrder],
      description: `Initialized DFS stack with root node ${startNodeId}.`,
    });

    while (stack.length > 0) {
      const current = stack.pop()!;

      if (!visitedSet.has(current)) {
        visitedSet.add(current);
        visited.push(current);
        traversalOrder.push(current);

        snapshots.push({
          activeNode: current,
          activeEdge: null,
          visitedNodes: [...visited],
          frontierNodes: [...stack],
          traversalOrder: [...traversalOrder],
          description: `Popped node ${current} from stack. Marked as visited.`,
        });

        const neighbors = adj.get(current) || [];
        for (let i = neighbors.length - 1; i >= 0; i--) {
          const neighbor = neighbors[i];
          if (!visitedSet.has(neighbor)) {
            stack.push(neighbor);
            snapshots.push({
              activeNode: current,
              activeEdge: `${current}-${neighbor}`,
              visitedNodes: [...visited],
              frontierNodes: [...stack],
              traversalOrder: [...traversalOrder],
              description: `Pushed unvisited neighbor ${neighbor} onto stack.`,
            });
          }
        }
      }
    }
  }

  snapshots.push({
    activeNode: null,
    activeEdge: null,
    visitedNodes: [...visited],
    frontierNodes: [],
    traversalOrder: [...traversalOrder],
    description: `Traversal complete. Explored ${traversalOrder.length} reachable nodes.`,
  });

  return snapshots;
}

// Kruskal's Minimum Spanning Tree with Disjoint Set Union
export function runKruskal(graph: GraphData): GraphSnapshot[] {
  const snapshots: GraphSnapshot[] = [];
  const nodeIds = graph.nodes.map((n) => n.id);
  const dsu = new DisjointSetUnion(nodeIds);

  // Sort edges ascending by weight
  const sortedEdges = [...graph.edges]
    .map((e) => ({ ...e, weight: e.weight ?? 1 }))
    .sort((a, b) => a.weight - b.weight);

  const mstEdges: string[] = [];
  const rejectedEdges: string[] = [];
  let totalWeight = 0;

  snapshots.push({
    activeNode: null,
    activeEdge: null,
    visitedNodes: [],
    frontierNodes: [],
    traversalOrder: [],
    mstEdges: [],
    rejectedEdges: [],
    totalMstWeight: 0,
    dsuSets: dsu.getSnapshot(nodeIds),
    candidateEdges: sortedEdges.map((e) => ({ id: e.id, source: e.source, target: e.target, weight: e.weight })),
    description: `Kruskal's Algorithm initialized. Sorted ${sortedEdges.length} edges by weight ascending. Each node starts in its own disjoint set.`,
  });

  for (const edge of sortedEdges) {
    const rootU = dsu.find(edge.source);
    const rootV = dsu.find(edge.target);

    snapshots.push({
      activeNode: null,
      activeEdge: edge.id,
      visitedNodes: Array.from(new Set(mstEdges.flatMap((id) => {
        const e = graph.edges.find((x) => x.id === id);
        return e ? [e.source, e.target] : [];
      }))),
      frontierNodes: [],
      traversalOrder: [],
      mstEdges: [...mstEdges],
      rejectedEdges: [...rejectedEdges],
      totalMstWeight: totalWeight,
      dsuSets: dsu.getSnapshot(nodeIds),
      candidateEdges: sortedEdges.map((e) => ({ id: e.id, source: e.source, target: e.target, weight: e.weight })),
      description: `Inspecting edge (${edge.source} - ${edge.target}, weight: ${edge.weight}). find(${edge.source}) = ${rootU}, find(${edge.target}) = ${rootV}.`,
    });

    if (rootU !== rootV) {
      dsu.union(edge.source, edge.target);
      mstEdges.push(edge.id);
      totalWeight += edge.weight;

      snapshots.push({
        activeNode: null,
        activeEdge: edge.id,
        visitedNodes: Array.from(new Set(mstEdges.flatMap((id) => {
          const e = graph.edges.find((x) => x.id === id);
          return e ? [e.source, e.target] : [];
        }))),
        frontierNodes: [],
        traversalOrder: [],
        mstEdges: [...mstEdges],
        rejectedEdges: [...rejectedEdges],
        totalMstWeight: totalWeight,
        dsuSets: dsu.getSnapshot(nodeIds),
        candidateEdges: sortedEdges.map((e) => ({ id: e.id, source: e.source, target: e.target, weight: e.weight })),
        description: `Different components (${rootU} != ${rootV}). Union sets: Edge (${edge.source} - ${edge.target}) accepted into MST. New total weight = ${totalWeight}.`,
      });
    } else {
      rejectedEdges.push(edge.id);
      snapshots.push({
        activeNode: null,
        activeEdge: edge.id,
        visitedNodes: Array.from(new Set(mstEdges.flatMap((id) => {
          const e = graph.edges.find((x) => x.id === id);
          return e ? [e.source, e.target] : [];
        }))),
        frontierNodes: [],
        traversalOrder: [],
        mstEdges: [...mstEdges],
        rejectedEdges: [...rejectedEdges],
        totalMstWeight: totalWeight,
        dsuSets: dsu.getSnapshot(nodeIds),
        candidateEdges: sortedEdges.map((e) => ({ id: e.id, source: e.source, target: e.target, weight: e.weight })),
        description: `Cycle detected: ${edge.source} and ${edge.target} already share root ${rootU}. Edge rejected to preserve tree property.`,
      });
    }

    if (mstEdges.length === graph.nodes.length - 1) {
      break;
    }
  }

  snapshots.push({
    activeNode: null,
    activeEdge: null,
    visitedNodes: graph.nodes.map((n) => n.id),
    frontierNodes: [],
    traversalOrder: [],
    mstEdges: [...mstEdges],
    rejectedEdges: [...rejectedEdges],
    totalMstWeight: totalWeight,
    dsuSets: dsu.getSnapshot(nodeIds),
    description: `Kruskal's MST complete. Selected ${mstEdges.length} edges spanning ${graph.nodes.length} nodes with optimal minimum weight ${totalWeight}.`,
  });

  return snapshots;
}

// Prim's Minimum Spanning Tree with Cut-Edge Priority Selection
export function runPrim(graph: GraphData, startNodeId: string): GraphSnapshot[] {
  const snapshots: GraphSnapshot[] = [];
  const inTree = new Set<string>([startNodeId]);
  const mstEdges: string[] = [];
  let totalWeight = 0;

  // Build undirected adjacency list with edge metadata
  interface EdgeRef {
    id: string;
    u: string;
    v: string;
    weight: number;
  }
  const adj = new Map<string, EdgeRef[]>();
  for (const n of graph.nodes) {
    adj.set(n.id, []);
  }
  for (const e of graph.edges) {
    const w = e.weight ?? 1;
    adj.get(e.source)?.push({ id: e.id, u: e.source, v: e.target, weight: w });
    adj.get(e.target)?.push({ id: e.id, u: e.target, v: e.source, weight: w });
  }

  snapshots.push({
    activeNode: startNodeId,
    activeEdge: null,
    visitedNodes: [startNodeId],
    frontierNodes: [],
    traversalOrder: [startNodeId],
    mstEdges: [],
    totalMstWeight: 0,
    candidateEdges: (adj.get(startNodeId) || []).map((e) => ({ id: e.id, source: e.u, target: e.v, weight: e.weight })),
    description: `Prim's Algorithm initialized at seed root ${startNodeId}. Added incident edges to the cut frontier.`,
  });

  while (inTree.size < graph.nodes.length) {
    // Find candidate cut edges: one endpoint in tree, other endpoint outside
    const cutEdges: EdgeRef[] = [];
    for (const u of inTree) {
      const neighbors = adj.get(u) || [];
      for (const edge of neighbors) {
        if (!inTree.has(edge.v)) {
          cutEdges.push(edge);
        }
      }
    }

    if (cutEdges.length === 0) {
      // Graph is disconnected
      break;
    }

    // Sort cut edges by weight ascending
    cutEdges.sort((a, b) => a.weight - b.weight);
    const minEdge = cutEdges[0];

    snapshots.push({
      activeNode: minEdge.v,
      activeEdge: minEdge.id,
      visitedNodes: Array.from(inTree),
      frontierNodes: cutEdges.map((e) => e.v),
      traversalOrder: Array.from(inTree),
      mstEdges: [...mstEdges],
      totalMstWeight: totalWeight,
      candidateEdges: cutEdges.map((e) => ({ id: e.id, source: e.u, target: e.v, weight: e.weight })),
      description: `Inspecting cut frontier (${cutEdges.length} available edges). Greedy choice: edge (${minEdge.u} - ${minEdge.v}) with min weight ${minEdge.weight}.`,
    });

    inTree.add(minEdge.v);
    mstEdges.push(minEdge.id);
    totalWeight += minEdge.weight;

    snapshots.push({
      activeNode: minEdge.v,
      activeEdge: minEdge.id,
      visitedNodes: Array.from(inTree),
      frontierNodes: [],
      traversalOrder: Array.from(inTree),
      mstEdges: [...mstEdges],
      totalMstWeight: totalWeight,
      candidateEdges: [],
      description: `Added node ${minEdge.v} and edge (${minEdge.u} - ${minEdge.v}) to MST. Current cumulative weight: ${totalWeight}.`,
    });
  }

  snapshots.push({
    activeNode: null,
    activeEdge: null,
    visitedNodes: Array.from(inTree),
    frontierNodes: [],
    traversalOrder: Array.from(inTree),
    mstEdges: [...mstEdges],
    totalMstWeight: totalWeight,
    candidateEdges: [],
    description: `Prim's MST complete. Spanned ${inTree.size} nodes using ${mstEdges.length} edges with total weight ${totalWeight}.`,
  });

  return snapshots;
}

// Bellman-Ford Shortest Paths and Negative Cycle Detection
export function runBellmanFord(graph: GraphData, startNodeId: string): GraphSnapshot[] {
  const snapshots: GraphSnapshot[] = [];
  const V = graph.nodes.length;
  const distances: Record<string, number> = {};
  const predecessors: Record<string, string | null> = {};

  for (const node of graph.nodes) {
    distances[node.id] = Infinity;
    predecessors[node.id] = null;
  }
  distances[startNodeId] = 0;

  const edges = graph.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    weight: e.weight ?? 1,
  }));

  const makeState = (
    pass: number,
    hasNegCycle: boolean,
    cycleNodes?: string[],
    activeEdge?: BellmanFordState['activeEdge']
  ): BellmanFordState => ({
    pass,
    maxPasses: V - 1,
    distances: { ...distances },
    predecessors: { ...predecessors },
    hasNegativeCycle: hasNegCycle,
    cycleNodes,
    activeEdge,
  });

  snapshots.push({
    activeNode: startNodeId,
    activeEdge: null,
    visitedNodes: [startNodeId],
    frontierNodes: [],
    traversalOrder: [startNodeId],
    description: `Bellman-Ford initialized. dist[${startNodeId}] = 0, all other nodes set to Infinity. Graph has |V|=${V} nodes, running up to ${V - 1} relaxation passes.`,
    bellmanFord: makeState(0, false),
  });

  let anyChange = true;
  for (let pass = 1; pass <= V - 1; pass++) {
    if (!anyChange) {
      snapshots.push({
        activeNode: null,
        activeEdge: null,
        visitedNodes: Object.keys(distances).filter((id) => distances[id] < Infinity),
        frontierNodes: [],
        traversalOrder: [],
        description: `Pass ${pass}: No edge relaxations occurred in previous round. Algorithm converged early.`,
        bellmanFord: makeState(pass, false),
      });
      break;
    }

    anyChange = false;
    for (const edge of edges) {
      const u = edge.source;
      const v = edge.target;
      const w = edge.weight;

      if (distances[u] !== Infinity && distances[u] + w < distances[v]) {
        const oldDist = distances[v];
        distances[v] = distances[u] + w;
        predecessors[v] = u;
        anyChange = true;

        snapshots.push({
          activeNode: v,
          activeEdge: edge.id,
          visitedNodes: Object.keys(distances).filter((id) => distances[id] < Infinity),
          frontierNodes: [],
          traversalOrder: [],
          description: `Pass ${pass}/${V - 1}: Relaxed edge (${u} -> ${v}, w=${w}). dist[${v}] updated: ${oldDist === Infinity ? 'Infinity' : oldDist} -> ${distances[v]}.`,
          bellmanFord: makeState(pass, false, undefined, {
            source: u,
            target: v,
            weight: w,
            relaxed: true,
          }),
        });
      }
    }
  }

  // Pass |V|: Negative cycle detection
  let negativeCycleDetected = false;
  let cycleNodes: string[] = [];

  for (const edge of edges) {
    const u = edge.source;
    const v = edge.target;
    const w = edge.weight;

    if (distances[u] !== Infinity && distances[u] + w < distances[v]) {
      negativeCycleDetected = true;

      // Trace cycle backwards through predecessors
      let curr: string | null = v;
      for (let i = 0; i < V; i++) {
        if (curr && predecessors[curr]) {
          curr = predecessors[curr];
        }
      }

      const cycleStart = curr;
      cycleNodes = [curr || v];
      curr = predecessors[curr || v];
      while (curr && curr !== cycleStart && cycleNodes.length <= V) {
        cycleNodes.push(curr);
        curr = predecessors[curr];
      }
      cycleNodes.reverse();

      snapshots.push({
        activeNode: v,
        activeEdge: edge.id,
        visitedNodes: Object.keys(distances).filter((id) => distances[id] < Infinity),
        frontierNodes: [],
        traversalOrder: [],
        description: `CRITICAL: Negative-weight cycle detected on edge (${u} -> ${v})! Relaxation condition dist[${u}] + (${w}) < dist[${v}] holds during Pass ${V}. Shortest path is undefined.`,
        bellmanFord: makeState(V, true, cycleNodes, {
          source: u,
          target: v,
          weight: w,
          relaxed: true,
        }),
      });
      break;
    }
  }

  if (!negativeCycleDetected) {
    snapshots.push({
      activeNode: null,
      activeEdge: null,
      visitedNodes: Object.keys(distances).filter((id) => distances[id] < Infinity),
      frontierNodes: [],
      traversalOrder: [],
      description: `Bellman-Ford execution verified. Zero negative cycles detected. All ${V} node distances represent proven shortest paths from root ${startNodeId}.`,
      bellmanFord: makeState(V, false),
    });
  }

  return snapshots;
}
