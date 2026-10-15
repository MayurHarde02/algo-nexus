import { describe, it, expect } from 'vitest';
import { createEmptyGrid, runPathfinding } from './algorithms';

describe('Pathfinding Advanced Traversal Invariants', () => {
  it('Dijkstra and BFS yield identical path length on unweighted grid', () => {
    const grid = createEmptyGrid(8, 8);
    const start = { row: 1, col: 1 };
    const target = { row: 6, col: 6 };

    const bfsSnaps = runPathfinding('bfs', grid, start, target);
    const dijkstraSnaps = runPathfinding('dijkstra', grid, start, target);

    const bfsFinal = bfsSnaps[bfsSnaps.length - 1];
    const dijkstraFinal = dijkstraSnaps[dijkstraSnaps.length - 1];

    expect(bfsFinal.hasPath).toBe(true);
    expect(dijkstraFinal.hasPath).toBe(true);
    expect(bfsFinal.pathLength).toBe(dijkstraFinal.pathLength);
    // |6 - 1| + |6 - 1| = 10
    expect(bfsFinal.pathLength).toBe(10);
  });

  it('A* explores fewer or equal nodes than BFS to reach open target due to Manhattan heuristic', () => {
    const grid = createEmptyGrid(15, 15);
    const start = { row: 0, col: 0 };
    const target = { row: 14, col: 14 };

    const bfsSnaps = runPathfinding('bfs', grid, start, target);
    const astarSnaps = runPathfinding('astar', grid, start, target);

    const bfsVisited = bfsSnaps[bfsSnaps.length - 1].visitedCount;
    const astarVisited = astarSnaps[astarSnaps.length - 1].visitedCount;

    expect(astarVisited).toBeLessThanOrEqual(bfsVisited);
  });
});
