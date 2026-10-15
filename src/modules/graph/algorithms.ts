import type { GraphData, TraversalAlgorithmKey, TraversalSnapshot } from '../../types/graph';

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
        { id: 'e1', source: 'A', target: 'B' },
        { id: 'e2', source: 'A', target: 'C' },
        { id: 'e3', source: 'B', target: 'D' },
        { id: 'e4', source: 'C', target: 'E' },
        { id: 'e5', source: 'D', target: 'F' },
        { id: 'e6', source: 'E', target: 'F' },
        { id: 'e7', source: 'B', target: 'E' },
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
        { id: 'e1', source: '1', target: '2' },
        { id: 'e2', source: '1', target: '3' },
        { id: 'e3', source: '2', target: '4' },
        { id: 'e4', source: '2', target: '5' },
        { id: 'e5', source: '3', target: '6' },
        { id: 'e6', source: '3', target: '7' },
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
        { id: 'e1', source: 'N1', target: 'N2' },
        { id: 'e2', source: 'N2', target: 'N3' },
        { id: 'e3', source: 'N3', target: 'N4' },
        { id: 'e4', source: 'N4', target: 'N1' },
        { id: 'e5', source: 'N1', target: 'N5' },
        { id: 'e6', source: 'N5', target: 'N3' },
      ],
    },
  },
};

export function runGraphTraversal(
  algo: TraversalAlgorithmKey,
  graph: GraphData,
  startNodeId: string
): TraversalSnapshot[] {
  const snapshots: TraversalSnapshot[] = [];
  const visited: string[] = [];
  const traversalOrder: string[] = [];

  // Build adjacency list (undirected)
  const adj = new Map<string, string[]>();
  for (const n of graph.nodes) {
    adj.set(n.id, []);
  }
  for (const e of graph.edges) {
    adj.get(e.source)?.push(e.target);
    adj.get(e.target)?.push(e.source);
  }

  // Sort neighbors for deterministic traversal
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
        // Push reverse order so alphabetical order pops first
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
